// Prepare a digit on the whole
//
function Scetch() {
    
    this.width = canvas.width;
    this.height = canvas.height;
    this.traces = [];
    this.elements = [];

    this.process = function () {
        this.eliminateExtraPoints();
        this.splitTracesByCorners();
        this.separateLoops();
        this.removeShorts();
        this.splitTracesByInflactions();
        this.removeShorts();
        this.scale();
        this.defineElements();
    }

    // Определяет элементы
    //
    this.defineElements = function () {
        this.elements = [];
        for (var i in this.traces) {
            var el = this.traces[i].getElement();
            this.elements.push(el);
        }
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

    // Отделяет петли
    //
    this.separateLoops = function () {
        // 
        var newTraces = [];
        for (var i in this.traces) {
            var splitted = this.traces[i].splitByCircle();
            newTraces = newTraces.concat(splitted);
        }
        this.traces = newTraces;
    }

    // Разбивает каждую трассу на несколько трасс по острым углам
    //
    this.splitTracesByCorners = function () {
        var newTraces = [];
        for (var i in this.traces) {
            var t = this.traces[i];
            if (t.isLoop())
                newTraces.push(t);
            else
                newTraces = newTraces.concat(t.splitBySharpCorners());
        }
        this.traces = newTraces;
    }

    // Разбивает каждую трассу на несколько трасс по точуам перегиба
    //
    this.splitTracesByInflactions = function () {
        var newTraces = [];
        for (var i in this.traces) {
            var t = this.traces[i];
            if (t.isLoop())
                newTraces.push(t);
            else
                newTraces = newTraces.concat(t.splitByInflectionPoints());
        }
        this.traces = newTraces;
    }

}

