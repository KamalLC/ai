/// <reference path="../lib/typings/jquery/jquery.d.ts"/>

var tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
var previousTiles = [];
var humanCount = 0;
var aiCount = 0;
var count = 0;
let solving;

var $target = $('.eight-puzzle');

document.getElementById("solve").addEventListener("click", solve);
document.getElementById("new_puzzle").addEventListener("click", generateNewTile);
document.getElementById("suggest_move").addEventListener("click", suggestNextMove);

function render(){
	console.log("hello");
}

function copyTiles(destination, source){
    previousTiles = [];
    for(let i = 0; i < source.length; i++){
        previousTiles.push(source[i]);
    }

    // console.log(previousTiles);
    // console.log(previousTiles);
}

function compareTiles(destination, source){
    if(destination.length != source.length){
        return false;
    }
    for(let i = 0; i < source.length; i++){
        if(source[i] != destination[i]){
            return false;
        }
    }
    return true;
}

function generateNewTile(){
    clearInterval(solving);
	var i = 0;
	tiles = [];

	humanCount = 0;
	aiCount = 0;
	count = 0;

	while(i < 9){
		let x = Math.floor((Math.random() * 9));
		if(!tiles.includes(x)){
			tiles.push(x);
			i++;
		}
	}
    document.getElementById("humanCounter").innerHTML = "Human Counter : " + count;
    
    if(!checkSolvable()){
    	generateNewTile();
    }

    document.getElementById("aiCounter").innerHTML = checkSolvable();


	renderTiles();
}

function isSolved(){
    falseCount = getFalseCount();
    console.log(falseCount == 0);
    return falseCount == 0;
}

var falseCount = 0;

function renderTiles() {
    count++;
	
    // console.log("hello");
    // falseCount = 0;

    var $ul = $("<ul>", {
        "class": "n-puzzle"
    });
    $(tiles).each(function (index) {
        var correct = index + 1 == this;
        // falseCount = correct ? falseCount : falseCount + 1;
        var cssClass = this == 0 ? "empty" : (correct ? "correct" : "incorrect");

        var $li = $("<li>", {
            "class": cssClass,
            "data-tile": this,
        });
        $li.text(this);
        $li.click({index: index}, shiftTile);
        $ul.append($li);
    })

    $target.html($ul);
};


var checkSolvable = function () {
    var sum = 0;
    for (var i = 0; i < 8; i++) {
    	for(var j = i + 1; j < 9; j++){
    		if(tiles[i] && tiles[j] && tiles[i] > tiles[j]){
    			sum++;
    		}
    	}

    }

    return sum % 2 == 0;
};

var shiftTile = function (event) {
    var index = event.data.index;

    shiftTileWithIndex(index);

    event.preventDefault();
};



var shiftTileArray = function (ind) {
    var index = ind;
    falseCount = 0;

    var targetIndex = -1;
    if (index - 1 >= 0 && tiles[index - 1] == 0) { // check left
        if(Math.floor(index/3) == Math.floor((index - 1)/3)){
            targetIndex = index - 1;
        }
    } else if (index + 1 < tiles.length && tiles[index + 1] == 0) { // check right
        if(Math.floor(index/3) == Math.floor((index + 1)/3)){
            targetIndex = index + 1;
        }
    } else if (index - 3 >= 0 && tiles[index - 3] == 0) { //check up
        targetIndex = index - 3;
    } else if (index + 3 < tiles.length && tiles[index + 3] == 0) { // check down
        targetIndex = index + 3;
    }

    if (targetIndex != -1) {
        var temp = tiles[targetIndex];
        tiles[targetIndex] = tiles[index];
        tiles[index] = temp;
        getFalseCount();
        // count++;
        getPossibleMoves();
        document.getElementById("humanCounter").innerHTML = "Total Iterations : " + count;
    }
    // console.log("falsecount at shiftTileArray = " + falseCount);

};

function getFalseCount(){
    falseCount = 0;
    for(let i = 1; i < 9; i++){
        if(tiles[i - 1] != i){
            falseCount++;
        }
    }
    // console.log(falseCount);

    return falseCount;
}

function isMoveValid(index){

    var targetIndex = -1;
    if (index - 1 >= 0 && tiles[index - 1] == 0) { // check left
        if(Math.floor(index/3) == Math.floor((index - 1)/3)){
            targetIndex = index - 1;
        }
    } else if (index + 1 < tiles.length && tiles[index + 1] == 0) { // check right
        if(Math.floor(index/3) == Math.floor((index + 1)/3)){
            targetIndex = index + 1;
        }
    } else if (index - 3 >= 0 && tiles[index - 3] == 0) { //check up
        targetIndex = index - 3;
    } else if (index + 3 < tiles.length && tiles[index + 3] == 0) { // check down
        targetIndex = index + 3;
    }

    if(targetIndex != -1){
    	return true;
    }
    return false;
}

function getHeuristic(level, index){
    var temp = tiles.indexOf(0);
    // console.log("falsecount at getHeuristic = " + falseCount);
    shiftTileArray(index);
    // console.log("falsecount at getHeuristic = " + falseCount);
	var heu = level + falseCount;
    // console.log("heu at getHeuristic = " + heu);
    shiftTileArray(temp);
    return heu;
}

var possibleMoves = [];

function getPossibleMoves(){
	possibleMoves = [];
	
	for(let i = 0; i < 9; i++){
		if(isMoveValid(i)){
			possibleMoves.push(i);
		}
	}
}


var shiftTileWithIndex = function (ind) {
    copyTiles(previousTiles, tiles);
    shiftTileArray(ind);
    renderTiles();

};

generateNewTile();

function solve(){
    solving = setInterval(nextMove, 1);
}

function suggestNextMove(){
    nextMove();
}


// A* algorithms starts here

function nextMove(depth = 0){
    var move = 0;
    var leastHeuristic = Infinity;
    var stri = "";

    getPossibleMoves();

    for(let i = 0; i < possibleMoves.length; i++){
        var heuristic = getHeuristic(depth, possibleMoves[i]);
        // console.log(heuristic);
        if(leastHeuristic > heuristic){
            leastHeuristic = heuristic;
            move = possibleMoves[i];
        }
        // stri = stri + (i + " = " + heuristic + ",");

    }
    document.getElementById("aiCounter").innerHTML = "leastHeuristic = " + leastHeuristic;
    
    var indOfZero = tiles.indexOf(0);
    shiftTileArray(move);
    if(!compareTiles(previousTiles, tiles)){
        // console.log("if called");
        shiftTileArray(indOfZero);
        shiftTileWithIndex(move);
    }else{
        shiftTileArray(indOfZero);
        // console.log("else called");
        // console.log(move);
        var randomMove = move;
        var randomNum = 0;
        // getPossibleMoves();
        while(randomMove == move){
            randomNum = Math.floor(Math.random()*possibleMoves.length);
            randomMove = possibleMoves[randomNum];
        }
        randomMove = possibleMoves[randomNum];
        // console.log(possibleMoves,possibleMoves[randomNum]);

        // console.log(previousTiles);
        // console.log(tiles);
        // console.log(possibleMoves);
        // console.log(randomNum);
        // console.log(randomMove);

        shiftTileWithIndex(randomMove);
    }
    // console.log(previousTiles);
    // console.log(tiles);

    if(falseCount == 0){
        clearInterval(solving);
        console.log("solved");
        console.log(falseCount == 0);
        console.log("total iterations = " + count);
    }
    
}