import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

const PageHeader = ({ title, onAddNew }) => {
  return (
    <Row className="mb-4 align-items-center">
      <Col>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{title}</h1>
      </Col>
      <Col className="text-end">
        <Button variant="primary" onClick={onAddNew}>
          Add new
        </Button>
      </Col>
    </Row>
  );
};

export default PageHeader;