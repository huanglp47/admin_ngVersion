(function($){
	$(window).load(function(){
		$("#left").mCustomScrollbar();
	});
	function resize() {
		var height = window.innerHeight;
		if (!height) {
			height = $(window).height();
		}
		$('#wrap').height(height - $('#top').height());
	}
	window.onresize = resize;
	resize();
})(jQuery);