function Trace(points)
{
    this.points = points || [];
}

Trace.prototype.DIST = 5;

Trace.prototype.addPoint = function (p) {
    this.points.push(p);
};

// Масштабирует в заданный размер
//
Trace.prototype.scale = function (dx, dy, k) {
    for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        p.x = k * (p.x - dx);
        p.y = k * (p.y - dy);
    }
};

// Удаляет точки, расположенные ближе, чем this.D к текущей точке. Точка, расположенная дальше, становится текущей.
//
Trace.prototype.eliminateExtraPoints = function () {

    var p0 = this.points[0];
    var newPoints = [p0];
    for (var i in this.points) {
        var p = this.points[i];
        if (dist(p, p0) > this.DIST || p.stable) {
            p0 = p;
            newPoints.push(p0);
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
    res.push(new Trace(this.points.slice(i0)));
    return res;
};


// Находит точки самопересечения трассы и изымает из трассы найденные циклы.
//
Trace.prototype.splitByCircle = function () {
    var res = [];
    for (var i = 2; i < this.points.length; i++) {
        for (var j = 0; j < i - 2; j++) {
            if (dist(this.points[i], this.points[j]) < this.DIST) {
                // добавляем циклическую трассу от j до i
                var t = new Trace(this.points.slice(j, i));
                t.points.push({ x: this.points[j].x, y: this.points[j].y })
                res.push(t);

                var n = i - j;
                // изымаем из трассы циклический кусок
                this.points.splice(j, n);
                i -= n;
            }
        }
    }
    res.push(this);
    return res;
};

Trace.prototype.tooShort = function () {
    return this.points.length < 3;
}

Trace.prototype.isLoop = function ()
{
    return !this.tooShort() &&
        dist(this.points[0], this.points[this.points.length - 1]) < 2 * this.DIST;
}

function dist(p, q) {
    var dx = p.x - q.x, dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
}



//Trace.prototype.center = function () {
//    var c = { x: 0, y: 0 };
//    for (var i in this.points) {
//        c.x += this.points[i].x;
//        c.y += this.points[i].y;
//    }
//    c.x /= this.points.length;
//    c.y /= this.points.length;
//    return c;
//};

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



