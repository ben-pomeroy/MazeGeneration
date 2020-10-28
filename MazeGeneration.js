var cols, rows; //creates two empty variables, one for columns, one for rows
var w = 20; //w defines how big the grid squares are
var grid = []; //creates an empty array used to store CELL objects

var current; //keeps track of where the cell being used is

var stack = []; //allows the program to store all cells that have other potential moves and helps aid backtracking

function setup() {
  createCanvas(400, 400); //creates a canvas that is 400px x 400px
  cols = floor(width/w); //number of columns = width of canvas / cell width as an integer
  rows = floor(height/w); //same for rows
  //frameRate(5);
  
  //Grid Generation
  for(var j = 0; j < rows; j++){ //Loops through each row
    for(var i = 0; i < cols; i++){ //Loops through each column
      var cell = new Cell(i,j); //Creates a new version of the class Cell with the current grid position as paramaters
      grid.push(cell); //Appends the new cell to the array grid
    }
  }
  
  current = grid[0]; //Start of the maze is at [0][0]
}

function draw() { //Every frame this is carried out
  background(51); //Sets the background to grey
  for(var i = 0; i<grid.length; i++){ //Loops through each CELL object in 'grid'
    grid[i].show(); //Calls the function show() inside the CELL object
  }
  
  current.visited = true; //sets the starting square.visited to true
  current.highlight(); //highlights the current square to help debug
  var next = current.checkNeighbours(); //checks to see if the current square has any available neighbours, will return undefined if it does not have any available neighbours and will return a random neighbour if possible
  if(next){ //if the variable is defined, it means it has available neighbours
    
    next.visited = true; //sets the visited parameter of the next square to true
    
    stack.push(current); //appends the current square to the stack to allow to backtrack and go back along
    
    removeWalls(current, next); //calls the function remove walls and passes two squares in
    
    current = next; //sets the current square to the new one
  }else if(stack.length > 0){//If there are no available neighbours, and the stack has more than one square in
    current = stack.pop(); //Take the most recent square from the stack and set that to the current square
  }
}

function index(i,j){ //This is used to help gain the positions of any neighbouring cells
  if(i<0 || j<0 || i > cols-1 || j > rows-1){ //If any values are off the screen
    return -1; //return a negative value, invaliditing the variable
  }
  return i + j * cols; //helps find the neighbouring cells in a 1D array
}

function Cell(i,j){ //Declaration of the Cell Object
  this.i = i; 
  this.j = j;
  this.walls = [true,true,true,true];
  this.visited = false;
  
  this.checkNeighbours = function(){
    var neighbours = [];
    
    var top = grid[index(i, j-1)];
    var right = grid[index(i+1, j)];
    var bottom = grid[index(i, j+1)];
    var left = grid[index(i-1, j)];
    
    if(top && !top.visited){
      neighbours.push(top);
    }
    if(right && !right.visited){
      neighbours.push(right);
    }
    if(bottom && !bottom.visited){
      neighbours.push(bottom);
    }
    if(left && !left.visited){
      neighbours.push(left);
    }
    
    if(neighbours.length > 0){
      var r = floor(random(0, neighbours.length));
      return neighbours[r];
    }else{
      return undefined;
    }
  }
  
  this.highlight = function(){
    var x = this.i*w;
    var y = this.j*w;
    noStroke();
    fill(0,0,255,100);
    rect(x,y,w,w,);
  }
  
  this.show = function(){
    var x = this.i*w;
    var y = this.j*w;
    stroke(255);
    if(this.walls[0]){
      line(x,y,x+w,y);
    }
    if(this.walls[1]){
      line(x+w,y,x+w,y+w);
    }
    if(this.walls[2]){
      line(x+w,y+w,x,y+w);
    }
    if(this.walls[3]){
      line(x,y+w,x,y);
    }

    if(this.visited){
      noStroke();
      fill(255,0,255,100);
      rect(x,y,w,w);
    }
    
  }
   
}

function removeWalls(a,b){
  var x = a.i - b.i;
  if(x === 1){
    a.walls[3] = false;
    b.walls[1] = false;
  }else if (x=== -1){
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if(y === 1){
    a.walls[0] = false;
    b.walls[2] = false;
  }else if (y === -1){
    a.walls[2] = false;
    b.walls[0] = false;
  }
}