// User Story: I am presented with a random series of button presses.
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
class GamePadButton {
    constructor(canvas, props) {
        this.path = canvas.path(props.path);
        this.pathId = this.path.id;
        this.props = props;
        this.path.attr({ "type": "path", "stroke": "#333333", "stroke-width": "15", "fill": props.color })
            .click(props.clickHandler);
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
let SimonGame = class SimonGame extends react_1.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.pushComplete = this.pushComplete.bind(this);
        this.setStrictMode = this.setStrictMode.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
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
            clickHandler: this.handleClick,
            index: 0
        };
        props.push(buttonProps);
        //red
        buttonProps = {
            soundFile: "simonSound2.mp3",
            path: "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#9f0f17",
            clickColor: "#FF4C4C",
            clickHandler: this.handleClick,
            index: 1
        };
        props.push(buttonProps);
        //yellow
        buttonProps = {
            soundFile: "simonSound3.mp3",
            path: "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300",
            color: "#cca707",
            clickColor: "#FED93F",
            clickHandler: this.handleClick,
            index: 2
        };
        props.push(buttonProps);
        //blue
        buttonProps = {
            soundFile: "simonSound4.mp3",
            path: "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300",
            color: "#094a8f",
            clickColor: "#1C8CFF",
            clickHandler: this.handleClick,
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
        this.game.sequence = [];
        this.game.addStep();
        this.playSequence();
    }
    playSequence(index = 0) {
        if (index < this.game.sequence.length) {
            let buttonIndex = this.game.sequence[index];
            index++;
            let self = this;
            let callback = function () {
                self.playSequence(index);
            };
            this.gamePad.buttons[buttonIndex].push(callback);
        }
        this.game.userInput = [];
    }
    handleClick(e) {
        let id = $(e.target)[0].raphaelid;
        let self = this;
        let callback = function () {
            self.clickComplete(id);
        };
        let button = this.findButton(id);
        button.push(callback);
    }
    pushComplete(buttonId) {
        let button = this.findButton(buttonId);
        this.game.addUserInput(button.props.index);
        let index = this.game.userInput.length - 1;
        let self = this;
        //TODO: hit 20 then win, what happens?
        if (this.game.userInput[index] === this.game.sequence[index]) {
            if (this.game.userInput.length === this.game.sequence.length) {
                this.game.addStep();
                //pause for a moment
                setTimeout(function () {
                    self.playSequence();
                }, 1000);
            }
        }
        else {
            alert("Wrong!");
            this.game.count = "!!";
            if (this.game.strictMode) {
                this.game.sequence = [];
            }
            else {
                //pause for a moment
                setTimeout(function () {
                    self.game.count = self.game.getCountDisplay();
                    self.playSequence();
                }, 1000);
            }
        }
    }
    setStrictMode() {
        this.game.strictMode = !this.game.strictMode;
    }
    on() {
        this.game.count = "--";
    }
    off() {
        this.game.count = "";
        this.game.strictMode = false;
    }
    render() {
        return (React.createElement("div", { id: "control-text" },
            React.createElement("h1", null, "Simon"),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-xs-4 col-xs-offset-8" },
                    React.createElement("div", { className: "strict " + (this.game.strictMode ? "strict-on" : "strict-off") }))),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-xs-5 text-center" },
                    React.createElement("div", { id: "count" }, this.game.count),
                    "Count"),
                React.createElement("div", { className: "col-xs-3" },
                    React.createElement(ControlButton, { handleClick: this.start, color: "red" }),
                    "Start"),
                React.createElement("div", { className: "col-xs-4" },
                    React.createElement(ControlButton, { handleClick: this.setStrictMode, color: "yellow" }),
                    "Strict")),
            React.createElement("div", { className: "btn-group", role: "group", id: "" },
                React.createElement("button", { type: "button", className: "btn btn-default", onClick: this.on }, "On"),
                React.createElement("button", { type: "button", className: "btn btn-default", onClick: this.off }, "Off"))));
    }
};
SimonGame = __decorate([
    mobx_react_1.observer
], SimonGame);
class ControlButton extends react_1.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let backgroundColor = {
            background: this.props.color
        };
        return (React.createElement("div", { onClick: this.props.handleClick, className: "controlButton", style: backgroundColor }));
    }
}
class GamePad {
    constructor() {
        this.gameCanvas = Raphael("gameCanvas");
        this.gameCanvas.setViewBox(0, 0, 600, 600, true); //decrease numbers to increase size
        this.gameCanvas.canvas.setAttribute('preserveAspectRatio', 'none');
        this.gameCanvas.circle(300, 300, 275).glow();
        this.buttons = [];
    }
}
class Game {
    constructor() {
        this.sequence = [];
        this.userInput = [];
        this.strictMode = false;
    }
    getCountDisplay() {
        let count = this.sequence.length;
        if (count < 10) {
            return "0" + count;
        }
        return count.toString();
    }
    addStep() {
        let chance = new Chance();
        let randomNum = chance.integer({ min: 0, max: 3 });
        this.sequence.push(randomNum);
        this.count = this.getCountDisplay();
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
__decorate([
    mobx_1.observable
], Game.prototype, "count", void 0);
__decorate([
    mobx_1.observable
], Game.prototype, "strictMode", void 0);
ReactDOM.render(React.createElement(SimonGame, null), document.getElementById("gameControls"));
