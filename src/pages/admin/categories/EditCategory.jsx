import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
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
      const { _id, createdAt, updatedAt, __v, ...cleaned } = selectedCategory;
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
      updateCategoryAction(selectedCategory._id, formData)
    );
    if (result === "success") {
      navigate("/admin/categories");
    }
  };

  return (
    <UserLayout pageTitle={`Edit ${selectedCategory?.categoryName} Category`}>
      <BreadCrumbsAdmin />
      <div className="">
        <h4 className="py-4">Edit Category</h4>
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

          {/* Category Image Upload */}
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
                  onClick={handleDeleteCategoryImage}
                  className="position-absolute  text-danger cursor-pointer"
                />
                <img
                  src={categoryImagePreview}
                  alt="Category Preview"
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

          {/* Feature Image Upload */}
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
                  onClick={handleDeleteFeatureImage}
                  className="position-absolute end-0 text-danger cursor-pointer"
                />
                <img
                  src={featureImagePreview}
                  alt="Feature Preview"
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
            <Button type="submit">Update Category</Button>
          </div>
        </Form>
      </div>
    </UserLayout>
  );
};

export default EditCategory;
