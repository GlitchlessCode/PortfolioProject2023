/* #region Explanation

To explain this mess:
/1/: document.querySelectorAll(".animated"): Gets all elements with the class "animated" as a NodeList
/2/: Array.from(/1/): Converts the NodeList into an actual array a.k.a. gets an array FROM the array-like NodeList
/3/: .reduce((prev, curr) => [...prev,{root: curr,input: curr.querySelector("input"),button: curr.querySelector(".buttons"),},], []): cont'd >>
/3.1/: .reduce(): Iterates through the provided array, and "Reduces" it iteratively according to the provided callback function
/3.2/: (prev, curr): This is the start of the callback function, stating the parameters to use in the function. Prev represents the state after the previous reduction iteration. Curr represents the item at the current index in the array reduction iteration.
/3.3/: => : Arrow function expression. As opposed to creating a standard function, this is shorthand used to push the parameters to the left of the arrow into the function to the right of the arrow.
/3.4/: ({...prev, [curr.id]:{root: curr, input: curr.querySelector("input"), button: curr.querySelector(".buttons"),},}): Returns an object composed of the contents of the object provided from the previous reduction iteration, followed by a new object which contains the root element at this index, the root's input element, and the root's div containing all of its buttons.
/3.5/: {}: The second argument to the reduce method, after the reduction callback function, stating the initial state to feed into the callback for the first iteration as the "prev" parameter
/4/: let pages = /2/(/1/)./3.1/(/3.2//3.3//3.4//3.5/,/4/): Stores the final reduced array in the variable "pages"

TLDR: Gets all the elements of a class, converts them to an array, and then reduces that array to an object of objects containing that same element, but also it's own input and buttons.

#endregion*/
// This is not meant to be a fully procedural system, I'm just too lazy to write down every single document.getElementByID which is why I did this
let pages = Array.from(document.querySelectorAll(".animated")).reduce(
  (prev, curr) => ({
    ...prev,
    [curr.id]: {
      root: curr,
      input: curr.querySelector("input"),
      buttons: curr.querySelector(".buttons"),
      error: curr.querySelector(".errorMessage"),
    },
  }),
  {}
);

/**
 * @param {object} page
 * @param {string|undefined} message
 * @description Generates a User Visible error message for the specified page
 */
function pageError(page, message) {
  if (!message) {
    page.input.classList.remove("errorMessage");
    page.error.classList.add("hide");
    page.error.innerHTML = "";
    return;
  }
  page.input.classList.add("errorMessage");
  page.error.classList.remove("hide");
  page.error.innerHTML = message;
  page.input.addEventListener(
    "input",
    () => {
      pageError(page);
    },
    { once: true }
  );
}

function activatePage(currActive, newActive) {
  currActive.root.classList.add("hide");
  newActive.root.classList.remove("hide");
  pageError(newActive);
  newActive.input.focus();
}

// Sign in: Username
pages.signInBox1.root
  .querySelector("#createAcc")
  .addEventListener("click", (e) => {
    pages.signInBox1.input.value = "";
    activatePage(pages.signInBox1, pages.signUpBox1);
  });

pages.signInBox1.root
  .querySelector("#cantAccess")
  .addEventListener("click", (e) => {
    pageError(pages.signInBox1, "Too bad!");
  });

pages.signInBox1.buttons.children[1].addEventListener("click", (e) => {});
// Sign in: Password

// Sign up: Username
pages.signUpBox1.buttons.children[0].addEventListener("click", (e) => {
  pages.signUpBox1.input.value = "";
  activatePage(pages.signUpBox1, pages.signInBox1);
});
// Sign up: Password

// Sign up: Confirm Password

window.pages = pages;
window.pageError = pageError;
window.activatePage = activatePage;

console.log(Users);
