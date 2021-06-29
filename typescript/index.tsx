
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
    game: Game;
    defaultCountDisplay: string = "--";
    
    gameCanvas: any;
    buttons: GamePadButton[];
    @observable on: boolean;
    @observable countVisible: boolean;
    @observable count:string;

    blinkTimeout: any;
    playSequenceTimeout: any;
    startTimeout: any;
   
    constructor()
    {
        super();
        
        this.game = new Game();
        this.playSequenceTimeout = null;
        this.blinkTimeout = null;
        this.startTimeout = null;
        this.count = "--";
        
        this.gameCanvas = Raphael("gameCanvas");
        this.gameCanvas.setViewBox(0, 0, 600, 600, true); //decrease numbers to increase size
        this.gameCanvas.canvas.setAttribute('preserveAspectRatio', 'none');
        this.gameCanvas.circle(300,300,275).glow();

        this.buttons = [];
        this.countVisible = true;

        this.handleClick = this.handleClick.bind(this);
        this.pushComplete = this.pushComplete.bind(this);
        this.setStrictMode = this.setStrictMode.bind(this);
        this.switch = this.switch.bind(this);
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
            let button: GamePadButton = new GamePadButton(this.gameCanvas, props);
            this.buttons.push(button);
        });
    }

    blink(callback:any, count:number = 1) {
       
        //callback to self 6 times to make display flash
        let self:any = this;
        if (count < 6) {
            count++;
            this.countVisible = !this.countVisible;
            this.blinkTimeout = setTimeout(function() {
                self.blink(callback, count);
            }, 200);
        } else {
            this.countVisible = true;
            this.blinkTimeout = null;

            if (callback !== null) {
                callback(); //function to call after flashing finishes
            }
        }
   }

    updateCountDisplay(count: number) {        
        if (count < 10) {
            this.count = "0" + count;
        } else {
            this.count = count.toString();
        }
    }
    
    //get the button the user clicked
    findButton(id:string):GamePadButton {
        let button:GamePadButton[] = this.buttons.filter(button => {
            return button.pathId === id;
        });
        return button[0];
    }

    clearTimeouts() {
        if (this.playSequenceTimeout !== null) {
            clearTimeout(this.playSequenceTimeout);            
        }

        if (this.blinkTimeout !== null) {
            clearTimeout(this.blinkTimeout);
        }

        if (this.startTimeout !== null) {
            clearTimeout(this.startTimeout);
        }
    }

    reset() {
        this.game.userTurn = false;
        this.clearTimeouts();

        //set count to 0 and show "--"
        this.game.count = 0;
        this.count = this.defaultCountDisplay;

        //clear both sequences
        this.game.sequence = [];
        this.game.userInput = [];
    }

    start() {
        if (this.on) {
            this.reset(); //start button also acts as reset button

            let self: any = this;

            let callback: any = function() {
                self.startTimeout = setTimeout(function() {
                    self.game.addStep(); //add the first step to sequence
                    
                    //show new count
                    self.updateCountDisplay(self.game.count);
                    
                    //play the sequence
                    self.playSequenceTimeout = self.playSequence(); //enables us to stop playSequence
                                                                    //when user presses incorrect button
                    }, 500);
            };
            
            this.blinkTimeout = this.blink(callback);            
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
                self.playSequenceTimeout = self.playSequence(index);
            }
           
            setTimeout(function() {
                self.buttons[buttonIndex].push(callback);
            }, 250);
        } else {
            //user may now play
            this.game.userInput = [];
            this.game.userTurn = true;            
        }
    }

    handleClick(e) {
        if (this.on && this.game.userTurn) { //need to wait until sequence is played            
            this.game.userTurn = false;

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
        const winCount = 4;

        let button:GamePadButton = this.findButton(buttonId);
        this.game.userInput.push(button.props.index); //add user selection

        let index = this.game.userInput.length - 1; //get current position in sequence

        let callback:any;
        if (this.game.userInput[index] === this.game.sequence[index]) {
            //correct button pushed

            if (this.game.userInput.length == this.props.winCount) { 
                //user won the game
                this.count = "**";
                this.blink(null);
                
            } else if (this.game.userInput.length === this.game.sequence.length) {
                //add new step to sequence
                this.game.addStep();

                this.updateCountDisplay(this.game.count);
                
                //pause for a moment
                this.playSequenceTimeout = setTimeout(function() {
                    //play the sequence
                    self.playSequence();
                }, 250);
            } else {
                this.game.userTurn = true;
            }
            
        } else {
            this.clearTimeouts();
            this.count = "!!";
                      
            if (this.game.strictMode) {
               callback = function() {
                    //pause for a moment
                    setTimeout(function() {
                        self.startTimeout = self.start(); //re-start the game
                    }, 1000);
               };
            } else {
                
                callback = function() {
                    //pause for a moment
                    self.playSequenceTimeout = setTimeout(function() { 
                        //play the sequence again
                        self.updateCountDisplay(self.game.count);
                        self.playSequence();
                    }, 1000);
                };
            }

            this.blink(callback);
        }
    }

    setStrictMode() {
        this.game.strictMode = !this.game.strictMode;
    }

    switch(e) {
        this.on = !this.on;

        if (!this.on) {
           this.reset();
           this.game.strictMode = false;
        }        
    }

    render() {
        return (
            <div id="control-text">
                <h1>Simon<span id="reg">&reg;</span></h1>
                <div className="row">
                    <div className="col-xs-4 col-xs-offset-8">
                        <div className={"block-center strict " + (this.game.strictMode ? "strict-on" : "strict-off")}>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-5 text-center">
                    <CountDisplay count={this.count} on={this.on} countVisible={this.countVisible}/>
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
                        <PowerSwitch on={this.on} switchHandler={this.switch}/>
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
                    <span className={this.props.on && this.props.countVisible ? "countDisplay-on" : "countDisplay-off"}>{this.props.count}</span>
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

ReactDOM.render(<SimonGame winCount="5" />, document.getElementById("gameControls"));