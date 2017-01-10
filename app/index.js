// User Story: I am presented with a random series of button presses.
"use strict";
// User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
// User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
// User Story: I can see how many steps are in the current series of button presses.
// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.
// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
// Hint: Here are mp3s you can use for each button: https://s3.amazonaws.com/freecodecamp/simonSound1.mp3, https://s3.amazonaws.com/freecodecamp/simonSound2.mp3, https://s3.amazonaws.com/freecodecamp/simonSound3.mp3, https://s3.amazonaws.com/freecodecamp/simonSound4.mp3.
const $ = require("jQuery");
const React = require("react");
const ReactDOM = require("react-dom");
const Howler = require("howler");
const Raphael = require("raphael");
const Chance = require("chance");
const react_1 = require("react");
//import {observable} from "mobx";
//import {observer} from "mobx-react";
class GamePadButton {
    constructor(canvas, props) {
        this.path = canvas.path(props.path);
        this.pathId = this.path.id;
        this.props = props;
        this.path.attr({ "type": "path", "stroke": "#333333", "stroke-width": "15", "fill": props.color })
            .mousedown(props.mousedown);
        //.mouseup(props.mouseup);
        let self = this;
        let howlProps = {
            src: "https://s3.amazonaws.com/freecodecamp/" + props.soundFile,
            volume: 0.25,
            onend: function () {
                self.release();
            }
        };
        this.sound = new Howl(howlProps);
    }
    push(callback = undefined) {
        debugger;
        this.path.animate({ fill: this.props.clickColor }, 0);
        this.sound.play();
        if (callback !== undefined) {
            this.callback = callback;
        }
    }
    release() {
        debugger;
        this.path.animate({ fill: this.props.color }, 0);
        if (this.callback !== undefined) {
            this.callback();
        }
    }
    render() {
        return (React.createElement("div", null));
    }
}
class SimonGame extends react_1.Component {
    constructor() {
        super();
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.gamePad = new GamePad();
        this.game = new Game();
        this.start = this.start.bind(this);
        let props = [];
        //green
        let buttonProps = {
            soundFile: "simonSound1.mp3",
            path: "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300",
            color: "#00a74a",
            clickColor: "#13FF7C",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown,
            index: 0
        };
        props.push(buttonProps);
        //red
        buttonProps = {
            soundFile: "simonSound2.mp3",
            path: "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#9f0f17",
            clickColor: "#FF4C4C",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown,
            index: 1
        };
        props.push(buttonProps);
        //yellow
        buttonProps = {
            soundFile: "simonSound3.mp3",
            path: "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#cca707",
            clickColor: "#FED93F",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown,
            index: 2
        };
        props.push(buttonProps);
        //blue
        buttonProps = {
            soundFile: "simonSound4.mp3",
            path: "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300",
            color: "#094a8f",
            clickColor: "#1C8CFF",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown,
            index: 3
        };
        props.push(buttonProps);
        this.addButtons(props);
    }
    addButtons(buttonProps) {
        buttonProps.map(props => {
            let button = new GamePadButton(this.gamePad.gameCanvas, props);
            this.gamePad.buttons.push(button);
        });
    }
    findButton(id) {
        let button = this.gamePad.buttons.filter(button => {
            return button.pathId === id;
        });
        return button[0];
    }
    start() {
        this.playSequence();
    }
    playSequence(index = -1) {
        index += 1;
        let buttonIndex = this.game.sequence[index];
        if (index < this.game.sequence.length - 1) {
            let self = this;
            let callback = function () {
                self.playSequence(index);
            };
            this.gamePad.buttons[buttonIndex].push(callback);
        }
        else {
            buttonIndex = this.game.addStep();
            this.gamePad.buttons[buttonIndex].push();
        }
    }
    mouseDown(e) {
        let id = $(e.target)[0].raphaelid;
        let self = this;
        let callback = function () {
            self.mouseUp(id);
        };
        let button = this.findButton(id);
        button.push(callback);
    }
    mouseUp(buttonId) {
        debugger;
        let button = this.findButton(buttonId);
        this.game.addUserInput(button.props.index);
        //hit 20 then win
        if (this.game.sequence.length === this.game.userInput.length) {
            if (this.game.isCorrect()) {
                this.game.addStep();
            }
            else {
                alert("Wrong!");
            }
            let self = this;
            setTimeout(function () {
                self.playSequence();
            }, 2000);
        }
        //strict mode?
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Simon"),
            React.createElement("div", null, "Count"),
            React.createElement("div", null),
            React.createElement("div", null, "Strict Mode"),
            React.createElement("div", { className: "btn-group", role: "group", "aria-label": "Strict Mode" },
                React.createElement("button", { type: "button", className: "btn btn-default", onClick: this.start }, "On"),
                React.createElement("button", { type: "button", className: "btn btn-default" }, "Off")),
            React.createElement("div", { className: "btn-group", role: "group", "aria-label": "Strict Mode" },
                React.createElement("button", { type: "button", className: "btn btn-default" }, "On"),
                React.createElement("button", { type: "button", className: "btn btn-default" }, "Off")),
            React.createElement("span", { className: "fa fa-undo fa-2x" }, "Restart")));
    }
}
class GamePad {
    constructor() {
        this.gameCanvas = Raphael("gameCanvas");
        this.gameCanvas.setViewBox(0, 0, 400, 400, true); //decrease numbers to increase size
        this.gameCanvas.canvas.setAttribute('preserveAspectRatio', 'none');
        this.gameCanvas.circle(300, 300, 275).glow();
        this.buttons = [];
    }
}
class Game {
    constructor() {
        this.sequence = [];
        this.userInput = [];
    }
    countDisplay() {
        let count = this.sequence.length;
        return "00".substring(0, count) + count;
    }
    addStep() {
        let chance = new Chance();
        let randomNum = chance.integer({ min: 0, max: 3 });
        this.sequence.push(randomNum);
        return randomNum;
    }
    addUserInput(buttonIndex) {
        this.userInput.push(buttonIndex);
    }
    isCorrect() {
        let diff = this.difference();
        return diff.length === 0;
    }
    difference() {
        var differences = this.sequence.filter((item) => {
            return this.userInput.indexOf(item) < 0;
        });
        return differences;
    }
}
ReactDOM.render(React.createElement(SimonGame, null), document.getElementById("gameControls"));
