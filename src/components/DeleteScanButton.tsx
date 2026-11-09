import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDeleteScanConfirmation } from "@/hooks/useDeleteScanConfirmation";

interface DeleteScanButtonProps {
  onDelete: () => Promise<void>;
}

export default function DeleteScanButton({ onDelete }: DeleteScanButtonProps) {
  const { t } = useTranslation();
  const { confirmDelete, isDeleting, error } = useDeleteScanConfirmation(onDelete);

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
