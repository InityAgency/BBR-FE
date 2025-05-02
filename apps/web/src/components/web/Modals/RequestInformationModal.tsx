"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import RequestConsultationForm from "../Forms/RequestConsultation";

interface RequestInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formClassName?: string;
  showFormTitle?: boolean;
  customFormTitle?: string;
  entityId?: string;
  type?: "CONSULTATION" | "MORE_INFORMATION" | "CONTACT_US";
  buttonText?: string;
}

export function RequestInformationModal({
  isOpen,
  onClose,
  formClassName,
  showFormTitle,
  customFormTitle,
  entityId,
  type = "MORE_INFORMATION",
  buttonText
}: RequestInformationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium text-left lg:text-left mx-auto mt-4 mb-4">
            Would you like to know more about Four Seasons Private Residences in Miami?
          </DialogTitle>
          <RequestConsultationForm 
            className="border-none single-residence-request-form mt-4"
            showTitle={false}
            entityId={entityId}  
            type={type}
            buttonText={buttonText} 
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 