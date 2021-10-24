function Kruskals(width, height) {
  let nrbOfSets = 0;
  const walls = [];
  let openNode = [];
  const moveChoices = [
    [0, 2],
    [0, -2],
    [2, 0],
    [-2, 0],
  ];
  const grid = [];
  for (let indexX = 0; indexX < width; indexX++) {
    grid.push([]);
    for (let indexY = 0; indexY < height; indexY++) {
      grid[indexX].push(0);
    }
  }

  const prioQueue = new PriorityQueue((a, b) => {
    return b.weight - a.weight;
  });
  const rdmInt = nonRepeatingRand(1, width * height + 1);
  for (let index = 0; index < rdmInt.length - 1; index++) {
    const x = Math.floor(index / height);

    const y = Math.floor(index % height);

    if (x % 2 === 0 && y % 2 === 0) {
      nrbOfSets++;
      openNode.push({ index: [x, y], weight: rdmInt[index] });
      grid[x][y] = rdmInt[index];
      walls.push([x, y]);
    }
  }
  openNode = sort(openNode, (a, b) => {
    return b.weight - a.weight;
  });

  while (nrbOfSets !== 1) {
    for (let indexNode = 0; indexNode < openNode.length; indexNode++) {
      const currNode = openNode[indexNode];
      const moveChoice = nonRepeatingRand(0, 3);
      for (let index = 0; index < moveChoice.length; index++) {
        const move = moveChoices[moveChoice[index]];
        const neighbor = [
          currNode.index[0] + move[0],
          currNode.index[1] + move[1],
        ];

        if (inGrid(neighbor, width, height)) {
          if (
            grid[neighbor[0]][neighbor[1]] !==
            grid[currNode.index[0]][currNode.index[1]]
          ) {
            nrbOfSets--;
            const betNode = [
              currNode.index[0] + move[0] / 2,
              currNode.index[1] + move[1] / 2,
            ];
            grid[betNode[0]][betNode[1]] =
              grid[currNode.index[0]][currNode.index[1]];
            walls.push(betNode);
            const tmpSet = grid[neighbor[0]][neighbor[1]];
            for (let indexX = 0; indexX < grid.length; indexX++) {
              for (let indexY = 0; indexY < grid[indexX].length; indexY++) {
                if (grid[indexX][indexY] === tmpSet) {
                  grid[indexX][indexY] =
                    grid[currNode.index[0]][currNode.index[1]];
                }
              }
            }
            break;
          }
        }
      }
    }
  }

  return { walls: walls.slice(), fill: true };
}
