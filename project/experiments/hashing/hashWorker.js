/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-256 (FIPS 180-4) implementation in JavaScript                  (c) Chris Veness 2002-2019  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/sha256.html                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// Modified and re-written
// 1. To suit the needs of my application, and
// 2. So I can better understand what is occuring

onmessage = (e) => {
  console.log(e.data.title);
  let data = e.data.data;
  postMessage({ title: "From worker", data: data + 0.5 * data });
  postMessage(salt(e.data.title));
};

function salt(msg) {
  let saltArray = new Uint8Array(32);
  crypto.getRandomValues(saltArray);
  let salt = String.fromCharCode(...saltArray);
  let saltedMsg = msg + salt;
  return { saltedMsg, salt };
}

// NIST SHA guidelines and requirements
// https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf#page=15

/**
 * Generates a SHA-256 hash of a string.
 *
 * @param {string} message string to be hashed
 * @returns {string} Hash of message as a hex character string
 */
function hash(msg) {
  // Convert to UTF-8, SHA only deals with byte streams (so every character should be 1 byte max)
  msg = utf8Encode(msg);

  // Setting constant values determined by NIST
  // They are the first 32 birs of the fractional parts of the CUBE roots of the first 64 prime numbers
  // prettier-ignore
  const constants = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  // Setting the inital hash value determined by NIST
  // These are the first 32 bits of the fractional parts of the SQUARE roots of the first 8 prime numbers
  // prettier-ignore
  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  // PREPROCESSING

  msg += String.fromCharCode(0x80);
}

// HASHING HELPERS

/**
 * Encodes a string to UTF-8
 *
 * @param {string} str String to encode
 * @returns string Encoded string
 */
function utf8Encode(str) {
  let encoder = new TextEncoder();
  let encodedArray = encoder.encode(str);
  return String.fromCharCode(...encodedArray);
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
