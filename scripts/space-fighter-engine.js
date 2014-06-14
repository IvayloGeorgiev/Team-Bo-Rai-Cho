﻿/// <reference path="kinetic-v5.1.0.min.js" />
/// <reference path="start-screen.js" />
/// <reference path="jquery-2.1.1.min.js" />
/// <reference path="soundPlugin.js" />


function engine() {
    var enemies = [],
        shots = [],
        player,
        comet,
        screenWidth,
        screenHeight,
        frequencyCounter,
        enemyFrequency,
        canvas,
        delta,
        lastTime,
        ctx,
        scaleX,
        scaleY,
        images = {},
        keyMap = { 87: false, 65: false, 68: false, 83: false },
        scorePoints,
        isPlayerDead,
        isGameRunning;

    var animFr;

    initialize();
    //setTimeout(run, 20);


    function initialize() {
        document.body.addEventListener("keydown", keyDownHandler);
        document.body.addEventListener("keyup", keyUpHandler);
        document.body.addEventListener('click', shootEnemy);
        window.addEventListener('blur', onScreenBlur);

        getScreenWidthAndHeight();

        scorePoints = 0;
        frequencyCounter = 0;
        enemyFrequency = 0.3;
        cometFrequencyCounter = 0;
        cometFrequency = 10;
        loadImages();

        player = {
            x: 300 * scaleX,
            y: 450 * scaleY,
            width: 12 * scaleX,
            height: 12 * scaleY,
            speed: 700,
            modelScale: 4 //drawing model to hitbox ratio.
        };

        enemies = [];
        shots = [];

        //Canvas Initialization
        canvas = document.getElementById("cnv");
        canvas.height = screenHeight;
        canvas.width = screenWidth;

        ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";
        isPlayerDead = false;
        isGameRunning = true;

        lastTime = Date.now();
        animFr = requestAnimationFrame(run);
        //run();
    }

    function run() {
        if (isPlayerDead) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            window.cancelAnimationFrame(animFr);

            isGameRunning = false;
            startScreen();
            return;
        }

        var now = Date.now();
        delta = (now - lastTime) / 1000;

        if (frequencyCounter >= enemyFrequency) {
            enemies.push(new Enemy());
            frequencyCounter = 0;
        }

        if (cometFrequencyCounter >= cometFrequency) {
            cometFrequencyCounter = 0;

            if (comet === undefined || comet.x < 1 || comet.y < 1) {
                comet = new Comet();
                $.playSound('sounds/Comet');
            }
        }

        moveShots();
        moveEnemies();
        moveComet();
        movePlayer();

        drawScreen();

        frequencyCounter += delta;
        cometFrequencyCounter += delta;

        lastTime = now;
        requestAnimationFrame(run);
    }

    function loadImages() {
        var sources = {
            player: 'images/ship.png',
            asteroid: 'images/asteroid.png',
            rightComet: 'images/rightComet.png',
            leftComet: 'images/leftComet.png'
        }

        for (var src in sources) {
            images[src] = new Image();
            images[src].src = sources[src];
        }
    }

    function drawScreen() {

        function drawEnemy(x, y, width, height, modelScale) {
            ctx.beginPath();
            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);
            var offsetX = ((modelScale - 1) / 2) * width,
                offsetY = ((modelScale - 1) / 2) * height;
            ctx.drawImage(images.asteroid, x - offsetX, y - offsetY, width * modelScale, height * modelScale);
        }


        function drawComet(x, y, width, height, direction) {
            ctx.drawImage(direction === 'left' ? images.rightComet : images.leftComet, x, y, width * 3, height * 3);
            // ctx.beginPath();
            // ctx.fillStyle = '#00f';
            // ctx.fillRect(direction === 'left' ? x : x + (width * scaleX), y, width, height);
            // ctx.fill();
            // ctx.stroke();
        }



        function drawShot(x, y, size) {
            //ctx.fillRect(x, y, size, size);
            ctx.beginPath();
            ctx.arc(x + size / 4, y + size / 4, (size / 8), 0, 4 * Math.PI);
            ctx.fill();
        }

        function drawPlayer(x, y, width, height, modelScale) {

            var offsetX = ((modelScale - 1) / 2) * width,
                offsetY = ((modelScale - 1) / 2) * height;
            ctx.drawImage(images.player, x - offsetX, y - offsetY, width * modelScale, height * modelScale);

            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);
            //console.log(width * scaleX, width * scaleY, width, height);            
        }

        //Clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Draw enemies
        ctx.strokeStyle = 'yellow';
        ctx.fillStyle = "red";
        for (var i = 0; i < enemies.length; i++) {
            var x = enemies[i].x;
            var y = enemies[i].y;
            drawEnemy(x, y, enemies[i].width, enemies[i].height, enemies[i].modelScale);
        }

        //Draw Shots
        ctx.fillStyle = "yellow";
        for (i = 0; i < shots.length; i++) {
            drawShot(shots[i].currentX, shots[i].currentY, shots[i].size)
        }

        drawPlayer(player.x, player.y, player.width, player.height, player.modelScale);

        if (comet !== undefined) {
            drawComet(comet.x, comet.y, comet.width, comet.height, comet.direction);
        }
    }

    function Enemy() {
        this.x = Math.random() * screenWidth;
        this.y = -30 * scaleY;
        this.width = 24 * scaleX;
        this.height = 24 * scaleY;
        this.modelScale = 2;
        this.allTypes = ["firstKind", "secondKind", "thirdKind"];
        this.allTypesLength = this.allTypes.length;
        this.type = this.allTypes[Math.floor(Math.random() * this.allTypesLength)],
        this.speed = Math.random() * 600;
    };

    function Comet() {
        if (Math.random() > 0.5) {
            this.x = (screenWidth / 2) + (screenWidth * Math.random());
            this.direction = 'left';
        } else {
            this.x = (screenWidth / 2) - (screenWidth * Math.random());
            this.direction = 'right';
        }
        this.y = screenHeight;
        this.width = 25 * scaleX;
        this.height = 25 * scaleY;
        this.speed = 300;
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
        //screenWidth = 800;
        //screenHeight = 600;
        screenWidth -= 24;
        screenHeight -= 24;
        setScale(screenWidth, screenHeight);
    }

    function setScale(w, h) {
        var defaultRatios = [[4, 3, [1024, 768]], [16, 9, [1024, 576]], [3, 2, [1023, 682]], [5, 3, [1025, 615]], [8, 5, [1024, 640]]],
            closestRatio,
            closestDifference = Number.MAX_VALUE,
            tempWidth,
            tempHeight,
            tempDifference;

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

        scaleX = w / defaultRatios[closestRatio][2][0];
        scaleY = h / defaultRatios[closestRatio][2][1];
    }

    //function setGameDifficulty(difficulty) {
    //    switch (difficulty) {
    //        case 0: {
    //            enemyFrequency = 4;
    //            break;
    //        }
    //        case 1: {
    //            enemyFrequency = 2;
    //            break;
    //        }
    //        case 2: {
    //            enemyFrequency = 0;
    //            break;
    //        }
    //        default: {
    //            enemyFrequency = 4;
    //        }
    //    }
    //}

    function moveEnemies() {
        for (var i = 0; i < enemies.length ; i++) {

            //Ranom side move
            //var rangeX = 8 * Math.random();
            //var directions = [-1, 1];
            //rangeX = directions[Math.round(Math.random())] * rangeX;
            //enemies[i].x += rangeX;

            enemies[i].y += enemies[i].speed * delta;
            

            if (enemies[i].y >= screenHeight) {
                enemies.splice(i, 1);
            } else if (    //Enemy hit the player
                enemies[i].x < player.x + player.width &&
                enemies[i].x + enemies[i].width > player.x &&
                enemies[i].y < player.y + player.height &&
                enemies[i].y + enemies[i].height > player.y) {
                isPlayerDead = true;
            }
        }

    }

    function moveComet() {
        if (comet === undefined) {
            return;
        }

        if (comet.direction === 'left') {
            comet.y -= comet.speed * delta;
            comet.x -= (comet.speed * 2) * delta;
        } else {
            comet.y -= comet.speed * delta;
            comet.x += (comet.speed * 2) * delta;
        }

        if (isCollidedWithObject(comet, player)) {
            isPlayerDead = true;
        }

        for (var i = 0; i < enemies.length; i++) {
            if (isCollidedWithObject(comet, enemies[i])) {
                enemies.splice(i, 1);
            }
        }
    }

    function movePlayer() {
        if (keyMap[65]) {
            player.x -= player.speed * delta;
        }
        if (keyMap[87]) {
            player.y -= player.speed * delta;
        }
        if (keyMap[68]) {
            player.x += player.speed * delta;
        }
        if (keyMap[83]) {
            player.y += player.speed * delta;
        }
    }

    function keyDownHandler(e) {
        if (e.keyCode in keyMap) {
            keyMap[e.keyCode] = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode in keyMap) {
            keyMap[e.keyCode] = false;
        }
    }

    function onScreenBlur() {        
        keyMap = { 87: false, 65: false, 68: false, 83: false }        
    };

    function Shot(targetPosition) {
        this.playerX = player.x + (player.width / 2);
        this.playerY = player.y + (player.height / 2);
        this.targetX = targetPosition.x;
        this.targetY = targetPosition.y;
        this.currentX = this.playerX;
        this.currentY = this.playerY;
        this.size = 16 * scaleX;
        this.speed = 800 * ((scaleX > scaleY) ? scaleX : scaleY);
        this.updatePosition = function () {
            var deltaX = this.targetX - this.playerX;
            var deltaY = this.targetY - this.playerY;

            var vectorAngle = Math.atan(Math.abs(deltaY) / Math.abs(deltaX));
            var xAbsSpeed = Math.abs(Math.cos(vectorAngle) * (this.speed * delta));
            var yAbsSpeed = Math.abs(Math.sin(vectorAngle) * (this.speed * delta));

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
        if (isGameRunning) {
            var targetPosition = {
                x: e.clientX,
                y: e.clientY
            }
            console.log(shots.length);
            $.playSound('sounds/laser-shoot');
            shots.push(new Shot(targetPosition));
        }
    }

    function moveShots() {
        for (var i = 0; i < shots.length ; i++) {
            shots[i].updatePosition();

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
            for (var j = 0, movementSquares = (currentShot.speed * delta) / currentShot.size; j < movementSquares; j++) {
                if ((currentShot.currentX < (enemies[i].x + enemies[i].width) &&
                    (currentShot.currentX + currentShot.size) > enemies[i].x) &&
                    (currentShot.currentY < (enemies[i].y + enemies[i].height) &&
                    (currentShot.currentY + currentShot.size) > enemies[i].y)) {
                    enemies.splice(i, 1);

                    $.playSound('sounds/grenade');
                    scorePoints += 10;
                    $('#score-field').text(scorePoints);
                    return true;
                }
            }
        }
        return false;
    }

    function isCollidedWithObject(comet, gameObject) {
        if (comet === undefined) {
            return false;
        }

        var cometFocusAccuracy = comet.direction === 'left' ? 0 : comet.width * scaleX;

        var isCometXInObject = ((comet.x + cometFocusAccuracy) > gameObject.x && (comet.x + cometFocusAccuracy) < (gameObject.x + gameObject.height)),
            isCometYinObject = (comet.y > gameObject.y && comet.y < (gameObject.y + gameObject.width)),
            isObjectXInComet = (gameObject.x > (comet.x + cometFocusAccuracy) && gameObject.x < (comet.x + cometFocusAccuracy + comet.width)),
            isObjectYInComet = (gameObject.y > comet.y && gameObject.y < (comet.y + comet.height));


        if ((isCometYinObject === true && isCometXInObject === true) ||
            (isObjectXInComet === true && isObjectYInComet === true)) {
            $.playSound('sounds/comet-explosion')
            return true;
        }

        return false;
    }
}