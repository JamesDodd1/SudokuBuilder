// Sudoku containing boxes
class Sudoku {
    constructor(numOfBoxes) { 
        this.boxes = [];
        this.createBoxes(numOfBoxes);
    }

    createBoxes(numOfBoxes) {
        for (let i = 0; i < numOfBoxes; i++) {
            this.boxes.push(new Box(numOfBoxes));
        }
    }

    getBoxes() { return this.boxes; }
}


// Box which makes up a sudoku, containing squares
class Box {
    constructor(numOfSquares) {
        this.squares = [];
        this.createSquares(numOfSquares);
    }

    createSquares(numOfSquares) {
        for (let i = 0; i < numOfSquares; i++) {
            this.squares.push(new Square(numOfSquares));
        }
    }

    getSquares() { return this.squares; }
}


// Square which makes up a box, containing notes
class Square {
    constructor(numOfNotes) {
        this.num = 0;
        this.notes = [];
        this.createNotes(numOfNotes);
    }

    createNotes(numOfNotes) {
        for (let i = 0; i < numOfNotes; i++) {
            this.notes.push(new Notes(i + 1));
        }
    }

    getNumber() { return this.num; }
    getNotes() { return this.notes; }

    setNumber(num) { this.num = num; }
}


// Notes which makes up a square
class Notes {
    constructor(num) {
        this.num = num;
        this.isSelected = false;
    }

    getNum() { return this.num; }
    getIsSelected() { return this.isSelected; }

    setIsSelected(isSelected) { this.isSelected = isSelected; }
}




var sudoku;

function create() {
    let numOfSquares = 9;
    sudoku = new Sudoku(numOfSquares);
    
    // Create sudoku board
    createSudoku(numOfSquares);
    createNumbers(numOfSquares);

    
    // Load any previously saved sudokus
    loadSudoku();
}


// Generates the HTML for the sudoku
function createSudoku(numOfBoxes) {
    let sudoku = '';
    
    for (let i = 0; i < numOfBoxes; i++) {
        sudoku += createBox(i, 9);
    }

    document.getElementById('sudoku').innerHTML = sudoku;
}


// Generates the HTML for a box
function createBox(boxPos, numOfSquares) {
    let squares = '';

    for (let i = 0; i < numOfSquares; i++) {
        squares += createSquare(boxPos, i, 9);
    }

    return '<div class="box"> \n' + squares + '</div> \n';
}


// Generates the HTML for a square
function createSquare(boxPos, squarePos, numOfNotes) {
    let notes = '';

    for (let i = 0; i < numOfNotes; i++) {
        notes += createNote();
    }

    return '<div class="square" onclick="OpenPopup(' + boxPos + ', ' + squarePos + ')"> \n <span> </span> \n ' + notes + '</div> \n';
}


// Generates the HTML for a note
function createNote() {
    return '<div class="note"> </div> \n';
}


// Generates the HTML for popup numbers
function createNumbers(numOfNumbers) {
    let buttons = '';

    // Set if each button is enable or disable  
    for (let i = 0; i < numOfNumbers; i++) {
        buttons += '<button class="num disable" onclick="PossibleNumToggle(' + i + ')"> ' + (i + 1) + ' </button> \n';
    }

    document.getElementById("numbers").innerHTML = buttons;
}




var box, square, notes;

// Displays the popup and stores which square is selected
function OpenPopup(box, square) {
    document.getElementById("popup").style.display = "block"; 
    document.getElementById("shadow").style.display = "block";


    // Store square info to save when popup closed 
    this.box = box;
    this.square = square;
    this.notes = this.sudoku.getBoxes()[this.box].getSquares()[this.square].getNotes();

    setNumbers();
}


function setNumbers() {
    let numbers = document.getElementById("numbers").getElementsByClassName("num");

    // Set if each button is enable or disable  
    for (let i = 0; i < numbers.length; i++) {

        if (this.notes[i].getIsSelected()) {
            if (numbers[i].classList.contains("disable")) {
                numbers[i].classList.remove("disable");
                numbers[i].classList.add("enable");
            }
        }
        else {
            if (numbers[i].classList.contains("enable")) {
                numbers[i].classList.remove("enable");
                numbers[i].classList.add("disable");
            }
        }
    }
}


// Toggles possible number's selected status
function PossibleNumToggle(pos) {
    // Toggle mini square's selected value
    let note = this.notes[pos];
    note.setIsSelected(!note.getIsSelected());


    let num = document.getElementById("numbers").getElementsByClassName("num")[pos];
    
    // Toggles selected status
    if (num.classList.contains("enable")) {
        num.classList.remove("enable");
        num.classList.add("disable");
    }
    else {
        num.classList.remove("disable");
        num.classList.add("enable");
    }
}


// Saves the sudoku's status and closes the popup
function ClosePopup() {
    document.getElementById('popup').style.display='none'; 
    document.getElementById('shadow').style.display='none';
    
    setSquareNums();
    saveSudoku();
}


// Prints the numbers into the selected square
function setSquareNums() {
    let square = document.getElementsByClassName('box')[this.box].getElementsByClassName('square')[this.square];
    let squareNum = square.getElementsByTagName("span")[0];
    let notes = square.getElementsByClassName('note');
    

    let multiple = true;

    // Find if more that one element selected
    for (let i = 0; i < this.notes.length; i++) {
        
        if (this.notes[i].getIsSelected()) {
            
            // False when first selected found
            if (multiple) {
                multiple = false;
                continue;
            }

            // True when second selected found
            multiple = true;
            break;
        }
    }

	
	squareNum.innerHTML = ''; // Clear square
	let pos = 0;
	let end = this.notes.length - 1;

	// Display the numbers which are selected 
	for (let i = 0; i < this.notes.length; i++) {

		if (multiple) {
			// Set selected number at the start and clear from the end 
			if (this.notes[i].getIsSelected())
                notes[pos++].innerHTML = this.notes[i].getNum();
			else 
                notes[end--].innerHTML = "";
		}
		else {
			// Display selected number
			if (this.notes[i].getIsSelected()) 
				squareNum.innerHTML = this.notes[i].getNum();

			// Clear any previous notes
			notes[end--].innerHTML = "";
		}
	}
}




// Creates a new blank sudoku 
function newSudoku() {
    localStorage.removeItem('board');
    location.reload();
}


// Saves sudoku's current status
function saveSudoku() {
    localStorage.setItem("board", JSON.stringify(this.sudoku));
}


// Loads in a saved sudoku
function loadSudoku() {
    let board = JSON.parse(localStorage.getItem("board"));
    
    // If a sudoku has been saved 
    if (board) {
        let boxes = board['boxes'];

        for (let i = 0; i < boxes.length; i++) {
            let squares = boxes[i]['squares'];

            for (let j = 0; j < squares.length; j++) {
                let notes = squares[j]['notes'];
                
                for (let k = 0; k < notes.length; k++) {
                    // Set sudoku values to what stored values are
                    this.sudoku.getBoxes()[i].getSquares()[j].getNotes()[k].setIsSelected(notes[k]['isSelected']);
                }
            }
        }
        
        updateSudoku();
    }
}


// Updates current sudoku 
function updateSudoku() {
    let boxes = this.sudoku.getBoxes();

    // Runs through every square setting any numbers selected
    for (let i = 0; i < boxes.length; i++) {
        this.box = i;
        let squares = boxes[i].getSquares();

        for (let j = 0; j < squares.length; j++) {
            this.square = j;
            this.notes = boxes[i].getSquares()[j].getNotes();

            setSquareNums();
        }
    }
}
