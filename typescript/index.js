// User Story: I am presented with a random series of button presses.
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
// User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
// User Story: I can see how many steps are in the current series of button presses.
// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.
// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
// Hint: Here are mp3s you can use for each button: https://s3.amazonaws.com/freecodecamp/simonSound1.mp3, https://s3.amazonaws.com/freecodecamp/simonSound2.mp3, https://s3.amazonaws.com/freecodecamp/simonSound3.mp3, https://s3.amazonaws.com/freecodecamp/simonSound4.mp3.
var $ = require("jQuery");
var React = require("react");
var ReactDOM = require("react-dom");
var react_1 = require("react");
//import {observable} from "mobx";
//import {observer} from "mobx-react";
var GamePadButton = (function () {
    function GamePadButton(canvas, props) {
        this.path = canvas.path(props.path);
        this.path.attr({ "type": "path", "stroke": "none", "fill": props.color })
            .mousedown(props.mousedown)
            .mouseup(props.mouseup);
        this.props.gameInput.buttons.push(this.path);
        var id = parseInt(this.props.id) + 1;
        var howlProps = { src: "https://s3.amazonaws.com/freecodecamp/simonSound" + id + ".mp3" };
        this.sound = new Howl(howlProps);
    }
    GamePadButton.prototype.lightUp = function () {
        this.path.animate({ opacity: .5 }, 1000);
    };
    GamePadButton.prototype.lightOff = function () {
        this.path.animate({ opacity: 1 }, 1000);
    };
    GamePadButton.prototype.playSound = function () {
    };
    GamePadButton.prototype.render = function () {
        return (React.createElement("div", null));
    };
    return GamePadButton;
}());
var SimonGame = (function (_super) {
    __extends(SimonGame, _super);
    function SimonGame() {
        var _this = _super.call(this) || this;
        _this.mouseUp.bind(_this);
        _this.mouseDown.bind(_this);
        _this.gamePad = new GamePad();
        debugger;
        var props = [];
        var buttonProps = {
            path: "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#ad1313",
            mouseup: _this.mouseUp,
            mousedown: _this.mouseDown
        };
        props.push(buttonProps);
        buttonProps = {
            path: "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300",
            color: "#34b521",
            mouseup: _this.mouseUp,
            mousedown: _this.mouseDown
        };
        props.push(buttonProps);
        buttonProps = {
            path: "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#d9d132",
            mouseup: _this.mouseUp,
            mousedown: _this.mouseDown
        };
        props.push(buttonProps);
        buttonProps = {
            path: "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300",
            color: "#58c2e8",
            mouseup: _this.mouseUp,
            mousedown: _this.mouseDown
        };
        props.push(buttonProps);
        _this.addButtons(props);
        return _this;
    }
    SimonGame.prototype.addButtons = function (buttonProps) {
        var _this = this;
        buttonProps.map(function (props) {
            var button = new GamePadButton(_this.gamePad.canvas, props);
            _this.gamePad.buttons.push(button);
        });
    };
    SimonGame.prototype.mouseDown = function (e) {
        //alert($(e.target)[0].raphaelid);
        this.gamePad.buttons[0].lightUp();
        this.gamePad.buttons[0].sound.play();
    };
    SimonGame.prototype.mouseUp = function (e) {
        this.gamePad.buttons[0].lightOff();
        this.gamePad.buttons[0].sound.play();
    };
    SimonGame.prototype.render = function () {
        return (React.createElement("div", null));
    };
    return SimonGame;
}(react_1.Component));
var GamePad = (function () {
    function GamePad() {
        this.canvas = Raphael("", 600, 600);
        this.buttons = [];
    }
    return GamePad;
}());
var Player = (function () {
    function Player() {
    }
    return Player;
}());
ReactDOM.render(React.createElement(SimonGame, null), document.getElementById("game"));
