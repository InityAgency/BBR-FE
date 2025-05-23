import Image from "next/image";
import Link from "next/link";

interface RankingCategory {
    slug: any;
    id: string;
    name: string;
    title: string;
    residenceLimitation: number;
    featuredImage: {
        id: string;
    };
    categoryTypeId: string;
}

interface RankingCardProps {
    category: RankingCategory;
    baseUrl: string;
    apiVersion: string;
}

const RankingCard = ({ category, baseUrl, apiVersion }: RankingCardProps) => (
    <Link href={`/best-residences/${category.slug}`} className="border p-4 rounded-lg relative min-h-[300px]">
        <div className="top-badge absolute z-2 top-0 left-1/2 -translate-x-1/2 bg-secondary rounded-b-lg px-0 min-w-[130px] py-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                <path d="M2.16675 3.83331L4.66675 13.8333H16.3334L18.8334 3.83331L13.8334 9.66665L10.5001 3.83331L7.16675 9.66665L2.16675 3.83331ZM4.66675 17.1666H16.3334H4.66675Z" fill="url(#paint0_linear_472_2037)" />
                <path d="M4.66675 17.1666H16.3334M2.16675 3.83331L4.66675 13.8333H16.3334L18.8334 3.83331L13.8334 9.66665L10.5001 3.83331L7.16675 9.66665L2.16675 3.83331Z" stroke="url(#paint1_linear_472_2037)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="paint0_linear_472_2037" x1="10.5001" y1="3.83331" x2="10.5001" y2="17.1666" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F5F3F6" />
                        <stop offset="1" stopColor="#BBA568" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_472_2037" x1="10.5001" y1="3.83331" x2="10.5001" y2="17.1666" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F5F3F6" />
                        <stop offset="1" stopColor="#BBA568" />
                    </linearGradient>
                </defs>
            </svg>
            <p className="text-md w-fit">
                TOP {category.residenceLimitation} IN
            </p>
        </div>
        {category.featuredImage && (
            <div className="relative w-full h-full z-1">
                <Image
                    src={`${baseUrl}/api/${apiVersion}/media/${category.featuredImage.id}/content`}
                    alt={category?.title || "Ranking category image"}
                    fill
                    className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
        )}
        <div className="flex flex-col gap-2 absolute bottom-6 left-0 right-0 p-4 z-2">
            <p className="uppercase text-sm w-full text-center">BEST FOR</p>
            <h3 className="text-2xl font-bold w-full text-center">{category.title}</h3>
        </div>
    </Link>
);

export default RankingCard;