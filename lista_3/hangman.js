const letterContainer = document.getElementById("letter-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const restartButton = document.getElementById("restart-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");

let words = [
    "Apple",
    "Blueberry",
    "Mandarin",
    "Pineapple",
    "Pomegranate",
    "Watermelon",
    "Hedgehog",
    "Rhinoceros",
    "Squirrel",
    "Panther",
    "Walrus",
    "Zebra",
    "India",
    "Hungary",
    "Kyrgyzstan",
    "Switzerland",
    "Zimbabwe",
    "Dominica"
];

let winCount = 0;
let count = 0;
let chosenWord = "";
let guessedLetters = [];

// Function to load the game state from localStorage
const loadGameState = function () {
    const savedGameState = JSON.parse(localStorage.getItem('hangmanGameState'));
    if (savedGameState) {
        chosenWord = savedGameState.chosenWord;
        winCount = savedGameState.winCount;
        count = savedGameState.count;
        guessedLetters = savedGameState.guessedLetters;
        renderWord();
        renderButtons();
        drawMan(count);
        if (savedGameState.resultMessage) {
            resultText.innerHTML = savedGameState.resultMessage;
            newGameContainer.classList.remove("hide");
        }
    } else {
        initializer();
    }
};

// Function to save the game state to localStorage
const saveGameState = function () {
    const gameState = {
        chosenWord,
        winCount,
        count,
        guessedLetters,
        resultMessage: resultText.innerHTML
    };
    localStorage.setItem('hangmanGameState', JSON.stringify(gameState));
};

// Function to generate a new word and reset the game state
const generateWord = function () {
    userInputSection.innerText = "";
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guessedLetters = [];
    winCount = 0;
    count = 0;
    renderWord();
};

// Function to render the word with dashes and guessed letters
const renderWord = function () {
    let displayItem = chosenWord.replace(/./g, (char) => {
        return guessedLetters.includes(char) ? char : "<span class='dashes'>ˍ</span>";
    });
    userInputSection.innerHTML = displayItem;
};

// Function to render letter buttons
const renderButtons = function () {
    letterContainer.innerHTML = "";
    for (let i = 65; i < 91; i++) {
        let button = document.createElement("button");
        button.classList.add("letters");
        button.innerText = String.fromCharCode(i);
        button.disabled = guessedLetters.includes(button.innerText);
        button.addEventListener("click", function () {
            guessedLetters.push(button.innerText);
            if (chosenWord.includes(button.innerText)) {
                winCount += 1;
                renderWord();
                if (winCount === chosenWord.length) {
                    resultText.innerHTML = `<h2 class='win-msg'>You Win!!</h2><p>The word was <span>${chosenWord}</span></p>`;
                    newGameContainer.classList.remove("hide");
                }
            } else {
                count += 1;
                drawMan(count);
                if (count === 10) {
                    resultText.innerHTML = `<h2 class='lose-msg'>You Lose!!</h2><p>The word was <span>${chosenWord}</span></p>`;
                    newGameContainer.classList.remove("hide");
                }
            }
            button.disabled = true;
            saveGameState();
        });
        letterContainer.append(button);
    }
};

// Function to initialize the game
const initializer = function () {
    newGameContainer.classList.add("hide");
    generateWord();
    renderButtons();
    let { initialDrawing } = canvasCreator();
    initialDrawing();
    saveGameState();
};

// Function to reset and start a new game
const resetGame = function () {
    localStorage.removeItem('hangmanGameState');
    initializer();
};

// Canvas drawing logic (as is)
const canvasCreator = function () {
    let context = canvas.getContext("2d");
    context.beginPath();
    context.strokeStyle = "#000";
    context.lineWidth = 2;

    const drawLine = (fromX, fromY, toX, toY) => {
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();
    };

    const head = () => {
        context.beginPath();
        context.arc(70, 30, 10, 0, Math.PI * 2, true);
        context.stroke();
    };

    const body = () => {
        drawLine(70, 40, 70, 80);
    };

    const leftArm = () => {
        drawLine(70, 50, 50, 70);
    };

    const rightArm = () => {
        drawLine(70, 50, 90, 70);
    };

    const leftLeg = () => {
        drawLine(70, 80, 50, 110);
    };

    const rightLeg = () => {
        drawLine(70, 80, 90, 110);
    };

    const gallows1 = () => {
        drawLine(10, 130, 130, 130);
    };

    const gallows2 = () => {
        drawLine(10, 10, 10, 131);
    };

    const gallows3 = () => {
        drawLine(10, 10, 70, 10);
    };

    const gallows4 = () => {
        drawLine(70, 10, 70, 20);
    };

    const initialDrawing = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    };

    return { initialDrawing, gallows1, gallows2, gallows3, gallows4, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

// Function to draw the man based on incorrect guesses
const drawMan = (count) => {
    let { gallows1, gallows2, gallows3, gallows4, head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
    switch (count) {
        case 1: gallows1(); break;
        case 2: gallows2(); break;
        case 3: gallows3(); break;
        case 4: gallows4(); break;
        case 5: head(); break;
        case 6: body(); break;
        case 7: leftArm(); break;
        case 8: rightArm(); break;
        case 9: leftLeg(); break;
        case 10: rightLeg(); break;
        default: break;
    }
};

// Event listeners
newGameButton.addEventListener("click", resetGame);
restartButton.addEventListener("click", resetGame);
window.onload = loadGameState;
