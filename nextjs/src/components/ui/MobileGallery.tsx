'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { cn } from '@/lib/utils/cn';

interface Image {
  src: string;
  alt: string;
}

interface MobileGalleryProps {
  images: Image[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}

const MobileGallery: React.FC<MobileGalleryProps> = ({
  images,
  className,
  showPagination = true,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn('relative w-full overflow-hidden', className)}
    >
      <Swiper
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1500,
                disableOnInteraction: true,
              }
            : false
        }
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        loop={loop}
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={
          showPagination
            ? {
                clickable: true,
                dynamicBullets: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }
            : false
        }
        className="w-full pb-12"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="w-[280px] h-[350px]">
            <div className="relative w-full h-full">
              <img
                className="w-full h-full object-cover rounded-lg shadow-xl"
                src={image.src}
                alt={image.alt}
              />
            </div>
          </SwiperSlide>
        ))}
        {showNavigation && (
          <>
            <div className="swiper-button-prev !text-black !after:content-['']">
              <ChevronLeft className="w-6 h-6" />
            </div>
            <div className="swiper-button-next !text-black !after:content-['']">
              <ChevronRight className="w-6 h-6" />
            </div>
          </>
        )}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #000 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default MobileGallery;
