/**
 * @author Kaidali Sohaib --> "https://github.com/Sohaib-K/Pathfinding-Visualizer"
 */

const pathAlgo = {
  "Breadth-first Search": {
    get: (gridConf) => {
      return BFS(gridConf);
    },
    weighted: false,
  },
  "Depth-first Search": {
    get: (gridConf) => {
      return DFS(gridConf);
    },
    weighted: false,
  },
  Dijkstra: {
    get: (gridConf) => {
      return Dijkstra(gridConf);
    },
    weighted: true,
  },
  "Greddy Breadth-first Search": {
    get: (gridConf) => {
      return GreedyBFS(gridConf);
    },
    weighted: true,
  },
  "A* (A star)": {
    get: (gridConf) => {
      return AStar(gridConf);
    },
    weighted: true,
  },
  Swarm: {
    get: (gridConf) => {
      return Swarm(gridConf);
    },
    weighted: true,
  },
};
const mazeAlgo = {
  "Randomized depth-first search": (width, height) => {
    return DFSmaze(width, height);
  },
  Random: (width, height) => {
    return Randomaze(width, height);
  },
  "Kruskal's": (width, height) => {
    return Kruskals(width, height);
  },
};

/**
 * Constant variable that hold all the grids and extra information
 */
const gridsConf = {
  globalGrids: {},
  globalMazeGen: null,
  globalWidth: 50,
  globalHeight: 20,
  defaultSize: [20, 10],
  nbrOfGrid: 0,
  limit: Object.entries(pathAlgo).length,
  animated: true,
  animationDelay: 45,
  nodePerCycle: 2,
  weighted: false,
  limitWidthNodes: [4, 125],
  limitHeightNodes: [1, 50],
  weightedVal: 10,
};

const resizeListener = new ResizeObserver((entries) => {
  for (const grid of entries) {
    changeNodesSize(grid.target.id);
  }
});

startup();

/**
 * This function is called at the start of the script,
 * it initialize all the grids and prepare the website
 */
