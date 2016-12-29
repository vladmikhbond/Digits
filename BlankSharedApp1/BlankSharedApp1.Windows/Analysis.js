//
//
function Test(name, set, fun) {
    this.name = name;
    this.set = set;
    this.fun = fun;
}


// 
//
function Analysis(scetch) {
    var L = Trace.prototype.MIN_POINT_COUNT - 1;
    var pi = Math.PI;
    var h = scetch.height;
    var w = scetch.width;

    // Quantors

    function Exists(fun) {
        for (var i = 0; i < scetch.traces.length; i++) {         
            if (fun(scetch.elements[i]))
                    return true;
        }
        return false;
    }

    function Amount(c, fun) {
        var count = 0;
        for (var i = 0; i < scetch.traces.length; i++) {
            if (fun(scetch.elements[i]))
                count++;
        }
        return count == c;
    }

    // Tests

    var tests = [
        //1,4,7

        new Test('высота намного больше ширины', [1],
            function () {
                return h > 5 * w;
            }
        ),

        new Test('длинная вертикальная линия', [1, 4, 7],
            function () {
                return Exists(e => { return e.type == 'line' && 80 < e.alpha && e.alpha < 110 && e.length > 3 * h / 4; });
            }
        ),

        new Test('длинная диагональная линия или дуга L', [4,7],
            function () {
                return Exists(e => {
                    return (e.type == 'line' || e.type == 'arc' && e.arc == 'L')
                        && 110 < e.alpha && e.alpha < 135 && e.length > 3 * h / 4;
                });
            }
        ),

        new Test('горизонтальная линия в середине', [4],
            function () {
                return Exists(e => {
                    if (e.type != 'line') return false;
                    var y = (e.p1.y + e.p2.y) / 2;
                    return (e.alpha < 10 || e.alpha > 170) && h / 5 < y && y < 4 * h / 5;
                });
            }
        ),

        new Test('дуга L в верхней половине (наклон вправо)', [4, 9],
            function () {
                return Exists(e => {
                    if (e.type != 'arc') return false;
                    var y = e.center.y;
                    return e.arc == 'L' && 15 < e.alpha && e.alpha < 75 && y < h / 2;
                });
            }
        ),

        new Test('дуга L вверху (наклон влево)', [5, 6],
            function () {
                return Exists(e => {
                    if (e.type != 'arc') return false;
                    var y = e.center.y;
                    return e.arc == 'L' && 135 < e.alpha && e.alpha < 180 && y < h / 5;
                });
            }
        ),

        // 2, 3, 5

        new Test('горизонтальная линия внизу', [2],
            function () {
                return Exists(e => {
                    if (e.type != 'line') return false;
                    var y = (e.p1.y + e.p2.y) / 2;
                    return (e.alpha < 10 || e.alpha > 170) && y > 4 * h / 5;
                });
            }
        ),

        new Test('горизонтальная линия или дуга вверху', [3, 5, 7],
            function () {
                return Exists(e => {
                    if (e.type == 'loop') return false;
                    var y = (e.p1.y + e.p2.y) / 2;
                    return (e.alpha < 10 || e.alpha > 170) && y < h / 5;
                });
            }
        ),

        new Test('дуга R в верхней половине', [2, 3],
            function () {
                return Exists(e => {
                    if (e.type != 'arc') return false;
                    var y = e.center.y;
                    return e.arc == 'R' && y < h / 3;
                });
            }
        ),

        new Test('дуга R в нижней половине', [3, 5, 9],
            function () {
                return Exists(e => {
                    if (e.type != 'arc') return false;
                    var y = e.center.y;
                    return e.arc == 'R' && h / 2 < y;
                });
            }
        ),

        // 6, 8, 9, 0

        new Test('большая петля', [0],
            function () {
                return Exists(e => {
                    return e.type == 'loop' && e.size > 9 * h / 10;
                });
            }
        ),

        new Test('петля внизу', [6, 8],
            function () {
                return Exists( e => {
                    return e.type == 'loop' && e.center.y > 2 * h / 3;
                });
            }
        ),

        new Test('петля вверху', [8, 9],
            function () {
                return Exists( e => {
                    return e.type == 'loop' && e.center.y < h / 3;
                });
            }
        ),

        new Test('ровно одна петля', [0, 6, 9],
            function () {
                return Amount(1, e => {
                    return e.type == 'loop';
                });
            }
        ),

        new Test('ровно две петли', [8],
            function () {
                return Amount(2, e => {
                    return e.type == 'loop';
                });
            }
        ),

        // TODO альтернатива для 9 - 91
        // большая дуга R [9]
        // дуга L вверху  [4, 9]


    ];


    this.doTests = function () {
        var result = [0,1,2,3,4,5,6,7,8,9];
        var report = "";

        // set intersection
        for (i in tests) {
            var res = tests[i].fun();
            if (res) {
                result = intersect(result, tests[i].set);
            }                
            report += (res ? '+  ' : '-  ') + tests[i].name + ": " + tests[i].set + "\n";

        }
        report += "RESULT: " + result + "\n";
        return report;
    }

    function intersect(a, b) {
        return a.filter(n => { return b.indexOf(n) != -1; });
    };




}