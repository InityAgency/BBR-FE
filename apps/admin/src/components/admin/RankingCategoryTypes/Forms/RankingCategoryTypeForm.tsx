"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RankingCategoryType } from "@/app/types/models/RankingCategoryType";
import FormHeader from "@/components/admin/Headers/FormHeader";
import UnsavedChangesWarning from "../../Forms/UnsavedChangesWarning";
import DiscardModal from "@/components/admin/Modals/DiscardModal";
import { useDiscardWarning } from "@/hooks/useDiscardWarning";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Definisanje šeme za validaciju
export const rankingCategoryTypeSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export type RankingCategoryTypeFormValues = z.infer<typeof rankingCategoryTypeSchema>;

interface RankingCategoryTypeFormProps {
    initialData?: RankingCategoryType;
    isEdit?: boolean;
}

export function RankingCategoryTypeForm({ initialData, isEdit = false }: RankingCategoryTypeFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Inicijalizacija forme
    const form = useForm<RankingCategoryTypeFormValues>({
        resolver: zodResolver(rankingCategoryTypeSchema),
        defaultValues: {
            name: initialData?.name || "",
        },
    });

    // Check if form has unsaved changes
    const hasUnsavedChanges = form.formState.isDirty;

    // Setup discard warning hook
    const {
        showDiscardModal,
        handleConfirmDiscard,
        handleCancelDiscard,
        navigateTo,
    } = useDiscardWarning({
        hasUnsavedChanges,
        onDiscard: () => {
            router.push("/rankings/ranking-category-types");
        },
    });

    // Handler za submit forme
    const onSubmit = async (values: RankingCategoryTypeFormValues) => {
        setIsSubmitting(true);

        try {
            // Create payload with both name and description
            const payload: Record<string, any> = {
                name: values.name,
            };

            let url = `${API_BASE_URL}/api/${API_VERSION}/ranking-category-types`;
            let method = "POST";

            // Ako je edit mode, koristimo PUT metodu i dodajemo ID u URL
            if (isEdit && initialData?.id) {
                url = `${url}/${initialData.id}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to ${isEdit ? 'update' : 'create'} ranking category type`);
            }

            toast.success(`Ranking category type ${isEdit ? 'updated' : 'created'} successfully!`);
            router.push("/rankings/ranking-category-types");
            
        } catch (err: any) {
            toast.error(err.message || `An error occurred while ${isEdit ? 'updating' : 'creating'} the ranking category type`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDiscard = () => {
        if (hasUnsavedChanges) {
            handleConfirmDiscard();
        } else {
            router.push("/rankings/ranking-category-types");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-category-types/${initialData?.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ranking category type');
            }

            toast.success('Ranking category type deleted successfully');
            router.push("/rankings/ranking-category-types");
        } catch (error) {
            toast.error('Failed to delete ranking category type');
        } finally {
            setShowDeleteDialog(false);
        }
    };

    const deleteButton = isEdit ? (
        <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer transition-colors"
            type="button"
        >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
        </Button>
    ) : null;

    return (
        <>
            <FormHeader
                title={isEdit ? initialData?.name || "Edit Ranking Category Type" : "Add new ranking category type"}
                onSave={form.handleSubmit(onSubmit)}
                onDiscard={handleDiscard}
                saveButtonText={isEdit ? "Save changes" : "Add Ranking Category Type"}
                saveButtonDisabled={!form.formState.isValid || isSubmitting}
                isSubmitting={isSubmitting}
                extraButtons={deleteButton}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Information */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">General Information</h2>
                    <Form {...form}>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Form>
                </div>
            </div>

            {/* Discard Modal */}
            <DiscardModal
                isOpen={showDiscardModal}
                onClose={handleCancelDiscard}
                onConfirm={handleConfirmDiscard}
            />

            {/* Warning for unsaved changes */}
            <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this ranking category type?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. <strong className="text-red-400">This will permanently delete the ranking category type
                            and all rankings associated with this type.</strong> All related data will be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-destructive text-white hover:bg-destructive/80"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
