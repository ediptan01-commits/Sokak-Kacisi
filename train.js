// SOKAK KAÇIŞI
// Tren sistemi

let trains = [];

let trainTimer = 0;

let trainSpeed = 5;


// -------------------------
// TREN STİLİ
// -------------------------

function setupTrainStyle() {

    if (document.getElementById("train-style")) {
        return;
    }

    const style =
        document.createElement("style");

    style.id = "train-style";

    style.textContent = `

        .train {

            position: absolute;

            width: 72px;
            height: 115px;

            background:
                linear-gradient(
                    to bottom,
                    #e53935 0%,
                    #b71c1c 45%,
                    #424242 45%,
                    #212121 100%
                );

            border: 4px solid white;

            border-radius: 10px;

            z-index: 7;

            box-shadow:
                0 5px 12px rgba(0,0,0,.5);

        }

        .train::before {

            content: "";

            position: absolute;

            width: 46px;
            height: 35px;

            left: 9px;
            top: 12px;

            background: #80deea;

            border: 3px solid #263238;

            border-radius: 5px;

        }

        .train::after {

            content: "🚆";

            position: absolute;

            left: 17px;
            bottom: 5px;

            font-size: 25px;

        }

    `;

    document.head.appendChild(style);

}


// -------------------------
// TREN OLUŞTUR
// -------------------------

function createTrain() {

    const train =
        document.createElement("div");

    train.className = "train";

    const lane =
        Math.floor(Math.random() * 3);

    train.style.left =
        lanes[lane];

    train.style.top =
        "-140px";

    document
        .getElementById("game")
        .appendChild(train);

    trains.push({

        element: train,

        lane: lane,

        y: -140

    });

}


// -------------------------
// TREN TEMİZLE
// -------------------------

function removeTrain(train) {

    if (train.element) {

        train.element.remove();

    }

}


// -------------------------
// TREN ÇARPIŞMASI
// -------------------------

function checkTrainCollision(train) {

    if (!playing) return;

    if (jumping) return;

    if (train.lane !== playerLane) return;

    if (
        isColliding(
            player,
            train.element
        )
    ) {

        endGame();

    }

}


// -------------------------
// TREN DÖNGÜSÜ
// -------------------------

function trainLoop() {

    if (!playing) {

        requestAnimationFrame(trainLoop);

        return;

    }


    trainTimer++;


    // Yaklaşık 1.7 saniyede bir tren

    if (trainTimer > 100) {

        createTrain();

        trainTimer = 0;

    }


    trains.forEach(function (train) {

        train.y += trainSpeed;

        train.element.style.top =
            train.y + "px";

        checkTrainCollision(train);

    });


    trains =
        trains.filter(function (train) {

            if (
                train.y >
                window.innerHeight + 150
            ) {

                removeTrain(train);

                return false;

            }

            return true;

        });


    // Oyun hızlandıkça trenler de hızlansın

    if (typeof speed !== "undefined") {

        trainSpeed = speed;

    }


    requestAnimationFrame(trainLoop);

}


// -------------------------
// OYUN BAŞLARKEN TEMİZLE
// -------------------------

function clearTrains() {

    trains.forEach(function (train) {

        removeTrain(train);

    });

    trains = [];

    trainTimer = 0;

}


// -------------------------
// BAŞLAT
// -------------------------

setupTrainStyle();

trainLoop();
