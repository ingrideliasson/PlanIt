import React from "react";

const avatarColors = [
  "#F59E0B", // owner
  "#3B82F6", // blue
  "#EF4444", // red
  "#F472B6", // pink
  "#10B981", // green
  "#8B5CF6",  // purple
  "#6B5CF6",
  "#7B5CF6",
  "#5B5CF6",
  "#4B5CF6",
];

export default function MemberAvatars({ members = [], size = 32, showBorder = false, className = "" }) {
  const fontSize = Math.max(10, Math.round(size * 0.42));
  const gapStyle = { gap: Math.max(4, Math.round(size * 0.08)) };

  return (
    <div className={`flex flex-wrap items-center ${className}`} style={gapStyle}>
      {members.map((m) => {
        const uid = String(m.applicationUserId ?? m.id ?? "");
        const initials = `${m.firstName?.[0] ?? ""}${m.lastName?.[0] ?? ""}`.toUpperCase();
        const bgColor = avatarColors[m.colorIndex % avatarColors.length]; // <- use colorIndex directly

        return (
          <div
            key={uid}
            className={`rounded-full flex items-center justify-center text-white font-semibold leading-none ${showBorder ? "border-2 border-white" : ""}`}
            style={{
              backgroundColor: bgColor,
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${fontSize}px`,
              minWidth: `${size}px`,
            }}
            title={`${m.firstName ?? ""} ${m.lastName ?? ""}`}
          >
            {initials}
          </div>
        );
      })}
    </div>
  );
}
