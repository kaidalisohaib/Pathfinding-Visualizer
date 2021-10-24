function DFSmaze(width, height) {
  const grid = [];
  const walls = [];
  for (let indexX = 0; indexX < width; indexX++) {
    const column = [];
    for (let indexY = 0; indexY < height; indexY++) {
      column.push(0);
    }
    grid.push(column);
  }

  const start = [
    Math.floor(Math.random() * width),
    Math.floor(Math.random() * height),
  ];
  grid[start[0]][start[1]] = 1;
  const stack = new Stack([start]);
  while (stack.getLength() !== 0) {
    const horizontal = Math.round(Math.random());
    let move;
    if (horizontal) move = [Math.random() < 0.5 ? -1 : 1, 0];
    else move = [0, Math.random() < 0.5 ? -1 : 1];

    const lastPosition = stack.front();
    const nextPosition = [
      lastPosition[0] + move[0] * 2,
      lastPosition[1] + move[1] * 2,
    ];
    if (
      inGrid(nextPosition, width, height) &&
      grid[nextPosition[0]][nextPosition[1]] === 0
    ) {
      grid[lastPosition[0] + move[0]][lastPosition[1] + move[1]] = 1;
      walls.push([lastPosition[0] + move[0], lastPosition[1] + move[1]]);
      grid[nextPosition[0]][nextPosition[1]] = 1;
      walls.push([nextPosition[0], nextPosition[1]]);
      stack.add(nextPosition);
      if (!haveNeighborDFSmaze(nextPosition, grid)) {
        let currPos = stack.front();
        while (!haveNeighborDFSmaze(currPos, grid) && stack.getLength() !== 0) {
          stack.rem();
          currPos = stack.front();
          if (!currPos) {
            break;
          }
        }
      }
    }
  }

  return { walls: walls.slice(), fill: true };
}

function validDFSmaze(position, grid) {
  if (grid[position[0]][position[1]] === 1) {
    return false;
  }
  return true;
}

function haveNeighborDFSmaze(position, grid) {
  const moveChoice = [
    [0, 2],
    [0, -2],
    [-2, 0],
    [2, 0],
  ];
  for (let index = 0; index < moveChoice.length; index++) {
    const element = moveChoice[index];
    const testedPos = [position[0] + element[0], position[1] + element[1]];
    if (inGrid(testedPos, grid.length, grid[0].length)) {
      if (validDFSmaze(testedPos, grid)) {
        return true;
      }
    }
  }
  return false;
}
