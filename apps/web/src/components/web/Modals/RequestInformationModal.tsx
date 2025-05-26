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
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface RequestInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formClassName?: string;
  showFormTitle?: boolean;
  customFormTitle?: string;
  entityId?: string;
  type?: "CONSULTATION" | "MORE_INFORMATION" | "CONTACT_US";
  buttonText?: string;
  customTitle?: string;
}

export function RequestInformationModal({
  isOpen,
  onClose,
  formClassName,
  showFormTitle,
  customFormTitle,
  entityId,
  type = "MORE_INFORMATION",
  buttonText,
  customTitle = "Would you like to know more about this property?"
}: RequestInformationModalProps) {
  const form = useForm();

  useEffect(() => {
    if (entityId) {
      form.setValue("entityId", entityId);
    }
  }, [entityId, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="p-4 lg:p-8 min-w-[100svw] lg:min-w-[50vw] xl:min-w-[40vw] max-h-[100svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl lg:text-4xl font-medium text-left lg:text-left mx-auto me-2">
            {customTitle}
          </DialogTitle>
          <RequestConsultationForm 
            className="border-none single-residence-request-form mt-4"
            showTitle={false}
            entityId={entityId}  
            type={type}
            buttonText={buttonText}
            onSuccess={onClose}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 