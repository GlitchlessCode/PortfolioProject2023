class defaultSquare {}

class grid {
  #flattenedArray = new Array();
  dimensions = { w: 0, h: 0 };
  constructor(width, height, gridObj) {
    this.dimensions = { w: width, h: height };
    this.#flattenedArray.length = width * height;
    if (!gridObj) this.#flattenedArray.fill(new defaultSquare());
    else this.#flattenedArray.fill(gridObj);
  }
}

export { grid };
