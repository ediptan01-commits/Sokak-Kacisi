// SOKAK KAÇIŞI
// Ana oyun sistemi

let playing = false;
let score = 0;
let coins = 0;

let playerLane = 1;
let jumping = false;

let obstacles = [];
let coinObjects = [];

let obstacleTimer = 0;
let coinTimer = 0;

let speed = 5;
let lastTime = 0;

const lanes = [
    "30%",
    "50%",
    "70%"
];

const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");

const startScreen = document.getElementById("startScreen");
const gameOver = document.getElementById("gameOver");

const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");


// -------------------------
// OYUNCU
// -------------------------

function updatePlayer() {

    player.style.left = lanes[playerLane];

}


// -------------------------
// ZIPLAMA
// -------------------------

function jump() {

    if (!playing) return;

    if (jumping) return;

    jumping = true;

    player.classList.add("jumping");

    setTimeout(function () {

        player.classList.remove("jumping");

        jumping = false;

    }, 650);

}


// -------------------------
// OYUNU BAŞLAT
// -------------------------

function startGame() {

    playing = true;

    score = 0;
    coins = 0;

    playerLane = 1;

    jumping = false;

    speed = 5;

    obstacleTimer = 0;
    coinTimer = 0;

    player.classList.remove("jumping");

    // Eski engelleri temizle

    obstacles.forEach(function (obstacle) {

        obstacle.element.remove();

    });

    // Eski paraları temizle

    coinObjects.forEach(function (coin) {

        coin.element.remove();

    });

    obstacles = [];
    coinObjects = [];

    updatePlayer();

    scoreText.textContent = "Puan: 0";
    coinsText.textContent = "Altın: 0";

    startScreen.style.display = "none";
    gameOver.style.display = "none";

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);

}


// -------------------------
// ENGEL OLUŞTUR
// -------------------------

function createObstacle() {

    const obstacle =
        document.createElement("div");

    obstacle.className = "obstacle";

    const lane =
        Math.floor(Math.random() * 3);

    obstacle.style.left =
        lanes[lane];

    obstacle.style.top = "-80px";

    document
        .getElementById("game")
        .appendChild(obstacle);

    obstacles.push({

        element: obstacle,

        lane: lane,

        y: -80

    });

}


// -------------------------
// PARA OLUŞTUR
// -------------------------

function createCoin() {

    const coin =
        document.createElement("div");

    coin.className = "coin";

    const lane =
        Math.floor(Math.random() * 3);

    coin.style.left =
        lanes[lane];

    coin.style.top = "-50px";

    document
        .getElementById("game")
        .appendChild(coin);

    coinObjects.push({

        element: coin,

        lane: lane,

        y: -50

    });

}


// -------------------------
// ÇARPIŞMA
// -------------------------

function isColliding(
    element1,
    element2
) {

    const rect1 =
        element1.getBoundingClientRect();

    const rect2 =
        element2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );

}


// -------------------------
// OYUN DÖNGÜSÜ
// -------------------------

function gameLoop(time) {

    if (!playing) return;

    const delta =
        time - lastTime;

    lastTime = time;

    obstacleTimer += delta;
    coinTimer += delta;


    // Engel üret

    if (obstacleTimer > 950) {

        createObstacle();

        obstacleTimer = 0;

    }


    // Para üret

    if (coinTimer > 650) {

        createCoin();

        coinTimer = 0;

    }


    // -------------------------
    // ENGELLER
    // -------------------------

    obstacles.forEach(function (obstacle) {

        obstacle.y += speed;

        obstacle.element.style.top =
            obstacle.y + "px";


        // Zıplıyorsa engelden kurtulabilir

        if (
            !jumping &&
            obstacle.lane === playerLane &&
            isColliding(
                player,
                obstacle.element
            )
        ) {

            endGame();

        }

    });


    // -------------------------
    // PARALAR
    // -------------------------

    coinObjects.forEach(function (coin) {

        coin.y += speed;

        coin.element.style.top =
            coin.y + "px";


        if (
            coin.lane === playerLane &&
            isColliding(
                player,
                coin.element
            )
        ) {

            coins++;

            coinsText.textContent =
                "Altın: " + coins;

            coin.element.remove();

            coin.collected = true;

        }

    });


    // -------------------------
    // TEMİZLE
    // -------------------------

    obstacles =
        obstacles.filter(function (obstacle) {

            if (
                obstacle.y >
                window.innerHeight + 100
            ) {

                obstacle.element.remove();

                return false;

            }

            return true;

        });


    coinObjects =
        coinObjects.filter(function (coin) {

            if (
                coin.collected ||
                coin.y >
                window.innerHeight + 100
            ) {

                if (!coin.collected) {

                    coin.element.remove();

                }

                return false;

            }

            return true;

        });


    // -------------------------
    // PUAN
    // -------------------------

    score += delta / 100;

    scoreText.textContent =
        "Puan: " +
        Math.floor(score);


    // -------------------------
    // HIZ ARTIŞI
    // -------------------------

    speed =
        5 + score / 250;


    requestAnimationFrame(gameLoop);

}


// -------------------------
// OYUN BİTTİ
// -------------------------

function endGame() {

    playing = false;

    finalScore.textContent =
        "Puan: " +
        Math.floor(score);

    finalCoins.textContent =
        "Altın: " +
        coins;

    gameOver.style.display = "flex";

}


// -------------------------
// KLAVYE KONTROLÜ
// -------------------------

document.addEventListener(
    "keydown",
    function (event) {

        if (!playing) return;


        if (event.key === "ArrowLeft") {

            if (playerLane > 0) {

                playerLane--;

                updatePlayer();

            }

        }


        if (event.key === "ArrowRight") {

            if (playerLane < 2) {

                playerLane++;

                updatePlayer();

            }

        }


        if (
            event.key === "ArrowUp" ||
            event.key === " "
        ) {

            jump();

        }

    }
);


// -------------------------
// TELEFON KONTROLÜ
// -------------------------

let touchStartX = 0;
let touchStartY = 0;


document.addEventListener(
    "touchstart",
    function (event) {

        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;

    }
);


document.addEventListener(
    "touchend",
    function (event) {

        if (!playing) return;

        const touchEndX =
            event.changedTouches[0].clientX;

        const touchEndY =
            event.changedTouches[0].clientY;

        const differenceX =
            touchEndX - touchStartX;

        const differenceY =
            touchEndY - touchStartY;


        // Yukarı kaydırma = zıplama

        if (
            Math.abs(differenceY) >
            Math.abs(differenceX)
        ) {

            if (differenceY < -40) {

                jump();

            }

            return;

        }


        // Sağa / sola kaydırma

        if (
            Math.abs(differenceX) < 40
        ) {

            return;

        }


        if (differenceX < 0) {

            if (playerLane > 0) {

                playerLane--;

                updatePlayer();

            }

        }

        else {

            if (playerLane < 2) {

                playerLane++;

                updatePlayer();

            }

        }

    }
);


// -------------------------
// BUTONLAR
// -------------------------

document.getElementById(
    "startButton"
).onclick = startGame;


document.getElementById(
    "restartButton"
).onclick = startGame;


// Başlangıç

updatePlayer();
