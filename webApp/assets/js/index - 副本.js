if (localStorage) {
	$('#top-button a:first span').text(localStorage.getItem('username'));
}
window.onload = window.onhashchange = function() {
}
function resize() {
	var height = window.innerHeight;
	if (!height) {
		height = $(window).height();
	}
	$('#wrap').height(height - $('#top').height());
}
window.onresize = resize;
resize();
$('h2').click(function() {
	var $this = $(this);
	if (!$this.hasClass('active')) {
		$this.addClass('active').siblings('h2').removeClass('active');
		$this.next('ul').slideDown(200).siblings('ul').slideUp(200);
	} else {
		$this.next('ul').slideUp(200);
		$this.removeClass('active');
	}
}).first().click();
$('#left li').click(function() {
	var $this = $(this);
	$this.addClass('active').siblings().removeClass('active');
});
var main = $('#main')[0];
$('#left li a').mousedown(function(e) {
	if (e.button == 0) {
		$('#main').attr('src', '');
	}
});
$('.back').click(function() {
	main.contentWindow.history.back();
});
$('.forward').click(function() {
	main.contentWindow.history.forward();
});
$('.repeat').click(function() {
	main.contentWindow.location.reload();
});
$('.logout').click(function() {
	new Confirm('您确定要退出控制面板吗?', function() {
		utils.post('adminlogon/AdminLogout.action', function() {
			location.href = '/yytingadmin/pages/Admin.jsp';
		});
	});
});
$('.menuhide').click(function() {
	var $this = $(this);
	if ($this.text() == '隐藏') {
		$('#wrap').addClass('hide-menu');
		$this.text('显示');
	} else {
		$('#wrap').removeClass('hide-menu');
		$this.text('隐藏');
	}
})
$('#main').on(
		'load',
		function() {
			var url = main.contentWindow.location.href;
			if (!url.match(/\w+.jsp/)) {
				return;
			}
			var jspName = url.match(/\w+.jsp/)[0];
			var current = $('#left a[href^="' + jspName + '"]').filter(
					':not(.create)');
			if (current.length == 0) {
				current = $('#left a[href*="/' + jspName + '"]').filter(
						':not(.create)');
			}
			if (current[0]) {
				var level1, level2, level3;
				level1 = current.closest('ul.level1').prev().children('a');
				$('#left li.active').removeClass('active');
				if (current.closest('.level2').length == 1) {
					current.closest('.level2').parent().addClass('active')
					current.closest('.level2').closest('ul').slideDown(200)
							.siblings('ul').slideUp(200);
					level3 = current;
					level2 = current.closest('.level2').closest('ul').prev();
				} else {
					level2 = current;
					current.closest('li').addClass('active');
					current.closest('ul').slideDown(200).siblings('ul')
							.slideUp(200);
				}
				// 生成导航地址
				if (!main.contentWindow.$ && main.contentWindow.$.fn) {
					return;
				}
				var address = $('<div class="address-nav"></div>');
				var arr = [];
				if (level1) {
					arr.push('<a>' + level1.text() + '</a>');
				}
				if (level2) {
					arr.push('<a href="' + level2.attr('href') + '">'
							+ level2.text() + '</a>');
				}
				if (level3) {
					arr.push('<a>' + level3.text() + '</a>');
				}
				$('<div class="address-nav">' + arr.join('&gt;') + '</div>')
						.prependTo(main.contentWindow.$('body'));
			}
		});