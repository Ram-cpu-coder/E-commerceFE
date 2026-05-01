import React from "react";
import { IoStarOutline } from "react-icons/io5";
import { IoStarHalfOutline } from "react-icons/io5";
import { IoStar } from "react-icons/io5";

const Stars = ({ avgRating }) => {
  const MAXRATING = 5;

  const fullStars = Math.floor(avgRating);
  const halfStar = !Number.isInteger(avgRating);
  const emptyStar = MAXRATING - fullStars - (halfStar ? 1 : 0);

  const Stars = [];

  for (let i = 1; i <= fullStars; i++) {
    Stars.push(<IoStar className="text-warning" />);
  }
  halfStar &&
    Stars.push(<IoStarHalfOutline className="text-warning text-secondary" />);

  if (emptyStar) {
    for (let i = 1; i <= emptyStar; i++) {
      Stars.push(<IoStarOutline className="text-warning" />);
    }
  }
  return (
    <div className="d-flex align-items-center" style={{ maxHeight: "20px", fontSize:"15px"}}>
      <div className="d-flex align-items-center">
        {Stars.map((item, index) => item)}
      </div>
    </div>
  );
};

export default Stars;
