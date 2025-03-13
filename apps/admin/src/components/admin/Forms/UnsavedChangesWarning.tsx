// components/admin/Forms/UnsavedChangesWarning.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
  message?: string;
}

/**
 * Component that adds a warning when the user tries to navigate away with unsaved changes
 * This uses the beforeunload event to warn users when they try to close the tab/window
 */
const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({
  hasUnsavedChanges,
  message = "You have unsaved changes. Are you sure you want to leave this page?",
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Handle browser window/tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Standard way to show a browser confirm when closing the tab
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  return null; // This component doesn't render anything
};

export default UnsavedChangesWarning;