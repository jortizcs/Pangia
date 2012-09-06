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
</head>
<body>
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->

	<?php include "navbar.php" ?>
    <div class="container-fluid">
	<?php include "nav_breadcrumb.php" ?>
      <div class="row-fluid">
		<?php include "nav_menu.php" ?>
		
		<div class="span3">
			<div class="well">
	            <a class="btn" href=""><i class="icon-plus"></i> Add</a> <a class="btn" href=""><i class="icon-edit"></i> Modify</a> <a class="btn" href=""><i class="icon-trash"></i> Delete</a>
	            <p>Add Dynatree here that lists all modifiable StreamFS resources for instance</p>
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
      

<?php include "nav_footer.php" ?>
    </div><!--/.fluid-container-->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.2.min.js"><\/script>')</script>

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
