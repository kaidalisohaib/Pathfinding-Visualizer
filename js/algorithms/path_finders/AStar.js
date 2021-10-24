function AStar(gridConf) {
  const disQueue = new PriorityQueue((a, b) => {
    return b.f - a.f;
  });
  const disMap = [];
  const visitedNodes = [];
  let visitedBestNodes = [];
  const moves = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (let indexX = 0; indexX < gridConf.grid.length; indexX++) {
    const column = [];
    for (let indexY = 0; indexY < gridConf.grid[indexX].length; indexY++) {
      column.push({ g: Infinity, previous: undefined, visited: false });
    }
    disMap.push(column);
  }
  disMap[gridConf.start[0]][gridConf.start[1]].g = 0;
  disQueue.add({
    index: gridConf.start,
    g: disMap[gridConf.start[0]][gridConf.start[1]].g,
    f:
      Math.abs(gridConf.end[0] - gridConf.start[0]) +
      Math.abs(gridConf.end[1] - gridConf.start[1]),
  });

  while (!disQueue.empty()) {
    const currNode = disQueue.get();

    if (!disMap[currNode.index[0]][currNode.index[1]].visited) {
      disMap[currNode.index[0]][currNode.index[1]].visited = true;

      visitedNodes.push(currNode.index);
      if (
        gridConf.grid[currNode.index[0]][currNode.index[1]].currStatus === "end"
      ) {
        let tmpNodeIdx = currNode.index;
        while (disMap[tmpNodeIdx[0]][tmpNodeIdx[1]].previous !== undefined) {
          visitedBestNodes.push(tmpNodeIdx);
          tmpNodeIdx = disMap[tmpNodeIdx[0]][tmpNodeIdx[1]].previous;
        }
        break;
      }
      moves.forEach((move) => {
        const adjPos = [
          currNode.index[0] + move[0],
          currNode.index[1] + move[1],
        ];
        if (inGrid(adjPos, gridConf.width, gridConf.height)) {
          if (gridConf.grid[adjPos[0]][adjPos[1]].currStatus !== "wall") {
            const score =
              currNode.g + gridConf.grid[adjPos[0]][adjPos[1]].weight;

            if (
              disMap[adjPos[0]][adjPos[1]].g > score &&
              !disMap[adjPos[0]][adjPos[1]].visited
            ) {
              disMap[adjPos[0]][adjPos[1]].g = score;
              disMap[adjPos[0]][adjPos[1]].previous = currNode.index;
              disQueue.add({
                index: adjPos,
                g: disMap[adjPos[0]][adjPos[1]].g,
                f:
                  score +
                  Math.abs(gridConf.end[0] - adjPos[0]) +
                  Math.abs(gridConf.end[1] - adjPos[1]),
              });
            }
          }
        }
      });
    }
  }

  visitedNodes.shift();
  visitedBestNodes = visitedBestNodes.reverse();
  const tmpMap = {};
  for (let index = 0; index < visitedNodes.length; index++) {
    if (tmpMap[visitedNodes[index]] === undefined) {
      tmpMap[visitedNodes[index]] = 1;
    } else {
      tmpMap[visitedNodes[index]]++;
    }
  }
  return { visitedNodes, visitedBestNodes };
}
