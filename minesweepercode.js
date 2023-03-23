var canvas = document.getElementById("myCanvas");


function make2DArray(cols, rows) {
	var arr = new Array(cols);
	for (let i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

function Cell(a, b) {
	this.column = a;
	this.row = b;
	this.x = a * 30;
	this.y = b * 30;
	this.neighborCount = 0;
	this.mine = false;
	this.revealed = false;
	this.flagged = false;
	this.colored = 0;
	this.colorcode = 0;
}

var grid = make2DArray(10,10);

var rows = 10;

var columns = 10;

var recttop = canvas.getBoundingClientRect().top+window.scrollY;

var left = canvas.getBoundingClientRect().left+window.scrollX;

var gameOn = true;

var firstclick = true;

var coloring = false;

var currentcolor = "#000000";

var currentcolorcode = 0;

var typing = false;

var mines = 10;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#808080";

reset();


var seconds = 0;

setInterval(function() {
	if(firstclick == false && gameOn == true){
		document.getElementById("timer").innerHTML = seconds++;
	}
}, 1000);



canvas.addEventListener("click", leftclick, false);

canvas.addEventListener("contextmenu", (e) => {e.preventDefault()});

canvas.addEventListener("contextmenu", rightclick, false);

function rightclick(e) {
	let x = e.pageX;
	let y = e.pageY;
	let i = Math.floor((x-left)/30);
	let j = Math.floor((y-recttop)/30);
	if(gameOn && !coloring){
		if(grid[i][j].revealed == false){
			flag(i,j);
		}
		else{
			chord(i,j);
		}
	}
    else if(gameOn && grid[i][j].revealed){
        color(i,j);
        for(let a = -1; a <= 1; a++){
            for(let b = -1; b <= 1; b++){
                if(i+a >= 0 && i+a < columns && j+b >= 0 && j+b < rows && !grid[i+a][j+b].revealed){
                    color(i+a,b+j);
                }
            }
        }
    }
}

function flag(i,j){
	if(grid[i][j].flagged == false){
		grid[i][j].flagged = true;
		document.getElementById("remainingmines").innerHTML -= 1;
		let img = document.getElementById("flag");
		ctx.drawImage(img,30*i+1,30*j+1);
	}
	else{
		grid[i][j].flagged = false;
		document.getElementById("remainingmines").innerHTML = (+document.getElementById("remainingmines").innerHTML)+1;
		ctx.fillStyle = "#808080";
		ctx.fillRect(30*i+1, 30*j+1, 28, 28);
	}
}

function chord(i,j){
	let neighborflags = 0;
	for(let a = -1; a <= 1; a++){
		for(let b = -1; b <= 1; b++){
			if(i+a >= 0 && i+a < columns && j+b >= 0 && j+b < rows && grid[i+a][j+b].flagged == true){
				neighborflags += 1;
			}
		}
	}
	if(neighborflags == grid[i][j].neighborCount){
		for(let a = -1; a <= 1; a++){
			for(let b = -1; b <= 1; b++){
				if(i+a >= 0 && i+a < columns && j+b >= 0 && j+b < rows && grid[i+a][j+b].revealed == false && grid[i+a][j+b].flagged == false){
					reveal(i+a,j+b);
				}
			}
		}
	}
}


function leftclick(e) {
	let x = e.pageX;
	let y = e.pageY;
	let i = Math.floor((x-left)/30);
	let j = Math.floor((y-recttop)/30);
	if(gameOn && typing){
		grid[i][j].revealed = true;
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(30*i+1, 30*j+1, 28, 28);
		ctx.fillStyle = "#000000";
		ctx.fillText(document.getElementById("showcurrentkey").innerHTML, i*30+8, j*30+25);
	}
	else if(gameOn && !coloring){
		if(firstclick == true){
			firstclick = false;
			startGame(i,j);
		}
		if(grid[i][j].revealed == false && grid[i][j].flagged == false){
			reveal(i,j);
		}
	}
	else if(gameOn && coloring){
		color(i,j);
	}
}

function color(i,j){
	if(!grid[i][j].revealed && !grid[i][j].flagged){
		if(grid[i][j].colored == 0){
			grid[i][j].colored = 1;
			grid[i][j].colorcode += currentcolorcode;
			ctx.fillStyle = currentcolor;
			ctx.fillRect(30*i+2, 30*j+2, 26, 26);
		}
		else if(grid[i][j].colored == 1 && currentcolorcode != grid[i][j].colorcode){
			grid[i][j].colored = 2;
			grid[i][j].colorcode += 3*currentcolorcode;
			ctx.fillStyle = currentcolor;
			ctx.fillRect(30*i+15, 30*j+2, 13, 26);
		}
		else{
			grid[i][j].colored = 0;
			grid[i][j].colorcode = 0;
			ctx.fillStyle = "#808080";
			ctx.fillRect(30*i+1, 30*j+1, 28, 28);
		}
	}
	else if(!grid[i][j].flagged){
		if(grid[i][j].colored == 0){
			ctx.strokeStyle = currentcolor;
			grid[i][j].colored = 2;
			grid[i][j].colorcode = currentcolorcode;
			ctx.strokeRect(30*i+4, 30*j+4, 22, 24);
		}
		else{
			grid[i][j].colored = 0;
			grid[i][j].colorcode = 0;
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(30*i+1, 30*j+1, 28, 28);
			ctx.fillStyle = "#000000";
            if(grid[i][j].neighborCount > 0){
                ctx.fillText(grid[i][j].neighborCount, i*30+8, j*30+25);
            }
			
		}
		
	}
}

function reveal(x,y){
	grid[x][y].revealed = true;
	grid[x][y].colored = 0;
	grid[x][y].colorcode = 0;
	if(grid[x][y].mine == false){
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(30*x+1,30*y+1,28,28);
		ctx.fillStyle = "#000000";
		if(grid[x][y].neighborCount != 0){
			ctx.fillText(grid[x][y].neighborCount, x*30+8, y*30+25);
		}
		if(gameOn){
			document.getElementById("remaining").innerHTML -= 1;
		}
		if(document.getElementById("remaining").innerHTML <= 0){
			document.getElementById("remaining").innerHTML = "You Won!";
			document.getElementById("remainingmines").innerHTML = 0;
			for(let i = 0; i < rows; i++){
				for(let j = 0; j < columns; j++){
					if(grid[j][i].mine == true && grid[j][i].flagged == false){
						grid[j][i].flagged = true;
						let img = document.getElementById("flag");//testing
						ctx.drawImage(img,30*j+1,30*i+1);
					}
				}
			}
			gameOn = false;
		}
		if(grid[x][y].neighborCount == 0){
			for(let c = -1; c < 2; c++){
				for(let d = -1; d < 2; d++){
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
		for(let i = 0; i < columns; i++){
			for(let j = 0; j < rows; j++){
				if(grid[i][j].mine && !grid[i][j].flagged){
					let img2 = document.getElementById("mine");
					ctx.drawImage(img2,30*i+1,30*j+1);
				}
				else if(grid[i][j].flagged && !grid[i][j].mine){
					let img3 = document.getElementById("wrongflag");
					ctx.drawImage(img3,30*i+1,30*j+1);
				}
			}
		}
		let img = document.getElementById("minered");
		ctx.drawImage(img,30*x+1,30*y+1);
		gameOn = false;
		document.getElementById("remaining").innerHTML = "You Lost!";
	}
}




startbutton.addEventListener("click", reset, false);

function reset(e){
	firstclick = true;
	gameOn = true;
	coloring = false;
	seconds = 0;
	document.getElementById("timer").innerHTML = seconds;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	columns = document.getElementById("columns").value;
	canvas.width = columns * 30;
	rows = document.getElementById("rows").value;
	canvas.height = rows * 30;
	mines = document.getElementById("Mines").value;
	document.getElementById("remaining").innerHTML = Math.max(rows*columns - mines, 1);
	document.getElementById("remainingmines").innerHTML = Math.min(mines, rows*columns - 1);
	grid = make2DArray(columns,rows);
	ctx.font = "25px serif";
	for(let i = 0; i <rows; i++){
		for(let j=0; j<columns; j++){
			ctx.strokeStyle = "#000000";
			ctx.strokeRect(30*j, 30*i, 30, 30);
			ctx.fillStyle = "#808080";
			ctx.fillRect(30*j+1, 30*i+1, 28, 28);
			grid[j][i] = new Cell(j,i);
		}
	}
}

function startGame(a,b){
	let cells = columns * rows - 1;
	let random =0;
	recttop = canvas.getBoundingClientRect().top+window.scrollY;
	left = canvas.getBoundingClientRect().left+window.scrollX;
	for(let i = 0; i <rows; i++){
		for(let j=0; j<columns; j++){
			//ctx.strokeStyle = "#000000";
			//ctx.strokeRect(30*j, 30*i, 30, 30);
			random = Math.floor(Math.random()*cells);
			if(random < mines && (a != j || b != i)){
				mines -= 1;
				grid[j][i].mine = true;
			}
			if(a!= j || b != i){
				cells -= 1;
			}
		}
	}
	let count = 0;
	for(let i = 0; i <rows; i++){
		for(let j=0; j<columns; j++){
			if(grid[j][i].mine == false){
				for(let a = -1; a <= 1; a++){
					if(a+j>=0 && a+j<columns){
						for(let b = -1; b<= 1; b++){
							if(b+i>=0 && b+i<rows && grid[a+j][b+i].mine == true){
								count += 1;
							}
						}
					}
				}
				grid[j][i].neighborCount = count;
				count = 0;
			}
		}
	}

  
}

function pressStop(){
	coloring = false;
    document.getElementById("showcurrentcolor").innerHTML = "None";
    document.getElementById("showcurrentcolor").style.color = "black";
}

function pressRed(){
	coloring = true;
	if(typing){
		pressType();
	}
	currentcolor = "#FF0000";
	currentcolorcode = 0;
    document.getElementById("showcurrentcolor").innerHTML = "Red";
    document.getElementById("showcurrentcolor").style.color = "red";
}


function pressGreen(){
	coloring = true;
	if(typing){
		pressType();
	}
	currentcolor = "#00FF00";
	currentcolorcode = 1;
    document.getElementById("showcurrentcolor").innerHTML = "Green";
    document.getElementById("showcurrentcolor").style.color = "green";
}


function pressBlue(){
	coloring = true;
	if(typing){
		pressType();
	}
	currentcolor = "#0000FF";
	currentcolorcode = 2;
    document.getElementById("showcurrentcolor").innerHTML = "Blue";
    document.getElementById("showcurrentcolor").style.color = "blue";
}

function pressClear(){
    for(let i = 0; i < columns; i++){
        for(let j = 0; j < rows; j++){
            if(grid[i][j].colored == 1){
                color(i,j);
            }
			if(grid[i][j].colored == 2){
                color(i,j);
            }
        }
    }
}


window.addEventListener("keydown",changekey,false);

function changekey(e){
	if(typing){
		document.getElementById("showcurrentkey").innerHTML = e.key;
	}
}

function pressType(){
	if(typing){
		typing = false;
		document.getElementById("showtextmode").innerHTML = "No";
	}
	else{
		typing = true;
		document.getElementById("showtextmode").innerHTML = "Yes";
		pressStop();
	}
}