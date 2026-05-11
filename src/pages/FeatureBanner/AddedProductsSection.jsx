import React from "react";
import { Button } from "react-bootstrap";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";

const AddedProductsSection = ({
  selectedProducts,
  setShowProductModal,
  toggleProduct,
}) => {
  return (
    <div className="admin-form-selected-products">
      <div className="admin-form-selected-top">
        <div>
          <strong>Linked Products</strong>
          <span>{selectedProducts?.length || 0} selected</span>
        </div>
        <Button
          type="button"
          className="admin-form-secondary compact"
          onClick={() => setShowProductModal(true)}
        >
          <IoAddOutline />
          Add Products
        </Button>
      </div>
      <div className="admin-form-product-chip-list">
        {(selectedProducts?.length || 0) <= 0 && (
          <span className="admin-form-empty-chip">No products linked yet</span>
        )}
        {selectedProducts?.map((product) => (
          <button
            type="button"
            key={product._id}
            className="admin-form-product-chip"
            onClick={() => toggleProduct(product)}
            title="Remove product"
          >
            <span>
              {product.name.length > 30
                ? product.name.slice(0, 30) + "..."
                : product.name}
            </span>
            <IoCloseOutline />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddedProductsSection;
