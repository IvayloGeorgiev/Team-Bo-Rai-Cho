/// <reference path="kinetic-v5.1.0.min.js" />

(function () {
    var enemies = [],
        enemiesSpeed,
        shots = [],
        player,
        comet,
        screenWidth,
        screenHeight,
        frequencyCounter,
        enemyFrequency,
        shotSpeed,
        canvas,
        collisionRange,
        ctx,
        scaleX = 1,
        scaleY = 1,
        images = {},
        DEFAULT_WIDTH,
        DEFAULT_HEIGHT,
        keyMap = { 37: false, 38: false, 39: false, 40: false };

    initialize();

    setInterval(run, 20);

    function initialize() {
        document.body.addEventListener("keydown", movePlayer);
        document.body.addEventListener("keyup", keyUpHandler);        
        document.body.addEventListener('click', shootEnemy);
        getScreenWidthAndHeight();
        shotSpeed = 20 * scaleX;
        enemiesSpeed = 1.5 * scaleX;
        cometSpeed = 6 * scaleX;
        collisionRange = 50 * scaleX;

        frequencyCounter = 0;
        enemyFrequency = 2;
        cometFrequencyCounter = 0;
        cometFrequency = 50;
        loadImages();

        player = {
            x: 300 * scaleX,
            y: 450 * scaleY,
            width: 48 * scaleX,
            height: 48 * scaleY
        };        
        

        //Canvas Initialization
        canvas = document.getElementById("cnv");
        canvas.height = screenHeight;
        canvas.width = screenWidth;
        //canvas.height = DEFAULT_HEIGHT;
        //canvas.width = DEFAULT_WIDTH;

        ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";
    }

    function run() {
        if (frequencyCounter == enemyFrequency) {
            enemies.push(new Enemy());
        }

        if (cometFrequencyCounter === cometFrequency) {
            cometFrequencyCounter = 0;

            if (comet === undefined || comet.x < 1 || comet.y < 1) {
                comet = new Comet();
            }
        }

        moveShots(shotSpeed);
        moveEnemies(enemiesSpeed);
        moveComet(cometSpeed);

        drawScreen();

        frequencyCounter++;
        cometFrequencyCounter++;
        if (frequencyCounter > enemyFrequency) {
            frequencyCounter = 0;
        }
    }

    function loadImages() {
        var sources = {
            player: '../images/ship.png',
            asteroid: '../images/asteroid.png',
            comet: '../images/rightComet.png'
        }

        for (var src in sources) {
            images[src] = new Image();
            images[src].src = sources[src];
        }
    }

    function drawScreen() {

        function drawEnemy(x, y, width, height) {
            /*
            ctx.beginPath();
            ctx.fillRect(x, y, 20 * scaleX, 20 * scaleY);
            ctx.strokeRect(x, y, 20 * scaleX, 20 * scaleY);*/
            //ctx.arc(x, y, 10 * scaleX, 0, 2 * Math.PI);
            //ctx.fill();
            //ctx.stroke();
            ctx.drawImage(images.asteroid, x, y, width * scaleX, height * scaleY);
        }


        function drawComet(x, y, width, height) {
            //ctx.beginPath();
            //ctx.fillStyle = '#00f';
            //ctx.arc(x, y, r, 0, 2 * Math.PI);
            //ctx.fill();
            //ctx.stroke();
            ctx.drawImage(images.comet, x, y, width * scaleX * 3, height * scaleY * 3);
        }

         

        function drawShot(x, y, width) {

            ctx.beginPath();
            ctx.arc(x + width / 2, y + width / 2, (width / 4) * scaleX, 0, 4 * Math.PI);
            ctx.fill();
        }

        function drawPlayer(x, y, width, height) {
            /*ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.fillRect(x, y, 30 * scaleX, 30 * scaleY);
            ctx.strokeRect(x, y, 30 * scaleX, 30 * scaleY);*/
            ctx.drawImage(images.player, x, y, width * scaleX, height * scaleY);
        }

        //Clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Draw enemies
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "red";
        for (var i = 0; i < enemies.length; i++) {
            var x = enemies[i].x;
            var y = enemies[i].y;
            drawEnemy(x, y, enemies[i].width, enemies[i].height);
        }

        //Draw Shots
        ctx.fillStyle = "black";
        for (i = 0; i < shots.length; i++) {
            drawShot(shots[i].currentX, shots[i].currentY, shots[i].width)
        }

        drawPlayer(player.x, player.y, player.width, player.height);

        if (comet !== undefined) {
            drawComet(comet.x, comet.y, comet.width, comet.height);
        }
    }

    function Enemy() {
        this.x = Math.random() * screenWidth;
        this.y = -30 * scaleY;
        this.width = 48 * scaleX;
        this.height = 48 * scaleY;
        this.allTypes = ["firstKind", "secondKind", "thirdKind"];
        this.allTypesLength = this.allTypes.length;
        this.type = this.allTypes[Math.floor(Math.random() * this.allTypesLength)];
    };

    function Comet() {
        this.x = screenWidth;
        this.y = screenHeight;
        this.width = 20;
        this.height = 20;
    }

    function getScreenWidthAndHeight() {
        if (typeof (window.innerWidth) == 'number') {
            //Non-IE
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            //IE 6+ in 'standards compliant mode'
            screenWidth = document.documentElement.clientWidth;
            screenHeight = document.documentElement.clientHeight;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            //IE 4 compatible
            screenWidth = document.body.clientWidth;
            screenHeight = document.body.clientHeight;
        }
        console.log(window.screen.width + ' ' + window.screen.height);
        screenWidth -= 24;
        screenHeight -= 24;
        //screenWidth = 1600;
        //screenHeight = 1200;
        setScale(screenWidth, screenHeight);
        scaleX = screenWidth / DEFAULT_WIDTH;
        scaleY = screenHeight / DEFAULT_HEIGHT;
        console.log(scaleX + ' ' + scaleY);
    }

    function setScale(w, h) {
        var defaultRatios = [[4, 3, [1024, 768]], [16, 9, [1366, 768]], [3, 2, [1152, 768]], [5, 3, [1280, 768]], [8, 5, [1280, 800]]],
            closestRatio,
            closestDifference = Number.MAX_VALUE,
            tempWidth,
            tempHeight,
            tempDifference;

        console.log('hai');
        for (var i = 0, length = defaultRatios.length; i < length; i++) {
            tempWidth = w / defaultRatios[i][0];
            tempHeight = h / defaultRatios[i][1];
            tempDifference = Math.abs(tempWidth - tempHeight);

            if (tempDifference === 0) {
                closestRatio = i;
                break;
            } else if (tempDifference < closestDifference) {
                closestRatio = i;
                closestDifference = tempDifference;
            }
        }

        DEFAULT_HEIGHT = defaultRatios[closestRatio][2][1];
        DEFAULT_WIDTH = defaultRatios[closestRatio][2][0];
    }

    function setGameDifficulty(difficulty) {
        //var easy = document.getElementById("easy");


        //var difficultyButtons = document.getElementsByTagName("input");
        //var difficulty = 0;

        //for (var i = 0; i < difficultyButtons.length; i++) {
        //    if (difficultyButtons[i].type == "radio" && difficultyButtons[i].checked) {
        //        var difficulty = i;
        //    }
        //}

        switch (difficulty) {
            case 0: {
                enemyFrequency = 4;
                break;
            }
            case 1: {
                enemyFrequency = 2;
                break;
            }
            case 2: {
                enemyFrequency = 0;
                break;
            }
            default: {
                enemyFrequency = 4;
            }
        }
    }

    function moveEnemies(speed) {
        for (var i = 0; i < enemies.length ; i++) {
            enemies[i].y += speed;
            if (enemies[i].y >= screenHeight) {
                enemies.splice(i, 1);
                //console.log(enemies[i].y);
                //console.log(player.y);
            }

            //Enemy hit the player
            //if (enemies[i].x >= (player.x - player.width) && enemies[i].x <= (player.x + player.width)
            //    && enemies[i].y > (player.y - player.height)) {
            //    enemies.splice(i, 1);
            //    gameOver();
            //}                
        }
    }


    function moveComet(speed) {
        if (comet !== undefined) {
            comet.y -= speed;
            comet.x -= speed * 2;
        }
    }

    function movePlayer(event) {        
        if (event.keyCode in keyMap) {
            keyMap[event.keyCode] = true;
            if (keyMap[37] && keyMap[38]) {
                //move up-left
                player.x -= 8 * scaleX;
                player.y -= 8 * scaleY;
            } else if (keyMap[38] && keyMap[39]) {
                //move up-right
                player.y -= 8 * scaleY;
                player.x += 8 * scaleX;
            } else if (keyMap[37] && keyMap[40]) {
                //move down-left
                player.x -= 8 * scaleX;
                player.y += 8 * scaleY;
            } else if (keyMap[39] && keyMap[40]) {
                //move down-right
                player.x += 8 * scaleX;
                player.y += 8 * scaleY;
            } else if (keyMap[37]) {
                //move left
                player.x -= 8 * scaleX;
            } else if (keyMap[38]) {
                //move up
                player.y -= 8 * scaleY;
            } else if (keyMap[39]) {
                //move right
                player.x += 8 * scaleX;
            } else if (keyMap[40]) {
                //move down
                player.y += 8 * scaleY;
            }
        }
        drawScreen();
    }

    function keyUpHandler(e) {
        if (e.keyCode in keyMap) {
            keyMap[e.keyCode] = false;
        }
    }

    function Shot(targetPosition) {
        this.playerX = player.x + (player.width / 2);
        this.playerY = player.y + (player.height / 2);
        this.targetX = targetPosition.x;
        this.targetY = targetPosition.y;
        this.currentX = this.playerX;
        this.currentY = this.playerY;
        this.width = 8 * scaleX;
        this.height = 8 * scaleY;
        this.updatePosition = function (shotSpeed) {
            var deltaX = this.targetX - this.playerX;
            var deltaY = this.targetY - this.playerY;

            var vectorAngle = Math.atan(Math.abs(deltaY) / Math.abs(deltaX));
            var xAbsSpeed = Math.abs(Math.cos(vectorAngle) * shotSpeed);
            var yAbsSpeed = Math.abs(Math.sin(vectorAngle) * shotSpeed);

            if (deltaX >= 0 && deltaY >= 0) {
                this.currentX += xAbsSpeed;
                this.currentY += yAbsSpeed;
            } else if (deltaX >= 0 && deltaY < 0) {
                this.currentX += xAbsSpeed;
                this.currentY -= yAbsSpeed;
            } else if (deltaX <= 0 && deltaY < 0) {
                this.currentX -= xAbsSpeed;
                this.currentY -= yAbsSpeed;
            } else if (deltaX <= 0 && deltaY > 0) {
                this.currentX -= xAbsSpeed;
                this.currentY += yAbsSpeed;
            }
        }
    }

    function shootEnemy(e) {
        var targetPosition = {
            x: e.clientX,
            y: e.clientY
        }

        shots.push(new Shot(targetPosition));

        //console.log("mouse  X" + e.clientX + "mouse Y" + e.clientY);
        //console.log("player X" + player.x + "player Y" + player.y);
    }

    function moveShots(shotSpeed) {
        for (var i = 0; i < shots.length ; i++) {
            shots[i].updatePosition(shotSpeed);

            if (shots[i].currentY >= screenHeight || shots[i].currentY < 0 ||
                shots[i].currentX >= screenWidth || shots[i].currentX < 0) {
                shots.splice(i, 1);
            }
            else if (isCollisionDetected(shots[i])) {
                shots.splice(i, 1);
            }
        }
    }

    function isCollisionDetected(currentShot) {
        for (var i = 0; i < enemies.length; i++) {
            for (var j = 0, movementSquares = shotSpeed / currentShot.width; j < movementSquares; j++) {
                if ((currentShot.currentX < (enemies[i].x + enemies[i].width) &&
                    (currentShot.currentX + currentShot.width) > enemies[i].x) &&
                    (currentShot.currentY < (enemies[i].y + enemies[i].height) &&
                    (currentShot.currentY + currentShot.height) > enemies[i].y)) {
                    enemies.splice(i, 1);
                    return true;
                }
            }
            //if (Math.abs(currentShot.currentX - enemies[i].x) < collisionRange &&
            //    Math.abs(currentShot.currentY - enemies[i].y) < collisionRange) {
            //    enemies.splice(i, 1);
            //    return true;
            //}
        }
        return false;
    }
})();