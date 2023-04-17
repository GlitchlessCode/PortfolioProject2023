// With slight help from https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm

// -- Imports --
import { gridSquare } from "/modules/grid.js";
import { grid } from "/modules/grid.js";
import { createToolbar } from "/modules/toolbar-overlay.js";
import { randomInt, randomFloat } from "/modules/random-lib.js";
import { swap } from "/modules/array-functions.js";

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

    this.setCount = 1;

    for (let currRow = 0; currRow < this.dimensions.h; currRow++) {
      console.log(currRow);
      this.runRow(currRow, chance);
      if (currRow === this.dimensions.h - 1) break;
      this.verticalizeSets(chance);
    }

    Drawing.postMessage({
      type: "frame",
      data: { arr: this.flattenedArray, dim: this.dimensions },
    });
  }

  runRow(row, chance) {
    let cells = new Array();
    for (let i = 0; i < this.dimensions.w; i++) {
      let cell = this.getPos(i, row);
      cells.push(cell);

      if (!cell.set) {
        let set = this.createSet(this.setCount);
        cell.addToSet(set);
        cell.set = this.setCount;
        this.setCount++;
      }
    }

    for (const [index, cell] of cells.entries()) {
      if (index === 0) continue;
      let left = this.getPos(index - 1, row);
      if (left.set === cell.set) continue;
      let rand = randomFloat(0, 1);
      if (rand > chance) continue;
      this.horizontalJoin(index - 1, row);
    }
    return cells;
  }

  verticalizeSets(chance) {
    for (let i = 0; i < this.setCount; i++) {
      let set = this.getSet(i);
      if (!set) continue;

      let rand = randomInt(0, set.size);

      let holder = [...set];
      set.clear();

      let firstJoin = holder[rand];

      this.verticalJoin(firstJoin.position.x, firstJoin.position.y);

      if (holder.length === 1) continue;

      swap(holder, rand, holder.length - 1);
      holder.pop();

      let setChance = Math.max((-1 + chance) * (1 / holder.length) + chance, 0);

      for (let n = 0; n < holder.length; n++) {
        rand = randomFloat(0, 1);
        if (rand > setChance) continue;

        let cellPos = holder[n].position;
        this.verticalJoin(cellPos.x, cellPos.y);
      }
    }
  }

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

    bottom.addToSet(topSet);
    bottom.addToSet(topSet);
    bottom.addToSet(topSet);
    bottom.addToSet(topSet);
    bottom.addToSet(topSet);
    bottom.addToSet(topSet);
    bottom.addToSet(topSet);
    bottom.addToSet(topSet);
    bottom.set = top.set;
  }
}

// -- Testing [TEMPORARY] --
let test = new maze(8, 6, mazeSquare);

window.test = test;
