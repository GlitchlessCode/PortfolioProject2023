function createToolbar(openDefault) {
  // GET
  let body = document.querySelector("body");

  // CREATE
  // Toolbar styling
  let styler = document.createElement("link");

  // Top container
  let container = document.createElement("div");

  // Main toolbar
  let main = document.createElement("div");

  // Grid container
  let grid = document.createElement("div");

  // Home Button
  let homeBtn = document.createElement("div");

  // Project Button
  let projectBtn = document.createElement("div");

  // About Button
  let aboutBtn = document.createElement("div");

  // Arrow Container Element
  let arrowContain = document.createElement("div");

  // Main arrow element
  let arrowMain = document.createElement("div");

  // Arrow elements
  let arrow = document.createElement("div");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");

  // MODIFY
  styler.href = "/css/toolbar.css";
  styler.rel = "stylesheet";

  container.id = "tbContain";

  main.id = "tbMain";

  grid.id = "tbGrid";

  homeBtn.innerHTML = "Home";
  homeBtn.classList.add("tbBtns");
  homeBtn.addEventListener("click", homeClicked);
  function homeClicked() {
    location.assign("/");
  }

  projectBtn.innerHTML = "Projects";
  projectBtn.classList.add("tbBtns");
  projectBtn.addEventListener("click", projectClicked);
  function projectClicked() {
    location.assign("/project/info/Projects/");
  }

  aboutBtn.innerHTML = "About";
  aboutBtn.classList.add("tbBtns");
  aboutBtn.addEventListener("click", aboutClicked);
  function aboutClicked() {
    location.assign("/project/info/About/");
  }

  arrowContain.id = "tbArrowContain";
  arrowMain.id = "tbArrowMain";
  arrow.classList.add("tbArrowIcon");
  span1.classList.add("tbLeftBar");
  span2.classList.add("tbRightBar");

  arrow.addEventListener("click", arrowClicked);
  function arrowClicked() {
    arrow.classList.toggle("tbClose");
    main.classList.toggle("tbClose");
  }

  if (!openDefault) {
    arrow.classList.add("tbClose");
    main.classList.add("tbClose");
  }

  // APPEND
  container.append(main);

  main.append(grid, arrowContain);

  grid.append(homeBtn, projectBtn, aboutBtn);

  arrowContain.append(arrowMain);

  arrowMain.append(arrow);

  arrow.append(span1, span2);

  // FINAL APPENDS
  body.prepend(styler, container);
}

export { createToolbar };
