/// <reference path="../lib/typings/jquery/jquery.d.ts"/>

var tiles = [2, 3, 1, 4, 5, 6, 7, 8, 0];
var initialTiles = [0,0,0,0,0,0,0,0,0];
var previousTiles = [];
var humanCount = 0;
var aiCount = 0;
var count = 0;
let solving;
var previousMove;
var paused = true;

var $target = $('.eight-puzzle');

document.getElementById("solve").addEventListener("click", solve);
document.getElementById("solve_man").addEventListener("click", solve_man);
document.getElementById("new_puzzle").addEventListener("click", generateNewTile);
document.getElementById("initial").addEventListener("click", restoreInitialState);
document.getElementById("suggest_move").addEventListener("click", suggestNextMove);
document.getElementById("suggest_move_man").addEventListener("click", suggestManhattanMove);
// document.getElementById("suggest_move_old").addEventListener("click", suggestNextMove_old);

function render(){
    console.log("hello");
}

function restoreInitialState(){
    count = 0;
    paused = true;
    document.getElementById("solve").innerHTML = "Solve";
    document.getElementById("solve_man").innerHTML = "Solve Manhattan";
    // document.getElementById("solve_old").innerHTML = "Solve Old";
    for(let i = 0; i < 9; i++){
        tiles[i] = initialTiles[i];
    }
    renderTiles();
}

function copyTiles(destination, source){
    previousMove = tiles.indexOf(0);
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
    document.getElementById("solve").innerHTML = "Solve";
    document.getElementById("solve_man").innerHTML = "Solve Manhattan";
    // document.getElementById("solve_old").innerHTML = "Solve Old";
    var i = 0;
    tiles = [];
    manhattanMoveArr = new Array();

    humanCount = 0;
    aiCount = 0;
    count = 0;
    manhattanMoveCount = 0;

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

    for(let i = 0; i < 9; i++){
        initialTiles[i] = tiles[i];
    }

    paused = true;
    document.getElementById("solve").innerHTML = "Solve";
    document.getElementById("solve_man").innerHTML = "Solve Manhattan";
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
        if(isMoveValid(i) && i != previousMove){
            possibleMoves.push(i);
        }
    }
    // console.log(possibleMoves);
}


var shiftTileWithIndex = function (ind) {
    copyTiles(previousTiles, tiles);
    shiftTileArray(ind);
    renderTiles();

};

generateNewTile();

function solve(){
    falseCount = getFalseCount();
    if(falseCount != 0){
        if(paused){
            document.getElementById("solve").innerHTML = "Pause";
            paused = false;
            solving = setInterval(nextMove, 1);
        }else{
            console.log("paused");
            document.getElementById("solve").innerHTML = "Solve";
            paused = true;
            clearInterval(solving);
        }
        
    }
}

function solve_old(){
    falseCount = getFalseCount();
    if(falseCount != 0){
        if(paused){
            // document.getElementById("solve_old").innerHTML = "Pause";
            paused = false;
            solving = setInterval(oldCode, 1);
        }else{
            console.log("paused");
            document.getElementById("solve").innerHTML = "Solve";
            paused = true;
            clearInterval(solving);
        }
        
    }
}

function suggestNextMove(){
    falseCount = getFalseCount();
    if(falseCount != 0){
        nextMove();
    }
}

function suggestNextMove_old(){
    falseCount = getFalseCount();
    if(falseCount != 0){
        oldCode();
    }
}


// A* algorithms starts here

function nextMove(depth = 0){
    newCode();
}

function oldCode(){
    var move = 0;
    var leastHeuristic = Infinity;
    var stri = "";

    getPossibleMoves();

    for(let i = 0; i < possibleMoves.length; i++){
        var heuristic = getHeuristic(0, possibleMoves[i]);
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
        // console.log("solved");
        // console.log(falseCount == 0);
        // console.log("total iterations = " + count);
    }
}

