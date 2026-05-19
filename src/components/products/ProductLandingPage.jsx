import React, { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getSingleProductAction,
  updateProductActionIndividually,
} from "../../features/products/productActions";
import {
  createWishlistAction,
  deleteWishlistItemAction,
  getWishlistAction,
} from "../../features/wishlist/wishlistAction";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ProductsImages from "./ProductsImages";
import ProductsDetails from "./ProductsDetails";
import Description from "./Description";

const ProductReviews = lazy(() => import("./ProductReviews"));
const ShareProduct = lazy(() => import("./ShareProduct"));

const calculateAvgRating = (reviews) => {
  if (!reviews?.length) return 1;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
};

const ProductLandingPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { selectedProduct } = useSelector((state) => state.productInfo);
  const { allPubReviews, selectedReview } = useSelector((state) => state.reviewInfo);
  const { wishlist } = useSelector((state) => state.wishlistSliceInfo);
  const { user } = useSelector((state) => state.userInfo);

  const favourite = wishlist?.some((item) => item.productId === id);
  const hasCurrentProduct = selectedProduct?._id === id;
  const [loading, setLoading] = useState(!hasCurrentProduct);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (!selectedProduct?.name || selectedProduct._id !== id) return;
    const prev = document.title;
    document.title = `${selectedProduct.name} | Ecommerce platform`;
    return () => {
      document.title = prev;
    };
  }, [id, selectedProduct?._id, selectedProduct?.name]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const needsProduct = selectedProduct?._id !== id;
      if (needsProduct) {
        setLoading(true);
        await dispatch(getSingleProductAction(id));
      }

      if (user?._id && (wishlist?.length || 0) === 0) {
        await dispatch(getWishlistAction());
      }

      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [
    dispatch,
    id,
    selectedProduct?._id,
    user?._id,
    wishlist?.length,
  ]);

  useEffect(() => {
    setShowReviews(true);
  }, []);

  const itemReviews = useMemo(
    () => {
      const apiReviews = selectedReview?.docs || selectedReview?.reviews || [];
      const productReviews = selectedProduct?.reviews || [];
      const publicReviews = allPubReviews?.filter((r) => r.productId === id) || [];
      const reviews = apiReviews.length ? apiReviews : productReviews.length ? productReviews : publicReviews;

      return reviews.filter((review) => String(review.productId) === String(id));
    },
    [allPubReviews, id, selectedProduct?.reviews, selectedReview]
  );

  const avgRating = useMemo(
    () => calculateAvgRating(itemReviews),
    [itemReviews]
  );

  useEffect(() => {
    if (
      !user?._id &&
      selectedProduct &&
      avgRating !== selectedProduct.ratings
    ) {
      const timer = setTimeout(() => {
        dispatch(updateProductActionIndividually(id, { ratings: avgRating }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [avgRating, dispatch, id, selectedProduct, user?._id]);

  const toggleWishlist = () => {
    if (!selectedProduct) return;

    if (favourite) {
      const item = wishlist.find((i) => i.productId === id);
      if (item) dispatch(deleteWishlistItemAction(item._id));
    } else {
      dispatch(
        createWishlistAction({
          productId: selectedProduct._id,
          name: selectedProduct.name,
          unitPrice: selectedProduct.price,
          stockStatus: selectedProduct.stock,
          image: selectedProduct.images[0],
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="product-page-shell">
        <div className="product-page-container product-detail-shell product-detail-grid">
          <Skeleton variant="rounded" height={420} />
          <Box sx={{ display: "grid", gap: 2 }}>
            <Skeleton variant="text" width="70%" height={48} />
            <Skeleton variant="text" width="45%" height={34} />
            <Skeleton variant="rounded" height={74} />
            <Skeleton variant="rounded" height={54} />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page-shell">
      <div className="product-page-hero product-page-container">
        <div>
          <p className="section-kicker">Product detail</p>
          <h1>{selectedProduct.name}</h1>
          {selectedProduct.shopName && (
            <span className="product-shop-detail-tag">
              Sold by {selectedProduct.shopName}
            </span>
          )}
          <p>
            Explore the gallery, reviews, pricing, and stock details before
            adding this item to your cart.
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center w-100 flex-column gap-4 mb-5">
        <div className="product-page-container product-detail-shell product-detail-grid">
          <ProductsImages selectedProduct={selectedProduct} />
          <ProductsDetails
            handleFavourite={toggleWishlist}
            handleDeleteWishlist={toggleWishlist}
            favourite={favourite}
            avgRating={avgRating}
            selectedProduct={selectedProduct}
            wishlist={wishlist}
          />
        </div>

        <div className="product-page-container product-description-shell">
          <Description description={selectedProduct.description} />
        </div>

        {showReviews && (
          <div className="product-page-container review-shell">
            <Suspense fallback={<div>Loading Reviews...</div>}>
              <ProductReviews selectedProduct={selectedProduct} />
            </Suspense>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <ShareProduct />
      </Suspense>
    </div>
  );
};

export default ProductLandingPage;
