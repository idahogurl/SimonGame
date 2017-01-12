
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
                self.release();  //do not animate to base color until finished playing
            }
        };
        this.sound = new Howl(howlProps);
    }

    push(callback:any = undefined) {
        this.path.animate({fill: this.props.clickColor}, 0);
        this.sound.play();

        if (callback !== undefined) {
            this.callback = callback;
        }
    }

    release() {
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
    defaultCountDisplay: string = "--";
   

    constructor()
    {
        super();

        this.handleClick = this.handleClick.bind(this);
        this.pushComplete = this.pushComplete.bind(this);
        this.setStrictMode = this.setStrictMode.bind(this);
        this.switch = this.switch.bind(this);
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

    //add all the buttons to the game pad
    addButtons(buttonProps: ISimonButtonProps[]) {
        buttonProps.map(props => {
            let button: GamePadButton = new GamePadButton(this.gamePad.gameCanvas, props);
            this.gamePad.buttons.push(button);
        });
    }

    //get the button the user clicked
    findButton(id:string):GamePadButton {
        let button:GamePadButton[] = this.gamePad.buttons.filter(button => {
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
            let wait: number = 0;
            if (this.game.sequence !== undefined) {
                wait = 2000;
            }

            this.reset(); //start button also acts as reste button
            let self: any = this;

            
            setTimeout(function() {
                self.game.addStep(); //add the first step to sequence
                
                //show new count
                self.gamePad.updateCountDisplay(self.game.count);
                
                //play the sequence
                self.game.timeoutHandle = self.playSequence(); //enables us to stop playSequence
                                                                //when user presses incorrect button
                }, wait);
        }
    }

    playSequence(index:number = 0) {
        //runs recursively until the final sequence item is ran
       if (index < this.game.sequence.length) {

            this.game.userTurn = false;
            let buttonIndex = this.game.sequence[index];
            index++;

            let self: any = this;
            let callback: any = function() {
                self.game.timeoutHandle = self.playSequence(index);
            }
           
            setTimeout(function() {
                self.gamePad.buttons[buttonIndex].push(callback);
            }, 500);
        } else {
            //user may now play
            this.game.userInput = [];
            this.game.userTurn = true;            
        }
    }

    handleClick(e) {
        if (this.gamePad.on && this.game.userTurn) { //need to wait until sequence is played            
            let id:string = eval("$(e.target)[0].raphaelid"); //jQuery typing does not have raphaelid as property

            let self:any = this;
            let callback:any = function() {
                self.pushComplete(id);
            }

            let button:GamePadButton = this.findButton(id);
            button.push(callback);
        }
    }

    pushComplete(buttonId:string) {
        let self:any = this;
        const winCount = 5;

        let button:GamePadButton = this.findButton(buttonId);
        this.game.userInput.push(button.props.index); //add user selection

        let index = this.game.userInput.length - 1; //get current position in sequence
        if (this.game.userInput[index] === this.game.sequence[index]) {
            //correct button pushed

            if (this.game.userInput.length == winCount) { 
                //user won the game
                this.gamePad.countDisplay = "**";

                //pause for a moment
                setTimeout(function() {
                    self.start(); //re-start the game
                }, 3000);
            } else if (this.game.userInput.length === this.game.sequence.length) {
                //add new step to sequence
                this.game.addStep();

                this.gamePad.updateCountDisplay(this.game.count);
                
                //pause for a moment
                setTimeout(function() {
                    //play the sequence
                    self.playSequence();
                }, 1000);
            }
            
        } else {
            this.gamePad.countDisplay = "!!";
            clearTimeout(this.game.timeoutHandle); //stop current playSequence
            
            if (this.game.strictMode) {
               
               //pause for a moment
                setTimeout(function() {
                    self.start(); //re-start the game
                }, 2000);
            } else {
                 //pause for a moment
                
                 setTimeout(function() { 
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
        return (
            <div id="control-text">
                <h1>Simon<h4>&reg;</h4></h1>
                <div className="row">
                    <div className="col-xs-4 col-xs-offset-8">
                        <div className={"block-center strict " + (this.game.strictMode ? "strict-on" : "strict-off")}>
                        </div>
                    </div>
                </div>
                <div className="row">
                <div className="col-xs-5 text-center">
                    <CountDisplay count={this.gamePad.countDisplay} on={this.gamePad.on}/>
                </div>
                <div className="col-xs-3">
                    <ControlButton handleClick={this.start} color="red" label="start"/>
                </div>
                <div className="col-xs-4">
                    <ControlButton handleClick={this.setStrictMode} color="yellow" label="strict"/>
                </div>
                </div>
               <div className="row">
                    <div className="col-xs-12">
                        <PowerSwitch on={this.gamePad.on} switchHandler={this.switch}/>
                    </div>
                </div>

            </div>
        );
    }
}

class CountDisplay extends Component<any,any> {
    constructor(props) {
       super(props);
   }

   render() {
        return (<div className="block-center">
                <div id="count">
                    <span className={this.props.on ? "countDisplay-on" : "countDisplay-off"}>{this.props.count}</span>
                </div>
                <div>count</div>
            </div>);
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

        return (<div className="block-center"><div onClick={this.props.handleClick} className="controlButton"
        style={backgroundColor}></div>{this.props.label}</div>);
    }
}

class PowerSwitch extends Component<any,any> {
    constructor(props) {
       super(props);
   }

    render() {
        return (<div id="powerSwitch">
                    <span className="powerSwitch-off">Off</span>
                    <label className="switch">
                        <input type="checkbox" checked={this.props.on} onChange={this.props.switchHandler}/>
                        <div className="slider"></div>
                    </label>
                    <span className="powerSwitch-on">On</span>
                </div>);
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
    @observable on: boolean;
    @observable countDisplay:string;

    constructor() {
        this.countDisplay = "--";
        this.gameCanvas = Raphael("gameCanvas");
        this.gameCanvas.setViewBox(0, 0, 600, 600, true); //decrease numbers to increase size
        this.gameCanvas.canvas.setAttribute('preserveAspectRatio', 'none');
        this.gameCanvas.circle(300,300,275).glow();

        this.buttons = [];
    }

    updateCountDisplay(count: number) {        
        if (count < 10) {
            this.countDisplay = "0" + count;
        } else {
            this.countDisplay = count.toString();
        }
    }
}

class Game {
    @observable strictMode:boolean;
    sequence:number[];
    userInput:number[];
    count:number;
    userTurn: boolean;
    timeoutHandle:any;

    constructor() {
       this.userTurn = false;
       this.count = 0;
       this.strictMode = false;
    }

    //randomly select a button index and add to sequence
    addStep():number {
        let chance = new Chance();
        let randomNum:number = chance.integer({min: 0, max: 3});
        this.sequence.push(randomNum);

        this.count++;

        return randomNum;
    }
}

ReactDOM.render(<SimonGame />, document.getElementById("gameControls"));