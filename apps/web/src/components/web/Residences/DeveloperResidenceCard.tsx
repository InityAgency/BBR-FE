import Image from "next/image"
import Link from "next/link"
import type { Residence } from "@/types/residence"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DeveloperResidenceCardProps {
  residence: Residence
}

const formatText = (text: string) => {
  if (!text) return "";
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm');
  } catch (error) {
    return dateString;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'draft':
      return 'bg-gray-500/10 text-white border-gray-500/20';
    case 'pending':
      return 'bg-orange-500/10 text-yellow-400 border-orange-500/20';
    case 'deleted':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

export function DeveloperResidenceCard({ residence }: DeveloperResidenceCardProps) {
  console.log(residence)
  return (
    <div className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col gap-2 hover:bg-secondary/50 transition-all h-full hover:-translate-y-2">
      <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
        {residence.featuredImage && residence.featuredImage.id ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${residence.featuredImage.id}/content`}
            alt={residence.name}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        ) : residence.brand && residence.brand.logo && residence.brand.logo.id ? (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${residence.brand.logo.id}/content`}
              alt={residence.brand.name || 'Brand'}
              width={100}
              height={100}
              className="object-cover w-[30%] h-auto"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-sm border",
          getStatusColor(residence.status)
        )}>
          {formatText(residence.status)}
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/developer/residences/${residence.slug || residence.id}/edit`} className="text-xs font-medium border flex items-center justify-center px-2 py-2 rounded-md bg-secondary hover:bg-white/5 transition-all">
            <Pencil className="w-4 h-4" />
          </Link>
          <Link href={`/developer/residences/${residence.slug}`} className="text-xs font-medium border flex items-center justify-center px-2 py-2 rounded-md bg-secondary hover:bg-white/5 transition-all">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-1 pb-4 border-b">
        <h3 className="text-md text-sans text-white font-medium transition-all ">{residence.name}</h3>
        <p className="text-xs text-muted-foreground">
          {residence.id}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{residence.address}</p>
        <div className="flex flex-col lg:flex-row justify-between gap-1 mt-3">
          <p className="text-xs text-muted-foreground flex flex-col">
            Created at: <span className="text-white text-md">{formatDate(residence.createdAt)}</span>
          </p>
          <p className="text-xs text-muted-foreground flex flex-col">
            Updated at: <span className="text-white text-md">{formatDate(residence.updatedAt)}</span>
          </p>
        </div>
      </div>
    </div>
  )
} 