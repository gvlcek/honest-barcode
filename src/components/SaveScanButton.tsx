import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface SaveScanButtonProps {
  onSave?: () => Promise<void>;
}

export default function SaveScanButton({ onSave }: SaveScanButtonProps) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const saveInFlight = useRef(false);
  const isDisabled = !onSave || isSaving;

  const handleSave = async () => {
    if (!onSave || saveInFlight.current) return;

    saveInFlight.current = true;
    setIsSaving(true);
    setError(false);

    try {
      await onSave();
    } catch {
      setError(true);
    } finally {
      saveInFlight.current = false;
      setIsSaving(false);
    }
  };

  return (
    <View className="gap-3">
      {error && (
        <Text accessibilityRole="alert" className="scanner-permission-error">
          {t("detail.saveError")}
        </Text>
      )}
      <Pressable
        className="scan-save-button"
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: isSaving }}
        disabled={isDisabled}
        onPress={handleSave}
      >
        <Text className="scan-save-button-label">
          {isSaving ? t("common.saving") : t("common.save")}
        </Text>
      </Pressable>
    </View>
  );
}
