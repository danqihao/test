/*
 * @Author: lishizhi
 * @Date: 2017-07-28 15:28:41
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-26 10:00:38
 */
$(function() {

	// 设置屏幕最小显示高度
	(function() {
		var $mainHeight = $('#mainRight'),
			$screenHeight = $(window).height();
			$mainHeight.css('min-height', $screenHeight);
	}());

	$(".addPT").click(function(){

	  $("#addProductType").modal("show");

  });

  $(".addBPT").click(function(){

  $("#addBProductType").modal("show");

});

	// 退出系统弹窗效果示范
//	(function () {
//		var $exitBtn = $('#exit')
//		$exitBtn.on('click', function () {
			// swal({
			// title: '您确定要退出系统吗？',
			// text: '退出后将返回首页',
			// type: 'question',
			// showCancelButton: true,
			// confirmButtonText: '确定',
			// cancelButtonText: '取消',
			// }).then(function () {
			// 	swal({
			// 		title: '已退出系统',
			// 		text: '正在返回主页，请稍后……',
			// 		timer: 3000,
			// 		type: 'success',
			// 		showConfirmButton: false
			// 	});
			// });
//		});
//	}());

	// 系统弹窗实例
	/* (function () {
		var $exitBtn = $('#exit')
		$exitBtn.on('click', function () {
			swal({
			title: '您确定要退出系统吗？',
			text: '退出后将返回首页',
			type: 'question',
			timer: '2000',
			allowEscapeKey: false, // 用户按esc键不退出
			allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
			showCancelButton: false, // 显示用户取消按钮
			showConfirmButton: false, // 显示用户确认按钮
			showCancelButton: true,
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			}).then(function () {
				swal({
					title: '已退出系统',
					text: '正在返回主页，请稍后……',
					timer: 3000,
					type: 'success',
					showConfirmButton: false
				});
			});
		});
	}()); */

	// 正在建设中提示
	(function () {
		var $building = $('.building')
		$building.on('click', function () {
			swal({
			title: '您好！此功能暂未开放使用！',
			timer: 1000,
			type: 'info',
			showConfirmButton: false,
			})
		});
	}());

	// 首页顶部幻灯片导航栏
	(function slideMainNavbar() {
		var $preBtn = $('#mainRightTopMenu .menu-navbar .menu-navbar-pre'),
			$nextBtn = $('#mainRightTopMenu .menu-navbar .menu-navbar-next'),
			swiperNavbar = new Swiper('.menu-navbar .menu-navbar-nav', {
				slidesPerView: 'auto',
				slidesPerGroup: 3
			});

		$preBtn.on('click', function() {
			swiperNavbar.slidePrev();
		});

		$nextBtn.on('click', function(event) {
			swiperNavbar.slideNext();
		});
	}());

	// 左侧导航展开与折叠
	(function () {
		var $treeView = $('#mainLeftSidebar .treeview');
		$treeView.on('click', function() {

			// let childClass = $111.find('a').attr('class');
			// if (childClass === 'building') {
			// 	return;
			// }

			// 将打开的标签折叠
			if($(this).hasClass('treeview-open')) {
				$(this)
				.removeClass('treeview-open')
				.find('.treeview-menu')
				.finish()
				.animate({
					height: '0px'
				});
				$(this)
				.find('.pull-right-container')
				.children('i')
				.removeClass('fa-angle-down')
				.addClass('fa-angle-left');
			}
			else {
					var treeviewMenuHeight = $(this).find('.treeview-menu').children('li').length * 35;



				// 选中后添加选中效果
				if ($(this).children().is('.treeview-menu')) {
					$(this).children('.treeview-menu').find('a').on('click', function() {
						$(this)
						.parents('.treeview')
						.children('a')
						.addClass('treeview-active')
						.end()
						.siblings()
						.children('a')
						.removeClass('treeview-active');
					});
				}
				else {
					$(this)
					.children('a')
					.addClass('treeview-active')
					.parent()
					.siblings()
					.children('a')
					.removeClass('treeview-active');
				}

				// 兄弟元素箭头方向初始化
				$(this)
				.siblings('li')
				.children('a')
				.children('.pull-right-container')
				.children('i')
				.removeClass('fa-angle-down')
				.addClass('fa-angle-left');

				// 兄弟元素子菜单收叠
				$(this)
				.siblings('.treeview')
				.removeClass('treeview-open')
				.find('.treeview-menu')
				.finish()
				.animate({
					height: '0px'
				});

				// 添加展开class，右侧箭头切换方向
				$(this)
				.addClass('treeview-open')
				.children('a')
				.children('.pull-right-container')
				.children('i')
				.removeClass('fa-angle-left')
				.addClass('fa-angle-down');

				// 当前元素展开子菜单

				$(this)
					.find('.treeview-menu')
					.on('click', function(event) {
						event.stopPropagation()
					})
					.finish()
					.animate({
						height: treeviewMenuHeight + 'px'
					});



			}
		})
	}());

	// 开关主页面的侧边栏
	(function () {
		var $toggleBtn = $('#mainRightTopMenu .sidebar-toggle'),
			$sideBar = $('#mainLeft'),
			$content = $('#mainRight'),
			xsScreen = 768,
			screenWidth = $(window).width();

		// 实时获取屏幕尺寸
		$(window).resize(function() {
			screenWidth = $(window).width();
		});

		// 根据屏幕尺寸调整显示或隐藏
		$toggleBtn.on('click', function() {
			if(screenWidth >= xsScreen) {
				if($sideBar.css('display') !== 'none') {
					$sideBar.css('display', 'none');
				} else {
					$sideBar.css('display', 'block');
				}
				$content.toggleClass('col-sm-10');
			}
		})
	}());

	// 主页面二级与三级内容滑动
	(function () {
		var $togglebtn = $('#mainLeft .sidebar-nav a'),
			$sidebarToggelBtn = $('#mainRightTopMenu .sidebar-toggle'),
			currentSubSlides = {};

		// 二级菜单滑动切换容器
		var mySwiper = new Swiper('#LevelTwoMenuContainer', {
			noSwiping: true,
			onlyExternal: true,
			onSlideChangeEnd: function() {
				currentSubSlides = '#' + mySwiper.slides[mySwiper.activeIndex].id;
				slideMainSubContent();
			}
		})

		// 三级菜单滑动切换容器
		function slideMainSubContent() {
			var mySubSwiperLocation = $(currentSubSlides).find('.content-body'),
				$TabMenuLink = $(currentSubSlides).find('.tab-menu').children('li').find('a').not('[class="dropdown-toggle"]')
			var mySubSwiper = new Swiper(mySubSwiperLocation, {
				noSwiping: true,
				onlyExternal: true
			});

			// 主页侧边栏显示切换时响应式更改尺寸
			$sidebarToggelBtn.on('click', function() {
				mySwiper.update()
				mySubSwiper.update()
				mySwiper.slideTo(mySwiper.realIndex)
				mySubSwiper.slideTo(mySubSwiper.realIndex)
			});

			// 三级菜单滑动切换容器
			$TabMenuLink.on('click', function(event) {
			var reg = /#.+$/,
				hrefID = '';

				event.preventDefault();
				if (reg.test($(this).prop('href'))) {
					hrefID = $(this).prop('href').match(reg)[0].substr(1);

					var slideNumber =  function(swiper) {
						for (var i = 0, len = swiper.slides.length; i < len; i++) {
							if (hrefID === swiper.slides[i].id) {
								return i
							}
						}
					}
					mySubSwiper.slideTo(slideNumber(mySubSwiper));
				}
			})
		}

		// 初始化时首页运行滑动特效
		mySwiper.params.onSlideChangeEnd();

		// 二级菜单滑动切换内容
		$togglebtn.on('click', function(event) {
			var reg = /#.+$/,
				hrefID = '';

			event.preventDefault()
			if (reg.test($(this).prop('href'))) {
				hrefID = $(this).prop('href').match(reg)[0].substr(1);

				var slideNumber =  function(swiper) {
					for (var i = 0, len = swiper.slides.length; i < len; i++) {
						if (hrefID === swiper.slides[i].id) {
							return i;
						}
					}
				}

				mySwiper.slideTo(slideNumber(mySwiper));
			}
		})
	}());

	// 主页面三级菜单选中样式
	(function () {
		var $sidebarToggelBtn = $('#mainRightTopMenu .sidebar-toggle'),
			$TabMenuLink = $('.content-header-tab .tab-menu > li  a:not([class="dropdown-toggle"])'),
			$visibleTabMenu = $('.content-header-tab .tab-menu > li > a:not([class="dropdown-toggle"])'),
			$tabMenuDropdown = $('#mainRightContent .content-header-tab .tab-menu .dropdown');

		// 对可见的选项添加和删除class
		$visibleTabMenu.on('click', function(event) {
			$(this)
			.addClass('tab-menu-active')
			.parent()
			.siblings()
			.children('a')
			.removeClass('tab-menu-active');
		});

		// 对不可见的选项添加和删除class
		$tabMenuDropdown.find('.dropdown-menu').find('a').on('click', function() {
			$(this)
			.closest('.dropdown')
			.children('a')
			.addClass('tab-menu-active')
			.parent()
			.siblings()
			.children('a')
			.removeClass('tab-menu-active');
		});
	}());

	// 显示模态框
	(function() {
		var $table = $('#mainRightContent table'), // 内容区域的表单
			$toolBar = $('#mainRightContent .content-header-toolbar') // 内容区域的工具栏按钮
			$tableHeading = $('#mainRightContent .panel-heading-table')

		$toolBar.add($table).add($tableHeading).off('click').on('click', 'a', function (event) {

			if($(this).attr('data-toggle-modal-target') != null) {
				toggleModalObj = $(this).attr('data-toggle-modal-target')
				$(toggleModalObj).modal({
					backdrop: 'static', // 黑色遮罩不可点击
					keyboard: false,  // esc按键不可关闭模态框
					show: false
				})
				$(toggleModalObj).modal('show');  // 显示
			}
		})
	}());

	//主页面的轮播图
//	(function () {
//		var sidebarToggelBtn = $('#mainRightTopMenu .sidebar-toggle')
//
//		var MainCarousel = new Swiper('.content-body .content-body-carousel', {
//			nextButton: '.content-body-carousel .swiper-button-next',
//			prevButton: '.content-body-carousel .swiper-button-prev',
//			pagination: '.content-body-carousel .swiper-pagination',
//			loop: 'true',
//			autoplay: 5000,
//			paginationClickable: true,
//			autoplayDisableOnInteraction: false
//		})
//		$(window).resize(function() {
//			setTimeout(function() {
//				MainCarousel.update()
//				MainCarousel.slideTo(MainCarousel.realIndex)
//			}, 0)
//		})
//
//		// 侧边栏隐藏的时候重新计算swiper尺寸
//		sidebarToggelBtn.on('click', function() {
//			setTimeout(function() {
//				MainCarousel.update()
//				MainCarousel.slideTo(MainCarousel.realIndex)
//			}, 0)
//		})
//	}());
})

