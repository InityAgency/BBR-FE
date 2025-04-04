import AdminLayout from "@/app/(admin)/AdminLayout";
import RankingCategoryForm from "@/components/admin/RankingCategory/Forms/RankingCategoryForm";

export default function RankingCategoriesCreate() {
    return (
        <AdminLayout>
            <RankingCategoryForm />
        </AdminLayout>
    );
}