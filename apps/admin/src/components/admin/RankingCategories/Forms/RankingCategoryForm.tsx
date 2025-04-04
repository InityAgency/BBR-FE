import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";

interface RankingCategoryFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function RankingCategoryForm({ initialData, isEdit = false }: RankingCategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isEdit
                ? `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${initialData.id}`
                : `${API_BASE_URL}/api/${API_VERSION}/ranking-categories`;

            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save ranking category");
            }

            toast.success(
                isEdit
                    ? "Ranking category updated successfully"
                    : "Ranking category created successfully"
            );
            router.push("/admin/rankings/ranking-categories");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? "Edit Ranking Category" : "Create New Ranking Category"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
                </Button>
            </form>
        </div>
    );
} 