//

function Analysis(scetch) {
    var L = Trace.prototype.MIN_POINT_COUNT - 1;
    var pi = Math.PI;
    var h = scetch.height;
    var w = scetch.width;



    // Kuantors

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

    // длинная вертикальная линия  (1,4) 
    this.line_ver_long = function () {
        return Exists(e => {
            return e.type == 'line' && 9 * pi / 20 < e.alpha && e.alpha < 11 * pi / 20 && e.length > 4 * h / 5;
        }) && [1, 4];
    }

    // дуга R в центре или внизу(2,5)
    this.arcR_in_center_or_down = function (e) {
        return Exists(e => {
            var y = e.center.y;
            return e.type == 'arc' && e.arc == 'R' && 2 * h / 5 < y && y < 4 * h / 5;
        }) && [2, 5];
    }

    // дуга R в центре или верху(2,3)
    this.arcR_in_center_or_up = function (e) {
        return Exists(e => {
            var y = e.center.y;
            return e.type == 'arc' && e.arc == 'R' && h / 5 < y && y < 3 * h / 5;
        }) && [2, 3];
    }

    // две дуги R (3)
    this.arcR_two = function (e) {
        return Duo(e => {
            return e.type == 'arc' && e.arc == 'R';
        }) && [3];
    }

    // горизонтальная линия вверху (5,7)
    this.line_hor_up = function (e) {
        return Exists(e => {
            var y = (e.p1.y + e.p2.y) / 2;
            return e.type == 'line' && (e.alpha < 18 * pi || e.alpha > 17 * pi / 18) && y < h / 5;
        }) && [5, 7];
    }

    // горизонтальная линия внизу (2)
    this.line_hor_down = function (e) {
        return Exists(e => {
            var y = (e.p1.y + e.p2.y) / 2;
            return e.type == 'line' && (e.alpha < 18 * pi || e.alpha > 17 * pi / 18) && y > 4 * h / 5;
        }) && [2];
    }

    // горизонтальная линия в середине (4)
    this.line_hor_middle = function (e) {
        return Exists(e => {
            var y = (e.p1.y + e.p2.y) / 2;
            return e.type == 'line' && (e.alpha < pi / 18 || e.alpha > 17 * pi / 18) && h / 5 < y && y < 4 * h / 5;
        }) && [4];
    }



    this.doTests = function () {
        this.test[1]()

        var b = [], v = [], res = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0 };
        //////////////////////////////////////// "0123456789"


// дуга R в центре или внизу(2,5)
// дуга R вверху(2,3)
// две дуги R (3)
// горизонтальная линия вверху (5,7)
// горизонтальная линия внизу (2)
// горизонтальная линия в середине (4)

        // summarize
        var values = { '+': 1, '-': -1, '0': 0 };
        for (var i in b) {
            for (var j in res) {
                var c = v[i][j];
                var val = values[c]
                res[j] += b[i] ? val : -val;
            }
        }

        // order
        var arr = Object.entries(res)
        arr.sort((p1, p2) => p2[1] - p1[1]);
        arr = arr.map(p => p[0] + "(" + p[1] + ")");
        return JSON.stringify(arr);
    }




}