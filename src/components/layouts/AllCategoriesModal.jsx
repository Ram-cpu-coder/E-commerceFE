import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CategoryList from "./CategoryList";

function AllCategoriesModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide}  backdrop="static" style={{
        width:"90vw",
        height:"100vh",
    }}>
      <Modal.Header closeButton>
        <Modal.Title>All Categories</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Grid version of CategoryList */}
        <CategoryList isModalView={true} />
      </Modal.Body>
      <Modal.Footer>
        Thank you for shopping with us 
      </Modal.Footer>
    </Modal>
  );
}

export default AllCategoriesModal;
