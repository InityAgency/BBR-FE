import { Suspense } from "react";
import AdminLayout from "../../../../AdminLayout";
import RankingCategoryForm from "@/components/admin/RankingCategory/Forms/RankingCategoryForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RankingCategorySkeleton } from "@/components/admin/RankingCategories/Skeleton/RankingCategorySkeleton";
import { SingleRankingCategoryApiResponse } from "@/app/types/models/RankingCategory";
import { apiToFormRankingCategory } from "@/lib/utils/formMapping";
import { CriteriaWeight } from "@/components/admin/RankingCategory/Forms/RankingCriteriaWeights";

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
    params: Promise<{ id: string }>; 
}) {
    const { id } = await params; 
    const { rankingCategory, error } = await getRankingCategory(id);

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

    // Koristimo postojeću apiToFormRankingCategory funkciju za mapiranje
    const formData = apiToFormRankingCategory(rankingCategory);

    // Map existing criteria weights to the format expected by RankingCriteriaWeights
    const existingCriteriaWeights: CriteriaWeight[] = (rankingCategory.rankingCriteria || []).map((criteria: { id: any; weight: any; name: any; }) => ({
        rankingCriteriaId: criteria.id,
        weight: criteria.weight,
        name: criteria.name,
    }));

    // Add criteria weights to form data
    const formDataWithCriteria = {
        ...formData,
        criteriaWeights: existingCriteriaWeights,
    };

    return (
        <AdminLayout>
            <Suspense fallback={<RankingCategorySkeleton />}>
                <RankingCriteriaFormWithData 
                    initialData={formDataWithCriteria}
                    isEditing={true} 
                />
            </Suspense>
        </AdminLayout>
    );
}

// Wrapper component to handle the criteria weights initialization
function RankingCriteriaFormWithData({ 
    initialData, 
    isEditing 
}: { 
    initialData: any;
    isEditing: boolean;
}) {
    return (
        <RankingCategoryForm 
            initialData={initialData}
            isEditing={isEditing}
            initialCriteriaWeights={initialData.criteriaWeights || []}
        />
    );
}