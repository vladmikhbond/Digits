function Scetch() {
    
    this.width = canvas.width;
    this.height = canvas.height;
    this.traces = [];

    this.process = function () {
        this.eliminateExtraPoints();
        this.splitTraces();
        this.removeShorts();
        this.scale();
    }

    // Удаляет слишком короткие трассы
    //
    this.removeShorts = function () {
        for (var i = this.traces.length - 1; i >= 0; i--) {
            if (this.traces[i].tooShort())
                this.traces.splice(i, 1);
        }
    }

    // Масштабирует трассы
    //
    this.scale = function () {
        // define maxes and mins
        var xmin = ymin = Number.MAX_VALUE;
        var xmax = ymax = 0;
        for (var i in this.traces) {
            for (var j = 0; j < this.traces[i].points.length; j++) {
                var p = this.traces[i].points[j];
                if (p.x < xmin) xmin = p.x;
                if (p.y < ymin) ymin = p.y;
                if (p.x > xmax) xmax = p.x;
                if (p.y > ymax) ymax = p.y;
            }
        }

        // resize this
        this.width = xmax - xmin;
        this.height = ymax - ymin;

        for (var i = 0; i < this.traces.length; i++) {
            this.traces[i].translate(xmin, ymin);
        }
    };


    // Удаляет лишние точки из трасс
    //
    this.eliminateExtraPoints = function () {
        for (var i in this.traces) {
            this.traces[i].eliminateExtraPoints();
        }
    }

    // Разбивает каждую трассу на несколько трасс
    //
    this.splitTraces = function () {
        // отделяет петли
        var newTraces = [];
        for (var i in this.traces) {
            newTraces = newTraces.concat(this.traces[i].splitByCircle());
        }
        this.traces = newTraces;

        // разбивает непетли по острым углам
        var newTraces = [];
        for (var i in this.traces)
        {
            var t = this.traces[i];
            if (t.isLoop())
                newTraces.push(t);
            else
                newTraces = newTraces.concat(t.splitBySharpCorners());
        }
        this.traces = newTraces;
    }

}

