// Import
import { pages, activatePage, pageError } from "./manager.js";

// loader reference
let loader = document.getElementById("loader");

if (window.Worker) {
  const Hashing = new Worker("./hashWorker.js");
  window.Hashing = Hashing;
  let users = loadUsers();
  // Sign in: Username
  // Go to account creation
  pages.signInBox1.root
    .querySelector("#createAcc")
    .addEventListener("click", (e) => {
      pages.signInBox1.input.value = "";
      activatePage(pages.signInBox1, pages.signUpBox1);
    });
  // "Recover" account
  pages.signInBox1.root
    .querySelector("#cantAccess")
    .addEventListener("click", (e) => {
      pageError(pages.signInBox1, "Too bad!");
    });
  // Attempt login
  pages.signInBox1.buttons.children[1].addEventListener("click", (e) => {});
  // Sign in: Password

  // Sign up: Username
  pages.signUpBox1.buttons.children[0].addEventListener("click", (e) => {
    pages.signUpBox1.input.value = "";
    activatePage(pages.signUpBox1, pages.signInBox1);
  });
  // Sign up: Password

  // Sign up: Confirm Password

  /**
   * Saves users to LocalStorage
   * @returns {undefined}
   */
  function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
  }

  /**
   * Loads users from LocalStorage
   * @returns {array} All users
   */
  function loadUsers() {
    let retrievedString = localStorage.getItem("users");
    return JSON.parse(retrievedString) ?? [];
  }
} else {
  pages.signInBox1.root.classList.add("hide");
  loader.classList.remove("hide");
}
