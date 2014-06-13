/*global document: false*/
/*global window: false*/
/*global Raphael: false*/
/*global Image: false*/

(function () {
    "use strict";

    var width,
        height,
        paper,
        rect,
        x,
        y,
        frame1,
        frame2,
        frame1Url,
        frame2Url,
        frameHeight,
        frame1Image,
        frame2Image,
        frame3Image,
        time,
        frame1Anim,
        frame2Anim,
        frame3Anim;


    width = window.screen.width;
    height = window.screen.height;
    paper = Raphael('svg', width, height);
    rect = paper.rect(0, 0, width, height);
    rect.attr('fill', '#000');

    x = 0;
    y = 0;

    frame1 = new Image();
    frame2 = new Image();

    frame1Url = 'images/outerSpace.jpg';
    frame2Url = 'images/outerSpaceFlipped.jpg';

    frame1.src = frame1Url;
    frame2.src = frame2Url;

    // Apparently Chrome does not work with frame1.height... This is a fix for Chrome
    frameHeight = 1920;

    frame1Image = paper.image(frame1Url, x, y - frameHeight * 2, width, frameHeight);
    frame2Image = paper.image(frame2Url, x, y - frameHeight, width, frameHeight);
    frame3Image = paper.image(frame1Url, x, y, width, frameHeight);

    time = 300000;

    frame1Anim = Raphael.animation({ x: 0, y: frameHeight - frameHeight }, time);
    frame2Anim = Raphael.animation({ x: 0, y: frameHeight }, time);
    frame3Anim = Raphael.animation({ x: 0, y: frameHeight * 2 }, time);

    frame1Image.animate(frame1Anim.repeat(Infinity), '<>');
    frame2Image.animate(frame2Anim.repeat(Infinity), '<>');
    frame3Image.animate(frame3Anim.repeat(Infinity), '<>');
}());