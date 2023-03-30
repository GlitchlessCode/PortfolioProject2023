function createToolbar(openDefault) {
  // GET
  let body = document.querySelector("body");

  // CREATE
  // Toolbar styling
  let styler = document.createElement("style");

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
  styler.innerHTML = `
    html {
      background: linear-gradient(-70deg, #ddefdd, #dddddf, #efdddd);
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    #tbContain{
      position:fixed;
      left:0;
      right:0;
      bottom:0;
      top:0;
      overflow:hidden;
      pointer-events:none;
    }

    #tbMain{
      background: #f5f5f5;
      position:absolute;
      display: flex;
      justify-content:center;
      margin:0;
      left:0;
      right:0;
      top:0;
      padding: 16px 0 8px 0;
      z-index:100;
      box-shadow: 0 0 6px #b0b0b0;
      transition: all 0.5s cubic-bezier(0.75, 0, 0.25, 1);
      pointer-events:all;
    }

    #tbMain.tbClose{
      transform: translateY(-100%);
      background: #b0b0b0;
    }

    #tbGrid{
      width: fit-content;
    }

    .tbBtns{
      user-select: none;
      cursor: pointer;
      width:fit-content;
      margin: 0 5px;
      padding: 8px 24px;
      text-align:center;
      display:inline-block;
      transition: 0.5s cubic-bezier(0, 0.7, 0.3, 1);
    }

    .tbBtns:hover{
      text-shadow: 0 5px 2px #a0a0a0;
      transform: scale(1.05, 1.05);
    }

    #tbArrowContain{
      background: #f5f5f5;
      position:absolute;
      width:58.4px;
      height:29.2px;
      right:0;
      bottom:-28px;
      border-radius: 0 0 0 10px;
      transition: all 0.5s cubic-bezier(0.75, 0, 0.25, 1);
    }

    #tbMain.tbClose #tbArrowContain{
      background: #b0b0b0;
    }

    /* Arrow provided by https://codepen.io/mattbraun/pen/EywBJR */
    #tbArrowMain{
      position:absolute;
      top:-20px;
    }

    .tbArrowIcon {
      height: 2.8em;
      width: 2.8em;
      display: block;
      padding: 0.5em;
      margin: 1em auto;
      position: relative;
      cursor: pointer;
      border-radius: 4px;
      transform: scale(0.5, 0.5);
      transition: 0.5s cubic-bezier(0, 0.7, 0.3, 1);
   }
    .tbArrowIcon:hover {
      filter: drop-shadow(0 5px 2px #a0a0a0);
      transform: scale(0.55, 0.55);
    }
    #tbMain.tbClose .tbArrowIcon:hover {
      filter: drop-shadow(0 5px 2px #5f5f5f);
      transform: scale(0.55, 0.55);
    }
    .tbLeftBar {
      position: absolute;
      background-color: transparent;
      top: 0;
      left: 0;
      width: 40px;
      height: 10px;
      display: block;
      transform: rotate(35deg);
      float: right;
      border-radius: 2px;
   }
    .tbLeftBar:after {
      content: "";
      background-color: #b0b0b0;
      width: 40px;
      height: 10px;
      display: block;
      float: right;
      border-radius: 6px 10px 10px 6px;
      transition: all 0.5s cubic-bezier(0.75, 0, 0.25, 1);
      z-index: -1;
   }
    .tbRightBar {
      position: absolute;
      background-color: transparent;
      top: 0px;
      left: 26px;
      width: 40px;
      height: 10px;
      display: block;
      transform: rotate(-35deg);
      float: right;
      border-radius: 2px;
   }
    .tbRightBar:after {
      content: "";
      background-color: #b0b0b0;
      width: 40px;
      height: 10px;
      display: block;
      float: right;
      border-radius: 10px 6px 6px 10px;
      transition: all 0.5s cubic-bezier(0.75, 0, 0.25, 1);
      z-index: -1;
   }
    .tbClose .tbLeftBar:after {
      transform-origin: center center;
      transform: rotate(-70deg);
      background-color: #f5f5f5;
   }
    .tbClose .tbRightBar:after {
      transform-origin: center center;
      transform: rotate(70deg);
      background-color: #f5f5f5;
   }
    /* End of arrow code */
  `;
  container.id = "tbContain";

  main.id = "tbMain";

  grid.id = "tbGrid";

  homeBtn.innerHTML = "Home";
  homeBtn.classList.add("tbBtns");

  projectBtn.innerHTML = "Projects";
  projectBtn.classList.add("tbBtns");

  aboutBtn.innerHTML = "About";
  aboutBtn.classList.add("tbBtns");

  arrowContain.id = "tbArrowContain";
  arrowMain.id = "tbArrowMain";
  arrow.classList.add("tbArrowIcon");
  span1.classList.add("tbLeftBar");
  span2.classList.add("tbRightBar");

  arrow.addEventListener("click", function () {
    arrow.classList.toggle("tbClose");
    main.classList.toggle("tbClose");
  });

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
