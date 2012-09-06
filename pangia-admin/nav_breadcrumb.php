    	<ul class="breadcrumb">
		  <li>
		    <a href="index.php">Home</a> <span class="divider">/</span>
		  </li>
		  <li>
		    <a href="index-instance.php">Noveda</a> <?php if (!empty($page)): ?> <span class="divider">/</span> <?php endif; ?>
		  </li>
		  <li class="active">
			<?php if ($page == "files") { echo 'Files'; 
			} elseif  ($page == "sub") { echo 'Subscriptions'; 
			} elseif ($page == "JSON") { echo 'JSON interface'; 
			} elseif ($page == "proc") { echo 'Processing elements'; 
			} elseif ($page == "plot") { echo 'Plotter'; } ?>
		  </li> 
		</ul>