import Image from "next/image"
import Link from "next/link"

export default function PopularPlaces() {
    const places = [
        {
            id: 1,
            title: "Popular Geographical Areas",
            image: "/popular/popular-geographic-area.webp",
            links: [
                { text: "Top 50 in Worldwide", url: "/best-residences/top-50-worldwide" },
                { text: "Top 10 in Asia", url: "/best-residences/top-10-in-asia" },
                { text: "Top 10 in Europe", url: "/best-residences/top-10-in-europe" },
                { text: "Top 10 in North America", url: "/best-residences/top-10-in-north-america" },
                { text: "Top 10 in South America", url: "/best-residences/top-10-in-south-america" }
            ]
        },
        {
            id: 2,
            title: "Popular Cities",
            image: "/popular/popular-cities.webp",
            links: [
                { text: "Top 10 in New York, USA", url: "/best-residences/top-10-in-new-york-usa" },
                { text: "Top 10 in Dubai, UAE", url: "/best-residences/top-10-in-dubai-uae" },
                { text: "Top 10 in Miami, USA", url: "/best-residences/top-10-in-miami-usa" },
                { text: "Top 10 in Bangkok, Thailand", url: "/best-residences/top-10-in-bangkok-thailand" },
                { text: "Top 10 in London, UK", url: "/best-residences/top-10-in-london-uk" },
                // { text: "Top 10 in Boston, United States", url: "/best-residences/ajman" },
                // { text: "Top 10 in Phuket, Thailand", url: "/best-residences/ajman" },
                // { text: "Top 10 in Istanbul, Turkey", url: "/best-residences/ajman" },
                // { text: "Top 10 in São Paulo, Brazil", url: "/best-residences/ajman" },
                // { text: "Top 10 in Abu Dhabi, UAE", url: "/best-residences/ajman" },
            ]
        },
        {
            id: 3,
            title: "Enjoy Your Lifestyle",
            image: "/popular/popular-lifestyle.webp",
            links: [
                { text: "Best for Beachfront Living", url: "/best-residences/best-for-beachfront-living" },
                { text: "Best for Newest Branded Residences", url: "/best-residences/best-for-newest-branded-residences" },
                { text: "Best for Investment Opportunities", url: "/best-residences/best-for-investment-opportunities" },
                { text: "Best for Golf Living", url: "/best-residences/best-for-golf-living" },
                { text: "Best for Green Energy", url: "/best-residences/best-for-green-energy" }
            ]
        },
        {
            id: 4,
            title: "Popular Countries",
            image: "/popular/popular-countries.webp",
            links: [
                { text: "Top 10 in United Arab Emirates", url: "/best-residences/top-10-in-united-arab-emirates" },
                { text: "Top 10 in United Kingdom", url: "/best-residences/top-10-in-united-kingdom" },
                { text: "Top 10 in China", url: "/best-residences/top-10-in-china" },
                { text: "Top 10 in USA", url: "/best-residences/top-10-in-usa" },
                { text: "Top 10 in Thailand", url: "/best-residences/top-10-in-thailand" },
                { text: "Top 10 in Canada", url: "/best-residences/top-10-in-canada" },
                { text: "Top 10 in Malaysia", url: "/best-residences/top-10-in-malaysia" },
                { text: "Top 10 in Brazil", url: "/best-residences/top-10-in-brazil" },
                { text: "Top 10 in Egypt", url: "/best-residences/top-10-in-egypt" },
                { text: "Top 10 in Morocco", url: "/best-residences/top-10-in-morocco" }
            ]
        },
        {
            id: 5,
            title: "Most Popular Brands",
            image: "/popular/popular-brands.webp",
            links: [
                { text: "Top 10 in Aman", url: "/best-residences/top-10-aman-residences" },
                { text: "Top 10 in Ritz-Carlton", url: "/best-residences/top-10-ritz-carlton-residences" },
                { text: "Top 10 in Banyan Tree", url: "/best-residences/top-10-banyan-tree-residences" },
                { text: "Top 10 in Dorchester", url: "/best-residences/top-10-dorchester-residences" },
                { text: "Top 10 in Nobu", url: "/best-residences/top-10-nobu-residences" },
                { text: "Top 10 in Mandarin Oriental", url: "/best-residences/top-10-mandarin-oriental-residences" },
                { text: "Top 10 in Fairmont", url: "/best-residences/top-10-fairmont-residences" },
                { text: "Top 10 in Montage", url: "/best-residences/top-10-montage-residences" },
                { text: "Top 10 in Trump", url: "/best-residences/top-10-trump-residences" },
                { text: "Top 10 in Four Seasons", url: "/best-residences/top-10-four-seasons-residences" },
            ]
        }
    ]

    return (
        <div className="w-full xl:max-w-[1600px] mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 md:gap-6">
                {/* Prvi red - tri kartice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 [1300px]:grid-cols-1 2xl:grid-cols-3 gap-4 md:gap-6">
                    {places.slice(0, 3).map((place) => (
                        <div 
                            key={place.id}
                            className="relative min-h-[250px] md:h-[300px] rounded-xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                            <Image
                                src={place.image}
                                alt={place.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 p-4 md:p-6 z-20 flex flex-col 2xl:flex-row 2xl:items-end 2xl:gap-4 3xl:gap-8 justify-between">
                                <h3 className="text-xl md:text-2xl font-bold text-white 2xl:max-w-[40%] 3xl:max-w-[50%]">{place.title}</h3>
                                <div className="flex flex-col gap-1 md:gap-2 mt-4 2xl:mt-0 2xl:min-w-[50%] 2xl:max-w-[50%]">
                                    {place.links.map((link, index) => (
                                        <Link 
                                            key={index}
                                            href={link.url}
                                            className="text-sm md:text-base text-white hover:text-white/80 transition-colors"
                                        >
                                            {link.text}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Drugi red - dve kartice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 [1300px]:grid-cols-1 2xl:grid-cols-2 gap-4 md:gap-6">
                    {places.slice(3).map((place) => (
                        <div 
                            key={place.id}
                            className="relative min-h-[250px] md:h-[300px] rounded-xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                            <Image
                                src={place.image}
                                alt={place.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 p-4 md:p-6 z-20 flex flex-col 2xl:flex-row 2xl:items-end justify-between">
                                <h3 className="text-xl md:text-2xl font-bold text-white 2xl:max-w-[45%]">{place.title}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 md:gap-y-2 mt-4 2xl:mt-0 2xl:min-w-[50%]">
                                    {place.links.map((link, index) => (
                                        <Link 
                                            key={index}
                                            href={link.url}
                                            className="text-sm md:text-base text-white hover:text-white/80 transition-colors"
                                        >
                                            {link.text}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
