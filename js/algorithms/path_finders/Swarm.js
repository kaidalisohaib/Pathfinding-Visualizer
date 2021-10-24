function Swarm(gridConf) {
  const disQueue = new PriorityQueue((a, b) => {
    return b.distance - a.distance;
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
      column.push({ distance: Infinity, previous: undefined, visited: false });
    }
    disMap.push(column);
  }
  disMap[gridConf.start[0]][gridConf.start[1]].distance = 0;
  disQueue.add({
    index: gridConf.start,
    distance: disMap[gridConf.start[0]][gridConf.start[1]].distance,
  });

  while (!disQueue.empty()) {
    const currNode = disQueue.get();
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
    disMap[currNode.index[0]][currNode.index[1]].visited = true;
    moves.forEach((move) => {
      const adjPos = [currNode.index[0] + move[0], currNode.index[1] + move[1]];
      if (inGrid(adjPos, gridConf.width, gridConf.height)) {
        if (gridConf.grid[adjPos[0]][adjPos[1]].currStatus !== "wall") {
          const score =
            currNode.distance +
            gridConf.grid[adjPos[0]][adjPos[1]].weight +
            (Math.abs(gridConf.end[0] - adjPos[0]) +
              Math.abs(gridConf.end[1] - adjPos[1])) *
              2;

          if (
            disMap[adjPos[0]][adjPos[1]].distance > score &&
            !disMap.visited
          ) {
            disMap[adjPos[0]][adjPos[1]].distance = score;
            disMap[adjPos[0]][adjPos[1]].previous = currNode.index;
            disQueue.add({
              index: adjPos,
              distance: disMap[adjPos[0]][adjPos[1]].distance,
            });
          }
        }
      }
    });
  }

  visitedNodes.shift();
  visitedBestNodes = visitedBestNodes.reverse();
  return { visitedNodes, visitedBestNodes };
}
