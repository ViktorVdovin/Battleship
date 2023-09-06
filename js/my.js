// Здесь наше представление
let view = {
    displayMessage: function (msg) {
        let messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },

    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

// Здесь наша модель поведения игрыs
let model = {
    boardSize: 7, // размер игрового поля
    numShips: 3, // кол-во кораблей в игре
    shipLength: 3, // длинна корабля в клетках
    shipsSunk: 0, //кол-во потопленных кораблей

    ships: [
        { location: [0, 0, 0], hits: ['', '', ''], },
        { location: [0, 0, 0], hits: ['', '', ''], },
        { location: [0, 0, 0], hits: ['', '', ''], },
    ],

    fire: function (guess) { // получаем координаты выстрела
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];

            // location = ship.location; // Избавляемся от временной переменной!
            // let index = location.indexOf(guess);

            let index = ship.location.indexOf(guess);
            if (ship.hits[index] === 'hit') {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');

                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!')
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed!');
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        } return true;
    },

    // Метод создаёт в модели массив ships
    generateShipLocation: function () {
        let location;
        for (let i = 0; i < this.numShips; i++) {
            do {
                location = this.generateShip();
            } while (this.collision(location));
            this.ships[i].location = location;
        }
        console.log('Ships array: ');
        console.log(this.ships);
    },

    // Метод создаёт один корабль
    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            // Сгенерировать начальную позицию для горизонтального корабля
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            // Сгенерировать начальную позицию для вертикального корабля
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocation = [];

        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                // добавить в массив для горизонтального корабля
                newShipLocation.push(row + "" + (col + i));
            } else {
                // добавить в массив для вертикального корабля
                newShipLocation.push((row + i) + "" + col);
            }
        }
        return newShipLocation;
    },

    // метод получает один корабль и проверяет, что тот не перекрывается с другими кораблями
    collision: function (location) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < location.length; j++) {
                if (ship.location.indexOf(location[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
}

let controller = {
    gusses: 0,

    proccesGuess: function (guess) {
        let location = parceGuess(guess);
        if (location) {
            this.gusses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('Вы потопили все корабли за: ' + this.gusses + ' выстрелов');
            }
        }
    }
}

function parceGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Вы ввели неверные координаты!');
    } else {
        firstChar = guess.charAt(0); // извлекаем из строки первый символ
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Вы ввели неверные координаты!');
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert('Вы ввели неверные координаты!');
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    // поработаем с Enter
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocation();
}

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.proccesGuess(guess);

    guessInput.value = '';
}

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');
    console.log(e.keyCode);
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