/**
 * @description 加载提示
 *
 * @param {object} target 需要添加载入提示的对象
 * @param {object} config 传入构造参数
 */
function MesloadBox (target, config) {
	this.target = target instanceof jQuery ? target : $(target);
	this.target.find('.mes-loader').remove() // 清空
	this.params = {
		loadingIcon: config.loadingIcon || 'fa-spinner fa-pulse' ,
		errorIcon: config.errorIcon || 'fa-exclamation-circle',
		timeoutIcon: config.timeoutIcon || 'fa-info-circle',
		successIcon: config.successIcon || 'fa-check-circle',

		errorContent: config.errorContent || '错误操作',
		timeoutContent: config.timeoutContent || '链接超时',
		successContent: config.successContent || '操作成功',
		primaryContent: config.primaryContent || '错误操作',
		warningContent: config.warningContent || '没有此类信息，请重新选择或输入',
		infoContent: config.infoContent || '错误操作'
	};
	this.components = {
		icon: {
			loadingIcon: `<span><i class="fa ${this.params.loadingIcon} fa-2x mes-loader-icon"></i></span>`,
			errorIcon: `<span><i class="fa ${this.params.errorIcon} fa-2x mes-loader-icon"></i></span>`,
			timeoutIcon: `<span><i class="fa ${this.params.timeoutIcon} fa-2x mes-loader-icon"></i></span>`,
			successIcon: `<span><i class="fa ${this.params.successIcon} fa-2x mes-loader-icon"></i></span>`
		},
		content: {
			errorContent: `<h4 class="mes-loader-content">${this.params.errorContent}</h4>`,
			timeoutContent: `<h4 class="mes-loader-content">${this.params.timeoutContent}</h4>`,
			successContent: `<h4 class="mes-loader-content">${this.params.successContent}</h4>`,
			primaryContent: `<h4 class="mes-loader-content">${this.params.primaryContent}</h4>`,
			warningContent: `<h4 class="mes-loader-content">${this.params.warningContent}</h4>`,
			infoContent: `<h4 class="mes-loader-content">${this.params.infoContent}</h4>`
		}
	}
	this.compound = {
		loading: `<div class="mes-loader mes-loader-loading hidden">${this.components.icon.loadingIcon}</div>`,
		error: `<div class="mes-loader mes-loader-error hidden">${this.components.icon.errorIcon}${this.components.content.errorContent}</div>`,
		timeout: `<div class="mes-loader mes-loader-timeout hidden">${this.components.icon.timeoutIcon}${this.components.content.timeoutContent}</div>`,
		success: `<div class="mes-loader mes-loader-success hidden">${this.components.icon.successIcon}${this.components.content.successContent}</div>`,
		primaryContent: `<div class="mes-loader mes-loader-primary hidden">${this.components.icon.timeoutIcon}${this.components.content.primaryContent}</div>`,
		warningContent: `<div class="mes-loader mes-loader-warning hidden">${this.components.icon.successIcon}${this.components.content.warningContent}</div>`,
		infoContent: `<div class="mes-loader mes-loader-info hidden">${this.components.icon.timeoutIcon}${this.components.content.infoContent}</div>`,
	}

	this.target.addClass('relative');
	for (let keys in this.compound) {
		this.target.append(this.compound[keys])
	}

}

