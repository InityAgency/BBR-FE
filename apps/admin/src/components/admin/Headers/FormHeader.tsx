// components/admin/Headers/FormHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormHeaderProps {
  title: string;
  titleContent?: React.ReactNode;
  titleActions?: React.ReactNode;
  onSave?: () => void;
  onDiscard?: () => void;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  discardButtonText?: string;
  isSubmitting?: boolean;
  extraButtons?: React.ReactNode;
  customButtons?: React.ReactNode;
  hideDefaultButtons?: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  title, 
  titleContent,
  titleActions,
  onSave, 
  onDiscard, 
  saveButtonText = "Save",
  saveButtonDisabled = false,
  discardButtonText = "Discard",
  isSubmitting = false,
  extraButtons,
  customButtons,
  hideDefaultButtons = false,
}) => {
  // Debugging log
  console.log("FormHeader props:", { 
    title, 
    onSave: onSave instanceof Function, 
    onDiscard: onDiscard instanceof Function,
    saveButtonDisabled,
    isSubmitting
  });

  const handleSave = React.useCallback(() => {
    if (onSave instanceof Function) {
      onSave();
    }
  }, [onSave]);

  const handleDiscard = React.useCallback(() => {
    if (onDiscard instanceof Function) {
      onDiscard();
    }
  }, [onDiscard]);

  return (
    <div className="flex items-center justify-between pb-6 flex-wrap gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {titleContent && (
            <div className="flex items-center">
              {titleContent}
            </div>
          )}
          {titleActions && (
            <div className="flex items-center">
              {titleActions}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {extraButtons}
        {customButtons}
        {!hideDefaultButtons && (
          <>
            {onDiscard instanceof Function && (
              <Button 
                className="cursor-pointer transition-colors"
                variant="outline" 
                onClick={handleDiscard}
                disabled={isSubmitting}
                type="button"
              >
                {discardButtonText}
              </Button>
            )}
            {onSave instanceof Function && (
              <Button 
                className="cursor-pointer transition-colors"
                onClick={handleSave}
                disabled={saveButtonDisabled || isSubmitting}
                type="button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  saveButtonText
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FormHeader;