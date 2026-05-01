import { Card } from "react-bootstrap";
const AddNewFeatureBanner = ({ setIsCreatingBanner }) => {
  return (
    <Card
      className="shadow-sm rounded-4 text-center d-flex align-items-center justify-content-center"
      style={{
        height: "23rem",
        border: "2px dashed #aaa",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onClick={() => setIsCreatingBanner(true)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
        <div className="fs-1 text-muted">＋</div>
        <div className="text-muted mt-2">Create New Banner</div>
      </Card.Body>
    </Card>
  );
};

export default AddNewFeatureBanner;
