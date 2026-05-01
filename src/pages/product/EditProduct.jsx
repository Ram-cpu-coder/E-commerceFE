import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { UserLayout } from "../../components/layouts/UserLayout";
import CustomInput from "../../components/custom inputs/CustomInput";
import useForm from "../../hooks/useForm";
import { productInputs } from "../../assets/form-data/ProductInput";
import { MdDelete } from "react-icons/md";
import { updateProductAction } from "../../features/products/productActions";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";

const EditProduct = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const { products } = useSelector((state) => state.productInfo);
  const { Categories } = useSelector((state) => state.categoryInfo);

  const selectedProduct = products?.docs?.find((item) => item._id === _id);
  const { form, handleOnChange, setForm } = useForm(selectedProduct || {});

  const [images, setImages] = useState([]); // new files only
  const [oldImages, setOldImages] = useState([]); // remaining old URLs
  const [previews, setPreviews] = useState([]); // combined for display

  useEffect(() => {
    if (selectedProduct) {
      const { _id, images, ratings, reviews, ...cleanedProduct } =
        selectedProduct;

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
      alert("You can only upload up to 4 images total.");
      imageRef.current.value = "";
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleOnImageDelete = (index) => {
    const toDelete = previews[index];

    // If it's an old image (URL), remove from oldImages
    if (toDelete.startsWith("http")) {
      setOldImages((prev) => prev.filter((url) => url !== toDelete));
    } else {
      // If it's a new file, remove the corresponding file
      const newFileStartIndex = oldImages.length;
      const fileIndex = index - newFileStartIndex;
      setImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    // Remove from previews
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
      <div className="mt-5">
        <h4 className="py-4">Edit Product</h4>
        <Form onSubmit={handleOnSubmit}>
          {productInputs.map((input, i) => (
            <CustomInput
              key={i}
              {...input}
              onChange={handleOnChange}
              value={form[input.name] || ""}
            />
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={form.category || ""}
              onChange={handleOnChange}
            >
              <option value="">Select category</option>
              {Categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Images</Form.Label>
            <Form.Control
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              ref={imageRef}
            />
          </Form.Group>

          {previews.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {previews.map((src, index) => (
                <div key={index} className="position-relative">
                  <MdDelete
                    onClick={() => handleOnImageDelete(index)}
                    className="position-absolute end-0 text-danger cursor-pointer"
                  />
                  <img
                    src={src}
                    alt="preview"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="d-grid">
            <Button type="submit">Update Product</Button>
          </div>
        </Form>
      </div>
    </UserLayout>
  );
};

export default EditProduct;
