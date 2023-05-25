/// <reference path="../lib/typings/jquery/jquery.d.ts"/>

var tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
var humanCount = 0;
var aiCount = 0;
var count = 0;

var $target = $('.eight-puzzle');

document.getElementById("new_puzzle").addEventListener("click", generateNewTile);
document.getElementById("suggest_move").addEventListener("click", suggestNextMove);

function render(){
	console.log("hello");
}

function generateNewTile(){
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

var falseCount = 0;

function renderTiles() {
	
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
        targetIndex = index - 1;
    } else if (index + 1 < tiles.length && tiles[index + 1] == 0) { // check right
        targetIndex = index + 1;
    } else if (index - 3 >= 0 && tiles[index - 3] == 0) { //check up
        targetIndex = index - 3;
    } else if (index + 3 < tiles.length && tiles[index + 3] == 0) { // check down
        targetIndex = index + 3;
    }

    if (targetIndex != -1) {
        var temp = tiles[targetIndex];
        tiles[targetIndex] = tiles[index];
        tiles[index] = temp;
        for(let i = 1; i < 9; i++){
        	if(tiles[i - 1] != i){
        		falseCount++;
        	}
        }
        count++;
        getPossibleMoves();
        document.getElementById("humanCounter").innerHTML = "Human Counter : " + count + " getHeuristic = " + getHeuristic(0) + "<br>possibleMoves = " + possibleMoves;
    }

};

function isMoveValid(index){

    var targetIndex = -1;
    if (index - 1 >= 0 && tiles[index - 1] == 0) { // check left
        targetIndex = index - 1;
    } else if (index + 1 < tiles.length && tiles[index + 1] == 0) { // check right
        targetIndex = index + 1;
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

function getHeuristic(level){
	return level + falseCount;
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
    shiftTileArray(ind);
    renderTiles();

};

generateNewTile();

function suggestNextMove(){
	shiftTileWithIndex(3);
}


// A* algorithms starts here

