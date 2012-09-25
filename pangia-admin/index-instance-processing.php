<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title></title>
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width">
	<link rel="stylesheet" href="less/style.css">
	<script src="js/libs/modernizr-2.5.3-respond-1.1.0.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.2.min.js"><\/script>')</script>
	<script src="js/libs/js-beautify/beautify.js"></script>
<script src="js/libs/js-beautify/beautify.js"></script>
<script src="js/libs/js-beautify/beautify-css.js"></script>
<script src="js/libs/js-beautify/beautify-html.js"></script>
<script src="js/libs/js-beautify/tests/sanitytest.js"></script>
<script src="js/libs/js-beautify/tests/beautify-tests.js"></script>
<script src="js/libs/js-beautify/unpackers/javascriptobfuscator_unpacker.js"></script>
<script src="js/libs/js-beautify/unpackers/urlencode_unpacker.js"></script>
<script src="js/libs/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js"></script>
<script src="js/libs/js-beautify/unpackers/myobfuscate_unpacker.js"></script>
</head>
<body>
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
<style>
.popover {z-index:10000000}
#addProc, #editProc {
  overflow-x: auto;
  height: 400px;
  background:white;
}
</style>
<script>

$(document).ready(function(){ 
	getProc('<?php //$host = $_GET['host']; echo $host; ?>default','/proc/*','table');
	footerResp('<?php $host = $_GET['host']; echo $host; ?>');
});
</script>

	<?php include "nav_bar.php" ?>
    <div class="container-fluid">
	<?php include "nav_breadcrumb.php" ?>
      <div class="row-fluid">
		<?php include "nav_menu.php" ?>
		
		<div class="span3">
			<div class="well">
				<ul class="nav nav-list">
              <li class="nav-header">Processing IDs</li>
	            <!-- <a class="btn" href=""><i class="icon-plus"></i> View</a>  -->
	           <table class="table table-hover table-condensed" id="JSONtable" style="background:#FFF">
				<tbody>
					<!--parsed JSON will display here -->
				</tbody>
				</table>
			</div>
			<div class="footer-margin"></div>
		</div>
		<div class="span9">
			<div class="well">
				<div class="tabbable"> <!-- Only required for left/right tabs -->
				  <ul class="nav nav-tabs">
				    <li class="add active"><a href="#tabAdd" data-toggle="tab">Add</a></li>
				    <li class="edit disabled"><a href="#tabEdit" data-toggle="tab">View</a></li>
				  </ul>
				  <div class="tab-content">
				    <div class="add tab-pane active" id="tabAdd">
				      <form class="form-horizontal">
						  	<div class="controls-row">
						  		<input type="text" class="span5" id="procName" placeholder="Name">
						  	<input class="span2" type="text" id="procWin" class="inline" placeholder="Winsize">
							<input class="span2" type="text" id="procTime" placeholder="TimeOut">
							<select id="procMaterialize" class="span2">
							  <optgroup label="Materialize?">
							  <option>true</option>
							  <option>false</option>
							  </optgroup>
							</select>	
						  </div><br> 
						  <div class="control-group">
						  	<label>Script:</label>
<div id="addProc" class="span8" style="margin-left:0px;">var func = function (buffer, state) {
	
};</div><div style="margin-bottom:400px"></div>
						  </div> 
						  <div class="control-group">
						      <button class="btn" type="button" onClick="createProc('<?php $host = $_GET['host']; echo $host; ?>')"><i class="icon-plus"></i> Add</button>
						  </div>
						</form>
				    </div>
				    <div class="edit tab-pane" id="tabEdit">
				      	<form class="form-horizontal">
						  	<div class="controls-row">
						  	<input type="text" class="span5" id="procNameEdit" placeholder="Name">
						  	<input class="span2" type="text" id="procWinEdit" class="inline" placeholder="Winsize">
							<input class="span2" type="text" id="procTimeEdit" placeholder="TimeOut">
							<select id="procMaterializeEdit" class="span2">
							  <optgroup label="Materialize?">
							  <option>true</option>
							  <option>false</option>
							  </optgroup>
							</select>	
						  </div><br> 
						  <div class="control-group">
						  	<div id="editProc" class="span8" style="margin-left:0px;"></div>
						  	<div style="margin-bottom:400px"></div>
						  </div> 
						  <div class="control-group">
						      <!-- <button class="btn" type="button" onClick="editProc('<?php $host = $_GET['host']; echo $host; ?>')"><i class="icon-ok-sign"></i> Save</button> -->
						  </div>
						</form>
				    </div>
				  </div>
				</div>
			</div>
			<div class="footer-margin"></div>
		</div>	
      </div><!--/row-->
<!--      <div class="modal hide fade" id="deleteModal">
		  <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3>Delete confirmation</h3>
		  </div>
		  <div class="modal-body">
		    <p></p>
		  </div>
		  <div class="modal-footer">
		    <a href="#" class="btn">Yes</a>
		    <a href="#" class="btn btn-primary" data-dismiss="modal">No</a>
		  </div>
		</div> -->
    </div><!--/.fluid-container-->
<?php include "nav_footer.php" ?>
<script src="js/libs/ace/src-min/ace.js" type="text/javascript" charset="utf-8"></script>
<script>
    var editor = ace.edit("addProc");
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode("ace/mode/javascript");
</script>
<script src="js/libs/bootstrap/bootstrap.min.js"></script>

<script src="js/script.js"></script>
<script>
	var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
	(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
	g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
	s.parentNode.insertBefore(g,s)}(document,'script'));
</script>

</body>
</html>
