import { grid, gridSquare } from "../../../modules/grid.js";

let test = new grid(4, 5);

console.log(test);

class testClass extends gridSquare {
  constructor(x, y) {
    super(x, y);
  }
}

let test2 = new grid(4, 5, testClass);

console.log(test2);
