function Controller()
{
    canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
    canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
    window.addEventListener('mouseup', sketchpad_mouseUp, false);
    button.addEventListener('click', button_click, false);

    var drowing = 0;
    var trace;
    var lastPos;

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
            scetch.traces.push(trace);
            view.drawAll();
        }
    }

    // testing button click
    //
    function button_click() {
        scetch.process();
        var r = new Analysis(scetch).doTests();
        view.drawAll(0.95);
        setTimeout(function () { alert(r.report); }, 100);
    }


}
