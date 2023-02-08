class gridSquare {
  position = { x: 0, y: 0 };
  constructor(x, y) {
    this.position = { x, y };
  }
}

class grid {
  #flattenedArray = new Array();
  #sets = new Object();
  dimensions = { w: 0, h: 0 };
  constructor(width = 1, height = 1) {
    // Error catching
    if (!Number.isInteger(width))
      throw new TypeError("width is not an Integer");
    if (!Number.isInteger(height))
      throw new TypeError("height is not an Integer");
    if (width < 1) throw new RangeError("width is less than 1");
    if (height < 1) throw new RangeError("height is less than 1");
    // Setting grid sizes
    this.dimensions = { w: width, h: height };

    this.#flattenedArray = Array.from(
      { length: width * height },
      (e, index) => {
        return new gridSquare(
          index % this.dimensions.w,
          Math.floor(index / this.dimensions.w)
        );
      }
    );
  }
}

export { grid };
