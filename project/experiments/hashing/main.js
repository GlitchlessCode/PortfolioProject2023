// Import
import { pages, activatePage, pageError, setLoader } from "./manager.js";

// I decided to go with a Web Worker for hashing, mostly just so I could try out Web Workers, though any multithreading advantages from using web workers is non functional in my code, so in reality, I'm just overcomplicating things
if (window.Worker && window.TextEncoder) {
  /*
  User Object:
    {
      name: Username
      pass: Hashed Password
      salt: Password Salt
    }
  */
  const Hashing = new Worker("./hashWorker.js");
  let users = loadUsers(); // Sign in: Username
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
  pages.signInBox1.buttons.children[1].addEventListener("click", (e) => {
    try {
      let input = pages.signInBox1.input.value;
      let invalidate = /([^A-Za-z\d\-@.+_])/.test(input);
      if (input.length === 0 || invalidate) {
        throw new Error("Enter a valid Username.");
      }
      let verify = getUser(input);
      if (!verify) {
        throw new Error("We couldn't find an account with that username.");
      }
      activatePage(pages.signInBox1, pages.signInBox2);
    } catch (error) {
      pageError(pages.signInBox1, error.message);
    }
  });

  // Sign in: Password
  // "Recover" password
  pages.signInBox2.root
    .querySelector("#forgotPass")
    .addEventListener("click", (e) => {
      pageError(pages.signInBox2, "Too bad!");
    });
  // Return to Username page
  pages.signInBox2.buttons.children[0].addEventListener("click", (e) => {
    activatePage(pages.signInBox2, pages.signInBox1);
  });
  // Attempt login
  pages.signInBox2.buttons.children[1].addEventListener(
    "click",
    async function (e) {
      setLoader(true);
      try {
        let input = pages.signInBox2.input.value;
        if (input.length === 0) {
          throw new Error("Password was wrong, or was invalid.");
        }
        let user = getUser(pages.signInBox1.input.value);
        let hashed = await hash(input, user.salt);
        if (user.pass !== hashed.hash) {
          throw new Error("Password was wrong, or was invalid.");
        }
        pages.signedIn.root.querySelector(".user").innerHTML = user.name;
        activatePage(pages.signInBox2, pages.signedIn);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        pageError(pages.signInBox2, error.message);
      }
    }
  );

  // Signed In
  // Sign out
  pages.signedIn.buttons.children[0].addEventListener("click", (e) => {
    pages.signInBox1.input.value = "";
    pages.signInBox2.input.value = "";
    activatePage(pages.signedIn, pages.signInBox1);
  });

  // Sign up: Username
  // Return to login
  pages.signUpBox1.buttons.children[0].addEventListener("click", (e) => {
    pages.signUpBox1.input.value = "";
    activatePage(pages.signUpBox1, pages.signInBox1);
  });
  // Attempt signup
  pages.signUpBox1.buttons.children[1].addEventListener("click", (e) => {
    try {
      let input = pages.signUpBox1.input.value;
      let invalidate = /([^A-Za-z\d\-@.+_])/.test(input);
      if (input.length < 8 || input.length > 24 || invalidate) {
        throw new Error(
          "Username must be between 8 and 24 characters long, may only contain letters, numbers, and the following characters:<br> - @ . + _"
        );
      }
      let verify = getUser(input);
      if (verify) {
        throw new Error("A user with this username already exists");
      }
      pages.signUpBox2.input.value = "";
      activatePage(pages.signUpBox1, pages.signUpBox2);
    } catch (error) {
      pageError(pages.signUpBox1, error.message);
    }
  });

  // Sign up: Password
  // Return to Username page
  pages.signUpBox2.buttons.children[0].addEventListener("click", (e) => {
    activatePage(pages.signUpBox2, pages.signUpBox1);
  });
  // Show/hide password
  pages.signUpBox2.root
    .querySelector("#showPswrd")
    .addEventListener("input", (e) => {
      let value = e.srcElement.checked;
      if (value) {
        pages.signUpBox2.input.type = "text";
      } else {
        pages.signUpBox2.input.type = "password";
      }
    });
  // Attempt signup
  pages.signUpBox2.buttons.children[1].addEventListener("click", (e) => {
    setLoader(true);
    try {
      let input = pages.signUpBox2.input.value;
      if (input.length < 8) {
        throw new Error("Password must be at least 8 characters in length");
      }
      pages.signUpBox2.input.type = "password";
      activatePage(pages.signUpBox2, pages.signUpBox3);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      pageError(pages.signUpBox2, error.message);
    }
  });

  // Sign up: Confirm Password
  pages.signUpBox3.buttons.children[0].addEventListener("click", (e) => {
    activatePage(pages.signUpBox3, pages.signUpBox2);
  });
  pages.signUpBox3.buttons.children[1].addEventListener(
    "click",
    async function (e) {
      setLoader(true);
      try {
        let input = pages.signUpBox3.input.value;
        let original = pages.signUpBox2.input.value;
        if (input.length < 8) {
          throw new Error("Password must be at least 8 characters in length");
        }
        if (input !== original) {
          throw new Error("Passwords must match");
        }
        pages.signUpBox3.input.type = "password";

        let hashed = await hash(input);
        let user = {
          name: pages.signUpBox1.input.value,
          pass: hashed.hash,
          salt: hashed.salt,
        };
        users.push(user);
        saveUsers();

        pages.signedUp.root.querySelector(".user").innerHTML = user.name;

        activatePage(pages.signUpBox3, pages.signedUp);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        pageError(pages.signUpBox3, error.message);
      }
    }
  );

  // Signed Up
  // Return to login
  pages.signedUp.buttons.children[0].addEventListener("click", (e) => {
    pages.signInBox1.input.value = "";
    pages.signUpBox1.input.value = "";
    pages.signUpBox2.input.value = "";
    pages.signUpBox3.input.value = "";
    activatePage(pages.signedUp, pages.signInBox1);
  });

  // HELPER FUNCTIONS
  /**
   * Returns a hashed string and its salt, if present
   *
   * @param {string} pass
   * @param {string} [salt]
   * @returns {Promise<object>}
   */
  function hash(pass, salt) {
    return new Promise((resolve, reject) => {
      Hashing.onmessage = function (e) {
        resolve(e.data);
      };
      Hashing.postMessage({ msg: pass, salt: salt });
    });
  }

  /**
   * Returns the user object of the targetted username, if no user is found, returns undefined
   *
   * @param {string} username Username to search for
   * @returns {object | undefined}
   */
  function getUser(username) {
    return users.find((element) => element.name === username);
  }

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
  setLoader(true);
}
