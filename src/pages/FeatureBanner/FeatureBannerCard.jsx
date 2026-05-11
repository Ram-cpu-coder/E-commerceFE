import { Card } from "react-bootstrap";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { deleteFeatureBannerAction } from "../../features/featureBanner/featureBannerAction";
import { useDispatch } from "react-redux";
import { GoDot } from "react-icons/go";
import AppDialog from "../../components/dialogs/AppDialog";

const FeatureBannerCard = ({ item }) => {
  const {
    title,
    featureBannerImgUrl,
    _id,
    products,
    promoType,
    expiresAt,
    status,
  } = item;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    await dispatch(deleteFeatureBannerAction(_id));
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className="shadow-sm border-0 rounded-4"
        style={{
          width: "100%",
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {featureBannerImgUrl && (
          <Card.Img
            variant="top"
            src={`${featureBannerImgUrl}?v=${_id}`}
            alt="Banner"
            style={{
              height: "160px",
              objectFit: "cover",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          />
        )}
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title
              className="mb-0 fs-6 fw-bold text-truncate"
              title={title}
            >
              {title || promoType}
            </Card.Title>
            <div className="d-flex flex-column align-items-center">
              <GoDot
                className={
                  status === "active"
                    ? "text-success bg-success rounded-circle"
                    : "text-danger bg-danger rounded-circle"
                }
                title={status === "active" ? "Active" : "InActive"}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="text-muted mb-2 small">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </div>

          <div className="mb-2 small">
            <strong>Promo:</strong> {promoType}
          </div>
          <div className="mb-2 small text-muted d-flex align-items-center justify-content-between ">
            <span>
              <strong>Expires:</strong>{" "}
              {new Date(expiresAt).toLocaleDateString()}
            </span>
            <div className="d-flex align-items-center gap-2 fs-5">
              <FaEdit
                className="text-secondary"
                title="Edit"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/banner/${_id}`)}
              />
              <MdDelete
                className="text-danger"
                title="Delete"
                style={{ cursor: "pointer" }}
                onClick={() => setShowDeleteDialog(true)}
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/admin/banner/listed-products/${_id}`}
              className="btn btn-outline-primary btn-sm w-100"
            >
              View Products
            </Link>
          </div>
        </Card.Body>
      </Card>

      <AppDialog
        show={showDeleteDialog}
        variant="danger"
        title="Delete banner?"
        message={`This will remove "${
          title || promoType || "this banner"
        }" from the storefront banner list.`}
        cancelText="Keep Banner"
        confirmText="Delete Banner"
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default FeatureBannerCard;
