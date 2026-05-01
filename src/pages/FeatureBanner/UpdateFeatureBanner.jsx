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

  // finding the particular feature banner of the given id
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
      const { _id, createdAt, updatedAt, __v, ...cleaned } = selectedBanner;
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
      <Row
        className="position-absolute bg-white w-100 d-flex flex-column"
        style={{ height: "100%", top: "0", left: "0" }}
      >
        <Col lg={11} md={8} className="mx-auto">
          <Form onSubmit={handleUpdate} className="d-flex flex-column p-5 w-75">
            <Row className="m-0 text-center">
              <strong className="fs-4 mb-5">Update Banner</strong>
            </Row>

            <Form.Check
              type="switch"
              name="statuses"
              id="custom-switch"
              checked={(form?.statuses || form?.status) === "active"}
              className="mb-3 d-flex gap-2"
              style={{ marginInlineEnd: "auto", width: "40%" }}
              label="Status"
              onChange={handleOnChange}
            />
            <div className="d-flex flex-wrap">
              <Form.Group
                className="mb-3"
                style={{ marginInlineEnd: "auto", width: "40%" }}
              >
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={form.title ?? ""}
                  onChange={handleOnChange}
                  required
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                style={{ marginInlineStart: "auto", width: "40%" }}
              >
                <Form.Label>Promo Type</Form.Label>
                <Form.Select
                  name="promoType"
                  value={form.promoType}
                  onChange={handleOnChange}
                  required
                >
                  <option value="" disabled>
                    Select ...
                  </option>
                  <option value="new">New</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="discounted">Discounted</option>
                  <option value="clearance">Clearance</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="d-flex flex-wrap">
              <Form.Group
                className="mb-3"
                style={{ marginInlineEnd: "auto", width: "40%" }}
              >
                <Form.Label>Starting Date</Form.Label>
                <Form.Control
                  type="date"
                  name="from"
                  value={form.from ?? ""}
                  onChange={handleOnChange}
                  required
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                style={{ marginInlineStart: "auto", width: "40%" }}
              >
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="to"
                  value={form.to ?? ""}
                  onChange={handleOnChange}
                  required
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Upload Banner Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFeatureBannerImageChange}
                ref={featureBannerImageRef}
              />
              {featureBannerImagePreview && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <div className="d-flex flex-column position-relative mt-2">
                    <MdDelete
                      onClick={clearImage}
                      className="position-absolute end-0 text-danger"
                      style={{ cursor: "pointer" }}
                    />
                    <img
                      src={featureBannerImagePreview}
                      alt="Preview"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                </div>
              )}
            </Form.Group>

            {/* Added Products Section */}
            <AddedProductsSection
              selectedProducts={selectedProducts}
              setShowProductModal={setShowProductModal}
              toggleProduct={toggleProduct}
            />

            <div className="d-flex justify-content-between">
              <Button
                style={{ width: "40%" }}
                variant="danger"
                onClick={() => navigate("/admin/banner")}
              >
                Cancel
              </Button>
              <Button type="submit" style={{ width: "40%" }}>
                Update Banner
              </Button>
            </div>
          </Form>
        </Col>

        {/* Product Selection Modal */}
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
