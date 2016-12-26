// Prepare one trace
//
function Trace(points)
{
    this.points = points || [];
}

Trace.prototype.DIST = 5;
Trace.prototype.MIN_POINT_COUNT = 5;

Trace.prototype.addPoint = function (p) {
    this.points.push(p);
};

// Сдвигает
//
Trace.prototype.translate = function (xmin, ymin) {
 
    for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        p.x -= xmin;
        p.y -= ymin;
    }
};

// Удаляет точки, расположенные ближе, чем this.DIST к текущей точке. Точка, расположенная дальше, становится текущей.
//
Trace.prototype.eliminateExtraPoints = function ()
{
    var L = 3;
    var p0 = this.points[0];
    var newPoints = [p0];
    for (var i = 0; i < this.points.length - 1; i++) {
        var p = this.points[i];
        if (dist(p, p0) > this.DIST) {
            p0 = p;
            var x = 0, y = 0;
            for (var k = 0, j = Math.max(0, i - L) ; j <= Math.min(this.points.length - 1, i + L) ; j++, k++) {
                x += this.points[j].x;
                y += this.points[j].y;
            }
            newPoints.push({ 'x': x / k, 'y': y / k } );
        }
    }
    this.points = newPoints;
};




// Находит точки - вершины острых углов (cos > 0.1)
// и разбивает трассу на несколько, проводя границы по острым углам.
//
Trace.prototype.splitBySharpCorners = function () {
    var res = [];
    var i0 = 0;
    for (var i = 1; i < this.points.length - 1; i++) {
        // a и b - векторы, при условии, что начало координат в i-й точке
        var a = { x: this.points[i - 1].x - this.points[i].x, y: this.points[i - 1].y - this.points[i].y };
        var b = { x: this.points[i + 1].x - this.points[i].x, y: this.points[i + 1].y - this.points[i].y };
        // 
        var cos = (a.x * b.x + a.y * b.y) / Math.sqrt((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y));
        // находим острый угол (cos >= 0 )
        if (cos > -0.1) {
            // добавляем кусок от начала трассы до найденного острого угла
            res.push(new Trace(this.points.slice(i0, i + 1)));         
            i0 = i + 1;
        }
    }
    // добавляем остаток трассы
    var t = new Trace(this.points.slice(i0));
    if (!t.tooShort())
        res.push(t);
    return res;
};


// Находит точки самопересечения трассы и изымает из трассы найденные циклы.
//
Trace.prototype.splitByCircle = function () {
    var res = [];
    for (var i = this.MIN_POINT_COUNT; i < this.points.length; i++) {
        for (var j = 0; j < i - this.MIN_POINT_COUNT; j++) {
            if (dist(this.points[i], this.points[j]) < this.DIST * 4) {
                // уточняем ближайшую точку
                var pair = getNearestTwo(this, i, j);
                i = pair.i; j = pair.j;

                // добавляем циклическую трассу от j до i
                var t = new Trace(this.points.slice(j, i + 1));
                res.push(t);

                var n = i + 1 - j;
                i = j + 1;
                // изымаем из трассы циклический кусок
                this.points.splice(j, n);
            }
        }
    }
    res.push(this);
    return res;
};

// Уточняет, какие точки в положительной окрестности самопересечения траектории являются ближайшими
//
function getNearestTwo(me, i1, j1) {
    var L = me.MIN_POINT_COUNT;
    var i2 = Math.min(i1 + L, me.points.length - 1);
    var j2 = Math.min(j1 + L, me.points.length - 1);
    var imin = i1, jmin = j1, dmin = dist(me.points[i1], me.points[j1]);
    for (var i = i1; i <= i2; i++) {
        for (var j = j1; j <= j2; j++) {
            var d = dist(me.points[i], me.points[j]);
            if ( d < dmin) {
                imin = i; jmin = j; dmin = d;
            }
        }
    }
    return { i: imin, j: jmin };
}

