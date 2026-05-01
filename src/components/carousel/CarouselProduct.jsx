// Dont get confused, this carousel is for the product landing page's images

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { Navigation, FreeMode, Thumbs } from "swiper/modules";

export default function CarouselProduct({ selectedProduct, setSelectedImg }) {
  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={3}
        navigation={true}
        modules={[Navigation, Thumbs, FreeMode]}
        className="mySwiper py-2"
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
      >
        {selectedProduct
          ? selectedProduct.images?.map((item, index) => (
              <SwiperSlide>
                <img
                  src={item}
                  alt="carousel"
                  key={index}
                  className="p-1"
                  style={{ maxHeight: "150px" }}
                  onClick={() => setSelectedImg(item)}
                />
              </SwiperSlide>
            ))
          : "Loading the images"}
      </Swiper>
    </>
  );
}
