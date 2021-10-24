function DFS(gridConf) {
  const stack = new Stack([gridConf.start]);
  const visitedNode = [];
  const mapVisited = {};
  //mapVisited[gridConf.start] = 1;
  let finished = false;

  const moveChoice = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  if(!haveNeighborDFS(gridConf.start,gridConf,mapVisited)){
    return { visitedNodes: visitedNode, visitedBestNodes: [] };

  }
  while (!finished && stack.getLength() !== 0) {
    const oldPos = stack.front();
    for (let index = 0; index < moveChoice.length; index++) {
      const nextPos = [
        oldPos[0] + moveChoice[index][0],
        oldPos[1] + moveChoice[index][1],
      ];
      if (inGrid(nextPos, gridConf.width, gridConf.height)) {
        if (gridConf.grid[nextPos[0]][nextPos[1]].currStatus !== "wall") {
          if (!mapVisited[nextPos]) {
            visitedNode.push(nextPos);
            stack.add(nextPos);

            if (gridConf.grid[nextPos[0]][nextPos[1]].currStatus === "end") {
              finished = true;
              break;
            } else {  
              mapVisited[nextPos] = 1;
              if (!haveNeighborDFS(nextPos, gridConf, mapVisited)) {
                let currPos = stack.front();
                while (
                  !haveNeighborDFS(currPos, gridConf, mapVisited) &&
                  stack.getLength() !== 0
                ) {
                  stack.rem();
                  currPos = stack.front();
                  if (!currPos) {
                    break;
                  }
                }
              }
              break;
            }
          }
        }
      }
    }    
  }
  const bestPath = stack.allItems();
  bestPath.shift();

  return { visitedNodes: visitedNode, visitedBestNodes: bestPath };
}

function haveNeighborDFS(position, gridConf, visited) {
  const moveChoice = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0],
  ];
  for (let index = 0; index < moveChoice.length; index++) {
    const element = moveChoice[index];
    const testedPos = [position[0] + element[0], position[1] + element[1]];
    if (inGrid(testedPos, gridConf.width, gridConf.height)) {
      if (gridConf.grid[testedPos[0]][testedPos[1]].currStatus !== "wall") {
        if (!visited[testedPos]) {
          return true;
        }
      }
    }
  }
  return false;
}
