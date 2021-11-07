const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let xVelocity = 0;
let yVelocity = 0;

let appleX = 5;
let appleY = 5;

let score = 0;

const gulpSound = new Audio("gulp.mp3");

// Game Loop
const drawGame = () => {
    chageSnakePosition();

    let result = isGameOver();
    if(result) {
        return;
    }
    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    // Use setTimeout because that allows you to make the game faster as you grow longer
    setTimeout(drawGame, 1000 / speed);
}

const isGameOver = () => {
    let gameOver = false;

    if(yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // If you are colliding with a wall
    if(headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
        gameOver = true;
    }

    // If you are colliding with yourself
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if(gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

        gradient.addColorStop("0", "red");
        gradient.addColorStop('0.3', 'orange');
        gradient.addColorStop('0.5', 'yellow');
        gradient.addColorStop('0.7', 'green');
        gradient.addColorStop('0.8', 'blue');

        /* gradient.addColorStop('0', 'magenta');
        gradient.addColorStop('0.5', 'blue');
        gradient.addColorStop('1', 'red'); */

        ctx.fillStyle = gradient;
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    return gameOver;
}

const drawScore = () => {
    ctx.fillStyle = "white";
    ctx.font = "11px Verdana";
    ctx.fillText("Score " + score, canvas.width - 55, 20);
}

const clearScreen = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawSnake = () => {
    ctx.fillStyle = 'green';
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY)) // Put an item at teh end of teh list next to the head
    while (snakeParts.length > tailLength) {
        snakeParts.shift() // Remove the futhest item from the snakeparts if we have more than our tailSize
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

const chageSnakePosition = () => {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

const drawApple = () => {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

const checkAppleCollision = () => {
    if(appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount)
        appleY = Math.floor(Math.random() * tileCount)
        tailLength++;
        score++;
        speed = speed + 0.2;
        gulpSound.play();
    }
}

document.addEventListener('keydown', e => {
    let key = e.key, keyCode = e.keyCode;
    if(key && 'ArrowUp' === key || keyCode && 38 === keyCode) {
        if(yVelocity == 1) {
            return;
        }
        // Up
        yVelocity = -1;
        xVelocity = 0;
    } else if (key && 'ArrowDown' === key || keyCode && 40 === keyCode) {
        if(yVelocity == -1) {
            return;
        }
        // Down
        yVelocity = 1;
        xVelocity = 0;
    } else if (key && 'ArrowLeft' === key || keyCode && 37 === keyCode) {
        if(xVelocity == 1) {
            return;
        }
        // Left
        yVelocity = 0;
        xVelocity = -1;
    } else if (key && 'ArrowRight' === key || keyCode && 39 === keyCode) {
        if(xVelocity == -1) {
            return;
        }
        // Right
        yVelocity = 0;
        xVelocity = 1;
    }
});

drawGame()