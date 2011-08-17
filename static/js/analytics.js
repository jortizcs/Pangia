var ANALYTICS = (function () {
    'use strict';
    var currentcharttype,
        curplot,
        data = [ 3, 8, 5, 13, 8, 2, 2, 9, 10, 1, 2, 5 ],
        paused = false,
        pausebtn,
        timeout;

    function genChartData(data, dataPoint) {
        var result = [], i;

        for (i = 0; i < data.length; i = i + 1) {
            result.push(dataPoint(data, i));
        }

        return (result);
    }

    function overTimeData(data, index) {
        return ([ index, data[index] ]);
    }

    function pieData(data, index) {
        return ({ data: data[index] });
    }

    function setAreaData() {
        return ([
            {
                lines: {
                    show: true,
                    fill: true
                },
                data: genChartData(data, overTimeData)

            }
        ]);
    }

    function setBarData() {
        return ([
            {
                bars: {
                    show: true
                },
                data: genChartData(data, overTimeData)
            }
        ]);
    }

    function setPieData() {
        return (genChartData(data, pieData));
    }

    function setData(type) {
        var data;

        switch (type) {
        case 'area':
            data = setAreaData();
            break;
        case 'bar':
            data = setBarData();
            break;
        case 'pie':
            data = setPieData();
            break;
        }

        return data;
    }

    function setOptions(type) {
        var options;

        switch (type) {
        case 'area':
            options = {
                selection: {
                    mode: 'x'
                }
            };
            break;
        case 'bar':
            options = {};
            break;
        case 'pie':
            options = {
                series: {
                    pie: {
                        show: true
                    }
                },
                grid: {
                    hoverable: true,
                    clickable: true
                }
            };
            break;
        }

        return options;
    }

    function areaSelected(event, ranges) {
        alert(ranges.xaxis.from + " : " + ranges.xaxis.to);
    }

    function pieHover(event, pos, obj) {
        /*if (!obj)
                return;
        percent = parseFloat(obj.series.percent).toFixed(2);
        $("#hover").html('<span style="font-weight: bold; color: '+obj.series.color+'">'+obj.series.label+' ('+percent+'%)</span>');*/
    }

    function pieClick(event, pos, obj) {
        alert("click");
        /*if (!obj)
            return;
        percent = parseFloat(obj.series.percent).toFixed(2);
        alert(''+obj.series.label+': '+percent+'%');*/
    }

    function registerChartCallbacks(type, visualizationelement) {
        switch (type) {
        case 'area':
            visualizationelement.bind("plotselected", areaSelected);
            break;
        case 'bar':
            break;
        case 'pie':
            visualizationelement.bind("plothover", pieHover);
            visualizationelement.bind("plotclick", pieClick);
            break;
        }
    }

    function dashboardChartTypeUpdate(chart, type) {
        var data = setData(type),
            options = setOptions(type),
            visualizationelement = $('#flotvisualization');

        currentcharttype = type;
        curplot = $.plot(visualizationelement, data, options);

        registerChartCallbacks(type, visualizationelement);
    }

    currentcharttype = 'area';
    dashboardChartTypeUpdate(0, currentcharttype);

    function timeoutCallback() {
        var randomnumber = Math.floor(Math.random() * 13);
        data.shift();
        data.push(randomnumber);
        curplot.setData(setData(currentcharttype));
        curplot.draw();
        timeout = setTimeout(timeoutCallback, 2000);
    }

    timeout = setTimeout(timeoutCallback, 2000);


    function genChartUpdate(type) {
        return function () { dashboardChartTypeUpdate(0, type); };
    }

    $('#btn_area').click(genChartUpdate('area'));
    $('#btn_bar').click(genChartUpdate('bar'));
    $('#btn_pie').click(genChartUpdate('pie'));

    pausebtn = $('#btn_pause');
    pausebtn.click(function (obj) {
        if (!paused) {
            clearTimeout(timeout);
            pausebtn.addClass('btn_pause');
            pausebtn.removeClass('btn_play');
            paused = true;
        } else {
            timeout = setTimeout(timeoutCallback, 2000);
            pausebtn.addClass('btn_play');
            pausebtn.removeClass('btn_pause');
            paused = false;
        }
    });
}());
