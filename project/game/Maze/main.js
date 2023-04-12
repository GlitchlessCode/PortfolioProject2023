// With slight help from https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm

// -- Imports --
import { gridSquare } from "/modules/grid.js";
import { grid } from "/modules/grid.js";
import { createToolbar } from "/modules/toolbar-overlay.js";
import { randomInt, randomFloat } from "/modules/random-lib.js";

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
  }
}

class maze extends grid {
  setCount;
  displayFull() {
    let result = structuredClone(this.flattenedArray);
    return result;
  }

  ellers(chance, dataCallback) {
    if (!Number.isFinite(chance)) throw new TypeError("chance is not a Number");
    if (chance <= 0 || chance > 1) throw new RangeError("chance out of range");

    this.setCount = 0;

    for (let currRow = 0; currRow < this.dimensions.h - 1; currRow++) {
      this.runRow(currRow, chance);
      this.verticalSets();
      return;
    }
  }

  runRow(row, chance) {
    for (let i = 0; i < this.dimensions.w; i++) {
      let cell = this.getPos(i, row);
      if (!cell.inSet) {
        cell.addToSet(this.createSet(this.setCount));
        cell.set = this.setCount;
        this.setCount++;
      }
      if (i === 0) continue;
      let left = this.getPos(i - 1, row);
      if (left.set === cell.set) continue;
      let rand = randomFloat(0, 1);
      if (rand < chance) continue;
      this.horizontalJoin(i - 1, row);
    }
  }

  verticalSets() {}

  horizontalJoin(leftX, leftY) {
    let left = this.getPos(leftX, leftY);
    let right = this.getPos(leftX + 1, leftY);
    let leftSet = this.getSet(left.set);
    right.walls.left = 0;
    if (right.set) {
      this.removeSet(right.set).forEach(function (element) {
        element.set = left.set;
        element.addToSet(leftSet);
      });
    } else {
      right.set = left.set;
      right.addToSet(leftSet);
    }
  }

  verticalJoin(topX, topY) {
    let top = this.getPos(topX, topY);
    let bottom = this.getPos(topX, topY + 1);
    let topSet = this.getSet(top.set);
    bottom.walls.top = 0;
    if (bottom.set) {
      this.removeSet(bottom.set).forEach(function (element) {
        element.set = top.set;
        element.addToSet(topSet);
      });
    } else {
      bottom.set = top.set;
      bottom.addToSet(topSet);
    }
  }
}

// -- Testing [TEMPORARY] --
let test = new maze(8, 6, mazeSquare);

window.test = test;
