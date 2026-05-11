import React from "react";
import { Form } from "react-bootstrap";

const CustomInput = ({
  label,
  passRef,
  type,
  options = [],
  fieldClassName = "",
  ...rest
}) => {
  const { className = "", ...controlProps } = rest;
  const inputClassName = ["admin-form-control", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Form.Group
      className={["mb-3 text-start admin-form-field", fieldClassName]
        .filter(Boolean)
        .join(" ")}
      controlId={controlProps.name}
    >
      <Form.Label>{label}</Form.Label>

      {type === "select" ? (
        <Form.Select {...controlProps} className={inputClassName} ref={passRef}>
          <option value="">Select {label}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          type={type}
          {...controlProps}
          className={inputClassName}
          ref={passRef}
        />
      )}
    </Form.Group>
  );
};

export default CustomInput;
