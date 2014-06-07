﻿/// <reference path="kinetic-v5.1.0.min.js" />

(function () {
    var enemies = [],
        shots = [],
        player,
        stage,
        gameLayer,
        infoLayer,
        screenWidth,
        screenHeight,
        frequencyCounter,
        canvas,
        ctx,
        enemyFrequency;

    initialize();

    setInterval(run, 50);

    function initialize() {
        document.body.addEventListener("keydown", movePlayer);
        getScreenWidthAndHeight();

        //Canvas Initialization
        canvas = document.getElementById("cnv");
        canvas.height = screenHeight;
        canvas.width = screenWidth;

        ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";

        //Kinetic Initialization
        //stage = new Kinetic.Stage({
        //    container: 'canvas-container',
        //    width: screenWidth,
        //    height: screenHeight
        //});

        frequencyCounter = 0;
        enemyFrequency = 2;

        player = {
            x: 300,
            y: 450,
            width: 50,
            height: 10
        };
    }

    function run() {
        if (frequencyCounter == enemyFrequency) {
            enemies.push(new Enemy());
        }

        moveEnemies(20);
        drawScreen();

        frequencyCounter++;
        if (frequencyCounter > enemyFrequency) {
            frequencyCounter = 0;
        }
        console.log(enemies.length);
    }

    function drawScreen() {
        //KinetiJS
        //stage.removeChildren();

        //var layer = new Kinetic.Layer();
        //for (var i = 0; i < enemies.length; i++) {
        //    var c = new Kinetic.Circle({
        //        x: enemies[i].x,
        //        y: enemies[i].y,
        //        radius: 10,
        //        fill: 'black'
        //    });
        //    layer.add(c);
        //}
        //stage.add(layer);

        //Canvas
        //Draw Enemies
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        for (var i = 0; i < enemies.length; i++) {
            var x = enemies[i].x;
            var y = enemies[i].y;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }

        //Draw Player
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, 30, 30);
    }

    function Enemy() {
        this.x = Math.random() * screenWidth;
        this.y = 0;
        this.allTypes = ["firstKind", "secondKind", "thirdKind"];
        this.allTypesLength = this.allTypes.length;
        this.type = this.allTypes[Math.floor(Math.random() * this.allTypesLength)];
    };

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
        screenWidth -= 50;
        screenHeight -= 50;
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
            }

            //Enemy hit the player
            //if (enemies[i].x >= (player.x - player.width) && enemies[i].x <= (player.x + player.width)
            //    && enemies[i].y > (player.y - player.height)) {
            //    enemies.splice(i, 1);
            //    gameOver();
            //}
        }
    }

    function movePlayer(event) {
        switch (event.keyCode) {
                //move left
            case 37: {
                player.x -= 30;
                break;
            }
                //move right
            case 39: {
                player.x += 30;
                break;
            }
                //move up
            case 38: {
                player.y -= 30;
                break;
            }
                //move down
            case 40: {
                player.y += 30;
                break;
            }
        }
        drawScreen();
    }
})();