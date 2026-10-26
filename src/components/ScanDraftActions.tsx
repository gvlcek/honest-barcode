import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface ScanDraftActionsProps {
  onSave: () => Promise<void>;
  onDiscard: () => void;
}

export default function ScanDraftActions({ onSave, onDiscard }: ScanDraftActionsProps) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const saveInFlight = useRef(false);

  const handleSave = async () => {
    if (saveInFlight.current) return;

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
        accessibilityState={{ disabled: isSaving, busy: isSaving }}
        disabled={isSaving}
        onPress={handleSave}
        style={({ pressed }) => ({ opacity: isSaving ? 0.6 : pressed ? 0.75 : 1 })}
      >
        <Text className="scan-save-button-label">
          {isSaving ? t("common.saving") : t("common.save")}
        </Text>
      </Pressable>
      <Pressable
        className="scan-discard-button"
        accessibilityRole="button"
        accessibilityState={{ disabled: isSaving }}
        disabled={isSaving}
        onPress={() => {
          if (!saveInFlight.current) onDiscard();
        }}
        style={({ pressed }) => ({ opacity: isSaving ? 0.6 : pressed ? 0.75 : 1 })}
      >
        <Text className="scan-discard-button-label">{t("common.discard")}</Text>
      </Pressable>
    </View>
  );
}
