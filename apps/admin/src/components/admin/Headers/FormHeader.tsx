// components/admin/Headers/FormHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";

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
            {onDiscard && (
              <Button 
                className="cursor-pointer transition-colors"
                variant="outline" 
                onClick={onDiscard}
                disabled={isSubmitting}
              >
                {discardButtonText}
              </Button>
            )}
            {onSave && (
              <Button 
                className="cursor-pointer transition-colors"
                onClick={onSave}
                disabled={saveButtonDisabled || isSubmitting}
              >
                {isSubmitting ? "Saving..." : saveButtonText}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FormHeader;