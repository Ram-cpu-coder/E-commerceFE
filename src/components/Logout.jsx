import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logoutAction } from "../features/user/userAction";
import { useNavigate } from "react-router-dom";
import { setMenu } from "../features/user/userSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const response = dispatch(logoutAction());
    if (response) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    setMenu("Logout"), [];
  });
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "55vh" }}
    >
      <Spinner animation="border border-1" role="status">
        <span className="visually-hidden"></span>
      </Spinner>
    </div>
  );
};

export default Logout;
