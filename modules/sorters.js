// Private Utility
// With help from https://www.programiz.com/dsa/heap-sort
function heapify(array, size, index) {
  let largestIndex = index;
  let leftChildIndex = 2 * index + 1;
  let rightChildIndex = 2 * index + 2;

  if (leftChildIndex < size) {
  }
}

// Exported
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

export { mergeSort };
