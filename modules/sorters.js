import { swap } from "/modules/util-functions.js";

// Private Utilities

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

// Turns out this exists already, though I came up with the idea by combining quick sort with binary separation
function binaryQuickSort(array) {
  for (let i = array.length / 2 - 1; i >= 0; i--) {
    heapify(array, array.length, i);
  }

  let power = Math.floor(Math.log2(array[0]));

  function recursiveBinarySort(arr, pow, a, b) {
    let l = a;
    let r = b;

    let powOf2 = 2 ** pow;

    while (l <= r) {
      while (Math.floor(arr[l] / powOf2) % 2 === 0) {
        // Move the left cursor to the right
        l++;
      }
      while (Math.floor(arr[r] / powOf2) % 2 === 1) {
        // Move the right cursor to the left
        r--;
      }

      // if the left cursor is to the left of, or on the same index as the right cursor
      if (l <= r) {
        // Swap the values of the left cursor and the right cursor
        swap(arr, l, r);
        // Move the left crusor to the right, and the right cursor to the left
        l++;
        r--;
      }
    }
    if (b - l > 1 && pow > -50) {
      recursiveBinarySort(arr, pow - 1, l, b);
    }
    if (r - a > 1 && pow > -50) {
      recursiveBinarySort(arr, pow - 1, a, r);
    }
  }
  recursiveBinarySort(array, power, 0, array.length - 1);
}

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

export { mergeSort, heapSort, binaryQuickSort };
