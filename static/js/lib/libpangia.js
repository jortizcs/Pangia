/*
 * Load any required libraries or plugins.
 *
 * Add JavaScript files that should be loaded to the to_load array. Note that
 * order does matter. Each entry is a tuple of the form:
 *      [ file name, is synchronous? ]
 */
(function () {
    var static_base = $('#pangia_static_base').attr('data-base');
    var to_load = [
        [ 'js/lib/jquery.dataTables.js', true ],
        [ 'js/lib/dataTables.plugins.js', true ]
    ];
    var file;

    for (file in to_load) { 
        if (to_load[file][1]) {
            $.ajaxSetup({async: false});
        }
        $.getScript(static_base + to_load[file][0]);
        $.ajaxSetup({async: true});
    }
})();

/*
 * options:
 *      columnnames:
 *          An array of the column names in the table.
 *      descedingsort:
 *          Boolean value specifying whether that the columns should be sorted
 *          from highest to lowest value initially.
 *      rowselect:
 *          A function callback when a row is selected. If left unspecified,
 *          the table will not support row selection.
 *      sortby:
 *          The column name to initially sort by.
 *      actions:
 *          A list of actions that should be specified for each row. Each item
 *          of the list should consist of an object of the form:
 *              {
 *                  class_name: A string that is the class that should be
 *                              assigned to the span for the action.
 *                  action: A function that is callback for when that action is
 *                          clicked.
 *              }
 */
function pTable(options)
{
    var widget = this;

    widget.columnnames = undefined;
    widget.data = [];
    widget.numcolumns = 0;
    widget.sortindex = undefined;
    widget.rowselect = undefined;
    widget.columnoptions = [];
    widget.actions = undefined;

    // Setup column heading names
    widget.columnnames = options.columnnames;
    widget.numcolumns = options.columnnames.length;

    widget.tablecontainer = $('<div />');
    widget.tableelt = $('<table class="tablesorter" cellspacing="0" />');
    widget.tablebodyelt = $('<tbody />');

    widget.tablecontainer.append(widget.tableelt);

    // Setup defualt value to sort by
    widget.sorting = [[widget.sortIndex(options.sortby), options.descendingsort ? 'desc' : 'asc' ]];

    if (options.rowselect) {
        widget.rowselect = options.rowselect;
        widget.tablebodyelt.click(function (event) {
            var rowelt;

            $(widget.tableelt.fnSettings().aoData).each(function (){
                $(this.nTr).removeClass('row_selected');
            });
            rowelt = $(event.target.parentNode);
            rowelt.addClass('row_selected');
            widget.rowselect(rowelt[0].rowIndex);
        });
    }

    // If there are sections, set them up.
    if (options.actions) {
        widget.actions = options.actions;

        widget.columnoptions.push({
            'aTargets': [ widget.numcolumns ],
            // The actions should be the last column
            'bSortable': false,
            'sClass': 'pTable_action_col'
        });
    }

    widget.render();
}

pTable.prototype.addRows = function (rows) {
    var widget = this;
    var i;

    for (i = 0; i < rows.length; i++) {
        if (rows[i].length !== this.numcolumns) {
            return;
        }

        // Add the extra action column, if we need one
        if (widget.actions) {
            rows[i].push('');
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
    var widget = this;
    var i, sorting, sortdirection;

    i = widget.sortIndex(sort);

    sortdirection = descendingsort ? 'desc' : 'asc';
    widget.sorting = [[i, sortdirection]];

    widget.tableelt.dataTable().fnSort(widget.sorting);
};

pTable.prototype.render = function () {
    var widget = this;
    var i, j, thead, tbody, tr, th, td, a, actionelts;

    thead = $('<thead />');

    tr = $('<tr />');
    for (i = 0; i < widget.numcolumns; i++) {
        th = $('<th />');
        a = $('<a href="#" class="ptable_sorter" />');

        a.text(widget.columnnames[i]);
        th.append(a);
        tr.append(th);
    }
    // Create the extra action column, if there is one.
    if (widget.actions) {
        tr.append($('<th />'));
    }
    thead.append(tr);
    widget.tableelt.append(thead);

    widget.tableelt.append(widget.tablebodyelt);

    widget.tableelt.dataTable({
        'aaSorting': widget.sorting,
        'aoColumnDefs': widget.columnoptions,
        'bPaginate': true,
        'bLengthChange': false,
        'fnRowCallback': function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var row = $(nRow);
            var action, action_col, action_elt;
            // If there are widgets, setup the classes for those icons now.
            if (widget.actions) {
                action_col = row.children('.pTable_action_col');
                // Clear out any old actions in the column
                action_col.empty();
                for (action in widget.actions) {
                    action_elt = $('<span class="' + widget.actions[action].class_name + '" />');
                    // Call the actions callback with the index of current row
                    action_elt.click(function () {
                        widget.actions[action].action(iDisplayIndexFull);
                    });
                    action_col.append(action_elt);
                }
            }
            return nRow;
        },
        'iDisplayLength': 5,
        'sPaginationType': 'full_numbers',
    });
};

pTable.prototype.getTable = function () {
    return this.tablecontainer;
}

/*
 * Indexes start at 1, as per the rowIndex field of elements.
 */
pTable.prototype.getRowValues = function (index) {
    var widget = this;

    return widget.data[index - 1]
}

pTable.prototype.empty = function () {
    var widget = this;

    widget.data = [];
    widget.tableelt.dataTable().fnClearTable();
};

/*
 * Selects the page of the chosen row, and highlights the appropriate row on
 * that page. If the simulate option is set to true, calls the "rowselect"
 * callback. Otherwise, only selects the row but does not make the callback.
 */
pTable.prototype.selectRow = function (index, simulate) {
    var widget = this;
    var node, rowelt;

    node = widget.tableelt.fnGetNodes()[index];
    widget.tableelt.fnDisplayRow(node);

    $(widget.tableelt.fnSettings().aoData).each(function (){
        $(this.nTr).removeClass('row_selected');
    });
    rowelt = $(node);
    rowelt.addClass('row_selected');

    if (simulate) {
        widget.rowselect(rowelt[0].rowIndex);
    }
}

pTable.prototype.searchRow = function (needle) {
    var widget = this;

    return widget.tableelt.fnFindCellRowIndexes(needle);
}
