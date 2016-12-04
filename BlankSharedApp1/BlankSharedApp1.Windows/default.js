canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
window.addEventListener('mouseup', sketchpad_mouseUp, false);
button.addEventListener('click', button_click, false);


var drowing = 0;
var traces = [];
var trace;
var lastPos;
var ctx = canvas.getContext('2d');
var view = new View();


function getMousePos(e) {
    if (e.offsetX) {
        return { x: e.offsetX, y: e.offsetY };
    }
    else if (e.layerX) {
        return { x: e.layerX, y: e.layerY };
    }
}

function sketchpad_mouseDown(e) {
    lastPos = getMousePos(e);
    if (lastPos) {
        drowing = 1;
        trace = new Trace();
        trace.addPoint(lastPos);
    }
}

function sketchpad_mouseMove(e) {
    var mousePos = getMousePos(e);
    if (drowing === 1) {
        view.drawLine(lastPos, mousePos);
        trace.addPoint(mousePos);
        lastPos = mousePos;
    }
}

function sketchpad_mouseUp() {
    if (drowing) {
        drowing = 0;
        traces.push(trace);
        view.drawAll();
    }
}

function button_click() {
    for (var i in traces) {
        traces[i].eliminateExtraPoins();
        view.drawAll();
        var sharps = traces[i].findSharpCorners();
    }

}
