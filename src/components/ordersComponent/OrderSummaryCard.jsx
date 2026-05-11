const CartCard = ({ item }) => {
  const { images, _id, name, quantity, totalAmount, price } = item;
  const unitPrice = Number(price || 0);
  const lineTotal = Number(totalAmount || unitPrice * quantity || 0);

  return (
    <article className="checkout-summary-item">
      <img src={images?.[0]} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>Qty {quantity} x $ {unitPrice.toFixed(2)}</p>
      </div>
      <strong>$ {lineTotal.toFixed(2)}</strong>
    </article>
  );
};

export default CartCard;
