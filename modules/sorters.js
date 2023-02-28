// Private Utilities

// Swap two values in an array in place
function swap(array, a, b) {
  let temp = array[a];
  array[a] = array[b];
  array[b] = temp;
}

// With help from https://www.programiz.com/dsa/heap-sort
function heapify(array, size, index) {
  // Set index of root
  let largestItemIndex = index;
  // Determine indices of children
  let leftChildIndex = 2 * index + 1;
  let rightChildIndex = 2 * index + 2;

  // If a child exists, and it has a larger value than the current root value, change the index of the root
  if (
    leftChildIndex < size &&
    array[leftChildIndex] > array[largestItemIndex]
  ) {
    largestItemIndex = leftChildIndex;
  }
  if (
    rightChildIndex < size &&
    array[rightChildIndex] > array[largestItemIndex]
  ) {
    largestItemIndex = rightChildIndex;
  }

  // If the inputted root is not the largest value, swap and continue heaping
  if (largestItemIndex !== index) {
    swap(array, index, largestItemIndex);
    // Since the indices are swapped, the largestItemIndex now represents the smaller value
    heapify(array, size, largestItemIndex);
  }
}

// Exported

// With help from https://www.programiz.com/dsa/heap-sort
function heapSort(array) {
  // Build max heap (every parent is larger than both children)
  for (let i = array.length / 2 - 1; i >= 0; i--) {
    heapify(array, array.length, i);
  }
  /*
    Heap Sort
    1. Swap root with last element
    2. Shrink heap size (managed via i variable in for loop)
    3. Heapify, to regain max heap
  */
  for (let i = array.length - 1; i >= 0; i--) {
    // Swap first and last, placing the root at the end
    swap(array, 0, i);

    // Heapify to regain max heap, with i as the heap size
    heapify(array, i, 0);
  }
}

// Merge sort
function mergeSort(array) {
  // Return if length is 0 or 1
  if (array.length < 2) return array;

  // Split
  let split = Math.floor(array.length / 2);

  const splitArray = array.splice(0, split);

  // Recursively call self
  let leftArray = mergeSort(splitArray);
  let rightArray = mergeSort(array);

  let result = new Array();

  // Until one of 2 Arrays are empty
  while (leftArray.length && rightArray.length) {
    // Push lowest value to the result
    if (leftArray[0] < rightArray[0]) {
      result.push(leftArray.shift());
    } else {
      result.push(rightArray.shift());
    }
  }

  // Return sorted result + any presorted remainder
  return [...result, ...leftArray, ...rightArray];
}

export { mergeSort, heapSort };
