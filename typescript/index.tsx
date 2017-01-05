// User Story: I am presented with a random series of button presses.

// User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.

// User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.

// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.

// User Story: I can see how many steps are in the current series of button presses.

// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.

// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.

// Hint: Here are mp3s you can use for each button: https://s3.amazonaws.com/freecodecamp/simonSound1.mp3, https://s3.amazonaws.com/freecodecamp/simonSound2.mp3, https://s3.amazonaws.com/freecodecamp/simonSound3.mp3, https://s3.amazonaws.com/freecodecamp/simonSound4.mp3.
import * as $ from "jquery"
import {Component} from "react"
import * as Raphael from "raphael";

class SimonButton {
    constructor() {
        var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
        var red = paper.path("m 44.285156,673.79102 a 357.14285,357.14285 0 0 0 104.605464,252.5371 357.14285,357.14285 0 0 0 252.53711,104.60548 l 0,-357.14258 -357.142574,0 z");
        red.attr({fill: '#44aa00'});
    }
}

$(document).ready(doc => {
    let button = new SimonButton();
});