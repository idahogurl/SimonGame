// User Story: I am presented with a random series of button presses.
define("index", ["require", "exports", "jquery", "raphael"], function (require, exports, $, Raphael) {
    "use strict";
    var SimonButton = (function () {
        function SimonButton() {
            var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
            var red = paper.path("m 44.285156,673.79102 a 357.14285,357.14285 0 0 0 104.605464,252.5371 357.14285,357.14285 0 0 0 252.53711,104.60548 l 0,-357.14258 -357.142574,0 z");
            red.attr({ fill: '#44aa00' });
        }
        return SimonButton;
    }());
    $(document).ready(function (doc) {
        var button = new SimonButton();
    });
});
//# sourceMappingURL=index.js.map