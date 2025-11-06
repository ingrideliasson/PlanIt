import React from "react";
import { RxCross1 } from "react-icons/rx";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";

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
    <div className="bg-white border border-surface-200 text-surface-800 font-montserrat rounded-xl text-sm p-4 flex-shrink-0 w-64 flex flex-col justify-center shadow-card">
      {adding ? (
        <form onSubmit={onSubmit} className="flex flex-col">
          <TextInput
            autoFocus
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-center mb-3"
          />
          <div className="flex gap-2 justify-center">
            <Button type="submit" disabled={loading} variant="outline">
              {loading ? "Adding…" : "Add"}
            </Button>
            <button type="button" onClick={onCancel} className="py-1 text-primary-900 text-xl">
              <RxCross1 />
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button onClick={onStart} className="text-surface-700 hover:font-semibold">
            + Add new list
          </button>
        </div>
      )}
    </div>
  );
}


