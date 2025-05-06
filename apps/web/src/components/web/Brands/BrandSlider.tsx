"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import "swiper/css/autoplay";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";

export default function BrandSlider() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(false);
        const url = new URL(`${baseUrl}/api/${apiVersion}/public/brands`);
        url.searchParams.set("limit", "100");
        const response = await fetch(url.toString());
        const data = await response.json();
        setBrands(data.data || []);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div>Greška pri učitavanju brendova.</div>;

  return (
    <div className="w-full mt-8 mb-8 lg:mb-12">
      <Swiper
        modules={[Navigation, Grid, Autoplay]}
        spaceBetween={24}
        slidesPerView={4}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        grid={{
          rows: 3,
          fill: "row"
        }}
        navigation
        loop={false}
        breakpoints={{
          320: { slidesPerView: 2, grid: { rows: 3 } },
          640: { slidesPerView: 3, grid: { rows: 3 } },
          1024: { slidesPerView: 4, grid: { rows: 3 } },
        }}
        className="brand-swiper"
      >
        {brands.map((brand: any) => (
          <SwiperSlide key={brand.id}>
            <Link href={`/brands/${brand.slug}`}>
              <div className="flex items-center justify-center border rounded-xl h-36 p-2 hover:bg-secondary transition cursor-pointer">
                {brand.logo?.id ? (
                  <Image
                    src={`${baseUrl}/api/${apiVersion}/media/${brand.logo.id}/content`}
                    alt={brand.name}
                    width={180}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-white text-center">Nema logo</span>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}