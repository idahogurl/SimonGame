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
var Howler = require("howler");
var Raphael = require("raphael");
var react_1 = require("react");
//import {observable} from "mobx";
//import {observer} from "mobx-react";
var GamePadButton = (function () {
    function GamePadButton(canvas, props) {
        debugger;
        this.path = canvas.path(props.path);
        this.pathId = this.path.id;
        this.props = props;
        this.path.attr({ "type": "path", "stroke": "#333333", "stroke-width": "15", "fill": props.color })
            .mousedown(props.mousedown)
            .mouseup(props.mouseup);
        var howlProps = { src: "https://s3.amazonaws.com/freecodecamp/" + props.soundFile, volume: 0.25 };
        this.sound = new Howl(howlProps);
    }
    GamePadButton.prototype.lightUp = function () {
        debugger;
        this.path.animate({ fill: this.props.clickColor }, 0);
        this.sound.play();
    };
    GamePadButton.prototype.lightOff = function () {
        this.path.animate({ fill: this.props.color }, 0);
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
        _this.mouseUp = _this.mouseUp.bind(_this);
        _this.mouseDown = _this.mouseDown.bind(_this);
        _this.gamePad = new GamePad();
        debugger;
        var props = [];
        //green
        var buttonProps = {
            soundFile: "simonSound1.mp3",
            path: "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300",
            color: "#00a74a",
            clickColor: "#13FF7C",
            mouseup: _this.mouseUp,
            mousedown: _this.mouseDown
        };
        props.push(buttonProps);
        //red
        buttonProps = {
            soundFile: "simonSound2.mp3",
            path: "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#9f0f17",
            clickColor: "#FF4C4C",
            mouseup: _this.mouseUp,
            mousedown: _this.mouseDown
        };
        props.push(buttonProps);
        //yellow
        buttonProps = {
            soundFile: "simonSound3.mp3",
            path: "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#cca707",
            clickColor: "#FED93F",
            mouseup: _this.mouseUp,
            mousedown: _this.mouseDown
        };
        props.push(buttonProps);
        //blue
        buttonProps = {
            soundFile: "simonSound4.mp3",
            path: "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300",
            color: "#094a8f",
            clickColor: "#1C8CFF",
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
            var button = new GamePadButton(_this.gamePad.gameCanvas, props);
            _this.gamePad.buttons.push(button);
        });
    };
    SimonGame.prototype.findButton = function (id) {
        var button = this.gamePad.buttons.filter(function (button) {
            return button.pathId === id;
        });
        return button[0];
    };
    SimonGame.prototype.mouseDown = function (e) {
        var id = $(e.target)[0].raphaelid;
        var button = this.findButton(id);
        button.lightUp();
        button.sound.play();
    };
    SimonGame.prototype.mouseUp = function (e) {
        var id = $(e.target)[0].raphaelid;
        var button = this.findButton(id);
        button.lightOff();
    };
    SimonGame.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Simon"),
            React.createElement("div", null, "Count"),
            React.createElement("div", null),
            React.createElement("div", null, "Strict Mode"),
            React.createElement("div", { className: "btn-group", role: "group", "aria-label": "Strict Mode" },
                React.createElement("button", { type: "button", className: "btn btn-default" }, "On"),
                React.createElement("button", { type: "button", className: "btn btn-default" }, "Off")),
            React.createElement("div", { className: "btn-group", role: "group", "aria-label": "Strict Mode" },
                React.createElement("button", { type: "button", className: "btn btn-default" }, "On"),
                React.createElement("button", { type: "button", className: "btn btn-default" }, "Off")),
            React.createElement("span", { className: "fa fa-undo fa-2x" }, "Restart")));
    };
    return SimonGame;
}(react_1.Component));
var GamePad = (function () {
    function GamePad() {
        debugger;
        this.gameCanvas = Raphael("gameCanvas");
        this.gameCanvas.setViewBox(0, 0, 400, 400, true); //decrease numbers to increase size
        this.gameCanvas.canvas.setAttribute('preserveAspectRatio', 'none');
        this.gameCanvas.circle(300, 300, 275).glow();
        this.buttons = [];
    }
    return GamePad;
}());
var Player = (function () {
    function Player() {
    }
    return Player;
}());
ReactDOM.render(React.createElement(SimonGame, null), document.getElementById("gameControls"));
