import { Col, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import styled from 'styled-components';
import { BiEdit } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import DetailModal from './DetailModal';

const Container = styled.div`
  border-radius: 5px;
  background-color: white;
  margin-bottom: 30px;
  box-shadow: 1px 1px 8px rgba(0,0,0,0.1);
  display: flex;
  opacity: ${({active}) => (active ? 1 : 0.6)};
  > div:first-child {
    width: 40%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-size: cover;
  }
  > div:last-child {
    padding: 15px 20px;
    min-height: 150px;
  }
`;

const MenuItem = ({ item, onEdit, onRemove, onOrder, color }) => {
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Container active={item.is_available}>
        <Col xs={5} style={{ padding: 0 }}>
          <Button
            variant="link"
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: 0,
              border: 'none',
            }}
            onClick={handleImageClick}
          />
        </Col>
        <Col xs={7} className="d-flex flex-column justify-content-between w-100">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="mb-0">
                <b>{item.name}</b>
              </h4>
              <div>
                {onEdit ? (
                  <Button variant="link" onClick={onEdit}>
                    <BiEdit size={20} />
                  </Button>
                ) : null}
                {onRemove ? (
                  <Button variant="link" onClick={onRemove}>
                    <AiOutlineDelete size={20} color="red" />
                  </Button>
                ) : null}
              </div>
            </div>
            {/* <p className="mb-4">{item.description}</p> */}
          </div>
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <h5 className="mb-0 text-standard">
                <b style={{ color }}>${item.price}</b>
              </h5>
              {onOrder ? (
                <Button
                  variant="standard"
                  style={{ backgroundColor: color }}
                  className="mt-2"
                  size="sm"
                  onClick={() => onOrder(item)}
                >
                  {!item.quantity ? 'Add to item' : `Add one more (${item.quantity})`}
                </Button>
              ) : null}
            </div>
            {!item.is_available ? (
              <small className="text-secondary">Not Available</small>
            ) : null}
          </div>
        </Col>
      </Container>

      <DetailModal show={showModal} onHide={handleCloseModal} item={item} />
    </>
  );
};

export default MenuItem;
