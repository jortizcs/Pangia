<footer class="visible-desktop">
      	<div class="row-fluid">
      		<center><button class="btn" type="button" id="toggle"><i class="icon-chevron-up"></i></button><button class="btn" type="button" class="btn-small" id="hide" onclick="hideFooter('');">Hide</button></center>
      		<div class="well">
		      	<?php if ($page != 'plot'): ?><div class="input-prepend input-append">
		      		<span class="add-on"><?php echo $name . "://" ?></span><input class="span10" type="text" placeholder="type path here" id="inputPath" value="<?php if(($page == "sub") || ($page == "proc")){ echo $page . "/"; } ?>">
		      		<button class="btn" type="button" onclick="footerResp('<?php echo $host; ?>')">Fetch!</button>
		      	</div>
		      	<?php endif; ?>
		      	<?php if ($page == 'plot'): ?><h4>Streaming data output</h4><?php endif; ?>
		      	<div id="msgs"><pre class="span12"></pre>&nbsp;</div>
       		</div>
   		</div>
</footer>