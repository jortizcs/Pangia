function pTable(columnnames, sort, reversesort)
{
    this.columnnames = undefined;
    this.data = [];
    this.numcolumns = 0;
    this.reversesort = false;
    this.sortindex = undefined;

    // Setup column heading names
    if (columnnames) {
        this.columnnames = columnnames;
        this.numcolumns = columnnames.length;
    }

    if (reversesort) {
        this.reversesort = true;
    }

    // Setup value to sort by
    this.sortBy(sort);
}

pTable.prototype.addRow = function (row) {
    if (row.length !== this.numcolumns) {
        return;
    }

    this.data.push(row);
};

pTable.prototype.sortBy = function (sort, reverse) {
    var i;

    if (sort) {
        this.sortindex = -1;
        for (i = 0; i < this.columnnames.length; i++) {
            if (this.columnnames[i] === sort) {
                this.sortindex = i;
                break;
            }
        }
    }

    if (reverse) {
        this.reversesort = true;
    }

    this.sort();
};

pTable.prototype.sort = function () {
    var list = this;

    if (this.sortindex < 0) {
        return;
    }

    this.data.sort(function (a, b) {
        var ret;

        if (a[list.sortindex] < b[list.sortindex]) {
            ret = -1;
        } else if (a[list.sortindex] === b[list.sortindex]) {
            ret = 0;
        } else {
            ret = 1;
        }

        if (list.reversesort) {
            ret = ret * -1;
        }

        return ret;
    });
};

pTable.prototype.render = function () {
    var i, j, eltclass, table, thead, tbody, tr, th, td;

    table = $('<table class="tablesorter" cellspacing="0" />');
    thead = $('<thead />');
    tbody = $('<tbody />');

    tr = $('<tr />');
    for (i = 0; i < this.columnnames.length; i++) {
        th = $('<th />');
        th.text(this.columnnames[i]);
        tr.append(th);
    }
    thead.append(tr);
    table.append(thead);

    for (i = 0; i < this.data.length; i++) {
        eltclass = '';
        if (i % 2 == 0) {
            eltclass = 'alarm';
        }

        tr = $('<tr class="' + eltclass + '"/>');

        for (j = 0; j < this.data[i].length; j++) {
            td = $('<td />');
            td.text(this.data[i][j]);
            tr.append(td);
        }
        tbody.append(tr);
    }
    table.append(tbody);

    return table;
};

pTable.prototype.empty = function () {
    this.data = [];
};
