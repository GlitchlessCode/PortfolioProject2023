// Import
import { swap, clamp } from "/modules/util-functions.js";
import {
  callbackBinaryQuickSort,
  callbackHeapSort,
  callbackMergeSort,
} from "/modules/sorters.js";
import { createToolbar } from "/modules/toolbar-overlay.js";
import { randomInt } from "/modules/random-lib.js";

createToolbar(false);

// -- Initialize Variables --

// HTML references

let amountInEL = document.getElementById("amountIn");

let mergeSortBtn = document.getElementById("merge");
let binaryQuickSortBtn = document.getElementById("binary");
let heapSortBtn = document.getElementById("heap");

let sortingSpaceEl = document.getElementById("sortingSpace");

// Variables
let scale = 128;
let mainArray = Array.from({ length: 128 }, (_, i) => i);

let sortRunning = false;

// -- Add Event Listeners--
amountInEL.addEventListener("input", disableAppropriate);
amountInEL.addEventListener("change", amountChanged);

mergeSortBtn.addEventListener("click", clickHandler);
binaryQuickSortBtn.addEventListener("click", clickHandler);
heapSortBtn.addEventListener("click", clickHandler);

// --Functions--

function amountChanged() {
  if (sortRunning) return;
  amountInEL.value = Math.floor(clamp(parseFloat(amountInEL.value), 8, 2048));
  disableAppropriate();
}

async function clickHandler(event) {
  if (sortRunning) return;
  disableAppropriate();

  const target = event.target;
  if (target.disabled) return;

  mergeSortBtn.disabled = true;
  binaryQuickSortBtn.disabled = true;
  heapSortBtn.disabled = true;
  amountInEL.disabled = true;

  switch (target.id) {
    case "merge":
      await runSorter(callbackMergeSort);
      break;
    case "binary":
      await runSorter(callbackBinaryQuickSort);
      break;
    case "heap":
      await runSorter(callbackHeapSort);
      break;
  }

  amountInEL.disabled = false;
  mergeSortBtn.disabled = false;
  binaryQuickSortBtn.disabled = false;
  heapSortBtn.disabled = false;
  disableAppropriate();
}

function disableAppropriate() {
  if (sortRunning) return;
  amountInEL.value = Math.floor(clamp(parseFloat(amountInEL.value), 0, 2048));
  scale = parseFloat(amountInEL.value);

  if (scale > 512) {
    mergeSortBtn.disabled = true;
  } else {
    mergeSortBtn.disabled = false;
  }
  if (scale > 1024) {
    binaryQuickSortBtn.disabled = true;
  } else {
    binaryQuickSortBtn.disabled = false;
  }
}

function time(ms) {
  return new Promise((r, _) => {
    setTimeout(r, ms);
  });
}

async function runSorter(sorter) {
  sortRunning = true;
  mainArray = Array.from({ length: scale }, (_, i) => i);
  for (let i = 0; i < scale; i++) {
    swap(mainArray, i, randomInt(0, scale));
    await display(mainArray);
  }
  await sorter(mainArray, display);
  sortRunning = false;
}

async function display(params) {
  if (params) {
    let max = scale;
    let heightPer = 300 / max;
    let width = 65 / scale;

    sortingSpaceEl.innerHTML = "";

    params.forEach((element, index) => {
      let g = index == 0 || element == params[index - 1] + 1 ? 200 : 0;
      let r = 200 - g;
      let newColumn = document.createElement("div");

      newColumn.style = `display:inline-block; background: #${r
        .toString(16)
        .padStart(2, 0)}${g
        .toString(16)
        .padStart(2, 0)}55; width:${width}vw; height:${
        heightPer * element
      }px; bottom:0`;

      sortingSpaceEl.append(newColumn);
    });
    await time(1);
  }
}

// Display default
await display(mainArray);
