"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseDiscardWarningOptions {
  hasUnsavedChanges: boolean;
  onDiscard?: () => void;
  onCancel?: () => void;
}

export const useDiscardWarning = ({
  hasUnsavedChanges,
  onDiscard,
  onCancel,
}: UseDiscardWarningOptions) => {
  const router = useRouter();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Function to call when user tries to navigate away
  const handleNavigation = useCallback(
    (url: string) => {
      if (hasUnsavedChanges) {
        // Store the URL they want to navigate to
        setPendingUrl(url);
        setShowDiscardModal(true);
        return false; // Prevent navigation
      }
      return true; // Allow navigation
    },
    [hasUnsavedChanges]
  );

  // When user confirms discard, navigate to the pending URL
  const handleConfirmDiscard = useCallback(() => {
    setShowDiscardModal(false);
    
    if (onDiscard) {
      onDiscard();
    }
    
    // Navigate to the pending URL if it exists
    if (pendingUrl) {
      router.push(pendingUrl);
    }
  }, [pendingUrl, router, onDiscard]);

  // When user cancels discard
  const handleCancelDiscard = useCallback(() => {
    setShowDiscardModal(false);
    setPendingUrl(null);
    
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Custom navigation function that checks for unsaved changes
  const navigateTo = useCallback(
    (url: string) => {
      if (handleNavigation(url)) {
        router.push(url);
      }
    },
    [handleNavigation, router]
  );

  return {
    showDiscardModal,
    handleConfirmDiscard,
    handleCancelDiscard,
    navigateTo,
  };
};