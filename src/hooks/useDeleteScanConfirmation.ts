import { useRef, useState } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

export function useDeleteScanConfirmation(onDelete: () => Promise<void>) {
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

  return { confirmDelete, isDeleting, error };
}
