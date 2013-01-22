/* Author: Michael Heinrich */
/* ===== extending jQuery to include PUT and DELETE ====== */ 
function _ajax_request(url, data, callback, method) {
    if (jQuery.isFunction(data)) {
        callback = data;
        data = {};
    }
    return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback
        });
}

jQuery.extend({
    put: function(url, data, callback) {
        return _ajax_request(url, data, callback, 'PUT');
    },
    delete_: function(url, data, callback) {
        return _ajax_request(url, data, callback, 'DELETE');
    }
});
/* ===== Anything Files page related is below ====== */ 
function createBulkFile(host){
	var textarea = document.getElementById("fileCreate").value;
	
	if(textarea.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = '8080';
		reqInput.method = "create_bulk_file";
		reqInput.json = '{"operation":"create_resources","list":[' 
		+ JSONtext
		+ ']}';
		jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				alert('Files were created!');
			} else {
				alert("Could not create files:" + dataJson);
			}
		});
	} else {
		alert('Please enter some values');
	}
}
function createSymlink(host){
	var parent_ = document.getElementById("addSymSource").value;
	var target_ = document.getElementById("addSymTarget").value;
	var name = document.getElementById("addSymLink").value;
	if(parent_.length>0 && target_.length>0 && name.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = '8080';
		reqInput.method = "create_symlink";
		reqInput.path = parent_;
		reqInput.target = target_;
		reqInput.linkname = name;
		jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				alert('Symlink created');
			} else {
				alert("Could not create symlink" + dataJson);
			}
		});
	}
}
/* ===== Anything subscription page related is below ====== */ 
function getSub (host,path) {
	if (host == 'default'){
		host = 'energylens.sfsprod.is4server.com'; 
	};
	
	if(host.length>0 && path.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = "8080";
		reqInput.path = path;
		reqInput.method = "get_path";
		jQuery.get("sfslib/php/sfs_marshaller.php", reqInput, function (data) {
			if ((path == 'sub') || 'sub/' || 'sub/*' || 'sub*'){
	     		var obj = JSON.parse(data);
	     		tableSub(host, obj);
	     } else {
	     	return obj;
	     }
	   });
	}
}
function tableSub(host, obj) {
      $.each(obj['/sub/'].children, function() {
	      if(this == "all"){
	      	//skip all response
	      } else {
	      var sub_child = obj['/sub/' + this + '/'];
	      var edit ='onclick="editSub(\'' + sub_child.sourcePath + '\',\'' + sub_child.destination + '\')"';
	      var subJSON = JSON.stringify(sub_child,null,4);
	      var popover_data = '<button class="close" style="margin-top:-40px" onclick="$(\'#'+this+'\').popover(\'hide\')">&times;</button>' + subJSON + 
		      '<br><hr><a class="btn"' + edit + '><i class="icon-edit"></i> View</a>' + 
		      ' <a class="btn"' + 'onclick="deleteSub(\'' + host + '\',\'' + this + '\' )"' + '><i class="icon-trash"></i> Delete</a>';
	      var output = '<tr>' + '<td><a style="width:200px;cursor:pointer;" rel="popover" id="'+this+'" title="Subscription ID: ' + this + '">' + this + '</a></td>' + '</tr>';
	      
	      //append the subscription ids to #JSONtable
	      $('#JSONtable tbody').append(output);
	      //append popover element with streamfs output and edit and delete buttons
	      $('[rel=popover]').popover({trigger: 'click', content: popover_data, })
	      };
      });
};
function createSub(host){
	var parent_ = document.getElementById("addSubSource").value;
	var target_ = document.getElementById("addSubTarget").value;
	//alert(parent_ + target_);
	
	if(parent_.length>0 && target_.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = "8080";
		reqInput.method = "create_sub";
		reqInput.path = parent_;
		reqInput.target = target_;
		jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				alert("Subscription created!");
				location.reload();
				//parent.reload();
				//var alert = '<div class="alert fade in"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>it worked</strong>        </div>';
				//alert('it worked dude');
				//$('body').append(alert);
			} else {
				alert("Could not create subscription: " + dataJson);
			}
		});
	}
};
function editSub(source,destination){
	//hide the popover
	$('[rel=popover]').popover('hide');
	
	//Making Edit Subscription Frontend Bootstrap elements active
	$('li.add').removeClass('active');
	$('div.add').removeClass('active');
	$('li.edit').addClass('active');
	$('li.edit').removeClass('disabled');
	$('div.edit').addClass('active');
	
	//Adding values in StreamFS for particular subscription to the Frontend fields
	var parent_ = source;
	var target_ = destination;
	document.getElementById("editSubSource").value = parent_;
	document.getElementById("editSubTarget").value = target_;	
};
function deleteSub(host, id){
	// if (type == 'modal') {
		// $('[rel=popover]').popover('hide');
		// $('#deleteModal').modal();
		// $('#deleteModal .modal-body p').replaceWith('<p>Delete the Subscription ID <strong>' + body + '</strong>?');
	var r=confirm("Delete the subscription ID: " + id + "?");
	if (r==true) {
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = "8080";
		reqInput.method = "delete_sub";
		jQuery.delete_("sfslib/php/sfs_marshaller.php", reqInput, function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				location.reload(true);
			}
		});
	}
}
/* ===== Processing elements related page code  ====== */
function getProc (host, path, flag) {
	if (host == 'default'){
		host = 'energylens.sfsprod.is4server.com'; 
	};
	
	if(host.length>0 && path.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = "8080";
		reqInput.path = path;
		reqInput.method = "get_path";
		jQuery.get("sfslib/php/sfs_marshaller.php", reqInput, function (data) {
			if (flag == 'table') {
	     		var obj = JSON.parse(data);
	     		tableProc(host, obj);
	     } else {
	     	var obj = JSON.parse(data);
	     	editProc(obj, flag);
	     }
	   });
	}
	// var editorAdd = CodeMirror.fromTextArea(document.getElementById("addProc"), {
	    	// lineNumbers: true,
	    	// mode: "javascript"
	// });
}
function createProc(host) {
	var name="", winsize="", timeout="", materialize="", script="";
	name = document.getElementById("procName").value ;
	winsize = document.getElementById("procWin").value;
	timeout = document.getElementById("procTime").value;
	materialize = document.getElementById("procMaterialize").value;
	script = editor.getValue()
	alert(script.charAt(script.length - 1));
	if (script.charAt(script.length - 1) == ";"){ 
		formatedScript = script.substring(script.indexOf("function"), script.length - 1); 
		} else { 
		formatedScript = script.substring(script.indexOf("function"), script.length);
	};
	
	//if(name.length>0 && script.length>0 && timeout.length>0 && winsize.length>0){
		var reqInput = {
			sfs_host : host,
			sfs_port : "8080",
			method: "create_proc",
			operation : "save_proc",
			name : name,
			script: {
				winsize : winsize,
				timeout : timeout,
				materialize : materialize,
				func : formatedScript
			}
		};
		jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				alert("Processing Element created!");
				location.reload(true);
				//parent.reload();
				//var alert = '<div class="alert fade in"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>it worked</strong>        </div>';
				//alert('it worked dude');
				//$('body').append(alert);
			} else {
				alert("Could not create Processing Element: " + JSON.stringify(dataJson, null, 4));
			}
		});
	// } else {
		// alert("Please input all fields");
	// }
}
function deleteProc(host, name){
		/*$('[rel=popover]').popover('hide');
		$('#deleteModal').modal();
		$('#deleteModal .modal-body p').replaceWith('<p>Delete the Processing ID <strong>' + body + '</strong>?');*/
	var r=confirm("Delete the processing ID: " + name + "?");
	if (r==true) {
		var reqInput = {
			sfs_host : host,
			sfs_port : "8080",
			method: "delete_proc",
			name: name,
		};
		$.ajax({
		   type: "DELETE",
		   url: "sfslib/php/sfs_marshaller.php",
		   data: reqInput,
		   cache: false,
		   success: function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				//alert("Processing Element deleted!");
				location.reload(true);
				//var alert = '<div class="alert fade in"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>it worked</strong>        </div>';
				//$('body').append(alert);
			} else {
				alert("Could not delete Processing Element: " + JSON.stringify(dataJson, null, 4));
			}
	  	}
	 	});
	}
}
function editProc(obj, flag) { 
	$('[rel=popover]').popover('hide');
	
	$('li.add').removeClass('active');
	$('div.add').removeClass('active');
	$('li.edit').addClass('active');
	$('li.edit').removeClass('disabled');
	$('div.edit').addClass('active');
	
	if (flag=="code") {
		document.getElementById("procNameEdit").value = obj.properties.name;
		document.getElementById("procWinEdit").value = obj.properties.script.winsize;
		document.getElementById("procTimeEdit").value = obj.properties.script.timeout;
		document.getElementById("procMaterializeEdit").value = obj.properties.script.materialize; 
		
		var procJSON = JSON.stringify(obj.properties.script.func);
		//remove the outside "" so that code beautification works
		var temp = procJSON.substring(1,procJSON.length -1);
		//call beautify library
		var prettyCode = "var func = \r\n" + js_beautify(temp) +";";
		//instantiate CodeMirror editor
		// var editorEdit = CodeMirror.fromTextArea(document.getElementById("editProc"), {
	    	// lineNumbers: true
		// });
		// editorEdit.setValue(prettyCode);
	    var editor = ace.edit("editProc");
	    editor.setValue(prettyCode);
	    editor.setTheme("ace/theme/chrome");
	    editor.getSession().setMode("ace/mode/javascript");
	} else {
		//Don't use script editor and just display raw JSON
		var procJSON = JSON.stringify(obj,null,4);
		document.getElementById("editProc").value = procJSON;
	}
}
function tableProc(host, obj) {
      $.each(obj['/proc/'].children, function() {
	      if(this == "all"){
	      	//skip all response
	      } else {
	      var proc_child = obj['/proc/' + this + '/'];
	      var procJSON = JSON.stringify(proc_child,null,4);
	      var editCode ='onclick="getProc(\'' + host + '\',\'/proc/'+ this + '\',\'code\')"';
	      var popover_data = '<button class="close" style="margin-top:-40px" onclick="$(\'#'+this+'\').popover(\'hide\')">&times;</button>' 
	      	  + '' + procJSON.substring(0,720) + '  [...]  <br><br>Click <strong>View Code</strong> to view the function'
		      + '<br><hr><a class="btn"' + editCode + '><i class="icon-list-alt"></i> View Code</a>' 
		      + ' <a class="btn"' + 'onclick="deleteProc(\'' + host + '\',\'' + this + '\')"' + '><i class="icon-trash"></i> Delete</a>'
	      var output = '<tr>' + '<td><a style="width:200px;cursor:pointer;" rel="popover" id="'+this+'" title="Processing ID: ' + this + '">' + this + '</a></td>' + '</tr>';
	      
	      //document.getElementById(this).setAttribute('value', procJSON);
	      //append the proc ids to #JSONtable
	      $('#JSONtable tbody').append(output);
	      //append popover element with streamfs output and edit and delete buttons
	      $('[rel=popover]').popover({trigger: 'click', content: popover_data, })
	      
	      };
      });
};
/* ===== Related to Footer response handling  ====== */
function footerResp(host) {
	if (host == 'default'){
		host = 'energylens.sfsprod.is4server.com'; 
	};
	var path = document.getElementById("inputPath").value;
	
	if(host.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = "8080";
		reqInput.path = '/' + path;
		reqInput.method = "get_path";
		jQuery.get("sfslib/php/sfs_marshaller.php", reqInput, function (data) {
			dataJSON = JSON.parse(data);
			prettyPrint = JSON.stringify(dataJSON, null, 4);
			$('#msgs pre').empty();
			$('#msgs pre').append(prettyPrint);
		});
	}
};
function hideFooter() {
  	$("footer").animate({height:40},200);
  	$("#toggle i").replaceWith('<i class="icon-chevron-up"></i>');
  };
$(document).ready(function(){ 

	$("#toggle").toggle(function(){
	    $("#toggle i").replaceWith('<i class="icon-chevron-down"></i>');
	    $('footer').animate({height:600},200);
	    $('footer .well').animate({height:600},200);
	    $('footer #msgs pre').height(545);
	  },function(){
	  	$("#toggle i").replaceWith('<i class="icon-chevron-up"></i>');
	    $('footer #msgs pre').animate({height:200},200);
	    $('footer').animate({height:245},200);
  });

 });
