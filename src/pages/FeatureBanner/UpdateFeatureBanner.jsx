import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import useFeatureBannerForm from "../../hooks/useFeatureBannerForm";
import AddedProductsSection from "./AddedProductsSection";
import AddProductsInBanner from "./AddProductsInBanner";
import { UserLayout } from "../../components/layouts/UserLayout";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import {
  IoCloseOutline,
  IoImagesOutline,
  IoMegaphoneOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import {
  fetchFeatureBannerAction,
  updateFeatureBannerAction,
} from "../../features/featureBanner/featureBannerAction";
import useForm from "../../hooks/useForm";
import { getActiveProductAction } from "../../features/products/productActions";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";

const UpdateFeatureBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { featureBanner } = useSelector((state) => state.featureBannerInfo);
  const { allActiveProducts } = useSelector((state) => state.productInfo);

  const {
    featureBannerImageFile,
    featureBannerImagePreview,
    setFeatureBannerImagePreview,
    featureBannerImageRef,
    handleFeatureBannerImageChange,
    toggleProduct,
    clearImage,
    setShowProductModal,
    showProductModal,
    selectedProducts,
    setSelectedProducts,
    setFeatureBannerImageFile,
  } = useFeatureBannerForm();

  const selectedBanner = featureBanner.find((item) => item._id === id);

  const { form, setForm, handleOnChange } = useForm({});

  useEffect(() => {
    if (allActiveProducts.length <= 0) {
      dispatch(getActiveProductAction());
    }

    const preExistingProductsAdded = allActiveProducts?.filter((item) =>
      selectedBanner?.products.includes(item._id),
    );

    if (selectedBanner?._id) {
      const { _id, __v, ...cleaned } = selectedBanner;
      setForm({
        from: selectedBanner?.createdAt.split("T")[0],
        to: selectedBanner?.expiresAt.split("T")[0],
        ...cleaned,
      });

      setFeatureBannerImagePreview(cleaned.featureBannerImgUrl || "");
      setFeatureBannerImageFile(cleaned.featureBannerImgUrl || "");
      setSelectedProducts(preExistingProductsAdded);
    }
  }, [selectedBanner]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("status", form.statuses || form.status);
    formData.append("promoType", form.promoType);
    formData.append("title", form.title);
    formData.append("createdAt", form.from);
    formData.append("expiresAt", form.to);
    formData.append(
      "products",
      JSON.stringify(
        selectedProducts.map((item) => {
          return item._id;
        }),
      ),
    );

    if (featureBannerImagePreview) {
      formData.append("featureBannerImgUrl", featureBannerImageFile);
    }

    const response = await dispatch(
      updateFeatureBannerAction(selectedBanner?._id, formData),
    );
    if (response) {
      navigate("/admin/banner");
    }
  };

  useEffect(() => {
    const fetchFeatureBanner = async () => {
      await dispatch(fetchFeatureBannerAction());
    };
    fetchFeatureBanner();
  }, []);

  return (
    <UserLayout pageTitle="Banners">
      <BreadCrumbsAdmin />
      <Row className="admin-form-overlay admin-form-overlay-static m-0">
        <Col xs={12} xl={11} className="mx-auto">
          <section className="admin-form-page admin-form-page-embedded">
            <div className="admin-form-hero">
              <div className="admin-form-hero-icon">
                <IoMegaphoneOutline />
              </div>
              <div>
                <span className="admin-form-kicker">Campaign Editor</span>
                <h2>Update Banner</h2>
                <p>
                  Tune the active window, campaign artwork, and linked product
                  set for this storefront banner.
                </p>
              </div>
            </div>

            <Form onSubmit={handleUpdate} className="admin-form-card">
              <div className="admin-form-grid">
                <Form.Group className="admin-form-field admin-form-switch full-span">
                  <Form.Check
                    type="switch"
                    name="statuses"
                    id="update-banner-status"
                    checked={(form?.statuses || form?.status) === "active"}
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
                    value={form.title ?? ""}
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
                    <option value="new">New</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="discounted">Discounted</option>
                    <option value="clearance">Clearance</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="admin-form-field">
                  <Form.Label>Starting Date</Form.Label>
                  <Form.Control
                    className="admin-form-control"
                    type="date"
                    name="from"
                    value={form.from ?? ""}
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
                    value={form.to ?? ""}
                    onChange={handleOnChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="admin-form-field admin-form-upload full-span">
                  <div className="admin-form-upload-copy">
                    <IoImagesOutline />
                    <div>
                      <Form.Label>Banner Image</Form.Label>
                      <p>Replace the campaign visual with a wide image.</p>
                    </div>
                  </div>
                  <Form.Control
                    className="admin-form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleFeatureBannerImageChange}
                    ref={featureBannerImageRef}
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
                        <img
                          src={featureBannerImagePreview}
                          alt="Banner preview"
                        />
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
                  onClick={() => navigate("/admin/banner")}
                >
                  <IoCloseOutline />
                  Cancel
                </Button>
                <Button type="submit" className="admin-form-primary">
                  <IoRefreshOutline />
                  Update Banner
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
          allActiveProducts={allActiveProducts}
        />
      </Row>
    </UserLayout>
  );
};

export default UpdateFeatureBanner;
