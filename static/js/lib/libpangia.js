function pTable(columnnames, sort, ascendingsort)
{
    var widget = this;

    widget.columnnames = undefined;
    widget.data = [];
    widget.numcolumns = 0;
    widget.ascendingsort = false;
    widget.sortindex = undefined;

    // Setup column heading names
    if (columnnames) {
        widget.columnnames = columnnames;
        widget.numcolumns = columnnames.length;
    }

    if (ascendingsort) {
        widget.ascendingsort = true;
    }

    widget.tableelt = $('<table class="tablesorter" cellspacing="0" />');
    widget.tablebodyelt = $('<tbody />');

    // Setup defualt value to sort by
    widget.sorting = [[widget.sortIndex(sort), 0]];
}

pTable.prototype.addRow = function (row) {
    if (row.length !== this.numcolumns) {
        return;
    }

    this.data.push(row);
};

pTable.prototype.sortIndex = function (sort) {
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

    return i;
}

pTable.prototype.sortBy = function (sort, ascending) {
    var i, sorting, sortdirection;

    i = this.sortIndex(sort);

    if (ascending) {
        this.ascendingsort = true;
    } else {
        this.ascendingsort = false;
    }

    sortdirection = this.ascendingsort ? 1 : 0;
    this.sorting = [[i, sortdirection]];

    //this.tableelt.trigger('sorton', [3, 0]);
    this.tableelt.trigger('sorton', [this.sorting]);
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

        tr = $('<tr class="' + eltclass + '" />');

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
    var i, j, thead, tbody, tr, th, td, a;
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
                           (obj.sortindex === sortindex) ? !obj.ascendingsort : false);
            }})(i));

        a.text(obj.columnnames[i]);
        th.append(a);
        tr.append(th);
    }
    thead.append(tr);
    obj.tableelt.append(thead);

    obj.renderTableBody();
    obj.tableelt.append(obj.tablebodyelt);
    obj.tableelt.tablesorter({
        sortList: obj.sorting,
        widgets: [ 'zebra' ],
        widgetZebra: { css: [ '', 'alarm' ] }

    });
};

pTable.prototype.getTable = function () {
    return this.tableelt;
}

pTable.prototype.empty = function () {
    this.data = [];
};
