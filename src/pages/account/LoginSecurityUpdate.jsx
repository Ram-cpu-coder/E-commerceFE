import React from "react";
import { Form } from "react-bootstrap";

const LoginSecurityUpdate = ({ item, form, handleOnChange }) => {
  const { schemaName, data, type } = item;

  return (
    <Form className="pb-3">
      <div className="col-sm-10 border px-3 py-1">
        <input
          type={type}
          name={schemaName}
          className="form-control-plaintext"
          value={form[schemaName] ?? data ?? ""}
          onChange={handleOnChange}
          placeholder={`Enter ${item.label.toLowerCase()}`}
        />
      </div>
    </Form>
  );
};

export default LoginSecurityUpdate;
