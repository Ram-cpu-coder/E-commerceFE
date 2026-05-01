import React, { useEffect } from "react";
import { createUserHistoryAction } from "../../features/userHistory/userHistoryAction";
import { useDispatch, useSelector } from "react-redux";
import PaginationRounded from "../../components/pagination/PaginationRounded";
import { useParams } from "react-router-dom";
import { fetchFeatureBannerAction } from "../../features/featureBanner/featureBannerAction";
import { getActiveProductAction } from "../../features/products/productActions";
import ProductCard from "../../components/cards/ProductCard";

const CarouselLandingPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userInfo);
  const { featureBanner } = useSelector((state) => state.featureBannerInfo);
  const { allActiveProducts } = useSelector((state) => state.productInfo);

  const { id } = useParams();
  console.log(id);

  const selectedFeatureBanner = featureBanner?.find((item) => item._id === id);

  const productsId = selectedFeatureBanner?.products;

  const products = allActiveProducts?.filter((item) =>
    productsId.includes(item._id)
  );

  console.log(selectedFeatureBanner);
  console.log(productsId);
  console.log(products, "feature Landing page ");

  console.log(allActiveProducts);

  useEffect(() => {
    const fetchingFeaturedBanner = async () => {
      await dispatch(fetchFeatureBannerAction());
      await dispatch(getActiveProductAction());
    };
    fetchingFeaturedBanner();
  }, [dispatch]);

  return (
    <div className="pb-5 w-100 d-flex justify-content-center">
      <div className="d-flex flex-column align-items-center col-10 mt-5">
        <h1>{selectedFeatureBanner?.title}</h1>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 w-100">
          {products?.map((item, index) => {
            return (
              <div
                className="col"
                style={{ cursor: "pointer" }}
                key={index}
                onClick={async () => {
                  console.log("on the way");
                  await dispatch(
                    createUserHistoryAction({
                      userId: user._id || null,
                      productId: item._id,
                      categoryId: item.category,
                      action: "click",
                    })
                  );
                  window.location.href = `/${item._id}`;
                }}
              >
                <ProductCard item={item} />
              </div>
            );
          })}
          {/* <div className="mt-2 d-flex justify-content-center w-100">
          <PaginationRounded
            totalPages={publicProducts?.totalPages}
            page={productCustomerPage}
            mode="product"
            client="customer"
          />
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default CarouselLandingPage;