function startup() {
  const allGrids = document.getElementsByClassName("grid");

  for (let index = 0; index < allGrids.length; index++) {
    gridsConf.nbrOfGrid++;

    initElement(allGrids[index]);
  }

  const globalHeightSlider = document.createElement("input");
  const globalWidthSlider = document.createElement("input");
  const globalMazeGeneratorChoice = document.createElement("ul");
  const globalVisualizer = document.createElement("button");
  const globalMazeGenButton = document.createElement("button");
  const globalMazeGenDropdown = document.createElement("button");
  const globalClearPath = document.createElement("button");
  const globalClearBoard = document.createElement("button");
  const globalMazeDiv = document.createElement("div");
  const animDiv = document.createElement("div");
  const animationLab = document.createElement("label");
  const animationInp = document.createElement("input");
  const delayLab = document.createElement("label");
  const delayInp = document.createElement("input");
  const delayInf = document.createElement("div");
  const globalSizeNode = document.createElement("div");

  animationInp.type = "checkbox";
  delayInp.type = "range";
  delayInp.min = 0;
  delayInp.max = 100;
  delayInp.step = 1;
  delayInp.value = gridsConf.animationDelay;
  delayInf.style.display = "inline-block";
  delayInf.innerHTML = `Delay: ${delayInp.value}ms`;
  globalSizeNode.id = "globalSizeNode";
  globalVisualizer.className = "btn btn-success";
  globalClearPath.className = "btn btn-secondary";
  globalClearBoard.className = "btn btn-secondary";
  globalMazeDiv.className = "btn-group";
  globalMazeGenButton.className = "btn btn-primary";
  globalMazeGenDropdown.className =
    "btn btn-primary dropdown-toggle dropdown-toggle-split";
  globalMazeGeneratorChoice.className = "dropdown-menu dropdown-menu-dark";
  globalMazeGenDropdown.dataset.bsToggle = "dropdown";
  globalMazeGenButton.textContent = "Select a maze generator algorithm";

  animationInp.checked = true;
  animationInp.onchange = () => {
    gridsConf.animated = animationInp.checked;
  };

  delayInp.oninput = () => {
    const val = parseInt(delayInp.value);
    gridsConf.animationDelay = val;
    if (val === 0) {
      gridsConf.animated = false;
      animationInp.checked = false;
      animationInp.disabled = true;
    } else {
      animationInp.disabled = false;
    }
    delayInf.innerHTML = `Delay: ${val}ms`;
  };

  globalVisualizer.onclick = () => {
    for (const [key, value] of Object.entries(gridsConf.globalGrids)) {
      if (value) {
        if (gridsConf[key].pathfindingAlgo && !gridsConf[key].onanimation) {
          findPath(key, gridsConf[key].pathfindingAlgo);
        } else if (gridsConf[key].onanimation) {
          gridsConf[key].skip = true;
          gridsConf.allSkiped = true;
        }
      }
    }
    gridsConf.allSkiped = false;
  };

  globalMazeGenButton.onclick = (e) => {
    let anySelected = false;
    for (const [key, val] of Object.entries(gridsConf.globalGrids)) {
      if (val) {
        anySelected = true;
        break;
      }
    }
    if (gridsConf.globalMazeGen && anySelected) {
      let anyOnAnimation = false;
      let allOnAnimation = true;
      for (const [key, value] of Object.entries(gridsConf.globalGrids)) {
        if (value) {
          if (gridsConf[key].onanimation) {
            anyOnAnimation = true;
          } else if (!gridsConf[key].onanimation) {
            allOnAnimation = false;
            if (
              !equalArrays(
                [gridsConf[key].width, gridsConf[key].height],
                [gridsConf.globalWidth, gridsConf.globalHeight]
              )
            ) {
              adjustGrid(document.getElementById(`${key}`), [
                gridsConf.globalWidth,
                gridsConf.globalHeight,
              ]);
            }
          }
        }
      }
      if (!anyOnAnimation) {
        genGlobalMaze(gridsConf.globalMazeGen);
      }
      if (allOnAnimation) {
        for (const [key, value] of Object.entries(gridsConf.globalGrids)) {
          if (value) {
            gridsConf[key].skip = true;
            gridsConf.allSkiped = true;
          }
        }
      }
    } else {
      e.preventDefault();
    }
  };

  for (const [key, val] of Object.entries(mazeAlgo)) {
    const option = document.createElement("a");
    option.textContent = key;
    option.className = "dropdown-item btn";
    option.onclick = () => {
      gridsConf.globalMazeGen = key;
      globalMazeGenButton.textContent = gridsConf.globalMazeGen;
    };
    globalMazeGeneratorChoice.appendChild(option);
  }

  const globalActions = document.getElementById("globalActions");
  const globalSliders = document.getElementById("globalSliders");
  globalWidthSlider.type = "range";
  globalWidthSlider.className = `global-slider`;
  globalWidthSlider.min = gridsConf.limitWidthNodes[0];
  globalWidthSlider.max = gridsConf.limitWidthNodes[1];
  globalWidthSlider.value = gridsConf.globalWidth;
  globalHeightSlider.type = "range";
  globalHeightSlider.className = `global-slider`;
  globalHeightSlider.min = gridsConf.limitHeightNodes[0];
  globalHeightSlider.max = gridsConf.limitHeightNodes[1];
  globalHeightSlider.value = gridsConf.globalHeight;

  globalWidthSlider.onchange = (e) => {
    gridsConf.globalWidth = parseInt(globalWidthSlider.value);
    for (const [key, value] of Object.entries(gridsConf.globalGrids)) {
      if (value) {
        document.getElementById(`${key}-width`).value = parseInt(
          globalWidthSlider.value
        );
        document.getElementById(
          `${key}-size`
        ).innerHTML = `${globalWidthSlider.value} x ${globalHeightSlider.value}`;

        adjustGrid(document.getElementById(`${key}`), [
          gridsConf.globalWidth,
          gridsConf.globalHeight,
        ]);
      }
    }
  };

  globalHeightSlider.onchange = (e) => {
    gridsConf.globalHeight = parseInt(globalHeightSlider.value);
    for (const [key, value] of Object.entries(gridsConf.globalGrids)) {
      if (value) {
        document.getElementById(`${key}-height`).value = parseInt(
          globalHeightSlider.value
        );
        document.getElementById(
          `${key}-size`
        ).innerHTML = `${globalWidthSlider.value} x ${globalHeightSlider.value}`;
        adjustGrid(document.getElementById(`${key}`), [
          gridsConf.globalWidth,
          gridsConf.globalHeight,
        ]);
      }
    }
  };

  globalSizeNode.innerHTML = `${globalWidthSlider.value} x ${globalHeightSlider.value}`;

  globalWidthSlider.oninput = () => {
    globalSizeNode.innerHTML = `${globalWidthSlider.value} x ${globalHeightSlider.value}`;
  };

  globalHeightSlider.oninput = () => {
    globalSizeNode.innerHTML = `${globalWidthSlider.value} x ${globalHeightSlider.value}`;
  };

  globalClearBoard.onclick = () => {
    for (const [key, value] of Object.entries(gridsConf.globalGrids)) {
      if (value) {
        if (!gridsConf[key].onanimation) {
          clearWalls(key);
          clearPath(key);
          clearWeighted(key);
        }
      }
    }
  };

  globalClearPath.onclick = () => {
    for (const [key, value] of Object.entries(gridsConf.globalGrids)) {
      if (value) {
        if (!gridsConf[key].onanimation) {
          clearPath(key);
        }
      }
    }
  };

  const controlDiv = document.createElement("div");
  const createBut = document.createElement("button");
  const deleteBut = document.createElement("button");

  controlDiv.id = "controlDiv";
  createBut.className = "btn btn-warning";
  deleteBut.className = "btn btn-warning";

  createBut.appendChild(document.createTextNode("Create a new grid"));
  deleteBut.appendChild(document.createTextNode("Delete the last grid"));

  createBut.onclick = () => {
    if (gridsConf.nbrOfGrid < gridsConf.limit) {
      gridsConf.nbrOfGrid++;
      const newGrid = document.createElement("div");
      newGrid.id = `grid${gridsConf.nbrOfGrid}`;
      newGrid.className = "grid";
      newGrid.dataset.x = gridsConf.defaultSize[0];
      newGrid.dataset.y = gridsConf.defaultSize[1];
      newGrid.style.width = "50%";
      document.getElementById("gridsDiv").appendChild(newGrid);
      initElement(newGrid);
    }
  };

  deleteBut.onclick = () => {
    if (
      gridsConf.nbrOfGrid !== 1 &&
      !gridsConf[`grid${gridsConf.nbrOfGrid}`].onanimation
    ) {
      const grid = document.getElementById(`grid${gridsConf.nbrOfGrid}`);
      resizeListener.unobserve(grid);
      grid.remove();
      document
        .getElementById("gridsCheckBox")
        .children[gridsConf.nbrOfGrid - 1].remove();
      gridsConf.nbrOfGrid--;
    }
  };

  globalVisualizer.appendChild(
    document.createTextNode("Visualize all selected grids")
  );
  globalClearBoard.appendChild(document.createTextNode("Clear board"));
  globalClearPath.appendChild(document.createTextNode("Clear path"));
  animationLab.appendChild(animationInp);
  animationLab.appendChild(document.createTextNode("Animations"));
  delayLab.appendChild(delayInp);
  delayLab.appendChild(delayInf);
  animDiv.appendChild(animationLab);
  animDiv.appendChild(delayLab);
  globalSliders.style.color = "black";
  controlDiv.appendChild(createBut);
  controlDiv.appendChild(deleteBut);
  controlDiv.appendChild(animDiv);
  globalMazeDiv.appendChild(globalMazeGenButton);
  globalMazeDiv.appendChild(globalMazeGenDropdown);
  globalMazeDiv.appendChild(globalMazeGeneratorChoice);
  globalActions.appendChild(globalVisualizer);
  globalActions.appendChild(globalMazeDiv);
  globalActions.appendChild(globalClearBoard);
  globalActions.appendChild(globalClearPath);
  globalSliders.appendChild(globalWidthSlider);
  globalSliders.appendChild(globalHeightSlider);
  globalSliders.appendChild(globalSizeNode);

  document.getElementById("topNav").appendChild(controlDiv);
  document.getElementById("rBody").style.marginTop = `${
    document.getElementById("topNav").clientHeight + 5
  }px`;
  const fGrid = document.getElementById("grid1");
  const width = document.getElementsByTagName("BODY")[0].clientWidth;
  const height =
    document.getElementsByTagName("BODY")[0].clientHeight -
    cumulativeOffset(document.getElementById("grid1-gridDiv")).top;
  let WidthNodes = Math.floor(
    document.getElementsByTagName("BODY")[0].clientWidth * 0.03
  );
  let HeightNodes = Math.floor((height * WidthNodes) / width);

  WidthNodes =
    WidthNodes > gridsConf.limitWidthNodes[1]
      ? gridsConf.limitWidthNodes[1]
      : WidthNodes < gridsConf.limitWidthNodes[0]
      ? gridsConf.limitWidthNodes[0]
      : WidthNodes;
  HeightNodes =
    HeightNodes > gridsConf.limitHeightNodes[1]
      ? gridsConf.limitHeightNodes[1]
      : HeightNodes < gridsConf.limitHeightNodes[0]
      ? gridsConf.limitHeightNodes[0]
      : HeightNodes;
  adjustGrid(fGrid, [WidthNodes, HeightNodes]);

  window.onresize = () => {
    const rBody = document.getElementById("rBody");
    rBody.style.marginTop = `${
      document.getElementById("topNav").clientHeight + 5
    }px`;
    rBody.style.width = `${
      document.getElementsByTagName("BODY")[0].clientWidth
    }px`;
  };

  window.onkeydown = (e) => {
    if (e.which === 87) {
      for (const [key, val] of Object.entries(gridsConf.globalGrids)) {
        if (
          !gridsConf[key].onanimation &&
          gridsConf[key].nodeStatusChoice === "wall" &&
          gridsConf[key].pathfindingAlgo !== null
        ) {
          if (pathAlgo[gridsConf[key].pathfindingAlgo].weighted) {
            gridsConf[key].nodeStatusChoice = "weighted";
          }
        }
      }
      if (!gridsConf.weighted) {
        e.preventDefault();
        gridsConf.weighted = true;
      }
    }
  };
  window.onkeyup = (e) => {
    if (e.which === 87) {
      for (const [key, val] of Object.entries(gridsConf.globalGrids)) {
        if (
          !gridsConf[key].onanimation &&
          gridsConf[key].nodeStatusChoice === "weighted"
        ) {
          gridsConf[key].nodeStatusChoice = "wall";
        }
      }
      if (gridsConf.weighted) {
        e.preventDefault();
        gridsConf.weighted = false;
      }
    }
  };
  const navResListener = new ResizeObserver(() => {
    document.getElementById("rBody").style.marginTop = `${
      document.getElementById("topNav").clientHeight + 5
    }px`;
  }).observe(document.getElementById("topNav"));
  const infoCont = document.getElementById("information-container");
  const infoBut = document.getElementById("infoBut");
  infoCont.style.right = "0%";

  document.getElementById("infoBut").onclick = () => {
    infoCont.style.right = "0%";
    infoCont.style.opacity = "100%";
  };
  document.getElementById("infoClose").onclick = () => {
    infoCont.style.right = "100%";
    infoCont.style.opacity = "0%";
  };
}
//////////////////////////

