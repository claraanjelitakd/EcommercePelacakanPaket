import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ show, title, onClose, onSave, children, size = 'md' }) => {
  return (
    <Modal show={show} onHide={onClose} centered size={size}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        {onSave && (
          <Button variant="primary" onClick={onSave}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
