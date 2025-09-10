// Palette: owner is intentionally first
export const boardColors = [
  "#F59E0B", // owner (orange)
  "#3B82F6", // blue
  "#EF4444", // red
  "#F472B6", // pink
  "#10B981", // green
  "#8B5CF6"  // purple
];

// fallback per-user deterministic generator (used only if mapping not available)
export function getColorForUser(userId) {
  if (!userId) return boardColors[0];
  // simple but stable djb2-ish hash
  let hash = 5381;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 33) ^ userId.charCodeAt(i);
  }
  return boardColors[(hash >>> 0) % boardColors.length];
}

/**
 * Build a color map for a board.
 * - membersForPalette: full board members array (order should be the order they were added, if possible)
 * - ownerId: board.ownerId (string)
 *
 * Returns: { [applicationUserId]: color }
 */
export function assignBoardColors(membersForPalette = [], ownerId) {
  const colorMap = {};

  // ensure owner is reserved to first color
  if (ownerId) {
    colorMap[String(ownerId)] = boardColors[0];
  }

  // If membersForPalette is missing/empty, return owner-only map
  if (!Array.isArray(membersForPalette) || membersForPalette.length === 0) {
    return colorMap;
  }

  // Prepare a list excluding the owner
  const paletteMembers = membersForPalette.filter(
    (m) => String(m.applicationUserId || m.id) !== String(ownerId)
  );

  // Sequentially assign colors starting from index 1 (since 0 reserved for owner)
  let nextIdx = 1;
  for (const m of paletteMembers) {
    const uid = String(m.applicationUserId ?? m.id ?? "");
    // if member already has an explicit avatarColor, prefer that and keep mapping deterministic
    if (m.avatarColor) {
      colorMap[uid] = m.avatarColor;
    } else {
      colorMap[uid] = boardColors[nextIdx % boardColors.length];
      nextIdx++;
    }
  }

  return colorMap;
}
