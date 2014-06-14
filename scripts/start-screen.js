/// <reference path="space-fighter-engine.js" />

startScreen();

function startScreen () {    
    var $wrapper = $('<div id="wrapper"></div>');
    //$("#canvas-container").append($wrapper);
    $('body').append($wrapper);

    var $playButton = $('<button type="button" id="btn-play">PLAY</button>)');
    $wrapper.append($playButton);

    var $label = $('<label for="playerName">Enter name: </label>');
    var $inputName = $('<input type="text" id="player-name" name="playerName" />');
    var $startGameButton = $('<button type="button" id="btn-start">START GAME</button>)');

    //Yanko fix
    //var $wrapper = $('#wrapper');
    //var $playButton = $('#btn-play');        
    //var $inputName = $('#player-name');
    //var $startGameButton = $('#btn-start');

    
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

    $playButton.click(function(){
        $playButton.remove();

        $wrapper.append($label);
        $wrapper.append($inputName);
        $wrapper.append($startGameButton);
        $startGameButton.hide();

        $('#player-name').change(function() {
            if ($(this).val().length >= 2) {
                $startGameButton.show();
            }
            else {
                $startGameButton.hide();
            }
        });
    });

    $startGameButton.click(function () {
        $wrapper.remove();
        engine();        
    });  
};