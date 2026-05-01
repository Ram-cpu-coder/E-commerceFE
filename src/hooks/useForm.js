import { useEffect, useState } from "react";
import { validator } from "../utils/validatePassword";

const handleOnChange = ({ e, form, setForm }) => {
  let { name, value, checked } = e.target;
  // i did statuses for switch button, dont change the name as it will collide with the filtering functions 
  if (name === "statuses") {
    value = checked ? "active" : "inactive"
  }

  if (name === "fullName") {
    let fName = value.split(" ")[0];
    let lName = value.split(" ")[1] ?? "";

    setForm({
      ...form,
      fName,
      lName,
      [name]: value
    })
  }
  else {
    setForm({
      ...form,
      [name]: value,
    });

  }
};


const useForm = (initialState) => {
  const [form, setForm] = useState(initialState);
  const [passwordErrors, setPasswordErrors] = useState([]);

  //only when password and confirm password changes.
  useEffect(() => {
    const errorArg = validator(form.password, form.confirmPassword);
    setPasswordErrors(errorArg);
  }, [form.password, form.confirmPassword]);

  return {
    form,
    setForm,
    passwordErrors,
    handleOnChange: (e) => handleOnChange({ e, form, setForm }),
  };
};

export default useForm;
