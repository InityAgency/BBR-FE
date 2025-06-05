"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay as SwiperAutoplay } from "swiper/modules";
import { ResidenceCard } from "./ResidenceCard";
import { Residence } from "@/types/residence";
import "swiper/css";
import "swiper/css/navigation";

export default function ResidencesSlider() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResidences = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences?sortBy=createdAt&sortOrder=desc`);
        const data = await response.json();
        setResidences(data.data || []);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchResidences();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading residences.</div>;

  return (
    <div className="w-full lg:mt-8 lg:mb-8 lg:mb-12">
      <Swiper
        modules={[Navigation, SwiperAutoplay]}
        spaceBetween={24}
        slidesPerView={3}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation
        loop={false}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="residences-swiper"
      >
        {residences.map((residence) => (
          <SwiperSlide key={residence.id}>
            <ResidenceCard residence={residence} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 