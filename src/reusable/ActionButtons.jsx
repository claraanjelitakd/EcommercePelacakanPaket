import React from 'react';
import { Button } from 'react-bootstrap';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <Button variant="link" onClick={onEdit} className="p-0 me-2">
        <PencilFill />
      </Button>
      <Button variant="link" onClick={onDelete} className="p-0 text-danger">
        <TrashFill />
      </Button>
    </div>
  );
};

export default ActionButtons;