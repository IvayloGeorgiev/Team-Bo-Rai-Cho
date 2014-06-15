/// <reference path="space-fighter-engine.js" />
/// <reference path="jquery-2.1.1.min.js" />

startScreen();

function startScreen () {    
    var $wrapper = $('<div id="wrapper"></div>');
    $('body').append($wrapper);

    var $playButton = $('<button type="button" id="btn-play">PLAY</button>)');
    $wrapper.append($playButton);

    var $logo = $('<img src="images/logo.png" alt="Logo" id="img-logo" />');
    $wrapper.append($logo);

    var $label = $('<label for="playerName">Enter name: </label>');
    var $inputName = $('<input type="text" id="player-name" name="playerName" autofocus/>');
    var $startGameButton = $('<button type="button" id="btn-start">START GAME</button>)');

    $playButton.click(function(){
        $playButton.remove();

        $wrapper.append($label);
        $wrapper.append($inputName);
        $wrapper.append($startGameButton);
        $startGameButton.hide();

        $('#player-name').keypress(function(e) {
            var keyCode = (e.keyCode ? e.keyCode : e.which);
            if (keyCode == '13') {
                if ($(this).val().length >= 2) {
                    $('#display-player-name').text($('#player-name').val());
                    $startGameButton.show();
                } else {
                    $startGameButton.hide();
                    alert("Your name should be at least 2 symbols.")
                }
            }
        });
    });

    $(document).keypress(function (e) {
        if (e.keyCode == 13) {
            $playButton.click();
        }
    });

    $('#player-name').keypress(function (e) {
        if (e.keyCode == 13) {
            $startGameButton.click();
        }
    });

    $startGameButton.click(function () {
        $wrapper.remove();
        engine();        
    });  
}

function gameOver() {
    var $gameOverContainer = $('<div id="game-over-container"></div>');
    $('body').append($gameOverContainer);

    var $gameOver = $('<img src="images/gameOver.png" alt="Game Over" id="img-game-over" />');
    $gameOverContainer.append($gameOver).hide();
    $gameOverContainer.toggle("slow");

    setTimeout(function () {
        $gameOverContainer.hide();
        startScreen();
    }, 4000);
}