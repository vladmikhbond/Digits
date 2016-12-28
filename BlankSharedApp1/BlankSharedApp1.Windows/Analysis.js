//
//
function Test(name, success, fail, fun) {
    this.name = name;
    this.success = success;
    this.fail = fail;
    this.fun = fun;
}

Test.prototype.do = function () {
    var isValid = this.fun();
    return this.fun() ? this.success : this.fail;
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

    tests[0] = new Test('длинная вертикальная линия', [1, 4, 7], [0, 2, 3, 5, 6, 8],
        function () {
            return Exists(e => { return e.type == 'line' && 80 < e.alpha && e.alpha < 110 && e.length > h / 2; });
        }
    );

    tests[1] = new Test('длинная диагональная линия или дуга L', [7], null,
        function () {
            return Exists(e => { return (e.type == 'line' || e.type == 'arc' && e.arc == 'L') && 110 < e.alpha && e.alpha < 135 && e.length > h / 2; });
        }
    );

    tests[2] = new Test('горизонтальная линия в середине', [4], null,
        function () {
            return Exists(e => {
                if (e.type != 'line') return false;
                var y = (e.p1.y + e.p2.y) / 2;
                return (e.alpha < 10 || e.alpha > 170) && h / 5 < y && y < 4 * h / 5;
            });
        }
    );

    tests[3] = new Test('дуга L в верхней половине', [4], null,
        function () {
            return Exists(e => {
                if (e.type != 'arc') return false;
                var y = e.center.y;
                return e.arc == 'L' && 15 < e.alpha && e.alpha < 75 && y < h / 2;
            });
        }
    );

    tests[4] = new Test('дуга R в верхней половине', [2,3], null,
        function () {
            return Exists(e => {
                if (e.type != 'arc') return false;
                var y = e.center.y;
                return e.arc == 'R' && y < h / 2;
            });
        }
    );

    tests[5] = new Test('дуга R в нижней половине', [3, 5], null,
        function () {
            return Exists(e => {
                if (e.type != 'arc') return false;
                var y = e.center.y;
                return e.arc == 'R' && h / 2 < y;
            });
        }
    );

    tests[6] = new Test('горизонтальная линия или дуга вверху', [5, 7], null,
        function () {
            return Exists(e => {
                if (e.type == 'loop') return false;
                var y = (e.p1.y + e.p2.y) / 2;
                return (e.alpha < 10 || e.alpha > 170) && y < h / 5;
            });
        }
    );

    tests[7] = new Test('горизонтальная линия или дуга вверху', [5, 7], [0, 1, 2, 3, 4, 6, 8, 9],
        function () {
            return Exists(e => {
                if (e.type == 'loop') return false;
                var y = (e.p1.y + e.p2.y) / 2;
                return (e.alpha < 10 || e.alpha > 170) && y < h / 5;
            });
        }
    );

    tests[8] = new Test('горизонтальная линия внизу', [2], null,
        function () {
            return Exists(e => {
                if (e.type != 'line') return false;
                var y = (e.p1.y + e.p2.y) / 2;
                return (e.alpha < 10 || e.alpha > 170) && y > 4 * h / 5;
            });
        }
    );


    this.doTests = function () {
        var result = [0,1,2,3,4,5,6,7,8,9];
        var report = "";

        // set intersection
        for (i in tests) {
            var set = tests[i].do();
            if (set) {
                result = intersect(result, set);
            }                
            report += "test " + i + "  " + tests[i].name + "  " + set + "\n";

        }
        report += "RESULT: " + result + "\n";


        return report;
    }

    function intersect(a, b) {
        return a.filter(n => { return b.indexOf(n) != -1; });
    };




}