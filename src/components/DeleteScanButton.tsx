import { useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface DeleteScanButtonProps {
  onDelete: () => Promise<void>;
}

export default function DeleteScanButton({ onDelete }: DeleteScanButtonProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(false);
  const deleteInFlight = useRef(false);

  const performDelete = async () => {
    setIsDeleting(true);
    setError(false);
    try {
      await onDelete();
    } catch {
      setError(true);
    } finally {
      deleteInFlight.current = false;
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (deleteInFlight.current) return;
    deleteInFlight.current = true;

    Alert.alert(
      t("detail.deleteTitle"),
      t("detail.deleteMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: () => { deleteInFlight.current = false; },
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => { void performDelete(); },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View className="gap-3">
      {error && (
        <Text accessibilityRole="alert" className="scanner-permission-error">
          {t("detail.deleteError")}
        </Text>
      )}
      <Pressable
        className="scan-delete-button"
        accessibilityRole="button"
        accessibilityState={{ disabled: isDeleting, busy: isDeleting }}
        disabled={isDeleting}
        onPress={confirmDelete}
        style={({ pressed }) => ({ opacity: isDeleting ? 0.6 : pressed ? 0.75 : 1 })}
      >
        <Text className="scan-delete-button-label">
          {isDeleting ? t("common.deleting") : t("common.delete")}
        </Text>
      </Pressable>
    </View>
  );
}
