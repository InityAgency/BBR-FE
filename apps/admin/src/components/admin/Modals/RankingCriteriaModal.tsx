"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RankingCriteriaForm from "@/components/admin/RankingCriteria/RankingCriteriaForm";
import { RankingCriteriaData } from "@/app/schemas/ranking-criteria";

interface EditRankingCriteriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rankingCriteria: RankingCriteriaData;
  onSuccess: () => void;
}

export function EditRankingCriteriaModal({
  open,
  onOpenChange,
  rankingCriteria,
  onSuccess,
}: EditRankingCriteriaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ranking Criteria</DialogTitle>
        </DialogHeader>
        <RankingCriteriaForm
          initialData={rankingCriteria}
          isEditing={true}
          onSubmitSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}