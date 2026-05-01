import React, { useEffect, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserHistoryAction } from "../../features/userHistory/userHistoryAction";
import { getPublicProductAction } from "../../features/products/productActions";

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
  const { user } = useSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchPubProducts = async () => {
      await dispatch(getPublicProductAction());
    };
    fetchPubProducts();
  }, [productCustomerPage]);
  return (
    <div className="pb-5 w-100 d-flex justify-content-center flex-column align-items-center">
      {/* controls and actions like searching, sorting and filtering */}
      <HotPicks />
      <div className="d-flex flex-column align-items-center col-10 mt-5">
        <h1 className="display-5 fw-bold text-dark text-center mb-3">
          Explore More
        </h1>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 w-100">
          {publicProducts?.docs?.map((item, index) => {
            return (
              <div
                className="col"
                style={{ cursor: "pointer" }}
                key={index}
                onClick={async () => {
                  // e.preventDefault();
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
          <div className="mt-2 d-flex justify-content-center w-100">
            <PaginationRounded
              totalPages={publicProducts?.totalPages}
              page={productCustomerPage}
              mode="product"
              client="customer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
