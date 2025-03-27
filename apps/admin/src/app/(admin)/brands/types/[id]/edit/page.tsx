import { Suspense } from "react";
import AdminLayout from "../../../../AdminLayout";
import { BrandTypeForm } from "@/components/admin/BrandTypes/Forms/BrandTypeForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { BrandType } from "@/app/types/models/BrandType";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BrandTypeSkeleton } from "@/components/admin/BrandTypes/Skeletons/BrandTypeSkeleton";

async function getBrandType(id: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/${API_VERSION}/brand-types/${id}`,
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
      throw new Error(errorData.message || "Failed to fetch brand type");
    }

    const data = await response.json();
    return { brandType: data.data, error: null };
  } catch (err: any) {
    console.error("Error fetching brand type:", err);
    return { brandType: null, error: err.message || "Failed to fetch brand type" };
  }
}

export default async function EditBrandTypePage({
  params,
}: {
  params: { id: string };
}) {
  const { brandType, error } = await getBrandType(params.id);

  if (error || !brandType) {
    return (
      <AdminLayout>
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Failed to load brand type"}</AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Suspense fallback={<BrandTypeSkeleton />}>
        <BrandTypeForm initialData={brandType} isEdit={true} />
      </Suspense>
    </AdminLayout>
  );
}

