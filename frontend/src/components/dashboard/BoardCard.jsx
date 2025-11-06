import React from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export default function BoardCard({
  board,
  isEditing,
  editedTitle,
  onChangeTitle,
  onSave,
  onCancel,
  onStartEdit,
  onAskDelete,
  onOpen,
}) {
  return (
    <div
      className="w-full py-4 md:py-6 px-4 rounded-xl bg-element-50 text-neutral-100 font-montserrat text-lg flex justify-between items-center hover:shadow-card transition-shadow"
      onClick={onOpen}
    >
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => onChangeTitle(e.target.value)}
          onBlur={onSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") onCancel();
          }}
          autoFocus
          className="bg-transparent text-neutral-100 rounded-md focus:outline-none"
        />
      ) : (
        <span className="cursor-pointer">{board.title}</span>
      )}

      <div className="space-x-2">
        <button
          className="text-neutral-100 text-xl hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit();
          }}
        >
          <CiEdit />
        </button>
        <button
          className="text-neutral-100 text-xl hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            onAskDelete({ top: rect.bottom, left: rect.left });
          }}
        >
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  );
}


