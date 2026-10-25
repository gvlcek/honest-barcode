import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Button, Linking, Text, View } from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

const ScannerScreen = () => {
    const [permission, requestPermission, getPermission] = useCameraPermissions();
    const [isRequesting, setIsRequesting] = useState(false);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isScreenFocused, setIsScreenFocused] = useState(false);
    const [isAppActive, setIsAppActive] = useState(AppState.currentState === "active");
    const didAutoRequest = useRef(false);
    const requestInFlight = useRef(false);

    useFocusEffect(useCallback(() => {
        setIsScreenFocused(true);
        return () => setIsScreenFocused(false);
    }, []));

    const askForPermission = useCallback(async () => {
        if (requestInFlight.current) return;

        requestInFlight.current = true;
        setIsRequesting(true);
        setPermissionError(null);

        try {
            await requestPermission();
        } catch {
            setPermissionError("Unable to request camera access. Please try again.");
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
                    setPermissionError("Unable to check camera access. Please reopen the scanner.");
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
            setPermissionError("Unable to open Settings. Please enable camera access manually.");
        }
    };

    return (
        <>
        <Stack.Screen
            options={{
            headerRight: () => (
                <Button title="Close" onPress={() => router.back()} />
            ),
            }}
        />
        <View className={permission?.granted && !cameraError
            ? "scanner-preview-screen"
            : "scanner-permission-screen"}>
            {!permission || isRequesting ? (
                <>
                    <ActivityIndicator />
                    <Text className="scanner-permission-message">Checking camera access...</Text>
                </>
            ) : permission.granted ? (
                cameraError ? (
                    <Text className="scanner-permission-error" accessibilityRole="alert">
                        {cameraError}
                    </Text>
                ) : isScreenFocused && isAppActive ? (
                    <CameraView
                        style={{ flex: 1 }}
                        facing="back"
                        onMountError={() => {
                            setCameraError("Unable to start the camera. Please close the scanner and try again on a physical device.");
                        }}
                    />
                ) : null
            ) : (
                <>
                    <Text className="scanner-permission-title">Camera access needed</Text>
                    <Text className="scanner-permission-message">
                        HonestBarcode needs camera access to scan barcodes and QR codes.
                    </Text>
                    {permission.canAskAgain ? (
                        <Button title="Allow camera access" onPress={() => void askForPermission()} />
                    ) : (
                        <Button title="Open Settings" onPress={() => void openSettings()} />
                    )}
                </>
            )}
            {permissionError && (
                <Text className="scanner-permission-error" accessibilityRole="alert">
                    {permissionError}
                </Text>
            )}
        </View>
        </>
    )
}

export default ScannerScreen
