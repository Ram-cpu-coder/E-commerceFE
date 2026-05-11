import React from "react";
import {
  addressInput,
  countryList,
} from "../../assets/form-data/ShippingAddressInput";
import { Button, Form } from "react-bootstrap";

const ShippingAddressForm = ({
  form,
  handleOnChange,
  submitLabel = "Continue to payment",
}) => {
  return (
    <>
      {addressInput.map((item, index) => (
        <Form.Group className="checkout-form-field" controlId={item.name} key={index}>
          <Form.Label>{item.label}</Form.Label>
          <Form.Control
            type={item.type}
            name={item.name}
            value={form[item.name] || ""}
            onChange={handleOnChange}
            placeholder={item.placeholder}
            required={item.required}
          />
        </Form.Group>
      ))}
      <Form.Group className="checkout-form-field" controlId="country">
        <Form.Label>Country</Form.Label>
        <Form.Select
          name="country"
          value={form.country || ""}
          onChange={handleOnChange}
          required
        >
          <option value="">Select delivery country</option>
          {countryList.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button type="submit" className="checkout-primary-button">
        {submitLabel}
      </Button>
    </>
  );
};

export default ShippingAddressForm;
