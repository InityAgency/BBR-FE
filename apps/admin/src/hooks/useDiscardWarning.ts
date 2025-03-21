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
      // Only show the warning modal if there are unsaved changes
      if (hasUnsavedChanges) {
        console.log('useDiscardWarning: Detected unsaved changes, showing modal');
        // Store the URL they want to navigate to
        setPendingUrl(url);
        setShowDiscardModal(true);
        return false; // Prevent navigation until confirmed
      }
      
      console.log('useDiscardWarning: No unsaved changes, navigating directly');
      // If no unsaved changes, allow navigation immediately
      return true;
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
      setPendingUrl(null); // Clear pending URL after navigation
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
      console.log('navigateTo called with URL:', url, 'hasUnsavedChanges:', hasUnsavedChanges);
      // Only check for unsaved changes if there are any
      if (hasUnsavedChanges) {
        handleNavigation(url);
      } else {
        // If no unsaved changes, navigate directly
        console.log('No unsaved changes, navigating directly to:', url);
        router.push(url);
      }
    },
    [hasUnsavedChanges, handleNavigation, router]
  );

  return {
    showDiscardModal,
    handleConfirmDiscard,
    handleCancelDiscard,
    navigateTo,
  };
};