$(function () {
	let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
		RightContent = $('#mainRightContent'), // 右侧内容栏
		RightContentSwiper = RightContent.find('.swiper-wrapper'), // 右侧内容栏下的swiper
		leftNavLink = leftNav.find('a').filter('[href^="#"]'), // 左侧变栏对应的swiper
		mainModal_1 = $('#modalBox').find('#mainModal_1'), // 主要模态框1
		dataDetailsModal = $('#dataDetailsModal'),	// 详情模态框1
		submitModelModal = $('#submitModelModal'),	// 表单提交模态框1
		submitModelModal2 = $('#submitModelModal2'),	// 表单提交模态框2
		workstageList=[],//工序集合
		workshop=[],//车间集合
		warehouseList=[],//仓库集合
		timer = null;

		// @description :获取工序名称集合
		(function loadWorkstage() {
			$.ajax({
				type: "POST",
				async: false,
				dataType: "json",
		　　 xhrFields: {
						withCredentials: true
				},
				crossDomain: true,
				data:{
					type:"vague",
					status:0,
					headNum:1
				},
				url: queryWorkstageBasicsUrl,
				success: function (result, status, xhr) {
					if (result.status === 0) {
						workstageList = result.map.workstageBasicsList
					}
					else {
						// swallFail();	//操作失败
					}
				}

			})
		}());

		function createWorkstageListSelect(target) {
			target.empty()
			target.append(`<option value="">选择工序</option>`);

			for (let i = 0, len = workstageList.length; i < len; i++) {
				//设备类型id作为value,名称作为text
				let optionStr = `<option value="${workstageList[i].workstage_basics_id}">${workstageList[i].workstage_name}</option>`;
				target.append(optionStr);
			}

		}
		// @description :获取生产车间集合
		(function loadWorkshop() {
			$.ajax({
				type: "POST",
				async: false,
				dataType: "json",
		　　 xhrFields: {
						withCredentials: true
				},
				crossDomain: true,
				data:{
					type:"info"
				},
				url: queryWorkshopsUrl,
				success: function (result, status, xhr) {
					if (result.status === 0) {
						workshop = result.map.workshopInfos
					}
					else {
						// swallFail();	//操作失败
					}
				}

			})
		}());

		function createWorkshopListSelect(target) {
			target.empty()
			target.append(`<option value="">选择车间</option>`);

			for (let i = 0, len = workshop.length; i < len; i++) {
				//设备类型id作为value,名称作为text
				let optionStr = `<option value="${workshop[i].role_workshop_id}">${workshop[i].role_workshop_name}</option>`;
				target.append(optionStr);
			}

		}
	
	leftNavLink.on('click', function (event) {
		let targetHref = event.currentTarget.getAttribute('href'),
		classAttr = event.currentTarget.getAttribute('class');

		 USERNAME  = "张三"
		 USERID = "eafbdeecabb14446a31d75d223586dfc"

		clearInterval(timer);	// 清除定时器，切换到其它页时清除，不然定时器会一直运行

		switch (targetHref) {
			case '#productionpProcessManage'://生产过程管理
				(function (){
					let activeSwiper = $('#productionpProcessManage'), // 右侧外部swiper
						activeSubSwiper = $('#productionpProcessManageInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工艺基础信息
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						workStageOption = activeSubSwiper.find('.work-stage-option'), // 工序集合
						productionWorkshopOption = activeSubSwiper.find('.Production-workshop-option'), // 车间集合
						fuzzySearchGroup = activeSubSwiper.find('.fuzzy-search-group'),// 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						});
						//创建设备类型下拉选
						createWorkstageListSelect(workStageOption);
						createWorkshopListSelect(productionWorkshopOption);

						
						// 主表格添加内容
						function addTableData(url, data) {
							$.ajax({
								type: "POST",
								url: url,
								dataType: "json",
						　　 xhrFields: {
										withCredentials: true
								},
								crossDomain: true,
								data: data,
								beforeSend: function (xml) {
									mesloadBox.loadingShow()
								},
								success: function (result, status, xhr) {
								
									mesloadBox.hide()
									if (result.status === 0) {
										paginationContainer.show()
										mesVerticalTableAddData(activePanel, {
											thead: {
												theadContent: '序号/工单号/生产批号/工序/计划生产数量/目前生产数量/预定完成日期/生产优先级/生产状态/操作',
												theadWidth: '3%/12%/10%/3%/6%/6%/6%/5%/5%/34%'
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
													'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#picking"><i class="fa fa-tasks fa-fw"></i>领料</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#Feeding"><i class="fa fa-tasks fa-fw"></i>补料</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#return"><i class="fa fa-tasks fa-fw"></i>退料</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#allot"><i class="fa fa-tasks fa-fw"></i>调批</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#outputManage"><i class="fa fa-tasks fa-fw"></i>产出物管理</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#BatchTransfer"><i class="fa fa-tasks fa-fw"></i>批次转出</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#scrap"><i class="fa fa-tasks fa-fw"></i>报废登记</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#rejects"><i class="fa fa-tasks fa-fw"></i>不良品登记</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#barCodes"><i class="fa fa-tasks fa-fw"></i>统计</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													tbodyTarget.empty() // 清空表格主体
													let map = result.map, // 映射zszs
														dataList = map.workOrders, // 主要数据列表
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
																	tempData = dataList[currentTr.index()].work_order_number;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 2: {
																	tempData = dataList[currentTr.index()].plan.production_plan_batch_number;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 3: {
																	tempData = dataList[currentTr.index()].planQuotesWorkstage.workstage_name;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 4: {
																	tempData = dataList[currentTr.index()].work_order_expected_output;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 5: {
																	tempData = dataList[currentTr.index()].work_order_actual_output;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 6: {
																	tempData = dataList[currentTr.index()].work_order_estimated_completion_time;
																	currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																}
																	break;
																case 7: {
																	tempData = dataList[currentTr.index()].plan.production_plan_production_priority;//优先级
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 8: {
																  tempData = dataList[currentTr.index()].workOrderStatus.plan_production_status;
                                  if(tempData ==0){
                                    currentTr.children().eq(i).html("未生产")
                                  }else if(tempData ==1){
                                    currentTr.children().eq(i).html("生产中")
                                  }
                                  else if(tempData ==2){
                                    currentTr.children().eq(i).html("已暂停")
                                  }
                                  else if(tempData ==3){
                                    currentTr.children().eq(i).html("生产完成")
                                  }
                                  else if(tempData ==4){
                                    currentTr.children().eq(i).html("停止生产")
                                  }else if(tempData ==5){
																		currentTr.children().eq(i).html("等待生产")
																	}
																}
																	break;
																case 9:
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		workOrderId = dataList[currentTr.index()].work_order_id,
																		planId = dataList[currentTr.index()].production_plan_id,
																		workOrderNumber = dataList[currentTr.index()].work_order_number,
																		workOrderRes = dataList[currentTr.index()].work_order_responsible,
																		workOrderResId = dataList[currentTr.index()].work_order_responsible_id,
																		productElementBatchs = dataList[currentTr.index()].plan.production_plan_batch_number;//生产批号
																		productLine= dataList[currentTr.index()].plan.product_line_name;//生产线
																		priority= dataList[currentTr.index()].plan.production_plan_production_priority;//优先级
																		semiFinishId = dataList[currentTr.index()].planQuotesWorkstage.semi_finish_id,
																		semiFinishName = dataList[currentTr.index()].planQuotesWorkstage.semi_finish_name,
																		semiFinishTypeName = dataList[currentTr.index()].planQuotesWorkstage.semi_finish_type_name,
																		semiFinishTypeId = dataList[currentTr.index()].planQuotesWorkstage.semi_finish_type_id,
																		semiFinishGenre = dataList[currentTr.index()].planQuotesWorkstage.semi_finish_genre,
																		semiFinishUnit = dataList[currentTr.index()].planQuotesWorkstage.semi_finish_unit
																		switch (dataContent) {
																			case '#picking': {	//领料
																				let dataContent = $('#materielMangeModel'),
																				panelList = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				panelThead = panelList.find('thead'),
																				panelTbody = panelList.find('tbody'),
																				paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																				statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																				fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
																				headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																				headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																				headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3

																				dataContent.find('.modal-title').text('领料管理') // 更换panel标题
																				
																				dataContent.modal({
																					backdrop: false, // 黑色遮罩不可点击
																					keyboard: false,  // esc按键不可弃用模态框s
																					show: false
																				})
																				dataContent.modal('show') // 运行时显示
																				panelThead.empty()
																				panelTbody.empty()

																				headingMainBtn_1.text("创建领料单")
																				headingMainBtn_2.text("领料统计")
																				headingMainBtn_1.show()
																				headingMainBtn_2.show()
																				headingMainBtn_3.hide()
																				statusTypeOption.show()
																				fuzzySearchGroup.show()

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																				　　 xhrFields: {
																								withCredentials: true
																						},
																						crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							paginationContainer.show()
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							// ajax成功
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/领料批号/物料出库批号/创建时间/领料时间/领料人/操作',
																										theadWidth: '6%/15%/15%/15%/15%/10%/18%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td class="table-input-td"></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射zszs
																												dataList = map.materialRequisitions, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].material_management_batch;
																															// tempData=
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].material_management_outofstorage_batch;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].material_management_creation_time;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].material_management_date;
																															if(tempData =null){
																																currentTr.children().eq(i).html()
																															}else{
																																currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																															}
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].material_management_custodian;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																													
																														case 6:
																															tempData = dataList[currentTr.index()].material_management_complete_status;
																															console.log(tempData)
																															if(tempData == 0){
																																// currentTr.children().eq(i).find("a:first-child").html(`<i class="fa fa-tasks fa-fw"></i>查看领料详情`)
																																currentTr.children().eq(i).html(`<a class="table-link" href="javascript:;" data-toggle-modal-target="#materielDetail"><i class="fa fa-tasks fa-fw"></i>查看领料详情</a>`)
																															}else if(tempData == 1){
																																// currentTr.children().eq(i).find("a:first-child").html(`<i class="fa fa-tasks fa-fw"></i>补充领料详情`)
																																currentTr.children().eq(i).html(`<a class="table-link" href="javascript:;" data-toggle-modal-target="#addMaterielDetail"><i class="fa fa-tasks fa-fw"></i>补充领料信息</a><a class="table-link" href="javascript:;" data-toggle-btn="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a>`)
																																// currentTr.children().eq(i).append(`<a class="table-link" href="javascript:;" data-toggle-btn="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a>`)
																															}

																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent3 = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																materialRequisitionId = dataList[currentTr.index()].material_management_id;
																																switch (dataContent3) {
																																	case '#materielDetail': {	//领料详情
																																			let dataContent2 = $('#materielDetail'),
																																			panelList = dataContent2.find('.panel'),
																																			panel_1 = panelList.eq(0)
																																			panel_2 = panelList.eq(1)
																																			modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																																			modalSubmitBtn = dataContent2.find('.modal-submit')
																																			modalSubmitBtn_2 = dataContent2.find('.modal-submit2')
																																			panelThead = panelList.find('thead'),
																																			panelTbody = panelList.find('tbody'),
																																			barCodeText = 	panel_1.find('.panel-heading').find('.barCode')
															
																																			dataContent2.find('.modal-header').find('.modal-title').text('领料详情') // 更换panel标题
																																			panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																																			panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																																			// 主表格1添加内容，基础信息部分
																																			dataContent2.modal({
																																				backdrop: false, // 黑色遮罩不可点击
																																				keyboard: false,  // esc按键不可弃用模态框
																																				show: false
																																			})
																																			dataContent2.modal('show') // 运行时显示
																																			modalSubmitBtn.hide()
																																			modalSubmitBtn_2.hide()
																																			dataContent2.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																				$('body').addClass('modal-open')
																																			})
																																	
																																			modalCloseBtn.off('click').on('click', (event) => {
																																				// 点击弃用按钮隐藏该模态框
																																				dataContent2.modal('hide')
																																				// 初始化表格
																																				panel_2.find('thead').empty()
																																				panel_2.find('tbody').empty()
																																			})
															
																																			// 主表格添加内容
																																			function addTableData(url, data) {
																																				$.ajax({
																																					type: "POST",
																																					url: url,
																																					dataType: "json",
																																			　　 xhrFields: {
																																							withCredentials: true
																																					},
																																					crossDomain: true,
																																					data: data,
																																					beforeSend: function (xml) {
																																						// ajax发送前
																																						mesloadBox.loadingShow()
																																					},
																																					success: function (result, status, xhr) {
																																						// ajax成功
																																						mesloadBox.hide()
																																						if (result.status === 0) {
																																							mesHorizontalTableAddData(panel_1.find('table'), null, {
																																								thead: '领料批号/领料人/领料时间/领料仓库/生产批号/工单号/工单负责人/生产线/生产优先级/创建人/创建时间/完成时间/领料说明',
																																								tableWitch: '2%/3%/10%',
																																								viewColGroup: 3,
																																								importStaticData: (tbodyTd, length) => {
																																									let map = result.map, // 映射
																																									dataList = map.materialRequisition[0][0], // 主要数据列表
																																									tempData = null; // 表格td内的临时数据\

																																									barCodeText.val("NO:" +  dataList.material_management_outofstorage_batch).attr("readonly",true)
																																									for (let i = 0, len = length; i < len; i++){
																																										switch (i) {																								
																																											case 0: {
																																												tempData = dataList.material_management_batch;
																																												tbodyTd.eq(i).html(tempData)
																																											}
																																												break;
																																											case 1: {
																																												tempData = dataList.material_management_custodian;
																																												tbodyTd.eq(i).html(tempData)
																																											}
																																												break;
																																											case 2: {
																																												tempData = dataList.material_management_date;
																																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																																											}
																																												break;
																																											case 3: {
																																												tempData = dataList.warehouse_name;
																																												tbodyTd.eq(i).html(tempData)
																																											}
																																												break;
																																											case 4: {
																																												// tempData = dataList[0].craft_name;
																																												tbodyTd.eq(i).html(productElementBatchs)
																																											}
																																												break;
																																											case 5: {
																																												// tempData = dataList[0].craft_name;
																																												tbodyTd.eq(i).html(workOrderNumber)
																																											}
																																												break;
																																											case 6: {
																																												// tempData = dataList[0].craft_name;
																																												tbodyTd.eq(i).html(workOrderRes)
																																											}
																																												break;
																																											case 7: {
																																												// tempData = dataList[0].craft_name;
																																												tbodyTd.eq(i).html(productLine)
																																											}
																																												break;
																																											case 8: {
																																												// tempData = dataList[0].craft_name;
																																												tbodyTd.eq(i).html(priority)
																																											}
																																												break;
																																											case 9: {
																																												tempData = dataList.material_management_creation_staff;
																																												tbodyTd.eq(i).html(tempData)
																																											}
																																												break;
																																											case 10: {
																																												tempData = dataList.material_management_creation_time;
																																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																											}
																																												break;
																																											case 11: {
																																												tempData = dataList.material_management_completion_time;
																																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																											}
																																												break;
																																											case 12: {
																																												tempData = dataList.material_management_supervise_explain;
																																												tbodyTd.eq(i).html(tempData)
																																											}
																																												break;
																																											default:
																																												break;
																																										}
																																									}
																																								}
																																							});

																																							mesVerticalTableAddData(panel_2, {
																																								thead: {
																																									theadContent: '序号/物料名称/物料规格/物料型号/单位/供应商/共需数量/领料数量/实领数量/物料编号/备注',
																																									theadWidth: '6%/10%/10%/10%/8%/10%/8%/8%/8%/8%/6%'
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
																																										'<td></td>',
																																										'<td></td>'
																																									],
																
																																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																									dataAddress: function (tbodyTarget, html, result) {
																																										tbodyTarget.empty() // 清空表格主体
																																										let map = result.map, // 映射zszs
																																										dataList = map.materialRequisition[1], // 主要数据列表
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
																																														tempData = dataList[currentTr.index()].warehouse_material_name;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 2: {
																																														tempData = dataList[currentTr.index()].warehouse_material_standard;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 3: {
																																														tempData = dataList[currentTr.index()].warehouse_material_model;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 4: {
																																														tempData = dataList[currentTr.index()].warehouse_material_units;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 5: {
																																														tempData = dataList[currentTr.index()].supplier_name;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 6: {
																																														tempData = dataList[currentTr.index()].plan_required_amount;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 7: {
																																														tempData = dataList[currentTr.index()].plan_quantity_required;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 8: {
																																														tempData = dataList[currentTr.index()].plan_get_number;
																																														currentTr.children().eq(i).html(tempData)
																																													}
																																														break;
																																													case 9: {
																																														tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																														currentTr.children().eq(i).addClass("table-input-td")
																																														currentTr.children().eq(i).html(tempData)
																																														materialId = dataList[currentTr.index()].plan_quotes_material_id;
			
																																														currentTr.children().eq(i).off("click").on("click","a", function(){
																																															let dataContent = $('#publicSelectModalBox'),
																																															panelModal1 = dataContent.find('.panel'),
																																															modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																															statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																															fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																															paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																															activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																															panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																															// ProductTypeList = [],
																																															mesloadBox = new MesloadBox(panelModal1, {
																																																// 主数据载入窗口
																																																warningContent: '没有此类信息，请重新选择或输入'
																																															});
			
																																															dataContent.modal({
																																																backdrop: false, // 黑色遮罩不可点击
																																																keyboard: false,  // esc按键不可弃用模态框
																																																show: false
																																															})
																																															dataContent.modal("show")
																																							
																																															panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																															dataContent.find(".panel-title").text("编号详情")
																																														
																																															statusOption.hide()
																																															fuzzySearchGroup.hide()
			
																																															modalCloseBtn.off('click').on('click', (event) => {
																																																// 点击弃用按钮隐藏该模态框
																																																dataContent.modal('hide')
																																																panelModal1.find('thead').empty()
																																																panelModal1.find('tbody').empty()
																																																// 初始化表格
																																															
																																															})
																																														
																																															// 模态框表格增加内容
																																															function addModalTableData(url, data) {
																																																$.ajax({
																																																	type: "POST",
																																																	dataType: "json",
																																															　　 xhrFields: {
																																																			withCredentials: true
																																																	},
																																																	crossDomain: true,
																																																	url: url,
																																																	data: data,
																																																	beforeSend: function (xml) {
																																																		// ajax发送前
																																																		mesloadBox.loadingShow()
																																																	},
																																																	success: function (result, status, xhr) {
																																																		// ajax成功
																																																		mesloadBox.hide()
																																																		paginationContainer.show()	//隐藏分页按钮
																																																		if (result.status === 0) {
																																							
																																																			mesVerticalTableAddData(panelModal1, {
																																																				thead: {
																																																					theadContent: '序号/物料编号/编号类型',
																																																					theadWidth: '8%/40%/10%'
																																																				},
																																																				tbody: {
																																																					html: [
																																																						'<td></td>',
																																																						'<td></td>',
																																																						'<td></td>'
																																																					],
																																							
																																																					// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																					dataAddress: function (tbodyTarget, html, result) {
																																																						let map = result.map, // 映射
																																																							dataList = result.map.materialNumbers, // 主要数据列表
																																																							tempData = ''; // 表格td内的临时数据
																																																							tbodyTarget.empty() // 清空表格主体
																																								
																																								
																																																						for (let i = 0, len = dataList.length; i < len; i++) {
																																																							tbodyTarget.append('<tr></tr>'); // 添加行
																																																							let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																							for (let i = 0, len = html.length; i< len; i++) {
																																																								currentTr.append(html[i]); // 添加表格内的HTML
																																																								switch (i) {
																																																									case 0:
																																																										currentTr.children().eq(i).html(currentTr.index() + 1)
																																																										break;
																																																									case 1: {
																																																										tempData = dataList[currentTr.index()].number_number
																																																										currentTr.children().eq(i).html(tempData)
																																																									}
																																																										break;
																																																									case 2: {
																																																										tempData = dataList[currentTr.index()].number_number_type
																																																										currentTr.children().eq(i).html(tempData)
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
																																																					displayRow: result.map.materialNumbers.length// 显示行数
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
			
																																													
																																															addModalTableData(queryMaterialRequisitionBindingMaterialNumberUrl, {
																																																materialId: materialId,
																																																headNum: 1,
																																															});
																																														})
																																													}
																																														break;
																																													case 10: {
																																														tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																														currentTr.children().eq(i).html(tempData)
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
																																									totalRow:result.map.materialRequisition[1].length, // 总行数
																																									displayRow: result.map.materialRequisition[1].length // 显示行数
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
																																			addTableData(queryMaterialRequisitionParticularsUrl, {
																																				materialRequisitionId:materialRequisitionId,
																																				statua:1
																																			});
																															
																																		
																																		break;
																																	}
																																	case '#addMaterielDetail': {	//补充领料信息
																																		let dataContent5 = $('#materielDetail'),
																																			panelList = dataContent5.find('.panel'),
																																			panel_1 = panelList.eq(0)
																																			panel_2 = panelList.eq(1)
																																			modalCloseBtn = dataContent5.find('.modal-header').find('.close'),
																																			modalSubmitBtn = dataContent5.find('.modal-submit')
																																			modalSubmitBtn_2 = dataContent5.find('.modal-submit2')
																																			panelThead = panelList.find('thead'),
																																			panelTbody = panelList.find('tbody'),
																																			barCodeText = 	panel_1.find('.panel-heading').find('.barCode'),
																																			req = {
																																				material_management_id:"",//管理单id
																																				work_order_id:"",
																																				material_management_outofstorage_batch:"",//物料 出入库批号
																																				//material_management_batch:"",//管理单批号
																																				material_management_date:"",//领料时间
																																				warehouse_id:"",//仓库id
																																				warehouse_name:"",//仓库
																																				material_management_supervise_explain:"",//管理说明
																																				material_management_creation_staff:"",//创建人
																																				material_management_creation_staff_id:"",//创建人id
																																				material_management_complete_status:""
																																			}
																																			req.material_management_creation_staff = USERNAME
																																			req.material_management_creation_staff_id = USERID
																																			
																																			barCodeText.show()
																																			barCodeText.removeAttr("readonly").val("").attr("placeholder","补充领料出库批次号")
																																			dataContent5.find('.modal-header').find('.modal-title').text('领料详情') // 更换panel标题
																																			panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																																			panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																																			// 主表格1添加内容，基础信息部分
																																			dataContent5.modal({
																																				backdrop: false, // 黑色遮罩不可点击
																																				keyboard: false,  // esc按键不可弃用模态框
																																				show: false
																																			})
																																			dataContent5.modal('show') // 运行时显示
																																			modalSubmitBtn.show()
																																			modalSubmitBtn_2.show()

																																			dataContent5.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																				$('body').addClass('modal-open')
																																			})
																																	
																																			modalCloseBtn.off('click').on('click', (event) => {
																																				// 点击弃用按钮隐藏该模态框
																																				dataContent5.modal('hide')
																																				// 初始化表格
																																				panel_2.find('thead').empty()
																																				panel_2.find('tbody').empty()
																																			})

																																		
																																			barCodeText.off('blur').on('blur', (event) => {
																																				req.material_management_outofstorage_batch =panel_1.find('.panel-heading').find("input").val()
																																			})
															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																		　　 xhrFields: {
																																						withCredentials: true
																																				},
																																				crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panel_1.find('table'), null, {
																																							thead: '领料批号/领料人/领料时间/领料仓库/生产批号/工单号/工单负责人/生产线/生产优先级/创建人/创建时间/完成时间/领料说明',
																																							tableWitch: '2%/3%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.materialRequisition[0][0], // 主要数据列表
																																								tempData = null; // 表格td内的临时数据\
																																								req.material_management_id= dataList.material_management_id
																																								let  code= dataList.material_management_outofstorage_batch
																																								req.work_order_id= workOrderId
																																								if(code!==""&&code!==null){
																																									barCodeText.val(code).attr("readonly",false)
																																								}
																																							
																																								for (let i = 0, len = length; i < len; i++){
																																									switch (i) {																								
																																										case 0: {
																																											tempData = dataList.material_management_batch;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 1: {
																																											tempData = dataList.material_management_custodian;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList.material_management_date;
																																											req.material_management_date = moment(tempData).format('YYYY-MM-DD')
																																											let inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"/>`;
																																											tbodyTd.eq(i).addClass('table-input-td table-link ')
																																											tbodyTd.eq(i).html(inputHtml)
																																											tbodyTd.eq(i).find("input").val(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))

																																											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																																												req.material_management_date = tbodyTd.eq(i).find('input').val()
																																											})
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList.warehouse_name;
																																											let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																																											tbodyTd.eq(i).addClass('table-input-td')
																																											tbodyTd.eq(i).html(inputHtml)
																																											tbodyTd.eq(i).find('input').val(tempData)
																																											req.warehouse_id = dataList.warehouse_id;
																																											req.warehouse_name = dataList.warehouse_name;
																																
																																											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																																												let promise = new Promise(function (resolve, reject) {
																																													selectWarehousesAddData(resolve)
																																												});
																																												promise.then(function (resolveData) {
																																													tbodyTd.eq(i).find('input').val(resolveData.warehouseName)
																																													 req.warehouse_id = resolveData.warehouseID
																																													 req.warehouse_name = resolveData.warehouseName
																																												})
																																
																																												$(this).prop('readonly', true) // 输入框只读
																																												$(this).off('blur').on('blur', () => {
																																													$(this).removeProp('readonly') // 输入移除框只读
																																												})
																																											})
																																										}
																																											break;
																																										case 4: {
																																											tbodyTd.eq(i).html(productElementBatchs)
																																										}
																																											break;
																																										case 5: {
																																											tbodyTd.eq(i).html(workOrderNumber)
																																										}
																																											break;
																																										case 6: {
																																											tbodyTd.eq(i).html(workOrderRes)
																																										}
																																											break;
																																										case 7: {
																																											tbodyTd.eq(i).html(productLine)
																																										}
																																											break;
																																										case 8: {
																																											tbodyTd.eq(i).html(priority)
																																										}
																																											break;
																																										case 9: {
																																											tempData = dataList.material_management_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 10: {
																																											tempData = dataList.material_management_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 11: {
																																											tempData = dataList.material_management_completion_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 12: {
																																											tempData = dataList.material_management_supervise_explain;
																																											let inputHtml = `<input type="text" class="table-input" placeholder="" />`;
																																											tbodyTd.eq(i).addClass('table-input-td table-link ')
																																											tbodyTd.eq(i).html(inputHtml)
																																											tbodyTd.eq(i).find("input").val(tempData)
																																											req.material_management_supervise_explain = dataList.material_management_supervise_explain;

																																											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																																												req.material_management_supervise_explain = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																																											})
																																										}
																																											break;
																																										default:
																																											break;
																																									}
																																								}
																																							}
																																						});

																																						mesVerticalTableAddData(panel_2, {
																																							thead: {
																																								theadContent: '序号/物料名称/物料规格/物料型号/单位/供应商/共需数量/领料数量/实领数量/物料编号/备注',
																																								theadWidth: '6%/10%/10%/10%/8%/10%/8%/8%/8%/10%/6%'
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
																																									'<td></td>',
																																									'<td></td>'
																																								],
															
																																								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																								dataAddress: function (tbodyTarget, html, result) {
																																									tbodyTarget.empty() // 清空表格主体
																																									let map = result.map, // 映射zszs
																																									dataList = map.materialRequisition[1], // 主要数据列表
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
																																													tempData = dataList[currentTr.index()].warehouse_material_name;
																																													let planMaterId = dataList[currentTr.index()].plan_quotes_material_id;
																																													let planKeyId = dataList[currentTr.index()].plan_foreign_key_id;
																																													let basicMaterId = dataList[currentTr.index()].craft_bom_material_id;
																																													currentTr.children().eq(i).html(tempData)
																																													currentTr.children().eq(i).attr("planMaterId",planMaterId)
																																													currentTr.children().eq(i).attr("planKeyId",planKeyId)
																																													currentTr.children().eq(i).attr("basicMaterId",basicMaterId)
																																												}
																																													break;
																																												case 2: {
																																													tempData = dataList[currentTr.index()].warehouse_material_model;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 3: {
																																													tempData = dataList[currentTr.index()].warehouse_material_standard;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 4: {
																																													tempData = dataList[currentTr.index()].warehouse_material_units;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 5: {
																																													tempData = dataList[currentTr.index()].supplier_name;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 6: {
																																													tempData = dataList[currentTr.index()].plan_required_amount;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 7: {
																																													tempData = dataList[currentTr.index()].plan_quantity_required;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 8: {
																																													tempData = dataList[currentTr.index()].plan_get_number;
																																													let	inputHtml = `<input type="text" class="table-input" placeholder="" autocomplete="on" />`
																																													currentTr.children().eq(i).addClass('table-input-td')
																																													currentTr.children().eq(i).html(inputHtml)
																																													currentTr.children().eq(i).find("input").val(tempData)
																																												}
																																													break;
																																												case 9: {
																																													tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>绑定编号</a>`
																																													currentTr.children().eq(i).addClass("table-input-td")
																																													currentTr.children().eq(i).html(tempData)
																																													materialId = dataList[currentTr.index()].craft_bom_material_id;


																																													// 添加编号
																																													currentTr.children().eq(i).off("click").on("click","a", function(){
																																														let dataContent2 = $('#addCode'),
																																														panelList = dataContent2.find('.panel'),
																																														panelTbody = panelList.find('table tbody'),	// 面板表格
																																														modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																																														headBtn = dataContent2.find('.head-main-btn-1'),
																																														modalSubmitBtn = dataContent2.find('.modal-submit'),
																																														codeList=[]

																																													
																																														dataContent2.modal('show') // 运行时显示
																																														dataContent2.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																															$('body').addClass('modal-open')
																																														})

																																														modalCloseBtn.off('click').on('click', (event) => {
																																															// 点击弃用按钮隐藏该模态框
																																															dataContent2.modal('hide')
																																															// 初始化表格
																																															panelList.find('thead').empty()
																																															panelList.find('tbody').empty()
																																														})
																																														if(codeList.length!==0){
																																															let html=""
																																															for(var i=0;i<codeList.length;i++){
																																																html+=`
																																																<tr>
																																																	<td >${i+1}</td>
																																																	<td class="table-input-td">
																																																		<input type="text" class="table-input projectPrincipal" value=${codeList[i]} >
																																																	</td>
																																																	<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																																																</tr>
																																																`
																																															}
																																															panelTbody.append(html)
																																														}else{
																																															headBtn.trigger('click')
																																														}


																																														headBtn.off('click').on('click', (event) => {
																																															let temStr = `
																																																<tr>
																																																		<td ></td>
																																																		<td class="table-input-td">
																																																			<input type="text" class="table-input projectPrincipal" placeholder="请输入编号" />
																																																		</td>
																																																		<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																																																</tr>
																																																`;
																																															panelTbody.append(temStr)
																									
																																															let  tr=panelList.find('tbody tr');
																																															for(let i = 0;i<tr.length;i++){
																																																panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																																																;
																																															}
																									
																																															panelList.on('click', '.delete', function () {
																																																$(this).closest('tr').remove();  //移除该行元素
																																																for(let i = 0;i<tr.length;i++){
																																																	panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																																																	;
																																																}
																																															})
																																														})

																																														modalSubmitBtn.off('click').on('click', (event) => {
																																															let codeListPanel = panelTbody.find('tr')
																																															for(let i = 0;i<codeListPanel.length;i++){
																																																let temp = codeListPanel.eq(i).find('td:nth-child(2)').find("input").val()
																																																codeList[i] = temp
																																															}
																																															if (codeList.length!==0
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
																																																		type: "POST",
																																																		url: saveMaterialRequisitionBindingMaterialNumberUrl,
																																																		dataType: "json",
																																																　　 xhrFields: {
																																																				withCredentials: true
																																																		},
																																																		crossDomain: true,
																																																		data:{
																																																			materialId:materialId,
																																																			bindingMaterialNumberIds:codeList
																																																		},
																																																		success: function (result, status, xhr) {
																																																			if (result.status === 0) {
																																																				swallSuccess(modalCloseBtn)	//操作成功提示并刷新页面
																																																			}else {
																																																				swallFail();	//操作失败
																																																			}
																																																		},
																									
																																																	})
																																																	//modalCloseBtn.trigger('click')
																																																});
																																															}
																																															else {
																																																swallError();	//格式不正确
																																															}
																																														})		
																																														
																																													})
																																												}
																																													break;
																																												case 10: {
																																													tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																													currentTr.children().eq(i).html(tempData)
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
																																								totalRow: result.map.materialRequisition[1].length, // 总行数
																																								displayRow: result.map.materialRequisition[1].length // 显示行数
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
																																		addTableData(queryMaterialRequisitionParticularsUrl, {
																																			materialRequisitionId:materialRequisitionId
																																		});

																																		modalSubmitBtn.off("click").on("click",(event) =>{
																																			let tr_2 = panel_2.find('tbody tr');
																																			let craftBomDetails=[]
																																			
																																			for(var i=0; i<tr_2.length;i++){
																																				let req2={
																																					plan_quotes_material_id:"",//
																																					plan_foreign_key_id:"",
																																					craft_bom_material_id:"",
																																					plan_get_number:""
																																				
																																				}
																																				req2.plan_quotes_material_id = tr_2.eq(i).find("td").eq(1).attr("planMaterId")
																																				req2.plan_foreign_key_id = tr_2.eq(i).find("td").eq(1).attr("planKeyId")
																																				req2.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("basicMaterId")
																																				req2.plan_get_number = tr_2.eq(i).find("td").eq(8).find("input").val()
																																				
																																				craftBomDetails.push(req2)
																																			}
																																			let  req3 , craftBomDetails2
																																			req3=JSON.stringify(req)
																																			craftBomDetails2=JSON.stringify(craftBomDetails)
																																			if (true
																																			) {
																																				swal({
																																					title: '您确定要保存本次操作吗?',
																																					text: '请确保填写信息无误后点击保存按钮',
																																					type: 'question',
																																					allowEscapeKey: false, // 用户按esc键不退出
																																					allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																																					showCancelButton: true, // 显示用户取消按钮
																																					confirmButtonText: '确定',
																																					cancelButtonText: '取消',
																																				}).then(function () {
																																					$.ajax({
																																						type: "POST",
																																						url: modifyMaterialRequisitionUrl,
																																						dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																						data: {
																																							materialRequisition:req3,
																																							planUseMaterials:craftBomDetails2
																																						},
																																						success: function (result, status, xhr) {
																																							if (result.status === 0) {
																																								let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																									swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																																							}else if(result.status===1){
																																								typeDifference() 
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


																																		modalSubmitBtn_2.off("click").on("click",(event) =>{
																																			let tr_2 = panel_2.find('tbody tr');
																																			let craftBomDetails=[]
																																			
																																			for(var i=0; i<tr_2.length;i++){
																																				let req2={
																																					plan_quotes_material_id:"",//
																																					plan_foreign_key_id:"",
																																					craft_bom_material_id:"",
																																					plan_get_number:""
																																				
																																				}
																																				req2.plan_quotes_material_id = tr_2.eq(i).find("td").eq(1).attr("planMaterId")
																																				req2.plan_foreign_key_id = tr_2.eq(i).find("td").eq(1).attr("planKeyId")
																																				req2.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("basicMaterId")
																																				req2.plan_get_number = tr_2.eq(i).find("td").eq(8).find("input").val()
																																				
																																				craftBomDetails.push(req2)
																																			}
																																			let  req3 , craftBomDetails2
																																			req.material_management_complete_status = 0
																																			req3=JSON.stringify(req)
																																			craftBomDetails2=JSON.stringify(craftBomDetails)
																																			if (	req.material_management_outofstorage_batch!==""&&	req.material_management_outofstorage_batch!==null
																																			) {
																																				swal({
																																					title: '您确定要完成领料信息吗?',
																																					text: '完成领料信息后不可修改',
																																					type: 'question',
																																					allowEscapeKey: false, // 用户按esc键不退出
																																					allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																																					showCancelButton: true, // 显示用户取消按钮
																																					confirmButtonText: '确定',
																																					cancelButtonText: '取消',
																																				}).then(function () {
																																					$.ajax({
																																						type: "POST",
																																						url: modifyMaterialRequisitionUrl,
																																						dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																						data: {
																																							materialRequisition:req3,
																																							planUseMaterials:craftBomDetails2
																																						},
																																						success: function (result, status, xhr) {
																																							if (result.status === 0) {
																																								let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																								swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																																							}else if(result.status===1){
																																								typeDifference() 
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
																																	case '#delete' :{
																																		swal({
																																			title: '您确定要删除吗？',
																																			type: 'question',
																																			showCancelButton: true,
																																			confirmButtonText: '确定',
																																			cancelButtonText: '取消'
																																		}).then(function (){
																																			$.ajax({
																																				type: "POST",
																																				url:removeMaterialRequisitionUrl,
																																				dataType: "json",
																																		　　 xhrFields: {
																																						withCredentials: true
																																				},
																																				crossDomain: true,
																																				data: {
																																					materialRequisitionId:materialRequisitionId,
																																				},
																																				success: function (result, status, xhr) {
																																					if (result.status === 0) {
																																						let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																																					}else {
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
																																				},
																																			})
																																		})
																																		break;
																																	}
															
															
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
																										displayRow: result.map.materialRequisitions.length // 显示行数
																								
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
																				addTableData(queryMaterialRequisitionOutlineUrl, {
																					workOrderId:workOrderId,
																					status:1,
																					headNum:1
																				});

																				// 下拉选事件
																				statusTypeOption.off("change").on("change",function(){
																					let status = $(this).val();
																					let val = fuzzySearchGroup.closest('.input-group').find('input').val()
																					addTableData(queryMaterialRequisitionOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						status:status,
																						headNum:1
																					});
																				})
																				// 模糊搜索
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					let val = $(this).closest('.input-group').find('input').val()
																					let status = statusTypeOption.val();
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryMaterialRequisitionOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						status:status,
																						headNum:1
																					});
																				});
																				// 按钮1  创建新的领料单
																				headingMainBtn_1.off("click").on("click",(event)=>{
																					let dataContent1 = $('#CreateRequisitions'),
																					panelList = dataContent1.find('.panel'),
																					panel_1 = panelList.eq(0)
																					panel_2 = panelList.eq(1)
																					panel_3 = panelList.eq(2)
																					modalCloseBtn = dataContent1.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent1.find('.modal-submit')
																					modalSubmitBtn_2 = dataContent1.find('.modal-submit2')
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					barCodeText = 	panel_1.find('.panel-heading').find('.barCode'),
																					req = {
																						material_management_batch:"",//管理单批号
																						material_management_custodian:"",//管理人
																						material_management_custodian_id:"",//管理人
																						warehouse_id:"",//仓库id
																						warehouse_name:"",//仓库
																						material_management_supervise_explain:"",//管理说明
																						material_management_creation_staff:"",//创建人
																						material_management_creation_staff_id:"",//创建人id
																					}

																					req.material_management_creation_staff=USERNAME
																					req.material_management_creation_staff_id=USERID

																					barCodeText.attr("placeholder","物料出入库批号录入").attr("readonly",true)

																					dataContent1.find('.modal-header').find('.modal-title').text('添加领料') // 更换panel标题
																					panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																					panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题
																					panel_3.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																					// 主表格1添加内容，基础信息部分
																					dataContent1.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent1.modal('show') // 运行时显示
																					barCodeText.show()
																					dataContent1.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent1.modal('hide')
																						// 初始化表格
																						panel_2.find('thead').empty()
																						panel_2.find('tbody').empty()
																						panel_3.find('tbody').empty()
																					})

																					//表格 1 录入
																					mesHorizontalTableAddData(panel_1.find('table'), null, {
																						thead: '领料批号/领料人/领料时间/领料仓库/生产批号/工单号/工单负责人/生产线/生产优先级/领料说明',
																						tableWitch: '3%/3%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							for (let i = 0, len = length; i < len; i++){
																								switch (i) {																								
																									case 0: {
																										$.ajax({
																											type: "POST",
																											url: generateProcessManageBatchNumberUrl,
																											dataType: "json",
																									　　 xhrFields: {
																													withCredentials: true
																											},
																											crossDomain: true,
																											data:{
																												type:"pick",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number = result.data
																													tbodyTd.eq(i).html(number)
																													req.material_management_batch = number

																												}
																											}
																										})
																									}
																										break;
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												 req.material_management_custodian_id = resolveData.roleStaffId
																												 req.material_management_custodian = resolveData.roleStaffName
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																									}
																										break;
																									case 2: {
																									
																									}
																										break;
																									case 3: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											
																											let promise = new Promise(function (resolve, reject) {
																												selectWarehousesAddData(resolve)
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.warehouseName)
																												req.warehouse_id = resolveData.warehouseID
																												req.warehouse_name = resolveData.warehouseName
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																									}
																										break;
																									case 4: {
																										tbodyTd.eq(i).html(productElementBatchs)
																									}
																										break;
																									case 5: {
																										tbodyTd.eq(i).html(workOrderNumber)
																									}
																										break;
																									case 6: {
																										tbodyTd.eq(i).html(workOrderRes)
																									}
																										break;
																									case 7: {
																										tbodyTd.eq(i).html(productLine)
																									}
																										break;
																									case 8: {
																										tbodyTd.eq(i).html(priority)
																									}
																										break;
																									case 9: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.material_management_supervise_explain = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																										})
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					});

																					// 主表格添加内容
																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																					　　 xhrFields: {
																									withCredentials: true
																							},
																							crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panel_2, {
																										thead: {
																											theadContent: '序号/物料名称/物料型号/物料规格/单位/供应商/共需数量/领料数量/实领数量/物料编号/备注/操作',
																											theadWidth: '6%/10%/10%/10%/8%/10%/8%/8%/8%/8%/6%/10%'
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
																												'<td></td>',
																												'<td></td>',
																												'<td class="table-input-td no-print"><a class="table-link delete" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																												
																											],

																											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																											dataAddress: function (tbodyTarget, html, result) {
																												tbodyTarget.empty() // 清空表格主体
																												let map = result.map, // 映射zszs
																												dataList = map.planUseMaterials, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																																let materialId = dataList[currentTr.index()].craft_bom_material_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("data",materialId)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																let supplierId = dataList[currentTr.index()].supplier_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("data",supplierId)
																															}
																																break;
																															case 6: {
																																tempData = dataList[currentTr.index()].plan_material_amount;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 7: {
																																let	inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)
																																let target   = 	currentTr.children().eq(i).find("input")
																																let mesPopover = new MesPopover(target,{ content: '数量不能大于总量' })
																																tempData = dataList[currentTr.index()].plan_material_amount;

																																currentTr.children().eq(i).find('input').off('blur').on('blur', (event) => {
																																	let require =	currentTr.children().eq(i).find('input').val()
																																	if(require>tempData){
																																		mesPopover.show()
																																	}else{
																																		mesPopover.hide()
																																	}
																																})
																															
																															}
																																break;
																															case 8: {
																																
																															}
																																break;
																															case 9: {
																															
																															}
																																break;
																															case 10: {
																																let inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)

																															
																															}
																																break;
																															case 11: {
																																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn // 按钮自带的data数据
																																	
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
																											totalRow: result.map.line, // 总行数
																											displayRow: result.map.planUseMaterials.length // 显示行数
																										
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
																					addTableData(queryPlanResourceAllocationUrl, {
																						type: 'workOrder',
																						workOrderId:"03893d36921648ffb8edaf4599b41de1",
																						headNum: 1
																					});

																					panel_2.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>恢复</a>`)
																						thisTr.remove()
																						panel_3.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})
																					panel_3.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>删除</a>`)
																						thisTr.remove()
																						panel_2.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})
																				
																					modalSubmitBtn.off("click").on("click",(event)=>{
																						panel_2.find('table thead tr th:last-child').addClass("no-print")
																						jQuery.print('#CreateRequisitions')
																					})

																					modalSubmitBtn_2.off("click").on("click",(event)=>{
																							let tr_2 = panel_2.find('tbody tr');
																							let craftBomDetails=[]
																							
																							for(var i=0; i<tr_2.length;i++){
																								let materialList={
																									craft_bom_material_id:"",//物料id
																									warehouse_material_name:"",//物料名称
																									warehouse_material_standard:"",//规格
																									warehouse_material_model:"",//型号
																									supplier_name:"",//供应商
																									supplier_id:"",//供应商id
																									warehouse_material_units:"",
																									plan_material_amount:"" ,//总量
																									plan_quantity_required:"",//需要领料数量
																									plan_quotes_material_describe:""//备注
																								}
																								materialList.warehouse_material_name = tr_2.eq(i).find("td").eq(1).text()
																								materialList.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("data")
																								materialList.warehouse_material_standard = tr_2.eq(i).find("td").eq(2).text()
																								materialList.warehouse_material_model =tr_2.eq(i).find("td").eq(3).text()
																								materialList.warehouse_material_units = tr_2.eq(i).find("td").eq(4).text()
																								materialList.supplier_name = tr_2.eq(i).find("td").eq(5).text()
																								materialList.supplier_id =  tr_2.eq(i).find("td").eq(5).attr("data")
																								materialList.plan_material_amount = tr_2.eq(i).find("td").eq(6).text()
																								materialList.plan_quantity_required = tr_2.eq(i).find("td").eq(7).find("input").val()
																								materialList.plan_quotes_material_describe = tr_2.eq(i).find("td").eq(10).find("input").val()
																								craftBomDetails.push(materialList)
																							}
																							let craftBomDetails2, req2
																							craftBomDetails2=JSON.stringify(craftBomDetails)
																							req2=JSON.stringify(req)
																						
																							if (true) {
																								swal({
																									title: '您确定要提交本次操作吗?',
																									text: '请确保填写信息无误后点击确定按钮',
																									type: 'question',
																									allowEscapeKey: false, // 用户按esc键不退出
																									allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																									showCancelButton: true, // 显示用户取消按钮
																									confirmButtonText: '确定',
																									cancelButtonText: '取消',
																								}).then(function () {
	
																									$.ajax({
																										type: "POST",
																										url: saveMaterialRequisitionUrl,
																										dataType: "json",
																								　　 xhrFields: {
																												withCredentials: true
																										},
																										crossDomain: true,
																										dataType:"json",
																										data:{
																											workOrderId:workOrderId,
																											materialRequisition:req2,
																											planUseMaterials:craftBomDetails2
																										},
																										success: function (result, status, xhr) {
																											if (result.status === 0) {
																												let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																											}else {
																												swallFail2();	//操作失败
																											}
																										},
	
																									})
																								});
																							}
																							else {
																								swallError();	//格式不正确
																							}

																					})

																				})
																					// 按钮2  领料统计
																				headingMainBtn_2.off("click").on("click",(event)=>{
																					let dataContent = $('#publicSelectModalBox2'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签

																					staffTypeOption = dataContent.find('.pullDownMenu-1'), // 类型选项
																					fuzzySearchGroup = dataContent.find('.fuzzy-search-group') // 模糊搜索组
																					dataContent.find('.panel-title').text('领料统计') // 更换panel标题

																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: true
																					})
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						panelList.find('thead').empty()
																						panelList.find('tbody').empty()
																					})
																					// dataContent.modal('show') // 运行时显示
																					staffTypeOption.hide()
																					fuzzySearchGroup.show()

																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								paginationContainer.show()
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panelList, {
																										thead: {
																											theadContent: '序号/物料名称/规格/型号/单位/供应商/共需数量/已领数量',
																											theadWidth: '6%/13%/12%/12%/10%/15%/10%/10%'
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
																												let map = result.map, // 映射zszs
																													dataList = map.materialRequisitionStatistics, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																																// tempData=
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 6: {
																																tempData = dataList[currentTr.index()].plan_quantity_required;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 7: {
																																tempData = dataList[currentTr.index()].plan_get_number;
																																currentTr.children().eq(i).html(tempData)
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
																											// totalRow: 1, // 总行数
																											displayRow: result.map.materialRequisitionStatistics.length // 显示行数
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
																					addTableData(queryMaterialRequisitionStatisticsUrl, {
																						workOrderId:workOrderId,
																						headNum: 1
																					});

																					// 模糊搜索组加载数据
																					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																						let val = $(this).closest('.input-group').find('input').val()
																						event.stopPropagation() // 禁止向上冒泡
																						addTableData(queryMaterialRequisitionStatisticsUrl, {
																							workOrderId:workOrderId,
																							keyword:val,
																							headNum:1
																						});
																					});


																				})
																					
																				break;
																			}
																			case '#Feeding': {	//补料
																				let dataContent = $('#materielMangeModel'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					fuzzySearchGroup = panelList.find('.fuzzy-search-group'), // 模糊搜索组
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3
																					
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					dataContent.find('.modal-title').text('补料管理') // 更换panel标题
																					headingMainBtn_1.text("添加补料")
																					headingMainBtn_2.text("补料统计")
																					headingMainBtn_1.show()
																					headingMainBtn_2.show()
																					headingMainBtn_3.hide()
																					statusTypeOption.hide()
																					fuzzySearchGroup.show()

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							// ajax发送前
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							// ajax成功
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/补料批号/补料时间/补料人/操作',
																										theadWidth: '8%/15%/15%/15%/15%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#materielDetail"><i class="fa fa-tasks fa-fw"></i>查看补料详情</a></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射zszs
																												dataList = map.materialsSupplements, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].material_management_batch;
																															// tempData=
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].material_management_date;
																															currentTr.children().eq(i).html((moment(tempData).format('YYYY-MM-DD HH:mm:ss')))
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].material_management_custodian;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4:
																															tempData = dataList[currentTr.index()].craft_basics_status;
																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																materialsSupplementId = dataList[currentTr.index()].material_management_id;
																																switch (dataContent) {
																																	case '#materielDetail': {	//补料详情
																																		let dataContent = $('#materielDetail'),
																																		panelList = dataContent.find('.panel'),
																																		panel_1 = panelList.eq(0),
																																		panel_2 = panelList.eq(1),
																																		modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																		modalSubmitBtn = dataContent.find('.modal-submit'),
																																		modalSubmitBtn_2 = dataContent.find('.modal-submit2'),
																																		panelThead = panelList.find('thead'),
																																		panelTbody = panelList.find('tbody'),
																																		barCodeText = panel_1.find('.panel-heading').find('.barCode')
														
																																		dataContent.find('.modal-header').find('.modal-title').text('补料详情') // 更换panel标题
																																		panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																																		panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																																		// 主表格1添加内容，基础信息部分
																																		dataContent.modal({
																																			backdrop: false, // 黑色遮罩不可点击
																																			keyboard: false,  // esc按键不可弃用模态框
																																			show: false
																																		})
																																		dataContent.modal('show') // 运行时显示
																																		modalSubmitBtn.hide()
																																		modalSubmitBtn_2.hide()
																																		barCodeText.hide()
																																		dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																			$('body').addClass('modal-open')
																																		})
																																
																																		modalCloseBtn.off('click').on('click', (event) => {
																																			// 点击弃用按钮隐藏该模态框
																																			dataContent.modal('hide')
																																			// 初始化表格
																																			panel_2.find('thead').empty()
																																			panel_2.find('tbody').empty()
																																		})
															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																		　　 xhrFields: {
																																						withCredentials: true
																																				},
																																				crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panel_1.find('table'), null, {
																																							thead: '补料批号/补料人/补料时间/生产批号/工单号/工单负责人/生产线/生产优先级/创建时间/创建人/补料说明',
																																							tableWitch: '2%/3%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.materialsSupplements[0][0], // 主要数据列表
																																								tempData = null; // 表格td内的临时数据
																																								for (let i = 0, len = length; i < len; i++){
																																									switch (i) {																								
																																										case 0: {
																																											tempData = dataList.material_management_batch;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 1: {
																																											tempData = dataList.material_management_custodian;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList.material_management_date;
																																											tbodyTd.eq(i).html((moment(tempData).format('YYYY-MM-DD HH:mm:ss')))
																																										}
																																											break;
																																										case 3: {
																																											tbodyTd.eq(i).html(productElementBatchs)
																																										}
																																											break;
																																										case 4: {
																																											tbodyTd.eq(i).html(workOrderNumber)
																																										}
																																											break;
																																										case 5: {
																																											tbodyTd.eq(i).html(workOrderRes)
																																										}
																																											break;
																																										case 6: {
																																											tbodyTd.eq(i).html(productLine)
																																										}
																																											break;
																																										case 7: {
																																											tbodyTd.eq(i).html(priority)
																																										}
																																											break;
																																									
																																										case 8: {
																																											tempData = dataList.material_management_creation_time;
																																											tbodyTd.eq(i).html((moment(tempData).format('YYYY-MM-DD HH:mm:ss')))
																																										}
																																											break;
																																										case 9: {
																																											tempData = dataList.material_management_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 10: {
																																											tempData = dataList.material_management_supervise_explain;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										default:
																																											break;
																																									}
																																								}
																																							}
																																						});

																																						mesVerticalTableAddData(panel_2, {
																																							thead: {
																																								theadContent: '序号/物料名称/物料型号/物料规格/单位/供应商/补料数量/备注',
																																								theadWidth: '8%/10%/10%/10%/8%/10%/10%/12%'
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
																																									let map = result.map, // 映射zszs
																																									dataList = map.materialsSupplements[1], // 主要数据列表
																																									tempData = null; // 表格td内的临时数据
																																									console.log(dataList)
																																									for (let i = 0, len = dataList.length; i < len; i++) {
																																										tbodyTarget.append('<tr></tr>'); // 添加行
																																										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																										for (let i = 0, len = html.length; i < len; i++) {
																																											currentTr.append(html[i]); // 添加表格内的HTML
																																											switch (i) {
																																												case 0:{
																																													currentTr.children().eq(i).html(currentTr.index() + 1)
																																												}
																																													break;
																																												case 1: {
																																													tempData = dataList[currentTr.index()].warehouse_material_name;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 2: {
																																													tempData = dataList[currentTr.index()].warehouse_material_model;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 3: {
																																													tempData = dataList[currentTr.index()].warehouse_material_standard;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 4: {
																																													tempData = dataList[currentTr.index()].warehouse_material_units;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 5: {
																																													tempData = dataList[currentTr.index()].supplier_name;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 6: {
																																													tempData = dataList[currentTr.index()].plan_supplement_material;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 7: {
																																													tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																													currentTr.children().eq(i).html(tempData)
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
																																								totalRow:  result.map.materialsSupplements[1].length, // 总行数
																																								displayRow: result.map.materialsSupplements[1].length // 显示行数
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
																																		addTableData(queryMaterialsSupplementParticularsUrl, {
																																			materialsSupplementId:materialsSupplementId
																																		});
																																		
																																		break;
																																	}
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
																										totalRow:result.map.materialsSupplements.length, // 总行数
																										displayRow: result.map.materialsSupplements.length // 显示行数
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
																				addTableData(queryMaterialsSupplementOutlineUrl, {
																					workOrderId:workOrderId,
																				});
																				// 模糊搜索
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					let val = $(this).closest('.input-group').find('input').val()
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryMaterialsSupplementOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						headNum:1
																					});
																				});

																				// 按钮1  创建新的补料单
																				headingMainBtn_1.off("click").on("click",(event)=>{
																					let dataContent2 = $('#CreateRequisitions2'),
																					panelList = dataContent2.find('.panel'),
																					panel_1 = panelList.eq(0)
																					panel_2 = panelList.eq(1)
																					panel_3 = panelList.eq(2)
																					modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent2.find('.modal-submit')
																					modalSubmitBtn_2 = dataContent2.find('.modal-submit2')
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					barCodeText = 	panel_1.find('.panel-heading').find('.barCode'),
																					req = {
																						//material_management_batch:"",//管理单批号
																						material_management_custodian:"",//管理人
																						material_management_custodian_id:"",//管理人
																						//warehouse_id:"",//仓库id
																					//	warehouse_name:"",//仓库
																						material_management_date:"",//管理时间
																						material_management_supervise_explain:"",//管理说明
																						material_management_creation_staff:"",//创建人
																						material_management_creation_staff_id:"",//创建人id
																					}
																					req.material_management_creation_staff= USERNAME
																					req.material_management_creation_staff_id= USERID

																					dataContent2.find('.modal-header').find('.modal-title').text('补料信息') // 更换panel标题
																					panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																					panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题
																					panel_3.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题
																					barCodeText.hide()

																					// 主表格1添加内容，基础信息部分
																					dataContent2.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent2.modal('show') // 运行时显示
																					dataContent2.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent2.modal('hide')
																						// 初始化表格
																						panel_2.find('thead').empty()
																						panel_2.find('tbody').empty()
																						panel_3.find('tbody').empty()
																					})
																					modalSubmitBtn.hide()
																					modalSubmitBtn_2.show()

																					mesHorizontalTableAddData(panel_1.find('table'), null, {
																						thead: '补料批号/补料人/补料时间/生产批号/工单号/工单负责人/生产线/生产优先级/补料说明',
																						tableWitch: '2%/3%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							// let map = result.map, // 映射
																							// dataList = map.craftBasicsList, // 主要数据列表
																							tempData = null; // 表格td内的临时数据
																							for (let i = 0, len = length; i < len; i++){
																								switch (i) {																								
																									case 0: {
																										$.ajax({
																											type: "POST",
																											url: generateProcessManageBatchNumberUrl,
																											dataType: "json",
																											　　 xhrFields: {
																															withCredentials: true
																													},
																													crossDomain: true,
																											data:{
																												type:"load",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number = result.data
																													tbodyTd.eq(i).html(number)
																													req.material_management_batch = number
																												}
																											}
																										})
																									}
																										break;
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												req.material_management_custodian_id = resolveData.roleStaffId
																												req.material_management_custodian = resolveData.roleStaffName
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																									}
																										break;
																									case 2: {
																										inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										// 添加到提交数据
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.material_management_date = tbodyTd.eq(i).find('input').val()
																										})
																									}
																										break;
																									case 3: {
																										tbodyTd.eq(i).html(productElementBatchs)
																									}
																										break;
																									case 4: {
																										tbodyTd.eq(i).html(workOrderNumber)
																									}
																										break;
																									case 5: {
																										tbodyTd.eq(i).html(workOrderRes)
																									}
																										break;
																									case 6: {
																										tbodyTd.eq(i).html(productLine)
																									}
																										break;
																									case 7: {
																										tbodyTd.eq(i).html(priority)
																									}
																										break;
																									case 8: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.material_management_supervise_explain  = tbodyTd.eq(i).find('input').val()
																										})
																									}
																										break;
																								
																									default:
																										break;
																								}
																							}
																						}
																					});

																					// 主表格添加内容
																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panel_2, {
																										thead: {
																											theadContent: '序号/物料名称/物料规格/物料型号/单位/供应商/补料数量/备注/操作',
																											theadWidth: '8%/10%/10%/10%/8%/10%/10%/13%/12%'
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
																												'<td class="table-input-td"><a class="table-link delete" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																												
																											],

																											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																											dataAddress: function (tbodyTarget, html, result) {
																												tbodyTarget.empty() // 清空表格主体
																												let map = result.map, // 映射zszs
																												dataList = map.planUseMaterials, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																																let basicMaterId = dataList[currentTr.index()].craft_bom_material_id;
																																let planKeyId = dataList[currentTr.index()].plan_foreign_key_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("basicMaterId",basicMaterId)
																																currentTr.children().eq(i).attr("planKeyId",planKeyId)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																let supplierId = dataList[currentTr.index()].supplier_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("supplierId",supplierId)
																															}
																																break;
																															case 6: {
																																let	inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)
																															}
																																break;
																															case 7: {
																																let	inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)
																															}
																																break;
																															case 8: {
																																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn // 按钮自带的data数据
																																
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
																											totalRow:result.map.planUseMaterials.length, // 总行数
																											displayRow: result.map.planUseMaterials.length // 显示行数
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
																					addTableData(queryPlanResourceAllocationUrl, {
																						type: 'workOrder',
																						workOrderId:"03893d36921648ffb8edaf4599b41de1",
																						headNum: 1
																					});

																					panel_2.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>恢复</a>`)
																						thisTr.remove()
																						panel_3.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})
																					panel_3.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>删除</a>`)
																						thisTr.remove()
																						panel_2.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})

																					//提交
																					modalSubmitBtn_2.off("click").on("click",(event)=>{
																						let tr_2 = panel_2.find('tbody tr');
																						let craftBomDetails=[]
																						for(var i=0; i<tr_2.length;i++){
																							let materialList={
																								craft_bom_material_id:"",//物料id
																								plan_foreign_key_id:"",//外id
																								warehouse_material_name:"",//物料名称
																								warehouse_material_standard:"",//规格
																								warehouse_material_model:"",//型号
																								supplier_name:"",//供应商
																								supplier_id:"",//供应商id
																								warehouse_material_units:"",
																								plan_supplement_material:"",//补料数量
																								plan_quotes_material_describe:""//备注
																							}
																							materialList.warehouse_material_name = tr_2.eq(i).find("td").eq(1).text()
																							materialList.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("basicMaterId")
																							materialList.plan_foreign_key_id = tr_2.eq(i).find("td").eq(1).attr("planKeyId")
																							materialList.warehouse_material_standard = tr_2.eq(i).find("td").eq(2).text()
																							materialList.warehouse_material_model =tr_2.eq(i).find("td").eq(3).text()
																							materialList.warehouse_material_units = tr_2.eq(i).find("td").eq(4).text()
																							materialList.supplier_name = tr_2.eq(i).find("td").eq(5).text()
																							materialList.supplier_id =  tr_2.eq(i).find("td").eq(5).attr("supplierId")
																							materialList.plan_supplement_material = tr_2.eq(i).find("td").eq(6).find("input").val()
																							materialList.plan_quotes_material_describe = tr_2.eq(i).find("td").eq(7).find("input").val()
																							craftBomDetails.push(materialList)
																							console.log(craftBomDetails)
																						}
																						let craftBomDetails2, req2
																						craftBomDetails2=JSON.stringify(craftBomDetails)
																						req2=JSON.stringify(req)
																					
																						if (true) {
																							swal({
																								title: '您确定要提交本次操作吗?',
																								text: '请确保填写信息无误后点击确定按钮',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							}).then(function () {

																								$.ajax({
																									type: "POST",
																									url: saveMaterialsSupplementUrl,
																									dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																									data:{
																										workOrderId:workOrderId,
																										materialsSupplement:req2,
																										planUseMaterials:craftBomDetails2
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else {
																											swallFail2();	//操作失败
																										}
																									},

																								})
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})

																				})
																				// 按钮2  补料统计
																				headingMainBtn_2.off("click").on("click",(event)=>{
																					let dataContent = $('#publicSelectModalBox2'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签

																					staffTypeOption = dataContent.find('.pullDownMenu-1'), // 类型选项
																					fuzzySearchGroup = dataContent.find('.fuzzy-search-group') // 模糊搜索组
																					dataContent.find('.panel-title').text('补料统计') // 更换panel标题

																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						panelList.find('thead').empty()
																						panelList.find('tbody').empty()
																					})
																					dataContent.modal('show') // 运行时显示
																					staffTypeOption.hide()
																					fuzzySearchGroup.show()

																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								paginationContainer.show()
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panelList, {
																										thead: {
																											theadContent: '序号/物料名称/规格/型号/单位/供应商/补料数量/备注',
																											theadWidth: '6%/15%/15%/10%/10%/15%/10%/12%'
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
																												let map = result.map, // 映射zszs
																													dataList = map.planUseMaterialDOs, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 6: {
																																tempData = dataList[currentTr.index()].plan_supplement_material;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 7: {
																																tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																currentTr.children().eq(i).html(tempData)
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
																											totalRow: 1, // 总行数
																											displayRow: result.map.planUseMaterialDOs.length // 显示行数
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
																					addTableData(queryMaterialsSupplementStatisticsUrl, {
																						workOrderId:workOrderId,
																						headNum: 1
																					});

																					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																						let val = $(this).closest('.input-group').find('input').val();
																						event.stopPropagation() // 禁止向上冒泡
																						addTableData(queryMaterialsSupplementStatisticsUrl, {
																							workOrderId:workOrderId,
																							keyword:val,
																							headNum: 1
																						});
																					});


																				})
																					
																				break;
																			}
																			case '#return': {	//退料
																				let dataContent3 = $('#materielMangeModel'),
																					panelList = dataContent3.find('.panel'),
																					modalCloseBtn = dataContent3.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent3.find('.pagination'),		// 分页ul标签
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					fuzzySearchGroup = panelList.find('.fuzzy-search-group'), // 模糊搜索组
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3
																					dataContent3.find('.modal-title').text('退料管理') // 更换panel标题
																					
																					dataContent3.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent3.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					headingMainBtn_1.text("创建退料单")
																					headingMainBtn_2.text("退料统计")
																					headingMainBtn_1.show()
																					headingMainBtn_2.show()
																					headingMainBtn_3.hide()
																					statusTypeOption.show()
																					fuzzySearchGroup.show()

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							paginationContainer.show()
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							// ajax成功
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/退料批号/退料进库批号/创建时间/退料时间/退料人/操作',
																										theadWidth: '6%/15%/15%/15%/15%/10%/18%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td class="table-input-td"></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射zszs
																												dataList = map.materialsReturneds, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].material_management_batch;
																															// tempData=
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].material_management_outofstorage_batch;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].material_management_creation_time;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].material_management_date;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].material_management_custodian;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																													
																														case 6:
																															tempData = dataList[currentTr.index()].material_management_complete_status;
																															if(tempData == 0){
																																currentTr.children().eq(i).html(`<a class="table-link" href="javascript:;" data-toggle-modal-target="#materielDetail"><i class="fa fa-tasks fa-fw"></i>查看退料详情</a>`)
																															}else if(tempData == 1){
																																currentTr.children().eq(i).html(`<a class="table-link" href="javascript:;" data-toggle-modal-target="#addMaterielDetail"><i class="fa fa-tasks fa-fw"></i>补充退料信息</a><a class="table-link" href="javascript:;" data-toggle-btn="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a>`)
																															}

																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																materialsReturnedId = dataList[currentTr.index()].material_management_id;
																																switch (dataContent) {
																																	case '#materielDetail': {	//退料详情
																																		let dataContent = $('#materielDetail'),
																																		panelList = dataContent.find('.panel'),
																																		panel_1 = panelList.eq(0)
																																		panel_2 = panelList.eq(1)
																																		modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																		modalSubmitBtn = dataContent.find('.modal-submit')
																																		modalSubmitBtn_2 = dataContent.find('.modal-submit2')
																																		panelThead = panelList.find('thead'),
																																		panelTbody = panelList.find('tbody'),
																																		barCodeText = 	panel_1.find('.panel-heading').find('.barCode')
														
																																		dataContent.find('.modal-header').find('.modal-title').text('退料详情') // 更换panel标题
																																		panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																																		panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																																		// 主表格1添加内容，基础信息部分
																																		dataContent.modal({
																																			backdrop: false, // 黑色遮罩不可点击
																																			keyboard: false,  // esc按键不可弃用模态框
																																			show: false
																																		})
																																		dataContent.modal('show') // 运行时显示
																																		modalSubmitBtn.hide()
																																		modalSubmitBtn_2.hide()
																																		barCodeText.show()
																																		dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																			$('body').addClass('modal-open')
																																		})
																																
																																		modalCloseBtn.off('click').on('click', (event) => {
																																			// 点击弃用按钮隐藏该模态框
																																			dataContent.modal('hide')
																																			// 初始化表格
																																			panel_2.find('thead').empty()
																																			panel_2.find('tbody').empty()
																																		})
														
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panel_1.find('table'), null, {
																																							thead: '退料批号/退料人/退料时间/退料仓库/生产批号/工单号/工单负责人/生产线/生产优先级/创建时间/创建人/完成时间/退料说明',
																																							tableWitch: '2%/3%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.materialsReturned[0][0], // 主要数据列表
																																								tempData = null; // 表格td内的临时数据
																																								barCodeText.val("NO:" +  dataList.material_management_outofstorage_batch).attr("readonly",true)
																																								for (let i = 0, len = length; i < len; i++){
																																									switch (i) {																								
																																										case 0: {
																																											tempData = dataList.material_management_batch;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 1: {
																																											tempData = dataList.material_management_custodian;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList.material_management_date;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList.warehouse_name;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 4: {
																																											// tempData = dataList;
																																											tbodyTd.eq(i).html(productElementBatchs)
																																										}
																																											break;
																																										case 5: {
																																											// tempData = dataList;
																																											tbodyTd.eq(i).html(workOrderNumber)
																																										}
																																											break;
																																										case 6: {
																																											// tempData = dataList.material_management_batch;
																																											tbodyTd.eq(i).html(workOrderRes)
																																										}
																																											break;
																																										case 7: {
																																											// tempData = dataList.material_management_batch;
																																											tbodyTd.eq(i).html(productLine)
																																										}
																																											break;
																																										case 8: {
																																											// tempData = dataList.material_management_batch;
																																											tbodyTd.eq(i).html(priority)
																																										}
																																											break;
																																										case 9: {
																																											tempData = dataList.material_management_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 10: {
																																											tempData = dataList.material_management_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 11: {
																																											tempData = dataList.material_management_completion_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 12: {
																																											tempData = dataList.material_management_supervise_explain;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										default:
																																											break;
																																									}
																																								}
																																							}
																																						});

																																						mesVerticalTableAddData(panel_2, {
																																							thead: {
																																								theadContent: '序号/物料名称/物料规格/物料型号/单位/供应商/退料数量/物料编号/备注',
																																								theadWidth: '6%/10%/10%/10%/8%/10%/8%/10%/12%'
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
																																									let map = result.map, // 映射zszs
																																									dataList = map.materialsReturned[1], // 主要数据列表
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
																																													tempData = dataList[currentTr.index()].warehouse_material_name;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 2: {
																																													tempData = dataList[currentTr.index()].warehouse_material_standard;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 3: {
																																													tempData = dataList[currentTr.index()].warehouse_material_model;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 4: {
																																													tempData = dataList[currentTr.index()].warehouse_material_units;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 5: {
																																													tempData = dataList[currentTr.index()].supplier_name;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 6: {
																																													tempData = dataList[currentTr.index()].plan_return_material;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 7: {
																																													tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																													materialId = dataList[currentTr.index()].plan_quotes_material_id;
																																													currentTr.children().eq(i).addClass("table-input-td")
																																													currentTr.children().eq(i).html(tempData)
		
																																													currentTr.children().eq(i).off("click").on("click","a", function(){
																																														let dataContent = $('#publicSelectModalBox'),
																																														panelModal1 = dataContent.find('.panel'),
																																														modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																														statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																														fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																														paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																														activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																														panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																														// ProductTypeList = [],
																																														mesloadBox = new MesloadBox(panelModal1, {
																																															// 主数据载入窗口
																																															warningContent: '没有此类信息，请重新选择或输入'
																																														});
		
																																														dataContent.modal({
																																															backdrop: false, // 黑色遮罩不可点击
																																															keyboard: false,  // esc按键不可弃用模态框
																																															show: false
																																														})
																																														dataContent.modal("show")
																																						
																																														panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																														dataContent.find(".panel-title").text("编号详情")
																																													
																																														statusOption.hide()
																																														fuzzySearchGroup.hide()
		
																																														modalCloseBtn.off('click').on('click', (event) => {
																																															// 点击弃用按钮隐藏该模态框
																																															dataContent.modal('hide')
																																															panelModal1.find('thead').empty()
																																															panelModal1.find('tbody').empty()
																																															// 初始化表格
																																														
																																														})
																																													
																																														// 模态框表格增加内容
																																														function addModalTableData(url, data) {
																																															$.ajax({
																																																type: "POST",
																																																dataType: "json",
																																														　　 xhrFields: {
																																																		withCredentials: true
																																																},
																																																crossDomain: true,
																																																url: url,
																																																
																																																data: data,
																																																beforeSend: function (xml) {
																																																	// ajax发送前
																																																	mesloadBox.loadingShow()
																																																},
																																																success: function (result, status, xhr) {
																																																	// ajax成功
																																																	mesloadBox.hide()
																																																	paginationContainer.show()	//隐藏分页按钮
																																																	if (result.status === 0) {
																																						
																																																		mesVerticalTableAddData(panelModal1, {
																																																			thead: {
																																																				theadContent: '序号/退料编号/编号类型',
																																																				theadWidth: '8%/40%/10'
																																																			},
																																																			tbody: {
																																																				html: [
																																																					'<td></td>',
																																																					'<td></td>',
																																																					'<td></td>'
																																																				],
																																						
																																																				// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																				dataAddress: function (tbodyTarget, html, result) {
																																																					let map = result.map, // 映射
																																																						dataList = result.map.materialNumbers, // 主要数据列表
																																																						tempData = ''; // 表格td内的临时数据
																																																						tbodyTarget.empty() // 清空表格主体
																																							
																																							
																																																					for (let i = 0, len = dataList.length; i < len; i++) {
																																																						tbodyTarget.append('<tr></tr>'); // 添加行
																																																						let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																						for (let i = 0, len = html.length; i< len; i++) {
																																																							currentTr.append(html[i]); // 添加表格内的HTML
																																																							switch (i) {
																																																								case 0:
																																																									currentTr.children().eq(i).html(currentTr.index() + 1)
																																																									break;
																																																								case 1: {
																																																									tempData = dataList[currentTr.index()].number_number
																																																									currentTr.children().eq(i).html(tempData)
																																																								}
																																																									break;
																																																								case 2: {
																																																									tempData = dataList[currentTr.index()].number_number_type
																																																									currentTr.children().eq(i).html(tempData)
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
																																																				displayRow: result.map.materialNumbers.length// 显示行数
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
		
																																												
																																														addModalTableData(queryMaterialsReturnedBindingMaterialNumberUrl, {
																																															materialId: materialId,
																																															headNum: 1,
																																														});
																																													})
																																												}
																																													break;
																																												case 8: {
																																													tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																													currentTr.children().eq(i).html(tempData)
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
																																								totalRow:result.map.materialsReturned[1].length, // 总行数
																																								displayRow: result.map.materialsReturned[1].length // 显示行数
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
																																		addTableData(queryMaterialsReturnedParticularsUrl, {
																																			materialsReturnedId: materialsReturnedId,
																																		
																																		});
																														
																																	
																																		break;
																																	}
																																	case '#addMaterielDetail': {	//补充退料信息
																																		let dataContent = $('#materielDetail'),
																																			panelList = dataContent.find('.panel'),
																																			panel_1 = panelList.eq(0)
																																			panel_2 = panelList.eq(1)
																																			modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																			modalSubmitBtn = dataContent.find('.modal-submit')
																																			modalSubmitBtn_2 = dataContent.find('.modal-submit2')
																																			panelThead = panelList.find('thead'),
																																			panelTbody = panelList.find('tbody'),
																																			barCodeText = 	panel_1.find('.panel-heading').find('.barCode'),
																																			req = {
																																				material_management_outofstorage_batch:"",
																																				material_management_id:"",
																																				work_order_id:"",
																																				//material_management_custodian:"",//管理人
																																				//material_management_custodian_id:"",//管理人
																																				material_management_date:"",//时间
																																				warehouse_id:"",//仓库id
																																				warehouse_name:"",//仓库
																																				material_management_supervise_explain:"",//管理说明
																																				material_management_creation_staff:"",//创建人
																																				material_management_creation_staff_id:"",//创建人id
																																				material_management_complete_status:""
																																			}
																																			req.material_management_creation_staff=USERNAME
																																			req.material_management_creation_staff_id=USERID
																																			req.work_order_id= workOrderId
																																		
																																			barCodeText.show()
																																			dataContent.find('.modal-header').find('.modal-title').text('补充退料详情') // 更换panel标题
																																			panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																																			panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																																			// 主表格1添加内容，基础信息部分
																																			dataContent.modal({
																																				backdrop: false, // 黑色遮罩不可点击
																																				keyboard: false,  // esc按键不可弃用模态框
																																				show: false
																																			})
																																			dataContent.modal('show') // 运行时显示
																																			modalSubmitBtn.hide()
																																			modalSubmitBtn_2.show()
																																			barCodeText.show()

																																			dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																				$('body').addClass('modal-open')
																																			})
																																	
																																			modalCloseBtn.off('click').on('click', (event) => {
																																				// 点击弃用按钮隐藏该模态框
																																				dataContent.modal('hide')
																																				// 初始化表格
																																				panel_2.find('thead').empty()
																																				panel_2.find('tbody').empty()
																																			})
																																			barCodeText.val("").attr("readonly",false).attr("placeholder","补充退料进库批次号")

																																			barCodeText.off('blur').on('blur', (event) => {
																																				req.material_management_outofstorage_batch = 	panel_1.find('.panel-heading').find("input").val()
																																			})

															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panel_1.find('table'), null, {
																																							thead: '退料批号/退料人/退料时间/退料仓库/生产批号/工单号/工单负责人/生产线/生产优先级/创建时间/创建人/完成时间/退料说明',
																																							tableWitch: '2%/3%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.materialsReturned[0][0], // 主要数据列表
																																								tempData = null; // 表格td内的临时数据
																																								for (let i = 0, len = length; i < len; i++){
																																									switch (i) {																								
																																										case 0: {
																																											tempData = dataList.material_management_batch;
																																											let	tempData2 = dataList.material_management_id;
																																											tbodyTd.eq(i).html(tempData)
																																											req.material_management_id = tempData2
																																										}
																																											break;
																																										case 1: {
																																											tempData = dataList.material_management_custodian;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											let inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"/>`;
																																											tbodyTd.eq(i).addClass('table-input-td table-link ')
																																											tbodyTd.eq(i).html(inputHtml)

																																											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																																												req.material_management_date = tbodyTd.eq(i).find('input').val()
																																											})
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList.warehouse_name;
																																											let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																																											tbodyTd.eq(i).addClass('table-input-td')
																																											tbodyTd.eq(i).html(inputHtml)
																																											tbodyTd.eq(i).find('input').val(tempData)
																																											req.warehouse_id = dataList.warehouse_id
																																											req.warehouse_name = dataList.warehouse_name
																																
																																											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																																												let promise = new Promise(function (resolve, reject) {
																																													selectWarehousesAddData(resolve)
																																												});
																																												promise.then(function (resolveData) {
																																													tbodyTd.eq(i).find('input').val(resolveData.warehouseName)
																																													req.warehouse_id = resolveData.warehouseID
																																													req.warehouse_name = resolveData.warehouseName
																																												})
																																
																																												$(this).prop('readonly', true) // 输入框只读
																																												$(this).off('blur').on('blur', () => {
																																													$(this).removeProp('readonly') // 输入移除框只读
																																												})
																																											})
																																										}
																																											break;
																																										case 4: {
																																											tbodyTd.eq(i).html(productElementBatchs)
																																										}
																																											break;
																																										case 5: {
																																											tbodyTd.eq(i).html(workOrderNumber)
																																										}
																																											break;
																																										case 6: {
																																											tbodyTd.eq(i).html(workOrderRes)
																																										}
																																											break;
																																										case 7: {
																																											tbodyTd.eq(i).html(productLine)
																																										}
																																											break;
																																										case 8: {
																																											tbodyTd.eq(i).html(priority)
																																										}
																																											break;
																																										case 9: {
																																											tempData = dataList.material_management_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 10: {
																																											tempData = dataList.material_management_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 11: {
																																											tempData = dataList.material_management_completion_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 12: {
																																											tempData = dataList.material_management_supervise_explain;
																																											req.material_management_supervise_explain= tempData
																																											let inputHtml = `<input type="text" class="table-input" />`;
																																											tbodyTd.eq(i).addClass('table-input-td table-link ')
																																											tbodyTd.eq(i).html(inputHtml)
																																											tbodyTd.eq(i).find("input").val(tempData)

																																											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																																												req.material_management_supervise_explain = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																																											})
																																										}
																																											break;
																																										default:
																																											break;
																																									}
																																								}
																																							}
																																						});

																																						mesVerticalTableAddData(panel_2, {
																																							thead: {
																																								theadContent: '序号/物料名称/物料规格/物料型号/单位/供应商/退料数量/物料编号/备注',
																																								theadWidth: '6%/10%/10%/10%/8%/10%/8%/10%/12%'
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
																																									let map = result.map, // 映射zszs
																																									dataList = map.materialsReturned[1], // 主要数据列表
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
																																													tempData = dataList[currentTr.index()].warehouse_material_name;
																																													let keyId = dataList[currentTr.index()].plan_foreign_key_id;
																																													let bomId = dataList[currentTr.index()].craft_bom_material_id;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 2: {
																																													tempData = dataList[currentTr.index()].warehouse_material_standard;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 3: {
																																													tempData = dataList[currentTr.index()].warehouse_material_model;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 4: {
																																													tempData = dataList[currentTr.index()].warehouse_material_units;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 5: {
																																													tempData = dataList[currentTr.index()].supplier_name;
																																													let supplierId = dataList[currentTr.index()].supplier_id;
																																													currentTr.children().eq(i).html(tempData)
																																													currentTr.children().eq(i).attr("supplierId",supplierId)
																																												}
																																													break;
																																												case 6: {
																																													tempData = dataList[currentTr.index()].plan_return_material;
																																													let	inputHtml = `<input type="text" class="table-input" placeholder="" autocomplete="on" />`
																																													currentTr.children().eq(i).addClass('table-input-td')
																																													currentTr.children().eq(i).html(inputHtml)
																																													currentTr.children().eq(i).find("input").val(tempData)
																																												
																																												}
																																													break;
																																												case 7: {
																																													tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																													currentTr.children().eq(i).addClass("table-input-td")
																																													currentTr.children().eq(i).html(tempData)
																																											  	let 	materialId = dataList[currentTr.index()].plan_quotes_material_id;
		
																																													currentTr.children().eq(i).off("click").on("click","a", function(){
																																														let dataContent = $('#publicSelectModalBox'),
																																														panelModal1 = dataContent.find('.panel'),
																																														modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																														statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																														fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																														paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																														activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																														panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																														// ProductTypeList = [],
																																														mesloadBox = new MesloadBox(panelModal1, {
																																															// 主数据载入窗口
																																															warningContent: '没有此类信息，请重新选择或输入'
																																														});
		
																																														dataContent.modal({
																																															backdrop: false, // 黑色遮罩不可点击
																																															keyboard: false,  // esc按键不可弃用模态框
																																															show: false
																																														})
																																														dataContent.modal("show")
																																						
																																														panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																														dataContent.find(".panel-title").text("编号详情")
																																													
																																														statusOption.hide()
																																														fuzzySearchGroup.hide()
		
																																														modalCloseBtn.off('click').on('click', (event) => {
																																															// 点击弃用按钮隐藏该模态框
																																															dataContent.modal('hide')
																																															panelModal1.find('thead').empty()
																																															panelModal1.find('tbody').empty()
																																															// 初始化表格
																																														
																																														})
																																													
																																														// 模态框表格增加内容
																																														function addModalTableData(url, data) {
																																															$.ajax({
																																																type: "POST",
																																																dataType: "json",
																																														　　 xhrFields: {
																																																		withCredentials: true
																																																},
																																																crossDomain: true,
																																																url: url,
																																																data: data,
																																																beforeSend: function (xml) {
																																																	// ajax发送前
																																																	mesloadBox.loadingShow()
																																																},
																																																success: function (result, status, xhr) {
																																																	// ajax成功
																																																	mesloadBox.hide()
																																																	paginationContainer.show()	//隐藏分页按钮
																																																	if (result.status === 0) {
																																						
																																																		mesVerticalTableAddData(panelModal1, {
																																																			thead: {
																																																				theadContent: '序号/报废物编号',
																																																				theadWidth: '8%/20%'
																																																			},
																																																			tbody: {
																																																				html: [
																																																					'<td></td>',
																																																					'<td></td>'
																																																				],
																																						
																																																				// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																				dataAddress: function (tbodyTarget, html, result) {
																																																					let map = result.map, // 映射
																																																						dataList = result.map.productElementNumbers, // 主要数据列表
																																																						tempData = ''; // 表格td内的临时数据
																																																						tbodyTarget.empty() // 清空表格主体
																																																					for (let i = 0, len = dataList.length; i < len; i++) {
																																																						tbodyTarget.append('<tr></tr>'); // 添加行
																																																						let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																						for (let i = 0, len = html.length; i< len; i++) {
																																																							currentTr.append(html[i]); // 添加表格内的HTML
																																																							switch (i) {
																																																								case 0:
																																																									currentTr.children().eq(i).html(currentTr.index() + 1)
																																																									break;
																																																								case 1: {
																																																									tempData = dataList[currentTr.index()].number_number
																																																									currentTr.children().eq(i).html(tempData)
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
																																																				totalRow: result.map.productElementNumbers.length, // 总行数
																																																				displayRow: result.map.productElementNumbers.length// 显示行数
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
		
																																												
																																														addModalTableData(queryMaterialsReturnedBindingMaterialNumberUrl, {
																																															materialId: materialId,
																																															headNum: 1,
																																														});
																																													})
																																												}
																																													break;
																																												case 8: {
																																													tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																													let	inputHtml = `<input type="text" class="table-input" placeholder="" autocomplete="on" />`
																																													currentTr.children().eq(i).addClass('table-input-td')
																																													currentTr.children().eq(i).html(inputHtml)
																																													currentTr.children().eq(i).find("input").val(tempData)
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
																																								totalRow:result.map.materialsReturned[1].length, // 总行数
																																								displayRow: result.map.materialsReturned[1].length // 显示行数
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
																																		addTableData(queryMaterialsReturnedParticularsUrl, {
																																			materialsReturnedId: materialsReturnedId,
																																		
																																		});

																																		modalSubmitBtn.off("click").on("click",(event) =>{
																																			let tr_2 = panel_2.find('tbody tr');
																																			let craftBomDetails=[]
																																			for(var i=0; i<tr_2.length;i++){
																																				let materialList={
																																					craft_bom_material_id:"",//物料id
																																					plan_foreign_key_id:"",//外键id
																																					warehouse_material_name:"",//物料名称
																																					warehouse_material_standard:"",//规格
																																					warehouse_material_model:"",//型号
																																					supplier_name:"",//供应商
																																					supplier_id:"",//供应商id
																																					warehouse_material_units:"",
																																				//	plan_material_amount:"" ,//总量
																																					//plan_get_number:"",//实领数量（已领取数量）
																																				//	plan_quantity_received:"",//收调批数量
																																					plan_return_material:"",//退料数量
																																					plan_quotes_material_describe:"",//备注
																																				}
																																				materialList.warehouse_material_name = tr_2.eq(i).find("td").eq(1).text()
																																				materialList.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("bomId")
																																				materialList.plan_foreign_key_id = tr_2.eq(i).find("td").eq(1).attr("keyId")
																																				materialList.warehouse_material_standard = tr_2.eq(i).find("td").eq(2).text()
																																				materialList.warehouse_material_model =tr_2.eq(i).find("td").eq(3).text()
																																				materialList.warehouse_material_units = tr_2.eq(i).find("td").eq(4).text()
																																				materialList.supplier_name = tr_2.eq(i).find("td").eq(5).text()
																																				materialList.supplier_id =  tr_2.eq(i).find("td").eq(5).attr("supplierId")
																																			//	materialList.plan_get_number = tr_2.eq(i).find("td").eq(6).text()
																																			//	materialList.plan_quantity_received = tr_2.eq(i).find("td").eq(7).find("input").val()
																																			//		materialList.plan_material_amount = tr_2.eq(i).find("td").eq(8).find("input").val()
																																				materialList.plan_return_material = tr_2.eq(i).find("td").eq(6).find("input").val()
																																				materialList.plan_quotes_material_describe = tr_2.eq(i).find("td").eq(8).find("input").val()
																																				craftBomDetails.push(materialList)
																																				console.log(	materialList.planUseMaterialList)
																																			}
																																			let craftBomDetails2,req2
																																			craftBomDetails2=JSON.stringify(craftBomDetails)
																																			req2=JSON.stringify(req)
																																			if (true
																																			) {
																																				swal({
																																					title: '您确定要保存本次操作吗?',
																																					text: '请确保填写信息无误后点击保存按钮',
																																					type: 'question',
																																					allowEscapeKey: false, // 用户按esc键不退出
																																					allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																																					showCancelButton: true, // 显示用户取消按钮
																																					confirmButtonText: '确定',
																																					cancelButtonText: '取消',
																																				}).then(function () {
																																					$.ajax({
																																						type: "POST",
																																						url: modifyMaterialsReturnedUrl,
																																						dataType: "json",
																																						　　 xhrFields: {
																																										withCredentials: true
																																								},
																																								crossDomain: true,
																																						data: {
																																							workOrderId:workOrderId,
																																							materialsReturned:req2,
																																							planUseMaterials:craftBomDetails2
																																						},
																																						success: function (result, status, xhr) {
																																							if (result.status === 0) {
																																								swallSuccess()	//操作成功提示并刷新页面
																																							}else if(result.status===1){
																																								typeDifference() 
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
																																		// 完成/
																																		modalSubmitBtn_2.off("click").on("click",(event) =>{
																																			let tr_2 = panel_2.find('tbody tr');
																																			let craftBomDetails=[]
																																			for(var i=0; i<tr_2.length;i++){
																																				let materialList={
																																					craft_bom_material_id:"",//物料id
																																					plan_foreign_key_id:"",//外键id
																																					warehouse_material_name:"",//物料名称
																																					warehouse_material_standard:"",//规格
																																					warehouse_material_model:"",//型号
																																					supplier_name:"",//供应商
																																					supplier_id:"",//供应商id
																																					warehouse_material_units:"",
																																				//	plan_material_amount:"" ,//总量
																																					//plan_get_number:"",//实领数量（已领取数量）
																																				//	plan_quantity_received:"",//收调批数量
																																					plan_return_material:"",//退料数量
																																					plan_quotes_material_describe:"",//备注
																																					
																																				}
																																				materialList.warehouse_material_name = tr_2.eq(i).find("td").eq(1).text()
																																				materialList.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("bomId")
																																				materialList.plan_foreign_key_id = tr_2.eq(i).find("td").eq(1).attr("keyId")
																																				materialList.warehouse_material_standard = tr_2.eq(i).find("td").eq(2).text()
																																				materialList.warehouse_material_model =tr_2.eq(i).find("td").eq(3).text()
																																				materialList.warehouse_material_units = tr_2.eq(i).find("td").eq(4).text()
																																				materialList.supplier_name = tr_2.eq(i).find("td").eq(5).text()
																																				materialList.supplier_id =  tr_2.eq(i).find("td").eq(5).attr("supplierId")
																																			//	materialList.plan_get_number = tr_2.eq(i).find("td").eq(6).text()
																																			//	materialList.plan_quantity_received = tr_2.eq(i).find("td").eq(7).find("input").val()
																																			//		materialList.plan_material_amount = tr_2.eq(i).find("td").eq(8).find("input").val()
																																				materialList.plan_return_material = tr_2.eq(i).find("td").eq(6).find("input").val()
																																				materialList.plan_quotes_material_describe = tr_2.eq(i).find("td").eq(8).find("input").val()
																																				craftBomDetails.push(materialList)
																																				console.log(	materialList.planUseMaterialList)
																																			}
																																			req.material_management_complete_status= 0

																																			let craftBomDetails2,req2
																																			craftBomDetails2=JSON.stringify(craftBomDetails)
																																			req2=JSON.stringify(req)
																																			if (true
																																			) {
																																				swal({
																																					title: '您确定要完成退料工作吗?',
																																					text: '退料完成后信息不可修改',
																																					type: 'question',
																																					allowEscapeKey: false, // 用户按esc键不退出
																																					allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																																					showCancelButton: true, // 显示用户取消按钮
																																					confirmButtonText: '确定',
																																					cancelButtonText: '取消',
																																				}).then(function () {
																																					$.ajax({
																																						type: "POST",
																																						url: modifyMaterialsReturnedUrl,
																																						dataType: "json",
																																						　　 xhrFields: {
																																										withCredentials: true
																																								},
																																								crossDomain: true,
																																						data: {
																																							workOrderId:workOrderId,
																																							materialsReturned:req2,
																																							planUseMaterials:craftBomDetails2,
																																						},
																																						success: function (result, status, xhr) {
																																							if (result.status === 0) {
																																								let activePaginationBtn = dataContent3.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																								swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																																							}else if(result.status===1){
																																								typeDifference() 
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
																																	case '#delete' :{
																																		swal({
																																			title: '您确定要删除吗？',
																																			type: 'question',
																																			showCancelButton: true,
																																			confirmButtonText: '确定',
																																			cancelButtonText: '取消'
																																		}).then(function (){
																																			$.ajax({
																																				type: "POST",
																																				url:removeMaterialRequisitionUrl,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: {
																																					materialRequisitionId:materialsReturnedId,
																																				},
																																				success: function (result, status, xhr) {
																																					if (result.status === 0) {
																																						let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																																					}else {
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
																																				},
																																			})
																																		})
																																		break;
																																	}
															
															
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
																										totalRow:result.map.materialsReturneds.length, // 总行数
																										displayRow: result.map.materialsReturneds.length // 显示行数
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
																				addTableData(queryMaterialsReturnedOutlineUrl, {
																					workOrderId:workOrderId,
																					status:1,
																					headNum: 1
																				});

																				// 下拉选事件
																				statusTypeOption.off("change").on("change",function(){
																					let status = $(this).val();
																					let val = fuzzySearchGroup.closest('.input-group').find('input').val()
																					addTableData(queryMaterialsReturnedOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						status:status,
																						headNum:1
																					});
																				})

																				// 模糊搜索
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					let val = $(this).closest('.input-group').find('input').val()
																					let status = statusTypeOption.val();
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryMaterialsReturnedOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						status:status,
																						headNum:1
																					});
																				});
																					// 按钮1  创建新的退料单
																				headingMainBtn_1.off("click").on("click",(event)=>{
																					let dataContent = $('#CreateRequisitions3'),
																					panelList = dataContent.find('.panel'),
																					panel_1 = panelList.eq(0)
																					panel_2 = panelList.eq(1)
																					panel_3 = panelList.eq(2)
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent.find('.modal-submit')
																					modalSubmitBtn_2 = dataContent.find('.modal-submit2')
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					barCodeText = 	panel_1.find('.panel-heading').find('.barCode'),
																					req = {
																						material_management_batch:"",//管理单批号
																						material_management_custodian:"",//管理人
																						material_management_custodian_id:"",//管理人
																						warehouse_id:"",//仓库id
																						warehouse_name:"",//仓库
																						material_management_supervise_explain:"",//管理说明
																						material_management_creation_staff:"",//创建人
																						material_management_creation_staff_id:"",//创建人id
																					}
																				
																					req.material_management_creation_staff=USERNAME
																					req.material_management_creation_staff_id=USERID

																					barCodeText.attr("placeholder","物料入库批号录入").attr("readonly",true)
																					dataContent.find('.modal-header').find('.modal-title').text('退料详情') // 更换panel标题
																					panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																					panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题
																					panel_3.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																					// 主表格1添加内容，基础信息部分
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示
																					barCodeText.show()
																					dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						panel_2.find('thead').empty()
																						panel_2.find('tbody').empty()
																						panel_3.find('tbody').empty()
																					})
																					mesHorizontalTableAddData(panel_1.find('table'), null, {
																						thead: '退料批号/退料人人/退料时间/退料仓库/生产批号/工单号/工单负责人/生产线/生产优先级/领料说明',
																						tableWitch: '2%/3%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							for (let i = 0, len = length; i < len; i++){
																								switch (i) {																								
																									case 0: {
																										$.ajax({
																											type: "POST",
																											url: generateProcessManageBatchNumberUrl,
																											dataType: "json",
																											　　 xhrFields: {
																															withCredentials: true
																													},
																													crossDomain: true,
																											data:{
																												type:"reject",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number = result.data
																													tbodyTd.eq(i).html(number)
																												}
																											}
																										})
																									}
																										break;
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												req.material_management_custodian_id = resolveData.roleStaffId
																												req.material_management_custodian = resolveData.roleStaffName
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																									}
																										break;
																									case 2: {
																									
																									}
																										break;
																									case 3: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											
																											let promise = new Promise(function (resolve, reject) {
																												selectWarehousesAddData(resolve)
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.warehouseName)
																												req.warehouse_id = resolveData.warehouseID
																												req.warehouse_name = resolveData.warehouseName
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																									}
																										break;
																									case 4: {
																										tbodyTd.eq(i).html(productElementBatchs)
																									}
																										break;
																									case 5: {
																										tbodyTd.eq(i).html(workOrderNumber)
																									}
																										break;
																									case 6: {
																										tbodyTd.eq(i).html(workOrderRes)
																									}
																										break;
																									case 7: {
																										tbodyTd.eq(i).html(productLine)
																									}
																										break;
																									case 8: {
																										tbodyTd.eq(i).html(priority)
																									}
																										break;
																									case 9: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.material_management_supervise_explain = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																										})
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					});

																					// 主表格添加内容
																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																								

																									mesVerticalTableAddData(panel_2, {
																										thead: {
																											theadContent: '序号/物料名称/物料型号/物料规格/单位/供应商/已领取数量/调入数量/物料总数量/退料数量/物料编号/备注/操作',
																											theadWidth: '5%/10%/10%/10%/8%/8%/5%/6%/6%/6%/10%/8%/12%'
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
																												'<td></td>',
																												'<td></td>',
																												'<td></td>',
																												'<td class="table-input-td no-print"><a class="table-link delete " href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																												
																											],

																											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																											dataAddress: function (tbodyTarget, html, result) {
																												tbodyTarget.empty() // 清空表格主体
																												let map = result.map, // 映射zszs
																												dataList = map.planUseMaterials, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																																let materialId = dataList[currentTr.index()].craft_bom_material_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("data",materialId)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																let supplierId = dataList[currentTr.index()].supplier_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("data",supplierId)
																															}
																																break;
																															case 6: {
																																tempData = dataList[currentTr.index()].plan_get_number;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 7: {
																																tempData = dataList[currentTr.index()].plan_quantity_received;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 8: {
																																tempData = Number(dataList[currentTr.index()].plan_get_number);
																																tempData2 = Number(dataList[currentTr.index()].plan_quantity_received);
																																currentTr.children().eq(i).html(tempData+tempData2)
																															}
																																break;
																															case 9: {
																																inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)
																															}
																																break;
																															case 10: {
																																tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>添加编号</a>`
																																currentTr.children().eq(i).addClass("table-input-td")
																																currentTr.children().eq(i).html(tempData)

																																// 添加编号
																																currentTr.children().eq(i).off("click").on("click","a", function(){
																																	let dataContent2 = $('#addCode'),
																																	panelList = dataContent2.find('.panel'),
																																	panelTbody = panelList.find('table tbody'),	// 面板表格
																																	modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																																	headBtn = dataContent2.find('.head-main-btn-1'),
																																	modalSubmitBtn = dataContent2.find('.modal-submit'),
																																	target = 	currentTr.children().eq(10)
																																	codeList=[]
																																	dataContent2.modal('show') // 运行时显示

																																	modalCloseBtn.off('click').on('click', (event) => {
																																		// 点击弃用按钮隐藏该模态框
																																		dataContent2.modal('hide')
																																		// 初始化表格
																																		panelList.find('thead').empty()
																																		panelList.find('tbody').empty()
																																	})
																																	if(codeList.length!==0){
																																		let html=""
																																		for(var i=0;i<codeList.length;i++){
																																			html+=`
																																			<tr>
																																				<td >${i+1}</td>
																																				<td class="table-input-td">
																																					<input type="text" class="table-input projectPrincipal" value=${codeList[i]} >
																																				</td>
																																				<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																																			</tr>
																																			`
																																		}
																																		panelTbody.append(html)
																																	}else{
																																		headBtn.trigger('click')
																																	}


																																	headBtn.off('click').on('click', (event) => {
																																		let temStr = `
																																			<tr>
																																					<td ></td>
																																					<td class="table-input-td">
																																						<input type="text" class="table-input projectPrincipal" placeholder="请输入编号" />
																																					</td>
																																					<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																																			</tr>
																																			`;
																																		panelTbody.append(temStr)
												
																																		let  tr=panelList.find('tbody tr');
																																		for(let i = 0;i<tr.length;i++){
																																			panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																																			;
																																		}
												
																																		panelList.on('click', '.delete', function () {
																																			$(this).closest('tr').remove();  //移除该行元素
																																			for(let i = 0;i<tr.length;i++){
																																				panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																																				;
																																			}
																																		})
																																	})

																																	modalSubmitBtn.off('click').on('click', (event) => {
																																		let codeListPanel = panelTbody.find('tr')
																																		for(let i = 0;i<codeListPanel.length;i++){
																																			let temp = codeListPanel.eq(i).find('td:nth-child(2)').find("input").val()
																																			codeList[i] = temp
																																		}
																																			console.log(codeList)
																																		if (codeList.length!==0
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
																																				target.attr("data", codeList)
																																				modalCloseBtn.trigger('click')
																																			});
																																		}
																																		else {
																																			swallError();	//格式不正确
																																		}
																																	})		
																																	
																																})
																															}
																																break;
																															case 11: {
																																inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)
																															}
																																break;
																															case 12: {
																															
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
																											displayRow: result.map.planUseMaterials.length // 显示行数
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
																					addTableData(queryPlanResourceAllocationUrl, {
																						type: 'workOrder',
																						workOrderId:"03893d36921648ffb8edaf4599b41de1",
																						headNum: 1
																					});

																					panel_2.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>恢复</a>`)
																						thisTr.remove()
																						panel_3.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})
																					panel_3.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>删除</a>`)
																						thisTr.remove()
																						panel_2.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})
																				
																					modalSubmitBtn.off("click").on("click",(event)=>{
																						panel_2.find('table thead tr th:last-child').addClass("no-print")
																						jQuery.print('#CreateRequisitions3')
																					})

																					modalSubmitBtn_2.off("click").on("click",(event)=>{
																						let tr_2 = panel_2.find('tbody tr');
																						let craftBomDetails=[]
																					
																						for(var i=0; i<tr_2.length;i++){
																							let materialList={
																								craft_bom_material_id:"",//物料id
																								warehouse_material_name:"",//物料名称
																								warehouse_material_standard:"",//规格
																								warehouse_material_model:"",//型号
																								supplier_name:"",//供应商
																								supplier_id:"",//供应商id
																								warehouse_material_units:"",
																								plan_material_amount:"" ,//总量
																								plan_get_number:"",//实领数量（已领取数量）
																								plan_quantity_received:"",//收调批数量
																								plan_return_material:"",//退料数量
																								plan_quotes_material_describe:"",//备注
																								planUseMaterialList:[]
																							}
																							materialList.warehouse_material_name = tr_2.eq(i).find("td").eq(1).text()
																							materialList.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("data")
																							materialList.warehouse_material_standard = tr_2.eq(i).find("td").eq(2).text()
																							materialList.warehouse_material_model =tr_2.eq(i).find("td").eq(3).text()
																							materialList.warehouse_material_units = tr_2.eq(i).find("td").eq(4).text()
																							materialList.supplier_name = tr_2.eq(i).find("td").eq(5).text()
																							materialList.supplier_id =  tr_2.eq(i).find("td").eq(5).attr("data")
																							materialList.plan_get_number = tr_2.eq(i).find("td").eq(6).text()
																							materialList.plan_quantity_received = tr_2.eq(i).find("td").eq(7).find("input").val()
																							materialList.plan_material_amount = tr_2.eq(i).find("td").eq(8).find("input").val()
																							materialList.plan_return_material = tr_2.eq(i).find("td").eq(9).find("input").val()
																							materialList.planUseMaterialList .push( tr_2.eq(i).find("td").eq(10).attr("data"))
																							materialList.plan_quotes_material_describe = tr_2.eq(i).find("td").eq(11).find("input").val()
																							craftBomDetails.push(materialList)
																						}
																						let craftBomDetails2,req2
																						craftBomDetails2=JSON.stringify(craftBomDetails)
																						req2=JSON.stringify(req)
																						if (true) {
																							swal({
																								title: '您确定要提交本次操作吗?',
																								text: '请确保填写信息无误后点击确定按钮',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							}).then(function () {

																								$.ajax({
																									type: "POST",
																									url: saveMaterialsReturnedUrl,
																									dataType: "json",
																								　　 xhrFields: {
																												withCredentials: true
																										},
																										crossDomain: true,
																									data:{
																										workOrderId:workOrderId,
																										materialsReturned:req2,
																										planUseMaterials:craftBomDetails2
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											let activePaginationBtn = dataContent3.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else {
																											swallFail();	//操作失败
																										}
																									},

																								})
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})

																				})
																					// 按钮2  退料统计
																				headingMainBtn_2.off("click").on("click",(event)=>{
																					let dataContent = $('#publicSelectModalBox2'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签

																					staffTypeOption = dataContent.find('.pullDownMenu-1'), // 类型选项
																					fuzzySearchGroup = dataContent.find('.fuzzy-search-group') // 模糊搜索组
																					dataContent.find('.panel-title').text('领料统计') // 更换panel标题

																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						panelList.find('thead').empty()
																						panelList.find('tbody').empty()
																					})
																					dataContent.modal('show') // 运行时显示
																					staffTypeOption.hide()
																					fuzzySearchGroup.show()

																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								paginationContainer.show()
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panelList, {
																										thead: {
																											theadContent: '序号/物料名称/规格/型号/供应商/单位/退料数量',
																											theadWidth: '6%/15%/15%/15%/15%/15%15%'
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
																												let map = result.map, // 映射zszs
																													dataList = map.materialsReturnedStatistics, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																																// tempData=
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 6: {
																																tempData = dataList[currentTr.index()].plan_return_material;
																																currentTr.children().eq(i).html(tempData)
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
																											totalRow:result.map.materialsReturnedStatistics.length , // 总行数
																											displayRow: result.map.materialsReturnedStatistics.length // 显示行数
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
																					addTableData(queryMaterialsReturnedStatisticsUrl, {
																						workOrderId:workOrderId,
																						headNum: 1
																					});

																					// 退料搜索
																					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																						let val = $(this).closest('.input-group').find('input').val()
																						event.stopPropagation() // 禁止向上冒泡
																						addTableData(queryMaterialsReturnedStatisticsUrl, {
																							workOrderId:workOrderId,
																							keyword:val,
																							headNum:1
																						});
																
																					});


																				})
																					
																				break;
																			}
																			case '#allot': {	//调批
																				let dataContent = $('#materielMangeModel'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					paginationContainer = panelList.find('.pagination'),		// 分页ul标签
																					fuzzySearchGroup = panelList.find('.fuzzy-search-group'), // 模糊搜索组
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3

																					dataContent.find('.modal-title').text('调出管理') // 更换panel标题

																					headingMainBtn_1.show()
																					headingMainBtn_2.show()
																					headingMainBtn_3.show()
																					headingMainBtn_1.text("新建物料调批")
																					headingMainBtn_2.text("调批统计")
																					headingMainBtn_3.text("调入管理")
																					
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					statusTypeOption.hide()
																					fuzzySearchGroup.show()

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							// ajax发送前
																							paginationContainer.show()
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							// ajax成功
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/调拨批号/调入生产批号/调入工单号/调批时间/调批人/操作',
																										theadWidth: '6%/15%/15%/15%/15%/10%/18%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#materielDetail"><i class="fa fa-tasks fa-fw"></i>查看调拨详情</a></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																												let map = result.map, // 映射zszs
																												dataList = map.materialsDispatchs, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].materials_dispatch_batch_number;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].accept_plan_control_number;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].accept_work_order_number;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].materials_dispatch_time;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].materials_dispatch_staff;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																													
																														case 6:
																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																materialsDispatchId = dataList[currentTr.index()].materials_dispatch_id;
																																switch (dataContent) {
																																	case '#materielDetail': {	
																																			let dataContent = $('#materielDetail'),
																																			panelList = dataContent.find('.panel'),
																																			panel_1 = panelList.eq(0)
																																			panel_2 = panelList.eq(1)
																																			modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																			modalSubmitBtn = dataContent.find('.modal-submit')
																																			modalSubmitBtn_2 = dataContent.find('.modal-submit2')
																																			panelThead = panelList.find('thead'),
																																			panelTbody = panelList.find('tbody'),
																																			barCodeText = 	panel_1.find('.panel-heading').find('.barCode')
															
																																			dataContent.find('.modal-header').find('.modal-title').text('调出详情') // 更换panel标题
																																			panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																																			panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																																			// 主表格1添加内容，基础信息部分
																																			dataContent.modal({
																																				backdrop: false, // 黑色遮罩不可点击
																																				keyboard: false,  // esc按键不可弃用模态框
																																				show: false
																																			})
																																			dataContent.modal('show') // 运行时显示
																																			modalSubmitBtn.hide()
																																			barCodeText.hide()
																																			modalSubmitBtn_2.hide()
																																			dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																				$('body').addClass('modal-open')
																																			})
																																	
																																			modalCloseBtn.off('click').on('click', (event) => {
																																				// 点击弃用按钮隐藏该模态框
																																				dataContent.modal('hide')
																																				// 初始化表格
																																				panel_2.find('thead').empty()
																																				panel_2.find('tbody').empty()
																																			})
															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panel_1.find('table'), null, {
																																							thead: '调出批号/调批人/调批时间/生产批号/工单号/工单负责人/调入生产批号/调入工单号/调入负责人/调出说明/创建时间/创建人',
																																							tableWitch: '10%/10%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.materialsDispatchs[0][0], // 主要数据列表
																																								tempData = null; // 表格td内的临时数据
																																								for (let i = 0, len = length; i < len; i++){
																																									switch (i) {																								
																																										case 0: {
																																											tempData = dataList.materials_dispatch_batch_number;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 1: {
																																											tempData = dataList.materials_dispatch_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList.materials_dispatch_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 3: {
																																										//	tempData = dataList.production_plan_batch_number;
																																											tbodyTd.eq(i).html(productElementBatchs)
																																										}
																																											break;
																																										case 4: {
																																											tbodyTd.eq(i).html(workOrderNumber)
																																										}
																																											break;
																																										case 5: {
																																										//	tempData = dataList.work_order_responsible;
																																											tbodyTd.eq(i).html(workOrderRes)
																																										}
																																											break;
																																										case 6: {
																																											tempData = dataList.accept_plan_control_number;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 7: {
																																											tempData = dataList.accept_work_order_number;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 8: {
																																											tempData = dataList.accept_work_order_responsible_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 9: {
																																											tempData = dataList.materials_dispatch_explain;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 10: {
																																											tempData = dataList.materials_dispatch_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 11: {
																																											tempData = dataList.materials_dispatch_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										default:
																																											break;
																																									}
																																								}
																																							}
																																						});

																																						mesVerticalTableAddData(panel_2, {
																																							thead: {
																																								theadContent: '序号/物料名称/物料规格/物料型号/供应商/单位/调出数量/查看物料编号/备注',
																																								theadWidth: '3%/10%/10%/10%/10%/10%/10%/10%/15%'
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
																																									let map = result.map, // 映射zszs
																																									dataList = map.materialsDispatchs[1], // 主要数据列表
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
																																													tempData = dataList[currentTr.index()].warehouse_material_name;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 2: {
																																													tempData = dataList[currentTr.index()].warehouse_material_standard;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 3: {
																																													tempData = dataList[currentTr.index()].warehouse_material_model;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 4: {
																																													tempData = dataList[currentTr.index()].supplier_name;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 5: {
																																													tempData = dataList[currentTr.index()].warehouse_material_units;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 6: {
																																													tempData = dataList[currentTr.index()].plan_transfer_number;
																																													currentTr.children().eq(i).html(tempData)
																																												}
																																													break;
																																												case 7: {
																																													tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																													currentTr.children().eq(i).addClass("table-input-td")
																																													currentTr.children().eq(i).html(tempData)
																																													let 	materialId = dataList[currentTr.index()].plan_quotes_material_id;

																																													currentTr.children().eq(i).off("click").on("click","a", function(){
																																														let dataContent = $('#publicSelectModalBox'),
																																														panelModal1 = dataContent.find('.panel'),
																																														modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																														statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																														fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																														paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																														activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																														panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																														// ProductTypeList = [],
																																														mesloadBox = new MesloadBox(panelModal1, {
																																															// 主数据载入窗口
																																															warningContent: '没有此类信息，请重新选择或输入'
																																														});

																																														dataContent.modal({
																																															backdrop: false, // 黑色遮罩不可点击
																																															keyboard: false,  // esc按键不可弃用模态框
																																															show: false
																																														})
																																														dataContent.modal("show")
																																						
																																														panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																														dataContent.find(".panel-title").text("编号详情")
																																													
																																														statusOption.hide()
																																														fuzzySearchGroup.hide()

																																														modalCloseBtn.off('click').on('click', (event) => {
																																															// 点击弃用按钮隐藏该模态框
																																															dataContent.modal('hide')
																																															panelModal1.find('thead').empty()
																																															panelModal1.find('tbody').empty()
																																															// 初始化表格
																																														
																																														})
																																													
																																														// 模态框表格增加内容
																																														function addModalTableData(url, data) {
																																															$.ajax({
																																																type: "POST",
																																																dataType: "json",
																																														　　 xhrFields: {
																																																		withCredentials: true
																																																},
																																																crossDomain: true,
																																																url: url,
																																																data: data,
																																																beforeSend: function (xml) {
																																																	// ajax发送前
																																																	mesloadBox.loadingShow()
																																																},
																																																success: function (result, status, xhr) {
																																																	// ajax成功
																																																	mesloadBox.hide()
																																																	paginationContainer.show()	//隐藏分页按钮
																																																	if (result.status === 0) {
																																																		mesVerticalTableAddData(panelModal1, {
																																																			thead: {
																																																				theadContent: '序号/物料编号/编号类型',
																																																				theadWidth: '8%/20%/8%'
																																																			},
																																																			tbody: {
																																																				html: [
																																																					'<td></td>',
																																																					'<td></td>',
																																																					'<td></td>'
																																																				],
																																																				// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																				dataAddress: function (tbodyTarget, html, result) {
																																																					let map = result.map, // 映射
																																																						dataList = result.map.materialNumbers, // 主要数据列表
																																																						tempData = ''; // 表格td内的临时数据
																																																						tbodyTarget.empty() // 清空表格主体
																																																						console.log(dataList)
																																							
																																																					for (let i = 0, len = dataList.length; i < len; i++) {
																																																						tbodyTarget.append('<tr></tr>'); // 添加行
																																																						let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																						for (let i = 0, len = html.length; i< len; i++) {
																																																							currentTr.append(html[i]); // 添加表格内的HTML
																																																							switch (i) {
																																																								case 0:{
																																																									currentTr.children().eq(i).html(currentTr.index() + 1)
																																																								}
																																																									break;
																																																								case 1: {
																																																									tempData = dataList[currentTr.index()].number_number
																																																									currentTr.children().eq(i).html(tempData)
																																																								}
																																																									break;
																																																								case 2: {
																																																									tempData = dataList[currentTr.index()].number_number_type
																																																									currentTr.children().eq(i).html(tempData)
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
																																																				totalRow: result.map.materialNumbers.length, // 总行数
																																																				displayRow: result.map.materialNumbers.length// 显示行数
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

																																												
																																														addModalTableData(queryMaterialsDispatchBindingMaterialNumberUrl, {
																																															materialId: materialId,
																																															headNum: 1,
																																														});
																																													})
																																												}
																																													break;
																																												case 8: {
																																													tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																													currentTr.children().eq(i).html(tempData)
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
																																								totalRow:  result. map.materialsDispatchs[1].length , // 总行数
																																								displayRow: result. map.materialsDispatchs[1].length // 显示行数
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
																																		addTableData(queryMaterialsDispatchParticularsUrl, {
																																			materialsDispatchId:materialsDispatchId
																																		});
																																		break;
																																	}
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
																										totalRow:result.map.materialsDispatchs.length , // 总行数
																										displayRow: result.map.materialsDispatchs.length // 显示行数
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
																				addTableData(queryMaterialsDispatchOutlineUrl, {
																					workOrderId:workOrderId,
																					type:"dispatch",
																					headNum: 1
																				});

																				// 下拉选事件
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					let val = $(this).closest('.input-group').find('input').val()
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryMaterialsDispatchOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword: val,
																						type:"dispatch",
																						headNum: 1
																					});
															
																				});
																					// 按钮1  创建新的调批
																				headingMainBtn_1.off("click").on("click",(event)=>{
																					let dataContent2 = $('#CreateRequisitions'),
																					panelList = dataContent2.find('.panel'),
																					panel_1 = panelList.eq(0)
																					panel_2 = panelList.eq(1)
																					panel_3 = panelList.eq(2)
																					modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent2.find('.modal-submit')
																					modalSubmitBtn_2 = dataContent2.find('.modal-submit2')
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					barCodeText = 	panel_1.find('.panel-heading').find('.barCode')
																					req = {
																						materials_dispatch_batch_number:"",//批号
																					  materials_dispatch_staff_id:"",//调批人id
																					  materials_dispatch_staff:"",//调批人
																						materials_dispatch_time:"",//调批日期
																						production_plan_id:"",//生产计划id
																						work_order_number:"",//工单号
																						work_order_id:"",//工单id
																						work_order_responsible:"",//工单负责人
																						work_order_responsible_id:"",//工单负责人id
																						accept_plan_control_number:"",//受调批生产批号
																						accept_plan_control_id:"",//受调批生产计划id
																						accept_work_order_number:"",//受调批工单号
																						accept_work_order_number_id:"",//受调批工单号id
																						accept_work_order_responsible_staff:"",//受调批负责人
																						accept_work_order_responsible_staff_id:"",//受调批负责人id
																						materials_dispatch_explain:"",//调批说明
																						materials_dispatch_creation_staff_id:"",//创建人id
																						materials_dispatch_creation_staff:"",//创建人
																					}

																					req.materials_dispatch_creation_staff=USERNAME
																					req.materials_dispatch_creation_staff_id=USERID
																					req.production_plan_id=planId
																					req.work_order_number=workOrderNumber
																					req.work_order_id=workOrderId
																					req.work_order_responsible=workOrderRes
																					req.work_order_responsible_id=workOrderResId

																					dataContent2.find('.modal-header').find('.modal-title').text('调出详情') // 更换panel标题
																					panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																					panel_2.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题
																					panel_3.find('.panel-heading').find('.panel-title').text('物料信息') // 更换panel标题

																					modalSubmitBtn.hide()
																					barCodeText.hide()

																					// 主表格1添加内容，基础信息部分
																					dataContent2.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent2.modal('show') // 运行时显示
																					dataContent2.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent2.modal('hide')
																						// 初始化表格
																						panel_2.find('thead').empty()
																						panel_2.find('tbody').empty()
																						panel_3.find('tbody').empty()
																					})

																					mesHorizontalTableAddData(panel_1.find('table'), null, {
																						thead: '调出批号/调批人/调批时间/调出生产批号/调出工单号/调出工单负责人/调入生产批号/调入工单号/调入负责人/调出说明',
																						tableWitch: '2%/2%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							for (let i = 0, len = length; i < len; i++){
																								switch (i) {																								
																									case 0: {
																										$.ajax({
																											type: "POST",
																											url: generateProcessManageBatchNumberUrl,
																											dataType: "json",
																											　　 xhrFields: {
																															withCredentials: true
																													},
																													crossDomain: true,
																											data:{
																												type:"conversion",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number = result.data
																													tbodyTd.eq(i).html(number)
																													req.materials_dispatch_batch_number= number
																												}
																											}
																										})
																									}
																										break;
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												 req.materials_dispatch_staff_id = resolveData.roleStaffId
																												 req.materials_dispatch_staff = resolveData.roleStaffName
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																									}
																										break;
																									case 2: {
																										inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										// 添加到提交数据
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.materials_dispatch_time = tbodyTd.eq(i).find('input').val()
																										})
																									}
																										break;
																									case 3: {
																										tbodyTd.eq(i).html(productElementBatchs)
																									}
																										break;
																									case 4: {
																										tbodyTd.eq(i).html(workOrderNumber)
																									}
																										break;
																									case 5: {
																										tbodyTd.eq(i).html(workOrderRes)
																									}
																										break;
																									case 6: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectWorkOrder(resolve, queryWorkOrderOutlineUrl, {type: 'vague',userId:USERID,headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.productionPlanBatchNumber)
																												tbodyTd.eq(i+1).html(resolveData.workOrdersNumber)
																												tbodyTd.eq(i+2).html(resolveData.workOrdersRes)
																												req.accept_plan_control_number = resolveData.productionPlanBatchNumber
																												req.accept_plan_control_id = resolveData.planId
																												req.accept_work_order_number = resolveData.workOrdersNumber
																												req.accept_work_order_number_id = resolveData.workOrdersId
																												req.accept_work_order_responsible_staff = resolveData.workOrdersRes
																												req.accept_work_order_responsible_staff_id = resolveData.workOrdersResId
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																									}
																										break;
																									case 7: {
																									
																									}
																										break;
																									case 8: {
																									
																									}
																										break;
																									case 9: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.materials_dispatch_explain= tbodyTd.eq(i).find('input').val()
																										})
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					});

																					// 主表格添加内容
																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panel_2, {
																										thead: {
																											theadContent: '序号/物料名称/规格/型号/供应商/单位/已领取数量/调入数量/物料总数/调出数量/绑定物料编号/备注/操作',
																											theadWidth: '5%/9%/9%/9%/5%/6%/8%/7%/7%/7%/10%/10%/10%'
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
																												'<td></td>',
																												'<td></td>',
																												'<td></td>',
																												'<td class="table-input-td"><a class="table-link delete" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																												
																											],

																											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																											dataAddress: function (tbodyTarget, html, result) {
																												tbodyTarget.empty() // 清空表格主体
																												let map = result.map, // 映射zszs
																												dataList = map.planUseMaterials, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																															let	bomId = dataList[currentTr.index()].craft_bom_material_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("bomId",bomId)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																let supplierId = dataList[currentTr.index()].supplier_id;
																																currentTr.children().eq(i).html(tempData)
																																currentTr.children().eq(i).attr("supplierId", supplierId)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 6: {
																																tempData = dataList[currentTr.index()].plan_get_number;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 7: {
																																tempData = dataList[currentTr.index()].plan_quantity_received;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 8: {
																																tempData = Number(dataList[currentTr.index()].plan_get_number);
																																let tempData1 = parseFloat(dataList[currentTr.index()].plan_quantity_received);
																																currentTr.children().eq(i).html(tempData+tempData1)
																																//currentTr.children().eq(i).html("14")
																															}
																																break;
																															case 9: {
																																inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)
																															
																															}
																																break;
																															case 10: {
																																tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>添加编号</a>`
																																currentTr.children().eq(i).addClass("table-input-td")
																																currentTr.children().eq(i).html(tempData)
																																let target = 	currentTr.children().eq(10)

																																// 添加编号
																																currentTr.children().eq(i).off("click").on("click","a", function(){
																																	let dataContent = $('#addCode'),
																																	panelList = dataContent.find('.panel'),
																																	panelTbody = panelList.find('table tbody'),	// 面板表格
																																	modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																	headBtn = dataContent.find('.head-main-btn-1'),
																																	modalSubmitBtn = dataContent.find('.modal-submit'),
																																	codeList = []

																																
																																	dataContent.modal('show') // 运行时显示

																																	modalCloseBtn.off('click').on('click', (event) => {
																																		// 点击弃用按钮隐藏该模态框
																																		dataContent.modal('hide')
																																		// 初始化表格
																																		panelList.find('thead').empty()
																																		panelList.find('tbody').empty()
																																	})
																																	if(codeList.length!==0){
																																		let html=""
																																		for(var i=0;i<codeList.length;i++){
																																			html+=`
																																			<tr>
																																				<td >${i+1}</td>
																																				<td class="table-input-td">
																																					<input type="text" class="table-input projectPrincipal" value=${codeList[i]} >
																																				</td>
																																				<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																																			</tr>
																																			`
																																		}
																																		panelTbody.append(html)
																																	}else{
																																		headBtn.trigger('click')
																																	}


																																	headBtn.off('click').on('click', (event) => {
																																		let temStr = `
																																			<tr>
																																					<td ></td>
																																					<td class="table-input-td">
																																						<input type="text" class="table-input projectPrincipal" placeholder="请输入编号" />
																																					</td>
																																					<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																																			</tr>
																																			`;
																																		panelTbody.append(temStr)
												
																																		let  tr=panelList.find('tbody tr');
																																		for(let i = 0;i<tr.length;i++){
																																			panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																																			;
																																		}
												
																																		panelList.on('click', '.delete', function () {
																																			$(this).closest('tr').remove();  //移除该行元素
																																			for(let i = 0;i<tr.length;i++){
																																				panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																																				;
																																			}
																																		})
																																	})

																																	modalSubmitBtn.off('click').on('click', (event) => {
																																		let codeListPanel = panelTbody.find('tr')
																																		for(let i = 0;i<codeListPanel.length;i++){
																																			let temp = codeListPanel.eq(i).find('td:nth-child(2)').find("input").val()
																																			codeList[i] = temp
																																		}
																																		if (codeList.length!==0
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
																																				target.attr("data",codeList)
																																				modalCloseBtn.trigger('click')
																																			});
																																		}
																																		else {
																																			swallError();	//格式不正确
																																		}
																																	})		
																																	
																																})
																															}
																																break;
																															case 11: {
																																inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																																currentTr.children().eq(i).addClass('table-input-td')
																																currentTr.children().eq(i).html(inputHtml)
																																
																															}
																																break;
																															case 12: {
																																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn // 按钮自带的data数据
																																
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
																											totalRow: result.map.line, // 总行数
																											displayRow: result.map.planUseMaterials.length // 显示行数
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
																					addTableData(queryPlanResourceAllocationUrl, {
																						type: 'workOrder',
																						workOrderId:"03893d36921648ffb8edaf4599b41de1",
																						headNum: 1
																					});

																					panel_2.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>恢复</a>`)
																						thisTr.remove()
																						panel_3.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})
																					panel_3.find("tbody").off('click').on('click','.delete' ,function(event) {
																						let thisTr=$(this).closest('tr');
																						thisTr.find("a").html(`<i class="fa fa-tasks fa-fw"></i>删除</a>`)
																						thisTr.remove()
																						panel_2.find("tbody").append(thisTr);

																						let tr = panel_2.find('tbody tr');
																						for(let i = 0;i<tr.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_2.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																						let tr_2 = panel_3.find('tbody tr');
																						for(let i = 0;i<tr_2.length;i++){
																							// panel_table.find('tbody').append(temStr)
																							panel_3.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																							;
																						}
																					})

																					modalSubmitBtn_2.off("click").on("click",(event)=>{
																						let tr_2 = panel_2.find('tbody tr');
																						let craftBomDetails=[]
																					
																						for(var i=0; i<tr_2.length;i++){
																							let materialList={
																								craft_bom_material_id:"",//物料id
																								warehouse_material_name:"",//物料名称
																								warehouse_material_standard:"",//规格
																								warehouse_material_model:"",//型号
																								supplier_name:"",//供应商
																								supplier_id:"",//供应商id
																								warehouse_material_units:"",
																								plan_material_amount:"" ,//总量
																								plan_get_number:"" ,//已领取
																								plan_quantity_received:"" ,//调入数量
																								plan_transfer_number:"",//调出数量
																								plan_quotes_material_describe:"",//备注
																								numRecordList:[]
																							}
																							materialList.warehouse_material_name = tr_2.eq(i).find("td").eq(1).text()
																							materialList.craft_bom_material_id = tr_2.eq(i).find("td").eq(1).attr("bomId")
																							materialList.warehouse_material_standard = tr_2.eq(i).find("td").eq(2).text()
																							materialList.warehouse_material_model =tr_2.eq(i).find("td").eq(3).text()
																							materialList.warehouse_material_units = tr_2.eq(i).find("td").eq(5).text()
																							materialList.supplier_name = tr_2.eq(i).find("td").eq(4).text()
																							materialList.supplier_id =  tr_2.eq(i).find("td").eq(4).attr("supplierId")
																							materialList.plan_get_number = tr_2.eq(i).find("td").eq(6).text()
																							materialList.plan_quantity_received = tr_2.eq(i).find("td").eq(7).text()
																							materialList.plan_material_amount = tr_2.eq(i).find("td").eq(8).text()
																							materialList.plan_transfer_number = tr_2.eq(i).find("td").eq(9).find("input").val()
																							materialList.numRecordList.push(tr_2.eq(i).find("td").eq(10).attr("data"))
																							materialList.plan_quotes_material_describe = tr_2.eq(i).find("td").eq(11).find("input").val()
																							craftBomDetails.push(materialList)
																						}
																					
																						let req2, craftBomDetails2
																							req2=JSON.stringify(req)
																							craftBomDetails2=JSON.stringify(craftBomDetails)
																						if (true) {
																							swal({
																								title: '您确定要提交本次操作吗?',
																								text: '请确保填写信息无误后点击确定按钮',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							}).then(function () {

																								$.ajax({
																									type: "POST",
																									url: saveMaterialsDispatchUrl,
																									dataType: "json",
																									　　 xhrFields: {
																													withCredentials: true
																											},
																											crossDomain: true,
																									data:{
																										workOrderId:workOrderId,
																										materialsDispatch:req2,
																										planUseMaterial:craftBomDetails2
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else {
																											swallFail2();	//操作失败
																										}
																									},

																								})
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})

																				})
																					// 按钮2  调批统计
																				headingMainBtn_2.off("click").on("click",(event)=>{
																					let dataContent = $('#publicSelectModalBox2'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签

																					staffTypeOption = dataContent.find('.pullDownMenu-1'), // 类型选项
																					fuzzySearchGroup = dataContent.find('.fuzzy-search-group') // 模糊搜索组
																					dataContent.find('.panel-title').text('调出统计') // 更换panel标题

																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						panelList.find('thead').empty()
																						panelList.find('tbody').empty()
																					})
																					dataContent.modal('show') // 运行时显示
																					staffTypeOption.hide()
																					fuzzySearchGroup.show()

																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								paginationContainer.show()
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panelList, {
																										thead: {
																											theadContent: '序号/物料名称/规格/型号/供应商/单位/调出数量',
																											theadWidth: '7%/12%/15%/15%/15%/15%/15%'
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
																											],
																
																											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																											dataAddress: function (tbodyTarget, html, result) {
																												tbodyTarget.empty() // 清空表格主体
																												let map = result.map, // 映射zszs
																													dataList = map.planUseMaterials, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].warehouse_material_name;
																																// tempData=
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].warehouse_material_standard;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].warehouse_material_model;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].supplier_name;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].warehouse_material_units;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 6: {
																																tempData = dataList[currentTr.index()].plan_transfer_number;
																																currentTr.children().eq(i).html(tempData)
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
																											totalRow:result.map.planUseMaterials.length , // 总行数
																											displayRow: result.map.planUseMaterials.length // 显示行数
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
																					addTableData(queryMaterialsDispatchStatisticsUrl, {
																						workOrderId:workOrderId,
																						type:"dispatch",
																						headNum: 1
																					});

																					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																						let val = $(this).closest('.input-group').find('input').val()
																						event.stopPropagation() // 禁止向上冒泡
																						addTableData(queryMaterialsDispatchStatisticsUrl, {
																							workOrderId:workOrderId,
																							keyword: val,
																							type:"dispatch",
																							headNum: 1
																						});
																
																					});


																				})

																				// 按钮3  调入管理
																				headingMainBtn_3.off("click").on("click",(event)=>{
																					let dataContent = $('#materielMangeModel2'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3
																					dataContent.find('.modal-title').text('调入管理') // 更换panel标题


																					headingMainBtn_1.show()
																					headingMainBtn_2.hide()
																					headingMainBtn_3.hide()
																					statusTypeOption.hide()
																					fuzzySearchGroup.show()

																					headingMainBtn_1.text("调入统计")
																					
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					// 主表格添加内容
																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",
																							url: url,
																							dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																							data: data,
																							beforeSend: function (xml) {
																								// ajax发送前
																								mesloadBox.loadingShow()
																							},
																							success: function (result, status, xhr) {
																								// ajax成功
																								mesloadBox.hide()
																								if (result.status === 0) {
																									mesVerticalTableAddData(panelList, {
																										thead: {
																											theadContent: '序号/调拨批号/调批生产批号/调批工单号/调批时间/调批人/操作',
																											theadWidth: '6%/15%/15%/15%/15%/10%/18%'
																										},
																										tbody: {
																											html: [
																												'<td></td>',
																												'<td></td>',
																												'<td></td>',
																												'<td></td>',
																												'<td></td>',
																												'<td></td>',
																												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#materielDetail"><i class="fa fa-tasks fa-fw"></i>查看调拨详情</a></td>'
																											],
																
																											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																											dataAddress: function (tbodyTarget, html, result) {
																												tbodyTarget.empty() // 清空表格主体
																												let map = result.map, // 映射zszs
																													dataList = map.materialsDispatchs, // 主要数据列表
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
																																tempData = dataList[currentTr.index()].materials_dispatch_batch_number;
																																// tempData=
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 2: {
																																tempData = dataList[currentTr.index()].accept_plan_control_number;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 3: {
																																tempData = dataList[currentTr.index()].work_order_number;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																															case 4: {
																																tempData = dataList[currentTr.index()].materials_dispatch_time;
																																currentTr.children().eq(i).html((moment(tempData).format('YYYY-MM-DD HH:mm:ss')))
																															}
																																break;
																															case 5: {
																																tempData = dataList[currentTr.index()].materials_dispatch_staff;
																																currentTr.children().eq(i).html(tempData)
																															}
																																break;
																														
																															case 6:
																																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																	materialsDispatchId = dataList[currentTr.index()].materials_dispatch_id;
																																	switch (dataContent) {
																																		case '#materielDetail': {	
																																				let dataContent = $('#materielDetail'),
																																				panelList = dataContent.find('.panel'),
																																				panel_1 = panelList.eq(0)
																																				panel_2 = panelList.eq(1)
																																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																				modalSubmitBtn = dataContent.find('.modal-submit')
																																				modalSubmitBtn_2 = dataContent.find('.modal-submit2')
																																				panelThead = panelList.find('thead'),
																																				panelTbody = panelList.find('tbody'),
																																				barCodeText = panel_1.find('.panel-heading').find('.barCode')
																
																																				dataContent.find('.modal-header').find('.modal-title').text('调批详情') // 更换panel标题
																																				panel_1.find('.panel-heading').find('.panel-title').text('工单信息') // 更换panel标题
																																				panel_2.find('.panel-heading').find('.panel-title').text('调入物料信息') // 更换panel标题

																																				// 主表格1添加内容，基础信息部分
																																				dataContent.modal({
																																					backdrop: false, // 黑色遮罩不可点击
																																					keyboard: false,  // esc按键不可弃用模态框
																																					show: false
																																				})
																																				dataContent.modal('show') // 运行时显示

																																				modalSubmitBtn.hide()
																																				modalSubmitBtn_2.hide()
																																				barCodeText.hide()

																																				dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																					$('body').addClass('modal-open')
																																				})
																																		
																																				modalCloseBtn.off('click').on('click', (event) => {
																																					// 点击弃用按钮隐藏该模态框
																																					dataContent.modal('hide')
																																					// 初始化表格
																																					panel_2.find('thead').empty()
																																					panel_2.find('tbody').empty()
																																				})
																
																																				// 主表格添加内容
																																				function addTableData(url, data) {
																																					$.ajax({
																																						type: "POST",
																																						url: url,
																																						dataType: "json",
																																						　　 xhrFields: {
																																										withCredentials: true
																																								},
																																								crossDomain: true,
																																						data: data,
																																						beforeSend: function (xml) {
																																							// ajax发送前
																																							mesloadBox.loadingShow()
																																						},
																																						success: function (result, status, xhr) {
																																							// ajax成功
																																							mesloadBox.hide()
																																							if (result.status === 0) {
																																								mesHorizontalTableAddData(panel_1.find('table'), null, {
																																									thead: '调出批号/调批人/调批时间/调出生产批号/调出工单号/调出工单负责人/调入生产批号/调入工单号/调入负责人/调出说明/创建时间/创建人',
																																									tableWitch: '10%/10%/10%',
																																									viewColGroup: 3,
																																									importStaticData: (tbodyTd, length) => {
																																										let map = result.map, // 映射
																																										dataList = map.materialsDispatchs[0][0], // 主要数据列表
																																										tempData = null; // 表格td内的临时数据
																																										for (let i = 0, len = length; i < len; i++){
																																											switch (i) {																								
																																												case 0: {
																																													tempData = dataList.materials_dispatch_batch_number;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 1: {
																																													tempData = dataList.materials_dispatch_staff;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 2: {
																																													tempData = dataList.materials_dispatch_time;
																																													tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																												}
																																													break;
																																												case 3: {
																																													tempData = dataList.production_plan_batch_number;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 4: {
																																													tempData = dataList.work_order_number;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 5: {
																																													tempData = dataList.work_order_responsible;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 6: {
																																													tempData = dataList.accept_plan_control_number;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 7: {
																																													tempData = dataList.accept_work_order_number;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 8: {
																																													tempData = dataList.accept_work_order_responsible_staff;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 9: {
																																													tempData = dataList.materials_dispatch_explain;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												case 10: {
																																													tempData = dataList.materials_dispatch_creation_time;
																																													tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																												}
																																													break;
																																												case 11: {
																																													tempData = dataList.materials_dispatch_creation_staff;
																																													tbodyTd.eq(i).html(tempData)
																																												}
																																													break;
																																												default:
																																													break;
																																											}
																																										}
																																									}
																																								});
		
																																								mesVerticalTableAddData(panel_2, {
																																									thead: {
																																										theadContent: '序号/物料名称/物料型号/物料规格/供应商/单位/调入数量/查看物料编号/备注',
																																										theadWidth: '8%/10%/10%/10%/10%/10%/10%/10%/15%'
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
																																											let map = result.map, // 映射zszs
																																											dataList = map.materialsDispatchs[1], // 主要数据列表
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
																																															tempData = dataList[currentTr.index()].warehouse_material_name;
																																															currentTr.children().eq(i).html(tempData)
																																														}
																																															break;
																																														case 2: {
																																															tempData = dataList[currentTr.index()].warehouse_material_standard;
																																															currentTr.children().eq(i).html(tempData)
																																														}
																																															break;
																																														case 3: {
																																															tempData = dataList[currentTr.index()].warehouse_material_model;
																																															currentTr.children().eq(i).html(tempData)
																																														}
																																															break;
																																														case 4: {
																																															tempData = dataList[currentTr.index()].supplier_name;
																																															currentTr.children().eq(i).html(tempData)
																																														}
																																															break;
																																														case 5: {
																																															tempData = dataList[currentTr.index()].warehouse_material_units;
																																															currentTr.children().eq(i).html(tempData)
																																														}
																																															break;
																																														case 6: {
																																															tempData = dataList[currentTr.index()].plan_quantity_received;
																																															currentTr.children().eq(i).html(tempData)
																																														}
																																															break;
																																														case 7: {
																																															tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																															currentTr.children().eq(i).addClass("table-input-td")
																																															currentTr.children().eq(i).html(tempData)
																																															let 	materialId = dataList[currentTr.index()].plan_quotes_material_id;
		
																																															currentTr.children().eq(i).off("click").on("click","a", function(){
																																																let dataContent = $('#publicSelectModalBox'),
																																																panelModal1 = dataContent.find('.panel'),
																																																modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																																statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																																fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																																paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																																activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																																panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																																// ProductTypeList = [],
																																																mesloadBox = new MesloadBox(panelModal1, {
																																																	// 主数据载入窗口
																																																	warningContent: '没有此类信息，请重新选择或输入'
																																																});
		
																																																dataContent.modal({
																																																	backdrop: false, // 黑色遮罩不可点击
																																																	keyboard: false,  // esc按键不可弃用模态框
																																																	show: false
																																																})
																																																dataContent.modal("show")
																																								
																																																panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																																dataContent.find(".panel-title").text("编号详情")
																																															
																																																statusOption.hide()
																																																fuzzySearchGroup.hide()
		
																																																modalCloseBtn.off('click').on('click', (event) => {
																																																	// 点击弃用按钮隐藏该模态框
																																																	dataContent.modal('hide')
																																																	panelModal1.find('thead').empty()
																																																	panelModal1.find('tbody').empty()
																																																	// 初始化表格
																																																
																																																})
																																															
																																																// 模态框表格增加内容
																																																function addModalTableData(url, data) {
																																																	$.ajax({
																																																		type: "POST",
																																																		dataType: "json",
																																																　　 xhrFields: {
																																																				withCredentials: true
																																																		},
																																																		crossDomain: true,
																																																		url: url,
																																																		data: data,
																																																		beforeSend: function (xml) {
																																																			// ajax发送前
																																																			mesloadBox.loadingShow()
																																																		},
																																																		success: function (result, status, xhr) {
																																																			// ajax成功
																																																			mesloadBox.hide()
																																																			paginationContainer.show()	//隐藏分页按钮
																																																			if (result.status === 0) {
																																																				mesVerticalTableAddData(panelModal1, {
																																																					thead: {
																																																						theadContent: '序号/物料编号/编号类型',
																																																						theadWidth: '8%/20%/8%'
																																																					},
																																																					tbody: {
																																																						html: [
																																																							'<td></td>',
																																																							'<td></td>',
																																																							'<td></td>'
																																																						],
																																																						// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																						dataAddress: function (tbodyTarget, html, result) {
																																																							let map = result.map, // 映射
																																																								dataList = result.map.materialNumbers, // 主要数据列表
																																																								tempData = ''; // 表格td内的临时数据
																																																								tbodyTarget.empty() // 清空表格主体
																																																								console.log(dataList)
																																									
																																																							for (let i = 0, len = dataList.length; i < len; i++) {
																																																								tbodyTarget.append('<tr></tr>'); // 添加行
																																																								let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																								for (let i = 0, len = html.length; i< len; i++) {
																																																									currentTr.append(html[i]); // 添加表格内的HTML
																																																									switch (i) {
																																																										case 0:{
																																																											currentTr.children().eq(i).html(currentTr.index() + 1)
																																																										}
																																																											break;
																																																										case 1: {
																																																											tempData = dataList[currentTr.index()].number_number
																																																											currentTr.children().eq(i).html(tempData)
																																																										}
																																																											break;
																																																										case 2: {
																																																											tempData = dataList[currentTr.index()].number_number_type
																																																											currentTr.children().eq(i).html(tempData)
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
																																																						totalRow: result.map.materialNumbers.length, // 总行数
																																																						displayRow: result.map.materialNumbers.length// 显示行数
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
		
																																														
																																																addModalTableData(queryMaterialsDispatchBindingMaterialNumberUrl, {
																																																	materialId: materialId,
																																																	headNum: 1,
																																																});
																																															})
																																														}
																																															break;
																																														case 8: {
																																															tempData = dataList[currentTr.index()].plan_quotes_material_describe;
																																															currentTr.children().eq(i).html(tempData)
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
																																										totalRow: result. map.materialsDispatchs[1].length, // 总行数
																																										displayRow: result. map.materialsDispatchs[1].length // 显示行数
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
																																				addTableData(queryMaterialsDispatchParticularsUrl, {
																																					materialsDispatchId:materialsDispatchId
																																				});
																																				break;
																																		}
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
																											totalRow:result.map.materialsDispatchs.length, // 总行数
																											displayRow: result.map.materialsDispatchs.length // 显示行数
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
																					addTableData(queryMaterialsDispatchOutlineUrl, {
																						workOrderId:workOrderId,
																						type:"ferDispatch",
																						headNum: 1
																					});
																					// 按钮1  调入统计
																					headingMainBtn_1.off("click").on("click",(event)=>{
																						let dataContent = $('#publicSelectModalBox2'),
																						panelList = dataContent.find('.panel'),
																						modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																						panelThead = panelList.find('thead'),
																						panelTbody = panelList.find('tbody'),
																						paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
	
																						staffTypeOption = dataContent.find('.pullDownMenu-1'), // 类型选项
																						fuzzySearchGroup = dataContent.find('.fuzzy-search-group') // 模糊搜索组
																						dataContent.find('.panel-title').text('调出统计') // 更换panel标题
	
																						dataContent.modal({
																							backdrop: false, // 黑色遮罩不可点击
																							keyboard: false,  // esc按键不可弃用模态框
																							show: false
																						})
																						modalCloseBtn.off('click').on('click', (event) => {
																							// 点击弃用按钮隐藏该模态框
																							dataContent.modal('hide')
																							// 初始化表格
																							panelList.find('thead').empty()
																							panelList.find('tbody').empty()
																						})
																						dataContent.modal('show') // 运行时显示
																						staffTypeOption.hide()
																						fuzzySearchGroup.show()
	
																						function addTableData(url, data) {
																							$.ajax({
																								type: "POST",
																								url: url,
																								dataType: "json",
																								　　 xhrFields: {
																												withCredentials: true
																										},
																										crossDomain: true,
																								data: data,
																								beforeSend: function (xml) {
																									// ajax发送前
																									mesloadBox.loadingShow()
																								},
																								success: function (result, status, xhr) {
																									paginationContainer.show()
																									// ajax成功
																									mesloadBox.hide()
																									if (result.status === 0) {
																										mesVerticalTableAddData(panelList, {
																											thead: {
																												theadContent: '序号/物料名称/规格/型号/供应商/单位/调入数量',
																												theadWidth: '7%/12%/15%/15%/15%/15%/15%'
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
																												],
																	
																												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																												dataAddress: function (tbodyTarget, html, result) {
																													tbodyTarget.empty() // 清空表格主体
																													let map = result.map, // 映射zszs
																														dataList = map.planUseMaterials, // 主要数据列表
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
																																	tempData = dataList[currentTr.index()].warehouse_material_name;
																																	// tempData=
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 2: {
																																	tempData = dataList[currentTr.index()].warehouse_material_standard;
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 3: {
																																	tempData = dataList[currentTr.index()].warehouse_material_model;
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 4: {
																																	tempData = dataList[currentTr.index()].supplier_name;
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 5: {
																																	tempData = dataList[currentTr.index()].warehouse_material_units;
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 6: {
																																	tempData = dataList[currentTr.index()].plan_transfer_number;
																																	currentTr.children().eq(i).html(tempData)
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
																												totalRow:result.map.planUseMaterials.length , // 总行数
																												displayRow: result.map.planUseMaterials.length // 显示行数
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
																						addTableData(queryMaterialsDispatchStatisticsUrl, {
																							workOrderId:workOrderId,
																							type:"sufferDispatch",
																							headNum: 1
																						});
	
																						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																							let val = $(this).closest('.input-group').find('input').val()
																							event.stopPropagation() // 禁止向上冒泡
																							addTableData(queryMaterialsDispatchStatisticsUrl, {
																								workOrderId:workOrderId,
																								keyword: val,
																								type:"sufferDispatch",
																								headNum: 1
																							});
																	
																						});
	
	
																					})


																				})
																					
																				break;
																			}
																			case '#outputManage': {	//产出物管理
																				let dataContent = $('#materielMangeModel'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					fuzzySearchGroup = panelList.find('.fuzzy-search-group'), // 模糊搜索组
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3

																					dataContent.find('.modal-title').text('产出物管理') // 更换panel标题

																					
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					headingMainBtn_1.text("新增产出物")
																					headingMainBtn_2.text("产出物统计")
																					headingMainBtn_1.show()
																					headingMainBtn_2.show()
																					headingMainBtn_3.hide()
																					statusTypeOption.hide()
																					fuzzySearchGroup.show()

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							// ajax发送前
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							// ajax成功
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/产出批号/产出物型号/产出数量/生产班次/产出时间/记录人/操作',
																										theadWidth: '6%/12%/12%/12%/12%/16%/12%/18%'
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
																											'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#materielDetail"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射zszs
																												dataList = map.productElementBatchs, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].product_element_batch_number;
																															// tempData=
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																														//	tempData = dataList[currentTr.index()].semi_finish_genre;
																															currentTr.children().eq(i).html(semiFinishGenre)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].product_element_batch_quantity;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].product_element_batch_production_shift;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].product_element_batch_time;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																														}
																															break;
																														case 6: {
																															tempData = dataList[currentTr.index()].product_element_batch_record_name;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																													
																														case 7:
																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																productElementBatchId = dataList[currentTr.index()].product_element_batch_id;
																																switch (dataContent) {
																																	case '#materielDetail': {	//详情
																																			let dataContent = $('#CreateRequisitions4'),
																																			panelList = dataContent.find('.panel'),
																																			modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																			modalSubmitBtn = dataContent.find('.modal-submit')
																																			panelThead = panelList.find('thead'),
																																			panelTbody = panelList.find('tbody'),
																																			barCodeText = 	panelList.find('.panel-heading').find('.barCode')

																																			panelList.find('.panel-heading').find('.panel-title').text('产出详情') // 更换panel标题

																																			// 主表格1添加内容，基础信息部分
																																			dataContent.modal({
																																				backdrop: false, // 黑色遮罩不可点击
																																				keyboard: false,  // esc按键不可弃用模态框
																																				show: false
																																			})
																																			dataContent.modal('show') // 运行时显示
																																			modalSubmitBtn.hide()
																																			dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																				$('body').addClass('modal-open')
																																			})
																																	
																																			modalCloseBtn.off('click').on('click', (event) => {
																																				// 点击弃用按钮隐藏该模态框
																																				dataContent.modal('hide')
																																				// 初始化表格
																																				panelList.find('thead').empty()
																																				panelList.find('tbody').empty()
																																			})
															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panelList.find('table'), null, {
																																							thead: '产出批号/记录人/生产班次/产出物名称/产出物类型/产出物型号/产出数量/单位/产出物编号/产出时间/创建时间/创建人/备注',
																																							tableWitch: '2%/3%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.productElementBatch, // 主要数据列表
																																								tempData = null; // 表格td内的临时数据
																																								barCodeText.val("NO:" +  dataList.product_element_batch_barcode).attr("readonly",true)

																																								for (let i = 0, len = length; i < len; i++){
																																									switch (i) {																								
																																										case 0: {
																																											tempData = dataList.product_element_batch_number;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 1: {
																																											tempData = dataList.product_element_batch_record_name;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList.product_element_batch_production_shift;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList.semi_finish_name;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 4: {
																																											//tempData = dataList.semi_finish_type_name;
																																											tbodyTd.eq(i).html(semiFinishTypeName)
																																										}
																																											break;
																																										case 5: {
																																											//tempData = dataList.semi_finish_genre;
																																											tbodyTd.eq(i).html(semiFinishGenre)
																																										}
																																											break;
																																										case 6: {
																																											tempData = dataList.product_element_batch_quantity;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 7: {
																																											tempData = dataList.product_element_batch_unit;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 8: {
																																											tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																											tbodyTd.eq(i).addClass("table-input-td")
																																											tbodyTd.eq(i).html(tempData)

																																											tbodyTd.eq(i).off("click").on("click","a", function(){
																																												let dataContent = $('#publicSelectModalBox'),
																																												panelModal1 = dataContent.find('.panel'),
																																												modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																												statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																												fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																												paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																												activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																												panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																												// ProductTypeList = [],
																																												mesloadBox = new MesloadBox(panelModal1, {
																																													// 主数据载入窗口
																																													warningContent: '没有此类信息，请重新选择或输入'
																																												});

																																												dataContent.modal({
																																													backdrop: false, // 黑色遮罩不可点击
																																													keyboard: false,  // esc按键不可弃用模态框
																																													show: false
																																												})
																																												dataContent.modal("show")
																																				
																																												panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																												dataContent.find(".panel-title").text("编号详情")
																																											
																																												statusOption.hide()
																																												fuzzySearchGroup.hide()

																																												modalCloseBtn.off('click').on('click', (event) => {
																																													// 点击弃用按钮隐藏该模态框
																																													dataContent.modal('hide')
																																													panelModal1.find('thead').empty()
																																													panelModal1.find('tbody').empty()
																																													// 初始化表格
																																												
																																												})
																																											
																																												// 模态框表格增加内容
																																												function addModalTableData(url, data) {
																																													$.ajax({
																																														type: "POST",
																																														dataType: "json",
																																												　　 xhrFields: {
																																																withCredentials: true
																																														},
																																														crossDomain: true,
																																														url: url,
																																														data: data,
																																														beforeSend: function (xml) {
																																															// ajax发送前
																																															mesloadBox.loadingShow()
																																														},
																																														success: function (result, status, xhr) {
																																															// ajax成功
																																															mesloadBox.hide()
																																															paginationContainer.show()	//隐藏分页按钮
																																															if (result.status === 0) {
																																				
																																																mesVerticalTableAddData(panelModal1, {
																																																	thead: {
																																																		theadContent: '序号/产出物编号/编号类型',
																																																		theadWidth: '8%/20%/8%'
																																																	},
																																																	tbody: {
																																																		html: [
																																																			'<td></td>',
																																																			'<td></td>',
																																																			'<td></td>'
																																																		],
																																				
																																																		// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																		dataAddress: function (tbodyTarget, html, result) {
																																																			let map = result.map, // 映射
																																																				dataList = result.map.productElementNumbers, // 主要数据列表
																																																				tempData = ''; // 表格td内的临时数据
																																																				tbodyTarget.empty() // 清空表格主体
																																					
																																					
																																																			for (let i = 0, len = dataList.length; i < len; i++) {
																																																				tbodyTarget.append('<tr></tr>'); // 添加行
																																																				let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																				for (let i = 0, len = html.length; i< len; i++) {
																																																					currentTr.append(html[i]); // 添加表格内的HTML
																																																					switch (i) {
																																																						case 0:
																																																							currentTr.children().eq(i).html(currentTr.index() + 1)
																																																							break;
																																																						case 1: {
																																																							tempData = dataList[currentTr.index()].number_number
																																																							currentTr.children().eq(i).html(tempData)
																																																						}
																																																							break;
																																																						case 2: {
																																																							tempData = dataList[currentTr.index()].number_number_type
																																																							currentTr.children().eq(i).html(tempData)
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
																																																		totalRow: result.map.productElementNumbers.length, // 总行数
																																																		displayRow: result.map.productElementNumbers.length// 显示行数
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

																																										
																																												addModalTableData(queryProductElementBatchBindingNumberUrl, {
																																													productElementBatchId: productElementBatchId,
																																													headNum: 1,
																																												});
																																											})
																																										}
																																											break;
																																										case 9: {
																																											tempData = dataList.product_element_batch_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 10: {
																																											tempData = dataList.product_elemen_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																										}
																																											break;
																																										case 11: {
																																											tempData = dataList.process_produce_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 12: {
																																											tempData = dataList.process_produce_transfer_explain;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										default:
																																											break;
																																									}
																																								}
																																							}
																																						});

															
																																					}
																																					else {
																																						mesloadBox.warningShow();
																																					}
																																				}
																																			})
																																		}
															
																																		// 导航栏点击时运行数据加载
																																		addTableData(queryProductElementBatchParticularsUrl, {
																																			productElementBatchId: productElementBatchId
																																		});
																																		
																																		break;
																																	}
																																	case '#delete' :{
																																		swal({
																																			title: '您确定要删除吗？',
																																			type: 'question',
																																			showCancelButton: true,
																																			confirmButtonText: '确定',
																																			cancelButtonText: '取消'
																																		}).then(function (){
																																			$.ajax({
																																				type: "POST",
																																				url:removeProductElementBatchUrl,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: {
																																					productElementBatchId:productElementBatchId,
																																				},
																																				success: function (result, status, xhr) {
																																					if (result.status === 0) {
																																						let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																																					}else {
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
																																				},
																																			})
																																		})
																																		break;
																																	}
															
															
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
																										totalRow:result.map.productElementBatchs.length, // 总行数
																										displayRow: result.map.productElementBatchs.length // 显示行数
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
																				addTableData(queryProductElementBatchOutlineUrl, {
																					workOrderId:workOrderId,
																					headNum:1
																				});
																		
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					let val = $(this).closest('.input-group').find('input').val()
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryProductElementBatchOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						headNum:1
																					});
																				});

																				// 头部主要按钮1点击事件 新增产出物
																				headingMainBtn_1.off('click').on('click', (event) => {
																					let dataContent = $('#CreateRequisitions4'),
																					panelModal1 = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent.find('.modal-submit'),
																					req={
																						product_element_batch_barcode:"",//产出物批次条码
																						product_element_batch_number:"",//产出物批号
																						product_element_batch_record_name:"",//记录人
																						product_element_batch_record_name_id:"",//记录人
																						product_element_batch_production_shift:"",//生产班次
																						product_element_batch_production_shift_id:"",//生产班次id
																						product_element_batch_quantity:"",//产出数量
																						product_element_batch_time:"",//产出时间
																						process_produce_creation_staff:"",//创建人id
																						process_produce_creation_staff_id:"",//创建人id
																						process_produce_transfer_explain:"",//说明
																						semi_finish_name:"",//产出物名称（半成品）
																						semi_finish_id:"",//产出物id（半成品id）
																						semi_finish_type_name:"",//产出物类型（半成品类型）
																						semi_finish_type_id:"",//产出物类型id（半成品类型id）
																						semi_finish_genre:"",//产出物型号（半成品型号）
																						numRecordList:[]
																					},
																					codeList=[]

																					req.process_produce_creation_staff = USERNAME
																					req.process_produce_creation_staff_id = USERID

																					req.semi_finish_name = semiFinishName
																					req.semi_finish_id = semiFinishId
																					req.semi_finish_type_name = semiFinishTypeName
																					req.semi_finish_type_id = semiFinishTypeId
																					req.semi_finish_genre = semiFinishGenre

																					panelModal1.find(".barCode").val("").attr("placeholder","产出物批次条码录入").attr("readonly",false)
																					panelModal1.find(".barCode").off('blur').on('blur', (event) => {
																						req.product_element_batch_barcode =	panelModal1.find(".barCode").val()
																					})

																						
																					panelModal1.find('.panel-heading').find('.panel-title').text('新增产出物') // 更换panel标题
																					panelModal1.find(".barCode").attr("placeholder","产出物批次条码")

																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示
																					dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})

																					modalSubmitBtn.show()
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						dataContent.find('thead').empty()
																						dataContent.find('tbody').empty()
																					})

																					mesHorizontalTableAddData(panelModal1.find('table'), null, {
																						thead: '产出批号/记录人员/生产班次/产出物名称/产出物类型/产出物型号/产出数量/单位/绑定产出物编号/产出时间/备注',
																						tableWitch: '2%/3%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							let inputHtml;

																							for (let i = 0, len = length; i < len; i++) {
																								switch (i) {
																									case 0: {
																										$.ajax({
																											type: "POST",
																											url: generateProcessManageBatchNumberUrl,
																											dataType: "json",
																											　　 xhrFields: {
																															withCredentials: true
																													},
																													crossDomain: true,
																											data:{
																												type:"artifact",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number = result.data
																													tbodyTd.eq(i).html(number)
																													req.product_element_batch_number = number
																												}
																											}
																										})
																										break;
																									}
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												req.product_element_batch_record_name_id  = resolveData.roleStaffId
																												req.product_element_batch_record_name = resolveData.roleStaffName
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																										break;
																									}
																									case 2: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectClassesAddData(resolve)
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.className)
																												req.product_element_batch_production_shift_id  = resolveData.classId
																												req.product_element_batch_production_shift  = resolveData.className
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																										break;
																									}
																									case 3: {
																									
																										tbodyTd.eq(i).html(semiFinishName)
																										break;
																									}

																									case 4: {
																										tbodyTd.eq(i).html(semiFinishTypeName)
																										break;
																									}
																									case 5: {
																										tbodyTd.eq(i).html(semiFinishGenre)

																										break;
																									}
																									case 6: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.product_element_batch_quantity = tbodyTd.eq(i).find('input').val()
																										})

																										break;
																									}
																									case 7: {
																										tbodyTd.eq(i).html(semiFinishUnit)
																										break;
																									}
																									case 8: {
																										tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>添加编号</a>`
																										tbodyTd.eq(i).addClass("table-input-td")
																										tbodyTd.eq(i).html(tempData)

																										// 添加编号
																										tbodyTd.eq(i).off("click").on("click","a", function(){
																											let dataContent = $('#addCode'),
																											panelList = dataContent.find('.panel'),
																											panelTbody = panelList.find('table tbody'),	// 面板表格
																											modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																											headBtn = dataContent.find('.head-main-btn-1'),
																											modalSubmitBtn = dataContent.find('.modal-submit')

																										
																											dataContent.modal('show') // 运行时显示
																											dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																												$('body').addClass('modal-open')
																											})

																											modalCloseBtn.off('click').on('click', (event) => {
																												// 点击弃用按钮隐藏该模态框
																												dataContent.modal('hide')
																												// 初始化表格
																												panelList.find('thead').empty()
																												panelList.find('tbody').empty()
																											})
																											if(codeList.length!==0){
																												let html=""
																												for(var i=0;i<codeList.length;i++){
																													html+=`
																													<tr>
																														<td >${i+1}</td>
																														<td class="table-input-td">
																															<input type="text" class="table-input projectPrincipal" value=${codeList[i]} >
																														</td>
																														<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`
																												}
																												panelTbody.append(html)
																											}else{
																												headBtn.trigger('click')
																											}


																											headBtn.off('click').on('click', (event) => {
																												let temStr = `
																													<tr>
																															<td ></td>
																															<td class="table-input-td">
																																<input type="text" class="table-input projectPrincipal" placeholder="请输入编号" />
																															</td>
																															<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`;
																												panelTbody.append(temStr)
						
																												let  tr=panelList.find('tbody tr');
																												for(let i = 0;i<tr.length;i++){
																													panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																													;
																												}
						
																												panelList.on('click', '.delete', function () {
																													$(this).closest('tr').remove();  //移除该行元素
																													for(let i = 0;i<tr.length;i++){
																														panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																														;
																													}
																												})
																											})

																											modalSubmitBtn.off('click').on('click', (event) => {
																												let codeListPanel = panelTbody.find('tr')
																												for(let i = 0;i<codeListPanel.length;i++){
																													let temp = codeListPanel.eq(i).find('td:nth-child(2)').find("input").val()
																													codeList[i] = temp
																												}
																													console.log(codeList)
																												if (codeList.length!==0
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
																														modalCloseBtn.trigger('click')
																													});
																												}
																												else {
																													swallError();	//格式不正确
																												}
																											})		
																											
																										})

																										break;
																									}
																									case 9: {
																										inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										// 添加到提交数据
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.product_element_batch_time = tbodyTd.eq(i).find('input').val()
																										})


																										break;
																									}
																									case 10: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.process_produce_transfer_explain = tbodyTd.eq(i).find('input').val()
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
																						req.numRecordList =codeList
																						let req2
																						if(typeof req !== 'string'){
																							req2=JSON.stringify(req)
																						}
																					
																						if (req.product_element_batch_barcode !== '') {
																							swal({
																								title: '您确定要提交本次操作吗?',
																								text: '请确保填写信息无误后点击确定按钮',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							}).then(function () {

																								$.ajax({
																									type: "POST",
																									url: saveProductElementBatchUrl,
																									dataType: "json",
																									　　 xhrFields: {
																													withCredentials: true
																											},
																											crossDomain: true,
																									data:{
																										workOrderId:workOrderId,
																										productElementBatchStr:req2
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {

																											let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else if(result.status === 7){
																											repeatFail()
																										}
																										else {
																											swallFail();	//操作失败
																											alert(result.msg)
																										}
																									},

																								})
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})

																				})
																				// 按钮2  产出统计
																				headingMainBtn_2.off('click').on('click', (event) => {
																					let dataContent = $('#submitModelModal2'),
																						panelModal1 = dataContent.find('.panel'),
																						modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																						modalSubmittn = dataContent.find('.modal-footer').find('.modal-submit'),
																						statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																						fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																						// ProductTypeList = [],
																						mesloadBox = new MesloadBox(panelModal1, {
																							// 主数据载入窗口
																							warningContent: '没有此类信息，请重新选择或输入'
																						});
																						dataContent.find(".panel-title").text("产出物统计")


																						dataContent.modal({
																							backdrop: false, // 黑色遮罩不可点击
																							keyboard: false,  // esc按键不可弃用模态框
																							show: false
																						})
																						modalCloseBtn.off('click').on('click', (event) => {
																							// 点击弃用按钮隐藏该模态框
																							dataContent.modal('hide')
																							// 初始化表格
																							panelModal1.find('thead').empty()
																							panelModal1.find('tbody').empty()
																						})
																						dataContent.modal('show') // 运行时显示

																						statusOption.hide()
																						fuzzySearchGroup.hide()
																						modalSubmittn.hide()

																						// 模态框表格增加内容
																						function addTableData(url, data) {
																							$.ajax({
																								type: "POST",
																								url: url,
																								dataType: "json",
																								　　 xhrFields: {
																												withCredentials: true
																										},
																										crossDomain: true,
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
																												theadContent: '产出物名称/产出物类型/产出物型号/产出物数量/单位',
																												theadWidth: '15%/18%/20%/20%/25%'
																											},
																											tbody: {
																												html: [
																													'<td></td>',
																													'<td></td>',
																													'<td></td>',
																													'<td></td>',
																													'<td></td>',

																												],

																												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																												dataAddress: function (tbodyTarget, html, result) {
																													let map = result.map, // 映射
																														dataList = result.map.productElementBatchStatistics, // 主要数据列表
																														tempData = ''; // 表格td内的临时数据
																													// ProductTypeList = dataList;
																													tbodyTarget.empty() // 清空表格主体
															
															
																													for (let i = 0, len = 1; i < len; i++) {
																														tbodyTarget.append('<tr></tr>'); // 添加行
																														let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																														for (let i = 0, len = html.length; i< len; i++) {
																															currentTr.append(html[i]); // 添加表格内的HTML
																															switch (i) {
																																case 0:{
																																	tempData = dataList.semi_finish_name
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 1: {
																																//	tempData = dataList.semi_finish_type_name
																																	currentTr.children().eq(i).html(semiFinishTypeName)
																																}
																																	break;
																																case 2: {
																																//	tempData = dataList.semi_finish_genre
																																	currentTr.children().eq(i).html(semiFinishGenre)
																																}
																																	break;
																																case 3: {
																																	tempData = dataList.product_element_batch_quantity
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 4: {
																																	tempData = dataList.product_element_batch_unit
																																	currentTr.children().eq(i).html(tempData)
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
																												totalRow: 1, // 总行数
																												displayRow: 1// 显示行数
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

																						addTableData(queryProductElementBatchStatisticsUrl, {
																							workOrderId:workOrderId,
																						});
																				})
																					
																				break;
																			}
																			case '#BatchTransfer': {	//批次转出
																				let dataContent = $('#materielMangeModel'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					fuzzySearchGroup = panelList.find('.fuzzy-search-group'), // 模糊搜索组
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3

																					dataContent.find('.modal-title').text('批次转出管理') // 更换panel标题

																					
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					headingMainBtn_1.text("新增批次转出")
																					headingMainBtn_2.text("转出统计")
																					headingMainBtn_1.show()
																					headingMainBtn_2.show()
																					headingMainBtn_3.hide()
																					statusTypeOption.hide()
																					fuzzySearchGroup.show()

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							// ajax发送前
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							// ajax成功
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/转出批号/产出物型号/转出数量/转入区域/转出时间/记录人/操作',
																										theadWidth: '3%/20%/12%/8%/12%/16%/12%/15%'
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
																											'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#materielDetail"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射zszs
																												dataList = map.batchCareOfs, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].batch_care_of_number;
																															// tempData=
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															//tempData = dataList[currentTr.index()].semi_finish_genre;
																															currentTr.children().eq(i).html(semiFinishTypeName)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].batch_care_of_quantity;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].batch_care_of_transfer_region;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].batch_care_of_time;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																														}
																															break;
																														case 6: {
																															tempData = dataList[currentTr.index()].batch_care_of_record_staff;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																													
																														case 7:
																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																batchCareOfId = dataList[currentTr.index()].batch_care_of_id;
																																switch (dataContent) {
																																	case '#materielDetail': {	//详情
																																			let dataContent = $('#CreateRequisitions4'),
																																			panelList = dataContent.find('.panel'),
																																			modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																			modalSubmitBtn = dataContent.find('.modal-submit')
																																			panelThead = panelList.find('thead'),
																																			panelTbody = panelList.find('tbody'),
																																			barCodeText = 	panelList.find('.panel-heading').find('.barCode')

															
																																			panelList.find('.panel-heading').find('.panel-title').text('批次转出详情') // 更换panel标题

																																			// 主表格1添加内容，基础信息部分
																																			dataContent.modal({
																																				backdrop: false, // 黑色遮罩不可点击
																																				keyboard: false,  // esc按键不可弃用模态框
																																				show: false
																																			})
																																			dataContent.modal('show') // 运行时显示
																																			modalSubmitBtn.hide()
																																			dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																				$('body').addClass('modal-open')
																																			})
																																	
																																			modalCloseBtn.off('click').on('click', (event) => {
																																				// 点击弃用按钮隐藏该模态框
																																				dataContent.modal('hide')
																																				// 初始化表格
																																				panelList.find('thead').empty()
																																				panelList.find('tbody').empty()
																																			})
															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panelList.find('table'), null, {
																																							thead: '转出批号/记录人/转入区域/产出物名称/产出物类型/产出物型号/转出数量/单位/产出物编号/转出时间/转出说明/创建时间/创建人',
																																							tableWitch: '2%/3%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.batchCareOf, // 主要数据列表
																																								tempData = null; // 表格td内的临时数据
																																								barCodeText.val("NO:" +  dataList.batch_care_of_barcode).attr("readonly",true)

																																								for (let i = 0, len = length; i < len; i++){
																																									switch (i) {																								
																																										case 0: {
																																											tempData = dataList.batch_care_of_number;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 1: {
																																											tempData = dataList.batch_care_of_record_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList.batch_care_of_transfer_region;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 3: {
																																										//	tempData = dataList.semi_finish_name;
																																											tbodyTd.eq(i).html(semiFinishName)
																																										}
																																											break;
																																										case 4: {
																																											//tempData = dataList.semi_finish_type_name;
																																											tbodyTd.eq(i).html(semiFinishTypeName)
																																										}
																																											break;
																																										case 5: {
																																										//	tempData = dataList.semi_finish_genre;
																																											tbodyTd.eq(i).html(semiFinishGenre)
																																										}
																																											break;
																																										case 6: {
																																											tempData = dataList.batch_care_of_quantity;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 7: {
																																										//	tempData = dataList.batch_care_of_unit;
																																											tbodyTd.eq(i).html(semiFinishUnit)
																																										}
																																											break;
																																										case 8: {
																																											tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																											let batchCareOfId = dataList.batch_care_of_id;
																																											tbodyTd.eq(i).addClass("table-input-td")
																																											tbodyTd.eq(i).html(tempData)

																																											tbodyTd.eq(i).off("click").on("click","a", function(){
																																												let dataContent = $('#publicSelectModalBox'),
																																												panelModal1 = dataContent.find('.panel'),
																																												modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																												statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																												fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																												paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																												activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																												panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																												// ProductTypeList = [],
																																												mesloadBox = new MesloadBox(panelModal1, {
																																													// 主数据载入窗口
																																													warningContent: '没有此类信息，请重新选择或输入'
																																												});

																																												dataContent.modal({
																																													backdrop: false, // 黑色遮罩不可点击
																																													keyboard: false,  // esc按键不可弃用模态框
																																													show: false
																																												})
																																												dataContent.modal("show")
																																				
																																												panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																												dataContent.find(".panel-title").text("编号详情")
																																											
																																												statusOption.hide()
																																												fuzzySearchGroup.hide()

																																												modalCloseBtn.off('click').on('click', (event) => {
																																													// 点击弃用按钮隐藏该模态框
																																													dataContent.modal('hide')
																																													panelModal1.find('thead').empty()
																																													panelModal1.find('tbody').empty()
																																													// 初始化表格
																																												
																																												})
																																											
																																												// 模态框表格增加内容
																																												function addModalTableData(url, data) {
																																													$.ajax({
																																														type: "POST",
																																														dataType: "json",
																																														　　 xhrFields: {
																																																		withCredentials: true
																																																},
																																																crossDomain: true,
																																														url: url,
																																														data: data,
																																														beforeSend: function (xml) {
																																															// ajax发送前
																																															mesloadBox.loadingShow()
																																														},
																																														success: function (result, status, xhr) {
																																															// ajax成功
																																															mesloadBox.hide()
																																															paginationContainer.show()	//隐藏分页按钮
																																															if (result.status === 0) {
																																				
																																																mesVerticalTableAddData(panelModal1, {
																																																	thead: {
																																																		theadContent: '序号/产出物编号',
																																																		theadWidth: '8%20%'
																																																	},
																																																	tbody: {
																																																		html: [
																																																			'<td></td>',
																																																			'<td></td>'
																																																		],
																																				
																																																		// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																		dataAddress: function (tbodyTarget, html, result) {
																																																			let map = result.map, // 映射
																																																				dataList = result.map.productElementNumbers, // 主要数据列表
																																																				tempData = ''; // 表格td内的临时数据
																																																				tbodyTarget.empty() // 清空表格主体
																																					
																																					
																																																			for (let i = 0, len = dataList.length; i < len; i++) {
																																																				tbodyTarget.append('<tr></tr>'); // 添加行
																																																				let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																				for (let i = 0, len = html.length; i< len; i++) {
																																																					currentTr.append(html[i]); // 添加表格内的HTML
																																																					switch (i) {
																																																						case 0:
																																																							currentTr.children().eq(i).html(currentTr.index() + 1)
																																																							break;
																																																						case 1: {
																																																							tempData = dataList[currentTr.index()].number_number
																																																							currentTr.children().eq(i).html(tempData)
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
																																																		totalRow: result.map.productElementNumbers.length, // 总行数
																																																		displayRow: result.map.productElementNumbers.length// 显示行数
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

																																										
																																												addModalTableData(queryBatchCareOfBindingNumberUrl, {
																																													batchCareOfId: batchCareOfId,
																																													headNum: 1,
																																												});
																																											})
																																										}
																																											break;
																																										case 9: {
																																											tempData = dataList.batch_care_of_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))

																																										}
																																											break;
																																										case 10: {
																																											tempData = dataList.batch_care_of_explain;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										case 11: {
																																											tempData = dataList.batch_care_of_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))

																																										}
																																											break;
																																										case 12: {
																																											tempData = dataList.batch_care_of_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																										}
																																											break;
																																										default:
																																											break;
																																									}
																																								}
																																							}
																																						});

															
																																					}
																																					else {
																																						mesloadBox.warningShow();
																																					}
																																				}
																																			})
																																		}
															
																																		// 导航栏点击时运行数据加载
																																		addTableData(queryBatchCareOfParticularsUrl, {
																																			batchCareOfId:batchCareOfId,
																																		});
																																		
																																		break;
																																	}
																																	case '#delete' :{
																																		swal({
																																			title: '您确定要删除吗？',
																																			type: 'question',
																																			showCancelButton: true,
																																			confirmButtonText: '确定',
																																			cancelButtonText: '取消'
																																		}).then(function (){
																																			$.ajax({
																																				type: "POST",
																																				url:removeBatchCareOfUrl,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: {
																																					batchCareOfId:batchCareOfId,
																																				},
																																				success: function (result, status, xhr) {
																																					if (result.status === 0) {
																																						let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																																					}else {
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
																																				},
																																			})
																																		})
																																		break;
																																	}
															
															
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
																										totalRow:result.map.line, // 总行数
																										displayRow: result.map.batchCareOfs.length // 显示行数
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
																				addTableData(queryBatchCareOfOutlineUrl, {
																					workOrderId:workOrderId,
																					headNum:1,
																				});
																			

																				// 模糊搜索
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					let val = $(this).closest('.input-group').find('input').val()
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryBatchCareOfOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						headNum:1
																					});
																				});

																				// 头部主要按钮1点击事件 新增转出物
																				headingMainBtn_1.off('click').on('click', (event) => {
																					let dataContent2 = $('#CreateRequisitions4'),
																					panelModal1 = dataContent2.find('.panel'),
																					modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent2.find('.modal-submit'),
																					req={
																						batch_care_of_barcode:"",//批次转出条码
																						batch_care_of_number:"",//转出批次号
																						batch_care_of_record_staff:"",//记录人
																						batch_care_of_record_staff_id:"",//记录人
																						batch_care_of_transfer_region_id:"",//转入区域id
																						batch_care_of_transfer_region:"",//转入区域,
																						semi_finish_name:"",
																						semi_finish_type_name:"",//产出物类型（半成品类型）
																						semi_finish_genre:"",//产出物型号（半成品型号）
																						batch_care_of_quantity:"",//转出数量
																						batch_care_of_unit:"",//单位
																						batch_care_of_time:"",//转出时间
																						batch_care_of_explain:"",//说明
																						batch_care_of_creation_staff_id:"",//说明
																						batch_care_of_creation_staff:"",//说明
																						operationType:[]
																					},
																					codeList=[]
																					req.batch_care_of_creation_staff = USERNAME
																					req.batch_care_of_creation_staff_id = USERID
																						
																					panelModal1.find('.panel-heading').find('.panel-title').text('新增转出物') // 更换panel标题
																					panelModal1.find(".barCode").val("").attr("placeholder","转出物批次条码").attr("readonly",false)

																					dataContent2.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent2.modal('show') // 运行时显示
																					dataContent2.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})

																					modalSubmitBtn.show()
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent2.modal('hide')
																						// 初始化表格
																						dataContent2.find('thead').empty()
																						dataContent2.find('tbody').empty()
																					})
																					panelModal1.find(".barCode").off('blur').on('blur', (event) => {
																						req.batch_care_of_barcode =	panelModal1.find(".barCode").val()
																					})

																					mesHorizontalTableAddData(panelModal1.find('table'), null, {
																						thead: '转出批号/记录人员/转入区域/产出物名称/产出物类型/产出物型号/转出数量/单位/绑定产出物编号/转出时间/备注',
																						tableWitch: '2%/3%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							let inputHtml;

																							for (let i = 0, len = length; i < len; i++) {
																								switch (i) {
																									case 0: {
																										$.ajax({
																											type: "post",
																											dataType: "json",
																											　　 xhrFields: {
																															withCredentials: true
																													},
																													crossDomain: true,
																											url: generateProcessManageBatchNumberUrl,
																											data:{
																												type:"outPut",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number = result.data
																													tbodyTd.eq(i).html(number)
																													req.batch_care_of_number = number
																												}
																											}
																										})

																										break;
																									}
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												req.batch_care_of_record_staff = resolveData.roleStaffName
																												req.batch_care_of_record_staff_id = resolveData.roleStaffId
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})

																										break;
																									}
																									case 2: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectWorkingArea(resolve, queryWorkingAreaUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.areaName)
																												req.batch_care_of_transfer_region=resolveData.areaName
																												req.batch_care_of_transfer_region_id=resolveData.areaId
																												console.log(	req.batch_care_of_transfer_region)
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																										break;
																									}
																									case 3: {
																										tbodyTd.eq(i).html(semiFinishName)
																										break;
																									}

																									case 4: {
																										tbodyTd.eq(i).html(semiFinishTypeName)

																										break;
																									}
																									case 5: {
																										tbodyTd.eq(i).html(semiFinishGenre)

																										break;
																									}
																									case 6: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.batch_care_of_quantity= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																										})

																										break;
																									}
																									case 7: {
																										tbodyTd.eq(i).html(semiFinishUnit)
																										break;
																									}
																									case 8: {
																										tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>添加编号</a>`
																										tbodyTd.eq(i).addClass("table-input-td")
																										tbodyTd.eq(i).html(tempData)

																										// 添加编号
																										tbodyTd.eq(i).off("click").on("click","a", function(){
																											let dataContent = $('#addCode'),
																											panelList = dataContent.find('.panel'),
																											panelTbody = panelList.find('table tbody'),	// 面板表格
																											modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																											headBtn = dataContent.find('.head-main-btn-1'),
																											modalSubmitBtn = dataContent.find('.modal-submit')

																										
																											dataContent.modal('show') // 运行时显示

																											modalCloseBtn.off('click').on('click', (event) => {
																												// 点击弃用按钮隐藏该模态框
																												dataContent.modal('hide')
																												// 初始化表格
																												panelList.find('thead').empty()
																												panelList.find('tbody').empty()
																											})
																											if(codeList.length!==0){
																												let html=""
																												for(var i=0;i<codeList.length;i++){
																													html+=`
																													<tr>
																														<td >${i+1}</td>
																														<td class="table-input-td">
																															<input type="text" class="table-input projectPrincipal" value=${codeList[i]} >
																														</td>
																														<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`
																												}
																												panelTbody.append(html)
																											}else{
																												headBtn.trigger('click')
																											}


																											headBtn.off('click').on('click', (event) => {
																												let temStr = `
																													<tr>
																															<td ></td>
																															<td class="table-input-td">
																																<input type="text" class="table-input projectPrincipal" placeholder="请输入编号" />
																															</td>
																															<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`;
																												panelTbody.append(temStr)
						
																												let  tr=panelList.find('tbody tr');
																												for(let i = 0;i<tr.length;i++){
																													panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																													
																												}
						
																												panelList.on('click', '.delete', function () {
																													$(this).closest('tr').remove();  //移除该行元素
																													for(let i = 0;i<tr.length;i++){
																														panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																														
																													}
																												})
																											})

																											modalSubmitBtn.off('click').on('click', (event) => {
																												let codeListPanel = panelTbody.find('tr')
																												for(let i = 0;i<codeListPanel.length;i++){
																													let temp = codeListPanel.eq(i).find('td:nth-child(2)').find("input").val()
																													codeList[i] = temp
																												}
																												if (codeList.length!==0
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
																														modalCloseBtn.trigger('click')
																													});
																												}
																												else {
																													swallError();	//格式不正确
																												}
																											})		
																											
																										})

																										break;
																									}
																									case 9: {
																										inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										// 添加到提交数据
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.batch_care_of_time = tbodyTd.eq(i).find('input').val()
																										})

																										break;
																									}
																									case 10: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.batch_care_of_explain  = tbodyTd.eq(i).find('input').val()
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
																						req.operationType =codeList
																						let req2
																						req2=JSON.stringify(req)
																						if (req.batch_care_of_barcode !== '') {
																							swal({
																								title: '您确定要提交本次操作吗?',
																								text: '请确保填写信息无误后点击确定按钮',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							}).then(function () {

																								$.ajax({
																									type: "POST",
																									url: saveBatchCareOfUrl,
																									dataType: "json",
																							　　 xhrFields: {
																											withCredentials: true
																									},
																									crossDomain: true,
																									data:{
																										type:"norm",
																										workOrderId:workOrderId,
																										batchCareOfStr:req2
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {

																											let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else if(result.status === 7){
																											repeatFail()
																										}
																										else {
																											swallFail();	//操作失败
																										}
																									},

																								})
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})

																				})
																				// 按钮2  转出统计
																				headingMainBtn_2.off('click').on('click', (event) => {
																					let dataContent = $('#submitModelModal2'),
																						panelModal1 = dataContent.find('.panel'),
																						modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																						modalSubmittn = dataContent.find('.modal-footer').find('.modal-submit'),
																						statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																						fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																						// ProductTypeList = [],
																						mesloadBox = new MesloadBox(panelModal1, {
																							// 主数据载入窗口
																							warningContent: '没有此类信息，请重新选择或输入'
																						});
																						dataContent.find(".panel-title").text("转出物统计")


																						dataContent.modal({
																							backdrop: false, // 黑色遮罩不可点击
																							keyboard: false,  // esc按键不可弃用模态框
																							show: false
																						})
																						modalCloseBtn.off('click').on('click', (event) => {
																							// 点击弃用按钮隐藏该模态框
																							dataContent.modal('hide')
																							// 初始化表格
																							panelModal1.find('thead').empty()
																							panelModal1.find('tbody').empty()
																						})
																						dataContent.modal('show') // 运行时显示

																						statusOption.hide()
																						fuzzySearchGroup.hide()
																						modalSubmittn.hide()

																						// 模态框表格增加内容
																						function addTableData(url, data) {
																							$.ajax({
																								type: "POST",
																								dataType: "json",
																																		　　 xhrFields: {
																																						withCredentials: true
																																				},
																																				crossDomain: true,
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
																												theadContent: '产出物名称/产出物类型/产出物型号/总转出数量/单位',
																												theadWidth: '15%/18%/20%/20%/25%'
																											},
																											tbody: {
																												html: [
																													'<td></td>',
																													'<td></td>',
																													'<td></td>',
																													'<td></td>',
																													'<td></td>',

																												],

																												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																												dataAddress: function (tbodyTarget, html, result) {
																													let map = result.map, // 映射
																														dataList = result.map.batchCareOfStatistics, // 主要数据列表
																														tempData = ''; // 表格td内的临时数据
																													// ProductTypeList = dataList;
																													tbodyTarget.empty() // 清空表格主体
															
															
																													for (let i = 0, len = dataList.length; i < len; i++) {
																														tbodyTarget.append('<tr></tr>'); // 添加行
																														let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																														for (let i = 0, len = html.length; i< len; i++) {
																															currentTr.append(html[i]); // 添加表格内的HTML
																															switch (i) {
																																case 0:{
																																//	tempData = dataList[currentTr.index()].semi_finish_name
																																	currentTr.children().eq(i).html(semiFinishName)
																																}
																																	break;
																																case 1: {
																																//	tempData = dataList[currentTr.index()].semi_finish_type_name
																																	currentTr.children().eq(i).html(semiFinishTypeName)
																																}
																																	break;
																																case 2: {
																																	//tempData = dataList[currentTr.index()].semi_finish_genre
																																	currentTr.children().eq(i).html(semiFinishGenre)
																																}
																																	break;
																																case 3: {
																																	tempData = dataList[currentTr.index()].batch_care_of_quantity
																																	currentTr.children().eq(i).html(tempData)
																																}
																																	break;
																																case 4: {
																																//	tempData = dataList[currentTr.index()].batch_care_of_unit
																																	currentTr.children().eq(i).html(semiFinishUnit)
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
																												totalRow: result.map.batchCareOfStatistics.length, // 总行数
																												displayRow: result.map.batchCareOfStatistics.length// 显示行数
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

																						addTableData(queryBatchCareOfStatisticsUrl, {
																							workOrderId:workOrderId,
																						});
																				})
																					
																				break;
																			}
																			case '#scrap': {	//报废登记
																				let dataContent = $('#materielMangeModel'),
																					panelList = dataContent.find('.panel'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					fuzzySearchGroup = panelList.find('.fuzzy-search-group'), // 模糊搜索组
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3
																					dataContent.find('.modal-title').text('报废品管理') // 更换panel标题
																					
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})

																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						panelList.find('thead').empty()
																						panelList.find('tbody').empty()
																					})

																					dataContent.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					headingMainBtn_1.text("新增报废物")
																					headingMainBtn_1.show()
																					headingMainBtn_2.hide()
																					headingMainBtn_3.hide()
																					statusTypeOption.hide()
																					fuzzySearchGroup.show()


																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							// ajax发送前
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							paginationContainer.show()	//隐藏分页按钮
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/报废批号/报废物名称/报废数量/单位/记录人员/记录时间/操作',
																										theadWidth: '6%/15%/15%/10%/8%/10%/18%/15%'
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
																											'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射zszs
																												dataList = map.scrapBatchs, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].scrap_batch_number;
																															// tempData=
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].scrap_batch_article_name;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].scrap_batch_quantity;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].scrap_batch_unit;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].scrap_batch_record_staff;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 6: {
																															tempData = dataList[currentTr.index()].scrap_batch_record_time;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))

																														}
																															break;
																														case 7:
																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																scrapBatchId = dataList[currentTr.index()].scrap_batch_id;
																																switch (dataContent) {
																																	case '#detailModal': {	//详情
																																		let dataContent = $('#detailModal2'),
																																		panelList= dataContent.find('.panel'),
																																		panel_1=panelList.eq(0)
																																		panel_2=panelList.eq(1)
																																		panel_3=panelList.eq(2)
																																		modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																		modalSubmitBtn = dataContent.find('.modal-submit'),
																																		barCodeText = 	panel_1.find('.panel-heading').find('.barCode')
																																			
																																		panel_1.find('.modal-title').text('报废物详情') // 更换panel标题
																																		panel_2.find('.modal-title').text('报废说明') // 更换panel标题
																																		panel_3.find('.modal-title').text('报废处理') // 更换panel标题
																																		modalSubmitBtn.hide()
														
																																		dataContent.modal({
																																			backdrop: false, // 黑色遮罩不可点击
																																			keyboard: false,  // esc按键不可弃用模态框
																																			show: false
																																		})
																																		dataContent.modal('show') // 运行时显示
																																		dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																			$('body').addClass('modal-open')
																																		})
																																
																																		modalCloseBtn.off('click').on('click', (event) => {
																																			// 点击弃用按钮隐藏该模态框
																																			dataContent.modal('hide')
																																			// 初始化表格
																																			dataContent.find('thead').empty()
																																			dataContent.find('tbody').empty()
																																		})
															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panel_1.find('table'), null, {
																																							thead: '报废批号/记录人员/报废物编号/报废物名称/报废物规格/报废物型号/报废数量/单位/记录时间/创建时间/创建人',
																																							tableWitch: '10%/10%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.scrapBatch, // 主要数据列表
																																								tempData = null; // 表格td内的临时数据\
																																								barCodeText.val("NO:" +  dataList.scrap_batch_barcode).attr("readonly",true)
																																								panel_2.find("textarea").val( dataList.scrap_batch_explain).attr("readonly",true)
																																								panel_3.find("textarea").val( dataList.scrap_batch_treatment).attr("readonly",true)
																																								panel_2.find(".text").text(dataList.scrap_batch_explain.length)
																																								panel_3.find(".text").text(dataList.scrap_batch_treatment.length)
																		
																																								for (let i = 0, len = length; i < len; i++) {
																																									switch (i) {
																																										case 0: {
																																											tempData = dataList.scrap_batch_number;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																										case 1: {
																																											tempData = dataList.scrap_batch_record_staff;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																									
																																										case 2: {
																																											tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																											let 	scrapBatchId =  dataList.scrap_batch_id
																																											tbodyTd.eq(i).addClass("table-input-td")
																																											tbodyTd.eq(i).html(tempData)

																																											tbodyTd.eq(i).off("click").on("click","a", function(){
																																												let dataContent = $('#publicSelectModalBox'),
																																												panelModal1 = dataContent.find('.panel'),
																																												modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																												statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																												fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																												paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																												activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																												panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																												// ProductTypeList = [],
																																												mesloadBox = new MesloadBox(panelModal1, {
																																													// 主数据载入窗口
																																													warningContent: '没有此类信息，请重新选择或输入'
																																												});

																																												dataContent.modal({
																																													backdrop: false, // 黑色遮罩不可点击
																																													keyboard: false,  // esc按键不可弃用模态框
																																													show: false
																																												})
																																												dataContent.modal("show")
																																				
																																												panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																												dataContent.find(".panel-title").text("编号详情")
																																											
																																												statusOption.hide()
																																												fuzzySearchGroup.hide()

																																												modalCloseBtn.off('click').on('click', (event) => {
																																													// 点击弃用按钮隐藏该模态框
																																													dataContent.modal('hide')
																																													panelModal1.find('thead').empty()
																																													panelModal1.find('tbody').empty()
																																													// 初始化表格
																																												
																																												})
																																											
																																												// 模态框表格增加内容
																																												function addModalTableData(url, data) {
																																													$.ajax({
																																														type: "POST",
																																														dataType: "json",
																																		　　 xhrFields: {
																																						withCredentials: true
																																				},
																																				crossDomain: true,
																																														url: url,
																																														data: data,
																																														beforeSend: function (xml) {
																																															// ajax发送前
																																															mesloadBox.loadingShow()
																																														},
																																														success: function (result, status, xhr) {
																																															// ajax成功
																																															mesloadBox.hide()
																																															paginationContainer.show()	//隐藏分页按钮
																																															if (result.status === 0) {
																																				
																																																mesVerticalTableAddData(panelModal1, {
																																																	thead: {
																																																		theadContent: '序号/报废物编号',
																																																		theadWidth: '8%20%'
																																																	},
																																																	tbody: {
																																																		html: [
																																																			'<td></td>',
																																																			'<td></td>'
																																																		],
																																				
																																																		// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																		dataAddress: function (tbodyTarget, html, result) {
																																																			let map = result.map, // 映射
																																																				dataList = result.map.productElementNumbers, // 主要数据列表
																																																				tempData = ''; // 表格td内的临时数据
																																																				tbodyTarget.empty() // 清空表格主体
																																					
																																					
																																																			for (let i = 0, len = dataList.length; i < len; i++) {
																																																				tbodyTarget.append('<tr></tr>'); // 添加行
																																																				let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																				for (let i = 0, len = html.length; i< len; i++) {
																																																					currentTr.append(html[i]); // 添加表格内的HTML
																																																					switch (i) {
																																																						case 0:
																																																							currentTr.children().eq(i).html(currentTr.index() + 1)
																																																							break;
																																																						case 1: {
																																																							tempData = dataList[currentTr.index()].number_number
																																																							currentTr.children().eq(i).html(tempData)
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
																																																		totalRow: result.map.productElementNumbers.length, // 总行数
																																																		displayRow: result.map.productElementNumbers.length// 显示行数
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

																																										
																																												addModalTableData(queryScrapBatchBindingNumberUrl, {
																																													scrapBatchId: scrapBatchId,
																																													headNum: 1,
																																												});
																																											})
																																											break;
																																										}
																		
																																										case 3: {
																																											tempData = dataList.scrap_batch_article_name;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																										case 4: {
																																											tempData = dataList.scrap_batch_article_specification;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																										case 5: {
																																											tempData = dataList.scrap_batch_article_model;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																										case 6: {
																																											tempData = dataList.scrap_batch_quantity;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																										case 7: {
																																											tbodyTd.eq(i).html(semiFinishUnit)
																																											break;
																																										}
																																										case 8: {
																																											tempData = dataList.scrap_batch_record_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																											break;
																																										}
																																										case 9: {
																																											tempData = dataList.scrap_batch_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																																											break;
																																										}
																																										case 10: {
																																											tempData = dataList.scrap_batch_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																																											
																																										default:
																																											break;
																																									}
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
															
																																		// 导航栏点击时运行数据加载
																																		addTableData(queryScrapBatchParticularsUrl, {
																																			scrapBatchId: scrapBatchId
																																		});
																																		
																																		break;
																																	}
																																	case '#delete' :{
																																		swal({
																																			title: '您确定要删除吗？',
																																			type: 'question',
																																			showCancelButton: true,
																																			confirmButtonText: '确定',
																																			cancelButtonText: '取消'
																																		}).then(function (){
																																			$.ajax({
																																				type: "POST",
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				url:removeScrapBatchUrl,
																																				data: {
																																					scrapBatchId:scrapBatchId,
																																				},
																																				success: function (result, status, xhr) {
																																					if (result.status === 0) {
																																						let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																																					}else {
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
																																				},
																																			})
																																		})
																																		break;
																																	}
															
															
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
																										totalRow:result.map.scrapBatchs.length, // 总行数
																										displayRow: result.map.scrapBatchs.length // 显示行数
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
																				addTableData(queryScrapBatchOutlineUrl, {
																					workOrderId:workOrderId,
																					headNum:1
																				});
																				// 模糊搜索
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					let val = $(this).closest('.input-group').find('input').val()
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryScrapBatchOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						headNum:1
																					});
																				});

																				// 头部主要按钮1点击事件 新增报废物
																				headingMainBtn_1.off('click').on('click', (event) => {
																					let dataContent2 = $('#detailModal2'),
																					panelList= dataContent2.find('.panel'),
																					panel_1=panelList.eq(0)
																					panel_2=panelList.eq(1)
																					panel_3=panelList.eq(2)
																					modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent2.find('.modal-submit'),
																					barCodeText = 	panel_1.find('.panel-heading').find('.barCode'),
																					req = {
																						scrap_batch_number :"",//报废批次号1
																						scrap_batch_record_staff:"",//记录人1
																						scrap_batch_record_staff_id:"",//记录人id1
																						scrap_batch_article_name :"",//报废物品名称1
																						scrap_batch_article_specification :"",//报废物品规格1
																						scrap_batch_article_model :"",//报废物品型号1
																						scrap_batch_quantity :"",//报废数量1
																						scrap_batch_unit :"",//单位1
																						scrap_batch_record_time :"",//记录时间1
																						scrap_batch_explain :"",//报废说明1
																						scrap_batch_treatment :"",//报废处理1
																						scrap_batch_creation_staff :"",//..1
																						scrap_batch_creation_staff_id:"",//1
																						scrap_batch_barcode:"",//报废批次条码1
																						scrap_batch_article_name_id:"",//
																						semi_finish_type_id:"",//报废批次条码1
																						numberItem:[]//1
																					},
																					codeList=[]

																					req.scrap_batch_creation_staff = USERNAME
																					req.scrap_batch_creation_staff_id = USERID

																					panelList.find(".barCode").off('blur').on('blur', (event) => {
																						req.scrap_batch_barcode =		panelList.find(".barCode").val()
																					})
																						
																					panel_1.find('.modal-title').text('新增报废物') // 更换panel标题
																					panel_2.find('.modal-title').text('报废说明') // 更换panel标题
																					panel_3.find('.modal-title').text('报废处理') // 更换panel标题
																					modalSubmitBtn.show()

																					panelList.find(".barCode").attr("placeholder","报废物批次条码")
																					barCodeText.val("").attr("readonly",false)
																					panel_2.find("textarea").attr("readonly",false).val("")
																					panel_3.find("textarea").val("").attr("readonly",false)
																					panel_3.find(".text").text("0")
																					panel_2.find(".text").text("0")

																					dataContent2.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent2.modal('show') // 运行时显示
																					dataContent2.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent2.modal('hide')
																						// 初始化表格
																						dataContent2.find('thead').empty()
																						dataContent2.find('tbody').empty()
																					})

																					function checkLength(which) {
																						var maxChars = 100; //
																						var curr = which.val().length; //10 减去 当前输入的
																						let mesPopover = new MesPopover(which, { content: '已超出输出长度' });
																						mesPopover.hide()
																						which.parent().prev().find(".text").text(curr.toString())
																						if(which.val().length > maxChars){
																							mesPopover.show()
																							which.val() = which.val().substring(0,maxChars);
																						}else{
																						}
																					}

																					let panel_2_text = panel_2.find("textarea")
																					let panel_3_text = panel_3.find("textarea")

																					panel_2_text.on("keyup",(event)=>{
																						checkLength(panel_2_text)
																					})
																					panel_3_text.on("keyup",(event)=>{
																						checkLength(panel_3_text)
																						
																					})
																					mesHorizontalTableAddData(panel_1.find('table'), null, {
																						thead: '报废批号/记录人员/报废物编号/报废物名称/报废物规格/报废物型号/报废数量/单位/记录时间',
																						tableWitch: '2%/5%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							let inputHtml;

																							for (let i = 0, len = length; i < len; i++) {
																								switch (i) {
																									case 0: {
																										$.ajax({
																											type: "POST",
																											url: generateProcessManageBatchNumberUrl,
																											dataType: "json",
																											　　 xhrFields: {
																															withCredentials: true
																													},
																													crossDomain: true,
																											data:{
																												type:"scrap",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number = result.data
																													tbodyTd.eq(i).html(number)
																													req.scrap_batch_number = number
																												}
																											}
																										})
																										break;
																									}
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												req.scrap_batch_record_staff=resolveData.roleStaffName
																												req.scrap_batch_record_staff_id=resolveData.roleStaffId
																												console.log(	req.scrap_batch_record_staff)
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})
																										break;
																									}
																									case 2: {
																										tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>添加编号</a>`
																										tbodyTd.eq(i).addClass("table-input-td")
																										tbodyTd.eq(i).html(tempData)

																										// 添加编号
																										tbodyTd.eq(i).off("click").on("click","a", function(){
																											let dataContent = $('#addCode'),
																											panelList = dataContent.find('.panel'),
																											panelTbody = panelList.find('table tbody'),	// 面板表格
																											modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																											headBtn = dataContent.find('.head-main-btn-1'),
																											modalSubmitBtn = dataContent.find('.modal-submit')

																										
																											dataContent.modal('show') // 运行时显示

																											modalCloseBtn.off('click').on('click', (event) => {
																												// 点击弃用按钮隐藏该模态框
																												dataContent.modal('hide')
																												// 初始化表格
																												panelList.find('thead').empty()
																												panelList.find('tbody').empty()
																											})
																											if(codeList.length!==0){
																												let html=""
																												for(var i=0;i<codeList.length;i++){
																													html+=`
																													<tr>
																														<td >${i+1}</td>
																														<td class="table-input-td">
																															<input type="text" class="table-input projectPrincipal" value=${codeList[i]} >
																														</td>
																														<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`
																												}
																												panelTbody.append(html)
																											}else{
																												headBtn.trigger('click')
																											}


																											headBtn.off('click').on('click', (event) => {
																												let temStr = `
																													<tr>
																															<td ></td>
																															<td class="table-input-td">
																																<input type="text" class="table-input projectPrincipal" placeholder="请输入编号" />
																															</td>
																															<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`;
																												panelTbody.append(temStr)
						
																												let  tr=panelList.find('tbody tr');
																												for(let i = 0;i<tr.length;i++){
																													panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																													;
																												}
						
																												panelList.on('click', '.delete', function () {
																													$(this).closest('tr').remove();  //移除该行元素
																													for(let i = 0;i<tr.length;i++){
																														panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																														;
																													}
																												})
																											})

																											modalSubmitBtn.off('click').on('click', (event) => {
																												
																												let codeListPanel = panelTbody.find('tr')
																												for(let i = 0;i<codeListPanel.length;i++){
																													let temp = codeListPanel.eq(i).find('td:nth-child(2)').find("input").val()
																													codeList[i] = temp
																												}
																													console.log(codeList)
																												if (codeList.length!==0
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
																														modalCloseBtn.trigger('click')
																													});
																												}
																												else {
																													swallError();	//格式不正确
																												}
																											})		
																											
																										})
																										break;
																									}
																									case 3: {
																										tbodyTd.eq(i).html(semiFinishName)
																										req.scrap_batch_article_name_id = semiFinishId
																										req.semi_finish_type_id = semiFinishTypeId
																										req.scrap_batch_article_name = semiFinishName
																										break;
																									}

																									case 4: {
																										tbodyTd.eq(i).html(semiFinishTypeName)
																										req.scrap_batch_article_specification = semiFinishTypeName


																										break;
																									}
																									case 5: {
																										tbodyTd.eq(i).html(semiFinishGenre)
																										req.scrap_batch_article_model = semiFinishGenre

																										break;
																									}
																									case 6: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.scrap_batch_quantity = tbodyTd.eq(i).find('input').val()
																										})

																										break;
																									}
																									case 7: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.scrap_batch_unit = tbodyTd.eq(i).find('input').val()
																										})

																										break;
																									}
																									case 8: {
																										inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										// 添加到提交数据
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.scrap_batch_record_time = tbodyTd.eq(i).find('input').val()
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
																						console.log(	req.scrap_batch_record_staff)
																						req.scrap_batch_explain= panel_2_text.val()
																						req.scrap_batch_treatment= panel_3_text.val()
																						req.scrap_batch_barcode= barCodeText.val()
																						req.numberItem= codeList
																						let req2;
																						req2=JSON.stringify(req)
																						//req2=req.toString()

																						if (true) {
																							swal({
																								title: '您确定要提交本次操作吗?',
																								text: '请确保填写信息无误后点击确定按钮',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							}).then(function () {
																								$.ajax({
																									type: "POST",
																									url: saveScrapBatchUrl,
																									dataType: "json",
																									　　 xhrFields: {
																													withCredentials: true
																											},
																											crossDomain: true,
																									data:{
																										workOrderId:workOrderId,
																										scrapBatchStr:req2,
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {

																											let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else if(result.status === 7){
																											repeatFail()
																										}
																										else {
																											swallFail();	//操作失败
																										}
																									},

																								})
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})

																				})
																				
																					
																				break;
																			}
																			case '#rejects': {	//不良品登记
																				let dataContent = $('#materielMangeModel'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody'),
																					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																					statusTypeOption = panelList.find('.status-type-option'), // 类型选项
																					fuzzySearchGroup = panelList.find('.fuzzy-search-group'), // 模糊搜索组
																					headingMainBtn_1 = panelList.find('.head-main-btn-1'), // 头部主要按键_1
																					headingMainBtn_2= panelList.find('.head-main-btn-2'), // 头部主要按键_2
																					headingMainBtn_3= panelList.find('.head-main-btn-3') // 头部主要按键_3
																					dataContent.find('.modal-title').text('不良品管理') // 更换panel标题
																					
																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})

																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent.modal('hide')
																						// 初始化表格
																						panelList.find('thead').empty()
																						panelList.find('tbody').empty()
																					})

																					dataContent.modal('show') // 运行时显示
																					panelThead.empty()
																					panelTbody.empty()

																					headingMainBtn_1.text("新增不良品")
																					headingMainBtn_1.show()
																					headingMainBtn_2.hide()
																					headingMainBtn_3.hide()
																					statusTypeOption.hide()
																					fuzzySearchGroup.show()


																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
																						data: data,
																						beforeSend: function (xml) {
																							// ajax发送前
																							mesloadBox.loadingShow()
																						},
																						success: function (result, status, xhr) {
																							// ajax成功
																							mesloadBox.hide()
																							if (result.status === 0) {
																								mesVerticalTableAddData(panelList, {
																									thead: {
																										theadContent: '序号/不良品批号/不良品名称/不良品数量/单位/记录人员/记录时间/操作',
																										theadWidth: '6%/22%/12%/10%/8%/10%/19%/15%'
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
																											'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
																										],
															
																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射zszs
																												dataList = map.rejectsBatchs, // 主要数据列表
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
																															tempData = dataList[currentTr.index()].rejects_batch_number;
																															// tempData=
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].rejects_batch_article_name;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].rejects_batch_quantity;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].rejects_batch_unit;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].rejects_batch_record_staff;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 6: {
																															tempData = dataList[currentTr.index()].rejects_batch_record_time;
																															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																														}
																															break;
																													
																														case 7:
																															currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																																let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																																rejectsBatchId = dataList[currentTr.index()].rejects_batch_id;
																																switch (dataContent) {
																																	case '#detailModal': {	//详情
																																		let dataContent = $('#detailModal2'),
																																		panelList= dataContent.find('.panel'),
																																		panel_1=panelList.eq(0),
																																		panel_2=panelList.eq(1),
																																		panel_3=panelList.eq(2),
																																		modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																		modalSubmitBtn = dataContent.find('.modal-submit'),
																																		barCodeText = 	panel_1.find('.panel-heading').find('.barCode')
																																			
																																		panel_1.find('.modal-title').text('不良品详情') // 更换panel标题
																																		panel_2.find('.modal-title').text('不良品说明') // 更换panel标题
																																		panel_3.find('.modal-title').text('不良品处理') // 更换panel标题
																																		modalSubmitBtn.hide()
														
																																		dataContent.modal({
																																			backdrop: false, // 黑色遮罩不可点击
																																			keyboard: false,  // esc按键不可弃用模态框
																																			show: false
																																		})
																																		dataContent.modal('show') // 运行时显示
																																		dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																																			$('body').addClass('modal-open')
																																		})
																																
																																		modalCloseBtn.off('click').on('click', (event) => {
																																			// 点击弃用按钮隐藏该模态框
																																			dataContent.modal('hide')
																																			// 初始化表格
																																			dataContent.find('thead').empty()
																																			dataContent.find('tbody').empty()
																																		})
															
																																		// 主表格添加内容
																																		function addTableData(url, data) {
																																			$.ajax({
																																				type: "POST",
																																				url: url,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: data,
																																				beforeSend: function (xml) {
																																					// ajax发送前
																																					mesloadBox.loadingShow()
																																				},
																																				success: function (result, status, xhr) {
																																					// ajax成功
																																					mesloadBox.hide()
																																					if (result.status === 0) {
																																						mesHorizontalTableAddData(panel_1.find('table'), null, {
																																							thead: '不良品批号/记录人员/不良品编号/不良品名称/不良品规格/不良品型号/不良品数量/单位/记录时间/不良等级/不良品处理人/创建时间/创建人',
																																							tableWitch: '2%/3%/10%',
																																							viewColGroup: 3,
																																							importStaticData: (tbodyTd, length) => {
																																								let map = result.map, // 映射
																																								dataList = map.rejectsBatch, // 主要数据列表
																																								tempData = null; // 表格td内的临时数据\
																																								barCodeText.val("NO:" +  dataList.rejects_batch_barcode).attr("readonly",true)
																																								panel_2.find("textarea").val( dataList.rejects_batch_explain).attr("readonly",true)
																																								panel_3.find("textarea").val( dataList.rejects_batch_treatment).attr("readonly",true)
																																								panel_2.find(".text").text(dataList.rejects_batch_explain.length)
																																								panel_3.find(".text").text(dataList.rejects_batch_treatment.length)

																																								for (let i = 0, len = length; i < len; i++) {
																																									switch (i) {
																																										case 0: {
																																											tempData = dataList.rejects_batch_number;
																																											tbodyTd.eq(i).html(tempData)
																		
																																											break;
																																										}
																																										case 1: {
																																											tempData = dataList.rejects_batch_record_staff;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																										case 2: {
																																											tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>查看编号</a>`
																																											tbodyTd.eq(i).addClass("table-input-td")
																																											tbodyTd.eq(i).html(tempData)

																																											tbodyTd.eq(i).off("click").on("click","a", function(){
																																												let dataContent = $('#publicSelectModalBox'),
																																												panelModal1 = dataContent.find('.panel'),
																																												modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																												statusOption = panelModal1.find(".pullDownMenu-1"),// 类型选
																																												fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																																												paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
																																												activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
																																												panelTbody = dataContent.find('table tbody'),	//面包表格tbody
																																												// ProductTypeList = [],
																																												mesloadBox = new MesloadBox(panelModal1, {
																																													// 主数据载入窗口
																																													warningContent: '没有此类信息，请重新选择或输入'
																																												});

																																												dataContent.modal({
																																													backdrop: false, // 黑色遮罩不可点击
																																													keyboard: false,  // esc按键不可弃用模态框
																																													show: false
																																												})
																																												dataContent.modal("show")
																																				
																																												panelModal1.find(".panel-heading").find(".head-main-btn-1").text("")
																																												dataContent.find(".panel-title").text("编号详情")
																																											
																																												statusOption.hide()
																																												fuzzySearchGroup.hide()

																																												modalCloseBtn.off('click').on('click', (event) => {
																																													// 点击弃用按钮隐藏该模态框
																																													dataContent.modal('hide')
																																													panelModal1.find('thead').empty()
																																													panelModal1.find('tbody').empty()
																																													// 初始化表格
																																												
																																												})
																																											
																																												// 模态框表格增加内容
																																												function addModalTableData(url, data) {
																																													$.ajax({
																																														type: "POST",
																																														dataType: "json",
																																														　　 xhrFields: {
																																																		withCredentials: true
																																																},
																																																crossDomain: true,
																																														url: url,
																																														data: data,
																																														beforeSend: function (xml) {
																																															// ajax发送前
																																															mesloadBox.loadingShow()
																																														},
																																														success: function (result, status, xhr) {
																																															// ajax成功
																																															mesloadBox.hide()
																																															paginationContainer.show()	//隐藏分页按钮
																																															if (result.status === 0) {
																																				
																																																mesVerticalTableAddData(panelModal1, {
																																																	thead: {
																																																		theadContent: '序号/报废物编号',
																																																		theadWidth: '8%/20%'
																																																	},
																																																	tbody: {
																																																		html: [
																																																			'<td></td>',
																																																			'<td></td>'
																																																		],
																																				
																																																		// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																																																		dataAddress: function (tbodyTarget, html, result) {
																																																			let map = result.map, // 映射
																																																				dataList = result.map.productElementNumbers, // 主要数据列表
																																																				tempData = ''; // 表格td内的临时数据
																																																				tbodyTarget.empty() // 清空表格主体
																																																			for (let i = 0, len = dataList.length; i < len; i++) {
																																																				tbodyTarget.append('<tr></tr>'); // 添加行
																																																				let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																																																				for (let i = 0, len = html.length; i< len; i++) {
																																																					currentTr.append(html[i]); // 添加表格内的HTML
																																																					switch (i) {
																																																						case 0:
																																																							currentTr.children().eq(i).html(currentTr.index() + 1)
																																																							break;
																																																						case 1: {
																																																							tempData = dataList[currentTr.index()].number_number
																																																							currentTr.children().eq(i).html(tempData)
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
																																																		totalRow: result.map.productElementNumbers.length, // 总行数
																																																		displayRow: result.map.productElementNumbers.length// 显示行数
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

																																										
																																												addModalTableData(queryRejectsBatchBindingNumberUrl, {
																																													rejectsBatchId: rejectsBatchId,
																																													headNum: 1,
																																												});
																																											})
																																											break;
																																										}
																																										case 3: {
																																											tempData = dataList.rejects_batch_article_name;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																		
																																										case 4: {
																																											tempData = dataList.rejects_batch_article_specification;
																																											tbodyTd.eq(i).html(tempData)
																																											break;
																																										}
																																										case 5: {
																																											tempData = dataList.rejects_batch_article_model;
																																											tbodyTd.eq(i).html(tempData)
																		
																																											break;
																																										}
																																										case 6: {
																																											tempData = dataList.rejects_batch_quantity;
																																											tbodyTd.eq(i).html(tempData)
																		
																																											break;
																																										}
																																										case 7: {
																																											tempData = dataList.rejects_batch_unit;
																																											tbodyTd.eq(i).html(tempData)
																		
																																											break;
																																										}
																																										case 8: {
																																											tempData = dataList.rejects_batch_record_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																		
																																											break;
																																										}
																																										case 9: {
																																											tempData = dataList.rejects_batch_grade;
																																											tbodyTd.eq(i).html(tempData)
																		
																																											break;
																																										}																																									
																																										case 10: {
																																											tempData = dataList.rejects_batch_dispose_staff;
																																											tbodyTd.eq(i).html(tempData)
																		
																																											break;
																																										}
																																										case 11: {
																																											tempData = dataList.rejects_batch_creation_time;
																																											tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
																		
																																											break;
																																										}
																																										case 12: {
																																											tempData = dataList.rejects_batch_creation_staff;
																																											tbodyTd.eq(i).html(tempData)
																		
																																											break;
																																										}
																		
																																										default:
																																											break;
																																									}
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
															
																																		// 导航栏点击时运行数据加载
																																		addTableData(queryRejectsBatchParticularsUrl, {
																																			rejectsBatchId: rejectsBatchId,
																																		
																																		});
																																		
																																		break;
																																	}
																																	case '#delete' :{
																																		swal({
																																			title: '您确定要删除吗？',
																																			type: 'question',
																																			showCancelButton: true,
																																			confirmButtonText: '确定',
																																			cancelButtonText: '取消'
																																		}).then(function (){
																																			$.ajax({
																																				type: "POST",
																																				url:removeRejectsBatchUrl,
																																				dataType: "json",
																																				　　 xhrFields: {
																																								withCredentials: true
																																						},
																																						crossDomain: true,
																																				data: {
																																					rejectsBatchId:rejectsBatchId,
																																				},
																																				success: function (result, status, xhr) {
																																					if (result.status === 0) {
																																						let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																																					}else {
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
																																				},
																																			})
																																		})
																																		break;
																																	}
															
															
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
																										totalRow:result.map.rejectsBatchs.length, // 总行数
																										displayRow: result.map.rejectsBatchs.length // 显示行数
																									
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
																				addTableData(queryRejectsBatchOutlineUrl, {
																					workOrderId:workOrderId,
																					headNum:1
																				});

																				// 模糊搜索
																				fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																					console.log(1)
																					let val = $(this).closest('.input-group').find('input').val()
																					event.stopPropagation() // 禁止向上冒泡
																					addTableData(queryRejectsBatchOutlineUrl, {
																						workOrderId:workOrderId,
																						keyword:val,
																						headNum:1
																					});
																				});

																				// 头部主要按钮1点击事件 新增不良品
																				headingMainBtn_1.off('click').on('click', (event) => {
																					let dataContent2 = $('#detailModal2'),
																					panelList= dataContent2.find('.panel'),
																					panel_1=panelList.eq(0)
																					panel_2=panelList.eq(1)
																					panel_3=panelList.eq(2)
																					modalCloseBtn = dataContent2.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent2.find('.modal-submit'),
																					barCodeText = 	panel_1.find('.panel-heading').find('.barCode'),
																					req = {
																						rejects_batch_number :"",//不良品批次号
																						rejects_batch_record_staff:"",//记录人
																						rejects_batch_record_staff_id :"",//记录人id
																						rejects_batch_article_name :"",//不良品名称
																						rejects_batch_article_specification :"",//不良品规格
																						rejects_batch_article_model :"",//不良品型号
																						rejects_batch_quantity :"",//不良品数量
																						rejects_batch_unit :"",//单位
																						rejects_batch_record_time :"",//记录时间
																						rejects_batch_grade :"",//不良等级
																						rejects_batch_explain :"",//不良品说明
																						rejects_batch_treatment :"",//不良品处理方式
																						rejects_batch_dispose_staff :"",//不良品处理人
																						rejects_batch_dispose_staff_id :"",//不良品处理人id
																						rejects_batch_creation_staff :"",
																						rejects_batch_barcode :"",//不良品批次条码
																						rejects_batch_creation_staff_id:"",
																						rejects_batch_article_name_id:"",//
																						semi_finish_type_id:"",//报废批次条码1
																						numlist:[]
																					},
																					codeList=[]

																					req.rejects_batch_creation_staff = USERNAME
																					req.rejects_batch_creation_staff_id = USERID
																					panelList.find(".barCode").off('blur').on('blur', (event) => {
																						req.rejects_batch_barcode =		panelList.find(".barCode").val()
																					})

																						
																					panel_1.find('.modal-title').text('新增不良品') // 更换panel标题
																					panel_2.find('.modal-title').text('不良品说明') // 更换panel标题
																					panel_3.find('.modal-title').text('不良品处理') // 更换panel标题
																					modalSubmitBtn.show()

																					panelList.find(".barCode").attr("placeholder","不良品批次条码")

																					dataContent2.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent2.modal('show') // 运行时显示
																					dataContent2.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																						$('body').addClass('modal-open')
																					})
																			
																					modalCloseBtn.off('click').on('click', (event) => {
																						// 点击弃用按钮隐藏该模态框
																						dataContent2.modal('hide')
																						// 初始化表格
																						dataContent2.find('thead').empty()
																						dataContent2.find('tbody').empty()
																					
																					})

																					barCodeText.val("").attr("readonly",false)
																					panel_2.find("textarea").attr("readonly",false).val("")
																					panel_3.find("textarea").val("").attr("readonly",false)
																					panel_3.find(".text").text("0")
																					panel_2.find(".text").text("0")

																					function checkLength(which) {
																						var maxChars = 100; //
																						var curr = which.val().length; //10 减去 当前输入的
																						let mesPopover = new MesPopover(which, { content: '已超出输出长度' });
																						mesPopover.hide()
																						which.parent().prev().find(".text").text(curr.toString())
																						if(which.val().length > maxChars){
																							mesPopover.show()
																							which.val() = which.val().substring(0,maxChars);
																						}else{
																						}
																					}

																					let panel_2_text = panel_2.find("textarea")
																					let panel_3_text = panel_3.find("textarea")


																					panel_2_text.on("keyup",(event)=>{
																						checkLength(panel_2_text)
																					})
																					panel_3_text.on("keyup",(event)=>{
																						checkLength(panel_3_text)
																						
																					})
																					mesHorizontalTableAddData(panel_1.find('table'), null, {
																						thead: '不良品批号/记录人员/不良品编号/不良品名称/不良品规格/不良品型号/不良品数量/单位/记录时间/不良等级/不良品处理人',
																						tableWitch: '3%/4%/10%',
																						viewColGroup: 3,
																						importStaticData: (tbodyTd, length) => {
																							let inputHtml;

																							for (let i = 0, len = length; i < len; i++) {
																								switch (i) {
																									case 0: {
																										$.ajax({
																											type: "POST",
																											url:generateProcessManageBatchNumberUrl,
																											dataType: "json",
																											　　 xhrFields: {
																															withCredentials: true
																													},
																													crossDomain: true,
																											data:{
																												type:"unquality",
																												workOrderId:workOrderId
																											},
																											success: function (result, status, xhr) {
																												if (result.status === 0) {
																													let number= result.data
																													tbodyTd.eq(i).html(number)
																													req.rejects_batch_number = number
																												}
																											}
																										})

																										break;
																									}
																									case 1: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												// submithData.respible = resolveData.roleStaffId
																												req.rejects_batch_record_staff=resolveData.roleStaffName
																												req.rejects_batch_record_staff_id=resolveData.roleStaffId
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
																										})


																										break;
																									}
																									case 2: {
																										tempData = `<a class="table-link" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>添加编号</a>`
																										tbodyTd.eq(i).addClass("table-input-td")
																										tbodyTd.eq(i).html(tempData)

																										// 添加编号
																										tbodyTd.eq(i).off("click").on("click","a", function(){
																											let dataContent = $('#addCode'),
																											panelList = dataContent.find('.panel'),
																											panelTbody = panelList.find('table tbody'),	// 面板表格
																											modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																											headBtn = dataContent.find('.head-main-btn-1'),
																											modalSubmitBtn = dataContent.find('.modal-submit')

																										
																											dataContent.modal('show') // 运行时显示

																											modalCloseBtn.off('click').on('click', (event) => {
																												// 点击弃用按钮隐藏该模态框
																												dataContent.modal('hide')
																												// 初始化表格
																												panelList.find('thead').empty()
																												panelList.find('tbody').empty()
																											})
																											if(codeList.length!==0){
																												let html=""
																												for(var i=0;i<codeList.length;i++){
																													html+=`
																													<tr>
																														<td >${i+1}</td>
																														<td class="table-input-td">
																															<input type="text" class="table-input projectPrincipal" value=${codeList[i]} >
																														</td>
																														<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`
																												}
																												panelTbody.append(html)
																											}else{
																												headBtn.trigger('click')
																											}


																											headBtn.off('click').on('click', (event) => {
																												let temStr = `
																													<tr>
																															<td ></td>
																															<td class="table-input-td">
																																<input type="text" class="table-input projectPrincipal" placeholder="请输入编号" />
																															</td>
																															<td  class="table-input-td"><a class="table-link delete" href="javascript:"><i class="fa fa-tasks fa-fw" ></i>删除</a></td>
																													</tr>
																													`;
																												panelTbody.append(temStr)
						
																												let  tr=panelList.find('tbody tr');
																												for(let i = 0;i<tr.length;i++){
																													panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																													;
																												}
						
																												panelList.on('click', '.delete', function () {
																													$(this).closest('tr').remove();  //移除该行元素
																													for(let i = 0;i<tr.length;i++){
																														panelList.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																														;
																													}
																												})
																											})

																											modalSubmitBtn.off('click').on('click', (event) => {
																												let codeListPanel = panelTbody.find('tr')
																												for(let i = 0;i<codeListPanel.length;i++){
																													let temp = codeListPanel.eq(i).find('td:nth-child(2)').find("input").val()
																													codeList[i] = temp
																												}
																													console.log(codeList)
																												if (codeList.length!==0
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
																														modalCloseBtn.trigger('click')
																													});
																												}
																												else {
																													swallError();	//格式不正确
																												}
																											})		
																											
																										})
																										break;
																									}
																									case 3: {
																										tbodyTd.eq(i).html(semiFinishName)
																										req.rejects_batch_article_name_id = semiFinishId
																										req.semi_finish_type_id = semiFinishTypeId
																										req.rejects_batch_article_name = semiFinishName
																										break;
																									}

																									case 4: {
																										tbodyTd.eq(i).html(semiFinishTypeName)
																											req.rejects_batch_article_specification = semiFinishTypeName
																										break;
																									}
																									case 5: {
																										tbodyTd.eq(i).html(semiFinishGenre)
																										req.rejects_batch_article_model = semiFinishGenre
																										break;
																									}
																									case 6: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.rejects_batch_quantity = tbodyTd.eq(i).find('input').val()
																										})

																										break;
																									}
																									case 7: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.rejects_batch_unit = tbodyTd.eq(i).find('input').val()
																										})

																										break;
																									}
																									case 8: {
																										inputHtml = `<input type="text" class="table-input" placeholder="点此选择时间(必填)" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"  />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)

																										// 添加到提交数据
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.rejects_batch_record_time = tbodyTd.eq(i).find('input').val()
																										})
																										break;
																									}
																									case 9: {
																										inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																											req.rejects_batch_grade = tbodyTd.eq(i).find('input').val()
																										})

																										break;
																									}
																									case 10: {
																										let	inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
															
																										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																											// 添加员工选择模态框
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData2(resolve, queryStaffUrl, { headNum: 1 })
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												req.rejects_batch_dispose_staff=resolveData.roleStaffName
																												req.rejects_batch_dispose_staff_id=resolveData.roleStaffId
																											})
															
																											$(this).prop('readonly', true) // 输入框只读
																											$(this).off('blur').on('blur', () => {
																												$(this).removeProp('readonly') // 输入移除框只读
																											})
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
																						req.rejects_batch_explain= panel_2_text.val()
																						req.rejects_batch_treatment= panel_3_text.val()
																						req.rejects_batch_barcode= barCodeText.val()
																						req.numlist =  codeList

																						let req2;
																							if(typeof req !== 'string'){
																								req2=JSON.stringify(req)
																							}

																						if (req.rejects_batch_explain !== '' && req.rejects_batch_treatment !== ''&& codeList.length!==0) {
																							swal({
																								title: '您确定要提交本次操作吗?',
																								text: '请确保填写信息无误后点击确定按钮',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							}).then(function () {

																								$.ajax({
																									type: "POST",
																									url: saveRejectsBatchUrl,
																									dataType: "json",
																									　　 xhrFields: {
																													withCredentials: true
																											},
																											crossDomain: true,
																									data:{
																										workOrderId:workOrderId,
																										rejectsBatchStr:req2,
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											let activePaginationBtn = dataContent.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else {
																											swallFail2();	//操作失败
																										}
																									},

																								})
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})

																				})
																				
																					
																				break;
																			}
																			case '#barCodes' :{ //统计
																				let dataContent = $('#detailModal'),
																				panelList = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close')
																				panelList.find('.panel-heading').find('.modal-title').text('统计详情') // 更换panel标题

																				dataContent.modal({
																					backdrop: false, // 黑色遮罩不可点击
																					keyboard: false,  // esc按键不可弃用模态框
																					show: false
																				})

																				modalCloseBtn.off('click').on('click', (event) => {
																					// 点击弃用按钮隐藏该模态框
																					dataContent.modal('hide')
																					// 初始化表格
																					panelList.find('thead').empty()
																					panelList.find('tbody').empty()
																				})
																				dataContent.modal('show') // 运行时显示
																				

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",
																						url: url,
																						dataType: "json",
																						　　 xhrFields: {
																										withCredentials: true
																								},
																								crossDomain: true,
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
																								mesHorizontalTableAddData(panelList.find('table'), null, {
																									thead: '领料次数/退料次数/补料次数/调出次数/调入次数/产出物登记次数/产出物转出次数/报废次数',
																										viewColGroup: 2,
																										importStaticData: (tbodyTd, length) => {
																											let map = result.map, // 映射
																												dataList = map.processStatistics, // 主要数据列表
																												tempData = null; // 表格td内的临时数据
																											for (let i = 0, len = length; i < len; i++)
																												switch (i) {
																													case 0: {
																														tempData = dataList.statistics_requisition_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList.statistics_return_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList.statistics_feeding_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList.statistics_transfer_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList.statistics_accept_transfer_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = dataList.statistics_produce_register_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 6: {
																														tempData = dataList.statistics_produce_rollout_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 7: {
																														tempData = dataList.statistics_scrap_frequency;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																												
																													default:
																														break;
																												}

																										}
																									})


																								}
																							else {
																								panelList.find("tbody").empty().append(NO_DATA_NOTICE)
																								mesloadBox.warningShow();
																							}
																						}
																					})
																				}

																				// 导航栏点击时运行数据加载
																				addTableData(queryWorkOrderProcessStatisticsUrl, {
																					workOrderId: workOrderId
																				});

																				break;
																			}
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
												totalRow: result.map.line, // 总行数
												displayRow: result.map.workOrders.length // 显示行数
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
						addTableData(queryWorkOrderOutlineUrl, {
							type: 'vague',
							userId:USERID,
							headNum: 1
						});
					

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let keyword = $(this).closest('.input-group').find('input').val()
						let productionWorkshopID = productionWorkshopOption.val()
						let workStageID =workStageOption.val()
						event.stopPropagation() // 禁止向上冒泡
						addTableData(queryWorkOrderOutlineUrl, {
							type: 'vague',
							workshopId:productionWorkshopID,
							workstageId:workStageID,
							keyword:keyword,
							userId:USERID,
							headNum:1
						});
					});

					
					// 工序集合下拉选事件
					workStageOption.off('change').on('change',function(){
						let workstageId = $(this).val()
						let productionWorkshopID = productionWorkshopOption.val()
						let keyword = fuzzySearchGroup.closest('.input-group').find('input').val()
						addTableData(queryWorkOrderOutlineUrl, {
							type: 'vague',
							workshopId:productionWorkshopID,
							workstageId:workstageId,
							keyword:keyword,
							userId:USERID,
							headNum:1
						});
					});
					// 车间集合下拉选事件
					productionWorkshopOption.off('change').on('change',function(){
						let workStageID =workStageOption.val()
						let productionWorkshopID = $(this).val()
						let keyword = fuzzySearchGroup.closest('.input-group').find('input').val()
						addTableData(queryWorkOrderOutlineUrl, {
							type: 'vague',
							workshopId:productionWorkshopID,
							workstageId:workStageID,
							keyword:keyword,
							userId:USERID,
							headNum:1
							});
					});

				}())
				 break;
			case '#MessageManage' ://消息管理
				(function(){
					let activeSwiper = $('#MessageManage'),
					dataContent = $('#MessageManageInerSwiper'), // 右侧内部swiper
					panelList = dataContent.find('.panel'),
					panelThead = panelList.find('thead'),
					panelTbody = panelList.find('tbody');
					fuzzySearchGroup = dataContent.find('.fuzzy-search-group'), // 模糊搜索组
					// headingMainBtn_1 = panelList.find('.head-main-btn-1'),// 头部主要按键_1
					paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
					mesloadBox = new MesloadBox(dataContent, {
						// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

					// headingMainBtn_1.text("新增不良品")


					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST",
							url: url,
							dataType: "json",
							　　 xhrFields: {
											withCredentials: true
									},
									crossDomain: true,
							data: data,
							beforeSend: function (xml) {
								// ajax发送前
								mesloadBox.loadingShow()
							},
							success: function (result, status, xhr) {
								// ajax成功
								mesloadBox.hide()
								if (result.status === 0) {
									mesVerticalTableAddData(panelList, {
										thead: {
											theadContent: '序号/工单事件/时间/操作',
											theadWidth: '6%/20%/8%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal2"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#delete"><i class="fa fa-tasks fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射zszs
													dataList = map.messageNotifications, // 主要数据列表
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
																tempData = dataList[currentTr.index()].plan_notification_event;
																// tempData=
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].plan_incident_time;
																currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
															}
																break;
															case 3:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																	messageNotificationId = dataList[currentTr.index()].plan_message_id;
																	switch (dataContent) {
																		case '#detailModal2': {	//详情
																			let dataContent = $('#detailModal2'),
																			panelList= dataContent.find('.panel'),
																			panel_1=panelList.eq(0)
																			panel_2=panelList.eq(1)
																			panel_3=panelList.eq(2)
																			modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																			modalSubmitBtn = dataContent.find('.modal-submit')
																				
																			panel_1.find('.modal-title').text('不良品详情') // 更换panel标题
																			panel_2.find('.modal-title').text('不良品说明') // 更换panel标题
																			panel_3.find('.modal-title').text('不良品处理') // 更换panel标题
																			modalSubmitBtn.hide()

																			dataContent.modal({
																				backdrop: false, // 黑色遮罩不可点击
																				keyboard: false,  // esc按键不可弃用模态框
																				show: false
																			})
																	
																			modalCloseBtn.off('click').on('click', (event) => {
																				// 点击弃用按钮隐藏该模态框
																				dataContent.modal('hide')
																				// 初始化表格
																				dataContent.find('thead').empty()
																				dataContent.find('tbody').empty()
																			})

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST",
																					url: url,
																					dataType: "json",
																					　　 xhrFields: {
																									withCredentials: true
																							},
																							crossDomain: true,
																					data: data,
																					beforeSend: function (xml) {
																						// ajax发送前
																						mesloadBox.loadingShow()
																					},
																					success: function (result, status, xhr) {
																						// ajax成功
																						mesloadBox.hide()
																						if (result.status === 0) {
																							mesHorizontalTableAddData(panel_1.find('table'), null, {
																								thead: '不良品批号/记录人员/不良品编号/不良品名称/不良品规格/不良品型号/不良品数量/单位/记录时间/不良类别/不良品处理人/创建时间/备注',
																								tableWitch: '10%/10%',
																								viewColGroup: 2,
																								importStaticData: (tbodyTd, length) => {
																									let inputHtml;
			
																									for (let i = 0, len = length; i < len; i++) {
																										switch (i) {
																											case 0: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入工艺名称(必填)" autocomplete="on" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
			
																												let target = tbodyTd.eq(i).find('input'),
																												mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });
			
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													mesPopover.hide()
																													// craftBasics.craft_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																													if (!USERNAME_REG1.test(craftBasics.craft_name)) {
																														mesPopover.show()
																													} else {
																														mesPopover.hide()
																													}
																												})
			
																												break;
																											}
																											case 1: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入工艺编号(必填)" autocomplete="on" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_number = tbodyTd.eq(i).find('input').val()
																												})
			
			
																												break;
																											}
																											case 2: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
			
																												// 添加到提交数据
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_describe = tbodyTd.eq(i).find('input').val()
																												})
																												break;
																											}
																											case 3: {
																												inputHtml = `<select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">隐藏</option></select>`
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												// craftBasics.craft_basics_status =0
																												// 添加到提交数据
																												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
																													// craftBasics.craft_basics_status = tbodyTd.eq(i).find('select').val()
																												})
																												break;
																											}
			
																											case 4: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入"  />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_a = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 5: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入"/>`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_b = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 6: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_c = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 7: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_c = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 8: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_c = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 9: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_c = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 10: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_c = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 11: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_c = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
																											case 12: {
																												inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`;
																												tbodyTd.eq(i).addClass('table-input-td')
																												tbodyTd.eq(i).html(inputHtml)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													// craftBasics.craft_basics_c = tbodyTd.eq(i).find('input').val()
																												})
			
																												break;
																											}
			
																											default:
																												break;
																										}
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

																			// 导航栏点击时运行数据加载
																			addTableData(queryCraftBasicsUrl, {
																				type: 'vague',
																				status:0,
																				headNum: 1
																			});
																			
																			break;
																		}
																		case '#delete' :{
																			console.log(dataContent)
																			alert("删除?")
																		}


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
											totalRow: result.map.line, // 总行数
											displayRow: result.map.messageNotifications.length // 显示行数
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
					addTableData(queryMessageNotificationUrl, {
						type: 'particulars',
						userId:USERID,
						headNum: 1
					});
				}())
				break;



		}
	})

	leftNavLink.eq(0).trigger('click');
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
		modalTitle = selectStaffModal.find('.panel-title'),
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
			type: "POST",
			url: url,
			dataType: "json",
			　　 xhrFields: {
							withCredentials: true
					},
					crossDomain: true,
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
 * @description :暂存区选择模态框（单选),第二层弹窗调用
 *@param resolve: Promise回调函数
 *@param url: 请求路径
 *@param data: 请求参数
 */
function selectWorkingArea(resolve, url, data) {
	let selectStaffModal = $('#publicSelectModalBox'), // 模态框
		staffListPanel = selectStaffModal.find('.panel'), // 面板
		targetTable = staffListPanel.find('table'),
		panelTbody = staffListPanel.find('tbody'),	//面版表格tbody
		paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
		selectDepartment = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
		fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
		modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
		modalTitle = selectStaffModal.find('.panel-title'),
		mesloadBox = new MesloadBox(staffListPanel, {
			// 主数据载入窗口
			warningContent: '没有此类信息，请重新选择或输入'
		})

	// 需要的功能
	selectDepartment.hide()
	fuzzySearchGroup.hide()

	// 初始化模态框
	modalTitle.html('选择暂存区')
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
		staffListPanel.find('tbody').empty()
		staffListPanel.find('thead').empty()
	})

	// 加载数据
	function addTableData(url, data) {
		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			　　 xhrFields: {
							withCredentials: true
					},
					crossDomain: true,
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
							theadContent: '序号/区域名称/区域编号',
							theadWidth: '10%/30%/30%'
						},
						tbody: {
							html: [
								'<td></td>',
								'<td></td>',
								'<td></td>',
							],

							// 添加表格主体数据, 这是一个回调函数,这里不需要传参
							dataAddress: function (tbodyTarget, html, result) {
								tbodyTarget.empty() // 清空表格主体
								let map = result.map, // 映射
									dataList = map.workingArea, // 主要数据列表
									tempData = null; // 表格td内的临时数据

								for (let i = 0, len = dataList.length; i < len; i++) {
									tbodyTarget.append('<tr></tr>'); // 添加行
									let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
									currentTr.off('click').on('click', (event) => {
										selectStaffModal.modal('hide')
										resolve({
											areaId: dataList[currentTr.index()].role_working_area_id,
											areaName: dataList[currentTr.index()].role_working_area_name
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
												tempData = dataList[currentTr.index()].role_working_area_name;
												currentTr.children().eq(i).html(tempData)
											}
												break;
											case 2: {
												tempData = dataList[currentTr.index()].role_working_area_number;
												currentTr.children().eq(i).html(tempData)
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
							displayRow: result.map.workingArea.length // 显示行数
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
		headNum: 1
	}) // 启动运行

}
	/**
 * @description :工单生产批号选择模态框（单选),第二层弹窗调用
 *@param resolve: Promise回调函数
 *@param url: 请求路径
 *@param data: 请求参数
 */
function selectWorkOrder(resolve, url, data) {
	let selectStaffModal = $('#publicSelectModalBox'), // 模态框
		staffListPanel = selectStaffModal.find('.panel'), // 面板
		targetTable = staffListPanel.find('table'),
		// panelTbody = staffListPanel.find('tbody'),	//面版表格tbody
		paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
		selectDepartment = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
		fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
		modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
		modalTitle = selectStaffModal.find('.panel-title'),
		mesloadBox = new MesloadBox(staffListPanel, {
			// 主数据载入窗口
			warningContent: '没有此类信息，请重新选择或输入'
		})

	// 需要的功能
	selectDepartment.hide()
	fuzzySearchGroup.show()

	// 初始化模态框
	modalTitle.html('选择工单')
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
			type: "POST",
			url: url,
			dataType: "json",
			　　 xhrFields: {
							withCredentials: true
					},
					crossDomain: true,
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
							theadContent: '序号/工单生产批号/工单号/工单负责人',
							theadWidth: '6%/40%/40%/10%'
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
									dataList = map.workOrders, // 主要数据列表
									tempData = null; // 表格td内的临时数据

								for (let i = 0, len = dataList.length; i < len; i++) {
									tbodyTarget.append('<tr></tr>'); // 添加行
									let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
									currentTr.off('click').on('click', (event) => {
										selectStaffModal.modal('hide')
										resolve({
											workOrdersNumber: dataList[currentTr.index()].work_order_number,
											workOrdersId: dataList[currentTr.index()].work_order_id,
											planId: dataList[currentTr.index()].production_plan_id,
											workOrdersRes: dataList[currentTr.index()].work_order_responsible,
											workOrdersResId: dataList[currentTr.index()].work_order_responsible_id,
											productionPlanBatchNumber: dataList[currentTr.index()].plan.production_plan_batch_number//生产批号
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
												tempData = dataList[currentTr.index()].plan.production_plan_batch_number;//生产批号
												currentTr.children().eq(i).html(tempData)
											}
												break;
											case 2: {
												tempData = dataList[currentTr.index()].work_order_number;
												currentTr.children().eq(i).html(tempData)
											}
												break;
											case 3: {
												try {
													tempData = dataList[currentTr.index()].work_order_responsible;
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
							totalRow: result.map.workOrders.length, // 总行数
							displayRow: result.map.workOrders.length // 显示行数
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
		type: 'vague',
		userId:USERID,
		headNum: 1
	});

	fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
		let val = $(this).closest('.input-group').find('input').val();
		event.stopPropagation() // 禁止向上冒泡
		if (val !== '') {
			addTableData(url, {
				type: 'vague',
				userId:USERID,
				headNum: 1,
				keyword: val
			}) // 启动运行
		}
		else {
			// 为空时搜索全部
			addTableData(url, {
				type: 'vague',
				userId:USERID,
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
	 * @description :车间选择模态框（单选）
	 *@param resolve: Promise回调函数
	 */
	function selectRoleAddData(resolve) {
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
		modalTitle.html('选择工艺')
		selectDepartment.remove()
		// staffListPanel.remove(selectDepartment)

		// 设备下拉菜单添加选项
	

		// selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
		// 	$('body').addClass('modal-open')
		// })
		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可弃用模态框
			show: false
		})
		selectStaffModal.modal('show') // 运行时显示
		modalCloseBtn.off('click').on('click', (event) => {
			// 点击弃用按钮隐藏该模态框
			selectStaffModal.modal('hide')

			// 初始化表格
			targetTable.find('thead').empty()
			targetTable.find('tbody').empty()
		})

		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST",
				url: url,
				dataType: "json",
				　　 xhrFields: {
								withCredentials: true
						},
						crossDomain: true,
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
								theadContent: '序号/车间名称/车间地址/负责人',
								theadWidth: '10%/20%/20%/20%'
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
										dataList = map.workshopInfos, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												roleId: dataList[currentTr.index()].role_workshop_id,
												roleName: dataList[currentTr.index()].role_workshop_name,
												roleNumber: dataList[currentTr.index()].role_workshop_site
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
													tempData = dataList[currentTr.index()].role_workshop_name;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].role_workshop_site;
													currentTr.children().eq(i).html(tempData);

												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].role_workshop_principal;
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
								displayRow: result.map.workshopInfos.length // 显示行数
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
		addTableData(queryWorkshopsUrl, {
      type: 'info',
			workshopId: '',
			// async:false,
			workshopName: '',
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryCraftBasicsUrl, {
					type: 'vague',
					keyWord: val,
					headNum: 1
				})
			}
			else {
				// 为空时重置搜索
				return;
			}

		})

		// 模糊搜索回车搜索
		fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault()
				$(this).closest('.input-group').find('button').trigger('click')
			}

		})

		// 下拉选事件
		

	}

	//仓库选择选择模态框
	function selectWarehousesAddData(resolve) {
		let targetModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			selectDropDownMenu = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.panel-title'),
			url = queryWarehousesUrl, // 请求网址
			data = {
				// 默认传递参数
				headNum: 1
			},
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 需要的功能
		selectDropDownMenu.hide()
		fuzzySearchGroup.hide()

		// 初始化设置
		modalTitle.html('选择仓库') // 设置标题

		// 给body添加.modal-open
		targetModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
			$('body').addClass('modal-open')
		})
		targetModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可关闭模态框
			show: false
		})
		targetModal.modal('show')
		modalCloseBtn.off('click').on('click', (event) => {
			// 初始化表格
			targetTable.find('thead').empty()
			targetTable.find('tbody').empty()

			// 点击关闭按钮隐藏该模态框
			targetModal.modal('hide')
		})
		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST",
				url: url,
				dataType: "json",
				　　 xhrFields: {
								withCredentials: true
						},
						crossDomain: true,
				// data: data,
				beforeSend: function (xml) {
					// ajax发送前
					mesloadBox.loadingShow()
				},
				success: function (result, status, xhr) {
					// ajax成功
					mesloadBox.hide()
					if (result.map.warehouse) {
						mesVerticalTableAddData(targetModalPanel, {
							thead: {
								theadContent: '序号/仓库名称/仓库地址',
								theadWidth: '30%/30%/30%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>'
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.warehouse, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行


										currentTr.off('click').on('click', (event) => {
											targetModal.modal('hide')
											resolve({
												warehouseID: dataList[currentTr.index()].warehouse_id,
												warehouseName: dataList[currentTr.index()].warehouse_name
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
													try {
														tempData = dataList[currentTr.index()].warehouse_name;
														if (tempData != null) {
															currentTr.children().eq(i).html(tempData)
														}
														else {
															currentTr.children().eq(i).html('暂无数据')
														}
													}
													catch (e) {
														currentTr.children().eq(i).html('暂无数据')
													}
												}
													break;
												case 2: {
													try {
														tempData = dataList[currentTr.index()].warehouse_site;
														if (tempData != null) {
															currentTr.children().eq(i).html(tempData)
														}
														else {
															currentTr.children().eq(i).html('暂无数据')
														}
													}
													catch (e) {
														currentTr.children().eq(i).html('暂无数据')
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
								totalRow: 1, // 总行数
								displayRow: result.map.warehouse.length // 显示行数
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

		// 下拉菜单搜索选项 (关闭)
		function departmentSelectAddOption(target, url, data) {
			let originalOption = ['全部供应商'], // 初始化选项
				originalFunction = [], // 初始化选项方法
				originalOptionLength = 0;

			originalFunction[0] = () => {
				addTableData(url, data)
			}

			target.children().remove() // 清空选项

			// 添加初始化选项
			if (originalOption != null) {
				originalOptionLength = originalOption.length;
				for (let i = 0, len = originalOptionLength; i < len; i++) {
					let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

					target.append(optionHtml);
					target.children().eq(i).off('click').on('click', originalFunction[i]);
				}
			}

			$.ajax({
				url: url,
				dataType: "json",
			　　 xhrFields: {
							withCredentials: true
					},
					crossDomain: true,
				type: 'POST',
				data: data,
				success: (result) => {
					let warehouseList = result.map.suppliers;

					for (let i = 0, len = warehouseList.length; i < len; i++) {
						let optionHtml = `<option value="${warehouseList[i].supplier_name}">${warehouseList[i].supplier_name}</option>`;
						target.append(optionHtml);
						target.children().eq(i + originalOptionLength).off('click').on('click', () => {
							addTableData(url, {
								type: 'id',
								supplierId: warehouseList[i].supplier_id,
								headNum: 1
							})
						})
					}
				}
			})
		}
		// departmentSelectAddOption(selectSuppliers, url, data)

		// 模糊搜索组加载数据 (关闭)
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				if (val !== '') {
					addTableData(url, {
						workshopName: val,
						workshopId: '',
						headNum: 1
					})
					// $(this).closest('.input-group').find('input').val('')
				}
				else {
					// 为空时重置搜索
					addTableData(url, data);
				}

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('keydown').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
					$(this).closest('.input-group').find('input').val('')
				}
			});
		}
		 fuzzySearchFunc(fuzzySearchGroup, url, data)
	}
	//班次选择选择模态框
	function selectClassesAddData(resolve) {
		let targetModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			selectDropDownMenu = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.panel-title'),
			url = queryClassesUrl, // 请求网址
			data = {
				// 默认传递参数
				type:"info",
				headNum:1
			},
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 需要的功能
		selectDropDownMenu.hide()
		fuzzySearchGroup.hide()

		// 初始化设置
		modalTitle.html('选择班次') // 设置标题

		// 给body添加.modal-open
		targetModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
			$('body').addClass('modal-open')
		})
		targetModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可关闭模态框
			show: false
		})
		targetModal.modal('show')
		modalCloseBtn.off('click').on('click', (event) => {
			// 初始化表格
			targetTable.find('thead').empty()
			targetTable.find('tbody').empty()

			// 点击关闭按钮隐藏该模态框
			targetModal.modal('hide')
		})
		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST",
				url: url,
				dataType: "json",
				　　 xhrFields: {
								withCredentials: true
						},
						crossDomain: true,
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
								theadContent: '序号/班次名称/班次说明',
								theadWidth: '30%/30%/30%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>'
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.classes, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行


										currentTr.off('click').on('click', (event) => {
											targetModal.modal('hide')
											resolve({
												classID: dataList[currentTr.index()].role_class_id,
												className: dataList[currentTr.index()].role_class_name
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
													try {
														tempData = dataList[currentTr.index()].role_class_name;
														if (tempData != null) {
															currentTr.children().eq(i).html(tempData)
														}
														else {
															currentTr.children().eq(i).html('暂无数据')
														}
													}
													catch (e) {
														currentTr.children().eq(i).html('暂无数据')
													}
												}
													break;
												case 2: {
													try {
														tempData = dataList[currentTr.index()].role_class_detail;
														if (tempData != null) {
															currentTr.children().eq(i).html(tempData)
														}
														else {
															currentTr.children().eq(i).html('暂无数据')
														}
													}
													catch (e) {
														currentTr.children().eq(i).html('暂无数据')
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
								displayRow: result.map.classes.length // 显示行数
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

		// 下拉菜单搜索选项 (关闭)
		function departmentSelectAddOption(target, url, data) {
			let originalOption = ['全部供应商'], // 初始化选项
				originalFunction = [], // 初始化选项方法
				originalOptionLength = 0;

			originalFunction[0] = () => {
				addTableData(url, data)
			}

			target.children().remove() // 清空选项

			// 添加初始化选项
			if (originalOption != null) {
				originalOptionLength = originalOption.length;
				for (let i = 0, len = originalOptionLength; i < len; i++) {
					let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

					target.append(optionHtml);
					target.children().eq(i).off('click').on('click', originalFunction[i]);
				}
			}

			$.ajax({
				url: url,
				dataType: "json",
			　　 xhrFields: {
							withCredentials: true
					},
					crossDomain: true,
				type: 'POST',
				data: data,
				success: (result) => {
					let warehouseList = result.map.suppliers;

					for (let i = 0, len = warehouseList.length; i < len; i++) {
						let optionHtml = `<option value="${warehouseList[i].supplier_name}">${warehouseList[i].supplier_name}</option>`;
						target.append(optionHtml);
						target.children().eq(i + originalOptionLength).off('click').on('click', () => {
							addTableData(url, {
								type: 'id',
								supplierId: warehouseList[i].supplier_id,
								headNum: 1
							})
						})
					}
				}
			})
		}
		// departmentSelectAddOption(selectSuppliers, url, data)

		// 模糊搜索组加载数据 (关闭)
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				if (val !== '') {
					addTableData(url, {
						workshopName: val,
						workshopId: '',
						headNum: 1
					})
					// $(this).closest('.input-group').find('input').val('')
				}
				else {
					// 为空时重置搜索
					addTableData(url, data);
				}

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('keydown').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
					$(this).closest('.input-group').find('input').val('')
				}
			});
		}
		 fuzzySearchFunc(fuzzySearchGroup, url, data)
	}


	//后续修改的bug
	$('.treeview>a:first-child').click(function(){
		$('.treeview>a:first-child').removeClass('treeview-active')
		$(this).addClass('treeview-active')
	})
})

