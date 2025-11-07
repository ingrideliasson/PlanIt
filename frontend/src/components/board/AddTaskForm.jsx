import React from "react";
import { RxCross1 } from "react-icons/rx";

export default function AddTaskForm({
  value,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onCancel();
        }
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter title..."
        autoFocus
        className="w-full rounded-lg px-3 py-2 text-sm mb-2 bg-transparent text-gray-900 focus:outline-none placeholder:text-gray-900"
      />
      <div className="flex">
        <button
          type="submit"
          disabled={loading}
          className="px-3 text-sm rounded-lg bg-transparent text-neutral-700 hover:underline"
        >
          {loading ? "Adding…" : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="py-1 bg-transparent text-neutral-700 text-lg hover:scale-105"
        >
          <RxCross1 />
        </button>
      </div>
    </form>
  );
}


