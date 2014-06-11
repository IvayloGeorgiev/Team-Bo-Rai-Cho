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

    var frame1Image = paper.image(frame1Url, x, y - frame1.height * 2, width, frame1.height);
    var frame2Image = paper.image(frame2Url, x, y - frame2.height, width, frame2.height);
    var frame3Image = paper.image(frame1Url, x, y, width, frame1.height);

    var time = 300000;
    var frame1Anim = Raphael.animation({ x: 0, y: frame1.height - frame1.height }, time);
    var frame2Anim = Raphael.animation({ x: 0, y: frame2.height }, time);
    var frame3Anim = Raphael.animation({ x: 0, y: frame1.height * 2 }, time);


    frame1Image.animate(frame1Anim.repeat(Infinity), '<>');
    frame2Image.animate(frame2Anim.repeat(Infinity), '<>');
    frame3Image.animate(frame3Anim.repeat(Infinity), '<>');
})();