var messages = null;//动态消息记录集合


$(function () {
	
	//背景大小调整
	var changeBackgroundSize = function() {
		var	$windowH = $(window).height(),
			$windowW = $(window).width(),
			$bgcontainer = $('.navigate')
			
		$bgcontainer.css('width',$windowW)
		$bgcontainer.css('height',$windowH)
		
		$(window).resize(function() {
			$bgcontainer.css('width',$windowW)
			$bgcontainer.css('height',$windowH)
			changeBackgroundSize()
		})
	}
	
	//导航标签动画
	var animationTags = function() {
		var $tags = $('.navigate .col-xs-4'),
			$windowsW = $(window).width()
			
		if ($windowsW >= 640) {
			$tags.on('mouseover',function(event) {
				$(this).find('p').css('display','none')
				$(this).find('span').css('font-size',80)
				
				$tags.on('mouseout',function() {
					$(this).find('p').css('display','block')
					$(this).find('span').css('font-size','5.71rem')
				})
			})
		}
	}

	//运行
	changeBackgroundSize() //背景大小调整
	animationTags() //导航标签动画
	
})

