<footer>
      	<div class="row-fluid">
      		<div class="well">
		      	<?php if ($page != 'plot'): ?><div class="input-prepend input-append">
		      		<span class="add-on">Noveda://</span><input class="span10" type="text" placeholder=""><button class="btn" type="button">Go!</button>
		      	</div>
		      	<?php endif; ?>
		      	<?php if ($page == 'plot'): ?><h4>Streaming data output</h4><?php endif; ?>
		      	<div id="msgs"><pre class="span12"></pre>&nbsp;</div>
       		</div>
   		</div>
</footer>