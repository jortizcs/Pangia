        // we use an inline data source in the example, usually data would
        // be fetched from a server
        var data = [];
        var alldata = new Object();

        // setup plot
        var options = {
            series: { shadowSize: 0 }, // drawing is faster without shadows
            yaxis: { min: 0, max: 1000 },
            label: "Total Plug Loads Power Draw",
            xaxis: { show: true },
            xaxis: {
                mode: "time",
                timeformat: "%H:%M:%S %P"
            },
            series:{
                lines:{show:true},
                points:{show:true}
            },
            legend:{
                show:true,
                position:"nw"
            }
        };

        function replot(datapt){
            var max_value=0;
            try {
                if(typeof datapt !="undefined" && typeof datapt.is4_uri != "undefined" && typeof alldata[datapt.is4_uri] =="undefined"){
                    alldata[datapt.is4_uri]=new Array();
                }
                
                alldata[datapt.is4_uri].push(datapt);
                if(datapt.is4_uri.indexOf("true_power")>0 || datapt.is4_uri.indexOf("slope")>0){
                    var len = alldata[datapt.is4_uri].length;
                    var timediff = alldata[datapt.is4_uri][len-1].ts-alldata[datapt.is4_uri][0].ts;
                    while(timediff>1800000){ //30 min window
                        alldata[datapt.is4_uri]= alldata[datapt.is4_uri].slice(1);
                        len = alldata[datapt.is4_uri].length;
                        timediff = alldata[datapt.is4_uri][len-1].ts-alldata[datapt.is4_uri][0].ts;
                    }
                } else {
                    return;
                }
                var res = [];
                var keys = Object.keys(alldata);
                for (var idx=0; idx<keys.length; ++idx){
                    var label = keys[idx];
                    var data = alldata[label];
                    var moddata = [];
                    for (var i = 0; i < data.length; ++i){
                        if(label.indexOf("slope")>0 && typeof data[i].ts !="undefined" && typeof data[i].value != "undefined"){
                            data[i].ts = Math.floor(data[i].ts/1000)*1000;
                        }
                        moddata.push([data[i].ts-25200000, data[i].value/1000]);
                        if(data[i].value/1000 >max_value)
                            max_value = data[i].value/1000;
                    }
                    res.push({"label":label, "data":moddata});
                }
                options.yaxis.max=max_value+3*max_value;
                var plot = $.plot($("#placeholder"), res, options);
            } catch(e){
                alert(e);
            }
        }

        var socket = io.connect('http://is4server.com:3000');

        socket.on('msg', function(dataStr) {
            try {
                var data = JSON.parse(dataStr);
                if(data.is4_uri.indexOf("true_power")>0 || data.is4_uri.indexOf("slope")>0 && typeof data.stat == "undefined"){
                    replot(data);
                    appendMsg(data);
                } else if(typeof dataStr == "undefined" || typeof data == "undefined" || typeof data.is4_uri == "undefined"){
                    alert(dataStr);
                    alert(data);
                }
            }
            catch(e){
                alert(dataStr + "\n" + JSON.stringify(e));
            }
        });

        socket.on('init', function(data) {
            var messages = JSON.parse(data)
            for (i in messages)
                appendMsg(messages[i])
        });

        function appendMsg(msg) {
            $('#msgs pre').append(function() {
                var div = $('<div>');
                div.html('ts=' + new Date(msg.ts) + ', val=' + msg.value + ', path=' + msg.is4_uri);
                if(typeof msg.is4_uri == "undefined")
                    alert("UNDEFINED_ERROR::" + JSON.stringify(msg));
                return div;
            });
            $('#msgs pre')[0].scrollTop = $('#msgs pre')[0].scrollHeight;
        }

        function sendMsg() {
            var msg = {};
            $.each($('#chat').serializeArray(), function(i,v) {
                msg[v.name] = v.value;
            });
            $("#msgs pre").val("");
            appendMsg(msg);
            socket.emit('msg', JSON.stringify(msg));
        }