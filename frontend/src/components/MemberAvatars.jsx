import React from "react";

const avatarColors = [
  "#9b6686", // emerald-100/200
  "#65b0bd", // emerald-200
  "#ffb35a", // green-200
  "#507246", // amber-300
  "#208596", // stone-200
  "#af5975", // slate-300
  "#5e376d", // slate-50
  "#208596", // slate-200
  "#20ab96", // slate-200
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
            className={`rounded-full flex items-center justify-center text-neutral-100 font-semibold leading-none ${showBorder ? "border-2 border-white" : ""}`}
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
