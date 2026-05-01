const ImageSection = ({ item, isOpen, toggleAccordion }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex gap-2 flex-wrap">
        {item?.products?.map((product, index) => {
          return (
            <img
              src={product.images}
              alt=""
              srcSet=""
              className="border"
              key={index}
              style={{ height: "50px", width: "50px" }}
            />
          );
        })}
      </div>
      <div className="d-flex gap-2 align-items-center">
        <div className="border p-3">
          <b>Updated At:</b> {new Date(item?.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
