const ItemPriceQuantity = ({ product }) => {
  return (
    <div className="d-flex flex-column">
      <b className="">{product.name}</b>
      <p className="mb-0 d-flex gap-2">
        Quantity:
        <>&nbsp; {product.quantity}</>
      </p>
      <p className="mb-0">Unit Price: {product.amount_total}</p>
    </div>
  );
};

export default ItemPriceQuantity;
