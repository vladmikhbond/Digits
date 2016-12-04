function View() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
}

View.prototype.drawAll = function () {
    var colors = ["red", "green", "blue"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var t = 0; t < traces.length; t++) {
        ctx.beginPath();
        var p = traces[t].points[0];
        ctx.moveTo(p.x, p.y);
        for (var i = 0; i < traces[t].points.length; i += 1) {
            var p = traces[t].points[i];
            ctx.moveTo(p.x, p.y);
            var radius = p.stable ? 2 : 1;
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        }
        ctx.strokeStyle = colors[t % colors.length];
        ctx.stroke();
    }

}

View.prototype.drawLine = function (p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    //ctx.closePath();
    ctx.stroke();
}
