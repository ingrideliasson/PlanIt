import React from "react";
import Button from "../ui/Button";

export default function ConfirmPopover({ position, message, onConfirm, onCancel }) {
  if (!position) return null;
  return (
    <div className="absolute bg-white shadow-card rounded-md p-3 text-sm z-50" style={{ top: position.top + window.scrollY, left: position.left }}>
      <p className="mb-2 font-montserrat">{message}</p>
      <div className="flex gap-2 justify-center">
        <Button onClick={onConfirm} variant="danger" size="sm">Yes</Button>
        <Button onClick={onCancel} variant="subtle" size="sm">No</Button>
      </div>
    </div>
  );
}


