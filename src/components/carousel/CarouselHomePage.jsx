import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import {
  Pagination,
  Navigation,
  // FreeMode,
  // Thumbs,
  Autoplay,
} from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function CarouselHomePage({ featureBanner }) {
  const pagination = {
    clickable: true,
  };

  const navigate = useNavigate();

  const handleBannerLandingPage = (id) => {
    navigate(`featured/${id}`);
  };

  if (!featureBanner || featureBanner.length === 0) return null;

  return (
    <>
      <Swiper
        // key={featureBanner.length}
        slidesPerView={1}
        spaceBetween={1}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={pagination}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
      >
        {featureBanner?.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.featureBannerImgUrl}
              alt="Carousel"
              style={{
                objectFit: "contain",
                cursor: "pointer",
                width: "100%",
                height: "auto",
              }}
              onClick={() => handleBannerLandingPage(item._id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
