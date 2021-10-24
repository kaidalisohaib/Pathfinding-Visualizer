function BFS(gridConf) {
  const queue = new Queue([
    { position: gridConf.start, oldPositions: [gridConf.start] },
  ]);
  let finished = false;
  const visitedNodes = [];
  const visitedPos = {};
  visitedPos[gridConf.start] = 1;
  let visitedBestNodes = [];
  const moveChoice = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.getLength() !== 0 && !finished) {
    const curr = queue.get();
    for (let index = 0; index < moveChoice.length; index++) {
      const add = {
        position: curr.position.slice(),
        oldPositions: curr.oldPositions.slice(),
      };
      add.position = [
        add.position[0] + moveChoice[index][0],
        add.position[1] + moveChoice[index][1],
      ];

      if (inGrid(add.position, gridConf.width, gridConf.height)) {
        if (
          gridConf.grid[add.position[0]][add.position[1]].currStatus !== "wall"
        ) {
          if (!visitedPos[add.position]) {
            visitedPos[add.position] = 1;
            add["oldPositions"].push(add["position"].slice());

            if (equalArrays(add.position, gridConf.end)) {
              finished = true;
              add.oldPositions.shift();
              visitedBestNodes = add.oldPositions.slice();
              visitedNodes.push(add.position.slice());
              break;
            } else {
              visitedNodes.push(add.position.slice());
              queue.add(add);
            }
          }
        }
      }
    }
  }
  return { visitedNodes, visitedBestNodes };
}
