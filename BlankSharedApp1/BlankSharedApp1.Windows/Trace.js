function Trace() {
    this.model = null;
    this.points = [];
}

Trace.prototype.DIST = 10;

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
        var a = { x: this.points[i - 1].x - this.points[i].x, y: this.points[i - 1].y - this.points[i].y };
        var b = { x: this.points[i + 1].x - this.points[i].x, y: this.points[i + 1].y - this.points[i].y };
        // 
        var cos = (a.x * b.x + a.y * b.y) / Math.sqrt((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y));
        if (cos > -0.1) {
            var t = new Trace();
            t.points = this.points.slice(i0, i + 1);
            i0 = i;
            res.push(t);
        }
    }
    var t = new Trace();
    t.points = this.points.slice(i0);
    res.push(t);

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



