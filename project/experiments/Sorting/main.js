// Import
import { swap } from "/modules/util-functions.js";
import { callbackBinaryQuickSort, callbackHeapSort } from "/modules/sorters.js";
import { createToolbar } from "/modules/toolbar-overlay.js";
import { randomInt, randomHex } from "../../../modules/random-lib.js";

createToolbar(false);

let time = (ms) =>
  new Promise((r, _) => {
    setTimeout(r, ms);
  });

async function testCB(size) {
  let example = Array.from({ length: size }, (_, i) => i);
  example.forEach((element, index) =>
    swap(example, index, randomInt(0, example.length))
  );
  console.log(example);
  let example2 = structuredClone(example);
  await callbackBinaryQuickSort(example2, display);
  return example2;
}

async function display(params) {
  if (params) {
    let el = document.getElementById("test");
    let max = Math.max(...params);
    let heightPer = 300 / max;
    el.innerHTML = "";
    params.forEach((element) => {
      let b = Math.floor((element / max) * 200 + 27)
        .toString(16)
        .padStart(2, 0);
      let g = Math.floor(255 - ((element / max) * 200 + 27))
        .toString(16)
        .padStart(2, 0);
      let newEl = document.createElement("div");
      newEl.style = `display:inline-block; background: #00${g}${b}; width:2px; height:${
        heightPer * element
      }px`;
      el.append(newEl);
    });
    await time(3);
  }
}

window.test = testCB;
