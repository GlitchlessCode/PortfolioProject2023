class gridSquare {
  position = { x: 0, y: 0 };
  constructor(x, y) {
    this.position = { x, y };
  }
}

function fillerFunction(e, index) {
  return new this.fillerObject(
    index % this.dimensions.w,
    Math.floor(index / this.dimensions.w)
  );
}

class grid {
  #flattenedArray = new Array();
  #sets = new Object();
  fillerObject;
  dimensions = { w: 0, h: 0 };

  constructor(width = 1, height = 1, fillerObject = gridSquare) {
    // Error catching
    if (!Number.isInteger(width))
      throw new TypeError("width is not an Integer");
    if (!Number.isInteger(height))
      throw new TypeError("height is not an Integer");

    if (width < 1) throw new RangeError("width is less than 1");
    if (height < 1) throw new RangeError("height is less than 1");

    if (
      !(
        fillerObject.prototype instanceof gridSquare ||
        fillerObject === gridSquare
      )
    )
      throw new TypeError("fillerObject does not extend gridSquare");
    //Set fillerObject
    this.fillerObject = fillerObject;

    // Setting grid sizes
    this.dimensions = { w: width, h: height };

    // Create 2 dimensional representation
    this.#flattenedArray = Array.from(
      { length: width * height },
      fillerFunction,
      this
    );
  }

  getPos(x, y) {
    if (!Number.isInteger(x)) throw new TypeError("x is not an Integer");
    if (!Number.isInteger(y)) throw new TypeError("y is not an Integer");
    if (x > this.dimensions.w - 1 || x < 0)
      throw new RangeError("x is out of range");
    if (y > this.dimensions.h - 1 || y < 0)
      throw new RangeError("y is out of range");
    return this.#flattenedArray[x + y * this.dimensions.w];
  }

  setPos(x, y, key, value) {
    if (!Number.isInteger(x)) throw new TypeError("x is not an Integer");
    if (!Number.isInteger(y)) throw new TypeError("y is not an Integer");
    if (x > this.dimensions.w - 1 || x < 0)
      throw new RangeError("x is out of range");
    if (y > this.dimensions.h - 1 || y < 0)
      throw new RangeError("y is out of range");
    this.#flattenedArray[x + y * this.dimensions.w][key] = value;
  }

  createSet(name) {
    if (this.#sets[name]) return;
    this.#sets[name] = new Set();
  }

  removeSet(name) {
    if (!(this.#sets[name] instanceof Set)) return;
    delete this.#sets[name];
  }
}

export { grid, gridSquare };
