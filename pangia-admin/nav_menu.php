        <div class="span3">
          <div class="well sidebar-nav">
            <ul class="nav nav-list">
              <li class="nav-header">Modification Options</li>
              <li <?php if ($page == "files") { echo 'class="active"'; } ?>>
              	<a href="index-instance-resources.php?page=files"><i class="icon-book"></i>Files</a></li>
              <li <?php if ($page == "sub") { echo 'class="active"'; } ?>>
              	<a href="index-instance-subscriptions.php?page=sub"><i class="icon-magnet"></i>Subscriptions</a></li>
              <li <?php if ($page == "JSON") { echo 'class="active"'; } ?>>
              	<a href="index-instance-JSON.php?page=JSON"><i class="icon-indent-left"></i>JSON interface</a></li>
              <li <?php if ($page == "proc") { echo 'class="active"'; } ?>>
              	<a href="index-instance-processing.php?page=proc"><i class="icon-random"></i>Processing elements</a></li>                        
              <li class="nav-header">Data display</li>
              <li <?php if ($page == "plot") { echo 'class="active"'; } ?>>
              	<a href="index-instance-plotter.php?page=plot"><i class="icon-picture"></i>Plotter</a></li>
            </ul>
          </div><!--/.well -->
        </div><!--/span-->