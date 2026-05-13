/**
 * Today's calendar date as YYYY-MM-DD in the user's local timezone.
 * Use for `<input type="date" min={...} value={...} />` (not UTC from toISOString).
 */
export function todayLocalDateInputValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** If value is before today (local), return today; otherwise value. */
export function clampDateInputToMin(value, min = todayLocalDateInputValue()) {
  if (!value || value < min) return min;
  return value;
}