/**
 * This function take a div as an argument, the div have to contain "x" and "y" in the dataset
 * @param {*} grid The div that is going to be initialize
 */
function initElement(grid) {
  gridsConf[grid.id] = {
    grid: [],
    width: Number(grid.dataset.x),
    height: Number(grid.dataset.y),
    isMousePressed: false,
    lastNodePressed: null,
    nodeSize: null,
    grabbed: null,
    pathfindingAlgo: null,
    mazegenAlgo: null,
    onanimation: false,
    nodeStatusChoice: "wall",
    skip: false,
    lastGrabbed: false,
    lastMouseDown: false,
  };

  const gridDiv = document.createElement("div");
  const sliderDiv = document.createElement("div");
  const sizeNode = document.createElement("div");
  const searchInf = document.createElement("div");
  const visualizeDiv = document.createElement("div");
  const mazeDiv = document.createElement("div");
  const buttonsContainer = document.createElement("div");
  const widthSlider = document.createElement("input");
  const heightSlider = document.createElement("input");
  const inputBox = document.createElement("input");
  const pathFindingChoice = document.createElement("ul");
  const mazeGeneratorChoice = document.createElement("ul");
  const gridLabel = document.createElement("label");
  const pathFindingButton = document.createElement("button");
  const pathFindingDropdown = document.createElement("button");
  const mazeGenButton = document.createElement("button");
  const mazeGenDropdown = document.createElement("button");
  const clearBoardBut = document.createElement("button");
  const clearPathBut = document.createElement("button");

  gridDiv.id = `${grid.id}-gridDiv`;
  searchInf.id = `${grid.id}-inf`;
  searchInf.className = "searchInf";
  sizeNode.id = `${grid.id}-size`;
  sizeNode.className = "sizeNode";
  sizeNode.innerHTML = `${gridsConf[grid.id].width} x ${
    gridsConf[grid.id].height
  }`;
  sliderDiv.className = "sliderDiv";
  widthSlider.type = "range";
  widthSlider.id = `${grid.id}-width`;
  widthSlider.className = `${grid.id}-slider`;
  widthSlider.min = gridsConf.limitWidthNodes[0];
  widthSlider.max = gridsConf.limitWidthNodes[1];
  widthSlider.value = grid.dataset.x;
  heightSlider.type = "range";
  heightSlider.id = `${grid.id}-height`;
  heightSlider.className = `${grid.id}-slider`;
  heightSlider.min = gridsConf.limitHeightNodes[0];
  heightSlider.max = gridsConf.limitHeightNodes[1];
  heightSlider.value = grid.dataset.y;
  widthSlider.onchange = (e) => {
    adjustGrid(grid, [widthSlider.value, heightSlider.value]);
  };
  heightSlider.onchange = (e) => {
    adjustGrid(grid, [widthSlider.value, heightSlider.value]);
  };

  widthSlider.oninput = () => {
    sizeNode.innerHTML = `${widthSlider.value} x ${heightSlider.value}`;
  };

  heightSlider.oninput = () => {
    sizeNode.innerHTML = `${widthSlider.value} x ${heightSlider.value}`;
  };
  buttonsContainer.className = "btnCont";

  pathFindingChoice.className = "dropdown-menu dropdown-menu-dark";
  mazeGeneratorChoice.className = "dropdown-menu dropdown-menu-dark";

  pathFindingButton.className = "btn btn-outline-success";
  pathFindingButton.textContent = "Select a path finding algorithm";
  pathFindingDropdown.className =
    "btn btn-outline-success dropdown-toggle dropdown-toggle-split";
  pathFindingDropdown.dataset.bsToggle = "dropdown";
  mazeGenButton.className = "btn btn-outline-primary";
  mazeGenButton.textContent = "Select a maze generator algorithm";
  mazeGenDropdown.className =
    "btn btn-outline-primary dropdown-toggle dropdown-toggle-split";
  mazeGenDropdown.dataset.bsToggle = "dropdown";
  clearBoardBut.className = "btn btn-outline-info";
  clearBoardBut.appendChild(document.createTextNode("Clear board"));

  clearPathBut.className = "btn btn-outline-info";
  clearPathBut.appendChild(document.createTextNode("Clear path"));

  pathFindingButton.onclick = async () => {
    if (gridsConf[grid.id].pathfindingAlgo && !gridsConf[grid.id].onanimation) {
      pathFindingButton.textContent = "Skip";
      await findPath(grid.id, gridsConf[grid.id].pathfindingAlgo);
      pathFindingButton.textContent = gridsConf[grid.id].pathfindingAlgo;
    } else if (gridsConf[grid.id].onanimation) {
      gridsConf[grid.id].skip = true;
    }
  };

  mazeGenButton.onclick = async () => {
    if (gridsConf[grid.id].mazegenAlgo && !gridsConf[grid.id].onanimation) {
      mazeGenButton.textContent = "Skip";
      await genMaze(grid.id, gridsConf[grid.id].mazegenAlgo);
      mazeGenButton.textContent = gridsConf[grid.id].mazegenAlgo;
    } else if (gridsConf[grid.id].onanimation) {
      gridsConf[grid.id].skip = true;
    }
  };

  clearBoardBut.onclick = () => {
    if (!gridsConf[grid.id].onanimation) {
      clearWalls(grid.id);
      clearPath(grid.id);
      clearWeighted(grid.id);
    }
  };
  clearPathBut.onclick = () => {
    if (!gridsConf[grid.id].onanimation) {
      clearPath(grid.id);
    }
  };

  for (const [key, val] of Object.entries(pathAlgo)) {
    const option = document.createElement("a");
    option.textContent = key;
    option.className = "dropdown-item btn";
    option.onclick = () => {
      gridsConf[grid.id].pathfindingAlgo = key;
      pathFindingButton.textContent = gridsConf[grid.id].pathfindingAlgo;
      if (!pathAlgo[key].weighted) {
        clearWeighted(grid.id);
      }
    };
    pathFindingChoice.appendChild(option);
  }
  for (const [key, val] of Object.entries(mazeAlgo)) {
    const option = document.createElement("a");
    option.textContent = key;
    option.className = "dropdown-item btn";
    option.onclick = () => {
      gridsConf[grid.id].mazegenAlgo = key;
      mazeGenButton.textContent = gridsConf[grid.id].mazegenAlgo;
    };
    mazeGeneratorChoice.appendChild(option);
  }
  visualizeDiv.className = "btn-group";
  mazeDiv.className = "btn-group";
  visualizeDiv.appendChild(pathFindingButton);
  visualizeDiv.appendChild(pathFindingDropdown);
  visualizeDiv.appendChild(pathFindingChoice);

  mazeDiv.appendChild(mazeGenButton);
  mazeDiv.appendChild(mazeGenDropdown);
  mazeDiv.appendChild(mazeGeneratorChoice);

  sliderDiv.appendChild(widthSlider);
  sliderDiv.appendChild(heightSlider);
  sliderDiv.appendChild(sizeNode);
  sliderDiv.appendChild(searchInf);
  buttonsContainer.appendChild(visualizeDiv);
  buttonsContainer.appendChild(mazeDiv);
  buttonsContainer.appendChild(clearBoardBut);
  buttonsContainer.appendChild(clearPathBut);

  grid.appendChild(buttonsContainer);
  grid.appendChild(sliderDiv);
  grid.appendChild(gridDiv);

  initGrid(grid.id, grid.dataset.x, grid.dataset.y);
  initEventListener(grid.id, grid.dataset.x, grid.dataset.y);
  changeNodesSize(grid.id);
  resizeListener.observe(grid);

  gridsConf.globalGrids[`${grid.id}`] = false;

  inputBox.type = "checkbox";
  inputBox.onchange = () => {
    gridsConf.globalGrids[`${grid.id}`] = !gridsConf.globalGrids[`${grid.id}`];
  };
  gridLabel.onmouseenter = () => {
    grid.style.border = "2px solid rgb(255,0,0,0.8)";
  };
  gridLabel.onmouseleave = () => {
    grid.style.border = "";
  };

  gridLabel.appendChild(inputBox);
  gridLabel.appendChild(document.createTextNode(`${"G" + grid.id.slice(1)}`));
  document.getElementById("gridsCheckBox").appendChild(gridLabel);
}

