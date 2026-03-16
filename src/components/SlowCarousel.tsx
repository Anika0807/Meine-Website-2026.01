'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface SlowCarouselProps {
  images: string[];
}

export default function SlowCarousel({ images }: SlowCarouselProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={24}
      slidesPerView={1}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="w-full h-96 md:h-[500px]"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img src={img} alt={`Projekt ${index + 1}`} className="w-full h-full object-cover rounded-card" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
