import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import {
    Autoplay,
    EffectCoverflow,
    Navigation,
    Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { cn } from "@/lib/utils";
import "./MobileGallery.css";

const MobileGallery = ({
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
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                duration: 0.3,
                delay: 0.5,
            }}
            className={cn("mobile-gallery-container", className)}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <Swiper
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
                            }
                            : false
                    }
                    navigation={
                        showNavigation
                            ? {
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            }
                            : false
                    }
                    className="mobile-gallery-swiper"
                    modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index} className="mobile-gallery-slide">
                            <img
                                className="mobile-gallery-img"
                                src={image.src}
                                alt={image.alt}
                            />
                        </SwiperSlide>
                    ))}
                    {showNavigation && (
                        <div>
                            <div className="swiper-button-next after:hidden">
                                <ChevronRightIcon className="swiper-icon" />
                            </div>
                            <div className="swiper-button-prev after:hidden">
                                <ChevronLeftIcon className="swiper-icon" />
                            </div>
                        </div>
                    )}
                </Swiper>
            </motion.div>
        </motion.div>
    );
};

export default MobileGallery;
