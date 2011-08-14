function analytics_js () {
    var genChartData = function(data, dataPoint) {
        var result = new Array();
        var i;

        for (i = 0; i < data.length; i++) {
            result.push(dataPoint(data, i));
        }

        return(result);
    }

    var overTimeData = function(data, index) {
        return([ index, data[index] ]);
    };

    var pieData = function(data, index) {
        return({ data: data[index] });
    };

    var data = [ 3, 8, 5, 13, 8 ];

    var currentcharttype;
    var curplot;

    var setAreaData = function() {
        return([
            {
                lines: {
                    show: true,
                    fill: true,
                },
                data: genChartData(data, overTimeData),
            }
        ]);
    };
    var setBarData = function() {
        return([
            {
                bars: {
                    show: true,
                },
                data: genChartData(data, overTimeData),
            }
        ]);
    };
    var setPieData = function() {
        return(genChartData(data, pieData));
    };

    function setData(type) {
        var data;

        switch (type) {
        case 'area': data = setAreaData();
                     break;
        case 'bar': data = setBarData();
                    break;
        case 'pie': data = setPieData();
                    break;
        }

        return data;
    }

    function setOptions(type) {
        var options;

        switch (type) {
        case 'area': options = {
                        selection: {
                            mode: 'x',
                        },
                     };
                     break;
        case 'bar': options = {};
                    break;
        case 'pie': options = {
                        series: {
                            pie: {
                                show: true,
                            },
                        },
                        grid: {
                            hoverable: true,
                            clickable: true,
                        },
                    };
                    break;
        }

        return options;
    }

    function areaSelected(event, pos, obj)
    {
        alert('selected!');
    }

    function pieHover(event, pos, obj)
    {
        /*if (!obj)
                return;
        percent = parseFloat(obj.series.percent).toFixed(2);
        $("#hover").html('<span style="font-weight: bold; color: '+obj.series.color+'">'+obj.series.label+' ('+percent+'%)</span>');*/
    }

    function pieClick(event, pos, obj)
    {
            alert("click");
            /*if (!obj)
                return;
            percent = parseFloat(obj.series.percent).toFixed(2);
            alert(''+obj.series.label+': '+percent+'%');*/
    }

    function registerChartCallbacks(type, visualizationelement) {
        switch (type) {
        case 'area': visualizationelement.bind("plotselected", areaSelected);
                     break;
        case 'bar': break;
        case 'pie': visualizationelement.bind("plothover", pieHover);
                    visualizationelement.bind("plotclick", pieClick);
                    break;
        }
    }

    function dashboardChartTypeUpdate(chart, type) {
        var data = setData(type);
        var options = setOptions(type);

        currentcharttype = type;
        var visualizationelement = $('#flotvisualization');
        curplot = $.plot($(visualizationelement), data, options);

        registerChartCallbacks(type, visualizationelement);
    }

    currentcharttype = 'area';
    dashboardChartTypeUpdate(0, currentcharttype);

    var timeout;
    var timeoutCallback = function () {
        var randomnumber = Math.floor(Math.random() * 13);
        data.shift();
        data.push(randomnumber);
        curplot.setData(setData(currentcharttype));
        curplot.draw();
        timeout = setTimeout(timeoutCallback, 2000);
    };
    timeout = setTimeout(timeoutCallback, 2000);
    var paused = false;


    var genChartUpdate = function (type) {
        return function () { dashboardChartTypeUpdate(0, type); };
    };
    $('#btn_area').click(genChartUpdate('area'));
    $('#btn_bar').click(genChartUpdate('bar'));
    $('#btn_pie').click(genChartUpdate('pie'));

    var pausebtn = $('#btn_pause');
    pausebtn.click(function(obj) {
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
}
analytics_js();
