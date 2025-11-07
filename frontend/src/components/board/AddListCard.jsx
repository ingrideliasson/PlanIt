import React from "react";
import { RxCross1 } from "react-icons/rx";

export default function AddListCard({
  adding,
  value,
  loading,
  onStart,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="bg-neutral-100 text-neutral-700 font-montserrat rounded-lg text-sm p-4 flex-shrink-0 w-64 flex flex-col justify-center shadow-md">
      {adding ? (
        <form id="add-list-form" onSubmit={onSubmit} className="flex flex-col">
          <input
            id="new-list-input"
            autoFocus
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent text-center w-full border-b border-amber-950 pb-2 mb-3 focus:outline-none placeholder:text-amber-700"
          />
          <div className="flex gap-2 justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-transparent text-neutral-700 hover:underline"
            >
              {loading ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="py-1 text-neutral-700 hover:scale-105 text-lg"
            >
              <RxCross1 />
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button onClick={onStart} className="text-neutral-700 hover:font-semibold">
            + Add List
          </button>
        </div>
      )}
    </div>
  );
}


