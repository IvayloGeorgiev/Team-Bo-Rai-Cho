/// <reference path="kinetic-v5.1.0.min.js" />

(function () {
    var enemies = [],
        enemiesSpeed,
        shots = [],
        player,
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
        DEFAULT_WIDTH = 1024,
        DEFAULT_HEIGHT = 768;

    initialize();

    setInterval(run, 20);

    function initialize() {
        document.body.addEventListener("keydown", movePlayer);
        document.body.addEventListener('click', shootEnemy);
        getScreenWidthAndHeight();
        shotSpeed = 20 * scaleX;
        enemiesSpeed = 1.5 * scaleX;
        collisionRange = 50 * scaleX;

        frequencyCounter = 0;
        enemyFrequency = 2;

        player = {
            x: 300 * scaleX,
            y: 450 * scaleY,
            width: 25 * scaleX,
            height: 25 * scaleY
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

        moveShots(shotSpeed);
        moveEnemies(enemiesSpeed);
        drawScreen();

        frequencyCounter++;
        if (frequencyCounter > enemyFrequency) {
            frequencyCounter = 0;
        }
    }

    function drawScreen() {
    
        function drawEnemy(x, y) {
            ctx.beginPath();
            ctx.fillRect(x, y, 15 * scaleX, 15 * scaleY);
            ctx.strokeRect(x, y, 15 * scaleX, 15 * scaleY);
            //ctx.arc(x, y, 10 * scaleX, 0, 2 * Math.PI);
            //ctx.fill();
            //ctx.stroke();
        }

        function drawShot(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 2 * scaleX, 0, 2 * Math.PI);
            ctx.fill();
        }

        function drawPlayer(x, y) {
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.fillRect(x, y, 30 * scaleX, 30 * scaleY);
            ctx.strokeRect(x, y, 30 * scaleX, 30 * scaleY);
        }
        
        //Clear screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Draw enemies
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "red";
        for (var i = 0; i < enemies.length; i++) {
            var x = enemies[i].x;
            var y = enemies[i].y;
            drawEnemy(x, y);            
        }

        //Draw Shots
        ctx.fillStyle = "black";
        for (i = 0; i < shots.length; i++) {
            drawShot(shots[i].currentX, shots[i].currentY)            
        }
        
        drawPlayer(player.x, player.y)
    }

    function Enemy() {
        this.x = Math.random() * screenWidth;
        this.y = -30;
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
        //screenWidth = 1024;
        //screenHeight = 768;
        scaleX = screenWidth / DEFAULT_WIDTH;
        scaleY = screenHeight / DEFAULT_HEIGHT;
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

    function movePlayer(event) {
        switch (event.keyCode) {
            //move left
            case 37: {
                player.x -= 8 * scaleX;
                break;
            }
                //move right
            case 39: {
                player.x += 8 * scaleX;
                break;
            }
                //move up
            case 38: {
                player.y -= 8 * scaleY;
                break;
            }
                //move down
            case 40: {
                player.y += 8 * scaleY;
                break;
            }
        }
        drawScreen();
    }

    function Shot(targetPosition) {
        this.playerX = player.x + (player.width / 2);
        this.playerY = player.y + (player.height / 2);
        this.targetX = targetPosition.x;
        this.targetY = targetPosition.y;
        this.currentX = this.playerX;
        this.currentY = this.playerY;
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
            if (Math.abs(currentShot.currentX - enemies[i].x) < collisionRange &&
                Math.abs(currentShot.currentY - enemies[i].y) < collisionRange) {
                enemies.splice(i, 1);
                return true;
            }
        }
        return false;
    }
})();