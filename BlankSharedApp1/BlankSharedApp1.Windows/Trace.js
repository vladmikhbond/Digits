function Trace() {
    this.model = null;
    this.points = [];
}
Trace.prototype.D = 20;

Trace.prototype.addPoint = function (p) {
    this.points.push(p);
};

Trace.prototype.eliminateExtraPoins = function () {

    var p0 = this.points[0];
    var newPoints = [p0];
    for (var i in this.points) {
        var p = this.points[i];
        if (dist(p, p0) > this.D || p.stable) {
            p0 = p;
            newPoints.push(p0);
        }
    }
    this.points = newPoints;
};

//Trace.prototype.markAsStables = function () {
//    for (var i = 1; i < this.points.length - 1; i++) {
//        var a = this.points[i - 1], b = this.points[i], c = this.points[i + 1];
//        if (a.x < b.x && b.x > c.x || a.x > b.x && b.x < c.x ||
//            a.y < b.y && b.y > c.y || a.y > b.y && b.y < c.y)
//            this.points[i].stable = true;
//    }
//    this.points[i].stable = true;
//    this.points[0].stable = true;
//};

Trace.prototype.findSharpCorners = function () {
    var res = [];
    for (var i = 1; i < this.points.length - 1; i++) {
        var a = { x: this.points[i - 1].x - this.points[i].x, y: this.points[i - 1].y - this.points[i].y };
        var b = { x: this.points[i + 1].x - this.points[i].x, y: this.points[i + 1].y - this.points[i].y };
        var o = { x: 0, y: 0 };
        // 
        var cos = (a.x * b.x + a.y * b.y) / Math.sqrt((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y));
        if (cos > 0.1) {
            res.push(this.points[i]);
        }
    }
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



