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
        var tr = [];
        for (var i in this.traces) {
            tr = tr.concat(this.traces[i].splitBySharpCorners());
        }
        this.traces = tr;
    }

}

