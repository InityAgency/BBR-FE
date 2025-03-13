// components/admin/Headers/FormHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface FormHeaderProps {
  title: string;
  onSave?: () => void;
  onDiscard?: () => void;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  discardButtonText?: string;
  isSubmitting?: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  title, 
  onSave, 
  onDiscard, 
  saveButtonText = "Save",
  saveButtonDisabled = false,
  discardButtonText = "Discard",
  isSubmitting = false,
}) => {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default FormHeader;