/* Author: Michael Heinrich */
/* ===== extending jQuery to include PUT and DELETE ====== */ 
function _ajax_request(url, data, callback, type, method) {
    if (jQuery.isFunction(data)) {
        callback = data;
        data = {};
    }
    return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
        });
}

jQuery.extend({
    put: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    delete_: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
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
	     		tableSub(obj);
	     } else {
	     	return obj;
	     }
	   });
	}
}
function tableSub(obj) {
      $.each(obj['/sub/'].children, function() {
	      if(this == "all"){
	      	//skip all response
	      } else {
	      var sub_child = obj['/sub/' + this + '/'];
	      var edit ='onclick="editSub(\'' + sub_child.sourcePath + '\',\'' + sub_child.destination + '\')"';
	      var subJSON = JSON.stringify(sub_child,null,4);
	      var popover_data = '<button class="close" style="margin-top:-40px" onclick="$(\'#'+this+'\').popover(\'hide\')">&times;</button>' + subJSON + 
		      '<br><hr><a class="btn"' + edit + '><i class="icon-edit"></i> Edit</a>' + 
		      ' <a class="btn"' + 'onclick="deleteSub(\'modal\',\'' + this + '\' )"' + '><i class="icon-trash"></i> Delete</a>';
	      var output = '<tr>' + '<td><a style="width:200px;cursor:pointer;" rel="popover" id="'+this+'" title="Subscription ID: ' + this + '">' + this + '</a></td>' + '</tr>';
	      
	      //append the subscription ids to #JSONtable
	      $('#JSONtable tbody').append(output);
	      //append popover element with streamfs output and edit and delete buttons
	      $('[rel=popover]').popover({trigger: 'click', content: popover_data, })
	      };
      });
};
function createSub(){
	var parent_ = document.getElementById("addSubSource").value;
	var target_ = document.getElementById("addSubTarget").value;
	//alert(parent_ + target_);
	
	if(parent_.length>0 && target_.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = "http://energylens.sfsprod.is4server.com";
		reqInput.sfs_port = "8080";
		reqInput.method = "create_sub";
		reqInput.path = parent_;
		reqInput.target = target_;
		jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				alert("Subscription created: " + dataJson);
				//location.reload();
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
function deleteSub(type, body){
	if (type == 'modal') {
		$('[rel=popover]').popover('hide');
		$('#deleteModal').modal();
		$('#deleteModal .modal-body p').replaceWith('<p>Delete the Subscription ID <strong>' + body + '</strong>?');
	} else if (type == 'delete') {
		var reqInput = new Object();
		reqInput.sfs_host = "http://energylens.sfsprod.is4server.com";
		reqInput.sfs_port = "8080";
		reqInput.method = "delete_sub";
		reqInput.path = parent_;
		reqInput.target = target_;
		jQuery.delete("sfslib/php/sfs_marshaller.php", reqInput, createSubResp);
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
	     		tableProc(obj);
	     } else {
	     	var obj = JSON.parse(data);
	     	editProc(obj, flag);
	     }
	   });
	}
}
function editProc(obj, flag) { 
	$('[rel=popover]').popover('hide');
	
	if (flag=="code") {
		var procJSON = JSON.stringify(obj.properties.script.func);
		//remove the outside "" so that code beautification works
		var temp = procJSON.substring(1,procJSON.length -1);
		//call beautify library
		var prettyCode = js_beautify(temp);
		//instantiate CodeMirror editor
		var editor = CodeMirror.fromTextArea(document.getElementById("editProc"), {
	    	lineNumbers: true
		});
		editor.setValue(prettyCode);
	} else {
		//Don't use code mirror and just display raw JSON
		var procJSON = JSON.stringify(obj,null,4);
		document.getElementById("editProc").value = procJSON;
	}
}
function tableProc(obj) {
      $.each(obj['/proc/'].children, function() {
	      if(this == "all"){
	      	//skip all response
	      } else {
	      var proc_child = obj['/proc/' + this + '/'];
	      var procJSON = JSON.stringify(proc_child,null,4);
	      var edit ='onclick="getProc(\'default\',\'/proc/'+ this + '\',\'edit\')"';
	      var editCode ='onclick="getProc(\'default\',\'/proc/'+ this + '\',\'code\')"';
	      var popover_data = '<button class="close" style="margin-top:-40px" onclick="$(\'#'+this+'\').popover(\'hide\')">&times;</button>' 
	      	  + '' + procJSON.substring(0,720) + '  [...]  <br><br>Click <strong>Edit</strong> to see full JSON or <strong>Edit Code</strong> to modify the code'
		      + '<br><hr><a class="btn"' + edit + '><i class="icon-edit"></i> Edit</a> <a class="btn"' + editCode + '><i class="icon-list-alt"></i> Edit Code</a>' 
		      + ' <a class="btn"' + 'onclick="deleteProc(\'modal\',\'' + this + '\' )"' + '><i class="icon-trash"></i> Delete</a>'
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
