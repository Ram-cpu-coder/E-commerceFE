import { useState } from "react";
import LoginSecurityUpdate from "./LoginSecurityUpdate";
import useForm from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { updateUserAction } from "../../features/user/userAction";
import { useNavigate } from "react-router-dom";

const LoginSecurityCard = ({ item }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { form, handleOnChange, setForm } = useForm({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnUpdate = (obj) => {
    dispatch(updateUserAction(obj));

    setForm({});
    setIsUpdating(false);
    navigate("/user/account");
  };
  return (
    <>
      <div className="row w-100 py-3">
        <section className="col-8 d-flex flex-column">
          <b>{item.label}</b>
          {isUpdating ? (
            <LoginSecurityUpdate
              item={item}
              handleOnChange={handleOnChange}
              form={form}
            />
          ) : (
            <p>{item.data}</p>
          )}
        </section>
        {item.schemaName === "email" ? (
          ""
        ) : (
          <section className="col-4 d-flex align-items-center justify-content-center">
            {isUpdating ? (
              <div className="d-flex flex-column gap-2">
                <button
                  className="border rounded px-5 py-2"
                  onClick={() => setIsUpdating(false)}
                >
                  Cancel
                </button>
                <button
                  className="border rounded px-5 py-2"
                  onClick={() => handleOnUpdate(form)}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="border rounded px-5 py-2"
                onClick={() => {
                  setIsUpdating(!isUpdating);
                }}
              >
                Edit
              </button>
            )}
          </section>
        )}
        {item.label !== "Password" ? <hr /> : ""}
      </div>
    </>
  );
};

export default LoginSecurityCard;
