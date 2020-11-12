
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


// Square which makes up a box, containing miniSquares
class Square {
    constructor(numOfMiniSquares) {
        this.mini = [];
        this.createMiniSquares(numOfMiniSquares);
    }

    createMiniSquares(numOfMiniSquares) {
        for (let i = 0; i < numOfMiniSquares; i++) {
            this.mini.push(new MiniSquare(i + 1));
        }
    }

    getMiniSquares() { return this.mini; }
}


// MiniSquare which makes up a square
class MiniSquare {
    constructor(num) {
        this.num = num;
        this.isSelected = false;
    }

    getNum() { return this.num; }
    getIsSelected() { return this.isSelected; }

    setIsSelected(isSelected) { this.isSelected = isSelected; }
}




let numOfSquares = 9;
var sudoku = new Sudoku(numOfSquares);

// Create sudoku board
createSudoku(numOfSquares);

// Load any previously saved sudokus
loadSudoku();




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
function createSquare(boxPos, squarePos, numOfMiniSquares) {
    let miniSquares = '';

    for (let i = 0; i < numOfMiniSquares; i++) {
        miniSquares += createMiniSquare();
    }

    return '<div class="square" onclick="OpenPopup(' + boxPos + ', ' + squarePos + ')"> \n <span> </span> \n ' + miniSquares + '</div> \n';
}


// Generates the HTML for a mini square
function createMiniSquare() {
    return '<div class="miniSquare"> </div> \n';
}




var box, square, miniSquares;

// Displays the popup and stores which square is selected
function OpenPopup(box, square) {
    document.getElementById("popup").style.display = "block"; 
    document.getElementById("shadow").style.display = "block";


    // Store square info to save when popup closed 
    this.box = box;
    this.square = square;
    this.miniSquares = this.sudoku.getBoxes()[this.box].getSquares()[this.square].getMiniSquares();

    let buttons = '';

    // Set if each button is enable or disable  
    for (let i = 0; i < this.miniSquares.length; i++) {
        
        if (this.miniSquares[i].getIsSelected())
            buttons += '<button class="num enable" onclick="PossibleNumToggle(' + i + ')"> \n'; 
        else 
            buttons += '<button class="num disable" onclick="PossibleNumToggle(' + i + ')"> \n';
        
        buttons += this.miniSquares[i].getNum() + '\n </button> \n';
    }


    document.getElementById("possible").innerHTML = buttons;
}


// Toggles possible number's selected status
function PossibleNumToggle(pos) {
    // Toggle mini square's selected value
    let miniSquare = this.miniSquares[pos];
    miniSquare.setIsSelected(!miniSquare.getIsSelected());


    let num = document.getElementById("possible").getElementsByClassName("num")[pos];
    
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
    let miniSquares = square.getElementsByClassName('miniSquare');
    

    let none = true;
    let multiple = true;

    // Find if more that one element selected
    for (let i = 0; i < this.miniSquares.length; i++) {
        
        if (this.miniSquares[i].getIsSelected()) {
            
            // False when first selected found
            if (multiple) {
                none = false;
                multiple = false;
                continue;
            }

            // True when second selected found
            multiple = true;
            break;
        }
    }


    // When box has some numbers set
    if (!none) {

        squareNum.innerHTML = '';
        let pos = 0;
        let end = this.miniSquares.length - 1;

        // Display the numbers which are selected 
        for (let i = 0; i < this.miniSquares.length; i++) {

            if (multiple) {
                // Set selected number at the start and clear from the end 
                if (this.miniSquares[i].getIsSelected())
                    miniSquares[pos++].innerHTML = this.miniSquares[i].getNum();
                else 
                    miniSquares[end--].innerHTML = "";
            }
            else {
                // Display selected number
                if (this.miniSquares[i].getIsSelected()) 
                    squareNum.innerHTML = this.miniSquares[i].getNum();

                // Clear any previous miniSquare numbers
                miniSquares[end--].innerHTML = "";
            }
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
                let miniSquares = squares[j]['mini'];
                
                for (let k = 0; k < miniSquares.length; k++) {
                    // Set sudoku values to what stored values are
                    this.sudoku.getBoxes()[i].getSquares()[j].getMiniSquares()[k].setIsSelected(miniSquares[k]['isSelected']);
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
            this.miniSquares = boxes[i].getSquares()[j].getMiniSquares();

            setSquareNums();
        }
    }
}
