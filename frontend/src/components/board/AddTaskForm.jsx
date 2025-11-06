import React from "react";
import { RxCross1 } from "react-icons/rx";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";

export default function AddTaskForm({
  value,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { onCancel(); } }}>
      <TextInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter title..."
        autoFocus
        className="mb-2 bg-white/70"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} variant="outline">
          {loading ? "Adding…" : "Add"}
        </Button>
        <button type="button" onClick={onCancel} className="py-1 text-surface-800 text-xl">
          <RxCross1 />
        </button>
      </div>
    </form>
  );
}


