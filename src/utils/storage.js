/**
 * Safe localStorage helpers with defaults and JSON parse/stringify.
 */
export const getJson = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
};

export const setJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
};
