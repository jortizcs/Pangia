


function setStreamBound(stream_id, value, type, done){
	$.ajax({
		url: '/setStreamBound',
		cache: false,
		data: {'stream_id': stream_id, 'value': value, 'type': type},
		success: function(data){
			if(data){
				done(true);
			}
		},
		error: function(jqXHR, textStatus, err){
			alert("An error occured, we couldn't update the stream bound.\n("+textStatus+', err: '+err+')');
			done(false);
		}
	});
}




function setStreamPriority(stream_id, priority, done){
	$.ajax({
		url: '/setStreamPriority',
		cache: false,
		data: {'stream_id': stream_id, 'priority': priority},
		success: function(data){
			if(data){
				done(true);
			}
		},
		error: function(jqXHR, textStatus, err){
			alert("An error occured, we couldn't update the stream priority.\n("+textStatus+', err: '+err+')');
			done(false);
		}
	});
}

function setPriorityLabel(span, modif){
	var currClass = span.attr('class');
	var currCode  = parseInt(currClass[currClass.length-1]) 
	var newCode = currCode+modif;
	span.removeClass(currClass).addClass('priority'+newCode);
	if(newCode==2)
		span.text("High");
	else if(newCode==1)
		span.text("Normal");
	else if(newCode==0)
		span.text("Low");
}


$(document).ready(function () {


	$("span.priority").each(function(index, elt){
		var span = $(elt);
		var stream_id = span.attr('id');

		var priorityLabel = span.find('span');
		var btnmin = span.find('#btnmin');
		var btnplu = span.find('#btnplu');
		setPriorityLabel(priorityLabel,0);


		// Plus button
		btnplu.click(function(){
			var currClass = priorityLabel.attr('class');
			var currCode  = parseInt(currClass[currClass.length-1]); 
			if(currCode+1<=2){
				setStreamPriority(stream_id,currCode+1,function(success){if(success)setPriorityLabel(priorityLabel,1);});
			}
		});
		
		// Minus button
		btnmin.click(function(){
			var currClass = priorityLabel.attr('class');
			var currCode  = parseInt(currClass[currClass.length-1]);
			if(currCode-1>=0){
				setStreamPriority(stream_id,currCode-1,function(success){if(success)setPriorityLabel(priorityLabel,-1);});
			}
		});
	});




	$('input.upper_bound').each(function(index, elt){
		var input = $(elt);
		var stream_id = $($("span.priority")[index]).attr('id');

		input.focusout(function(){
			//TODO verify that it is higher than the lower bound
			setStreamBound(stream_id, input.attr('value'), 'upper_bound', function(success){});	
		});
	});

	$('input.lower_bound').each(function(index, elt){
		var input = $(elt);
		var stream_id = $($("span.priority")[index]).attr('id');

		input.focusout(function(){
			//TODO verify that it is lower than the higher bound
			setStreamBound(stream_id, input.attr('value'), 'lower_bound', function(){});	
		});
	});
});

