// Random Library

// Return a random float between min and max
function randomFloat(min, max) {
  if (typeof min !== "number" || typeof max !== "number") return NaN;
  if (min > max) throw new RangeError("min is larger than max");

  return Math.random() * (max - min) + min;
}

// Return a random integer between min and max
function randomInt(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max)) return NaN;

  return Math.floor(randomFloat(min, max));
}

// Return a random RGB code
function randomRGB() {
  return `rgb(${randomInt(0, 256)}, ${randomInt(0, 256)}, ${randomInt(
    0,
    256
  )})`;
}

// Return a random Hex code
function randomHex() {
  return (
    "#" +
    randomInt(0, 256).toString(16).padStart(2, "0") +
    randomInt(0, 256).toString(16).padStart(2, "0") +
    randomInt(0, 256).toString(16).padStart(2, "0")
  );
}

// Export module
export { randomFloat, randomInt, randomRGB, randomHex };
