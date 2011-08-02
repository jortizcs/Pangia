$(document).ready(function() {
	
	$('.slider-container').each(function() {
		var $container = $(this);
		var $guide = $(this).find('.guide');
		var $ruler = $(this).find('.ruler');
		
		var items = $ruler.find('ul li').length;
		
		if( $(this).hasClass('slider-min-max') ) {
			
			$guide.slider({
				range: true,
				min: 0,
				max: items-1,
				values: [1,items-2],
				change: function() {
					update_lasers();
				}
				// values: [1,items]
			});
			
			$guide.find('.ui-slider-handle').each(function(n) {
				$(this).addClass('slider-' + n);
			});
			
		} else {
			
			$guide.slider({
				min: 0,
				max: items-1,
				change: function(event, ui) {
					update_lasers();
					// $( ui.handle ).css('-webkit-transform','rotate(' + ( ( ui.value / ui.max ) * 360 ) + 'deg)');
				}
			});
			
		}
				
		$ruler.find('ul li').each(function(n) {
			$(this).css({
				'left': ( n * ( 100 / (items-1) ) ) + '%'
			})
		});
	})

	
	$(window).trigger('resize');

});

$(window).resize(function() {
	$('.slider').each(function() {
		var $this = $(this);
		var $left = $this.find('.left');
		var $guide = $this.find('.guide');
		var $right = $this.find('.right');
		var $ruler = $this.parent().find('.ruler');
		
		var width = $this.width();
		var caps = $left.width() + $right.width();

		$guide.css({
			'width': width - caps,
			'left': $left.width()
		});
		
		$ruler.css({
			'width': width - caps,
			'marginLeft': $left.width()
		});
	});
});