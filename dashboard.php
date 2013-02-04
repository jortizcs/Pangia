<!DOCTYPE html>
<html lang="en">
<head>
	
	<!-- start: Meta -->
	<meta charset="utf-8">
	<title>Pangia - Dashboard</title>
	<meta name="description" content="Perfectum Dashboard Bootstrap Admin Template.">
	<meta name="author" content="Łukasz Holeczek">
	<!-- end: Meta -->
	
	<!-- start: Mobile Specific -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- end: Mobile Specific -->
	
	<!-- start: CSS -->
	<link id="bootstrap-style" href="lib/css/bootstrap.css" rel="stylesheet">
	<link href="lib/css/bootstrap-responsive.css" rel="stylesheet">
	<link id="base-style" href="lib/css/style.css" rel="stylesheet">
	<link id="base-style-responsive" href="lib/css/style-responsive.css" rel="stylesheet">
	
	<!--[if lt IE 7 ]>
	<link id="ie-style" href="lib/css/style-ie.css" rel="stylesheet">
	<![endif]-->
	<!--[if IE 8 ]>
	<link id="ie-style" href="lib/css/style-ie.css" rel="stylesheet">
	<![endif]-->
	<!--[if IE 9 ]>
	<![endif]-->
	
	<!-- end: CSS -->
	

	<!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<!-- start: Favicon -->
	<link rel="shortcut icon" href="lib/img/favicon.ico">
	<!-- end: Favicon -->
			
</head>
<?php 
	//Getting user name
	global $user; 
	$user = $_POST['username'];
	$pass = $_POST['password'];
	
	//Setting up PDO connection
	// try {
    // $dbh = new PDO('mysql:host=localhost;dbname=pangia', $user, $pass);
    // foreach($dbh->query('SELECT * from Pangia') as $row) {
        // print_r($row);
    // }
    // $dbh = null;
	// } catch (PDOException $e) {
	    // print "Error!: " . $e->getMessage() . "<br/>";
	    // die();
	// }
?>

