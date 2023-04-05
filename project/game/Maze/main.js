// With help from https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm

// -- Imports --
import { grid } from "/modules/grid.js";
import { createToolbar } from "/modules/toolbar-overlay.js";

createToolbar(false);

// -- Initialize Variables --

// HTML Elements
/** @type {HTMLCanvasElement} */
let cnv = document.getElementById("mazeCanvas");

let btn = document.getElementById("fullscreen");

// -- Canvas Worker Setup --
let size = Math.min(screen.width, screen.height);
cnv.width = size;
cnv.height = size;
const offCnv = cnv.transferControlToOffscreen();
const Drawing = new Worker("./drawWorker.js");
Drawing.postMessage({ type: "init", canvas: offCnv }, [offCnv]);

// -- Add Event Listeners --
document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement === cnv) {
    cnv.hidden = false;
  } else {
    cnv.hidden = true;
  }
});

screen.addEventListener("change", function () {
  let size = Math.min(screen.width, screen.height);
  let test = screen.height > screen.width;
  Drawing.postMessage({ type: "dim", size, test });
});

btn.addEventListener("click", function () {
  cnv.requestFullscreen();
});

// -- Functions --

// -- Draw Loop --

requestAnimationFrame(draw);

function draw() {
  offCnv.width = screen.width;
  offCnv.height = screen.height;

  requestAnimationFrame(draw);
}

let test = new grid(8, 6);

// Temporary: Just for testing systems from console
window.test = test;
