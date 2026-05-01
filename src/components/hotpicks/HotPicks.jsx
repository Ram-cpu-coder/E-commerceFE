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
    if (!hotPicks.length) {
      fetchHotPicks();
    }
    setLoading(false);
  }, []);

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
  return (
    <div className="w-100 d-flex justify-content-center mt-5">
      <div className="d-flex flex-column align-items-center col-10">
        <h1 className="display-5 fw-bold text-dark text-center mb-3">
          Recommended For You
        </h1>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 w-100">
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
