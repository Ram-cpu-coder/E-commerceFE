import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { filterFunction } from "../../utils/filterProducts.js";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoAddCircleOutline, IoSearchOutline } from "react-icons/io5";
import {
  deleteProductAction,
  getAdminProductAction,
  getAdminProductNoPaginationAction,
} from "../../features/products/productActions.js";
import { setSelectedCategory } from "../../features/category/categorySlice.js";
import PaginationRounded from "../../components/pagination/PaginationRounded.jsx";
import AppDialog from "../../components/dialogs/AppDialog.jsx";

export const ProductTable = () => {
  const { selectedCategory, Categories } = useSelector(
    (state) => state.categoryInfo
  );
  const { products, allAdminProducts, productAdminPage } = useSelector(
    (state) => state.productInfo
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { form, handleOnChange, setForm } = useForm({
    searchQuery: "",
    category: selectedCategory?._id || "all",
    others: "newest",
  });

  const [displayProducts, setDisplayProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
  }, [dispatch, isFiltering, productAdminPage]);

  useEffect(() => {
    if (selectedCategory?._id) {
      setForm((prev) => ({ ...prev, category: selectedCategory._id }));
    }
  }, [selectedCategory, setForm]);

  useEffect(() => {
    const data = isFiltering ? allAdminProducts : products?.docs;
    setDisplayProducts(filterFunction(form, data || []));
  }, [form, products, allAdminProducts, isFiltering, productAdminPage]);

  const getCategoryNameById = (categoryId) => {
    const category = Categories.find((item) => item._id === categoryId);
    return category?.categoryName;
  };

  const handleOnDelete = (product) => {
    setProductToDelete(product);
  };

  const confirmProductDelete = async () => {
    if (!productToDelete?._id) return;
    await dispatch(deleteProductAction(productToDelete._id));
    setProductToDelete(null);
  };

  const handleGoBack = () => {
    dispatch(setSelectedCategory(null));
    navigate("/admin/categories");
  };

  return (
    <div className="admin-products-shell">
      <div className="admin-products-topline">
        {isFiltering ? (
          <p className="text-muted small mb-0">Showing filtered results</p>
        ) : (
          <p className="text-muted small mb-0">Showing latest catalog results</p>
        )}
        {selectedCategory?._id && (
          <Button className="admin-product-button ghost" onClick={handleGoBack}>
            Back to Categories
          </Button>
        )}
      </div>

      <Form className="admin-products-controls">
        <Row className="g-3 align-items-center">
          <Col lg={5}>
            <div className="admin-product-search">
              <IoSearchOutline aria-hidden />
              <Form.Control
                name="searchQuery"
                type="text"
                placeholder="Search products..."
                onChange={handleOnChange}
              />
            </div>
          </Col>
          <Col className="d-flex justify-content-lg-end gap-2 flex-wrap">
            {!selectedCategory?._id && (
              <Form.Group>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleOnChange}
                >
                  <option value="all">All Categories</option>
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
                <option value="toHigh">Price: Low to High</option>
                <option value="toLow">Price: High to Low</option>
                <option value="toZ">Name: A to Z</option>
                <option value="toA">Name: Z to A</option>
              </Form.Select>
            </Form.Group>
            <Link to="/admin/products/new" className="text-decoration-none">
              <Button className="admin-product-button">
                <IoAddCircleOutline aria-hidden /> Add New
              </Button>
            </Link>
          </Col>
        </Row>
      </Form>

      <div className="admin-products-table-wrap">
        <Table hover responsive className="admin-products-table mb-0">
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
              displayProducts.map((product) => (
                <tr key={product._id}>
                  <td className="py-3">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="admin-product-thumb"
                    />
                  </td>
                  <td>
                    <b>{product.name}</b>
                    <br />
                    <span className="text-muted small">{product.status}</span>
                  </td>
                  <td>
                    {getCategoryNameById(product.category) || "Uncategorized"}
                  </td>
                  <td>$ {Number(product.price || 0).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product?.stock === 0 ? (
                      <span className="admin-stock-pill danger">
                        Out of Stock
                      </span>
                    ) : product.stock < 30 ? (
                      <span className="admin-stock-pill warning">Low Stock</span>
                    ) : (
                      <span className="admin-stock-pill success">In Stock</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-product-actions">
                      <Link to={`edit/${product._id}`} title="Edit product">
                        <FaEdit aria-hidden />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOnDelete(product)}
                        title="Delete product"
                      >
                        <MdDelete aria-hidden />
                      </button>
                    </div>
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
      </div>

      {!isFiltering && (
        <div className="mt-2 d-flex justify-content-center w-100">
          <PaginationRounded
            totalPages={products.totalPages}
            page={productAdminPage}
            mode="product"
            client="admin"
          />
        </div>
      )}

      <AppDialog
        show={!!productToDelete}
        variant="danger"
        title="Delete product?"
        message={`This will remove "${
          productToDelete?.name || "this product"
        }" from the catalog. This action cannot be undone.`}
        cancelText="Keep Product"
        confirmText="Delete Product"
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmProductDelete}
      />
    </div>
  );
};
