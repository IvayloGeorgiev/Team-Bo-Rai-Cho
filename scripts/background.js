/*global document: false*/
/*global window: false*/
/*global Raphael: false*/

(function () {
    "use strict";

    var width,
        height,
        paper,
        rect,
        x,
        y,

    width = window.screen.width;
    height = window.screen.height;
    paper = Raphael('svg', width, height);
    rect = paper.rect(0, 0, width, height);
    rect.attr('fill', '#000');

    var x = 0;
    var y = 0;

    var frame1 = new Image();
    var frame2 = new Image();

    var frame1Url = '/images/outerSpace.jpg';
    var frame2Url = '/images/outerSpaceFlipped.jpg';

    frame1.src = frame1Url;
    frame2.src = frame2Url;

    // Apparently Chrome does not work with fram1.height... This is a fix for Chrome
    var frameHeight = 1920;

    var frame1Image = paper.image(frame1Url, x, y - frameHeight * 2, width, frameHeight);
    var frame2Image = paper.image(frame2Url, x, y - frameHeight, width, frameHeight);
    var frame3Image = paper.image(frame1Url, x, y, width, frameHeight);

    var time = 300000;
    var frame1Anim = Raphael.animation({ x: 0, y: frameHeight - frameHeight }, time);
    var frame2Anim = Raphael.animation({ x: 0, y: frameHeight }, time);
    var frame3Anim = Raphael.animation({ x: 0, y: frameHeight * 2 }, time);


    frame1Image.animate(frame1Anim.repeat(Infinity), '<>');
    frame2Image.animate(frame2Anim.repeat(Infinity), '<>');
    frame3Image.animate(frame3Anim.repeat(Infinity), '<>');
})();