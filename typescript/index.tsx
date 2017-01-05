// User Story: I am presented with a random series of button presses.

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
const Raphael = require("raphael");
const HowlerGlobal = require("howler");

import {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";

class SimonButton extends Component {
    props: any;
    sound: any;

    constructor(props) {
        super(props);
        debugger;
        let button = this.props.gameInput.canvas.path(this.props.path)
                .attr({"type":"path","stroke":"none","fill":this.props.color})
                .mousedown(this.props.mousedown)
                .mouseup(this.props.mouseup);        

        this.props.gameInput.buttons.push(button);
        
        let id = parseInt(this.props.id) + 1;
        this.sound = new HowlerGlobal();
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

class SimonGame extends Component {
    gameInput: GameInput;    

    constructor() {
        super();   
        this.mouseUp.bind(this);
        this.mouseDown.bind(this);
        this.gameInput = new GameInput();     
        
    }

    mouseDown(e) {
        $(e.target).animate({opacity: .5});
        
        alert($(e.target)[0].raphaelid);
        this.gameInput.buttons[0].sound.play();
    }

    mouseUp(e) {
         $(e.target).animate({opacity: 1});
    }

    render() {
        return (
            <div>
                <SimonButton id="0" gameInput={this.gameInput} path="M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300" 
                    color="#ad1313" mouseup={this.mouseUp} mousedown={this.mouseDown}/>
                <SimonButton id="1" gameInput={this.gameInput} path="M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300" 
                    color="#34b521" mouseup={this.mouseUp} mousedown={this.mouseDown}/>
                <SimonButton id="2" gameInput={this.gameInput} path="M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300" 
                    color="#d9d132" mouseup={this.mouseUp} mousedown={this.mouseDown}/>
                <SimonButton id="3" gameInput={this.gameInput} path="M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300" 
                    color="#58c2e8" mouseup={this.mouseUp} mousedown={this.mouseDown}/>
            </div>
        );
    }
}

class GameInput {
    canvas: any;
    buttons: any[];
    sequence: number[];
    constructor() {
        this.canvas = new Raphael("gameCanvas", 600, 600);
        this.buttons = [];
    }

    //add new random # to sequence
    //animate button to show user
    //as user clicks check if correct button pushed
}

class Player {
    correctPlays: number;
}

ReactDOM.render(<SimonGame />, document.getElementById("game"));