import React from "react";

export default function MemberAvatars({ members, boardOwnerId }) {
  const defaultColors = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F472B6"];

  return (
    <div className="flex space-x-2">
      {members.map((m, i) => {
        const initials = `${m.firstName?.[0] ?? ""}${m.lastName?.[0] ?? ""}`.toUpperCase();
        const bgColor = m.avatarColor || defaultColors[i % defaultColors.length];

        return (
          <div
            key={m.id}
            className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm border-2 border-white"
            style={{ backgroundColor: bgColor }}
            title={`${m.firstName} ${m.lastName}`}
          >
            {initials}
          </div>
        );
      })}
    </div>
  );
}
