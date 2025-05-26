import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RankingCriteriaForm from "@/components/admin/RankingCriteria/RankingCriteriaForm";

interface CreateRankingCriteriaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateRankingCriteriaModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateRankingCriteriaModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Ranking Criteria</DialogTitle>
                </DialogHeader>
                <RankingCriteriaForm
                    isEditing={false}
                    onSubmitSuccess={() => {
                        onSuccess();
                        onOpenChange(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
} 