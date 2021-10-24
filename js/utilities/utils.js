function equalArrays(arr1, arr2) {
  if (!arr1 || !arr2) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let index = 0; index < arr1.length; index++) {
    if (arr1[index] !== arr2[index]) {
      return false;
    }
  }
  return true;
}

function cumulativeOffset(element) {
  var top = 0,
    left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top: top,
    left: left,
  };
}

function sort(
  array,
  compareFunc = (a, b) => {
    return a - b;
  }
) {
  return array.sort(compareFunc);
}

function insertAt(array, index, elementsArray) {
  array.splice(index, 0, elementsArray);
}

function inGrid(pos, width, height) {
  if (pos[0] < 0 || pos[0] > width - 1) {
    return false;
  }
  if (pos[1] < 0 || pos[1] > height - 1) {
    return false;
  }

  return true;
}

function nonRepeatingRand(start, end) {
  const nums = [];
  for (let index = start; index <= end; index++) {
    nums.push(index);
  }
  ranNums = [];
  i = nums.length;
  j = 0;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    ranNums.push(nums[j]);
    nums.splice(j, 1);
  }
  return ranNums;
}

class Queue {
  constructor(array) {
    this.items = array.slice();
  }

  add(item) {
    this.items.push(item);
  }
  get() {
    return this.items.shift();
  }
  getLength() {
    return this.items.length;
  }
}

class Stack {
  constructor(array) {
    this.items = array.slice();
  }
  add(item) {
    this.items.push(item);
  }
  rem() {
    this.items.pop();
  }
  front() {
    return this.items[this.items.length - 1];
  }
  get() {
    const temp = this.front();
    this.rem();
    return temp;
  }
  allItems() {
    return this.items.slice();
  }
  getLength() {
    return this.items.length;
  }
}

class PriorityQueue {
  constructor(
    compareFunc = (a, b) => {
      return a - b;
    },
    array = []
  ) {
    this.compareFunc = compareFunc;
    this.items = sort(array, this.compareFunc);
  }

  add(item) {
    for (let index = this.items.length; index >= 0; index--) {
      if (index - 1 === -1) {
        insertAt(this.items, index, item);
        break;
      } else if (this.compareFunc(this.items[index - 1], item) > 0) {
        insertAt(this.items, index, item);
        break;
      }
    }
  }

  get() {
    return this.items.shift();
  }
  getLength() {
    return this.items.length;
  }
  empty() {
    return this.items.length === 0;
  }
  head() {
    return this.items.length > 0 ? this.items[0] : undefined;
  }
}
