// Import
import { swap } from "/modules/util-functions.js";
import { yieldingHeapSort } from "/modules/sorters.js";
import { createToolbar } from "/modules/toolbar-overlay.js";
import { randomInt, randomHex } from "../../../modules/random-lib.js";

createToolbar(false);

let time = (ms) =>
  new Promise((r, _) => {
    setTimeout(r, ms);
  });

async function test(size) {
  let example = Array.from({ length: size }, (_, i) => i);
  example.forEach((element, index) =>
    swap(example, index, randomInt(0, example.length))
  );
  console.log(example);
  let example2 = structuredClone(example);
  let sorting = yieldingHeapSort(example2);
  let curr = { done: false };
  while (curr.done === false) {
    curr = sorting.next();
    display(curr.value);
    await time(1);
  }
  return example2;
}

function display(params) {
  if (params) {
    let el = document.getElementById("test");
    let heightPer = 300 / Math.max(...params);
    el.innerHTML = "";
    params.forEach((element) => {
      let newEl = document.createElement("div");
      newEl.style = `display:inline-block; background: ${randomHex()}; width:2px; height:${
        heightPer * element
      }px`;
      el.append(newEl);
    });
  }
}

window.test = test;
