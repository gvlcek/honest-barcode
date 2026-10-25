import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

interface SaveScanButtonProps {
  onSave?: () => Promise<void>;
}

export default function SaveScanButton({ onSave }: SaveScanButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveInFlight = useRef(false);
  const isDisabled = !onSave || isSaving;

  const handleSave = async () => {
    if (!onSave || saveInFlight.current) return;

    saveInFlight.current = true;
    setIsSaving(true);
    setError(null);

    try {
      await onSave();
    } catch {
      setError("Unable to save this scan. Please try again.");
    } finally {
      saveInFlight.current = false;
      setIsSaving(false);
    }
  };

  return (
    <View className="gap-3">
      {error && (
        <Text accessibilityRole="alert" className="scanner-permission-error">
          {error}
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
          {isSaving ? "Saving…" : "Save"}
        </Text>
      </Pressable>
    </View>
  );
}