// 公共方法
Object.assign(MesloadBox.prototype, {
	loadingShow: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('show')
			.addClass('hidden')
			.end()
			.children('.mes-loader-loading')
			.removeClass('hidden')
			.addClass('flex-show')
	},
	errorShow: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('show')
			.addClass('hidden')
			.end()
			.children('.mes-loader-error')
			.removeClass('hidden')
			.addClass('flex-show')

		setTimeout(() => {
			this
				.target
				.children('.mes-loader-error')
				.removeClass('flex-show')
				.addClass('hidden')
		}, 1500)
	},
	timeoutShow: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('show')
			.addClass('hidden')
			.end()
			.children('.mes-loader-timeout')
			.removeClass('hidden')
			.addClass('flex-show')

		setTimeout(() => {
			this
				.target
				.children('.mes-loader-warning')
				.removeClass('flex-show')
				.addClass('hidden')
		}, 1500)
	},
	successShow: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('show')
			.addClass('hidden')
			.end()
			.children('.mes-loader-success')
			.removeClass('hidden')
			.addClass('flex-show')

		setTimeout(() => {
			this
				.target
				.children('.mes-loader-success')
				.removeClass('flex-show')
				.addClass('hidden')
		}, 1500)
	},
		primaryShow: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('show')
			.addClass('hidden')
			.end()
			.children('.mes-loader-primary')
			.removeClass('hidden')
			.addClass('flex-show')

		setTimeout(() => {
			this
				.target
				.children('.mes-loader-primary')
				.removeClass('flex-show')
				.addClass('hidden')
		}, 1500)
	},
	warningShow: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('show')
			.addClass('hidden')
			.end()
			.children('.mes-loader-warning')
			.removeClass('hidden')
			.addClass('flex-show')

		setTimeout(() => {
			this
				.target
				.children('.mes-loader-warning')
				.removeClass('flex-show')
				.addClass('hidden')
		}, 1500)
	},
		infoShow: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('show')
			.addClass('hidden')
			.end()
			.children('.mes-loader-info')
			.removeClass('hidden')
			.addClass('flex-show')

		setTimeout(() => {
			this
				.target
				.children('.mes-loader-info')
				.removeClass('flex-show')
				.addClass('hidden')
		}, 1500)
	},
	hide: function () {
		this
			.target
			.children('.mes-loader')
			.removeClass('flex-show')
			.addClass('hidden')
	}
})

