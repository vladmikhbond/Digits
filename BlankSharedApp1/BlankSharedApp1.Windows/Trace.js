function Trace() {
    this.model = null;
    this.points = [];
}

Trace.prototype.DIST = 5;

Trace.prototype.addPoint = function (p) {
    this.points.push(p);
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
// и разбивает трассу на несколько, проводя границы по острым углам
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
            var t = new Trace();
            t.points = this.points.slice(i0, i + 1);
            i0 = i;
            res.push(t);
        }
    }
    // добавляем остаток трассы
    var t = new Trace();
    t.points = this.points.slice(i0);
    res.push(t);

    return res;
};


// Находит точки самопересечения трассы и отбивает от трассу найденный цикл.
// Куски до и после цикла сращивает.
Trace.prototype.splitByCircle = function () {
    var res = [];
    for (var i = 2; i < this.points.length; i++) {
        for (var j = 0; j < i - 2; j++) {
            if (dist(this.points[i], this.points[j]) < this.DIST) {
                var t = new Trace();
                t.points = this.points.slice(j, i);
                res.push(t);
                var n = i - j;
                this.points.splice(j, n);
                i -= n;
            }
        }
    }
    res.push(this);
    return res;
};


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

//Trace.prototype.value = function () {
//    if (dist(this.points[0], this.points[this.points.length - 1]) < this.model.size / 10)
//        return 'O';
//    else
//        return 'I';
//}



