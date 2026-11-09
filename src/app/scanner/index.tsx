import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Button, Linking, Text, View } from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { File } from "expo-file-system";
import ScannerGuide from "@/components/ScannerGuide";
import type { BarcodeScanningResult } from "expo-camera";
import { ScanDraftContext } from "@/models/ScanDraftContext";
import { useTranslation } from "react-i18next";

const ScannerScreen = () => {
    const { t } = useTranslation();
    const { setThumbnail } = useContext(ScanDraftContext);
    const [permission, requestPermission, getPermission] = useCameraPermissions();
    const [isRequesting, setIsRequesting] = useState(false);
    const [permissionError, setPermissionError] = useState<
        "scanner.requestError" | "scanner.checkError" | "scanner.settingsError" | null
    >(null);
    const [cameraError, setCameraError] = useState(false);
    const [isScreenFocused, setIsScreenFocused] = useState(false);
    const [isAppActive, setIsAppActive] = useState(AppState.currentState === "active");
    const didAutoRequest = useRef(false);
    const requestInFlight = useRef(false);
    const hasScanned = useRef(false);
    const camera = useRef<CameraView | null>(null);
    const cameraReady = useRef(false);
    const scanSession = useRef(0);

    const attachCamera = useCallback((view: CameraView | null) => {
        camera.current = view;
        cameraReady.current = false;
    }, []);

    useFocusEffect(useCallback(() => {
        // A new reading session begins when returning from the draft detail.
        hasScanned.current = false;
        setIsScreenFocused(true);
        return () => {
            scanSession.current += 1;
            hasScanned.current = true;
            setIsScreenFocused(false);
        };
    }, []));

    const askForPermission = useCallback(async () => {
        if (requestInFlight.current) return;

        requestInFlight.current = true;
        setIsRequesting(true);
        setPermissionError(null);

        try {
            await requestPermission();
        } catch {
            setPermissionError("scanner.requestError");
        } finally {
            requestInFlight.current = false;
            setIsRequesting(false);
        }
    }, [requestPermission]);

    useEffect(() => {
        if (
            permission?.status === "undetermined" &&
            permission.canAskAgain &&
            !didAutoRequest.current
        ) {
            didAutoRequest.current = true;
            void askForPermission();
        }
    }, [permission, askForPermission]);

    useEffect(() => {
        let previousState = AppState.currentState;
        const subscription = AppState.addEventListener("change", (nextState) => {
            setIsAppActive(nextState === "active");
            // Refresh after returning from Settings without prompting again.
            if (previousState === "background" && nextState === "active") {
                void getPermission().catch(() => {
                    setPermissionError("scanner.checkError");
                });
            }
            previousState = nextState;
        });

        return () => subscription.remove();
    }, [getPermission]);

    const openSettings = async () => {
        try {
            await Linking.openSettings();
        } catch {
            setPermissionError("scanner.settingsError");
        }
    };

    const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
        const view = camera.current;
        if (hasScanned.current || !isScreenFocused || !isAppActive || !view || !cameraReady.current) return;

        hasScanned.current = true;
        const session = scanSession.current;
        const scanId = new Date().toISOString();
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
            // Haptic feedback is optional and must not interrupt a scan.
        });

        let base64: string | undefined;
        try {
            const photo = await view.takePictureAsync({ pictureRef: true });
            if (session !== scanSession.current) return;

            const cropSize = Math.min(photo.width, photo.height);
            const thumbnail = await ImageManipulator.manipulate(photo)
                .crop({
                    originX: Math.floor((photo.width - cropSize) / 2),
                    originY: Math.floor((photo.height - cropSize) / 2),
                    width: cropSize,
                    height: cropSize,
                })
                .resize({ width: 800, height: 800 })
                .renderAsync();
            const jpeg = await thumbnail.saveAsync({ format: SaveFormat.JPEG, compress: 0.8, base64: true });
            base64 = jpeg.base64;
            new File(jpeg.uri).delete();
        } catch {
            // The barcode remains usable if the photo or cache cleanup fails.
        }

        if (session !== scanSession.current) return;
        if (AppState.currentState !== "active") {
            hasScanned.current = false;
            return;
        }

        setThumbnail(base64 ? { scanId, base64 } : null);
        router.push({
            pathname: "/scanner/scan/[scanId]",
            params: {
                scanId,
                value: result.data,
                barcodeType: result.type,
            },
        });
    };

    return (
        <>
        <Stack.Screen
            options={{
            headerBackVisible: false,
            headerRight: () => (
                <Button title={t("common.close")} onPress={() => router.back()} />
            ),
            }}
        />
        <View className={permission?.granted && !cameraError
            ? "scanner-preview-screen"
            : "scanner-permission-screen"}>
            {!permission || isRequesting ? (
                <>
                    <ActivityIndicator accessibilityLabel={t("scanner.checkingAccessLabel")} />
                    <Text className="scanner-permission-message">{t("scanner.checkingAccess")}</Text>
                </>
            ) : permission.granted ? (
                cameraError ? (
                    <Text className="scanner-permission-error" accessibilityRole="alert">
                        {t("scanner.cameraError")}
                    </Text>
                ) : isScreenFocused && isAppActive ? (
                    <>
                    <CameraView
                        ref={attachCamera}
                        style={{ flex: 1 }}
                        facing="back"
                        onCameraReady={() => { cameraReady.current = true; }}
                        onBarcodeScanned={(result) => { void handleBarcodeScanned(result); }}
                        onMountError={() => {
                            setCameraError(true);
                        }}
                    />
                    <ScannerGuide />
                    </>
                ) : null
            ) : (
                <>
                    <Text className="scanner-permission-title">{t("scanner.permissionTitle")}</Text>
                    <Text className="scanner-permission-message">
                        {t("scanner.permissionMessage")}
                    </Text>
                    {permission.canAskAgain ? (
                        <Button title={t("scanner.allowAccess")} onPress={() => void askForPermission()} />
                    ) : (
                        <Button title={t("scanner.openSettings")} onPress={() => void openSettings()} />
                    )}
                </>
            )}
            {permissionError && (
                <Text className="scanner-permission-error" accessibilityRole="alert">
                    {t(permissionError)}
                </Text>
            )}
        </View>
        </>
    )
}

export default ScannerScreen
