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

    this.tableelt = $('<table class="tablesorter" cellspacing="0" />');
    this.tablebodyelt = $('<tbody />');
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
    } else {
        this.reversesort = false;
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

pTable.prototype.renderTableBody = function () {
    var i, eltclass, tbody, tr, td;
    var obj = this;

    tbody = this.tablebodyelt;
    tbody.empty();

    for (i = 0; i < obj.data.length; i++) {
        eltclass = '';
        if (i % 2 == 0) {
            eltclass = 'alarm';
        }

        tr = $('<tr class="' + eltclass + '"/>');

        for (j = 0; j < obj.data[i].length; j++) {
            td = $('<td />');
            td.text(obj.data[i][j]);
            tr.append(td);
        }
        tbody.append(tr);
    }
    obj.tableelt.append(tbody);
};

pTable.prototype.render = function () {
    var i, j, eltclass, thead, tbody, tr, th, td, a;
    var obj = this;

    obj.tableelt.empty();

    thead = $('<thead />');

    tr = $('<tr />');
    for (i = 0; i < obj.columnnames.length; i++) {
        th = $('<th />');
        a = $('<a href="#" class="ptable_sorter" />');
        a.click((function(sortindex) {
            return function () {
                obj.sortBy(obj.columnnames[sortindex],
                           (obj.sortindex === sortindex) ? !obj.reversesort : false);
                obj.renderTableBody();
            }})(i));

        a.text(obj.columnnames[i]);
        th.append(a);
        tr.append(th);
    }
    thead.append(tr);
    obj.tableelt.append(thead);

    obj.renderTableBody();
    obj.tableelt.append(obj.tablebodyelt);
};

pTable.prototype.getTable = function () {
    return this.tableelt;
}

pTable.prototype.empty = function () {
    this.data = [];
};
