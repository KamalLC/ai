var playCount = 0;
var minimaxCount = 0;
var alphaBetaCount = 0;

var winner;
var turn = "X";
var humanPlayer;
var aiPlayer;
var algorithm;
var gameOver = false;

var startBtn = document.getElementById("start");

startBtn.addEventListener("click", startGame);
// startGame();

var playBoxes = document.getElementsByClassName("button-option");

// playBoxes[0].innerHTML = "X";
// console.log("text = " + playBoxes[0].innerHTML);

var board = [];
// board.push("");
// console.log("text = " + board.length);
for(let i = 0; i < 9; i++){
	playBoxes[i].addEventListener("click", putMark);
	playBoxes[i].disabled = true;
}

// playBoxes[0].addEventListener("click", demo);
// function demo(e){
// 	e.target.innerHTML = "X";
// }
for(let i = 0; i < 9; i++){
	board.push(playBoxes[i].innerHTML);
}
	// console.log(!board[0]);

function clearBoard(){
	for(let i = 0; i < 9; i++){
		playBoxes[i].innerHTML = " ";
		board[i] = " ";
		playBoxes[i].style.backgroundColor = "#ffffff";


		var idName = "c" + (i+1);
		// console.log(idName);
		document.getElementById(idName).innerHTML = "0";

		var selectedName = "added" + (i+1);
		var selectedRow = document.getElementById(selectedName);
		selectedRow.style.visibility = "hidden";
	}
}

function clearBackground(){
	for(let i = 0; i < 9; i++){
		playBoxes[i].style.backgroundColor = "#ffffff";
	}
}

function enableButtons(){
	for(let i = 0; i < 9; i++){
		playBoxes[i].disabled = false;
	}
}

function disableButtons(){
	for(let i = 0; i < 9; i++){
		playBoxes[i].disabled = true;
	}
}

function stateChanged(){
	for(let i = 0; i < 9; i++){
		board[i] = playBoxes[i].innerHTML;
	}

	if(turn != humanPlayer && !isGameOver()){
		autoPlay();
	}

	if(isGameOver()){
		displayMessage();
		disableButtons();
	}
}

function startGame(){
	document.getElementById("start").innerHTML = "Restart";
	document.getElementById("result").innerHTML = " ";
	// console.log("hello");

	enableButtons();
	clearBoard();
	turn = "X";
	playCount = 0;
	minimaxCount = 0;
	alphaBetaCount = 0;
	winner = "";
	gameOver = false;
	document.getElementById("result").innerHTML = "";
	document.getElementById("count").innerHTML = Math.max(minimaxCount, alphaBetaCount);

	// finding which sign the human player has choosen
	var value= document.getElementsByName('player');
	for (var radio of value){
		if (radio.checked) {    
	        humanPlayer = radio.value;
	        // console.log(humanPlayer);
	    }
	}

	aiPlayer = humanPlayer == "X" ? "O" : "X";

	// finding which algorithm the human player has choosen
	value= document.getElementsByName('algo');
	for (var radio of value){
		if (radio.checked) {    
	        algorithm = radio.value;
	        // console.log(algorithm);
	    }
	}
	document.getElementById("alg").innerHTML = algorithm;

	if(turn != humanPlayer){
		autoPlay();
	}

	// isGameOver();
	
}

function displayMessage(){
	if(winner == "X"){
		document.getElementById("result").innerHTML = "X has won!";
	}else if(winner == "O"){
		document.getElementById("result").innerHTML = "O has won!";
	}else{
		document.getElementById("result").innerHTML = "It's a draw!";
	}

	// console.log(board);
}

function isGameOver(){
	winner = getWinner();
	if(winner == "X" || winner == "O" || countRemainingMoves() == 0){
		// console.log("56 true" + winner);
		gameOver = true;
		winner = getWinner();
		return true;
	}
}

function getWinner(){
	// checking rows for winner

	for(let i = 0; i < 3; i++){
		// checking rows for winner
		if(board[3*i] == board[3*i + 1] && board[3*i + 1] == board[3*i + 2]){
			if(board[3*i] != " "){
				if(gameOver){
					playBoxes[3*i].style.backgroundColor = "#D0F5BE";
					playBoxes[3*i + 1].style.backgroundColor = "#D0F5BE";
					playBoxes[3*i + 2].style.backgroundColor = "#D0F5BE";
				}
				
				return board[3*i];
			}
			
		}

		// checking column for winner
		if(board[i] == board[i + 3] && board[i + 3] == board[i + 6]){
			if(board[i] != " "){
				if(gameOver){
					playBoxes[i].style.backgroundColor = "#D0F5BE";
					playBoxes[i + 3].style.backgroundColor = "#D0F5BE";
					playBoxes[i + 6].style.backgroundColor = "#D0F5BE";
				}
				return board[i];
			}
		}
	}

	// checking first diagonal for winner
	if(board[0] == board[4] && board[4] == board[8]){
		if(board[0] != " "){
			if(gameOver){
				playBoxes[0].style.backgroundColor = "#D0F5BE";
				playBoxes[4].style.backgroundColor = "#D0F5BE";
				playBoxes[8].style.backgroundColor = "#D0F5BE";
			}
			return board[0];
		}
	}

	// checking second diagonal for winner
	if(board[2] == board[4] && board[4] == board[6]){
		if(board[2] != " "){
			if(gameOver){
				playBoxes[2].style.backgroundColor = "#D0F5BE";
				playBoxes[4].style.backgroundColor = "#D0F5BE";
				playBoxes[6].style.backgroundColor = "#D0F5BE";
			}
			return board[2];
		}
	}

	return " ";

}

