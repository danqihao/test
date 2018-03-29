/*
 * @Author: MES
 * @Date: 2017-07-28 16:12:45
 * @Last Modified by: lishizhi
 * @Last Modified time: 2017-08-23 16:00:15
 */
$(function () {
	let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
		RightContent = $('#mainRightContent'), // 右侧内容栏
		RightContentSwiper = RightContent.find('.swiper-wrapper'), // 右侧内容栏下的swiper
		leftNavLink = leftNav.find('a').filter('[href^="#"]'), // 左侧变栏对应的swiper
		mainModal_1 = $('#modalBox').find('#mainModal_1'); // 主要模态框1

	// 公共URL
	let queryWarehousesUrl = BASE_PATH + '/' + "queryWarehouses.do", // 获取仓库下拉数据
		queryCategoryUrl = BASE_PATH + '/' + "queryMaterialType.do", // 获取部门、物料、设备下拉数据
		queryStaffUrl = BASE_PATH + '/' + "queryStaff.do", // 查询员工
		queryPlanBatchsURl = BASE_PATH + '/' + 'queryPlanBatchNumber.do', // 查询生产计划批次
		queryWorkshopsUrl = BASE_PATH + '/' + 'queryWorkShopInfos.do'; // 查询生产车间

	// 物料模块URL
	let queryAllMaterialsUrl = BASE_PATH + '/' + "queryAllMaterials.do", // 获取所有物料数据
		queryMaterialsUrl = BASE_PATH + '/' + "queryMaterials.do", // 搜索物料数据
		queryMaterialInventoryUrl = BASE_PATH + '/' + "queryMaterialInventory.do", // 查询新增物料登记、入库等物料信息数据

		removeMaterialInfoUrl = BASE_PATH + '/' + 'removeMaterialInfo.do', // 删除物料基础信息
		saveMaterialInfosUrl = BASE_PATH + '/' + 'saveMaterialInfos.do', // 新增物料基础信息
		modifyMaterialInfoUrl = BASE_PATH + '/' + 'modifyMaterialInfo.do', // 修改物料基础信息

		saveMaterialEntrysUrl = BASE_PATH + '/' + 'saveMaterialEntrys.do', // 提交新增物料入库信息
		removeMaterialEntrysUrl = BASE_PATH + '/' + 'removeMaterialEntrys.do', // 批量删除物料入库记录

		removeMaterialRecordsUrl = BASE_PATH + '/' + 'removeMaterialRecords.do', // 删除物料登记信息
		saveMaterialRecordsUrl = BASE_PATH + '/' + 'saveMaterialRecords.do', // 新增物料登记信息

		removeMaterialOutsUrl = BASE_PATH + '/' + 'removeMaterialOuts.do', // 删除物料出库信息
		saveMaterialOutsUrl = BASE_PATH + '/' + 'saveMaterialOuts.do', // 新增物料出库信息

		removeMaterialReturnsUrl = BASE_PATH + '/' + 'removeMaterialReturns.do', // 删除物料返还信息
		saveMaterialReturnsUrl = BASE_PATH + '/' + 'saveMaterialReturns.do', // 新增物料返还信息

		removeMaterialTransfersUrl = BASE_PATH + '/' + 'removeMaterialTransfers.do', // 删除物料调拨信息
		saveMaterialTransfersUrl = BASE_PATH + '/' + 'saveMaterialTransfers.do', // 新增物料调拨信息

		removeMaterialChecksUrl = BASE_PATH + '/' + 'removeMaterialChecks.do', // 删除物料调拨信息
		saveMaterialChecksUrl = BASE_PATH + '/' + 'saveMaterialChecks.do', // 新增物料调拨信息

		querySuppliersUrl = BASE_PATH + '/' + 'querySuppliers.do', // 查询供应商
		saveSupplierUrl = BASE_PATH + '/' + 'saveSupplier.do', // 新增供应商
		removeSuppliersUrl = BASE_PATH + '/' + 'removeSuppliers.do' // 删除供应商

	// 成品模块URL
	let queryProductInfosUrl = BASE_PATH + '/' + 'queryProductInfos.do', // 查询成品基础信息
		queryProductModelsUrl = BASE_PATH + '/' + 'queryProductModels.do', // 查询成品型号
		queryProductInventorysUrl = BASE_PATH + '/' + 'queryProductInventorys.do', // 查询成品库存
		modifyProductInfoUrl = BASE_PATH + '/' + 'modifyProductInfo.do', // 修改成品信息
		saveProductInfosUrl = BASE_PATH + '/' + 'saveProductInfos.do', // 新增成品信息
		removeProductInfosUrl = BASE_PATH + '/' + 'removeProductInfos.do', // 删除成品信息

		queryProductEntrysUrl = BASE_PATH + '/' + 'queryProductEntrys.do', // 查询成品入库信息
		saveProductEntrysUrl = BASE_PATH + '/' + 'saveProductEntrys.do', // 添加成品入库记录
		removeProductEntrysUrl = BASE_PATH + '/' + 'removeProductEntrys.do', // 批量删除成品入库记录

		queryProductOutsUrl = BASE_PATH + '/' + 'queryProductOuts.do', // 查询成品出库记录
		saveProductOutsUrl = BASE_PATH + '/' + 'saveProductOuts.do', // 添加成品出库记录
		removeProductOutsUrl = BASE_PATH + '/' + 'removeProductOuts.do' // 添加成品出库记录

	//员工选择模态框
	function selectStaffAddData (resolve, url, data) {
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
		selectDepartment.show()
		fuzzySearchGroup.show()

		// 修改标题
		modalTitle.html('选择工作人员')

		selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
			$('body').addClass('modal-open')
		})
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
		function addTableData (url, data) {
			$.ajax({
				type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
													try {
														tempData = dataList[currentTr.index()].role_staff_name;
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
														tempData = dataList[currentTr.index()].role_staff_number;
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
												case 3: {
													try {
														tempData = dataList[currentTr.index()].post.role_post_name;
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
								displayRow: result.map.staffs.length // 显示行数
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
		function fuzzySearchFunc (fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				if (val !== '') {
					addTableData(url, {
						type: 'info',
						staffName: val,
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
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
					// $(this).closest('.input-group').find('input').val('')
				}
			});
		}

		fuzzySearchFunc(fuzzySearchGroup, url, data)

	}

	//供应商选择模态框
	/**
	 * @description
	 * @author lishizhi
	 * @param {any} resolve
	 * @param {any} url
	 * @param {any} data
	 */
	function selectSuppliersAddData (resolve, url, data) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			targetTbody = targetTable.find('tbody'),
			selectSuppliers = staffListPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 需要的功能
		selectSuppliers.hide()
		fuzzySearchGroup.hide()

		// 初始化设置
		modalTitle.html('选择供应商')

		// 给body添加.modal-open
		selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
			$('body').addClass('modal-open')
		})
		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可关闭模态框
			show: false
		})
		selectStaffModal.modal('show')
		modalCloseBtn.off('click').on('click', (event) => {
			// 点击关闭按钮隐藏该模态框
			selectStaffModal.modal('hide')

			// 初始化表格
			targetTable.find('thead').empty()
			targetTable.find('tbody').empty()
		})

		// 加载数据
		function addTableData (url, data) {
			$.ajax({
				type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
								theadContent: '序号/名称/性质/地址/电话',
								theadWidth: '10%/20%/20%/25%/25%'
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
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.suppliers, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行


										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												supplierId: dataList[currentTr.index()].supplier_id,
												supplierName: dataList[currentTr.index()].supplier_name
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
														tempData = dataList[currentTr.index()].supplier_name;
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
														tempData = dataList[currentTr.index()].supplier_property;
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
												case 3: {
													try {
														tempData = dataList[currentTr.index()].supplier_address;
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
												case 4: {
													try {
														tempData = dataList[currentTr.index()].supplier_phone;
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
								displayRow: result.map.suppliers.length // 显示行数
							},

							ajax: {
								url: url,
								data: data
							}
						})
					}
					else {
						targetTbody.empty()
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(url, data) // 启动运行
	}

	//生产计划批次模态框
	function selectPlanBatchsAddData (resolve) {
		let targetModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			selectDropDownMenu = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.modal-title'),
			url = queryPlanBatchsURl, // 请求网址
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
		modalTitle.html('选择生产计划批次') // 设置标题

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
		function addTableData (url, data) {
			$.ajax({
				type: "POST",
				xhrFields: { withCredentials: true },
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
						mesVerticalTableAddData(targetModalPanel, {
							thead: {
								theadContent: '序号/计划批次/数量/开始时间/结束时间/负责人',
								theadWidth: '5%/20%/20%/20%/20%/15%'
							},
							tbody: {
								html: [
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
										dataList = map.plans, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行


										currentTr.off('click').on('click', (event) => {
											targetModal.modal('hide')
											resolve({
												planBatchId: dataList[currentTr.index()].production_plan_id,
												planBatch: dataList[currentTr.index()].production_plan_batch_number
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
														tempData = dataList[currentTr.index()].production_plan_batch_number;
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
														tempData = dataList[currentTr.index()].production_batch_production_number;
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
												case 3: {
													try {
														tempData = dataList[currentTr.index()].production_scheduled_start_time;
														if (tempData != null) {
															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
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
												case 4: {
													try {
														tempData = dataList[currentTr.index()].production_actual_start_time;
														if (tempData != null) {
															currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
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
												case 5: {
													try {
														tempData = dataList[currentTr.index()].production_actual_finish_time;
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
								totalRow: result.map.line, // 总行数
								displayRow: result.map.plans.length // 显示行数
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

		// 模糊搜索组加载数据 (开启)
		function fuzzySearchFunc (fuzzySearchGroupTarget, url, data) {
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

	//车间选择选择模态框
	function selectWorkshopsAddData (resolve) {
		let targetModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			targetTbody = targetTable.find('tbody'),
			selectDropDownMenu = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.modal-title'),
			url = queryWorkshopsUrl, // 请求网址
			data = {
				// 默认传递参数
				type: 'info',
				headNum: 1
			},
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 需要的功能
		selectDropDownMenu.hide()
		fuzzySearchGroup.show()

		// 初始化设置
		modalTitle.html('选择车间') // 设置标题

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
		function addTableData (url, data) {
			$.ajax({
				type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
								theadContent: '序号/车间名称/车间地址/负责人/备注',
								theadWidth: '10%/20%/20%/20%/30%'
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
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.workshopInfos, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行


										currentTr.off('click').on('click', (event) => {
											targetModal.modal('hide')
											resolve({
												workshopID: dataList[currentTr.index()].role_workshop_id,
												workshopName: dataList[currentTr.index()].role_workshop_name
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
														tempData = dataList[currentTr.index()].role_workshop_name;
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
														tempData = dataList[currentTr.index()].role_workshop_site;
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
												case 3: {
													try {
														tempData = dataList[currentTr.index()].role_workshop_principal;
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
												case 4: {
													try {
														tempData = dataList[currentTr.index()].role_workshop_describe;
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
								displayRow: result.map.workshopInfos.length // 显示行数
							},

							ajax: {
								url: url,
								data: data
							}
						})
					}
					else {
						targetTbody.empty()
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(url, data) // 启动运行

		// 下拉菜单搜索选项 (关闭)
		function departmentSelectAddOption (target, url, data) {
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
				dataType: 'json',
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
		function fuzzySearchFunc (fuzzySearchGroupTarget, url, data) {
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
		// fuzzySearchFunc(fuzzySearchGroup, url, data)
	}

	//仓库选择选择模态框
	function selectWarehousesAddData (resolve) {
		let targetModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			selectDropDownMenu = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.modal-title'),
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
		fuzzySearchGroup.show()

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
		function addTableData (url, data) {
			$.ajax({
				type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
				url: url,
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
								theadWidth: '10%/45%/45%'
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
		function departmentSelectAddOption (target, url, data) {
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
				dataType: 'json',
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
		function fuzzySearchFunc (fuzzySearchGroupTarget, url, data) {
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
		// fuzzySearchFunc(fuzzySearchGroup, url, data)
	}

	leftNavLink.on('click', function (event) {
		let targetHref = event.currentTarget.getAttribute('href');

		switch (targetHref) {
			case '#warehouseManagement1-1':  //物料信息
				(function () {
					let activeSwiper = $('#warehouseManagement1-1'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-1-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '物料信息',
						ajaxDataType = 'inventory',
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						submitData = {
							materialName: '', // 物料名
							materialTypeId: '', // 物料类型id
							materialStandard: '', // 规格
							materialModel: '', // 型号
							materialUnits: '', // 单位
							materialShelfLife: ''// 保质期
						},
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/规格/型号/单位/现存总数/编辑',
											theadWidth: '5%/15%/15%/15%/15%/15%/30%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="#" data-toggle-modal-target="dataChange"><i class="fa fa-trash-o fa-fw"></i>修改</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.materials, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_name;
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
																	tempData = dataList[currentTr.index()].warehouse_material_standard;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_model;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_units;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].totalCount;
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
															case 6:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {
																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('物料详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: 'info',
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						// thead: '物料名称/物料规格/物料类型/物料型号/单位/数量/更新时间/所属仓库/所属工艺段/用途',
																						thead: '物料名称/物料规格/物料类型/物料型号/单位/保质期(月)',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.materials, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].warehouse_material_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].warehouse_material_standard;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].warehouse_material_type_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].warehouse_material_model;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].warehouse_material_units;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].warehouse_material_shelf_life;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')

																						if (dismiss === 'timer') {
																							activePaginationBtn.trigger('click') // 删除当前行
																						}
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrMaterialId = dataList[currentTr.index()].warehouse_material_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMaterialInfoUrl,
																					type: 'POST',
																					data: {
																						materialId: currentTrMaterialId
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
																									if (dismiss === 'timer') {
																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')

																										if (dismiss === 'timer') {
																											activePaginationBtn.trigger('click') // 删除当前行
																										}
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
																			break
																		}
																		case 'dataChange': {
																			let targetModal = $('#publicHorizontalTableModal'),
																				modalPanelTarget = targetModal.find('.panel'),
																				modalCloseBtn = targetModal.find('.modal-header').find('.close'), // 模态框关闭按钮
																				modalSubmitBtn = targetModal.find('.modal-submit') // 模态框提交按钮
																			mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_id,
																				submitData = {
																					materialId: '',
																					materialName: '',
																					materialTypeId: '',
																					materialStandard: '',
																					materialModel: '',
																					materialUnits: '',
																					materialShelfLife: ''
																				};

																			submitData.materialId = currentTargetMaterialID,
																			serverMaterialName = ''
																			targetModal.find('.modal-header').find('.modal-title').html('修改物料'); // 模态页头标题更换
																			targetModal.find('.modal-footer').show(); // 模态框页脚隐藏

																			targetModal.modal({
																				backdrop: false, // 黑色遮罩不可点击
																				keyboard: false,  // esc按键不可关闭模态框
																				show: false
																			})
																			targetModal.modal('show')

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: 'info',
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					serverMaterialName = result.map.materials[0].warehouse_material_name
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '物料名/物料类型/规格/型号/单位/保质期',
																						importData: (tbodyTd, length) => {
																							let defaultInputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																								map = result.map, // 映射
																								dataList = map.materials, // 主要数据列表
																								tempData = null, // 表格td内的临时数据
																								dropDownOptionHTMLlist = []

																							$.ajax({
																								url: queryCategoryUrl,
																								dataType: 'json',
																								type: 'POST',
																								success: (result) => {
																									dropDownOptionHTMLlist = []
																									let materialTypeList = result.map.materialTypes;
																									for (let i = 0, len = materialTypeList.length; i < len; i++) {
																										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;
																										dropDownOptionHTMLlist[i] = optionHtml;
																									}

																									for (let i = 0, len = length; i < len; i++) {
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].warehouse_material_name;
																												submitData.materialName = tempData
																												tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																												tbodyTd.eq(i).find('input').val(tempData)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													let currentInput = event.currentTarget

																													event.stopPropagation() // 禁止冒泡
																													submitData.materialName = $(currentInput).val()
																												})
																												break;
																											}
																											case 1: {
																												tbodyTd.eq(i).addClass('table-input-td').html('<select class="form-control table-input input-sm"></select>')
																												submitData.materialTypeId = dataList[0].warehouse_material_type_id
																												let selectedIndex = 0
																												for (let j = 0, len = dropDownOptionHTMLlist.length; j < len; j++) {
																													tbodyTd.eq(i).find('select').append(dropDownOptionHTMLlist[j])
																													if (submitData.materialTypeId == dropDownOptionHTMLlist[j].warehouse_material_type_id) {
																														selectedIndex = j
																													}
																												}

																												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
																													let currentInput = event.currentTarget

																													event.stopPropagation() // 禁止冒泡
																													submitData.materialTypeId = $(currentInput).val()
																													currentInput.selectedIndex = selectedIndex
																												})
																												break;
																											}
																											case 2: {
																												tempData = dataList[0].warehouse_material_standard;
																												submitData.materialStandard = tempData
																												tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																												tbodyTd.eq(i).find('input').val(tempData)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													let currentInput = event.currentTarget

																													event.stopPropagation() // 禁止冒泡
																													submitData.materialStandard = $(currentInput).val()
																												})
																												break;
																											}
																											case 3: {
																												tempData = dataList[0].warehouse_material_model;
																												submitData.materialModel = tempData
																												tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																												tbodyTd.eq(i).find('input').val(tempData)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													let currentInput = event.currentTarget

																													event.stopPropagation() // 禁止冒泡
																													submitData.materialModel = $(currentInput).val()
																												})
																												break;
																											}
																											case 4: {
																												tempData = dataList[0].warehouse_material_units;
																												submitData.materialUnits = tempData
																												tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																												tbodyTd.eq(i).find('input').val(tempData)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													let currentInput = event.currentTarget

																													event.stopPropagation() // 禁止冒泡
																													submitData.materialUnits = $(currentInput).val()
																												})
																												break;
																											}
																											case 5: {
																												tempData = dataList[0].warehouse_material_shelf_life;
																												submitData.materialShelfLife = tempData
																												tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																												tbodyTd.eq(i).find('input').val(tempData)
																												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																													let currentInput = event.currentTarget

																													event.stopPropagation() // 禁止冒泡
																													submitData.materialShelfLife = $(currentInput).val()
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
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				}
																			})

																			// 横向表格添加数据


																			// 提交数据
																			function submitModalData () {
																				let submitBtn = modalSubmitBtn

																				submitBtn.off('click').on('click', (event) => {
																					event.stopPropagation()
																					if (
																						submitData.materialId !== ''
																						&& submitData.materialModel !== ''
																						&& submitData.materialShelfLife !== ''
																						&& submitData.materialStandard !== ''
																						&& submitData.materialTypeId !== ''
																						&& submitData.materialUnits !== ''
																					) {
																						submitData.materialName === serverMaterialName
																						submitData.materialName = ''
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
																								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: modifyMaterialInfoUrl,
																								data: submitData,
																								success: function (result, status, xhr) {
																									console.log(result)
																									if (result.status === 0) {
																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																									}
																									else {
																										swal({
																											title: result ? result.msg : '提交失败，请重新提交',
																											type: 'question',
																											allowEscapeKey: false, // 用户按esc键不退出
																											allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																											showCancelButton: false, // 显示用户取消按钮
																											confirmButtonText: '确定',
																										})
																									}
																								}
																							})
																						});
																					}
																					else {
																						swal({
																							title: '格式不正确，请重新输入',
																							text: '请检查格式是否正确后再点击提交',
																							type: 'warning',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: false, // 显示用户取消按钮
																							confirmButtonText: '确定',
																						})
																					}

																				})
																			}
																			submitModalData()

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
											totalRow: result.map.materialInventryLine || result.map.materialInfoLine, // 总行数
											displayRow: result.map.materials.length || result.map.materialInfoLine.length // 显示行数
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
					addTableData(queryAllMaterialsUrl, {
						type: ajaxDataType,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryMaterialsUrl, {
								type: 'info',
								value: val,
								headNum: 1,
								key: 'keyWord'
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let modalContainer = $(document.getElementById('publicHorizontalTableModal')), // 模态框容器
							modalCloseBtn = modalContainer.find('.modal-header').find('.close'), // 模态框关闭按钮
							modalPanel = modalContainer.find('.panel'), // 模态框内部面板
							modalTitle = modalContainer.find('.modal-header').find('.modal-title'), // 模态框标题
							modalSubmitBtn = modalContainer.find('.modal-submit'), // 模态框提交按钮
							dropDownOptionHTMLlist = []


							$.ajax({
								url: queryCategoryUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									dropDownOptionHTMLlist = []
									let materialTypeList = result.map.materialTypes;
									for (let i = 0, len = materialTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;
										dropDownOptionHTMLlist[i] = optionHtml;
									}
									submitData.materialTypeId = materialTypeList[0].warehouse_material_type_id

									// 更换标题
									modalTitle.html('新增物料')

									// 横向表格添加数据
									mesHorizontalTableAddData(modalPanel.find('table'), null, {
										thead: '物料名（必填）/物料类型（必填）/规格（必填）/型号（必填）/单位（必填）/保质期(月)（必填）',
										importStaticData: (tbodyTd, length) => {
											let defaultInputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`

											for (let i = 0, len = length; i < len; i++) {
												switch (i) {
													case 0: {
														tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															let currentInput = event.currentTarget

															event.stopPropagation() // 禁止冒泡
															submitData.materialName = $(currentInput).val()
														})
														break;
													}
													case 1: {
														tbodyTd.eq(i).addClass('table-input-td').html('<select class="form-control table-input input-sm"></select>')
														for (let j = 0, len = dropDownOptionHTMLlist.length; j < len; j++) {
															tbodyTd.eq(i).find('select').append(dropDownOptionHTMLlist[j])
														}

														tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
															let currentInput = event.currentTarget

															event.stopPropagation() // 禁止冒泡
															submitData.materialTypeId = $(currentInput).val()
														})
														break;
													}
													case 2: {
														tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															let currentInput = event.currentTarget

															event.stopPropagation() // 禁止冒泡
															submitData.materialStandard = $(currentInput).val()
														})
														break;
													}
													case 3: {
														tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															let currentInput = event.currentTarget

															event.stopPropagation() // 禁止冒泡
															submitData.materialModel = $(currentInput).val()
														})
														break;
													}
													case 4: {
														tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															let currentInput = event.currentTarget

															event.stopPropagation() // 禁止冒泡
															submitData.materialUnits = $(currentInput).val()
														})
														break;
													}
													case 5: {
														let inputHtml = `<input type="number" class="table-input" placeholder="请输入"/>`

														tbodyTd.eq(i).addClass('table-input-td').html(inputHtml)
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															let currentInput = event.currentTarget

															event.stopPropagation() // 禁止冒泡
															submitData.materialShelfLife = $(currentInput).val()
														})
														break;
													}
													default:
														break;
												}
											}
										}
									})

									function submitModalData () {
										let submitBtn = modalSubmitBtn

										submitBtn.off('click').on('click', (event) => {
											event.stopPropagation()

											if (
												submitData.materialName !== ''
												&& submitData.materialTypeId !== ''
												&& submitData.materialStandard !== ''
												&& submitData.materialModel !== ''
												&& submitData.materialUnits !== ''
												&& submitData.materialShelfLife !== ''
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
														type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
														url: saveMaterialInfosUrl,
														data: submitData,
														success: function (result, status, xhr) {
															if (result.status === 0) {
																let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
															}
															else {
																swal({
																	title: result.msg || result ? result.msg : '提交失败，请重新提交',
																	type: 'question',
																	allowEscapeKey: false, // 用户按esc键不退出
																	allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																	showCancelButton: false, // 显示用户取消按钮
																	confirmButtonText: '确定',
																})
															}
														}
													})
												});
											}
											else {
												swal({
													title: '格式不正确，请重新输入',
													text: '请检查格式是否正确后再点击提交',
													type: 'warning',
													allowEscapeKey: false, // 用户按esc键不退出
													allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
													showCancelButton: false, // 显示用户取消按钮
													confirmButtonText: '确定',
												})
											}

										})
									}
									submitModalData()

								}
							})



					})

				}())
				break
			case '#warehouseManagement1-2':  //来料登记
				(function () {
					let activeSwiper = $('#warehouseManagement1-2'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-2-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '来料登记',
						ajaxDataType = 'record',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						materialTypeOption = activePanelHeading.find('.material-type-option'), // 物料类型选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintMaterials = {
							// 临时要提交的物料信息
							materialID: '',
							materialBatch: '',
							materialQuality: '',
							materialRecordNumber: ''
						},
						tempSubmintMaterialsList = [], // 临时要提交的
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							supplierId: '',
							dateStr: '',
							materials: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/规格/型号/单位/物料批次/品质/登记数量/编辑',
											theadWidth: '5%/10%/15%/15%/10%/10%/10%/10%/15%'
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
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.materialRecords, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																	tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_model;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_batch;
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
															case 6: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_quality;
																	if (tempData != null) {
																		switch (tempData) {
																			case '0':
																				currentTr.children().eq(i).html('合格')
																				break
																			case '1':
																				currentTr.children().eq(i).html('不合格')
																				break
																		}
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
															case 7: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_record_number;
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
															case 8: {
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据
																	switch (dataContent) {
																		case '#dataDetails': {
																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_record_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('来料详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: ajaxDataType,
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '物料名称/物料规格/物料类型/物料型号/单位/数量/品质/供应商/负责人/来料时间',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.materialRecords, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].material.warehouse_material_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].material.warehouse_material_standard;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].material.warehouse_material_units;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].warehouse_material_record_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										const returnMatetialQuality = (data) => {
																											return data == 0 ? '合格': '不合格'
																										}
																										try {
																											tempData = returnMatetialQuality(dataList[0].warehouse_material_quality);
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].supplier.supplier_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 8: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 9: {
																										try {
																											tempData = dataList[0].warehouse_material_record_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				deleteID = dataList[currentTr.index()].warehouse_material_record_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMaterialRecordsUrl,
																					type: 'POST',
																					data: {
																						recordIds: deleteID
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
																			break
																		}
																		default:
																			break;
																	}
																})
																break;
															}
															default:
																break;
														}
													}
												}
											}
										},

										pagination: {
											totalRow: result.map.materialRecordLines, // 总行数
											displayRow: result.map.materialRecords.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryAllMaterialsUrl, {
						type: ajaxDataType,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryMaterialsUrl, {
								type: ajaxDataType,
								value: val,
								headNum: 1,
								key: 'keyWord'
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 物料下拉菜单添加选项
					function materialSelectAddOption (target) {
						let originalOption = ['全部类型'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = originalOption.length;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryCategoryUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let materialTypeList = result.map.materialTypes;

								for (let i = 0, len = materialTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'materialTypeId',
											value: materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id
										})
									}
								});
							}
						})

					}
					materialSelectAddOption(materialTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(queryMaterialsUrl, {
										type: ajaxDataType,
										headNum: 1,
										key: 'date',
										value: '1',
										startDate: startDate,
										endDate: endDate
									});
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							panelTbody = panel_3.find('table tbody'),	//面版表格tbody
							modalSubmitBtn = dataContent.find('.modal-submit'),
							dropDownOptionHTMLlist = ['合格', '不合格'], // 用户材料选择栏中的选项列表
							searchData = {
								// 搜索栏提交data数据
								type: ajaxDataType,
								value: '',
								materialTypeId: '',
								warehouseId: '',
								headNum: 1
							},
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// pannel_3需要的功能
						warehouseOption.hide() // 仓库选项
						productTypeOption.hide() // 成品类型选项
						materialTypeOption.show() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/名称/规格/型号/单位/物料批次/品质/登记数量/编辑',
												theadWidth: '5%/10%/10%/15%/5%/15%/15%/10%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													`<td class="table-input-td"><select class="form-control table-input input-sm material-quality-option"></select></td>`,
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = map.materialInfos, // 主要数据列表
														tempData = '' // 表格td内的临时数据

													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_name;
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
																		tempData = dataList[currentTr.index()].warehouse_material_standard;
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
																case 3: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_model;
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
																case 4: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_units;
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
																case 5: {
																	let currentInput = currentTr.children().eq(i).find('input')

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})

																		event.stopPropagation // 停止冒泡
																		if (!(isNaN(inputVal)) && inputVal <= 0 && inputVal === '') {
																			let count = 0

																			currentInput.val('')
																			mesPopover.show()
																			$('body').off('click').on('click', (event) => {
																				setTimeout(function () {
																					mesPopover.hide()
																				}, 1000);
																			})
																		}
																	})
																	break;
																}
																case 6: {
																	for (let j = 0, len = dropDownOptionHTMLlist.length; j < len; j++) {
																		currentTr.children().eq(i).find('select').append(`<option value="${j}">${dropDownOptionHTMLlist[j]}</option>`)
																	}
																}
																	break;
																case 7: {
																	let currentInput = currentTr.children().eq(i).find('input')

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})

																		event.stopPropagation() // 停止冒泡
																		if (!(isNaN(inputVal)) && inputVal <= 0 && inputVal === '') {
																			let count = 0

																			currentInput.val('')
																			mesPopover.show()
																			$('body').off('click').on('click', (event) => {
																				setTimeout(function () {
																					mesPopover.hide()
																				}, 1000);
																			})
																		}
																	})
																	break;
																}
																case 8: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink // 点击的选项
																		/* tempSubmintMaterials = {
																			// 临时要提交的物料信息
																			materialID: '',
																			materialBatch: '',
																			materialQuality: '',
																			materialRecordNumber: ''
																		} */

																		event.stopPropagation() // 停止冒泡
																		switch (triggerTargetData) {
																			case 'addListData': {
																				let currentTrSelect = currentTr.children().eq(6).find('select'), // 仓库下拉菜单
																					materialID = dataList[currentTr.index()].warehouse_material_id,  // 物料ID
																					materialBatch = currentTr.children().eq(5).find('input').val(), // 物料批次
																					materialRecordNumber = currentTr.children().eq(7).find('input').val(), // 登记数量
																					materialQuality = currentTrSelect.get(0).options[currentTrSelect.get(0).selectedIndex].value, // 物料质量
																					materialBatchMesPopover = new MesPopover(currentTr.children().eq(5).find('input'), {
																					}),
																					materialRecordNumberMesPopover = new MesPopover(currentTr.children().eq(7).find('input'), {
																					})

																				if (materialBatch !== '' && materialRecordNumber !== '') {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody') // 添加行数据的对象

																					// 传入临时提交数据
																					tempSubmintMaterials.materialID = materialID // 物料ID
																					tempSubmintMaterials.materialBatch = materialBatch // 物料批次
																					tempSubmintMaterials.materialRecordNumber = materialRecordNumber // 登记数量
																					tempSubmintMaterials.materialQuality = materialQuality // 物料质量

																					tempSubmintMaterialsList.push(`${tempSubmintMaterials.materialID}:${tempSubmintMaterials.materialBatch}:${tempSubmintMaterials.materialQuality}:${tempSubmintMaterials.materialRecordNumber}`) // 临时提交物料组添加数据
																					console.dir(tempSubmintMaterialsList)
																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintMaterials,
																						// OtherData: {
																						// 	returnQuantity: returnQuantity,
																						// 	storageWarehouse: storageWarehouse
																						// },
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.warehouse_material_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.warehouse_material_standard;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = result.warehouse_material_model;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										try {
																											tempData = result.warehouse_material_units;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 5: {
																										try {
																											tempData = config.currentTrImportData.materialBatch;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 6: {
																										try {
																											tempData = config.currentTrImportData.materialQuality;
																											if (tempData != null) {
																												switch (tempData) {
																													case '0':
																														lastTr.children().eq(i).html('合格')
																														break;
																													case '1':
																														lastTr.children().eq(i).html('不合格')
																														break;
																													default:
																														break;
																												}
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 7: {
																										try {
																											tempData = config.currentTrImportData.materialRecordNumber;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 8: {
																										// data-mes-table-link="removeListData"
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintMaterialsList.splice(currentTr.index(), 1)
																													console.dir(tempSubmintMaterialsList)
																													currentTr.remove() // 移除选中行的内容
																													break
																												}

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
																				}
																				else if (materialBatch === '' && materialRecordNumber !== '') {
																					materialBatchMesPopover.show()
																					setTimeout(function () {
																						materialBatchMesPopover.hide()
																					}, 1000);
																				}
																				else if (materialRecordNumber === '' && materialBatch !== '') {
																					materialRecordNumberMesPopover.show()
																					setTimeout(function () {
																						materialBatchMesPopover.hide()
																					}, 1000);
																				}
																				else {
																					materialBatchMesPopover.show()
																					materialRecordNumberMesPopover.show()
																					setTimeout(function () {
																						materialBatchMesPopover.hide()
																						materialRecordNumberMesPopover.hide()
																					}, 1000);
																				}

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
												totalRow: result.map.materialInfoLines, // 总行数
												displayRow: result.map.materialInfos.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '登记人员/供应商/登记时间',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加供应商选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectSuppliersAddData(resolve, querySuppliersUrl, {
														type: 'all',
														headNum: 1,
														supplierId: ''
													})
												});

												promise.then(function (resolveData) {
													submitDataMainModal_1.supplierId = resolveData.supplierId
													tbodyTd.eq(i).find('input').val(resolveData.supplierName)
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
										}
											break;
										case 2:
											{
												inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
												})
											}
											break;
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/规格/型号/单位/物料批次/品质/登记数量/编辑',
								theadWidth: '5%/15%/10%/15%/10%/15%/10%/10%/15%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						/* function warehouseSelectAddOption(target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.warehouseId = ''
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
									target.children().eq(i).off('click').on('click', originalFunction[i]); // 添加初始化选项的事件
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表

									if (dropDownOptionHTMLlist) {
										// 初始化下拉菜单长度
										dropDownOptionHTMLlist.length = 0;
									}
									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}"  value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

										if (dropDownOptionHTMLlist) {
											// 保存仓库选项
											dropDownOptionHTMLlist.push(optionHtml);
										}
										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
											target.children().eq(i + originalOptionLength).off('click').on('click', (event) => {
												// 添加点击事件
												searchData.warehouseId = warehouseList[i].warehouse_id;
												addModalTableData(queryMaterialInventoryUrl, searchData);
											});
										}
									}
								}
							});
						}
						warehouseSelectAddOption(warehouseOption); */

						// 物料下拉菜单添加选项
						function materialSelectAddOption (target) {
							let originalOption = ['全部类型'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.materialTypeId = '';
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.find('option').remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryCategoryUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let materialTypeList = result.map.materialTypes;

									for (let i = 0, len = materialTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

										target.append(optionHtml); // 添加物料选项
									}

									target.on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchGroup.find('input').val('');
											searchData.value = fuzzySearchGroup.find('input').val();
											searchData.materialTypeId = materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							})

						}
						materialSelectAddOption(materialTypeOption)

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}
							else {
								// 为空时重置搜索
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								searchData.value = $(this).closest('.input-group').find('input').val();
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								if (submitDataMainModal_1.staffId !== ''
									&& submitDataMainModal_1.supplierId !== ''
									&& submitDataMainModal_1.dateStr !== ''
									&& tempSubmintMaterialsList.length > 0
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
										submitDataMainModal_1.materials = tempSubmintMaterialsList.toString()
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveMaterialRecordsUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'question',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})
					// headingMainBtn_1.trigger('click');
				}())
				break
			case '#warehouseManagement1-3':  //物料入库
				(function () {
					let activeSwiper = $('#warehouseManagement1-3'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-3-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '物料入库',
						ajaxDataType = 'entry',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						materialTypeOption = activePanelHeading.find('.material-type-option'), // 物料类型选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintMaterials = {
							// 临时要提交的物料信息
							materialID: '',
							materialBatch: '',
							returnQuantity: '',
							warehouseID: ''
						},
						tempSubmintMaterialsList = [], // 临时要提交的
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							supplierId: '',
							dateStr: '',
							materials: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/规格/单位/供应商/入库数量/编辑',
											theadWidth: '5%/15%/15%/10%/20%/15%/30%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.materialEntrys, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																	tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].supplier.supplier_name;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_entry_number;
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
															case 6:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {
																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_entry_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('入库详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: ajaxDataType,
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '物料名称/所在仓库/物料批次/物料类型/规格/型号/单位/数量/供应商/入库人员/入库时间',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.materialEntrys, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].material.warehouse_material_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].warehouse.warehouse_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].warehouse_material_batch;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].material.warehouse_material_standard;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = dataList[0].material.warehouse_material_units;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].warehouse_material_entry_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 8: {
																										try {
																											tempData = dataList[0].supplier.supplier_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 9: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 10: {
																										try {
																											tempData = dataList[0].warehouse_material_entry_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].warehouse_material_entry_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMaterialEntrysUrl,
																					type: 'POST',
																					data: {
																						entryIds: currentTrNntryID
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
											totalRow: result.map.materialEntryLines, // 总行数
											displayRow: result.map.materialEntrys.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryAllMaterialsUrl, {
						type: ajaxDataType,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryMaterialsUrl, {
								type: ajaxDataType,
								value: val,
								headNum: 1,
								key: 'keyWord'
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'warehouseId',
											value: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 物料下拉菜单添加选项
					function materialSelectAddOption (target) {
						let originalOption = ['全部类型'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = originalOption.length;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryCategoryUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let materialTypeList = result.map.materialTypes;

								for (let i = 0, len = materialTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'materialTypeId',
											value: materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id
										})
									}
								});
							}
						})

					}
					materialSelectAddOption(materialTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(queryMaterialsUrl, {
										type: ajaxDataType,
										headNum: 1,
										key: 'date',
										value: '1',
										startDate: startDate,
										endDate: endDate
									});
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							panelTbody = panel_3.find('table tbody'),	//面版表格tbody
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							modalSubmitBtn = dataContent.find('.modal-submit'),
							dropDownOptionHTMLlist = [], // 用户材料选择栏中的选项列表
							searchData = {
								// 搜索栏提交data数据
								type: ajaxDataType,
								value: '',
								materialTypeId: '',
								warehouseId: '',
								headNum: 1
							},
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})

						// pannel_3需要的功能
						warehouseOption.hide() // 仓库选项
						productTypeOption.hide() // 成品类型选项
						materialTypeOption.show() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/名称/规格/型号/单位/物料批次/入库数量/仓库/编辑',
												theadWidth: '5%/10%/10%/15%/5%/10%/10%/15%/20%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													`<td class="table-input-td"><select class="form-control table-input input-sm warehouse-option"></select></td>`,
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = map.materialRecords, // 主要数据列表
														tempData = '' // 表格td内的临时数据

													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																		tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
																case 3: {
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_model;
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
																case 4: {
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
																case 5: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_batch;
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
																	break;
																}
																case 6: {
																	let currentInput = currentTr.children().eq(i).find('input'),
																		registerTotal = dataList[currentTr.index()].warehouse_material_record_number // 物料登记数量

																	try {
																		tempData = registerTotal;
																		if (tempData != null) {
																			currentInput.val(registerTotal)
																		}
																		else {
																			currentInput.val('暂无数据')
																		}
																	}
																	catch (e) {
																		currentInput.val('暂无数据')
																	}

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})

																		event.stopPropagation // 停止冒泡
																		if (!(isNaN(inputVal)) && inputVal !== '' && inputVal <= registerTotal) {
																			if (inputVal <= 0) {
																				currentInput.val('')
																				mesPopover.show()

																				$('body').off('click').on('click', () => {
																					mesPopover.hide()
																				})
																			}
																		}
																		else if (inputVal !== '') {
																			currentInput.val('')
																			mesPopover.show()
																			$('body').off('click').on('click', (event) => {
																				event.stopPropagation // 停止冒泡
																				mesPopover.hide()
																			})
																		}
																	})
																	break;
																}
																case 7: {
																	for (let j = 0, len = dropDownOptionHTMLlist.length; j < len; j++) {
																		currentTr.children().eq(i).find('select').append(dropDownOptionHTMLlist[j])
																	}
																}
																	break;
																case 8: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink // 点击的选项
																		registerTotal = dataList[currentTr.index()].warehouse_material_record_number // 物料登记数量
																		event.stopPropagation()
																		switch (triggerTargetData) {
																			case 'addListData': {
																				let currentTrSelect = currentTr.children().eq(7).find('select'), // 仓库下拉菜单
																					materialID = dataList[currentTr.index()].material.warehouse_material_id,  // 物料ID
																					materialBatch = dataList[currentTr.index()].warehouse_material_batch, // 物料批次
																					returnQuantity = currentTr.children().eq(6).find('input').val(), // 返回数量
																					warehouseID = currentTrSelect.get(0).options[currentTrSelect.get(0).selectedIndex].dataset.mesWarehouseId, // 仓库ID
																					mesPopover = new MesPopover(currentTr.children().eq(6).find('input'), {
																					})

																				if (returnQuantity !== '' && returnQuantity > 0) {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody'),
																						storageWarehouse = currentTrSelect.val(), // 已选择的仓库名称
																						pitchHide = currentTr
																					pitchHide.hide()
																					// 传入临时提交数据
																					tempSubmintMaterials.materialID = materialID // 物料ID
																					tempSubmintMaterials.materialBatch = materialBatch // 物料批次
																					tempSubmintMaterials.returnQuantity = returnQuantity // 返回数量
																					tempSubmintMaterials.warehouseID = warehouseID // 仓库ID

																					tempSubmintMaterialsList.push(`${tempSubmintMaterials.materialID}:${tempSubmintMaterials.materialBatch}:${tempSubmintMaterials.returnQuantity}:${tempSubmintMaterials.warehouseID}`) // 临时提交物料组添加数据

																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintMaterials,
																						OtherData: {
																							returnQuantity: returnQuantity,
																							storageWarehouse: storageWarehouse
																						},
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>',
																							'<td></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.material.warehouse_material_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.material.warehouse_material_standard;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = result.material.warehouse_material_model;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										try {
																											tempData = result.material.warehouse_material_units;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 5: {
																										let currentInput = lastTr.children().eq(i).find('input')

																										try {
																											tempData = registerTotal;
																											if (tempData != null) {
																												currentInput.val(registerTotal)
																											}
																											else {
																												currentInput.val('暂无数据')
																											}
																										}
																										catch (e) {
																											currentInput.val('暂无数据')
																										}
																										var currentInputVal = currentInput.val();
																										currentInput.off('blur').on('blur', (event) => {
																											let inputVal = currentInput.val(),
																												mesPopover = new MesPopover(currentInput, {
																												})

																											event.stopPropagation // 停止冒泡
																											if (!(isNaN(inputVal)) && inputVal !== '' && Number(inputVal) <= Number(currentInputVal)) {
																												if (inputVal <= 0) {
																													currentInput.val('')
																													mesPopover.show()

																													$('body').off('click').on('click', () => {
																														mesPopover.hide()
																													})
																												}
																											}
																											else if (inputVal !== '') {
																												currentInput.val('')
																												mesPopover.show()
																												$('body').off('click').on('click', (event) => {
																													event.stopPropagation // 停止冒泡
																													mesPopover.hide()
																												})
																											}
																										})
																										break;
																									}
																									case 6: {
																										try {
																											tempData = config.OtherData.storageWarehouse;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 7: {
																										// data-mes-table-link="removeListData"
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintMaterialsList.splice(currentTr.index(), 1)
																													currentTr.remove() // 移除选中行的内容
																													pitchHide.show()
																													break
																												}

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
																				}
																				else {
																					mesPopover.show()
																					$('body').off('click').on('click', () => {
																						mesPopover.hide()
																					})
																				}

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
												totalRow: result.map.materialRecordLines, // 总行数
												displayRow: result.map.materialRecords.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '入库人员/供应商/入库时间',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加供应商选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectSuppliersAddData(resolve, querySuppliersUrl, {
														type: 'all',
														headNum: 1,
														supplierId: ''
													})
												});

												promise.then(function (resolveData) {
													submitDataMainModal_1.supplierId = resolveData.supplierId
													tbodyTd.eq(i).find('input').val(resolveData.supplierName)
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 2:
											{
												inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
												})
											}
											break;
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/规格/型号/单位/入库数量/仓库/编辑',
								theadWidth: '5%/15%/10%/15%/10%/15%/15%/15%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						function warehouseSelectAddOption (target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.warehouseId = ''
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
									target.children().eq(i).off('click').on('click', originalFunction[i]); // 添加初始化选项的事件
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表

									if (dropDownOptionHTMLlist) {
										// 初始化下拉菜单长度
										dropDownOptionHTMLlist.length = 0;
									}
									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}"  value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

										if (dropDownOptionHTMLlist) {
											// 保存仓库选项
											dropDownOptionHTMLlist.push(optionHtml);
										}
										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
											target.children().eq(i + originalOptionLength).off('click').on('click', (event) => {
												// 添加点击事件
												searchData.warehouseId = warehouseList[i].warehouse_id;
												addModalTableData(queryMaterialInventoryUrl, searchData);
											});
										}
									}
								}
							});
						}
						warehouseSelectAddOption(warehouseOption);

						// 物料下拉菜单添加选项
						function materialSelectAddOption (target) {
							let originalOption = ['全部类型'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.materialTypeId = '';
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.find('option').remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryCategoryUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let materialTypeList = result.map.materialTypes;

									for (let i = 0, len = materialTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

										target.append(optionHtml); // 添加物料选项
									}

									target.on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchGroup.find('input').val('');
											searchData.value = fuzzySearchGroup.find('input').val();
											searchData.materialTypeId = materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							})

						}
						materialSelectAddOption(materialTypeOption)

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}
							else {
								// 为空时重置搜索
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								searchData.value = $(this).closest('.input-group').find('input').val();
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								if (submitDataMainModal_1.staffId !== ''
									&& submitDataMainModal_1.supplierId !== ''
									&& submitDataMainModal_1.dateStr !== ''
									&& tempSubmintMaterialsList.length > 0
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
										submitDataMainModal_1.materials = tempSubmintMaterialsList.toString()
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveMaterialEntrysUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'question',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})
				}())
				break
			case '#warehouseManagement1-4':  //物料出库
				(function () {
					let activeSwiper = $('#warehouseManagement1-4'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-4-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '物料出库',
						ajaxDataType = 'out',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						materialTypeOption = activePanelHeading.find('.material-type-option'), // 物料类型选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintMaterials = {
							// 临时要提交的物料信息
							materialID: '', // 物料ID
							materialBatch: '', // 物料批次
							materialOutNumber: '', // 物料出库数量
							supplierId: '', // 供应商ID
							warehouseOutID: '', //仓库ID
							workshopID: '' // 领用车间ID
						},
						tempSubmintMaterialsList = [], // 临时要提交的
						OtherData = {
							workshopName: ''
						},
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							planBatchId: '',
							dateStr: '',
							materials: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/规格/型号/供应商/单位/出库数量/编辑',
											theadWidth: '5%/15%/15%/15%/15%/10%/10%/20%'
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
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.materialOuts, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																	tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_model;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].supplier.supplier_name;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
															case 6: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_out_number;
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
															case 7:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据
																	console.log(dataContent)
																	switch (dataContent) {
																		case '#dataDetails': {
																			console.log(dataContent)
																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_out_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('入库详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: ajaxDataType,
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '物料名称/所在仓库/物料批次/物料类型/规格/型号/单位/出库数量/供应商/生产批次/领用车间/领料人员/领料时间',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.materialOuts, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].material.warehouse_material_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].warehouse.warehouse_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].warehouse_material_batch;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].material.warehouse_material_standard;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = dataList[0].material.warehouse_material_units;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].warehouse_material_out_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 8: {
																										try {
																											tempData = dataList[0].supplier.supplier_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 9: {
																										try {
																											tempData = dataList[0].warehouse_material_batch;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 10: {
																										try {
																											tempData = dataList[0].workshop.role_workshop_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 11: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 12: {
																										try {
																											tempData = dataList[0].warehouse_material_out_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].warehouse_material_out_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMaterialOutsUrl,
																					type: 'POST',
																					data: {
																						outIds: currentTrNntryID
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
											totalRow: result.map.materialOutLines, // 总行数
											displayRow: result.map.materialOuts.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryAllMaterialsUrl, {
						type: ajaxDataType,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryMaterialsUrl, {
								type: ajaxDataType,
								value: val,
								headNum: 1,
								key: 'keyWord'
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.off('change').on('change', function (event) {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'warehouseId',
											value: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 物料下拉菜单添加选项
					function materialSelectAddOption (target) {
						let originalOption = ['全部类型'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = originalOption.length;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryCategoryUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let materialTypeList = result.map.materialTypes;

								for (let i = 0, len = materialTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

									target.append(optionHtml);
								}

								target.off('change').on('change', function (event) {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'materialTypeId',
											value: materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id
										})
									}
								});
							}
						})

					}
					materialSelectAddOption(materialTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(queryMaterialsUrl, {
										type: ajaxDataType,
										headNum: 1,
										key: 'date',
										value: '1',
										startDate: startDate,
										endDate: endDate
									});
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							panelTbody = panel_3.find('table tbody'),	//面版表格tbody
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							modalSubmitBtn = dataContent.find('.modal-submit'),
							dropDownOptionHTMLlist = [], // 用户材料选择栏中的选项列表
							searchData = {
								// 搜索栏提交data数据
								type: ajaxDataType,
								value: '',
								materialTypeId: '',
								warehouseId: '',
								headNum: 1
							},
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})

						// 批次搜索框
						fuzzySearchGroup.find('input').eq(1).css('display', 'none')
						// pannel_3需要的功能
						warehouseOption.show() // 仓库选项
						materialTypeOption.show() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组
						productTypeOption.hide() // 成品类型选项

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/名称/规格/型号/单位/物料批次/供应商/仓库/领料数量/领用车间/编辑',
												theadWidth: '5%/10%/10%/10%/5%/10%/10%/10%/10%/10%/10%'
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
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" data-mes-workshop-id="" /></td>`,
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {

													let map = result.map, // 映射
														dataList = map.warehouseMaterials, // 主要数据列表
														tempData = '' // 表格td内的临时数据

													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																		tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
																case 3: {
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_model;
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
																case 4: {
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
																case 5: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_batch;
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
																	break;
																}
																case 6: {
																	try {
																		tempData = dataList[currentTr.index()].supplier.supplier_name;
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
																	break;
																}
																case 7: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse.warehouse_name;
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
																	break;
																}
																case 8: {
																	let currentInput = currentTr.children().eq(i).find('input'),
																		registerTotal = dataList[currentTr.index()].warehouse_material_batch_number // 物料存量

																	try {
																		tempData = registerTotal;
																		if (tempData != null) {
																			currentInput.val(registerTotal)
																		}
																		else {
																			currentInput.val('暂无数据')
																		}
																	}
																	catch (e) {
																		currentInput.val('暂无数据')
																	}

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})


																		event.stopPropagation() // 停止冒泡
																		if (isNaN(inputVal) || inputVal === '' || inputVal > registerTotal || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																	})
																	break;
																}
																case 9: {
																	let currentInput = currentTr.children().eq(i).find('input')

																	currentInput.off('focus').on('focus', function () {
																		// 添加生产批次模态框
																		let promise = new Promise(function (resolve, reject) {
																			selectWorkshopsAddData(resolve)
																		});

																		promise.then(function (resolveData) {
																			tempSubmintMaterials.workshopID = resolveData.workshopID
																			OtherData.workshopName = resolveData.workshopName
																			currentInput.val(resolveData.workshopName).attr('data-mes-workshop-id', resolveData.workshopID)
																		})

																		$(this).prop('readonly', true) // 输入框只读
																		$(this).off('blur').on('blur', () => {
																			$(this).removeProp('readonly') // 输入移除框只读
																		})
																	})
																}
																	break;
																case 10: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink // 点击的选项
																		/* tempSubmintMaterials = {
																			// 临时要提交的物料信息
																			materialID: '', // 物料ID
																			materialBatch: '', // 物料批次
																			materialOutNumber: '', // 物料出库数量
																			supplierId: '', // 供应商ID
																			warehouseOutID: '', //仓库ID
																			workshopID: '' // 领用车间ID
																		}, */
																		event.stopPropagation()
																		switch (triggerTargetData) {
																			case 'addListData': {
																				let materialID = dataList[currentTr.index()].material.warehouse_material_id,  // 物料ID
																					materialBatch = dataList[currentTr.index()].warehouse_material_batch, // 物料批次
																					materialOutNumber = currentTr.children().eq(8).find('input').val(), // 物料出库数量
																					supplierId = dataList[currentTr.index()].supplier.supplier_id,  // 供应商ID
																					warehouseOutID = dataList[currentTr.index()].warehouse.warehouse_id,  // 仓库ID
																					workshopID = currentTr.children().eq(9).find('input').get(0).dataset.mesWorkshopId
																				mesPopover_1 = new MesPopover(currentTr.children().eq(8).find('input'), {
																					content: '请检查数量是否无误'
																				}),
																					mesPopover_2 = new MesPopover(currentTr.children().eq(9).find('input'), {
																					})

																				if (materialOutNumber !== '' && tempSubmintMaterials.workshopID !== '' && materialOutNumber > 0) {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody'),
																						pitchHide = currentTr
																					pitchHide.hide()

																					// 传入临时提交数据
																					tempSubmintMaterials.materialID = materialID // 物料ID
																					tempSubmintMaterials.materialBatch = materialBatch // 物料批次
																					tempSubmintMaterials.materialOutNumber = materialOutNumber // 返回数量
																					tempSubmintMaterials.supplierId = supplierId // 仓库ID
																					tempSubmintMaterials.warehouseOutID = warehouseOutID
																					tempSubmintMaterials.workshopID = workshopID

																					tempSubmintMaterialsList.push(`${tempSubmintMaterials.materialID}:${tempSubmintMaterials.materialBatch}:${tempSubmintMaterials.materialOutNumber}:${tempSubmintMaterials.supplierId}:${tempSubmintMaterials.warehouseOutID}:${tempSubmintMaterials.workshopID}`) // 临时提交物料组添加数据
																					console.dir(tempSubmintMaterialsList)
																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintMaterials,
																						OtherData: OtherData,
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.material.warehouse_material_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.material.warehouse_material_standard;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = result.material.warehouse_material_model;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										try {
																											tempData = result.material.warehouse_material_units;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 5: {
																										try {
																											tempData = result.material.warehouse.warehouse_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 6: {
																										try {
																											tempData = config.currentTrImportData.materialOutNumber;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 7: {
																										try {
																											tempData = config.OtherData.workshopName;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 8: {
																										// data-mes-table-link="removeListData"
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintMaterialsList.splice(currentTr.index(), 1)
																													currentTr.remove() // 移除选中行的内容
																													pitchHide.show()
																													break
																												}

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
																				}
																				else if (materialOutNumber !== '' && tempSubmintMaterials.workshopID === '') {
																					mesPopover_2.show()
																					setTimeout(function () {
																						mesPopover_2.hide()
																					}, 1000);
																				}
																				else if (materialOutNumber === '' && tempSubmintMaterials.workshopID !== '' || materialOutNumber <= 0) {
																					mesPopover_1.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																					}, 1000);
																				}
																				else {
																					mesPopover_1.show()
																					mesPopover_2.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																						mesPopover_2.hide()
																					}, 1000);
																				}

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
												totalRow: result.map.materialInventryLine, // 总行数
												displayRow: result.map.warehouseMaterials.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '出库人员/生产计划/出库时间',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加生产批次模态框
												let promise = new Promise(function (resolve, reject) {
													selectPlanBatchsAddData(resolve)
												});

												promise.then(function (resolveData) {
													submitDataMainModal_1.planBatchId = resolveData.planBatchId
													tbodyTd.eq(i).find('input').val(resolveData.planBatch)
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 2:
											{
												inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
												})
											}
											break;
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/规格/型号/单位/出库仓库/领料数量/领料车间/编辑',
								theadWidth: '5%/15%/10%/15%/10%/10%/10%/15%/15%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						function warehouseSelectAddOption (target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.warehouseId = ''
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表

									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}"  value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
										}
									}

									target.off('change').on('change', function (event) {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											searchData.warehouseId = warehouseList[selectOptionIndex - originalOptionLength].warehouse_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							});
						}
						warehouseSelectAddOption(warehouseOption);

						// 物料下拉菜单添加选项
						function materialSelectAddOption (target) {
							let originalOption = ['全部类型'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.materialTypeId = '';
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.find('option').remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryCategoryUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let materialTypeList = result.map.materialTypes;

									for (let i = 0, len = materialTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

										target.append(optionHtml); // 添加物料选项
									}

									target.off('change').on('change', function (event) {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchGroup.find('input').val('');
											searchData.value = fuzzySearchGroup.find('input').val();
											searchData.materialTypeId = materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							})

						}
						materialSelectAddOption(materialTypeOption)

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}
							else {
								// 为空时重置搜索
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								searchData.value = $(this).closest('.input-group').find('input').val();
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								if (submitDataMainModal_1.staffId !== ''
									&& submitDataMainModal_1.planBatchId !== ''
									&& submitDataMainModal_1.dateStr !== ''
									&& tempSubmintMaterialsList.length > 0
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
										submitDataMainModal_1.materials = tempSubmintMaterialsList.toString()
										console.dir(submitDataMainModal_1.materials)
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveMaterialOutsUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'question',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})
				}())
				break
			case '#warehouseManagement1-5':  //物料退还
				(function () {
					let activeSwiper = $('#warehouseManagement1-5'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-5-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '物料退还',
						ajaxDataType = 'return',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						materialTypeOption = activePanelHeading.find('.material-type-option'), // 物料类型选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintMaterials = {
							// 临时要提交的物料信息
							materialID: '', // 物料ID
							materialBatch: '', // 物料批次
							materialReturnNumber: '', // 物料退还数量
							supplierID: '', // 供应商ID
							warehouseOutID: '', //出库仓库ID
							warehouseReturnID: '' // 返还仓库ID
						},
						tempSubmintMaterialsList = [], // 临时要提交的
						OtherData = {
						},
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							workShopId: '', // 车间ID
							dateStr: '',
							materials: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/规格/型号/供应商/单位/退还数量/编辑',
											theadWidth: '5%/15%/15%/15%/15%/10%/10%/20%'
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
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.materialReturns, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																	tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_model;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].supplier.supplier_name;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
															case 6: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_return_number;
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
															case 7:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {

																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_return_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('物料退还详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: ajaxDataType,
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '物料名称/物料批次/物料规格/物料类型/物料型号/供应商/单位/数量/出库仓库/退还仓库/退还车间/退还人员/退还时间/退还原因',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.materialReturns, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].material.warehouse_material_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].warehouse_material_batch;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].material.warehouse_material_standard;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].supplier.supplier_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = material.warehouse_material_units;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].warehouse_material_return_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 8: {
																										try {
																											tempData = dataList[0].warehouseOut;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 9: {
																										try {
																											tempData = dataList[0].warehouseReturn;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 10: {
																										try {
																											tempData = dataList[0].workshop.role_workshop_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 11: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 12: {
																										try {
																											tempData = dataList[0].warehouse_material_return_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 13: {
																										try {
																											tempData = dataList[0].warehouse_material_return_reason
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].warehouse_material_return_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMaterialReturnsUrl,
																					type: 'POST',
																					data: {
																						returnIds: currentTrID
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
											totalRow: result.map.materialReturnLines, // 总行数
											displayRow: result.map.materialReturns.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow();
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryAllMaterialsUrl, {
						type: ajaxDataType,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryMaterialsUrl, {
								type: ajaxDataType,
								value: val,
								headNum: 1,
								key: 'keyWord'
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.off('change').on('change', function (event) {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'warehouseId',
											value: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 物料下拉菜单添加选项
					function materialSelectAddOption (target) {
						let originalOption = ['全部类型'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = originalOption.length;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryCategoryUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let materialTypeList = result.map.materialTypes;

								for (let i = 0, len = materialTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

									target.append(optionHtml);
								}

								target.off('change').on('change', function (event) {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'materialTypeId',
											value: materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id
										})
									}
								});
							}
						})

					}
					materialSelectAddOption(materialTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(queryMaterialsUrl, {
										type: ajaxDataType,
										headNum: 1,
										key: 'date',
										value: '1',
										startDate: startDate,
										endDate: endDate
									});
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							panelTbody = panel_3.find('table tbody'),	//面版表格tbody
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							modalSubmitBtn = dataContent.find('.modal-submit'),
							dropDownOptionHTMLlist = [], // 下拉选项列表
							searchData = {
								// 搜索栏提交data数据
								type: ajaxDataType,
								value: '',
								materialBatch: '',
								materialTypeId: '',
								warehouseId: '',
								headNum: 1
							},
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})
						// 批次搜索框
						fuzzySearchGroup.find('input').eq(1).css('display', 'block')
						// pannel_3需要的功能
						warehouseOption.show() // 仓库选项
						materialTypeOption.show() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组
						productTypeOption.hide() // 成品类型选项

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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

										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/物料名称/物料批次/规格/型号/供应商/单位/数量/出库仓库/退还仓库/编辑',
												theadWidth: '5%/10%/10%/10%/10%/10%/5%/10%/10%/10%/10%'
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
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													'<td></td>',
													`<td class="table-input-td"><select class="form-control table-input input-sm warehouse-option"></select></td>`,
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = map.materialOuts, // 主要数据列表
														tempData = '' // 表格td内的临时数据
													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_name;
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
																		tempData = dataList[currentTr.index()].warehouse_material_batch;
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
																case 3: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_standard;
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
																case 4: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_model;
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
																case 5: {
																	try {
																		tempData = dataList[currentTr.index()].supplier_name;
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
																	break;
																}
																case 6: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_units;
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
																	break;
																}
																case 7: {
																	let currentInput = currentTr.children().eq(i).find('input'),
																		registerTotal = dataList[currentTr.index()].warehouse_material_out_number // 出库数量

																	try {
																		tempData = registerTotal;
																		if (tempData != null) {
																			currentInput.val(registerTotal)
																		}
																		else {
																			currentInput.val('暂无数据')
																		}
																	}
																	catch (e) {
																		currentInput.val('暂无数据')
																	}

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})

																		event.stopPropagation // 停止冒泡
																		if (isNaN(inputVal) || inputVal === '' || inputVal > registerTotal || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																	})
																	break;
																}
																case 8: {
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
																	break;
																}
																case 9: {
																	for (let j = 0, len = dropDownOptionHTMLlist.length; j < len; j++) {
																		currentTr.children().eq(i).find('select').append(dropDownOptionHTMLlist[j])
																	}
																	break;
																}
																case 10: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink, // 点击的选项
																			registerTotal = dataList[currentTr.index()].warehouse_material_out_number // 出库数量
																		/* tempSubmintMaterials = {
																			// 临时要提交的物料信息
																			materialID: '', // 物料ID
																			materialBatch: '', // 物料批次
																			materialReturnNumber: '', // 物料退还数量
																			supplierID: '', // 供应商ID
																			warehouseOutID: '', //出库仓库ID
																			warehouseReturnID: '' // 返还仓库ID
																		}, */
																		event.stopPropagation()
																		switch (triggerTargetData) {
																			case 'addListData': {
																				let currentTrSelect = currentTr.children().eq(9).find('select'), // 仓库下拉菜单
																					materialID = dataList[currentTr.index()].material.warehouse_material_id,  // 物料ID
																					materialBatch = dataList[currentTr.index()].warehouse_material_batch, // 物料批次
																					materialReturnNumber = currentTr.children().eq(7).find('input').val(), // 物料出库数量
																					supplierId = dataList[currentTr.index()].supplier.supplier_id,  // 供应商ID
																					warehouseOutID = dataList[currentTr.index()].warehouse.warehouse_id,  // 出库仓库ID
																					warehouseReturnID = currentTrSelect.get(0).options[currentTrSelect.get(0).selectedIndex].dataset.mesWarehouseId // 退还仓库ID

																				mesPopover_1 = new MesPopover(currentTr.children().eq(8).find('input'), {
																					content: '请确认数量是否无误'
																				}),
																					mesPopover_2 = new MesPopover(currentTr.children().eq(9).find('input'), {
																					})

																				if (materialReturnNumber !== '' && materialReturnNumber > 0) {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody'),
																						pitchHide = currentTr
																					pitchHide.hide()

																					OtherData.currentWarehouseName = currentTrSelect.val() // 已选择的仓库名称

																					// 传入临时提交数据
																					tempSubmintMaterials.materialID = materialID // 物料ID
																					tempSubmintMaterials.materialBatch = materialBatch // 物料批次
																					tempSubmintMaterials.materialReturnNumber = materialReturnNumber // 返回数量
																					tempSubmintMaterials.supplierId = supplierId // 仓库ID
																					tempSubmintMaterials.warehouseOutID = warehouseOutID // 出库仓库ID
																					tempSubmintMaterials.warehouseReturnID = warehouseReturnID // 入库仓库ID
																					tempSubmintMaterialsList.push(`${tempSubmintMaterials.materialID}:${tempSubmintMaterials.materialBatch}:${tempSubmintMaterials.materialReturnNumber}:${tempSubmintMaterials.supplierId}:${tempSubmintMaterials.warehouseOutID}:${tempSubmintMaterials.warehouseReturnID}`) // 临时提交物料组添加数据


																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintMaterials,
																						OtherData: OtherData,
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.material.warehouse_material_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.material.warehouse_material_standard;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = result.material.warehouse_material_model
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										try {
																											tempData = result.material.warehouse_material_units;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 5: {
																										try {
																											tempData = result.supplier.supplier_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 6: {
																										try {
																											tempData = config.OtherData.currentWarehouseName;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 7: {
																										let currentInput = lastTr.children().eq(i).find('input')

																										try {
																											tempData = registerTotal;
																											if (tempData != null) {
																												currentInput.val(registerTotal)
																											}
																											else {
																												currentInput.val('暂无数据')
																											}
																										}
																										catch (e) {
																											currentInput.val('暂无数据')
																										}
																										var currentInputVal = currentInput.val();

																										currentInput.off('blur').on('blur', (event) => {

																											let inputVal = currentInput.val(),
																												mesPopover = new MesPopover(currentInput, {
																												})

																											event.stopPropagation // 停止冒泡
																											if (!(isNaN(inputVal)) && inputVal !== '' && Number(inputVal) <= Number(currentInputVal)) {
																												if (inputVal <= 0) {
																													currentInput.val('')
																													mesPopover.show()

																													$('body').off('click').on('click', () => {
																														mesPopover.hide()
																													})
																												}
																											}
																											else if (inputVal !== '') {
																												currentInput.val('')
																												mesPopover.show()
																												$('body').off('click').on('click', (event) => {
																													event.stopPropagation // 停止冒泡
																													mesPopover.hide()
																												})
																											}
																										})
																										break;
																									}
																									case 8: {
																										// data-mes-table-link="removeListData"
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintMaterialsList.splice(currentTr.index(), 1)
																													currentTr.remove() // 移除选中行的内容
																													pitchHide.show()
																													break
																												}

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
																				}
																				else if (materialOutNumber === '' && tempSubmintMaterials.workshopID !== '' || materialOutNumber <= 0) {
																					mesPopover_1.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																					}, 1000);
																				}
																				else if (materialOutNumber !== '' && tempSubmintMaterials.workshopID === '') {
																					mesPopover_2.show()
																					setTimeout(function () {
																						mesPopover_2.hide()
																					}, 1000);
																				}
																				else {
																					mesPopover_1.show()
																					mesPopover_2.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																						mesPopover_2.hide()
																					}, 1000);
																				}

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
												totalRow: result.map.materialOuts.length, // 总行数
												displayRow: result.map.materialOuts.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '退还人员/生产车间/退还时间',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加生产批次模态框
												let promise = new Promise(function (resolve, reject) {
													selectWorkshopsAddData(resolve)
												});

												promise.then(function (resolveData) {
													submitDataMainModal_1.workShopId = resolveData.workshopID
													tbodyTd.eq(i).find('input').val(resolveData.workshopName)
												})

												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 2:
											{
												inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
												})
											}
											break;
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/规格/型号/单位/供应商/退还仓库/退还数量/编辑',
								theadWidth: '5%/15%/10%/10%/10%/15%/10%/10%/15%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						function warehouseSelectAddOption2 (target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.warehouseId = ''
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表
									if (dropDownOptionHTMLlist) {
										// 初始化下拉菜单长度
										dropDownOptionHTMLlist.length = 0;
									}
									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}" value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

										if (dropDownOptionHTMLlist) {
											// 保存仓库选项
											dropDownOptionHTMLlist.push(optionHtml);
										}
										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
										}
									}

									target.off('change').on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											searchData.warehouseId = warehouseList[selectOptionIndex - originalOptionLength].warehouse_id;

											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							});
						}
						warehouseSelectAddOption2(warehouseOption);

						// 物料下拉菜单添加选项
						function materialSelectAddOption2 (target) {
							let originalOption = ['全部类型'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.materialTypeId = '';
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.find('option').remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryCategoryUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let materialTypeList = result.map.materialTypes;

									for (let i = 0, len = materialTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

										target.append(optionHtml); // 添加物料选项
									}

									target.off('change').on('change', function (event) {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchGroup.find('input').val('');
											searchData.value = fuzzySearchGroup.find('input').val();
											searchData.materialTypeId = materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);

										}
									});
								}
							})

						}
						materialSelectAddOption2(materialTypeOption)


						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let input = $(this).closest('.input-group').find('input');
							event.stopPropagation() // 禁止向上冒泡
							// if (input[0].value !== '' || input[1].value) {
							if (input[0].value !== '' || input[1].value) {
								searchData.value = input[0].value;
								// searchData.materialBatch = input[1].value;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}
							else {
								// 为空时重置搜索
								searchData.value = input[0].value;
								// searchData.materialBatch = input[1].value;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								if (submitDataMainModal_1.staffId !== ''
									&& submitDataMainModal_1.planBatchId !== ''
									&& submitDataMainModal_1.dateStr !== ''
									&& tempSubmintMaterialsList.length > 0
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
										submitDataMainModal_1.materials = tempSubmintMaterialsList.toString()
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveMaterialReturnsUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'question',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})
				}())
				break
			case '#warehouseManagement1-6':  //物料调拨
				(function () {
					let activeSwiper = $('#warehouseManagement1-6'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-6-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '物料调拨',
						ajaxDataType = 'transfer',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						materialTypeOption = activePanelHeading.find('.material-type-option'), // 物料类型选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintMaterials = {
							// 临时要提交的物料信息
							materialID: '', // 物料ID
							materialBatch: '', // 物料批次
							materialTransferNumber: '', // 物料调拨数量
							supplierID: '', // 供应商ID
							WarehouseEntryID: '' // 转入仓库
						},
						tempSubmintMaterialsList = [], // 临时要提交的
						OtherData = {
							// 临时数据
						},
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							warehouseOutId: '', // 调出仓库ID
							dateStr: '',
							materials: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/规格/型号/供应商/单位/调拨数量/编辑',
											theadWidth: '5%/15%/15%/15%/15%/10%/10%/20%'
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
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.materialTransfers, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																	tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_model;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].supplier.supplier_name;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
															case 6: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_material_transfer_number;
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
															case 7:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {

																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_transfer_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('物料调拨详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: ajaxDataType,
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '物料名称/物料批次/物料规格/物料类型/物料型号/供应商/单位/调拨数量/调拨仓库/接受仓库/调拨人员/调拨时间',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.materialTransfers, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].material.warehouse_material_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].warehouse_material_batch;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].material.warehouse_material_standard;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].material.warehouse_material_type_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].supplier.supplier_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = dataList[0].material.warehouse_material_units;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].warehouse_material_transfer_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 8: {
																										try {
																											tempData = dataList[0].warehouse_out_id;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 9: {
																										try {
																											tempData = dataList[0].warehouse_entry_id;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 10: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 11: {
																										try {
																											tempData = dataList[0].warehouse_material_transfer_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].warehouse_material_transfer_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMaterialTransfersUrl,
																					type: 'POST',
																					data: {
																						transferIds: currentTrID
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
											totalRow: result.map.materialTransferLines, // 总行数
											displayRow: result.map.materialTransfers.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow(); // 返回状态码0, 弹出错误
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryAllMaterialsUrl, {
						type: ajaxDataType,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryMaterialsUrl, {
								type: ajaxDataType,
								value: val,
								headNum: 1,
								key: 'keyWord'
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'warehouseId',
											value: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 物料下拉菜单添加选项
					function materialSelectAddOption (target) {
						let originalOption = ['全部类型'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = originalOption.length;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryCategoryUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let materialTypeList = result.map.materialTypes;

								for (let i = 0, len = materialTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'materialTypeId',
											value: materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id
										})
									}
								});
							}
						})

					}
					materialSelectAddOption(materialTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(queryMaterialsUrl, {
										type: ajaxDataType,
										headNum: 1,
										key: 'date',
										value: '1',
										startDate: startDate,
										endDate: endDate
									});
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							panelTbody = panel_3.find('table tbody'),	//面版表格tbody
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							modalSubmitBtn = dataContent.find('.modal-submit'),
							dropDownOptionHTMLlist = [], // 下拉选项列表
							searchData = {
								// 搜索栏提交data数据
								type: 'out',
								value: '',
								materialTypeId: '',
								warehouseId: '',
								headNum: 1
							},
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})

						// 批次搜索框
						fuzzySearchGroup.find('input').eq(1).css('display', 'block')
						// pannel_3需要的功能
						warehouseOption.show() // 仓库选项
						materialTypeOption.show() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组
						productTypeOption.hide() // 成品类型选项

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/物料名称/物料批次/规格/型号/供应商/单位/调拨数量/转入仓库/编辑',
												theadWidth: '5%/10%/10%/10%/10%/10%/5%/10%/15%/15%'
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
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													`<td class="table-input-td"><select class="form-control table-input input-sm warehouse-option"></select></td>`,
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = map.warehouseMaterials, // 主要数据列表
														tempData = '' // 表格td内的临时数据

													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																		tempData = dataList[currentTr.index()].warehouse_material_batch;
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
																case 3: {
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
																case 4: {
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_model
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
																case 5: {
																	try {
																		tempData = dataList[currentTr.index()].supplier.supplier_name;
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
																	break;
																}
																case 6: {
																	try {
																		tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
																	break;
																}
																case 7: {
																	let currentInput = currentTr.children().eq(i).find('input'),
																		registerTotal = dataList[currentTr.index()].warehouse_material_batch_number // 调拨数量

																	try {
																		tempData = registerTotal;
																		if (tempData != null) {
																			currentInput.val(registerTotal)
																		}
																		else {
																			currentInput.val('暂无数据')
																		}
																	}
																	catch (e) {
																		currentInput.val('暂无数据')
																	}

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})

																		event.stopPropagation // 停止冒泡
																		if (isNaN(inputVal) || inputVal === '' || inputVal > dataList[currentTr.index()].warehouse_material_batch_number || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																	})
																	break;
																}
																case 8: {
																	for (let j = 0, len = dropDownOptionHTMLlist.length; j < len; j++) {
																		currentTr.children().eq(i).find('select').append(dropDownOptionHTMLlist[j])
																	}
																	break;
																}
																case 9: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink // 点击的选项
																		event.stopPropagation()
																		switch (triggerTargetData) {
																			case 'addListData': {
																				let currentTrSelect = currentTr.children().eq(8).find('select'), // 仓库下拉菜单
																					// materialID = dataList[currentTr.index()].material.warehouse_material_id,  // 物料ID
																					materialBatch = dataList[currentTr.index()].warehouse_material_batch, // 物料批次
																					materialTransferNumber = currentTr.children().eq(7).find('input').val(), // 物料调拨数量
																					supplierId = dataList[currentTr.index()].supplier.supplier_id,  // 供应商ID
																					WarehouseEntryID = currentTrSelect.get(0).options[currentTrSelect.get(0).selectedIndex].dataset.mesWarehouseId // 转入仓库ID

																				mesPopover_1 = new MesPopover(currentTr.children().eq(7).find('input'), {
																					content: '请确认数量是否无误'
																				})

																				if (materialTransferNumber !== '' && materialTransferNumber > 0) {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody')
																					pitchHide = currentTr
																					pitchHide.hide()

																					OtherData.currentWarehouseName = currentTrSelect.val() // 已选择的仓库名称

																					// 传入临时提交数据
																					tempSubmintMaterials.materialID = materialID // 物料ID
																					tempSubmintMaterials.materialBatch = materialBatch // 物料批次
																					tempSubmintMaterials.materialTransferNumber = materialTransferNumber // 调拨数量
																					tempSubmintMaterials.supplierId = supplierId // 仓库ID
																					tempSubmintMaterials.WarehouseEntryID = WarehouseEntryID // 转入仓库ID
																					tempSubmintMaterialsList.push(`${tempSubmintMaterials.materialID}:${tempSubmintMaterials.materialBatch}:${tempSubmintMaterials.materialTransferNumber}:${tempSubmintMaterials.supplierId}:${tempSubmintMaterials.WarehouseEntryID}`) // 临时提交物料组添加数据

																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintMaterials,
																						OtherData: OtherData,
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.material.warehouse_material_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.material.warehouse_material_standard;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = result.material.warehouse_material_model
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										try {
																											tempData = result.material.warehouse_material_units;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 5: {
																										try {
																											tempData = result.supplier.supplier_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 6: {
																										try {
																											tempData = config.currentTrImportData.materialTransferNumber;

																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 7: {
																										try {
																											tempData = config.OtherData.currentWarehouseName;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 8: {
																										// data-mes-table-link="removeListData"
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintMaterialsList.splice(currentTr.index(), 1)
																													currentTr.remove() // 移除选中行的内容
																													pitchHide.show()
																													break
																												}
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
																				}
																				else {
																					mesPopover_1.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																					}, 1000);
																				}

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
												totalRow: result.map.materialInventryLine, // 总行数
												displayRow: result.map.warehouseMaterials.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '调拨人员/调拨仓库/调拨时间',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加仓库选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectWarehousesAddData(resolve)
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.warehouseOutId = resolveData.warehouseID
													tbodyTd.eq(i).find('input').val(resolveData.warehouseName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 2:
											{
												inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
												})
											}
											break;
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/规格/型号/单位/供应商/数量/转入仓库/编辑',
								theadWidth: '5%/10%/10%/10%/10%/15%/10%/10%/10%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						function warehouseSelectAddOption (target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.warehouseId = ''
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表

									if (dropDownOptionHTMLlist) {
										// 初始化下拉菜单长度
										dropDownOptionHTMLlist.length = 0;
									}
									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}" value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

										if (dropDownOptionHTMLlist) {
											// 保存仓库选项
											dropDownOptionHTMLlist.push(optionHtml);
										}
										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
										}
									}

									target.off('change').on('change', function (event) {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											searchData.warehouseId = warehouseList[selectOptionIndex - originalOptionLength].warehouse_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							});
						}
						warehouseSelectAddOption(warehouseOption);

						// 物料下拉菜单添加选项
						function materialSelectAddOption (target) {
							let originalOption = ['全部类型'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.materialTypeId = '';
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.find('option').remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryCategoryUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let materialTypeList = result.map.materialTypes;

									for (let i = 0, len = materialTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

										target.append(optionHtml); // 添加物料选项
									}

									target.off('change').on('change', function (event) {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchGroup.find('input').val('');
											searchData.value = fuzzySearchGroup.find('input').val();
											searchData.materialTypeId = materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							})

						}
						materialSelectAddOption(materialTypeOption)

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}
							else {
								// 为空时重置搜索
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								searchData.value = $(this).closest('.input-group').find('input').val();
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								if (submitDataMainModal_1.staffId !== ''
									&& submitDataMainModal_1.warehouseOutId !== ''
									&& submitDataMainModal_1.dateStr !== ''
									&& tempSubmintMaterialsList.length > 0
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
										submitDataMainModal_1.materials = tempSubmintMaterialsList.toString()
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveMaterialTransfersUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'warning',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})
				}())
				break
			case '#warehouseManagement1-7':  //库存盘点
				(function () {
					let activeSwiper = $('#warehouseManagement1-7'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-7-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '库存盘点',
						ajaxDataType = 'check',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						materialTypeOption = activePanelHeading.find('.material-type-option'), // 物料类型选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintMaterials = {
							// 临时要提交的物料信息
							materialID: '', // 物料ID
							materialNumber: '', // 账面数数量
							materialCheckNumber: '', // 盘盈亏数量
						},
						tempSubmintMaterialsList = [], // 临时要提交的
						OtherData = {
							// 临时数据
						},
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							warehouseCheckId: '', // 调出仓库ID
							dateStr: '',
							materials: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/规格/单位/账面数（数量&#47;金额）/盘盈亏（数量&#47;金额）/编辑',
											theadWidth: '5%/10%/10%/5%/20%/20%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.materialChecks, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_name;
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
																	tempData = dataList[currentTr.index()].material.warehouse_material_standard;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].material.warehouse_material_units;
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
															case 4: {
																try {
																	tempData = `${dataList[currentTr.index()].warehouse_material_number}/${dataList[currentTr.index()].warehouse_material_money}`;
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
															case 5: {
																try {
																	tempData = `${dataList[currentTr.index()].warehouse_material_check_number}/${dataList[currentTr.index()].warehouse_material_check_money}`;
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
															case 6:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {

																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetMaterialID = dataList[currentTr.index()].warehouse_material_check_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('物料调拨详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryMaterialsUrl,
																				type: 'POST',
																				data: {
																					type: ajaxDataType,
																					value: currentTargetMaterialID,
																					key: 'materialId',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '物料名称/物料规格/物料类型/物料型号/单位/账面数数据量/账面数数据金额/盘盈亏数量/盘盈亏金额/盘点人员/盘点时间/变动原因',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.materialChecks, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].material.warehouse_material_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].material.warehouse_material_standard;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].material.warehouse_material_model
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].warehouse_material_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].warehouse_material_money;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = material.warehouse_material_units;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].warehouse_material_check_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 8: {
																										try {
																											tempData = dataList[0].warehouse_material_check_money;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 9: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 10: {
																										try {
																											tempData = dataList[0].warehouse_material_check_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 11: {
																										try {
																											tempData = dataList[0].warehouse_material_change_reason;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].warehouse_material_check_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeMaterialChecksUrl,
																					type: 'POST',
																					data: {
																						checkIds: currentTrID
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
											totalRow: result.map.materialCheckLines, // 总行数
											displayRow: result.map.materialChecks.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow(); // 返回状态码0, 弹出错误
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryAllMaterialsUrl, {
						type: ajaxDataType,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryMaterialsUrl, {
								type: ajaxDataType,
								value: val,
								headNum: 1,
								key: 'keyWord'
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.off('change').on('change', function (event) {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'warehouseId',
											value: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 物料下拉菜单添加选项
					function materialSelectAddOption (target) {
						let originalOption = ['全部类型'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = originalOption.length;

						originalFunction[0] = () => {
							addTableData(queryAllMaterialsUrl, {
								type: ajaxDataType,
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryCategoryUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let materialTypeList = result.map.materialTypes;

								for (let i = 0, len = materialTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

									target.append(optionHtml);
								}

								target.off('change').on('change', function (event) {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(queryMaterialsUrl, {
											type: ajaxDataType,
											headNum: 1,
											key: 'materialTypeId',
											value: materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id
										})
									}
								});
							}
						})

					}
					materialSelectAddOption(materialTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(queryMaterialsUrl, {
										type: ajaxDataType,
										headNum: 1,
										key: 'date',
										value: '1',
										startDate: startDate,
										endDate: endDate
									});
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							panelTbody = panel_3.find('table tbody'),	//面版表格tbody
							warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							modalSubmitBtn = dataContent.find('.modal-submit'),
							dropDownOptionHTMLlist = [], // 下拉选项列表
							searchData = {
								// 搜索栏提交data数据
								type: 'record',
								value: '',
								materialTypeId: '',
								warehouseId: '',
								headNum: 1
							},
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})

						// 批次搜索框
						fuzzySearchGroup.find('input').eq(1).css('display', 'none')

						// pannel_3需要的功能
						warehouseOption.show() // 仓库选项
						materialTypeOption.show() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组
						productTypeOption.hide() // 成品类型选项

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/物料名称/规格/型号/单位/账面数（数量）/盘盈亏（数量）/编辑',
												theadWidth: '5%/15%/10%/10%/5%/20%/20%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = map.materialInfos, // 主要数据列表
														tempData = '' // 表格td内的临时数据

													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_name;
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
																		tempData = dataList[currentTr.index()].warehouse_material_standard;
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
																case 3: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_type_id;
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
																case 4: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_material_units;
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
																case 5: {
																	let currentInput = currentTr.children().eq(i).find('input'),
																		mesPopover = new MesPopover(currentInput, {
																		})

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val()

																		event.stopPropagation // 停止冒泡
																		if (isNaN(inputVal) || inputVal === '' || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																	})
																	break;
																}
																case 6: {
																	let currentInput = currentTr.children().eq(i).find('input'),
																		mesPopover = new MesPopover(currentInput, {
																		})

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val()

																		event.stopPropagation // 停止冒泡
																		if (isNaN(inputVal) || inputVal === '' || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																	})
																	break;
																}
																case 7: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink // 点击的选项
																		event.stopPropagation()
																		switch (triggerTargetData) {
																			case 'addListData': {
																				let materialID = dataList[currentTr.index()].warehouse_material_id,  // 物料ID
																					materialNumber = currentTr.children().eq(5).find('input').val(), // 账面数数量
																					materialCheckNumber = currentTr.children().eq(6).find('input').val(), // 盘盈亏数量
																					mesPopover_1 = new MesPopover(currentTr.children().eq(5).find('input'), {
																					}),
																					mesPopover_2 = new MesPopover(currentTr.children().eq(6).find('input'), {
																					})

																				if (materialNumber !== '' && materialCheckNumber !== '') {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody'),
																						pitchHide = currentTr
																					pitchHide.hide()


																					/* tempSubmintMaterials = {
																						// 临时要提交的物料信息
																						materialID: '', // 物料ID
																						materialNumber: '', // 账面数数量
																						materialCheckNumber: '', // 盘盈亏数量
																					}, */
																					// 传入临时提交数据
																					tempSubmintMaterials.materialID = materialID // 物料ID
																					tempSubmintMaterials.materialNumber = materialNumber // 账面数数量
																					tempSubmintMaterials.materialCheckNumber = materialCheckNumber // 盘盈亏数量
																					tempSubmintMaterialsList.push(`${tempSubmintMaterials.materialID}:${tempSubmintMaterials.materialNumber}:${tempSubmintMaterials.materialCheckNumber}`) // 临时提交物料组添加数据

																					console.dir(tempSubmintMaterialsList)
																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintMaterials,
																						OtherData: OtherData,
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.warehouse_material_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.warehouse_material_standard;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = result.warehouse_material_type_id;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										try {
																											tempData = result.warehouse_material_units;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 5: {
																										try {
																											tempData = config.currentTrImportData.materialNumber;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 6: {
																										try {
																											tempData = config.currentTrImportData.materialCheckNumber;

																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 7: {
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintMaterialsList.splice(currentTr.index(), 1)
																													currentTr.remove() // 移除选中行的内容
																													pitchHide.show()

																													break
																												}
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
																				}
																				else if (materialNumber === '' && materialCheckNumber !== '') {
																					mesPopover_1.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																					}, 1000);
																				}
																				else if (materialNumber !== '' && materialCheckNumber === '') {
																					mesPopover_2.show()
																					setTimeout(function () {
																						mesPopover_2.hide()
																					}, 1000);
																				}
																				else {
																					mesPopover_1.show()
																					mesPopover_2.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																						mesPopover_2.hide()
																					}, 1000);
																				}

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
												totalRow: result.map.materialInfoLines, // 总行数
												displayRow: result.map.materialInfos.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '调拨人员/盘点仓库/调拨时间',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加仓库选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectWarehousesAddData(resolve)
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.warehouseCheckId = resolveData.warehouseID
													tbodyTd.eq(i).find('input').val(resolveData.warehouseName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 2:
											{
												inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
												})
											}
											break;
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/规格/型号/单位/账面数（数量）/盘盈亏（数量）/编辑',
								theadWidth: '5%/10%/10%/10%/5%/20%/20%/15%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						function warehouseSelectAddOption (target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.warehouseId = ''
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表

									if (dropDownOptionHTMLlist) {
										// 初始化下拉菜单长度
										dropDownOptionHTMLlist.length = 0;
									}
									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}" value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

										if (dropDownOptionHTMLlist) {
											// 保存仓库选项
											dropDownOptionHTMLlist.push(optionHtml);
										}
										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
										}
									}

									target.on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											searchData.warehouseId = warehouseList[selectOptionIndex - originalOptionLength].warehouse_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							});
						}
						warehouseSelectAddOption(warehouseOption);

						// 物料下拉菜单添加选项
						function materialSelectAddOption (target) {
							let originalOption = ['全部类型'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								searchData.materialTypeId = '';
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

							target.find('option').remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryCategoryUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let materialTypeList = result.map.materialTypes;

									for (let i = 0, len = materialTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${materialTypeList[i].warehouse_material_type_id}">${materialTypeList[i].warehouse_material_type_name}</option>`;

										target.append(optionHtml); // 添加物料选项
									}

									target.on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchGroup.find('input').val('');
											searchData.value = fuzzySearchGroup.find('input').val();
											searchData.materialTypeId = materialTypeList[selectOptionIndex - originalOptionLength].warehouse_material_type_id;
											addModalTableData(queryMaterialInventoryUrl, searchData);
										}
									});
								}
							})

						}
						materialSelectAddOption(materialTypeOption)

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}
							else {
								// 为空时重置搜索
								searchData.value = val;
								addModalTableData(queryMaterialInventoryUrl, searchData);
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								searchData.value = $(this).closest('.input-group').find('input').val();
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								console.dir(submitDataMainModal_1)
								if (submitDataMainModal_1.staffId !== ''
									&& submitDataMainModal_1.warehouseCheckId !== ''
									&& submitDataMainModal_1.dateStr !== ''
									&& tempSubmintMaterialsList.length > 0
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
										submitDataMainModal_1.materials = tempSubmintMaterialsList.toString()
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveMaterialChecksUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'warning',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})
				}())
				break
			case '#warehouseManagement1-8':  //供应商
				(function () {
					let activeSwiper = $('#warehouseManagement1-8'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement1-8-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '供应商',
						submitData = {
							supplierName: '', // 供应商名称
							supplierProperty: '', // 供应商性质
							supplierPhone: '', // 联系电话
							supplierAddress: '', // 供应商地址
							supplierEmail: '' // 供应商邮箱
						},
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/性质/电话/地址/邮箱/编辑',
											theadWidth: '5%/15%/15%/15%/20%/15%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a><a class="table-link" href="#" data-toggle-btn="edit"><i class="fa fa-pencil-square-o fa-fw"></i>编辑</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.suppliers, // 主要数据列表
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
																break;
															case 1: {
																try {
																	tempData = dataList[currentTr.index()].supplier_name;
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
																	tempData = dataList[currentTr.index()].supplier_property;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].supplier_phone;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].supplier_address;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].supplier_email;
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
															case 6:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].supplier_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeSuppliersUrl,
																					type: 'POST',
																					data: {
																						supplierId: currentTrID
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
																			break
																		}
																			break;
																		case 'edit': {
																			let targetModal = $('#publicHorizontalTableModal'),
																				modalPanelTarget = targetModal.find('.panel'),
																				modalCloseBtn = targetModal.find('.modal-header').find('.close'), // 模态框关闭按钮
																				modalSubmitBtn = targetModal.find('.modal-submit') // 模态框提交按钮
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTrID = dataList[currentTr.index()],
																				submitData = {
																					supplierId: currentTrID.supplier_id,
																					supplierName: currentTrID.supplier_name,
																					supplierProperty: currentTrID.supplier_property,
																					supplierPhone: currentTrID.supplier_phone,
																					supplierAddress: currentTrID.supplier_address,
																					supplierEmail: currentTrID.supplier_email,
																				}

																			targetModal.find('.modal-header').find('.modal-title').html('修改供应商'); // 模态页头标题更换
																			targetModal.find('.modal-footer').show(); // 模态框页脚隐藏

																			targetModal.modal({
																				backdrop: false, // 黑色遮罩不可点击
																				keyboard: false,  // esc按键不可关闭模态框
																				show: false
																			})
																			targetModal.modal('show')

																			// 横向表格添加数据
																			mesHorizontalTableAddData(modalPanelTarget, result, {
																				thead: '名称/性质/电话/地址/邮箱',
																				importData: (tbodyTd, length) => {
																					let defaultInputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																						dataList = submitData, // 主要数据列表
																						tempData = null; // 表格td内的临时数据

																					for (let i = 0, len = length; i < len; i++) {
																						switch (i) {
																							case 0: {
																								tempData = dataList.supplierName;
																								console.log(tempData)
																								tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									let currentInput = event.currentTarget

																									event.stopPropagation() // 禁止冒泡
																									submitData.supplierName = $(currentInput).val()
																								})
																								break;
																							}
																							case 1: {
																								tempData = dataList.supplierProperty;
																								tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									let currentInput = event.currentTarget

																									event.stopPropagation() // 禁止冒泡
																									submitData.supplierProperty = $(currentInput).val()
																								})
																								break;
																							}
																							case 2: {
																								tempData = dataList.supplierPhone;
																								tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									let currentInput = event.currentTarget

																									event.stopPropagation() // 禁止冒泡
																									submitData.supplierPhone = $(currentInput).val()
																								})
																								break;
																							}
																							case 3: {
																								tempData = dataList.supplierAddress;
																								tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									let currentInput = event.currentTarget

																									event.stopPropagation() // 禁止冒泡
																									submitData.supplierAddress = $(currentInput).val()
																								})
																								break;
																							}
																							case 4: {
																								tempData = dataList.supplierEmail;
																								tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									let currentInput = event.currentTarget

																									event.stopPropagation() // 禁止冒泡
																									submitData.supplierEmail = $(currentInput).val()
																								})
																								break;
																							}
																							default:
																								break;
																						}
																					}
																				}
																			})

																			// 提交数据
																			function submitModalData () {
																				let submitBtn = modalSubmitBtn

																				submitBtn.off('click').on('click', (event) => {
																					event.stopPropagation()
																					if (
																						submitData.supplierId !== ''
																						&& submitData.supplierName !== ''
																						&& submitData.supplierProperty !== ''
																						&& submitData.supplierPhone  !== ''
																						&& submitData.supplierAddress !== ''
																						&& submitData.supplierEmail !== ''
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
																								xhrFields: { withCredentials: true },
																								crossDomain: true,
																								url: BASE_PATH + '/' + 'modifySuppliers.do',
																								data: submitData,
																								success: function (result, status, xhr) {
																									if (result.status === 0) {
																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																									}
																									else {
																										swal({
																											title: result ? result.msg : '提交失败，请重新提交',
																											type: 'question',
																											allowEscapeKey: false, // 用户按esc键不退出
																											allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																											showCancelButton: false, // 显示用户取消按钮
																											confirmButtonText: '确定',
																										})
																									}
																								}
																							})
																						});
																					}
																					else {
																						swal({
																							title: '格式不正确，请重新输入',
																							text: '请检查格式是否正确后再点击提交',
																							type: 'warning',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: false, // 显示用户取消按钮
																							confirmButtonText: '确定',
																						})
																					}

																				})
																			}
																			submitModalData()

																			break;
																		}
																			break;
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
											displayRow: result.map.suppliers.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									mesloadBox.warningShow(); // 返回状态码0, 弹出错误
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(querySuppliersUrl, {
						type: "all",
						headNum: "1",
						supplierId: ""
					});

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let modalContainer = $(document.getElementById('publicHorizontalTableModal')), // 模态框容器
							modalTitle = modalContainer.find('.modal-header').find('.modal-title'), // 模态框标题
							modalCloseBtn = modalContainer.find('.modal-header').find('.close'), // 模态框关闭按钮
							modalPanel = modalContainer.find('.panel'), // 模态框内部面板
							modalSubmitBtn = modalContainer.find('.modal-submit') // 模态框提交按钮

						// 更换标题
						modalTitle.html('新增供应商')

						// 横向表格添加数据
						mesHorizontalTableAddData(modalPanel.find('table'), null, {
							thead: '供应商名称（必填）/供应商性质（必填）/联系电话（必填）/通讯地址（必填）/邮箱（必填）',
							importStaticData: (tbodyTd, length) => {
								let defaultInputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`

								for (let i = 0, len = length; i < len; i++) {
									switch (i) {
										case 0: {
											tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												let currentInput = event.currentTarget

												event.stopPropagation() // 禁止冒泡
												submitData.supplierName = $(currentInput).val()
											})
											break;
										}
										case 1: {
											tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												let currentInput = event.currentTarget

												event.stopPropagation() // 禁止冒泡
												submitData.supplierProperty = $(currentInput).val()
											})
											break;
										}
										case 2: {
											tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												let currentInput = event.currentTarget

												event.stopPropagation() // 禁止冒泡
												submitData.supplierPhone = $(currentInput).val()
											})
											break;
										}
										case 3: {
											tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												let currentInput = event.currentTarget

												event.stopPropagation() // 禁止冒泡
												submitData.supplierAddress = $(currentInput).val()
											})
											break;
										}
										case 4: {
											tbodyTd.eq(i).addClass('table-input-td').html(defaultInputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												let currentInput = event.currentTarget

												event.stopPropagation() // 禁止冒泡
												submitData.supplierEmail = $(currentInput).val()
											})
											break;
										}
										default:
											break;
									}
								}
							}
						})

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								event.stopPropagation()
								if (
									submitData.supplierAddress !== '' &&
									submitData.supplierEmail !== '' &&
									submitData.supplierName !== '' &&
									submitData.supplierPhone !== '' &&
									submitData.supplierProperty !== ''
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
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveSupplierUrl,
											data: submitData,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'question',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})
				}())
				break
			case '#warehouseManagement2-1':  //成品信息
				(function () {
					let activeSwiper = $('#warehouseManagement2-1'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement2-1-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						moduleName = '成品信息',
						// ajaxDataType = 'transfer',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						productlTypeOption = activePanelHeading.find('.product-type-option'), // 成品类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						fuzzySearchUrl = queryProductInfosUrl,
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/型号/电芯容量/电芯内阻/现存数量/编辑',
											theadWidth: '5%/15%/15%/15%/15%/15%/20%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="#" data-toggle-btn="modify"><i class="fa fa-trash-o fa-fw"></i>修改</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.products, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_name;
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
																	tempData = dataList[currentTr.index()].productModel.warehouse_product_model_name;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_size;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_capacity;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].totalCount;
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
															case 6:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {

																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetID = dataList[currentTr.index()].warehouse_product_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('成品详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryProductInfosUrl,
																				type: 'POST',
																				data: {
																					productId: currentTargetID,
																					productName: '',
																					productModelId: '',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '成品名称/成品型号/电芯尺寸(直径&#47;高度)/电芯容量(mAh)/电芯内阻(MaxmΩ)/电芯电压(v)/电芯K值(mV&#47;d)/保质期',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.products, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].warehouse_product_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].productModel.warehouse_product_model_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].warehouse_product_size;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].warehouse_product_capacity;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].warehouse_product_resistance;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].warehouse_product_voltage;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = dataList[0].warehouse_product_k;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].warehouse_product_shelf_life;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].warehouse_product_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeProductInfosUrl,
																					type: 'POST',
																					data: {
																						productId: currentTrID
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
																			break
																		}
																		case 'modify': {
																			console.log(window.vuex)
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].warehouse_product_id

																			window.vuex.$emit('showModifyAddProductionModal', currentTrID)
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
											displayRow: result.map.products.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow(); // 返回状态码0, 弹出错误
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(fuzzySearchUrl, {
						productId: '',
						productName: '',
						productModelId: '',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(fuzzySearchUrl, {
								productId: '',
								productName: val,
								productModelId: '',
								headNum: 1
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(fuzzySearchUrl, {
								productId: '',
								productName: '',
								productModelId: '',
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 成品型号下拉菜单添加选项
					function productSelectAddOption (target) {
						let originalOption = ['全部型号'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(fuzzySearchUrl, {
								productId: '',
								productName: '',
								productModelId: '',
								headNum: 1
							});
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
							url: queryProductModelsUrl,
							dataType: 'json',
							type: 'POST',
							data: {
								productModelId: '',
								productModelName: '',
								headNum: 1
							},
							success: (result) => {
								let productTypeList = result.map.productModels;

								for (let i = 0, len = productTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${productTypeList[i].warehouse_product_model_name}">${productTypeList[i].warehouse_product_model_name}</option>`

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(fuzzySearchUrl, {
											productId: '',
											productModelId: productTypeList[selectOptionIndex - originalOptionLength].warehouse_product_model_id,
											productName: '',
											headNum: 1
										})
									}
								});
							}
						})

					}
					productSelectAddOption(productlTypeOption)
				}())
				break
			case '#warehouseManagement2-2':  //成品库存
				(function () {
					let activeSwiper = $('#warehouseManagement2-2'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement2-2-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						moduleName = '成品库存',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						productlTypeOption = activePanelHeading.find('.product-type-option'), // 成品类型选项
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						fuzzySearchUrl = queryProductInventorysUrl,
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintMaterials = {
							// 临时要提交的物料信息
							materialID: '', // 物料ID
							materialBatch: '', // 物料批次
							materialTransferNumber: '', // 物料调拨数量
							supplierID: '', // 供应商ID
							WarehouseEntryID: '' // 转入仓库
						},
						tempSubmintMaterialsList = [], // 临时要提交的
						OtherData = {
							// 临时数据
						},
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							warehouseOutId: '', // 调出仓库ID
							dateStr: '',
							materials: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/型号/批次/库存数量/仓库',
											theadWidth: '5%/20%/20%/20%/15%/20%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												// '<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.productInventorys, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].product.warehouse_product_name;
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
																	tempData = dataList[currentTr.index()].product.productModel.warehouse_product_model_name;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_batch;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_batch_number;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].warehouse.warehouse_name;
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
											displayRow: result.map.productInventorys.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow(); // 返回状态码0, 弹出错误
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(fuzzySearchUrl, {
						productId: '',
						productName: '',
						productModelId: '',
						warehouseId: '',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryProductInventorysUrl, {
								productId: '',
								productName: val,
								productModelId: '',
								warehouseId: '',
								headNum: 1
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryProductInventorysUrl, {
								productId: '',
								productName: '',
								productModelId: '',
								warehouseId: '',
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(fuzzySearchUrl, {
								productId: '',
								productName: '',
								productModelId: '',
								warehouseId: '',
								headNum: 1
							});
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
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(fuzzySearchUrl, {
											productId: '',
											productName: '',
											productModelId: '',
											warehouseId: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id,
											headNum: 1
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 成品型号下拉菜单添加选项
					function productSelectAddOption (target) {
						let originalOption = ['全部型号'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(fuzzySearchUrl, {
								productId: '',
								productName: '',
								productModelId: '',
								warehouseId: '',
								headNum: 1
							});
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
							url: queryProductModelsUrl,
							dataType: 'json',
							type: 'POST',
							data: {
								productModelId: '',
								productModelName: '',
								headNum: 1
							},
							success: (result) => {
								let productTypeList = result.map.productModels;

								for (let i = 0, len = productTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${productTypeList[i].warehouse_product_model_name}">${productTypeList[i].warehouse_product_model_name}</option>`,
										productModelId = productTypeList[i].warehouse_product_model_id

									target.append(optionHtml);
									target.children().eq(i + originalOptionLength).off('click').on('click', () => {
										addTableData(fuzzySearchUrl, {
											productId: '',
											productModelId: productModelId,
											productName: '',
											headNum: 1
										})
									})
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(fuzzySearchUrl, {
											productId: '',
											productModelId: productTypeList[selectOptionIndex - originalOptionLength].warehouse_product_model_id,
											productName: '',
											headNum: 1
										})
									}
								});
							}
						})

					}
					productSelectAddOption(productlTypeOption)

				}())
				break
			case '#warehouseManagement2-3':  //成品入库
				(function () {
					let activeSwiper = $('#warehouseManagement2-3'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement2-3-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '成品库存',
						// ajaxDataType = 'transfer',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						productlTypeOption = activePanelHeading.find('.product-type-option'), // 成品类型选项
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						fuzzySearchUrl = queryProductEntrysUrl,
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintData_1 = {
							// 临时要提交的物料信息
							productID: '', // 成品ID
							productBatch: '', // 成品批次
							productEntryNumber: '', // 成品进入数量
							warehouseID: '', // 仓库ID
							productProductionDate: '' // 成品生产日期
						},
						tempSubmintDataList_1 = [], // 临时要提交的
						OtherData_1 = {
							// 临时数据
						},
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							dateStr: '',
							products: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/型号/批次/入库数量/入库时间/编辑',
											theadWidth: '5%/15%/15%/15%/10%/15%/25%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.productEntrys, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].product.warehouse_product_name;
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
																	tempData = dataList[currentTr.index()].product.productModel.warehouse_product_model_name;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_batch;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_entry_number;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_entry_time;
																	if (tempData != null) {
																		currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
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
															case 6: {
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {
																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetID = dataList[currentTr.index()].warehouse_product_entry_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('成品详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: queryProductEntrysUrl,
																				type: 'POST',
																				data: {
																					productEntryId: currentTargetID,
																					productId: '',
																					keyWord: '',
																					productModelId: '',
																					warehouseId: '',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '成品名称/成品型号/成品批次/所在仓库/入库数量/生产日期/入库人员/入库时间',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.productEntrys, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].product.warehouse_product_name
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].product.productModel.warehouse_product_model_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].warehouse_product_batch;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].warehouse.warehouse_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].warehouse_product_entry_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].warehouse_product_production_date;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 7: {
																										try {
																											tempData = dataList[0].warehouse_product_entry_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].warehouse_product_entry_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeProductEntrysUrl,
																					type: 'POST',
																					data: {
																						entryIds: currentTrID
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
											displayRow: result.map.productEntrys.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow(); // 返回状态码0, 弹出错误
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(fuzzySearchUrl, {
						productEntryId: '',
						productId: '',
						keyWord: '',
						productModelId: '',
						warehouseId: '',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryProductEntrysUrl, {
								productEntryId: '',
								productId: '',
								keyWord: val,
								productModelId: '',
								warehouseId: '',
								headNum: 1
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(queryProductEntrysUrl, {
								productEntryId: '',
								productId: '',
								keyWord: val,
								productModelId: '',
								warehouseId: '',
								headNum: 1
							});
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(fuzzySearchUrl, {
								productId: '',
								productName: '',
								productModelId: '',
								warehouseId: '',
								headNum: 1
							});
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
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(fuzzySearchUrl, {
											productId: '',
											productName: '',
											productModelId: '',
											warehouseId: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id,
											headNum: 1
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 成品型号下拉菜单添加选项
					function productSelectAddOption (target) {
						let originalOption = ['全部型号'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(fuzzySearchUrl, {
								productEntryId: '',
								productId: '',
								keyWord: '',
								productModelId: '',
								warehouseId: '',
								headNum: 1
							});
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryProductModelsUrl,
							dataType: 'json',
							type: 'POST',
							data: {
								productModelId: '',
								productModelName: '',
								headNum: 1
							},
							success: (result) => {
								let productTypeList = result.map.productModels;

								for (let i = 0, len = productTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${productTypeList[i].warehouse_product_model_name}">${productTypeList[i].warehouse_product_model_name}</option>`,
										productModelId = productTypeList[i].warehouse_product_model_id

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(fuzzySearchUrl, {
											productEntryId: '',
											productId: '',
											keyWord: '',
											productModelId: productTypeList[selectOptionIndex - originalOptionLength].warehouse_product_model_id,
											warehouseId: '',
											headNum: 1
										})
									}
								});
							}
						})

					}
					productSelectAddOption(productlTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(fuzzySearchUrl, {
										productEntryId: '',
										productId: '',
										keyWord: '',
										productModelId: '',
										warehouseId: '',
										startDate: moment(startDate).format('YYYY-MM-DD HH:MM'),
										endDate: moment(endDate).format('YYYY-MM-DD HH:MM'),
										headNum: 1
									});
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							panelTbody = panel_3.find('table tbody'),
							warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							modalSubmitBtn = dataContent.find('.modal-submit'),
							fuzzySearchUrl = queryProductInfosUrl,
							fuzzySearchData = {
								productId: '',
								productName: '',
								productModelId: '',
								headNum: 1
							},
							dropDownOptionHTMLlist = [], // 下拉选项列表
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})

						// pannel_3需要的功能
						warehouseOption.hide() // 仓库选项
						materialTypeOption.hide() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组
						productTypeOption.show() // 成品类型选项

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/名称/型号/批次/入库数量/仓库/生产日期/编辑',
												theadWidth: '5%/15%/10%/15%/10%/15%/15%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													`<td class="table-input-td"><select class="form-control table-input input-sm warehouse-option"></select></td>`,
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" /></td>`,
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = map.products, // 主要数据列表
														tempData = '' // 表格td内的临时数据

													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].warehouse_product_name;
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
																		tempData = dataList[currentTr.index()].productModel.warehouse_product_model_name;
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
																case 3: {
																	let currentInput = currentTr.children().eq(i).find('input')

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})

																		event.stopPropagation // 停止冒泡
																		if (inputVal === '') {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																	})
																	break;
																}
																case 4: {
																	let currentInput = currentTr.children().eq(i).find('input')
																	// registerTotal = dataList[currentTr.index()].warehouse_product_batch_number // 调拨数量

																	// try {
																	// 	tempData = registerTotal;
																	// 	if (tempData != null) {
																	// 		currentInput.val(registerTotal)
																	// 	}
																	// 	else {
																	// 		currentInput.val('暂无数据')
																	// 	}
																	// }
																	// catch (e) {
																	// 	currentInput.val('暂无数据')
																	// }

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																			})

																		event.stopPropagation // 停止冒泡
																		if (isNaN(inputVal) || inputVal === '' || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																		/* if (isNaN(inputVal) || inputVal === '' || inputVal > registerTotal || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		} */
																	})
																	break;
																}
																case 5: {
																	for (let j = 0, len = dropDownOptionHTMLlist.length; j < len; j++) {
																		currentTr.children().eq(i).find('select').append(dropDownOptionHTMLlist[j])
																	}
																	break;
																}
																// tempSubmintData_1 = {
																// 	// 临时要提交的物料信息
																// 	productID: '', // 成品ID
																// 	productBatch: '', // 成品批次
																// 	productEntryNumber: '', // 成品进入数量
																// 	warehouseID: '', // 仓库ID
																// 	productProductionDate: '' // 成品生产日期
																// },
																case 7: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink, // 点击的选项
																			madeDate = new Date(currentTr.children().eq(6).find('input').val())

																		event.stopPropagation()
																		switch (triggerTargetData) {
																			case 'addListData': {
																				let currentTrSelect = currentTr.children().eq(5).find('select'), // 仓库下拉菜单
																					productID = dataList[currentTr.index()].warehouse_product_id,  // 成品ID
																					productBatch = currentTr.children().eq(3).find('input').val(), // 成品批次
																					productEntryNumber = currentTr.children().eq(4).find('input').val(), // 成品进入数量
																					productProductionDate = madeDate.getTime(),  // 成品生产日期
																					warehouseID = currentTrSelect.get(0).options[currentTrSelect.get(0).selectedIndex].dataset.mesWarehouseId, // 仓库ID
																					mesPopover_1 = new MesPopover(currentTr.children().eq(3).find('input'), {
																					}),
																					mesPopover_2 = new MesPopover(currentTr.children().eq(4).find('input'), {
																					}),
																					mesPopover_3 = new MesPopover(currentTr.children().eq(6).find('input'), {
																					})

																				if (productBatch !== '' && productEntryNumber !== '' && productEntryNumber > 0 && !isNaN(parseInt(productProductionDate))) {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody'),
																						pitchHide = currentTr
																					pitchHide.hide()

																					OtherData_1.currentWarehouseName = currentTrSelect.val() // 已选择的仓库名称

																					// 传入临时提交数据
																					tempSubmintData_1.productID = productID.trim() // 成品ID
																					tempSubmintData_1.productBatch = productBatch.trim() // 成品批次
																					tempSubmintData_1.productEntryNumber = productEntryNumber.trim() // 成品入库数量
																					tempSubmintData_1.warehouseID = warehouseID.trim() // 入库仓库ID
																					tempSubmintData_1.productProductionDate = productProductionDate // 生产日期
																					tempSubmintDataList_1.push(`${tempSubmintData_1.productID}:${tempSubmintData_1.productBatch}:${tempSubmintData_1.productEntryNumber}:${tempSubmintData_1.warehouseID}:${tempSubmintData_1.productProductionDate}`) // 临时提交物料组添加数据
																					console.dir(tempSubmintDataList_1)
																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintData_1,
																						OtherData_1: OtherData_1,
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.warehouse_product_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.productModel.warehouse_product_model_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = config.currentTrImportData.productBatch;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										try {
																											tempData = config.currentTrImportData.productEntryNumber;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 5: {
																										try {
																											tempData = config.OtherData_1.currentWarehouseName;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 6: {
																										try {
																											tempData = moment(config.currentTrImportData.productProductionDate).format('YYYY-MM-DD HH:MM');
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 7: {
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintDataList_1.splice(currentTr.index(), 1)
																													currentTr.remove() // 移除选中行的内容
																													pitchHide.show()
																													break
																												}
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
																				}
																				else {
																					if (currentTr.children().eq(3).find('input').val() === '') {
																						mesPopover_1.show()
																						setTimeout(function () {
																							mesPopover_1.hide()
																						}, 1000);
																					}
																					if (currentTr.children().eq(4).find('input').val() === '') {
																						mesPopover_2.show()
																						setTimeout(function () {
																							mesPopover_2.hide()
																						}, 1000);
																					}
																					if (currentTr.children().eq(6).find('input').val() === '') {
																						mesPopover_3.show()
																						setTimeout(function () {
																							mesPopover_3.hide()
																						}, 1000);
																					}
																				}
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
												totalRow: result.map.lines, // 总行数
												displayRow: result.map.products.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '入库人员/入库时间',
							viewColGroup: 2,
							tableWitch: '20%/30%',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
											})
											break;
										}
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/型号/批次/入库数量/仓库/生产日期/编辑',
								theadWidth: '5%/15%/10%/15%/10%/15%/15%/15%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						function warehouseSelectAddOption (target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								fuzzySearchData.warehouseId = ''
								addModalTableData(fuzzySearchUrl, {
									productId: '',
									productName: '',
									productModelId: '',
									headNum: 1
								});
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
									target.children().eq(i).off('click').on('click', originalFunction[i]); // 添加初始化选项的事件
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表
									if (dropDownOptionHTMLlist) {
										// 初始化下拉菜单长度
										dropDownOptionHTMLlist.length = 0;
									}
									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}" value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;
										if (dropDownOptionHTMLlist) {
											// 保存仓库选项
											dropDownOptionHTMLlist.push(optionHtml);
										}
										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
											target.children().eq(i + originalOptionLength).off('click').on('click', (event) => {
												// 添加点击事件
												searchData.warehouseId = warehouseList[i].warehouse_id;
												addModalTableData(queryMaterialInventoryUrl, searchData);
											});
										}
									}
								}
							});
						}
						warehouseSelectAddOption(warehouseOption);

						// 成品下拉选项内容
						function productSelectAddOption (target) {
							let originalOption = ['全部型号'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								addModalTableData(fuzzySearchUrl, {
									productId: '',
									productName: '',
									productModelId: '',
									headNum: 1
								});
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryProductModelsUrl,
								dataType: 'json',
								type: 'POST',
								data: {
									productModelId: '',
									productModelName: '',
									headNum: 1
								},
								success: (result) => {
									let productTypeList = result.map.productModels;

									for (let i = 0, len = productTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${productTypeList[i].warehouse_product_model_name}">${productTypeList[i].warehouse_product_model_name}</option>`
										target.append(optionHtml);
									}

									target.on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchData.productName = '';
											fuzzySearchGroup.find('.input-group').find('input').val('');
											fuzzySearchData.productModelId = productTypeList[selectOptionIndex - originalOptionLength].warehouse_product_model_id;
											addModalTableData(fuzzySearchUrl, fuzzySearchData)
										}
									});
								}
							})

						}
						productSelectAddOption(productTypeOption)

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								fuzzySearchData.productName = val;
								addModalTableData(fuzzySearchUrl, fuzzySearchData);
							}
							else {
								// 为空时重置搜索
								fuzzySearchData.keyWord = val;
								addModalTableData(fuzzySearchUrl, {
									productId: '',
									productName: '',
									productModelId: '',
									headNum: 1
								});
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								fuzzySearchData.keyWord = $(this).closest('.input-group').find('input').val();
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								console.dir(submitDataMainModal_1)
								if (submitDataMainModal_1.dateStr !== ''
									&& submitDataMainModal_1.staffId !== ''
									&& tempSubmintDataList_1.length > 0
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
										submitDataMainModal_1.products = tempSubmintDataList_1.toString()
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveProductEntrysUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'warning',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})

				}())
				break
			case '#warehouseManagement2-4':  //成品出库
				(function () {
					let activeSwiper = $('#warehouseManagement2-4'), // 右侧外部swiper
						activeSubSwiper = $('#warehouseManagement2-4-1'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1
						moduleName = '成品出库',
						// ajaxDataType = 'transfer',
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						productlTypeOption = activePanelHeading.find('.product-type-option'), // 成品类型选项
						warehouseOption = activePanelHeading.find('.warehouse-option'), // 仓库选项
						dateSearchStart = activePanelHeading.find('.date-search-start'), // 搜索开始时间
						dateSearchEnd = activePanelHeading.find('.date-search-end'), // 搜索结束时间
						dateSearchSubmitBtn = activePanelHeading.find('.date-search-btn'), // 搜索提交
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						fuzzySearchUrl = queryProductOutsUrl, // 模糊搜索URL
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						}),
						tempSubmintData_1 = {
							// 按钮1要提交的物料信息
							productID: '', // 成品ID
							productBatch: '', // 成品批次
							productOutNumber: '', // 成品出库数量
							WarehouseOutId: '' // 仓库ID
						},
						tempSubmintDataList_1 = [], // 按钮1临时要提交的
						OtherData_1 = {
							// 临时数据1
						},
						submitDataMainModal_1 = {
							// 主要模态框1提交数据
							staffId: '',
							dateStr: '',
							products: ''
						}

					// 主表格添加内容
					function addTableData (url, data) {
						$.ajax({
							type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
											theadContent: '序号/名称/型号/批次/出库数量/出库时间/编辑',
											theadWidth: '5%/15%/15%/15%/10%/15%/25%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="#" data-toggle-modal-target="#dataDetails"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link text-danger" href="#" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.productOuts, // 主要数据列表
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
																try {
																	tempData = dataList[currentTr.index()].product.warehouse_product_name;
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
																	tempData = dataList[currentTr.index()].product.productModel.warehouse_product_model_name;
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
															case 3: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_batch;
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
															case 4: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_out_number;
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
															case 5: {
																try {
																	tempData = dataList[currentTr.index()].warehouse_product_out_time;
																	if (tempData != null) {
																		currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
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
															case 6: {
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn; // 按钮自带的data数据

																	switch (dataContent) {
																		case '#dataDetails': {

																			let addDataTarget = $(dataContent),
																				modalPanelTarget = $(dataContent).find('.panel'),
																				mesloadBox = new MesloadBox(modalPanelTarget, {}),
																				currentTargetID = dataList[currentTr.index()].warehouse_product_out_id;

																			addDataTarget.find('.modal-footer').show(); // 模态框页脚显示
																			addDataTarget.find('.modal-header').find('.modal-title').html('成品详情'); // 模态页头标题更换
																			addDataTarget.find('.modal-footer').hide(); // 模态框页脚隐藏

																			$.ajax({
																				url: fuzzySearchUrl,
																				type: 'POST',
																				data: {
																					productOutId: currentTargetID,
																					productId: '',
																					keyWord: '',
																					productModelId: '',
																					warehouseId: '',
																					startDate: '',
																					endDate: '',
																					headNum: 1
																				},
																				beforeSend: function (xml) { // ajax发送前
																					mesloadBox.loadingShow()
																				},
																				success: (result, textStatus, xhr) => {
																					mesloadBox.hide()
																					mesHorizontalTableAddData(modalPanelTarget, result, {
																						thead: '成品名称/成品型号/成品批次/出库仓库/出库数量/出库人员/出库时间',
																						importData: function (tbodyTd, len, result) {
																							let map = result.map, // 映射
																								dataList = map.productOuts, // 主要数据列表
																								tempData = null; // 表格td内的临时数据
																							for (let i = 0; i < len; i++) {
																								switch (i) {
																									case 0: {
																										try {
																											tempData = dataList[0].product.warehouse_product_name
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 1: {
																										try {
																											tempData = dataList[0].product.productModel.warehouse_product_model_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 2: {
																										try {
																											tempData = dataList[0].warehouse_product_batch;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 3: {
																										try {
																											tempData = dataList[0].warehouse.warehouse_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 4: {
																										try {
																											tempData = dataList[0].warehouse_product_out_number;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 5: {
																										try {
																											tempData = dataList[0].staff.role_staff_name;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(tempData)
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									case 6: {
																										try {
																											tempData = dataList[0].warehouse_product_out_time;
																											if (tempData != null) {
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD HH:MM'))
																											}
																											else {
																												tbodyTd.eq(i).html('暂无数据')
																											}
																										} catch (e) {
																											tbodyTd.eq(i).html('暂无数据')
																										}
																									}
																										break;
																									default:
																										break;
																								}
																							}
																						}
																					})
																				},
																				error: function () { // 错误
																					mesloadBox.errorShow()
																				},
																				complete: function (xhr, status) { // ajax完成后
																					if (status === 'timeout') {
																						mesloadBox.timeoutShow()
																					}
																				}
																			})
																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrID = dataList[currentTr.index()].warehouse_product_out_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeProductOutsUrl,
																					type: 'POST',
																					data: {
																						outIds: currentTrID
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
											displayRow: result.map.productOuts.length // 显示行数
										},

										ajax: {
											url: url,
											data: data
										}
									})
								}
								else {
									panelTbody.empty().append(NO_DATA_NOTICE)
									mesloadBox.warningShow(); // 返回状态码0, 弹出错误
								}
							}
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(fuzzySearchUrl, {
						productOutId: '',
						productId: '',
						keyWord: '',
						productModelId: '',
						warehouseId: '',
						startDate: '',
						endDate: '',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(fuzzySearchUrl, {
								productOutId: '',
								productId: '',
								keyWord: val,
								productModelId: '',
								warehouseId: '',
								startDate: '',
								endDate: '',
								headNum: 1
							})
							$(this).closest('.input-group').find('input').val('')
						}
						else {
							// 为空时重置搜索
							addTableData(fuzzySearchUrl, {
								productOutId: '',
								productId: '',
								keyWord: '',
								productModelId: '',
								warehouseId: '',
								startDate: '',
								endDate: '',
								headNum: 1
							})
						}

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							$(this).closest('.input-group').find('input').val('')
						}

					});

					// 仓库下拉菜单添加选项
					function warehouseSelectAddOption (target) {
						let originalOption = ['全部仓库'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(fuzzySearchUrl, {
								productId: '',
								productName: '',
								productModelId: '',
								warehouseId: '',
								headNum: 1
							});
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
							url: queryWarehousesUrl,
							dataType: 'json',
							type: 'POST',
							success: (result) => {
								let warehouseList = result.map.warehouse;

								for (let i = 0, len = warehouseList.length; i < len; i++) {
									let optionHtml = `<option value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;

									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(fuzzySearchUrl, {
											productId: '',
											productName: '',
											productModelId: '',
											warehouseId: warehouseList[selectOptionIndex - originalOptionLength].warehouse_id,
											headNum: 1
										})
									}
								});
							}
						})
					}
					warehouseSelectAddOption(warehouseOption)

					// 成品型号下拉菜单添加选项
					function productSelectAddOption (target) {
						let originalOption = ['全部型号'], // 初始化选项
							originalFunction = [], // 初始化选项方法
							originalOptionLength = 0;

						originalFunction[0] = () => {
							addTableData(fuzzySearchUrl, {
								productOutId: '',
								productId: '',
								keyWord: '',
								productModelId: '',
								warehouseId: '',
								startDate: '',
								endDate: '',
								headNum: 1
							})
						}

						target.children().remove() // 清空选项

						// 添加初始化选项
						if (originalOption != null) {
							originalOptionLength = originalOption.length;
							for (let i = 0, len = originalOptionLength; i < len; i++) {
								let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

								target.append(optionHtml);
							}
						}

						$.ajax({
							url: queryProductModelsUrl,
							dataType: 'json',
							type: 'POST',
							data: {
								productModelId: '',
								productModelName: '',
								headNum: 1
							},
							success: (result) => {
								let productTypeList = result.map.productModels;

								for (let i = 0, len = productTypeList.length; i < len; i++) {
									let optionHtml = `<option value="${productTypeList[i].warehouse_product_model_name}">${productTypeList[i].warehouse_product_model_name}</option>`
									target.append(optionHtml);
								}

								target.on('change', (event) => {
									let selectOptionIndex = target[0].selectedIndex
									event.stopImmediatePropagation()
									if (selectOptionIndex < originalOptionLength) {
										originalFunction[selectOptionIndex]()
									}
									else {
										addTableData(fuzzySearchUrl, {
											productOutId: '',
											productId: '',
											keyWord: '',
											productModelId: productTypeList[selectOptionIndex - originalOptionLength].warehouse_product_model_id,
											warehouseId: '',
											startDate: '',
											endDate: '',
											headNum: 1
										})
									}
								});
							}
						})

					}
					productSelectAddOption(productlTypeOption)

					// 时间段搜索
					function dateRangeSearch (startTarget, endTarget, submitBtn) {
						submitBtn.off('click').on('click', (event) => {
							let startDate = new Date(startTarget.val()).getTime(), // 获取起始日期毫秒数
								endDate = +(new Date(endTarget.val()).getTime()) + (3600 * 24 * 1000) // 获取结束日期毫秒数

							event.stopPropagation() // 禁止冒泡
							if (startDate !== '' && endDate !== '') {
								if (startDate > endDate) {
									let mesPopover = new MesPopover(endTarget, {
										content: '结束日期不可比起始日期早'
									})
									mesPopover.show()
									$('body').off('click').on('click', function () {
										mesPopover.hide()
									})
								}
								else {
									addTableData(fuzzySearchUrl, {
										productOutId: '',
										productId: '',
										keyWord: '',
										productModelId: '',
										warehouseId: '',
										startDate: moment(startDate).format('YYYY-MM-DD HH:MM'),
										endDate: moment(endDate).format('YYYY-MM-DD HH:MM'),
										headNum: 1
									})
								}
							}
						})
					}
					dateRangeSearch(dateSearchStart, dateSearchEnd, dateSearchSubmitBtn)

					// 头部主要按钮1点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						let dataContent = mainModal_1,
							panelList = dataContent.find('.panel'),
							modalCloseBtn = mainModal_1.find('.modal-header').find('.close'),
							panel_1 = panelList.eq(0),
							panel_2 = panelList.eq(1),
							panel_3 = panelList.eq(2),
							panelTbody = panel_3.find('table tbody')
						warehouseOption = panel_3.find('.warehouse-option'), // 仓库选项
							productTypeOption = panel_3.find('.product-type-option'), // 成品类型选项
							materialTypeOption = panel_3.find('.material-type-option'), // 物料类型选项
							fuzzySearchGroup = panel_3.find('.fuzzy-search-group'), // 模糊搜索组
							modalSubmitBtn = dataContent.find('.modal-submit'),
							fuzzySearchUrl = queryProductInventorysUrl,
							fuzzySearchData = {
								productId: '',
								productName: '',
								productModelId: '',
								warehouseId: '',
								headNum: 1
							},
							dropDownOptionHTMLlist = [], // 下拉选项列表
							mesloadBox = new MesloadBox(panel_3, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							})

						// pannel_3需要的功能
						warehouseOption.show() // 仓库选项
						materialTypeOption.hide() // 物料类型选项
						fuzzySearchGroup.show() // 模糊搜索组
						productTypeOption.show() // 成品类型选项

						fuzzySearchGroup.find('input').val(''); // 初始化模糊搜索框

						// panel_3添加内容（headingMainBtn_1）
						function addModalTableData (url, data) {
							$.ajax({
								type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
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
										mesVerticalTableAddData(panel_3, {
											thead: {
												theadContent: '序号/名称/型号/批次/出库数量/仓库/编辑',
												theadWidth: '5%/15%/15%/15%/15%/15%/20%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													`<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>`,
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="addListData"><i class="fa fa-lg fa-plus fa-fw"></i>添加</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = map.productInventorys, // 主要数据列表
														tempData = '' // 表格td内的临时数据

													tbodyTarget.empty() // 清空表格主体

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
																	try {
																		tempData = dataList[currentTr.index()].product.warehouse_product_name;
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
																		tempData = dataList[currentTr.index()].product.productModel.warehouse_product_model_name;
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
																case 3: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse_product_batch;
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
																case 4: {
																	let currentInput = currentTr.children().eq(i).find('input')
																	registerTotal = dataList[currentTr.index()].warehouse_product_batch_number // 入库数量

																	try {
																		tempData = registerTotal;
																		if (tempData != null) {
																			currentInput.val(registerTotal)
																		}
																		else {
																			currentInput.val('暂无数据')
																		}
																	}
																	catch (e) {
																		currentInput.val('暂无数据')
																	}

																	currentInput.off('blur').on('blur', (event) => {
																		let inputVal = currentInput.val(),
																			mesPopover = new MesPopover(currentInput, {
																				content: '请确认你的数量是否正确'
																			})

																		event.stopPropagation() // 停止冒泡
																		if (isNaN(inputVal) || inputVal === '' || inputVal > dataList[currentTr.index()].warehouse_product_batch_number || inputVal <= 0) {
																			currentInput.val('')
																			mesPopover.show()

																			setTimeout(function () {
																				mesPopover.hide()
																			}, 1000);
																		}
																	})
																	break;
																}
																case 5: {
																	try {
																		tempData = dataList[currentTr.index()].warehouse.warehouse_name;
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
																	break;
																}
																// tempSubmintData_1 = {
																// 	// 按钮1要提交的物料信息
																// 	productID: '', // 成品ID
																// 	productBatch: '', // 成品批次
																// 	productOutNumber: '', // 成品出库数量
																// 	WarehouseOutId: '' // 仓库ID
																// }
																case 6: {
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let triggerTargetData = event.currentTarget.dataset.mesTableLink, // 点击的选项
																			registerTotal = dataList[currentTr.index()].warehouse_product_batch_number // 入库数量

																		event.stopPropagation()
																		switch (triggerTargetData) {
																			case 'addListData': {
																				productID = dataList[currentTr.index()].warehouse_product_id,  // 成品ID
																					productBatch = dataList[currentTr.index()].warehouse_product_batch, // 成品批次
																					productOutNumber = currentTr.children().eq(4).find('input').val(), // 成品出库数量
																					WarehouseOutId = dataList[currentTr.index()].warehouse.warehouse_id, // 仓库ID
																					mesPopover_1 = new MesPopover(currentTr.children().eq(4).find('input'), {
																						content: '请确认你的数量是否正确'
																					})

																				if (productOutNumber !== '' && productOutNumber > 0) {
																					let currentTrResultData = dataList[currentTr.index()], // 当前行的返回数据
																						addTrDataTarget = panel_2.find('table').find('tbody'),
																						pitchHide = currentTr
																					pitchHide.hide()
																					// 传入临时提交数据
																					tempSubmintData_1.productID = productID.trim() // 成品ID
																					tempSubmintData_1.productBatch = productBatch.trim() // 成品批次
																					tempSubmintData_1.productOutNumber = productOutNumber.trim() // 成品入出库数量
																					tempSubmintData_1.WarehouseOutId = WarehouseOutId.trim() // 出库仓库ID
																					tempSubmintDataList_1.push(`${tempSubmintData_1.productID}:${tempSubmintData_1.productBatch}:${tempSubmintData_1.productOutNumber}:${tempSubmintData_1.WarehouseOutId}`) // 临时提交物料组添加数据

																					mesAddTrData(addTrDataTarget, currentTrResultData, {
																						currentTrImportData: tempSubmintData_1,
																						OtherData_1: OtherData_1,
																						html: [
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td></td>',
																							'<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" /></td>',
																							'<td></td>',
																							'<td class="table-input-td"><a class="table-link" href="#" data-mes-table-link="removeListData"><i class="fa fa-lg fa-times fa-fw"></i>删除</a></td>'
																						],
																						dataAddress: function (tbodyTarget, result, config) {
																							let tempData = '' // 表格td内的临时数据

																							tbodyTarget.append('<tr></tr>'); // 添加行
																							let lastTr = tbodyTarget.children('tr').last(); // 循环到的当前行
																							for (let i = 0, len = config.html.length; i < len; i++) {
																								lastTr.append(config.html[i]); // 添加表格内的HTML
																								switch (i) {
																									case 0: {
																										lastTr.children().eq(i).html(lastTr.index() + 1)
																										break;
																									}
																									case 1: {
																										try {
																											tempData = result.product.warehouse_product_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 2: {
																										try {
																											tempData = result.product.productModel.warehouse_product_model_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 3: {
																										try {
																											tempData = result.warehouse_product_batch;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 4: {
																										let currentInput = lastTr.children().eq(i).find('input')

																										try {
																											tempData = registerTotal;
																											if (tempData != null) {
																												currentInput.val(registerTotal)
																											}
																											else {
																												currentInput.val('暂无数据')
																											}
																										}
																										catch (e) {
																											currentInput.val('暂无数据')
																										}
																										var currentInputVal = currentInput.val();

																										currentInput.off('blur').on('blur', (event) => {

																											let inputVal = currentInput.val(),
																												mesPopover = new MesPopover(currentInput, {
																												})

																											event.stopPropagation // 停止冒泡
																											if (!(isNaN(inputVal)) && inputVal !== '' && Number(inputVal) <= Number(currentInputVal)) {
																												if (inputVal <= 0) {
																													currentInput.val('')
																													mesPopover.show()

																													$('body').off('click').on('click', () => {
																														mesPopover.hide()
																													})
																												}
																											}
																											else if (inputVal !== '') {
																												currentInput.val('')
																												mesPopover.show()
																												$('body').off('click').on('click', (event) => {
																													event.stopPropagation // 停止冒泡
																													mesPopover.hide()
																												})
																											}
																										})
																										break;
																									}
																									case 5: {
																										try {
																											tempData = result.warehouse.warehouse_name;
																											if (tempData != null) {
																												lastTr.children().eq(i).html(tempData)
																											}
																											else {
																												lastTr.children().eq(i).html('暂无数据')
																											}
																										}
																										catch (e) {
																											lastTr.children().eq(i).html('暂无数据')
																										}
																										break;
																									}
																									case 6: {
																										lastTr.children().eq(i).off('click').on('click', 'a', (event) => {
																											let triggerBtnData = event.currentTarget.dataset.mesTableLink,
																												currentTr = $(event.currentTarget).closest('tr')

																											switch (triggerBtnData) {
																												case 'removeListData': {
																													tempSubmintDataList_1.splice(currentTr.index(), 1)
																													currentTr.remove() // 移除选中行的内容
																													pitchHide.show()
																													break
																												}
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

																				}
																				else {
																					mesPopover_1.show()
																					setTimeout(function () {
																						mesPopover_1.hide()
																					}, 1000);
																				}
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
												totalRow: result.map.lines, // 总行数
												displayRow: result.map.productInventorys.length // 显示行数
											},

											ajax: {
												url: url,
												data: data
											}
										})
									}
									else {
										panelTbody.empty().append(NO_DATA_NOTICE)
										mesloadBox.warningShow();
									}
								}
							})
						}

						dataContent.find('.modal-header').find('.modal-title').text(moduleName) // 更换modal标题

						// panel_1
						panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
						mesHorizontalTableAddData(panel_1.find('table'), null, {
							thead: '出库人员/出库时间',
							viewColGroup: 2,
							tableWitch: '20%/30%',
							importStaticData: (tbodyTd, length) => {
								let inputHtml = '';

								for (let i = 0, len = length; i < len; i++)
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryStaffUrl, {
														type: 'info',
														headNum: 1
													})
												});
												promise.then(function (resolveData) {
													submitDataMainModal_1.staffId = resolveData.roleStaffId
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})
											break;
										}
										case 1: {
											inputHtml = `<input type="text" class="table-input" placeholder="请选择" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submitDataMainModal_1.dateStr = tbodyTd.eq(i).find('input').val()
											})
											break;
										}
										default:
											break;
									}

							}
						})

						// panel_2
						panel_2.find('.panel-heading').find('.panel-title').text('已选择的物料') // 更换panel标题
						panel_2.find('tbody').empty() // 清空表格主体
						mesVerticalTableAddData(panel_2, {
							thead: {
								theadContent: '序号/名称/型号/批次/出库数量/出库仓库/编辑',
								theadWidth: '5%/15%/15%/15%/15%/15%/20%'
							},
							tbody: {

							},
							pagination: {

							},
							ajax: {

							}
						})

						// panel_3
						panel_3.find('.panel-heading').find('.panel-title').text('选择物料') // 更换panel标题

						// 执行仓库下拉选项内容
						function warehouseSelectAddOption (target) {
							let originalOption = ['全部仓库'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								fuzzySearchData.warehouseId = ''
								addModalTableData(fuzzySearchUrl, {
									productId: '',
									productName: '',
									productModelId: '',
									warehouseId: '',
									headNum: 1
								});
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml); // 添加初始化选项
								}
							}

							$.ajax({
								url: queryWarehousesUrl,
								dataType: 'json',
								type: 'POST',
								success: (result) => {
									let warehouseList = result.map.warehouse; // 返回的仓库列表
									if (dropDownOptionHTMLlist) {
										// 初始化下拉菜单长度
										dropDownOptionHTMLlist.length = 0;
									}
									for (let i = 0, len = warehouseList.length; i < len; i++) {
										let optionHtml = `<option data-mes-warehouse-id="${warehouseList[i].warehouse_id}" value="${warehouseList[i].warehouse_name}">${warehouseList[i].warehouse_name}</option>`;
										if (dropDownOptionHTMLlist) {
											// 保存仓库选项
											dropDownOptionHTMLlist.push(optionHtml);
										}
										if (warehouseOption != null) {
											target.append(optionHtml); // 添加选项内容
										}
									}

									target.on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchData.keyWord = ''
											fuzzySearchGroup.find('.input-group').find('input').val('');
											fuzzySearchData.warehouseId = warehouseList[selectOptionIndex - originalOptionLength].warehouse_id;
											addModalTableData(fuzzySearchUrl, fuzzySearchData);
										}
									});
								}
							});
						}
						warehouseSelectAddOption(warehouseOption);

						// 成品下拉选项内容
						function productSelectAddOption (target) {
							let originalOption = ['全部型号'], // 初始化选项
								originalFunction = [], // 初始化选项方法
								originalOptionLength = 0;

							originalFunction[0] = () => {
								addModalTableData(fuzzySearchUrl, {
									productId: '',
									productName: '',
									productModelId: '',
									warehouseId: '',
									headNum: 1
								});
							}

							target.children().remove() // 清空选项

							// 添加初始化选项
							if (originalOption != null) {
								originalOptionLength = originalOption.length;
								for (let i = 0, len = originalOptionLength; i < len; i++) {
									let optionHtml = `<option value="${originalOption[i]}">${originalOption[i]}</option>`;

									target.append(optionHtml);
								}
							}

							$.ajax({
								url: queryProductModelsUrl,
								dataType: 'json',
								type: 'POST',
								data: {
									productModelId: '',
									productModelName: '',
									headNum: 1
								},
								success: (result) => {
									let productTypeList = result.map.productModels;

									for (let i = 0, len = productTypeList.length; i < len; i++) {
										let optionHtml = `<option value="${productTypeList[i].warehouse_product_model_name}">${productTypeList[i].warehouse_product_model_name}</option>`;
										target.append(optionHtml);
									}

									target.on('change', (event) => {
										let selectOptionIndex = target[0].selectedIndex
										event.stopImmediatePropagation()
										if (selectOptionIndex < originalOptionLength) {
											originalFunction[selectOptionIndex]()
										}
										else {
											fuzzySearchData.productName = '';
											fuzzySearchGroup.find('.input-group').find('input').val('');
											fuzzySearchData.productModelId = productTypeList[selectOptionIndex - originalOptionLength].warehouse_product_model_id;
											addModalTableData(fuzzySearchUrl, fuzzySearchData)
										}
									});
								}
							})

						}
						productSelectAddOption(productTypeOption)

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								addModalTableData(fuzzySearchUrl, {
									productId: '',
									productName: val,
									productModelId: '',
									warehouseId: '',
									headNum: 1
								});
							}
							else {
								// 为空时重置搜索
								fuzzySearchData.keyWord = val;
								addModalTableData(fuzzySearchUrl, {
									productId: '',
									productName: '',
									productModelId: '',
									warehouseId: '',
									headNum: 1
								});
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								fuzzySearchData.keyWord = $(this).closest('.input-group').find('input').val();
								$(this).closest('.input-group').find('button').trigger('click')
							}
						});
						fuzzySearchGroup.find('.btn').trigger('click') // 模拟点击搜索

						// 提交数据
						function submitModalData () {
							let submitBtn = modalSubmitBtn

							submitBtn.off('click').on('click', (event) => {
								if (submitDataMainModal_1.dateStr !== ''
									&& submitDataMainModal_1.staffId !== ''
									&& tempSubmintDataList_1.length > 0
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
										submitDataMainModal_1.products = tempSubmintDataList_1.toString() // 将数组转换为字符串
										$.ajax({
											type: "POST", xhrFields: { withCredentials: true }, crossDomain: true,
											url: saveProductOutsUrl,
											data: submitDataMainModal_1,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}
												else {
													swal({
														title: result ? result.msg : '提交失败，请重新提交',
														type: 'warning',
														allowEscapeKey: false, // 用户按esc键不退出
														allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
														showCancelButton: false, // 显示用户取消按钮
														confirmButtonText: '确定',
													})
												}
											}
										})
									});
								}
								else {
									swal({
										title: '格式不正确，请重新输入',
										text: '请检查格式是否正确后再点击提交',
										type: 'warning',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: false, // 显示用户取消按钮
										confirmButtonText: '确定',
									})
								}

							})
						}
						submitModalData()

					})

				}())
				break
		}
	})
	leftNavLink.eq(0).trigger('click');
})
