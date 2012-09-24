<?php
	/* gets the page and host values from the links */
	global $page, $host, $name;
	$page = $_GET['page'];	
	$host = $_GET['host'];
	$name = $_GET['name'];
	$url = '&host=' . $host . '&name=' . $name;
?>
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container-fluid">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="index.php">PANGIA</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="dropdown <?php if ($page == "files" || $page == "sub" || $page == "JSON") { echo 'active'; } ?>">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Modify instance <b class="caret"></b></a>
                <ul class="dropdown-menu">
                 <!--  <li class="nav-header">Basic</li> -->
				<li <?php if ($page == "files") { echo 'class="active"'; } ?>>
              	<a href="index-instance-resources.php?page=files<?php echo $url ?>"><i class="icon-book"></i> Files</a></li>
              	<li <?php if ($page == "sub") { echo 'class="active"'; } ?>>
              	<a href="index-instance-subscriptions.php?page=sub<?php echo $url ?>"><i class="icon-magnet"></i> Subscriptions</a></li>
              	<li <?php if ($page == "JSON") { echo 'class="active"'; } ?>>
              	<a href="index-instance-JSON.php?page=JSON<?php echo $url ?>"><i class="icon-indent-left"></i> JSON interface</a></li>
              	
                </ul>
              </li>
               <li class="dropdown <?php if ($page == "proc" || $page == "plot" || $page == "plot-conf" || $page == "anomaly") { echo 'active'; } ?>">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Analytics <b class="caret"></b></a>
                <ul class="dropdown-menu">
               <li <?php if ($page == "proc") { echo 'class="active"'; } ?>>
              	<a href="index-instance-processing.php?page=proc<?php echo $url ?>"><i class="icon-random"></i> Processing elements</a></li>   
               <li <?php if ($page == "plot") { echo 'class="active"'; } ?>>
              	<a href="index-instance-plotter.php?page=plot<?php echo $url ?>"><i class="icon-picture"></i> Plotter Demo</a></li>
              <li <?php if ($page == "plot-conf") { echo 'class="active"'; } ?>>
              	<a href="index-instance-plotter-conf.php?page=plot-conf<?php echo $url ?>"><i class="icon-picture"></i> Plotter</a></li>
              	<li <?php if ($page == "anomaly") { echo 'class="active"'; } ?>>
              	<a href="index-instance-anomaly.php?page=anomaly<?php echo $url ?>"><i class="icon-list"></i> Anomaly Detection</a></li>
                </ul>
              </li>
            </ul>

           <div class="btn-group pull-right">
            <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
              <i class="icon-user"></i> admin
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li><a href="#">Profile</a></li>
              <li class="divider"></li>
              <li><a href="#">Sign Out</a></li>
            </div>

          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
	