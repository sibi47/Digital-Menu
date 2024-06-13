import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DetailModal = ({ show, onHide, item }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>{item.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <img src={item.image} alt={item.name} style={{ width: '100%', height:"300px" }} />
      <p>{item.description}</p>
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        More Info
      </a>
    </Modal.Body>
    <Modal.Footer>
      {/* <Button variant="secondary" onClick={onHide}>
        Close
      </Button> */}
    </Modal.Footer>
  </Modal>
);

export default DetailModal;
