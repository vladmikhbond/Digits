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

    function Duo(fun) {
        var count = 0;
        for (var i = 0; i < scetch.traces.length; i++) {
            if (fun(scetch.elements[i]))
                count++;
        }
        return count == 2;
    }


    // Tests

    var tests = [];

    var f = function () {
        return Exists(e => {
            return e.type == 'line' && 80 < e.alpha && e.alpha < 110 && e.length > h / 2;
        });
    };
    f.comment = 'длинная вертикальная линия'; f.t = [1, 4, 7]; f.f = [0, 2, 3, 5, 6, 8]; 
    tests[0] = f;


    tests[7] = function () {
        return Exists(e => {
            return (e.type == 'line' || e.type == 'arc' && e.arc == 'L') && 110 < e.alpha && e.alpha < 135 && e.length > h / 2;
        }) && [7];
    };
    tests[7].comment = 'длинная диагональная линия или дуга L';

    tests[5] = function () {
        return Exists(e => {
            if (e.type != 'line') return false;
            var y = (e.p1.y + e.p2.y) / 2;
            return (e.alpha < 10 || e.alpha > 170) && h / 5 < y && y < 4 * h / 5;
        }) && [4];
    }
    tests[5].comment = 'горизонтальная линия в середине';

    tests[6] = function () {
        return Exists(e => {
            if (e.type != 'arc') return false;
            var y = e.center.y;
            return e.arc == 'L' && 15 < e.alpha && e.alpha < 75 && y < h / 2;
        }) && [4];
    }
    tests[6].comment = 'дуга L в верхней половине';

    tests[1] = function () {
        return Exists(e => {
            if (e.type != 'arc') return false;
            var y = e.center.y;
            return e.arc == 'R' && y < h / 2;
        }) && [2,3];
    }
    tests[1].comment = 'дуга R в верхней половине';

    tests[2] = function () {
        return Exists(e => {
            if (e.type != 'arc') return false;
            var y = e.center.y;
            return e.arc == 'R' && h / 2 < y;
        }) && [3,5];
    }
    tests[2].comment = 'дуга R в нижней половине';

    tests[3] = function () {
        return Exists(e => {
            if (e.type == 'loop') return false;
            var y = (e.p1.y + e.p2.y) / 2;
            return (e.alpha < 10 || e.alpha > 170) && y < h / 5;
        }) && [5, 7];
    }
    tests[3].comment = 'горизонтальная линия или дуга вверху';

    tests[8] = function () {
        return !tests[3]() && [0, 1, 2, 3, 4, 6, 8, 9];
    }
    tests[8].comment = 'НЕТ горизонтальной линии или дуги вверху';

    tests[4] = function () {
        return Exists(e => {
            if (e.type != 'line') return false;
            var y = (e.p1.y + e.p2.y) / 2;

            return (e.alpha < 10 || e.alpha > 170) && y > 4 * h / 5;
        }) && [2];
    }
    tests[4].comment = 'горизонтальная линия внизу';




    this.doTests = function () {
        var result = [0,1,2,3,4,5,6,7,8,9];
        var report = "";

        // set intersection
        for (i in [0]) {
            var res = tests[i]();
            if (res) {
                report += "test " + i + "  " + tests[i].comment + "\n";
                result = intersect(result, tests[i].t);
            } else {
                result = intersect(result, tests[i].f);
            }
        }
        report += "RESULT: " + result + "\n";


        return report;
    }

    function intersect(a, b) {
        return a.filter(n => { return b.indexOf(n) != -1; });
    };




}