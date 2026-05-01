import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { UserLayout } from "../../components/layouts/UserLayout";
import { setMenu } from "../../features/user/userSlice";
import { fetchFeatureBannerAction } from "../../features/featureBanner/featureBannerAction";
import { getActiveProductAction } from "../../features/products/productActions";

import { Button, Col, Form, Row, Table } from "react-bootstrap";
import useForm from "../../hooks/useForm";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { filterFunction } from "../../utils/filterProducts";

const ViewProductsListed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useParams();
  const { featureBanner } = useSelector((state) => state.featureBannerInfo);
  const { allActiveProducts } = useSelector((state) => state.productInfo);
  const { Categories, selectedCategory } = useSelector(
    (state) => state.categoryInfo
  );

  const { form, handleOnChange, setForm } = useForm({
    searchQuery: "",
    category: selectedCategory?._id || "all",
    others: "newest",
  });

  const [isFiltering, setIsFiltering] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);

  const selectedBanner = featureBanner?.find((item) => item._id === _id);
  const productIdsFromSelectedBanner = selectedBanner?.products.map(
    (item) => item
  );

  const listedProducts = allActiveProducts?.filter((item) =>
    productIdsFromSelectedBanner?.includes(item._id)
  );

  const getCategoryNameById = (categoryId) => {
    const category = Categories.find((item) => item._id === categoryId);
    return category?.categoryName;
  };

  useEffect(() => {
    dispatch(setMenu("Banners"));
  }, []);

  useEffect(() => {
    dispatch(fetchFeatureBannerAction());
    dispatch(getActiveProductAction());
  }, []);

  useEffect(() => {
    setDisplayProducts(filterFunction(form, listedProducts || []));
  }, [form]);

  useEffect(() => {
    const isActive =
      form.searchQuery.trim() !== "" ||
      form.category !== "all" ||
      form.others !== "newest";

    setIsFiltering(isActive);
  }, [form]);

  return (
    <UserLayout pageTitle="Listed Products">
      <BreadCrumbsAdmin />
      <>
        {selectedBanner?._id && (
          <div className="mb-3 p-2 ">
            <Button variant="dark" onClick={() => navigate("/admin/banner")}>
              ← Back to Banner
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
              {selectedBanner?._id && (
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
            </Col>
          </Row>
        </Form>

        <hr />
        {/* Table */}
        {isFiltering && (
          <p className="text-muted small">Showing filtered results</p>
        )}
        <Table hover responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts?.length > 0 ? (
              displayProducts?.map((product) => (
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

        {/* {isFiltering ? (
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
        )} */}
      </>
      {/* ); */}
    </UserLayout>
  );
};

export default ViewProductsListed;
