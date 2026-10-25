import { useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

interface DeleteScanButtonProps {
  onDelete: () => Promise<void>;
}

export default function DeleteScanButton({ onDelete }: DeleteScanButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deleteInFlight = useRef(false);

  const performDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch {
      setError("Unable to delete this scan. Please try again.");
    } finally {
      deleteInFlight.current = false;
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (deleteInFlight.current) return;
    deleteInFlight.current = true;

    Alert.alert(
      "Delete scan?",
      "This scan will be permanently removed from your history.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => { deleteInFlight.current = false; },
        },
        {
          text: "Delete",
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
          {error}
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
          {isDeleting ? "Deleting…" : "Delete"}
        </Text>
      </Pressable>
    </View>
  );
}
