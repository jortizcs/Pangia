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
<script>
$(document).ready(function(){ 	
	footerResp('default');
}
</script>
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
		<div class="span9">
			<div class="well">
				<div class="tabbable"> <!-- Only required for left/right tabs -->
				  <ul class="nav nav-tabs">
				    <li class="active"><a href="#tab1" data-toggle="tab">Edit Resource</a></li>
				    <li><a href="#tab2" data-toggle="tab">Create Resource</a></li>
				    <li><a href="#tab3" data-toggle="tab">Create Symlink</a></li>
				  </ul>
				  <div class="tab-content">
				    <div class="tab-pane active" id="tab1">
				      <textarea rows="12"></textarea>
				      <a class="btn" href=""><i class="icon-ok-sign"></i> Save</a>
				    </div>
				    <div class="tab-pane " id="tab2">
						  <form class="form-horizontal">
						  <div class="control-group">
						    <label class="control-label" for="fileInputTitle">Title:</label>
						    <div class="controls">
							    <input type="text" id="fileInputTitle" placeholder="Title"><br>
							      <label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioRegular" value="regular" checked> Regular
								</label>
								<label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioStreaming" value="streaming"> Streaming
								</label>
						    	<br><br>
						    <label class="control-label" for="fileInputChildTitle1">Child #1 Title:</label>
						    <div class="controls">
							    <input type="text" id="fileInputChildTitle1" placeholder="Child Title"><br>
							      <label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioRegular" value="regular" checked> Regular
								</label>
								<label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioStreaming" value="streaming"> Streaming
								</label><br>
							</div><br>	
								<label class="control-label" for="fileInputChildTitle2">Child #2 Title:</label>
						    <div class="controls">
							    <input type="text" id="fileInputChildTitle2" placeholder="Child Title"><br>
							      <label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioRegular" value="regular" checked> Regular
								</label>
								<label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioStreaming" value="streaming"> Streaming
								</label>
						    </div><br>
						    
						    <label class="control-label" for="fileInputChildTitle3">Child #3 Title:</label>
						    <div class="controls">
							    <input type="text" id="fileInputChildTitle3" placeholder="Child Title"><br>
							      <label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioRegular" value="regular" checked> Regular
								</label>
								<label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioStreaming" value="streaming"> Streaming
								</label>
						    </div><br>	
						    <label class="control-label" for="fileInputChildTitle4">Child #4 Title:</label>
						    <div class="controls">
							    <input type="text" id="fileInputChildTitle4" placeholder="Child Title"><br>
							      <label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioRegular" value="regular" checked> Regular
								</label>
								<label class="radio inline">
								  <input type="radio" name="fileRadio" id="fileRadioStreaming" value="streaming"> Streaming
								</label><br><br>
								 <a class="btn" href=""><i class="icon-ok-sign"></i> Add Child</a>
						    </div><br>							
						    </div>						    						    						  
						  </div>
						  </form>
				      <a class="btn" href=""><i class="icon-ok-sign"></i> Save</a>
				    </div>
				    <div class="add tab-pane" id="tab3">
				      <form class="form-horizontal">
						  <div class="control-group">
						    <label class="control-label" for="addSymSource">Source:</label>
						    <div class="controls">
						      <input type="text" id="addSymSource" placeholder="Source">
						    </div>
						  </div>
						  <div class="control-group">
						    <label class="control-label" for="addSymLink">Link name:</label>
						    <div class="controls">
						      <input type="text" id="addSymLink" placeholder="Link Name">
						    </div>
						  </div>						  
						  <div class="control-group">
						    <label class="control-label" for="addSymTarget">Destination:</label>
						    <div class="controls">
						      <input type="text" id="addSymTarget" placeholder="Destination">
						    </div>
						  </div>
						  <div class="control-group">
						    <div class="controls">
						      <button class="btn" onClick="createSub()"><i class="icon-plus"></i> Add</button>
						    </div>
						  </div>
						</form>
				    </div>
			</div>
		</div>	
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
