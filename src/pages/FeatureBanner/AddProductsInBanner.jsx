import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";

const AddProductsInBanner = ({
  toggleProduct,
  setShowProductModal,
  showProductModal,
  selectedProducts,
}) => {
  const { Categories } = useSelector((state) => state.categoryInfo);
  const { allActiveProducts } = useSelector((state) => state.productInfo);

  const [categories, setCategories] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const filterProductsWithCategories = (
    keyword,
    Categories,
    allActiveProducts
  ) => {
    const foundCategoryIds = Categories?.filter((cat) =>
      cat.categoryName.toLowerCase().includes(keyword.toLowerCase())
    ).map((item) => item._id);

    // look for the products having that category id
    const products = allActiveProducts?.filter((item) =>
      foundCategoryIds.includes(item.category)
    );
    setFilteredProducts(products);
  };

  useEffect(() => {
    setFilteredProducts(allActiveProducts);
  }, [allActiveProducts]);

  return (
    <Modal
      show={showProductModal}
      onHide={() => setShowProductModal(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Select Products</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3 gap-2">
          <FormControl
            placeholder="Search Products By Name"
            value={searchTerm}
            className="w-50"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilteredProducts(
                allActiveProducts?.filter((product) =>
                  product.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
          <Form.Group style={{ marginInlineEnd: "auto", width: "40%" }}>
            <Form.Select
              value={categories}
              onChange={(e) => {
                setCategories(e.target.value);
                filterProductsWithCategories(
                  e.target.value,
                  Categories,
                  allActiveProducts
                );
              }}
            >
              <option value="" disabled>
                By Categories
              </option>
              {Categories.map((item) => {
                return (
                  <option value={item.categoryName}>{item.categoryName}</option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </InputGroup>
        <Table bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>Product Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts?.map((product) => (
              <tr key={product._id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    id={`check-${product._id}`}
                    checked={selectedProducts?.some(
                      (p) => p._id === product._id
                    )}
                    onChange={() => toggleProduct(product)}
                  />
                </td>
                <td>
                  <label htmlFor={`check-${product._id}`}>{product.name}</label>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowProductModal(false)}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProductsInBanner;
