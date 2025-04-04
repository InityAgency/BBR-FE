import { Suspense } from "react";
import AdminLayout from "../../../../AdminLayout";
import RankingCategoryForm from "@/components/admin/RankingCategory/Forms/RankingCategoryForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RankingCategorySkeleton } from "@/components/admin/RankingCategories/Skeleton/RankingCategorySkeleton";
import { SingleRankingCategoryApiResponse } from "@/app/types/models/RankingCategory";
import { apiToFormRankingCategory } from "@/lib/utils/formMapping";

async function getRankingCategory(id: string) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${id}`,
            {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store"
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch ranking category");
        }

        const data = await response.json() as SingleRankingCategoryApiResponse;
        return { rankingCategory: data.data, error: null };
    } catch (err: any) {
        console.error("Error fetching ranking category:", err);
        return { rankingCategory: null, error: err.message || "Failed to fetch ranking category" };
    }
}

export default async function EditRankingCategoryPage({
    params,
}: {
    params: { id: string };
}) {
    const { rankingCategory, error } = await getRankingCategory(params.id);

    if (error || !rankingCategory) {
        return (
            <AdminLayout>
                <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error || "Failed to load ranking category"}</AlertDescription>
                    </Alert>
                </div>
            </AdminLayout>
        )
    }

    // Konvertuj API podatke u format koji očekuje forma
    const formData = apiToFormRankingCategory(rankingCategory);

    return (
        <AdminLayout>
            <Suspense fallback={<RankingCategorySkeleton />}>
                <RankingCategoryForm 
                    initialData={{
                        ...formData,
                        featuredImageId: formData.featuredImageId as string | undefined
                    }} 
                    isEditing={true} 
                />
            </Suspense>
        </AdminLayout>
    )
}