
// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

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

import {Component} from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";

class GamePadButton {
    pathId: string;
    props: ISimonButtonProps;
    sound: Howl;
    path: RaphaelPath;
    callback: any;

    constructor(canvas: RaphaelPaper, props: ISimonButtonProps) {
        this.path = canvas.path(props.path);
        this.pathId = this.path.id;
        this.props = props;

        this.path.attr({"type":"path","stroke":"#333333","stroke-width":"15","fill":props.color})
                .click(props.clickHandler);
                //.mouseup(props.mouseup);
        let self:GamePadButton = this;
        let howlProps : IHowlProperties = { 
            src: "https://s3.amazonaws.com/freecodecamp/" + props.soundFile, 
            volume: 0.25,
            onend: function() {
                self.release();                
            }
        }; 
        this.sound = new Howl(howlProps);
    }

    push(callback:any = undefined) {
        debugger;
        
        this.path.animate({fill: this.props.clickColor}, 0);
        this.sound.play(); 

        if (callback !== undefined) {
            this.callback = callback;
        }
    }

    release() {
        debugger;
        this.path.animate({fill: this.props.color}, 0);
        if (this.callback !== undefined) {
            this.callback();
        }        
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

@observer
class SimonGame extends Component<any,any> {
    gamePad: GamePad;    
    game: Game;
    constructor() 
    {
        super();   

        this.handleClick = this.handleClick.bind(this);
        this.pushComplete = this.pushComplete.bind(this);
        this.setStrictMode = this.setStrictMode.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);

        this.gamePad = new GamePad(); 
        this.game = new Game();
        this.start = this.start.bind(this);
       
        let props: ISimonButtonProps[] = [];
        //green
        let buttonProps: ISimonButtonProps = {
            soundFile: "simonSound1.mp3",
            path: "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300",
            color:"#00a74a",
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
            color:"#cca707",
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
        }
        props.push(buttonProps);

        this.addButtons(props);
    }

    addButtons(buttonProps: ISimonButtonProps[]) {
        buttonProps.map(props => {
            let button: GamePadButton = new GamePadButton(this.gamePad.gameCanvas, props);
            this.gamePad.buttons.push(button);
        });
    }

    findButton(id:string):GamePadButton {
        let button:GamePadButton[] = this.gamePad.buttons.filter(button => {
            return button.pathId === id;
        });
        return button[0];
    }

    reset() {
        this.game.sequence = [];
        this.game.userInput = [];
        this.game.count = 0;
    }

    start() {
        if (this.gamePad.on) {            
            this.reset();
            this.game.addStep();
            this.gamePad.updateCountDisplay(this.game.count);
            this.playSequence();
        }
    }

    playSequence(index:number = 0) {
        if (index < this.game.sequence.length) {
            let buttonIndex = this.game.sequence[index];
            index++;
            let self: any = this;
            let callback: any = function() {
                self.playSequence(index);                  
            }
            this.gamePad.buttons[buttonIndex].push(callback);          
        }
        this.game.userInput = [];
    }

    handleClick(e) {
        debugger;
        let id:string = eval("$(e.target)[0].raphaelid"); //jQuery typing does not have raphaelid as property
        
        let self:any = this;
        let callback:any = function() {
            self.pushComplete(id);
        }
        
        let button:GamePadButton = this.findButton(id);
        button.push(callback);
    }

    pushComplete(buttonId:string) {
        let button:GamePadButton = this.findButton(buttonId);
        this.game.addUserInput(button.props.index);

        let index = this.game.userInput.length - 1;

        let self:any = this;
        //TODO: hit 20 then win, what happens?
        if (this.game.userInput[index] === this.game.sequence[index]) {
            if (this.game.userInput.length == 20) {
                
            } else if (this.game.userInput.length === this.game.sequence.length) {
                this.game.addStep();
                
                //pause for a moment
                setTimeout(function() {
                    self.playSequence();
                }, 1000);
            }
        } else {
            this.gamePad.countDisplay = "!!";

            if (this.game.strictMode) {
                this.start();
            } else {
                //pause for a moment
                setTimeout(function() {
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
        this.gamePad.countDisplay = "- -";
    }

    off() {
        this.gamePad.countDisplay = "";
        this.game.strictMode = false;
        //change color?
    }

    render() {
        return (
            <div id="control-text">
                <h1>Simon</h1>
                <div className="row">
                    <div className="col-xs-4 col-xs-offset-8">
                        <div className={"strict " + (this.game.strictMode ? "strict-on" : "strict-off")}>
                        </div>
                    </div>
                </div>
                <div className="row">
                <div className="col-xs-5 text-center">
                    <CountDisplay count={this.gamePad.countDisplay}/>
                    Count
                </div>
                <div className="col-xs-3">
                    <ControlButton handleClick={this.start} color="red"/>
                    Start
                </div>
                <div className="col-xs-4">
                    <ControlButton handleClick={this.setStrictMode} color="yellow"/>
                    Strict
                    </div>
                </div>
              <PowerSwitch state={this.gamePad.on}/>
            </div>
        );
    }
}
@observer
class CountDisplay extends Component<any,any> {
    constructor(props) {
       super(props);
   }

   render() {
        return (<div id="count">{this.props.countDisplay}</div>);
    }
}

class ControlButton extends Component<any, any> {
   constructor(props) {
       super(props);
   }
    render() {
        let backgroundColor: any = {
            background: this.props.color
        };
         
        return (<div onClick={this.props.handleClick} className="controlButton" 
        style={backgroundColor}></div>);
    }
}

class PowerSwitch extends Component<any,any> {
    constructor(props) {
       super(props);
   }

    render() {
        return (<div id="powerSwitch"><span className="status">On</span>&nbsp;
            <label className="switch"><input type="checkbox" checked={this.props.state}/><div className="slider"></div>
            </label>  <span className="status">Off</span></div>);
    }
}

interface ISimonButtonProps
{
    soundFile: string;
    path: string;
    color: string;
    clickColor: string;
    clickHandler: any;
    index: number;
}

class GamePad {
    gameCanvas: any;
    buttons: GamePadButton[];  
    on: boolean;
    @observable countDisplay:string;

    constructor() {
        this.gameCanvas = Raphael("gameCanvas");
        this.gameCanvas.setViewBox(0, 0, 600, 600, true); //decrease numbers to increase size
        this.gameCanvas.canvas.setAttribute('preserveAspectRatio', 'none');
        this.gameCanvas.circle(300,300,275).glow();
    
        this.buttons = [];
    }

    updateCountDisplay(count: number) {
        if (count < 10) {
            this.countDisplay = "0" + count;
        }
       this.countDisplay = count.toString();
    }
}

class Game {
    sequence:number[];
    userInput:number[];
    count:number;
    @observable strictMode:boolean;

    constructor() {
       this.strictMode = false;
    }

    addStep():number {
        let chance = new Chance();
        let randomNum:number = chance.integer({min: 0, max: 3});
        this.sequence.push(randomNum); 

        this.count++;       
        
        return randomNum;
    }

    addUserInput(buttonIndex: number) {
        this.userInput.push(buttonIndex);
    }

    isCorrect() {
        let diff = this.sequenceDifference();
        return diff.length === 0;
    }

    sequenceDifference() {
        var differences = this.sequence.filter((item) => {
            return this.userInput.indexOf(item) < 0;
        });
        return differences;
    }
}

ReactDOM.render(<SimonGame />, document.getElementById("gameControls"));