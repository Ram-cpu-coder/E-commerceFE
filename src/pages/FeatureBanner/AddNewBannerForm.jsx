import React, { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import {
  IoCloseOutline,
  IoImagesOutline,
  IoMegaphoneOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  createFeatureBannerAction,
  fetchFeatureBannerAction,
} from "../../features/featureBanner/featureBannerAction";
import AddProductsInBanner from "./AddProductsInBanner";
import AddedProductsSection from "./AddedProductsSection";
import useFeatureBannerForm from "../../hooks/useFeatureBannerForm";

const AddNewBannerForm = ({ form, handleOnChange, setIsCreatingBanner }) => {
  const dispatch = useDispatch();
  const {
    featureBannerImageFile,
    featureBannerImagePreview,
    featureBannerImageRef,
    handleFeatureBannerImageChange,
    toggleProduct,
    clearImage,
    setShowProductModal,
    showProductModal,
    selectedProducts,
  } = useFeatureBannerForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (form.statuses) {
        formData.append("status", form.statuses);
      }

      formData.append("promoType", form.promoType);
      formData.append("title", form.title);
      formData.append("createdAt", form.from);
      formData.append("expiresAt", form.to);

      selectedProducts.forEach((item) => {
        formData.append("products", item._id);
      });

      if (featureBannerImagePreview) {
        formData.append("featureBannerImgUrl", featureBannerImageFile);
      }

      const response = await dispatch(createFeatureBannerAction(formData));

      if (response) {
        await dispatch(fetchFeatureBannerAction());
        setIsCreatingBanner(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Row className="admin-form-overlay m-0">
      <Col xs={12} xl={11} className="mx-auto">
        <section className="admin-form-page admin-form-page-embedded">
          <div className="admin-form-hero">
            <div className="admin-form-hero-icon">
              <IoMegaphoneOutline />
            </div>
            <div>
              <span className="admin-form-kicker">Campaign Builder</span>
              <h2>Create Banner</h2>
              <p>
                Launch a storefront banner with timing, promotional type, hero
                artwork, and linked products.
              </p>
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="admin-form-card">
            <div className="admin-form-grid">
              <Form.Group className="admin-form-field admin-form-switch full-span">
                <Form.Check
                  type="switch"
                  name="statuses"
                  id="create-banner-status"
                  checked={form?.statuses === "active"}
                  label="Active banner"
                  onChange={handleOnChange}
                />
              </Form.Group>

              <Form.Group className="admin-form-field">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  className="admin-form-control"
                  type="text"
                  name="title"
                  placeholder="e.g. Winter Edit Now Live"
                  onChange={handleOnChange}
                  required
                />
              </Form.Group>

              <Form.Group className="admin-form-field">
                <Form.Label>Promo Type</Form.Label>
                <Form.Select
                  className="admin-form-control"
                  name="promoType"
                  value={form.promoType || ""}
                  onChange={handleOnChange}
                  required
                >
                  <option value="" disabled>
                    Select promo type
                  </option>
                  <option value="seasonal">Seasonal</option>
                  <option value="discounted">Discounted</option>
                  <option value="clearance">Clearance</option>
                  <option value="new">New</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="admin-form-field">
                <Form.Label>Starting Date</Form.Label>
                <Form.Control
                  className="admin-form-control"
                  type="date"
                  name="from"
                  onChange={handleOnChange}
                  required
                />
              </Form.Group>

              <Form.Group className="admin-form-field">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  className="admin-form-control"
                  type="date"
                  name="to"
                  onChange={handleOnChange}
                  required
                />
              </Form.Group>

              <Form.Group className="admin-form-field admin-form-upload full-span">
                <div className="admin-form-upload-copy">
                  <IoImagesOutline />
                  <div>
                    <Form.Label>Banner Image</Form.Label>
                    <p>Use a wide, high-resolution campaign visual.</p>
                  </div>
                </div>
                <Form.Control
                  className="admin-form-control"
                  type="file"
                  accept="image/*"
                  onChange={handleFeatureBannerImageChange}
                  ref={featureBannerImageRef}
                  required
                />
                {featureBannerImagePreview && (
                  <div className="admin-form-preview-grid banner">
                    <div className="admin-form-preview">
                      <button
                        type="button"
                        className="admin-form-delete"
                        onClick={clearImage}
                        aria-label="Remove banner image"
                      >
                        <MdDelete />
                      </button>
                      <img src={featureBannerImagePreview} alt="Banner preview" />
                    </div>
                  </div>
                )}
              </Form.Group>
            </div>

            <div className="admin-form-products">
              <AddedProductsSection
                selectedProducts={selectedProducts}
                setShowProductModal={setShowProductModal}
                toggleProduct={toggleProduct}
              />
            </div>

            <div className="admin-form-actions split">
              <Button
                type="button"
                className="admin-form-secondary danger"
                disabled={isSubmitting}
                onClick={() => setIsCreatingBanner(false)}
              >
                <IoCloseOutline />
                Cancel
              </Button>
              <Button
                type="submit"
                className="admin-form-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Creating
                    <Spinner
                      animation="border"
                      size="sm"
                      className="ms-2"
                      role="status"
                    />
                  </>
                ) : (
                  <>
                    <IoSaveOutline />
                    Create Banner
                  </>
                )}
              </Button>
            </div>
          </Form>
        </section>
      </Col>

      <AddProductsInBanner
        toggleProduct={toggleProduct}
        setShowProductModal={setShowProductModal}
        showProductModal={showProductModal}
        selectedProducts={selectedProducts}
      />
    </Row>
  );
};

export default AddNewBannerForm;
