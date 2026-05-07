import React, { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { getPublicProductAction } from "../../features/products/productActions";
import { getRecommendationsAction } from "../../features/userHistory/userHistoryAction";
import { fetchFeatureBannerAction } from "../../features/featureBanner/featureBannerAction";
import { handleOnClickProduct } from "../../utils/productFunctions";

// Lazy-loaded components for faster initial render
const CategoryList = lazy(() =>
  import("../../components/layouts/CategoryList")
);
const ProductCard = lazy(() => import("../../components/cards/ProductCard"));
const CarouselHomePage = lazy(() =>
  import("../../components/carousel/CarouselHomePage")
);
const PaginationRounded = lazy(() =>
  import("../../components/pagination/PaginationRounded")
);
const HotPicks = lazy(() => import("../../components/hotpicks/HotPicks"));

const HomePage = () => {
  const dispatch = useDispatch();

  const { publicProducts, productCustomerPage } = useSelector(
    (state) => state.productInfo
  );
  const { user } = useSelector((state) => state.userInfo);
  const { hotPicks } = useSelector((state) => state.userHistoryInfo);
  const { featureBanner } = useSelector((state) => state.featureBannerInfo);

  const [bannerLoading, setBannerLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);

  // === Fetch banners & products in parallel on first load ===
  useEffect(() => {
    setBannerLoading(true);
    setProductLoading(true);

    dispatch(fetchFeatureBannerAction()).finally(() => setBannerLoading(false));
    dispatch(getPublicProductAction()).finally(() => setProductLoading(false));
  }, [dispatch]);

  // === Fetch products when pagination changes (avoid re-fetching banners) ===
  useEffect(() => {
    if (productCustomerPage > 1) {
      setProductLoading(true);
      dispatch(getPublicProductAction()).finally(() =>
        setProductLoading(false)
      );
    }
  }, [dispatch, productCustomerPage]);

  // === Fetch recommendations only once per user ===
  useEffect(() => {
    if (user?._id && hotPicks.length === 0) {
      dispatch(getRecommendationsAction(user._id));
    }
  }, [dispatch, user?._id, hotPicks.length]);

  return (
    <div className="mx-2 pb-5">
      <Suspense
        fallback={
          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        {/* Banner */}
        {!bannerLoading && featureBanner.length > 0 && (
          <div className="carouselDiv">
            <CarouselHomePage featureBanner={featureBanner} />
          </div>
        )}

        <CategoryList />

        {/* Hot Picks */}
        {hotPicks.length > 0 && (
          <HotPicks handleOnClickProduct={handleOnClickProduct} />
        )}

        {/* Products Section */}
        <div className="py-5 w-100 d-flex justify-content-center">
          {productLoading ? (
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
              })}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <div className="d-flex flex-column align-items-center col-10 mt-5">
              <h1 className="display-6 app-section-title text-center mb-3">
                Explore more
              </h1>

              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 w-100">
                {publicProducts?.docs?.map((item) => (
                  <div
                    className="col"
                    style={{ cursor: "pointer" }}
                    key={item._id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOnClickProduct(item, user, dispatch);
                    }}
                  >
                    <ProductCard item={item} />
                  </div>
                ))}

                <div className="mt-2 d-flex justify-content-center w-100">
                  {publicProducts?.totalPages > 1 && (
                    <PaginationRounded
                      totalPages={publicProducts?.totalPages}
                      page={productCustomerPage}
                      mode="product"
                      client="customer"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default HomePage;
