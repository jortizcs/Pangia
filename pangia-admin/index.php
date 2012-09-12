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

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">PANGIA</a>
          <div class="nav-collapse collapse">
            <form class="navbar-form pull-right">
              <input class="span2" type="text" placeholder="Email">
              <input class="span2" type="password" placeholder="Password">
              <button type="submit" class="btn">Sign in</button>
            </form>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
	<?php include 'nav_url_exists.php' ?>
    <div class="container">
<div class="row-fluid">
    <div class="span12">
    	<p>&nbsp;</p>
      <ul class="thumbnails">
        <li class="span4">
          <div class="thumbnail">
            <a href="index-instance.php?host=8.19.33.137&name=oomnitza">
            <img src="img/oomnitza.png" alt="" align="center" width="100%"></a>
            <div class="caption">
              <p>Status: <?php if (urlExists('8.19.33.137:8080') == true ) {
              	 echo '<span class="badge badge-success">live</span>'; 
			  } else {echo '<span class="badge badge-warning">down</span>'; } ?> </p>
              <p><i>8.19.33.137</i></p>
		        <div class="btn-group">
		        	<a href="index-instance.php?name=oomnitza" class="btn btn-success">View </a>
		          <button class="btn dropdown-toggle" data-toggle="dropdown">Actions <span class="caret"></span></button>
		          <ul class="dropdown-menu">
		            <li><a href="#">Start</a></li>
		            <li><a href="#">Pause</a></li>
		            <li class="divider"></li>
		            <li><a href="#">Stop</a></li>
		          </ul>
		        </div><!-- /btn-group -->
            </div>
          </div>
        </li>
       <li class="span4">
          <div class="thumbnail">
            <a href="index-instance.php?host=energylens.sfsdev.is4server.com&name=Noveda"><img src="img/noveda.png" alt="" align="center" width="100%"></a>
            <div class="caption">
              <p>Status: <?php if (urlExists('energylens.sfsdev.is4server.com:8080') == true ) {
              	 echo '<span class="badge badge-success">live</span>'; 
			  } else {echo '<span class="badge badge-warning">down</span>'; } ?> </p>
              <p><i>energylens.sfsdev.is4server.com</i></p>
		        <div class="btn-group">
		        	<a href="index-instance.php?host=energylens.sfsdev.is4server.com&name=Noveda" class="btn btn-success">View </a>
		          <button class="btn dropdown-toggle" data-toggle="dropdown">Actions <span class="caret"></span></button>
		          <ul class="dropdown-menu">
		            <li><a href="#">Start</a></li>
		            <li><a href="#">Pause</a></li>
		            <li class="divider"></li>
		            <li><a href="#">Stop</a></li>
		          </ul>
		        </div><!-- /btn-group -->
            </div>
          </div>
        </li>

        <li class="span4">
          <div class="thumbnail">
            <a href="#"><img src="img/add.png" alt="Add Instance" align="center" width="100%"></a>
            <div class="caption">
              <h3 style="text-align: center">Add an instance</h3>
              <p>&nbsp;</p>
            </div>
        </li>
</div>
<div class="row-fluid">
      <hr>
      <footer>
        <p>&copy; Pangia 2012</p>
      </footer>
</div>
</div>
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
