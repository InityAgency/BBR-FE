import { BrandType } from "@/app/types/models/BrandType";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BrandTypesActions } from "../Table/BrandTypesActions";
import { formatDate } from "@/utils/dateFormatter";
import { Row } from "@tanstack/react-table";

interface BrandTypeCardProps {
  brandType: BrandType;
}

export function BrandTypeCard({ brandType }: BrandTypeCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start border-b border-border pb-2">
            <div>
              <a href={`/brands/types/${brandType.id}/edit`} className="font-medium text-foreground hover:underline truncate block">
                {brandType.name}
              </a>
              <p className="text-sm text-muted-foreground mt-1">{brandType.id}</p>
            </div>
            <BrandTypesActions row={{ original: brandType } as Row<BrandType>} />
          </div>

          <div className="border-b border-border pb-2">
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-sm mt-1 text-white">
              {brandType.description || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm text-muted-foreground mt-1 text-white">
                {formatDate(brandType.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm text-muted-foreground mt-1 text-white">
                {formatDate(brandType.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 