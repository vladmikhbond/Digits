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

