import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { UserLayout } from "../../../components/layouts/UserLayout";
import { MdDelete } from "react-icons/md";
import {
  IoGridOutline,
  IoImagesOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { createCategoryAction } from "../../../features/category/CategoryActions";
import BreadCrumbsAdmin from "../../../components/breadCrumbs/BreadCrumbsAdmin";

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryImageRef = useRef(null);
  const featureImageRef = useRef(null);

  const [form, setForm] = useState({
    categoryName: "",
    displaytitle: "",
  });

  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [featureImageFile, setFeatureImageFile] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [featureImagePreview, setFeatureImagePreview] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCategoryImageFile(file);
    setCategoryImagePreview(URL.createObjectURL(file));
  };

  const handleFeatureImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFeatureImageFile(file);
    setFeatureImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("categoryName", form.categoryName);
    formData.append("displaytitle", form.displaytitle);

    if (categoryImageFile) {
      formData.append("categoryImage", categoryImageFile);
    }

    if (featureImageFile) {
      formData.append("featureImage", featureImageFile);
    }

    const result = await dispatch(createCategoryAction(formData));
    if (result === "success") {
      navigate("/admin/categories");
    }
  };

  return (
    <UserLayout pageTitle="Add Category">
      <BreadCrumbsAdmin />
      <section className="admin-form-page">
        <div className="admin-form-hero">
          <div className="admin-form-hero-icon">
            <IoGridOutline />
          </div>
          <div>
            <span className="admin-form-kicker">Catalog Structure</span>
            <h2>Create Category</h2>
            <p>
              Add a category with sharp imagery for listing cards and featured
              storefront sections.
            </p>
          </div>
        </div>

        <Form onSubmit={handleSubmit} className="admin-form-card">
          <div className="admin-form-grid">
            <Form.Group className="admin-form-field">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                className="admin-form-control"
                name="categoryName"
                value={form.categoryName}
                onChange={handleChange}
                placeholder="e.g. Modern Living"
                required
              />
            </Form.Group>

            <Form.Group className="admin-form-field">
              <Form.Label>Display Title</Form.Label>
              <Form.Control
                className="admin-form-control"
                name="displaytitle"
                value={form.displaytitle}
                onChange={handleChange}
                placeholder="e.g. Elevated pieces for everyday spaces"
              />
            </Form.Group>

            <Form.Group className="admin-form-field admin-form-upload">
              <div className="admin-form-upload-copy">
                <IoImagesOutline />
                <div>
                  <Form.Label>Category Image</Form.Label>
                  <p>Square or portrait image used on category cards.</p>
                </div>
              </div>
              <Form.Control
                className="admin-form-control"
                type="file"
                accept="image/*"
                onChange={handleCategoryImageChange}
                ref={categoryImageRef}
              />
              {categoryImagePreview && (
                <div className="admin-form-preview-grid compact">
                  <div className="admin-form-preview">
                    <button
                      type="button"
                      className="admin-form-delete"
                      onClick={() => {
                        setCategoryImageFile(null);
                        setCategoryImagePreview("");
                        categoryImageRef.current.value = "";
                      }}
                      aria-label="Remove category image"
                    >
                      <MdDelete />
                    </button>
                    <img src={categoryImagePreview} alt="Category preview" />
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="admin-form-field admin-form-upload">
              <div className="admin-form-upload-copy">
                <IoImagesOutline />
                <div>
                  <Form.Label>Feature Image</Form.Label>
                  <p>Wide visual for category highlights and banners.</p>
                </div>
              </div>
              <Form.Control
                className="admin-form-control"
                type="file"
                accept="image/*"
                onChange={handleFeatureImageChange}
                ref={featureImageRef}
              />
              {featureImagePreview && (
                <div className="admin-form-preview-grid compact">
                  <div className="admin-form-preview">
                    <button
                      type="button"
                      className="admin-form-delete"
                      onClick={() => {
                        setFeatureImageFile(null);
                        setFeatureImagePreview("");
                        featureImageRef.current.value = "";
                      }}
                      aria-label="Remove feature image"
                    >
                      <MdDelete />
                    </button>
                    <img src={featureImagePreview} alt="Feature preview" />
                  </div>
                </div>
              )}
            </Form.Group>
          </div>

          <div className="admin-form-actions">
            <Button type="submit" className="admin-form-primary">
              <IoSaveOutline />
              Create Category
            </Button>
          </div>
        </Form>
      </section>
    </UserLayout>
  );
};

export default AddCategory;
