// SwiperComponent.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

const SwiperComponent = () => {
  return (
    <div className="w-full h-fit">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="w-full lg:h-[500px] h-[250px]"
      >
        <SwiperSlide>
          <img
            src="src/assets/banner1.jpg"
            alt="Slide 1"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="src/assets/banner2.jpg"
            alt="Slide 2"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="src/assets/banner4.jpg"
            alt="Slide 3"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
