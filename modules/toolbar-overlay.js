function createToolbar() {
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

  // Test Element 1
  let test1 = document.createElement("div");

  // Test Element 1
  let test2 = document.createElement("div");

  // Arrow Container Element
  let arrowContain = document.createElement("div");

  // Main arrow element
  let arrowMain = document.createElement("div");

  // Arrow elements
  let a = document.createElement("a");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");

  // MODIFY
  styler.innerHTML = `
    #tbContain{
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      top:0;
      overflow:hidden;
    }

    #tbMain{
      background: #aaaaaa;
      position:absolute;
      display: flex;
      justify-content:center;
      margin:0;
      left:0;
      right:0;
      top:0;
      padding: 16px 0 8px 0;
      z-index:100;
      box-shadow: 0px 0px 15px #aaaaaa;
      transition: all 0.5s cubic-bezier(0.75, 0, 0.25, 1);
    }

    #tbMain.tbClose{
      transform: translateY(-100%);
    }

    #tbGrid{
      width: fit-content;
      display:grid;
      grid-template-columns: 1fr 1fr;
    }

    .tbTest{
      background:white;
      width:fit-content;
      margin: 0 5px;
      padding: 8px 24px;
    }

    #tbArrowContain{
      background: linear-gradient(#a0a0a0, #aaaaaa 50%);
      position:absolute;
      width:58.4px;
      height:29.2px;
      right:0;
      bottom:-29.2px;
      border-radius: 0 0 0 10px;
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
      background-color: white;
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
      background-color: white;
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
   }
    .tbClose .tbRightBar:after {
      transform-origin: center center;
      transform: rotate(70deg);
   }
    /* End of arrow code */
  `;
  container.id = "tbContain";

  main.id = "tbMain";

  grid.id = "tbGrid";

  test1.innerHTML = "Some Contents";
  test1.classList.add("tbTest");

  test2.innerHTML = "More Contents";
  test2.classList.add("tbTest");

  arrowContain.id = "tbArrowContain";
  arrowMain.id = "tbArrowMain";
  a.classList.add("tbArrowIcon");
  span1.classList.add("tbLeftBar");
  span2.classList.add("tbRightBar");

  a.addEventListener("click", function () {
    a.classList.toggle("tbClose");
    main.classList.toggle("tbClose");
  });

  // APPEND
  container.append(main);

  main.append(grid);
  main.append(arrowContain);

  grid.append(test1, test2);

  arrowContain.append(arrowMain);

  arrowMain.append(a);

  a.append(span1, span2);

  // FINAL APPENDS
  body.append(styler);
  body.append(container);
}

export { createToolbar };
