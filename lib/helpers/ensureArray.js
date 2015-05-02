export default function ensureArray(val) {
  if (!Array.isArray(val)) {
    val = [val];
  }
  return val;
}
