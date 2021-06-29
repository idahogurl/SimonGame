// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.

import * as React from "react";
import { ReactElement } from "react";
import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Chance from "chance";
import { PowerSwitch } from "./components/PowerSwitch";
import { ControlButton } from "./components/ControlButton";
import { Howl, HowlOptions } from "howler";
import { GameCanvas } from "./components/GameCanvas";
import { GamePadButton } from "./components/GamePadButton";
import { CountDisplay } from "./components/CountDisplay";

const INITIAL_COUNT_VALUE = "--";

const INITIAL_BUTTONS = [
  {
    id: "green",
    path:
      "M 300 300 L 30 300 A 270 270 0 0 1 300 30 L 300 300 A 0 0 0 0 0 300 300",
    color: "#00a74a",
    prevColor: "#13FF7C",
    soundFile: "simonSound1.mp3",
    clicked: false
  },
  {
    id: "red",
    path:
      "M 300 300 L 300 30 A 270 270 0 0 1 570 300 L 300 300 A 0 0 0 0 0 300 300",
    color: "#9f0f17",
    prevColor: "#FF4C4C",
    soundFile: "simonSound2.mp3",
    clicked: false
  },
  {
    id: "yellow",
    path:
      "M 300 300 L 300 570 A 270 270 0 0 1 30 300 L 300 300 A 0 0 0 0 0 300 300",
    color: "#cca707",
    prevColor: "#FED93F",
    soundFile: "simonSound3.mp3",
    clicked: false
  },
  {
    id: "blue",
    path:
      "M 300 300 L 570 300 A 270 270 0 0 1 300 570 L 300 300 A 0 0 0 0 0 300 300",
    color: "#094a8f",
    prevColor: "#1C8CFF",
    soundFile: "simonSound4.mp3",
    clicked: false
  }
];

const INITIAL_STATE = {
  strictMode: false,
  sequence: [],
  userInput: [],
  count: INITIAL_COUNT_VALUE,
  startClicked: false,
  on: false,
  userTurn: false
};

function toggleButtonColor(button) {
  const currentColor = button.color;
  button.color = button.prevColor;
  button.prevColor = currentColor;
}