/**
 * This function initialize the table of divs in a grid
 * @param {*} gridId The id of the grid
 * @param {*} _x The width of the table
 * @param {*} _y The height of the table
 */
function initGrid(gridId, _x, _y) {
  const x = _x;
  const y = _y;
  const gridDiv = document.getElementById(`${gridId}-gridDiv`);
  let tableHTML = `<table id="${gridId}-table" class="gridTable"><tbody id="${gridId}-gridBody" class="gridBody">`;
  const gridArr = [];
  const middleY = Math.round(_y / 2 + 0.5) - 1;
  const startPos = [Math.floor(_x / 3 + 0.5) - 1, middleY];
  const endPos = [Math.ceil((_x * 2) / 3 + 0.5) - 1, middleY];
  gridsConf[gridId].start = startPos;
  gridsConf[gridId].end = endPos;
  for (let indexX = 0; indexX < x; indexX++) {
    let rowHTML = `<tr id="${gridId}-${indexX}" class="${gridId}-column column">`;
    const column = [];
    for (let indexY = 0; indexY < y; indexY++) {
      if (equalArrays([indexX, indexY], startPos)) {
        column.push(newNode("start"));
        rowHTML += `<td id="${gridId}-${indexX}-${indexY}" class="${gridId}-node node node-start"></td>`;
      } else if (equalArrays([indexX, indexY], endPos)) {
        column.push(newNode("end"));
        rowHTML += `<td id="${gridId}-${indexX}-${indexY}" class="${gridId}-node node node-end"></td>`;
      } else {
        column.push(newNode("normal"));
        rowHTML += `<td id="${gridId}-${indexX}-${indexY}" class="${gridId}-node node node-normal"></td>`;
      }
    }
    gridArr.push(column);
    rowHTML += "</tr>";
    tableHTML += rowHTML;
  }
  gridsConf[gridId].grid = gridArr.slice();
  tableHTML += `</table></tbody>`;
  gridDiv.innerHTML = tableHTML;
}

