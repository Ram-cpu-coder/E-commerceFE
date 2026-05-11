import React from "react";
import { Button, Modal } from "react-bootstrap";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
  IoTrashOutline,
  IoWarningOutline,
} from "react-icons/io5";

const icons = {
  danger: IoTrashOutline,
  error: IoAlertCircleOutline,
  info: IoInformationCircleOutline,
  success: IoCheckmarkCircleOutline,
  warning: IoWarningOutline,
};

const AppDialog = ({
  show,
  variant = "info",
  title,
  message,
  cancelText = "Cancel",
  confirmText = "OK",
  onCancel,
  onConfirm,
  confirmOnly = false,
  busy = false,
}) => {
  const Icon = icons[variant] || icons.info;
  const handleClose = onCancel || onConfirm;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      dialogClassName="app-dialog-modal"
      contentClassName="app-dialog-content"
    >
      <Modal.Body className="app-dialog-body">
        <button
          type="button"
          className="app-dialog-close"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          <IoCloseOutline />
        </button>

        <div className={`app-dialog-icon ${variant}`}>
          <Icon />
        </div>

        <div className="app-dialog-copy">
          <h3>{title}</h3>
          {message && <p>{message}</p>}
        </div>

        <div className="app-dialog-actions">
          {!confirmOnly && (
            <Button
              type="button"
              className="app-dialog-secondary"
              onClick={onCancel}
              disabled={busy}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="button"
            className={`app-dialog-primary ${variant}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working..." : confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AppDialog;
