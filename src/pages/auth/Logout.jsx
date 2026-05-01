import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../features/user/userAction";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logOut = async () => {
      const response = await dispatch(logoutAction());
      console.log(response);
      if (response) {
        setLoading(false);
        navigate("/login", { replace: true });
      }
    };
    logOut();
  }, []);

  return (
    loading === true && (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "55vh" }}
      >
        <Spinner animation="border border-1" role="status">
          <span></span>
        </Spinner>
      </div>
    )
  );
};

export default Logout;
