import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import {
  IoGridOutline,
  IoImagesOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { UserLayout } from "../../../components/layouts/UserLayout";
import BreadCrumbsAdmin from "../../../components/breadCrumbs/BreadCrumbsAdmin";
import { updateCategoryAction } from "../../../features/category/CategoryActions";

const EditCategory = () => {
  const { selectedCategory } = useSelector((state) => state.categoryInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryImageRef = useRef(null);
  const featureImageRef = useRef(null);

  const [form, setForm] = useState({
    categoryName: "",
    displaytitle: "",
    featureImageUrl: "",
    categoryImage: "",
  });

  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [featureImagePreview, setFeatureImagePreview] = useState("");

  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [featureImageFile, setFeatureImageFile] = useState(null);

  useEffect(() => {
    if (selectedCategory?._id) {
      const { _id, __v, ...cleaned } = selectedCategory;
      setForm(cleaned);
      setCategoryImagePreview(cleaned.categoryImage || "");
      setFeatureImagePreview(cleaned.featureImageUrl || "");
    }
  }, [selectedCategory]);

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

  const handleDeleteCategoryImage = () => {
    setCategoryImageFile(null);
    setCategoryImagePreview("");
    setForm((prev) => ({ ...prev, categoryImage: "" }));
    categoryImageRef.current.value = "";
  };

  const handleDeleteFeatureImage = () => {
    setFeatureImageFile(null);
    setFeatureImagePreview("");
    setForm((prev) => ({ ...prev, featureImageUrl: "" }));
    featureImageRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (categoryImageFile) {
      formData.append("newCategoryImage", categoryImageFile);
    }

    if (featureImageFile) {
      formData.append("newFeatureImage", featureImageFile);
    }

    const result = await dispatch(
      updateCategoryAction(selectedCategory._id, formData),
    );
    if (result === "success") {
      navigate("/admin/categories");
    }
  };

  return (
    <UserLayout pageTitle={`Edit ${selectedCategory?.categoryName} Category`}>
      <BreadCrumbsAdmin />
      <section className="admin-form-page">
        <div className="admin-form-hero">
          <div className="admin-form-hero-icon">
            <IoGridOutline />
          </div>
          <div>
            <span className="admin-form-kicker">Category Editor</span>
            <h2>Edit Category</h2>
            <p>
              Keep the category title, card image, and feature artwork aligned
              with the storefront.
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
                  <p>Replace or remove the card image for this category.</p>
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
                      onClick={handleDeleteCategoryImage}
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
                  <p>Replace or remove the wide feature visual.</p>
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
                      onClick={handleDeleteFeatureImage}
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
              <IoRefreshOutline />
              Update Category
            </Button>
          </div>
        </Form>
      </section>
    </UserLayout>
  );
};

export default EditCategory;
