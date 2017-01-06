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

import {Component} from "react";
import * as RaphaelJs from "raphael";

//import {observable} from "mobx";
//import {observer} from "mobx-react";

class GamePadButton {
    props: any;
    sound: Howl;
    path: RaphaelPath;

    constructor(canvas: RaphaelPaper, props: ISimonButtonProps) {
        this.path = canvas.path(props.path);
        this.path.attr({"type":"path","stroke":"none","fill":props.color})
                .mousedown(props.mousedown)
                .mouseup(props.mouseup);
        
        this.props.gameInput.buttons.push(this.path);
        
        let id = parseInt(this.props.id) + 1;
        let howlProps : IHowlProperties = { src: "https://s3.amazonaws.com/freecodecamp/simonSound" + id + ".mp3"}; 
        this.sound = new Howl(howlProps);
    }

    lightUp() {
        this.path.animate({opacity: .5}, 1000);
    }

    lightOff() {
        this.path.animate({opacity: 1}, 1000);
    }

    playSound() {

    }
    render() {
        return (
            <div>
            </div>
        );
    }
}

class SimonGame extends Component<any,any> {
    gamePad: GamePad;    

    constructor() 
    {
        super();   

        this.mouseUp.bind(this);
        this.mouseDown.bind(this);
        this.gamePad = new GamePad(); 

        debugger;

        let props: ISimonButtonProps[] = [];
        let buttonProps: ISimonButtonProps = { 
            path: "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300", 
            color: "#ad1313",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown
        };
        props.push(buttonProps);
        
        buttonProps = { 
            path: "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300",
            color:"#34b521",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown
        };
        
        props.push(buttonProps);
        
        buttonProps = { 
            path: "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300",
            color:"#d9d132",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown
        };
        props.push(buttonProps);

        buttonProps = { 
                path: "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300",
                color: "#58c2e8",
                mouseup: this.mouseUp,
                mousedown: this.mouseDown
        }
        props.push(buttonProps);

        this.addButtons(props);
    }

    addButtons(buttonProps: ISimonButtonProps[]) {
        buttonProps.map(props => {
            let button: GamePadButton = new GamePadButton(this.gamePad.canvas, props);
            this.gamePad.buttons.push(button);
        });
    }

    mouseDown(e) {
        //alert($(e.target)[0].raphaelid);
        this.gamePad.buttons[0].lightUp();
        this.gamePad.buttons[0].sound.play();
    }

    mouseUp(e) {
        this.gamePad.buttons[0].lightOff();
        this.gamePad.buttons[0].sound.play();
    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}

interface ISimonButtonProps
{
    path: string;
    color: string;
    mouseup: any;
    mousedown: any;
}

class GamePad {
    canvas: any;
    buttons: GamePadButton[];
    sequence: number[];

    constructor() {
        this.canvas = Raphael("", 600, 600);
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