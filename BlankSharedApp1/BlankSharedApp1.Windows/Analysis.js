// стрелка направлена от конца к середине линии
// угол отсчитывается от направления Ох по часовой стрелке - положительный, против - отрицательный
//

function Analysis(scetch)
{
    var L = Trace.prototype.MIN_POINT_COUNT - 1;
    var pi = Math.PI;
    var pi2 = Math.PI / 2;
    var GRAD_30 = pi / 6, GRAD_45 = pi / 4;
    var h = scetch.height;
    var w = scetch.width;

    // вверху стрелка на юг ~30 (1, 4)
    this.n_arrow_s = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h/2 && alpha > pi2 - GRAD_30 && alpha < pi2 + GRAD_30;
    }

    // вверху слева стрелка на юг ~30 (1, 4)
    this.nw_arrow_s = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.x < w/2 && p1.y < h/2 && alpha > pi2 - GRAD_30 && alpha < pi2 + GRAD_30;
    }

    // внизу стрелка на север ~30 (1, 4)
    this.s_arrow_n = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h/2 && alpha < -pi2 + GRAD_30 && alpha > -pi2 - GRAD_30;
    }

    // в самом низу справа стрелка на запад ~30 (2)
    this.se_arrow_w = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > 0.8 * h && p1.x > w / 2 && (alpha < -pi + GRAD_30 || alpha > pi2 - GRAD_30);
    }

    // в самом верху справа стрелка на запад ~30 (5,7)
    this.ne_arrow_w = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h/5 && p1.x > w / 2 && (alpha < -pi + GRAD_30 || alpha > pi2 - GRAD_30);
    }

    // вверху слева стрелка северо-восток ~45 (2,3)
    this.nw_arrow_ne = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h/2 && p1.x < w/2 && alpha < 0 && alpha > -pi2;
    }

    // внизу слева стрелка юго-восток -90+45 (3,5,9)
    this.sw_arrow_se = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h/2 && p1.x < w/2 && alpha > -GRAD_45 && alpha < pi2;
    }

    // вверху слева стрелка на восток ~30 (5,7)
    this.nw_arrow_e = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h/2 && p1.x < w/2 && (alpha > -GRAD_30 && alpha < GRAD_30);
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
        var n_arrow_s = this.arrow("n_arrow_s");     // 1,4
        var s_arrow_n = this.arrow("s_arrow_n");     // 1,4
        var nw_arrow_s = this.arrow("nw_arrow_s");   // 4,5
        var se_arrow_w = this.arrow("se_arrow_w");   // 2
        var ne_arrow_w = this.arrow("ne_arrow_w");   // 2
        var nw_arrow_ne = this.arrow("nw_arrow_ne"); // 2,3
        var sw_arrow_se = this.arrow("sw_arrow_se"); // 3,5,9
        var nw_arrow_e = this.arrow("nw_arrow_e");   // 5,7
        var c_loop = this.loop("c_loop");  // 0
        var n_loop = this.loop("n_loop");  // 8,9
        var s_loop = this.loop("s_loop");  // 6,8
        var loop = c_loop || s_loop || n_loop

        var res = {};
        if (s_arrow_n && nw_arrow_s)
            res["1"] = 1.0;
        if (se_arrow_w)
            res["2"] = 1.0;
        if (nw_arrow_ne && sw_arrow_se && !ne_arrow_w)
            res["3"] = 1.0;
        if (n_arrow_s && s_arrow_n && !loop)
            res["4"] = 1.0;
        if (sw_arrow_se && ne_arrow_w && !loop)
            res["5"] = 1.0;
        if (s_loop && !n_loop)
            res["6"] = 1.0;
        if (!sw_arrow_se && nw_arrow_e && !loop)
            res["7"] = 1.0;
        if (n_loop && s_loop)
            res["8"] = 1.0;
        if (n_loop && !s_loop)
            res["9"] = 1.0;
        if (c_loop)
            res["0"] = 1.0;

        return JSON.stringify(res);
    }
}