/**
 * This function add the events needed when initializing the grid
 * @param {*} gridId The id of the grid
 */
function initEventListener(gridId) {
  const gridBody = document.getElementById(`${gridId}-gridBody`);
  gridBody.onmousedown = (e) => {
    if (!gridsConf[gridId].onanimation && e.which === 1) {
      gridsConf[gridId]["isMousePressed"] = true;
    }
  };
  gridBody.onmouseup = (e) => {
    if (!gridsConf[gridId].onanimation && e.which === 1) {
      gridsConf[gridId]["isMousePressed"] = false;
      gridsConf[gridId].grabbed = null;
    }
  };

  gridBody.onmouseenter = (e) => {
    if (e.which === 1 && !gridsConf[gridId].onanimation) {
      if (gridsConf[gridId].lastGrabbed !== null) {
        gridsConf[gridId].grabbed = gridsConf[gridId].lastGrabbed;
      }
      if (gridsConf[gridId].lastMouseDown) {
        gridsConf[gridId].isMousePressed = gridsConf[gridId].lastMouseDown;
      }
    }
  };
  gridBody.onmouseleave = (e) => {
    gridsConf[gridId].lastGrabbed = gridsConf[gridId].grabbed;
    gridsConf[gridId].lastMouseDown = gridsConf[gridId].isMousePressed;
    gridsConf[gridId].isMousePressed = false;

    gridsConf[gridId].grabbed = null;
  };
  for (let indexX = 0; indexX < gridsConf[gridId].width; indexX++) {
    let row = document.getElementById(`${gridId}-${indexX}`);
    row.onmousedown = (e) => {
      e.preventDefault();
    };
    for (let indexY = 0; indexY < gridsConf[gridId].height; indexY++) {
      addEventToNode(gridId, indexX, indexY);
    }
  }
}

/**
 * This function add needed event to each node of a grid
 * @param {*} gridId The id of the grid
 * @param {*} indexX The node "x" position
 * @param {*} indexY The node "y" position
 */
