canvasSize = 500;
gridSize = 50;

cellWidth = canvasSize/gridSize;

colorDict = { //color mapping for different tile types
  "idle": [13, 44, 84],
  "start": [92, 250, 237],
  "finish": [10, 99, 92],
  "wall": [127, 184, 0],
  "open": [246, 81, 29],
  "closed": [255, 180, 0],
  "path": [0, 166, 237]
}

grid = []; //store ALL tiles
open = []; //reference to tiles currently being considered
closedArr = [];


let start = new TileClass(null, null, null, null);
let finish = new TileClass(null, null, null, null);

let running = false;
function setup() {
  //------------------|
  //called on startup |
  //------------------|
  createCanvas(canvasSize, canvasSize);

  //initialise the grid
  for(let y = 0; y<gridSize; y++){
    grid.push([]);
    for(let x=0; x<gridSize; x++){
      grid[y].push(new TileClass(colorDict['idle'], x, y, cellWidth));
    }
  }
}


function draw() {
  //-----------------------------------------|
  //draw function called every frame with p5 |
  //-----------------------------------------|
  background(220);
  drawTiles();

  if(keyIsDown(13) && !running){ //listen for ENTER key to start
    open.push(start);
    running = true;
    start.endTile = finish;
    start.calculateCost(start);
    //frameRate(4);
  }


  if(running){
    //find the lowest cost tile in the open set
    let min = new TileClass(null, null, null, null); //default cost value is infinity
    for(let tile_index in open){
      let tile = open[tile_index];
      if(tile.getCost() < min.getCost()){
        min = tile;
        } else if(tile.getCost() == min.getCost() && tile.h < min.h){
          min = tile; //preference over lower h-cost (distance travelled)
        }
    }

    //check to see if the min is the finish tile
    if(min == finish){
      running = false;
      let curr = finish;
      //display the path taken
      while (curr != start){
        curr.col = colorDict["path"];
        curr = curr.prevTile;
      }
      return

    }

    //remove the lowest cost tile from the open list and add to closed list
    open.splice(open.indexOf(min), 1);
    closedArr.push(min);
    min.col = colorDict["closed"];

    //get the neighbours of the lowest cost tile
    let neighbours = getNeighbours(min);
    for(let tileIndex in neighbours){
      let neighbour = neighbours[tileIndex];
      neighbour.calculateCost(min);
      if(! closedArr.includes(neighbour) && ! neighbour.isWall && ! open.includes(neighbour)){
        open.push(neighbour);
        neighbour.col = colorDict["open"];
      }
    }

  }else if(mouseIsPressed){ //keycode 87=w
    placeWall(); //check on each frame to allow click+hold (onClick only called on release)
  }


}


function getTileByPlane(x,y){
  // returns the tile object at the plane location passed into the function
  if(x<0 || y<0 || x > canvasSize || y > canvasSize){
    return null
  }

  gridX = Math.floor(x/cellWidth);
  gridY = Math.floor(y/cellWidth);

  //return grid[gridY][gridX]
  return getTileByGrid(gridX, gridY);

}


function getTileByGrid(x,y){
  return grid[y][x] //grid indexed weird
}


function mouseClicked(){
  //-------------------------------------|
  //function called on mouse click by p5 |
  // handles placement of tiles          |
  //-------------------------------------|

  //placing walls dealt with by different function to allow for click+hold to place
  //ignore if wall is being placed (w pressed) OR wall being deleted (d pressed)
  if(keyIsDown(87) || keyIsDown(68)){return}

  let tile = getTileByPlane(mouseX, mouseY);
  if(keyIsDown(70)){ //f to place finish tile
    finish.col = colorDict["idle"]
    finish = tile;
    finish.col = colorDict["finish"];
  }else{
    start.col = colorDict["idle"]
    start = tile;
    start.col = colorDict["start"]
  }
}


function placeWall(){
  let tile = getTileByPlane(mouseX, mouseY);
  let tiles = getNeighbours(tile); //draw THICK lines by painting neighbours too
  tiles.push(tile);
  //tiles = [tile]; uncomment to get single width walls
  if(keyIsDown(87)) {
    for(let tileIndex in tiles){
      tiles[tileIndex].isWall = true;
      tiles[tileIndex].col = colorDict["wall"];
    }
  }else if(keyIsDown(68)){ // 
    for(let tileIndex in tiles){
      tiles[tileIndex].isWall = false;
      tiles[tileIndex].col = colorDict["idle"]
    }
  }
}


function drawTiles(){
  for(let y in grid){
    for(let x in grid[y]){
      tile = grid[y][x]
      tile.draw();
    }
  }
}


function getNeighbours(tile){
  //returns a list of the tile objects that are the neighbours of the parsed tile
  let top = 0;
  let bottom = gridSize - 1;
  let left = 0;
  let right = gridSize - 1;

  let x = tile.x;
  let y = tile.y;

  let neighbours = [];

  if(y > top){
    //check 'top row'
    neighbours.push(getTileByGrid(x, y-1));
    if(x > left){
      neighbours.push(getTileByGrid(x-1, y-1));
    }
    if(x<right){
      neighbours.push(getTileByGrid(x+1, y-1));
    }
  }
  if(x<right){
    //check right column
    neighbours.push(getTileByGrid(x+1, y));
    if(y<bottom){
      neighbours.push(getTileByGrid(x+1, y+1));
    }
  }
  if(y<bottom){
    neighbours.push(getTileByGrid(x, y+1));
    if(x>left){
      neighbours.push(getTileByGrid(x-1, y+1));
    }
  }
  if(x>left){
    neighbours.push(getTileByGrid(x-1, y));
  }

  return neighbours;
}
