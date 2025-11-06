import React from "react";

export default function Modal({ open, onClose, children, className = "" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative z-10 bg-white rounded-2xl shadow-card p-4 sm:p-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}