function newCode(){
    var move = 0;
    var leastHeuristic = Infinity;
    var stri = "";

    getPossibleMoves();

    // for(let i = 0; i < possibleMoves.length; i++){
    //     var heuristic = getHeuristic(depth, possibleMoves[i]);
    //     // console.log(heuristic);
    //     if(leastHeuristic > heuristic){
    //         leastHeuristic = heuristic;
    //         move = possibleMoves[i];
    //     }
    //     // stri = stri + (i + " = " + heuristic + ",");

    // }

    move = getBestMoveAt(0);
    leastHeuristic = getHeuristic(0);

    document.getElementById("aiCounter").innerHTML = "leastHeuristic = " + leastHeuristic;
    
    var indOfZero = tiles.indexOf(0);
    shiftTileArray(move);

    // console.log(previousMove);


    // here onward is an old code upto ***
    if(!compareTiles(previousTiles, tiles)){
        // console.log("if called move = " + move);
        shiftTileArray(indOfZero);
        shiftTileWithIndex(move);
    }else{
        shiftTileArray(indOfZero);
        // console.log("else called");
        // console.log(move);
        var randomMove = move;
        var randomNum = 0;
        // getPossibleMoves();
        var iterator = 1;
        var loopCount = 0;
        while(randomMove == move){
            // randomNum = Math.floor(Math.random()*possibleMoves.length);
            // randomMove = possibleMoves[randomNum];

            //TODO: This is new added code so remove if doesnt work

            randomMove = getBestMoveAt(iterator);
            loopCount++;

            if(loopCount > 5){
                console.log("stucked in loop at iteration = " + count);
                console.log(possibleMoves);
                console.log(distanceArr);
                console.log("suggested move = " + randomMove);
                clearInterval(solving);
                return;
            }
        }
        // console.log("else called move = " + randomMove);
        // randomMove = possibleMoves[randomNum];

        // console.log(possibleMoves,possibleMoves[randomNum]);

        // console.log(previousTiles);
        // console.log(tiles);
        // console.log(possibleMoves);
        // console.log(randomNum);
        // console.log(randomMove);

        shiftTileWithIndex(randomMove);
    }
    // ***


        
    // console.log(previousTiles);
    // console.log(tiles);

    if(falseCount == 0){
        clearInterval(solving);
        document.getElementById("solve").innerHTML = "Solve";
        // console.log("solved");
        // console.log(falseCount == 0);
        console.log("total iterations = " + count + " falseCount = " + falseCount);
    }
    
}

var heuristicArr = [];

function getBestMoveAt(index){
    var temp;
    heuristicArr = [];
    var twoSame = true;
    var countSame = 1;


    for(let i = 0; i < possibleMoves.length; i++){
        heuristicArr.push(getHeuristic(0 , possibleMoves[i]));
    }

    for(let i = 0; i < possibleMoves.length - 1; i++){
        for(let j = i + 1; j < possibleMoves.length; j++){
            if(heuristicArr[i] > heuristicArr[j]){
                temp = heuristicArr[i];
                heuristicArr[i] = heuristicArr[j];
                heuristicArr[j] = temp;


                temp = possibleMoves[i];
                possibleMoves[i] = possibleMoves[j];
                possibleMoves[j] = temp;
            }
        }
    }
    // console.log(possibleMoves);
    // console.log(heuristicArr);
    // console.log(initialMove);

    for(let i = index; i < possibleMoves.length - 1; i++){
        // if(initialMove == possibleMoves[i]){
        //     continue;
        // }
        if(heuristicArr[i] != heuristicArr[i + 1]){
            break;
        }else{
            countSame++;
        }
    }

    if(countSame > 1){
        
        var randNum = Math.floor(Math.random() * countSame);
        suggestedMove = possibleMoves[index + randNum];
        
        

        return suggestedMove;
    }

    // if(possibleMoves[index] != initialMove){
    //     return possibleMoves[index];
    // }else{
    //     return getBestMoveAt(index + 1, initialMove);
    // }
    return possibleMoves[index];
    
}

//manhattan distance process starts here


var distanceArr = [];
var manhattanMoveArr = new Array();

