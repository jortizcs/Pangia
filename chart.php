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
			<script src="http://d3js.org/d3.v3.min.js"></script>		
		
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
				$user = $_POST['username'];
				$id = $_POST['id'];
				
				$dat = file_get_contents('GetAlarms.php?user='.$user."$id=".$id);
				echo "datdata=".$dat."<br>";
				if(!empty($dat)){
					$datobj = json_decode($dat);
				
					$max = count($datobj["alarms"]);
					if($max>10)
						$max = 10;
					for ($i = 1; $i<=$max;$i++){ //$max
						echo '<div class="box">' 
							.'<div class="box-header">' 
							.'<h2><i class="icon-list-alt"></i><span class="break"></span>Anomaly #' . $i .'</h2>' 
							.'<div class="box-icon">' 
							. '<!-- <a href="#" class="btn-setting"><i class="icon-wrench"></i></a> -->'
							. '<a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>'
							. '<!-- <a href="#" class="btn-close"><i class="icon-remove"></i></a> -->'
							. '</div>'
						. '</div>'
						. '<div class="box-content" id="'. $i . '">'
						//For demo purposes uncomment the next line if you are not quite done with the graphs implementation
						//. '<img src="lib/img/an-'.$i.'.png"/>'
						;
						//closing the HTML, end of box
						echo '</div></div>';
					}
				}
						//sending PHP JSON obnect to javascript
						echo '<script> var dataAndAlarms = '.$dat.'</script>';
				?>
				<script>

				createGraphs();
					//alert(dataAndAlarms);
				    
					function createGraphs(){
						//loop through the JSON object, make sure this is consistent with the loop in PHP above so that the ids for the svg append will match
						for (var i = 1;i < dataAndAlarms.length; i++) { 
							//Create multiple graphs here depending on however many data key, value pairs we have, likely never more than 3 
							for (var j=1;j < dataAndAlarms.all_data.length; j++){
							
							//This needs to eventually be made into responsive widths and heights and not absolute values	
							var margin = {top: 20, right: 20, bottom: 30, left: 50},
							    width = 960 - margin.left - margin.right,
							    height = 200 - margin.top - margin.bottom;
							
							//Change this date Parser depending on whatever the timeformat is that we get from MySQL, in this case UTC
							var parseDate = d3.time.format.utc("%d-%b-%y");
							//define timestamp in our JSON object
							var timestamp = parseDate(dataAndAlarms.all_data.data[j][0]);
							//define value associated with timestamp in our JSON object
							var value = dataAndAlarms.all_data.data[j][1];   
							
							var x = d3.time.scale()
							    .range([0, width]);
							
							var y = d3.scale.linear()
							    .range([height, 0]);
							
							var xAxis = d3.svg.axis()
							    .scale(x)
							    .orient("bottom");
							
							var yAxis = d3.svg.axis()
							    .scale(y)
							    .orient("left");
							
							var line = d3.svg.line()
							    .x(x(timestamp))
							    .y(y(value));								  
							
							//scale the x and y axes here 	  
							 x.domain(d3.extent(timestamp));
	 						 y.domain(d3.extent(value));
						
						//Insert SVG graph into PHP dynamically generated Anomaly Container of id i
							var svg = d3.select("#" + i).append("svg")
							    .attr("height", height + margin.top + margin.bottom)
							    .append("g")
							    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
							    .attr("viewBox","0 0 50 50"); 
							
							//This is the alarm highlight rectangle, needs to be updated with the alarm start time and end time for it's x and width values
							var alarmStart = dataAndAlarms.alarms[j][0];
							var alarmEnd = dataAndAlarms.alarms[j][1];
							svg.append("rect")
							   .attr("x", alarmStart)
							   .attr("y", 0)
							   .attr("width", parseDate(alarmEnd-alarmStart))
							   .attr("height", height)
							   .attr("class", "rect");
							
							  svg.append("g")
							      .attr("class", "x axis")
							      .attr("transform", "translate(0," + height + ")")
							      .call(xAxis);
							
							  svg.append("g")
							      .attr("class", "y axis")
							      .call(yAxis)
							      .append("text")
							      .attr("transform", "rotate(-90)")
							      .attr("y", 6)
							      .attr("dy", ".71em")
							      .style("text-anchor", "end")
							      //set the y axis label here
							      .text(dataAndAlarms.all_data[j].label);
							
							  svg.append("path")
							      .datum(dataAndAlarms.all_data[i])
							      .attr("class", "line")
							      .attr("d", line);
							      
							});
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
