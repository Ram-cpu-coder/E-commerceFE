import React, { useEffect, useRef, useState } from "react";
import { UserLayout } from "../../components/layouts/UserLayout";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { productInputs } from "../../assets/form-data/ProductInput";
import CustomInput from "../../components/custom inputs/CustomInput";
import useForm from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductAction,
  getPublicProductAction,
} from "../../features/products/productActions";
import { MdDelete } from "react-icons/md";
import {
  IoArrowBackOutline,
  IoCubeOutline,
  IoImagesOutline,
  IoSaveOutline,
} from "react-icons/io5";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { setSelectedCategory } from "../../features/category/categorySlice";
import AppDialog from "../../components/dialogs/AppDialog";

const initialState = { status: "inactive" };

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, handleOnChange } = useForm(initialState);
  const { Categories, selectedCategory } = useSelector(
    (state) => state.categoryInfo,
  );

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dialog, setDialog] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (selectedCategory?._id) {
      handleOnChange({
        target: {
          name: "category",
          value: selectedCategory._id,
        },
      });
    }
  }, [selectedCategory]);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length + images.length <= 4) {
      const updatedFiles = [...images, ...newFiles];
      setImages(updatedFiles);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setDialog({
        title: "Image limit reached",
        message: "You can only upload up to 4 product images.",
      });
      imageRef.current.value = "";
    }
  };

  const handleOnImageDelete = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    imageRef.current.value = null;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    const success = await dispatch(createProductAction(formData));
    if (success) {
      getPublicProductAction();
      navigate("/admin/products");
    }
  };

  return (
    <UserLayout
      pageTitle={
        selectedCategory?.categoryName
          ? `${selectedCategory?.categoryName}`
          : "Add New Product"
      }
    >
      <BreadCrumbsAdmin />
      <div className="mb-3">
        <Link
          to={selectedCategory?._id ? "/admin/categories" : "/admin/products"}
          className="text-decoration-none"
        >
          <Button
            className="admin-form-secondary"
            onClick={() => {
              if (selectedCategory?._id) {
                dispatch(setSelectedCategory(null));
              }
            }}
          >
            <IoArrowBackOutline />
            Back
          </Button>
        </Link>
      </div>

      <section className="admin-form-page">
        <div className="admin-form-hero">
          <div className="admin-form-hero-icon">
            <IoCubeOutline />
          </div>
          <div>
            <span className="admin-form-kicker">Product Studio</span>
            <h2>Add a New Product</h2>
            <p>
              Build a polished listing with pricing, stock, category, and up to
              four gallery images.
            </p>
          </div>
        </div>

        <Form onSubmit={handleOnSubmit} className="admin-form-card">
          <div className="admin-form-grid">
            {productInputs?.map((input) => (
              <CustomInput
                key={input.name}
                {...input}
                fieldClassName={input.name === "description" ? "full-span" : ""}
                onChange={handleOnChange}
                value={form[input.name] || ""}
              />
            ))}

            <Form.Group className="admin-form-field" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                className="admin-form-control"
                name="category"
                value={form.category || ""}
                onChange={handleOnChange}
                required
                disabled={!!selectedCategory?._id}
              >
                <option value="">Select product category</option>
                {Categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group
              className="admin-form-field admin-form-upload full-span"
              controlId="images"
            >
              <div className="admin-form-upload-copy">
                <IoImagesOutline />
                <div>
                  <Form.Label>Product Gallery</Form.Label>
                  <p>Upload clear JPG or PNG images. Maximum 4 photos.</p>
                </div>
              </div>
              <Form.Control
                className="admin-form-control"
                type="file"
                name="images"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                ref={imageRef}
              />
            </Form.Group>
          </div>

          {previews.length > 0 && (
            <div className="admin-form-preview-grid">
              {previews.map((src, index) => (
                <div className="admin-form-preview" key={`${src}-${index}`}>
                  <button
                    type="button"
                    className="admin-form-delete"
                    onClick={() => handleOnImageDelete(index)}
                    aria-label="Remove preview"
                  >
                    <MdDelete />
                  </button>
                  <img src={src} alt={`Product preview ${index + 1}`} />
                </div>
              ))}
            </div>
          )}

          <div className="admin-form-actions">
            <Button type="submit" className="admin-form-primary">
              <IoSaveOutline />
              Submit Product
            </Button>
          </div>
        </Form>
      </section>

      <AppDialog
        show={!!dialog}
        variant="warning"
        title={dialog?.title}
        message={dialog?.message}
        confirmOnly
        confirmText="Got It"
        onConfirm={() => setDialog(null)}
      />
    </UserLayout>
  );
};

export default AddNewProduct;
