import React, { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import { getRecommendationsAction } from "../../features/userHistory/userHistoryAction";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const HotPicks = ({ handleOnClickProduct }) => {
  const { user } = useSelector((state) => state.userInfo);
  const { hotPicks } = useSelector((state) => state.userHistoryInfo);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHotPicks = async () => {
      await dispatch(getRecommendationsAction(user._id));
    };
    if (user?._id && !hotPicks.length) {
      fetchHotPicks();
    }
    setLoading(false);
  }, [dispatch, hotPicks.length, user?._id]);

  if (loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (!hotPicks.length) {
    return null;
  }

  return (
    <div className="w-100 d-flex justify-content-center mt-5">
      <div className="d-flex flex-column align-items-center storefront-section storefront-shell rounded-4 p-3 p-md-4">
        <div className="storefront-section-header">
          <div>
            <p className="section-kicker">Picked for you</p>
            <h1 className="display-6 app-section-title mb-2">
              Recommended For You
            </h1>
            <p className="section-subcopy">
              Based on your browsing rhythm and the products shoppers keep
              coming back to.
            </p>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 w-100">
          {hotPicks?.map((item, index) => (
            <div
              className="col"
              style={{ cursor: "pointer" }}
              key={index}
              onClick={() => handleOnClickProduct(item, user, dispatch)}
            >
              <ProductCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotPicks;
