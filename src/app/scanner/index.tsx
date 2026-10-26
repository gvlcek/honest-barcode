import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Button, Linking, Text, View } from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import ScannerGuide from "@/components/ScannerGuide";
import type { BarcodeScanningResult } from "expo-camera";
import type { Scan } from "@/models/Scan";
import { useTranslation } from "react-i18next";

const ScannerScreen = () => {
    const { t } = useTranslation();
    const [permission, requestPermission, getPermission] = useCameraPermissions();
    const [isRequesting, setIsRequesting] = useState(false);
    const [permissionError, setPermissionError] = useState<
        "scanner.requestError" | "scanner.checkError" | "scanner.settingsError" | null
    >(null);
    const [cameraError, setCameraError] = useState(false);
    const [isScreenFocused, setIsScreenFocused] = useState(false);
    const [isScanPaused, setIsScanPaused] = useState(false);
    const [isAppActive, setIsAppActive] = useState(AppState.currentState === "active");
    const didAutoRequest = useRef(false);
    const requestInFlight = useRef(false);
    const hasScanned = useRef(false);

    useFocusEffect(useCallback(() => {
        // A new reading session begins when returning from the draft detail.
        hasScanned.current = false;
        setIsScanPaused(false);
        setIsScreenFocused(true);
        return () => {
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

    const handleBarcodeScanned = (result: BarcodeScanningResult) => {
        if (hasScanned.current || !isScreenFocused || !isAppActive) return;

        hasScanned.current = true;
        setIsScanPaused(true);

        const scan: Scan = {
            value: result.data,
            type: result.type,
            scannedAt: new Date(),
        };

        router.push({
            pathname: "/scanner/scan/[scanId]",
            params: {
                scanId: scan.scannedAt.toISOString(),
                value: scan.value,
                barcodeType: scan.type,
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
                        style={{ flex: 1 }}
                        facing="back"
                        onBarcodeScanned={isScanPaused ? undefined : handleBarcodeScanned}
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
