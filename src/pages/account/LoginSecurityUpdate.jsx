import React from "react";
import { Form } from "react-bootstrap";

const LoginSecurityUpdate = ({ item, form, handleOnChange }) => {
  const { schemaName, data, type } = item;

  console.log(form[schemaName]);
  return (
    <Form className="pb-3">
      <div className="col-sm-10 border px-3 py-1">
        <input
          type={type}
          name={schemaName}
          className="form-control-plaintext"
          value={form[schemaName]}
          onChange={handleOnChange}
        />
      </div>
    </Form>
  );
};

export default LoginSecurityUpdate;
