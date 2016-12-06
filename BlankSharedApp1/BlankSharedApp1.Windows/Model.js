function Model() {
    this.traces = [];

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
        var newTraces = [];

        for (var i in this.traces) {
            newTraces = newTraces.concat(this.traces[i].splitByCircle());
        }
        this.traces = newTraces;

        for (var i in this.traces) {
            newTraces = newTraces.concat(this.traces[i].splitBySharpCorners());
        }
        this.traces = newTraces;
    }

}

