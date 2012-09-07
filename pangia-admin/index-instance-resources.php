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
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/libs/jsTree.v.1.0rc/jquery.cookie.js"></script>
	<script type="text/javascript" src="js/libs/jsTree.v.1.0rc/jquery.hotkeys.js"></script>
	<script type="text/javascript" src="js/libs/jsTree.v.1.0rc/jquery.jstree.js"></script>
	<script type="text/javascript" src="js/libs/jsonformatter.js"></script>
</head>
<body>
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
<input type="hidden" name="context" value="raw" id="context_field_id">
<input type="hidden" name="host_name" value="energylens.sfsdev.is4server.com" id="host_field_id">
<input type="hidden" name="host_port" value=8080 id="port_field_id">

	<?php include "nav_bar.php" ?>
    <div class="container-fluid">
	<?php include "nav_breadcrumb.php" ?>
      <div class="row-fluid">
		<?php include "nav_menu.php" ?>
		
		<div class="span3">
			<div class="well">
	           <div id="viewer" class="viewer_window" align="left"></div>
			</div>
		</div>
		<div class="span6">
			<div class="well">
				<div class="tabbable"> <!-- Only required for left/right tabs -->
				  <ul class="nav nav-tabs">
				    <li class="active"><a href="#tab1" data-toggle="tab">Output</a></li>
				    <li class=""><a href="#tab2" data-toggle="tab">Create Resource</a></li>
				    <li><a href="#tab3" data-toggle="tab">Edit Resources</a></li>
				  </ul>
				  <div class="tab-content">
				    <div class="tab-pane active" id="tab1">
				      <p>streamfs Output here</p>
				    </div>
				    <div class="tab-pane " id="tab2">
				      <p>Resource create stuff here w/ streaming or static options</p>
				    </div>
				    <div class="tab-pane" id="tab3">
				      <p>Modification stuff here.</p>
				    </div>
				  </div>
				</div>
	            
	            <a class="btn" href=""><i class="icon-ok-sign"></i> Save</a>
			</div>
		</div>	
      </div><!--/row-->
     
    </div><!--/.fluid-container-->
<?php include "nav_footer.php" ?>

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
