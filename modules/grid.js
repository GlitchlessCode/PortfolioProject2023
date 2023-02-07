class testClass {
  field;
  #privateField;
  constructor(in1) {
    this.field = in1;
    this.#privateField = this.field * 2;
  }

  aMethod() {
    console.log(this.field);
  }

  get privateField() {
    return this.#privateField;
  }
}

export { testClass };