var manhattanMoveCount = 0;
function suggestManhattanMove(){
    var leastDistance = Infinity;
    var move;
    manhattanMoveCount++;

    getPossibleMoves();

    move = getBestManhattanMove()

    // console.log(possibleMoves);
    // console.log(distanceArr);

    // shiftTileArray(move);
    shiftTileWithIndex(move);

    manhattanMoveArr.push(move);

    if(falseCount == 0){
        clearInterval(solving);
        document.getElementById("solve").innerHTML = "Solve";
        document.getElementById("solve_man").innerHTML = "Solve Manhattan";
        // console.log("solved");
        // console.log(falseCount == 0);
        console.log("total iterations = " + manhattanMoveCount + " falseCount = " + falseCount);

        if(manhattanMoveArr.length < 100){
            console.log(manhattanMoveArr);
        }
    }

}

function getBestManhattanMove(){
    var temp;
    distanceArr = [];
    var twoSame = true;
    var countSame = 1;


    for(let i = 0; i < possibleMoves.length; i++){
        distanceArr.push(findManhattanDistanceSum(possibleMoves[i]));
    }

    for(let i = 0; i < possibleMoves.length - 1; i++){
        for(let j = i + 1; j < possibleMoves.length; j++){
            if(distanceArr[i] > distanceArr[j]){
                temp = distanceArr[i];
                distanceArr[i] = distanceArr[j];
                distanceArr[j] = temp;


                temp = possibleMoves[i];
                possibleMoves[i] = possibleMoves[j];
                possibleMoves[j] = temp;
            }
        }
    }
    for(let i = 0; i < possibleMoves.length - 1; i++){
        
        if(distanceArr[i] != distanceArr[i + 1]){
            break;
        }else{
            countSame++;
        }
    }

    if(countSame > 1){
        // console.log("randomized");
        var randNum = Math.floor(Math.random() * countSame);
        suggestedMove = possibleMoves[randNum];

        return suggestedMove;
    }

    return possibleMoves[0];
    
}

function findManhattanDistanceSum(index){
    var sum = 0;

    var temp = tiles.indexOf(0);
    shiftTileArray(index);


    for(let i = 0; i < 9; i++){
        sum += calculateManhattanDistanceAt(i);
    }

    shiftTileArray(temp);

    return sum;
}

function calculateManhattanDistanceAt(index){
    var count = 0;
    var tempArr = [];
    var temp;

    for(let i = 0; i < 9; i++){
        tempArr.push(tiles[i]);
    }
    var number = tempArr[index];
    if(number == 0){
        number = 9;
    }

    while(tempArr.indexOf(tempArr[index]) != number - 1){
        // console.log("looping");
        if(count > 20){
            break;
        }
        if((index % 3) < (number - 1) % 3){ // shift to right
            temp = tempArr[index];
            tempArr[index] = tempArr[index + 1];
            tempArr[index + 1] = temp;
            index = index + 1;

            count++;
            // console.log("right");
            // console.log(tempArr);

        }
        if((index % 3) > (number - 1) % 3){ // shift to left
            temp = tempArr[index];
            tempArr[index] = tempArr[index - 1];
            tempArr[index - 1] = temp;
            index = index - 1;

            count++;
            // console.log("left");
            // console.log(tempArr);

        }
        if(Math.floor(index / 3) < Math.floor((number - 1) / 3)){ // shift to down
            temp = tempArr[index];
            tempArr[index] = tempArr[index + 3];
            tempArr[index + 3] = temp;
            index = index + 3;

            count++;
            // console.log("down");
            // console.log(tempArr);

        }
        if(Math.floor(index / 3) > Math.floor((number - 1) / 3)){ // shift to up
            temp = tempArr[index];
            tempArr[index] = tempArr[index - 3];
            tempArr[index - 3] = temp;
            index = index - 3;

            count++;

            // console.log("up");
            // console.log(tempArr);

        }
    }

    return count;
}

function solve_man(){
    falseCount = getFalseCount();
    if(falseCount != 0){
        if(paused){
            document.getElementById("solve_man").innerHTML = "Pause";
            paused = false;
            solving = setInterval(suggestManhattanMove, 1);
        }else{
            console.log("paused");
            document.getElementById("solve_man").innerHTML = "Solve Manhattan";
            paused = true;
            clearInterval(solving);
        }
        
    }
}

