var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// User Story: I am presented with a random series of button presses.
define("index", ["require", "exports", "react"], function (require, exports, react_1) {
    "use strict";
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
    var Raphael = require("raphael");
    var HowlerGlobal = require("howler");
    var SimonButton = (function (_super) {
        __extends(SimonButton, _super);
        function SimonButton(props) {
            var _this = _super.call(this, props) || this;
            debugger;
            var button = _this.props.gameInput.canvas.path(_this.props.path)
                .attr({ "type": "path", "stroke": "none", "fill": _this.props.color })
                .mousedown(_this.props.mousedown)
                .mouseup(_this.props.mouseup);
            _this.props.gameInput.buttons.push(button);
            var id = parseInt(_this.props.id) + 1;
            _this.sound = new HowlerGlobal();
            return _this;
        }
        SimonButton.prototype.render = function () {
            return (React.createElement("div", null));
        };
        return SimonButton;
    }(react_1.Component));
    var SimonGame = (function (_super) {
        __extends(SimonGame, _super);
        function SimonGame() {
            var _this = _super.call(this) || this;
            _this.mouseUp.bind(_this);
            _this.mouseDown.bind(_this);
            _this.gameInput = new GameInput();
            return _this;
        }
        SimonGame.prototype.mouseDown = function (e) {
            $(e.target).animate({ opacity: .5 });
            alert($(e.target)[0].raphaelid);
            this.gameInput.buttons[0].sound.play();
        };
        SimonGame.prototype.mouseUp = function (e) {
            $(e.target).animate({ opacity: 1 });
        };
        SimonGame.prototype.render = function () {
            return (React.createElement("div", null,
                React.createElement(SimonButton, { id: "0", gameInput: this.gameInput, path: "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300", color: "#ad1313", mouseup: this.mouseUp, mousedown: this.mouseDown }),
                React.createElement(SimonButton, { id: "1", gameInput: this.gameInput, path: "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300", color: "#34b521", mouseup: this.mouseUp, mousedown: this.mouseDown }),
                React.createElement(SimonButton, { id: "2", gameInput: this.gameInput, path: "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300", color: "#d9d132", mouseup: this.mouseUp, mousedown: this.mouseDown }),
                React.createElement(SimonButton, { id: "3", gameInput: this.gameInput, path: "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300", color: "#58c2e8", mouseup: this.mouseUp, mousedown: this.mouseDown })));
        };
        return SimonGame;
    }(react_1.Component));
    var GameInput = (function () {
        function GameInput() {
            this.canvas = new Raphael("gameCanvas", 600, 600);
            this.buttons = [];
        }
        return GameInput;
    }());
    var Player = (function () {
        function Player() {
        }
        return Player;
    }());
    ReactDOM.render(React.createElement(SimonGame, null), document.getElementById("game"));
});