function addEventToNode(gridId, indexX, indexY) {
  const node = document.getElementById(`${gridId}-${indexX}-${indexY}`);
  node.onmousedown = (e) => {
    e.preventDefault();
    if (!gridsConf[gridId].onanimation) {
      if (
        gridsConf[gridId].grid[indexX][indexY].currStatus === "start" ||
        gridsConf[gridId].grid[indexX][indexY].currStatus === "end"
      ) {
        gridsConf[gridId].grabbed =
          gridsConf[gridId].grid[indexX][indexY].currStatus;
      } else if (e.which === 1) {
        changeNode(gridId, indexX, indexY, gridsConf.animated);
      }
      gridsConf[gridId].lastNodePressed = [indexX, indexY];
    }
  };
  node.onmouseenter = (e) => {
    if (
      gridsConf[gridId].isMousePressed &&
      !equalArrays(gridsConf[gridId].lastNodePressed, [indexX, indexY]) &&
      gridsConf[gridId].grid[indexX][indexY].currStatus !== "start" &&
      gridsConf[gridId].grid[indexX][indexY].currStatus !== "end"
    ) {
      if (gridsConf[gridId].grabbed) {
        gridsConf[gridId].nodeStatusChoice =
          gridsConf[gridId].grid[gridsConf[gridId].lastNodePressed[0]][
            gridsConf[gridId].lastNodePressed[1]
          ].lastStatus;
        gridsConf[gridId][gridsConf[gridId].grabbed] = [indexX, indexY];

        changeNode(
          gridId,

          gridsConf[gridId].lastNodePressed[0],
          gridsConf[gridId].lastNodePressed[1],
          gridsConf.animated
        );
        gridsConf[gridId].nodeStatusChoice = gridsConf[gridId].grabbed;
      }
      changeNode(gridId, indexX, indexY, gridsConf.animated);
      gridsConf[gridId].lastNodePressed = [indexX, indexY];
      gridsConf[gridId].nodeStatusChoice = "wall";
      if (gridsConf.weighted && gridsConf[gridId].pathfindingAlgo !== null) {
        if (pathAlgo[gridsConf[gridId].pathfindingAlgo].weighted) {
          gridsConf[gridId].nodeStatusChoice = "weighted";
        }
      }
    }
  };
}

/**
 * This function start the process of finding the path between the start and the end node with the algorithm specified
 * @param {*} gridId The id of the grid
 * @param {*} algo The algorithm that is going to be used to find the path
 */
async function findPath(gridId, algo) {
  document.getElementById(`${gridId}-inf`).innerHTML = "";
  gridsConf[gridId].onanimation = true;
  const bestPath = pathAlgo[algo].get(gridsConf[gridId]);

  clearPath(gridId);
  gridsConf[gridId].nodeStatusChoice = "visited";
  for (let index = 0; index < bestPath.visitedNodes.length; index++) {
    const pos = bestPath.visitedNodes[index];
    if (gridsConf.animationDelay !== 0 && !gridsConf[gridId].skip) {
      if (index % gridsConf.nodePerCycle === 0) {
        await sleep(gridsConf.animationDelay);
      }
      changeNode(gridId, pos[0], pos[1], gridsConf.animated);
    } else {
      changeNode(gridId, pos[0], pos[1], false);
    }
  }

  gridsConf[gridId].nodeStatusChoice = "bestPath";

  for (let index = 0; index < bestPath.visitedBestNodes.length; index++) {
    const pos = bestPath.visitedBestNodes[index];
    if (gridsConf.animationDelay !== 0 && !gridsConf[gridId].skip) {
      await sleep(gridsConf.animationDelay);
      changeNode(gridId, pos[0], pos[1], gridsConf.animated);
    } else {
      changeNode(gridId, pos[0], pos[1], false);
    }
  }

  gridsConf[gridId].nodeStatusChoice = "wall";
  gridsConf[gridId].onanimation = false;
  const infDiv = document.getElementById(`${gridId}-inf`);
  if (bestPath.visitedBestNodes.length === 0) {
    infDiv.style.border = "1px solid red";
    infDiv.innerHTML = `${bestPath.visitedNodes.length} node visited | No path found!`;
  } else {
    infDiv.style.border = "2px solid green";
    infDiv.innerHTML = `  ${bestPath.visitedNodes.length} node visited | ${bestPath.visitedBestNodes.length} step`;
  }
  gridsConf[gridId].skip = false;
}

/**
 * This function start the process of placing walls in the grid based on the algorithm specified
 * @param {*} gridId The id of the grid
 * @param {*} algo The algorithm that is going to be used to generate the maze
 */
async function genMaze(gridId, algo) {
  gridsConf[gridId].nodeStatusChoice = "wall";
  gridsConf[gridId].onanimation = true;

  const grid = mazeAlgo[algo](
    gridsConf[gridId].width,
    gridsConf[gridId].height
  );

  clearWalls(gridId);
  clearPath(gridId);
  clearWeighted(gridId);

  if (grid.fill) {
    for (let indexX = 0; indexX < gridsConf[gridId].grid.length; indexX++) {
      for (
        let indexY = 0;
        indexY < gridsConf[gridId].grid[indexX].length;
        indexY++
      ) {
        changeNode(gridId, indexX, indexY, false);
      }
    }
  }

  let i = 0;

  for (let index = 0; index < grid.walls.length; index++) {
    if (gridsConf.animationDelay !== 0 && !gridsConf[gridId].skip) {
      if (i % gridsConf.nodePerCycle === 0) {
        await sleep(gridsConf.animationDelay);
      }
      changeNode(
        gridId,
        grid.walls[index][0],
        grid.walls[index][1],
        gridsConf.animated
      );
    } else {
      changeNode(gridId, grid.walls[index][0], grid.walls[index][1], false);
    }
    i++;
  }
  gridsConf[gridId].onanimation = false;
  gridsConf[gridId].skip = false;
}

