import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
}

const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({ hasUnsavedChanges }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const closestLink = target.closest('a');
        
        if (closestLink && !closestLink.getAttribute('data-ignore-unsaved')) {
          e.preventDefault();
          if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
            router.push(closestLink.href);
          }
        }
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [hasUnsavedChanges, router]);

  return null;
};

export default UnsavedChangesWarning; 