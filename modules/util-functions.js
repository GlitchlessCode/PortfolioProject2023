function swap(array, a, b) {
  let temp = array[a];
  array[a] = array[b];
  array[b] = temp;
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

export { swap, clamp };
