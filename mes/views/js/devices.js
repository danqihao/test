
$(function () {
	let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
		RightContent = $('#mainRightContent'), // 右侧内容栏
		RightContentSwiper = RightContent.find('.swiper-wrapper'), // 右侧内容栏下的swiper
		leftNavLink = leftNav.find('a').filter('[href^="#"]'), // 左侧变栏对应的swiper
		mainModal_1 = $('#modalBox').find('#mainModal_1'), // 主要模态框1
		dataDetailsModal = $('#dataDetailsModal'),	// 详情模态框1
		submitModelModal = $('#submitModelModal'),	// 表单提交模态框1
		submitModelModal2 = $('#submitModelModal2'),	// 表单提交模态框2
		timer = null,																	// 设备状况定时器,第一页使用
		timer3 = null,																	// 设备状况定时器,模态框使用
		devicesTypeList = [];//设备类型集合

			/**
			 * @description :获取设备类型集合,因为要先获取数据,所有设为同步
			 */
			(function loadDevicesType() {
				$.ajax({
					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
					url: queryDevicesTypesUrl,
					async:false,
					success: function (result, status, xhr) {
						if (result.status === 0) {
							devicesTypeList = result.map.devices_control_devices_type
						}
						else {
							swallFail();	//操作失败
						}
					}
				})
			}());

	/**
	 * @description :根据设备类型集合生成设备类型下拉选项
	 * @param target: select元素对象
	 */
		function createDevicesTypeSelect(target) {
			target.empty()
			target.append(`<option value="">全部类型</option>`);

			//如果没有设备类型,下拉选设为不可选
			//  devicesTypeList.length < 1 ? target.attr('disabled', true) : target.attr('disabled', false)

			//循环生成设备下拉选
			for (let i = 0, len = devicesTypeList.length; i < len; i++) {
				//设备类型id作为value,名称作为text
				let optionStr = `<option value="${devicesTypeList[i].devices_control_devices_type_id}">${devicesTypeList[i].devices_control_devices_type_name}</option>`;
				target.append(optionStr);
			}

		}

	leftNavLink.on('click', function (event) {
		let targetHref = event.currentTarget.getAttribute('href');

		clearInterval(timer);	// 清除定时器，切换到其它页时清除，不然定时器会一直运行

		switch (targetHref) {
			case '#devicesStatus':	//设备状况内容区域
				(function () {
					let activeSwiper = $('#devicesStatus'), // 右侧外部swiper
						activeSubSwiper = $('#devicesStatusInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						devicesTypeOption = activePanelHeading.find('.devices-type-option'), // 设备类型选项
						devicesStatusOption = activePanelHeading.find('.devices-status-option'), // 设备状态类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						devicesParameterTempData,	//存储设备参数

						deviceTypeId = '',	//按类型查找参数：设备类型id
						deviceName = '',		//模糊查找参数：参数名
						headNum = 1,				//分页查找下标

						currentObject,	//存储当前分页按钮
						lookStatus = 'all',	//用于判断设备状况


						mesloadBox = new MesloadBox(activePanel, { warningContent: '没有此类信息，请重新选择或输入' });

					createDevicesTypeSelect(devicesTypeOption);

					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: url,
							data: data,
							beforeSend: function (xml) {
								// ajax发送前
							},
							success: function (result, status, xhr) {
								// ajax成功

								paginationContainer.show()	//显示分页按钮
								if (result.status === 0) {
									mesVerticalTableAddData(activePanel, {
										thead: {
											// theadContent: '序号/设备名称/设备编号/运行状况/与工控机连接状况/参数一名称：值(单位)/参数二名称：值(单位)/参数三名称：值(单位)/参数四名称：值(单位)/参数五名称：值(单位)/操作',
											theadContent: '序号/设备名称/设备编号/运行状况/参数一名称：值(单位)/参数二名称：值(单位)/参数三名称：值(单位)/参数四名称：值(单位)/参数五名称：值(单位)/操作',
											theadWidth: '4%/7%/7%/7%/7%/9%/9%/9%/9%/9%/9%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link parameterDetail" data-toggle-modal-target="#moreParameterModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>参数详情</a>' +
												'<a class="table-link devicesHistoryStatus"  data-toggle-modal-target="#moreParameterModal2" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>历史参数</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.resultList, // 主要数据列表
													theadTarget = tbodyTarget.siblings('thead'),
													thTarget = theadTarget.find('tr th'),
													thTargetBtn = thTarget.eq(3),
													tempData = null, // 表格td内的临时数据

													tempStr = `
														<select class="form-control table-input input-sm lookstatusSelect" >
																		<option value="all">全部</option>
																		<option value="open">开机</option>
																		<option value="close">离线</option>
														</select>
													`;

												thTargetBtn.addClass('table-input-td').empty().append(tempStr)
												thTargetBtn.find('select').val(lookStatus)
												devicesParameterTempData = dataList

												// 查看开机,离线状态切换
												thTargetBtn.find('select').off('change').on('change', function () {
													lookStatus = $(this).val()
													addTableData(getDeviceParametersUrl, {
														headNum: headNum,
														deviceTypeId: deviceTypeId,
														deviceName: deviceName,
														lookStatus: lookStatus
													})
												})


												for (let i = 0, len = dataList.length; i < len; i++) {
													tbodyTarget.append('<tr></tr>'); // 添加行
													let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
														arry = []; //存储分割后的参数字符串

													tempData = dataList[i].devicesParameter

													let devicesStatus = dataList[i].devicesStatus;	//设备状态
													let currentTime = new Date().getTime();	//当前时间
													let saveTime = dataList[i].savaCacheDate;	//参数存缓存时间

													if (tempData !== null) {
														arry = tempData.split(";")	//按“；”分割，分割后的格式为：“参数名：参数值：单位”
													}

													for (let j = 0, len = html.length; j < len; j++) {

														currentTr.append(html[j]); // 添加表格内的HTML
														switch (j) {
															case 0:
																currentTr.children().eq(j).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].devicesName
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].devicesNum
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 3: {
																if (devicesStatus === '开机') {
																	currentTr.children().eq(j).html(devicesStatus).addClass('text-success')
																} else {
																	currentTr.children().eq(j).html('离线')
																}

																// if (saveTime !== null && currentTime - saveTime < 600000) {		//有效参数
																// 	if (devicesStatus === '开机') {
																// 		currentTr.children().eq(j).html(devicesStatus).addClass('text-success')
																// 	} else {
																// 		currentTr.children().eq(j).html('离线')
																// 	}
																// } else {
																// 	currentTr.children().eq(j).html('离线')
																// }

															}
																break;
															// case 4: {
															// 	if (saveTime !== null && currentTime - saveTime < 600000) {		//有效参数
															// 		currentTr.children().eq(j).html('已连接').addClass('text-success')
															// 	} else {
															// 		currentTr.children().eq(j).html('未连接')
															// 	}
															// }
																break;
															case 4: {
																if (devicesStatus === '开机') {	//如果没有参数,隐藏详情按钮
																	let tempStr = '',
																		tempStr2 = '',
																		tempArry = [];	//存储分割后的参数名、参数值、单位

																	if (arry.length > 0) {	//如果参数>=1,取第一个
																		tempStr = arry[0];
																		tempArry = tempStr.split(':');
																		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`	//拼成"参数名:参数值(单位格式)"
																	}
																	currentTr.children().eq(j).html(tempStr2)
																} else {
																	currentTr.children().eq(j).html('')
																}

																// if (devicesStatus === '开机') {	//如果没有参数,隐藏详情按钮
																// 	let tempStr = '',
																// 		tempStr2 = '',
																// 		tempArry = [];	//存储分割后的参数名、参数值、单位

																// 	if (arry.length > 0) {	//如果参数>=1,取第一个
																// 		tempStr = arry[0];
																// 		tempArry = tempStr.split(':');
																// 		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`	//拼成"参数名:参数值(单位格式)"
																// 	}
																// 	if (saveTime !== null && currentTime - saveTime < 600000) {		//参数有效
																// 		currentTr.children().eq(j).html(tempStr2)
																// 	} else {
																// 		currentTr.children().eq(j).html('')
																// 	}

																// } else {	//离线
																// 	currentTr.children().eq(j).html('')
																// }

															}
																break;
															case 5: {
																if (devicesStatus === '开机') {
																	let tempStr = '',
																		tempStr2 = '',
																		tempArry = [];	//存储分割后的参数名、参数值、单位

																	if (arry.length > 1) {	//如果参数>=2,取第二个
																		tempStr = arry[1];
																		tempArry = tempStr.split(':');
																		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																	}
																	currentTr.children().eq(j).html(tempStr2)
																} else {
																	currentTr.children().eq(j).html('')
																}

																// if (devicesStatus === '开机') {
																// 	let tempStr = '',
																// 		tempStr2 = '',
																// 		tempArry = [];	//存储分割后的参数名、参数值、单位

																// 	if (arry.length > 1) {	//如果参数>=2,取第二个
																// 		tempStr = arry[1];
																// 		tempArry = tempStr.split(':');
																// 		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																// 	}
																// 	if (saveTime !== null && currentTime - saveTime < 600000) {		//参数有效
																// 		currentTr.children().eq(j).html(tempStr2)
																// 	} else {
																// 		currentTr.children().eq(j).html('')
																// 	}
																// } else {
																// 	currentTr.children().eq(j).html('')
																// }

															}
																break;
															case 6: {
																if (devicesStatus === '开机') {
																	let tempStr = '',
																		tempStr2 = '',
																		tempArry = [];	//存储分割后的参数名、参数值、单位

																	if (arry.length > 2) {	//如果参数>=3,取第三个
																		tempStr = arry[2];
																		tempArry = tempStr.split(':');
																		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																	}
																	currentTr.children().eq(j).html(tempStr2)
																} else {
																	currentTr.children().eq(j).html('')
																}

																// if (devicesStatus === '开机') {
																// 	let tempStr = '',
																// 		tempStr2 = '',
																// 		tempArry = [];	//存储分割后的参数名、参数值、单位

																// 	if (arry.length > 2) {	//如果参数>=3,取第三个
																// 		tempStr = arry[2];
																// 		tempArry = tempStr.split(':');
																// 		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																// 	}
																// 	if (saveTime !== null && currentTime - saveTime < 600000) {		//参数有效
																// 		currentTr.children().eq(j).html(tempStr2)
																// 	} else {
																// 		currentTr.children().eq(j).html('')
																// 	}
																// } else {
																// 	currentTr.children().eq(j).html('')
																// }

															}
																break;
															case 7: {
																if (devicesStatus === '开机') {
																	let tempStr = '',
																		tempStr2 = '',
																		tempArry = [];	//存储分割后的参数名、参数值、单位

																	if (arry.length > 3) {	//如果参数>=4,取第四个
																		tempStr = arry[3];
																		tempArry = tempStr.split(':');
																		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																	}
																	currentTr.children().eq(j).html(tempStr2)
																} else {
																	currentTr.children().eq(j).html('')
																}

																// if (devicesStatus === '开机') {
																// 	let tempStr = '',
																// 		tempStr2 = '',
																// 		tempArry = [];	//存储分割后的参数名、参数值、单位

																// 	if (arry.length > 3) {	//如果参数>=4,取第四个
																// 		tempStr = arry[3];
																// 		tempArry = tempStr.split(':');
																// 		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																// 	}
																// 	if (saveTime !== null && currentTime - saveTime < 600000) {		//参数有效
																// 		currentTr.children().eq(j).html(tempStr2)
																// 	} else {
																// 		currentTr.children().eq(j).html('')
																// 	}
																// } else {
																// 	currentTr.children().eq(j).html('')
																// }

															}
																break;
															case 8: {
																if (devicesStatus === '开机') {
																	let tempStr = '',
																		tempStr2 = '',
																		tempArry = [];	//存储分割后的参数名、参数值、单位

																	if (arry.length > 4) {	//如果参数>=5,取第五个
																		tempStr = arry[4];
																		tempArry = tempStr.split(':');
																		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																	}
																	currentTr.children().eq(j).html(tempStr2)
																} else {
																	currentTr.children().eq(j).html('')
																}

																// if (devicesStatus === '开机') {
																// 	let tempStr = '',
																// 		tempStr2 = '',
																// 		tempArry = [];	//存储分割后的参数名、参数值、单位

																// 	if (arry.length > 4) {	//如果参数>=5,取第五个
																// 		tempStr = arry[4];
																// 		tempArry = tempStr.split(':');
																// 		tempStr2 = `${tempArry[0]}：${tempArry[1]}(${tempArry[2]})`
																// 	}
																// 	if (saveTime !== null && currentTime - saveTime < 600000) {		//参数有效
																// 		currentTr.children().eq(j).html(tempStr2)
																// 	} else {
																// 		currentTr.children().eq(j).html('')
																// 	}
																// } else {
																// 	currentTr.children().eq(j).html('')
																// }

															}
																break;
															case 9: {
																if (arry.length === 0 || devicesStatus !== '开机') {	//如果没有参数,隐藏详情按钮
																	currentTr.children().eq(j).find('.parameterDetail').hide()
																}

																// if (saveTime !== null && currentTime - saveTime < 600000) { 	//有效参数
																// 	if (arry.length === 0 || devicesStatus !== '开机') {	//如果没有参数,隐藏详情按钮
																// 		currentTr.children().eq(j).find('.parameterDetail').hide()
																// 	}
																// } else {
																// 	currentTr.children().eq(j).find('.parameterDetail').hide()
																// }

																//检测模态框是否关闭,当关闭的时候清除定时器
																$('#moreParameterModal').add($('#moreParameterModal2')).on('hidden.bs.modal', function () {
																	clearInterval(timer3);
																})

																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	 let deviceId = dataList[currentTr.index()].devicesID,	//设备id
																		 dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	 switch (dataContent) {
																		 case '#moreParameterModal': {

																				 let dataContent = $('#moreParameterModal'),
																					 panelList = dataContent.find('.panel'),
																					 modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					 panelTbody = panelList.find('tbody'),
																					 tempData = null,	// 表格td内的临时数据
																					 arry = []; //存储分割后的参数字符串

																			 	//生成更多参数表格
																				 function showMoreParameter() {

																						 panelTbody.empty()

																						 tempData = devicesParameterTempData[i].devicesParameter

																						 if (tempData !== null) {
																							 arry = tempData.split(";")	//按“；”分割，分割后的格式为：“参数名：参数值：单位”
																						 }

																						 for (let k = 0, len = arry.length; k < len; k++) {
																							 let trHtml,
																								 tempStr,
																								 tempArry = [];	//存储分割后的参数名、参数值、单位
																							 tempStr = arry[k];

																							 tempArry = tempStr.split(':');
																							 trHtml = `
																										<tr>
																											<td>${k + 1}</td>
																											<td>${tempArry[0]}</td>
																											<td>${tempArry[1]}</td>
																											<td>${tempArry[2]}</td>
																										</tr>
																									`;
																							 panelTbody.append(trHtml)
																						 }

																				 }
																				 showMoreParameter()

																			 //启动定时器,用于刷新页面数据
																			 function startTimer3() {
																				 clearInterval(timer3);	// 清除定时器，启动之前先清除，不然会另起一个
																				 timer3 = setInterval(function () {
																					 showMoreParameter()
																				 }, 2000)
																			 }
																			 startTimer3()


																		 } break;
																		case '#moreParameterModal2': {
																			let dataContent = $('#moreParameterModal2'),
																				panel1 = dataContent.find('.panel'),
																				activePanelHeading1 = panel1.find('.panel-heading'), // 面板1头部
																				fuzzySearchGroup = activePanelHeading1.find('.fuzzy-search-group'),
																				pageSizeSelectBtn = activePanelHeading1.find('.pageSizeSelect'), // 页码选择
																				exportExcelBtn = activePanelHeading1.find('.exportExcel'), // 导出Excel
																				// input_day = activePanelHeading1.find('.day'),							 // 日期输入框
																				input_startTime = activePanelHeading1.find('.startTime'),		// 开始时间段
																				input_endTime = activePanelHeading1.find('.endTime'),				// 结束时间段
																				headingMainBtn_1 = activePanelHeading1.find('.head-main-btn-1'), // 面板1头部主要按键_1,日期搜索
																				headingMainBtn_2 = activePanelHeading1.find('.head-main-btn-2'), // 面板1头部主要按键_2,关键字搜索
																				footerMainBtn_1 = panel1.find('.panel-footer .footerMainBtn_1'), // 面板1底部主要按键_1,上一页
																				footerMainBtn_2 = panel1.find('.panel-footer .footerMainBtn_2'), // 面板1底部主要按键_2,下一页
																				panel1Tbody = panel1.find('table tbody'),
																				paginationContainer = panel1.find('.pagination'),		// 分页ul标签

																				headNum = 1,	//搜索开始下标
																				tailNum = 20,	//页码
																				startTime = moment().format('YYYY-MM-DD 00:00:00'),	//搜索开始时间,格式"YYYY-MM-DD HH:mm:ss
																				endTime = moment().format('YYYY-MM-DD 23:59:59'),		//搜索结束时间,格式"YYYY-MM-DD HH:mm:ss
																				// startTime = '',	//搜索开始时间,格式"YYYY-MM-DD HH:mm:ss
																				// endTime = '',		//搜索结束时间,格式"YYYY-MM-DD HH:mm:ss
																				deviceParameter = '',	//搜索关键字

																				timeObj = {
																					day: '',				// 日期
																					startTime: '',	// 开始时间段
																					endTime: ''			// 结束时间段
																				},

																				mesloadBox = new MesloadBox(panel1, { warningContent: '没有此类信息，请重新选择或输入' })

																			//页面初始化
																			dataContent.find('.modal-header .modal-title').text(`${dataList[currentTr.index()].devicesName}:历史状况及参数`) // 更换panel标题
																			footerMainBtn_1.attr('disabled', true)
																			pageSizeSelectBtn.val('20')
																			 input_startTime.val(startTime)
																			 input_endTime.val(endTime)
																			fuzzySearchGroup.find('input').val('')
																			panel1Tbody.empty()
																		  // panel1Tbody.html(NO_DATA_NOTICE3)
																			footerMainBtn_1.hide()	//隐藏分页按钮
																			footerMainBtn_2.hide()	//隐藏分页按钮

																			//进入页面后加载数据
																			loadHistoryParameters(
																				deviceId,	//设备id
																				headNum,	//搜索开始下标
																				tailNum,	//页码
																				startTime,	//搜索开始时间,格式"YYYY-MM-DD hh:mm:ss
																				endTime,		//搜索结束时间,格式"YYYY-MM-DD hh:mm:ss
																				deviceParameter	//搜索关键字
																			)

																			// 页码选择
																			pageSizeSelectBtn.off('change').on('change', function (event) {
																				let val = $(this).val();

																				tailNum = parseInt(val)	//获取页面
																				headNum = 1	//重置分页下标为1

																			loadHistoryParameters(
																				deviceId,	//设备id
																				headNum,	//搜索开始下标
																				tailNum,	//页码
																				startTime,	//搜索开始时间,格式"YYYY-MM-DD hh:mm:ss
																				endTime,		//搜索结束时间,格式"YYYY-MM-DD hh:mm:ss
																				deviceParameter	//搜索关键字
																			)
																			});

																			// 导出Excel
																			exportExcelBtn.off('click').on('click', function (event) {

																				let headNum =1,
																					tailNum = '',
																				deviceParameter = ''
																					// startTime = '',
																					// endTime = '',

																				if (startTime === '' || endTime === '' ) {
																					swal({
																						title: '请先选择时间段并点击搜索',
																						type: 'warning',
																						text: '注意选择合理的日期范围',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: false, // 显示用户取消按钮
																						confirmButtonText: '确定',
																					})
																				} else {
																					startTime = `${timeObj.day} ${timeObj.startTime}`;
																					endTime = `${timeObj.day} ${timeObj.endTime}`;

																					promise = new Promise(function (resolve, reject) {
																						  selectUpkeepProjectAddData2(deviceId,headNum,tailNum,startTime,endTime,deviceParameter)
																					});

																				}

																			});
																			// 开始日期失去焦点事件
																			input_startTime.off('blur').on('blur', function (event) {
																				timeObj.startTime = $(this).val()
																			 })
																			//结束日期失去焦点事件
																			input_endTime.off('blur').on('blur', function (event) {
																				timeObj.endTime = $(this).val()
																			})

																			// 日期搜索组加载数据
																			 headingMainBtn_1.off('click').on('click', function (event) {
																				event.stopPropagation() // 禁止向上冒泡
																				timeObj.startTime = $(this).closest('.input-group').find('.startTime').val()
																				timeObj.endTime = $(this).closest('.input-group').find('.endTime').val()
																				 headNum = 1	//重置分页下标为1
																				footerMainBtn_1.attr('disabled', true)

																				if ( timeObj.startTime !== '' && timeObj.endTime !== '') {
																					startTime = ` ${timeObj.startTime}`;	//拼成"YYYY-MM-DD hh:mm:ss"格式
																					endTime = ` ${timeObj.endTime}`;	//拼成"YYYY-MM-DD hh:mm:ss"格式
																					mesloadBox.loadingShow()
																					$.ajax({
																						type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																						url: getHistoryParametersUrl,
																						data: {
																							"deviceId": deviceId,
																							"headNum": headNum,
																							"tailNum": tailNum,
																							"startTime": startTime,
																							"endTime": endTime,
																							"deviceParameter": deviceParameter
																						},
																						success: function (result, status, xhr) {
																							if (result.status === 0) {
																								mesloadBox.hide()
																								footerMainBtn_1.show()	//显示分页按钮
																								footerMainBtn_2.show()	//显示分页按钮
																								exportExcelBtn.attr('disabled', false)
																								let dynamicAcquisitionList = result.map.historyParameters.dynamicAcquisitions;
																								if (dynamicAcquisitionList.length < tailNum) {	//如果条数小于页码,下一页不可点击
																									footerMainBtn_2.attr('disabled', true)
																								} else {
																									footerMainBtn_2.attr('disabled', false)
																								}
																								createHistoryParametersList(dynamicAcquisitionList);
																							}
																							else {
																								panel1Tbody.empty().append(NO_DATA_NOTICE)
																								footerMainBtn_1.hide()	//隐藏分页按钮
																								footerMainBtn_2.hide()	//隐藏分页按钮
																								exportExcelBtn.attr('disabled', true)
																								mesloadBox.warningShow()
																							}
																						}
																					})
																				}

																			});

																			// 模糊搜索组加载数据
																			headingMainBtn_2.off('click').on('click', function (event) {
																				deviceParameter = $(this).closest('.input-group').find('input').val().replace(/\s/g, "")
																				event.stopPropagation() // 禁止向上冒泡
																				headNum = 1	//重置分页下标为1
																				footerMainBtn_1.attr('disabled', true)

																				if (deviceParameter !== '') {
																					loadHistoryParameters(
																						deviceId,
																						headNum,
																						tailNum,
																						startTime,
																						endTime,
																						deviceParameter
																					)
																				} else {
																					startTime = ''
																					endTime = ''
																					// input_day.val('')
																					input_startTime.val('')
																					input_endTime.val('')
																					loadHistoryParameters(
																						deviceId,
																						headNum,
																						tailNum,
																						startTime,
																						endTime,
																						deviceParameter
																					)
																				}
																					//清空搜索框并获取焦点
																				// $(this).closest('.input-group').find('input').focus().val('')

																			});

																			// 模糊搜索回车搜索
																			fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
																				if (event.keyCode === 13) {
																					event.preventDefault()
																					$(this).closest('.input-group').find('button').trigger('click')
																				}
																			});

																			//上一页
																			footerMainBtn_1.off('click').on('click', function (event) {
																				headNum = headNum - tailNum
																				footerMainBtn_2.attr('disabled', false)
																				if (headNum <= 1) {
																					footerMainBtn_1.attr('disabled', true)
																				}
																				if (headNum < 1) {
																					headNum = 1
																				}
																				loadHistoryParameters(
																					deviceId,
																					headNum,
																					tailNum,
																					startTime,
																					endTime,
																					deviceParameter
																				)

																			})

																			//下一页
																			footerMainBtn_2.off('click').on('click', function (event) {
																				headNum = headNum + tailNum
																				footerMainBtn_1.attr('disabled', false)
																				//加载设备历史状况
																					mesloadBox.loadingShow()
																					$.ajax({
																						type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																						url: getHistoryParametersUrl,
																						data: {
																							"deviceId": deviceId,
																							"headNum": headNum,
																							"tailNum": tailNum,
																							"startTime": startTime,
																							"endTime": endTime,
																							"deviceParameter": deviceParameter
																						},
																						success: function (result, status, xhr) {
																							if (result.status === 0) {
																								mesloadBox.hide()
																								footerMainBtn_1.show()	//显示分页按钮
																								footerMainBtn_2.show()	//显示分页按钮
																								let dynamicAcquisitionList = result.map.historyParameters.dynamicAcquisitions;
																								if (dynamicAcquisitionList.length < tailNum) {
																									footerMainBtn_2.attr('disabled', true)
																								} else {
																									footerMainBtn_2.attr('disabled', false)
																								}
																								createHistoryParametersList(dynamicAcquisitionList);
																							}
																							else {
																								mesloadBox.warningShow()
																								headNum = headNum - tailNum	//没有数据的时候吧下标置回之前页
																							}
																						}
																					})

																			})

																			//加载设备历史状况
																			function loadHistoryParameters(deviceId, headNum, tailNum, startTime, endTime, deviceParameter) {
																				mesloadBox.loadingShow()
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: getHistoryParametersUrl,
																					data: {
																						"deviceId": deviceId,
																						"headNum": headNum,
																						"tailNum": tailNum,
																						"startTime": startTime,
																						"endTime": endTime,
																						"deviceParameter": deviceParameter
																					},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							mesloadBox.hide()
																							footerMainBtn_1.show()	//显示分页按钮
																							footerMainBtn_2.show()	//显示分页按钮

																							exportExcelBtn.attr('disabled', false)
																							let dynamicAcquisitionList = result.map.historyParameters.dynamicAcquisitions;
																							if (dynamicAcquisitionList.length < tailNum) {
																								footerMainBtn_2.attr('disabled',true)
																							} else {
																								footerMainBtn_2.attr('disabled', false)
																							}
																							createHistoryParametersList(dynamicAcquisitionList);
																						}
																						else {
																							panel1Tbody.empty().append(NO_DATA_NOTICE)
																							footerMainBtn_1.hide()	//隐藏分页按钮
																							footerMainBtn_2.hide()	//隐藏分页按钮
																							mesloadBox.warningShow()
																							exportExcelBtn.attr('disabled', true)
																						}
																					}
																				})
																			}

																			//创建设备历史状况列表
																			 function createHistoryParametersList(list) {

																				 let tempList1 = [];
																				//遍历出采集时间,根据采集时间去重分组,相同的时间表示是设备一次发送过来的数据
																				 for (let i = 1; i < list.length; i++) {
																					 tempList1.push(list[i].dynamic_acquisition_time)
																				 }
																				 tempList1 = [...new Set(tempList1)]	//去重
																				 let dataList1 = [];
																				 dataList1.length = tempList1.length	//共多少组

																				//生成空的二维数组,第一为存储共多少组,第二维存储每组有多少参数
																				 for (let i = 0, len = dataList1.length; i < len; i++) {
																					 dataList1[i]=[]
																				 }

																				 for (let k = 0; k < list.length; k++) {
																							 for (let i = 0, len = dataList1.length; i < len; i++) {
																								 if (tempList1[i] == list[k].dynamic_acquisition_time) {
																									 dataList1[i].push(list[k])
																									 break
																								 }
																							  }
																				 }


																				let dataContent = $('#moreParameterModal2'),
																					panel1 = dataContent.find('.panel'),
																					panel1Tbody = panel1.find('table tbody'),
																					index = parseInt(headNum)

																				 panel1Tbody.empty();


																				 let tempStr = '';

																				 for (let i = 0, len = dataList1.length; i < len; i++) {	//行
																					 tempStr += '<tr>';
																					 tempStr += `<td rowspan="${dataList1[i].length}" style="vertical-align: middle">${i + 1}</td>`;
																					 tempStr += `<td>${dataList1[i][0].dynamic_acquisition_parameter}</td>`;
																					 tempStr += `<td>${dataList1[i][0].dynamic_acquisition_data}</td>`;
																					 tempStr += `<td>${dataList1[i][0].dynamic_acquisition_parameter_unit}</td>`;
																					 tempStr += `<td rowspan="${dataList1[i].length}" style="vertical-align: middle">${moment(dataList1[i][0].dynamic_acquisition_time).format('YYYY-MM-DD HH:mm:ss')}</td>`;
																					 tempStr += `<td rowspan="${dataList1[i].length}" style="vertical-align: middle">${dataList1[i][0].dynamic_acquisition_devices_status}</td>`;
																					 tempStr += `<td></td>`;
																					 tempStr += '</tr>';
																					 for (let j = 1, len = dataList1[i].length; j < len; j++) {	//列
																						 tempStr += '<tr>';
																						 tempStr += `<td>${dataList1[i][j].dynamic_acquisition_parameter}</td>`;
																						 tempStr += `<td>${dataList1[i][j].dynamic_acquisition_data}</td>`;
																						 tempStr += `<td>${dataList1[i][j].dynamic_acquisition_parameter_unit}</td>`;
																						//  tempStr += `<td>${moment(dataList1[i][j].dynamic_acquisition_time).format('YYYY-MM-DD HH:mm:ss')}</td>`;
																						//  tempStr += `<td>${dataList1[i][j].dynamic_acquisition_devices_status}</td>`;
																						 tempStr += `<td></td>`;
																					 }

																					 tempStr += '</tr>';

																				 }
																				 panel1Tbody.append(tempStr)

																				//  let tempStr = '';
																				//  tempStr += '<tr>';
																				//  tempStr += `<th>序号</th>`;
																				//  for (let j = 0, len = dataList1[0].length; j < len; j++) {	//表头
																				// 	 tempStr += `<th>${dataList1[0][j].dynamic_acquisition_parameter}</th>`;
																				//  }
																				//  tempStr += `<th>设备状态</th>`;
																				//  tempStr += `<th>采集时间</th>`;
																				//  tempStr += `<th>备注</th>`;
																				//  tempStr += '</tr>';
																				//  for (let i = 0, len = dataList1.length; i < len; i++) {	//行
																				// 	 tempStr += '<tr>';
																				// 	 tempStr += `<td>${i + 1}</td>`;
																				// 	 for (let j = 0, len = dataList1[i].length; j < len; j++) {	//列
																				// 		 tempStr += `<td>${dataList1[i][j].dynamic_acquisition_data}(${dataList1[i][j].dynamic_acquisition_parameter_unit})</td>`;
																				// 	 }
																				// 	 tempStr += `<td>${dataList1[i][0].dynamic_acquisition_devices_status}</td>`;
																				// 	 tempStr += `<td>${moment(dataList1[i][0].dynamic_acquisition_time).format('YYYY-MM-DD HH:mm:ss')}</td>`;
																				// 	 tempStr += `<td></td>`;

																				// 	 tempStr += '</tr>';

																				//  }
																				//  panel1Tbody.append(tempStr)

																				// for (let i = 0, len = list.length; i < len; i++) {
																				// 	let
																				// 		tempStr = `
																				// 		<tr>
																				// 			<td>${index+i}</td>
																				// 			<td>${list[i].dynamic_acquisition_parameter}</td>
																				// 			<td>${list[i].dynamic_acquisition_data}</td>
																				// 			<td>${list[i].dynamic_acquisition_parameter_unit}</td>
																				// 			<td>${moment(list[i].dynamic_acquisition_time).format('YYYY-MM-DD HH:mm:ss')}</td>
																				// 			<td>${list[i].dynamic_acquisition_devices_status}</td>
																				// 			<td></td>
																				// 		</tr>
																				// 	`;
																				// 	panel1Tbody.append(tempStr)
																				// }
																			}

																		}
																			break;

																		default:
																			break;
																	}
																})
															}
															break;

															default:
																break;
														}
													}
												}
											}
										},

										pagination: {
											totalRow: result.map.count, // 总行数
											displayRow: result.map.resultList.length // 显示行数
										},

										ajax: {
											url: url,
											data: data,
											beforeSend: function (xml) { // ajax发送前
												mesloadBox.hide()
											}
										}
									})

								}
								else {
									clearInterval(timer);	// 清除定时器
									panelTbody.empty().append(NO_DATA_NOTICE)
									paginationContainer.hide()	//隐藏分页按钮
									mesloadBox.warningShow();
								}
							}
						})
					}
					// 导航栏点击时运行数据加载
					addTableData(getDeviceParametersUrl, {
						headNum: headNum,
						deviceTypeId: deviceTypeId,
						deviceName: deviceName,
						lookStatus: lookStatus
					})

					//获取当前分页按钮
					$('#devicesStatusInerSwiper').off('click').on('click', '.pagination .paginationBtn', function (event) {
						event.stopPropagation();
						let $this = $(this);	//当前jQuery对象

						if ($this.hasClass('active')) {	//找到当前点击的按钮
							currentObject = $this
						}
					})

					//启动定时器
					function startTimer() {
						clearInterval(timer);	// 清除定时器，启动之前先清除，不然会另起一个
						timer = setInterval(function () {
							currentObject.trigger('click')	//模拟点击当前分页按钮
						}, 5000)
					}
					startTimer()

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						deviceName = $(this).closest('.input-group').find('input').val()
						deviceTypeId = '';
						event.stopPropagation() // 禁止向上冒泡

						if (deviceName !== '') {
							addTableData(getDeviceParametersUrl, {
								headNum: headNum,
								deviceTypeId: deviceTypeId,
								deviceName: deviceName,
								lookStatus: lookStatus
							})
						} else {
							addTableData(getDeviceParametersUrl, {
								headNum: headNum,
								deviceTypeId: deviceTypeId,
								deviceName: deviceName,
								lookStatus: lookStatus
							})
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
						}

					});

					// 设备类型下拉选事件
					devicesTypeOption.change(function () {
						deviceTypeId = $(this).val();
						deviceName = '';
						addTableData(getDeviceParametersUrl, {
							headNum: headNum,
							deviceTypeId: deviceTypeId,
							deviceName: deviceName,
							lookStatus: lookStatus
						})
					})

					// 设备状态下拉选事件
					// devicesStatusOption.change(function () {
					// 	lookStatus = $(this).val();
					// 	deviceName = '';
					// 	addTableData(getDeviceParametersUrl, {
					// 		headNum: headNum,
					// 		deviceTypeId: deviceTypeId,
					// 		deviceName: deviceName,
					// 		lookStatus: lookStatus
					// 	})
					// })


				}())
				break;
			case '#devicesLedger':	//设备台账内容区域
				(function () {
					let activeSwiper = $('#devicesLedger'), // 右侧外部swiper
						activeSubSwiper = $('#devicesLedgerInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1,设备类型管理
						headingMainBtn_2 = activePanelHeading.find('.head-main-btn-2'), // 头部主要按键_2，新增设备
						headingMainBtn_3 = activePanelHeading.find('.head-main-btn-3'), // 头部主要按键_3，导出Excel

						devicesTypeOption = activePanelHeading.find('.devices-type-option'), // 类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})
					createDevicesTypeSelect(devicesTypeOption);
					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: url,
							data: data,
							beforeSend: function (xml) {
								// ajax发送前
								mesloadBox.loadingShow()
							},
							success: function (result, status, xhr) {
								// ajax成功
								paginationContainer.show()	//显示分页按钮
								mesloadBox.hide()
								if (result.status === 0) {
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/设备名称/设备编号/供应商/购入时间/使用时间/设备状态/操作',
											theadWidth: '5%/15%/10%/10%/10%/10%/10%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td">' +
												'<a class="table-link editDevices" href="javascript:;" data-toggle-modal-target="#submitModelModal"><i class="fa fa-tasks fa-fw"></i>编辑</a>' +
												'<a class="table-link text-danger deleteDevices" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.devices, // 主要数据列表
													tempData = null; // 表格td内的临时数据

												for (let i = 0, len = dataList.length; i < len; i++) {
													tbodyTarget.append('<tr></tr>'); // 添加行
													let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
													for (let j = 0, len = html.length; j < len; j++) {
														currentTr.append(html[j]); // 添加表格内的HTML
														switch (j) {
															case 0:
																currentTr.children().eq(j).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].devices_control_devices_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].devices_control_devices_number;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].devices_control_devices_supplier;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 4: {
																tempData = dataList[currentTr.index()].devices_control_devices_purchase_date;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 5: {
																tempData = dataList[currentTr.index()].devices_control_devices_use_date;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 6: {
																tempData = dataList[currentTr.index()].devices_control_devices_status_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 7:
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		devicesId = dataList[currentTr.index()].devices_control_devices_id,
																		computerIP = dataList[currentTr.index()].industrial_personal_computer_IP

																	switch (dataContent) {
																		case '#submitModelModal': {

																			let dataContent = submitModelModal,
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
																				submission = dataContent.find('.modal-footer'),
																				submissionBtn = submission.find('.modal-submit'),

																				// 表单要提交的数据
																				submithData = {
																					devicesTypeId: '',	//设备类型
																					devicesName: '',	//设备名称
																					devicesNumber: '',	//设备编号
																					fdevicesCode: '', //设备条码
																					devicesSupplier: '',	//供应商
																					devicesBrand: '',	//品牌
																					devicesPurchaseDate: '',	//购买日期
																					devicesUseDate: '',	//使用日期
																					statusName: '',	//设备状态
																					devicesIP: '',	//设备IP地址
																					computerIP: '',	//工控机IP地址
																					devicesDescribe: '',	//设备描述

																					deptId: '',	//所属部门
																					devicesSite: '',	//设备存放位置
																					operator: '',	//操作人员
																					custodian: '',	//管理人
																					respible: ''	//责任人
																				};
																				//数据初始化
																			modalSubmitBtn.attr('disabled',true)
																			submithData.devicesId = devicesId
																			panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题

																			if (computerIP !== null && computerIP !== '') {
																				fuzzySearchGroupBtn.removeClass('hide')	//工控机IP不为空时显示编号同步到工控机
																			} else {
																				fuzzySearchGroupBtn.addClass('hide')
																			}


																			mesHorizontalTableAddData(panelModal1.find('table'), null, {
																				thead: '设备名称/设备类型/设备编号/设备条码/供应商/品牌/购入时间/使用时间/设备状态/设备IP/工控机IP/管理人/责任人/设备描述',
																				tableWitch: '15%/35%',
																				viewColGroup: 2,
																				importStaticData: (tbodyTd, length) => {
																					let tempData ,
																						inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																						selectHtml = `<select class="form-control table-input input-sm"></select>`,
																						devicesStatusList = ['正常','保养', '维修', '停机', '封存'];

																					for (let i = 0, len = length; i < len; i++) {
																						switch (i) {
																							case 0: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_name
																								tbodyTd.eq(i).find('input').val(tempData)
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur keyup').on('blur keyup', (event) => {
																									submithData.devicesName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									if (submithData.devicesName !== dataList[currentTr.index()].devices_control_devices_name) {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							case 1: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(selectHtml)

																								let target = tbodyTd.eq(i).find('select');

																								for (let i = 0, len = devicesTypeList.length; i < len; i++) {
																									let optionHtml = `<option value="${devicesTypeList[i].devices_control_devices_type_id}">${devicesTypeList[i].devices_control_devices_type_name}</option>`;
																									target.append(optionHtml);
																								}
																								target.val(dataList[currentTr.index()].devices_control_devices_type_id).attr('disabled',true)
																								target.on('change', (event) => {
																									submithData.devicesTypeId = target.val()
																								})

																								// 添加到提交数据
																								break;
																							}
																							case 2: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_number
																								tbodyTd.eq(i).find('input').val(tempData)
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur keyup').on('blur keyup', (event) => {
																									submithData.devicesNumber = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									if (submithData.devicesNumber !== dataList[currentTr.index()].devices_control_devices_number) {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							case 3: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_fdevices_code
																								tbodyTd.eq(i).find('input').val(tempData)
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur keyup').on('blur keyup', (event) => {
																									submithData.fdevicesCode = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									if (submithData.fdevicesCode !== dataList[currentTr.index()].devices_control_fdevices_code) {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							case 4: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_supplier
																								tbodyTd.eq(i).find('input').val(tempData)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur keyup').on('blur keyup', (event) => {
																									submithData.devicesSupplier = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									if (submithData.devicesSupplier !== dataList[currentTr.index()].devices_control_devices_supplier && submithData.devicesSupplier !== '') {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							case 5: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_brand
																								tbodyTd.eq(i).find('input').val(tempData)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur keyup').on('blur keyup', (event) => {
																									submithData.devicesBrand = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									if (submithData.devicesBrand !== dataList[currentTr.index()].devices_control_devices_brand && submithData.devicesBrand !== '') {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							case 6: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								 tbodyTd.eq(i).html('<input type="text" class="table-input" placeholder="点此选择时间" onClick="WdatePicker()"/>')
																								tempData = dataList[currentTr.index()].devices_control_devices_purchase_date
																								tbodyTd.eq(i).find('input').val(tempData)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.devicesPurchaseDate = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									if (submithData.devicesPurchaseDate !== dataList[currentTr.index()].devices_control_devices_purchase_date) {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							case 7: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html('<input type="text" class="table-input" placeholder="点此选择时间" onClick="WdatePicker()"/>')
																								tempData = dataList[currentTr.index()].devices_control_devices_use_date
																								tbodyTd.eq(i).find('input').val(tempData)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.devicesUseDate = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									if (submithData.devicesUseDate !== dataList[currentTr.index()].devices_control_devices_use_date) {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							case 8: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(selectHtml)

																								let target = tbodyTd.eq(i).find('select');

																								for (let i = 0, len = devicesStatusList.length; i < len; i++) {
																									let optionHtml = `<option value="${devicesStatusList[i]}">${devicesStatusList[i]}</option>`;
																									target.append(optionHtml);
																								}
																								target.val(dataList[currentTr.index()].devices_control_devices_status_name).on('change', (event) => {
																									submithData.statusName = target.val()
																									if (submithData.statusName !== dataList[currentTr.index()].devices_control_devices_status_name) {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								// 添加到提交数据
																								break;
																							}
																							case 9: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_IP
																								tbodyTd.eq(i).find('input').val(tempData)
																								let mesPopover = new MesPopover(tbodyTd.eq(i).find('input'), { content: '格式为：xxx.xxx.xxx.xxx' });
																								// 获取焦点事件
																								tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
																									mesPopover.show()
																								})
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.devicesIP = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									if (submithData.devicesIP !== dataList[currentTr.index()].devices_control_devices_IP && submithData.devicesIP !== '') {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																									if(!IP_REG.test(tbodyTd.eq(i).find('input').val())){
																										mesPopover.show()
																									}else{
																										mesPopover.hide()
																									}
																									if(tbodyTd.eq(i).find('input').val() == ''){
																										mesPopover.hide()
																									}
																								})

																								break;
																							}
																							case 10: {
																								tempData = dataList[currentTr.index()].industrial_personal_computer_IP
																								submithData.computerIP = tempData
																								if (tempData === '' || tempData === null) {
																									tbodyTd.eq(i).html('<span class="text-warning">无对应IP,不会执行同步操作</span>')
																								} else {
																									tbodyTd.eq(i).html(tempData)
																								}

																								break;
																							}

																							case 11: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_status_custodian
																								tbodyTd.eq(i).find('input').val(tempData)


																								tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																									// 添加员工选择模态框
																									let promise = new Promise(function (resolve, reject) {
																										selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																									});
																									promise.then(function (resolveData) {
																										tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																										submithData.custodian = resolveData.roleStaffId
																										if (submithData.custodian !== dataList[currentTr.index()].devices_control_devices_status_custodian) {
																											modalSubmitBtn.attr('disabled', false)
																										} else {
																											modalSubmitBtn.attr('disabled', true)
																										}
																									})

																									$(this).prop('readonly', true) // 输入框只读
																									$(this).off('blur').on('blur', () => {
																										$(this).removeProp('readonly') // 输入移除框只读
																									})
																								})
																								break;
																							}
																							case 12: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_status_respible
																								tbodyTd.eq(i).find('input').val(tempData)

																								tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																									// 添加员工选择模态框
																									let promise = new Promise(function (resolve, reject) {
																										selectStaffAddData(resolve, queryStaffUrl, { headNum: 1 })
																									});
																									promise.then(function (resolveData) {
																										tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																										submithData.respible = resolveData.roleStaffId
																										if (submithData.respible !== dataList[currentTr.index()].devices_control_devices_status_respible) {
																											modalSubmitBtn.attr('disabled', false)
																										} else {
																											modalSubmitBtn.attr('disabled', true)
																										}
																									})

																									$(this).prop('readonly', true) // 输入框只读
																									$(this).off('blur').on('blur', () => {
																										$(this).removeProp('readonly') // 输入移除框只读
																									})
																								})
																								break;
																							}
																							case 13: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].devices_control_devices_describe
																								tbodyTd.eq(i).find('input').val(tempData)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur keyup').on('blur keyup', (event) => {
																									submithData.devicesDescribe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									if (submithData.devicesDescribe !== dataList[currentTr.index()].devices_control_devices_describe && submithData.devicesDescribe !== '') {
																										modalSubmitBtn.attr('disabled', false)
																									} else {
																										modalSubmitBtn.attr('disabled', true)
																									}
																								})
																								break;
																							}
																							default:
																								break;
																						}
																					}

																				}
																			})

																			// 提交数据按钮单击事件
																			modalSubmitBtn.off('click').on('click', (event) => {
																				if (submithData.devices_control_devices_name !== '') {
																					swal({
																						title: '您确定要提交本次操作吗?',
																						text: '请确保填写信息无误后点击确定按钮',
																						type: 'question',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: true, // 显示用户取消按钮
																						confirmButtonText: '确定',
																						cancelButtonText: '取消',
																					}).then(function () {

																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: modifyDevicesLedgerInfoUrl,
																							data: {
																								"devicesId": submithData.devicesId,
																								"devicesTypeId": submithData.devicesTypeId,
																								"devicesNumber": submithData.devicesNumber,
																								"fdevicesCode": submithData.fdevicesCode,
																								"devicesSupplier": submithData.devicesSupplier,
																								"devicesBrand": submithData.devicesBrand,
																								"devicesPurchaseDate": submithData.devicesPurchaseDate,
																								"devicesUseDate": submithData.devicesUseDate,
																								"devicesIP": submithData.devicesIP,
																								"computerIP": submithData.computerIP,
																								"devicesDescribe": submithData.devicesDescribe,
																								"custodian": submithData.custodian,
																								"statusName": submithData.statusName,
																								"respible": submithData.respible,
																								"devicesName":submithData.devicesName
																							},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {

																									let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																									swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																								}
																							 else if (result.status === 3) {
																									swal({
																										title: '存储的历史编号字段已过长,请联系管理员处理',
																										type: 'question',
																										allowEscapeKey: false, // 用户按esc键不退出
																										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																										showCancelButton: false, // 显示用户取消按钮
																										confirmButtonText: '确定',
																									})
																								}
																								else if (result.status === 4) {
																									swal({
																										title: '修改失败',
																										text: '未连接到工控机，导致修改失败,请重新检查工控机链接',
																										type: 'question',
																										allowEscapeKey: false, // 用户按esc键不退出
																										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																										showCancelButton: false, // 显示用户取消按钮
																										confirmButtonText: '确定',
																									})
																								}

																								else {
																									swallFail();	//操作失败
																								}
																							}
																						})
																					});
																				}
																				else {
																					swallError();	//格式不正确
																				}

																			})
																			// 手动更新设备编号到工控机按钮单击事件
																			fuzzySearchGroupBtn.off('click').on('click', (event) => {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					async: false,
																					url: modifyDevicesNumberButtonUrl,
																					data: { "devicesId": devicesId },
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							swal({
																								title: '操作成功',
																								type: 'success',
																								timer: '1200',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								showConfirmButton: false, // 显示用户确认按钮
																							}).then(
																								() => {
																								},
																								(dismiss) => {

																									if (dismiss === 'timer') {
																										return;
																									}
																								})
																						} else if (result.status === 3) {
																							swal({
																								title: '存储的历史编号字段已过长,请联系管理员处理',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								confirmButtonText: '确定',
																							})
																						}
																						else if (result.status === 4) {
																							swal({
																								title: '同步工控机失败，请重新检查工控机链接',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								confirmButtonText: '确定',
																							})
																						}
																						else {
																							swallFail();	//操作失败
																						}
																					}
																				})
																			})

																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].devices_control_devices_id
																				computerIP = dataList[currentTr.index()].industrial_personal_computer_IP
																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeDevicesLedgerInfoUrl,
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: {
																						devicesId: currentTrNntryID,
																						computerIP: computerIP,
																					},
																					success: function (result) {
																						if (result.status === 0) {
																							swal({
																								title: '删除成功',
																								type: 'success',
																								timer: '1000',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								showConfirmButton: false, // 显示用户确认按钮
																							}).then(
																								() => {
																								},
																								(dismiss) => {
																									let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')

																									if (dismiss === 'timer') {
																										activePaginationBtn.trigger('click') // 删除当前行
																									}
																								})
																						} else if (result.status === 4) {
																							swal({
																								title: '删除失败',
																								text:'未连接到工控机,导致删除失败,请重新检查工控机链接',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								confirmButtonText: '确定',
																							})
																						}
																						else {
																							swal({
																								title: '删除失败',
																								type: 'warning',
																								timer: '1000',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								showConfirmButton: false, // 显示用户确认按钮
																							})
																						}
																					}
																				})
																			})
																			break;
																		}
																		default:
																			break;
																	}
																})
																break;
															default:
																break;
														}
													}
												}
											}
										},

										pagination: {
											totalRow: result.map.lines, // 总行数
											displayRow: result.map.devices.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									paginationContainer.hide()	//隐藏分页按钮
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryDevicesUrl, {
						type: 'all',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryDevicesUrl, {
								type: 'key',
								keyWord: val,
								headNum: 1
							});
						}
						else {
							addTableData(queryDevicesUrl, {
								type: 'all',
								headNum: 1
							});
						}
						$(this).closest('.input-group').find('input').val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}

					});

					// 下拉选事件
					devicesTypeOption.change(function () {
						let currentDevicesTypeID = $(this).val();

						addTableData(queryDevicesUrl, {
							type: 'typeId',
							typeId: currentDevicesTypeID,
							headNum: 1
						});
					})
					// 头部主要按钮1点击事件，设备类型管理
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = $('#devicesTypeManage'),
							panelModal1 = dataContent.find('.panel'),
							headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增设备类型
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							// devicesTypeList = [],
							mesloadBox = new MesloadBox(panelModal1, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							});

						// 模态框表格增加内容
						function addModalTableData(url, data) {
							$.ajax({
								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
								url: url,
								data: data,
								beforeSend: function (xml) {
									// ajax发送前
									mesloadBox.loadingShow()
								},
								success: function (result, status, xhr) {
									// ajax成功
									mesloadBox.hide()
									if (result.status === 0) {

										mesVerticalTableAddData(panelModal1, {
											thead: {
												theadContent: '序号/类型名称/类型描述/操作',
												theadWidth: '8%/28%/44%/20%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="editDevicesType" href="javascript:;"><i class="fa fa-pencil-square-o"></i>修改</a><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = result.map.devices_control_devices_type, // 主要数据列表
														tempData = ''; // 表格td内的临时数据
													// devicesTypeList = dataList;
													tbodyTarget.empty() // 清空表格主体

													for (let i = 0, len = dataList.length; i < len; i++) {
														tbodyTarget.append('<tr></tr>'); // 添加行
														let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
														for (let j = 0, len = html.length; j < len; j++) {
															currentTr.append(html[j]); // 添加表格内的HTML
															switch (j) {
																case 0:
																	currentTr.children().eq(j).html(currentTr.index() + 1)
																	break;
																case 1: {
																	tempData = dataList[i].devices_control_devices_type_name
																	currentTr.children().eq(j).html(tempData)
																}
																	break;
																case 2: {
																	tempData = dataList[i].devices_control_devices_type_describe
																	currentTr.children().eq(j).html(tempData)
																}
																	break;
																case 3: {
																	tempData = dataList[i].devices_control_devices_type_status
																	if (tempData === 0) {
																		currentTr.children().eq(j).find('a').hide()
																	}

																	currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据
																		event.stopPropagation() // 停止冒泡
																		switch (triggerTargetData) {
																			case 'editDevicesType': {

																				let dataContent = submitModelModal,
																					panelModal2 = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent.find('.modal-submit'),
																					// 表单要提交的数据
																					submithData = {
																						devicesTypeID: '',
																						devicesTypeName: '',
																						devicesTypeCraftRange: '',
																						devicesTypeCraftOrder: '',
																						devicesTypeDescribe: ''
																					};

																				submithData.devicesTypeID = dataList[i].devices_control_devices_type_id
																				submithData.devicesTypeName = dataList[i].devices_control_devices_type_name
																				submithData.devicesTypeCraftRange = dataList[i].devices_control_devices_craft_range
																				submithData.devicesTypeCraftOrder = dataList[i].devices_control_devices_craft_order
																				submithData.devicesTypeDescribe = dataList[i].devices_control_devices_type_describe
																				// 修改标题
																				panelModal2.find('.panel-heading').find('.panel-title').text('修改设备类型') // 更换panel标题
																				modalSubmitBtn.attr('disabled', true)

																				dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
																					$('body').addClass('modal-open')
																				})
																				dataContent.modal({
																					backdrop: false, // 黑色遮罩不可点击
																					keyboard: false,  // esc按键不可关闭模态框
																					show: false
																				})
																				dataContent.modal('show') // 运行时显示
																				modalCloseBtn.off('click').on('click', (event) => {
																					// 点击关闭按钮隐藏该模态框
																					dataContent.modal('hide')

																					// 初始化表格
																					targetTable.find('thead').empty()
																					targetTable.find('tbody').empty()
																				})
																				//生成表单
																				mesHorizontalTableAddData(panelModal2.find('table'), null, {
																					thead: '类型名称/所属工艺段/工艺顺序/类型描述',
																					tableWitch: '25%/75%',
																					viewColGroup: 1,
																					importStaticData: (tbodyTd, length) => {
																						let inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																						inputHtml1 = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');" />`,

																							tempData;

																						for (let k = 0, len = length; k < len; k++)

																						switch (k) {
																								case 0: {
																								tbodyTd.eq(k).addClass('table-input-td')
																								tbodyTd.eq(k).html(inputHtml)
																								tempData = dataList[i].devices_control_devices_type_name
																									tbodyTd.eq(k).find('input').val(tempData)


																									// 添加到提交数据
																									tbodyTd.eq(k).find('input').off('blur keyup').on('blur keyup', (event) => {
																										submithData.devicesTypeName = tbodyTd.eq(k).find('input').val().replace(/\s/g, "")
																										if (submithData.devicesTypeName !== dataList[i].devices_control_devices_type_name) {
																											modalSubmitBtn.attr('disabled', false)
																										}
																										else {
																											modalSubmitBtn.attr('disabled', true)
																										}
																									})
																									break;
																								}
																								case 1: {
																								tbodyTd.eq(k).addClass('table-input-td')
																								tbodyTd.eq(k).html(inputHtml)
																								tempData = dataList[i].devices_control_devices_craft_range
																								tbodyTd.eq(k).find('input').val(tempData)

																									// 添加到提交数据
																									tbodyTd.eq(k).find('input').off('blur keyup').on('blur keyup', (event) => {
																										submithData.devicesTypeCraftRange = tbodyTd.eq(k).find('input').val().replace(/\s/g, "")
																										if (submithData.devicesTypeCraftRange !== dataList[i].devices_control_devices_craft_range) {
																											modalSubmitBtn.attr('disabled', false)
																										}
																										else {
																											modalSubmitBtn.attr('disabled', true)
																										}
																									})

																								}
																									break;
																								case 2: {
																								tbodyTd.eq(k).addClass('table-input-td')
																								tbodyTd.eq(k).html(inputHtml1)
																								tempData = dataList[i].devices_control_devices_craft_order
																									if (parseInt(tempData) === 0) {
																										tbodyTd.eq(k).find('input').val('')
																									} else {
																										tbodyTd.eq(k).find('input').val(tempData)
																									}



																									// 添加到提交数据
																									tbodyTd.eq(k).find('input').off('blur keyup').on('blur keyup', (event) => {
																										submithData.devicesTypeCraftOrder = tbodyTd.eq(k).find('input').val().replace(/\s/g, "")
																										if (submithData.devicesTypeCraftOrder !== dataList[i].devices_control_devices_craft_order) {
																											modalSubmitBtn.attr('disabled', false)
																										}
																										else {
																											modalSubmitBtn.attr('disabled', true)
																										}
																									})



																								}
																									break;
																								case 3: {
																								tbodyTd.eq(k).addClass('table-input-td')
																								tbodyTd.eq(k).html(inputHtml)
																								tempData = dataList[i].devices_control_devices_type_describe
																									tbodyTd.eq(k).find('input').val(tempData)

																									// 添加到提交数据
																									tbodyTd.eq(k).find('input').off('blur keyup').on('blur keyup', (event) => {
																										submithData.devicesTypeDescribe = tbodyTd.eq(k).find('input').val().replace(/\s/g, "")
																										if (submithData.devicesTypeDescribe !== dataList[i].devices_control_devices_type_describe) {
																											modalSubmitBtn.attr('disabled', false)
																										}
																										else {
																											modalSubmitBtn.attr('disabled', true)
																										}
																									})

																								}
																									break;

																								default:
																									break;
																							}

																					}
																				})

																				// 提交数据按钮单击事件
																				modalSubmitBtn.off('click').on('click', (event) => {
																					if (submithData.product_line_name !== '') {
																						swal({
																							title: '您确定要提交本次操作吗?',
																							text: '请确保填写信息无误后点击确定按钮',
																							type: 'question',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: true, // 显示用户取消按钮
																							confirmButtonText: '确定',
																							cancelButtonText: '取消',
																						}).then(function () {

																							console.dir(submithData)
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: modifyDevicesInfoUrl,
																								data: {
																									"typeId": submithData.devicesTypeID,
																									"typeName": submithData.devicesTypeName,
																									"craftRange": submithData.devicesTypeCraftRange,
																									"craftOrder": submithData.devicesTypeCraftOrder,
																									"typeDescribe": submithData.devicesTypeDescribe
																								},
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面

																									}
																									else {
																										swallFail()	//操作失败
																									}
																								}
																							})
																						});
																					}
																					else {
																						swallError()	//格式不正确
																					}

																				})
																				break;
																			}
																			case 'delete': {
																				let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																					currentTrNntryID = dataList[currentTr.index()].devices_control_devices_type_id

																				swal({
																					title: '您确定要删除此条数据吗？',
																					text: '删除后将无法查询',
																					type: 'question',
																					showCancelButton: true,
																					confirmButtonText: '确定',
																					cancelButtonText: '取消'
																				}).then(function () {
																					$.ajax({
																						url: removeDevicesInfoUrl,
																						type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																						data: {
																							devicesTypeId: currentTrNntryID
																						},
																						success: function (result) {
																							if (result.status === 0) {
																								swal({
																									title: '删除成功',
																									type: 'success',
																									timer: '1000',
																									allowEscapeKey: false, // 用户按esc键不退出
																									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																									showCancelButton: false, // 显示用户取消按钮
																									showConfirmButton: false, // 显示用户确认按钮
																								}).then(
																									() => {
																									},
																									(dismiss) => {
																										let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')

																										if (dismiss === 'timer') {
																											activePaginationBtn.trigger('click') // 删除当前行
																										}
																									})
																							}
																							else {
																								swal({
																									title: '删除失败',
																									type: 'warning',
																									timer: '1000',
																									allowEscapeKey: false, // 用户按esc键不退出
																									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																									showCancelButton: false, // 显示用户取消按钮
																									showConfirmButton: false, // 显示用户确认按钮
																								})
																							}
																						}
																					})
																				})
																				break;
																			}
																			default:
																				break;
																		}
																	})
																}
																default:
																	break;
															}
														}
													}
												}
											},
											pagination: {
												totalRow: result.map.devices_control_devices_type.length, // 总行数
												displayRow: result.map.devices_control_devices_type.length// 显示行数
											},

											ajax: {
												url: url,
												data: data
											}

										})
									}
									else {
										mesloadBox.warningShow();
									}
								}
							})
						}
						addModalTableData(queryDevicesTypesUrl, {
							headNum: 1
						});

						// 头部主要按钮1点击事件,新增设备类型
						headingMainBtn_1.off('click').on('click', (event) => {

							let dataContent = submitModelModal,
								panelModal2 = dataContent.find('.panel'),
								modalCloseBtn = dataContent.find('.modal-header').find('.close'),
								modalSubmitBtn = dataContent.find('.modal-submit'),
								fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
								fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
								// 表单要提交的数据
								submithData = {
									devicesTypeName: '',
									devicesTypeCraftRange: '',
									devicesTypeCraftOrder: 0,
									devicesTypeDescribe: '',
									devicesTypeStatus: 1
								};


							// 修改标题
							panelModal2.find('.panel-heading').find('.panel-title').text('新增设备类型') // 更换panel标题
							fuzzySearchGroupBtn.addClass('hide')
							modalSubmitBtn.attr('disabled',false)
							dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
								$('body').addClass('modal-open')
							})
							dataContent.modal({
								backdrop: false, // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: false
							})
							dataContent.modal('show') // 运行时显示
							modalCloseBtn.off('click').on('click', (event) => {
								// 点击关闭按钮隐藏该模态框
								dataContent.modal('hide')

								// 初始化表格
								// targetTable.find('thead').empty()
								// targetTable.find('tbody').empty()
							})
							//生成表单
							mesHorizontalTableAddData(panelModal2.find('table'), null, {
								thead: '类型名称/所属工艺段/工艺顺序/类型描述/是否可修改删除',
								tableWitch: '30%/70%',
								viewColGroup: 1,
								importStaticData: (tbodyTd, length) => {
									let inputHtml = ``,
										 selectHtml = ``;

									for (let i = 0, len = length; i < len; i++)
										switch (i) {
											case 0: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });

												target.off('focus').on('focus', (event) => {
													mesPopover.show()
												})

												// 添加到提交数据
												target.off('blur').on('blur', (event) => {
													mesPopover.hide()
													submithData.devicesTypeName = target.val().replace(/\s/g, "")
													if (!USERNAME_REG1.test(submithData.devicesTypeName)) {
														mesPopover.show()
													} else {
														mesPopover.hide()
													}
												})
												break;
											}
											case 1: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(选填)" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submithData.devicesTypeCraftRange = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})

											}
												break;
											case 2: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(选填)" autocomplete="on"onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]/" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)
												let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '请输入数字' });

												target.off('focus').on('focus', (event) => {
													mesPopover.show()
												})

												// 添加到提交数据
												target.off('blur').on('blur', (event) => {
													mesPopover.hide()
													 submithData.devicesTypeCraftOrder = target.val().replace(/\s/g, "");
													if (!NUMBER_REG.test(submithData.devicesTypeCraftOrder) || submithData.devicesTypeCraftOrder === '') {
														// mesPopover.show()
														submithData.devicesTypeCraftOrder = 0	//如果为空或不符合要求，默认为0
													} else {
														mesPopover.hide()
													}
												})

											}
												break;
											case 3: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(选填)" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submithData.devicesTypeDescribe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})

											}
												break;
											case 4: {
												selectHtml = `<select class="form-control table-input input-sm">
																					<option value="1">是</option>
																					<option value="0">否</option>
																			</select>`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(selectHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													submithData.devicesTypeStatus = tbodyTd.eq(i).find('select').val()
												})

											}
												break;

											default:
												break;
										}

								}
							})

							// 提交数据按钮单击事件
							modalSubmitBtn.off('click').on('click', (event) => {
								if (submithData.devicesTypeName !== '' && USERNAME_REG1.test(submithData.devicesTypeName
									|| NUMBER_REG.test(submithData.devicesTypeCraftOrder)
								)){
									swal({
										title: '您确定要提交本次操作吗?',
										text: '请确保填写信息无误后点击确定按钮',
										type: 'question',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: true, // 显示用户取消按钮
										confirmButtonText: '确定',
										cancelButtonText: '取消',
									}).then(function () {

										$.ajax({
											type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveDevicesTypeInfoUrl,
											data: {
												"typeName": submithData.devicesTypeName,
												"craftRange": submithData.devicesTypeCraftRange,
												"craftOrder": submithData.devicesTypeCraftOrder,
												"typeDescribe": submithData.devicesTypeDescribe,
												"typeStatus": submithData.devicesTypeStatus
											},
											success: function (result, status, xhr) {
												if (result.status === 0) {

													let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面

												}
												else {
													swallFail()	//操作失败
												}
											}
										})
									});
								}
								else {
									swallError()	//格式不正确
								}

							})

						})
					})

					// 头部主要按钮2点击事件，新增设备
					headingMainBtn_2.off('click').on('click', (event) => {

						let dataContent = submitModelModal,
							panelModal1 = dataContent.find('.panel'),
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							modalSubmitBtn = dataContent.find('.modal-submit'),
							fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
							fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
							computerIPList,
							// 表单要提交的数据
							submithData = {
								devicesTypeId: '',	//设备类型
								devicesName: '',	//设备名称
								devicesNumber: '',	//设备编号
								fdevicesCode: '', //设备条码
								devicesSupplier: '',	//供应商
								devicesBrand: '',	//品牌
								devicesPurchaseDate: '',	//购买日期
								devicesUseDate: '',	//使用日期
								statusName: '',	//设备状态
								devicesIP: '',	//设备IP地址
								computerIP: '',	//工控机IP地址
								devicesDescribe: '',	//设备描述

								deptId: '',	//所属部门
								devicesSite: '',	//设备存放位置
								operator: '',	//操作人员
								custodian: '',	//管理人
								respible: ''	//责任人
							};

						panelModal1.find('.panel-heading').find('.panel-title').text('新增设备') // 更换panel标题
						modalSubmitBtn.attr('disabled', false)
						fuzzySearchGroupBtn.addClass('hide')

							/**
						 * @description :获取工控机IP集合,因为要先获取数据,所有设为同步
						 */
						function getIP(event) {
							$.ajax({
								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
								async: false,
								url: queryIPCAllURl,
								success: function (result, status, xhr) {
									computerIPList = result;
								}
							})
						}
						getIP();

						mesHorizontalTableAddData(panelModal1.find('table'), null, {
							thead: '设备名称/设备类型/设备编号/设备条码/供应商/品牌/购入时间/使用时间/设备状态/设备IP/工控机IP/管理人/责任人/设备描述',
							tableWitch: '20%/30%',
							viewColGroup: 2,
							importStaticData: (tbodyTd, length) => {
								let inputHtml = ``,
									inputHtml2 = `<input type="text" class="table-input" placeholder="点此选择时间" onClick="WdatePicker()"/>`,
									selectHtml = `<select class="form-control table-input input-sm"></select>`,
									devicesStatusList = ['未选择', '正常','封存','保养', '维修', '停机'];

								for (let i = 0, len = length; i < len; i++){
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 1: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(selectHtml)

											let target = tbodyTd.eq(i).find('select');
											target.append('<option value="0">未选择</option>')
											for (let i = 0, len = devicesTypeList.length; i < len; i++) {
												let optionHtml = `<option value="${devicesTypeList[i].devices_control_devices_type_id}">${devicesTypeList[i].devices_control_devices_type_name}</option>`;
												target.append(optionHtml);
											}
											target.on('change', (event) => {
												submithData.devicesTypeId = target.val()
											})

											// 添加到提交数据
											break;
										}
										case 2: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesNumber = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})

											break;
										}
										case 3: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesSupplier = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 4: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.fdevicesCode = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 5: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesBrand = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 6: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)" onClick="WdatePicker()"/>`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesPurchaseDate = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 7: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间" onClick="WdatePicker()"/>`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesUseDate = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 8: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(selectHtml)

											let target = tbodyTd.eq(i).find('select');

											for (let i = 0, len = devicesStatusList.length; i < len; i++) {
												let optionHtml = `<option value="${devicesStatusList[i]}">${devicesStatusList[i]}</option>`;
												target.append(optionHtml);
											}
											target.on('change', (event) => {
												submithData.statusName = target.val()
											})
											// 添加到提交数据
											break;
										}
										case 9: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											let mesPopover = new MesPopover(tbodyTd.eq(i).find('input'), { content: '格式为：xxx.xxx.xxx.xxx' });
											// 获取焦点事件
											tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
												mesPopover.show()
											})

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesIP = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												mesPopover.hide()
											})

											break;
										}
										case 10: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(selectHtml)

											let target = tbodyTd.eq(i).find('select');

											target.append('<option value="">未选择</option>')
											for (let i = 0, len = computerIPList.length; i < len; i++) {
												let optionHtml = `<option value="${computerIPList[i]}">${computerIPList[i]}</option>`;
												target.append(optionHtml);
											}
											target.on('change', (event) => {
												submithData.computerIP = target.val()
											})
											break;
										}
										case 11: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
												});
												promise.then(function (resolveData) {
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
													submithData.custodian = resolveData.roleStaffId
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 12: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
												});
												promise.then(function (resolveData) {
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
													submithData.respible = resolveData.roleStaffId
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 13: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.devicesDescribe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										default:
											break;
									}
								}

							}
						})

						// 提交数据按钮单击事件
						modalSubmitBtn.off('click').on('click', (event) => {
							if (submithData.devicesName !== '' && submithData.devicesNumber !== '') {
								swal({
									title: '您确定要提交本次操作吗?',
									text: '请确保填写信息无误后点击确定按钮',
									type: 'question',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: true, // 显示用户取消按钮
									confirmButtonText: '确定',
									cancelButtonText: '取消',
								}).then(function () {

									console.dir(submithData)
									$.ajax({
										type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
										url: saveDevicesLedgerInfoUrl,
										data: {
											"devicesName": submithData.devicesName,
											"devicesTypeId": submithData.devicesTypeId,
											"devicesNumber": submithData.devicesNumber,
											"fdevicesCode": submithData.fdevicesCode,
											"devicesSupplier": submithData.devicesSupplier,
											"devicesBrand": submithData.devicesBrand,
											"devicesPurchaseDate": submithData.devicesPurchaseDate,
											"devicesUseDate": submithData.devicesUseDate,
											"statusName": submithData.statusName,
											"devicesIP": submithData.devicesIP,
											"computerIP": submithData.computerIP,
											"devicesDescribe": submithData.devicesDescribe,
											"custodian": submithData.custodian,
											"respible": submithData.respible
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {
												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											}
											else if (result.status === 5) {
												swal({
													title: '您已经添加过此设备,请勿重复添加',
													type: 'question',
													allowEscapeKey: false, // 用户按esc键不退出
													allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
													showCancelButton: false, // 显示用户取消按钮
													confirmButtonText: '确定',
												})
											} else if (result.status === 4) {
												swal({
													title: '同步工控机失败，请重新检查工控机链接',
													type: 'question',
													allowEscapeKey: false, // 用户按esc键不退出
													allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
													showCancelButton: false, // 显示用户取消按钮
													confirmButtonText: '确定',
												})
											} else if (result.status === 3) {
												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')

												swal({
													title: '新增设备成功，但未同步到工控机',
													text:'请手动同步到工控机',
													type: 'question',
													allowEscapeKey: false, // 用户按esc键不退出
													allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
													showCancelButton: false, // 显示用户取消按钮
													confirmButtonText: '确定',
												}).then(
													activePaginationBtn.trigger('click') ,// 模拟点击当前页
															modalCloseBtn.trigger('click')	//关闭模态框
												)
											}
											else {
												swallFail();	//操作失败
											}
										}
									})
								});
							}
							else {
								swallError();	//格式不正确
							}

						})

					})

					//头部主要按钮2点击事件，导出Excel
					headingMainBtn_3.off('click').on('click', (event) => {
						location.href = exportExcelDevicesInfoUrl
					})

				}())
				break;

			case '#devicesMaintain':	//设备点检记录列表
				(function () {
					let activeSwiper = $('#devicesMaintain'), // 右侧外部swiper
						activeSubSwiper = $('#devicesMaintainInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),		// panel tbody标签
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						devicesTypeOption = activePanelHeading.find('.devices-type-option'), // 设备类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

					// 设备下拉菜单添加选项
					createDevicesTypeSelect(devicesTypeOption);

					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: url,
							data: data,
							beforeSend: function (xml) {
								// ajax发送前
								mesloadBox.loadingShow()
							},
							success: function (result, status, xhr) {
								// ajax成功
								mesloadBox.hide()
								if (result.status === 0) {
									paginationContainer.show()
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/设备名称/设备编号/点检版本号/点检人/班长确认/技术确认/状态/操作',
											theadWidth: '5%/12%/10%/8%/10%/10%/12%/8%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td">' +
													'<a class="table-link dataDetails checkPlanDetail" href="javascript:;" data-toggle-modal-target="#devicesCheckDetailsModal"><i class="fa fa-tasks fa-fw"></i>详情</a>' +
													'<a class="table-link checkPlanAudit" href="javascript:;" data-toggle-modal-target="#editDevicesCheckModal2"><i class="fa fa-calculator"></i>审核</a>' +
													'<a class="table-link execute checkPlanExcute" href="javascript:;" data-toggle-modal-target="#editDevicesCheckModal"><i class="fa fa-pencil-square-o"></i>执行</a>' +
												'</td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.checks, // 主要数据列表
													tempData = null; // 表格td内的临时数据

												for (let i = 0, len = dataList.length; i < len; i++) {
													tbodyTarget.append('<tr></tr>'); // 添加行
													let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
													for (let i = 0, len = html.length; i < len; i++) {
														currentTr.append(html[i]); // 添加表格内的HTML
														switch (i) {
															case 0:
																currentTr.children().eq(i).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].devices.devices_control_devices_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].devices.devices_control_devices_number;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].devices_check_plan_version;
																currentTr.children().eq(i).html(`版本${tempData}`)
															}
																break;
															case 4: {
																tempData = dataList[currentTr.index()].devices_check_plan_people;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 5: {
																tempData = dataList[currentTr.index()].devices_check_plan_monitor;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 6: {
																tempData = dataList[currentTr.index()].devices_check_plan_artisan;
																currentTr.children().eq(i).html(tempData)
															}
																break;

															case 7: {
																tempData = dataList[currentTr.index()].devices_check_plan_status;
																if (tempData === '0') {
																	currentTr.children().eq(i).html(`启用`).addClass('text-success')
																}
																else if (tempData === '1') {
																	currentTr.children().eq(i).html(`关闭`)
																}

															}
																break;
															case 8: {
																tempData = dataList[currentTr.index()].devices_check_plan_status;

																if (tempData === '1') {
																	currentTr.children().eq(i).find('.execute').addClass('hide')
																} else {
																	currentTr.children().eq(i).find('.execute').removeClass('hide')
																}
																//操作按钮事件
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	devicesCheckPlanID = dataList[currentTr.index()].devices_check_plan_id;

																	switch (dataContent) {
																		case '#devicesCheckDetailsModal': {	//详情
																			let dataContent = $('#devicesCheckDetailsModal'),
																				panelList = dataContent.find('.panel'),
																				panel1 = panelList.eq(0),
																				panel2 = panelList.eq(1),
																				panel3 = panelList.eq(2),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-footer .modal-submit'),

																				panel2Thead = panel2.find('thead'),
																				panel2Tbody = panel2.find('tbody'),
																				panel3Tbody = panel3.find('tbody'),
																				panel2fuzzysearchgroupInput = panel2.find('.fuzzy-search-group input'), // panel2日期搜索组,年输入框
																				panel2fuzzysearchgroupSelect = panel2.find('.fuzzy-search-group select'), // panel2日期搜索组，周下拉选
																				panel3HeadingMainBtn_1 = panel3.find('.head-main-btn-1'), // panel3头部主要按键_1

																				tempYYMM ,	//选择的年月值
																				tempWork,	//选择的周数
																				workDateList = [],	//一周的日期
																				now = moment(),	//当前时间
																				startDate = moment().format('YYYY-MM-01'),	//搜索开始时间
																				endDate = moment().format('YYYY-MM-07');	//搜索结束时间
																				startTime = moment().format('YYYY-MM-01'),	//异常记录搜索开始时间
																				endTime = moment().format('YYYY-MM-31');	//异常记录搜索结束时间

																			//页面初始化
																			panel2fuzzysearchgroupInput.val(moment().format('YYYY-MM'));
																			panel2fuzzysearchgroupSelect.val('0')
																			tempYYMM = moment().format('YYYY-MM');
																			tempWork = 1;
																			workDateList = [1, 2, 3, 4, 5, 6, 7];	//第一周的日期

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功

																						mesloadBox.hide()
																						if (result.status === 0) {
																							//panel1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '设备名称/设备编号/点检表版本号/状态/创建人/点检人/班长确认人/技术确认人',
																								tableWitch: '20%/30%',
																								viewColGroup: 2,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.checks, // 主要数据列表
																										tempData = null; // 表格td内的临时数据
																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].devices.devices_control_devices_name;

																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 1: {
																												tempData = dataList[0].devices.devices_control_devices_number;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 2: {
																												tempData = dataList[0].devices_check_plan_version;
																												tbodyTd.eq(i).html(`版本${tempData}`)

																											}
																												break;
																											case 3: {
																												tempData = dataList[0].devices_check_plan_status;
																												if (tempData === '0') {
																													tbodyTd.eq(i).html(`启用`)
																												}
																												else if (tempData === '1') {
																													tbodyTd.eq(i).html(`关闭`)
																												}

																											}
																												break;
																											case 4: {
																												tempData = dataList[0].devices_check_plan_creator;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 5: {
																												tempData = dataList[0].devices_check_plan_people;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 6: {
																												tempData = dataList[0].devices_check_plan_monitor;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 7: {
																												tempData = dataList[0].devices_check_plan_artisan;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})

																							//panel2
																							function creatPanel2TbodyData() {
																								let map = result.map, // 映射
																									dataList = map.checks[0].devicesCheckProjects; // 主要数据列表

																								panel2Tbody.empty();	//初始化表格
																								for (let i = 0, len = dataList.length; i < len; i++) {	//遍历项目
																									let devicesCheckEnterList = dataList[i].devicesCheckEnters,
																										tbodyHtml = '';

																									tbodyHtml += '<tr>';
																										tbodyHtml += '<td rowspan="4">' + dataList[i].devices_check_project_name + '</td>';
																										tbodyHtml += '<td><b>点检结果</b></td>';

																										for (let j = 0; j < 7; j++) {	//生成一周的表格
																											let tempData = '',	//上午点检结果临时变量
																													tempData2 = '';	//下午点检结果临时变量
																												if (devicesCheckEnterList === null) {	//如果记录为空，生成空表格
																													tbodyHtml += '<td></td>';
																													tbodyHtml += '<td></td>';
																												} else {	//不为空,加载数据
																													for (let k = 0, len = devicesCheckEnterList.length; k < len; k++) {	//根据记录日期匹配记录
																														let recordTime = moment(devicesCheckEnterList[k].devices_check_enter_time).format('D');	//获取记录日期天数
																													        //  console.log(parseInt(recordTime));
																															//  console.log(workDateList[j]);
																														if (workDateList[j] == parseInt(recordTime)) {

																															try {
																																if (devicesCheckEnterList[k].devices_check_enter_result_am !== null && devicesCheckEnterList[k].devices_check_enter_result_am !== '') {
																																	tempData = devicesCheckEnterList[k].devices_check_enter_result_am;
																																}
																															} catch (error) {
																															}

																															try {
																																if (devicesCheckEnterList[k].devices_check_enter_result_pm !== null && devicesCheckEnterList[k].devices_check_enter_result_pm !== '') {
																																	tempData2 = devicesCheckEnterList[k].devices_check_enter_result_pm;
																																}
																															} catch (error) {
																														}
																															// break;
																														}

																													}
																													tbodyHtml += '<td>' + tempData + '</td>';
																													tbodyHtml += '<td>' + tempData2 + '</td>';

																											}
																										}
																									tbodyHtml += '</tr>';
																									tbodyHtml += '<tr>';
																										tbodyHtml += '<td><b>点检人</b></td>';
																										for (let j = 0; j < 7; j++) {	//生成一周的表格
																											let tempData = '',	//上午点检结果临时变量
																												tempData2 = '';	//下午点检结果临时变量
																											if (devicesCheckEnterList === null) {	//如果记录为空，生成空表格
																												tbodyHtml += '<td></td>';
																												tbodyHtml += '<td></td>';

																											} else {

																												for (let k = 0, len = devicesCheckEnterList.length; k < len; k++) {	//根据记录日期匹配记录,上午
																													let recordTime = moment(devicesCheckEnterList[k].devices_check_enter_time).format('D');	//获取记录日期天数
																													// let index = j / 2;	//对应日期的索引
																													// console.log(workDateList[j]);
																													// recordTime
																													// console.log(parseInt(recordTime));
																													if (workDateList[j] == parseInt(recordTime)) {
																														console.log(devicesCheckEnterList[k]);
																														try {
																															if (devicesCheckEnterList[k].devices_check_enter_result_am !== null && devicesCheckEnterList[k].devices_check_enter_result_am !== '') {
																																tempData = devicesCheckEnterList[k].devices_check_enter_people;
																															}
																														} catch (error) {
																														}

																														try {
																															if (devicesCheckEnterList[k].devices_check_enter_result_pm !== null && devicesCheckEnterList[k].devices_check_enter_result_pm !== '') {
																																tempData2 = devicesCheckEnterList[k].devices_check_enter_people;
																															}
																														} catch (error) {
																														}
																													}
																												}
																												tbodyHtml += '<td>' + tempData + '</td>';
																												tbodyHtml += '<td>' + tempData2 + '</td>';

																											}
																										}
																									tbodyHtml += '</tr>';
																									tbodyHtml += '<tr>';
																										tbodyHtml += '<td><b>班长确认</b></td>';
																										for (let j = 0; j < 7; j++) {	//生成一周的表格
																											let tempData = '',	//上午点检结果临时变量
																												tempData2 = '';	//下午点检结果临时变量
																											if (devicesCheckEnterList === null) {	//如果记录为空，生成空表格
																												tbodyHtml += '<td></td>';
																												tbodyHtml += '<td></td>';

																											} else {
																												for (let k = 0, len = devicesCheckEnterList.length; k < len; k++) {	//根据记录日期匹配记录,上午
																													let recordTime = moment(devicesCheckEnterList[k].devices_check_enter_time).format('D');	//获取记录日期天数
																													// let index = j / 2;	//对应日期的索引
																													if (workDateList[j] == parseInt(recordTime)) {

																														try {
																															if (devicesCheckEnterList[k].devices_check_enter_result_am !== null && devicesCheckEnterList[k].devices_check_enter_result_am !== '') {
																																tempData = devicesCheckEnterList[k].devices_check_enter_monitor;
																															}
																														} catch (error) {
																														}

																														try {
																															if (devicesCheckEnterList[k].devices_check_enter_result_pm !== null && devicesCheckEnterList[k].devices_check_enter_result_pm !== '') {
																																tempData2 = devicesCheckEnterList[k].devices_check_enter_monitor;
																															}
																														} catch (error) {
																														}
																													}
																												}
																												tbodyHtml += '<td>' + tempData + '</td>';
																												tbodyHtml += '<td>' + tempData2 + '</td>';

																											}
																										}
																									tbodyHtml += '</tr>';
																									tbodyHtml += '<tr>';
																										tbodyHtml += '<td><b>技术确认</b></td>';
																										for (let j = 0; j < 7; j++) {	//生成一周的表格
																											let tempData = '',	//上午点检结果临时变量
																												tempData2 = '';	//下午点检结果临时变量
																											if (devicesCheckEnterList === null) {	//如果记录为空，生成空表格
																												tbodyHtml += '<td></td>';
																												tbodyHtml += '<td></td>';

																											} else {
																												for (let k = 0, len = devicesCheckEnterList.length; k < len; k++) {	//根据记录日期匹配记录,上午
																													let recordTime = moment(devicesCheckEnterList[k].devices_check_enter_time).format('D');	//获取记录日期天数
																													// let index = j / 2;	//对应日期的索引
																													if (workDateList[j] == parseInt(recordTime)) {

																														try {
																															if (devicesCheckEnterList[k].devices_check_enter_result_am !== null && devicesCheckEnterList[k].devices_check_enter_result_am !== '') {
																																tempData = devicesCheckEnterList[k].devices_check_enter_artisan;
																															}
																														} catch (error) {
																														}

																														try {
																															if (devicesCheckEnterList[k].devices_check_enter_result_pm !== null && devicesCheckEnterList[k].devices_check_enter_result_pm !== '') {
																																tempData2 = devicesCheckEnterList[k].devices_check_enter_artisan;
																															}
																														} catch (error) {
																														}
																													}
																												}
																												tbodyHtml += '<td>' + tempData + '</td>';
																												tbodyHtml += '<td>' + tempData2 + '</td>';

																											}
																										}
																									tbodyHtml += '</tr>';

																									panel2Tbody.append(tbodyHtml)
																									// replaceNull()
																								}

																							}

																							creatPanel2TbodyData();
																							//panel3
																							mesVerticalTableAddData(panel3, {
																								thead: {
																									theadContent: '发生时间/异常类型/异常内容/记录人/异常处置/确认人',
																									theadWidth: '15%/15%/15%/15%/15%/15%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.exceptions, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										for (let i = 0, len = dataList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = dataList[i].devices_exception_record_time;
																														currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																													}
																														break;
																													case 1: {

																													}
																														break;
																													case 2: {
																														tempData = dataList[i].devices_exception_record_content;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[i].devices_exception_record_people;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList[i].devices_exception_record_handling;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = dataList[i].devices_exception_record_identify_people;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: dataList.length, // 总行数
																									displayRow: dataList.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})
																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}
																			addTableData(queryCheckPlanUrl, {
																				"type": "detail",
																				"checkId": devicesCheckPlanID,
																				"startDate": startDate,
																				"endDate": endDate,
																				"startTime": startTime,
																				"endTime": endTime,
																				"headNum": 1
																			})
																			//年月选择失去焦点事件
																			panel2fuzzysearchgroupInput.blur(function () {
																				tempYYMM = $(this).val();
																				console.log(tempYYMM)
																			})
																			//周选择失去值改变事件
																			panel2fuzzysearchgroupSelect.change(function () {
																				let temp1,
																						temp2;
																				tempWork = parseInt($(this).val());	//获取对应的周数并转成数字，一到五周分别对应的是0-5
																				temp1 = (tempWork * 7) + 1;			//计算周一对应的日期
																				temp2 = (tempWork + 1) * 7;			//计算周末对应的日期
																				if (temp2>31) {
																					temp2 = 31;
																				}
																				let theadHtml = '';
																				theadHtml += '<tr>';
																				theadHtml += '<th rowspan="2" style="width: 8%;">项目名称</th>';
																				theadHtml += '<th rowspan="2" style="width: 8%;"></th>';
																				for (let i = 0; i < 7; i++) {
																					if ((temp1 + i)>31) {
																						theadHtml += '<th colspan="2" style="width: 6%;"></th>';
																						workDateList[i] = 0;
																					} else {
																						theadHtml += '<th colspan="2" style="width: 6%;">' + (temp1 + i) + '号</th>';
																						workDateList[i] = (temp1 + i);
																					}
																				}
																				theadHtml += '</tr>';
																				theadHtml += '<tr>';
																				for (let j = 0; j < 7; j++){
																					theadHtml += '<th  style="width: 6%;">上午</td>';
																					theadHtml += '<th  style="width: 6%;">下午</td>';

																				}
																				theadHtml += '</tr>';

																				startDate = tempYYMM + '-' + (temp1 < 10 ? "0" + temp1 : temp1);	//和选择的年月拼成YYYY-MM-DD格式
																				endDate = tempYYMM + '-' + (temp2 < 10 ? "0" + temp2 : temp2);

																				panel2Thead.empty().append(theadHtml);

																				addTableData(queryCheckPlanUrl, {
																					"type": "detail",
																					"checkId": devicesCheckPlanID,
																					"startDate": startDate,
																					"endDate": endDate,
																					"startTime": startTime,
																					"endTime": endTime,
																					"headNum": 1
																				})
																			})

																			break;
																		}
																		case '#editDevicesCheckModal2': {	//审核
																			let dataContent = $('#editDevicesCheckModal2'),
																				panelList = dataContent.find('.panel'),
																				panel1 = panelList.eq(0),
																				panel2 = panelList.eq(1),
																				panel3 = panelList.eq(2),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-footer .modal-submit'),

																				panel2Tbody = panel2.find('tbody'),
																				panel2FuzzySearchGroup = panel2.find('.fuzzy-search-group'), // panel2头部主要按键_1
																				panel3Tbody = panel3.find('tbody'),
																				panel3HeadingMainBtn_1 = panel3.find('.head-main-btn-1'), // panel3头部主要按键_1

																				devicesCheckProjectList = [],															// 点检项目集合
																				devicesCheckExceptionsList = [],															// 异常记录集合
																				devicesCheckPlanID = dataList[currentTr.index()].devices_check_plan_id;	// 点检计划id

																				selectDate = moment().format('YYYY-MM-DD HH:mm:ss'),	//选择的时间，默认是当天
																				startDate = moment().format('YYYY-MM-DD'),	//按日期查找的开始时间，默认是当天
																				endDate = moment().format('YYYY-MM-DD');	//按日期查找的结束时间，默认是当天
																				startTime = moment().format('YYYY-MM-01'),	//异常记录搜索开始时间
																				endTime = moment().format('YYYY-MM-31');	//异常记录搜索结束时间

																			panel2FuzzySearchGroup.find('input').val(moment().format('YYYY-MM-DD'))	//初始化日期输入框，默认为当天

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功

																						mesloadBox.hide()
																						if (result.status === 0) {
																							//panel1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '设备名称/设备编号/点检表版本号/状态/创建人/点检人/班长确认人/技术确认人',
																								tableWitch: '20%/30%',
																								viewColGroup: 2,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.checks, // 主要数据列表
																										tempData = null; // 表格td内的临时数据

																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].devices.devices_control_devices_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 1: {
																												tempData = dataList[0].devices.devices_control_devices_number;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].devices_check_plan_version;
																												tbodyTd.eq(i).html(`版本${tempData}`)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].devices_check_plan_status;
																												let tempStr = `
																													<select class="form-control table-input input-sm">
																														<option value="0">启用</option>
																														<option value="1">关闭</option>
																													</select>
																												`;
																												tbodyTd.eq(i).addClass('table-input-td').html(tempStr);

																												let target = tbodyTd.eq(i).find('select');
																												target.val(tempData);

																												target.off('change').on('change', function () {
																													let planStatus = $(this).val();
																													swal({
																														title: '您确定要更改此状态吗？',
																														type: 'question',
																														showCancelButton: true,
																														confirmButtonText: '确定',
																														cancelButtonText: '取消'
																													}).then(function () {
																														$.ajax({
																															type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																															url: modifyCheckStatusUrl,
																															data: {
																																"planId": devicesCheckPlanID,
																																"planStatus": planStatus
																															},
																															success: function (result, status, xhr) {
																																if (result.status === 0) {
																																	let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																	swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																																}
																																else {
																																	swallFail()	//操作失败
																																}
																															},
																														})
																													},
																														(dismiss) => {
																															target.val(dataList[currentTr.index()].devices_check_plan_status);
																														})
																												})

																											}
																												break;
																											case 4: {
																												tempData = dataList[0].devices_check_plan_creator;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 5: {
																												tempData = dataList[0].devices_check_plan_people;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 6: {
																												tempData = dataList[0].devices_check_plan_monitor;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 7: {
																												tempData = dataList[0].devices_check_plan_artisan;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})

																							//panel2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '项目名称/基准/点检方法/点检时机/班次/点检结果/点检人/班长确认/技术确认',
																									theadWidth: '15%/15%/8%/8%/6%/13%/11%/11%/11%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.checks[0].devicesCheckProjects, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										devicesCheckProjectList = dataList;

																										for (let i = 0, len = dataList.length; i < len * 2; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
																												index = Math.floor(i / 2),
																												devicesCheckEntertList = dataList[index].devicesCheckEnters;

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = dataList[index].devices_check_project_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList[index].devices_check_project_standard;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[index].devices_check_project_method;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[index].devices_check_project_period;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														if (i % 2 == 0) {
																															currentTr.children().eq(j).html('上午')
																														} else {
																															currentTr.children().eq(j).html('下午')
																														}
																													}
																														break;
																													case 5: {

																														if (i % 2 == 0) {	//偶数行,上午
																															let isHaveDate = false;		//判断是否有记录
																															for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																if (devicesCheckEntertList[k].devices_check_enter_result_am !== null && devicesCheckEntertList[k].devices_check_enter_result_am !== '') {	 //有记录，让表格不可编辑
																																	isHaveDate = true
																																	currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_result_am)
																																	break;
																																}
																															}


																														} else {	//奇数行,下午
																															let isHaveDate = false;		//判断是否有记录
																															for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																if (devicesCheckEntertList[k].devices_check_enter_result_pm !== null && devicesCheckEntertList[k].devices_check_enter_result_pm !== '') {	 //有记录，让表格不可编辑
																																	isHaveDate = true
																																	currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_result_pm)
																																	break;
																																}
																															}

																														}

																													}
																														break;
																													case 6: {
																														if (i % 2 == 0) {	//偶数行,上午
																															for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																if (devicesCheckEntertList[k].devices_check_enter_result_am !== null && devicesCheckEntertList[k].devices_check_enter_result_am !== '') {	 //有记录，让表格不可编辑
																																	currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_people)
																																	currentTr.children().eq(j).data('checkEnterId', devicesCheckEntertList[k].devices_check_enter_id)
																																	break;
																																}
																															}


																														} else {	//奇数行,下午
																															for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																if (devicesCheckEntertList[k].devices_check_enter_result_pm !== null && devicesCheckEntertList[k].devices_check_enter_result_pm !== '') {	 //有记录，让表格不可编辑
																																	currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_people)
																																	currentTr.children().eq(j).data('checkEnterId', devicesCheckEntertList[k].devices_check_enter_id)
																																	break;
																																}
																															}

																														}
																														// currentTr.children().eq(j).html(devicesCheckEntertList[j].devices_check_enter_people)
																													}
																														break;
																													case 7: {
																														tempData = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`;

																														if (devicesCheckEntertList[0].devices_check_enter_people === null && devicesCheckEntertList[0].devices_check_enter_people === '') {	//没有点检记录
																															// currentTr.children().eq(j).addClass('table-input-td').append(tempData)
																														} else {

																															if (i % 2 == 0) {	//偶数行,上午
																																for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																	if (devicesCheckEntertList[k].devices_check_enter_result_am !== null && devicesCheckEntertList[k].devices_check_enter_result_am !== '') {
																																		if (devicesCheckEntertList[k].devices_check_enter_monitor !== null && devicesCheckEntertList[k].devices_check_enter_monitor !== '') { //有记录，让表格不可编辑
																																			currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_monitor)
																																		} else {
																																			currentTr.children().eq(j).addClass('table-input-td').html(tempData)
																																		}

																																		break;
																																	}
																																}
																															} else {	//奇数行,下午
																																for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																	if (devicesCheckEntertList[k].devices_check_enter_result_pm !== null && devicesCheckEntertList[k].devices_check_enter_result_pm !== '') {	 //有记录，让表格不可编辑
																																		if (devicesCheckEntertList[k].devices_check_enter_monitor !== null && devicesCheckEntertList[k].devices_check_enter_monitor !== '') { //有记录，让表格不可编辑
																																			currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_monitor)
																																		} else {
																																			currentTr.children().eq(j).addClass('table-input-td').html(tempData)
																																		}
																																		break;
																																	}
																																}

																															}

																															// if (devicesCheckEntertList[0].devices_check_enter_monitor === null) {	//无记录，让表格可编辑
																															// 	currentTr.children().eq(j).addClass('table-input-td').append(tempData)
																															// } else {	//有记录，让表格不可编辑
																															// 	currentTr.children().eq(j).html(devicesCheckEntertList[0].devices_check_enter_monitor)
																															// }
																														}

																													}
																														break;
																													case 8: {
																														tempData = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`;

																														if (devicesCheckEntertList[0].devices_check_enter_people === null && devicesCheckEntertList[0].devices_check_enter_people === '') {	//没有点检记录
																															// currentTr.children().eq(j).addClass('table-input-td').append(tempData)
																														} else {

																															if (i % 2 == 0) {	//偶数行,上午
																																for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																	if (devicesCheckEntertList[k].devices_check_enter_result_am !== null && devicesCheckEntertList[k].devices_check_enter_result_am !== '') {
																																		if (devicesCheckEntertList[k].devices_check_enter_monitor !== null && devicesCheckEntertList[k].devices_check_enter_monitor !== '') { //有记录，让表格不可编辑
																																			currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_monitor)
																																		} else {
																																			currentTr.children().eq(j).addClass('table-input-td').html(tempData)
																																		}

																																		break;
																																	}
																																}
																															} else {	//奇数行,下午
																																for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																	if (devicesCheckEntertList[k].devices_check_enter_result_pm !== null && devicesCheckEntertList[k].devices_check_enter_result_pm !== '') {	 //有记录，让表格不可编辑
																																		if (devicesCheckEntertList[k].devices_check_enter_monitor !== null && devicesCheckEntertList[k].devices_check_enter_monitor !== '') { //有记录，让表格不可编辑
																																			currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_monitor)
																																		} else {
																																			currentTr.children().eq(j).addClass('table-input-td').html(tempData)
																																		}
																																		break;
																																	}
																																}

																															}

																															// if (devicesCheckEntertList[0].devices_check_enter_artisan === null) {	//无记录，让表格可编辑
																															// 	currentTr.children().eq(j).addClass('table-input-td').append(tempData)
																															// } else {	//有记录，让表格不可编辑
																															// 	currentTr.children().eq(j).html(devicesCheckEntertList[0].devices_check_enter_artisan)
																															// }
																														}
																													}
																														break;
																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: dataList.length, // 总行数
																									displayRow: dataList.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})
																							//panel3
																							mesVerticalTableAddData(panel3, {
																								thead: {
																									theadContent: '发生时间/异常内容/记录人/异常处置/确认人/操作',
																									theadWidth: '23%/23%/10%/23%/10%/10%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.exceptions, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										devicesCheckExceptionsList = dataList;

																										for (let i = 0, len = dataList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = dataList[i].devices_exception_record_time
																														currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																													}
																														break;
																													case 1: {
																														tempData = dataList[i].devices_exception_record_content
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[i].devices_exception_record_people
																														currentTr.children().eq(j).html(tempData)
																														currentTr.children().eq(j).data('exceptionId', dataList[i].devices_exception_record_id)
																													}
																														break;
																													case 3: {
																														// let tempStr = `<input class="table-input" type="text" placeholder="请输入" />`;
																														// currentTr.children().eq(j).html(tempStr).addClass('table-input-td')
																														// let target = currentTr.children().eq(j).find('input');

																														// target.val(dataList[i].devices_exception_record_handling)
																														tempData = dataList[i].devices_exception_record_handling
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														let tempStr = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`;
																														tempData = dataList[i].devices_exception_record_identify_people
																														if (tempData === null) {
																															currentTr.children().eq(j).html(tempStr).addClass('table-input-td')
																														} else {
																															currentTr.children().eq(j).html(tempData)
																														}
																													}
																														break;
																													case 5: {

																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: dataList.length, // 总行数
																									displayRow: dataList.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})
																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}
																			addTableData(queryCheckPlanUrl, {
																				"type": "detail",
																				"checkId": devicesCheckPlanID,
																				"startDate": startDate,
																				"endDate": endDate,
																				"startTime": startTime,
																				"endTime": endTime,
																				"headNum": 1
																			})

																			// 日期搜索搜索按钮事件
																			panel2FuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																				let val = $(this).closest('.input-group').find('input').val();
																				startDate = val
																				endDate = val
																				selectDate = moment(new Date(val).getTime()).format('YYYY-MM-DD HH:mm:ss');

																				event.stopPropagation() // 禁止向上冒泡
																				if (val !== '') {
																					addTableData(queryCheckPlanUrl, {
																						"type": "detail",
																						"checkId": devicesCheckPlanID,
																						"startDate": startDate,
																						"endDate": endDate,
																						"startTime": startTime,
																						"endTime": endTime,
																						"headNum": 1
																					})
																				}
																				else {
																					// 为空时重置搜索
																					return false;
																				}
																				return false;	//阻止表单提交
																			});

																			// 日期搜索搜索回车事件
																			panel2FuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
																				if (event.keyCode === 13) {
																					event.preventDefault()
																					$(this).closest('.input-group').find('button').trigger('click')
																				}

																			});

																			// 添加员工选择模态框
																			panel2Tbody.add(panel3Tbody).off('focus').on('focus', 'tr td .selectStaff', function () {
																				let $this = $(this);
																				// 添加员工选择模态框
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																				});
																				promise.then(function (resolveData) {
																					$this.val(resolveData.roleStaffName)
																					$this.data('staffID', resolveData.roleStaffId)
																					// tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																					// submithData.role_workshop_principal = resolveData.roleStaffName
																				})


																				$(this).prop('readonly', true) // 输入框只读
																				$(this).off('blur').on('blur', () => {
																					$(this).removeProp('readonly') // 输入移除框只读
																				})
																			})

																			//新增异常记录按钮单击事件
																			panel3HeadingMainBtn_1.off('click').on('click', (event) => {
																				var temStr = `
																						<tr>
																							<td class="table-input-td">
																								<input class="table-input selectTime" type="text" placeholder="请输入" onclick="WdatePicker({maxDate:'%y-%M-%d'})" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input selectStaff" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input selectStaff" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<a class="table-link text-danger delete" href="javascript:;"><i class="fa fa-times"></i>移除</a>
																							</td>
																						</tr>
																				`;
																				panel3Tbody.append(temStr)
																			})

																			// panel3HeadingMainBtn_1.trigger('click')		//模拟点击新增项目，是进入页面后默认有一行

																			//移除异常记录按钮单击事件
																			panel3Tbody.on('click', 'tr td .delete', function () {
																				$(this).closest('tr').remove();  //移除该行元素
																			})

																			// 提交数据按钮单击事件
																			modalSubmitBtn.off('click').on('click', (event) => {
																				let $tr = panel2Tbody.find('tr'),	//点检记录行
																					$tr2 = panel3Tbody.find('tr'),	//变更记录行
																					enters2 = [],									// 修改点检项目集合
																					exceptions2 = []							// 修改异常记录集合

																				for (let i = 0, len = $tr.length; i < len; i++) {	//遍历点检记录行
																					let $td = $tr.eq(i).find('td'),
																						index = Math.floor(i / 2) ,
																					  enterObject = {
																						checkEnterId: '',	//项目记录id
																						monitor: '',		//班长确认
																						artisan: ''		//技术确认
																						};
																					// enterObject.checkEnterId = devicesCheckProjectList[index].devices_check_enter_id;

																						for (let j = 0, len = $td.length; j < len; j++) {	//遍历列

																							switch (j) {
																								case 6:
																									enterObject.checkEnterId = $td.eq(j).data('checkEnterId')
																									break;
																								case 7:
																									enterObject.monitor = $td.eq(j).find('input').data('staffID')
																									break;
																								case 8:
																									enterObject.artisan = $td.eq(j).find('input').data('staffID')
																									break;
																							}
																						}
																						// console.dir(enterObject)
																						if (enterObject.monitor !== '' && enterObject.monitor !== null && typeof (enterObject.monitor) !== "undefined" ||
																							enterObject.artisan !== '' && enterObject.artisan !== null && typeof (enterObject.artisan) !== "undefined") {
																							enters2.push(enterObject)
																						}

																				}

																				for (let i = 0, len = $tr2.length; i < len; i++) {	//遍历变更记录行
																					let $td = $tr2.eq(i).find('td'),
																					 tempObject = {
																					 	exceptionId: '',	//异常记录id
																						identifyStaff: '',	//确认人
																					};

																					// enterObject.planId = devicesCheckPlanID;
																					// console.dir(devicesCheckExceptionsList)
																					// tempObject.exceptionId = devicesCheckExceptionsList[i].devices_exception_record_id;

																					for (let j = 0, len = $td.length; j < len; j++) {	//遍历列
																						let tempData;

																						switch (j) {
																							case 2:
																								tempObject.exceptionId = $td.eq(j).data('exceptionId')
																								break;
																							// case 3:
																							// 	enterObject.handling = $td.eq(j).find('input').val()
																							// 	break;
																							case 4:
																								tempObject.identifyStaff = $td.eq(j).find('input').data('staffID')
																								break;
																						}
																					}

																					console.dir(tempObject)
																					if (
																						// enterObject.handling !== '' && enterObject.handling !== null ||		//修改点检
																						tempObject.identifyStaff !== '' && tempObject.identifyStaff !== null && typeof (tempObject.identifyStaff) !== "undefined" ) {
																							// enters2[index] = enterObject;
																						exceptions2.push(tempObject)
																						}

																				}

																				if (enters2.length !== 0 || exceptions2.length !== 0) {
																					swal({
																						title: '您确定要提交本次操作吗?',
																						text: '请确保填写信息无误后点击确定按钮',
																						type: 'question',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: true, // 显示用户取消按钮
																						confirmButtonText: '确定',
																						cancelButtonText: '取消',
																					}).then(function () {

																						console.log('修改点检记录' + enters2.length)
																						if (enters2.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: modifyDevicesEntryUrl,
																								data: { "enters": JSON.stringify(enters2) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										console.log('修改点检记录成功');
																									}
																									else {
																										swallFail()	//操作失败
																										console.log('修改点检记录失败');
																									}
																								}
																							})
																						}

																						console.log('修改变更记录' + exceptions2.length)
																						if (exceptions2.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: modifyDevicesExceptionUrl,
																								data: { "exceptions": JSON.stringify(exceptions2) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										let activePaginationBtn = panel1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn,modalCloseBtn)	//操作成功提示并刷新页面
																										console.log('修改变更记录成功');
																									}
																									else {
																										// swallFail()	//操作失败
																										console.log('修改变更记录失败');
																									}
																								}
																							})
																						}


																					});
																				}
																				else {
																					swallError()	//格式不正确
																				}

																			})

																			break
																		}
																		case '#editDevicesCheckModal': {	//执行
																			let dataContent = $('#editDevicesCheckModal'),
																				panelList = dataContent.find('.panel'),
																				panel1 = panelList.eq(0),
																				panel2 = panelList.eq(1),
																				panel3 = panelList.eq(2),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-footer .modal-submit'),

																				panel2Tbody = panel2.find('tbody'),
																				panel2FuzzySearchGroup = panel2.find('.fuzzy-search-group'), // panel2头部主要按键_1
																				panel3Tbody = panel3.find('tbody'),
																				panel3HeadingMainBtn_1 = panel3.find('.head-main-btn-1'), // panel3头部主要按键_1

																				devicesCheckProjectList = [],															// 点检项目集合
																				devicesCheckExceptionsList = [],															// 异常记录集合
																				devicesCheckPlanID = dataList[currentTr.index()].devices_check_plan_id;	// 点检计划id

																				selectDate = moment().format('YYYY-MM-DD HH:mm:ss'),	//选择的时间，默认是当天
																				startDate = moment().format('YYYY-MM-DD'),	//按日期查找的开始时间，默认是当天
																				endDate = moment().format('YYYY-MM-DD');	//按日期查找的结束时间，默认是当天
																				startTime = moment().format('YYYY-MM-01'),	//异常记录搜索开始时间
																				endTime = moment().format('YYYY-MM-31');	//异常记录搜索结束时间

																				panel2FuzzySearchGroup.find('input').val(moment().format('YYYY-MM-DD'))	//初始化日期输入框，默认为当天

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功

																						mesloadBox.hide()
																						if (result.status === 0) {
																							//panel1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '设备名称/设备编号/点检表版本号/状态/创建人/点检人/班长确认人/技术确认人',
																								tableWitch: '20%/30%',
																								viewColGroup: 2,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.checks, // 主要数据列表
																										tempData = null; // 表格td内的临时数据

																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].devices.devices_control_devices_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 1: {
																												tempData = dataList[0].devices.devices_control_devices_number;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].devices_check_plan_version;
																												tbodyTd.eq(i).html(`版本${tempData}`)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].devices_check_plan_status;
																												if (tempData === '0') {
																													tbodyTd.eq(i).html(`启用`)
																												}
																												else if (tempData === '1') {
																													tbodyTd.eq(i).html(`关闭`)
																												}
																											}
																												break;
																											case 4: {
																												tempData = dataList[0].devices_check_plan_creator;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 5: {
																												tempData = dataList[0].devices_check_plan_people;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 6: {
																												tempData = dataList[0].devices_check_plan_monitor;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 7: {
																												tempData = dataList[0].devices_check_plan_artisan;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})

																								//panel2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '项目名称/基准/点检方法/点检时机/班次/点检结果/点检人/班长确认/技术确认',
																									theadWidth: '15%/15%/8%/8%/6%/13%/11%/11%/11%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.checks[0].devicesCheckProjects, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										devicesCheckProjectList = dataList;

																										for (let i = 0, len = dataList.length; i < len*2; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
																												index = Math.floor(i / 2),
																												devicesCheckEntertList = dataList[index].devicesCheckEnters;

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = dataList[index].devices_check_project_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList[index].devices_check_project_standard;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[index].devices_check_project_method;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[index].devices_check_project_period;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														if ( i % 2 == 0) {
																															currentTr.children().eq(j).html('上午')
																														} else {
																															currentTr.children().eq(j).html('下午')
																														}
																													}
																														break;
																													case 5: {
																														tempData = `
																																	<select class="form-control table-input input-sm">
																																		<option value="">未选择</option>
																																		<option value="良好" class="text-success">良好</option>
																																		<option value="异常" class="text-danger">异常</option>
																																		<option value="送检" class="text-warning">送检</option>
																																	</select>
																															`;

																														if (i % 2 == 0) {	//偶数行,上午
																															let isHaveDate = false;		//判断是否有记录
																															for (let k = 0, len = devicesCheckEntertList.length; k < len; k++){
																																if (devicesCheckEntertList[k].devices_check_enter_result_am !== null && devicesCheckEntertList[k].devices_check_enter_result_am !== '') {	 //有记录，让表格不可编辑
																																	isHaveDate = true
																																	currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_result_am)
																																	break;
																																} else {	//无记录，让表格可编辑
																																	isHaveDate = false
																																}
																															}
																															if (!isHaveDate) {
																																currentTr.children().eq(j).addClass('table-input-td').append(tempData)
																																currentTr.children().eq(j).find('select').val(0)
																															}

																														} else {	//奇数行,下午
																															let isHaveDate = false;		//判断是否有记录
																															for (let k = 0, len = devicesCheckEntertList.length; k < len; k++) {
																																if (devicesCheckEntertList[k].devices_check_enter_result_pm !== null && devicesCheckEntertList[k].devices_check_enter_result_pm !== '') {	 //有记录，让表格不可编辑
																																	isHaveDate = true
																																	currentTr.children().eq(j).html(devicesCheckEntertList[k].devices_check_enter_result_pm)
																																	break;
																																} else {	//无记录，让表格可编辑
																																	isHaveDate = false
																																}
																															}
																															if (!isHaveDate) {
																																currentTr.children().eq(j).addClass('table-input-td').append(tempData)
																																currentTr.children().eq(j).find('select').val(0)
																															}
																														}

																													}
																														break;
																													case 6: {
																														tempData = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`;
																															if (devicesCheckEntertList[0].devices_check_enter_people === null) {	//无记录，让表格可编辑
																																currentTr.children().eq(j).addClass('table-input-td').append(tempData)
																															} else {	//有记录，让表格不可编辑
																																currentTr.children().eq(j).html(devicesCheckEntertList[0].devices_check_enter_people)
																															}
																													}
																														break;
																													case 7: {
																														// tempData = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`;
																															if (devicesCheckEntertList[0].devices_check_enter_monitor === null) {	//无记录，让表格可编辑
																																currentTr.children().eq(j).html('')
																															} else {	//有记录，让表格不可编辑
																																currentTr.children().eq(j).html(devicesCheckEntertList[0].devices_check_enter_monitor)
																															}
																													}
																														break;
																													case 8: {
																														// tempData = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`;
																															if (devicesCheckEntertList[0].devices_check_enter_artisan === null) {	//无记录，让表格可编辑
																																currentTr.children().eq(j).html('')
																															} else {	//有记录，让表格不可编辑
																																currentTr.children().eq(j).html(devicesCheckEntertList[0].devices_check_enter_artisan)
																															}
																													}
																														break;
																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: dataList.length, // 总行数
																									displayRow: dataList.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})
																								//panel3
																							mesVerticalTableAddData(panel3, {
																								thead: {
																									theadContent: '发生时间/异常内容/记录人/异常处置/确认人/操作',
																									theadWidth: '23%/23%/10%/23%/10%/10%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.exceptions, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										devicesCheckExceptionsList = dataList;

																										for (let i = 0, len = dataList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																											currentTr.data('exceptionId', 'devicesCheckExceptionsList.devices_exception_record_id')

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = dataList[i].devices_exception_record_time
																														currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																													}
																														break;
																													case 1: {
																														tempData = dataList[i].devices_exception_record_content
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[i].devices_exception_record_people
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {

																														// let tempStr = `<input class="table-input" type="text" placeholder="点此选择" />`;
																														// tempData = dataList[i].devices_exception_record_handling
																														// currentTr.children().eq(j).html(tempStr).addClass('table-input-td')
																														// let target = currentTr.children().eq(j).find('input');
																														// target.val(tempData)

																														tempData = dataList[i].devices_exception_record_handling
																														if (tempData === null) {
																															currentTr.children().eq(j).html('')
																														} else {
																															currentTr.children().eq(j).html(tempData)
																														}

																													}
																														break;
																													case 4: {
																														tempData = dataList[i].devices_exception_record_identify_people
																														if (tempData === null) {
																															currentTr.children().eq(j).html('')
																														} else {
																															currentTr.children().eq(j).html(tempData)
																														}

																													}
																														break;
																													case 5: {

																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: dataList.length, // 总行数
																									displayRow: dataList.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})
																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}
																			addTableData(queryCheckPlanUrl, {
																				"type": "detail",
																				"checkId": devicesCheckPlanID,
																				"startDate": startDate,
																				"endDate": endDate,
																				"startTime": startTime,
																				"endTime": endTime,
																				"headNum": 1
																			})

																			// 日期搜索搜索按钮事件
																			panel2FuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																				let val = $(this).closest('.input-group').find('input').val();
																					startDate = val
																					endDate = val
																				selectDate = moment(new Date(val).getTime()).format('YYYY-MM-DD HH:mm:ss');

																				event.stopPropagation() // 禁止向上冒泡
																				if (val !== '') {
																					addTableData(queryCheckPlanUrl, {
																						"type": "detail",
																						"checkId": devicesCheckPlanID,
																						"startDate": startDate,
																						"endDate": endDate,
																						"headNum": 1
																					})
																				}
																				else {
																					// 为空时重置搜索
																					return false;
																				}
																				return false;	//阻止表单提交
																			});

																			// 日期搜索搜索回车事件
																			panel2FuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
																				if (event.keyCode === 13) {
																					event.preventDefault()
																					$(this).closest('.input-group').find('button').trigger('click')
																				}

																			});

																			// 添加员工选择模态框
																			panel2Tbody.add(panel3Tbody).off('focus').on('focus','tr td .selectStaff', function () {
																				let $this = $(this);
																				// 添加员工选择模态框
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																				});
																				promise.then(function (resolveData) {
																					$this.val(resolveData.roleStaffName)
																					$this.data('staffID', resolveData.roleStaffId)
																					// tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																					// submithData.role_workshop_principal = resolveData.roleStaffName
																				})


																				$(this).prop('readonly', true) // 输入框只读
																				$(this).off('blur').on('blur', () => {
																					$(this).removeProp('readonly') // 输入移除框只读
																				})
																			})

																			panel3Tbody.off('focus').on('focus', 'tr td .selectTime', function () {

																			})

																			//新增异常记录按钮单击事件
																			panel3HeadingMainBtn_1.off('click').on('click', (event) => {
																				var temStr = `
																						<tr>
																							<td class="table-input-td">
																								<input class="table-input selectTime" type="text" placeholder="请输入" onclick="WdatePicker({maxDate:'%y-%M-%d'})" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input selectStaff" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">

																							</td>
																							<td class="table-input-td">
																								<a class="table-link text-danger delete" href="javascript:;"><i class="fa fa-times"></i>移除</a>
																							</td>
																						</tr>
																				`;
																				panel3Tbody.append(temStr)
																			})

																			// panel3HeadingMainBtn_1.trigger('click')		//模拟点击新增项目，是进入页面后默认有一行

																			//移除异常记录按钮单击事件
																			panel3Tbody.on('click', 'tr td .delete', function () {
																				$(this).closest('tr').remove();  //移除该行元素
																			})

																			// 提交数据按钮单击事件
																			modalSubmitBtn.off('click').on('click', (event) => {
																				let $tr = panel2Tbody.find('tr'),	//点检记录行
																					$tr2 = panel3Tbody.find('tr'),	//变更记录行
																					enters = [],									// 新增点检项目集合
																					exceptions = []							// 新增异常项目集合


																				for (let i = 0 ,len = $tr.length; i < len; i++) {	//遍历点检记录行
																						let $td = $tr.eq(i).find('td'),
																							index = Math.floor(i / 2),
																							enterObject = {
																							projectId: '',	//项目id
																							enterStaff: '',	//点检人员
																							monitor: '',		//班长确认
																							artisan: '',		//技术确认
																							resultAM: '',		//上午点检结果
																							resultPM: '',		//下午点检结果
																							enterTime: ''		//点检日期
																							};
																						enterObject.enterTime = startDate
																						enterObject.projectId = devicesCheckProjectList[index].devices_check_project_id;

																					if (i % 2 === 0) {	//偶数行,上午点检记录

																						for (let j = 0, len = $td.length; j < len; j++) {	//遍历列
																							switch (j) {
																								case 5:
																									enterObject.resultAM = $td.eq(j).find('select').val()
																									break;
																								case 6:
																									enterObject.enterStaff = $td.eq(j).find('input').data('staffID')
																									break;
																							}
																						}

																					} else {	//奇数行,下午点检记录

																						for (let j = 0, len = $td.length; j < len; j++) {	//遍历列

																							switch (j) {
																								case 5:
																									enterObject.resultPM = $td.eq(j).find('select').val()
																									break;
																								case 6:
																									enterObject.enterStaff = $td.eq(j).find('input').data('staffID')
																									break;
																							}
																						}

																					}

																					console.dir(enterObject)

																					if (enterObject.resultAM !== ''   &&
																						enterObject.enterStaff !== '' && typeof (enterObject.enterStaff) !== "undefined") {
																						enters.push(enterObject)
																					} else if ( enterObject.resultPM !== '' &&
																						enterObject.enterStaff !== '' && typeof (enterObject.enterStaff) !== "undefined"){
																						enters.push(enterObject)
																					}

																				}

																				for (let i = 0, len = $tr2.length; i < len; i++) {	//遍历变更记录行
																					let $td = $tr2.eq(i).find('td'),
																						exceptionId = $tr2.eq(i).data('exceptionId');

																						var enterObject = {
																							planId: '',				//点检表id
																							recordTime: '',		//记录时间
																							content: '',			//变更内容
																							recordStaff: '',	//记录人
																							handling: '',			//变更处置
																							identifyStaff: ''	//确认人
																						};
																						enterObject.planId = devicesCheckPlanID;

																						console.log(exceptionId)
																						if (exceptionId !== null && typeof (exceptionId) !== "undefined") {
																							continue;
																						}

																						for (let j = 0, len = $td.length; j < len; j++) {	//遍历列
																							let tempData;

																							switch (j) {
																								case 0:
																									tempData = $td.eq(j).find('input').val()
																									enterObject.recordTime = moment(tempData).format('YYYY-MM-DD HH:mm:ss')
																									break;
																								case 1:
																									enterObject.content = $td.eq(j).find('input').val()
																									break;
																								case 2:
																									enterObject.recordStaff = $td.eq(j).find('input').data('staffID')
																									break;
																								case 3:
																									enterObject.handling = $td.eq(j).find('input').val()
																									break;
																								case 4:
																									// enterObject.identifyStaff = $td.eq(j).find('input').data('staffID')
																									break;
																							}
																						}
																					 if (enterObject.recordTime !== '' || enterObject.recordTime !== null || //新增点检变更
																							enterObject.content !== '' || enterObject.content !== null ||
																							enterObject.recordStaff !== '' || enterObject.recordStaff !== null) {
																							// enters[index] = enterObject;
																							exceptions.push(enterObject)
																						}

																				}

																				if (enters.length !== 0 || exceptions.length !== 0 ) {
																					swal({
																						title: '您确定要提交本次操作吗?',
																						text: '请确保填写信息无误后点击确定按钮',
																						type: 'question',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: true, // 显示用户取消按钮
																						confirmButtonText: '确定',
																						cancelButtonText: '取消',
																					}).then(function () {

																						console.log('新增点检记录:' + enters.length)
																						console.dir(enters)
																						if (enters.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: saveDevicesEntrysUrl,
																								data: { "enters": JSON.stringify(enters) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										console.log('新增点检记录成功');
																									}
																									else {
																										swallFail()	//操作失败
																										console.log('新增点检记录失败');
																									}
																								}
																							})
																						}

																						console.log('新增变更记录' + exceptions.length)
																						console.dir(exceptions)
																						if (exceptions.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: saveDevicesExceptionUrl,
																								data: { "exceptions": JSON.stringify(exceptions) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(modalCloseBtn)	//操作成功提示并刷新页面
																										// modalCloseBtn.trigger('click')	//关闭模态框
																										console.log('新增变更记录成功');
																									}
																									else {
																										// swallFail()	//操作失败
																										console.log('新增变更记录失败');
																									}
																								}
																							})
																						}

																					});
																				}
																				else {
																					swallError()	//格式不正确
																				}

																			})

																			break
																		}
																		case 'delete': {	//删除
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].product_line_id;

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeProductLinesUrl,
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: { "type": "delete", "productLineId": currentTrNntryID },
																					success: function (result) {
																						if (result.status === 0) {
																							let activePaginationBtn = panel1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																							swallSuccess(activePaginationBtn);	//操作成功提示并刷新页面
																						}
																						else {
																							swallFail();	// 提交失败，请重新提交提示
																						}
																					}
																				})
																			})
																			break
																		}
																		default:
																			break;
																	}
																})
															}
																break;

															default:
																break;
														}
													}
												}
											}
										},

										pagination: {
											totalRow: result.map.lines, // 总行数
											displayRow: result.map.checks.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									paginationContainer.hide()
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryCheckPlanUrl, {
						type: "info",
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryCheckPlanUrl, {
								type: "info",
								devicesName: val,
								headNum: 1,
								key: 'keyWord'
							})
							// $(this).closest('.input-group').find('input').val('')
						}
						else {		// 为空时搜索全部
							addTableData(queryCheckPlanUrl, {
								type: "info",
								headNum: 1
							})
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
						}

					});

					// 下拉选事件
					devicesTypeOption.change(function () {
						let currentDevicesTypeID = $(this).val();
						console.log($(this).val())
						addTableData(queryCheckPlanUrl, {
							type: "info",
							devicesTypeId: currentDevicesTypeID,
							headNum: 1
						});
					})

				}())
				break;
			case '#devicesMaintain2'://新建点检记录
				(function () {
					let activeSwiper = $('#devicesMaintain2'), // 右侧外部swiper
						activeSubSwiper = $('#devicesMaintain2InerSwiper'), // 右侧内部swiper
						panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
						panel1 = panelList.eq(0),
						panel2 = panelList.eq(1),
						activePanelHeading1 = panel2.find('.panel-heading'), // 面板2头部
						headingMainBtn_1 = activePanelHeading1.find('.head-main-btn-1'),// 面板2头部主要按键_1
						panel_table = panel2.find('table'),	// 面板表格
						modalSubmitBtn = panel2.find('.panel-footer .modal-submit'), // 提交按钮
						checkProjectList = [],	// 点检项目集合

						//要提交的数据，点检表基础信息
						submithData = {
							deviceId: '',	// 点检表设备id
							creator: '',	// 创建人
							peopleId: '',	  // 点检表点检人id
							monitorId: '',	// 班长确认人id
							artisanId: ''   // 技术确认人id
						}

					panel_table.find('tbody').empty()

					//新增项目按钮单击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						var temStr = `
								<tr>
									<td class="table-input-td">
										<input class="table-input" type="text" placeholder="请输入（必填）" />
									</td>
									<td class="table-input-td">
										<input class="table-input" type="text" placeholder="请输入 （必填）" />
									</td>
									<td class="table-input-td">
											<select class="form-control table-input input-sm">
												<option value="目测">目测</option>
												<option value="实测">实测</option>
												<option value="其它">其它</option>
											</select>
									</td>
									<td class="table-input-td">
											<select class="form-control table-input input-sm">
												<option value="班前">班前</option>
												<option value="班时">班时</option>
												<option value="班后">班后</option>
											</select>
									</td>
									<td class="table-input-td">
										<a class="table-link text-danger delete" href="javascript:;"><i class="fa fa-times"></i>移除</a>
									</td>
								</tr>
						`;
						panel_table.find('tbody').append(temStr)
					})

					headingMainBtn_1.trigger('click')		//默认添加一行

					// 主表格1添加内容，基础信息部分
					mesHorizontalTableAddData(panel1.find('table'), null, {
						thead: '设备名称/设备编号/创建人/点检人/班长确认/技术确认',
						tableWitch: '20%/30%',
						viewColGroup: 2,
						importStaticData: (tbodyTd, length) => {
							let inputHtml;

							for (let i = 0, len = length; i < len; i++)
								switch (i) {
									case 0: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择设备（必选）" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											// 添加设备选择模态框
											let promise = new Promise(function (resolve, reject) {
												selectDevicessAddData2(resolve)
											});
											promise.then(function (resolveData) {
												tbodyTd.eq(i).find('input').val(resolveData.devicesName)	//将选择的设备名称写入输入框
												tbodyTd.eq(i+1).html(resolveData.devicesNumber)						//将选择的设备编号写入下一格
												submithData.deviceId = resolveData.devicesId;		//获取选择的设备id
											})

											$(this).prop('readonly', true) // 输入框只读
											$(this).off('blur').on('blur', () => {
												$(this).removeProp('readonly') // 输入移除框只读
											})
										})

										break;
									}
									case 1: {

									}
										break;
									case 2: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工（必选）" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											// 添加员工选择模态框
											let promise = new Promise(function (resolve, reject) {
												selectStaffAddData(resolve, queryStaffUrl, { headNum: 1 })
											});
											promise.then(function (resolveData) {
												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
												submithData.creator = resolveData.roleStaffId 		// 获取选择的员工id
											})

											$(this).prop('readonly', true) // 输入框只读
											$(this).off('blur').on('blur', () => {
												$(this).removeProp('readonly') // 输入移除框只读
											})
										})

									}
										break;
									case 3: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工（必选）" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											// 添加员工选择模态框
											let promise = new Promise(function (resolve, reject) {
												selectStaffAddData(resolve, queryStaffUrl, { headNum: 1 })
											});
											promise.then(function (resolveData) {
												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
												submithData.peopleId = resolveData.roleStaffId 		// 获取选择的员工id
											})

											$(this).prop('readonly', true) // 输入框只读
											$(this).off('blur').on('blur', () => {
												$(this).removeProp('readonly') // 输入移除框只读
											})
										})

									}
										break;
									case 4: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工（必选）" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											// 添加员工选择模态框
											let promise = new Promise(function (resolve, reject) {
												selectStaffAddData(resolve, queryStaffUrl, { headNum: 1 })
											});
											promise.then(function (resolveData) {
												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
												submithData.monitorId = resolveData.roleStaffId	// 获取选择的员工id
											})

											$(this).prop('readonly', true) // 输入框只读
											$(this).off('blur').on('blur', () => {
												$(this).removeProp('readonly') // 输入移除框只读
											})
										})

									}
										break;
									case 5: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工（必选）" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											// 添加员工选择模态框
											let promise = new Promise(function (resolve, reject) {
												selectStaffAddData(resolve, queryStaffUrl, { headNum: 1 })
											});
											promise.then(function (resolveData) {
												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
												submithData.artisanId = resolveData.roleStaffId	// 获取选择的员工id
											})

											$(this).prop('readonly', true) // 输入框只读
											$(this).off('blur').on('blur', () => {
												$(this).removeProp('readonly') // 输入移除框只读
											})
										})
									}
										break;

									default:
										break;
								}

						}
					})


					//移除项目按钮单击事件
					panel_table.off('click').on('click', 'tr td .delete', function() {
						$(this).closest('tr').remove();  //移除该行元素
					})
					//提交按钮单击事件
					modalSubmitBtn.off('click').on('click', (event) => {
						let $tr = panel_table.find('tbody tr');

						for (let i = 0, len = $tr.length; i < len; i++){	//遍历行
							let $td = $tr.eq(i).find('td'),
							//要提交的数据，点检项目
							submithData2 = {
								name: '',			//项目名称
								standard: '',	//项目基准
								method: '',		//点检方法
								period: '',		//点检时机
							};

							for (let i = 0, len = $td.length - 1; i < len; i++) {	//遍历列
								switch (i) {
									case 0: {
										submithData2.name = $td.eq(i).find('input').val().replace(/\s/g, "");
										break;
									}
									case 1: {
										submithData2.standard = $td.eq(i).find('input').val().replace(/\s/g, "");
										break;
									}
									case 2: {
										submithData2.method = $td.eq(i).find('select').val();
										break;
									}
									case 3: {
										submithData2.period = $td.eq(i).find('select').val();
										break;
									}
								}
							}
							// 拼成字符串,"名称:基准:方法:时机"
							let tempStr = `${submithData2.name}:${submithData2.standard}:${submithData2.method}:${submithData2.period}`;
							checkProjectList[i] = tempStr;
						}

						console.dir(submithData)

						if (checkProjectList.length !== 0 &&
							submithData.deviceId !== '' &&
							submithData.creator !== '' &&
							submithData.peopleId !== '' &&
							submithData.monitorId !== '' &&
							submithData.artisanId !== ''
						) {
							swal({
								title: '您确定要提交本次操作吗?',
								text: '请确保填写信息无误后点击确定按钮',
								type: 'question',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: true, // 显示用户取消按钮
								confirmButtonText: '确定',
								cancelButtonText: '取消',
							}).then(function () {
								$.ajax({
									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
									url: saveDevicesCheckUrl,
									data: {
										"deviceId": submithData.deviceId,
										"creator": submithData.creator,
										"people": submithData.peopleId,
										"monitor": submithData.monitorId,
										"artisan": submithData.artisanId,
										"checkProjects": checkProjectList.toString()
									},
									success: function (result, status, xhr) {
										if (result.status === 0) {
											swallSuccess()	//操作成功提示并刷新页面
										}
										else {
											swallFail();	//操作失败
										}
									}
								})
							});
						}
						else {
							swallError();	//格式不正确
						}
					})

				}())
				break;
			case '#devicesCheck1':	//检修保养计划列表
				(function () {
					let activeSwiper = $('#devicesCheck1'), // 右侧外部swiper
						activeSubSwiper = $('#devicesCheck1InerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签

						devicesTypeOption = activePanelHeading.find('.devices-type-option'), // 设备类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: url,
							data: data,
							beforeSend: function (xml) {
								// ajax发送前
								mesloadBox.loadingShow()
							},
							success: function (result, status, xhr) {
								// ajax成功
								mesloadBox.hide()
								if (result.status === 0) {

									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/计划编号/计划名称/计划类型/创建者/创建时间/状态/下次保养时间/操作',
											theadWidth: '4%/12%/14%/8%/6%/9%/6%/9%/16%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td">' +
													'<a class="table-link dataDetails upkeepPlanDetail" href="javascript:;" data-toggle-modal-target="#maintainDetailsModal"><i class="fa fa-tasks fa-fw"></i>详情</a>' +
													'<a class="table-link upkeepPlanAudit" href="javascript:;" data-toggle-modal-target="#editMaintainRecordModal2"><i class="fa fa-calculator"></i>审核</a>' +
													'<a class="table-link execute upkeepPlanExcute" href="javascript:;" data-toggle-modal-target="#editMaintainRecordModal"><i class="fa fa-pencil-square-o"></i>执行</a>' +
												'</td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.planList, // 主要数据列表
													tempData = null; // 表格td内的临时数据

												for (let i = 0, len = dataList.length; i < len; i++) {
													tbodyTarget.append('<tr></tr>'); // 添加行
													let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
													for (let i = 0, len = html.length; i < len; i++) {
														currentTr.append(html[i]); // 添加表格内的HTML
														switch (i) {
															case 0:
																currentTr.children().eq(i).html(currentTr.index() + 1)
																break;
															case 1:
																tempData = dataList[currentTr.index()].devices_upkeep_plan_numker;
																currentTr.children().eq(i).html(tempData)

																break;
															case 2:
																tempData = dataList[currentTr.index()].devices_upkeep_plan_name;
																currentTr.children().eq(i).html(tempData)

																break;
															case 3:
																tempData = dataList[currentTr.index()].devices_upkeep_plan_type;
																currentTr.children().eq(i).html(tempData)

																break;

															case 4:
																tempData = dataList[currentTr.index()].devices_upkeep_plan_creator;
																currentTr.children().eq(i).html(tempData)

																break;
															case 5:
																tempData = dataList[currentTr.index()].devices_upkeep_plan_date;
																currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))

																break;
															case 6:
																tempData = dataList[currentTr.index()].devices_upkeep_plan_status;
																if (tempData === '0') {
																	tempData = '未执行'
																	currentTr.children().eq(i).html(tempData)
																} else if (tempData === '1'){
																	tempData = '执行中'
																	currentTr.children().eq(i).html(tempData).addClass('text-warning')
																} else if (tempData === '2') {
																	tempData = '已完成'
																	currentTr.children().eq(i).html(tempData).addClass('text-success')
																}

																break;
															case 7:
																tempData = dataList[currentTr.index()].nextDate;
																currentTr.children().eq(i).html(tempData)

																break;
															case 8:
																tempData = dataList[currentTr.index()].devices_upkeep_plan_status;

																if (tempData === '2' || tempData === '0') {	//代表已完成或未执行,隐藏执行按钮
																	currentTr.children().eq(i).find('.execute').addClass('hide')
																} else {
																	currentTr.children().eq(i).find('.execute').removeClass('hide')
																}

																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据
																	upkeepPlanID = dataList[currentTr.index()].devices_upkeep_plan_id;

																	switch (dataContent) {
																		case '#maintainDetailsModal': {	//详情
																			let dataContent = $('#maintainDetailsModal'),
																				panelList = dataContent.find('.panel'),
																				panel1 = panelList.eq(0),
																				panel2 = panelList.eq(1),
																				panel3 = panelList.eq(2),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),

																				panel2Thead = panel2.find('thead'),
																				panel2Tbody = panel2.find('tbody'),
																				panel3Tbody = panel3.find('tbody');

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功
																						mesloadBox.hide()
																						if (result.status === 0) {
																							//panel1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '计划名称/计划编号/计划类型/创建者/创建时间/总负责人',
																								// tableWitch: '25%/75%',
																								viewColGroup: 3,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.upkeepProjects, // 主要数据列表
																										upkeepChangeList = map.upkeepChanges, // 主要数据列表
																										tempData = null; // 表格td内的临时数据
																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].upkeepPlan.devices_upkeep_plan_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 1: {
																												tempData = dataList[0].upkeepPlan.devices_upkeep_plan_numker;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].upkeepPlan.devices_upkeep_plan_type;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].upkeepPlan.devices_upkeep_plan_creator;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 4: {
																												tempData = dataList[0].upkeepPlan.devices_upkeep_plan_date;
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																											}
																												break;
																											case 5: {
																												tempData = dataList[0].upkeepPlan.devices_upkeep_plan_principal;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 6: {
																												// tempData = dataList[0].upkeepPlan.devices_upkeep_plan_numker;
																												// tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 7: {
																												tempData = dataList[0].upkeepPlan.devices_upkeep_plan_status;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})

																							//panel2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '序号/设备名称/设备编号/保养项目/保养基准/周期/负责人/明细记录',
																									theadWidth: '5%/15%/10%/10%/25%/10%/10%/10%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td class="table-input-td"><a class="table-link dataDetails" href="javascript:;" data-toggle-modal-target="#publicSelectModalBox"><i class="fa fa-tasks fa-fw"></i>明细</a></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.upkeepProjects, // 主要数据列表
																											upkeepChangeList = map.upkeepChanges, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										for (let i = 0, len = dataList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = i+1;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList[i].devices.devices_control_devices_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[i].devices.devices_control_devices_number;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[i].upkeepProject.devices_upkeep_project_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList[i].upkeepProject.devices_upkeep_project_standard;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = dataList[i].upkeepProject.devices_upkeep_project_period;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 6: {
																														tempData = dataList[i].devices_upkeep_principal;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;

																													case 7: {			//明细
																														currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																															// let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																															let dataContent = dataDetailsModal,
																																panelModal2 = dataContent.find('.panel'),
																																modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																modalSubmitBtn = dataContent.find('.modal-submit'),

																																planProjectIdID = dataList[i].devices_upkeep_plan_project_id;

																															// 修改标题
																															panelModal2.find('.panel-heading').find('.panel-title').text('保养明细记录') // 更换panel标题
																															modalSubmitBtn.hide()

																															dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
																																$('body').addClass('modal-open')
																															})
																															dataContent.modal({
																																backdrop: false, // 黑色遮罩不可点击
																																keyboard: false,  // esc按键不可关闭模态框
																																show: false
																															})
																															dataContent.modal('show') // 运行时显示
																															modalCloseBtn.off('click').on('click', (event) => {
																																// 点击关闭按钮隐藏该模态框
																																dataContent.modal('hide')

																																// 初始化表格
																																// targetTable.find('thead').empty()
																																// targetTable.find('tbody').empty()
																															})
																															// 加载数据
																															function addTableData(url, data) {
																																$.ajax({
																																	type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																	url: url,
																																	data: data,
																																	beforeSend: function (xml) {
																																		// ajax发送前
																																		mesloadBox.loadingShow()
																																	},
																																	success: function (result, status, xhr) {
																																		// ajax成功
																																		mesloadBox.hide()
																																		if (result.status === 0) {
																																			mesVerticalTableAddData(panelModal2, {
																																				thead: {
																																					theadContent: '序号/计划日期/实施日期/保养结果/异常情况记录/记录人/确认人',
																																					theadWidth: '5%/15%/15%/15%/15%/15%/15%'
																																				},
																																				tbody: {
																																					html: [
																																						'<td></td>',
																																						'<td></td>',
																																						'<td></td>',
																																						'<td></td>',
																																						'<td></td>',
																																						'<td></td>',
																																						'<td></td>'
																																					],

																																					// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																					dataAddress: function (tbodyTarget, html, result) {
																																						tbodyTarget.empty() // 清空表格主体
																																						let map = result.map, // 映射
																																							dataList = map.upkeepEnters, // 主要数据列表
																																							tempData = null; // 表格td内的临时数据

																																						for (let i = 0, len = dataList.length; i < len; i++) {
																																							tbodyTarget.append('<tr></tr>'); // 添加行
																																							let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																																							for (let j = 0, len = html.length; j < len; j++) {
																																								currentTr.append(html[j]); // 添加表格内的HTML
																																								switch (j) {
																																									case 0: {
																																										currentTr.children().eq(j).html(currentTr.index() + 1)
																																									}
																																										break;
																																									case 1: {
																																										tempData = dataList[i].devices_upkeep_enter_schedule;
																																										currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'));
																																									}
																																										break;
																																									case 2: {
																																										tempData = dataList[i].devices_upkeep_enter_date;
																																										if (tempData !== null) {
																																											currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'));
																																										}
																																									}
																																										break;
																																									case 3: {
																																										tempData = dataList[i].devices_upkeep_enter_result;
																																										currentTr.children().eq(j).html(tempData);
																																									}
																																										break;
																																									case 4: {
																																										tempData = dataList[i].devices_upkeep_enter_feedback;
																																										currentTr.children().eq(j).html(tempData);
																																									}
																																										break;
																																									case 5: {
																																										tempData = dataList[i].devices_upkeep_enter_people;
																																										currentTr.children().eq(j).html(tempData);
																																									}
																																										break;
																																									case 6: {
																																										tempData = dataList[i].devices_upkeep_enter_identify_people;
																																										currentTr.children().eq(j).html(tempData);
																																									}
																																										break;
																																									default:
																																										break;
																																								}
																																							}
																																						}
																																					}
																																				},

																																				pagination: {
																																					totalRow: result.map.upkeepEnters.length, // 总行数
																																					displayRow: result.map.upkeepEnters.length // 显示行数
																																				},

																																				ajax: {
																																					url: url,
																																					data: data
																																				}
																																			})
																																		}
																																		else {
																																			mesloadBox.warningShow();
																																		}
																																	}
																																})
																															}
																															addTableData(queryUpkeepPlansUrl, {
																																type: "enter",
																																planProjectId: planProjectIdID,
																																headNum: 1
																															})

																															// $.ajax({
																															// 	type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																															// 	url: queryUpkeepPlansUrl,
																															// 	data: {
																															// 		"type": "enter",
																															// 		"planProjectId": planProjectIdID,
																															// 		"headNum": 1
																															// 	},
																															// 	success: function (result, status, xhr) {
																															// 		if (result.status === 0) {
																															// 			upkeepEnterList = result.map.upkeepEnters
																															// 		}
																															// 		else {
																															// 			swallFail();	//操作失败
																															// 		}
																															// 	}
																															// })

																														})
																														}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: result.map.lines, // 总行数
																									displayRow: result.map.upkeepProjects.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}

																							})

																							//panel3
																							mesVerticalTableAddData(panel3, {
																								thead: {
																									theadContent: '序号/设备名称/设备编号/变更类型/变更内容/变更原因/记录时间/记录人/确认人',
																									theadWidth: '5%/13%/13%/13%/13%/13%/13%/8%/8%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.upkeepProjects, // 主要数据列表
																											upkeepChangeList = map.upkeepChanges, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										console.dir('变更记录：'+upkeepChangeList)

																										for (let i = 0, len = upkeepChangeList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														currentTr.children().eq(j).html(i+1)
																													}
																														break;
																													case 1: {
																														tempData = upkeepChangeList[i].devices.devices_control_devices_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = upkeepChangeList[i].devices.devices_control_devices_number;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_type;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_content;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_reasons;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 6: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_time;
																														currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																													}
																														break;
																													case 7: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_people;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 8: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_identify_people;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: result.map.lines, // 总行数
																									displayRow: dataList.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})

																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}

																			// 导航栏点击时运行数据加载
																			addTableData(queryUpkeepPlansUrl, {
																				type: "planDetail",
																				planId: upkeepPlanID,
																				headNum: 1
																			})

																			break;
																		}
																		case '#editMaintainRecordModal2': {	//审核
																			let dataContent = $('#editMaintainRecordModal2'),
																				panelList = dataContent.find('.panel'),
																				panel1 = panelList.eq(0),
																				panel2 = panelList.eq(1),
																				panel3 = panelList.eq(2),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-footer .modal-submit'),

																				panel2Tbody = panel2.find('tbody'),
																				panel2FuzzySearchGroup = panel2.find('.fuzzy-search-group'), // panel2头部主要按键_1
																				panel3Tbody = panel3.find('tbody'),
																				panel3HeadingMainBtn_1 = panel3.find('.head-main-btn-1'), // panel3头部主要按键_1

																				devicesUpkeepProjectList = [],															// 保养项目集合
																				devicesUpkeepChangeList = [],															// 变更记录集合
																				devicesCheckPlanID = dataList[currentTr.index()].devices_check_plan_id;	// 点检计划id

																			selectDate = moment().format('YYYY-MM-DD HH:mm:ss'),	//选择的时间，默认是当天
																				startDate = moment().format('YYYY-MM-DD'),	//按日期查找的开始时间，默认是当天
																				endDate = moment().format('YYYY-MM-DD');	//按日期查找的结束时间，默认是当天

																			panel2FuzzySearchGroup.find('input').val(moment().format('YYYY-MM-DD'))	//初始化日期输入框，默认为当天

																			// 主表格添加内容,保养计划基础信息
																			function addTableData1(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功
																						mesloadBox.hide()
																						if (result.status === 0) {
																							//panel1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '计划名称/计划编号/计划类型/创建者/创建时间/总负责人/下次保养时间/状态',
																								// tableWitch: '25%/75%',
																								viewColGroup: 3,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.planList, // 主要数据列表
																										tempData = null; // 表格td内的临时数据

																									console.dir(dataList)
																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].devices_upkeep_plan_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 1: {
																												tempData = dataList[0].devices_upkeep_plan_numker;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].devices_upkeep_plan_type;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].devices_upkeep_plan_creator;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 4: {
																												tempData = dataList[0].devices_upkeep_plan_date;
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																											}
																												break;
																											case 5: {
																												tempData = dataList[0].devices_upkeep_plan_principal;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 6: {
																												tempData = dataList[0].nextDate;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 7: {

																												tempData = dataList[0].devices_upkeep_plan_status;

																												let target,
																													tempStr = `
																																<select class="form-control table-input input-sm">
																																	<option value="0">未执行</option>
																																	<option value="1" class="text-warning">执行中</option>
																																	<option value="2" class="text-success">已完成</option>
																																</select>
																															`;

																												tbodyTd.eq(i).addClass('table-input-td').html(tempStr)
																												target = tbodyTd.eq(i).find('select');
																												target.val(tempData);
																												target.off('change').on('change', function () {
																													let planStatus = $(this).val();
																													swal({
																														title: '您确定要更改此状态吗？',
																														type: 'question',
																														showCancelButton: true,
																														confirmButtonText: '确定',
																														cancelButtonText: '取消'
																													}).then(function () {
																														$.ajax({
																															type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																															url: modifyUpkeepStatustUrl,
																															data: {
																																"planId": dataList[0].devices_upkeep_plan_id,
																																"planStatus": planStatus
																															},
																															success: function (result, status, xhr) {
																																if (result.status === 0) {
																																	let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																	swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																																}
																																else {
																																	swallFail()	//操作失败
																																}
																															},
																														})
																													},
																														(dismiss) => {
																															target.val(dataList[currentTr.index()].devices_upkeep_plan_status);
																														})
																												})

																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})

																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}
																			addTableData1(queryUpkeepPlansUrl, {
																				"type": "plan",
																				"planId": upkeepPlanID,
																				"headNum": 1
																			})

																			// 主表格添加内容，保养项目及变更
																			function addTableData2(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功
																						mesloadBox.hide()
																						if (result.status === 0) {

																							//panel2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '设备名称/负责人/项目名称/保养基准/计划日期/实施日期/保养结果/异常情况记录/记录人/确认人',
																									theadWidth: '12%/8%/10%/10%/10%/10%/10%/10%/10%/10%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.upkeepProjects, // 主要数据列表
																											tempData = null; // 表格td内的临时数据
																										devicesUpkeepProjectList = dataList;
																										for (let i = 0, len = dataList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
																												inputHtml = `<input class="table-input" type="text" placeholder="请输入" />`

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = dataList[i].planProject.devices.devices_control_devices_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList[i].planProject.devices_upkeep_principal;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[i].planProject.upkeepProject.devices_upkeep_project_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[i].planProject.upkeepProject.devices_upkeep_project_standard;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList[i].devices_upkeep_enter_schedule;
																														if (tempData < moment()) {
																															currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD')).addClass('text-danger')
																														} else {
																															currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																														}
																													}
																														break;
																													case 5: {
																														tempData = dataList[i].devices_upkeep_enter_date;

																														if (tempData !== null) {
																															currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																														} else {
																															currentTr.children().eq(j).html('')
																														}
																													}
																														break;
																													case 6: {
																														tempData = dataList[i].devices_upkeep_enter_result;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 7: {
																														tempData = dataList[i].devices_upkeep_enter_feedback;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 8: {
																														tempData = dataList[i].devices_upkeep_enter_people;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 9: {
																														tempData = dataList[i].devices_upkeep_enter_people;

																														if (tempData === null || tempData === '') {
																															currentTr.children().eq(j).html('')
																														} else {
																															inputHtml = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														}

																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: result.map.lines, // 总行数
																									displayRow: result.map.upkeepProjects.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})

																							//panel3
																							/***/
																							mesVerticalTableAddData(panel3, {
																								thead: {
																									theadContent: '设备名称/设备编号/变更类型/变更内容/变更原因/记录人/确认人/操作',
																									theadWidth: '10%/10%/10%/13%/13%/8%/8%/8%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.upkeepProjects, // 主要数据列表
																											upkeepChangeList = map.upkeepChanges, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										for (let i = 0, len = upkeepChangeList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
																												inputHtml = `<input class="table-input" type="text" placeholder="请输入" />`;
																											currentTr.data('upkeepChangeID', upkeepChangeList[i].devices_upkeep_change_id)

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = upkeepChangeList[i].devices.devices_control_devices_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = upkeepChangeList[i].devices.devices_control_devices_number;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_type;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_content;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_reasons;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_people;
																														if (tempData === null) {
																															inputHtml = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														} else {
																															currentTr.children().eq(j).html(tempData)
																														}
																													}
																														break;
																													case 6: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_identify_people;
																														if (tempData === null) {
																															inputHtml = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														} else {
																															currentTr.children().eq(j).html(tempData)
																														}
																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: result.map.line, // 总行数
																									displayRow: result.map.upkeepChanges.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})

																						}
																						else {
																							panel2Tbody.empty().append(NO_DATA_NOTICE)
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}
																			addTableData2(queryUpkeepPlansUrl, {
																				"type": "planExcute",
																				"planId": upkeepPlanID,
																				"headNum": 1
																			})

																			// 添加员工选择模态框
																			panel2Tbody.add(panel3Tbody).off('focus').on('focus', 'tr td .selectStaff', function () {
																				let $this = $(this);
																				// 添加员工选择模态框
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																				});
																				promise.then(function (resolveData) {
																					$this.val(resolveData.roleStaffName)
																					$this.data('staffID', resolveData.roleStaffId)
																					// tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																					// submithData.role_workshop_principal = resolveData.roleStaffName
																				})

																				$(this).prop('readonly', true) // 输入框只读
																				$(this).off('blur').on('blur', () => {
																					$(this).removeProp('readonly') // 输入移除框只读
																				})
																			})

																			panel3Tbody.off('focus').on('focus', 'tr td .selectDevices', function () {
																				let $this = $(this);
																				// 添加设备选择模态框
																				let promise = new Promise(function (resolve, reject) {
																					selectDevicessAddData2(resolve)
																				});
																				promise.then(function (resolveData) {
																					$this.val(resolveData.devicesName)
																					$this.closest('tr').find('td').eq(1).html(resolveData.devicesNumber)
																					$this.data('devicesID', resolveData.devicesId)

																					// tbodyTd.eq(i).find('input').val(resolveData.devicesName)	//将选择的设备名称写入输入框
																					// tbodyTd.eq(i + 1).html(resolveData.devicesNumber)						//将选择的设备编号写入下一格
																					// submithData.devicesId = resolveData.devicesId;		//获取选择的设备id
																				})

																				$(this).prop('readonly', true) // 输入框只读
																				$(this).off('blur').on('blur', () => {
																					$(this).removeProp('readonly') // 输入移除框只读
																				})
																			})

																			//新增变更记录按钮单击事件
																			panel3HeadingMainBtn_1.off('click').on('click', (event) => {
																				var temStr = `
																						<tr>
																							<td class="table-input-td">
																								<input class="table-input selectDevices" type="text" placeholder="点此选择" />
																							</td>
																							<td>
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<select class="form-control table-input input-sm">
																									<option value="">未选择</option>
																									<option value="新增">新增</option>
																									<option value="延期">延期</option>
																									<option value="提前">提前</option>
																									<option value="取消">取消</option>
																								</select>
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input selectStaff" type="text" placeholder="点此选择" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input selectStaff" type="text" placeholder="点此选择" />
																							</td>
																							<td class="table-input-td">
																								<a class="table-link text-danger delete" href="javascript:;"><i class="fa fa-times"></i>移除</a>
																							</td>
																						</tr>
																				`;
																				panel3Tbody.append(temStr)
																			})

																			// panel3HeadingMainBtn_1.trigger('click')		//模拟点击新增项目，是进入页面后默认有一行

																			//移除变更记录按钮单击事件
																			panel3Tbody.on('click', 'tr td .delete', function () {
																				$(this).closest('tr').remove();  //移除该行元素
																			})

																			// 提交数据按钮单击事件
																			modalSubmitBtn.off('click').on('click', (event) => {
																				let $tr = panel2Tbody.find('tr'),	//保养记录
																					$tr2 = panel3Tbody.find('tr'),	//变更记录
																					enters = [],	//存储发送到后台的保养记录集合
																				modifyUpkeepChanges = [];	//存储发送到后台的变更记录集合

																				for (let i = 0, len = $tr.length; i < len; i++) {	//遍历保养记录行
																					let $td = $tr.eq(i).find('td');

																					var enterObject = {
																						enterId: '',
																						enterDate: '',
																						feedback: '',
																						enterResult: '',
																						recordStaff: '',
																						identifyStaff: ''
																					};
																					if (devicesUpkeepProjectList.length) {
																						enterObject.enterId = devicesUpkeepProjectList[i].devices_upkeep_enter_id;
																					}


																					for (let j = 0, len = $td.length; j < len; j++) {	//遍历保养记录列

																						switch (j) {
																							case 9:
																								enterObject.identifyStaff = $td.eq(j).find('input').data('staffID')
																								break;
																						}
																					}

																					if (typeof (enterObject.identifyStaff) !== "undefined" && enterObject.identifyStaff !== null &&  enterObject.identifyStaff !== '') {
																						enters[i] = enterObject;
																					}

																				}

																				for (let i = 0, len = $tr2.length; i < len; i++) {	//遍历变更记录行
																					let $td = $tr2.eq(i).find('td'),
																					 	tempData = $td.eq(6).find('input').data('staffID'),	//获取确认人id
																						enterObject = {
																							changeId: '',
																							identifyStaff: ''
																						};

																					enterObject.changeId = $tr2.eq(i).data('upkeepChangeID')	//获取附加属性变更记录id

																					if (typeof (tempData) == "undefined" || tempData === null || tempData === '') {
																						continue;
																					} else {
																						enterObject.identifyStaff = tempData
																						modifyUpkeepChanges.push(enterObject)
																					}

																				}

																				if (enters.length !== 0  || modifyUpkeepChanges.length !== 0) {
																					swal({
																						title: '您确定要提交本次操作吗?',
																						text: '请确保填写信息无误后点击确定按钮',
																						type: 'question',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: true, // 显示用户取消按钮
																						confirmButtonText: '确定',
																						cancelButtonText: '取消',
																					}).then(function () {

																						//修改保养记录
																						if (enters.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: modifyUpkeepEnterUrl,
																								data: { "enters": JSON.stringify(enters) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										swallSuccess(modalCloseBtn)	//操作成功提示并刷新页面
																										console.log('点检记录登记成功');
																									}
																									else {
																										swallFail()	//操作失败
																										console.log('点检记录登记失败');
																									}
																								}
																							})
																						}

																						//修改变更记录
																						if (modifyUpkeepChanges.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: modifyUpkeepChangesUrl,
																								data: { "changes": JSON.stringify(modifyUpkeepChanges) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {
																										swallSuccess(modalCloseBtn)	//操作成功提示并刷新页面
																										console.log('变更记录修改成功');
																									}
																									else {
																										swallFail()	//操作失败
																										console.log('变更记录修改失败');
																									}
																								}
																							})
																						}

																					});
																				}
																				else {
																					swallError()	//格式不正确
																				}

																			})

																			break
																		}
																		case '#editMaintainRecordModal': {	//执行
																			let dataContent = $('#editMaintainRecordModal'),
																				panelList = dataContent.find('.panel'),
																				panel1 = panelList.eq(0),
																				panel2 = panelList.eq(1),
																				panel3 = panelList.eq(2),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-footer .modal-submit'),

																				panel2Tbody = panel2.find('tbody'),
																				panel2FuzzySearchGroup = panel2.find('.fuzzy-search-group'), // panel2头部主要按键_1
																				panel3Tbody = panel3.find('tbody'),
																				panel3HeadingMainBtn_1 = panel3.find('.head-main-btn-1'), // panel3头部主要按键_1

																				devicesUpkeepProjectList = [],															// 保养项目集合
																				devicesUpkeepChangeList = [],															// 变更记录集合
																				devicesCheckPlanID = dataList[currentTr.index()].devices_check_plan_id;	// 点检计划id

																				selectDate = moment().format('YYYY-MM-DD HH:mm:ss'),	//选择的时间，默认是当天
																				startDate = moment().format('YYYY-MM-DD'),	//按日期查找的开始时间，默认是当天
																				endDate = moment().format('YYYY-MM-DD');	//按日期查找的结束时间，默认是当天

																			panel2FuzzySearchGroup.find('input').val(moment().format('YYYY-MM-DD'))	//初始化日期输入框，默认为当天

																			// 主表格添加内容,保养计划基础信息
																			function addTableData1(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功
																						mesloadBox.hide()
																						if (result.status === 0) {
																							//panel1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '计划名称/计划编号/计划类型/创建者/创建时间/总负责人/下次保养时间/状态',
																								// tableWitch: '25%/75%',
																								viewColGroup: 3,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.planList, // 主要数据列表
																										tempData = null; // 表格td内的临时数据

																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].devices_upkeep_plan_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 1: {
																												tempData = dataList[0].devices_upkeep_plan_numker;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].devices_upkeep_plan_type;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].devices_upkeep_plan_creator;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 4: {
																												tempData = dataList[0].devices_upkeep_plan_date;
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																											}
																												break;
																											case 5: {
																												tempData = dataList[0].devices_upkeep_plan_principal;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 6: {
																												tempData = dataList[0].nextDate;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 7: {

																												tempData = dataList[0].devices_upkeep_plan_status;
																												if (tempData == 0) {
																													tbodyTd.eq(i).html('未执行')
																												} else if (tempData == 1) {
																													tbodyTd.eq(i).html('执行中').addClass('text-warning')
																												} else if (tempData == 2) {
																													tbodyTd.eq(i).html('已完成').addClass('text-success')
																												}

																											/*let target,
																													tempStr = `
																																<select class="form-control table-input input-sm">
																																	<option value="0">未执行</option>
																																	<option value="1" class="text-warning">执行中</option>
																																	<option value="2" class="text-success">已完成</option>
																																</select>
																															`;

																												tbodyTd.eq(i).addClass('table-input-td').html(tempStr)
																												target = tbodyTd.eq(i).find('select');
																												target.val(tempData);
																												target.off('change').on('change', function () {
																													let planStatus = $(this).val();
																													swal({
																														title: '您确定要更改此状态吗？',
																														type: 'question',
																														showCancelButton: true,
																														confirmButtonText: '确定',
																														cancelButtonText: '取消'
																													}).then(function () {
																														$.ajax({
																															type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																															url: modifyUpkeepStatustUrl,
																															data: {
																																"planId": dataList[0].devices_upkeep_plan_id,
																																"planStatus": planStatus
																															},
																															success: function (result, status, xhr) {
																																if (result.status === 0) {
																																	let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																	swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																																}
																																else {
																																	swallFail()	//操作失败
																																}
																															},
																														})
																													},
																														(dismiss) => {
																															target.val(dataList[currentTr.index()].devices_upkeep_plan_status);
																														})
																												}) */

																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})

																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}
																			addTableData1(queryUpkeepPlansUrl, {
																				"type": "plan",
																				"planId": upkeepPlanID,
																				"headNum": 1
																			})

																			// 主表格添加内容，保养项目及变更
																			function addTableData2(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功
																						mesloadBox.hide()
																						if (result.status === 0) {

																							 temp=true;

																							//panel2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '设备名称/负责人/项目名称/保养基准/计划日期/实施日期/保养结果/异常情况记录/记录人/确认人',
																									theadWidth: '12%/9%/10%/10%/10%/10%/10%/9%/13%/10%/10%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.upkeepProjects, // 主要数据列表
																											tempData = null; // 表格td内的临时数据
																										devicesUpkeepProjectList = dataList;
																										    console.log(dataList)
																										for (let i = 0, len = dataList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
																											inputHtml = `<input class="table-input" type="text" placeholder="请输入" />`

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = dataList[i].planProject.devices.devices_control_devices_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList[i].planProject.devices_upkeep_principal;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[i].planProject.upkeepProject.devices_upkeep_project_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[i].planProject.upkeepProject.devices_upkeep_project_standard;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList[i].devices_upkeep_enter_schedule;
																														if (tempData < moment()) {
																															currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD')).addClass('text-danger')
																														} else {
																															currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																														}

																													}
																														break;
																													case 5: {
																														tempData = dataList[i].devices_upkeep_enter_date;
																														if (tempData !== null) {
																															currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																														} else {
																															inputHtml = `<input class="table-input" type="text" placeholder="必填" onclick="WdatePicker({minDate:'%y-%M-01',maxDate:'%y-%M-%d'})" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														}

																													}
																														break;
																													case 6: {
																														tempData = dataList[i].devices_upkeep_enter_result;
																														if (tempData !== null) {
																															currentTr.children().eq(j).html(tempData)
																														} else {
																															inputHtml = `<input class="table-input" type="text" placeholder="必填" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														}

																													}
																														break;
																													case 7: {
																														tempData = dataList[i].devices_upkeep_enter_feedback;
																														if (tempData !== null) {
																															currentTr.children().eq(j).html(tempData)
																														} else {
																															inputHtml = `<input class="table-input" type="text" placeholder="必填" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														}

																													}
																														break;
																													case 8: {
																														tempData = dataList[i].devices_upkeep_enter_people;
																														if (tempData !== null) {
																															currentTr.children().eq(j).html(tempData)
																														} else {
																															inputHtml = `<input class="table-input selectStaff" type="text" placeholder="必填" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														}

																													}
																														break;
																													case 9: {
																														tempData = dataList[i].devices_upkeep_enter_identify_people;
																														if (tempData !== null) {
																															currentTr.children().eq(j).html(tempData)
																														} else {
																															currentTr.children().eq(j).html('未确认')
																														}

																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: result.map.lines, // 总行数
																									displayRow: result.map.upkeepProjects.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})

																							//panel3
																							/***/
																							mesVerticalTableAddData(panel3, {
																								thead: {
																									theadContent: '设备名称/设备编号/变更类型/变更内容/变更原因/记录人/确认人/操作',
																									theadWidth: '10%/10%/10%/13%/13%/8%/8%/8%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',

																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.upkeepProjects, // 主要数据列表
																											upkeepChangeList = map.upkeepChanges, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										for (let i = 0, len = upkeepChangeList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
																												inputHtml = `<input class="table-input" type="text" placeholder="请输入" />`;
																											currentTr.data('upkeepChangeID', upkeepChangeList[i].devices_upkeep_change_id)

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {

																													case 0: {
																														tempData = upkeepChangeList[i].devices.devices_control_devices_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = upkeepChangeList[i].devices.devices_control_devices_number;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_type;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_content;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_reasons;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_people;
																														if (tempData === null) {
																															inputHtml = `<input class="table-input selectStaff" type="text" placeholder="点此选择" />`
																															currentTr.children().eq(j).addClass('table-input-td')
																															currentTr.children().eq(j).html(inputHtml)
																														} else {
																															currentTr.children().eq(j).html(tempData)
																														}
																													}
																														break;
																													case 6: {
																														tempData = upkeepChangeList[i].devices_upkeep_change_identify_people;
																														if (tempData === null) {
																															currentTr.children().eq(j).html('未确认')
																														} else {
																															currentTr.children().eq(j).html(tempData)
																														}
																													}
																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: result.map.line, // 总行数
																									displayRow: result.map.upkeepChanges.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})

																						}
																						else if(result.status===2){
																							temp=false;

																						}
																						else {
																							panel2Tbody.empty().append(NO_DATA_NOTICE)
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}
																			addTableData2(queryUpkeepPlansUrl, {
																				"type": "planExcute",
																				"planId": upkeepPlanID,
																				"headNum": 1
																			})

																			// 添加员工选择模态框
																			panel2Tbody.add(panel3Tbody).off('focus').on('focus', 'tr td .selectStaff', function () {

																				let $this = $(this);
																				// 添加员工选择模态框
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																				});
																				promise.then(function (resolveData) {
																					$this.val(resolveData.roleStaffName)
																					$this.data('staffID', resolveData.roleStaffId)
																					// tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																					// submithData.role_workshop_principal = resolveData.roleStaffName
																				})

																				$(this).prop('readonly', true) // 输入框只读
																				$(this).off('blur').on('blur', () => {
																					$(this).removeProp('readonly') // 输入移除框只读
																				})
																			})

																			panel3Tbody.off('focus').on('focus', 'tr td .selectDevices', function () {
																				let $this = $(this);
																				// 添加设备选择模态框
																				let promise = new Promise(function (resolve, reject) {
																					selectDevicessAddData2(resolve)
																				});
																				promise.then(function (resolveData) {
																					$this.val(resolveData.devicesName)
																					$this.closest('tr').find('td').eq(2).html(resolveData.devicesNumber)
																					$this.data('devicesID', resolveData.devicesId)

																					// tbodyTd.eq(i).find('input').val(resolveData.devicesName)	//将选择的设备名称写入输入框
																					// tbodyTd.eq(i + 1).html(resolveData.devicesNumber)						//将选择的设备编号写入下一格
																					// submithData.devicesId = resolveData.devicesId;		//获取选择的设备id
																				})

																				$(this).prop('readonly', true) // 输入框只读
																				$(this).off('blur').on('blur', () => {
																					$(this).removeProp('readonly') // 输入移除框只读
																				})
																			})

																			//新增变更记录按钮单击事件
																			panel3HeadingMainBtn_1.off('click').on('click', (event) => {
																				var temStr = `
																						<tr>
																						   <td>${++panel3.find('tbody').find('tr').length}</td>
																							<td class="table-input-td">
																								<input class="table-input selectDevices" type="text" placeholder="点此选择" />
																							</td>
																							<td>
																							</td>
																							<td class="table-input-td">
																								<select class="form-control table-input input-sm">
																									<option value="">未选择</option>
																									<option value="新增">新增</option>
																									<option value="延期">延期</option>
																									<option value="提前">提前</option>
																									<option value="取消">取消</option>
																								</select>
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input" type="text" placeholder="请输入" />
																							</td>
																							<td class="table-input-td">
																							<input class="table-input" type="text" placeholder="点此选择时间" onclick="WdatePicker()" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input selectStaff" type="text" placeholder="点此选择" />
																							</td>
																							<td class="table-input-td">
																								<input class="table-input selectStaff" type="text" placeholder="点此选择" />
																							</td>
																							<td class="table-input-td">
																								<a class="table-link text-danger delete" href="javascript:;"><i class="fa fa-times"></i>移除</a>
																							</td>
																						</tr>
																				`;
																				panel3Tbody.append(temStr)

																			})

																			// panel3HeadingMainBtn_1.trigger('click')		//模拟点击新增项目，是进入页面后默认有一行

																			//移除变更记录按钮单击事件
																			panel3Tbody.on('click', 'tr td .delete', function () {
																				$(this).closest('tr').remove();  //移除该行元素
																			})

																			// 提交数据按钮单击事件
																			modalSubmitBtn.off('click').on('click', (event) => {
																				console.log(temp)
																				if(!temp){
																						swal({
																							title: '无法提交',
																							text: '',
																							type: 'warning',
																							showCancelButton: true,
																							confirmButtonText: '确定',
																							cancelButtonText: '取消'
																						})

																				}
																				let $tr = panel2Tbody.find('tr'),	//保养记录
																					$tr2 = panel3Tbody.find('tr'),	//变更记录
																					enters = [],	//存储发送到后台的保养记录集合
																					saveUpkeepChanges = [];	//存储发送到后台的变更记录集合

																				for (let i = 0, len = $tr.length; i < len; i++) {	//遍历保养记录行
																					let $td = $tr.eq(i).find('td');

																					var enterObject = {
																						enterId: '',
																						enterDate: '',
																						feedback: '',
																						enterResult: '',
																						recordStaff: '',
																						identifyStaff: ''
																					};

																					if (devicesUpkeepProjectList.length) {
																						enterObject.enterId = devicesUpkeepProjectList[i].devices_upkeep_enter_id;	//记录id
																					}

																					// enterObject.enterId = 1;	//记录id


																					for (let j = 0, len = $td.length; j < len; j++) {	//遍历保养记录列

																						switch (j) {

																							case 5:
																								enterObject.enterDate = $td.eq(j).find('input').val()
																								break;
																							case 6:
																								enterObject.enterResult = $td.eq(j).find('input').val()
																								break;
																							case 7:
																								enterObject.feedback = $td.eq(j).find('input').val()
																								break;
																							case 8:
																								enterObject.recordStaff = $td.eq(j).find('input').data('staffID')
																								break;
																							case 9:
																								// enterObject.identifyStaff = $td.eq(j).find('input').data('staffID')
																								break;
																						}
																					}

																					if (enterObject.enterDate !== '' && enterObject.enterDate !== null &&
																						enterObject.enterResult !== '' && enterObject.enterResult !== null &&
																						enterObject.feedback !== '' && enterObject.feedback !== null &&
																						typeof (enterObject.recordStaff) !== "undefined" && enterObject.recordStaff !== '' && enterObject.recordStaff !== null) {
																						enters.push(enterObject);
																					}

																				}

																				for (let i = 0, len = $tr2.length; i < len; i++) {	//遍历变更记录行
																					let $td = $tr2.eq(i).find('td'),
																						upkeepChangeID = $tr2.eq(i).data('upkeepChangeID');

																					if (typeof (upkeepChangeID) == "undefined") {	//判断该行是否有附件值变更记录id，如果有没有表示是新增
																						let enterObject = {
																							planId: '',
																							devicesId: '',
																							changeType: '',
																							changeContent: '',
																							changeReasons: '',
																							changeStaff: '',
																							identifeyStaff: ''
																						};
																						enterObject.planId = upkeepPlanID;
																						for (let j = 0, len = $td.length; j < len; j++) {
																							let tempData;

																							switch (j) {
																								case 0:

																									break;
																								case 1:
                                                                                                    enterObject.devicesId = $td.eq(j).find('input').data('devicesID')
																									break;
																								case 2:
																									enterObject.changeType = $td.eq(j).find('select').val()
																									break;
																								case 3:
																									enterObject.changeContent = $td.eq(j).find('input').val()
																									break;
																								case 4:
																									enterObject.changeReasons = $td.eq(j).find('input').val()
																									break;
																								case 5:
																									enterObject.changeStaff = $td.eq(j).find('input').data('staffID')
																									break;
																								case 6:
																									// enterObject.identifeyStaff = $td.eq(j).find('input').data('staffID')
																									break;
																							}
																						}
																						if (typeof (enterObject.devicesId) !== "undefined" &&
																							enterObject.changeType !== '' &&
																							enterObject.changeContent !== '' &&
																							enterObject.changeReasons !== '' &&
																							typeof (enterObject.changeStaff) !== "undefined") {
																							saveUpkeepChanges.push(enterObject);
																						}

																					}

																				}

																				if (enters.length !== 0 || saveUpkeepChanges.length !== 0 ) {
																					swal({
																						title: '您确定要提交本次操作吗?',
																						text: '请确保填写信息无误后点击确定按钮',
																						type: 'question',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: true, // 显示用户取消按钮
																						confirmButtonText: '确定',
																						cancelButtonText: '取消',
																					}).then(function () {

																					 		//修改保养记录
																						if (enters.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: modifyUpkeepEnterUrl,
																								data: { "enters": JSON.stringify(enters) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										swallSuccess( modalCloseBtn)	//操作成功提示并刷新页面
																										console.log('点检记录登记成功');
																									}
																									else {
																										swallFail()	//操作失败
																										console.log('点检记录登记失败');
																									}
																								}
																							})
																						}
																							//增加变更记录
																						if (saveUpkeepChanges.length !== 0) {
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: saveUpkeepChangeUrl,
																								data: { "changes": JSON.stringify(saveUpkeepChanges) },
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										swallSuccess(modalCloseBtn)	//操作成功提示并刷新页面
																										console.log('变更记录登记成功');
																									}
																									else {
																										swallFail()	//操作失败
																										console.log('变更记录登记失败');
																									}
																								}
																							})
																						}

																					});
																				}
																				else {
																					swallError()	//格式不正确
																				}

																			})

																			break
																		}
																		case 'delete': {	//删除
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].product_line_id;

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeProductLinesUrl,
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: { "type": "delete", "productLineId": currentTrNntryID },
																					success: function (result) {
																						if (result.status === 0) {
																							let activePaginationBtn = panel1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																							swallSuccess(activePaginationBtn);	//操作成功提示并刷新页面
																						}
																						else {
																							swallFail();	// 提交失败，请重新提交提示
																						}
																					}
																				})
																			})
																			break
																		}
																		default:
																			break;
																	}
																})

																break;

															default:
																break;
														}
													}
												}
											}
										},

										pagination: {
											totalRow: result.map.lines, // 总行数
											displayRow: result.map.planList.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									paginationContainer.hide()
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryUpkeepPlansUrl, {
						type: "plan",
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryUpkeepPlansUrl, {
								type: "plan",
								planName: val,
								headNum: 1
							});
						}
						else {
							addTableData(queryUpkeepPlansUrl, {
								type: "plan",
								headNum: 1
							});
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
						}
					});

					// 下拉选事件
					devicesTypeOption.change(function () {
						let currentDevicesTypeID = $(this).val();
						addTableData(queryUpkeepPlansUrl, {
							type: "plan",
							planType: currentDevicesTypeID,
							headNum: 1
						});
					})

				}())
				break;
			case '#devicesCheck2'://新建检修保养计划
				(function () {
					let activeSwiper = $('#devicesCheck2'), // 右侧外部swiper
						headLeftBtn1 = $('#headLeftBtn1'), // 从历史计划里新建按钮
						headLeftBtn2 = $('#headLeftBtn2'), // 增加设备按钮
						activeSubSwiper = $('#devicesCheck2InerSwiper'), // 右侧内部swiper
						panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
						panel1 = panelList.eq(0),
						modalSubmitBtn = activeSwiper.find('.content-footer .modal-submit'),
						devicesIDList = [],	//存储已经选择的设备id
						// projectIDList = [],	//存储已经选择的项目id
						devicesProjectTimeList = [],	//设备id，项目id，时间组成的对象集合
                        devicesProjectTimeList1=0,
						submithData = {
							planName: '',	// 计划名称
							planNum: moment().format('YYYYMMDDHHmmss'),	// 计划编号
							planType: '',	// 计划类型
							creator: '',	// 创建者
							principal: '',	// 负责人
							createDate: moment().format('YYYY-MM-DD'),	// 创建时间
						};

					// 页面初始化
					headLeftBtn1.add(headLeftBtn2).attr('disabled', true)
					headLeftBtn2.off('click')
					$("#devicesCheck2Panel .panel:first").nextAll().remove()

					// 主表格1添加内容
					mesHorizontalTableAddData(panel1.find('table'), null, {
						thead: '计划类型/计划名称/创建者/总负责人',
						tableWitch: '20%/30%',
						viewColGroup: 2,
						importStaticData: (tbodyTd, length) => {
							let inputHtml;

							for (let i = 0, len = length; i < len; i++)
								switch (i) {
									case 0: {
										inputHtml = `
											<select class="form-control table-input input-sm">
													<option value="0">未选择</option>
													<option value="月度保养">月度保养</option>
													<option value="假期保养">假期保养</option>
													<option value="年度保养">年度保养</option>
											</select>
										`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										let $select = tbodyTd.eq(i).find('select')
										let mesPopover = new MesPopover($select, { content: '请先选择计划类型' });
										mesPopover.show()

										// 下拉选事件
										$select.change(function () {
											let val = $(this).val();
											if (val !== '0') {
												mesPopover.hide()
												headLeftBtn1.add(headLeftBtn2).attr('disabled', false)
												submithData.planType = tbodyTd.eq(i).find('select').val()
												submithData.planName = `${moment().format('YYYYMMDDHHmm')}新建`
												tbodyTd.eq(i+1).find('input').val(`${moment().format('YYYYMMDDHHmm')}新建`)
											} else {

												tbodyTd.eq(i + 1).find('input').val('')
												headLeftBtn1.add(headLeftBtn2).attr('disabled', true)
												mesPopover.show()
											}
										})
										break;
									}
									case 1: {
										// inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
										inputHtml = `<input type="text" class="table-input auto-kal" data-kal="mode:'multiple'" placeholder="请输入（必填）" >`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)
									}
										break;
									case 2: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											// 添加员工选择模态框
											let promise = new Promise(function (resolve, reject) {
												selectStaffAddData(resolve, queryStaffUrl, { headNum: 1 })
											});
											promise.then(function (resolveData) {
												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												submithData.creator = resolveData.roleStaffId
											})


											$(this).prop('readonly', true) // 输入框只读
											$(this).off('blur').on('blur', () => {
												$(this).removeProp('readonly') // 输入移除框只读
											})
										})

										// 添加到提交数据
										// tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
										// 	submithData.checkPlanStaffID = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
										// })
									}
										break;
									case 3: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											// 添加员工选择模态框
											let promise = new Promise(function (resolve, reject) {
												selectStaffAddData(resolve, queryStaffUrl, { headNum: 1 })
											});
											promise.then(function (resolveData) {
												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												submithData.principal = resolveData.roleStaffId
											})


											$(this).prop('readonly', true) // 输入框只读
											$(this).off('blur').on('blur', () => {
												$(this).removeProp('readonly') // 输入移除框只读
											})
										})

										// 添加到提交数据
										// tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
										// 	submithData.checkPlanStaffID = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
										// })

									}
										break;

									default:
										break;
								}

						}
					})

					//增加设备按钮单击事件
					headLeftBtn2.off('click').on('click', (event) => {
						event.stopPropagation()
						event.preventDefault()
						// 添加设备选择模态框
						let promise = new Promise(function (resolve, reject) {
							selectDevicessAddData2(resolve)
						});
						promise.then(function (resolveData) {
							if (traverseListPush2(devicesIDList, resolveData.devicesId)) {	//判断是否选择
								let warningNotice = new MesloadBox($('body'), {warningContent:'您已经选择该设备，请重新选择'})
								warningNotice.warningShow()
								return;
							}
							traverseListPush(devicesIDList, resolveData.devicesId)
							// submithData2.devicesId = resolveData.devicesId

							let temStr = `
								<div class="panel panel-default notBaseMessage">
									<div class="panel-heading panel-heading-table">
										<div class="row">
											<div class="col-xs-4">
												<h5 class="panel-title">设备名称:${resolveData.devicesName}  编号:${resolveData.devicesNumber}</h5>
											</div>
											<div class="col-xs-8">
												<form class="form-inline pull-right" >
													<a href="javascript:;" class="btn btn-primary btn-sm removeDevicesBtn" deviceId ="${resolveData.devicesId}">移除设备</a>
													<a href="javascript:;" class="btn btn-primary btn-sm addItemBtn">增加项目</a>
												</form>
											</div>
										</div>
									</div>
									<table class="table table-bordered table-condensed">
										<thead>
											<tr>
												<th style="width: 15%;">项目名称</th>
												<th style="width: 15%;">保养基准</th>
												<th style="width: 8%;">周期</th>
												<th style="width: 8%;">负责人</th>
												<th style="width: 40%;">计划日期</th>
												<th style="width: 8%;">操作</th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
								</div>
						`;
							$('#devicesCheck2Panel').append(temStr)
						})

					})

					//删除设备按钮单击事件
					$('#devicesCheck2Panel').on('click', '.panel .removeDevicesBtn', function () {
						let devicesID = $(this).attr('deviceId')
						traverseListDelete(devicesIDList, devicesID)
						$(this).closest('.panel').remove();  //移除该行元素
					})

					//新增项目按钮单击事件
					 $('#devicesCheck2Panel').on('click', '.panel .addItemBtn', function () {
						let panelTbody = $(this).closest('.panel').find('tbody'),
						// 项目选择模态框
						 promise = new Promise(function (resolve, reject) {
							 selectUpkeepProjectAddData(resolve, queryUpkeepPlansUrl, {
								 type:'projectInfo',
								headNum: 1
							})
						});
						promise.then(function (resolveData) {
							let projectIDList = [],	//存储已经选择的项目id
								$trList = panelTbody.find('tr');
							for (let j = 0, len = $trList.length; j < len; j++) {	//遍历行，找出所有项目id
								let $tdList = $trList.eq(j).find('td');
								projectIDList [j] = $tdList.eq(5).find('a').attr('upkeepProjectId')

							}

							if (traverseListPush2(projectIDList, resolveData.upkeepProjectId)) {	//判断是否选择
								let warningNotice = new MesloadBox($('body'), { warningContent: '您已经选择该项目，请重新选择' });
								warningNotice.warningShow()
								return;
							}

							let temStr = `
								<tr>
									<td>${resolveData.upkeepProjectName}</td>
									<td>${resolveData.upkeepProjectStandard}</td>
									<td>${resolveData.upkeepProjectPeriod}</td>
									<td class="table-input-td">
										<input type="text" class="table-input projectPrincipal" placeholder="请输入" />
									</td>
									<td class="table-input-td">
										<input type="text" class="table-input calendarDate" placeholder="请输入"  />
									</td>

									<td class="table-input-td">
										<a class="table-link text-danger delete" href="javascript:;"upkeepProjectId="${resolveData.upkeepProjectId}"><i class="fa fa-times"></i>移除</a>
									</td>
								</tr>
							`;
							panelTbody.append(temStr)

							$('#devicesCheck2Panel').find('.projectPrincipal').off('focus').on('focus', function () {
								// 添加员工选择模态框
								let $this = $(this),
									promise = new Promise(function (resolve, reject) {
									selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
								});
								promise.then(function (resolveData) {
									$this.val(resolveData.roleStaffName).data('principal', resolveData.roleStaffId)
									// submithData.creator = resolveData.roleStaffId
								})

								$this.prop('readonly', true) // 输入框只读
								$this.off('blur').on('blur', () => {
									$this.removeProp('readonly') // 输入移除框只读
								})

							})

							 $('#devicesCheck2Panel').find('.calendarDate').off('focus').on('focus', function () {
								let $this = $(this),
									calendar = new Calendar();
								$this.val('')
								calendar.init({
									target: $this,
									// range: ['2015-3-5', '2015-3-25'],
									multiple: true,
									maxdays: 31,
									goCallback: function (type, date) {
										console.log(type, date, this)
									},
									overdays: function (a) {
										alert('添加已达上限 ' + a + ' 天');
									}
								});

							})

						})
					})

					//移除项目按钮单击事件
					$('#devicesCheck2Panel').on('click', '.panel tbody .delete', function () {
						$(this).closest('tr').remove();  //移除该行元素
					})

					//提交按钮单击事件
					modalSubmitBtn.off('click').on('click', (event) => {
						let $panelList = $('#devicesCheck2Panel').children('.panel');

						for (let i = 0, len = $panelList.length; i < len-1; i++) {	//遍历设备

							let $panel = $panelList.eq(i+1),
								$trList = $panel.find('tbody tr');
							// console.dir('设备id集合：'+devicesIDList)
							for (let j = 0, len = $trList.length; j < len; j++) {	//遍历设备对应的项目
								let $tdList = $trList.eq(j).find('td'),
								submithData2 = {
									devicesId: '',	//设备id
									projectId: '',	//项目id
									principal: '',	//负责人
									scheduleDate: ''	//计划执行时间,用：进行拼接
								};
								submithData2.devicesId = devicesIDList[i]
								submithData2.projectId = $tdList.eq(5).find('a').attr('upkeepProjectId')
								submithData2.principal = $tdList.eq(3).find('input').data('principal')
								submithData2.scheduleDate = $tdList.eq(4).find('input').val()

							   devicesProjectTimeList.push(submithData2)


							}
						}

						for(let i=0;i<devicesProjectTimeList.length;i++){
							if(devicesProjectTimeList[i].principal&&devicesProjectTimeList[i].scheduleDate){
								devicesProjectTimeList1=1;
							}
							else{
								devicesProjectTimeList1=0;
							}
						}
						//  console.log(devicesProjectTimeList1)

						// console.log(devicesProjectTimeList.length)
						// for (let j = 0, len = devicesProjectTimeList.length; j < len; j++) {
						// 	console.log('devicesId:' + devicesProjectTimeList[j].devicesId)
						// 	console.log('projectId:' + devicesProjectTimeList[j].projectId)
						// 	console.log('scheduleDate:' + devicesProjectTimeList[j].scheduleDate)
						// }
						if(!submithData.planType){
							swal({
								title: '计划类型不能为空!',
								text: '请检查必填字段数据是否完整或格式是否正确',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})
						}
                       else if(!submithData.planName){
							swal({
								title: '计划名称不能为空!',
								text: '请检查必填字段数据是否完整或格式是否正确',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})
						}
						else if(!submithData.creator){
							swal({
								title: '创建者不能为空!',
								text: '请检查必填字段数据是否完整或格式是否正确',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})
						}
						else if(!submithData.principal){
							swal({
								title: '总负责人不能为空!',
								text: '请检查必填字段数据是否完整或格式是否正确',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})
						}
						else if(!devicesIDList.length){
                            swal({
								title: '请增加一个设备!',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})

						}
						else if(devicesIDList &&devicesProjectTimeList.length==0){
                            swal({
								title: '请增加一个项目!',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})

						}
						// else if(devicesProjectTimeList.length!==devicesProjectTimeList2){
                        //     swal({
						// 		title: '请完成项目内容!',
						// 		type: 'warning',
						// 		allowEscapeKey: false, // 用户按esc键不退出
						// 		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
						// 		showCancelButton: false, // 显示用户取消按钮
						// 		confirmButtonText: '确定',
						// 	})

						// }
						else if (devicesProjectTimeList.length!=0&&devicesProjectTimeList1==1

						) {
							swal({
								title: '您确定要提交本次操作吗?',
								text: '请确保填写信息无误后点击确定按钮',
								type: 'question',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: true, // 显示用户取消按钮
								confirmButtonText: '确定',
								cancelButtonText: '取消',
							}).then(function () {

								$.ajax({
									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
									url: saveUpkeepPlanUrl,
									data: {
										"planName": submithData.planName,
										"planNum": submithData.planNum,
										"planType": submithData.planType,
										"creator": submithData.creator,
										"planPrincipal": submithData.principal,
										"createDate": submithData.createDate,
										"projects": JSON.stringify(devicesProjectTimeList)
									},
									success: function (result, status, xhr) {
										if (result.status === 0) {

											// let activePaginationBtn = panel1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
											swallSuccess()	//操作成功提示并刷新页面
										}
										else {
											swallFail();	//操作失败
										}
									}
								})
							});
						}
						else {
							// swallError();	//格式不正确
							swal({
								title: '请完成项目内容!',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})
						}

					})

				}())
				break;
			case '#devicesCheck3'://检修保养指导书管理
				(function () {
					let activeSwiper = $('#devicesCheck3'), // 右侧外部swiper
						activeSubSwiper = $('#devicesCheck3InerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 设备类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组

						mesloadBox = new MesloadBox(activePanel, {
							warningContent: '没有此类信息，请重新选择或输入'
						});

					// 主表格1添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: url,
							data: data,
							beforeSend: function (xml) {
								// ajax发送前
								mesloadBox.loadingShow()
							},
							success: function (result, status, xhr) {
								// ajax成功
								paginationContainer.show()	//显示分页按钮
								mesloadBox.hide()
								if (result.status === 0) {

									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/检修保养项目/检修保养基准/检修保养要点/周期/级别/操作',
											theadWidth: '5%/20%/20%/10%/10%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link editCheckPlanProject" href="javascript:;" data-toggle-modal-target="#submitModelModal"><i class="fa fa-pencil-square-o"></i>修改</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.upkeepProjects, // 主要数据列表
													tempData = null; // 表格td内的临时数据

												for (let i = 0, len = dataList.length; i < len; i++) {
													tbodyTarget.append('<tr></tr>'); // 添加行
													let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行


													for (let i = 0, len = html.length; i < len; i++) {
														currentTr.append(html[i]); // 添加表格内的HTML
														switch (i) {
															case 0:
																currentTr.children().eq(i).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].devices_upkeep_project_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].devices_upkeep_project_standard;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].devices_upkeep_project_point;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 4: {
																tempData = dataList[currentTr.index()].devices_upkeep_project_period;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 5: {
																tempData = dataList[currentTr.index()].devices_upkeep_project_rank;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 6: {
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {

																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据
																	productLineId = dataList[currentTr.index()].product_line_id;

																	switch (dataContent) {

																		case '#submitModelModal': {	//修改

																			let dataContent = submitModelModal,
																				modalPanel = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),

																				// 表单要提交的数据
																				submithData = {
																					projectId: '',			//保养项目id
																					projectName: '',			//保养项目名称
																					projectStandard: '',	//基准
																					projectPoint: '',			//要点
																					projectPeriod: '',		//周期
																					projectRank: ''				//级别
																				};

																			submithData.projectId = dataList[currentTr.index()].devices_upkeep_project_id;
																			modalPanel.find('.panel-heading').find('.panel-title').text('新增项目') // 更换panel标题
																			modalSubmitBtn.attr('disabled',true)
																			fuzzySearchGroupBtn.addClass('hide')

																			mesHorizontalTableAddData(modalPanel.find('table'), null, {
																				thead: '检修保养项目/检修保养基准/检修保养要点/周期/级别',
																				tableWitch: '20%/30%',
																				viewColGroup: 2,
																				importStaticData: (tbodyTd, length) => {
																					let inputHtml = ``;

																					for (let i = 0, len = length; i < len; i++)
																						switch (i) {
																							case 0: {
																								inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('input');
																								target.val(dataList[currentTr.index()].devices_upkeep_project_name)

																								// 添加到提交数据
																								target.off('blur').on('blur', (event) => {
																									submithData.projectName = target.val().replace(/\s/g, "")
																									if (submithData.projectName === dataList[currentTr.index()].devices_upkeep_project_name) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																								break;
																							}
																							case 1: {
																								inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								let target = tbodyTd.eq(i).find('input');

																								target.val(dataList[currentTr.index()].devices_upkeep_project_standard)

																								// 添加到提交数据
																								target.off('blur').on('blur', (event) => {
																									submithData.projectStandard = target.val().replace(/\s/g, "")
																									if (submithData.projectStandard === dataList[currentTr.index()].devices_upkeep_project_standard) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																								break;
																							}
																							case 2: {
																								inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								let target = tbodyTd.eq(i).find('input');

																								target.val(dataList[currentTr.index()].devices_upkeep_project_point)

																								// 添加到提交数据
																								target.off('blur').on('blur', (event) => {
																									submithData.projectPoint = target.val().replace(/\s/g, "")
																									if (submithData.projectPoint === dataList[currentTr.index()].devices_upkeep_project_point) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																							}
																								break;
																							case 3: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								inputHtml = `
																										<select class="form-control table-input input-sm">
																											<option val="0">未选择</option>
																											<option val="1次/天">1次/天</option>
																											<option val="1次/天">1次/周</option>
																											<option val="1次/天">1次/2周</option>
																											<option val="1次/天">1次/月</option>
																											<option val="1次/天">1次/季</option>
																										</select>
																								`;
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('select');
																								target.val(dataList[currentTr.index()].devices_upkeep_project_period)

																								// 添加到提交数据
																								target.off('blur').on('change', (event) => {
																									submithData.projectPeriod = target.val()
																									if (submithData.projectPeriod === dataList[currentTr.index()].devices_upkeep_project_period) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																								break;
																							}
																							case 4: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								inputHtml = `
																										<select class="form-control table-input input-sm">
																											<option val="0">未选择</option>
																											<option val="一级">一级</option>
																											<option val="二级">二级</option>
																											<option val="三级">三级</option>
																											<option val="四级">四级</option>
																											<option val="五级">五级</option>
																										</select>
																								`;
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('select');
																								target.val(dataList[currentTr.index()].devices_upkeep_project_rank)

																								// 添加到提交数据
																								target.off('blur').on('change', (event) => {
																									submithData.projectRank = target.val()
																									if (submithData.projectRank === dataList[currentTr.index()].devices_upkeep_project_rank) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																								break;
																							}
																							default:
																								break;
																						}

																				}
																			})

																			// 提交数据按钮单击事件
																			modalSubmitBtn.off('click').on('click', (event) => {
																				if (submithData.product_line_name !== '') {
																					swal({
																						title: '您确定要提交本次操作吗?',
																						text: '请确保填写信息无误后点击确定按钮',
																						type: 'question',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: true, // 显示用户取消按钮
																						confirmButtonText: '确定',
																						cancelButtonText: '取消',
																					}).then(function () {

																						console.dir(submithData)
																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: modifyUpkeepProjectUrl,
																							data: {
																								"projectId": submithData.projectId,
																								"projectName": submithData.projectName,
																								"standard": submithData.projectStandard,
																								"point": submithData.projectPoint,
																								"period": submithData.projectPeriod,
																								"rank": submithData.projectRank
																							},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {
																									let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																									swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																								}
																								else {
																									swallFail()	//操作失败
																								}
																							}
																						})
																					});
																				}
																				else {
																					swallError()	//格式不正确
																				}

																			})

																			break
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].product_line_id;

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeProductLinesUrl,
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: { "type": "delete", "productLineId": currentTrNntryID },
																					success: function (result) {
																						if (result.status === 0) {
																							let activePaginationBtn = panel1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																							swallSuccess(activePaginationBtn);	//操作成功提示并刷新页面
																						}
																						else {
																							swallFail();	// 提交失败，请重新提交提示
																						}
																					}
																				})
																			})
																			break
																		}
																		default:
																			break;
																	}
																})
															}
																break;

															default:
																break;
														}
													}
												}
											}
										},

										pagination: {
											totalRow: result.map.lines, // 总行数
											displayRow: result.map.upkeepProjects.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									paginationContainer.hide()	//隐藏分页按钮
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryUpkeepPlansUrl, {
						type: 'projectInfo',
						headNum: 1
					});

					//新增项目按钮单击事件
					headingMainBtn_1.off('click').on('click', (event) => {

						let dataContent = submitModelModal,
							modalPanel = dataContent.find('.panel'),		//panel
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),	//关闭按钮
							modalSubmitBtn = dataContent.find('.modal-submit'),	//提交按钮
							fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
							fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
							// 表单要提交的数据
							submithData = {
								projectName: '',			//保养项目名称
								projectStandard: '',	//基准
								projectPoint: '',			//要点
								projectPeriod: '',		//周期
								projectRank: ''				//级别
							};

						modalPanel.find('.panel-heading').find('.panel-title').text('新增项目') // 更换panel标题
						fuzzySearchGroupBtn.addClass('hide')
						modalSubmitBtn.attr('disabled', false)

						mesHorizontalTableAddData(modalPanel.find('table'), null, {
							thead: '检修保养项目/检修保养基准/检修保养要点/周期/级别',
							tableWitch: '20%/30%',
							viewColGroup: 2,
							importStaticData: (tbodyTd, length) => {
								let inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`;

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											let target = tbodyTd.eq(i).find('input'),	//获取输入框
												mesPopover = new MesPopover(target, { content: '中文、大小写字母、数字、下划线组成1-16字符串' });

											target.off('focus').on('focus', (event) => {	//输入框获取焦点事件
												mesPopover.show()
											})

											// 添加到提交数据
											target.off('blur').on('blur', (event) => {	//输入框失去焦点事件
												submithData.projectName = target.val().replace(/\s/g, "")
												if (submithData.projectName === '' || !USERNAME_REG1.test(submithData.projectName)) {
													mesPopover.show()
												} else {
													mesPopover.hide()
												}
											})
											break;
										}
										case 1: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.projectStandard = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 2: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.projectPoint = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 3: {
											tbodyTd.eq(i).addClass('table-input-td')
											inputHtml = `
													<select class="form-control table-input input-sm">
														<option val="0">未选择</option>
														<option val="1次/天">1次/天</option>
														<option val="1次/天">1次/周</option>
														<option val="1次/天">1次/2周</option>
														<option val="1次/天">1次/月</option>
														<option val="1次/天">1次/季</option>
													</select>
											`;
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('select').off('blur').on('change', (event) => {
												submithData.projectPeriod = tbodyTd.eq(i).find('select').val().replace(/\s/g, "")
												console.log(submithData.projectPeriod)
											})
											break;
										}
										case 4: {
											tbodyTd.eq(i).addClass('table-input-td')
											inputHtml = `
													<select class="form-control table-input input-sm">
														<option val="0">未选择</option>
														<option val="一级">一级</option>
														<option val="二级">二级</option>
														<option val="三级">三级</option>
														<option val="四级">四级</option>
														<option val="五级">五级</option>
													</select>
											`;
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('select').off('blur').on('change', (event) => {
												submithData.projectRank = tbodyTd.eq(i).find('select').val().replace(/\s/g, "")
											})
											break;
										}
										default:
											break;
									}

							}
						})

						// 提交数据按钮单击事件
						modalSubmitBtn.off('click').on('click', (event) => {
							let projectList = [];
							projectList[0] = submithData;
							if (projectList.length > 0) {
								swal({
									title: '您确定要提交本次操作吗?',
									text: '请确保填写信息无误后点击确定按钮',
									type: 'question',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: true, // 显示用户取消按钮
									confirmButtonText: '确定',
									cancelButtonText: '取消',
								}).then(function () {

									console.dir(submithData)
									$.ajax({
										type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
										url: saveUpkeepProjectUrl,
										data: {
											"projects": JSON.stringify(projectList)
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {

												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											}
											else {
												swallFail();	//操作失败
											}
										}
									})
								});
							}
							else {
								swallError();	//格式不正确
							}

						})

					})

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡

						// if (val !== '') {
						// }
						// else {
						// 	// 为空时重置搜索
						// 	return;
						// }

						addTableData(queryUpkeepPlansUrl, {
							type: 'projectInfo',
							projectName: val,
							headNum: 1
						});

						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
						}

					});

				}())
				break;
			case '#devicesfault'://故障记录内容区域
				(function () {
					let activeSwiper = $('#devicesfault'), // 右侧外部swiper
						activeSubSwiper = $('#devicesfaultInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1,新增故障记录

						devicesTypeOption = activePanelHeading.find('.devices-type-option'), // 类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						});
						//创建设备类型下拉选
					createDevicesTypeSelect(devicesTypeOption);
					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: url,
							data: data,
							beforeSend: function (xml) {
								// ajax发送前
								mesloadBox.loadingShow()
							},
							success: function (result, status, xhr) {
								// ajax成功
								mesloadBox.hide()
								paginationContainer.show()	//显示分页按钮
								if (result.status === 0) {
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/设备名称/设备编号/发生时间/故障部位/处理情况/处理人/确认人/操作',
											theadWidth: '4%/12%/12%/12%/12%/10%/10%/10%/20%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link moreDevicesFault" href="javascript:;" data-toggle-modal-target="#faultRecordDetailsModal"><i class="fa fa-tasks fa-fw"></i>更多</a>' +
												'<a class="table-link editDevicesFault" href="javascript:;" data-toggle-modal-target="#submitModelModal"><i class="fa fa-pencil-square-o"></i>修改</a>' +
												'<a class="table-link text-danger deleteDevicesFault" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.devices, // 主要数据列表
													tempData = null; // 表格td内的临时数据

												for (let i = 0, len = dataList.length; i < len; i++) {
													tbodyTarget.append('<tr></tr>'); // 添加行
													let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
													for (let i = 0, len = html.length; i < len; i++) {
														currentTr.append(html[i]); // 添加表格内的HTML
														switch (i) {
															case 0:
																currentTr.children().eq(i).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].devices.devices_control_devices_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].devices.devices_control_devices_number;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].devices_malfunction_record_time;
																currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))
															}
																break;
															case 4: {
																tempData = dataList[currentTr.index()].devices_malfunction_record_part;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 5: {
																tempData = dataList[currentTr.index()].devices_malfunction_record_status;
																currentTr.children().eq(i).html(tempData)
																if (tempData === '未处理') {
																	currentTr.children().eq(i).addClass('text-warning')
																} else if (tempData === '已处理'){
																	currentTr.children().eq(i).addClass('text-success')
																}
															}
																break;
															case 6: {
																tempData = dataList[currentTr.index()].devices_malfunction_people;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 7: {
																tempData = dataList[currentTr.index()].devices_malfunction_identify_people;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 8:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		devicesID = dataList[currentTr.index()].devices.devices_control_devices_id;
																	console.log(dataContent)
																	switch (dataContent) {
																		case '#faultRecordDetailsModal': {	//详情
																			let dataContent = $('#faultRecordDetailsModal'),
																				panelList = dataContent.find('.panel'),
																				panel1 = panelList.eq(0),
																				panel2 = panelList.eq(1),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),

																				panel2Thead = panel2.find('thead'),
																				panel2Tbody = panel2.find('tbody');

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: url,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功
																						mesloadBox.hide()
																						if (result.status === 0) {
																							//panel1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								// thead: '设备名称/设备编号/设备类型/购买日期/使用日期/安放地点',
																								thead: '设备名称/设备编号/购买日期/使用日期',
																								 tableWitch: '30%/60%',
																								viewColGroup: 2,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.devices, // 主要数据列表
																										tempData = null; // 表格td内的临时数据
																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].devices.devices_control_devices_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 1: {
																												tempData = dataList[0].devices.devices_control_devices_number;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											// case 2: {

																											// }
																												// break;
																											case 2: {
																												tempData = dataList[0].devices.devices_control_devices_purchase_date;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 3: {
																												tempData = dataList[0].devices.devices_control_devices_use_date;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											// case 5: {

																											// }
																											// 	break;

																											default:
																												break;
																										}

																								}
																							})

																							//panel2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '序号/故障时间/故障部位/处理情况/记录人/确认人/故障描述/操作',
																									theadWidth: '5%/10%/10%/10%/10%/10%/20%/10%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-modal-target="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.devices, // 主要数据列表
																											tempData = null; // 表格td内的临时数据

																										for (let i = 0, len = dataList.length; i < len; i++) {
																											tbodyTarget.append('<tr></tr>'); // 添加行
																											let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																											for (let j = 0, len = html.length; j < len; j++) {
																												currentTr.append(html[j]); // 添加表格内的HTML
																												switch (j) {
																													case 0: {
																														tempData = i + 1;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList[i].devices_malfunction_record_time;
																														currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD'))
																													}
																														break;
																													case 2: {
																														tempData = dataList[i].devices_malfunction_record_part;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[i].devices_malfunction_record_status;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList[i].devices_malfunction_people;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = dataList[i].devices_malfunction_identify_people;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 6: {
																														tempData = dataList[i].devices_malfunction_record_describe;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 7: {
																														currentTr.children().eq(j).off('click').on('click', 'a', function () {
																															 let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																															 	currentTrNntryID = dataList[i].devices_malfunction_record_id

																															swal({
																																title: '您确定要删除此条数据吗？',
																																text: '删除后将无法查询',
																																type: 'question',
																																showCancelButton: true,
																																confirmButtonText: '确定',
																																cancelButtonText: '取消'
																															}).then(function () {
																																$.ajax({
																																	url: removeMalfunctionRecordInfoUrl,
																																	type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																	data: {
																																		recordId: currentTrNntryID
																																	},
																																	success: function (result) {
																																		if (result.status === 0) {
																																			swal({
																																				title: '删除成功',
																																				type: 'success',
																																				timer: '1000',
																																				allowEscapeKey: false, // 用户按esc键不退出
																																				allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																																				showCancelButton: false, // 显示用户取消按钮
																																				showConfirmButton: false, // 显示用户确认按钮
																																			}).then(
																																				() => {
																																				},
																																				(dismiss) => {
																																					let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')

																																					if (dismiss === 'timer') {
																																						activePaginationBtn.trigger('click')
																																						modalCloseBtn.trigger('click')	//关闭模态框
																																					}
																																				})
																																		}
																																		else {
																																			swal({
																																				title: '删除失败',
																																				type: 'warning',
																																				timer: '1000',
																																				allowEscapeKey: false, // 用户按esc键不退出
																																				allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																																				showCancelButton: false, // 显示用户取消按钮
																																				showConfirmButton: false, // 显示用户确认按钮
																																			})
																																		}
																																	}
																																})
																															})

																														})
																													}

																														break;

																													default:
																														break;
																												}
																											}
																										}
																									}
																								},

																								pagination: {
																									totalRow: result.map.lines, // 总行数
																									displayRow: result.map.devices.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}

																							})

																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}

																			// 导航栏点击时运行数据加载
																			addTableData(queryDevicesMalfunctionUrl, {
																				type: 'id',
																				devicesId: devicesID,
																				headNum: 1
																			});

																			break;
																		}
																		case '#submitModelModal': {

																			let dataContent = submitModelModal,
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),

																				// 表单要提交的数据
																				submithData = {
																					recordId: '',
																					recordTime: '',
																					recordPart: '',
																					malfunctionPeople: '',
																					disposeTime: '',
																					recordStatus: '',
																					recordCause: '',
																					recordDescribe: '',
																					identifyPeople: ''
																				};

																			submithData.recordId = dataList[currentTr.index()].devices_malfunction_record_id
																			panelModal1.find('.panel-heading').find('.panel-title').text('修改故障记录') // 更换panel标题
																			modalSubmitBtn.attr('disabled',true)
																			fuzzySearchGroupBtn.addClass('hide')

																			mesHorizontalTableAddData(panelModal1.find('table'), null, {
																				thead: '设备名称/设备编号/发生时间/故障部位/故障原因/处理情况/处理时间/记录人/确认人/故障描述',
																				tableWitch: '20%/30%',
																				viewColGroup: 2,
																				importStaticData: (tbodyTd, length) => {
																					let inputHtml;

																					for (let i = 0, len = length; i < len; i++) {
																						switch (i) {
																							case 0: {
																								tbodyTd.eq(i).html(dataList[currentTr.index()].devices.devices_control_devices_name)
																								break;
																							}
																							case 1: {
																								tbodyTd.eq(i).html(dataList[currentTr.index()].devices.devices_control_devices_number)
																								break;
																							}
																							case 2: {
																								tbodyTd.eq(i).html(dataList[currentTr.index()].devices_malfunction_record_time)
																								break;
																							}
																							case 3: {
																								inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('input');
																								target.val(dataList[currentTr.index()].devices_malfunction_record_part)

																								// 添加到提交数据
																								target.off('blur keyup').on('blur keyup', (event) => {
																									submithData.recordPart = target.val().replace(/\s/g, "")
																									if (submithData.recordPart === dataList[currentTr.index()].devices_malfunction_record_part) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																								break;
																							}
																							case 4: {
																								inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('input');
																								target.val(dataList[currentTr.index()].devices_malfunction_record_cause)

																								// 添加到提交数据
																								target.off('blur keyup').on('blur keyup', (event) => {
																									submithData.recordCause = target.val().replace(/\s/g, "")
																									if (submithData.recordCause === dataList[currentTr.index()].devices_malfunction_record_cause) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})

																								break;
																							}
																							case 5: {
																								inputHtml = `<select class="form-control table-input input-sm">
																															<option value="未处理">未处理</option>
																															<option value="已处理">已处理</option>
																														</select>`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('select');
																								target.val(dataList[currentTr.index()].devices_malfunction_record_status)

																								// 添加到提交数据
																								target.off('change').on('change', (event) => {
																									submithData.recordStatus = target.val()
																									if (submithData.recordStatus === dataList[currentTr.index()].devices_malfunction_record_status) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																								break;
																							}
																							case 6: {
																								inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间"  onclick="WdatePicker({maxDate:'%y-%M-%d'})"/>`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('input');
																								target.val(dataList[currentTr.index()].devices_malfunction_dispose_time)

																								// 添加到提交数据
																								target.off('blur keyup').on('blur keyup', (event) => {
																									submithData.disposeTime = target.val().replace(/\s/g, "")
																									if (submithData.disposeTime === dataList[currentTr.index()].devices_malfunction_dispose_time) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})

																								break;
																							}
																							case 7: {
																								inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('input');
																								target.val(dataList[currentTr.index()].devices_malfunction_people)

																								tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																									// 添加员工选择模态框
																									let promise = new Promise(function (resolve, reject) {
																										selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																									});
																									promise.then(function (resolveData) {
																										tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
																										submithData.malfunctionPeople = resolveData.roleStaffId 		// 获取选择的员工id
																										if (submithData.malfunctionPeople === dataList[currentTr.index()].devices_malfunction_people) {
																											modalSubmitBtn.attr('disabled', true)
																										} else {
																											modalSubmitBtn.attr('disabled', false)
																										}
																									})

																									$(this).prop('readonly', true) // 输入框只读
																									$(this).off('blur').on('blur', () => {
																										$(this).removeProp('readonly') // 输入移除框只读
																									})
																								})
																								break;
																							}
																							case 8: {
																								inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('input');
																								target.val(dataList[currentTr.index()].devices_malfunction_identify_people)

																								tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																									// 添加员工选择模态框
																									let promise = new Promise(function (resolve, reject) {
																										selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																									});
																									promise.then(function (resolveData) {
																										tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
																										submithData.identifyPeople = resolveData.roleStaffId 		// 获取选择的员工id
																										if (submithData.identifyPeople === dataList[currentTr.index()].devices_malfunction_identify_people) {
																											modalSubmitBtn.attr('disabled', true)
																										} else {
																											modalSubmitBtn.attr('disabled', false)
																										}
																									})

																									$(this).prop('readonly', true) // 输入框只读
																									$(this).off('blur').on('blur', () => {
																										$(this).removeProp('readonly') // 输入移除框只读
																									})
																								})
																								break;
																							}
																							case 9: {
																								inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)

																								let target = tbodyTd.eq(i).find('input');
																								target.val(dataList[currentTr.index()].devices_malfunction_record_describe)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur keyup').on('blur keyup', (event) => {
																									submithData.recordDescribe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									if (submithData.recordDescribe === dataList[currentTr.index()].devices_malfunction_record_describe) {
																										modalSubmitBtn.attr('disabled', true)
																									} else {
																										modalSubmitBtn.attr('disabled', false)
																									}
																								})
																								break;
																							}

																							default:
																								break;
																						}
																					}

																				}
																			})

																			// 提交数据按钮单击事件
																			modalSubmitBtn.off('click').on('click', (event) => {
																				if (submithData.recordId !== '') {
																					swal({
																						title: '您确定要提交本次操作吗?',
																						text: '请确保填写信息无误后点击确定按钮',
																						type: 'question',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: true, // 显示用户取消按钮
																						confirmButtonText: '确定',
																						cancelButtonText: '取消',
																					}).then(function () {

																						console.dir(submithData)
																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: modifyMalfunctionRecordInfoUrl,
																							data: {
																								"recordId": submithData.recordId,	//故障记录id
																								"recordPart": submithData.recordPart,	//故障部分
																								"disposeTime": submithData.disposeTime,	//故障处理时间
																								"recordStatus": submithData.recordStatus,	//处理状态
																								"recordCause": submithData.recordCause,	//故障原因
																								"recordDescribe": submithData.recordDescribe,	//故障备注
																								"identifyPeople": submithData.identifyPeople //故障确认人
																							},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {

																									let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																									swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																								}
																								else {
																									swallFail();	//操作失败
																								}
																							}
																						})
																					});
																				}
																				else {
																					swallError();	//格式不正确
																				}

																			})

																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].devices_malfunction_record_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMalfunctionRecordInfoUrl,
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: {
																						recordId: currentTrNntryID
																					},
																					success: function (result) {
																						if (result.status === 0) {
																							swal({
																								title: '删除成功',
																								type: 'success',
																								timer: '1000',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								showConfirmButton: false, // 显示用户确认按钮
																							}).then(
																								() => {
																								},
																								(dismiss) => {
																									let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')

																									if (dismiss === 'timer') {
																										activePaginationBtn.trigger('click') // 删除当前行
																									}
																								})
																						}
																						else {
																							swal({
																								title: '删除失败',
																								type: 'warning',
																								timer: '1000',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								showConfirmButton: false, // 显示用户确认按钮
																							})
																						}
																					}
																				})
																			})
																			break;
																		}
																		default:
																			break;
																	}
																})
																break;
															default:
																break;
														}
													}
												}
											}
										},

										pagination: {
											totalRow: result.map.lines, // 总行数
											displayRow: result.map.devices.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									paginationContainer.hide()	//隐藏分页按钮
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryDevicesMalfunctionUrl, {
						type: 'all',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryDevicesMalfunctionUrl, {
								type: 'key',
								devicesName: val,
								headNum: 1
							});
						}
						else {
							addTableData(queryDevicesMalfunctionUrl, {
								type: 'all',
								headNum: 1
							});
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
						}

					});

					// 下拉选事件
					devicesTypeOption.change(function () {
						let currentDevicesTypeID = $(this).val();

						addTableData(queryDevicesMalfunctionUrl, {
							type: 'typeId',
							typeId: currentDevicesTypeID,
							headNum: 1
						});
					})
					// 头部主要按钮1点击事件，新增故障记录
					headingMainBtn_1.off('click').on('click', (event) => {

						let dataContent = submitModelModal,
							panelModal1 = dataContent.find('.panel'),
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							modalSubmitBtn = dataContent.find('.modal-submit'),
							fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
							fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
							// 表单要提交的数据
							submithData = {
								devicesId: '',
								recordTime: '',
								recordPart: '',
								malfunctionPeople: '',
								disposeTime: '',
								recordStatus: '未处理',
								recordCause: '',
								recordDescribe: '',
								identifyPeople: ''
							};

						panelModal1.find('.panel-heading').find('.panel-title').text('新增故障记录') // 更换panel标题
						fuzzySearchGroupBtn.addClass('hide')
						modalSubmitBtn.attr('disabled', false)

						mesHorizontalTableAddData(panelModal1.find('table'), null, {
							thead: '设备名称/设备编号/发生时间/故障部位/故障原因/处理情况/处理时间/记录人/确认人/故障描述',
							tableWitch: '20%/30%',
							viewColGroup: 2,
							importStaticData: (tbodyTd, length) => {
								let inputHtml;

								for (let i = 0, len = length; i < len; i++) {
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择设备(必填)" autocomplete="on" />`;
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加设备选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectDevicessAddData2(resolve)
												});
												promise.then(function (resolveData) {
													tbodyTd.eq(i).find('input').val(resolveData.devicesName)	//将选择的设备名称写入输入框
													tbodyTd.eq(i + 1).html(resolveData.devicesNumber)						//将选择的设备编号写入下一格
													submithData.devicesId = resolveData.devicesId;		//获取选择的设备id
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {

											break;
										}
										case 2: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)"  onclick="WdatePicker({maxDate:'%y-%M-%d'})"/>`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.recordTime = tbodyTd.eq(i).find('input').val()
											})
											break;
										}
										case 3: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.recordPart = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 4: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.recordCause = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 5: {
											inputHtml = `<select class="form-control table-input input-sm">
																			<option value="未处理">未处理</option>
																			<option value="已处理">已处理</option>
																	</select>`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
												submithData.recordStatus = tbodyTd.eq(i).find('select').val()
											})
											break;
										}
										case 6: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间"  onclick="WdatePicker({maxDate:'%y-%M-%d'})"/>`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.disposeTime = tbodyTd.eq(i).find('input').val()
											})
											break;
										}
										case 7: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
												});
												promise.then(function (resolveData) {
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
													submithData.malfunctionPeople = resolveData.roleStaffId 		// 获取选择的员工id
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 8: {
											inputHtml = `<input type="text" class="table-input" placeholder="点此选择员工" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
												});
												promise.then(function (resolveData) {
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)	//将选择的员工姓名写入输入框
													submithData.identifyPeople = resolveData.roleStaffId 		// 获取选择的员工id
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 9: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.recordDescribe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}

										default:
											break;
									}
								}

							}
						})

						// 提交数据按钮单击事件
						modalSubmitBtn.off('click').on('click', (event) => {
							if (submithData.devicesId !== '') {
								swal({
									title: '您确定要提交本次操作吗?',
									text: '请确保填写信息无误后点击确定按钮',
									type: 'question',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: true, // 显示用户取消按钮
									confirmButtonText: '确定',
									cancelButtonText: '取消',
								}).then(function () {

									$.ajax({
										type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
										url: saveMalfunctionRecordInfoUrl,
										data: {
											"devicesId": submithData.devicesId,
											"recordTime": submithData.recordTime,
											"recordPart": submithData.recordPart,
											"malfunctionPeople": submithData.malfunctionPeople,
											"disposeTime": submithData.disposeTime,
											"recordStatus": submithData.recordStatus,
											"recordCause": submithData.recordCause,
											"recordDescribe": submithData.recordDescribe,
											"identifyPeople": submithData.identifyPeople,
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {

												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											}
											else {
												swallFail();	//操作失败
											}
										}
									})
								});
							}
							else {
								swallError();	//格式不正确
							}

						})

					})

				}())
				break;



		}
	})
	leftNavLink.eq(0).trigger('click');


	/**
	 * @description :员工选择模态框（单选),第一层弹窗调用
	 *@param resolve: Promise回调函数
	 *@param url: 请求路径
	 *@param data: 请求参数
	 */
	function selectStaffAddData(resolve, url, data) {
		let selectStaffModal = $('#publicSelectModalBox'), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			selectDepartment = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 需要的功能
		selectDepartment.hide()
		fuzzySearchGroup.show()

		// 修改标题
		modalTitle.html('选择工作人员')
		fuzzySearchGroup.closest('.input-group').find('input').val('')

		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可关闭模态框
			show: false
		})
		selectStaffModal.modal('show') // 运行时显示
		// selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
		// 	$('body').addClass('modal-open')
		// })

		modalCloseBtn.off('click').on('click', (event) => {
			// 点击关闭按钮隐藏该模态框
			selectStaffModal.modal('hide')

		})

		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
				url: url,
				data: data,
				beforeSend: function (xml) {
					// ajax发送前
					mesloadBox.loadingShow()
				},
				success: function (result, status, xhr) {
					// ajax成功
					paginationContainer.show()	//显示分页按钮
					mesloadBox.hide()
					if (result.status === 0) {
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/姓名/工号/职位',
								theadWidth: '10%/30%/30%/30%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td></td>',
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.staffs, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												roleStaffId: dataList[currentTr.index()].role_staff_id,
												roleStaffName: dataList[currentTr.index()].role_staff_name
											})
										})
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = dataList[currentTr.index()].role_staff_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].role_staff_number;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 3: {
													try {
														tempData = dataList[currentTr.index()].post.role_post_name;
														currentTr.children().eq(i).html(tempData)
													}
													catch (e) {
														currentTr.children().eq(i).html('')
													}
												}
													break;
												default:
													break;
											}
										}
									}
								}
							},

							pagination: {
								totalRow: result.map.lines, // 总行数
								displayRow: result.map.staffs.length // 显示行数
							},

							ajax: {
								url: url,
								data: data
							}
						})
					}
					else {
						panelTbody.empty().append(NO_DATA_NOTICE)
						paginationContainer.hide()	//隐藏分页按钮
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(url, {
			type: 'info',
			headNum: 1
		}) // 启动运行


		// 模糊搜索组加载数据
			fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				if (val !== '') {
					addTableData(url, {
						type:'info',
						staffName: val,
						headNum: 1
					}) // 启动运行
				}
				else {
					// 为空时搜索全部
					addTableData(url, {
						type: 'info',
						headNum: 1
					})
				}
				//清空搜索框并获取焦点
				$(this).closest('.input-group').find('input').focus().val('')
			});

			// 模糊搜索回车搜索
			fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					fuzzySearchGroup.find('.btn').trigger('click')	//模拟点击搜索按钮
				}
			});

	}

	/**
 * @description :员工选择模态框（单选),第二层弹窗调用
 *@param resolve: Promise回调函数
 *@param url: 请求路径
 *@param data: 请求参数
 */
	function selectStaffAddData2(resolve, url, data) {
		let selectStaffModal = $('#publicSelectModalBox'), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			// panelTbody = staffListPanel.find('tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			selectDepartment = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 需要的功能
		selectDepartment.hide()
		fuzzySearchGroup.show()

		// 初始化模态框
		modalTitle.html('选择工作人员')
		fuzzySearchGroup.closest('.input-group').find('input').val('')

		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可关闭模态框
			show: true
		})
		selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
			$('body').addClass('modal-open')
		})

		modalCloseBtn.off('click').on('click', (event) => {
			// 点击关闭按钮隐藏该模态框
			selectStaffModal.modal('hide')
		})

		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
				url: url,
				data: data,
				beforeSend: function (xml) {
					// ajax发送前
					mesloadBox.loadingShow()
				},
				success: function (result, status, xhr) {
					// ajax成功
					paginationContainer.show()	//显示分页按钮
					mesloadBox.hide()
					if (result.status === 0) {
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/姓名/工号/职位',
								theadWidth: '10%/30%/30%/30%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td></td>',
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.staffs, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												roleStaffId: dataList[currentTr.index()].role_staff_id,
												roleStaffName: dataList[currentTr.index()].role_staff_name
											})
										})
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = dataList[currentTr.index()].role_staff_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].role_staff_number;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 3: {
													try {
														tempData = dataList[currentTr.index()].post.role_post_name;
														currentTr.children().eq(i).html(tempData)
													}
													catch (e) {
														currentTr.children().eq(i).html('')
													}
												}
													break;
												default:
													break;
											}
										}
									}
								}
							},

							pagination: {
								totalRow: result.map.lines, // 总行数
								displayRow: result.map.staffs.length // 显示行数
							},

							ajax: {
								url: url,
								data: data
							}
						})
					}
					else {
						panelTbody.empty().append(NO_DATA_NOTICE)
						paginationContainer.hide()	//隐藏分页按钮
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(url, {
			type:'info',
			headNum: 1
		}) // 启动运行

		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(url, {
					type: 'info',
					staffName: val,
					headNum: 1
				}) // 启动运行
			}
			else {
				// 为空时搜索全部
				addTableData(url, {
					type: 'info',
					headNum: 1
				})
			}
			//清空搜索框并获取焦点
			$(this).closest('.input-group').find('input').focus().val('')
		});

		// 模糊搜索回车搜索
		fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault()
				fuzzySearchGroup.find('.btn').trigger('click')	//模拟点击搜索按钮
			}
		});


	}

	/**
 * @description 设备选择选择模态框（多选）
 * @param {any} devicesIDInLineList 已经选择的车间id集合
 * @param {any} devicesIDList 要提交的车间id集合，只能为空
 */
	function selectDevicessAddData(devicesIDInLineList, devicesIDList) {
		let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),	 // 表格
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),	 // 关闭按钮
			modalTitle = targetModal.find('.modal-title'),	 // 标题
			devicesTypeOption = targetModalPanel.find('.pullDownMenu-1'), // 设备类型选项
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索组
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 初始化设置
		modalTitle.html('选择设备') // 设置标题
		fuzzySearchGroup.closest('.input-group').find('input').val('')

		// 设备下拉菜单添加选项
		createDevicesTypeSelect(devicesTypeOption);

		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
				url: url,
				data: data,
				beforeSend: function (xml) {
					// ajax发送前
					mesloadBox.loadingShow()
				},
				success: function (result, status, xhr) {
					// ajax成功
					mesloadBox.hide()
					if (result.status === 0) {
						mesVerticalTableAddData(targetModalPanel, {
							thead: {
								theadContent: '序号/设备名称/设备编号/操作',
								theadWidth: '10%/40%/30%/20%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td class="table-input-td"><span style="vertical-align: middle;"><div class="table-input-warp"><label class="checkbox-inline"><input type="checkbox">选择</label></div></span></td>',
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										devicespList = map.devices, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = devicespList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = devicespList[currentTr.index()].devices_control_devices_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = devicespList[currentTr.index()].devices_control_devices_number;
													currentTr.children().eq(i).html(tempData)

												}
													break;
												case 3: {

													let devicesID;	//车间id
													devicesID = devicespList[currentTr.index()].devices_control_devices_id;

													if (traverseListPush2(devicesIDInLineList, devicesID)) {
														currentTr.children().eq(i).find(':checkbox').prop('checked', true).attr('disabled', true);
														currentTr.addClass("text-success");
													}

													//单选框选中取消事件
													currentTr.children().eq(i).off('click').on('click', ':checkbox', function () {

														if ($(this).is(':checked')) {  //表示选中
															currentTr.addClass("text-success");
															traverseListPush(devicesIDList, devicesID);	//将功能id放入功能id集合
														} else {                        //表示取消
															currentTr.removeClass("text-success");
															traverseListDelete(devicesIDList, devicesID);
														}

													})
												}
													break;
												default:
													break;
											}
										}
									}
								}
							},

							pagination: {
								totalRow: result.map.lines, // 总行数
								displayRow: result.map.devices.length // 显示行数
							},

							ajax: {
								url: url,
								data: data
							}
						})
					}
					else {
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(queryDevicesUrl, {
			type: 'all',
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryDevicesUrl, {
					type: 'key',
					keyWord: val,
					headNum: 1
				})
			}
			else {
				addTableData(queryDevicesUrl, {
					type: 'all',
					headNum: 1
				})
			}
			//清空搜索框并获取焦点
			$(this).closest('.input-group').find('input').focus().val('')
		});

		// 模糊搜索回车搜索
		fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault()
				$(this).closest('.input-group').find('button').trigger('click')
			}
		});

		// 下拉选事件
		devicesTypeOption.change(function () {
			let val = $(this).val();

			addTableData(queryDevicesUrl, {
				type: 'typeId',
				typeId: val,
				headNum: 1
			})
		})

	}

	/**
	 * @description :设备选择模态框（单选）
	 *@param resolve: Promise回调函数
	 */
	function selectDevicessAddData2(resolve) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			selectDepartment = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			});

		// 需要的功能
		selectDepartment.show()
		fuzzySearchGroup.show()

		// 修改标题
		modalTitle.html('选择设备')
		fuzzySearchGroup.closest('.input-group').find('input').val()

		// 设备下拉菜单添加选项
		createDevicesTypeSelect(selectDepartment)

		// selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
		// 	$('body').addClass('modal-open')
		// })
		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可关闭模态框
			show: false
		})
		selectStaffModal.modal('show') // 运行时显示
		modalCloseBtn.off('click').on('click', (event) => {
			// 点击关闭按钮隐藏该模态框
			selectStaffModal.modal('hide')

			// 初始化表格
			targetTable.find('thead').empty()
			targetTable.find('tbody').empty()
		})

		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
				url: url,
				data: data,
				beforeSend: function (xml) {
					// ajax发送前
					mesloadBox.loadingShow()
				},
				success: function (result, status, xhr) {
					// ajax成功
					mesloadBox.hide()
					if (result.status === 0) {
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/设备名称/设备编号/设备状态',
								theadWidth: '10%/30%/30%/30%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td></td>',
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.devices, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												devicesId: dataList[currentTr.index()].devices_control_devices_id,
												devicesName: dataList[currentTr.index()].devices_control_devices_name,
												devicesNumber: dataList[currentTr.index()].devices_control_devices_number
											})
										})
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = dataList[currentTr.index()].devices_control_devices_name;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].devices_control_devices_number;
													currentTr.children().eq(i).html(tempData);

												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].devices_control_devices_status;
													tempData === '0' ? tempData = '使用中':'未使用'
													currentTr.children().eq(i).html(tempData);
												}
													break;
												default:
													break;
											}
										}
									}
								}
							},

							pagination: {
								totalRow: result.map.lines, // 总行数
								displayRow: result.map.devices.length // 显示行数
							},

							ajax: {
								url: url,
								data: data
							}
						})
					}
					else {
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(queryDevicesUrl, {
			type: 'all',
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryDevicesUrl, {
					type: 'key',
					keyWord: val,
					headNum: 1
				})
			}
			else {
				// 为空时重置搜索
				addTableData(queryDevicesUrl, {
					type: 'all',
					headNum: 1
				})
			}
			//清空搜索框并获取焦点
			$(this).closest('.input-group').find('input').focus().val('')
		})

		// 模糊搜索回车搜索
		fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault()
				$(this).closest('.input-group').find('button').trigger('click')
			}

		})

		// 下拉选事件
		selectDepartment.change(function () {
			let val = $(this).val();

			addTableData(queryDevicesUrl, {
				type: 'typeId',
				typeId: val,
				headNum: 1
			})
		})

	}

	/**
	* @description :保养项目选择模态框（单选）
	*@param resolve: Promise回调函数
	*@param url: 请求路径
	*@param data: 请求参数
	*/
	function selectUpkeepProjectAddData(resolve, url, data) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			selectDepartment = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 需要的功能
		selectDepartment.hide()
		fuzzySearchGroup.show()

		// 修改标题
		modalTitle.html('选择保养项目')
		fuzzySearchGroup.closest('.input-group').find('input').val()
		// selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
		// 	$('body').addClass('modal-open')
		// })
		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可关闭模态框
			show: false
		})
		selectStaffModal.modal('show') // 运行时显示
		modalCloseBtn.off('click').on('click', (event) => {
			// 点击关闭按钮隐藏该模态框
			selectStaffModal.modal('hide')

			// 初始化表格
			targetTable.find('thead').empty()
			targetTable.find('tbody').empty()
		})

		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
				url: url,
				data: data,
				beforeSend: function (xml) {
					// ajax发送前
					mesloadBox.loadingShow()
				},
				success: function (result, status, xhr) {
					// ajax成功
					mesloadBox.hide()
					if (result.status === 0) {
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/项目名称/保养基准/保养周期/保养级别',
								theadWidth: '5%/25%/25%/15%/15%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td></td>'
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.upkeepProjects, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												upkeepProjectId: dataList[currentTr.index()].devices_upkeep_project_id,
												upkeepProjectName: dataList[currentTr.index()].devices_upkeep_project_name,
												upkeepProjectStandard: dataList[currentTr.index()].devices_upkeep_project_standard,
												upkeepProjectPoint: dataList[currentTr.index()].devices_upkeep_project_point,
												upkeepProjectPeriod: dataList[currentTr.index()].devices_upkeep_project_period,
												upkeepProjectRank: dataList[currentTr.index()].devices_upkeep_project_rank
											})
										})
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = dataList[currentTr.index()].devices_upkeep_project_name;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].devices_upkeep_project_standard;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].devices_upkeep_project_period;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 4: {
													tempData = dataList[currentTr.index()].devices_upkeep_project_rank;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												default:
													break;
											}
										}
									}
								}
							},

							pagination: {
								totalRow: result.map.lines, // 总行数
								displayRow: result.map.upkeepProjects.length // 显示行数
							},

							ajax: {
								url: url,
								data: data
							}
						})
					}
					else {
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(url, data) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			addTableData(url, {
				type: 'projectInfo',
				projectName: val,
				headNum: 1
			})
			//清空搜索框并获取焦点
			$(this).closest('.input-group').find('input').focus().val('')
		});

		// 模糊搜索回车搜索
		fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault()
				$(this).closest('.input-group').find('button').trigger('click')
			}
		});

	}

		/**
	* @description :导出设备历史参数时选择导出数量
	*@param resolve: Promise回调函数
	*/
	function selectUpkeepProjectAddData2(deviceId,headNum,tailNum,startTime,endTime,deviceParameter) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox2')),
			staffListPanel = selectStaffModal.find('.panel'), // 模态框
			selectDepartment = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			getBtn = selectStaffModal.find('.modal-submit'),
			selectContent = staffListPanel.find('.panel-title'),
			modalTitle = selectStaffModal.find('.modal-title');

			modalTitle.html('请选择导出数量')
			selectStaffModal.modal({
				backdrop: false, // 黑色遮罩不可点击
				keyboard: false,  // esc按键不可关闭模态框
				show: false
			})

			selectDepartment.off('click').on('click', (event) => {
				selectContent.html(selectDepartment.val())
			})
			selectContent.html(selectDepartment.val())
			// 点击确认提交按钮导出
			getBtn.off('click').on('click', (event) => {
				tailNum = selectDepartment.val();
				let tempUrl = `${queryPerHistoryParametersUrl}?deviceId=${deviceId}&headNum=${headNum}&tailNum=${tailNum}&startTime=${startTime}&endTime=${endTime}&deviceParameter=${deviceParameter}`;
				location.href = tempUrl
				selectStaffModal.modal('hide')
			})
			selectStaffModal.modal('show') // 运行时显示
			modalCloseBtn.off('click').on('click', (event) => {
				// 点击关闭按钮隐藏该模态框
				selectStaffModal.modal('hide')

			})
	}


})

