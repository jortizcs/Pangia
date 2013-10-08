function createGraphs(alarms) {
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
		var margin = {top: 0, bottom: 0, right: 20, left: 63},
				width = 960 - margin.left - margin.right,
				height = 220 - margin.top - margin.bottom;
				
		// All the time values are given in seconds, so we
		// convert them to milliseconds.
		var alarmStart = alarms[i][2][0][0] * 1000;
		var alarmEnd = alarms[i][2][0][1] * 1000;

		// For each dataset in the alarm (of which there will
		// always be exactly two), create a graph.
		for (var j = 0; j < 2; j++) {
			var set = alarms[i][j];
			// The data is set.data

      // This should never occur, but just in case, skip any graphs that have no
      // data.
      if (set.data.length == 0) {
        continue;
      }
			
			//If it's the first graph, remove the bottom margin so that it's visually better looking and we don't repeat the x-axis
			if (j == 0) {
			//This needs to eventually be made into responsive widths and heights and not absolute values	
			  var margin = {top: 0, bottom: 0, right: 20, left: 63}
			} else {
			//This needs to eventually be made into responsive widths and heights and not absolute values	
			  var margin = {top: 0, bottom: 60, right: 20, left: 63}
			};
			
			var startDate = new Date(set.data[0][0] * 1000);
      var endDate = new Date(set.data[set.data.length - 1][0] * 1000);
      // Get the difference in days between the start and end so that we can
      // make a formatting decision later.
      var dayDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);

			var x = d3.time.scale.utc()
				.range([0, width]);

			var y = d3.scale.linear()
				.range([height, 0]);
			
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(9)
        .tickFormat((dayDiff < 3) ?
            d3.time.format.utc("%H:%M") :
            d3.time.format.utc("%b %d"));
			
			var yAxis = d3.svg.axis()
				.scale(y)
				.ticks(8)
				.orient("left");
			
			var line = d3.svg.line()
				.x(function (d) { return x(d[0] * 1000); })
				.y(function (d) { return y(d[1]); });

			//scale the x and y axes here 	  
			x.domain(d3.extent(set.data, function (d) { return d[0] * 1000; }));
			y.domain(d3.extent(set.data, function (d) { return d[1]; }));

			//Insert a holder for tags before the chart.
      var container = $('#anomaly' + i);
			container.append($('<ul class="tagHolder tagTable"></ul>'));

			//Insert SVG graph into dynamically generated Anomaly Container of id i
			var svg = d3.select("#anomaly" + i).append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.attr("viewBox","0 0 50 50")

			//This is the alarm highlight rectangle
			svg.append("rect")
				.attr("x", x(alarmStart))
				.attr("y", 0)
				.attr("width", x(alarmEnd) - x(alarmStart))
				.attr("height", height)
				.attr("class", "rect");

      // The hover line.
      var hoverLineGroup = svg.append("g")
        .attr("class", "hover-line");
      var hoverLine = hoverLineGroup
        .append("line")
        .attr("x1", 0).attr("x2", 0)
        .attr("y1", 0).attr("y2", height);

      hoverLine.classed("hide", true);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.selectAll("text")  
				.style("text-anchor", "end")
				.attr("dx", "1.3em")
				.attr("dy", "1em");
				// .attr("transform", function(d) {
				  // return "rotate(-65)";
				// });
			
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				//.attr("transform","translate(" + -30 + ",0)")
				
			//y-axis label
			svg.append("text")
				.attr("class", "y label")
				.attr("transform", "rotate(-90)")
				.attr("y", -42)
				.attr("x", 0)
				//.attr("dy", ".71em")
				.style("text-anchor", "end")
				//set the y axis label here
				.text(set.label);

			var timeLabel = svg.append("text")
				.attr("class", "x label")
				//.attr("x", width)
				.attr("x", 100)
				.attr("y", height + 50)
				.text("");
					
			//x-axis label
      var formattedStartDate = d3.time.format.utc("%b-%d %Y")(startDate);
			svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				//.attr("x", width)
				.attr("x", 86)
				.attr("y", height + 50)
				.text(formattedStartDate);

			// Draw Y-axis grid lines
			svg.selectAll("line.y")
			  .data(y.ticks(8))
			  .enter().append("line")
			  .attr("class", "y")
			  .attr("x1", 0)
			  .attr("x2", width)
			  .attr("y1", y)
			  .attr("y2", y)
			  .style("stroke", "#CCC")
			  .style("stroke-dasharray", "2,2");
  
      svg.append("path")
        .datum(set.data)
        .attr("class", "line")
        .attr("d", line);

      // These mouse move and leave events are to create the vertical bar that
      // locates the time on the graphs.
      container.mousemove((function() {
        var myH = hoverLine;
        var myX = x;
        var myY = y;
        var myContainer = container;
        var myOffsetX = myContainer.find('svg').offset().left + margin.left;
        var myOffsetY = myContainer.find('svg').offset().top + margin.top;
        var myTimeLabel = timeLabel;
        return function (e) {
          var xpos = e.pageX - myOffsetX;
          var ypos = e.pageY - myOffsetY;

          if (xpos < 0 || xpos > myX.range()[1]) {
            myH.classed("hide", true);
            myTimeLabel.text("");
            return;
          }

          myH.classed("hide", false);
          myH.attr("x1", xpos).attr("x2", xpos);
          var formattedTime = d3.time.format.utc("%b-%d %Y, %H:%M")(myX.invert(xpos));
          myTimeLabel.text(formattedTime);
        }
      })());

      container.mouseleave((function() {
        var myH = hoverLine;
        var myX = x;
        var myContainer = container;
        var myTimeLabel = timeLabel;
        return function (e) {
          myH.classed("hide", true);
          myTimeLabel.text("");
        }
      })());
			
			//Set the Anomaly Chart titles to something more descriptive
			if (j==0){
				$("#anomaly-title"+i).append('Anomaly ' + (i+1) + ": " + set.label);
			} else {
				$("#anomaly-title"+i).append(' - ' + set.label);
			}
		}
	}
}

