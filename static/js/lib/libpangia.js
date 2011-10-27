function pTable(columnnames, sort, descendingsort)
{
    var widget = this;

    widget.columnnames = undefined;
    widget.data = [];
    widget.numcolumns = 0;
    widget.descendingsort = false;
    widget.sortindex = undefined;

    // Setup column heading names
    if (columnnames) {
        widget.columnnames = columnnames;
        widget.numcolumns = columnnames.length;
    }

    if (descendingsort) {
        widget.descendingsort = true;
    }

    widget.tablecontainer = $('<div />');
    widget.tableelt = $('<table class="tablesorter" cellspacing="0" />');
    widget.tablebodyelt = $('<tbody />');

    widget.tablecontainer.append(widget.tableelt);

    // Setup defualt value to sort by
    widget.sorting = [[widget.sortIndex(sort), widget.descendingsort ? 'desc' : 'asc' ]];
    widget.render();
}

pTable.prototype.addRows = function (rows) {
    var i;

    for (i = 0; i < rows.length; i++) {
        if (rows[i].length !== this.numcolumns) {
            return;
        }

        this.data.push(rows[i]);
    }

    this.tableelt.dataTable().fnAddData(rows);
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

pTable.prototype.sortBy = function (sort, descendingsort) {
    var i, sorting, sortdirection;

    i = this.sortIndex(sort);

    if (descending) {
        this.descendingsort = true;
    } else {
        this.descendingsort = false;
    }

    sortdirection = this.descendingsort ? 'desc' : 'asc';
    this.sorting = [[i, sortdirection]];

    this.tableelt.dataTable().fnSort(this.sorting);
};

pTable.prototype.render = function () {
    var i, j, thead, tbody, tr, th, td, a;
    var obj = this;

    thead = $('<thead />');

    tr = $('<tr />');
    for (i = 0; i < obj.columnnames.length; i++) {
        th = $('<th />');
        a = $('<a href="#" class="ptable_sorter" />');
        a.click((function(sortindex) {
            return function () {
                obj.sortBy(obj.columnnames[sortindex],
                           (obj.sortindex === sortindex) ? !obj.descendingsort : false);
            }})(i));

        a.text(obj.columnnames[i]);
        th.append(a);
        tr.append(th);
    }
    thead.append(tr);
    obj.tableelt.append(thead);

    obj.tableelt.append(obj.tablebodyelt);

    obj.tableelt.dataTable({
        'aaSorting': obj.sorting,
        'bPaginate': true,
        'bLengthChange': false,
        'iDisplayLength': 5,
        'sPaginationType': 'full_numbers'
    });
};

pTable.prototype.getTable = function () {
    return this.tablecontainer;
}

pTable.prototype.empty = function () {
    this.data = [];
    this.tableelt.dataTable().fnClearTable();
};
