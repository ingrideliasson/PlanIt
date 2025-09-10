export const listColors = ["#3B82F6", "#10B981", "#F472B6", "#FACC15"]; // Blue, Green, Pink, Yellow

export function getListColor(index) {
  return listColors[index % listColors.length];
}