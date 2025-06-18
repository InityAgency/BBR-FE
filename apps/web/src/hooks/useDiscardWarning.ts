import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseDiscardWarningProps {
  hasUnsavedChanges: boolean;
  onDiscard?: () => void;
}

interface UseDiscardWarningReturn {
  showDiscardModal: boolean;
  handleConfirmDiscard: () => void;
  handleCancelDiscard: () => void;
  navigateTo: (path: string) => void;
}

export const useDiscardWarning = ({
  hasUnsavedChanges,
  onDiscard,
}: UseDiscardWarningProps): UseDiscardWarningReturn => {
  const router = useRouter();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const handleConfirmDiscard = useCallback(() => {
    setShowDiscardModal(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    onDiscard?.();
  }, [pendingNavigation, router, onDiscard]);

  const handleCancelDiscard = useCallback(() => {
    setShowDiscardModal(false);
    setPendingNavigation(null);
  }, []);

  const navigateTo = useCallback(
    (path: string) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(path);
        setShowDiscardModal(true);
      } else {
        router.push(path);
      }
    },
    [hasUnsavedChanges, router]
  );

  return {
    showDiscardModal,
    handleConfirmDiscard,
    handleCancelDiscard,
    navigateTo,
  };
}; 