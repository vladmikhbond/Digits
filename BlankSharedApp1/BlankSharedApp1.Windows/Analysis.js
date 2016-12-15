// стрелка направлена от конца к середине линии
// угол отсчитывается от направления Ох по часовой стрелке - положительный, против - отрицательный
// 0.5 rad = 30 grad

function Analysis(scetch) {
    var L = Trace.prototype.SHORT - 1;
    var pi = Math.PI;
    var pi2 = Math.PI / 2;
    var GRAD_30 = pi / 6, GRAD_45 = pi / 4;
    var h2 = scetch.height / 2;
    var w2 = scetch.width / 2;
    var h3 = scetch.height / 3;
    var w3 = scetch.width / 3;

    // вверху стрелка на юг ~30 (1, 4)
    this.n_arrow_s = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h2 && alpha > pi2 - GRAD_30 && alpha < pi2 + GRAD_30;
    }

    // внизу стрелка на север ~30 (1, 4)
    this.s_arrow_n = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h2 && alpha < -pi2 + GRAD_30 && alpha > -pi2 - GRAD_30;
    }

    // внизу справа стрелка на запад ~30 (2)
    this.ne_arrow_w = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h2 && p1.x > w2 && (alpha < -pi + GRAD_30 || alpha > pi2 - GRAD_30);
    }

    // вверху слева стрелка северо-восток ~45 (2,3)
    this.nw_arrow_ne = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h2 && p1.x < w2 && alpha < 0 && alpha > -pi2;
    }

    // внизу слева стрелка юго-восток -90+45 (3,5,9)
    this.sw_arrow_se = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y > h2 && p1.x < w2 && alpha > -GRAD_45 && alpha < pi2;
    }

    // вверху слева стрелка на восток ~30 (5,7)
    this.nw_arrow_e = function (p1, p2) {
        var alpha = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return p1.y < h2 && p1.x < w2 && (alpha > -GRAD_30 && alpha < GRAD_30);
    }

    // цикл по центру (0)
    this.c_loop = function (c) {
        return w3 < c.x && c.x < 2 * w3 && h3 < c.y && c.y < 2 * h3;
    }

    // цикл вверху (8,9)
    this.n_loop = function (c) {
        return w3 < c.x && c.x < 2 * w3 && c.y < h2;
    }

    // цикл внизу (8,6)
    this.s_loop = function (c) {
        return w3 < c.x && c.x < 2 * w3 && c.y > h2;
    }




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
}

TEST = "s_loop";

