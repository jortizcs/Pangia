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
function createSymlink(){
	var parent_ = document.getElementById("symlink_parent").value;
	var target_ = document.getElementById("symlink_target").value;
	var name = document.getElementById("symlink_name").value;
	if(parent_.length>0 && target_.length>0 && name.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = parent.menu.sfs_host;
		reqInput.sfs_port = parent.menu.sfs_port;
		reqInput.method = "create_symlink";
		reqInput.path = parent_;
		reqInput.target = target_;
		reqInput.linkname = name;
		jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, symlinkCreateResp);
	}
}
function symlinkCreateResp(data){
	var dataJson = JSON.parse(data);
	if(dataJson.status == "success"){
		parent.menu.location.reload();
	} else {
		alert("Could not create symlink");
	}
}
/* ===== Anything subscription page related is below ====== */ 
function getJSON (host,path) {
	if (host == 'default'){
		host = 'energylens.sfsdev.is4server.com'; 
	};
	
	if(host.length>0){
		var reqInput = new Object();
		reqInput.sfs_host = host;
		reqInput.sfs_port = "8080";
		reqInput.path = path;
		reqInput.method = "get_path";
		jQuery.get("sfslib/php/sfs_marshaller.php", reqInput, function (data) {
			if ((path == 'sub') || 'sub/' || 'sub/*' || 'sub*'){
	     		alert ('yea its' + path);
	     		var obj = JSON.parse(data);
	     		tableRows(obj);
	     } else {
	     	return obj;
	     }
	   });
	}
}
function tableRows(obj) {
      $.each(obj['/sub/'].children, function() {
	      if(this == "all"){
	      	//skip all response
	      } else {
	      var sub_child = obj['/sub/' + this + '/'];
	      var edit ='onclick="editSub(\'' + sub_child.sourcePath + '\',\'' + sub_child.destination + '\')"';
	      var subJSON = JSON.stringify(sub_child,'\t','\t');
	      var popover_data = subJSON + 
		      '<br><hr><a class="btn"' + edit + '><i class="icon-edit"></i> Edit</a>' + 
		      ' <a class="btn"' + 'onclick="deleteSub(\'modal\',\'' + this + '\' )"' + '><i class="icon-trash"></i> Delete</a>';
	      var output = '<tr>' + '<td><a style="width:200px;cursor:pointer;" rel="popover" title="Subscription ID: ' + this + '">' + this + '</a></td>' + '</tr>';
	      
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
		reqInput.sfs_host = "http://energylens.sfsdev.is4server.com";
		reqInput.sfs_port = "8080";
		reqInput.method = "create_sub";
		reqInput.path = parent_;
		reqInput.target = target_;
		jQuery.post("sfslib/php/sfs_marshaller.php", reqInput, function(data){
			var dataJson = JSON.parse(data);
			if(dataJson.status == "success"){
				alert("works: " + data);
				//location.reload();
				//parent.reload();
				//var alert = '<div class="alert fade in"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>it worked</strong>        </div>';
				//alert('it worked dude');
				//$('body').append(alert);
			} else {
				alert("Could not create subscription: " + data);
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
		reqInput.sfs_host = "http://energylens.sfsdev.is4server.com";
		reqInput.sfs_port = "8080";
		reqInput.method = "delete_sub";
		reqInput.path = parent_;
		reqInput.target = target_;
		jQuery.delete("sfslib/php/sfs_marshaller.php", reqInput, createSubResp);
	}
}
/* ===== Processing elements related page code  ====== */

/* ===== Related to Footer response handling  ====== */
function footerResp(host) {
	if (host == 'default'){
		host = 'energylens.sfsdev.is4server.com'; 
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
			$('#msgs pre').replaceWith('<div id="msgs"><pre class="span12">' + prettyPrint + '</pre>&nbsp;</div>');
		});
	}
}
