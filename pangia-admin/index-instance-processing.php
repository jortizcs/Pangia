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
</head>
<body>
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
<?php echo $host; ?>
<script>
$(document).ready(function(){ 
	getProc('<?php $host = $_GET['host']; echo $host; ?>','/proc/*');
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
			<div style="margin-bottom: 300px"></div>
		</div>
		<div class="span9">
			<div class="well">
	            <textarea rows="18" id="editProc"></textarea> 
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
