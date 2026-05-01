import React, { useState } from "react";
import CarouselProduct from "../carousel/CarouselProduct";
import InnerImageZoom from "react-inner-image-zoom";

const ProductsImages = ({ selectedProduct }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  return (
    <div
      className="d-flex flex-column flex-md-row justify-content-center gap-2 col-12 col-md-4 sticky-element border"
      style={{ maxHeight: "100dvh" }}
    >
      {/* image */}
      <div className="col-12" style={{}}>
        <InnerImageZoom
          src={!selectedImg ? selectedProduct.images?.[0] : selectedImg}
          zoomSrc={selectedImg}
          zoomType="hover"
          zoomPreload={true}
          zoomScale={1.02}
          style={{ objectFit: "contain" }}
        />

        {/* carousel for the secondary images  */}
        <div className="col-12" style={{ height: "100px" }}>
          <CarouselProduct
            selectedProduct={selectedProduct}
            setSelectedImg={setSelectedImg}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsImages;
