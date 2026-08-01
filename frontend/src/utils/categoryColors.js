export const CATEGORY_COLORS = [
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#22d3ee", // cyan
  "#10b981", // green
  "#f43f5e", // rose
  "#6366f1", // indigo
  "#eab308", // yellow
];

// Assigns colors by each category's position in the full category list,
// so distinct categories reliably get distinct, non-clashing colors.
export function getCategoryColor(category, categories = []) {
  const index = categories.indexOf(category);
  if (index === -1) return CATEGORY_COLORS[0];
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}