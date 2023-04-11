// With help from https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm

// -- Imports --
import { gridSquare } from "/modules/grid.js";
import { grid } from "/modules/grid.js";
import { createToolbar } from "/modules/toolbar-overlay.js";
import { randomInt } from "/modules/random-lib.js";

createToolbar(false);

// -- Initialize Variables --

// HTML Elements
/** @type {HTMLCanvasElement} */
let cnv = document.getElementById("mazeCanvas");

let btn = document.getElementById("fullscreen");

// -- Canvas Worker Setup --
cnv.width = screen.width;
cnv.height = screen.height;
const offCnv = cnv.transferControlToOffscreen();
const Drawing = new Worker("./drawWorker.js");
Drawing.postMessage({ type: "init", canvas: offCnv }, [offCnv]);

// -- Add Event Listeners --
document.addEventListener("keydown", function (event) {});

document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement === cnv) {
    cnv.hidden = false;
  } else {
    cnv.hidden = true;
  }
});

screen.addEventListener("change", function () {
  Drawing.postMessage({
    type: "dim",
    dim: { w: screen.width, h: screen.height },
  });
});

btn.addEventListener("click", function () {
  cnv.requestFullscreen();
});

// -- Functions --

// -- Classes --

class mazeSquare extends gridSquare {
  walls = { left: 1, top: 1 };
  set = undefined;
  constructor(x, y, fillerObject) {
    super(x, y, fillerObject);
    if (x === 0) {
      this.walls.left = 0;
    }
    if (y === 0) {
      this.walls.top = 0;
    }
  }
}

class maze extends grid {
  setCount;
  displayFull() {
    let result = structuredClone(this.flattenedArray);
    return result;
  }

  ellers() {
    this.setCount = 0;
    this.initRow(0);
  }

  initRow(row) {
    for (let i = 0; i < this.dimensions.w; i++) {
      let cell = this.getPos(i, row);
      if (!cell.inSet) {
        cell.addToSet(this.createSet(this.setCount));
        cell.set = this.setCount;
        this.setCount++;
      }
    }
  }

  verticalJoin(left) {
    this.getPos(left.x, left.y);
  }

  horizontalJoin(top) {
    this.getPos();
  }
}

// -- Testing [TEMPORARY] --
let test = new maze(8, 6, mazeSquare);

window.test = test;
