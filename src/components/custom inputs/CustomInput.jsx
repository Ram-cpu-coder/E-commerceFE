import React from "react";
import { Form } from "react-bootstrap";

const CustomInput = ({ label, passRef, type, options = [], ...rest }) => {
  return (
    <Form.Group className="mb-3 text-start" controlId={rest.name}>
      <Form.Label>{label}</Form.Label>

      {type === "select" ? (
        <Form.Select {...rest} ref={passRef}>
          <option value="">Select {label}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control type={type} {...rest} ref={passRef} />
      )}
    </Form.Group>
  );
};

export default CustomInput;
