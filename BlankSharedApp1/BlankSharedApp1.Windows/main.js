var L = Trace.prototype.SHORT - 1;
var pi = Math.PI;
var pi2 = Math.PI / 2;
var GRAD_30 = 0.5;

// стрелка направлена от конца к середине линии
// угол отсчитывается от направления Ох по часовой стрелке - положительный, против - отрицательный
// 0.5 rad = 30 grad

// вверху стрелка на юг 
function n_arrow_s(scetch)
{
    var h2 = scetch.height / 2, w2 = scetch.width / 2;

    function test(p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x); 
        return p1.y < h2 && alpha > pi2 - GRAD_30 && alpha < pi2 + GRAD_30;
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

// внизу стрелка на север
function s_arrow_n(scetch) {
    var h2 = scetch.height / 2, w2 = scetch.width / 2;

    function test(p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h2 && alpha < -pi2 + GRAD_30 && alpha > -pi2 - GRAD_30;
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

// внизу справа стрелка на запад 

function ne_arrow_w(scetch) {
    var h2 = scetch.height / 2, w2 = scetch.width / 2;

    function test(p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h2 && p1.x > w2 && (alpha < -pi + GRAD_30 || alpha > pi2 - GRAD_30);
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





price = {
    a1:  '01000 00000',
    b14: '01001 00000',
    a2:  '00100 00000',
}


//////////////////////////////////////////////////////

var view = new View();
var scetch = new Scetch();
Controller();
