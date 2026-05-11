import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { UserLayout } from "../../components/layouts/UserLayout";
import CustomInput from "../../components/custom inputs/CustomInput";
import useForm from "../../hooks/useForm";
import { productInputs } from "../../assets/form-data/ProductInput";
import { MdDelete } from "react-icons/md";
import {
  IoCubeOutline,
  IoImagesOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { updateProductAction } from "../../features/products/productActions";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import AppDialog from "../../components/dialogs/AppDialog";

const EditProduct = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const { products } = useSelector((state) => state.productInfo);
  const { Categories } = useSelector((state) => state.categoryInfo);

  const selectedProduct = products?.docs?.find((item) => item._id === _id);
  const { form, handleOnChange, setForm } = useForm(selectedProduct || {});

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      const { images, ...cleanedProduct } = selectedProduct;
      delete cleanedProduct._id;
      delete cleanedProduct.ratings;
      delete cleanedProduct.reviews;

      setForm(cleanedProduct);
      if (images?.length) {
        setOldImages(images);
        setPreviews(images);
        setImages([]);
      }
    }
  }, [selectedProduct]);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = oldImages.length + images.length + newFiles.length;

    if (total > 4) {
      setDialog({
        title: "Image limit reached",
        message: "You can only upload up to 4 product images total.",
      });
      imageRef.current.value = "";
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleOnImageDelete = (index) => {
    const toDelete = previews[index];

    if (oldImages.includes(toDelete)) {
      setOldImages((prev) => prev.filter((url) => url !== toDelete));
    } else {
      const newFileStartIndex = oldImages.length;
      const fileIndex = index - newFileStartIndex;
      setImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setPreviews((prev) => prev.filter((_, i) => i !== index));
    imageRef.current.value = null;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((file) => formData.append("images", file));
    formData.append("oldImages", JSON.stringify(oldImages));

    const result = await dispatch(updateProductAction(_id, formData));
    if (result === "success") {
      navigate("/admin/products");
    }
  };

  return (
    <UserLayout pageTitle="Edit Product">
      <BreadCrumbsAdmin />
      <section className="admin-form-page">
        <div className="admin-form-hero">
          <div className="admin-form-hero-icon">
            <IoCubeOutline />
          </div>
          <div>
            <span className="admin-form-kicker">Inventory Editor</span>
            <h2>Edit Product</h2>
            <p>
              Refresh listing details, update stock, and manage the product
              gallery without losing existing images.
            </p>
          </div>
        </div>

        <Form onSubmit={handleOnSubmit} className="admin-form-card">
          <div className="admin-form-grid">
            {productInputs.map((input) => (
              <CustomInput
                key={input.name}
                {...input}
                fieldClassName={input.name === "description" ? "full-span" : ""}
                onChange={handleOnChange}
                value={form[input.name] || ""}
              />
            ))}

            <Form.Group className="admin-form-field">
              <Form.Label>Category</Form.Label>
              <Form.Select
                className="admin-form-control"
                name="category"
                value={form.category || ""}
                onChange={handleOnChange}
              >
                <option value="">Select product category</option>
                {Categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="admin-form-field admin-form-upload full-span">
              <div className="admin-form-upload-copy">
                <IoImagesOutline />
                <div>
                  <Form.Label>Product Gallery</Form.Label>
                  <p>Add new images or remove existing ones. Maximum 4 photos.</p>
                </div>
              </div>
              <Form.Control
                className="admin-form-control"
                type="file"
                name="images"
                multiple
                accept="image/*"
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
              <IoRefreshOutline />
              Update Product
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

export default EditProduct;
