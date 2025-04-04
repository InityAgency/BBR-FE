import { Suspense } from "react";
import AdminLayout from "../../../../AdminLayout";
import { RankingCategoryTypeForm } from "@/components/admin/RankingCategoryTypes/Forms/RankingCategoryTypeForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { RankingCategoryType } from "@/app/types/models/RankingCategoryType";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RankingCategoryTypeSkeleton } from "@/components/admin/RankingCategoryTypes/Skeleton/RankingCategoryTypeSkeleton";

async function getRankingCategoryType(id: string) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/${API_VERSION}/ranking-category-types/${id}`,
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
            throw new Error(errorData.message || "Failed to fetch ranking category type");
        }

        const data = await response.json();
        return { rankingCategoryType: data.data, error: null };
    } catch (err: any) {
        console.error("Error fetching ranking category type:", err);
        return { rankingCategoryType: null, error: err.message || "Failed to fetch ranking category type" };
    }
}

export default async function EditRankingCategoryTypePage({
    params,
}: {
    params: { id: string };
}) {
    const { rankingCategoryType, error } = await getRankingCategoryType(params.id);

    if (error || !rankingCategoryType) {
        return (
            <AdminLayout>
                <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error || "Failed to load ranking category type"}</AlertDescription>
                    </Alert>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <Suspense fallback={<RankingCategoryTypeSkeleton />}>
                <RankingCategoryTypeForm initialData={rankingCategoryType} isEdit={true} />
            </Suspense>
        </AdminLayout>
    )
}
