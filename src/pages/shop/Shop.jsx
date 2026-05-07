import React, { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUserHistoryAction } from "../../features/userHistory/userHistoryAction";
import { getPublicProductAction } from "../../features/products/productActions";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const HotPicks = lazy(() => import("../../components/hotpicks/HotPicks"));
const ProductCard = lazy(() => import("../../components/cards/ProductCard"));
const PaginationRounded = lazy(() =>
  import("../../components/pagination/PaginationRounded")
);

const Shop = () => {
  const { publicProducts, productCustomerPage } = useSelector(
    (state) => state.productInfo
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchPubProducts = async () => {
      await dispatch(getPublicProductAction());
    };
    fetchPubProducts();
  }, [dispatch, productCustomerPage]);

  return (
    <div className="app-page pb-5 w-100 d-flex justify-content-center flex-column align-items-center">
      <Suspense
        fallback={
          <Box className="d-flex justify-content-center py-5 w-100">
            <CircularProgress size={36} aria-label="Loading" />
          </Box>
        }
      >
        <HotPicks />
        <div className="d-flex flex-column align-items-center storefront-section mt-4 mt-md-5 px-2">
          <div className="storefront-section-header">
            <div>
              <p className="section-kicker">Full catalogue</p>
              <h1 className="display-6 app-section-title mb-2">
                Shop collection
              </h1>
              <p className="section-subcopy">
                Browse the full range and open any product for details,
                reviews, gallery views, and cart options.
              </p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 w-100">
            {publicProducts?.docs?.map((item) => (
              <div
                className="col"
                style={{ cursor: "pointer" }}
                key={item._id}
                onClick={async () => {
                  await dispatch(
                    createUserHistoryAction({
                      userId: user?._id || null,
                      productId: item._id,
                      categoryId: item.category,
                      action: "click",
                    })
                  );
                  navigate(`/product/${item._id}`);
                }}
              >
                <ProductCard item={item} />
              </div>
            ))}
            <div className="mt-3 d-flex justify-content-center w-100">
              <PaginationRounded
                totalPages={publicProducts?.totalPages}
                page={productCustomerPage}
                mode="product"
                client="customer"
              />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Shop;
