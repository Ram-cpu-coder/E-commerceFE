import React from "react";
import { Button } from "react-bootstrap";

const AddedProductsSection = ({
  selectedProducts,
  setShowProductModal,
  toggleProduct,
}) => {
  return (
    <div className="mb-4">
      <Button variant="secondary" onClick={() => setShowProductModal(true)}>
        Add Products ({selectedProducts?.length})
      </Button>
      <div
        className="d-flex flex-wrap gap-2 mt-2 border p-2"
        style={{ minHeight: "100px" }}
      >
        {selectedProducts?.map((product) => (
          <span
            key={product._id}
            className="badge bg-dark d-flex align-items-center"
            style={{ maxHeight: "25px" }}
          >
            {product.name.length > 30
              ? product.name.slice(0, 30) + "..."
              : product.name}
            &nbsp;
            <span
              style={{ cursor: "pointer", fontSize: "15px" }}
              onClick={() => toggleProduct(product)}
            >
              &times;
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AddedProductsSection;
