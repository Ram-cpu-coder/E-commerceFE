import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { UserLayout } from "../../../components/layouts/UserLayout";
import { MdDelete } from "react-icons/md";
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
      <div className="mt-5">
        <h4 className="py-4">Create New Category</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Display Title</Form.Label>
            <Form.Control
              name="displaytitle"
              value={form.displaytitle}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Category Image */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Category Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleCategoryImageChange}
              ref={categoryImageRef}
            />
            {categoryImagePreview && (
              <div className="position-relative mt-2">
                <MdDelete
                  onClick={() => {
                    setCategoryImageFile(null);
                    setCategoryImagePreview("");
                    categoryImageRef.current.value = "";
                  }}
                  className="position-absolute end-0 text-danger cursor-pointer"
                />
                <img
                  src={categoryImagePreview}
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}
          </Form.Group>

          {/* Feature Image */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Feature Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFeatureImageChange}
              ref={featureImageRef}
            />
            {featureImagePreview && (
              <div className="position-relative mt-2">
                <MdDelete
                  onClick={() => {
                    setFeatureImageFile(null);
                    setFeatureImagePreview("");
                    featureImageRef.current.value = "";
                  }}
                  className="position-absolute  text-danger cursor-pointer"
                />
                <img
                  src={featureImagePreview}
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}
          </Form.Group>

          <div className="d-grid">
            <Button type="submit">Create Category</Button>
          </div>
        </Form>
      </div>
    </UserLayout>
  );
};

export default AddCategory;
