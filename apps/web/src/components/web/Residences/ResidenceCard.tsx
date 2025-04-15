import { Residence } from "@/types/residence";
import Image from "next/image";
import Link from "next/link";
export function ResidenceCard({ residence }: { residence: Residence }) {

    const featuredImage = residence.featuredImage;
    
    return (
        <Link href={`/residences/${residence.id}`} className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-8 hover:bg-zinc-800/20 transition-all h-full hover:-translate-y-2">
            <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
                {featuredImage ? (
                    <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${residence.featuredImage}/content`}
                    alt={residence.name}
                    fill
                    className="object-cover"
                />
                ) : (
                    <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center animate-pulse " />
                )}
            </div>
            <div className="px-2 pb-4">
                <h3 className="text-xl font-bold mb-2">{residence.name}</h3>
                <p className="text-sm text-muted-foreground">{residence.description} </p>
            </div>
        </Link>
    );
}