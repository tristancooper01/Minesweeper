var canvas = document.getElementById("myCanvas");

//canvas.style.top = '350px';//figure out another way?

//canvas.style.left = '30px';

function make2DArray(cols, rows) {
	var arr = new Array(cols);
	for (var i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

function Cell(a, b) {
	this.column = a;
	this.row = b;
	this.x = a * 30;
	this.y = b * 30;
	this.neighborCount = -1;
	this.mine = false;
	this.revealed = false;
	this.flagged = false;
}

var grid = make2DArray(10,10);

var rows = 10;

var columns = 10;

var recttop = canvas.getBoundingClientRect().top+window.scrollY;

var left = canvas.getBoundingClientRect().left+window.scrollX;

var gameOn = true;

var firstclick = true;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#808080";

startGame();

var seconds = 0;

setInterval(function() {
	if(firstclick == false && gameOn == true){
		document.getElementById("timer").innerHTML = seconds++;
	}
}, 1000);



canvas.addEventListener("click", clicksquare, false);

canvas.addEventListener("contextmenu", (e) => {e.preventDefault()});

canvas.addEventListener("contextmenu", flag, false);

function flag(e) {
	if(gameOn){
		var x = e.pageX;
		var y = e.pageY;
		i = Math.floor((x-left)/30);
		j = Math.floor((y-recttop)/30);
		document.getElementById("button").innerHTML = i;//test
		document.getElementById("button2").innerHTML = j;//test
		if(grid[i][j].revealed == false){
			if(grid[i][j].flagged == false){
				grid[i][j].flagged = true;
				document.getElementById("remainingmines").innerHTML -= 1;
				ctx.fillStyle = "#00FF00";
				ctx.fillRect(30*i+5, 30*j+5, 20, 20);
			}
			else{
				grid[i][j].flagged = false;
				document.getElementById("remainingmines").innerHTML = (+document.getElementById("remainingmines").innerHTML)+1;
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(30*i+1, 30*j+1, 28, 28);
			}
		}
		else{
			var neighborflags = 0;
			for(var a = -1; a <= 1; a++){
				for(var b = -1; b <= 1; b++){
					if(i+a >= 0 && i+a < columns && j+b >= 0 && j+b < rows && grid[i+a][j+b].flagged == true){
						neighborflags += 1;
					}
				}
			}
			if(neighborflags == grid[i][j].neighborCount){
				for(var a = -1; a <= 1; a++){
					for(var b = -1; b <= 1; b++){
						if(i+a >= 0 && i+a < columns && j+b >= 0 && j+b < rows && grid[i+a][j+b].revealed == false && grid[i+a][j+b].flagged == false){
							//grid[i+a][j+b].revealed = true;
							reveal(i+a,j+b);
						}
					}
				}
			}
		}
	}
}


function clicksquare(e) {
	if(gameOn){
		if(firstclick == true){
			firstclick = false;
		}
		var x = e.pageX;
		var y = e.pageY;
		i = Math.floor((x-left)/30);
		j = Math.floor((y-recttop)/30);
		document.getElementById("button").innerHTML = left;//test
		document.getElementById("button2").innerHTML = recttop;//test
		if(grid[i][j].revealed == false && grid[i][j].flagged == false){
			//grid[i][j].revealed = true;
			reveal(i,j);
		}
	}
}

function reveal(x,y){
	grid[x][y].revealed = true;
	if(grid[x][y].mine == false){
		ctx.fillStyle = "#000000";
		ctx.fillText(grid[x][y].neighborCount, x*30+8, y*30+25);
		if(gameOn){
			document.getElementById("remaining").innerHTML -= 1;
		}
		if(document.getElementById("remaining").innerHTML == 0){
			document.getElementById("remaining").innerHTML = "You Won!";
			document.getElementById("remainingmines").innerHTML = 0;
			for(var i = 0; i < rows; i++){
				for(var j = 0; j < columns; j++){
					if(grid[j][i].mine == true && grid[j][i].flagged == false){
						grid[j][i].flagged = true;
						ctx.fillStyle = "#00FF00";
						ctx.fillRect(30*j+5, 30*i+5, 20, 20);
					}
				}
			}
			gameOn = false;
		}
		if(grid[x][y].neighborCount == 0){
			for(var c = -1; c < 2; c++){
				for(var d = -1; d < 2; d++){
					if(c+x >= 0 && c+x < columns && d+y >= 0 && d+y < rows){
						if(grid[c+x][d+y].revealed == false){
							grid[c+x][d+y].revealed = true;
							reveal(c+x,d+y);
						}
					}
				}
			}
		}
	}
	else{
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(x*30, y*30, 29, 29);
		gameOn = false;
		document.getElementById("remaining").innerHTML = "You Lost!";
	}
}

function myFunction2() {//test
	document.getElementById("button2").innerHTML = 0;
}


startbutton.addEventListener("click", startGame, false);

function startGame(e){
	gameOn = true;
	firstclick = true;
	seconds = 0;
	document.getElementById("timer").innerHTML = seconds;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	columns = document.getElementById("columns").value;
	canvas.width = columns * 30;
	rows = document.getElementById("rows").value;
	canvas.height = rows * 30;
	var mines = document.getElementById("Mines").value;
	document.getElementById("remaining").innerHTML = rows*columns - mines;
	document.getElementById("remainingmines").innerHTML = mines;
	var cells = columns * rows;
	var random =0;
	recttop = canvas.getBoundingClientRect().top+window.scrollY;
	left = canvas.getBoundingClientRect().left+window.scrollX;
	grid = make2DArray(columns,rows);
	for(var i = 0; i <rows; i++){
		for(var j=0; j<columns; j++){
			ctx.strokeRect(30*j, 30*i, 30, 30);
			grid[j][i] = new Cell(j,i);
			random = Math.floor(Math.random()*cells);
			if(random < mines){
				ctx.fillStyle = "#FF0000";
				//ctx.fillRect(j*30, i*30, 29, 29);
				ctx.fillStyle = "#000000";
				ctx.font = "25px serif";
				//ctx.fillText(mines, j*30+8, i*30+25,22);
				mines -= 1;
				grid[j][i].mine = true;
			}
			cells -= 1;
			if(grid[j][i].mine == false){
				ctx.fillStyle = "#000000";
				ctx.font = "25px serif";
			}
		}
	}
	var count = 0;
	for(var i = 0; i <rows; i++){
		for(var j=0; j<columns; j++){
			if(grid[j][i].mine == false){
				for(var a = -1; a <= 1; a++){
					if(a+j>=0 && a+j<columns){
						for(var b = -1; b<= 1; b++){
							if(b+i>=0 && b+i<rows && grid[a+j][b+i].mine == true){
								count += 1;
							}
						}
					}
				}
				ctx.fillStyle = "#000000";
				ctx.font = "25px serif";
				grid[j][i].neighborCount = count;
				//ctx.fillText(grid[j][i].neighborCount, j*30+8, i*30+25);
				count = 0;
			}
		}
	}

  
}



