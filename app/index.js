// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
// import * as $ from 'jquery';
// window["$"] = $; //get bootstrap js to work
// window["jQuery"] = $;
const $ = require("jquery");
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
                self.release(); //do not animate to base color until finished playing
            }
        };
        this.sound = new Howl(howlProps);
    }
    push(callback = undefined) {
        this.path.animate({ fill: this.props.clickColor }, 0);
        this.sound.play();
        if (callback !== undefined) {
            this.callback = callback;
        }
    }
    release() {
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
        this.defaultCountDisplay = "--";
        this.handleClick = this.handleClick.bind(this);
        this.pushComplete = this.pushComplete.bind(this);
        this.setStrictMode = this.setStrictMode.bind(this);
        this.switch = this.switch.bind(this);
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
    //add all the buttons to the game pad
    addButtons(buttonProps) {
        buttonProps.map(props => {
            let button = new GamePadButton(this.gamePad.gameCanvas, props);
            this.gamePad.buttons.push(button);
        });
    }
    //get the button the user clicked
    findButton(id) {
        let button = this.gamePad.buttons.filter(button => {
            return button.pathId === id;
        });
        return button[0];
    }
    reset() {
        if (this.game.timeoutHandle !== undefined) {
            clearTimeout(this.game.timeoutHandle);
        }
        //set count to 0 and show "--"
        this.game.count = 0;
        this.gamePad.countDisplay = this.defaultCountDisplay;
        //clear both sequences
        this.game.sequence = [];
        this.game.userInput = [];
    }
    start() {
        if (this.gamePad.on) {
            //when a reset pause for a moment
            let wait = 0;
            if (this.game.sequence !== undefined) {
                wait = 2000;
            }
            this.reset(); //start button also acts as reste button
            let self = this;
            setTimeout(function () {
                self.game.addStep(); //add the first step to sequence
                //show new count
                self.gamePad.updateCountDisplay(self.game.count);
                //play the sequence
                self.game.timeoutHandle = self.playSequence(); //enables us to stop playSequence
                //when user presses incorrect button
            }, wait);
        }
    }
    playSequence(index = 0) {
        //runs recursively until the final sequence item is ran
        if (index < this.game.sequence.length) {
            this.game.userTurn = false;
            let buttonIndex = this.game.sequence[index];
            index++;
            let self = this;
            let callback = function () {
                self.game.timeoutHandle = self.playSequence(index);
            };
            setTimeout(function () {
                self.gamePad.buttons[buttonIndex].push(callback);
            }, 500);
        }
        else {
            //user may now play
            this.game.userInput = [];
            this.game.userTurn = true;
        }
    }
    handleClick(e) {
        if (this.gamePad.on && this.game.userTurn) {
            let id = eval("$(e.target)[0].raphaelid"); //jQuery typing does not have raphaelid as property
            let self = this;
            let callback = function () {
                self.pushComplete(id);
            };
            let button = this.findButton(id);
            button.push(callback);
        }
    }
    pushComplete(buttonId) {
        let self = this;
        const winCount = 5;
        let button = this.findButton(buttonId);
        this.game.userInput.push(button.props.index); //add user selection
        let index = this.game.userInput.length - 1; //get current position in sequence
        if (this.game.userInput[index] === this.game.sequence[index]) {
            //correct button pushed
            if (this.game.userInput.length == winCount) {
                //user won the game
                this.gamePad.countDisplay = "**";
                //pause for a moment
                setTimeout(function () {
                    self.start(); //re-start the game
                }, 3000);
            }
            else if (this.game.userInput.length === this.game.sequence.length) {
                //add new step to sequence
                this.game.addStep();
                this.gamePad.updateCountDisplay(this.game.count);
                //pause for a moment
                setTimeout(function () {
                    //play the sequence
                    self.playSequence();
                }, 1000);
            }
        }
        else {
            this.gamePad.countDisplay = "!!";
            clearTimeout(this.game.timeoutHandle); //stop current playSequence
            if (this.game.strictMode) {
                //pause for a moment
                setTimeout(function () {
                    self.start(); //re-start the game
                }, 2000);
            }
            else {
                //pause for a moment
                setTimeout(function () {
                    //play the sequence again
                    self.gamePad.updateCountDisplay(self.game.count);
                    self.playSequence();
                }, 2000);
            }
        }
    }
    setStrictMode() {
        this.game.strictMode = !this.game.strictMode;
    }
    switch(e) {
        this.gamePad.on = !this.gamePad.on;
        this.gamePad.countDisplay = this.defaultCountDisplay;
    }
    off() {
        this.reset();
        this.game.strictMode = false;
    }
    render() {
        return (React.createElement("div", { id: "control-text" },
            React.createElement("h1", null,
                "Simon",
                React.createElement("h4", null, "\u00AE")),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-xs-4 col-xs-offset-8" },
                    React.createElement("div", { className: "block-center strict " + (this.game.strictMode ? "strict-on" : "strict-off") }))),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-xs-5 text-center" },
                    React.createElement(CountDisplay, { count: this.gamePad.countDisplay, on: this.gamePad.on })),
                React.createElement("div", { className: "col-xs-3" },
                    React.createElement(ControlButton, { handleClick: this.start, color: "red", label: "start" })),
                React.createElement("div", { className: "col-xs-4" },
                    React.createElement(ControlButton, { handleClick: this.setStrictMode, color: "yellow", label: "strict" }))),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-xs-12" },
                    React.createElement(PowerSwitch, { on: this.gamePad.on, switchHandler: this.switch })))));
    }
};
SimonGame = __decorate([
    mobx_react_1.observer
], SimonGame);
class CountDisplay extends react_1.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: "block-center" },
            React.createElement("div", { id: "count" },
                React.createElement("span", { className: this.props.on ? "countDisplay-on" : "countDisplay-off" }, this.props.count)),
            React.createElement("div", null, "count")));
    }
}
class ControlButton extends react_1.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let backgroundColor = {
            background: this.props.color
        };
        return (React.createElement("div", { className: "block-center" },
            React.createElement("div", { onClick: this.props.handleClick, className: "controlButton", style: backgroundColor }),
            this.props.label));
    }
}
class PowerSwitch extends react_1.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { id: "powerSwitch" },
            React.createElement("span", { className: "powerSwitch-off" }, "Off"),
            React.createElement("label", { className: "switch" },
                React.createElement("input", { type: "checkbox", checked: this.props.on, onChange: this.props.switchHandler }),
                React.createElement("div", { className: "slider" })),
            React.createElement("span", { className: "powerSwitch-on" }, "On")));
    }
}
class GamePad {
    constructor() {
        this.countDisplay = "--";
        this.gameCanvas = Raphael("gameCanvas");
        this.gameCanvas.setViewBox(0, 0, 600, 600, true); //decrease numbers to increase size
        this.gameCanvas.canvas.setAttribute('preserveAspectRatio', 'none');
        this.gameCanvas.circle(300, 300, 275).glow();
        this.buttons = [];
    }
    updateCountDisplay(count) {
        if (count < 10) {
            this.countDisplay = "0" + count;
        }
        else {
            this.countDisplay = count.toString();
        }
    }
}
__decorate([
    mobx_1.observable
], GamePad.prototype, "on", void 0);
__decorate([
    mobx_1.observable
], GamePad.prototype, "countDisplay", void 0);
class Game {
    constructor() {
        this.userTurn = false;
        this.count = 0;
        this.strictMode = false;
    }
    //randomly select a button index and add to sequence
    addStep() {
        let chance = new Chance();
        let randomNum = chance.integer({ min: 0, max: 3 });
        this.sequence.push(randomNum);
        this.count++;
        return randomNum;
    }
}
__decorate([
    mobx_1.observable
], Game.prototype, "strictMode", void 0);
ReactDOM.render(React.createElement(SimonGame, null), document.getElementById("gameControls"));