/**
 * @description 弹出框
 *
 * @param {Object} target  需要添加弹框提示的目标
 * @param {Object} config
 */
function MesPopover(target, config) {
	this.publicParams = {
		target: target instanceof jQuery ? target : $(target), // 将传入对象转换为Jquery对象
		themesName: config.themesName || 'warning', // 主题
		themesIcon: config.themesIcon || 'fa-exclamation-triangle', // 主题图标
		title: config.themes, // 标题
		content: config.content || '格式错误，请重新输入',// 内容
		placement: config.placement || 'right'
	}

	var publicParams = this.publicParams,
		target = target instanceof jQuery ? target : $(target);
		target.next('.mes-popover').remove()

	var privateParams = {
		icon: `<i class="fa fa-fw ${publicParams.themesIcon}"></i>`,
		title: function() {
			return publicParams.title == null ? `<h3 class="hide"></h3>` : `<h3 class="mes-popover-title mes-popover-title-${publicParams.themesName}">${publicParams.title}</h3>`;
		},
		arrow: `<div class="mes-arrow mes-arrow-${publicParams.themesName}"></div>`,
		content: function() {
			return `<div class="mes-popover-content">${this.icon}${publicParams.content}</div>`;
		},
		merge: function() {
			return `<div class="mes-popover mes-popover-${publicParams.themesName} bottom">${this.arrow}${this.title()}${this.content()}</div>`;
		}
	}

	target.after(function(index) {
		return privateParams.merge()
	})

}

