import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Row,
} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { MdOutlineAddBox } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { filterFunction } from "../../utils/filterProducts.js";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  deleteProductAction,
  getAdminProductAction,
  getAdminProductNoPaginationAction,
} from "../../features/products/productActions.js";
import { setSelectedCategory } from "../../features/category/categorySlice.js";
import PaginationRounded from "../../components/pagination/PaginationRounded.jsx";

export const ProductTable = () => {
  const { selectedCategory } = useSelector((state) => state.categoryInfo);

  const { products, allAdminProducts, productAdminPage } = useSelector(
    (state) => state.productInfo
  );
  const { Categories } = useSelector((state) => state.categoryInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { form, handleOnChange, setForm } = useForm({
    searchQuery: "",
    category: selectedCategory?._id || "all",
    others: "newest",
  });

  const [displayProducts, setDisplayProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const isActive =
      form.searchQuery.trim() !== "" ||
      form.category !== "all" ||
      form.others !== "newest";

    setIsFiltering(isActive);
  }, [form]);

  useEffect(() => {
    const fetchAdminProducts = async () => {
      if (isFiltering) {
        await dispatch(getAdminProductNoPaginationAction());
      } else {
        await dispatch(getAdminProductAction());
      }
    };
    fetchAdminProducts();
  }, [isFiltering, productAdminPage]);

  useEffect(() => {
    if (selectedCategory?._id) {
      setForm((prev) => ({ ...prev, category: selectedCategory._id }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const data = isFiltering ? allAdminProducts : products?.docs;
    setDisplayProducts(filterFunction(form, data || []));
  }, [form, products, allAdminProducts, isFiltering, productAdminPage]);

  const getCategoryNameById = (categoryId) => {
    const category = Categories.find((item) => item._id === categoryId);
    return category?.categoryName;
  };
  // search Form handling
  const handleOnDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProductAction(_id));
    }
  };

  const handleGoBack = () => {
    dispatch(setSelectedCategory(null));
    navigate("/admin/categories");
  };

  return (
    <>
      {isFiltering && (
        <p className="text-muted small">Showing filtered results</p>
      )}
      {selectedCategory?._id && (
        <div className="mb-3 p-2 ">
          <Button variant="dark" onClick={handleGoBack}>
            ← Back to Categories
          </Button>
        </div>
      )}

      {/* controls */}
      <Form>
        <Row>
          <Col md={6}>
            <Form.Control
              name="searchQuery"
              type="text"
              placeholder="Search Products ..."
              onChange={handleOnChange}
            />
          </Col>
          <Col className="d-flex justify-content-center gap-1 gap-sm-2">
            {!selectedCategory?._id && (
              <Form.Group>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleOnChange}
                >
                  <option value="all">All Category</option>
                  {Categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group>
              <Form.Select
                name="others"
                value={form.others}
                onChange={handleOnChange}
              >
                <option value="newest">Newest</option>
                <option value="toHigh">Price : Low to High</option>
                <option value="toLow">Price : High to Low </option>
                <option value="toZ">Name : A to Z </option>
                <option value="toA">Name : Z to A </option>
              </Form.Select>
            </Form.Group>
            <div>
              <Link to="/admin/products/new">
                <Button variant="dark">
                  <MdOutlineAddBox /> Add New
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Form>

      <hr />
      {/* Table */}

      <Table hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts?.length > 0 ? (
            displayProducts?.map((product, i) => (
              <tr key={product._id}>
                <td style={{ maxWidth: "50px" }} className="py-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    height={50}
                    width={50}
                    className="rounded d-block mx-auto"
                  />
                </td>
                <td>
                  <b>{product.name}</b> <br /> {product.status}
                </td>
                <td>
                  {getCategoryNameById(product.category) || "Uncategorized"}
                </td>
                <td>$ {product.price}</td>
                <td>{product.stock}</td>
                <td className="text-white text-center ">
                  {product?.stock === 0 ? (
                    <div className="rounded bg-danger">Out of Stock</div>
                  ) : product.stock < 30 ? (
                    <div className="rounded bg-warning">Low in Stock</div>
                  ) : (
                    <div className="rounded bg-dark ">In Stock</div>
                  )}
                </td>
                <td>
                  <DropdownButton variant="light" title="">
                    <Dropdown.Item as={Link} to={`edit/${product._id}`}>
                      <FaEdit /> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleOnDelete(product._id)}>
                      <MdDelete /> Delete
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                <div>
                  <strong>No products found</strong>
                  <div className="text-muted small">
                    Try adjusting your filters or search keywords.
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {isFiltering ? (
        ""
      ) : (
        <div className="mt-2 d-flex justify-content-center w-100">
          <PaginationRounded
            totalPages={products.totalPages}
            page={productAdminPage}
            mode="product"
            client="admin"
          />
        </div>
      )}
    </>
  );
};
