const ImageSection = ({ item, isOpen, toggleAccordion }) => {
  return (
    <div className="order-card-products">
      <div className="order-products-summary">
        <div className="order-product-stack">
          {item?.products?.map((product, index) => {
            return (
              <div className="order-product-thumb" key={index}>
                <img
                  src={product.images?.[0] || product.images}
                  alt={product.name || "Ordered product"}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png";
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="order-products-meta">
          <div className="order-updated-card">
            <span>Updated</span>
            <strong>{new Date(item?.updatedAt).toLocaleDateString()}</strong>
          </div>
          {toggleAccordion && (
            <button
              type="button"
              className="order-expand-button"
              onClick={() => toggleAccordion(item._id.toString())}
            >
              {isOpen ? "Hide items" : "View items"}
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="order-expanded-products">
          {item?.products?.map((product, index) => (
            <div key={`${product._id || product.name}-${index}`}>
              <span>{product.name}</span>
              <strong>x{product.quantity}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSection;