<body>
		<div id="overlay">
		<ul>
		  <li class="li1"></li>
		  <li class="li2"></li>
		  <li class="li3"></li>
		  <li class="li4"></li>
		  <li class="li5"></li>
		  <li class="li6"></li>
		</ul>
	</div>	
	<!-- start: Header -->
	<div class="navbar">
		<div class="navbar-inner">
			<div class="container-fluid">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".top-nav.nav-collapse,.sidebar-nav.nav-collapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</a>
				<a class="brand" href="index.php"><span class="hidden-phone">PANGIA</span></a>
								
				<!-- start: Header Menu -->
				<div class="nav-no-collapse header-nav">
					<ul class="nav pull-right">
						<li class="dropdown hidden-phone">
							<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
								<i class="icon-warning-sign icon-white"></i> <span class="label label-success hidden-phone">3</span>
							</a>
							<ul class="dropdown-menu notifications">
								<li>
									<span class="dropdown-menu-title">You have 11 notifications</span>
								</li>	
								<li>
                                    <a href="#">
										+ <i class="icon-comment"></i> <span class="message">New report</span> <span class="time">7 min</span> 
                                    </a>
                                </li>
								<li>
                                    <a href="#">
										+ <i class="icon-comment"></i> <span class="message">New report</span> <span class="time">8 min</span> 
                                    </a>
                                </li>
								<li>
                                    <a href="#">
										+ <i class="icon-comment"></i> <span class="message">New report</span> <span class="time">16 min</span> 
                                    </a>
                                </li>
                                <li>
                            		<a class="dropdown-menu-sub-footer">View all notifications</a>
								</li>	
							</ul>
						</li>

						<li>
							<a class="btn" href="#">
								<i class="icon-wrench icon-white"></i>
							</a>
						</li>
						<!-- start: User Dropdown -->
						<li class="dropdown">
							<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
								<i class="icon-user icon-white"></i>
								<span class="caret"></span>
							</a>
							<ul class="dropdown-menu">
								<li><a href="#"><i class="icon-user"></i> Profile</a></li>
								<li><a href="login.html"><i class="icon-off"></i> Logout</a></li>
							</ul>
						</li>
						<!-- end: User Dropdown -->
					</ul>
				</div>
				<!-- end: Header Menu -->
				
			</div>
		</div>
	</div>
	<!-- start: Header -->
	
		<div class="container-fluid">
		<div class="row-fluid">
				
			<!-- start: Main Menu -->
			<div class="span2 main-menu-span">
				<div class="nav-collapse sidebar-nav">
					<ul class="nav nav-tabs nav-stacked main-menu">
						<li><a href="dashboard.php"><i class="icon-home icon-white"></i><span class="hidden-tablet"> Dashboard</span></a></li>
						<li><a href="upload.php"><i class="icon-edit icon-white"></i><span class="hidden-tablet"> New Report</span></a></li>
					</ul>
				</div><!--/.well -->
			</div><!--/span-->
			<!-- end: Main Menu -->
			
			<noscript>
				<div class="alert alert-block span10">
					<h4 class="alert-heading">Warning!</h4>
					<p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a> enabled to use this site.</p>
				</div>
			</noscript>
			
			<div id="content" class="span10">
			<!-- start: Content -->
			
			<!-- <div>
				<hr>
				<ul class="breadcrumb">
					<li>
						<a href="#">Home</a> <!-- <span class="divider">/</span> 
					</li>
					<li>
						<a href="#">Dashboard</a>
					</li>
				</ul>
				<hr>
			</div> -->
			
			<div class="row-fluid sortable">		
				<div class="box span9">
					<div class="box-header" data-original-title>
						<h2><i class="icon-tasks"></i><span class="break"></span>Finished Reports</h2>
						<div class="box-icon">
							<!-- <a href="#" class="btn-setting"><i class="icon-wrench"></i></a> -->
							<a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
							<!-- <a href="#" class="btn-close"><i class="icon-remove"></i></a> -->
						</div>
					</div>
					<div class="box-content">
						<table class="table table-striped table-bordered bootstrap-datatable datatable">
						  <thead>
							  <tr>
								  <th>Name</th>
								  <th>Date uploaded</th>
								  <th>Priority</th>
								  <th>Number of Anomalies</th>
								  <th>Tags</th>
								  <th>Data Actions</th>
							  </tr>
						  </thead>   
						  <tbody>
							<tr>
								<td>UTokyo CS Building</td>
								<td class="center">2012/01/01</td>
								<td class="center"><span class="label label-important">High</span></td>
								<td class="center">5</td>
								<td class="center">Utokyo</td>
								<td class="center">
									<a class="btn btn-success" href="chart.php">
										<i class="icon-zoom-in icon-white"></i>  
									</a>
									<a class="btn btn-info" href="#">
										<i class="icon-edit icon-white"></i>  
									</a>
								</td>
							</tr>
							
							<tr>
								<td>UC Berkeley</td>
								<td class="center">2012/01/01</td>
								<td class="center"><span class="label label-warning">Medium</span></td>
								<td>4</td>
								<td class="center">Temp</td>
								<td class="center">
									<a class="btn btn-success" href="chart.php">
										<i class="icon-zoom-in icon-white"></i>  
									</a>
									<a class="btn btn-info" href="#">
										<i class="icon-edit icon-white"></i>  
									</a>
								</td>
							</tr>
										
						</tbody>
					</table>
					
				</div>
				
				</div><!-- end box --> 
				<div class="box span3">
					<div class="box-header">
						<h2><i class="icon-tasks"></i><span class="break"></span>Reports in Progress</h2>
						<div class="box-icon">
							<!-- <a href="#" class="btn-setting"><i class="icon-wrench"></i></a> -->
							<a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
							<!-- <a href="#" class="btn-close"><i class="icon-remove"></i></a> -->
						</div>
					</div>
					<div class="box-content">
						<div class="progressBarValue">
							<span>Soda Hall</span> <span class="progressCustomValueVal">20</span>
							<div class="progressSlim progressCustomValue progressRed"></div>
						</div>
						<div class="progressBarValue">
							<span>Knight Management Center</span> <span class="progressCustomValueVal">40</span>
							<div class="progressSlim progressCustomValue progressOrange"></div>
						</div>
						<div class="progressBarValue">
							<span>Cory Hall</span> <span class="progressCustomValueVal">60</span>
							<div class="progressSlim progressCustomValue progressYellow"></div>
						</div>
						<div class="progressBarValue">
							<span>Gates Building</span> <span class="progressCustomValueVal">80</span>
							<div class="progressSlim progressCustomValue progressGreen"></div>
						</div>
					</div>
				</div>
			<div class="row-fluid">
				

				
			</div>
			
			<hr>

			<!-- end: Content -->
			</div><!--/#content.span10-->
				</div><!--/fluid-row-->
				
		<div class="modal hide fade" id="myModal">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Settings</h3>
			</div>
			<div class="modal-body">
				<p>Here settings can be configured...</p>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal">Close</a>
				<a href="#" class="btn btn-primary">Save changes</a>
			</div>
		</div>
		
		<div class="clearfix"></div>
		
		<footer>
			<p>
				<span style="text-align:left;float:left">&copy; <a href="http://clabs.co" target="_blank">PANGIA</a> 2012</span>
			</p>

		</footer>
				
	</div><!--/.fluid-container-->

	<!-- start: JavaScript-->

		<script src="lib/js/jquery-1.7.2.min.js"></script>
	<script src="lib/js/jquery-ui-1.8.21.custom.min.js"></script>
	
		<script src="lib/js/bootstrap.js"></script>
	
		<script src="lib/js/jquery.cookie.js"></script>
	
		<script src='lib/js/fullcalendar.min.js'></script>
	
		<script src='lib/js/jquery.dataTables.min.js'></script>

		<script src="lib/js/excanvas.js"></script>
	<script src="lib/js/jquery.flot.min.js"></script>
	<script src="lib/js/jquery.flot.pie.min.js"></script>
	<script src="lib/js/jquery.flot.stack.js"></script>
	<script src="lib/js/jquery.flot.resize.min.js"></script>
	
		<script src="lib/js/jquery.chosen.min.js"></script>
	
		<script src="lib/js/jquery.uniform.min.js"></script>
		
		<script src="lib/js/jquery.cleditor.min.js"></script>
	
		<script src="lib/js/jquery.noty.js"></script>
	
		<script src="lib/js/jquery.elfinder.min.js"></script>
	
		<script src="lib/js/jquery.raty.min.js"></script>
	
		<script src="lib/js/jquery.iphone.toggle.js"></script>
	
		<script src="lib/js/jquery.uploadify-3.1.min.js"></script>
	
		<script src="lib/js/jquery.gritter.min.js"></script>
	
		<script src="lib/js/jquery.imagesloaded.js"></script>
	
		<script src="lib/js/jquery.masonry.min.js"></script>
	
		<script src="lib/js/jquery.knob.js"></script>
	
		<script src="lib/js/jquery.sparkline.min.js"></script>

		<script src="lib/js/custom.js"></script>

		<!-- end: JavaScript-->
	
</body>
</html>
