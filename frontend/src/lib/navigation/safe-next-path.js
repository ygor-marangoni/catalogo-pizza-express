export function getSafeNextPath(value, fallback) {
  if (typeof value !== "string") return fallback;

  const path = value.trim();
  if (
    !path.startsWith("/")
    || path.startsWith("//")
    || path.includes("\\")
    || /[\u0000-\u001f\u007f]/.test(path)
  ) {
    return fallback;
  }

  return path;
}
