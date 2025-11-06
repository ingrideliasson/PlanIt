import React from "react";

export default function Avatar({ name = "", size = 32, className = "", background = "bg-accent-400" }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const style = { width: size, height: size };
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold text-sm ${background} ${className}`}
      style={style}
      title={name}
    >
      {initials}
    </div>
  );
}


