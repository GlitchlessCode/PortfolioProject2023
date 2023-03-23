// With help from https://www.movable-type.co.uk/scripts/sha256.html
// and https://crackstation.net/hashing-security.htm

onmessage = (e) => {
  console.log(e.data.title);
  let data = e.data.data;
  postMessage({ title: "From worker", data: data + 0.5 * data });
  postMessage(hash);
};

// NIST guidelines and requirements
// https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf#page=15

/**
 * Generates a SHA-256 hash of a string.
 *
 * @param {string} message string to be hashed
 * @returns {string} Hash of message as a hex character string
 */
function hash(message) {
  // Helper functions
}

/**
 * Rotates value bitwise to the right num number of times
 * @param {number} value value to be rotated
 * @param {number} num number of bits to shift by
 * @returns {number} value rotated to the right bitwise by num
 */
function rotRight(value, num) {
  // (value >>> num): shifts value with an unsigned bitshift by num bits
  // |: Bitwise OR, returns a 1 bit at a position where either original bit is 1
  // (value << (32-num)): shift value with a left bitshift by (32-num) bits
  return (value >>> num) | (value << (32 - num));
}

/* 
Comes from https://www.movable-type.co.uk/scripts/sha256.html
Credit where credit is due, I only have a very vague idea as to what is happening here. I can tell these functions are kinda just for messing with the input values. As for why these specific values? Because NIST says so, apparently.
*/
function SIGMA0(x) {
  return rotRight(x, 2) ^ rotRight(x, 13) ^ rotRight(x, 22);
}
function SIGMA1(x) {
  return rotRight(x, 6) ^ rotRight(x, 11) ^ rotRight(x, 25);
}
function sigma0(x) {
  return rotRight(x, 7) ^ rotRight(x, 18) ^ (x >>> 3);
}
function sigma1(x) {
  return rotRight(x, 17) ^ rotRight(x, 19) ^ (x >>> 10);
}
// Each bit is either from y or z, depending on if that x bit is 1 or 0
function Choice(x, y, z) {
  return (x & y) ^ (~x & z);
}
// Each bit is set to the majority of the three
function Majority(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
