<!DOCTYPE html>
<html lang="en">
<head>
	
	<!-- start: Meta -->
	<meta charset="utf-8">
	<title>Pangia :: Anomaly Report</title>
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
	<link href="lib/css/custom.css" rel="stylesheet">
	
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
			<script src="lib/js/jquery-1.7.2.min.js"></script>
			<script src="lib/js/jquery-ui-1.8.21.custom.min.js"></script>
			<!-- <script src="http://d3js.org/d3.v3.min.js"></script> -->
			<script src="lib/js/d3.v3.min.js"></script>
		
</head>

<body>
		<div class ="tagTableContainer pull-right">
			<div style="margin-bottom:10px">
			<i class="icon-tag icon-white"></i><span class="hidden-tablet"> Tag your graphs</span>
			</div>
			<table class="tagTable">
				<tr valign="top">
					<td class="span1" >
						<a class="btn btn-small btn-danger btn-block inactive">Heating</a>
						<a class="btn btn-small btn-danger">Temperature</a>
					</td>
					<td class="span1"><a class="btn btn-small btn-block">Ventilation</a></td>
				</tr>
				<tr>
					<td><button class="btn btn-mini btn-info btn-block">AC</button></td>
					<td><button class="btn btn-mini btn-warning btn-block">Lighting</button></td>
				</tr>
			
				<tr>
					<td><button class="btn btn-mini btn-inverse btn-block">Type</button></td>
					<td></td>
				</tr>							
			</table>
		</div>
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
									<span class="dropdown-menu-title">You have 3 notifications</span>
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
			
			<div>
				<hr>
				<ul class="breadcrumb">
					<li>
						<a href="dashboard.php">Home</a> <span class="divider">/</span>
					</li>
					<li>
						<a href="#">Anomaly Report</a> 
					</li>
				</ul>
				<hr>
			</div>

			<div class="row-fluid sortable">
				<?php
				global $user, $id; 
				//$user = $_POST['username'];
				//$id = $_POST['id'];
                $user = "root";
                $id = 1;

				//$dat = file_get_contents('GetAlarms.php?user='.$user."&id=".$id);
				//echo json_encode($disAlarms->getDataAlarms($user, $id));
				include_once("GetAlarms.php");
				$disAlarms = new GetAlarms("localhost", "166.78.31.162");
				$dat = $disAlarms->getDataAlarms($user, $id);
				// The following two lines are for testing
				//$dat = "[[{\"label\":\"p1\",\"data\":[]}, {\"label\":\"p2\",\"data\":[]},[[1361512800,1361513700]]],  [   {\"label\":\"p1\",\"data\":[[1361491200,0.582155816257],[1361492100,1.8082648515701],[1361493000,0.4484276920557]]},{\"label\":\"p2\",\"data\":[[1361491200,0.582155816257],[1361492100,1.8082648515701],[1361493000,0.4484276920557]]},[[1361516400,1361518200]]]]";
				//$dat = "[[{\"label\":\"p1\",\"data\":[]}, {\"label\":\"p2\",\"data\":[]},[[1361512800000,1361513700]]],  [ {\"label\":\"p1\",\"data\":[[1361491200000,0.582155816257],[1361492100000,1.8082648515701],[1361493000000,0.4484276920557]]},{\"label\":\"p2\",\"data\":[[1361491200000,0.582155816257],[1361492100000,1.8082648515701],[1361493000000,0.4484276920557]]},[[13615164000000,1361518200]]]]";

				if(!empty($dat)){
					$datobj = json_decode($dat);
				
					//$max = count($datobj["alarms"]);
					$max = count($datobj);
					if($max>10)
						$max = 10;
					for ($i = 0; $i<$max;$i++){ //$max
						echo '<div class="box">' 
							.'<div class="box-header">' 
							.'<h2><i class="icon-list-alt"></i><span class="break"></span>Anomaly #' . $i .'</h2>' 
							.'<div class="box-icon">' 
							. '</div>'
							. '</div>'
							. '<div class="box-content" id="anomaly'. $i . '">'
						//echo '<div class="box">' 
						//	.'<div class="box-header">' 
						//	.'<h2><i class="icon-list-alt"></i><span class="break"></span>Anomaly #' . $i .'</h2>' 
						//	.'<div class="box-icon">' 
						//	. '<!-- <a href="#" class="btn-setting"><i class="icon-wrench"></i></a> -->'
						//	. '<a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>'
						//	. '<!-- <a href="#" class="btn-close"><i class="icon-remove"></i></a> -->'
						//	. '</div>'
						//	. '</div>'
						//	. '<div class="box-content" id=anomaly"'. $i . '">'
						//For demo purposes uncomment the next line if you are not quite done with the graphs implementation
						//. '<img src="lib/img/an-'.$i.'.png"/>'
						;
						//closing the HTML, end of box
						echo '</div></div>';
					}
				}
						//sending PHP JSON obnect to javascript
						echo '<script> var alarms = '.$dat.';</script>';
				?>
				<script>

				createGraphs();
				    
				function createGraphs(){
					/*
					 * Loop through the JSON object.
					 * The structure of the object is:
					 *	[
					 *		[
					 *			{
					 *				label: label of graph,
					 *				data: [ [datum 1, datum 2] ... ],
					 *			},
					 *			{
					 *				label: label of graph,
					 *				data: [ [datum 1, datum 2] ... ],
					 *			},
					 *			[ int start of alarm, int end of alarm ]
					 *		]
					 *		...
					 *	]
					 */
					for (var i = 0; i < alarms.length; i++) {
						//This needs to eventually be made into responsive widths and heights and not absolute values	
						var margin = {top: 20, right: 20, bottom: 120, left: 50},
						    width = 960 - margin.left - margin.right,
						    height = 300 - margin.top - margin.bottom;

						// All the time values are given in seconds, so we
						// convert them to milliseconds.
						var alarmStart = alarms[i][2][0][0] * 1000;
						var alarmEnd = alarms[i][2][0][1] * 1000;

						// For each dataset in the alarm (of which there will
						// always be exactly two), create a graph.
						for (var j = 0; j < 2; j++) {
							// The data is set.data
							var set = alarms[i][j];
							var startDate = new Date(set.data[0][0] * 1000);

							var x = d3.time.scale.utc()
								.range([0, width]);

							var y = d3.scale.linear()
								.range([height, 0]);
							
							var xAxis = d3.svg.axis()
								.scale(x)
								.orient("bottom")
								.tickFormat(d3.time.format.utc("%X"));
							
							var yAxis = d3.svg.axis()
								.scale(y)
								.orient("left");
							
							var line = d3.svg.line()
								.x(function (d) { return x(d[0] * 1000); })
								.y(function (d) { return y(d[1]); });

							//scale the x and y axes here 	  
							x.domain(d3.extent(set.data, function (d) { return d[0] * 1000; }));
							y.domain(d3.extent(set.data, function (d) { return d[1]; }));

							//Insert SVG graph into PHP dynamically generated Anomaly Container of id i
							var svg = d3.select("#anomaly" + i).append("svg")
								.attr("height", height + margin.top + margin.bottom)
								.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
								.attr("viewBox","0 0 50 50"); 
							
							//This is the alarm highlight rectangle, needs to be updated with the alarm start time and end time for it's x and width values
							svg.append("rect")
								.attr("x", x(alarmStart))
								.attr("y", 0)
								.attr("width", x(alarmEnd) - x(alarmStart))
								.attr("height", height)
								.attr("class", "rect");
							
							svg.append("g")
								.attr("class", "x axis")
								.attr("transform", "translate(0," + height + ")")
								.call(xAxis)
								.selectAll("text")  
								.style("text-anchor", "end")
								.attr("dx", "-.8em")
								.attr("dy", ".15em")
								.attr("transform", function(d) {
								  return "rotate(-65)";
								});
							
							svg.append("g")
								.attr("class", "y axis")
								.call(yAxis)
								.append("text")
								.attr("transform", "rotate(-90)")
								.attr("y", 6)
								.attr("dy", ".71em")
								.style("text-anchor", "end")
								//set the y axis label here
								.text(set.label);
							
							svg.append("text")
								.attr("class", "x label")
								.attr("text-anchor", "end")
								.attr("x", width)
								.attr("y", height - 6)
								.text(d3.time.format.utc("%Y-%b-%d")(startDate));

							  svg.append("path")
								  .datum(set.data)
								  .attr("class", "line")
								  .attr("d", line);

						}
					}
				}
				</script>
			<!--If you want to reuse flow in the future, uncomment this
					<div class="box">
					<div class="box-header">
						<h2><i class="icon-list-alt"></i><span class="break"></span>Test</h2>
						<div class="box-icon">
							<a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
							<a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
							<a href="#" class="btn-close"><i class="icon-remove"></i></a>
						</div>
					</div>
					<div class="box-content">
						<div id="pairPart1"  class="center" style="height:150px;" ></div>
						<div id="pairPart2" class="center" style="height:150px"></div>
						<p id="hoverdata">Mouse position at (<span id="x">0</span>, <span id="y">0</span>). <span id="clickdata"></span></p>
					</div>
				</div>-->				
			</div><!--/row-->

		
		
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
				<span style="text-align:left;float:left">&copy; <a href="http://clabs.co" target="_blank">Pangia</a> 2012</span>
			</p>

		</footer>
				
	</div><!--/.fluid-container-->

	<!-- start: JavaScript-->


	
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
	
		<script src="lib/js/jquery.gritter.min.js"></script>
	
		<script src="lib/js/jquery.imagesloaded.js"></script>
	
		<script src="lib/js/jquery.masonry.min.js"></script>
	
		<script src="lib/js/jquery.knob.js"></script>
	
		<script src="lib/js/jquery.sparkline.min.js"></script>

		<script src="lib/js/custom.js"></script>
		
		<!-- end: JavaScript-->
	
</body>
</html>