// Разбивает трассу на несколько, проводя границы по точкам перегиба.
//
Trace.prototype.splitByInflectionPoints111 = function () {
    function atan(p, q) {
        var a = Math.atan2(p.y - q.y, p.x - q.x);
        return a < 0 ? 2 * Math.PI + a : a;
    }

    function atan2(p1, p2, p3) {
        var a2 = atan(p2, p1), a3 = atan(p3, p1);
        var a = a3 - a2;
        return a > Math.PI ? a - 2 * Math.PI : a;
    }

    var res = [];

    var L = 5, a0, i0 = 0;
    for (var i = 0; i < this.points.length - 2 * L - 1; i++) {
        var p1 = this.points[i], p2 = this.points[i + L], p3 = this.points[i + L + L];
        var a = atan2(p1, p2, p3);
        if (i == 0) continue;
        // i - индекс точки перегиба (соседние углы имеют разные знаки)
        if (a0 * a < 0) {
            // добавляем кусок от начала трассы до найденной точки перегиба
            res.push(new Trace(this.points.slice(i0, i + 1)));
            i0 = i + 1;
        }
        a0 = a;
    }
    // добавляем остаток трассы
    var t = new Trace(this.points.slice(i0));
    if (!t.tooShort())
        res.push(t);
    return res;
};


Trace.prototype.splitByInflectionPoints = function ()
{
    function atan2(p1, p2, p3) {
        var a2 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var a3 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
        return a3 - a2;
    }

    var L = 5, K = 0.15, a = [];
    for (var i = 0; i < this.points.length - 2 * L - 1; i++) {
        var p1 = this.points[i], p2 = this.points[i + L], p3 = this.points[i + L + L];
        var q = atan2(p1, p2, p3);
        if (q > K) {
            q = 1;
            var flag_max = true;
        } else if (q > -K) {
            q = 0;
        } else {
            q = -1;
            var flag_min = true;
        }
        a.push(q);
    }

    var res = [];
    if (!flag_max || !flag_min) {
        res.push(this);
        return res;
    }


    var i0 = 0;
    for (var i = 1; i < a.length - 1; i++) {
        if (a[i] != a[i - 1]) {
            var t = new Trace(this.points.slice(i0, i+1));
            if (!t.tooShort())
                res.push(t);
            i0 = i + 1;
        }
    }
    // добавляем остаток трассы
    var t = new Trace(this.points.slice(i0));
    if (!t.tooShort())
        res.push(t);
    return res;
};




// Определяет слишком короткие трассы
//
Trace.prototype.tooShort = function () {
    return this.points.length < this.MIN_POINT_COUNT ||
        this.points.length < this.MIN_POINT_COUNT * 3 && this.isLoop();
}

// Определяет, является ли трасса циклом
//
Trace.prototype.isLoop = function () {
    return dist(this.points[0], this.points[this.points.length - 1]) < 2 * this.DIST;
}

// Определяет, каким элементом является трасса
//
Trace.prototype.getElement = function () {
    var p1 = this.points[0];
    var p2 = this.points[this.points.length - 1];
    if (p1.y * 10000 + p1.x > p2.y * 10000 + p2.x) {
        var temp = p1; p1 = p2; p2 = temp;
    }

    // loop
    if (dist(p1, p2) < 2 * this.DIST)
        return { type: 'loop', center: this.center() };

    // line or arc.   0 <= alpha < PI
    var p3 = this.points[this.points.length / 2 | 0];  // middle point
    var alpha12 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    var alpha13 = Math.atan2(p3.y - p1.y, p3.x - p1.x); 

    if (Math.abs(alpha12 - alpha13) < Math.PI / 20) {
        return { type: 'line', 'p1': p1, 'p2': p2, alpha: alpha12, length: dist(p1, p2), center: this.center() };
    } else {
        return { type: 'arc', 'p1': p1, 'p2': p2, center: this.center(), alpha: alpha12, arc: alpha12 > alpha13 ? 'R' : 'L' };
    }
}






// Опредляет центр масс трассы
//
Trace.prototype.center = function () {
    var x = y = 0;
    for (var i in this.points) {
        x += this.points[i].x;
        y += this.points[i].y;
    }
    return { "x": x / this.points.length, "y": y / this.points.length };
};

function dist(p, q) {
    var dx = p.x - q.x, dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
}

//Trace.prototype.len = function () {
//    var sum = 0;
//    for (var i = 1; i < this.points.length; i++)
//        sum += dist(this.points[i - 1], this.points[i]);
//    return sum;
//}

//Trace.prototype.size = function () {
//    var minX = maxX = this.points[0].x;
//    var minY = maxY = this.points[0].y;
//    for (var i in this.points) {
//        if (minX > this.points[i].x) minX = this.points[i].x;
//        if (maxX < this.points[i].x) maxX = this.points[i].x;
//        if (minY > this.points[i].y) minY = this.points[i].y;
//        if (maxY < this.points[i].y) maxY = this.points[i].y;
//    }
//    return Math.max(maxX - minX, maxY - minY);
//}



