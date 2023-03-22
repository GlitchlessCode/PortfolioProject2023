// With help from https://www.movable-type.co.uk/scripts/sha256.html
// and https://crackstation.net/hashing-security.htm

let Users = loadUsers();

loadScript("./manager.js");

function loadScript(src) {
  var script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

/**
 * @returns {undefined}
 * @description Saves users to LocalStorage
 */
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

/**
 * @returns {array} All users
 * @description Loads users from LocalStorage
 */
function loadUsers() {
  let retrievedString = localStorage.getItem("users");
  return JSON.parse(retrievedString) ?? [];
}