function SimonGame(): ReactElement {
  const counterDisplayRef = useRef(0);
  //const prevCountRef = useRef(INITIAL_COUNT_VALUE);
  const sequencePlayed = useRef([]);

  const [state, setState] = useState(INITIAL_STATE);
  const [buttons, setButtonState] = useState(INITIAL_BUTTONS);

  const {
    strictMode,
    sequence,
    userInput,
    count,
    startClicked,
    on,
    userTurn
  } = state;

  //randomly select a button index and add to sequence
  function addStep(): number {
    console.log("add step");

    let chance = new Chance();
    let randomNum: number = chance.integer({ min: 0, max: 3 });
    const newSequence = [...sequence];
    newSequence.push(randomNum);
    setState({
      ...state,
      sequence: newSequence
    });
    return randomNum;
  }

  function isUserRight(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  function pushButton(index: number, callback: () => void) {
    const howlProps: HowlOptions = {
      src: `sounds/${buttons[index].soundFile}`,
      volume: 0.25,
      onend: function() {
        //do not animate color change until finished playing
        const newButtons = [...buttons];
        const currentButton = newButtons[index];
        currentButton.clicked = true;
        toggleButtonColor(currentButton);
        setButtonState(newButtons);

        const newUserInput = [...userInput];
        console.log("userTurn", userTurn);

        if (userTurn) {
          sequencePlayed.current = [];
          newUserInput.push(index);
          console.log("newUserInput", newUserInput);
          console.log("sequence", sequence);

          if (isUserRight(newUserInput, sequence)) {
            console.log("YES");

            setState({
              ...state,
              count: `0${(parseInt(count, 10) + 1).toString()}`,
              userInput: newUserInput,
              userTurn: !userTurn
            });
          } else {
            setState({
              ...state,
              userTurn: !userTurn
            });
          }
        } else {
          sequencePlayed.current.push(index);
        }

        //} else {
        // blink !!
        // const prevCount = count;
        // setState({
        //   ...state,
        //   count: "!!"
        // });
        // // flip back
        // setState({
        //   ...state,
        //   count: '01',
        // });
        //playSequence(0);
        //}
      }
    };
    const sound = new Howl(howlProps);
    sound.play();
  }

  function playSequence(index: number = 0) {
    //runs recursively until the final sequence item is ran
    if (sequence.length) {
      console.log("Have length");
      console.log(
        "sequencePlayed.current.length < sequence.length",
        sequencePlayed.current.length,
        sequence.length
      );
      if (sequencePlayed.current.length === sequence.length) {
        console.log("here");
        setState({ ...state, userTurn: true });
      } else if (sequencePlayed.current.length <= sequence.length) {
        console.log("yo");
        const buttonIndex = sequence[index];
        index++;
        // on push
        const callback: any = function() {
          console.log("callback called");
          //self.playSequenceTimeout = playSequence(index);
          sequencePlayed.current.push(index);
          playSequence(index);
        };
        setTimeout(function() {
          pushButton(buttonIndex, callback);
        }, 250);
      }
    }
  }

  function onButtonClick(index: number): void {
    if (on && count !== INITIAL_COUNT_VALUE) {
      pushButton(index, () => {});
    }
  }

  useEffect(() => {
    if (startClicked) {
      if (sequence.length === 0) {
        setTimeout(() => {
          addStep();
        }, 1000);
      }
    } else {
      counterDisplayRef.current = 0;
    }
  }, [startClicked]);

  // useEffect(() => {
  //   if (count !== prevCountRef.current) {
  //     console.log("DIFF");
  //     debugger;
  //     if (count !== INITIAL_COUNT_VALUE && !userTurn) {
  //       addStep();
  //     }
  //   }
  //   console.log("count", count);
  //   console.log("prev", prevCountRef.current);
  //   prevCountRef.current = count;
  // }, [count]);

  useEffect(() => {
    console.log("play sequence");
    playSequence(0);
  }, [sequence]);

  useEffect(() => {
    console.log("userInput changed");
    debugger;
    if (on) {
      if (sequence.length === 0 || isUserRight(userInput, sequence)) {
        console.log("add step 1");
        addStep();
      } else {
        playSequence(0);
      }
    }
    //}
  }, [userInput]);

  useEffect(() => {
    //find the clicked one and turn it back
    const clickedIndex = buttons.findIndex(b => b.clicked);
    console.log("clicked", clickedIndex);

    if (clickedIndex !== -1) {
      // wait for animation to finish
      setTimeout(() => {
        const newButtons = [...buttons];
        const button = newButtons[clickedIndex];
        button.clicked = false;
        toggleButtonColor(button);
        setButtonState(newButtons);
      }, 250);
    }
  }, [buttons]);

  return (
    <>
      <div id="gameCanvas">
        <GameCanvas>
          {buttons.map((button, index) => {
            const { path, id, color } = button;
            return (
              <GamePadButton
                key={id}
                index={index}
                path={path}
                color={color}
                disabled={count === INITIAL_COUNT_VALUE}
                onClick={(index: number) => {
                  onButtonClick(index);
                }}
              />
            );
          })}
        </GameCanvas>
      </div>
      <div id="gameControls">
        <div id="control-text">
          <h1>
            Simon<span id="reg">&reg;</span>
          </h1>
          <div className="row">
            <div className="col-xs-4 col-xs-offset-8">
              <div
                className={
                  "block-center strict " +
                  (strictMode ? "strict-on" : "strict-off")
                }
              ></div>
            </div>
          </div>
          <div className="row">
            {"//or user was wrong"}
            <div className="col-xs-5 text-center">
              <CountDisplay
                count={count}
                on={on}
                blink={startClicked}
                loopRef={counterDisplayRef}
                callback={() => {
                  // debugger;
                  if (startClicked) {
                    setState({ ...state, count: "01", startClicked: false });
                  }
                }}
              />
            </div>
            <div className="col-xs-3">
              <ControlButton
                handleClick={() => {
                  if (on && !startClicked) {
                    setState({
                      ...state,
                      count: INITIAL_COUNT_VALUE,
                      startClicked: true
                    });
                  }
                }}
                color="red"
                label="start"
                on={on}
              />
            </div>
            <div className="col-xs-4">
              <ControlButton
                handleClick={isStrict => {
                  setState({ ...state, strictMode: isStrict });
                }}
                color="yellow"
                label="strict"
                on={on}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <PowerSwitch
                on={on}
                switchHandler={() =>
                  setState({
                    ...state,
                    count: INITIAL_COUNT_VALUE,
                    on: on ? false : true,
                    startClicked: false
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.render(<SimonGame />, document.getElementById("gameArea"));
//ReactDOM.render(<SimonGame winCount="5" />, document.getElementById("gameControls"));
