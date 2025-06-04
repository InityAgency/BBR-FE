import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import ClaimRequestForm from "../Forms/ClaimRequestForm";

interface ClaimRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  residenceId: string;
}

export function ClaimRequestModal({ isOpen, onClose, residenceId }: ClaimRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 lg:p-8 min-w-[100svw] lg:min-w-[50vw] xl:min-w-[40vw] max-h-[100svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl lg:text-4xl font-medium text-left lg:text-left">
            Verification Required
          </DialogTitle>
          <p className="text-md text-muted-foreground">
            Your email doesn't match the company domain, or the website link is incorrect. Please provide the necessary information and supporting documents to verify ownership.
          </p>
          <ClaimRequestForm onSuccess={onClose} residenceId={residenceId} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}