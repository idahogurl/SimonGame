// User Story: I am presented with a random series of button presses.
define("index", ["require", "exports", "jquery", "raphael"], function (require, exports, $, Raphael) {
    "use strict";
    var SimonButton = (function () {
        function SimonButton() {
            var r = new Raphael("canvas_container", 500, 500);
            r.piechart(200, 240, 200, [25, 25, 25, 25]);
        }
        return SimonButton;
    }());
    $(document).ready(function (doc) {
        var button = new SimonButton();
    });
});
