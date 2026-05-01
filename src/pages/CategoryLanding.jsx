import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import ProductCard from "../components/cards/ProductCard";
import CategoryBar from "../components/layouts/CategoryBar";
import CategoryList from "../components/layouts/CategoryList";
import { useParams, Link } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import { RxReset } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategory } from "../features/category/categorySlice";
import { getAllCategoriesAction } from "../features/category/CategoryActions";
import { getPublicProductAction } from "../features/products/productActions";
import { setProductCustomerPage } from "../features/products/productSlice";

const CategoryLanding = () => {
  const dispatch = useDispatch();
  const { categoryName } = useParams();
  const { publicProducts } = useSelector((state) => state.productInfo);
  const { selectedCategory, Categories } = useSelector(
    (state) => state.categoryInfo
  );

  const [sortOrder, setSortOrder] = useState(""); // "" | "asc" | "desc"
  const page = 1;
  dispatch(setProductCustomerPage(page));

  const fetchPublicProducts = async () => {
    if (publicProducts?.docs?.length === 0) {
      await dispatch(getPublicProductAction());
    }
  };

  useEffect(() => {
    if (Categories.length === 0) {
      dispatch(getAllCategoriesAction());
    }
    fetchPublicProducts();

    if (!selectedCategory.categoryName && Categories.length > 0) {
      const category = Categories.find(
        (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
      );
      if (category) {
        dispatch(setSelectedCategory(category));
      }
    }
  }, [
    dispatch,
    Categories,
    categoryName,
    selectedCategory.categoryName,
    publicProducts?.docs,
  ]);
  let productsByCategory = publicProducts?.docs?.filter((product) => {
    // Filtered and Sorted Products
    return product.category === selectedCategory._id;
  });

  if (sortOrder === "asc") {
    productsByCategory = [...productsByCategory].sort(
      (a, b) => a.price - b.price
    );
  } else if (sortOrder === "desc") {
    productsByCategory = [...productsByCategory].sort(
      (a, b) => b.price - a.price
    );
  }

  const handleFilter = () => {
    setSortOrder("asc");
  };

  const handleReset = () => {
    setSortOrder("");
  };

  return (
    <Container fluid className="px-3 px-sm-4">
      <CategoryBar />
      <CategoryList />

      {/* Header Section */}
      <Row className="pt-3 bg-light">
        <Col md={4}>
          <div className="p-2 p-sm-4 d-flex flex-column justify-content-center h-100">
            <h1 className="fw-bold">Check this out</h1>
            <h3>Display title: {selectedCategory?.displaytitle}</h3>
            <Button variant="dark" className="mt-2">
              Buy now
            </Button>
          </div>
        </Col>
        <Col
          md={8}
          className="text-center d-flex align-items-center justify-content-center"
        >
          <img
            className="img-fluid"
            src={selectedCategory?.featureImageUrl}
            alt="category"
            style={{ maxHeight: "200px", objectFit: "cover" }}
          />
        </Col>
      </Row>

      {/* Filter Section */}
      <Row className="mt-4">
        <Col xs={6}>
          <h5>{productsByCategory?.length} results found</h5>
        </Col>
        <Col xs={6} className="d-flex justify-content-end align-items-start">
          <div className="d-flex flex-column flex-sm-row gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleFilter}
            >
              <CiFilter /> Sort by Price ↑
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleReset}>
              <RxReset /> Reset Filter
            </Button>
          </div>
        </Col>
      </Row>

      {/* Product Cards Section */}
      <Row className="py-5 g-3">
        {productsByCategory?.length > 0 ? (
          productsByCategory.map((item, index) => (
            <Col xs={6} md={4} lg={3} key={index}>
              <Link
                className="text-decoration-none text-dark"
                to={`/${item._id}`}
              >
                <ProductCard item={item} />
              </Link>
            </Col>
          ))
        ) : (
          <Col>
            <p>No products available in this category.</p>
          </Col>
        )}
      </Row>

      {/* Footer */}
      <div className="bg-light text-center p-2">
        <p>See all results</p>
      </div>
    </Container>
  );
};

export default CategoryLanding;
