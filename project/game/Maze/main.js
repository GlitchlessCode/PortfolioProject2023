// With slight help from https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm

// -- Imports --
import { gridSquare, grid } from "/modules/grid.js";
import { createToolbar } from "/modules/toolbar-overlay.js";
import { randomInt, randomFloat } from "/modules/random-lib.js";
import { swap, clamp } from "/modules/util-functions.js";

createToolbar(false);

// -- Initialize Variables --

// HTML Elements
/** @type {HTMLCanvasElement} */
let cnv = document.getElementById("mazeCanvas");

let widthIn = document.getElementById("widthIn");
let heightIn = document.getElementById("heightIn");
let chanceIn = document.getElementById("chanceIn");

let generateBtn = document.getElementById("generate");
let fullscreenBtn = document.getElementById("fullscreen");
let loadBtn = document.getElementById("load");
let saveBtn = document.getElementById("save");

let fileIn = document.getElementById("dropZone");
let dialogBox = document.querySelector("dialog");
let modalCancelBtn = document.getElementById("modalCancel");

// Variables
let mainMaze;

// -- Canvas Worker Setup --
cnv.width = screen.width;
cnv.height = screen.height;
const offCnv = cnv.transferControlToOffscreen();
const Drawing = new Worker("./drawWorker.js");
Drawing.postMessage({ type: "init", canvas: offCnv }, [offCnv]);

// -- Add Event Listeners --
document.addEventListener("keydown", keyHandler);

document.addEventListener("fullscreenchange", fullscreenChange);

screen.addEventListener("change", screenSizeChange);

generateBtn.addEventListener("click", buttonClickHandler);
fullscreenBtn.addEventListener("click", buttonClickHandler);
loadBtn.addEventListener("click", buttonClickHandler);
saveBtn.addEventListener("click", buttonClickHandler);

modalCancelBtn.addEventListener("click", buttonClickHandler);

// -- Functions --

function buttonClickHandler(event) {
  let id = event.target.id;

  switch (id) {
    case "generate":
      generateMaze();
      break;
    case "fullscreen":
      enterFullscreen();
      break;
    case "load":
      dialogBox.showModal();
      break;
    case "save":
      exportMaze();
      break;
    case "modalCancel":
      closeLoadWindow();
      break;
  }
}

async function generateMaze() {
  let width = parseInt(clamp(widthIn.value, 1, 1024));
  let height = parseInt(clamp(heightIn.value, 1, 1024));
  let chance = parseFloat(clamp(chanceIn.value, 0.05, 1));

  await cnv.requestFullscreen();

  mainMaze.create(width, height, mazeSquare);
  mainMaze.ellers(chance);
}

async function enterFullscreen() {
  await cnv.requestFullscreen();
  if (mainMaze) {
    mainMaze.displayFull();
  }
}

function exportMaze() {
  let dim = mainMaze.dimensions;
  console.log(dim);
  let result = (((dim.w - 1) << 10) | (dim.h - 1)).toString(16).padStart(4, 0);
  console.log(result);

  let combined = "";
  let twos = 0;
  mainMaze.flattenedArray.forEach(function (element) {
    let value = (element.walls.left << 1) | element.walls.top;

    console.log(element.walls, value, twos);
    if (twos > 0) {
      twos + value;
      combined += twos.toString(16);
      twos = 0;
    } else {
      twos = value << 2;
    }
    console.log(combined);
  });
  console.log(combined);
}

function closeLoadWindow() {
  dialogBox.addEventListener("animationend", dialogClosed, { once: true });
  dialogBox.id = "closing";
}

function dialogClosed() {
  dialogBox.close();
  dialogBox.id = "";
}

function keyHandler(event) {}

function fullscreenChange() {
  if (document.fullscreenElement === cnv) {
    cnv.hidden = false;
  } else {
    cnv.hidden = true;
  }
}

function screenSizeChange() {
  let width = screen.width;
  let height = screen.height;
  let devicePixelRatio = window.devicePixelRatio;
  width = Math.round(devicePixelRatio * width);
  height = Math.round(devicePixelRatio * height);
  Drawing.postMessage({
    type: "dim",
    dim: { width, height },
  });
}

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

  ellers(chance) {
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
      sendFrame(this.runRow(currRow, chance));
      if (currRow === this.dimensions.h - 1) break;
      sendFrame(this.verticalizeSets(chance));
    }

    this.finalizeMaze(this.dimensions.h - 1);
  }

  finalizeMaze(row) {
    let cells = new Array();
    for (let i = 0; i < this.dimensions.w - 1; i++) {
      let cell = this.getPos(i, row);
      let rightCell = this.getPos(i + 1, row);

      if (cell.set === rightCell.set) continue;

      cells.push(rightCell);
      this.horizontalJoin(cell.position.x, cell.position.y);
    }
    sendFrame(cells);
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
    bottom.set = top.set;
  }
}

// Create maze
mainMaze = new maze(1, 1, mazeSquare);

// -- Testing [TEMPORARY] --

// dropZone.addEventListener("drop", dropHandler);
// dropZone.addEventListener("dragover", dragOverHandler);

// function dropHandler(ev) {
//   console.log("File(s) dropped");

//   // Prevent default behavior (Prevent file from being opened)
//   ev.preventDefault();

//   if (ev.dataTransfer.items) {
//     // Use DataTransferItemList interface to access the file(s)
//     [...ev.dataTransfer.items].forEach(async (item, i) => {
//       // If dropped items aren't files, reject them
//       if (item.kind === "file") {
//         const file = item.getAsFile();
//         console.log(await file.text());
//         console.log(`… file[${i}].name = ${file.name}`);
//       }
//     });
//   } else {
//     // Use DataTransfer interface to access the file(s)
//     [...ev.dataTransfer.files].forEach((file, i) => {
//       console.log(`… file[${i}].name = ${file.name}`);
//     });
//   }
// }

// function dragOverHandler(ev) {
//   console.log("File(s) in drop zone");

//   // Prevent default behavior (Prevent file from being opened)
//   ev.preventDefault();
// }
