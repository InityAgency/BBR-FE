import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface FormHeaderProps {
  title: string;
  titleContent?: ReactNode;
  extraButtons?: ReactNode;
  onSave: () => void;
  onDiscard: () => void;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  isSubmitting?: boolean;
}

const UnitFormHeader: React.FC<FormHeaderProps> = ({
  title,
  titleContent,
  extraButtons,
  onSave,
  onDiscard,
  saveButtonText = "Save",
  saveButtonDisabled = false,
  isSubmitting = false,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold sm:text-2xl text-sans">{title}</h1>
        {titleContent}
      </div>
      <div className="flex items-center gap-2">
        {extraButtons}
        <Button variant="outline" onClick={onDiscard} disabled={isSubmitting}>
          Discard
        </Button>
        <Button onClick={onSave} disabled={saveButtonDisabled || isSubmitting}>
          {saveButtonText}
        </Button>
      </div>
    </div>
  );
};

export default UnitFormHeader; 