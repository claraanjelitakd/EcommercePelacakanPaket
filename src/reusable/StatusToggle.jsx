import React from 'react';
import { Form } from 'react-bootstrap';

const StatusToggle = ({ isActive, onChange }) => {
  return (
    <Form.Check
      type="switch"
      id={`status-switch-${Math.random()}`}
      checked={isActive}
      onChange={onChange}
      label={isActive ? 'Active' : 'Not Active'}
    />
  );
};

export default StatusToggle;