function whoseTurn(){
	return turn;
}

function putMark(e){
	e.target.innerHTML = turn;
	e.target.disabled = true;
	turn = turn == 'X' ? 'O' : 'X';
	// e.target.style.backgroundColor = "#D0F5BE";
	stateChanged();
	isGameOver();
}

function putMarkAi(e){
	playBoxes[e].innerHTML = turn;
	playBoxes[e].disabled = true;
	turn = turn == 'X' ? 'O' : 'X';
	playBoxes[e].style.backgroundColor = "#D0F5BE";
	stateChanged();
	isGameOver();
}

function switchTurn(){
	turn = (turn == "X") ? 'O' : 'X';
}

function getMark(ind){
	return board[ind];
}


function countRemainingMoves(){
	var count = 0;
	for(let i = 0; i < 9; i++){
		if(board[i] == " "){
			count++;
		}
	}
	return count;
}

function autoPlay(){
	var maxScore = -100;
	var ind = 0;

	minimaxCount = 0;
	alphaBetaCount = 0;

	clearBackground();

	for(let i = 0; i < 9; i++){
		var idName = "c" + (i+1);
		// console.log(idName);
		document.getElementById(idName).innerHTML = "occupied";

		var selectedName = "added" + (i+1);
		var selectedRow = document.getElementById(selectedName);
		selectedRow.style.visibility = "hidden";
		if(board[i] == " "){
			board[i] = turn;
			switchTurn();

			var score;
			if(algorithm == "minimax"){
				score = minimax(false);
			}else{
				score = alphaBeta(false);
			}

			if(score > maxScore){
				maxScore = score;
				ind = i;
			}

			board[i] = " ";
			switchTurn();
			// console.log(i + ":" + score + " ind: " + ind);
			document.getElementById(idName).innerHTML = score;
		}
	}
	var selectedName = "added" + (ind+1);
	var selectedCell = document.getElementById(selectedName);
	selectedCell.style.visibility = "visible";
	// console.log("hey");
	// console.log("minimaxCount = " + minimaxCount);
	// console.log("alphaBetaCount = " + alphaBetaCount);

	document.getElementById("alg").innerHTML = algorithm;
	document.getElementById("count").innerHTML = Math.max(minimaxCount, alphaBetaCount);

	putMarkAi(ind);
	// console.log("maxScore = " + maxScore);
}

function minimax(isMaximizing){
	if(getWinner() !== " "){
		return getWinner() === aiPlayer ? 1 : -1;
	}
	if(countRemainingMoves() == 0){
		return 0;
	}
	minimaxCount++;

	if(isMaximizing){
		var maxScore = -100;

		for(let i = 0; i < 9; i++){
			if(board[i] == " "){
				board[i] = turn;
				switchTurn();

				var score = minimax(false);

				if(score > maxScore){
					maxScore = score;
				}

				board[i] = " ";
				switchTurn();
			}
		}
		return maxScore;
	}else{
		var minScore = 100;

		for(let i = 0; i < 9; i++){
			if(board[i] == " "){
				board[i] = turn;
				switchTurn();

				var score = minimax(true);

				if(score < minScore){
					minScore = score;
				}

				board[i] = " ";
				switchTurn();
			}
		}
		return minScore;
	}
}

function alphaBeta(isMaximizing){
	if(getWinner() !== " "){
		return getWinner() === aiPlayer ? 1 : -1;
	}
	if(countRemainingMoves() == 0){
		return 0;
	}
	alphaBetaCount++;

	if(isMaximizing){
		var maxScore = -100;

		for(let i = 0; i < 9; i++){
			if(board[i] == " "){
				board[i] = turn;
				switchTurn();

				var score = alphaBeta(false);

				if(score > maxScore){
					maxScore = score;
				}

				board[i] = " ";
				switchTurn();

				if(maxScore == 1){
					break;
				}
			}
		}
		return maxScore;
	}else{
		var minScore = 100;

		for(let i = 0; i < 9; i++){
			if(board[i] == " "){
				board[i] = turn;
				switchTurn();

				var score = alphaBeta(true);

				if(score < minScore){
					minScore = score;
				}

				board[i] = " ";
				switchTurn();

				if(minScore == -1){
					break;
				}
			}
		}
		return minScore;
	}
}