// 公共方法
MesPopover.prototype = {

	// 显示
	show: function() {
		var targetHeight = this.publicParams.target.outerHeight(),
			targetWidth = this.publicParams.target.outerWidth(),
			targetPositionX = this.publicParams.target.position().left,
			targetPositionY = this.publicParams.target.position().top,
			popover = this.publicParams.target.next('.mes-popover'),
			popoverHeight = popover.outerHeight(),
			popoverWidth = popover.outerWidth(),
			popoverPositionX = targetPositionX + ((targetWidth - popoverWidth) / 2),
			popoverPositionY = targetPositionY + targetHeight;

		this.publicParams.target.next('.mes-popover').css({
			'left': popoverPositionX + 'px', // 设置popover左边距离
			'top': popoverPositionY + 'px', // 设置popover右边距离
			'display': 'block'
		})

	},

	// 隐藏
	hide: function() {
		this.publicParams.target.next('.mes-popover').css({
			'display': 'none'
		})
	}
}

// 原型对象构造函数指向
MesPopover.prototype.constructor = MesPopover



/**
 * @description 分页器
 *
 * @param {Object} target 需要添加弹框提示的目标
 * @param {number} totalPages 总条数
 * @param {number} displayUntil 每页显示条数
 * @param {Object} config 预留接口暂时不用
 */
