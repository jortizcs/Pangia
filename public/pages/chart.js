function createGraphs() {
	var alarms = JSON.parse($('#alarmsdata').attr('data-alarms'));

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
		//This needs to eventually be made into responsive widths and heights and not absolute values	
		var margin = {top: 0, bottom: 40, right: 20, left: 50},
			width = 960 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		// All the time values are given in seconds, so we
		// convert them to milliseconds.
		var alarmStart = alarms[i][2][0][0] * 1000;
		var alarmEnd = alarms[i][2][0][1] * 1000;

		// For each dataset in the alarm (of which there will
		// always be exactly two), create a graph.
		for (var j = 0; j < 2; j++) {
			// The data is set.data
			var set = alarms[i][j];
			var startDate = new Date(set.data[0][0] * 1000);

			var x = d3.time.scale.utc()
				.range([0, width]);

			var y = d3.scale.linear()
				.range([height, 0]);
			
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.tickFormat(d3.time.format.utc("%X"));
			
			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
			
			var line = d3.svg.line()
				.x(function (d) { return x(d[0] * 1000); })
				.y(function (d) { return y(d[1]); });

			//scale the x and y axes here 	  
			x.domain(d3.extent(set.data, function (d) { return d[0] * 1000; }));
			y.domain(d3.extent(set.data, function (d) { return d[1]; }));

			//Insert a holder for tags before the chart.
			$('#anomaly' + i).append($('<ul class="tagHolder tagTable"></ul>'));

			//Insert SVG graph into dynamically generated Anomaly Container of id i
			var svg = d3.select("#anomaly" + i).append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.attr("viewBox","0 0 50 50"); 
			
			//This is the alarm highlight rectangle
			svg.append("rect")
				.attr("x", x(alarmStart))
				.attr("y", 0)
				.attr("width", x(alarmEnd) - x(alarmStart))
				.attr("height", height)
				.attr("class", "rect");
			
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.selectAll("text")  
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", function(d) {
				  return "rotate(-65)";
				});
			
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				//set the y axis label here
				.text(set.label);
			
			svg.append("text")
				.attr("class", "x label")
				.attr("text-anchor", "end")
				//.attr("x", width)
				.attr("x", 75)
				.attr("y", height - 6)
				.text(d3.time.format.utc("%Y-%b-%d")(startDate));

			  svg.append("path")
				  .datum(set.data)
				  .attr("class", "line")
				  .attr("d", line);

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
	createGraphs();

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

});
