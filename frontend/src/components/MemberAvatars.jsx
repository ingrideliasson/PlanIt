import React from "react";

const avatarColors = [
  "#ffa31a", 
  "#6ca9c6", 
  "#bb77a3", 
  "#f8c42d", 
  "#9ec499",
  "#c26868", 
  "#668957",
  "#d65cad",
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
