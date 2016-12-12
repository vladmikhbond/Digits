var L = Trace.prototype.SHORT - 1;
var pi2 = Math.PI / 2;

// вверху стрелка на север 
function n_arrow_n(scetch)
{
    var h2 = scetch.height / 2, w2 = scetch.width / 2;
    function test(p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x); 
        return p1.y < h2 && (alpha > pi2 - 0.3 || alpha < -pi2 + 0.3 );
    }

    for (var i = 0; i < scetch.traces.length; i++) {
        var trace = scetch.traces[i];
        // с одной стороны
        if (test(trace.points[0], trace.points[L]))
            return true;
        // с другой стороны
        if (test(trace.points[trace.points.length - 1], trace.points[trace.points.length - 1 - L]))
            return true;
    }
    return false;
}

// внизу стрелка на юг
function b14(scetch) {

}
// внизу справа стрелка восток 
function a2(scetch) {

}


price = {
    a1:  '01000 00000',
    b14: '01001 00000',
    a2:  '00100 00000',
}


//////////////////////////////////////////////////////

var view = new View();
var scetch = new Scetch();
Controller();
