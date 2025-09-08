import React, { useState } from "react";

export default function UserSettingsModal({ user, onClose, onSave }) {
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || "#F59E0B"); // amber default
  const [listTheme, setListTheme] = useState(user?.listTheme || "orange");

  const colors = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F472B6"];

  const handleSave = () => {
    onSave({ avatarColor, listTheme });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg mb-4">User Settings</h2>

        <div className="mb-4">
          <p className="mb-2 font-semibold">Avatar Color</p>
          <div className="flex gap-2">
            {colors.map(c => (
              <div
                key={c}
                onClick={() => setAvatarColor(c)}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${avatarColor === c ? "border-black" : "border-white"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 font-semibold">List Theme</p>
          <select
            value={listTheme}
            onChange={(e) => setListTheme(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="orange">Orange</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="pink">Pink</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-3 py-1 rounded bg-amber-700 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
