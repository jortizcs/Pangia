<footer>
      	<hr>
      	<div class="row-fluid">
      		<div class="well">
		      	<?php if ($page != 'plot'): ?><div class="input-prepend input-append">
		      		<span class="add-on">sfs://</span><input class="span11" type="text" placeholder=""><button class="btn" type="button">Go!</button>
		      	</div>
		      	<?php endif; ?>
		      	<?php if ($page == 'plot'): ?><h4>Streaming data output</h4><?php endif; ?>
		      	<div id="msgs"><pre class="span12" style="background:white;min-height:200px; max-height:200px;overflow:auto;"></pre></div>
		        <p>&copy; Pangia 2012</p>
       		</div>
   		</div>
      </footer>