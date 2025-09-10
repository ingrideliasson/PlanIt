import React from "react";
import { assignBoardColors, getColorForUser } from "../utils/avatarUtils";

export default function MemberAvatars({
  // `members` = the list you want to render (task.assignedUsers or the whole board members)
  members = [],
  // `allMembers` = full board members array used to derive the palette/order
  allMembers = null,
  ownerId = null,
  size = 32,       // px; default ~32px for "w-8/h-8"
  showBorder = false,
  className = ""
}) {
  // Build palette mapping using full board members if provided,
  // otherwise fallback to mapping built from the rendered members
  const paletteSource = Array.isArray(allMembers) && allMembers.length > 0 ? allMembers : members;
  const colorMap = assignBoardColors(paletteSource, ownerId);

  const fontSize = Math.max(10, Math.round(size * 0.42)); // comfortable scaling
  const gapStyle = { gap: Math.max(4, Math.round(size * 0.08)) };

  return (
    <div className={`flex flex-wrap items-center ${className}`} style={gapStyle}>
      {members.map((m) => {
        const uid = String(m.applicationUserId ?? m.id ?? "");
        const initials = `${m.firstName?.[0] ?? ""}${m.lastName?.[0] ?? ""}`.toUpperCase();
        // precedence: explicit avatarColor on member -> board mapping -> fallback hash
        const bgColor = m.avatarColor || colorMap[uid] || getColorForUser(uid);

        return (
          <div
            key={uid}
            className={`rounded-full flex items-center justify-center text-white font-semibold leading-none ${showBorder ? "border-2 border-white" : ""}`}
            style={{
              backgroundColor: bgColor,
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${fontSize}px`,
              minWidth: `${size}px`, // keep shape square
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