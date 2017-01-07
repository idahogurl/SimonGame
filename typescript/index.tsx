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
const Howler = require("howler");
const Raphael = require("raphael");

import {Component} from "react";

//import {observable} from "mobx";
//import {observer} from "mobx-react";

class GamePadButton {
    pathId: string;
    props: ISimonButtonProps;
    sound: Howl;
    path: RaphaelPath;
    
    constructor(canvas: RaphaelPaper, props: ISimonButtonProps) {
        debugger;
        this.path = canvas.path(props.path);
        this.pathId = this.path.id;
        this.props = props;

        this.path.attr({"type":"path","stroke":"#333333","stroke-width":"30","fill":props.color})
                .mousedown(props.mousedown)
                .mouseup(props.mouseup);
        
        let howlProps : IHowlProperties = { src: "https://s3.amazonaws.com/freecodecamp/" + props.soundFile, volume: 0.25 }; 
        this.sound = new Howl(howlProps);
    }

    lightUp() {
        debugger;
        this.path.animate({fill: this.props.clickColor}, 0);
        this.sound.play();
    }

    lightOff() {
        this.path.animate({fill: this.props.color}, 0);
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

        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.gamePad = new GamePad(); 

        debugger;

        let props: ISimonButtonProps[] = [];
        //green
        let buttonProps: ISimonButtonProps = {
            soundFile: "simonSound1.mp3",
            path: "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300",
            color:"#00a74a",
            clickColor: "#13FF7C",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown
        };

        props.push(buttonProps);

        //red
        buttonProps = {
            soundFile: "simonSound2.mp3",
            path: "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300", 
            color: "#9f0f17",
            clickColor: "#FF4C4C",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown
        };
        props.push(buttonProps);

        //yellow
        buttonProps = { 
            soundFile: "simonSound3.mp3",
            path: "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300",
            color:"#cca707",
            clickColor: "#FED93F",
            mouseup: this.mouseUp,
            mousedown: this.mouseDown
        };
        props.push(buttonProps);

        //blue
        buttonProps = { 
                soundFile: "simonSound4.mp3",
                path: "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300",
                color: "#094a8f",
                clickColor: "#1C8CFF",
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

    findButton(id:string):GamePadButton {
        let button:GamePadButton[] = this.gamePad.buttons.filter(button => {
            return button.pathId === id;
        });
        return button[0];
    }

    mouseDown(e) {
        let id:string = $(e.target)[0].raphaelid;
        let button:GamePadButton = this.findButton(id);
        
        button.lightUp();
        button.sound.play();
    }

    mouseUp(e) {
        let id:string = $(e.target)[0].raphaelid;
        let button:GamePadButton = this.findButton(id);

        button.lightOff();
    }

    render() {
        return (
            <div>
                <h1>Simon</h1>

                <div>Count</div>
                <div></div>
                <div>Strict Mode</div>
                <div className="btn-group" role="group" aria-label="Strict Mode">
                    <button type="button" className="btn btn-default">On</button>
                    <button type="button" className="btn btn-default">Off</button>
                </div>
                <div className="btn-group" role="group" aria-label="Strict Mode">
                    <button type="button" className="btn btn-default">On</button>
                    <button type="button" className="btn btn-default">Off</button>
                </div>
                

                <span className="fa fa-undo fa-2x">Restart</span>
            </div>
        );
    }
}

//Restart button

interface ISimonButtonProps
{
    soundFile: string;
    path: string;
    color: string;
    clickColor: string;
    mouseup: any;
    mousedown: any;
}

class GamePad {
    canvas: any;
    buttons: GamePadButton[];
    sequence: number[];

    constructor() {
        debugger;
        this.canvas = Raphael("gameCanvas", 600, 600);
        this.buttons = [];
    }

    //add new random # to sequence
    //animate button to show user
    //as user clicks check if correct button pushed
}

class Player {
    correctPlays: number;
}

ReactDOM.render(<SimonGame />, document.getElementById("gameControls"));