function MesPagination(target, totalPages, displayUntil, config) {
	this.params = {
		endPage: Math.ceil(totalPages / displayUntil), // 结束页数
		content: {
			prevBtn: '<li class="prevBtn paginationBtn"><a href="javascript:void(0);"><span class="fa fa-angle-left"></span></a></li>',
			nextBtn: '<li class="nextBtn paginationBtn"><a href="javascript:void(0);"><span class="fa fa-angle-right"></span></a></li>',
			pagesBtn: '<li class="pagesBtn paginationBtn"><a href="javascript:void(0);"></a></li>',
			countAllpagesBtn: '<li class="countAllpagesBtn paginationBtn"><a href="javascript:void(0);"></a></li>',
			ellipsisBtn: '<li class="ellipsisBtn paginationBtn"><span class="fa fa-ellipsis-h"></span></li>'
		},
		currentPages: 0,
		pagingEvent: new Event('paging')
	}
	var params = this.params, // 配置
		$JqueryTarget = $(target);  // 转换传入对象为jq

	$JqueryTarget.empty() //清空
	$JqueryTarget.append(params.content.prevBtn); // 添加前一页按钮

	// 总页大于5页执行创建
	if (params.endPage > 5) {
		for (let i = 0; i < 5; i++) {
			$JqueryTarget.append(params.content.pagesBtn); // 添加页码按钮
			$JqueryTarget.children().eq(i+1).find('a').text(i+1) // 添加页码数字

			if (i === 4) {
				$JqueryTarget.append(params.content.ellipsisBtn); // 添加省略按钮
				$JqueryTarget.append(params.content.countAllpagesBtn); // 添加合集页面按钮
				$JqueryTarget.children('.countAllpagesBtn').find('a').text(params.endPage) // 添加合集页面按钮的页码
				$JqueryTarget.append(params.content.nextBtn); // 添加下一页按钮
			}
		}

	}

	// 总页小于5页执行创建
	else {
		for (let i = 0, len = params.endPage; i < len; i++) {
			$JqueryTarget.append(params.content.pagesBtn); // 添加页码按钮
			$JqueryTarget.children().eq(i + 1).find('a').text(i + 1) // 添加页码数字

			if(i === params.endPage - 1) {
				$JqueryTarget.append(params.content.nextBtn); // 添加下一页按钮
			}
		}
	}




	var $paginationItems = $JqueryTarget.children(), // 获取对象list集合
	    $prevPage = $paginationItems.first(), // 上一页按钮
	    $nextPage = $paginationItems.last(), // 下一页按钮
	    $countAllpagesBtn = $JqueryTarget.find('.countAllpagesBtn'), //  // 合集页数按钮
	    $paginationNumItems = $JqueryTarget.find('.pagesBtn').add($countAllpagesBtn), // 获取可点击页码集合
	    $canChangebtn = $JqueryTarget.find('.pagesBtn').not(':first'), // 可变页面合计不含第一个
	    $canChangeAllbtn = $JqueryTarget.find('.pagesBtn'), // 可变页面按钮合计
	    $ellipsisBtn = $JqueryTarget.find('.ellipsisBtn'), // 省略号按钮
	    $lastPageBtn = $canChangebtn.last(), // 最后一个可变页面按钮（非结束页）
	    $firstPageBtn = $canChangebtn.first(); // 最前一个可变页面按钮（非开始页）

	    // 点击页面
	    $paginationNumItems.on('click',function () {
	    	params.currentPages = parseInt($(this).text().trim()); // 获取当前页面
	    	$(this).siblings().removeClass('active'); // 移除兄弟元素的选中效果
	    	$(this).addClass('active'); // 添加选中效果
					//	console.log(params.currentPages);
	    	if(params.currentPages === 1) {
	    		$prevPage.addClass('disabled');

	    		if (params.endPage > $canChangeAllbtn.length) {
	    			$paginationItems.removeClass('hide');
	    			for (let i = 0, len = $canChangebtn.length; i < len; i++) {
	    				$canChangebtn.eq(i).find('a').text(i + 2);
	    			}
					}
	    	}
	    	else {
					$prevPage.removeClass('disabled');
	    	}

	    	if(params.currentPages === params.endPage) {
	    		$nextPage.addClass('disabled');
	    		if (params.endPage > $canChangeAllbtn.length) {
	    			$paginationItems.removeClass('hide');
	    			$ellipsisBtn.addClass('hide')
	    			for (let i = 0, len = $canChangebtn.length; i < len; i++) {
	    				$canChangebtn.eq(i).find('a').text(params.endPage - $canChangebtn.length + i);
	    			}
	    		}
	    	}
	    	else {
	    		$nextPage.removeClass('disabled');
	    	}
	    })

	    // 点击上一页
	    $prevPage.on('click', function() {
	    	if (params.currentPages > 1) {
	    		// 最小可变页面小于当前页执行
	    		if(params.currentPages === parseInt($firstPageBtn.text().trim()) && params.currentPages !== 2  && params.currentPages > $canChangeAllbtn.length) { // 当前页码等于可变页面第一个时执行
	    			$paginationItems.removeClass('hide');
    				for (let i = 0, len = $canChangebtn.length; i < len; i++) {
    					$canChangebtn.eq(i).find('a').text(params.currentPages - $canChangebtn.length + i) // 添加页码
    				}
    				$canChangebtn.eq($canChangebtn.length - 1).trigger('click'); // 模拟点击
	    		}
	    		else if (params.currentPages === params.endPage && params.endPage > ($JqueryTarget.find('.pagesBtn').length)  && params.currentPages > $canChangeAllbtn.length) { // 模拟点击可变页面按钮的最后一个
	    			$canChangebtn.not(function (index) {
	    				return $(this).hasClass('hide');
	    			}).last().trigger('click');
	    		}
	    		else if (params.currentPages === parseInt($firstPageBtn.text().trim()) && params.currentPages < $canChangeAllbtn.length && params.currentPages !== 2) { // 剩余可添加页码数小于可变页码按钮
	    			$paginationItems.removeClass('hide');
	    			for (let i = 0, len = $canChangebtn.length; i < len; i++) {
    					$canChangebtn.eq(i).find('a').text(i + 2) // 添加页码
    				}
	    			$canChangeAllbtn.eq(params.currentPages - 2).trigger('click');
	    		}
	    		else {
	    			$JqueryTarget.find('.active').prev().trigger('click'); // 模拟上一个按钮
	    		}
	    	}
	    })

	    // 点击下一页
	    $nextPage.on('click', function() {

	    	if (params.currentPages < params.endPage) {

	    		// 最大可变页面小于当前页且不是最大页面的前一页执行翻页
	    		if (params.currentPages === parseInt($lastPageBtn.text().trim()) && params.endPage - params.currentPages > 1) {

	    			// 剩余可加载页面数量大于可加载按钮长度时执行翻页
	    			if ((params.endPage - params.currentPages) >= $canChangebtn.length) {
	    				for (let i = 0, len = $canChangebtn.length; i < len; i++) {
	    					$canChangebtn.eq(i).find('a').text(params.currentPages + i +1); // 添加页码
	    				}
	    				$canChangebtn.eq(0).trigger('click'); // 模拟点击

	    				// 如果最大可变页面数是总页数的上一页的话隐藏省略按钮
	    				if (params.endPage - parseInt($lastPageBtn.text().trim()) === 1) {
	    					$ellipsisBtn.addClass('hide')  // 隐藏省略按钮
	    				}
	    			}

	    			// 剩余可加载页面数量小于可加载按钮长度时执行翻页
	    			else if ((params.endPage - params.currentPages) != 1){
	    				$canChangebtn.find('a').empty();
	    				for (let i = 1, len = params.endPage - params.currentPages; i < len; i++) {
	    					$canChangebtn.eq(i - 1).find('a').text(params.currentPages + i);

	    					// 将多余的分页按钮隐藏
	    					if (i === (params.endPage - params.currentPages -1)) {
	    						$canChangebtn.eq(i - 1).nextUntil('.countAllpagesBtn').addClass('hide')
	    					}
	    				}
	    				$canChangebtn.eq(0).trigger('click'); // 模拟点击
	    			}
	    		}
	    		else {
	    			// 非倒数第二页时点击执行
	    			if (params.endPage - params.currentPages > 1 || params.endPage <= ($JqueryTarget.find('.pagesBtn').length)) {
	    				$JqueryTarget.find('.active').next().trigger('click'); // 模拟点击下一个按钮
	    			}

	    			// 倒数第二页时点击执行
	    			else {
	    				$JqueryTarget.find('.countAllpagesBtn').trigger('click'); // 模拟总页数按钮
	    			}

	    		}
	    	}
	    })

	    $paginationNumItems.first().trigger('click'); // 模拟点击第一页

}


