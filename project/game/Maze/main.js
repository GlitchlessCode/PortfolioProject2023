// With slight help from https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm

// -- Imports --
import { gridSquare, grid } from "/modules/grid.js";
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

function sendFrame(deltas) {
  Drawing.postMessage({
    type: "frame",
    deltas,
  });
}

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
    Drawing.postMessage({
      type: "create",
      arr: this.flattenedArray,
      dim: this.dimensions,
    });
  }

  ellers(chance, dataCallback) {
    if (!Number.isFinite(chance)) throw new TypeError("chance is not a Number");
    if (chance <= 0 || chance > 1) throw new RangeError("chance out of range");

    this.flattenedArray.forEach(function (cell) {
      cell.set = undefined;
      cell.walls = { left: 1, top: 1 };
    });

    this.setCount = 1;
    this.clearSets();

    this.displayFull();

    for (let currRow = 0; currRow < this.dimensions.h; currRow++) {
      dataCallback(this.runRow(currRow, chance));
      if (currRow === this.dimensions.h - 1) break;
      dataCallback(this.verticalizeSets(chance));
    }

    this.finalizeMaze(this.dimensions.h - 1, dataCallback);
  }

  finalizeMaze(row, dataCallback) {
    let cells = new Array();
    for (let i = 0; i < this.dimensions.w - 1; i++) {
      let cell = this.getPos(i, row);
      let rightCell = this.getPos(i + 1, row);

      if (cell.set === rightCell.set) continue;

      cells.push(rightCell);
      this.horizontalJoin(cell.position.x, cell.position.y);
    }
    dataCallback(cells);
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
    let cells = new Array();
    for (let i = 0; i < this.setCount; i++) {
      let set = this.getSet(i);
      if (!set) continue;

      let rand = randomInt(0, set.size);

      let holder = [...set];
      set.clear();

      let firstJoin = holder[rand];

      cells.push(firstJoin);

      this.verticalJoin(firstJoin.position.x, firstJoin.position.y);

      if (holder.length === 1) continue;

      swap(holder, rand, holder.length - 1);
      holder.pop();

      let setChance = Math.max((-1 + chance) * (1 / holder.length) + chance, 0);

      for (let n = 0; n < holder.length; n++) {
        rand = randomFloat(0, 1);
        if (rand > setChance) continue;

        cells.push(holder[n]);
        let cellPos = holder[n].position;
        this.verticalJoin(cellPos.x, cellPos.y);
      }
    }
    return cells;
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
let test = new maze(24, 18, mazeSquare);

window.test = test;
window.sendFrame = sendFrame;