/**
 * This function generate a maze for all grids selected with the specified algorithm choosen
 * @param {*} algo The algorithm that is going to be used to generate the global maze
 */
async function genGlobalMaze(algo) {
  const grid = mazeAlgo[algo](gridsConf.globalWidth, gridsConf.globalHeight);
  let i = 0;
  const tmpGlobalGrids = Object.assign({}, gridsConf.globalGrids);

  for (const [key, value] of Object.entries(tmpGlobalGrids)) {
    if (value) {
      gridsConf[key].onanimation = true;
      clearWalls(key);
      clearPath(key);
      clearWeighted(key);
      if (grid.fill) {
        for (let indexX = 0; indexX < gridsConf[key].grid.length; indexX++) {
          for (
            let indexY = 0;
            indexY < gridsConf[key].grid[indexX].length;
            indexY++
          ) {
            changeNode(key, indexX, indexY, false);
          }
        }
      }
    }
  }

  for (let index = 0; index < grid.walls.length; index++) {
    i++;
    if (
      i % gridsConf.nodePerCycle === 0 &&
      !gridsConf.allSkiped &&
      gridsConf.animationDelay !== 0
    ) {
      await sleep(gridsConf.animationDelay);
    }
    for (const [key, value] of Object.entries(tmpGlobalGrids)) {
      if (value) {
        if (gridsConf.animationDelay !== 0 && !gridsConf[key].skip) {
          changeNode(
            key,
            grid.walls[index][0],
            grid.walls[index][1],
            gridsConf.animated
          );
        } else {
          changeNode(key, grid.walls[index][0], grid.walls[index][1], false);
        }
      }
    }
  }
  for (const [key, value] of Object.entries(tmpGlobalGrids)) {
    if (value) {
      gridsConf[key].onanimation = false;
      gridsConf[key].skip = false;
    }
  }
  gridsConf.allSkiped = false;
}

/**
 * This function change the state of a node with all the management made
 * @param {*} gridId The id of the grid
 * @param {*} x The node "x" position
 * @param {*} y The node "y" position
 * @param {*} animated If it should animate the node or not
 */
function changeNode(gridId, x, y, animated) {
  const node = document.getElementById(`${gridId}-${x}-${y}`);

  if (
    gridsConf[gridId].grid[x][y].currStatus !== "start" &&
    gridsConf[gridId].grid[x][y].currStatus !== "end"
  ) {
    gridsConf[gridId].grid[x][y].lastStatus =
      gridsConf[gridId].grid[x][y].currStatus;
  }
  if (
    gridsConf[gridId].grabbed === null &&
    (gridsConf[gridId].grid[x][y].currStatus === "start" ||
      gridsConf[gridId].grid[x][y].currStatus === "end")
  ) {
    gridsConf[gridId].grid[x][y].lastStatus =
      gridsConf[gridId].grid[x][y].lastStatus ===
      gridsConf[gridId].nodeStatusChoice
        ? "normal"
        : gridsConf[gridId].nodeStatusChoice;
    return null;
  }

  if (
    gridsConf[gridId].grid[x][y].currStatus !==
      gridsConf[gridId].nodeStatusChoice &&
    gridsConf[gridId].nodeStatusChoice !== "normal"
  ) {
    node.classList.remove(node.classList[2]);
    if (gridsConf[gridId].nodeStatusChoice === "weighted") {
      node.classList.add(
        animated ? `node-normal-weighted-a` : `node-normal-weighted`
      );
      gridsConf[gridId]["grid"][x][y].weight = gridsConf.weightedVal;
      gridsConf[gridId]["grid"][x][y].currStatus = "weighted";
    } else {
      if (
        gridsConf[gridId].grid[x][y].currStatus !== "weighted" ||
        gridsConf[gridId].nodeStatusChoice === "wall" ||
        gridsConf[gridId].nodeStatusChoice === "start" ||
        gridsConf[gridId].nodeStatusChoice === "end"
      ) {
        gridsConf[gridId]["grid"][x][y].weight = 1;
        node.classList.add(
          animated
            ? `node-${gridsConf[gridId].nodeStatusChoice}-a`
            : `node-${gridsConf[gridId].nodeStatusChoice}`
        );
        gridsConf[gridId]["grid"][x][y].currStatus =
          gridsConf[gridId].nodeStatusChoice;
      } else {
        node.classList.add(
          animated
            ? `node-${gridsConf[gridId].nodeStatusChoice}-weighted-a`
            : `node-${gridsConf[gridId].nodeStatusChoice}-weighted`
        );
        gridsConf[gridId]["grid"][x][y].currStatus = "weighted";
      }
    }
  } else {
    node.classList.remove(node.classList[2]);
    node.classList.add("node-normal");
    gridsConf[gridId]["grid"][x][y].currStatus = "normal";
    gridsConf[gridId]["grid"][x][y].weight = 1;
  }
}

/**
 *
 * @param {*} status The status needed
 * @returns Return an object with all the information that a node hold
 */
function newNode(status) {
  return { currStatus: status, lastStatus: status, weight: 1 };
}

/**
 * Adjust the size of each node of a grid
 * @param {*} gridId The grid id
 */
