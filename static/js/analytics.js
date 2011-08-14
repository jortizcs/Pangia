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
        switch (type) {
        case 'area': return(setAreaData());
        case 'bar': return(setBarData());
        case 'pie': return(setPieData());
        }
    }

    function dashboardChartTypeUpdate(chart, type) {
        var options = new Object();
        var data = setData(type);

        if (type === 'pie') {
            options.series = {
                  pie: {
                    show: true,
                    }
            };
            options.grid = {
                hoverable:true,
                clickable:true
            };
        }
        currentcharttype = type;

        curplot = $.plot($("#flotvisualization"), data, options);
        if (type == 'pie'){
            $("#flotvisualization").bind("plothover", pieHover);
            $("#flotvisualization").bind("plotclick", pieClick);
        }
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


    var genChartUpdate = function (type) {
        return function () { dashboardChartTypeUpdate(0, type); };
    };
    $('#btn_area').click(genChartUpdate('area'));
    $('#btn_bar').click(genChartUpdate('bar'));
    $('#btn_pie').click(genChartUpdate('pie'));
}
analytics_js();
