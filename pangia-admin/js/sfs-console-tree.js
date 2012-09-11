(function () {

var fileGets = new Array();
var jsonTree=null;
var last_selected_nodeId = "";
var last_hovered_nodeId;
//var last_hovered_node;
var create_data = null;
//var sfs_host = document.getElementById("host_field_id").value;
//var sfs_port = document.getElementById("port_field_id").value;
var sfs_host = "";
var sfs_port = "8080";
/*var sfs_info_elt = parent.content.document.getElementById("sfs_host_info");
sfs_info_elt.innerHTML = sfs_host + ":" + sfs_port;*/
//used by body.php to set properties
var lastNodeGetResponse = null;

//set by body.php
var globalNodeType = "default";
var contexts = ["raw", "setprops", "create_subs", "queries", "graph"];

//callback functions
function resourceList(data){
    var dataStr = "{ \"data\":[" +  data + ']}';
    //jsonTree = eval('(' + dataStr + ')');
    jsonTree = JSON.parse(dataStr);
    loadTree();
}

function getResponse(data){

    //var dataJson = eval('(' + data + ')');
    var dataJson = JSON.parse(data);

    //set properties in body.php
    lastNodeGetResponse = dataJson;
    var props_display = parent.content.document.getElementById("props_display_id");
    var props_label = parent.content.document.getElementById("props_label_context");
    props_label.innerHTML = "<b>PATH:<br>" + last_selected_nodeId + "</b><br>"; 
    var props_edit = parent.content.document.getElementById("props_edit_id");
    var ow_button = parent.content.document.getElementById("overwrite_props_button");
    var up_button = parent.content.document.getElementById("update_props_button");
    try {
        props_edit.disabled = false;
        ow_button.style.visibility = 'visible';
        up_button.style.visibility = 'visible';
        props_display.value = FormatJSON(lastNodeGetResponse.properties);
    } catch(error){
        props_display.value = "none";
        props_edit.disabled = true;
        ow_button.style.visibility = 'hidden';
        up_button.style.visibility = 'hidden';
    }

    if(last_selected_nodeId == "/time/"){
        var now = dataJson.Now + (new Date()).getTimezoneOffset()*60;
        var thisDate = new Date();
        thisDate.setTime(now*1000);
        var dateString = thisDate.toUTCString();
        /*var d = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDay(), thisDate.getHours()-7, 
            thisDate.getMinutes(), thisDate.getSeconds(), thisDate.getMilliseconds());*/
        //alert(thisDate.toString());
        //alert(thisDate.getTimezoneOffset() + " in minutes");
    }

    //set standard output here
    var myFormattedString = FormatJSON(dataJson);
    var output_win = top.content.document.getElementById("output_id");
    output_win.value = myFormattedString;
    if(fileGets[last_selected_nodeId] == null)
        fileGets[last_selected_nodeId]=data;
}

function createNodeResp(data){
    //var dataJson = eval('(' + data + ')');
    var dataJson = JSON.parse(data);
    if(dataJson.status == "success"){
        //location.reload(true);
        var myFormattedString = FormatJSON(dataJson);
        var output_win = top.content.document.getElementById("output_id");
        output_win.value = myFormattedString;
    } else{
        alert("Problem creating node");
    }
}

//dom reference to viewer div
var viewerObj = $("#viewer");
//send request for loading nodes
var reqInput = new Object();
reqInput.method="get_all_resources";
reqInput.sfs_host = sfs_host;
reqInput.sfs_port = sfs_port;
jQuery.post("sfslib/php/sfs_marshaller.php",reqInput,resourceList);

var stagedlist = new Array();
var streamlist = new Array();
function loadTree() {
    console.log("load tree!");
    viewerObj.jstree({ 
        json_data : jsonTree,
        unique:{
            error_callback: function(n, p, f){
                alert("duplicate file names not allowed");
                $.jstree.rollback(data.rlbk);
                }
        },
        plugins : [ "themes", "json_data", "ui", "hotkeys", "unique","crrm", "cookies", "search", "types", "contextmenu"  ]

    });
    
    viewerObj.bind("select_node.jstree", 
        function (e, data) {
            var node  = data.rslt.obj;  
            var nodeId = data.rslt.obj.attr('id');
            var nodetype = data.rslt.obj.attr('type');
            
            //var nodeId = jQuery.data(data.rslt.obj[0], "jstree").id;
            //alert(nodeId);
            var date = new Date();
            var timestamp = date.getUTCFullYear() + "-" + date.getUTCMonth() + "-" + date.getUTCDay() + "T"
                        + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + "-" 
                        + date.getTimezoneOffset();
            var is4event_win = top.content.document.getElementById("sfs_reqlog_id");
            
            last_selected_nodeId = nodeId;
            if(fileGets[nodeId] == null || nodeId == "/time/" || nodetype == "stream"){
                is4event_win.value += timestamp + ": GET " + nodeId + "\n";
                if(nodetype == "stream"){
                    parent.content.document.getElementById("stage_streamlist").style.visibility='visible';
                    parent.content.document.getElementById("streamlist").style.visibility = 'visible';
                    parent.content.document.getElementById("staged_tag_id").style.visibility = 'visible';
                    parent.content.document.getElementById("streams_tag_id").style.visibility = 'visible';
                    if(typeof stagedlist[nodeId] == "undefined" &&
                        parent.content.selected_tab == "Plotter"){
                        var newStreamOption = document.createElement('option');
                        newStreamOption.text = nodeId;
                        stagedlist[nodeId]=true;
                        parent.content.document.getElementById("stage_streamlist").add(newStreamOption);
                    } else if(parent.content.selected_tab == "Create Subscription" && 
                        parent.content.selected_txtfield == "subsource")
                    {
                        var subsource_txtfield = parent.content.document.getElementById("subsource");
                        subsource_txtfield.value = nodeId;
                    } else if(parent.content.selected_tab == "Create symlink" && 
                        parent.content.selected_txtfield == "symlink_target"){
                        var symlink_target_txtfield = parent.content.document.getElementById("symlink_target");
                        symlink_target_txtfield.value = nodeId;
                    }

                } else if(parent.content.selected_tab == "Create symlink"){
                    if(parent.content.selected_txtfield == "symlink_parent"){
                        var symlink_parent_txtfield = parent.content.document.getElementById("symlink_parent");
                        symlink_parent_txtfield.value = nodeId;
                    } else if(parent.content.selected_txtfield == "symlink_target"){
                        var symlink_target_txtfield = parent.content.document.getElementById("symlink_target");
                        symlink_target_txtfield.value = nodeId;
                    }
                }

                reqInput = new Object();
                reqInput.method = "get_path";
                reqInput.path=nodeId;
                reqInput.sfs_host = sfs_host;
                reqInput.sfs_port = sfs_port;
                jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, getResponse)
            } else {
                is4event_win.value += timestamp + ": GET (Cache) " + nodeId + "\n";
                getResponse(fileGets[nodeId]);

                if(parent.content.selected_tab == "Create symlink"){
                    if(parent.content.selected_txtfield == "symlink_parent"){
                        var symlink_parent_txtfield = parent.content.document.getElementById("symlink_parent");
                        symlink_parent_txtfield.value = nodeId;
                    } else if(parent.content.selected_txtfield == "symlink_target"){
                        var symlink_target_txtfield = parent.content.document.getElementById("symlink_target");
                        symlink_target_txtfield.value = nodeId;
                    }
                }

            }
            is4event_win.scrollTop = is4event_win.scrollHeight;
        }
    );

    viewerObj.bind("remove.jstree", 
        function(e, data) {
            fileGets = new Array();
            var date = new Date();
            var timestamp = date.getUTCFullYear() + "-" + date.getUTCMonth() + "-" + date.getUTCDay() + "T"
                        + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + "-" 
                        + date.getTimezoneOffset();
            var is4event_win = top.content.document.getElementById("sfs_reqlog_id");
            var reqInput = new Object();
            reqInput.method = "delete";
            reqInput.path = last_hovered_nodeId;
            reqInput.sfs_host = sfs_host;
            reqInput.sfs_port = sfs_port;
            is4event_win.value += timestamp + ": DELETE " + last_hovered_nodeId + "\n";
            jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, 
                function(d){
                    //var dataJson = eval('(' + d + ')');
                    //var dataJson2 = eval('(' + dataJson + ')');
                    var dataJson2 = JSON.parse(d);
                    dataJson2 = JSON.parse(dataJson2);
                    var myFormattedString = FormatJSON(dataJson2);
                    var output_win = top.content.document.getElementById("output_id");
                    if(dataJson2.status != "success"){
                        $.jstree.rollback(data.rlbk);
                    }
                    output_win.value = myFormattedString;
                }
            );
        }
    );


    viewerObj.bind("rename.jstree", 
        function(e, data){
            fileGets = new Array();
            $.jstree.rollback(data.rlbk);
        }
    );

    viewerObj.bind("create.jstree",
        function(e, data) {
            //parent.content.$('#dialog-div').dialog('open');
            var nodeId = data.rslt.parent.attr('id');
            //var nodetype = data.rslt.parent.attr('type');
            data.rslt.obj.attr('id', nodeId + data.rslt.name + "/");
            data.rslt.obj.attr('type', globalNodeType);
            var metadata = new Object();
            metadata.id = nodeId + data.rslt.name + "/";
            metadata.type = globalNodeType;
            data.rslt.obj.data("jstree", metadata);
            
            var reqInput = new Object();
            reqInput.method = "create";
            //reqInput.path = last_hovered_nodeId;
            reqInput.path = nodeId;
            reqInput.sfs_host = sfs_host;
            reqInput.sfs_port = sfs_port;
            reqInput.rname= data.rslt.name;
            if(globalNodeType == "stream"){
                reqInput.ntype = "genpub";
            } else {
                reqInput.ntype = "default";
            }
            if(data.rslt.name.indexOf(" ")>0 || data.rslt.name.indexOf("/")>0 || data.rslt.name.indexOf("\\")>0){
                $.jstree.rollback(data.rlbk);
                alert("No spaces!\nname=" + data.rslt.name);
            } else {
                //$.jstree.rollback(data.rlbk);
                var date = new Date();
                var timestamp = date.getUTCFullYear() + "-" + date.getUTCMonth() + "-" + date.getUTCDay() + "T"
                        + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds() + "-" 
                        + date.getTimezoneOffset();
                var is4event_win = top.content.document.getElementById("sfs_reqlog_id");
                jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, createNodeResp);
                is4event_win.value += timestamp + ": POST " + nodeId + "\n";
                fileGets = new Array();
            }
        }
    );

    viewerObj.bind("hover_node.jstree",
        function(e, data){
            //if (typeof jQuery.data(data.rslt.obj[0], "jstree") != "undefined"){
            //last_hovered_node = jQuery.data(data.rslt.obj[0], "jstree");
            last_hovered_nodeId = data.rslt.obj.attr('id');
            //last_hovered_nodeId = jQuery.data(data.rslt.obj[0], "jstree").id;
            //}
        }
    );
}

console.log("loading tree...");
})();
