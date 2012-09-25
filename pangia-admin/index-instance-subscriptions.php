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
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="js/script.js"></script>
	<script src="js/libs/bootstrap/bootstrap.min.js"></script>
</head>
<body>
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
<script>
$(document).ready(function(){ 
	getSub('<?php global $host; $host = $_GET['host']; echo $host; ?>','/sub/*');
	footerResp('<?php echo $host; ?>');
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
              <li class="nav-header">Subscription IDs</li>
	            <!-- <a class="btn" href=""><i class="icon-plus"></i> View</a>  -->
	           <table class="table table-hover table-condensed" id="JSONtable" style="background:#FFF">
				<tbody>
					<!--parsed JSON will display here -->
				</tbody>
				</table>
			</div>
			<div style="margin-bottom: 300px"></div>
		</div>
		<div class="span9"> <!-- need this div otherwise there is some affix positioning that needs to be done -->
			<div class="well span8" data-spy="affix" style="top:100">
				<div class="tabbable"> <!-- Only required for left/right tabs -->
				  <ul class="nav nav-tabs">
				    <li class="add active"><a href="#tabAdd" data-toggle="tab">Add Subscription</a></li>
				    <li class="edit disabled"><a href="#tabEdit" data-toggle="tab">View subscription</a></li>
				  </ul>
				  <div class="tab-content">
				    <div class="add tab-pane active" id="tabAdd">
				      <form class="form-horizontal">
						  <div class="control-group">
						    <label class="control-label" for="addSubSource">Source:</label>
						    <div class="controls">
						      <input type="text" id="addSubSource" placeholder="Source">
						    </div>
						  </div>
						  <div class="control-group">
						    <label class="control-label" for="addSubTarget">Destination:</label>
						    <div class="controls">
						      <input type="text" id="addSubTarget" placeholder="Destination">
						    </div>
						  </div>
						  <div class="control-group">
						    <div class="controls">
						      <button class="btn" type="button" onClick="createSub('<?php echo $host; ?>')"><i class="icon-plus"></i> Add</button>
						    </div>
						  </div>
						</form>
				    </div>
				    <div class="edit tab-pane" id="tabEdit">
				      	<form class="form-horizontal">
						  <div class="control-group">
						    <label class="control-label" for="editSubSource">Source:</label>
						    <div class="controls">
						      <input type="text" id="editSubSource" placeholder="Source">
						    </div>
						  </div>
						  <div class="control-group">
						    <label class="control-label" for="editSubTarget">Destination:</label>
						    <div class="controls">
						      <input type="text" id="editSubTarget" placeholder="Destination">
						    </div>
						  </div>
						  <div class="control-group">
						    <!-- <div class="controls">
						      <button class="btn" type="button"><i class="icon-ok"></i> Save</button>
						    </div> -->
						  </div>
						</form>
				    </div>
				  </div>
				</div>
	            
			</div><!-- end Affix -->
		</div>	
      </div><!--/row-->
      <div class="modal hide fade" id="deleteModal">
		  <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3>Delete confirmation</h3>
		  </div>
		  <div class="modal-body">
		    <p></p>
		  </div>
		  <div class="modal-footer">
		    <a href="#" class="btn" onclick="deleteSub('delete','')">Yes</a>
		    <a href="#" class="btn btn-primary" data-dismiss="modal">No</a>
		  </div>
		</div>
    </div><!--/.fluid-container-->
<?php include "nav_footer.php" ?>

<script src="js/script.js"></script>
<script>
	var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
	(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
	g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
	s.parentNode.insertBefore(g,s)}(document,'script'));
</script>

</body>
</html>
