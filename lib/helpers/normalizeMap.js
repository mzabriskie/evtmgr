export default function normalizeMap(type, callback) {
  var map;
  if (typeof type === 'object') {
    map = type;
  }
  else if (typeof type === 'string' && typeof callback === 'function') {
    map = {};
    map[type] = callback;
  }
  return map;
}
