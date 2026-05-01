import { useSelector } from "react-redux";

import { Navigate, useLocation } from "react-router-dom";

export const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.userInfo);
  console.log(user, 99999);
  return user?._id ? (
    children
  ) : (
    <Navigate
      to="/login"
      state={{
        from: { location },
      }}
    />
  );
};