function tagExists(spans, tag) {
	var i;
	for (i = 0; i < spans.length; i++) {
		var s = $(spans[i]);
		if (s.text().trim() == tag) {
			return true;
		}
	}

	return false;
}

function addTag(container, label) {
	var btn = $('<li class="tag"><button class="btn btn-small">' + label
	  + '</button></li>').draggable({ cancel: false, helper: 'clone' });
	container.append(btn);
}

$(document).ready(function () {
	var alarms = JSON.parse($('#alarmsdata').attr('data-alarms'));

	createGraphs(alarms);

	$('.tagTableContainer').draggable();

	var tagTable = $('#tagTable');

	// For demo and testing, we add some tags manually.
	var demotags = [ 'Heating', 'Temperature', 'Ventilation', 'AC', 'Lighting', 'Type' ];
	for (var t in demotags) {
		addTag(tagTable, demotags[t]);
	}

	$('svg').droppable({
		drop: function (e, ui) {
			var tagHolder = $(this).prev();
			var spans = tagHolder.find('span');
			var tagText = ui.draggable.text().trim();
			var clone, tagremove;
			var i;

			// If the dragged item is *not* a tag, ignore it.
			if (!$(ui.draggable).hasClass('tag')) {
				return;
			}

			// Make sure that the tag isn't already present
			if (tagExists(spans, tagText)) {
				// This tag is already present, so abort.
				return;
			}
			// Create a clone then add the remove button
			clone = ui.draggable.clone();
			tagremove = $('<a href="#" class="tagRemove btn-close"><i class="icon-remove"></i></a>');
			// Remove the tag when the remove button is clicked.
			tagremove.click(function (e) {
				$(e.target).parents('li').remove();
			});
			clone.find('button').append(tagremove);
			tagHolder.append(clone);
		}
	});

	// Modal popup for adding tags
	var modal = $('#tagModal');
	var newtagname = modal.find('input');
	var errorbox = modal.find('.text-error');
	modal.find('.modal-footer').children('.btn-primary').click(function() {
		var n = newtagname.val();
		if (n === "") {
			errorbox.text('You did not specify a tag name.');
			errorbox.show();
		} else if (tagExists($('#tagTable').find('span'), n)) {
			errorbox.text('Tag name already exists.');
			errorbox.show();
		} else {
			addTag(tagTable, n);
			modal.modal('hide');
		}
	});

	$('#tagAdd').click(function () {
		newtagname.val('');
		errorbox.hide();
		modal.modal('show');
	});

  $(".anomaly-useful").each(function(index, elt) {
    var span = $(elt);
    var btns = span.find('a');

    var reportId = alarms[index][3];
    var useful = alarms[index][4];
    var usefulBtn;
    if (!useful || useful === 'unsure') {
      usefulBtn = $(btns[2]);
    } else if (useful === 'no') {
      console.log('useful = no');
      usefulBtn = $(btns[1]);
    } else {
      console.log('useful = yes');
      usefulBtn = $(btns[0]);
    }
    usefulBtn.addClass('active');

    btns.click(function() {
      var btn = $(this);
      var isUseful = btn.text().toLowerCase();
      $.post('/chart', { isUseful: isUseful, reportId: reportId });
    });
  });
});
