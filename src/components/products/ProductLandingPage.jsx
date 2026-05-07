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
import { getPubReviewAction } from "../../features/reviews/reviewAction";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// Lazy-loaded components
const ProductsImages = lazy(() => import("./ProductsImages"));
const ProductsDetails = lazy(() => import("./ProductsDetails"));
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
  const { allPubReviews } = useSelector((state) => state.reviewInfo);
  const { wishlist } = useSelector((state) => state.wishlistSliceInfo);
  const { user } = useSelector((state) => state.userInfo);

  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);

  const favourite = wishlist?.some((item) => item.productId === id);

  useEffect(() => {
    if (!selectedProduct?.name || selectedProduct._id !== id) return;
    const prev = document.title;
    document.title = `${selectedProduct.name} | Ecommerce platform`;
    return () => {
      document.title = prev;
    };
  }, [id, selectedProduct?._id, selectedProduct?.name]);

  // --- Fetch product, reviews, wishlist once ---
  useEffect(() => {
    let isMounted = true; // prevent state updates if component unmounts

    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch product if not already loaded or different product
      if (!selectedProduct || selectedProduct._id !== id) {
        await dispatch(getSingleProductAction(id));
      }

      // 2. Fetch reviews only if not already fetched for this product
      if (!allPubReviews?.some((r) => r.productId === id)) {
        await dispatch(getPubReviewAction(id));
      }

      // 3. Fetch wishlist only if user exists and wishlist is empty
      if (user?._id && wishlist.length === 0) {
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
    selectedProduct,
    allPubReviews,
    user?._id,
    wishlist.length,
  ]);

  // --- Lazy-load reviews after a short delay ---
  useEffect(() => {
    const timer = setTimeout(() => setShowReviews(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // --- Filter reviews for current product ---
  const itemReviews = useMemo(
    () => allPubReviews?.filter((r) => r.productId === id) || [],
    [allPubReviews, id]
  );

  const avgRating = useMemo(
    () => calculateAvgRating(itemReviews),
    [itemReviews]
  );

  // --- Update product rating if user not logged in ---
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
      <Backdrop
        sx={(theme) => ({ color: "white", zIndex: theme.zIndex.drawer + 1 })}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className="product-page-shell">
      <div className="product-page-hero">
        <div>
          <p className="section-kicker">Product detail</p>
          <h1>{selectedProduct.name}</h1>
          <p>
            Explore the gallery, reviews, pricing, and stock details before
            adding this item to your cart.
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center w-100 flex-column gap-4 mb-5">
        <div className="d-flex flex-column flex-lg-row justify-content-around align-items-start container col-11 col-xl-9 col-lg-10 col-md-12 product-detail-shell">
          <Suspense
            fallback={
              <Box sx={{ width: 300, height: 300, m: 2 }}>
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </Box>
            }
          >
            <ProductsImages selectedProduct={selectedProduct} />
          </Suspense>
          <Suspense fallback={<div>Loading Details...</div>}>
            <ProductsDetails
              handleFavourite={toggleWishlist}
              handleDeleteWishlist={toggleWishlist}
              favourite={favourite}
              avgRating={avgRating}
              selectedProduct={selectedProduct}
              wishlist={wishlist}
            />
          </Suspense>
        </div>

        {showReviews && (
          <div className="d-flex flex-column flex-md-row justify-content-around align-items-start container col-11 col-xl-9 col-lg-10 col-md-12 review-shell">
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
