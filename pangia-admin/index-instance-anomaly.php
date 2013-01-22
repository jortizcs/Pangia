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
</head>
<body>
	<script>
	$(document).ready(function(){ 
		var obj = '<tr>	<td>4</td><td><span class="badge badge-success">inactive</span></td><td>/jorge/acme1208/true_power/</td><td>August 30, 10:25pm</td><td>2 days</td></tr>'
		//$("table tbody").animate('slow').append(obj).delay(5000);
	});
	</script>
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
	<?php include "nav_bar.php" ?>
    <div class="container-fluid">
	<?php include "nav_breadcrumb.php" ?>
      <div class="row-fluid">
		<?php include "nav_menu.php" ?>
		<div class="span12">
			<div class="well">
				<table class="table table-hover" style="">
				  <thead>
				  	<th>Building</th>
				  	<th>Status</th>
				  	<th>Type</th>
					<th>Found where?</th>
					<th>Found when?</th>
					<th>Action</th>
				  </thead>
				  <tbody>
			  		<tr>
				  		<td>Bass Library</td>
				  		<td><span class="badge badge-important">critical</span></td>
				  		<td>Lights in unoccupied room</td>
				  		<td>Bass/floor2/room210/acme2200/true_power/</td>
				  		<td>October 30, 10:25pm</td>
				  		<td><a href="#" class="btn btn-small">View Graph</a></td>				  		
				  	</tr>
				  	<tr>
				  		<td></td>
				  		<td></td>
				  		<td>Simultaneous heating and cooling</td>
				  		<td>Bass/floor3/room330/</td>
				  		<td>October 30, 10:25pm</td>
				  		<td><a href="#" class="btn btn-small">View Graph</a></td>				  		
				  	</tr>
			  		<tr>
				  		<td></td>
				  		<td></td>
				  		<td>Duct Leakage</td>
				  		<td>Bass/floor5/duct1/</td>
				  		<td>October 30, 10:25pm</td>
				  		<td><a href="#" class="btn btn-small">View Graph</a></td>				  		
				  	</tr>			  					  	
			  		<tr>
				  		<td>Hoover Tower</td>
				  		<td><span class="badge badge-warning">mild</span></td>
				  		<td>Lights in unoccupied room</td>
				  		<td>Hoover/floor2/room1/acme2200/true_power/</td>
				  		<td>October 30, 10:25pm</td>
				  		<td><a href="#" class="btn btn-small">View Graph</a></td>				  		
				  	</tr>
				  	<tr>
				  		<td></td>
				  		<td></td>
				  		<td>Duct Leakage</td>
				  		<td>Hoover/floor5/duct1/</td>
				  		<td>October 30, 10:25pm</td>
				  		<td><a href="#" class="btn btn-small">View Graph</a></td>				  		
				  	</tr>
				  	<tr>
				  		<td>Huang Center</td>
				  		<td><span class="badge badge-success">ok</span></td>
				  		<td></td>
				  		<td></td>
				  		<td></td>
				  		<td></td>
				  	</tr>
				  	<tr>
				  		<td>Y2E2</td>
				  		<td><span class="badge badge-success">ok</span></td>
				  		<td></td>
				  		<td></td>
				  		<td></td>
				  		<td></td>
				  	</tr>
				  </tbody>
				</table>            
			</div>
		</div>	
      </div><!--/row-->
      
    </div><!--/.fluid-container-->
<?php include "nav_footer.php" ?>
<script src="js/libs/bootstrap/bootstrap.min.js"></script>
<script src="js/script.js"></script>
</body>
</html>