// 公共方法
MesPagination.prototype = {
	currentPages: function () {
		return this.params.currentPages
	}
}

MesPagination.prototype.constructor = MesPagination;


/**
 * @description 竖向表格添加内容和分页器
 *
 * @param {Object} target
 * @param {Object} config
 */
function mesVerticalTableAddData(target, config) {
	var target = target instanceof jQuery ? target : $(target), // 传入的panel对象
		paginationTarget = target.find('.pagination'), // 分页器父级元素
		tableTarget = target.find('table'), // 表格对象
		tbodyTarget = tableTarget.find('tbody'), // 表格主体
		returnHeadnum,
		mesloadBox = new MesloadBox (target, {}); // 加载提示

	var param = {
		// 表头
		thead: {
			theadContent: config.thead.theadContent.split('/'),
			theadWidth: config.thead.theadWidth.split('/')
		},

		// 表格主体
		tbody: {
			html: config.tbody ? config.tbody.html : null,
			dataAddress: config.tbody ? config.tbody.dataAddress : null
		},

		// 分页器
		pagination: {
			totalRow: config.pagination ? config.pagination.totalRow : null,
			displayRow: config.pagination ? config.pagination.displayRow : null
		},

		// ajax
		ajax: {
			url: config.ajax.url,
			dataType: config.ajax.urdataTypel || 'json',
			type: config.ajax.type || 'POST',
			dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
			async: config.ajax.async || true,
			data: config.ajax.data,
			timeout: 3000,
			beforeSend: config.ajax.beforeSend || function (xml) { // ajax发送前
				mesloadBox.hide()
				mesloadBox.loadingShow()
			},
			success: config.ajax.success || function (result) { // 成功
				mesloadBox.hide()
				param.tbody.dataAddress(tbodyTarget, param.tbody.html, result)
			},
			error: config.ajax.error || function () { // 错误
				mesloadBox.errorShow()
			},
			complete: config.ajax.complete || function (xhr, status) { // ajax完成后
				if(status === 'timeout'){
			 　　	mesloadBox.timeoutShow()
			　　}
			}
		}
	}
	var theadParam = param.thead,
		tbody = param.tbody,
		pagination = param.pagination,
		ajax = param.ajax

	// 添加表头数据
	function addtheadData() {
		let theadTarget = target.find('thead')

		theadTarget.empty(); // 清空表头
		theadTarget.append(`<tr></tr>`); // 添加表头行

		let theadTr = theadTarget.children('tr'); // 找到表头中的tr

		//添加表头内容
		theadParam.theadContent.forEach((value, index) => {
			theadTr.append(`<th style="width: ${theadParam.theadWidth[index]};">${value}</th>`);
		});
	}
	addtheadData()

	if (paginationTarget != null) {
		// 添加分页器
	var mesPagination = new MesPagination(paginationTarget, pagination.totalRow, pagination.displayRow),
		canClickBtn = paginationTarget.find('.countAllpagesBtn').add(paginationTarget.find('.pagesBtn'));

	// 添加点击事件
	canClickBtn.on('click', function () {
		let currentPages = mesPagination.currentPages();

		headNum = (currentPages, displayRow) => {
			return (currentPages * displayRow) - displayRow + 1
		}
		// console.log('headNum:' + headNum(currentPages, pagination.displayRow))
		ajax.data.headNum = headNum(currentPages, pagination.displayRow)
		headNumReturn = ajax.data.headNum;
		$.ajax({
			url: ajax.url,
			dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
			type: ajax.type,
			async: ajax.async,
			data: ajax.data,
			timeout: ajax.timeout,
			beforeSend: ajax.beforeSend,
			success: ajax.success
		});

	})
	canClickBtn.first().trigger('click'); // 模拟点击第一个
	}

}

/**
 * @description 横向表格添加数据
 *
 * @param {Object} target
 * @param {Object} result
 * @param {Object} config
 */
