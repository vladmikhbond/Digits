// стрелка направлена от конца к середине линии
// угол отсчитывается от направления Ох по часовой стрелке - положительный, против - отрицательный
//

function Analysis(scetch)
{
    var L = Trace.prototype.MIN_POINT_COUNT - 1;
    var pi = Math.PI;
    var pi2 = Math.PI / 2;
    var GRAD_45 = pi / 4;
    var GRAD_30 = pi / 6;
    var GRAD_15 = pi / 12;
    var h = scetch.height;
    var w = scetch.width;

    // вверху стрелка на юг +-15 (1, 4)
    this.n_arrow_s = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h/2 && alpha > pi2 - GRAD_15 && alpha < pi2 + GRAD_15;
    }

    // внизу стрелка на север +-15 (1, 4)
    this.s_arrow_n = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h/2 && alpha < -pi2 + GRAD_15 && alpha > -pi2 - GRAD_15;
    }

    // вверху слева стрелка на юг +30-30 (4, 5)
    this.nw_arrow_s = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.x < w/2 && p1.y < h/2 && alpha > pi2 - GRAD_30 && alpha < pi2 + GRAD_30;
    }

    // в самом низу справа стрелка на запад +-15 (2)
    this.sse_arrow_w = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > 0.8 * h && p1.x > w / 2 && (alpha < -pi + GRAD_15 || alpha > pi2 - GRAD_15);
    }

    // в самом верху справа стрелка на запад +-15 (5,7)
    this.nne_arrow_w = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h / 5 && p1.x > w / 3 && (alpha < -pi + GRAD_15 || alpha > pi2 - GRAD_15);
    }

    // в середине справа стрелка на запад +-15 (5,7)
    this.e_arrow_w = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return h/3 < p1.y && p1.y < 4 * h / 5 && p1.x > w / 3 && (alpha < -pi + GRAD_15 || alpha > pi2 - GRAD_15);
    }

    // вверху слева стрелка северо-восток +-45 (2,3)
    this.nw_arrow_ne = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h/2 && p1.x < w/2 && alpha < 0 && alpha > -pi2;
    }

    // внизу слева стрелка юго-восток +-45 (3,5,9)
    this.sw_arrow_se = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h/2 && p1.x < w/2 && alpha > 0 && alpha < pi2;
    }

    // цикл по центру (0)
    this.c_loop = function (c) {
        return w/3 < c.x && c.x < 2 * w/3 && h/3 < c.y && c.y < 2 * h/3;
    }

    // цикл вверху (8,9)
    this.n_loop = function (c) {
        return c.y < 2*h/5;
    }

    // цикл внизу (8,6)
    this.s_loop = function (c) {
        return c.y > 3 * h/5;
    }

    //////////////////////////////////////////////////////////////////////////////

    this.loop = function (funName) {
        var fun = this[funName];

        for (var i = 0; i < scetch.traces.length; i++) {
            var trace = scetch.traces[i];
            if (trace.isLoop()) {
                if (fun(trace.center()))
                    return true;
            }
        }
        return false;
    }

    this.arrow = function (funName) {
        var fun = this[funName];

        for (var i = 0; i < scetch.traces.length; i++) {
            var trace = scetch.traces[i];
            // с одной стороны
            if (fun(trace.points[0], trace.points[L]))
                return true;
            // с другой стороны
            if (fun(trace.points[trace.points.length - 1], trace.points[trace.points.length - 1 - L]))
                return true;
        }
        return false;
    }


    this.test = function ()
    {
        var b = [], v = [], res = {"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0 }; 
        //////////////////////////////////////// "0123456789"
        b[0] = this.arrow("n_arrow_s");   v[0] = "-+--+--0-0"; // вверху стрелка на юг +-15 (1, 4)
        b[1] = this.arrow("s_arrow_n");   v[1] = "-+--+--+--"; // внизу стрелка на север +-15 (1, 4)
        b[2] = this.arrow("nw_arrow_s");  v[2] = "-0--++0---"; // вверху слева стрелка на юг +30-30 (4, 5)
        b[3] = this.arrow("sse_arrow_w"); v[3] = "-0+-0-----"; // в самом низу справа стрелка на запад +-15 (2)
        b[4] = this.arrow("nne_arrow_w"); v[4] = "-0---+0+--"; // в самом верху справа стрелка на запад +-15 (5,7)
        b[5] = this.arrow("nw_arrow_ne"); v[5] = "--++------"; // вверху слева стрелка северо-восток +-45 (2,3)
        b[6] = this.arrow("sw_arrow_se"); v[6] = "--0+-+---+"; // внизу слева стрелка юго-восток +-45 (3,5,9)
        ////////////////////////////////// "0123456789"
        b[7] = this.loop("c_loop"); v[7] = "+---------"; // цикл по центру (0)
        b[8] = this.loop("n_loop"); v[8] = "--------++"; // цикл вверху (8,9)
        b[9] = this.loop("s_loop"); v[9] = "------+-+-"; // цикл внизу (8,6)       

        //////////////////////////////////////// "0123456789"
        b[10] = this.arrow("e_arrow_w"); v[10] = "0-000+0000";  // в середине справа стрелка на запад +-15 (1|4) 

        // summarize
        var values = { '+': 1, '-': -10, '0': 0 };
        for (var i in b) {
            for (var j in res) {
                var c = v[i][j];
                var val = values[c]
                res[j] += b[i] ? val : 0;
            }
        }

        // order
        var arr = Object.entries(res)
        arr.sort((p1, p2) => p2[1] - p1[1]);        
        arr = arr.map(p => p[0]);
        return JSON.stringify(arr);
    }
}