function changeNodesSize(gridId) {
  const allNodes = document.getElementsByClassName(`${gridId}-node`);
  const size =
    Math.floor(
      (document.getElementById(gridId).clientWidth - 20) /
        Number(gridsConf[gridId]["width"])
    ) - 2;
  for (let index = 0; index < allNodes.length; index++) {
    const element = allNodes.item(index);
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
  }
  gridsConf[gridId]["nodeSize"] = size;
}

/**
 * Adjust the width and the height of a table grid
 * @param {*} grid The grid div
 * @param {*} topRight An array that contain the width and height (ex: [50,25] is 50 in x and 25 in y)
 * @returns
 */
function adjustGrid(grid, topRight) {
  if (gridsConf[grid.id].onanimation) {
    document.getElementById(`${grid.id}-width`).value =
      gridsConf[grid.id].width;
    document.getElementById(`${grid.id}-height`).value =
      gridsConf[grid.id].height;
    document.getElementById(`${grid.id}-size`).innerHTML = `${
      gridsConf[grid.id].width
    } x ${gridsConf[grid.id].height}`;
    return 0;
  }
  grid.dataset.x = topRight[0];
  grid.dataset.y = topRight[1];
  document.getElementById(`${grid.id}-gridDiv`).innerHTML = "";
  gridsConf[grid.id].grid = [];
  gridsConf[grid.id].width = Number(grid.dataset.x);
  gridsConf[grid.id].height = Number(grid.dataset.y);
  gridsConf[grid.id].isMousePressed = false;
  gridsConf[grid.id].lastNodePressed = null;
  gridsConf[grid.id].nodeSize = null;
  gridsConf[grid.id].currStatus = "wall";

  initGrid(grid.id, topRight[0], topRight[1]);
  initEventListener(grid.id, topRight[0], topRight[1]);
  changeNodesSize(grid.id);
  document.getElementById(`${grid.id}-width`).value = topRight[0];
  document.getElementById(`${grid.id}-height`).value = topRight[1];
  document.getElementById(`${grid.id}-size`).innerHTML = `${
    gridsConf[grid.id].width
  } x ${gridsConf[grid.id].height}`;
}

/**
 * This function remove all visited and bestPath node from a grid
 * @param {*} gridId The grid id
 */
function clearPath(gridId) {
  const infDiv = document.getElementById(`${gridId}-inf`);
  infDiv.innerHTML = "";
  infDiv.style.border = "";

  gridsConf[gridId].nodeStatusChoice = "normal";
  for (let indexX = 0; indexX < gridsConf[gridId].width; indexX++) {
    for (let indexY = 0; indexY < gridsConf[gridId].height; indexY++) {
      if (
        gridsConf[gridId].grid[indexX][indexY].currStatus === "visited" ||
        gridsConf[gridId].grid[indexX][indexY].currStatus === "bestPath"
      ) {
        changeNode(
          gridId,

          indexX,
          indexY,
          false
        );
      } else if (
        gridsConf[gridId].grid[indexX][indexY].currStatus === "weighted"
      ) {
        gridsConf[gridId].grid[indexX][indexY].currStatus = "normal";
        gridsConf[gridId].nodeStatusChoice = "weighted";
        changeNode(
          gridId,

          indexX,
          indexY,
          false
        );
        gridsConf[gridId].nodeStatusChoice = "normal";
      } else if (
        gridsConf[gridId].grid[indexX][indexY].lastStatus === "visited" ||
        gridsConf[gridId].grid[indexX][indexY].lastStatus === "bestPath"
      ) {
        gridsConf[gridId].grid[indexX][indexY].lastStatus = "normal";
      }
    }
  }
  gridsConf[gridId].nodeStatusChoice = "wall";

  if (gridsConf.weighted) {
    gridsConf[gridId].nodeStatusChoice = "weight";
  }
}

/**
 * This function remove all walls node from a grid
 * @param {*} gridId The grid id
 */
function clearWalls(gridId) {
  gridsConf[gridId].nodeStatusChoice = "normal";
  for (let indexX = 0; indexX < gridsConf[gridId].width; indexX++) {
    for (let indexY = 0; indexY < gridsConf[gridId].height; indexY++) {
      if (gridsConf[gridId].grid[indexX][indexY].currStatus === "wall") {
        changeNode(
          gridId,

          indexX,
          indexY,
          false
        );
      } else if (gridsConf[gridId].grid[indexX][indexY].lastStatus === "wall") {
        gridsConf[gridId].grid[indexX][indexY].lastStatus = "normal";
      }
    }
  }
  gridsConf[gridId].nodeStatusChoice = "wall";
}

/**
 * This function remove all weighted node from a grid
 * @param {*} gridId The grid id
 */
function clearWeighted(gridId) {
  gridsConf[gridId].nodeStatusChoice = "normal";
  for (let indexX = 0; indexX < gridsConf[gridId].width; indexX++) {
    for (let indexY = 0; indexY < gridsConf[gridId].height; indexY++) {
      if (gridsConf[gridId].grid[indexX][indexY].currStatus === "weighted") {
        changeNode(
          gridId,

          indexX,
          indexY,
          false
        );
      } else if (
        gridsConf[gridId].grid[indexX][indexY].lastStatus === "weighted"
      ) {
        gridsConf[gridId].grid[indexX][indexY].lastStatus = "normal";
      }
    }
  }
  gridsConf[gridId].nodeStatusChoice = "wall";
}

/**
 * This function stop the current flow of the script
 * @param {*} delayTime The delay in ms (1 second = 1000 ms)
 */
function sleep(delayTime) {
  return new Promise((resolve) => setTimeout(resolve, delayTime));
}