function mesHorizontalTableAddData(target, result, config) {
	let tbodyTarget = target.find('tbody'),
		thead = config.thead.split('/'),
		tableWitch = (config.tableWitch || '15%/18.3%').split('/'),
		viewColGroup = config.viewColGroup || 3,
		importData = config.importData, // 添加动态数据
		importStaticData = config.importStaticData; // 添加静态数据

	tbodyTarget.empty() // 清空数据
	for (let i = 0, len = Math.ceil((thead.length / viewColGroup)); i < len; i++) {
		tbodyTarget.append('<tr></tr>')
		for (let i = 0, len = viewColGroup; i < len; i++) {
			tbodyTarget.children().last().append(`<th style="width:${tableWitch[0]}"></th><td style="width:${tableWitch[1]}"></td>`)
		}
	}

	let tbodyTh = tbodyTarget.find('th'),
		tbodyTd = tbodyTarget.find('td')

	// 添加表头信息
	for(let i = 0, len = thead.length; i < len; i++) {
		tbodyTh.eq(i).html(thead[i])
	}

	if(result != null) {
		importData(tbodyTd, thead.length, result) //添加数据
	}

	if(importStaticData != null) {
		importStaticData(tbodyTd, thead.length)
	}
}

/**
 * @description 添加表格行数据
 *
 * @param {Object} addDataTarget
 * @param {Object} result
 * @param {Object} currentTrImportData
 * @param {Object} config ({
 *					html: [],
 *					dataAddress: () => {}
 * 				})
 */
function mesAddTrData(addDataTarget, result, config) {
	config.dataAddress(addDataTarget, result, config)
}

/**
 * @description 顶部一级导航条添加内容与连接
 *
 */

(function () {
	let oNavbarContainer = document.querySelector('#mainRightTopMenu .menu-navbar .swiper-container .swiper-wrapper'),
		docFrag = document.createDocumentFragment(),
		moduleContents = [
			{
				moduleName: '系统管理',
				moduleHref: 'seting.html'
			},
			{
				moduleName: '设备管控',
				moduleHref: 'devices.html'
			},
			{
				moduleName: '仓储管理',
				moduleHref: 'warehouse-management.html'
			},
			{
				moduleName: '工艺管理',
				moduleHref: 'control.html'
			},
			{
				moduleName: '生产计划',
				moduleHref: 'productionPlan-lishizhi.html'
			},
			{
				moduleName: '生产执行',
				moduleHref: 'workOrderManage.html'
			},
			{
				moduleName: '生产过程',
				moduleHref: 'productionProcess.html'
			},
			{
				moduleName: '质量管控',
				moduleHref: 'qualityManagement.html'
			},
			{
				moduleName: '报表管理',
				moduleHref: 'reportForms.html'
			},
			{
				moduleName: '看板管理',
				//moduleHref: '../../mes/DataScreen/index.html#/index/dataScreen/positive' //Nginx服务器使用
				moduleHref: 'spectaculars.html'
			},
			{
				moduleName: '追溯模块',
				moduleHref: 'retrospect.html'
			},
			{
				moduleName: 'SPC',
				moduleHref: 'spcModule.html'
			}
		];
	// 添加内容
	oNavbarContainer.innerHTML = ''; // 清空内容
	moduleContents.forEach((value, index) => {
		let div = document.createElement('div'),
			a = document.createElement('a');

		div.classList.add('swiper-slide');
		a.href = value.moduleHref;
		a.textContent = value.moduleName;
		if (index === 9) {	//判断打开看板新窗口
			a.setAttribute('target','_blank')
		}
		div.appendChild(a);

		docFrag.appendChild(div);
	})
	oNavbarContainer.appendChild(docFrag);

	// 给主导航按钮添加选中class
	let oSwiperSlideList = oNavbarContainer.querySelectorAll('.swiper-slide a'),
		modalName = document.querySelector('#mainLeft .sidebar-nav-header').textContent.trim(),
		swiperSlideText = '';

	for (let i = 0, len = oSwiperSlideList.length; i < len; i++) {
		swiperSlideText = oSwiperSlideList.item(i).textContent.trim();
		if (modalName === swiperSlideText) {
			oSwiperSlideList.item(i).classList.add('slide-active');
			break
		}
	}
	$('.swiper-slide a').click(function(){
		var a = $(this).attr('href')
		if(a =='#javascript'){
			swal({
				title: '您好！此功能暂未开放使用！',
				timer: 1000,
				type: 'info',
				showConfirmButton: false,
			})
		}
	})

}());


	// 数组去重
	function unique(arr) {
		var newArr = [arr[0]];
　　 for(var i=1;i<arr.length;i++){
　　　　if(newArr.indexOf(arr[i]) == -1){
				newArr.push(arr[i]);
	　　  }
			}
			return newArr;
	}

	//后续修改的bug
	$('.treeview>a:first-child').click(function(){
		$('.treeview>a:first-child').removeClass('treeview-active')
		$(this).addClass('treeview-active')
	})

