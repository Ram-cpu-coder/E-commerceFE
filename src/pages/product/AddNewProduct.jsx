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
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";
import { setSelectedCategory } from "../../features/category/categorySlice";
const initialState = {};

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, handleOnChange } = useForm(initialState);
  const { Categories, selectedCategory } = useSelector(
    (state) => state.categoryInfo
  );

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
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
    // Combine existing and new images
    if (newFiles.length + images.length <= 4) {
      const updatedFiles = [...images, ...newFiles];
      setImages(updatedFiles);
      // Generate and append previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      alert("you can only upload 4 images, ");
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
    // Append images
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
        >
          <Button
            variant="secondary"
            onClick={() => {
              if (selectedCategory?._id) {
                dispatch(setSelectedCategory(null));
              }
            }}
          >
            ← Back
          </Button>
        </Link>
      </div>

      <div className="mt-5">
        {/* form to add new products */}

        <h4 className="py-4 "> Add new Products Here </h4>
        <Form onSubmit={handleOnSubmit}>
          {productInputs?.map((input, i) => (
            <CustomInput
              key={i}
              {...input}
              onChange={handleOnChange}
            ></CustomInput>
          ))}

          {/* Category */}
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleOnChange}
              required
              disabled={!!selectedCategory?._id}
            >
              <option value="">Select Category</option>
              {Categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Image Upload */}
          <Form.Group className="mb-3" controlId="images">
            <Form.Label>Upload Images</Form.Label>
            <Form.Control
              type="file"
              name="images"
              multiple
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
              ref={imageRef}
            />
          </Form.Group>

          {/* Image Previews */}
          {previews.length > 0 && (
            <>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {previews.map((src, index) => (
                  <div className="d-flex flex-column position-relative ">
                    <MdDelete
                      onClick={() => handleOnImageDelete(index)}
                      className="cursor-pointer text-danger position-absolute end-0 "
                    />
                    <img
                      key={index}
                      src={src}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="d-grid">
            <Button type="submit"> Submit new Product </Button>
          </div>
        </Form>
      </div>
    </UserLayout>
  );
};

export default AddNewProduct;
