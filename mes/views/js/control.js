$(function () {
	let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
		RightContent = $('#mainRightContent'), // 右侧内容栏
		RightContentSwiper = RightContent.find('.swiper-wrapper'), // 右侧内容栏下的swiper
		leftNavLink = leftNav.find('a').filter('[href^="#"]'), // 左侧变栏对应的swiper
		mainModal_1 = $('#modalBox').find('#mainModal_1'), // 主要模态框1
		dataDetailsModal = $('#dataDetailsModal'),	// 详情模态框1
		submitModelModal = $('#submitModelModal'),	// 表单提交模态框1
		submitModelModal2 = $('#submitModelModal2'),	// 表单提交模态框2
		timer = null,
		devicesTypeList=[],			//设备类型集合
		productTypeList = [],		//产品类型集合
		semiProductTypeList = [],//半成品类型集合
		semiProList=[],//半成品集合
		semiProparList=[]   ,     //半成品参数集合
		ProductLinesList=[],     //产线集合
		workstageList=[],//工序集合
		workstepParamersTypeId,//工步参数类型Id
		semiProParamersTypeId, //半成品参数类型Id
		voltageUnit=["V","kV","mV","μV"],//常用电压单位
		currentUnit=["A","kA","mA","μA"],//常用电流单位
		resistanceUnit=["Ω","kΩ","MΩ","GΩ"],//常用电阻单位
		weightUnit=["g","mg","kg"],//常用重量单位
		temperatureUnit=["℃","℉"],//常用温度单位
		sizeUnit=["cm","mm","dm","m","km","μm"],//常用尺寸单位
		rateUnit=["%","‰" ],//速率单位
		capacityUnit=["mAh","Ah" ],//容量单位
		worktageOption = submitModelModal.find(".worktage-type-option"),// 类型选
		copyCraftSegment,
		copyCraft

		// 创建下拉框
		function createSelect(target,nameSet) {
			target.empty()
			for (let i = 0, len = nameSet.length; i < len; i++) {
				//设备类型id作为value,名称作为text
				let optionStr = `<option value="${nameSet[i]}">${nameSet[i]}</option>`;
				target.append(optionStr);
			}
		};



			// 获取产线集合
		(function loadDevicesType() {
			$.ajax({
			
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
				// async: false,
				url: queryProductLinesUrl,
				
				success: function (result, status, xhr) {
					if (result.status === 0) {
						semiProparList = result.map.productLines
					}
					else {
						// swallFail();	//操作失败
					}
				},
				complete : 
				function(XMLHttpRequest, textStatus) {
					// 通过XMLHttpRequest取得响应头，sessionstatus
					var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
					if (sessionstatus == "TIMEOUT") {	
					var win = window;
						while (win != win.top){
							win = win.top;
					}
						win.location.href= XMLHttpRequest.getResponseHeader("CONTEXTPATH");
					}
				},
			})
		}());

		function createProductLinesSelect(target) {
			target.empty()
			target.append(`<option value="">选择产线</option>`);

			for (let i = 0, len = semiProparList.length; i < len; i++) {
				//设备类型id作为value,名称作为text
				let optionStr = `<option value="${semiProparList[i].product_line_id},${semiProparList[i].product_line_name}"  data="${semiProparList[i].product_line_name}">${semiProparList[i].product_line_name}</option>`;
				target.append(optionStr);
			}

		}

	 		// 获取设备类型集合
		(function loadDevicesType() {
				$.ajax({
					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
					// async: false,
					url: queryDevicesTypesUrl,
					success: function (result, status, xhr) {
						if (result.status === 0) {
							devicesTypeList = result.map.devices_control_devices_type
						}
						else {
							// swallFail();	//操作失败
						}
					}
				})
		}());

		function createDevicesTypeSelect(target) {
			target.empty()
			target.append(`<option value="">全部类型</option>`);

			for (let i = 0, len = devicesTypeList.length; i < len; i++) {
				//设备类型id作为value,名称作为text
				let optionStr = `<option value="${devicesTypeList[i].devices_control_devices_type_id}">${devicesTypeList[i].devices_control_devices_type_name}</option>`;
				target.append(optionStr);
			}

		};

		// @description :获取工序名称集合
		(function loadWorkstage() {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
				// async: false,
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
			target.append(`<option value="">请选择工序</option>`);

			for (let i = 0, len = workstageList.length; i < len; i++) {
				//设备类型id作为value,名称作为text
				let optionStr = `<option value="${workstageList[i].workstage_basics_id}">${workstageList[i].workstage_name}</option>`;
				target.append(optionStr);
			}

		}



		// 获取产品类型集合
		(function loadProductType() {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
				// async: false,
				data:{
					type: 'vague',
					status: 0,
				},
				url: queryProductTypeUrl,
				// data: { "headNum": headNum },
				success: function (result, status, xhr) {
					if (result.status === 0) {
						productTypeList = result.map.productTypes
					}
					else {
						// swallFail();	//操作失败
					}
				}
			})
		}());

		// 获取半成品类型集合
		(function loadProductType() {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
				// async: false,
				data:{
					type:"vague",
					status:0,
				},
				url: querySemiFinishedProductTypeUrl,
				// data: { "headNum": headNum },
				success: function (result, status, xhr) {
					if (result.status === 0) {
						semiProductTypeList = result.map.semiFinishTypes
					}
					else {
						// swallFail();	//操作失败
					}
				}
			})
		}());

		// 获得半成品下拉框
		(function loadWorkstage() {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
				// async: false,
				data:{
					type:"vague",
					status:0,
				},
				url: querySemiFinishedProductModelUrl,
				success: function (result, status, xhr) {

					if (result.status === 0) {
						semiProList = result.map.SemiFinishs
					}
					else {
						// swallFail();	//操作失败
					}
				}

			})
		}());
		//生成半成品下拉选项
		function createsemiProSelect(target) {
			target.empty()
			target.append(`<option value="">请选择半成品</option>`);

			for (let i = 0, len = semiProList.length; i < len; i++) {
				let optionStr = `<option value="${semiProList[i].semi_finish_id}">${semiProList[i].semi_finish_name}</option>`;
				target.append(optionStr);
			}

		}

		//生成产品类型下拉选项
		function createProductTypeSelect(target) {
			target.empty()
			target.append(`<option value="">全部类型</option>`);

			for (let i = 0, len = productTypeList.length; i < len; i++) {
				let optionStr = `<option value="${productTypeList[i].product_model_type_id},${productTypeList[i].product_type_name}" title="${productTypeList[i].product_type_name}">${productTypeList[i].product_type_name}</option>`;
				target.append(optionStr);
			}

		}
		//生成半成品类型下拉选项
		function createSemiProductTypeSelect(target) {
			target.empty()
			target.append(`<option value="">全部类型</option>`);

			for (let i = 0, len = semiProductTypeList.length; i < len; i++) {
				let optionStr = `<option value="${semiProductTypeList[i].semi_finish_type_id}">${semiProductTypeList[i].semi_finish_type_name}</option>`;
				target.append(optionStr);
			}

		}

	leftNavLink.on('click', function (event) {
		let targetHref = event.currentTarget.getAttribute('href'),
		classAttr = event.currentTarget.getAttribute('class');

		clearInterval(timer);	// 清除定时器，切换到其它页时清除，不然定时器会一直运行
		 //USERNAME  = "张三"
		 //USERID = "eafbdeecabb14446a31d75d223586dfc"

		switch (targetHref) {
			case '#craftSegmentManage':	//工艺段管理
				(function(){
					let activeSwiper = $('#craftSegmentManage'), // 右侧外部swiper
					activeSubSwiper = $('#craftSegmentManageInerSwiper'), // 右侧内部swiper
					panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
					panel1 = panelList.eq(0),
					panel2 = panelList.eq(1),
					panel3 = panelList.eq(2),
					activePanelHeading1 = panel2.find('.panel-heading'), // 面板2头部
					headingMainBtn_1 = activePanelHeading1.find('.head-main-btn-1'),// 面板2头部主要按键_1
					headingMainBtn_2 = panel3.find('.head-main-btn-2'),// 面板2头部主要按键_2
					panel_table = panel2.find('table'),	// 面板表格
					panel_table_2 = panel3.find('table'),	// 面板表格
					modalSubmitBtn = panel3.find('.panel-footer .modal-submit'), // 提交按钮
					projectIDList = [],//存储已经选择的项目id,

					mesloadBox = new MesloadBox(panel2, {warningContent: '请选择相应的工序'}),
					mesloadBox2 = new MesloadBox(panel1, {warningContent: '请选择或输入完整的基础信息'}),
					req = {
						basicsId: '',			//工艺段基础信息id 
						modelId: '',	 //产品id
						modelTypeId: '',	 //产品类型id
						segmentName: '',	//工艺名称 
						segmentNumber: '',	//工艺编号 
						segmentVersions: '',	//工艺版本号
						typeName: '',		 //产品类型名称
						modelGenre: '',		//产品型号
						qualityRate: '',		//优率
						segmentPolarity:"", //极性
						creationStaff: '',		//创建人员
						creationStaffid: '',		//创建人员id
						segmentDescribe: ''	//备注描述 y
					}


					panel2.find("tbody").empty()
					panel_table_2.find("tbody").empty()

					req.creationStaff= USERNAME
					req.creationStaffid= USERID

					// 主表格1添加内容，基础信息部分
					mesHorizontalTableAddData(panel1.find('table'), null, {
						thead: '工艺段名称/工艺段编号/工艺段版本/所属产品类型/产品型号/极性/备注',
						tableWitch: '10%/10%/10%',
						viewColGroup: 3,
						importStaticData: (tbodyTd, length) => {
							let inputHtml,
									currentproductTypeID,
									currentproductType
							for (let i = 0, len = length; i < len; i++){
								switch (i) {
									case 0: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择工艺段(必填)" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
											tbodyTd.eq(i).find('input').val(copyCraftSegment[0].craft_segment_name)	//将工艺名称写入输入框
											tbodyTd.eq(i + 1).html(copyCraftSegment[0].craft_segment_number)						//将工艺编号写入下一格

											req.basicsId =copyCraftSegment[0].craft_segment_basics_id;		//获取选择的工艺段id
											req.segmentName = copyCraftSegment[0].craft_segment_name;		//获取选择的工艺段名称
											req.segmentNumber = copyCraftSegment[0].craft_segment_number;		//获取选择的工艺段编号
										}
										
										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											let promise = new Promise(function (resolve, reject) {
												selectCraftSegmentAddData2(resolve)
											});
											promise.then(function (resolve) {
												tbodyTd.eq(i).find('input').val(resolve.craftName)	//将工艺名称写入输入框
												tbodyTd.eq(i + 1).html(resolve.craftNumber)						//将工艺编号写入下一格
												req.basicsId = resolve.craftId;		//获取选择的工艺id
												req.segmentName = resolve.craftName;		//获取选择的工艺名称
												req.segmentNumber = resolve.craftNumber;		//获取选择的工艺编号

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
										let term = `
											<div class="input-group input-group-sm">
												<input type="text" class="table-input" placeholder=""  />
												<div class="input-group-btn">
														<button type="button" class="btn btn-primary">
																		<i class="fa fa-search"></i>
														</button>
												</div>
											</div>
										`
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(term)
										let  target = tbodyTd.eq(i).find("input")
										mesPopover = new MesPopover(target, { content: "请输入正确的版本号"});

										if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
											tbodyTd.eq(i).find('input').val(copyCraftSegment[0].craft_segment_versions)	//将工艺名称写入输入框
											req.segmentVersions = copyCraftSegment[0].craft_segment_versions

											$.ajax({
												type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
												url: queryCraftSegmentVersionsUrl,
												data:{
													type: 'isExist',
													craftSegmentBasicsId:req.basicsId,
													versionsNumber:req.segmentVersions,
												} ,
												success:function(result){
													if(result.status===0){
														mesPopover.hide()
													}else{
														mesPopover.show()
														// target.focus()
													}
												}
											})
										}

										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											req.segmentVersions = tbodyTd.eq(i).find('input').val()
											$.ajax({
												type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
												url: queryCraftSegmentVersionsUrl,
												data:{
													type: 'isExist',
													craftSegmentBasicsId:req.basicsId,
													versionsNumber:req.segmentVersions,
												} ,
												success:function(result){
													if(result.status===0){
														mesPopover.hide()
													}else{
														mesPopover.show()
														target.focus()
														return  false
													}
												}
											})

										})


										tbodyTd.eq(i).find(".input-group-btn").off('click').on('click',(event)=>{
											checkHistory(queryCraftSegmentVersionsUrl,{
												type: 'history',
												// craftBasicsId:"a9d10ec22635413e827e6fea6cb3fedb",
												craftSegmentBasicsId:req.basicsId,
												headNum:1
											})
										})
									}
										break;
									case 3: {
										inputHtml = `<select class="form-control table-input input-sm product-type-option"></select>`
										let selectHtml = `<select class="form-control table-input input-sm gener-type-option"></select>`;
										tbodyTd.eq(i).html(inputHtml)
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i+1).addClass('table-input-td')
										let productTypeOption = tbodyTd.eq(i).find('.product-type-option') // 类型选项
										createProductTypeSelect(productTypeOption);

										if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
											let valName = `${copyCraftSegment[0].product_model_type_id},${copyCraftSegment[0].product_model_type_name}`
											productTypeOption.val(valName)
											req.typeName = copyCraftSegment[0].product_model_type_name
											req.modelTypeId =copyCraftSegment[0].product_model_type_id
											req.modelId =  copyCraftSegment[0].product_model_id
										}

										productTypeOption.off('change').on('change',function(){
											req.modelGenre =""
											req.modelId = ""
											tbodyTd.eq(i+1).html(selectHtml)
											tbodyTd.eq(i+1).find("select").empty()
											tbodyTd.eq(i+1).find("select").html(`<option value="">请选择型号</option>`);
											currentproductType = $(this).val()
											currentproductType=currentproductType.split(",")
											currentproductTypeID=currentproductType[0]
											req.typeName=currentproductType[1]
											req.modelTypeId = currentproductTypeID
		
											$.ajax({
												type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
												url: queryProductTypeAboutModelUrl,
												data:{
													type: 'precise',
													status:0,
													productTypeId:currentproductTypeID
												} ,
												success:function(result){
													if(result.status===0){
														let map = result.map, // 映射
														dataList = map.productType ,// 主要数据列表
														tempdata=tbodyTd.eq(i+1).find("select")
														for (let i = 0, len = dataList.length; i < len; i++) {
															let optionStr = `<option value="${dataList[i].product_model_genre},${dataList[i].product_model_id}">${dataList[i].product_model_genre}</option>`;
															tempdata.append(optionStr);
														};
														tempdata.append(tempdata)
														tempdata.off('change').on('change', (event) => {
															req.modelGenre = tbodyTd.eq(i+1).find('select').val().split(",")[0]
															req.modelId =  tbodyTd.eq(i+1).find('select').val().split(",")[1]
														})
													}
												}
											})
										});


									}
										break;
									case 4: { //产品型号
										if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
											inputHtml = `<input type="text" class="table-input" placeholder="" autocomplete="on" />`;
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											tbodyTd.eq(i).find('input').val(copyCraftSegment[0].product_model_genre).attr("disabled","disabled")
											req.modelGenre = copyCraftSegment[0].product_model_genre
										}

										tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
											req.modelGenre = tbodyTd.eq(i).find('select').val()
										})
									}
										break;

									case 5: {
										tempStr = `
													<select class="form-control table-input input-sm">
															<option value="正极">正极</option>
															<option value="负极">负极</option>
													</select>
											`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(tempStr)

										if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
											tbodyTd.eq(i).find('select').val(copyCraftSegment[0].craft_segment_polarity)
											req.segmentPolarity = copyCraftSegment[0].craft_segment_polarity
										}


										req.segmentPolarity= tbodyTd.eq(i).find('select').val()
										tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
											req.segmentPolarity = tbodyTd.eq(i).find('select').val()
										})
									}
										break;


									case 6: {
										inputHtml = `<input type="text" class="table-input" placeholder=""  />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
											tbodyTd.eq(i).find('input').val(copyCraftSegment[0].craft_segment_describe)
											req.segmentDescribe = copyCraftSegment[0].craft_segment_describe
										}
										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											req.segmentDescribe = tbodyTd.eq(i).find('input').val()
										})
									}
										break;

									default:
										break;
								}
							}


						}

					});

					// 复制到模板 添加工序
					if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
						let copySegmentWorkstageList = copyCraftSegment[0].segmentWorkstageList,
						html=""

						for(let i=0;i<copySegmentWorkstageList.length;i++){
							let workstageId= copySegmentWorkstageList[i].workstage.workstage_id
							traverseListPush(projectIDList, workstageId)
							html+=`
									<tr>
									<td data="${copySegmentWorkstageList[i].workstage.workstage_id}" qualityRate="${copySegmentWorkstageList[i].workstage.workstage_quality_rate}">${i+1}</td>
									<td>${copySegmentWorkstageList[i].workstage.workstage_name}</td>
									<td>${copySegmentWorkstageList[i].workstage.workstage_number}</td>
									<td>${copySegmentWorkstageList[i].workstage.workstage_polarity}</td>
									<td>${copySegmentWorkstageList[i].workstage.workstage_versions}</td>
									<td>${copySegmentWorkstageList[i].workstage.product_model_type_name}</td>
									<td>${copySegmentWorkstageList[i].workstage.product_model_genre}</td>
									<td class="table-input-td">
											<a class="table-link " href="javascript:;" data-toggle-btn="up"><i class="fa fa-arrow-up"></i>上移</a>
											<a class="table-link " href="javascript:;" data-toggle-btn="down""><i class="fa fa-arrow-down"></i>下移</a>
											<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
									</td>
							</tr>
							`
						}
						panel_table.find('tbody').append(html)
						
					}

					// 复制到模板 添加事项说明

					if(copyCraftSegment!==undefined&&copyCraftSegment!==""&&copyCraftSegment!==null){
						if(copyCraftSegment[0].processDescribles){
							let copyProcessDescribles= copyCraftSegment[0].processDescribles,
							html=""
							for(let i=0;i<copyProcessDescribles.length;i++){
								html+=`
										<tr>
											<td class="table-input-td"><input type="text" class="table-input" value="${copyProcessDescribles[i].order}"  /></td>
											<td class="table-input-td"><input type="text" class="table-input" value="${copyProcessDescribles[i].proceeding}" /></td>
											<td class="table-input-td"><input type="text" class="table-input" value="${copyProcessDescribles[i].explain}"  /></td>
											<td class="table-input-td">
													<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
											</td>
										</tr>
								`
							}
							panel_table_2.find('tbody').append(html)
						}else{
						}
					
					
						
					}
					
					
					

					// 添加按钮点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						event.stopPropagation()
						event.preventDefault()

						promise = new Promise(function (resolve, reject) {
							selectWorkStageAddData(resolve,projectIDList)

						});
						promise.then(function (resolveData) {
							if (traverseListPush2(projectIDList, resolveData.craftId)) {	//判断是否选择
								let warningNotice = new MesloadBox($('body'), {warningContent:'您已经选择该设备，请重新选择'})
								warningNotice.warningShow()
								return;
							}
							traverseListPush(projectIDList, resolveData.craftId)
							// submithData2.devicesId = resolveData.devicesId

							var temStr = `
							<tr>
									<td data="${resolveData.craftId}" qualityRate="${resolveData.qualityRate}"></td>
									<td>${resolveData.craftName}</td>
									<td>${resolveData.craftNumber}</td>
									<td>${resolveData.craftSementPolarity}</td>
									<td>${resolveData.craftSementVersions}</td>
									<td>${resolveData.craftTypeName}</td>
									<td>${resolveData.craftGenre}</td>
									<td class="table-input-td">
											<a class="table-link " href="javascript:;" data-toggle-btn="up"><i class="fa fa-arrow-up"></i>上移</a>
											<a class="table-link " href="javascript:;" data-toggle-btn="down""><i class="fa fa-arrow-down"></i>下移</a>
											<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
									</td>
							</tr>
						`;
						// <a class="table-link" href="javascript:;" data-toggle-modal-target="#viewDetail"><i class="fa fa-tasks fa-fw"></i>查看详情</a>

						panel_table.find('tbody').append(temStr)
						let tr = panel_table.find('tbody tr');
						for(let i = 0;i<tr.length;i++){
							// panel_table.find('tbody').append(temStr)
							panel_table.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
							;
						}
						})

						


					})

					// 添加按钮2点击事件
					headingMainBtn_2.off('click').on('click', (event) => {
						event.stopPropagation()
						event.preventDefault()
							var temStr = `
							<tr>
									<td class="table-input-td"><input type="text" class="table-input sm" placeholder="" autocomplete="on" /></td>
									<td class="table-input-td"><input type="text" class="table-input sm" placeholder="" autocomplete="on" /></td>
									<td class="table-input-td"><input type="text" class="table-input" placeholder="" autocomplete="on" /></td>
									<td class="table-input-td">
											<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
									</td>
							</tr>
						`;

						panel_table_2.find('tbody').append(temStr)
						let tr = panel_table_2.find('tbody tr');
						for(let i = 0;i<tr.length;i++){
							// panel_table.find('tbody').append(temStr)
							panel_table_2.find('tbody').find('tr:eq('+i+') td:first input').val(i+1);
							;
						}

					})

					// 表格2操作按钮点击事件
					panelList.off('click').on('click', 'tr td a', function(event) {
						let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn;// 按钮自带的data数据
						let tr = panel_table.find('tbody tr');
						let tr_2 = panel_table_2.find('tbody tr');
						switch (dataContent) {
							case "delete":{
								$(this).closest('tr').remove();
								let thiscraftId = $(this).closest('tr').find('td:first').attr("data")
								traverseListDelete(projectIDList, thiscraftId);
							}
								break;
							case "down":{
								let thisTr=$(this).closest('tr');
								if(thisTr.index()!=tr.length-1){
									thisTr.fadeOut().fadeIn();
									thisTr.next().after(thisTr);
									}
							}
								break;
							case "up":{
								let thisTr=$(this).closest('tr');  //
								if(thisTr.index()!=0){
									thisTr.fadeOut().fadeIn();
									thisTr.prev().before(thisTr);
								}
							}
								break;
						}

						for(let i = 0;i<tr.length;i++){
							panel_table.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
						}
						for(let i = 0;i<tr_2.length;i++){
							panel_table_2.find('tbody').find('tr:eq('+i+') td:first input').val(i+1);
						}
					});


				


					//提交按钮单击事件
					modalSubmitBtn.off('click').on('click', (event) => {
						let $tr = panel_table.find('tbody tr'),
						    $tr_2 = panel_table_2.find('tbody tr'),
								idList=[],
								qualityRate=1,
								processDescrible=[]

						for (let i = 0, len = $tr.length; i < len; i++){	//遍历行
							let
							craftId = $tr.eq(i).find('td:first').attr("data")
							rate = $tr.eq(i).find('td:first').attr("qualityRate")
							// rate = parseFloat(rate)
							rate/=100
							idList.push(craftId)
							qualityRate*=rate
						}
					
						 qualityRate*=100
						var xsd=qualityRate.toString().split(".");
						if(xsd.length==1){
							qualityRate=qualityRate.toString()+".00";
						}
						if(xsd.length>1){
							if(xsd[1].length<2){
								qualityRate=qualityRate.toString()+"0";
							}else if(xsd[1].length>2){
								qualityRate=qualityRate.toFixed(2)
							}
						}
						req.qualityRate = qualityRate

						for(let i = 0;i<$tr_2.length;i++){
							let $td = $tr_2.eq(i).find('td'),
							submithData2 = {
								order:"",
								name: '',			//项目名称
								value: ''	//

							}
							for (let i = 0, len = $td.length - 1; i < len; i++) {	//遍历列
								switch (i) {
									case 0: {
										submithData2.order = $td.eq(i).find('input').val().replace(/\s/g, "");
										break;
									}
									case 1: {
										submithData2.name = $td.eq(i).find('input').val().replace(/\s/g, "");
										break;
									}
									case 2: {
										submithData2.value = $td.eq(i).find('input').val().replace(/\s/g, "");
										break;
									}
								}
							}
							// 拼成字符串
							let tempStr = `{"order":"${submithData2.order}","proceeding":"${submithData2.name}","explain":"${submithData2.value}"}`;
							processDescrible[i] = tempStr
						}
						let tempdata11 = processDescrible.toString();
						let tempdata22

						if(tempdata11!== "" ){
							tempdata22 =`[${tempdata11}]`;
						}
					

						if(req.segmentName ==="" || req.segmentVersions==="" || req.typeName ==="" || req.modelGenre===""){
							mesloadBox2.warningShow();
							return false
						}

						
						if(idList.length === 0){
							mesloadBox.warningShow();
							return false
						}

						if (true
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
									type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
									url: saveCraftSegmentUrl,
									data: {
										basicsId:req.basicsId,			//工艺基础信息id y
										modelId: req.modelId,	 //产品id
										modelTypeId: req.modelTypeId,	 //产品类型id
										segmentName: req.segmentName,	//工艺名称 y
										segmentNumber: req.segmentNumber,	//工艺编号 y
										segmentVersions: req.segmentVersions,	//工艺版本号
										typeName:req.typeName,		 //产品类型名称
										modelGenre:req.modelGenre,		//产品型号
										qualityRate: req.qualityRate,		//优率
										segmentPolarity:req.segmentPolarity,		//是/否公开版 y
										creationStaff: req.creationStaff,		//创建人员
										creationStaffid: req.creationStaffid,		//创建人员
										segmentDescribe:req.segmentDescribe,		//备注描述 y
										workstageIds:idList,
										// workstageIds:["0ecc26768be54956a2d8350cb1fd994D","0ecc26768be54956a2d8350cb1fd995E"],
										processDescribleStrs:tempdata22
									},
									success: function (result, status, xhr) {
										if (result.status === 0) {
											swallSuccess()	//操作成功提示并刷新页面
										}else if(result.status !== 0) {
											let msg = result.msg
											if(msg!==null){
												swallFail2(msg)
											}else{
												swallError();	//格式不正确
											}
										
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
			case '#craftSegmentDetail':	//工艺段详情
				(function () {
					let activeSwiper = $('#craftSegmentDetail'), // 右侧外部swiper
					activeSubSwiper = $('#craftSegmentDetailInerSwiper'), // 右侧内部swiper
					// activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
					panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
					panelTbody = panelList.find('table tbody'),	//面包表格tbody
					paginationContainer = panelList.find('.pagination'),		// 分页ul标签
					activePanelHeading = panelList.find('.panel-heading'), // 面板头部
					headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工序与工序参数关系
					ProductTypeOption = activePanelHeading.find('.product-type-option'), // 类型选
					polarityOption = activePanelHeading.find('.polarity-option'), // 产线

					fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
					statusTypeOption = activePanelHeading.find('.status-type-option'),// 类型选项
					mesloadBox = new MesloadBox(panelList, {warningContent: '没有此类信息，请重新选择或输入'})

					createProductTypeSelect(ProductTypeOption)

					// 主表格1添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
									mesVerticalTableAddData(panelList, {
										thead: {
											theadContent: '序号/工艺段名称/工艺段编号/极性/工艺版本/所属产品类型/产品型号/优率/使用状态/操作',
											theadWidth: '4%/10%/10%/10%/10%/10%/10%/8%/8%/10%'
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
												'<td class="table-input-td"><a class="table-link" href="javascript:;"data-toggle-modal-target="#moreCraftSegmentDetail"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;"data-toggle-modal-target="#copy"><i class="fa fa-tasks fa-fw"></i>添加到模板</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.craftSegment, // 主要数据列表
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
																tempData = dataList[currentTr.index()].craft_segment_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].craft_segment_number;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].craft_segment_polarity;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 4: {
																tempData = dataList[currentTr.index()].craft_segment_versions;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 5: {
																tempData = dataList[currentTr.index()].product_model_type_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 6: {
																tempData = dataList[currentTr.index()].product_model_genre;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 7: {
																tempData = dataList[currentTr.index()].craft_segment_quality_rate;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 8: {
																let  craftBasicsIds=[]

																tempStr = `
																<select class="form-control table-input input-sm">
																<option value="0">启用</option>
																<option value="1">弃用</option>
																</select>
																`;
																tempData = dataList[currentTr.index()].craft_segment_status;
																currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
																let	target = currentTr.children().eq(i).find('select');
																target.val(tempData);

																target.off('change').on('change', function () {
																let planStatus = $(this).val();
																if(planStatus == 0 ){
																planStatus = 'recover'
																}else {
																planStatus = 'deprecated'
																}
																craftBasicsIds.push(dataList[currentTr.index()].craft_segment_id);
																swal({
																	title: '您确定要更改此状态吗？',
																	type: 'question',
																	showCancelButton: true,
																	confirmButtonText: '确定',
																	cancelButtonText: '取消'
																}).then(function () {
																	$.ajax({
																		type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																		url:modifyCraftSegmentVersionsStatusUrl,
																		data: {
																		type:planStatus,
																		craftSegmentVersionsIds:craftBasicsIds
																		},
																		success: function (result, status, xhr) {
																			if (result.status === 0) {
																				let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																				swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																			}
																			else if(result.status === 4){
																				repeatFail()
																			}
																			
																			else {
																				swallFail()	//操作失败
																			}
																		},
																	})
																},
																	(dismiss) => {
																		target.val(dataList[currentTr.index()].craft_segment_status);
																	})
																})
																}


																break;
															case 9:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																	craftID=[]
																		craftID.push(dataList[currentTr.index()].craft_segment_id);
																	switch (dataContent) {
																		case '#moreCraftSegmentDetail': {	//详情
																			let activeSwiper = $('#moreCraftSegmentDetail'), // 右侧外部swiper
																			// activeSubSwiper = $('#craftMangeInerSwiper'), // 右侧内部swiper
																			panelList = activeSwiper.find('.panel'), // 内部swiper的面板集合
																			panel1 = panelList.eq(0),
																			panel2 = panelList.eq(1),
																			panel3 = panelList.eq(2),
																			paginationContainer_1 = panel2.find('.panel-footer'),		// 分页ul标签
																			paginationContainer_2 = panel3.find('.panel-footer'),		// 分页ul标签
																			btn_1=panel1.find(".head-main-btn-1"),
																			// activePanelHeading1 = panel2.find('.panel-heading'), // 面板2头部
																			// headingMainBtn_1 = activePanelHeading1.find('.head-main-btn-1')// 面板2头部主要按键_1
																			panel_table = panel3.find('table tbody')	// 面板表格
																			paginationContainer_1.hide()
																			paginationContainer_2.hide()
																			panel3.hide()
																			panel_table.empty()
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																							let processDescriblesDetail= result.map.craftSegmentList[0].processDescribles
																							// 表格1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '工艺段名称/工艺段编号/工艺段版本/所属产品类型/产品型号/优率/极性/录入时间/录入人员/备注',
																								tableWitch: '10%/10%/10%',
																								viewColGroup: 3,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																									dataList = map.craftSegmentList, // 主要数据列表
																									tempData = null; // 表格td内的临时数据

																									let inputHtml,
																										currentproductTypeID


																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].craft_segment_name;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 1: {
																												tempData = dataList[0].craft_segment_number;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].craft_segment_versions;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].product_model_type_name;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 4: {
																												tempData = dataList[0].product_model_genre;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 5: {
																												tempData = dataList[0].craft_segment_quality_rate;
																												// tempData.toFixed(2)
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 6: {
																												tempData = dataList[0].craft_segment_polarity;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 7: {
																												tempData = dataList[0].craft_segment_creation_time;
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																											}
																												break;
																											case 8: {
																												tempData = dataList[0].craft_segment_creation_staff;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 9: {
																												tempData = dataList[0].craft_segment_describe;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})
																							// 表格2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '序号/工序名称/工序编号/极性/工序版本/所属产品类型/产品型号',
																									theadWidth: '8%/12%/12%/12%/12%/12%/12%'
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
																									// '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#viewDetail"><i class="fa fa-tasks fa-fw"></i>查看详情</a><a class="table-link" href="javascript:;" data-toggle-btn="#up"><i class="fa fa-arrow-up"></i>上移</a><a class="table-link" href="javascript:;" data-toggle-btn="#down"><i class="fa fa-arrow-down"></i>下移</a><a class="table-link" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a></td>'

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.craftSegmentList[0].segmentWorkstageList,	 // 主要数据列表

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
																														tempData = dataList[currentTr.index()].workstage.workstage_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[currentTr.index()].workstage.workstage_number;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[currentTr.index()].workstage.workstage_polarity;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList[currentTr.index()].workstage.workstage_versions;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = dataList[currentTr.index()].workstage.product_model_type_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 6: {
																														tempData = dataList[currentTr.index()].workstage.product_model_genre;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 7: {

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
																									totalRow:result.map.craftSegmentList[0].segmentWorkstageList.length , // 总行数
																									displayRow: result.map.craftSegmentList[0].segmentWorkstageList.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})
																							if(processDescriblesDetail&&processDescriblesDetail.length !== 0){
																								panel3.show()
																								mesVerticalTableAddData(panel3, {
																									thead: {
																										theadContent: '序号/事项/说明',
																										theadWidth: '8%/17%/70%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																										],
																										// '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#viewDetail"><i class="fa fa-tasks fa-fw"></i>查看详情</a><a class="table-link" href="javascript:;" data-toggle-btn="#up"><i class="fa fa-arrow-up"></i>上移</a><a class="table-link" href="javascript:;" data-toggle-btn="#down"><i class="fa fa-arrow-down"></i>下移</a><a class="table-link" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a></td>'

																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射
																												dataList = map.craftSegmentList[0].processDescribles,	 // 主要数据列表

																												tempData = null; // 表格td内的临时数据

																											for (let i = 0, len = dataList.length; i < len; i++) {
																												tbodyTarget.append('<tr></tr>'); // 添加行
																												let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																												for (let j = 0, len = html.length; j < len; j++) {
																													currentTr.append(html[j]); // 添加表格内的HTML
																													switch (j) {
																														case 0: {
																															tempData = dataList[currentTr.index()].order
																															currentTr.children().eq(j).html(tempData)
																														}
																															break;
																														case 1: {
																															tempData = dataList[currentTr.index()].proceeding;
																															currentTr.children().eq(j).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].explain;
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
																										totalRow:result.map.craftSegmentList[0].processDescribles.length , // 总行数
																										displayRow: result.map.craftSegmentList[0].processDescribles.length // 显示行数
																									},

																									ajax: {
																										url: url,
																										data: data
																									}
																								})
																							}
																							// 表格3

																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}

																			// 导航栏点击时运行数据加载"
																			addTableData(queryCraftSegmentParticularsUrl, {
																				// status:0,
																				// craftSegmentVersionsIds:["06cf5f3932cb4aad97dffd07b228a531"]
																				craftSegmentVersionsIds:craftID
																				// headNum: 1
																			});
																			break;
																		}
																		case '#copy' :{
																			$.ajax({
																				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																				url: queryCraftSegmentParticularsUrl,
																				data: {
																					craftSegmentVersionsIds:craftID
																				},
																				success: function (result) {
																					if (result.status === 0) {
																						copyCraftSegment =result.map.craftSegmentList// 主要数据列表
																					}
																				}

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
											totalRow: result.map.line, // 总行数
											displayRow: result.map.craftSegment.length // 显示行数
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
					addTableData(queryCraftSegmentOutlineUrl, {
						type: 'vague',
						status:0,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, ""),
								status=statusTypeOption.val(),
						 		currentproductTypeID = ProductTypeOption.val().split(",")[0],
						    name = polarityOption.val();

						event.stopPropagation() // 禁止向上冒泡
						addTableData(queryCraftSegmentOutlineUrl, {
							keyword: val,
							status:status,
							productTypeId: currentproductTypeID,
							headNum: 1,
							polarity: name
						});

					});

					statusTypeOption.off("change").off("change").on("change",function(){
						let val = fuzzySearchGroup.closest('.input-group').find('input').val().replace(/\s/g, ""),
						status=statusTypeOption.val(),
						name = polarityOption.val();
						let currentproductTypeID =ProductTypeOption.val();
						addTableData(queryCraftSegmentOutlineUrl, {
							productTypeId: currentproductTypeID,
							keyword: val,
							status:status,
							headNum: 1,
							polarity: name
						});
					})

					ProductTypeOption.off("change").on("change",function(){
						let val = fuzzySearchGroup.closest('.input-group').find('input').val().replace(/\s/g, ""),
								status=statusTypeOption.val(),
								name = polarityOption.val();
            let currentproductTypeID = $(this).val().split(",")[0];
            addTableData(queryCraftSegmentOutlineUrl, {
							productTypeId: currentproductTypeID,
							keyword: val,
							status:status,
							headNum: 1,
							polarity: name
            });
					})
					
          polarityOption.off("change").on("change",function(){
						let val = fuzzySearchGroup.closest('.input-group').find('input').val().replace(/\s/g, ""),
								status=statusTypeOption.val(),
								name = polarityOption.val();
						let currentproductTypeID = $(this).val().split(",")[0];
						
            addTableData(queryCraftSegmentOutlineUrl, {
							productTypeId: currentproductTypeID,
							keyword: val,
							status:status,
							headNum: 1,
							polarity: name
            });
          })


			}())
				break;
			case '#productCraftManage':	//新增工艺管理
				(function(){
					let activeSwiper = $('#craftMange'), // 右侧外部swiper
					activeSubSwiper = $('#craftMangeInerSwiper'), // 右侧内部swiper
					panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
					panel1 = panelList.eq(0),
					panel2 = panelList.eq(1),
					panel3 = panelList.eq(2),
					activePanelHeading1 = panel2.find('.panel-heading'), // 面板2头部
					headingMainBtn_1 = activePanelHeading1.find('.head-main-btn-1'),// 面板2头部主要按键_1
					headingMainBtn_2 = panel3.find('.head-main-btn-2'),// 面板2头部主要按键_1
					panel_table = panel2.find('table'),	// 面板表格
					panel_table_2 = panel3.find('table'),	// 面板表格
					modalSubmitBtn = panel3.find('.panel-footer .modal-submit'), // 提交按钮
					mesloadBox = new MesloadBox(panel2, {warningContent: '请选择相应的工艺段'}),
					mesloadBox2 = new MesloadBox(panel1, {warningContent: '请选择或输入完整的基础信息'}),
					
					projectIDList = [],//存储已经选择的项目id
					req = {
						craftBasicsId: '',			//工艺基础信息id y
						modelId: '',	 //产品id
						modelTypeId: '',	 //产品类型id
						lineId: '',		//产线id
						craftName: '',	//工艺名称 y
						craftNumber: '',	//工艺编号 y
						craftVersions: '',	//工艺版本号
						modelTypeName: '',		 //产品类型名称
						modelGenre: '',		//产品型号
						qualityRate: '',		//优率
						craftOpen: '',		//是/否公开版 y
						lineName: '',		//产线名称 y
						creationStaff: '',		//创建人员
						creationStaffId: '',		//创建人员
						describe: '',		//备注描述 y
					}


					panel2.find("tbody").empty()
					panel_table_2.find("tbody").empty()

					req.creationStaff= USERNAME
					req.creationStaffId= USERID



					// 主表格1添加内容，基础信息部分
					mesHorizontalTableAddData(panel1.find('table'), null, {
						thead: '工艺名称/工艺编号/工艺版本/所属产品类型/产品型号/是否为公版/工艺所属产线/备注',
						tableWitch: '10%/10%/10%',
						viewColGroup: 3,
						importStaticData: (tbodyTd, length) => {
							let inputHtml,
									currentproductTypeID,
									currentproductType
							for (let i = 0, len = length; i < len; i++){
								switch (i) {
									case 0: {
										inputHtml = `<input type="text" class="table-input" placeholder="点此选择工艺(必填)" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)

										if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
											tbodyTd.eq(i).find('input').val(copyCraft[0].craft_name)	//将工艺名称写入输入框
											tbodyTd.eq(i + 1).html(copyCraft[0].craft_number)						//将工艺编号写入下一格

											req.craftBasicsId =copyCraft[0].craft_basics_id;		//获取选择的工艺id
											req.craftName = copyCraft[0].craft_name;		//获取选择的工艺名称
											req.craftNumber = copyCraft[0].craft_number;		//获取选择的工艺编号
											console.log(req.craftName)
										}

										tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
											let promise = new Promise(function (resolve, reject) {
												selectCraftAddData2(resolve)
											});
											promise.then(function (resolve) {
												tbodyTd.eq(i).find('input').val(resolve.craftName)	//将工艺名称写入输入框
												tbodyTd.eq(i + 1).html(resolve.craftNumber)						//将工艺编号写入下一格
												req.craftBasicsId = resolve.craftId;		//获取选择的工艺id
												req.craftName = resolve.craftName;		//获取选择的工艺名称
												req.craftNumber = resolve.craftNumber;		//获取选择的工艺编号
											
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
										let term = `
											<div class="input-group input-group-sm">
                        <input type="text" class="table-input" placeholder=""  />
                        <div class="input-group-btn">
                            <button type="button" class="btn btn-primary">
                                    <i class="fa fa-search"></i>
                            </button>
                        </div>
											</div>
                    `
										tbodyTd.eq(i).addClass('table-input-td')
                    tbodyTd.eq(i).html(term)
                    let  target = tbodyTd.eq(i).find("input")
										mesPopover = new MesPopover(target, { content: "请输入正确的版本号"});
										
										if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
											tbodyTd.eq(i).find('input').val(copyCraft[0].craft_versions)	//将工艺名称写入输入框
											req.craftVersions = copyCraft[0].craft_versions

											$.ajax({
												type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
												url: queryCraftVersionsUrl,
												data:{
													type: 'isExist',
													craftBasicsId:req.craftBasicsId,
													versionsNumber:req.craftVersions,
												} ,
												success:function(result){
													if(result.status===0){
                            mesPopover.hide()
													}else{
                            mesPopover.show()
                           
                          }
												}
											})
										}


										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
                      req.craftVersions = tbodyTd.eq(i).find('input').val()
                    	$.ajax({
												type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
												url: queryCraftVersionsUrl,
												data:{
													type: 'isExist',
													craftBasicsId:req.craftBasicsId,
													// craftBasicsId:"3ae4bc19966b4164a093a3b35c5cf82c",
													versionsNumber:req.craftVersions,
													// versionsNumber:"天蓝BB34-B2-7"
												} ,
												success:function(result){
													if(result.status===0){
                            mesPopover.hide()
													}else{
                            mesPopover.show()
                            target.focus()
                            return  false
                          }
												}
											})

                    })


                    tbodyTd.eq(i).find(".input-group-btn").off('click').on('click',(event)=>{
                      checkHistory2(queryCraftVersionsUrl,{
                        type: 'history',
                        // craftBasicsId:"a9d10ec22635413e827e6fea6cb3fedb",
												craftBasicsId:req.craftBasicsId,
												// versionsNumber:req.craftVersions,
                        headNum:1
                      })
                    })
									}
										break;
									case 3: {
										inputHtml = `<select class="form-control table-input input-sm product-type-option"></select>`
										let selectHtml = `<select class="form-control table-input input-sm gener-type-option"></select>`;
										tbodyTd.eq(i).html(inputHtml)
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i+1).addClass('table-input-td')
										let productTypeOption = tbodyTd.eq(i).find('.product-type-option') // 类型选项
										createProductTypeSelect(productTypeOption);

										if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
											let valName = `${copyCraft[0].product_model_type_id},${copyCraft[0].product_model_type_name}`
											productTypeOption.val(valName)
											req.modelTypeName = copyCraft[0].product_model_type_name
											req.modelTypeId =copyCraft[0].product_model_type_id
											req.modelId =  copyCraft[0].product_model_id
											req.modelGenre = copyCraft[0].product_model_genre
											tbodyTd.eq(i+1).html(`<input type="text" class="table-input" >`)// 输入框只读
											tbodyTd.eq(i+1).find('input').val(copyCraft[0].product_model_genre).attr("disabled","disabled")
										}

										productTypeOption.off('change').on('change',function(){
											req.modelGenre =""
											req.modelId = ""
											tbodyTd.eq(i+1).html(selectHtml)
											tbodyTd.eq(i+1).find("select").empty()
											tbodyTd.eq(i+1).find("select").append(`<option value="">请选择型号</option>`);
											currentproductType = $(this).val()
											currentproductType=currentproductType.split(",")
											currentproductTypeID=currentproductType[0]
											req.modelTypeName=currentproductType[1]
											req.modelTypeId = currentproductTypeID
										
											$.ajax({
												type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
												url: queryProductTypeAboutModelUrl,
												data:{
													type: 'precise',
													status:0,
													productTypeId:currentproductTypeID
												} ,
												success:function(result){
													if(result.status===0){
														let map = result.map, // 映射
														dataList = map.productType ,// 主要数据列表
														tempdata=tbodyTd.eq(i+1).find("select")
														for (let i = 0, len = dataList.length; i < len; i++) {
															let optionStr = `<option value="${dataList[i].product_model_genre},${dataList[i].product_model_id}">${dataList[i].product_model_genre}</option>`;
															tempdata.append(optionStr);
														};
														tempdata.append(tempdata)
														tempdata.off('change').on('change', (event) => {
                              req.modelGenre = tbodyTd.eq(i+1).find('select').val().split(",")[0]
															req.modelId =  tbodyTd.eq(i+1).find('select').val().split(",")[1]
														})
													}
												}
											})
										});
									}
										break;
									case 4: { //产品型号
									
									}
										break;
									case 5: {

										tempStr = `
													<select class="form-control table-input input-sm">
															<option value="公版">公版</option>
															<option value="私版">私版</option>
													</select>
											`;

										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(tempStr)

										if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
											tbodyTd.eq(i).find('select').val(copyCraft[0].craft_open)
											req.craftOpen = copyCraft[0].craft_open
										}

										req.craftOpen= tbodyTd.eq(i).find('select').val()
										tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
											req.craftOpen = tbodyTd.eq(i).find('select').val()
										})
									}
										break;
									case 6: {
										let line
										inputHtml = `<select class="form-control  table-input  input-sm product-lines-option"></select>`
										tbodyTd.eq(i).html(inputHtml)
										tbodyTd.eq(i).addClass('table-input-td')
										let	target = 	tbodyTd.eq(i).find('.product-lines-option');
										createProductLinesSelect(target)

										if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
											let valName = `${copyCraft[0].product_line_id},${copyCraft[0].product_line_name}`
											target.val(valName)
											req.lineName = copyCraft[0].product_line_name
											req.lineId =copyCraft[0].product_line_id
										}

										tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
											line = tbodyTd.eq(i).find('select').val()
											line=line.split(",")
											req.lineId=line[0]
											req.lineName=line[1]
										})
									}
										break;

									case 7: {
										inputHtml = `<input type="text" class="table-input" placeholder=""  />`;
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)
										
										if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
											if( copyCraft[0].craft_describe){
												tbodyTd.eq(i).find('input').val(copyCraft[0].craft_describe)
												req.describe = copyCraft[0].craft_describe
											}
										}
										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											req.describe = tbodyTd.eq(i).find('input').val()
										})
									}
										break;
									default:
										break;
								}
							}


						}

					});

					// 复制到模板 添加工艺段
					if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
						let copyCraftSegments = copyCraft[0].craftSegments,
						html=""

						for(let i=0;i<copyCraftSegments.length;i++){
							let craftSegmentId= copyCraftSegments[i].craft_segment_id
							traverseListPush(projectIDList, craftSegmentId)
							html+=`
									<tr>
									<td data="${copyCraftSegments[i].craft_segment_id}" qualityRate="${copyCraftSegments[i].craft_segment_quality_rate}">${i+1}</td>
									<td>${copyCraftSegments[i].craft_segment_name}</td>
									<td>${copyCraftSegments[i].craft_segment_number}</td>
									<td>${copyCraftSegments[i].craft_segment_polarity}</td>
									<td>${copyCraftSegments[i].craft_segment_versions}</td>
									<td>${copyCraftSegments[i].product_model_type_name}</td>
									<td>${copyCraftSegments[i].product_model_genre}</td>
									<td class="table-input-td">
											<a class="table-link " href="javascript:;" data-toggle-btn="up"><i class="fa fa-arrow-up"></i>上移</a>
											<a class="table-link " href="javascript:;" data-toggle-btn="down""><i class="fa fa-arrow-down"></i>下移</a>
											<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
									</td>
							</tr>
							`
						}
						panel_table.find('tbody').append(html)
						
					}

					// 复制到模板 添加事项说明
					if(copyCraft!==undefined&&copyCraft!==""&&copyCraft!==null){
						if(copyCraft[0].processDescribles!==null &&copyCraft[0].processDescribles!==""&&copyCraft[0].processDescribles!==undefined){
							let copyProcessDescribles= copyCraft[0].processDescribles,
							html=""
							for(let i=0;i<copyProcessDescribles.length;i++){
								html+=`
										<tr>
											<td class="table-input-td"><input type="text" class="table-input" value="${copyProcessDescribles[i].order}"  /></td>
											<td class="table-input-td"><input type="text" class="table-input" value="${copyProcessDescribles[i].proceeding}" /></td>
											<td class="table-input-td"><input type="text" class="table-input" value="${copyProcessDescribles[i].explain}"  /></td>
											<td class="table-input-td">
													<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
											</td>
										</tr>
								`
							}
							panel_table_2.find('tbody').append(html)
						}else{
						}
					
					
						
					}

					// 添加按钮点击事件
					headingMainBtn_1.off('click').on('click', (event) => {
						event.stopPropagation()
						event.preventDefault()

						promise = new Promise(function (resolve, reject) {
							selectCraftSegmentAddData(resolve,projectIDList)

					 	});
						promise.then(function (resolveData) {
							if (traverseListPush2(projectIDList, resolveData.craftId)) {	//判断是否选择
								let warningNotice = new MesloadBox($('body'), {warningContent:'您已经选择该设备，请重新选择'})
								warningNotice.warningShow()
								return;
							}
							traverseListPush(projectIDList, resolveData.craftId)

							var temStr = `
							<tr>
									<td data="${resolveData.craftId}" qualityRate="${resolveData.qualityRate}"></td>
									<td>${resolveData.craftName}</td>
									<td>${resolveData.craftNumber}</td>
									<td>${resolveData.craftSementPolarity}</td>
									<td>${resolveData.craftSementVersions}</td>
									<td>${resolveData.craftTypeName}</td>
									<td>${resolveData.craftGenre}</td>
									<td class="table-input-td">
											<a class="table-link " href="javascript:;" data-toggle-btn="up"><i class="fa fa-arrow-up"></i>上移</a>
											<a class="table-link " href="javascript:;" data-toggle-btn="down""><i class="fa fa-arrow-down"></i>下移</a>
											<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
									</td>
							</tr>
						`;
            // <a class="table-link" href="javascript:;" data-toggle-modal-target="#viewDetail"><i class="fa fa-tasks fa-fw"></i>查看详情</a>

						panel_table.find('tbody').append(temStr)
						let tr = panel_table.find('tbody tr');
						for(let i = 0;i<tr.length;i++){
							// panel_table.find('tbody').append(temStr)
							panel_table.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
							;
						}
						})
					})
					// 添加按钮2点击事件
					headingMainBtn_2.off('click').on('click', (event) => {
						event.stopPropagation()
						event.preventDefault()
							var temStr = `
							<tr>
									<td class="table-input-td"><input type="text" class="table-input sm" placeholder="" autocomplete="on" /></td>
									<td class="table-input-td"><input type="text" class="table-input sm" placeholder="" autocomplete="on" /></td>
									<td class="table-input-td"><input type="text" class="table-input" placeholder="" autocomplete="on" /></td>
									<td class="table-input-td">
											<a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a>
									</td>
							</tr>
						`;

						panel_table_2.find('tbody').append(temStr)
						let tr = panel_table_2.find('tbody tr');
						for(let i = 0;i<tr.length;i++){
							// panel_table.find('tbody').append(temStr)
							panel_table_2.find('tbody').find('tr:eq('+i+') td:first input').val(i+1);
							;
						}

					})
					// 表格2操作按钮点击事件
					panelList.off('click').on('click', 'tr td a', function(event) {
						let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn;// 按钮自带的data数据
						let tr = panel_table.find('tbody tr');
						let tr_2 = panel_table_2.find('tbody tr');
						switch (dataContent) {
							case "delete":{
								$(this).closest('tr').remove();
								let thiscraftId = $(this).closest('tr').find('td:first').attr("data")
								traverseListDelete(projectIDList, thiscraftId);

							}
								break;
							case "down":{
								let thisTr=$(this).closest('tr');
								if(thisTr.index()!=tr.length-1){
									thisTr.fadeOut().fadeIn();
									thisTr.next().after(thisTr);
									}
							}
								break;
							case "up":{
								let thisTr=$(this).closest('tr');  //
								if(thisTr.index()!=0){
									thisTr.fadeOut().fadeIn();
									thisTr.prev().before(thisTr);
								}
							}
								break;
						}

						for(let i = 0;i<tr.length;i++){
							panel_table.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
						}
						for(let i = 0;i<tr_2.length;i++){
							panel_table_2.find('tbody').find('tr:eq('+i+') td:first input').val(i+1);
						}
					});



          //提交按钮单击事件
          modalSubmitBtn.off('click').on('click', (event) => {
						console.log(req.craftName)
						console.log(1)
						console.log(req)
						let $tr = panel_table.find('tbody tr'),
								$tr_2 = panel_table_2.find('tbody tr'),
								idList=[],
								qualityRate=1,
								processDescrible=[]
						let tempdata22

            for (let i = 0, len = $tr.length; i < len; i++){	//遍历行
              let
              craftId = $tr.eq(i).find('td:first').attr("data")
							rate = $tr.eq(i).find('td:first').attr("qualityRate")
							rate/=100
              idList.push(craftId)
							qualityRate*=rate
						}

						qualityRate*=100

						var xsd=qualityRate.toString().split(".");
						if(xsd.length==1){
							qualityRate=qualityRate.toString()+".00";
						// return qualityRate;
						}
						if(xsd.length>1){
							if(xsd[1].length<2){
								qualityRate=qualityRate.toString()+"0";
							}else if(xsd[1].length>2){
								qualityRate=qualityRate.toFixed(2)
							}
							// return qualityRate;
						}
						req.qualityRate = qualityRate


						//事项说明
						if($tr_2.length!== 0){
							for(let i = 0;i<$tr_2.length;i++){
								let $td = $tr_2.eq(i).find('td'),
								submithData2 = {
									order:"",
									name: '',			//项目名称
									value: ''	//
	
								}
								for (let i = 0, len = $td.length - 1; i < len; i++) {	//遍历列
									switch (i) {
										case 0: {
											submithData2.order = $td.eq(i).find('input').val().replace(/\s/g, "");
											break;
										}
										case 1: {
											submithData2.name = $td.eq(i).find('input').val().replace(/\s/g, "");
											break;
										}
										case 2: {
											submithData2.value = $td.eq(i).find('input').val().replace(/\s/g, "");
											break;
										}
									}
								}
								// 拼成字符串
								let tempStr = `{"order":"${submithData2.order}","proceeding":"${submithData2.name}","explain":"${submithData2.value}"}`;
								processDescrible[i] = tempStr
	
							}
							let tempdata11 = processDescrible.toString();
						
							if(tempdata11!== "" ){
								tempdata22 =`[${tempdata11}]`;
							}
						}
						

						if(req.craftName ==="" || req.craftVersions==="" || req.modelTypeName ==="" || req.modelGenre==="" || req.lineName===""){
							mesloadBox2.warningShow();
							return false
						}

						if(idList.length === 0){
							mesloadBox.warningShow();
							return false
						}

            if (true
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
                  type: "POST", dataType: "json",  xhrFields: {withCredentials: true   },    crossDomain: true,
                  url: saveCraftUrl,
                  data: {
                    craftBasicsId:req.craftBasicsId,			//工艺基础信息id y
                    modelId: req.modelId,	 //产品id
                    modelTypeId: req.modelTypeId,	 //产品类型id
                    lineId: req.lineId,		//产线id
                    craftName: req.craftName,	//工艺名称 y
                    craftNumber: req.craftNumber,	//工艺编号 y
                    craftVersions: req.craftVersions,	//工艺版本号
                    modelTypeName:req.modelTypeName,		 //产品类型名称
                    modelGenre:req.modelGenre,		//产品型号
                    qualityRate: req.qualityRate,		//优率
                    craftOpen:req.craftOpen,		//是/否公开版 y
                    lineName:req.lineName,		//产线名称 y
                    creationStaff: req.creationStaff,		//创建人员
                    creationStaffId: req.creationStaffId,		//创建人员
                    describe:req.describe,		//备注描述 y
										craftSegmentIds:idList,
										// craftSegmentIds:['02c92d62be894dd3951883c1484b9b55','0ecc26768be54956a2d8350cb1fd123a'],
										processDescribleStrs:tempdata22
                  },
                  success: function (result, status, xhr) {
                    if (result.status === 0) {
                      swallSuccess()	//操作成功提示并刷新页面
                    }
                    else if(result.status !== 0) {
											let msg = result.msg
											if(msg!==null){
												swal({
													title: msg,
													type: 'question',
													allowEscapeKey: false, // 用户按esc键不退出
													allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
													showCancelButton: false, // 显示用户取消按钮
													confirmButtonText: '确定',
												})
											}else{
												swallError();	//格式不正确
											}
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
			case '#craftDetail':	//工艺详情
			 (function () {
					let activeSwiper = $('#craftDetail'), // 右侧外部swiper
					activeSubSwiper = $('#craftDetailInerSwiper'), // 右侧内部swiper
					// activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
          panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
          panelTbody = panelList.find('table tbody'),	//面包表格tbody
          paginationContainer = panelList.find('.pagination'),		// 分页ul标签
					activePanelHeading = panelList.find('.panel-heading'), // 面板头部
					headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工序与工序参数关系
					ProductTypeOption = activePanelHeading.find('.product-type-option'), // 类型选
					ProductLinesOption = activePanelHeading.find('.product-lines-option'), // 产线
					fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
          statusTypeOption = activePanelHeading.find('.status-type-option'), // 类型选项
					mesloadBox = new MesloadBox(panelList, {warningContent: '没有此类信息，请重新选择或输入'})

					createProductTypeSelect(ProductTypeOption)
					// 主表格1添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
									paginationContainer.show()	//隐藏分页按钮
									mesVerticalTableAddData(panelList, {
										thead: {
											theadContent: '序号/工艺名称/工艺编号/工艺版本/产品类型/所属产线/优率/使用状态/操作',
											theadWidth: '4%/12%/10%/10%/10%/10%/7%/7%/16%'
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
												'<td class="table-input-td"><a class="table-link" href="javascript:;"data-toggle-modal-target="#moreCraftDetail"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#BOMMangeModel"><i class="fa fa-plus"></i>BOM管理</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#copy"><i class="fa fa-plus"></i>添加到模板</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.craftList, // 主要数据列表
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
																tempData = dataList[currentTr.index()].craft_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].craft_number;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].craft_versions;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 4: {
																tempData = dataList[currentTr.index()].product_model_type_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 5: {
																tempData = dataList[currentTr.index()].product_line_name;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 6: {
																tempData = dataList[currentTr.index()].craft_quality_rate;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 7: {
                                let  craftBasicsIds=[]
                                tempStr2 = `
                                <select class="form-control table-input input-sm">
                                <option value="0">启用</option>
                                <option value="1">弃用</option>
                                </select>
                                `;
                                tempData = dataList[currentTr.index()].craft_status;
                                currentTr.children().eq(i).addClass('table-input-td').html(tempStr2);
                                let	target = currentTr.children().eq(i).find('select');
                                target.val(tempData);

                                target.off('change').on('change', function () {
                                let planStatus = $(this).val();
                                if(planStatus == 0 ){
                                 planStatus = 'recover'
                                 }else {
                                 planStatus = 'deprecated'
                                 }
                                 craftBasicsIds.push(dataList[currentTr.index()].craft_id);
                                swal({
                                  title: '您确定要更改此状态吗？',
                                  type: 'question',
                                  showCancelButton: true,
                                  confirmButtonText: '确定',
                                  cancelButtonText: '取消'
                                }).then(function () {
                                  $.ajax({
                                    type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
                                    url:modifyCraftVersionsStatusUrl,
                                    data: {
                                     type:planStatus,
                                     craftIds:craftBasicsIds
                                    },
                                    success: function (result, status, xhr) {
                                      if (result.status === 0) {
                                        let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
                                        swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
                                      }
                                      else if(result.status === 4){
																				repeatFail()
																			}
																			
																			else {
																				swallFail()	//操作失败
																			}
                                    },
                                  })
                                },
                                  (dismiss) => {
                                    target.val(dataList[currentTr.index()].craft_status);
                                  })
                                })
                                }


															  break;
															case 8:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		craftID = dataList[currentTr.index()].craft_id,
																		isPublic = dataList[currentTr.index()].craft_open;
																		let caftIdList=[]
																		caftIdList.push(craftID)
																	switch (dataContent) {
																		case '#moreCraftDetail': {	//详情
																			let activeSwiper = $('#moreCraftDetail'), // 右侧外部swiper
																			// activeSubSwiper = $('#craftMangeInerSwiper'), // 右侧内部swiper
																			panelList = activeSwiper.find('.panel'), // 内部swiper的面板集合
																			panel1 = panelList.eq(0),
                                      panel2 = panelList.eq(1),
																			panel3 = panelList.eq(2),
																			paginationContainer_1 = panel2.find('.panel-footer'),		// 分页ul标签
																			paginationContainer_2 = panel3.find('.panel-footer'),		// 分页ul标签
																			btn_1=panel1.find(".head-main-btn-1"),
																			modalCloseBtn = activeSwiper.find('.modal-header').find('.close'),
																			activePanelHeading1 = panel2.find('.panel-heading'), // 面板2头部
																			headingMainBtn_1 = activePanelHeading1.find('.head-main-btn-1'),// 面板2头部主要按键_1
																			panel_table = panel3.find('table tbody')	// 面板表格
																			paginationContainer_1.hide()
																			paginationContainer_2.hide()
																			panel3.hide()
																			panel_table.empty()

																			modalCloseBtn.off('click').on('click', (event) => {
																				// 点击弃用按钮隐藏该模态框
																				activeSwiper.modal('hide')
																				// 初始化表格
																				panel1.find('thead').empty()
																				panel1.find('tbody').empty()
																				panel2.find('thead').empty()
																				panel2.find('tbody').empty()
																				panel3.find('thead').empty()
																				panel3.find('tbody').empty()
																			})


																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																							let processDescriblesDetail= result.map.resultCraftList[0].processDescribles
																							// 表格1
																							mesHorizontalTableAddData(panel1.find('table'), null, {
																								thead: '工艺名称/工艺编号/工艺版本/所属产品类型/产品型号/优率/是否为公版/工艺所属产线/录入时间/录入人员/备注',
																								tableWitch: '10%/10%/10%',
																								viewColGroup: 3,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																									dataList = map.resultCraftList, // 主要数据列表
																									tempData = null; // 表格td内的临时数据

																									let inputHtml,
																										currentproductTypeID


																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].craft_name;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 1: {
																												tempData = dataList[0].craft_number;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].craft_versions;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].product_model_type_name;
																												tbodyTd.eq(i).html(tempData)

																											}
																												break;
																											case 4: {
																												tempData = dataList[0].product_model_genre;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 5: {
                                                        tempData = dataList[0].craft_quality_rate;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 6: {
																												tempData = dataList[0].craft_open;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 7: {
																												tempData = dataList[0].product_line_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 8: {
																												tempData = dataList[0].craft_creation_time;
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																											}
																												break;
																											case 9: {
																												tempData = dataList[0].craft_creation_staff;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 10: {
																												tempData = dataList[0].craft_describe;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;

																											default:
																												break;
																										}

																								}
																							})
																							// 表格2
																							mesVerticalTableAddData(panel2, {
																								thead: {
																									theadContent: '序号/工艺段名称/工艺段编号/极性/工艺段版本/所属产品类型/产品型号/优率',
																									theadWidth: '8%/12%/12%/12%/12%/12%/12%/15%'
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
																											dataList = map.resultCraftList[0].craftSegments, // 主要数据列表
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
																														tempData = dataList[currentTr.index()].craft_segment_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[currentTr.index()].craft_segment_number;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[currentTr.index()].craft_segment_polarity;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 4: {
																														tempData = dataList[currentTr.index()].craft_segment_versions;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 5: {
																														tempData = dataList[currentTr.index()].product_model_type_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 6: {
																														tempData = dataList[currentTr.index()].product_model_genre;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 7: {
																														tempData = dataList[currentTr.index()].craft_segment_quality_rate;
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
																									totalRow: result.map.resultCraftList[0].craftSegments.length, // 总行数
																									displayRow: result.map.resultCraftList[0].craftSegments.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})

																							// 表格3

																							if(processDescriblesDetail&&processDescriblesDetail.length !== 0){
																								panel3.show()
																								mesVerticalTableAddData(panel3, {
																									thead: {
																										theadContent: '序号/事项/说明',
																										theadWidth: '8%/17%/70%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																										],
																										// '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#viewDetail"><i class="fa fa-tasks fa-fw"></i>查看详情</a><a class="table-link" href="javascript:;" data-toggle-btn="#up"><i class="fa fa-arrow-up"></i>上移</a><a class="table-link" href="javascript:;" data-toggle-btn="#down"><i class="fa fa-arrow-down"></i>下移</a><a class="table-link" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-bank"></i>删除</a></td>'

																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											tbodyTarget.empty() // 清空表格主体
																											let map = result.map, // 映射
																												dataList = map.resultCraftList[0].processDescribles,	 // 主要数据列表

																												tempData = null; // 表格td内的临时数据

																											for (let i = 0, len = dataList.length; i < len; i++) {
																												tbodyTarget.append('<tr></tr>'); // 添加行
																												let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行

																												for (let j = 0, len = html.length; j < len; j++) {
																													currentTr.append(html[j]); // 添加表格内的HTML
																													switch (j) {
																														case 0: {
																															tempData = dataList[currentTr.index()].order
																															currentTr.children().eq(j).html(tempData)
																														}
																															break;
																														case 1: {
																															tempData = dataList[currentTr.index()].proceeding;
																															currentTr.children().eq(j).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].explain;
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
																										totalRow:result.map.resultCraftList[0].processDescribles.length , // 总行数
																										displayRow: result.map.resultCraftList[0].processDescribles.length // 显示行数
																									},

																									ajax: {
																										url: url,
																										data: data
																									}
																								})
																							}

																						}
																						else {
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}

																			if(isPublic==="公版"){
																				addTableData(queryCraftParticularsUrl, {
																					versionType:"public",
																					craftIds: caftIdList,
																					// headNum: 1
																				});
																			}else if(isPublic==="私版"){
																				addTableData(queryCraftParticularsUrl, {
																					versionType:"private",
																					craftIds: caftIdList,
																					userId:USERID
																					// headNum: 1
																				});
																			}

                                      btn_1.off('click').on('click', (event) => {
																				let tempUrl = `${exportCraftInstructorUrl}?craftId=${craftID}`;
                                        location.href = tempUrl
																			})

																			break;
																		}

																		case '#BOMMangeModel': {	//查看BOM管理
																			let targetModal = $(document.getElementById('BOMMangeModel')), // 模态框
																			targetModalPanel = targetModal.find('.panel'), // 面板
																			targetModalFooter = targetModal.find('.modal-footer'), // 面板
																			targetTable = targetModalPanel.find('table'),
																			tableTbody = targetModalPanel.find('tbody'),
																			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
																			modalTitle = targetModal.find('.modal-title'),
																			statusOption = targetModalPanel.find('.status-type-option'), // 选择下拉菜单
																			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'),// 模糊搜索菜单
																			mesloadBox2 = new MesloadBox(targetModalPanel, {warningContent: '没有此类信息，请重新选择或输入'}),
																			headingMainBtn_1 = targetModalPanel.find('.head-main-btn-1'), // 头部主要按键_1
																			headingMainBtn_2 = targetModalPanel.find('.head-main-btn-2')// 头部主要按键_2

																			modalTitle.html('BOM管理') // 设置标题
																			tableTbody.empty()

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																							mesVerticalTableAddData(targetModalPanel, {
																								thead: {
																									theadContent: '序号/BOM名称/BOM版本/创建时间/操作',
																									theadWidth: '8%/15%/15%/15%/22%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td class="table-input-td"><a class="table-link" href="javascript:;"data-toggle-modal-target="#addBOMMangeModel"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#status"><i class="fa fa-check fa-fw"></i></a></td>'
																									],

																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射zszs
																											dataList = map.bomlist, // 主要数据列表

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
																														 tempData = dataList[currentTr.index()].craft_bom_name;
																														// tempData=
																														currentTr.children().eq(i).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[currentTr.index()].craft_bom_version;
																														currentTr.children().eq(i).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[currentTr.index()].craft_bom_recordtime;
																														currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																													}
																														break;
																													case 4: {
																														tempData = dataList[currentTr.index()].craft_bom_status;
																														let bomid = dataList[currentTr.index()].craft_bom_id
																														let bomIdList=[]
																														bomIdList.push(bomid)
																														if(tempData === "0"){
																															currentTr.children().eq(i).find("a:last-child").html(`<i class="fa fa-trash-o fa-fw"></i>弃用`).addClass("text-danger")
																														}else if(tempData === "1"){
																															currentTr.children().eq(i).find("a:last-child").html(`<i class="fa fa-check fa-fw"></i>启用`)
																														}

																														currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																															let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn// 按钮自带的data数据
																															switch (dataContent) {
																																case '#addBOMMangeModel': {	//详情
																																	let dataContent = $('#addBOMMangeModel'),
																																		panelList = dataContent.find('.panel'),
																																		panel_1 = panelList.eq(0)
																																		panel_2 = panelList.eq(1)
																																		modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																																		modalSubmitBtn = dataContent.find('.modal-submit')
																																		panelThead = panelList.find('thead'),
																																		panelTbody = panelList.find('tbody');
																																		
																																		dataContent.find('.modal-header').find('.modal-title').text('BOM详情') // 更换panel标题
																																		panel_1.find('.panel-heading').find('.panel-title').text('基础信息') // 更换panel标题
																																		panel_2.find('.panel-heading').find('.panel-title').text('供应商信息') // 更换panel标题

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
																																			panel_2.find('thead').empty()
																																			panel_2.find('tbody').empty()
																																		})
														
																																	// 主表格添加内容
																																	function addTableData(url, data) {
																																		$.ajax({
																																			type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																																					mesHorizontalTableAddData(panel_1.find('table'), null, {
																																						thead: 'BOM名称/BOM版本/创建人/创建时间/BOM备注',
																																						tableWitch: '10%/10%/10%',
																																						viewColGroup: 3,
																																						importStaticData: (tbodyTd, length) => {
																																							let map = result.map, // 映射
																																							dataList = map.BomList, // 主要数据列表
																																							tempData = null; // 表格td内的临时数据
																																							for (let i = 0, len = length; i < len; i++){
																																								switch (i) {																								
																																									case 0: {
																																										tempData = dataList[0].craft_bom_name;
																																										tbodyTd.eq(i).html(tempData)
																																									}
																																										break;
																																									case 1: {
																																										tempData = dataList[0].craft_bom_version;
																																										tbodyTd.eq(i).html(tempData)
																																									}
																																										break;
																																									case 2: {
																																										tempData = dataList[0].craft_bom_staff;
																																										tbodyTd.eq(i).html(tempData)
																																									}
																																										break;
																																									case 3: {
																																										tempData = dataList[0].craft_bom_recordtime;
																																										tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																																									}
																																										break;
																																									case 4: {
																																										tempData = dataList[0].craft_bom_note;
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
																																							theadContent: '序号/物料名称/物料型号/物料规格/值/单位/供应商',
																																							theadWidth: '8%/15%/15%/15%/15%/15%/15%'
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
																																								dataList = map.bomDetails, // 主要数据列表
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
																																												 tempData = dataList[currentTr.index()].material_name;
																																												currentTr.children().eq(i).html(tempData)
																																											}
																																												break;
																																											case 2: {
																																												tempData = dataList[currentTr.index()].material_model;
																																												currentTr.children().eq(i).html(tempData)
																																											}
																																												break;
																																											case 3: {
																																												tempData = dataList[currentTr.index()].material_stantard;
																																												currentTr.children().eq(i).html(tempData)
																																											}
																																												break;
																																											case 4: {
																																												tempData = dataList[currentTr.index()].material_use_value;
																																												currentTr.children().eq(i).html(tempData)
																																											}
																																												break;
																																											case 5: {
																																												tempData = dataList[currentTr.index()].material_unit;
																																												currentTr.children().eq(i).html(tempData)
																																											}
																																												break;
																																											case 6: {
																																												tempData = dataList[currentTr.index()].supplier_name;
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
																																							totalRow: result.map.count, // 总行数
																																							displayRow: result.map.bomDetails.length // 显示行数
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
																																	addTableData(queryCraftBOMParticularsUrl, {
																																		craftBOMId:bomid
																																	});
														
																																	break;
																																}
																																case "#status":{
																																	if(tempData === "0"){
																																		planStatus = 'deprecated'
																																	}else if(tempData === "1"){
																																		planStatus = 'recover'
																																	}
																																	swal({
																																		title: '您确定要更改此状态吗？',
																																		type: 'question',
																																		showCancelButton: true,
																																		confirmButtonText: '确定',
																																		cancelButtonText: '取消'
																																	}).then(function (){
																																		$.ajax({
																																			type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																																			url:modifyCraftBOMStatusUrl,
																																			data: {
																																			type:planStatus,
																																			craftBOMIds:bomIdList
																																			},
																																			success: function (result, status, xhr) {
																																				if (result.status === 0) {
																																					let activePaginationBtn = targetModalPanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																																					swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																																				}else if(result.status === 4){
																																					repeatFail()
																																				}
																																				
																																				else {
																																					swallFail()	//操作失败
																																				}
																																			},
																																		})
																																	})
																																		// (dismiss) => {
																																		// 	target.val(dataList[currentTr.index()].craft_basics_status);
																																		// })


																																	break
																																}
																															
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
																									displayRow: result.map.bomlist.length // 显示行数
																								},

																								ajax: {
																									url: url,
																									data: data
																								}
																							})


																						}
																						else {
																							tableTbody.empty().append(NO_DATA_NOTICE)
																							mesloadBox2.warningShow();
																						}
																					}
																				})
																			}

																			addTableData(queryCraftBOMUrl, {
																				craftVersionsId: craftID,
																				status: 0,
																				headNum: 1
																				
																			});
														
																			// 模糊搜索组加载数据
																			fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
																				let val = $(this).closest('.input-group').find('input').val(),
																				status=statusOption.val()
																				event.stopPropagation() // 禁止向上冒泡
																				addTableData(queryCraftBOMUrl, {
																					craftVersionsId: craftID,
																					keyword: val,
																					status: status,
																					headNum: 1
																				});
														
																			});
														
																			// 下拉选事件
																			statusOption.off("change").on("change",function(){
																				let status = $(this).val();
																				addTableData(queryCraftBOMUrl, {
																					craftVersionsId: craftID,
																					status: status,
																					headNum: 1
																				});
																			})

																			//按钮2点击事件 查看物料清单
																			headingMainBtn_2.off("click").on("click",(event) => {
																				let targetModal = $(document.getElementById('detailModal')), // 模态框
																				targetModalPanel = targetModal.find('.panel'), // 面板
																				targetModalFooter = targetModal.find('.modal-footer'), // 面板
																				targetTable = targetModalPanel.find('table'),
																				tableTbody = targetModalPanel.find('tbody'),
																				modalCloseBtn = targetModal.find('.modal-header').find('.close'),
																				modalTitle = targetModal.find('.modal-title'),
																				selectDepartment = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
																				fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'),// 模糊搜索菜单
																				mesloadBox2 = new MesloadBox(targetModalPanel, {warningContent: '没有此类信息，请重新选择或输入'})
	
	
																				modalTitle.html('物料清单详情') // 设置标题
																				selectDepartment.hide()
																				fuzzySearchGroup.hide()
																				tableTbody.empty()

																				targetModal.modal({
																					backdrop: false, // 黑色遮罩不可点击
																					keyboard: false,  // esc按键不可弃用模态框
																					show: false
																				})
																				targetModal.modal('show') // 运行时显示
																				targetModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
																					$('body').addClass('modal-open')
																				})
																		
																				modalCloseBtn.off('click').on('click', (event) => {
																					// 点击弃用按钮隐藏该模态框
																					targetModal.modal('hide')
																					// 初始化表格
																					targetTable.find('thead').empty()
																					targetTable.find('tbody').empty()
																				})
	
	
																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																								mesVerticalTableAddData(targetModalPanel, {
																									thead: {
																										theadContent: '序号/物料名称/物料型号/物料规格/值/单位',
																										theadWidth: '8%/15%/15%/15%/15%/15%'
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
																											let map = result.map, // 映射zszs
																												dataList = map.bom, // 主要数据列表
	
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
																															tempData = dataList[currentTr.index()].material_name;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].material_model;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].material_stantard;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].material_use_value;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].material_unit;
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
																										displayRow: result.map.bom.length // 显示行数
																									},
	
																									ajax: {
																										url: url,
																										data: data
																									}
																								})
	
	
																							}
																							else {
																								tableTbody.empty().append(NO_DATA_NOTICE)
																								mesloadBox2.warningShow();
																							}
																						}
																					})
																				}
	
																				// 导航栏点击时运行数据加载
																				addTableData(queryCraftUseMaterialMenuUrl, {
																					// type: 'vague',
																					craftVersionsId:craftID,
																					headNum: 1,
																					tailNum:10
																				});
																			})

																			//按钮1点击事件 添加bom管理
																			headingMainBtn_1.off("click").on("click",(event) => {
																				let dataContent = $(document.getElementById('addBOMMangeModel')), 
																				panelList = dataContent.find('.panel'),
																				panel_1 = panelList.eq(0),
																				panel_2 =  panelList.eq(1),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				req={
																					craftId:"",
																					craftBomName:"",
																					craftBomVersion:"",
																					craftBomNote:""
																				},
																				materialIdAndSupplierId=[]

																				modalSubmitBtn.show()
																				// 表单要提交的数据
																			
																				// craftBasics.craft_basics_creation_staff = USERNAME
																				// craftBasics.craft_basics_creation_staff_id = USERID

																				// 主表格1添加内容，基础信息部分
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
																					panel_2.find('thead').empty()
																					panel_2.find('tbody').empty()
																				})


																				mesHorizontalTableAddData(panel_1.find('table'), null, {
																					thead: 'BOM名称/BOM版本/BOM备注',
																					tableWitch: '10%/10%/10%',
																					viewColGroup: 3,
																					importStaticData: (tbodyTd, length) => {
																						let inputHtml,
																								currentproductTypeID,
																								currentproductType
																						for (let i = 0, len = length; i < len; i++){
																							switch (i) {																								
																								case 0: {
																									inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)"  />`;
																									tbodyTd.eq(i).addClass('table-input-td')
																									tbodyTd.eq(i).html(inputHtml)

																									tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																										req.craftBomName = tbodyTd.eq(i).find('input').val()
																									})
																								}
																									break;
																								case 1: {
																									inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)"  />`;
																									tbodyTd.eq(i).addClass('table-input-td')
																									tbodyTd.eq(i).html(inputHtml)

																									tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																										req.craftBomVersion = tbodyTd.eq(i).find('input').val()
																									})
																								}
																									break;
																								case 2: {
																									inputHtml = `<input type="text" class="table-input" placeholder="请输入"  />`;
																									tbodyTd.eq(i).addClass('table-input-td')
																									tbodyTd.eq(i).html(inputHtml)

																									tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																										req.craftBomNote = tbodyTd.eq(i).find('input').val()
																									})
																								}
																									break;
																								default:
																									break;
																							}
																						}


																					}

																				});

																				//表格2 的引用部分
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																								mesVerticalTableAddData(panel_2, {
																									thead: {
																										theadContent: '序号/物料名称/物料型号/物料规格/值/单位/供应商',
																										theadWidth: '8%/15%/15%/15%/15%/15%/15%'
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
																												dataList = map.bom, // 主要数据列表
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
																															 tempData = dataList[currentTr.index()].material_name;
																															 let materialId = dataList[currentTr.index()].material_id;
																															currentTr.children().eq(i).html(tempData)
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].material_model;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].material_stantard;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = dataList[currentTr.index()].material_use_value;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 5: {
																															tempData = dataList[currentTr.index()].material_unit;
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 6: {
																															//tempData = dataList[currentTr.index()].material_id;
																															let tempData2 = dataList[currentTr.index()].craft_control_bom_id;
																															let inputHtml = `<input type="text" class="table-input" placeholder="点此选择" autocomplete="on" />`
																															currentTr.children().eq(i).addClass('table-input-td')
																															currentTr.children().eq(i).html(inputHtml)
																				
																															currentTr.children().eq(i).find('input').off('focus').on('focus', function () {
																																tempData = dataList[currentTr.index()].material_id;
																																let promise = new Promise(function (resolve, reject) {
																																	selectSupplier(resolve, queryMaterialToSupplierUrl, {
																																		materialId:tempData,
																																		})
																																});
																																promise.then(function (resolveData) {
																																	supplierId = resolveData.supplierId
																																	supplierName = resolveData.supplierName
																																	currentTr.children().eq(i).find('input').val(resolveData.supplierName)
																																	currentTr.children().eq(i).find('input').attr("materialId",tempData2)
																																	currentTr.children().eq(i).find('input').attr("supplierId",supplierId)
																																	currentTr.children().eq(i).find('input').attr("supplierName",supplierName)
																																	
																																	
																																})
																				
																																$(this).prop('readonly', true) // 输入框只读
																																$(this).off('blur').on('blur', () => {
																																	$(this).removeProp('readonly') // 输入移除框只读
																																})
																															})
																															break;


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
																										displayRow: result.map.bom.length // 显示行数
																									},
	
																									ajax: {
																										url: url,
																										data: data
																									}
																								})
	
	
																							}
																							else {
																								// tableTbody.empty().append(NO_DATA_NOTICE)
																								// mesloadBox2.warningShow();
																							}
																						}
																					})
																				}
	
																				// 导航栏点击时运行数据加载
																				addTableData(queryCraftUseMaterialMenuUrl, {																	
																					craftVersionsId:craftID,
																					headNum: 1,
																					tailNum:10
																				});

																				modalSubmitBtn.off('click').on('click', (event) => {

																					let $tr = panel_2.find("table").find('tbody tr');
																					for (let i = 0, len = $tr.length; i < len; i++){	//遍历行
																						let $td = $tr.eq(i).find('td:last-child'),
																						materialId2,
																						supplierId2

																						materialId2 = $td.find('input').attr("materialId")
																						supplierId2 = $td.find('input').attr("supplierId")
																						supplierName2 = $td.find('input').attr("supplierName")
																						
																					
																						// 拼成字符串
																						// let tempStr = `${materialId2}:${supplierId2}:${supplierName2}`;
																						let tempStr = `{"craft_control_bom_id":"${materialId2}","supplier_id":"${supplierId2}","supplier_name":"${supplierName2}"}`;
																						materialIdAndSupplierId[i] = tempStr;
																					}
																					let tempdata11 = materialIdAndSupplierId.toString();
																					let tempdata22
																					if(tempdata11!== "" ){
																						tempdata22 =`[${tempdata11}]`;
																					}

																					if (materialIdAndSupplierId.length !== '')
																					{
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
																								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																								url: saveCraftBOMUrl,
																								data: {
																									craftId:craftID,
																									craftBomName:req.craftBomName,
																									craftBomVersion:req.craftBomVersion,
																									craftBomNote:req.craftBomNote,
																									staff:USERNAME,
																									staffId:USERID,
																									materialIdAndSupplierId:tempdata22
																								},
											
																								success: function (result, status, xhr) {
																									if (result.status === 0) {
																										let activePaginationBtn = targetModalPanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											
																									}else if(result.status === 7){
																										repeatFail()
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

																			break;
																		}
																		case '#copy' :{
																			if(isPublic==="公版"){
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																					url: queryCraftParticularsUrl,
																					data: {
																						versionType:"public",
																						craftIds: caftIdList,
																					},
																					success: function (result) {
																						if (result.status === 0) {
																							copyCraft =result.map.resultCraftList// 主要数据列表
																						}
																					}
	
																				});
																			}else if(isPublic==="私版"){
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																					url: queryCraftParticularsUrl,
																					data: {
																						versionType:"private",
																						craftIds: caftIdList,
																						userId:USERID
																					},
																					success: function (result) {
																						if (result.status === 0) {
																							copyCraft = result.map.resultCraftList// 主要数据列表
																						}
																					}
	
																				})
																			}

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
											totalRow: result.map.count, // 总行数
											displayRow: result.map.craftList.length // 显示行数
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
					addTableData(queryCraftOutlineUrl, {
						versionType: 'public',
						status:0,
						headNum: 1
          });

          // 模糊搜索组加载数据
          fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
            let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "")
						let status=statusTypeOption.val()
						let currentproductTypeID = ProductTypeOption.val().split(",")[0];
						let isPublic= ProductLinesOption.val();
            event.stopPropagation() // 禁止向上冒泡
						if(isPublic==="私版"){
							addTableData(queryCraftOutlineUrl, {
								productTypeId: currentproductTypeID,
								versionType: 'private',
								userId :USERID,
								headNum: 1,
								keyword: val,
								status:status
							});
						}else if(isPublic==="公版"){
							addTableData(queryCraftOutlineUrl, {
								productTypeId: currentproductTypeID,
								versionType: 'public',
								headNum: 1,
								keyword: val,
								status:status
							});
						}

          });

          statusTypeOption.off("change").on("change",function(){
						let status= $(this).val();
						let currentproductTypeID = ProductTypeOption.val().split(",")[0];
						let val = fuzzySearchGroup.closest('.input-group').find('input').val().replace(/\s/g, "")
						let isPublic= ProductLinesOption.val();
						if(isPublic==="私版"){
							addTableData(queryCraftOutlineUrl, {
								productTypeId: currentproductTypeID,
								versionType: 'private',
								userId :USERID,
								headNum: 1,
								keyword: val,
								status:status
							});
						}else if(isPublic==="公版"){
							addTableData(queryCraftOutlineUrl, {
								productTypeId: currentproductTypeID,
								versionType: 'public',
								headNum: 1,
								keyword: val,
								status:status
							});
						}
					})
					
          ProductTypeOption.off("change").on("change",function(){
						let currentproductTypeID = $(this).val().split(",")[0];
						let isPublic= ProductLinesOption.val();
						let status = statusTypeOption.val()
						let val = fuzzySearchGroup.closest('.input-group').find('input').val().replace(/\s/g, "")
						if(isPublic==="私版"){
							addTableData(queryCraftOutlineUrl, {
								productTypeId: currentproductTypeID,
								versionType: 'private',
								userId :USERID,
								headNum: 1,
								keyword: val,
								status:status
							});
						}else if(isPublic==="公版"){
							addTableData(queryCraftOutlineUrl, {
								productTypeId: currentproductTypeID,
								versionType: 'public',
								headNum: 1,
								keyword: val,
								status:status
							});
						}


           
					})
					
          ProductLinesOption.off("change").on("change",function(){
						let name = $(this).val()
						let status = statusTypeOption.val()
						let currentproductTypeID = ProductTypeOption.val().split(",")[0];
						let val = fuzzySearchGroup.closest('.input-group').find('input').val().replace(/\s/g, "")
						if(name==="私版"){
							addTableData(queryCraftOutlineUrl, {
								versionType: 'private',
								productTypeId: currentproductTypeID,
								userId :USERID,
								headNum: 1,
								keyword: val,
								status:status
							});
						}else if(name==="公版"){
							addTableData(queryCraftOutlineUrl, {
								versionType: 'public',
								productTypeId: currentproductTypeID,
								status:status,
								keyword: val,
								headNum: 1
							});
						}

          })


				}())
				break;

			case '#productModelMange':	//产品模型管理
				(function () {
					let activeSwiper = $('#productModelMange'), // 右侧外部swiper
						activeSubSwiper = $('#productModelMangeInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1,设备类型管理
						headingMainBtn_2 = activePanelHeading.find('.head-main-btn-2'), // 头部主要按键_2，新增设备
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						productTypeOption = activePanelHeading.find('.product-type-option'), // 类型选项
						statusTypeOption = activePanelHeading.find('.status-type-option'), // 类型选项
						staffTypeOption,
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
						// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})
						createProductTypeSelect(productTypeOption);
						// 主表格添加内容
						function addTableData(url, data) {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
												theadContent: '序号/产品名称/产品编号/产品类型/状态/操作',
												theadWidth: '5%/20%/20%/20%/14%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#productDetailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													tbodyTarget.empty() // 清空表格主体
													let map = result.map, // 映射
														dataList = map.productModels, // 主要数据列表
														tempData = null,
														selectHtml = `<select class="form-control  input-sm"></select>`// 表格td内的临时数据

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
																	tempData = dataList[currentTr.index()].product_model_name;
																	currentTr.children().eq(j).html(tempData)
																}
																	break;

																case 2: {
																	tempData = dataList[currentTr.index()].product_model_number;
																	currentTr.children().eq(j).html(tempData)
																}
																	break;
																case 3: {

																	currentTr.children().eq(j).addClass('table-input-td')
																	currentTr.children().eq(j).html(selectHtml)

																	let target = currentTr.children().eq(j).find('select');

																	for (let i = 0, len = productTypeList.length; i < len; i++) {
																		let optionStr = `<option value="${productTypeList[i].product_model_type_id}">${productTypeList[i].product_type_name}</option>`;
																		target.append(optionStr);
																	}
																	target.val(dataList[currentTr.index()].product_model_type_id).attr('disabled',true)
																}
																	break;
																case 4: {
																	let productModelIds=[],

																	tempStr = `
																	<select class="form-control table-input input-sm">
																		<option value="0">启用</option>
																		<option value="1">弃用</option>
																	</select>
																		`;
																	tempData = dataList[currentTr.index()].product_model_status;
																	currentTr.children().eq(j).addClass('table-input-td').html(tempStr);
																	let	target = currentTr.children().eq(j).find('select');
																	target.val(tempData);

																	target.off('change').on('change', function () {
																		let planStatus = $(this).val();
																		if(planStatus == 0 ){
																		planStatus = 'recover'
																		}else {
																		planStatus = 'deprecated'
																		};
																		productModelIds.push(dataList[currentTr.index()].product_model_id);
																		swal({
																			title: '您确定要更改此状态吗？',
																			type: 'question',
																			showCancelButton: true,
																			confirmButtonText: '确定',
																			cancelButtonText: '取消'
																		}).then(function () {
																			$.ajax({
																				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																				url:modifyProductModelStatusUrl,
																				data: {
																				type:planStatus,
																				productModelIds:productModelIds
																				},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																					}else if(result.status === 7){
																						repeatFail()
																					}
																					else {
																						swallFail()	//操作失败
																					}
																				},
																			})
																		},
																			(dismiss) => {
																				target.val(dataList[currentTr.index()].product_model_status);
																			})
																	})
																}
																	break;
																case 5:{
																	currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																		let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																			ProductId = dataList[currentTr.index()].product_model_id

																		switch (dataContent) {
																			case '#productDetailModal': {
																				let dataContent = $('#productDetailModal'),
																					panelModal1 = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					// modalSubmitBtn = dataContent.find('.modal-submit'),
																					fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																					fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
																					staffTypeOption,
																					submission = dataContent.find('.modal-footer')
																					// submissionBtn = submission.find('.modal-submit'),

																					// 添加主体表单数据
																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																									mesHorizontalTableAddData(panelModal1.find('table'), null, {
																										thead: '产品名称/产品类型/产品型号/产品单位/额定电压/开路电压/电池内阻/电池阻抗/产品外形/产品尺寸/产品重量/额定容量/充电特性/充放速率/自放电率/使用温度/安全性能/环保性能/存储寿命/特点:/适用范围:/注意事项:/产品备注/创建时间/创建人员/使用状态/其他',
																										tableWitch: '20%/30%/30%',
																										viewColGroup: 2,
																										importStaticData: (tbodyTd, length) => {
																											let map = result.map, // 映射
																											dataList = map.productModels, // 主要数据列表
																											selectHtml = `<select class="form-control table-input input-sm"></select>`,
																											tempData = null; // 表格td内的临时数据

																											for (let i = 0, len = length; i < len; i++) {
																												switch (i) {
																													case 0: {
																														tempData = dataList[0].product_model_name
																														tbodyTd.eq(i).html(tempData);
																													}
																														break;
																													case 1: {
																														tbodyTd.eq(i).addClass('table-input-td')
																														tbodyTd.eq(i).html(selectHtml)

																														let target = tbodyTd.eq(i).find('select');
																														for (let i = 0, len = productTypeList.length; i < len; i++) {
																															let optionStr = `<option value="${productTypeList[i].product_model_type_id}">${productTypeList[i].product_type_name}</option>`;
																															target.append(optionStr);
																														}
																														target.val(dataList[0].product_model_type_id).attr('disabled',true)

																														// 添加到提交数据
																														break;

																													}
																														break;
																													case 2: {
																														tempData = dataList[0].product_model_genre
																														tbodyTd.eq(i).html(tempData)
																													}
																													break;
																													case 3: {
																														tempData = dataList[0].product_model_unit
																														tbodyTd.eq(i).html(tempData)
																													}
																													break;
																													case 4: {
																														tempData = dataList[0].product_model_rated_voltage
                                                            tempData1 = dataList[0].product_model_rated_voltage_unit
                                                            if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }
																													}
																													break;
																													case 5: {
																														tempData = dataList[0].product_model_open_voltage
																														tempData1 = dataList[0].product_model_open_voltage_unit
                                                            if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 6: {
																														tempData = dataList[0].product_model_resistance
																														tempData1 = dataList[0].product_model_resistance_unit
                                                            if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 7: {
																														tempData = dataList[0].product_model_impedance
																														tempData1 = dataList[0].product_model_impedance_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 8: {
																														tempData = dataList[0].product_model_shape
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 9: {
																														tempData = dataList[0].product_model_shape
																														tempData1 = dataList[0].product_model_size_unit

																														tempData2 = dataList[0].product_model_long
																														tempData3 = dataList[0].product_model_wide
																														tempData4 = dataList[0].product_model_high
																														tempData5 = dataList[0].product_model_diameter
																														if(tempData ==="方形电池"|| tempData ==="软包电池" ){
																															tbodyTd.eq(i).html("长"+tempData2+"宽"+tempData3+"高"+tempData4+tempData1)
																														}else if(tempData ==="圆柱电池"){
																															tbodyTd.eq(i).html("长"+tempData2+"直径"+tempData5+tempData1)
																														}else{
																															tbodyTd.eq(i).html("")
																														}


																														// if(tempData!==""){
                                                            //   tbodyTd.eq(i).html(tempData+tempData1)
                                                            // }else{
                                                            //   tbodyTd.eq(i).html("")
                                                            // }

																													}
																													break;
																													case 10: {
																														tempData = dataList[0].product_model_weight
																														tempData1 = dataList[0].product_model_weight_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 11: {
																														tempData = dataList[0].product_model_capacity
																														tempData1 = dataList[0].product_model_capacity_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 12: {
																														tempData = dataList[0].product_model_peculiarity
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 13: {
																														tempData = dataList[0].product_model_charge_discharge
																														tempData1 = dataList[0].product_model_charge_discharge_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 14: {
																														tempData = dataList[0].product_model_self_dicharge
																														tempData1 = dataList[0].product_model_self_dicharge_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 15: {
																														tempData = dataList[0].product_model_temperature
																														tempData1 = dataList[0].product_model_temperature_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 16: {
																														tempData = dataList[0].product_model_safety
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 17: {
																														tempData = dataList[0].product_model_protection
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 18: {
																														tempData = dataList[0].product_model_storage_life
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 19: {
																														tempData = dataList[0].product_model_trait
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 20: {
																														tempData = dataList[0].product_model_serviceable_range
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 21: {
																														tempData = dataList[0].product_model_announcement
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 22: {
																														tempData = dataList[0].product_model_describe
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 23: {
																														tempData = dataList[0].product_model_creation_time
																														tbodyTd.eq(i).html((moment(tempData).format('YYYY-MM-DD')))

																													}
																													break;
																													case 24: {
																														tempData = dataList[0].product_model_creation_staff
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 25: {
																														tempData = dataList[0].product_model_status
																														if(tempData){
																															tbodyTd.eq(i).html("开启")
																														}else{
																															tbodyTd.eq(i).html("弃用")
																														}

																													}
																													break;
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
																					addTableData(queryProductModelUrl, {
																						type: "precise",
																						productModelId:ProductId,
																						headNum: 1
																					})

																				// modalSubmitBtn.attr('disabled',true)
																				// submithData.productId = productId

																				panelModal1.find('.panel-heading').find('.panel-title').text('产品模型详情') // 更换panel标题




																				break;
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
												totalRow: result.map.lines,// 总行数
												displayRow: result.map.productModels.length    //显示行数
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
						// 通过产品类型添加表格内容
						function typeAddTableData(url, data) {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
												theadContent: '序号/产品名称/产品编号/产品类型/状态/操作',
												theadWidth: '5%/20%/20%/20%/14%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#productDetailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													tbodyTarget.empty() // 清空表格主体
													let map = result.map, // 映射
														dataList = map.productType, // 主要数据列表
														tempData = null,
														selectHtml = `<select class="form-control  input-sm"></select>`// 表格td内的临时数据

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
																	tempData = dataList[currentTr.index()].product_model_name;
																	currentTr.children().eq(j).html(tempData)
																}
																	break;

																case 2: {
																	tempData = dataList[currentTr.index()].product_model_number;
																	currentTr.children().eq(j).html(tempData)
																}
																	break;
																case 3: {

																	currentTr.children().eq(j).addClass('table-input-td')
																	currentTr.children().eq(j).html(selectHtml)

																	let target = currentTr.children().eq(j).find('select');

																	for (let i = 0, len = productTypeList.length; i < len; i++) {
																		let optionStr = `<option value="${productTypeList[i].product_model_type_id}">${productTypeList[i].product_type_name}</option>`;
																		target.append(optionStr);
																	}
																	target.val(dataList[currentTr.index()].product_model_type_id).attr('disabled',true)
																}
																	break;
																case 4: {
																	let productModelIds=[],

																	tempStr = `
																	<select class="form-control table-input input-sm">
																		<option value="0">启用</option>
																		<option value="1">弃用</option>
																	</select>
																		`;
																	tempData = dataList[currentTr.index()].product_model_status;
																	currentTr.children().eq(j).addClass('table-input-td').html(tempStr);
																	let	target = currentTr.children().eq(j).find('select');
																	target.val(tempData);

																	target.off('change').on('change', function () {
																		let planStatus = $(this).val();
																		if(planStatus == 0 ){
																		planStatus = 'recover'
																		}else {
																		planStatus = 'deprecated'
																		};
																		productModelIds.push(dataList[currentTr.index()].product_model_id);
																		swal({
																			title: '您确定要更改此状态吗？',
																			type: 'question',
																			showCancelButton: true,
																			confirmButtonText: '确定',
																			cancelButtonText: '取消'
																		}).then(function () {
																			$.ajax({
																				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																				url:modifyProductModelStatusUrl,
																				data: {
																				type:planStatus,
																				productModelIds:productModelIds
																				},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																					}else if(result.status === 7){
																						repeatFail()
																					}
																					else {
																						swallFail()	//操作失败
																					}
																				},
																			})
																		},
																			(dismiss) => {
																				target.val(dataList[currentTr.index()].product_model_status);
																			})
																	})
																}
																	break;
																case 5:{
																	currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																		let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																			ProductId = dataList[currentTr.index()].product_model_id

																		switch (dataContent) {
																			case '#productDetailModal': {
																				let dataContent = $('#productDetailModal'),
																					panelModal1 = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					// modalSubmitBtn = dataContent.find('.modal-submit'),
																					fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																					fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
																					staffTypeOption,
																					submission = dataContent.find('.modal-footer')
																					// submissionBtn = submission.find('.modal-submit'),

																					// 添加主体表单数据
																					function addTableData(url, data) {
																						$.ajax({
																							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																									mesHorizontalTableAddData(panelModal1.find('table'), null, {
																										thead: '产品名称/产品类型/产品型号/产品单位/额定电压/开路电压/电池内阻/电池阻抗/产品外形/产品尺寸/产品重量/额定容量/充电特性/充放速率/自放电率/使用温度/安全性能/环保性能/存储寿命/特点:/适用范围:/注意事项:/产品备注/创建时间/创建人员/使用状态/其他',
																										tableWitch: '20%/30%/30%',
																										viewColGroup: 2,
																										importStaticData: (tbodyTd, length) => {
																											let map = result.map, // 映射
																											dataList = map.productModels, // 主要数据列表
																											selectHtml = `<select class="form-control table-input input-sm"></select>`,
																											tempData = null; // 表格td内的临时数据

																											for (let i = 0, len = length; i < len; i++) {
																												switch (i) {
																													case 0: {
																														tempData = dataList[0].product_model_name
																														tbodyTd.eq(i).html(tempData);
																													}
																														break;
																													case 1: {
																														tbodyTd.eq(i).addClass('table-input-td')
																														tbodyTd.eq(i).html(selectHtml)

																														let target = tbodyTd.eq(i).find('select');
																														for (let i = 0, len = productTypeList.length; i < len; i++) {
																															let optionStr = `<option value="${productTypeList[i].product_model_type_id}">${productTypeList[i].product_type_name}</option>`;
																															target.append(optionStr);
																														}
																														target.val(dataList[0].product_model_type_id).attr('disabled',true)
																														break;

																													}
																														break;
																													case 2: {
																														tempData = dataList[0].product_model_genre
																														tbodyTd.eq(i).html(tempData)
																													}
																													break;
																													case 3: {
																														tempData = dataList[0].product_model_unit
																														tbodyTd.eq(i).html(tempData)
																													}
																													break;
																													case 4: {
																														tempData = dataList[0].product_model_rated_voltage
                                                            tempData1 = dataList[0].product_model_rated_voltage_unit
                                                            if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }
																													}
																													break;
																													case 5: {
																														tempData = dataList[0].product_model_open_voltage
																														tempData1 = dataList[0].product_model_open_voltage_unit
                                                            if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 6: {
																														tempData = dataList[0].product_model_resistance
																														tempData1 = dataList[0].product_model_resistance_unit
                                                            if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 7: {
																														tempData = dataList[0].product_model_impedance
																														tempData1 = dataList[0].product_model_impedance_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 8: {
																														tempData = dataList[0].product_model_shape
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 9: {
																														tempData = dataList[0].product_model_shape
																														tempData1 = dataList[0].product_model_size_unit

																														tempData2 = dataList[0].product_model_long
																														tempData3 = dataList[0].product_model_wide
																														tempData4 = dataList[0].product_model_high
																														tempData5 = dataList[0].product_model_diameter
																														if(tempData ==="方形电池"|| tempData ==="软包电池" ){
																															tbodyTd.eq(i).html("长"+tempData2+"宽"+tempData3+"高"+tempData4+tempData1)
																														}else if(tempData ==="圆柱电池"){
																															tbodyTd.eq(i).html("长"+tempData2+"直径"+tempData5+tempData1)
																														}else{
																															tbodyTd.eq(i).html("")
																														}


																														// if(tempData!==""){
                                                            //   tbodyTd.eq(i).html(tempData+tempData1)
                                                            // }else{
                                                            //   tbodyTd.eq(i).html("")
                                                            // }

																													}
																													break;
																													case 10: {
																														tempData = dataList[0].product_model_weight
																														tempData1 = dataList[0].product_model_weight_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 11: {
																														tempData = dataList[0].product_model_capacity
																														tempData1 = dataList[0].product_model_capacity_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 12: {
																														tempData = dataList[0].product_model_peculiarity
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 13: {
																														tempData = dataList[0].product_model_charge_discharge
																														tempData1 = dataList[0].product_model_charge_discharge_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 14: {
																														tempData = dataList[0].product_model_self_dicharge
																														tempData1 = dataList[0].product_model_self_dicharge_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 15: {
																														tempData = dataList[0].product_model_temperature
																														tempData1 = dataList[0].product_model_temperature_unit
																														if(tempData!==""){
                                                              tbodyTd.eq(i).html(tempData+tempData1)
                                                            }else{
                                                              tbodyTd.eq(i).html("")
                                                            }

																													}
																													break;
																													case 16: {
																														tempData = dataList[0].product_model_safety
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 17: {
																														tempData = dataList[0].product_model_protection
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 18: {
																														tempData = dataList[0].product_model_storage_life
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 19: {
																														tempData = dataList[0].product_model_trait
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 20: {
																														tempData = dataList[0].product_model_serviceable_range
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 21: {
																														tempData = dataList[0].product_model_announcement
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 22: {
																														tempData = dataList[0].product_model_describe
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 23: {
																														tempData = dataList[0].product_model_creation_time
																														tbodyTd.eq(i).html((moment(tempData).format('YYYY-MM-DD')))

																													}
																													break;
																													case 24: {
																														tempData = dataList[0].product_model_creation_staff
																														tbodyTd.eq(i).html(tempData)

																													}
																													break;
																													case 25: {
																														tempData = dataList[0].product_model_status
																														if(tempData){
																															tbodyTd.eq(i).html("开启")
																														}else{
																															tbodyTd.eq(i).html("弃用")
																														}

																													}
																													break;
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
																					addTableData(queryProductModelUrl, {
																						type: "precise",
																						productModelId:ProductId,
																						headNum: 1
																					})

																				// modalSubmitBtn.attr('disabled',true)
																				// submithData.productId = productId

																				panelModal1.find('.panel-heading').find('.panel-title').text('产品模型详情') // 更换panel标题




																				break;
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
												totalRow: result.map.lines,// 总行数
												displayRow: result.map.productType.length    //显示行数
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
						addTableData(queryProductModelUrl, {
							type: 'vague',
							status:0,
							headNum: 1
						});

						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, ""),
							status=statusTypeOption.val()

							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								addTableData(queryProductModelUrl, {
									type: 'vague',
									keyWord: val,
									status:status,
									headNum: 1
								});
							}
							else {
								addTableData(queryProductModelUrl, {
									type: 'vague',
									status:0,
									headNum: 1
								});
							}

						});

						// 下拉选事件
						productTypeOption.off('change').on('change',function(){
							let currentproductTypeID = $(this).val().split(",")[0],
							status=statusTypeOption.val()
							typeAddTableData(queryProductTypeAboutModelUrl, {
								type: 'precise',
								status:status,
								productTypeId:currentproductTypeID,
								headNum:1
								});
						});
						statusTypeOption.off("change").on("change",function(){
							let currentproductTypeID = $(this).val();
							addTableData(queryProductModelUrl, {
								type: 'vague',
								status: currentproductTypeID,
								headNum: 1
							});
						})

						// 头部主要按钮1点击事件，产品类型管理
						headingMainBtn_1.off('click').on('click', (event) => {
							let dataContent = $('#projectTypeMangeModel'),
								panelModal1 = dataContent.find('.panel'),
								headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增设备类型
								modalCloseBtn = dataContent.find('.modal-header').find('.close'),
								statusOption = panelModal1.find(".status-type-option"),// 类型选
								fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
								// ProductTypeList = [],
								mesloadBox = new MesloadBox(panelModal1, {
									// 主数据载入窗口
									warningContent: '没有此类信息，请重新选择或输入'
								});

							// 模态框表格增加内容
								function addModalTableData(url, data) {
									$.ajax({
										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
										dataType:'json',
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
														theadContent: '序号/类型名称/类型编号/类型描述/使用状态/操作',
														theadWidth: '6%/20%/20%/20%/20%/20%'
													},
													tbody: {
														html: [
															'<td></td>',
															'<td></td>',
															'<td></td>',
															'<td></td>',
															'<td></td>',
															'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'

														],

														// 添加表格主体数据, 这是一个回调函数,这里不需要传参
														dataAddress: function (tbodyTarget, html, result) {
															let map = result.map, // 映射
																dataList = result.map.productTypes, // 主要数据列表
																tempData = ''; // 表格td内的临时数据
															// ProductTypeList = dataList;
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
																			tempData = dataList[currentTr.index()].product_type_name
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 2: {
																			tempData = dataList[currentTr.index()].product_type_number
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 3: {
																			tempData = dataList[currentTr.index()].product_type_describe
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 4: {
																			let productTypeIds = []
																			tempStr = `
																			<select class="form-control table-input input-sm">
																			<option value="0">启用</option>
																			<option value="1">弃用</option>
																			</select>
																			`;
																			tempData = dataList[currentTr.index()].product_type_status;
																			currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
																			let	target = currentTr.children().eq(i).find('select');
																			target.val(tempData);

																			target.off('change').on('change', function () {
																				let planStatus = $(this).val();
																				if(planStatus == 0 ){
																					planStatus = 'recover'
																				}else {
																					planStatus = 'deprecated'
																				};
																				productTypeIds.push(dataList[currentTr.index()].product_model_type_id);
																				swal({
																					title: '您确定要更改此状态吗？',
																					type: 'question',
																					showCancelButton: true,
																					confirmButtonText: '确定',
																					cancelButtonText: '取消'
																				}).then(function () {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																						url:modifyProductTypeStatusUrl ,
																						data: {
																							type:planStatus,


																							productTypeIds:productTypeIds
																						},
																						success: function (result, status, xhr) {
																							if (result.status === 0) {
																								let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																								swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																							}else if(result.status === 4){
																								repeatFail()
																							}
																							else {
																								swallFail()	//操作失败
																							}
																						},
																					})
																				},
																					(dismiss) => {
																						target.val(dataList[currentTr.index()].product_type_status);
																					})
																			})

																		}
																			break;
																		case 5:{
																			currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																				let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																					craftID = dataList[currentTr.index()].product_model_type_id;
																				switch (dataContent) {
																					case '#detailModal': {	//详情
																						let dataContent = $('#detailModal'),
																							panelList = dataContent.find('.panel'),
																							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																							panelThead = panelList.find('thead'),
																							panelTbody = panelList.find('tbody');
																							panelList.find('.panel-heading').find('.modal-title').text('参数详情')

																							// dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
																							// 	$('body').addClass('modal-open')
																							// })

																							dataContent.modal({
																								backdrop: false, // 黑色遮罩不可点击
																								keyboard: false,  // esc按键不可弃用模态框
																								show: false
																							})
																							dataContent.modal('show') // 运行时显示

																						// 主表格添加内容
																						function addTableData(url, data) {
																							$.ajax({
																								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																										mesHorizontalTableAddData(panelList.find('table'), null, {
																											thead: '类型名称/类型编号/类型描述/使用状态/创建人员/创建时间',

																											// tableWitch: '25%/75%',
																											viewColGroup: 2,
																											importStaticData: (tbodyTd, length) => {
																												let map = result.map, // 映射
																													dataList = map.productTypes, // 主要数据列表
																													tempData = null; // 表格td内的临时数据
																												for (let i = 0, len = length; i < len; i++)
																													switch (i) {
																														case 0: {
																															tempData = dataList[0].product_type_name;
																															tbodyTd.eq(i).html(tempData)
																														}
																															break;
																														case 1: {
																															tempData = dataList[0].product_type_number;
																															tbodyTd.eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[0].product_type_describe;
																															tbodyTd.eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[0].product_type_status;
																															if (tempData === '0') {
																																tbodyTd.eq(i).html(`启用`)
																																}
																																else if (tempData === '1') {
																																tbodyTd.eq(i).html(`弃用`)
																																}
																														}
																															break;
																														case 4: {
																															tempData = dataList[0].product_type_creation_staff;
																															tbodyTd.eq(i).html(tempData)
																														}
																															break;
																														case 5: {
																															tempData = dataList[0].product_type_creation_time;
																															tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))

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

																						// 导航栏点击时运行数据加载
																						addTableData(queryProductTypeUrl, {
																							type: 'precise',
																							productTypeId: craftID,
																							headNum: 1
																						});

																						break;
																					}

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
														displayRow: result.map.productTypes.length// 显示行数
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
								addModalTableData(queryProductTypeUrl, {
									type:"vague",
									//  keyword:"",
									status:0,
									headNum: 1
								});

							// 2级头部主要按钮1点击事件,新增产品类型
								headingMainBtn_1.off('click').on('click', (event) => {

									let dataContent = submitModelModal,
										panelModal2 = dataContent.find('.panel'),
										modalCloseBtn = dataContent.find('.modal-header').find('.close'),
										modalSubmitBtn = dataContent.find('.modal-submit'),
										// 表单要提交的数据
										req = {
											typeName: '',
											typeNumber: '',
											typeDescribe: "",
											creationStaff: "",
											creationStaff: "",
											creationStaffId: "",


										};
										req.creationStaff = USERNAME
										req.creationStaffId = USERID

									// 修改标题
									panelModal2.find('.panel-heading').find('.panel-title').text('新增产品类型') // 更换panel标题

									dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
										$('body').addClass('modal-open')
									})
									dataContent.modal({
										backdrop: false, // 黑色遮罩不可点击
										keyboard: false,  // esc按键不可弃用模态框
										show: false
									})
									dataContent.modal('show') // 运行时显示
									modalCloseBtn.off('click').on('click', (event) => {
										// 点击弃用按钮隐藏该模态框
										dataContent.modal('hide')

										// 初始化表格
										panelModal2.find('thead').empty()
										panelModal2.find('tbody').empty()
									})
									//生成表单
									mesHorizontalTableAddData(panelModal2.find('table'), null, {
										thead: '类型名称/类型编号/类型描述',
										tableWitch: '20%/20%',
										viewColGroup: 2,
										importStaticData: (tbodyTd, length) => {
											let inputHtml ,
												selectHtml ;

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
															req.typeName = target.val().replace(/\s/g, "")
															if (!USERNAME_REG1.test(req.typeName)) {
																mesPopover.show()
															} else {
																mesPopover.hide()
															}
														})

													}
													break;
													case 1: {
														inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
														tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)

														// 添加到提交数据
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															req.typeNumber = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
														})

													}
														break;
													case 2: {
														inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on"  />`
														tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)

														// 添加到提交数据
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															req.typeDescribe =tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
															console.log(	req.typeDescribe)
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
										if (req.typeName !== '')
										{
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
													type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
													url: saveProductTypesUrl,
													data: req,

													success: function (result, status, xhr) {
														if (result.status === 0) {

															let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
															swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面

														} 
														else if(result.status === 4){
															repeatFail()
														}
														else {
															let msg = result.msg
															if(msg!==null){
																swallFail2(msg)
															}else{
																swallError();	//格式不正确
															}
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

								fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
									let val = $(this).closest('.input-group').find('input').val(),
									status=statusOption.val()
									event.stopPropagation() // 禁止向上冒泡
									if (val !== '') {
										addModalTableData(queryProductTypeUrl, {
											type: 'vague',
											keyWord: val,
											status:status,
											headNum: 1
										});
									}
									else {
										addModalTableData(queryProductTypeUrl, {
											type: 'vague',
											// craftBasicsId: '',
											// keyword: '',
											status: 0,
											headNum: 1
										});
									}

								});

								statusOption.off('change').on('change',function(){
									let status = $(this).val();
									addModalTableData(queryProductTypeUrl, {
										type:"vague",
										status: status,
										headNum: 1
									});
								})
						})

						// 头部主要按钮2点击事件，新增产品模型
						headingMainBtn_2.off('click').on('click', (event) => {

							let dataContent = $("#addProductDetailModal"),
								panelModal1 = dataContent.find('.panel'),
								modalCloseBtn = dataContent.find('.modal-header').find('.close'),
								modalSubmitBtn = dataContent.find('.modal-submit'),
								// 表单要提交的数据
								req = {
									typeId: '',
									modelName: '',
									modelGenre: '',
									modelNumber: '',
									modelUnit:'',
									ratedVoltage:'',//额定电压
									ratedVoltageUnit:"",//额定电压单位
									openVoltage:'',
									openVoltageUnit:'',//开路电压单位
									resistance:'',
									resistanceUnit:'',//内阻单位
									impedance:"",
									impedanceUnit:'',//阻抗单位
									modelShape: '',
									modelLong:"",	 //长
									modelWide:"",	 //宽
									modelHigh:"",	 // 高
									modeDiameter :"", //直径
									modelSizeUnit:"",//产品尺寸单位
									modelWeight:'',
									modelWeightUnit:'',//产品重量单位
									capacity:'',
									capacityUnit:'',//额定容量单位
									peculiarity: '',
									chargeDischarge:'',
									chargeDischargeUnit:'',//充放速率单位
									selfDicharge:'',
									selfDichargeUnit:'',	//自放电率单位
									temperature:'',
									temperatureUnit:'',	//使用温度单位
									safety: '',
									protection: '',
									storageLife: '',
									trait: '',
									serviceableRange: '',
									announcement: '',
									describe: '',
									creationStaff: '',
									creationStaffId: '',
								};
								req.creationStaff = USERNAME
								req.creationStaffId = USERID
							panelModal1.find('.panel-heading').find('.panel-title').text('新增产品模型') // 更换panel标题
							modalSubmitBtn.attr('disabled',false)

							mesHorizontalTableAddData(panelModal1.find('table'), null, {
								thead: '产品名称/产品类型/产品型号/产品编号/产品单位/额定电压/开路电压/电池内阻/电池阻抗/产品外形/产品尺寸/产品重量/额定容量/充电特性/充放速率/自放电率/使用温度/安全性能/环保性能/存储寿命/特点:/适用范围:/注意事项/产品备注',
								tableWitch: '10%/35%',
								viewColGroup: 2,
								importStaticData: (tbodyTd, length) => {
									let inputHtml = ``,
										selectHtml = `<select class="form-control table-input input-sm"></select>`,
										ProductTypeList=[]

									for (let i = 0, len = length; i < len; i++){
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
												req.modelName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												if (!USERNAME_REG1.test(req.modelName)) {
													mesPopover.show()
												} else {
													mesPopover.hide()
												}
											})

												break;
											}
											case 1: {
												selectHtml = `<select class="form-control table-input input-sm"></select>`,
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(selectHtml)

												let target = tbodyTd.eq(i).find('select');
												target.append('<option value="0">未选择</option>')
												for (let i = 0, len = productTypeList.length; i < len; i++) {
													let optionHtml = `<option value="${productTypeList[i].product_model_type_id}">${productTypeList[i].product_type_name}</option>`;
													target.append(optionHtml);
												}
												target.on('change', (event) => {
													req.typeId= target.val()
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
													req.modelGenre = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})

												break;
											}
											case 3: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.modelNumber = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 4: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.modelUnit = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 5: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,voltageUnit)

												// 添加到提交数据

												let value,
													mesPopover = new MesPopover(inputValue, { content: "请输入正确的数值"});

													req.ratedVoltageUnit=tbodyTd.eq(i).find('select').val(),

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.ratedVoltage = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.ratedVoltageUnit = unit
												})
												
											
												break;
											}

											case 6: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,voltageUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的电压值"});
												req.openVoltageUnit=tbodyTd.eq(i).find('select').val()


												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.openVoltage = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.openVoltageUnit = unit
												})

												// 添加到提交数据
												// tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												// 	req.openVoltage= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												// })
												break;
											}
											case 7: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,resistanceUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的数值"});;

												req.resistanceUnit=tbodyTd.eq(i).find('select').val()

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.resistance = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.resistanceUnit = unit
												})

												break;
											}
											case 8: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,resistanceUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的电阻值"});;

												req.impedanceUnit=tbodyTd.eq(i).find('select').val(),

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.impedance = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.impedanceUnit = unit
												})

												break;
											}
											case 9: {
												let selectHtml2 = ` <select class="form-control input-sm">
																					<option value="方形电池" selected>方形电池</option>
																					<option value="软包电池">软包电池</option>
																					<option value="圆柱电池">圆柱电池</option>
																				</select>`		;
												let term2=`
												<div class="input-group" style="box-sizing:border-box" id="Square">
														<div class="" style="margin:5px 0">
																<input type="text" class="" id="my_long" value="" size="6" placeholder="长高"/>&nbsp; <b>*</b>
																<input type="text" class="" id="my_diameter" value="" size="5" placeholder="直径"/>
														</div>
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
											`;
											let term=`
											<div class="input-group" style="box-sizing:border-box" id="roll">
													<div class="" style="margin:5px 0">
															<input type="text" class="" id="my_long" value="" size="6"  placeholder="长"/>&nbsp;*
															<input type="text" class="" id="my_wide" value="" size="6" placeholder="宽"/>&nbsp;*
															<input type="text" class="" id="my_height" value="" size="6" placeholder="高"/>
													</div>
													<div class="input-group-btn">
														<select class="form-control Voltage-type-option" style="
															width:57px;
															padding:3px 3px;
															border-top-right-radius: 5px;
															border-bottom-right-radius: 5px;
															background-color: #eee">
														</select>
												</div>
											</div>
									`;

												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(selectHtml2)
												tbodyTd.eq(i+1).html(term)
												req.modelShape = tbodyTd.eq(i).find('select').val()


												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													req.modelShape = tbodyTd.eq(i).find('select').val().replace(/\s/g, "")
													if(req.modelShape === "方形电池"|| req.modelShape === "软包电池"){
														tbodyTd.eq(i+1).html(term)
														tempdata=tbodyTd.eq(i+1).find("select")
														for (let i = 0, len = sizeUnit.length; i < len; i++) {
															let optionStr = `<option value="${sizeUnit[i]}">${sizeUnit[i]}</option>`;
															tempdata.append(optionStr);
														};
													}else if(req.modelShape === "圆柱电池"){
														tbodyTd.eq(i+1).html(term2)
														tempdata=tbodyTd.eq(i+1).find("select")
														for (let i = 0, len = sizeUnit.length; i < len; i++) {
															let optionStr = `<option value="${sizeUnit[i]}">${sizeUnit[i]}</option>`;
															tempdata.append(optionStr);
														};
													}
												})

												break;
											}
											case 10: {
												tbodyTd.eq(i).addClass('table-input-td')
												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input'),
													// inputValue_1=inputValue.eq(0),
													inputValue_1=$("#my_long"),
													inputValue_2=$("#my_wide"),
													inputValue_3=$("#my_wide"),
													inputValue_4=$("#my_diameter"),
													Square=$("#Square"),
													roll=$("#roll")
												createSelect(VoltageType,sizeUnit)
												// tbodyTd.eq(i).find('input').css({
												// 	"margin":"0,12px" ,
												// 	"padding":"1px,2px",
												// 	"width":"55px",
												// 	"higth":"20px",

												// })
												let value,

												mesPopover2 = new MesPopover(inputValue_2, { content: "请输入正确的数值"}),
												mesPopover3 = new MesPopover(inputValue_3, { content: "请输入正确的数值"}),
												mesPopover4 = new MesPopover(inputValue_4, { content: "请输入正确的数值"});
												req.modelSizeUnit=tbodyTd.eq(i).find('select').val()

												// tbodyTd.eq(i).find("#my_long").off('blur').on('blur', (event) => { //长/
													tbodyTd.eq(i).off('blur').on('blur','#my_long', (event) => { //长
														let 	inputValue_11=$("#my_long")
														let 	mesPopover = new MesPopover(inputValue_11, { content: "请输入正确的数值"})
													mesPopover.hide()
													value= $("#my_long").val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/ 
													if (value != "") { 
															if (!re.test(value)) { 
																mesPopover.show()
																$("#my_long").val("")
																$("#my_long").focus();
															}
													}
													req.modelLong = value
												})
												tbodyTd.eq(i).off('blur').on('blur','#my_wide', (event) => { //长
													let 	inputValue_11=$("#my_wide")
													let 	mesPopover = new MesPopover(inputValue_11, { content: "请输入正确的数值"})
													mesPopover.hide()
													value= $("#my_wide").val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																$("#my_wide").val("")
																$("#my_wide").focus();
															}
													}
													req.modelWide = value
												})
												tbodyTd.eq(i).off('blur').on('blur','#my_height', (event) => { //长
													let 	inputValue_11=$("#my_height")
													let 	mesPopover = new MesPopover(inputValue_11, { content: "请输入正确的数值"})
													mesPopover.hide()
													value= $("#my_height").val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																$("#my_height").val("")
																$("#my_height").focus();
															}
													}
													req.modelHigh = value
												})
												tbodyTd.eq(i).off('blur').on('blur','#my_diameter', (event) => { //长
													let 	inputValue_11=$("#my_diameter")
													let 	mesPopover = new MesPopover(inputValue_11, { content: "请输入正确的数值"})
													mesPopover.hide()
													value= $("#my_diameter").val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																$("#my_diameter").val("")
																$("#my_diameter").focus();
															}
													}
													req.modeDiameter = value
												})

												//单位
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.modelSizeUnit = unit
												})
												break;
											}
											case 11: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,weightUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的数值"});;

												req.modelWeightUnit=tbodyTd.eq(i).find('select').val(),

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.modelWeight = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.modelWeightUnit = unit
												})


												break;
											}
											case 12: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,capacityUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的电压值"});;

												req.capacityUnit=tbodyTd.eq(i).find('select').val(),

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.capacity= value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.capacityUnit = unit
												})
												break;
											}
											case 13: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.peculiarity = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 14: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,rateUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的电压值"});;

												req.chargeDischargeUnit=tbodyTd.eq(i).find('select').val(),

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.chargeDischarge = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.chargeDischargeUnit = unit
												})
												break;
											}
											case 15: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,rateUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的电压值"});;

												req.selfDichargeUnit=tbodyTd.eq(i).find('select').val(),

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.selfDicharge = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.selfDichargeUnit = unit
												})
												break;
											}
											case 16: {
												let term=`
												<div class="input-group">
														<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />
														<div class="input-group-btn">
																<select class="form-control Voltage-type-option" style="
																	width:57px;
																	padding:3px 3px;
																	border-top-right-radius: 5px;
																	border-bottom-right-radius: 5px;
																	background-color: #eee">
																</select>
														</div>
												</div>
												`;
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).append(term)

												let VoltageType=tbodyTd.eq(i).find('select');
												let inputValue=tbodyTd.eq(i).find('input');

												createSelect(VoltageType,temperatureUnit)

												// 添加到提交数据

												let value,
												mesPopover = new MesPopover(inputValue, { content: "请输入正确的数值"});;

												req.temperatureUnit=tbodyTd.eq(i).find('select').val(),

												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													value= tbodyTd.eq(i).find('input').val()
													var re = /^\d+(?=\.{0,1}\d+$|$)/
													if (value != "") {
															if (!re.test(value)) {
																mesPopover.show()
																	tbodyTd.eq(i).find('input').val("")
																	tbodyTd.eq(i).find('input').focus();
															}
													}
													req.temperature = value
												})
												tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
													unit = tbodyTd.eq(i).find('select').val()
													req.temperatureUnit = unit
												})

												break;
											}
											case 17: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.safety = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 18: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.protection = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}

											case 19: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.storageLife = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 20: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.trait = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 21: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.serviceableRange = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 22: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.announcement = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})
												break;
											}
											case 23: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on"/>`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.describe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
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
								if (req.modelName !== '' && req.typeId !== '') {
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
											type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
											url: saveProductModelsUrl,
											data: req,

											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}else {
													let msg = result.msg
													if(msg!==null){
														swallFail2(msg)
													}else{
														swallError();	//格式不正确
													}
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
			case '#processBasicInfo'://工艺基础信息
				(function () {
					let activeSwiper = $('#processBasicInfo'), // 右侧外部swiper
						activeSubSwiper = $('#processBasicInfoInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工艺基础信息
						staffTypeOption = activePanelHeading.find('.staff-type-option'), // 类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						});
					
					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
							url: url,
							data: data,
						//	headers : {'x-requested-with' : 'XMLHttpRequest'},
							beforeSend: function (xml) {
								// ajax发送前
								mesloadBox.loadingShow()
							},
							success: function (result, status, xhr) {
								paginationContainer.show()
								// ajax成功
								mesloadBox.hide()
								if (result.status === 0) {
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/工艺名称/工艺编号/工艺备注/使用状态/操作',
											theadWidth: '4%/15%/15%/15%/15%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td><select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">弃用</option></select></td>',
												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射zszs
													dataList = map.craftBasicsList, // 主要数据列表
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
																 tempData = dataList[currentTr.index()].craft_name;
																// tempData=
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].craft_number;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].craft_basics_describe;
																currentTr.children().eq(i).html(tempData)
															}
																break;
															case 4: {
																let  craftBasicsIds = []
																	tempStr = `
																<select class="form-control table-input input-sm">
																  <option value="0">启用</option>
																  <option value="1">弃用</option>
																</select>
																  `;
																  tempData = dataList[currentTr.index()].craft_basics_status;

																  currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
																let	target = currentTr.children().eq(i).find('select');
																target.val(tempData);

																target.off('change').on('change', function () {
																  let planStatus = $(this).val();
																  if(planStatus == 0 ){
																	planStatus = 'recover'
																  }else {
																	planStatus = 'deprecated'
																  }
																  craftBasicsIds.push(dataList[currentTr.index()].craft_basics_id);
																  swal({
																	  title: '您确定要更改此状态吗？',
																	  type: 'question',
																	  showCancelButton: true,
																	  confirmButtonText: '确定',
																	  cancelButtonText: '取消'
																  }).then(function (){
																	  $.ajax({
																		  type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
																		  url:modifyCraftBasicsStatusUrl,
																		  data: {

																			type:planStatus,

																			craftBasicsIds:craftBasicsIds

																		  },
																		  success: function (result, status, xhr) {
																			  if (result.status === 0) {
																				  let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																				  swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																				}else if(result.status === 4){
																					repeatFail()
																				}
																				
																			  else {
																				  swallFail()	//操作失败
																			  }
																		  },
																	  })
																  },
																	  (dismiss) => {
																		  target.val(dataList[currentTr.index()].craft_basics_status);
																	  })
															  })
															}
																break;
															case 5:
																currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		craftID = dataList[currentTr.index()].craft_basics_id;
																	switch (dataContent) {
																		case '#detailModal': {	//详情
																			let dataContent = $('#detailModal'),
																				panelList = dataContent.find('.panel'),

																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),

																				panelThead = panelList.find('thead'),
																				panelTbody = panelList.find('tbody');

																				panelList.find('.panel-heading').find('.modal-title').text('工艺详情') // 更换panel标题

																			// 主表格添加内容
																			function addTableData(url, data) {
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																							mesHorizontalTableAddData(panelList.find('table'), null, {
																								thead: '工艺名称/工艺编号/工艺备注/使用状态/创建时间/创建人员',

																								// tableWitch: '25%/75%',
																								viewColGroup: 2,
																								importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.craftBasicsList, // 主要数据列表
																										tempData = null; // 表格td内的临时数据
																									for (let i = 0, len = length; i < len; i++)
																										switch (i) {
																											case 0: {
																												tempData = dataList[0].craft_name;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 1: {
																												tempData = dataList[0].craft_number;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[0].craft_basics_describe;
																												tbodyTd.eq(i).html(tempData)
																											}
																												break;
																											case 3: {
																												tempData = dataList[0].craft_basics_status;
																												if (tempData === '0') {
																													tbodyTd.eq(i).html(`启用`)
																													}
																												   else if (tempData === '1') {
																													tbodyTd.eq(i).html(`弃用`)
																													}
																											}
																												break;
																											case 4: {
																												tempData = dataList[0].craft_basics_creation_time;
																												// currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																												tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																											}
																												break;
																											case 5: {
																												tempData = dataList[0].craft_basics_creation_staff;
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
																							mesloadBox.warningShow();
																						}
																					}
																				})
																			}

																			// 导航栏点击时运行数据加载
																			addTableData(queryCraftBasicsUrl, {
																				type: 'precise',
																				craftBasicsId: craftID,
																				headNum: 1
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
											totalRow: result.map.count, // 总行数
											displayRow: result.map.craftBasicsList.length // 显示行数
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
							},
				// 			complete : 
				// function(XMLHttpRequest, textStatus) {
				// 	// 通过XMLHttpRequest取得响应头，sessionstatus
				// 	var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
				// 	if (sessionstatus == "TIMEOUT") {	
				// 	var win = window;
				// 		while (win != win.top){
				// 			win = win.top;
				// 	}
				// 		win.location.href= XMLHttpRequest.getResponseHeader("CONTEXTPATH");
				// 	}
				// },
						})
					}

					// 导航栏点击时运行数据加载
					addTableData(queryCraftBasicsUrl, {
						type: 'vague',
						status:0,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val(),
						status=staffTypeOption.val()
						event.stopPropagation() // 禁止向上冒泡
						addTableData(queryCraftBasicsUrl, {
							type: 'vague',
							keyword: val,
							status: status,
							headNum: 1
						});

					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
						}

					});

					// 下拉选事件
					staffTypeOption.off("change").on("change",function(){
						let status = $(this).val();
						addTableData(queryCraftBasicsUrl, {
							type: 'vague',
							status: status,
							headNum: 1
						});
					})
					// 头部主要按钮1点击事件 新增工艺模态框
					headingMainBtn_1.off('click').on('click', (event) => {

						let dataContent = $('#submitModelModal'),
							panelModal1 = dataContent.find('.panel'),
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							modalSubmitBtn = dataContent.find('.modal-submit'),
							// 表单要提交的数据
							craftBasics = {
								// craft_basics_id: null,
								// craft_basics_creation_time: null,
								craft_name:"",
								craft_number:"",
								craft_basics_describe:"",
								craft_basics_status: '',
								craft_basics_creation_staff: '',
								craft_basics_creation_staff_id: '',


							};
							craftBasics.craft_basics_creation_staff = USERNAME
							craftBasics.craft_basics_creation_staff_id = USERID
						panelModal1.find('.panel-heading').find('.panel-title').text('新增工艺基础信息') // 更换panel标题

						mesHorizontalTableAddData(panelModal1.find('table'), null, {
							thead: '工艺名称/工艺编号/工艺备注/使用状态',
							tableWitch: '30%',
							viewColGroup: 1,
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
												craftBasics.craft_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
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
												craftBasics.craft_number = tbodyTd.eq(i).find('input').val()
											})


											break;
										}
										case 2: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												craftBasics.craft_basics_describe = tbodyTd.eq(i).find('input').val()
											})
											break;
										}
										case 3: {
											inputHtml = `<select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">隐藏</option></select>`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											craftBasics.craft_basics_status =0
											// 添加到提交数据
											tbodyTd.eq(i).find('select').off('change').on('change', (event) => {
												craftBasics.craft_basics_status = tbodyTd.eq(i).find('select').val()
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
							if (craftBasics.craft_name !== '' && USERNAME_REG1.test(craftBasics.craft_name)) {
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
										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
										url: saveCraftBasicsUrl,
										dataType:"json",
										// async: false, //设置为同步请求
										data:craftBasics,
										success: function (result, status, xhr) {
											if (result.status === 0) {
												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											}else if(result.status === 7){
												repeatFail()
											}
											else {
												let msg = result.msg
												if(msg!==null){
													swallFail2(msg)
												}else{
													swallError();	//格式不正确
												}
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

				}())
			   break;
			case '#proSectionBasicInfo'://工艺段基础信息
			   (function () {
				   let activeSwiper = $('#proSectionBasicInfo'), // 右侧外部swiper
					   activeSubSwiper = $('#proSectionBasicInfoInerSwiper'), // 右侧内部swiper
						 activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						 panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						 paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
					   activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
					   headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工艺基础信息

					   staffTypeOption = activePanelHeading.find('.staff-type-option'), // 类型选项
					   fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
					   mesloadBox = new MesloadBox(activePanel, {
						   // 主数据载入窗口
						   warningContent: '没有此类信息，请重新选择或输入'
					   });
					   //创建设备类型下拉选
				   // createProductTypeSelect(ProductTypeOption);
				   // 主表格添加内容
				   function addTableData(url, data) {
					   $.ajax({
						   type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
						   url: url,
						   data: data,
						   beforeSend: function (xml) {
							   // ajax发送前
							   mesloadBox.loadingShow()
						   },
						   success: function (result, status, xhr) {
								paginationContainer.show()
							   mesloadBox.hide()
							   if (result.status === 0) {
								   mesVerticalTableAddData(activePanel, {
									   thead: {
										   theadContent: '序号/工艺段名称/工艺段编号/工艺段备注/使用状态/操作',
										   theadWidth: '4%/15%/15%/15%/15%/15%'
									   },
									   tbody: {
										   html: [
											   '<td></td>',
											   '<td></td>',
											   '<td></td>',
											   '<td></td>',
											   '<td><select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">弃用</option></select></td>',
											   '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
										   ],

										   // 添加表格主体数据, 这是一个回调函数,这里不需要传参
										   dataAddress: function (tbodyTarget, html, result) {
											   tbodyTarget.empty() // 清空表格主体
											   let map = result.map, // 映射
												   dataList = map.craftSegmentDasicsList, // 主要数据列表
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
															   tempData = dataList[currentTr.index()].craft_segment_name;
															   currentTr.children().eq(i).html(tempData)
														   }
															   break;
														   case 2: {
															   tempData = dataList[currentTr.index()].craft_segment_number;
															   currentTr.children().eq(i).html(tempData)
														   }
															   break;
														   case 3: {
															   tempData = dataList[currentTr.index()].craft_segment_basics_describe;
															   currentTr.children().eq(i).html(tempData)
														   }
															   break;
														   case 4: {
															   let  craftBasicsIds=[]

															   tempStr = `
															   <select class="form-control table-input input-sm">
																 <option value="0">启用</option>
																 <option value="1">弃用</option>
															   </select>
																 `;
															   tempData = dataList[currentTr.index()].craft_segment_basics_status;
															   currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
															   let	target = currentTr.children().eq(i).find('select');
															   target.val(tempData);

															   target.off('change').on('change', function () {
																 let planStatus = $(this).val();
																 if(planStatus == 0 ){
																	planStatus = 'recover'
																  }else {
																	planStatus = 'deprecated'
																  }
																  craftBasicsIds.push(dataList[currentTr.index()].craft_segment_basics_id);
																 swal({
																	 title: '您确定要更改此状态吗？',
																	 type: 'question',
																	 showCancelButton: true,
																	 confirmButtonText: '确定',
																	 cancelButtonText: '取消'
																 }).then(function () {
																	 $.ajax({
																		 type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
																		 url:modifyCraftSegmentBasicsStatusUrl,
																		 data: {
																			type:planStatus,
																			craftSegmentBasicsIds:craftBasicsIds
																		 },
																		 success: function (result, status, xhr) {
																			 if (result.status === 0) {
																				 let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																				 swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																			 }else if(result.status === 4){
																				repeatFail()
																			}
																			 else {
																				 swallFail()	//操作失败
																			 }
																		 },
																	 })
																 },
																	 (dismiss) => {
																		 target.val(dataList[currentTr.index()].craft_segment_basics_status);
																	 })
															 })
														   }
															   break;
														   case 5:
															   currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																   let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																	   craftID = dataList[currentTr.index()].craft_segment_basics_id;
																   switch (dataContent) {
																	   case '#detailModal': {	//详情
																		   let dataContent = $('#detailModal'),
																			   panelList = dataContent.find('.panel'),

																			   modalCloseBtn = dataContent.find('.modal-header').find('.close'),

																			   panelThead = panelList.find('thead'),
																				 panelTbody = panelList.find('tbody');

																				 panelList.find('.panel-heading').find('.modal-title').text('工艺段详情') // 更换panel标题

																		   // 主表格添加内容
																		   function addTableData(url, data) {
																			   $.ajax({
																				   type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
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
																						   mesHorizontalTableAddData(panelList.find('table'), null, {
																							   thead: '工艺段名称/工艺段编号/工艺段备注/使用状态/创建时间/创建人员',

																							   // tableWitch: '25%/75%',
																							   viewColGroup: 2,
																							   importStaticData: (tbodyTd, length) => {
																								   let map = result.map, // 映射
																									   dataList = map.CraftSegmentDasicsList, // 主要数据列表
																									   tempData = null; // 表格td内的临时数据
																								   for (let i = 0, len = length; i < len; i++)
																									   switch (i) {
																										   case 0: {
																											   tempData = dataList[0].craft_segment_name;
																											   tbodyTd.eq(i).eq(i).html(tempData)
																										   }
																											   break;
																										   case 1: {
																											   tempData = dataList[0].craft_segment_number;
																											   tbodyTd.eq(i).html(tempData)
																										   }
																											   break;
																										   case 2: {
																											   tempData = dataList[0].craft_segment_basics_describe;
																											   tbodyTd.eq(i).html(tempData)
																										   }
																											   break;
																										   case 3: {
																											   tempData = dataList[0].craft_segment_basics_status;
																											   if (tempData === '0') {
																												tbodyTd.eq(i).html("启用")
																												}
																											   else if (tempData === '1') {
																												tbodyTd.eq(i).html("弃用")
																												}
																										   }
																											   break;
																										   case 4: {
																											   tempData = dataList[0].craft_segment_basics_creation_time;
																											   tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																										   }
																											   break;
																										   case 5: {
																											   tempData = dataList[0].craft_segment_basics_creation_staff;
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
																						   mesloadBox.warningShow();
																					   }
																				   }
																			   })
																		   }

																		   // 导航栏点击时运行数据加载
																		   addTableData(queryCraftSegmentBasicsUrl, {
																			   type: 'precise',
																			   craftSegmentBasicsId: craftID,
																			   headNum: 1
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
										   totalRow: result.map.count, // 总行数
										   displayRow: result.map.craftSegmentDasicsList.length // 显示行数
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
				   addTableData(queryCraftSegmentBasicsUrl, {
						 type: 'vague',
						 status:0,
					   headNum: 1
				   });

				   // 模糊搜索组加载数据
				   fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						 let val = $(this).closest('.input-group').find('input').val();
						 let status=staffTypeOption.val()
					   event.stopPropagation() // 禁止向上冒泡
					   if (val !== '') {
						   addTableData(queryCraftSegmentBasicsUrl, {
							type: 'vague',
							keyword: val,
							status: status,
							headNum: 1
						   });
					   }
					   else {
						   // 为空时重置搜索
						   addTableData(queryCraftSegmentBasicsUrl, {
							type: 'vague',
							// craftBasicsId: '',
							// keyword: '',
							 status:0,
							headNum: 1
						});
						//    return;
					   }

				   });

				   // 模糊搜索回车搜索
				   fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
					   if (event.keyCode === 13) {
						   event.preventDefault()
						   $(this).closest('.input-group').find('button').trigger('click')
					   }

				   });

				   // 下拉选事件
				   staffTypeOption.off("change").on("change",function(){
					   let currentProductTypeID = $(this).val();

					   addTableData(queryCraftSegmentBasicsUrl, {
						   type: 'vague',
						   status: currentProductTypeID,
						   headNum: 1
					   });

				   })
				   // 头部主要按钮1点击事件，新增工艺段模态框
				   headingMainBtn_1.off('click').on('click', (event) => {

					   let dataContent = $("#submitModelModal"),
						   panelModal1 = dataContent.find('.panel'),
						   modalCloseBtn = dataContent.find('.modal-header').find('.close'),
						   modalSubmitBtn = dataContent.find('.modal-submit'),
						   // 表单要提交的数据
						   craftSegmentDasics= {
								craft_segment_name: '',
								craft_segment_number:"",
								craft_segment_basics_describe:"",
								craft_segment_basics_status:"",
								craft_segment_basics_creation_staff: '',
								craft_segment_basics_creation_staff_id: '',

							};
							craftSegmentDasics.craft_segment_basics_creation_staff = USERNAME
							craftSegmentDasics.craft_segment_basics_creation_staff_id = USERID
					   panelModal1.find('.panel-heading').find('.panel-title').text('新增工艺段基础信息') // 更换panel标题

					   mesHorizontalTableAddData(panelModal1.find('table'), null, {
						   thead: '工艺段名称/工艺段编号/工艺段备注/使用状态',
						   tableWitch: '30%',
						   viewColGroup: 1,
						   importStaticData: (tbodyTd, length) => {
							   let inputHtml;

							   for (let i = 0, len = length; i < len; i++) {
								   switch (i) {
									   case 0: {
										   inputHtml = `<input type="text" class="table-input" placeholder="请输入工艺段(必填)" autocomplete="on" />`;
										   tbodyTd.eq(i).addClass('table-input-td')
										   tbodyTd.eq(i).html(inputHtml)

										   let target = tbodyTd.eq(i).find('input'),
										   mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });
										//    tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
										// 	craftSegmentDasics.craft_segment_name = tbodyTd.eq(i).find('input').val()
										//    })

										   tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												mesPopover.hide()
												craftSegmentDasics.craft_segment_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												if (!USERNAME_REG1.test(craftSegmentDasics.craft_segment_name)) {
												mesPopover.show()
												} else {
												mesPopover.hide()
											}
											})


										   break;
									   }
									   case 1: {
										   inputHtml = `<input type="text" class="table-input" placeholder="请输入工艺段编号(必填)" autocomplete="on" />`;
										   tbodyTd.eq(i).addClass('table-input-td')
										   tbodyTd.eq(i).html(inputHtml)
										   tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											craftSegmentDasics.craft_segment_number = tbodyTd.eq(i).find('input').val()
										   })


										   break;
									   }
									   case 2: {
										inputHtml = `<input type="text" class="table-input" placeholder="请输入工艺段描述" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										   tbodyTd.eq(i).html(inputHtml)

										   // 添加到提交数据
										   tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											craftSegmentDasics.craft_segment_basics_describe = tbodyTd.eq(i).find('input').val()
										   })
										   break;
									   }
									   case 3: {
										   inputHtml = `<select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">隐藏</option></select>`
										   tbodyTd.eq(i).addClass('table-input-td')
										   tbodyTd.eq(i).html(inputHtml)
										   craftSegmentDasics.craft_segment_basics_status=0
										   // 添加到提交数据
										   tbodyTd.eq(i).find('select').off('blur').on('blur', (event) => {
										  	craftSegmentDasics.craft_segment_basics_status = tbodyTd.eq(i).find('select').val()
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
						   if (craftSegmentDasics.craft_segment_basics_id !== '') {
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
									   type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
									   url: saveCraftSegmentBasicsUrl,
									   dataType:"json",
									   async: false, //设置为同步请求
									   data:craftSegmentDasics,

									   success: function (result, status, xhr) {
										   if (result.status === 0) {

											   let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn').filter('.active')
											   swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
										   }else if(result.status === 7){
												repeatFail()
											}else {
												let msg = result.msg
												if(msg!==null){
													swallFail2(msg)
												}else{
													swallError();	//格式不正确
												}
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
			case '#procedureBasicInfo'://工序基础信息
			  (function () {
				  let activeSwiper = $('#procedureBasicInfo'), // 右侧外部swiper
					  activeSubSwiper = $('#procedureBasicInfoInerSwiper'), // 右侧内部swiper
					  activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
					  activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工艺基础信息
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签

					  staffTypeOption = activePanelHeading.find('.staff-type-option'), // 类型选项
					  fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
					  mesloadBox = new MesloadBox(activePanel, {
						  // 主数据载入窗口
						  warningContent: '没有此类信息，请重新选择或输入'
					  });
					  //创建设备类型下拉选
				  // createProductTypeSelect(ProductTypeOption);
				  // 主表格添加内容
				  function addTableData(url, data) {
					  $.ajax({
						  type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
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
										  theadContent: '序号/工序名称/工序编号/工序备注/使用状态/操作',
										  theadWidth: '4%/15%/15%/15%/15%/15%'
									  },
									  tbody: {
										  html: [
											  '<td></td>',
											  '<td></td>',
											  '<td></td>',
											  '<td></td>',
											  '<td><select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">弃用</option></select></td>',
											  '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
										  ],

										  // 添加表格主体数据, 这是一个回调函数,这里不需要传参
										  dataAddress: function (tbodyTarget, html, result) {
											  tbodyTarget.empty() // 清空表格主体
											  let map = result.map, // 映射
												  dataList = map.workstageBasicsList, // 主要数据列表
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
															  tempData = dataList[currentTr.index()].workstage_name;
															  currentTr.children().eq(i).html(tempData)
														  }
															  break;
														  case 2: {
															  tempData = dataList[currentTr.index()].workstage_number;
															  currentTr.children().eq(i).html(tempData)
														  }
															  break;
														  case 3: {
															  tempData = dataList[currentTr.index()].workstage_basics_describe;
															  currentTr.children().eq(i).html(tempData)
														  }
															  break;
														  case 4: {
																let craftBasicsIds=[]

																tempStr = `
																<select class="form-control table-input input-sm">
																  <option value="0">启用</option>
																  <option value="1">弃用</option>
																</select>
																  `;
																tempData = dataList[currentTr.index()].workstage_basics_status;
																currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
																let	target = currentTr.children().eq(i).find('select');
																target.val(tempData);

																target.off('change').on('change', function () {
																  let planStatus = $(this).val();
																  if(planStatus == 0 ){
																	planStatus = 'recover'
																  }else {
																	planStatus = 'deprecated'
																  }
																  craftBasicsIds.push(dataList[currentTr.index()].workstage_basics_id);
																  swal({
																	  title: '您确定要更改此状态吗？',
																	  type: 'question',
																	  showCancelButton: true,
																	  confirmButtonText: '确定',
																	  cancelButtonText: '取消'
																  }).then(function () {
																	  $.ajax({
																		  type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
																		  url:modifyWorkstageBasicsStatusUrl,
																		  data: {
																			type:planStatus,
																			workstageBasicsIds:craftBasicsIds
																		  },
																		  success: function (result, status, xhr) {
																			  if (result.status === 0) {
																				  let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																				  swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																			  }else if(result.status === 4){
																					repeatFail()
																				}
																			  else {
																				  swallFail()	//操作失败
																			  }
																		  },
																	  })
																  },
																	  (dismiss) => {
																		  target.val(dataList[currentTr.index()].workstage_basics_status);
																	  })
															  })
															}
															  break;
															case 5:
															  currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																  let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																	  craftID = dataList[currentTr.index()].workstage_basics_id;
																  switch (dataContent) {
																	  case '#detailModal': {	//详情
																		  let dataContent = $('#detailModal'),
																			  panelList = dataContent.find('.panel'),
																			  modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																			  panelThead = panelList.find('thead'),
																				panelTbody = panelList.find('tbody');
																				panelList.find('.panel-heading').find('.modal-title').text('工序详情') // 更换panel标题

																		  // 主表格添加内容
																		  function addTableData(url, data) {
																			  $.ajax({
																				  type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
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
																						  mesHorizontalTableAddData(panelList.find('table'), null, {
																							  thead: '工序名称/工序编号/工序备注/使用状态/创建时间/创建人员',

																							  // tableWitch: '25%/75%',
																							  viewColGroup: 2,
																							  importStaticData: (tbodyTd, length) => {
																								  let map = result.map, // 映射
																									  dataList = map.workstageBasicsList, // 主要数据列表
																									  tempData = null; // 表格td内的临时数据
																								  for (let i = 0, len = length; i < len; i++)
																									  switch (i) {
																										  case 0: {
																											  tempData = dataList[0].workstage_name;
																											  tbodyTd.eq(i).html(tempData)
																										  }
																											  break;
																										  case 1: {
																											  tempData = dataList[0].workstage_number;
																											  tbodyTd.eq(i).html(tempData)
																										  }
																											  break;
																										  case 2: {
																											  tempData = dataList[0].workstage_basics_describe;
																											  tbodyTd.eq(i).html(tempData)
																										  }
																											  break;
																										  case 3: {
																											  tempData = dataList[0].workstage_basics_status;
																											  if (tempData === '0') {
																												tbodyTd.eq(i).html(`启用`)
																												}
																											   else if (tempData === '1') {
																												tbodyTd.eq(i).html(`弃用`)
																												}
																										  }
																											  break;
																										  case 4: {
																											  tempData = dataList[0].workstage_basics_creation_time;
																											  tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																										  }
																											  break;
																										  case 5: {
																											  tempData = dataList[0].workstage_basics_creation_staff;
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
																						  mesloadBox.warningShow();
																					  }
																				  }
																			  })
																		  }

																		  // 导航栏点击时运行数据加载
																		  addTableData(queryWorkstageBasicsUrl, {
																			  type: 'precise',
																			  workstageBasicId: craftID,
																			  headNum: 1
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
										  totalRow: result.map.count, // 总行数
										  displayRow: result.map.workstageBasicsList.length // 显示行数
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
				  addTableData(queryWorkstageBasicsUrl, {
						type: 'vague',
						status:0,
					  headNum: 1
				  });

				  // 模糊搜索组加载数据
				  fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val();
						let status = staffTypeOption.val();
					  event.stopPropagation() // 禁止向上冒泡
					  if (val !== '') {
						  addTableData(queryWorkstageBasicsUrl, {
							type: 'vague',
							keyword: val,
							status: status,
							headNum: 1
						  });
					  }
					  else {
						addTableData(queryWorkstageBasicsUrl, {
							type: 'vague',
							// craftBasicsId: '',
							// keyword: '',
							status: 0,
							headNum: 1
						});
					  }

				  });

				  // 模糊搜索回车搜索
				  fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
					  if (event.keyCode === 13) {
						  event.preventDefault()
						  $(this).closest('.input-group').find('button').trigger('click')
					  }

				  });

				  // 下拉选事件
				  staffTypeOption.off("change").on("change",function(){
					  let status = $(this).val();
					  addTableData(queryWorkstageBasicsUrl, {
						type: 'vague',
						status: status,
						headNum: 1
					  });
				  })
				  // 头部主要按钮1点击事件，新增工序模态框
				  headingMainBtn_1.off('click').on('click', (event) => {

					  let dataContent = $("#submitModelModal"),
						  panelModal1 = dataContent.find('.panel'),
						  modalCloseBtn = dataContent.find('.modal-header').find('.close'),
						  modalSubmitBtn = dataContent.find('.modal-submit'),
						  // 表单要提交的数据
						  workstageBasics = {
							  workstage_name:"",
							  workstage_number:"",
							  workstage_basics_describe:"",
							  workstage_basics_status: '',
							  workstage_basics_creation_staff:'',
							  workstage_basics_creation_staff_id:'',
		

						  };
						workstageBasics.workstage_basics_creation_staff = USERNAME
						workstageBasics.workstage_basics_creation_staff_id = USERID

					  panelModal1.find('.panel-heading').find('.panel-title').text('新增工序基础信息') // 更换panel标题

					  mesHorizontalTableAddData(panelModal1.find('table'), null, {
						  thead: '工序名称/工序编号/工序备注/使用状态',
						  tableWitch: '30%',
						  viewColGroup: 1,
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
											workstageBasics.workstage_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											if (!USERNAME_REG1.test(workstageBasics.workstage_name)) {
												mesPopover.show()
											} else {
												mesPopover.hide()
											}
										})

										break;
									  }
									  case 1: {
										  inputHtml = `<input type="text" class="table-input" placeholder="请输入工序编号(必填)" autocomplete="on" />`;
										  tbodyTd.eq(i).addClass('table-input-td')
										  tbodyTd.eq(i).html(inputHtml)
										  tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											workstageBasics.workstage_number = tbodyTd.eq(i).find('input').val()
										  })


										  break;
									  }
									  case 2: {
									   inputHtml = `<input type="text" class="table-input" placeholder="请输入工序描述" autocomplete="on" />`;
									   tbodyTd.eq(i).addClass('table-input-td')
										  tbodyTd.eq(i).html(inputHtml)

										  // 添加到提交数据
										  tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											workstageBasics.workstage_basics_describe = tbodyTd.eq(i).find('input').val()
										  })
										  break;
									  }
									  case 3: {
										  inputHtml = `<select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">隐藏</option></select>`
										  tbodyTd.eq(i).addClass('table-input-td')
										  tbodyTd.eq(i).html(inputHtml)
										  workstageBasics.workstage_basics_status =0
										  // 添加到提交数据
										  tbodyTd.eq(i).find('select').off('blur').on('blur', (event) => {
											workstageBasics.workstage_basics_status = tbodyTd.eq(i).find('select').val()
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
						  if (workstageBasics.workstage_basics_id !== '') {
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
									  type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
									  url: saveWorkstageBasicsUrl,
									  dataType:"json",
									  async:false,
									  data:workstageBasics,

									  success: function (result, status, xhr) {
										  if (result.status === 0) {

											  let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
											  swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
										  }else if(result.status === 7){
												repeatFail()
											}else {
												let msg = result.msg
												if(msg!==null){
													swallFail2(msg)
												}else{
													swallError();	//格式不正确
												}
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
			case '#stepBasicInfo'://工步基础信息
			 (function () {
				 let activeSwiper = $('#stepBasicInfo'), // 右侧外部swiper
					 activeSubSwiper = $('#stepBasicInfoInerSwiper'), // 右侧内部swiper
					 activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
					 activePanelHeading = activePanel.find('.panel-heading'), // 面板头部

					 panelTbody = activePanel.find('table tbody'),	//面包表格tbody
					 paginationContainer = activePanel.find('.pagination'),		// 分页ul标签

					 headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工艺基础信息

					 staffTypeOption = activePanelHeading.find('.staff-type-option'), // 类型选项
					 fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
					 mesloadBox = new MesloadBox(activePanel, {
						 // 主数据载入窗口
						 warningContent: '没有此类信息，请重新选择或输入'
					 });
					 //创建设备类型下拉选
				 // createProductTypeSelect(ProductTypeOption);
				 // 主表格添加内容
				 function addTableData(url, data) {
					 $.ajax({
						 type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
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
										 theadContent: '序号/工步名称/工步编号/工步备注/使用状态/操作',
										 theadWidth: '4%/15%/15%/15%/15%/15%'
									 },
									 tbody: {
										 html: [
											 '<td></td>',
											 '<td></td>',
											 '<td></td>',
											 '<td></td>',
											 '<td><select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">弃用</option></select></td>',
											 '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
										 ],

										 // 添加表格主体数据, 这是一个回调函数,这里不需要传参
										 dataAddress: function (tbodyTarget, html, result) {
											 tbodyTarget.empty() // 清空表格主体
											 let map = result.map, // 映射
												 dataList = map.resultList, // 主要数据列表
												 tempData = null,// 表格td内的临时数据
												  workstepBasicsIds=[]

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
															 tempData = dataList[currentTr.index()].craft_workstep_basics_name;
															 currentTr.children().eq(i).html(tempData)
														 }
															 break;
														 case 2: {
															 tempData = dataList[currentTr.index()].craft_workstep_basics_num;
															 currentTr.children().eq(i).html(tempData)
														 }
															 break;
														 case 3: {
															 tempData = dataList[currentTr.index()].craft_workstep_basics_describle;
															 currentTr.children().eq(i).html(tempData)
														 }
															 break;
														 case 4: {
															 tempStr = `
															 <select class="form-control table-input input-sm">
																 <option value="0">启用</option>
																 <option value="1">弃用</option>
															 </select>
																 `;
															 tempData = dataList[currentTr.index()].craft_workstep_basics_status;
															 currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
															 let	target = currentTr.children().eq(i).find('select');
															 target.val(tempData);

															 target.off('change').on('change', function () {
																 let planStatus = $(this).val();
																 if(planStatus == 0 ){
																 planStatus = 'recover'
																 }else {
																 planStatus = 'deprecated'
																 }
																 workstepBasicsIds.push(dataList[currentTr.index()].craft_workstep_basics_id);
																 swal({
																	 title: '您确定要更改此状态吗？',
																	 type: 'question',
																	 showCancelButton: true,
																	 confirmButtonText: '确定',
																	 cancelButtonText: '取消'
																 }).then(function () {
																	 $.ajax({
																		 type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
																		 url:modifyStepBasicsStatusUrl,
																		 data: {
																		 type:planStatus,


																		 stepBasicsIds:workstepBasicsIds

																		 },
																		 success: function (result, status, xhr) {
																			 if (result.status === 0) {
																				 let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																				 swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																			 }else if(result.status === 4){
																				repeatFail()
																			}
																			 else {
																				 swallFail()	//操作失败
																			 }
																		 },
																	 })
																 },
																	 (dismiss) => {
																		 target.val(dataList[currentTr.index()].craft_workstep_basics_status);
																	 })
															 })
														 }
															 break;
														 case 5:
															 currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																 let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																	 craftID = dataList[currentTr.index()].craft_workstep_basics_id;
																 switch (dataContent) {
																	 case '#detailModal': {	//详情
																		 let dataContent = $('#detailModal'),
																			 panelList = dataContent.find('.panel'),

																			 modalCloseBtn = dataContent.find('.modal-header').find('.close'),

																			 panelThead = panelList.find('thead'),
																			 panelTbody = panelList.find('tbody')

																			 panelList.find('.panel-heading').find('.modal-title').text("工步详情") // 更换panel标题

																		 // 主表格添加内容
																		 function addTableData(url, data) {
																			 $.ajax({
																				 type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
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
																						 mesHorizontalTableAddData(panelList.find('table'), null, {
																							 thead: '工步名称/工步编号/工步备注/使用状态/创建时间/创建人员',

																							 // tableWitch: '25%/75%',
																							 viewColGroup: 2,
																							 importStaticData: (tbodyTd, length) => {
																								 let map = result.map, // 映射
																									 dataList = map.resultList, // 主要数据列表
																									 tempData = null; // 表格td内的临时数据
																								 for (let i = 0, len = length; i < len; i++)
																									 switch (i) {
																										 case 0: {
																											 tempData = dataList[0].craft_workstep_basics_name;
																											 tbodyTd.eq(i).html(tempData)
																										 }
																											 break;
																										 case 1: {
																											 tempData = dataList[0].craft_workstep_basics_num;
																											 tbodyTd.eq(i).html(tempData)
																										 }
																											 break;
																										 case 2: {
																											 tempData = dataList[0].craft_workstep_basics_describle;
																											 tbodyTd.eq(i).html(tempData)
																										 }
																											 break;
																										 case 3: {
																											 tempData = dataList[0].craft_workstep_basics_status;
																											 if (tempData === '0') {
																											 tbodyTd.eq(i).html(`启用`)
																											 }
																												else if (tempData === '1') {
																											 tbodyTd.eq(i).html(`弃用`)
																											 }
																										 }
																											 break;
																										 case 4: {
																											 tempData = dataList[0].craft_workstep_basics_creation_time;
																											 tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																										 }
																											 break;
																										 case 5: {
																											 tempData = dataList[0].craft_workstep_basics_creation_staff;
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
																						 mesloadBox.warningShow();
																					 }
																				 }
																			 })
																		 }

																		 // 导航栏点击时运行数据加载
																		 addTableData(queryStepBasicsUrl, {
																			 type: 'precise',
																			 stepBasicsId: craftID,
																			 headNum: 1
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
										 totalRow: result.map.counts, // 总行数
										 displayRow: result.map.resultList.length // 显示行数
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
				 addTableData(queryStepBasicsUrl, {
					 type: 'vague',
					 status:0,
					 headNum: 1
				 });

				 // 模糊搜索组加载数据
				 fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
					 let val = $(this).closest('.input-group').find('input').val();
					 let status = staffTypeOption.val();
					 event.stopPropagation() // 禁止向上冒泡
					 if (val !== '') {
						 addTableData(queryStepBasicsUrl, {
						 type: 'vague',
						 keyword: val,
						 status: status,
						 headNum: 1
						 });
					 }
					 else {
					 addTableData(queryStepBasicsUrl, {
						 type: 'vague',
						 // craftBasicsId: '',
						 // keyword: '',
						 status:0,
						 headNum: 1
					 });
					 }

				 });

				 // 模糊搜索回车搜索
				 fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
					 if (event.keyCode === 13) {
						 event.preventDefault()
						 $(this).closest('.input-group').find('button').trigger('click')
					 }

				 });

				 // 下拉选事件
				 staffTypeOption.off("change").on("change",function(){
					 let status = $(this).val();
					 addTableData(queryStepBasicsUrl, {
					 type: 'vague',
					 status: status,
					 headNum: 1
					 });

				 })
				 // 头部主要按钮1点击事件，新增工序模态框
				 headingMainBtn_1.off('click').on('click', (event) => {

					 let dataContent = $("#submitModelModal"),
						 panelModal1 = dataContent.find('.panel'),
						 modalCloseBtn = dataContent.find('.modal-header').find('.close'),
						 modalSubmitBtn = dataContent.find('.modal-submit'),
						 // 表单要提交的数据
						 saveStepBasics = {
							craft_workstep_basics_name:"",
							craft_workstep_basics_num:"",
							craft_workstep_basics_describle:"",
							craft_workstep_basics_status: '',
							craft_workstep_basics_creation_staff:'',
							craft_workstep_basics_creation_staff_id:'',
						 };

						 saveStepBasics.craft_workstep_basics_creation_staff = USERNAME
						 saveStepBasics.craft_workstep_basics_creation_staff_id = USERID

					 panelModal1.find('.panel-heading').find('.panel-title').text('新增工步基础信息') // 更换panel标题

					 mesHorizontalTableAddData(panelModal1.find('table'), null, {
						 thead: '工步名称/工步编号/工步备注/使用状态',
						 tableWitch: '30%',
						 viewColGroup: 1,
						 importStaticData: (tbodyTd, length) => {
							 let inputHtml;

							 for (let i = 0, len = length; i < len; i++) {
								 switch (i) {
									 case 0: {
									 inputHtml = `<input type="text" class="table-input" placeholder="请输入工步名称(必填)" autocomplete="on" />`;
									 tbodyTd.eq(i).addClass('table-input-td')
									 tbodyTd.eq(i).html(inputHtml)
									 let target = tbodyTd.eq(i).find('input'),
									 mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });

									 tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
										 mesPopover.hide()
										 saveStepBasics.craft_workstep_basics_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
										 if (!USERNAME_REG1.test(saveStepBasics.craft_workstep_basics_name)) {
											 mesPopover.show()
										 } else {
											 mesPopover.hide()
										 }
									 })

									 break;
									 }
									 case 1: {
										 inputHtml = `<input type="text" class="table-input" placeholder="请输入工步编号(必填)" autocomplete="on" />`;
										 tbodyTd.eq(i).addClass('table-input-td')
										 tbodyTd.eq(i).html(inputHtml)
										 tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											saveStepBasics.craft_workstep_basics_num = tbodyTd.eq(i).find('input').val()
										 })


										 break;
									 }
									 case 2: {
										inputHtml = `<input type="text" class="table-input" placeholder="请输入工序描述" autocomplete="on" />`;
										tbodyTd.eq(i).addClass('table-input-td')
										 tbodyTd.eq(i).html(inputHtml)

										 // 添加到提交数据
										 tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											saveStepBasics.craft_workstep_basics_describle = tbodyTd.eq(i).find('input').val()
										 })
										 break;
									 }
									 case 3: {
										 inputHtml = `<select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">隐藏</option></select>`
										 tbodyTd.eq(i).addClass('table-input-td')
										 tbodyTd.eq(i).html(inputHtml)
										 saveStepBasics.craft_workstep_basics_status =0
										 // 添加到提交数据
										 tbodyTd.eq(i).find('select').off('blur').on('blur', (event) => {
											saveStepBasics.craft_workstep_basics_status = tbodyTd.eq(i).find('select').val()
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
						 if (saveStepBasics.craft_workstep_basics_name !== '') {
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
									 type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
									 url: saveStepBasicsUrl,
									 dataType:"json",
									 async:false,
									 data:saveStepBasics,

									 success: function (result, status, xhr) {
										 if (result.status === 0) {

											 let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
											 swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
										 }else if(result.status === 7){
											repeatFail()
										}else {
											let msg = result.msg
											if(msg!==null){
												swallFail2(msg)
											}else{
												swallError();	//格式不正确
											}
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

			case '#workStepAndParameters'://工步与工步参数维护功能
				 (function () {
					let activeSwiper = $('#workStepAndParameters'), // 右侧外部swiper
						activeSubSwiper = $('#workStepAndParametersInerSwiper'), // 右侧内部swiper
						// activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
						panel1 = panelList.eq(0),
						panel2 = panelList.eq(1),
						panelTbody = panelList.find('table tbody'),	//面包表格tbody
						paginationContainer = panelList.find('.pagination'),		// 分页ul标签


						activePanelHeading = panelList.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工序与工序参数关系

						ProductTypeOption = activePanelHeading.find('.product-type-option'), // 类型选

						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组

						mesloadBox = new MesloadBox(panel1, {warningContent: '没有此类信息，请重新选择或输入'}),
						mesloadBox2 = new MesloadBox(panel2, {warningContent: '没有此类信息，请重新选择或输入'})

						function loadWorkstepParamersTypeId() {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
								// async: false,
								url: queryParameterTypeUrl,
								data:{
									type: 'vague',
									status:0,
								},
								success: function (result, status, xhr) {
									if (result.status === 0) {
										let  typeId, typeName,
										dataList = result.map.resultList
										for (let i = 0, len = dataList.length; i < len; i++){
											typeId=dataList[i].standard_parameter_type_id
											typeName=dataList[i].standard_parameter_type_name
											if(typeName==="工步参数"){
												workstepParamersTypeId=typeId
											}else if(typeName==="半成品参数"){
												semiProParamersTypeId=typeId
											}
										}
										console.log(workstepParamersTypeId)
									}
									else {
										// swallFail();	//操作失败
									}
								}
							})
						};

						loadWorkstepParamersTypeId()
						panel2.hide()
						// 主表格1添加内容
						function addTableData(url, data) {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
								url: url,
								data: data,
								beforeSend: function (xml) {
									mesloadBox.loadingShow()
								},
								success: function (result, status, xhr) {
									// ajax成功
									mesloadBox.hide()
									if (result.status === 0) {
										paginationContainer.show()
										mesVerticalTableAddData(panel1, {
											thead: {
												theadContent: '序号/工步名称/工步编号/工步描述/操作',
												theadWidth: '4%/15%/15%/15%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#parameteresMangeModel"><i class="fa fa-tasks fa-fw"></i>参数详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#addstepParameters"><i class="fa fa-plus"></i>编辑参数</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													tbodyTarget.empty() // 清空表格主体
													let map = result.map, // 映射
														dataList = map.resultList, // 主要数据列表
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
																	tempData = dataList[currentTr.index()].craft_workstep_basics_name;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 2: {
																	tempData = dataList[currentTr.index()].craft_workstep_basics_num;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 3: {
																	tempData = dataList[currentTr.index()].craft_workstep_basics_describle;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 4:
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																			  craftID = dataList[currentTr.index()].craft_workstep_basics_id;
																		switch (dataContent) {
																			case '#parameteresMangeModel': {	//参数详情详情
																				let dataContent = $('#parameteresMangeModel'),
																				panelModal1 = dataContent.find('.panel'),
																				panelTbody = panelModal1.find('table tbody'),
																				headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				statusOption = panelModal1.find(".status-type-option"),// 类型选
																				fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																				paginationContainer = dataContent.find('.pagination'),
																				// ProductTypeList = [],
																				mesloadBox = new MesloadBox(panelModal1, {
																					// 主数据载入窗口
																					warningContent: '没有此类信息，请重新选择或输入'
																				});
																				dataContent.find('.modal-title').text("参数详情") // 更换panel标题
																				headingMainBtn_1.hide()
																				statusOption.hide()
																				panelTbody.empty()
																				fuzzySearchGroup.hide()

																				panelTbody = panelModal1.find('table tbody').empty()
																				panelTbody = panelModal1.find('table thead').empty()


																				// 模态框表格增加内容
																				function addModalTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																						dataType:'json',
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
																								mesloadBox.hide()
																								mesVerticalTableAddData(panelModal1, {
																									thead: {
																										theadContent: '序号/参数名称/参数描述/参数规格/设备类型/单位',
																										theadWidth: '8%/15%/18%/15%/20%/15%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>'
																											// '<td></td>',
																											// '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'

																										],

																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											let map = result.map, // 映射
																												dataList = map.resultList, // 主要数据列表
																												tempData = ''; // 表格td内的临时数据
																											// ProductTypeList = dataList;
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
																															tempData = dataList[currentTr.index()].standard_parameter_name
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].standard_parameter_describle
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].standard_parameter_specifications
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															let 	selectHtml = `<select class="form-control table-input input-sm"></select>`,
																															tempData = dataList[currentTr.index()].workstepParameterRelation.devices_control_devices_type_id

																															currentTr.children().eq(i).addClass('table-input-td')
																															currentTr.children().eq(i).html(selectHtml)

																															let target = currentTr.children().eq(i).find('select');

																															for (let i = 0, len = devicesTypeList.length; i < len; i++) {
																																let optionStr = `<option value="${devicesTypeList[i].devices_control_devices_type_id}">${devicesTypeList[i].devices_control_devices_type_name}</option>`;
																																target.append(optionStr);
																															}
																															target.val(tempData).attr('disabled',true)
																														
																														}
																															break;
																														case 5: {
																															tempData = `<a class="table-link" href="javascript:"; data-toggle-modal-target="#publicSelectModalBox"><i class="fa fa-tasks fa-fw" ></i>查看单位</a>`
																															currentTr.children().eq(i).addClass("table-input-td")
																															currentTr.children().eq(i).html(tempData)
																															currentTr.children().eq(i).off("click").on("click","a", function(){
																																let 	parameterId= dataList[currentTr.index()].standard_parameter_id
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
																								
																																panelModal1.find(".panel-heading").find(".head-main-btn-1").text("添加单位")
																																dataContent.find(".panel-title").text("单位详情")
																															
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
																																		type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																																		dataType:'json',
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
																																						theadContent: '序号/单位名称/单位符号/单位类型',
																																						theadWidth: '8%/18%/18%/20%'
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
																																							let map = result.map, // 映射
																																								dataList = result.map.list, // 主要数据列表
																																								tempData = ''; // 表格td内的临时数据
																																							// ProductTypeList = dataList;
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
																																											tempData = dataList[currentTr.index()].parameter_unit_name
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList[currentTr.index()].parameter_unit
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList[currentTr.index()].parameter_unit_type
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
																																						displayRow: result.map.list.length// 显示行数
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

																														
																																addModalTableData(queryParameterUnitsUrl, {
																																	realationParameterId: parameterId,
																																});
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
																										totalRow: result.map.counts, // 总行数
																										displayRow: result.map.resultList.length// 显示行数
																									},

																									ajax: {
																										url: url,
																										data: data
																									}

																								})
																							}
																							else {
																								panelTbody.empty().append(NO_DATA_NOTICE)
																								// paginationContainer.hide()	//隐藏分页按钮
																								mesloadBox.warningShow();

																							}
																						}
																					})
																				}
																				addModalTableData(queryStepBasicsAboutParameterUrl, {
																					// type:"parameterTypeQuery",
																					workstepBasicsId: craftID,
																					headNum:1
																				});




																				break;
																			}
																			case '#addstepParameters': {	//添加参数   是一个工步参数的集合表格
																					let dataContent = $("#addstepParameters"),
																					panelModal1 = dataContent.find('.panel'),
																					panelTbody = panelModal1.find('table tbody'),	// 面板表格
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					modalSubmitBtn = dataContent.find('.modal-submit'),
																					headingMainBtn_1_1=$(".head-2"),
																					workSrepParIDList = [],//已经选择的工步参数ID
																					workSrepParIdOnList = []//在里面的参数id
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																						// async: false,
																						url: queryStepBasicsAboutParameterUrl,
																						data:{
																							// type:"parameterTypeQuery",
																							workstepBasicsId: craftID,
																						},
																						success: function (result){
																							if(result.status===0){
																								let map = result.map, // 映射
																								parameterLists = map.resultList
																								for (let m = 0, len = parameterLists.length; m < len; m++ ){
																									workSrepParIdOnList.push(parameterLists[m].standard_parameter_id) 
																									}
																							}
																						}
																					})

																					panelTbody.empty()
																					// createDevicesTypeSelect(devicesTypeOption)

																					headingMainBtn_1_1.off('click').on('click', (event) => {
																						// let panelTbody = panelModal1.find('tbody')

																						// 项目选择模态框
																						let promise = new Promise(function (resolve, reject) {
																							selectWorkstepParamersAddData(resolve, queryNormParameterUrl,{type:"parameterTypeQuery",parameterTypeId: workstepParamersTypeId,headNum:1},workSrepParIDList)
																						});
																						promise.then(function (resolveData) {
																							if (traverseListPush2(workSrepParIDList, resolveData.workStepParId)) {	//判断是否选择
																								let warningNotice = new MesloadBox($('body'), {warningContent:'您已经选择该设备，请重新选择'})
																								warningNotice.warningShow()
																								return;
																							}
																							traverseListPush(workSrepParIDList, resolveData.workStepParId)
																							let temStr = `
																									<tr>
																										<td></td>
																										<td>${resolveData.workStepParName}</td>
																										<td class="table-input-td">
																											<select class="form-control input-sm devices-type-option">
																												<option value="">请选择设备类型</option>
																											</select>
																										</td>
																										<td class="table-input-td">
																											<a class="table-link text-danger delete" href="javascript:;"workStepParId="${resolveData.workStepParId}"><i class="fa fa-times"></i>移除</a>
																										</td>
																									</tr>
																								`;
																							panelTbody.append(temStr)


																							for (let i = 0, len = devicesTypeList.length; i < len; i++) {
																								//设备类型id作为value,名称作为text
																								let optionStr = `<option value="${devicesTypeList[i].devices_control_devices_type_id}">${devicesTypeList[i].devices_control_devices_type_name}</option>`;
																								panelTbody.children("tr:last-child").find("select").append(optionStr);
																							}

																							let  tr=panelModal1.find('tbody tr');
																							for(let i = 0;i<tr.length;i++){
																								panelModal1.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																								;
																							}

																							panelModal1.on('click', '.delete', function () {
																								let id=	$(this).closest('td a').attr("workStepParId")
																								traverseListDelete(workSrepParIDList, id)
																								$(this).closest('tr').remove();  //移除该行元素

																								for(let i = 0;i<tr.length;i++){
																									panelModal1.find('tbody').find('tr:eq('+i+') td:first').text(i+1);
																									;
																								}
																							})
																						})
																					})
																				



																					// 提交数据按钮单击事件
																					modalSubmitBtn.off('click').on('click', (event) => {
																							// panelTbody = panelModal1.find('table tbody'),	// 面板表格
																						let		 tr = panelTbody.find(' tr'),
																							workstageParameterIds=[]

																							for (let i = 0, len = tr.length; i < len; i++){	//遍历行
																								let $td = tr.eq(i).find('td'),
																									tempdata1="" ,
																									tempdata2 =""
																									let target = tr.eq(i).find("td select")
																									mesPopover = new MesPopover(target, { content: "请选择设备类型"});

																									target.off('change').on('change', (event) => {
																										mesPopover.hide()
																									})
																										tempdata1 =tr.eq(i).find("td:last-child").find("a").attr("workStepParId")
																										tempdata2 =tr.eq(i).find("td select").val()
																										if(tempdata2!==""){
																											mesPopover.hide()
																											let tempStr = `${tempdata1}:${tempdata2}`;
																											workstageParameterIds[i] = tempStr;

																										}else{
																											mesPopover.show()
																											target.focus()
																											return  false
																										}

																								// 拼成字符串,"名称:基准:方法:时机"
																								// let tempStr = `${workstageParameterIds.workstage_parameter_id}:${workstageParameterIds.devices_control_devices_type_id}`;
																								// let tempStr = `${tempdata1}:${tempdata2}`;
																								// workstageParameterIds[i] = tempStr;
																							}
																
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
																								if(workSrepParIdOnList.length!==0){
																									$.ajax({
																										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																										url: maintainStepBasicsAboutParameterUrl,
																										// dataType:"json",
																										// async: false, //设置为同步请求
																										data: {
																											type:"modify",
																											workstepBasicsId:craftID,
																											stepParameterIds:workstageParameterIds
																										},
																										success: function (result, status, xhr) {
																											if (result.status === 0) {
																												let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																											}else {
																												let msg = result.msg
																												if(msg!==null){
																													swallFail2(msg)
																												}else{
																													swallError();	//格式不正确
																												}
																											}
																										}
																									})
																								}else{
																									$.ajax({
																										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																										url: maintainStepBasicsAboutParameterUrl,
																										// dataType:"json",
																										// async: false, //设置为同步请求
																										data: {
																											type:"null",
																											workstepBasicsId:craftID,
																											stepParameterIds:workstageParameterIds
																										},
																										success: function (result, status, xhr) {
																											if (result.status === 0) {
																												let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																											}else {
																												let msg = result.msg
																												if(msg!==null){
																													swallFail2(msg)
																												}else{
																													swallError();	//格式不正确
																												}
																											}
																										}
																									})
																								}
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}
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
												totalRow: result.map.counts, // 总行数
												displayRow: result.map.resultList.length // 显示行数
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
					  addTableData(queryStepBasicsUrl, {
							type: 'vague',
							status:0,
							headNum: 1
						});


					// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								addTableData(queryStepBasicsUrl, {
								type: 'vague',
								status: 0,
								keyword: val,
								headNum: 1
								});
							}
							else {
							addTableData(queryStepBasicsUrl, {
								type: 'vague',
								// craftBasicsId: '',
								// keyword: '',
								status: 0,
								headNum: 1
							});
							}

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

			case '#BproductMange':	//半成品管理
				(function () {
					let activeSwiper = $('#BproductMange'), // 右侧外部swiper
						activeSubSwiper = $('#BproductMangeInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面包表格tbody
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1,设备类型管理
						headingMainBtn_2 = activePanelHeading.find('.head-main-btn-2'), // 头部主要按键_2，新增设备
						semiproductTypeOption = activePanelHeading.find('.semiproduct-type-option'), // 类型选项
						statusTypeOption = activePanelHeading.find('.status-type-option'), // 状态选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})
						createSemiProductTypeSelect(semiproductTypeOption);
					// 主表格添加内容
					function addTableData(url, data) {
						$.ajax({
							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
											theadContent: '序号/半成品名称/半成品编号/状态/操作',
											theadWidth: '5%/25%/25%/15%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.SemiFinishs, // 主要数据列表
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
																tempData = dataList[currentTr.index()].semi_finish_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;

															case 2: {
																tempData = dataList[currentTr.index()].semi_finish_number;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 3: {
																let  semiproductModelIds=[],
																	tempStr = `
																	<select class="form-control table-input input-sm">
																	<option value="0">启用</option>
																	<option value="1">弃用</option>
																	</select>
																	`;
																	tempData = dataList[currentTr.index()].semi_finish_status;
																	currentTr.children().eq(j).addClass('table-input-td').html(tempStr);
																	let	target = currentTr.children().eq(j).find('select');
																	target.val(tempData);

																target.off('change').on('change', function () {
																	let planStatus = $(this).val()

																	if(planStatus == 0 ){
																		planStatus = 'recover'
																	}else {
																		planStatus = 'deprecated'
																	};
																	semiproductModelIds.push(dataList[currentTr.index()].semi_finish_id);
																	swal({
																		title: '您确定要更改此状态吗？',
																		type: 'question',
																		showCancelButton: true,
																		confirmButtonText: '确定',
																		cancelButtonText: '取消'
																	}).then(function () {
																		$.ajax({
																			type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																			url:modifySemiFinishedProductModelStatusUrl,
																			data: {
																				type:planStatus,
																				semiFinishedProductModelIds:semiproductModelIds
																			},
																			success: function (result, status, xhr) {
																				if (result.status === 0) {
																					let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																					swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																				}else if(result.status === 4){
																					repeatFail()
																				}
																				else {
																					swallFail()	//操作失败
																				}
																			},
																		})
																	},
																		(dismiss) => {
																			target.val(dataList[currentTr.index()].semi_finish_status);
																		})
																})
															}
																break;
															case 4:
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		ProductId = dataList[currentTr.index()].semi_finish_id

																	switch (dataContent) {
																		case '#detailModal': {
																			let dataContent = $('#detailModal'),
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				// modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
																				submission = dataContent.find('.modal-footer')
																				// submissionBtn = submission.find('.modal-submit'),

																				// 添加主体表单数据
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																								mesHorizontalTableAddData(panelModal1.find('table'), null, {
																									thead: '半成品名称/半成品类型/半成品型号/半成品编号/半成品单位/半成品备注/状态/创建时间/创建人员',
																									tableWitch: '20%/20%',
																									viewColGroup: 2,
																									importStaticData: (tbodyTd, length) => {
																										let map = result.map, // 映射
																										dataList = map.SemiFinishs, // 主要数据列表
																										tempData = null; // 表格td内的临时数据

																										let inputHtml = ``,
																										selectHtml = `<select class="form-control table-input input-sm"></select>`

																										for (let i = 0, len = length; i < len; i++)
																											switch (i) {
																												case 0: {
																													tempData = dataList[0].semi_finish_name
																													tbodyTd.eq(i).html(tempData);

																												}
																												break;
																												case 1: {
																													tempData = dataList[0].semi_finish_type_id
																													tbodyTd.eq(i).addClass('table-input-td')
																													tbodyTd.eq(i).html(selectHtml)

																													let target = tbodyTd.eq(i).find('select');

																													for (let i = 0, len = semiProductTypeList.length; i < len; i++) {
																														let optionStr = `<option value="${semiProductTypeList[i].semi_finish_type_id}">${semiProductTypeList[i].semi_finish_type_name}</option>`;
																														target.append(optionStr);
																													}
																													target.val(dataList[0].semi_finish_type_id).attr('disabled',true)

																												
																													break;


																												}
																													break;
																												case 2: {
																													tempData = dataList[0].semi_finish_genre
																													tbodyTd.eq(i).html(tempData)

																												}
																													break;
																												case 3: {
																													tempData = dataList[0].semi_finish_number
																													tbodyTd.eq(i).html(tempData)

																												}
																													break;
																												case 4: {
																													tempData = dataList[0].semi_finish_unit
																													tbodyTd.eq(i).html(tempData)


																													}
																													break;
																												case 5: {
																													tempData = dataList[0].semi_finish_describe
																													tbodyTd.eq(i).html(tempData)

																													}
																													break;
																												case 6: {
																													tempData = dataList[0].semi_finish_status
																													if(tempData){
																														tbodyTd.eq(i).html("开启")
																													}else{
																														tbodyTd.eq(i).html("弃用")
																													}

																													}
																													break;
																												case 7: {
																													tempData = dataList[0].semi_finish_creation_time
																													tbodyTd.eq(i).html((moment(tempData).format('YYYY-MM-DD')))

																													}
																													break;
																												case 8: {
																													tempData = dataList[0].semi_finish_creation_staff
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
																								mesloadBox.warningShow();
																							}
																						}
																					})
																				}
																				addTableData(querySemiFinishedProductModelUrl, {
																					type: "precise",
																					semiFinishedProductModelId:ProductId,
																					headNum: 1
																				})

																			// modalSubmitBtn.attr('disabled',true)
																			// submithData.productId = productId

																			panelModal1.find('.panel-heading').find('.panel-title').text('产品模型详情') // 更换panel标题




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
											displayRow: result.map.SemiFinishs.length // 显示行数
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

					function typeAddTableData(url, data) {
						$.ajax({
							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
											theadContent: '序号/半成品名称/半成品编号/状态/操作',
											theadWidth: '5%/25%/25%/15%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.SemiFinishType, // 主要数据列表
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
																tempData = dataList[currentTr.index()].semi_finish_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;

															case 2: {
																tempData = dataList[currentTr.index()].semi_finish_number;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 3: {
																let  semiproductModelIds=[],

																tempStr = `
																<select class="form-control table-input input-sm">
																<option value="0">启用</option>
																<option value="1">弃用</option>
																</select>
																`;
																tempData = dataList[currentTr.index()].semi_finish_status;
																currentTr.children().eq(j).addClass('table-input-td').html(tempStr);
																let	target = currentTr.children().eq(j).find('select');
																target.val(tempData);

																target.off('change').on('change', function () {
																let planStatus = $(this).val()

																if(planStatus == 0 ){
																  planStatus = 'recover'
																}else {
																  planStatus = 'deprecated'
																};
																semiproductModelIds.push(dataList[currentTr.index()].semi_finish_id);
																swal({
																	title: '您确定要更改此状态吗？',
																	type: 'question',
																	showCancelButton: true,
																	confirmButtonText: '确定',
																	cancelButtonText: '取消'
																}).then(function () {
																	$.ajax({
																		type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																		url:modifySemiFinishedProductModelStatusUrl,
																		data: {
																			type:planStatus,
																			semiFinishedProductModelId:semiproductModelIds
																		},
																		success: function (result, status, xhr) {
																			if (result.status === 0) {
																				let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																				swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																			}else if(result.status === 4){
																				repeatFail()
																			}
																			else {
																				swallFail()	//操作失败
																			}
																		},
																	})
																},
																	(dismiss) => {
																		target.val(dataList[currentTr.index()].semi_finish_status);
																	})
															})
															}
																break;
															case 4:
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		ProductId = dataList[currentTr.index()].semi_finish_id

																	switch (dataContent) {
																		case '#detailModal': {
																			let dataContent = $('#detailModal'),
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				fuzzySearchGroupBtn = fuzzySearchGroup.find('button'),
																				submission = dataContent.find('.modal-footer')

																				// 添加主体表单数据
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																								mesHorizontalTableAddData(panelModal1.find('table'), null, {
																									thead: '半成品名称/半成品类型/半成品型号/半成品编号/半成品单位/半成品备注/状态/创建时间/创建人员',
																									tableWitch: '20%/20%',
																									viewColGroup: 2,
																									importStaticData: (tbodyTd, length) => {
																									let map = result.map, // 映射
																										dataList = map.SemiFinishs, // 主要数据列表
																										selectHtml = `<select class="form-control table-input input-sm"></select>`,
																										tempData = null, // 表格td内的临时数据
																										inputHtml = ``

																										for (let i = 0, len = length; i < len; i++)
																											switch (i) {
																												case 0: {
																													tempData = dataList[0].semi_finish_name
																													tbodyTd.eq(i).html(tempData);

																												}
																												break;
																												case 1: {
																													tempData = dataList[0].semi_finish_type_id
																													tbodyTd.eq(i).addClass('table-input-td')
																													tbodyTd.eq(i).html(selectHtml)

																													let target = tbodyTd.eq(i).find('select');

																													for (let i = 0, len = semiProductTypeList.length; i < len; i++) {
																														let optionStr = `<option value="${semiProductTypeList[i].semi_finish_type_id}">${semiProductTypeList[i].semi_finish_type_name}</option>`;
																														target.append(optionStr);
																													}
																													target.val(dataList[0].semi_finish_type_id).attr('disabled',true)

																												
																													break;


																												}
																													break;
																												case 2: {
																													tempData = dataList[0].semi_finish_genre
																													tbodyTd.eq(i).html(tempData)

																												}
																													break;
																												case 3: {
																													tempData = dataList[0].semi_finish_number
																													tbodyTd.eq(i).html(tempData)

																												}
																													break;
																												case 4: {
																													tempData = dataList[0].semi_finish_unit
																													tbodyTd.eq(i).html(tempData)


																													}
																													break;
																												case 5: {
																													tempData = dataList[0].semi_finish_describe
																													tbodyTd.eq(i).html(tempData)

																													}
																													break;
																												case 6: {
																													tempData = dataList[0].semi_finish_status
																													if(tempData){
																														tbodyTd.eq(i).html("开启")
																													}else{
																														tbodyTd.eq(i).html("弃用")
																													}

																													}
																													break;
																												case 7: {
																													tempData = dataList[0].semi_finish_creation_time
																													tbodyTd.eq(i).html((moment(tempData).format('YYYY-MM-DD')))

																													}
																													break;
																												case 8: {
																													tempData = dataList[0].semi_finish_creation_staff
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
																								mesloadBox.warningShow();
																							}
																						}
																					})
																				}
																				addTableData(querySemiFinishedProductModelUrl, {
																					type: "precise",
																					semiFinishedProductModelId:ProductId,
																					headNum: 1
																				})

																			// modalSubmitBtn.attr('disabled',true)
																			// submithData.productId = productId

																			panelModal1.find('.panel-heading').find('.panel-title').text('产品模型详情') // 更换panel标题




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
											displayRow: result.map.SemiFinishType.length // 显示行数
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
					addTableData(querySemiFinishedProductModelUrl, {
						type: 'vague',
						status:0,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, ""),
						   status=statusTypeOption.val()
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(querySemiFinishedProductModelUrl, {
								type: 'vague',
								keyWord: val,
								status:status,
								headNum: 1
							});
						}
						else {
							addTableData(querySemiFinishedProductModelUrl, {
								type: 'vague',
								status:status,
								headNum: 1
							});
						}

					});

					// 下拉选事件
					semiproductTypeOption.off("change").on("change",function(){
						let currentproductTypeID = $(this).val(),
						status=statusTypeOption.val()

						typeAddTableData(querySemiFinishedProductTypeAboutModelUrl, {
							type: 'vague',
							semiFinishedProductTypeId: currentproductTypeID,
							status:status,
							headNum: 1
						});
					})
					statusTypeOption.off("change").on("change",function(){
						let currentproductTypeID = $(this).val();
						addTableData(querySemiFinishedProductModelUrl, {
							type: 'vague',
							status: currentproductTypeID,
							headNum: 1
						});
					})
					// 头部主要按钮1点击事件，半成品类型管理模态框

					headingMainBtn_1.off('click').on('click', (event) => {``
						let dataContent = $('#BProductTypeMange'),
							panelModal1 = dataContent.find('.panel'),
							headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增半成品类型
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							statusOption = panelModal1.find(".status-type-option");// 类型选
							fuzzySearchGroup = panelModal1.find(".fuzzy-search-group");// 类型选
							// ProductTypeList = [],
							mesloadBox = new MesloadBox(panelModal1, {
								// 主数据载入窗口
								warningContent: '没有此类信息，请重新选择或输入'
							});

						// 模态框表格增加内容
						function addModalTableData(url, data) {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
												theadContent: '序号/类型名称/类型编号/类型描述/使用状态/操作',
												theadWidth: '8%/20%/20%/20%/20%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													let map = result.map, // 映射
														dataList = result.map.semiFinishTypes, // 主要数据列表
														tempData = ''; // 表格td内的临时数据
													// ProductTypeList = dataList;
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
																	tempData = dataList[currentTr.index()].semi_finish_type_name
																	currentTr.children().eq(j).html(tempData)
																}
																	break;
																case 2: {
																	tempData = dataList[currentTr.index()].semi_finish_type_number
																	currentTr.children().eq(j).html(tempData)
																}
																	break;
																case 3: {
																	tempData = dataList[currentTr.index()].semi_finish_type_describe
																	currentTr.children().eq(j).html(tempData)
																}
																	break;
																case 4: {
																	let productTypeIds = [],
																	tempStr = `
																	<select class="form-control table-input input-sm">
																	<option value="0">启用</option>
																	<option value="1">弃用</option>
																	</select>
																	`;
																	tempData = dataList[currentTr.index()].semi_finish_type_status;
																	currentTr.children().eq(j).addClass('table-input-td').html(tempStr);
																	let	target = currentTr.children().eq(j).find('select');
																	target.val(tempData);

																	target.off('change').on('change', function () {
																		let planStatus = $(this).val();
																		if(planStatus == 0 ){
																			planStatus = 'recover'
																		}else {
																			planStatus = 'deprecated'
																		};
																		productTypeIds.push(dataList[currentTr.index()].semi_finish_type_id);
																		swal({
																			title: '您确定要更改此状态吗？',
																			type: 'question',
																			showCancelButton: true,
																			confirmButtonText: '确定',
																			cancelButtonText: '取消'
																		}).then(function () {
																			$.ajax({
																				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																				url:modifySemiFinishedProductTypeStatusUrl ,
																				data: {
																				type:planStatus,
																				semiFinishedProductTypeIds:productTypeIds
																				},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																						swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																					}else if(result.status === 4){
																						repeatFail()
																					}
																					else {
																						swallFail()	//操作失败
																					}
																				},
																			})
																		},
																			(dismiss) => {
																				target.val(dataList[currentTr.index()].semi_finish_type_status);
																			})
																	})
																}
																	break;
																case 5:{
																	currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																		let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																			craftID = dataList[currentTr.index()].semi_finish_type_id;
																		switch (dataContent) {
																			case '#detailModal': {	//详情
																				let dataContent = $('#detailModal'),
																					panelList = dataContent.find('.panel'),
																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody');
																					panelList.find('.panel-heading').find('.modal-title').text('参数详情')

																					// dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
																					// 	$('body').addClass('modal-open')
																					// })

																					dataContent.modal({
																						backdrop: false, // 黑色遮罩不可点击
																						keyboard: false,  // esc按键不可弃用模态框
																						show: false
																					})
																					dataContent.modal('show') // 运行时显示

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																								mesHorizontalTableAddData(panelList.find('table'), null, {
																									thead: '类型名称/类型编号/类型描述/使用状态/创建人员/创建时间',

																									// tableWitch: '25%/75%',
																									viewColGroup: 2,
																									importStaticData: (tbodyTd, length) => {
																										let map = result.map, // 映射
																											dataList = map.semiFinishTypes, // 主要数据列表
																											tempData = null; // 表格td内的临时数据
																										for (let i = 0, len = length; i < len; i++)
																											switch (i) {
																												case 0: {
																													tempData = dataList[0].semi_finish_type_name;
																													tbodyTd.eq(i).html(tempData)
																												}
																													break;
																												case 1: {
																													tempData = dataList[0].semi_finish_type_number;
																													tbodyTd.eq(i).html(tempData)
																												}
																													break;
																												case 2: {
																													tempData = dataList[0].semi_finish_type_describe;
																													tbodyTd.eq(i).html(tempData)
																												}
																													break;
																												case 3: {
																													tempData = dataList[0].semi_finish_type_status;
																													if (tempData === '0') {
																														tbodyTd.eq(i).html(`启用`)
																														}
																														else if (tempData === '1') {
																														tbodyTd.eq(i).html(`弃用`)
																														}
																												}
																													break;
																												case 4: {
																													tempData = dataList[0].semi_finish_type_creation_staff;
																													tbodyTd.eq(i).html(tempData)
																												}
																													break;
																												case 5: {
																													tempData = dataList[0].semi_finish_type_creation_time;
																													tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))

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

																				// 导航栏点击时运行数据加载
																				addTableData(querySemiFinishedProductTypeUrl, {
																					type: 'precise',
																					semiFinishedProductTypeId: craftID,
																					headNum: 1
																				});

																				break;
																			}

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
												totalRow: result.map.lines ,// 总行数
												displayRow: result.map.semiFinishTypes.length// 显示行数
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
						
						addModalTableData(querySemiFinishedProductTypeUrl, {
							type:"vague",
							status:0,
							headNum: 1
						});

						// 2级头部主要按钮1点击事件,新增半成品类型
						headingMainBtn_1.off('click').on('click', (event) => {

							let dataContent = submitModelModal,
								panelModal2 = dataContent.find('.panel'),
								modalCloseBtn = dataContent.find('.modal-header').find('.close'),
								modalSubmitBtn = dataContent.find('.modal-submit'),
								// 表单要提交的数据
								req = {
									semiName: '',
									semiNumber: '',
									describe: "",
									creationStaff: "",
									creationStaffId: ""
								}

								req.creationStaff = USERNAME
								req.creationStaffId = USERID


							// 修改标题
							panelModal2.find('.panel-heading').find('.panel-title').text('新增半成品类型') // 更换panel标题

							dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
								$('body').addClass('modal-open')
							})
							dataContent.modal({
								backdrop: false, // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可弃用模态框
								show: false
							})
							dataContent.modal('show') // 运行时显示
							modalCloseBtn.off('click').on('click', (event) => {
								// 点击弃用按钮隐藏该模态框
								dataContent.modal('hide')

								// 初始化表格
								// panelModal2.find('thead').empty()
								// panelModal2.find('tbody').empty()
							})
							//生成表单
							mesHorizontalTableAddData(panelModal2.find('table'), null, {
								thead: '类型名称/类型编号/类型描述',
								tableWitch: '20%/20%',
								viewColGroup: 2,
								importStaticData: (tbodyTd, length) => {
									let inputHtml
									for (let i = 0, len = length; i < len; i++){
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
													req.semiName = target.val().replace(/\s/g, "")
													if (!USERNAME_REG1.test(req.typeName)) {
														mesPopover.show()
													} else {
														mesPopover.hide()
													}
												})

											}
												break;
											case 1: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.semiNumber= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})

											}
												break;
											case 2: {
												inputHtml = `<input type="text" class="table-input" placeholder="请输入"  />`
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml)
												let target = tbodyTd.eq(i).find('input')

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													req.describe  = target.val().replace(/\s/g, "");
													console.log(req.describe)
												})

											}
											break;
											default:
												break;
										}
									}
								}
							})

							// 提交数据按钮单击事件
							modalSubmitBtn.off('click').on('click', (event) => {
								if (req.typeName !=="" ) {
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
											type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
											url: saveSemiFinishedProductTypeUrl,
											data: req,
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面

												}else if(result.status === 4){
													repeatFail()
												}else {
													let msg = result.msg
													if(msg!==null){
														swallFail2(msg)
													}else{
														swallError();	//格式不正确
													}
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

						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val(),
							status=statusOption.val()
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								addModalTableData(querySemiFinishedProductTypeUrl, {
									type: 'vague',
									keyWord: val,
									status:status,
									headNum: 1
								});
							}
							else {
								addModalTableData(querySemiFinishedProductTypeUrl, {
									type: 'vague',
									// craftBasicsId: '',
									// keyword: '',
									status: 0,
									headNum: 1
								});
							}

						});

						statusOption.off("change").on("change",function(){
							let status = $(this).val();
							addModalTableData(querySemiFinishedProductTypeUrl, {
								type: 'vague',
								status: status,
								headNum: 1
							});
						})

					})

					// 头部主要按钮2点击事件，半成品
					headingMainBtn_2.off('click').on('click', (event) => {

						let dataContent = $("#submitModelModal"),
							panelModal1 = dataContent.find('.panel'),
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							modalSubmitBtn = dataContent.find('.modal-submit'),
							// 表单要提交的数据
							req = {
								typeId: '',	//半成品类型id
								semiName: '',	//半成品名称
								semiGenre: '',	//半成品型号
								semiNumber: '',//半成品编号
								semiUnit: '',	//半成品单位
								describe: '',	//半成品备注
								creationStaff: '',	//创建人员
								creationStaffId: '',	//创建人员
							};

							req.creationStaff = USERNAME
							req.creationStaffId = USERID

						panelModal1.find('.panel-heading').find('.panel-title').text('新增半成品模型') // 更换panel标题
						modalSubmitBtn.attr('disabled',false)

						mesHorizontalTableAddData(panelModal1.find('table'), null, {
							thead: '半成品名称/半成品类型/半成品型号/半成品编号/半成品单位/半成品备注',
							tableWitch: '20%/20%',
							viewColGroup: 2,
							importStaticData: (tbodyTd, length) => {
								let inputHtml = ``,
								ProductTypeList=[],
									inputHtml2 = `<input type="text" class="table-input" placeholder="点此选择时间" onClick="WdatePicker()"/>`,
									selectHtml = `<select class="form-control table-input input-sm"></select>`

								for (let i = 0, len = length; i < len; i++){
									switch (i) {
										case 0: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });

											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												mesPopover.hide()
												req.semiName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												if (!USERNAME_REG1.test(req.semiName)) {
													mesPopover.show()
												} else {
													mesPopover.hide()
												}
											})				
											break;
										}
										case 1: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(selectHtml)

											let target = tbodyTd.eq(i).find('select');
											createSemiProductTypeSelect(target);
											target.on('change', (event) => {
												req.typeId= target.val()
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
												req.semiGenre = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})

											break;
										}
										case 3: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												req.semiNumber = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 4: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												req.semiUnit = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}

										case 5: {
											inputHtml = `<input type="text" class="table-input" placeholder="请输入" />`
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												req.describe= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
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
							if (req.semiName !== '' && req.typeId !== '') {
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
										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
										url: saveSemiFinishedProductModelUrl,
										data: req,
										success: function (result, status, xhr) {
											if (result.status === 0) {
												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											}else if(result.status === 4){
												swallFail2(result.msg)
											}else {
												let msg = result.msg
												if(msg!==null){
													swallFail2(msg)
												}else{
													swallError();	//格式不正确
												}
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



			case '#BproductAndparameters'://半成品与半成品参数维护功能
				(function () {
						let activeSwiper = $('#BproductAndparameters'), // 右侧外部swiper
						activeSubSwiper = $('#BproductAndparametersInerSwiper'), // 右侧内部swiper
						// activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
						panel1 = panelList.eq(0),
						panel2 = panelList.eq(1),
						panelTbody = panelList.find('table tbody'),	//面包表格tbody
						paginationContainer = panelList.find('.pagination'),		// 分页ul标签

						activePanelHeading = panelList.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 头部主要按键_1新增工序与工序参数关系

						ProductTypeOption = activePanelHeading.find('.product-type-option'), // 类型选

						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组

						mesloadBox = new MesloadBox(panel1, {warningContent: '没有此类信息，请重新选择或输入'}),
						mesloadBox2 = new MesloadBox(panel2, {warningContent: '没有此类信息，请重新选择或输入'})

						
						// 获取工步参数类型 半成品参数类型ID
						function loadWorkstepParamersTypeId() {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
								// async: false,
								url: queryParameterTypeUrl,
								data:{
									type: 'vague',
									status:0,
									// headNum: 1  //不传下标   我也要返回全部
								},
								success: function (result, status, xhr) {
									if (result.status === 0) {
										let  typeId, typeName,
										dataList = result.map.resultList
										for (let i = 0, len = dataList.length; i < len; i++){
											typeId=dataList[i].standard_parameter_type_id
											typeName=dataList[i].standard_parameter_type_name
											if(typeName==="工步参数"){
												workstepParamersTypeId=typeId
											}else if(typeName==="半成品参数"){
												semiProParamersTypeId=typeId
											}
										}
										console.log(workstepParamersTypeId)
									}
									else {
										// swallFail();	//操作失败
									}
								}
							})
						};

						loadWorkstepParamersTypeId()

						panel2.hide()
						// 主表格1添加内容
						function addTableData(url, data) {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
										mesVerticalTableAddData(panel1, {
											thead: {
												theadContent: '序号/半成品名称/半成品编号/半成品描述/操作',
												theadWidth: '4%/15%/15%/15%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#parameteresMangeModel"><i class="fa fa-tasks fa-fw"></i>参数详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#submitModelModal2"><i class="fa fa-plus"></i>编辑参数</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													tbodyTarget.empty() // 清空表格主体
													let map = result.map, // 映射
														dataList = map.SemiFinishs, // 主要数据列表
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
																	tempData = dataList[currentTr.index()].semi_finish_name;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 2: {
																	tempData = dataList[currentTr.index()].semi_finish_number;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 3: {
																	tempData = dataList[currentTr.index()].semi_finish_describe;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 4:
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																			craftID = dataList[currentTr.index()].semi_finish_id;
																		switch (dataContent) {
																			case '#parameteresMangeModel': {	//参数详情
																				let dataContent = $('#parameteresMangeModel'),
																				panelModal1 = dataContent.find('.panel'),
																				panelTbody = panelModal1.find('table tbody'),
																				headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				statusOption = panelModal1.find(".status-type-option"),// 类型选
																				fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																				paginationContainer = dataContent.find('.pagination'),
																				// ProductTypeList = [],
																				mesloadBox = new MesloadBox(panelModal1, {
																					// 主数据载入窗口
																					warningContent: '没有此类信息，请重新选择或输入'
																				});
																				dataContent.find('.panel-title').text("参数详情") // 更换panel标题
																				headingMainBtn_1.hide()
																				statusOption.hide()
																				fuzzySearchGroup.hide()

																				panelTbody = panelModal1.find('table tbody').empty()
																				panelTbody = panelModal1.find('table thead').empty()

																				// 模态框表格增加内容
																				function addModalTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																						dataType:'json',
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
																								mesloadBox.hide()
																								mesVerticalTableAddData(panelModal1, {
																									thead: {
																										theadContent: '序号/参数名称/参数规格/参数描述/单位',
																										theadWidth: '8%/18%/20%/20%/20%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>'
																											// '<td></td>',
																											// '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'

																										],

																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											let map = result.map, // 映射
																												dataList = result.map.semiFinishRelation, // 主要数据列表
																												tempData = ''; // 表格td内的临时数据
																											// ProductTypeList = dataList;
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
																															tempData = dataList[currentTr.index()].standardParameter.standard_parameter_name
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 2: {
																															tempData = dataList[currentTr.index()].standardParameter.standard_parameter_specifications
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].standardParameter.standard_parameter_describle
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = `<a class="table-link" href="javascript:"; data-toggle-modal-target="#publicSelectModalBox"><i class="fa fa-tasks fa-fw" ></i>查看单位</a>`
																															currentTr.children().eq(i).addClass("table-input-td")
																															currentTr.children().eq(i).html(tempData)
																															currentTr.children().eq(i).off("click").on("click","a", function(){
																																let 	parameterId= dataList[currentTr.index()].standardParameter.standard_parameter_id
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
																								
																																panelModal1.find(".panel-heading").find(".head-main-btn-1").text("添加单位")
																																dataContent.find(".panel-title").text("单位详情")
																															
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
																																		type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																																		dataType:'json',
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
																																						theadContent: '序号/单位名称/单位符号/单位类型',
																																						theadWidth: '8%/18%/18%/20%'
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
																																							let map = result.map, // 映射
																																								dataList = result.map.list, // 主要数据列表
																																								tempData = ''; // 表格td内的临时数据
																																							// ProductTypeList = dataList;
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
																																											tempData = dataList[currentTr.index()].parameter_unit_name
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList[currentTr.index()].parameter_unit
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList[currentTr.index()].parameter_unit_type
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
																																						displayRow: result.map.list.length// 显示行数
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

																														
																																addModalTableData(queryParameterUnitsUrl, {
																																	realationParameterId: parameterId,
																																});
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
																										displayRow: result.map.semiFinishRelation.length// 显示行数
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

																				addModalTableData(querySemiFinishedProductModelAboutParameterUrl, {
																					// type:"precise",
																					semiFinishedProductModelId: craftID,
																					headNum:1
																				});




																				break;
																			}
																			case '#submitModelModal2': {	//修改参
																				var parameterIDInLineList = [], //   在里面的参数ID集合
																						parameterIDList = [],
																						addParameterIDList = []
																						$.ajax({
																							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																							async: false,
																							url: querySemiFinishedProductModelAboutParameterUrl,
																							data:{
																								// type:"SemiFinishedProductModelId",
																								semiFinishedProductModelId: craftID,
																								// headNum:1
																							},
																							success: function (result){
																								if(result.status===0){
																									let map = result.map, // 映射
																									parameterLists = map.semiFinishRelation
																									for (let m = 0, len = parameterLists.length; m < len; m++ ){
																										parameterIDInLineList.push(parameterLists[m].standard_parameter_id) 
																										}
																								}
																							}
																						})
																				// currentTr.children().eq(i).off('click').on('click', 'a', (event) => {

																					let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
																					panelModal1 = targetModal.find('.panel'),
																					title=panelModal1.find("h5"),
																					modalCloseBtn = targetModal.find('.modal-header').find('.close'),
																					modalSubmitBtn = targetModal.find('.modal-footer .modal-submit');	//提交按钮
																					addParameterIDList=addParameterIDList.concat(parameterIDInLineList)

																					selectworkstageParameterAddData(parameterIDInLineList, addParameterIDList,queryNormParameterUrl,{type:"parameterTypeQuery",parameterTypeId: semiProParamersTypeId,headNum:1})

																					// 提交数据按钮单击事件
																					modalSubmitBtn.off('click').on('click', (event) => {
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

																							if(parameterIDInLineList.length!==0){
																								$.ajax({
																									type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																									url: maintainSemiFinishedProductModelAboutParameterUrl,
																									data: {
																										type:"modify",
																										semiFinishedProductModelId: craftID,
																										semiFinishedProductParameterIds: addParameterIDList
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {

																											let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else {
																											let msg = result.msg
																											if(msg!==null){
																												swallFail2(msg)
																											}else{
																												swallError();	//格式不正确
																											}
																										}
																									}
																								})
																							}else{
																								$.ajax({
																									type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																									url: maintainSemiFinishedProductModelAboutParameterUrl,
																									data: {
																										type:"null",
																										semiFinishedProductModelId: craftID,
																										semiFinishedProductParameterIds: addParameterIDList
																									},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																											swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																										}else {
																											let msg = result.msg
																											if(msg!==null){
																												swallFail2(msg)
																											}else{
																												swallError();	//格式不正确
																											}
																										}
																									}
																								})
																							}
																							});
																						}
																						else {
																							swallError();	//格式不正确
																						}

																					})


																				// })

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
												displayRow: result.map.SemiFinishs.length // 显示行数
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
						addTableData(querySemiFinishedProductModelUrl, {
							type: 'vague',
							status:0,
							headNum: 1
						});


						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "")
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								addTableData(querySemiFinishedProductModelUrl, {
									type: 'vague',
									keyWord: val,
									status:0,
									headNum: 1
								});
							}
							else {
								addTableData(querySemiFinishedProductModelUrl, {
									type: 'vague',
									status:0,
									headNum: 1
								});
							}

						});

						// 模糊搜索回车搜索
						fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
							if (event.keyCode === 13) {
								event.preventDefault()
								$(this).closest('.input-group').find('button').trigger('click')
							}

						});

						// 头部主要按钮1点击,新增工序与工序参数关系
						headingMainBtn_1.off('click').on('click', (event) => {
							let workshopIDInLineList = []


							let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
									// mesloadBox3 = new MesloadBox(submitModelModal2, {warningContent: '没有此类信息，请重新选择或输入'}),
									panelModal1 = targetModal.find('.panel'),
									panel_table = panelModal1.find('table'),	// 面板表格
									title=panelModal1.find("h5"),
									modalCloseBtn = targetModal.find('.modal-header').find('.close'),
									semiProductOption = title.find('.semiP-type-option'), // 设备类型选项

									workshopIDList = [],	//给半成品添加参数的参数集合
									modalSubmitBtn = targetModal.find('.modal-footer .modal-submit');	//提交按钮


							selectworkstageParameterAddData(workshopIDInLineList, workshopIDList)

							var temStr = `
												<select class=" semiP-type-option inline-block">
													<option value="">请选择半成品名称</option>
												</select>
								`;
								// title.html("请选择半成品:")
								title.html(temStr)
								semiProductOption = title.find('.semiP-type-option'), // 设备类型选项
								createsemiProSelect(semiProductOption)

								semiProductOption.change(function () {
									semiPId = $(this).val();
									
								})
							// 提交数据按钮单击事件
							modalSubmitBtn.off('click').on('click', (event) => {
								if (workshopIDList.length !== 0) {
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
											type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
											url: maintainSemiFinishedProductModelAboutParameterUrl,
											data: {
												type:"null",
												semiFinishedProductModelId: semiPId,
												semiFinishedProductParameterIds: workshopIDList
											},
											success: function (result, status, xhr) {
												if (result.status === 0) {
													let activePaginationBtn = targetModal.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
													swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
												}else {
													let msg = result.msg
													if(msg!==null){
														swallFail2(msg)
													}else{
														swallError();	//格式不正确
													}
												}
											}
										})
									});
								}
								else {
									swallError()	//格式不正确
									// mesloadBox3.warningShow();
								}

							})


						})

				}())
				break;
			case '#parametersMange'://参数管理
				(function () {
					let activeSwiper = $('#parametersMange'), // 右侧外部swiper
						activeSubSwiper = $('#parametersMangeInerSwiper'), // 右侧内部swiper
						// activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						panelList = activeSubSwiper.find('.panel'), // 内部swiper的面板集合
						panel1 = panelList.eq(0),
						panelTbody = panelList.find('table tbody'),	//面包表格tbody
						paginationContainer = panelList.find('.pagination'),		// 分页ul标签
						activePanelHeading = panelList.find('.panel-heading'), // 面板头部
						headingMainBtn_1 = activePanelHeading.find('.head-main-btn-1'), // 添加参数类别
						headingMainBtn_2 = activePanelHeading.find('.head-main-btn-2'), // 添加参数
						headingMainBtn_3 = activePanelHeading.find('.head-main-btn-3'), // 添加单位
						statusTypeOption = activePanelHeading.find('.status-type-option'), // 类型选项
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(panel1, {warningContent: '没有此类信息，请重新选择或输入'})

						// 主表格1添加内容
						function addTableData(url, data) {
							$.ajax({
								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
										mesVerticalTableAddData(panel1, {
											thead: {
												theadContent: '序号/参数类别名称/类别编号/类别描述/使用状态/操作',
												theadWidth: '4%/15%/15%/15%/12%/20%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>类别详情</a><a class="table-link parameteresMangeModel" href="javascript:;" data-toggle-modal-target="#parameteresMangeModel"><i class="fa fa-tasks fa-fw"></i>参数详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#submitModelModal2"><i class="fa fa-plus"></i>编辑参数</a></td>'
												],

												// 添加表格主体数据, 这是一个回调函数,这里不需要传参
												dataAddress: function (tbodyTarget, html, result) {
													tbodyTarget.empty() // 清空表格主体
													let map = result.map, // 映射
														dataList = map.resultList, // 主要数据列表
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
																	tempData = dataList[currentTr.index()].standard_parameter_type_name;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 2: {
																	tempData = dataList[currentTr.index()].standard_parameter_type_num;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 3: {
																	tempData = dataList[currentTr.index()].standard_parameter_type_describle;
																	currentTr.children().eq(i).html(tempData)
																}
																	break;
																case 4: {
																	let  parameterIds=[],

																	tempStr = `
																	<select class="form-control table-input input-sm">
																	<option value="0">启用</option>
																	<option value="1">弃用</option>
																	</select>
																	`;
																	tempData = dataList[currentTr.index()].standard_parameter_type_status;
																	currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
																	let	target = currentTr.children().eq(i).find('select');
																	target.val(tempData);

																	target.off('change').on('change', function () {
																	let planStatus = $(this).val()

																	if(planStatus == 0 ){
																		planStatus = 'recover'
																	}else {
																		planStatus = 'deprecated'
																	};
																	parameterIds.push(dataList[currentTr.index()].standard_parameter_type_id);
																	swal({
																		title: '您确定要更改此状态吗？',
																		type: 'question',
																		showCancelButton: true,
																		confirmButtonText: '确定',
																		cancelButtonText: '取消'
																	}).then(function () {
																		$.ajax({
																			type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																			url:modifyParameterTypeStatusUrl,
																			data: {
																				type:planStatus,
																				parameterTypeIds:parameterIds
																			},
																			success: function (result, status, xhr) {
																				if (result.status === 0) {
																					let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																					swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																				}else if(result.status === 7){
																					repeatFail()
																				}
																				else {
																					swallFail()	//操作失败
																				}
																			},
																		})
																	},
																		(dismiss) => {
																			target.val(dataList[currentTr.index()].standard_parameter_type_status);
																		})
																	})
																}
																	break;
																case 5:
																	let thisM= currentTr.children().eq(i).find('.parameteresMangeModel')
																	currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																		let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																			craftID = dataList[currentTr.index()].standard_parameter_type_id;
																		switch (dataContent) {
																			case '#detailModal': {	//详情
																				let dataContent = $('#detailModal'),
																					panelList = dataContent.find('.panel'),

																					modalCloseBtn = dataContent.find('.modal-header').find('.close'),

																					panelThead = panelList.find('thead'),
																					panelTbody = panelList.find('tbody')

																					panelList.find('.panel-heading').find('.modal-title').text("类别详情") // 更换panel标题

																				// 主表格添加内容
																				function addTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																								mesHorizontalTableAddData(panelList.find('table'), null, {
																									thead: '类别名称/类别编号/类别描述/使用状态/创建时间/创建人员',

																									// tableWitch: '25%/75%',
																									viewColGroup: 2,
																									importStaticData: (tbodyTd, length) => {
																										let map = result.map, // 映射
																											dataList = map.resultList, // 主要数据列表
																											tempData = null; // 表格td内的临时数据
																										for (let i = 0, len = length; i < len; i++)
																											switch (i) {
																												case 0: {
																													tempData = dataList[0].standard_parameter_type_name;
																													tbodyTd.eq(i).html(tempData)
																												}
																													break;
																												case 1: {
																													tempData = dataList[0].standard_parameter_type_num;
																													tbodyTd.eq(i).html(tempData)
																												}
																													break;
																												case 2: {
																													tempData = dataList[0].standard_parameter_type_describle;
																													tbodyTd.eq(i).html(tempData)
																												}
																													break;
																												case 3: {
																													tempData = dataList[0].standard_parameter_type_status;
																													if (tempData === '0') {
																													tbodyTd.eq(i).html(`启用`)
																													}
																													 else if (tempData === '1') {
																													tbodyTd.eq(i).html(`弃用`)
																													}
																												}
																													break;
																												case 4: {
																													tempData = dataList[0].standard_parameter_type_creation_time;
																													tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																												}
																													break;
																												case 5: {
																													tempData = dataList[0].standard_parameter_type_creation_staff;
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
																								mesloadBox.warningShow();
																							}
																						}
																					})
																				}

																				// 导航栏点击时运行数据加载
																				addTableData(queryParameterTypeUrl, {
																					type: 'precise',
																					parameterTypeId: craftID,
																					headNum: 1
																				});

																				break;
																			}
																			case '#parameteresMangeModel': {	//参数详情详情
																				let dataContent = $('#parameteresMangeModel'),
																				panelModal1 = dataContent.find('.panel'),
																				panelTbody = panelModal1.find('table tbody'),
																				headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				statusOption = panelModal1.find(".status-type-option"),// 类型选
																				fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
																				paginationContainer = dataContent.find('.pagination'),
																				// ProductTypeList = [],
																				mesloadBox = new MesloadBox(panelModal1, {
																					// 主数据载入窗口
																					warningContent: '没有此类信息，请重新选择或输入'
																				});
																				dataContent.find('.modal-title').text("参数详情") // 更换panel标题
																				headingMainBtn_1.hide()
																				statusOption.hide()
																				panelTbody.empty()
																				fuzzySearchGroup.hide()

																				// 模态框表格增加内容
																				function addModalTableData(url, data) {
																					$.ajax({
																						type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																						dataType:'json',
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
																								mesloadBox.hide()
																								mesVerticalTableAddData(panelModal1, {
																									thead: {
																										theadContent: '序号/参数名称/参数规格/参数描述/单位',
																										theadWidth: '8%/18%/20%/20%/20%'
																									},
																									tbody: {
																										html: [
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>',
																											'<td></td>'
																											// '<td></td>',
																											// '<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'

																										],

																										// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																										dataAddress: function (tbodyTarget, html, result) {
																											let map = result.map, // 映射
																												dataList = result.map.resultListTree, // 主要数据列表
																												tempData = ''; // 表格td内的临时数据
																											// ProductTypeList = dataList;
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
																															tempData = dataList[currentTr.index()].standardParameterList[0].standard_parameter_name
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																													
																														case 2: {
																															tempData = dataList[currentTr.index()].standardParameterList[0].standard_parameter_specifications
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[currentTr.index()].standardParameterList[0].standard_parameter_describle
																															currentTr.children().eq(i).html(tempData)
																														}
																															break;
																														case 4: {
																															tempData = `<a class="table-link" href="javascript:"; data-toggle-modal-target="#publicSelectModalBox"><i class="fa fa-tasks fa-fw" ></i>查看单位</a>`
																														
																															currentTr.children().eq(i).addClass("table-input-td")
																															currentTr.children().eq(i).html(tempData)

																															currentTr.children().eq(i).off("click").on("click","a", function(){
																																let 	parameterId= dataList[currentTr.index()].standardParameterList[0].standard_parameter_id
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
																								
																																panelModal1.find(".panel-heading").find(".head-main-btn-1").text("添加单位")
																																dataContent.find(".panel-title").text("单位详情")
																															
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
																																		type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																																		dataType:'json',
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
																																						theadContent: '序号/单位名称/单位符号/单位类型',
																																						theadWidth: '8%/18%/18%/20%'
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
																																							let map = result.map, // 映射
																																								dataList = result.map.list, // 主要数据列表
																																								tempData = ''; // 表格td内的临时数据
																																							// ProductTypeList = dataList;
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
																																											tempData = dataList[currentTr.index()].parameter_unit_name
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList[currentTr.index()].parameter_unit
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList[currentTr.index()].parameter_unit_type
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
																																						displayRow: result.map.list.length// 显示行数
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

																														
																																addModalTableData(queryParameterUnitsUrl, {
																																	realationParameterId: parameterId,
																																});
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
																										totalRow: result.map.counts, // 总行数
																										displayRow: result.map.resultListTree.length// 显示行数
																									},

																									ajax: {
																										url: url,
																										data: data
																									}

																								})
																							}
																							else {
																								panelTbody.empty().append(NO_DATA_NOTICE)
																								// paginationContainer.hide()	//隐藏分页按钮
																								mesloadBox.warningShow();

																							}
																						}
																					})
																				}
																				addModalTableData(queryNormParameterUrl, {
																					type:"parameterTypeQuery",
																					parameterTypeId: craftID,
																					headNum:1
																				});




																				break;
																			}
																			case '#submitModelModal2': {	//修改参
																					var parameterIDInLineList = [], //   在里面的参数ID集合
																							parameterIDList = [],
																							addParameterIDList = []
																							$.ajax({
																								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																								async: false,
																								url: queryNormParameterUrl,
																								data:{
																									type:"parameterTypeQuery",
																									parameterTypeId: craftID,
																								},
																								success: function (result){
																									if(result.status===0){
																										let map = result.map, // 映射
																										parameterLists = map.resultListTree
																										for (let m = 0, len = parameterLists.length; m < len; m++ ){
																											parameterIDInLineList.push(parameterLists[m].standard_parameter_id) 
																											// console.log(parameterIDInLineList)
																											}
																									}
																								}
																							})
																					// currentTr.children().eq(i).off('click').on('click', 'a', (event) => {

																						let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
																						panelModal1 = targetModal.find('.panel'),
																						title=panelModal1.find("h5"),
																						modalCloseBtn = targetModal.find('.modal-header').find('.close'),
																						modalSubmitBtn = targetModal.find('.modal-footer .modal-submit');	//提交按钮
																						addParameterIDList=addParameterIDList.concat(parameterIDInLineList)

																						selectworkstageParameterAddData2(parameterIDInLineList, addParameterIDList)
																						modalSubmitBtn.show()
																						// 提交数据按钮单击事件
																						modalSubmitBtn.off('click').on('click', (event) => {
																							if (addParameterIDList.length !== 0) {
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

																								if(parameterIDInLineList.length!==0){
																									$.ajax({
																										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																										url: maintainTypeUseParameterUrl,
																										data: {
																											type:"modify",
																											parameterTypeId: craftID,
																											parameterIds: addParameterIDList
																											// parameterIds: ["efa1dfd23bfe40eea4a315fa0b13cb68"]
																										},
																										success: function (result, status, xhr) {
																											if (result.status === 0) {

																												let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																											}else {
																												let msg = result.msg
																												if(msg!==null){
																													swallFail2(msg)
																												}else{
																													swallError();	//格式不正确
																												}
																											}
																										}
																									})
																								}else{
																									$.ajax({
																										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																										url: maintainTypeUseParameterUrl,
																										data: {
																											type:"null",
																											parameterTypeId: craftID,
																											parameterIds: addParameterIDList
																										},
																										success: function (result, status, xhr) {
																											if (result.status === 0) {

																												let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																											}else {
																												let msg = result.msg
																												if(msg!==null){
																													swallFail2(msg)
																												}else{
																													swallError();	//格式不正确
																												}
																											}
																										}
																									})
																								}
																								});
																							}
																							else {
																								swal({
																									title: '请至少选择一个参数',
																									text: '',
																									type: 'question',
																									allowEscapeKey: false, // 用户按esc键不退出
																									allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
																									showCancelButton: false, // 显示用户取消按钮
																									confirmButtonText: '确定',
																									cancelButtonText: '取消',
																								})
																							}

																						})


																					// })

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
												totalRow: result.map.counts, // 总行数
												displayRow: result.map.resultList.length // 显示行数
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
						addTableData(queryParameterTypeUrl, {
							type: 'vague',
							status:0,
							headNum: 1
						});


						// 模糊搜索组加载数据
						fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
							let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "")
							let status = statusTypeOption.val();
							event.stopPropagation() // 禁止向上冒泡
							if (val !== '') {
								addTableData(queryParameterTypeUrl, {
									type: 'vague',
									keyword: val,
									status:status,
									headNum: 1
								});
							}
							else {
								addTableData(queryParameterTypeUrl, {
									type: 'vague',
									status:0,
									headNum: 1
								});
							}

						});

						// 下拉选事件
						statusTypeOption.off("change").on("change",function(){
							let status = $(this).val();
							addTableData(queryParameterTypeUrl, {
							type: 'vague',
							status: status,
							headNum: 1
							});

						})


						// 头部主要按钮1点击,新增参数类别
						headingMainBtn_1.off('click').on('click', (event) => {
							let dataContent = $("#submitModelModal"),
								panelModal1 = dataContent.find('.panel'),
								modalCloseBtn = dataContent.find('.modal-header').find('.close'),
								modalSubmitBtn = dataContent.find('.modal-submit'),
								// 表单要提交的数据
								standardParameterType = {
									standard_parameter_type_name: '',
									standard_parameter_type_num:"",
									standard_parameter_type_describle:"",
									standard_parameter_type_status:"",
									standard_parameter_type_creation_staff:"",
									standard_parameter_type_creation_staff_id:""
								};

								standardParameterType.standard_parameter_type_creation_staff=USERNAME
								standardParameterType.standard_parameter_type_creation_staff_id=USERID

								panelModal1.find('.panel-heading').find('.panel-title').text('新增参数类别') // 更换panel标题

								mesHorizontalTableAddData(panelModal1.find('table'), null, {
									thead: '类别名称/类别编号/类别描述/状态',
									tableWitch: '20%/20%',
									viewColGroup: 2,
									importStaticData: (tbodyTd, length) => {
										let inputHtml;

										for (let i = 0, len = length; i < len; i++) {
											switch (i) {
												case 0: {
													inputHtml = `<input type="text" class="table-input" placeholder="请输入类别名称(必填)" autocomplete="on" />`;
													tbodyTd.eq(i).addClass('table-input-td')
													tbodyTd.eq(i).html(inputHtml)

													let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });

													tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
														mesPopover.hide()
														standardParameterType.standard_parameter_type_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
														if (!USERNAME_REG1.test(standardParameterType.standard_parameter_type_name)) {
															mesPopover.show()
														} else {
															mesPopover.hide()
														}
													})				
													break;
												}
												case 1: {
													inputHtml = `<input type="text" class="table-input" placeholder="请输入编号(必填)" autocomplete="on" />`;
													tbodyTd.eq(i).addClass('table-input-td')
													tbodyTd.eq(i).html(inputHtml)
													tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
														standardParameterType.standard_parameter_type_num = tbodyTd.eq(i).find('input').val()
													})


													break;
												}
												case 2: {
												 inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
												 tbodyTd.eq(i).addClass('table-input-td')
													tbodyTd.eq(i).html(inputHtml)

													// 添加到提交数据
													tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
														standardParameterType.standard_parameter_type_describle = tbodyTd.eq(i).find('input').val()
													})
													break;
												}
												case 3: {
													inputHtml = `<select class="form-control table-input input-sm"><option value="0">启用</option><option value="1">隐藏</option></select>`
													tbodyTd.eq(i).addClass('table-input-td')
													tbodyTd.eq(i).html(inputHtml)
													standardParameterType.standard_parameter_type_status =0
													// 添加到提交数据
													tbodyTd.eq(i).find('select').off('blur').on('blur', (event) => {
														standardParameterType.standard_parameter_type_status = tbodyTd.eq(i).find('select').val()
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
									if (standardParameterType.standard_parameter_type_name !== '') {
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
												type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
												dataType:"json",
												// async: false, //设置为同步请求
												url: saveParameterTypeUrl,
												data: standardParameterType,
												success: function (result, status, xhr) {
													if (result.status === 0) {

														let activePaginationBtn = panelList.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
														swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
													}else if(result.status === 7){
														repeatFail()
													}else {
														let msg = result.msg
														if(msg!==null){
															swallFail2(msg)
														}else{
															swallError();	//格式不正确
														}
													}
												},
												complete : 
    function(XMLHttpRequest, textStatus) {
    // 通过XMLHttpRequest取得响应头，sessionstatus
    var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
    if (sessionstatus == "TIMEOUT") {
    var win = window;
    while (win != win.top){
    win = win.top;
    }
    win.location.href= XMLHttpRequest.getResponseHeader("CONTEXTPATH");
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
						
						// 头部主要按钮2点击,参数管理
						headingMainBtn_2.off('click').on('click', (event) => {
							let dataContent = $('#parameteresMangeModel'),
								panelModal1 = dataContent.find('.panel'),
								headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增设备类型
								modalCloseBtn = dataContent.find('.modal-header').find('.close'),
								statusOption = panelModal1.find(".status-type-option"),// 类型选
								fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
								// ProductTypeList = [],
								mesloadBox = new MesloadBox(panelModal1, {
									// 主数据载入窗口
									warningContent: '没有此类信息，请重新选择或输入'
								});
								panelModal1.find(".panel-heading").find(".head-main-btn-1").text("添加参数")
								dataContent.find(".modal-title").text("参数管理")

								headingMainBtn_1.show()
								statusOption.show()

								panelModal1.find('thead').empty()
								panelModal1.find('tbody').empty()

							// 模态框表格增加内容
								function addModalTableData(url, data) {
									$.ajax({
										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
										dataType:'json',
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
														theadContent: '序号/参数名称/参数描述/使用状态/操作',
														theadWidth: '8%/18%/20%/20%/25%'
													},
													tbody: {
														html: [
															'<td></td>',
															'<td></td>',
															'<td></td>',
															'<td></td>',
															// '<td></td>',
															'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="submitModelModal2"><i class="fa fa-tasks fa-fw"></i>编辑单位</a></td>'

														],

														// 添加表格主体数据, 这是一个回调函数,这里不需要传参
														dataAddress: function (tbodyTarget, html, result) {
															let map = result.map, // 映射
																dataList = result.map.resultListTwo, // 主要数据列表
																tempData = ''; // 表格td内的临时数据
															// ProductTypeList = dataList;
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
																			tempData = dataList[currentTr.index()].standard_parameter_name
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 2: {
																			tempData = dataList[currentTr.index()].standard_parameter_describle
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 3: {
																			let productTypeIds = []
																				tempStr = `
																					<select class="form-control table-input input-sm">
																						<option value="0">启用</option>
																						<option value="1">弃用</option>
																					</select>
																				`;
																			tempData = dataList[currentTr.index()].standard_parameter_status;
																			currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
																			let	target = currentTr.children().eq(i).find('select');
																			target.val(tempData);

																			target.off('change').on('change', function () {
																			let planStatus = $(this).val();
																			if(planStatus == 0 ){
																				planStatus = 'recover'
																			}else {
																				planStatus = 'deprecated'
																			};
																			productTypeIds.push(dataList[currentTr.index()].standard_parameter_id);
																			swal({
																				title: '您确定要更改此状态吗？',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																					url:modifyNormParameterStatusUrl ,
																					data: {
																						type:planStatus,
																						normParameterIds:productTypeIds
																					},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																							swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																						}else if(result.status === 4){
																							swal({
																								title: '名称有重复且正在使用',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								confirmButtonText: '确定',
																							})
																						}
																						else {
																							swallFail()	//操作失败
																						}
																					},
																				})
																			},
																				(dismiss) => {
																					target.val(dataList[currentTr.index()].standard_parameter_status);
																					})
																			})

																		}
																			break;
																		case 4:{
																			currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																				let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																					craftID = dataList[currentTr.index()].standard_parameter_id;
																				switch (dataContent) {
																					case '#detailModal': {	//详情
																						let dataContent = $('#detailModal'),
																							panelList = dataContent.find('.panel'),
																							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																							panelThead = panelList.find('thead'),
																							panelTbody = panelList.find('tbody');
																							panelList.find('.panel-heading').find('.modal-title').text('参数详情')

																							dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
																								$('body').addClass('modal-open')
																							})

																							dataContent.modal({
																								backdrop: false, // 黑色遮罩不可点击
																								keyboard: false,  // esc按键不可弃用模态框
																								show: false
																							})
																							dataContent.modal('show') // 运行时显示

																							panelList.find('thead').empty()
																							panelList.find('tbody').empty()


																						// 主表格添加内容
																						function addTableData(url, data) {
																							$.ajax({
																								type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																										mesHorizontalTableAddData(panelList.find('table'), null, {
																											// thead: '参数名称/参数单位/量产规格/频率`抽样数量/检查和控制方法/数据记录/创建时间/状态/参数备注/创建人员',
																											thead: '参数名称/参数单位/规格/创建时间/状态/参数备注/创建人员',

																											// tableWitch: '25%/75%',
																											viewColGroup: 2,
																											importStaticData: (tbodyTd, length) => {
																												let map = result.map, // 映射
																													dataList = map.resultList, // 主要数据列表
																													tempData = null; // 表格td内的临时数据
																												for (let i = 0, len = length; i < len; i++)
																													switch (i) {
																														case 0: {
																															tempData = dataList[0].standard_parameter_name;
																															tbodyTd.eq(i).html(tempData)
																														}
																															break;
																														case 1: {
																															tempData = `<a class="table-link" href="javascript:"; data-toggle-modal-target="#publicSelectModalBox"><i class="fa fa-tasks fa-fw" ></i>查看单位</a>`
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
																								
																																panelModal1.find(".panel-heading").find(".head-main-btn-1").text("添加单位")
																																dataContent.find(".panel-title").text("单位详情")
																															
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
																																		type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																																		dataType:'json',
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
																																						theadContent: '序号/单位名称/单位符号/单位类型',
																																						theadWidth: '8%/18%/18%/20%'
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
																																							let map = result.map, // 映射
																																								dataList = result.map.list, // 主要数据列表
																																								tempData = ''; // 表格td内的临时数据
																																							// ProductTypeList = dataList;
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
																																											tempData = dataList[currentTr.index()].parameter_unit_name
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 2: {
																																											tempData = dataList[currentTr.index()].parameter_unit
																																											currentTr.children().eq(i).html(tempData)
																																										}
																																											break;
																																										case 3: {
																																											tempData = dataList[currentTr.index()].parameter_unit_type
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
																																						displayRow: result.map.list.length// 显示行数
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

																														
																																addModalTableData(queryParameterUnitsUrl, {
																																	realationParameterId: craftID,
																																});
																															})
																														}
																															break;
																														case 2: {
																															tempData = dataList[0].standard_parameter_specifications;
																															tbodyTd.eq(i).html(tempData)
																														}
																															break;
																														case 3: {
																															tempData = dataList[0].standard_parameter_creation_time;
																															tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																														}
																															break;
																														case 4: {
																															tempData = dataList[0].standard_parameter_status;
																															if (tempData === '0') {
																																tbodyTd.eq(i).html(`启用`)
																																}
																															 else if (tempData === '1') {
																																tbodyTd.eq(i).html(`弃用`)
																																}
																														}
																															break;
																														case 5: {
																															tempData = dataList[0].standard_parameter_describle;
																															tbodyTd.eq(i).html(tempData)
																														}
																															break;
																														case 6: {
																															tempData = dataList[0].standard_parameter_creation_staff;
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
																										mesloadBox.warningShow();
																									}
																								}
																							})
																						}

																						// 导航栏点击时运行数据加载
																						addTableData(queryNormParameterUrl, {
																							type: 'precise',
																							normParameterId: craftID,
																							headNum: 1
																						});

																						break;
																					}
																					case 'submitModelModal2' :{//编辑参数
																						var unitIdOnList = [], //   在里面的单位ID集合
																						unitIDList = [],
																						addUnitIDList = []
																						$.ajax({
																							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																							async: false,
																							url: queryParameterUnitsUrl,
																							data:{
																								// type: 'precise',
																								realationParameterId: craftID,
																								// headNum: 1
																							},
																							success: function (result){
																								if(result.status===0){
																									let map = result.map, // 映射
																									unitLists = map.list
																									for (let m = 0, len = unitLists.length; m < len; m++ ){
																										unitIdOnList.push(unitLists[m].parameter_unit_id) 
																										}
																								}
																							}
																						})

																						let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
																						panelModal1 = targetModal.find('.panel'),
																						title=panelModal1.find("h5"),
																						modalCloseBtn = targetModal.find('.modal-header').find('.close'),
																						modalSubmitBtn = targetModal.find('.modal-footer .modal-submit');	//提交按钮

																						targetModal.modal({
																							backdrop: false, // 黑色遮罩不可点击
																							keyboard: false,  // esc按键不可弃用模态框
																							show: false
																						})

																						targetModal.modal('show') // 运行时显示
							
																						selecUnit(unitIdOnList, unitIdOnList)
							
																						modalSubmitBtn.off('click').on('click', (event) => {
																							if (addUnitIDList)
																							{
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
																										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																										url: maintainStandardParameterAndUnitsUrl,
																										data: {
																											type:"modify",
																											StandarParameterId:craftID,
																											unitIds:unitIdOnList
																										},
													
																										success: function (result, status, xhr) {
																											if (result.status === 0) {
													
																												let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
													
																											}else if(result.status === 7){
																												repeatFail()
																											}else {
																												let msg = result.msg
																												if(msg!==null){
																													swallFail2(msg)
																												}else{
																													swallError();	//格式不正确
																												}
																											}
																										}
																									})
																								});
																							}
																							else {
																								swallError()	//格式不正确
																							}
													
																						})
																					}

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
														totalRow: result.map.counts, // 总行数
														displayRow: result.map.resultListTwo.length// 显示行数
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
								addModalTableData(queryNormParameterUrl, {
									type:"vague",
									//  keyword:"",
									status:0,
									headNum: 1
								});

							// 2级头部主要按钮1点击事件,新增参数
								headingMainBtn_1.off('click').on('click', (event) => {

									let dataContent = submitModelModal,
										panelModal2 = dataContent.find('.panel'),
										modalCloseBtn = dataContent.find('.modal-header').find('.close'),
										modalSubmitBtn = dataContent.find('.modal-submit'),
										// 表单要提交的数据
										jsonObject = {
											standard_parameter_name: '',
											standard_parameter_specifications: "",
											standard_parameter_describle: "",
											standard_parameter_status: 0,
											standard_parameter_creation_staff: "",
											standard_parameter_creation_staff_id: "",
										},
										unitIDList=[]

										jsonObject.standard_parameter_creation_staff = USERNAME
										jsonObject.standard_parameter_creation_staff_id = USERID
									// 修改标题
									panelModal2.find('.panel-heading').find('.panel-title').text('新增参数') // 更换panel标题

									dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
										$('body').addClass('modal-open')
									})
									dataContent.modal({
										backdrop: false, // 黑色遮罩不可点击
										keyboard: false,  // esc按键不可弃用模态框
										show: false
									})
									dataContent.modal('show') // 运行时显示
									modalCloseBtn.off('click').on('click', (event) => {
										// 点击弃用按钮隐藏该模态框
										dataContent.modal('hide')

										// 初始化表格
										panelModal2.find('thead').empty()
										panelModal2.find('tbody').empty()
									})
									//生成表单
									mesHorizontalTableAddData(panelModal2.find('table'), null, {
										// thead: '参数名称/参数单位/量产规格/频率`抽样数量/检查和控制方法/数据记录/状态/参数备注',
										thead: '参数名称/参数单位/量产规格/参数备注',
										tableWitch: '20%',
										viewColGroup: 1,
										importStaticData: (tbodyTd, length) => {
											let inputHtml;

											for (let i = 0, len = length; i < len; i++) {
												switch (i) {
													case 0: {
														inputHtml = `<input type="text" class="table-input" placeholder="请输入参数名称(必填)" autocomplete="on" />`;
														tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)

														let target = tbodyTd.eq(i).find('input'),
														mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });
	
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															mesPopover.hide()
															jsonObject.standard_parameter_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
															if (!USERNAME_REG1.test(jsonObject.standard_parameter_name)) {
																mesPopover.show()
															} else {
																mesPopover.hide()
															}
														})				
													
														break;
													}
													case 1: {
														inputHtml = `<a class="table-link"  href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>选择单位</a>`;
														tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)
														let parameterIDInLineList = []
														tbodyTd.eq(i).find('.table-link').off('click').on('click', function () {
														// 添加单位
															let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
															panelModal1 = targetModal.find('.panel'),
															title=panelModal1.find("h5"),
															modalCloseBtn = targetModal.find('.modal-header').find('.close'),
															modalSubmitBtn = targetModal.find('.modal-footer .modal-submit');	//提交按钮
															addParameterIDList=unitIDList.concat(parameterIDInLineList)

															selecUnit(parameterIDInLineList, unitIDList)

															modalSubmitBtn.off('click').on('click', (event) => {
																modalCloseBtn.trigger('click');
															})
													})


														break;
													}
													case 2: {
													 inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
													 tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)

														// 添加到提交数据
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															jsonObject.standard_parameter_specifications = tbodyTd.eq(i).find('input').val()
														})
														break;
													}
													case 3: {
														inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
														tbodyTd.eq(i).addClass('table-input-td')
														 tbodyTd.eq(i).html(inputHtml)

														 // 添加到提交数据
														 tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															jsonObject.standard_parameter_describle = tbodyTd.eq(i).find('input').val()
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
										let jsonObject2
										if(typeof jsonObject !== 'string'){
											jsonObject2=JSON.stringify(jsonObject)
										}
										
										if (true)
										{
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
													type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
													url: saveNormParameterUrl,
													data: {
														jsonObject:jsonObject2,
														unitIds:unitIDList
													},
													success: function (result, status, xhr) {
														if (result.status === 0) {

															let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
															swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面

														}else {
															let msg = result.msg
															if(msg!==null){
																swallFail2(msg)
															}else{
																swallError();	//格式不正确
															}
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

								fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
									let val = $(this).closest('.input-group').find('input').val(),
									status=statusOption.val()
									event.stopPropagation() // 禁止向上冒泡
									if (val !== '') {
										addModalTableData(queryNormParameterUrl, {
											type: 'vague',
											keyword: val,
											status:status,
											headNum: 1
										});
									}
									else {
										addModalTableData(queryNormParameterUrl, {
											type: 'vague',
											// craftBasicsId: '',
											// keyword: '',
											status: 0,
											headNum: 1
										});
									}

								});

								statusOption.off('change').on('change',function(){
									let status = $(this).val();
									addModalTableData(queryNormParameterUrl, {
										type:"vague",
										status: status,
										headNum: 1
									});
								})
						})

						//3 单位  管理
						headingMainBtn_3.off('click').on('click', (event) => {
							let dataContent = $('#parameteresMangeModel'),
								panelModal1 = dataContent.find('.panel'),
								headingMainBtn_1 = panelModal1.find('.head-main-btn-1'), // 头部主要按键_1,新增设备类型
								modalCloseBtn = dataContent.find('.modal-header').find('.close'),
								statusOption = panelModal1.find(".status-type-option"),// 类型选
								fuzzySearchGroup = panelModal1.find(".fuzzy-search-group"),// 类型选
								paginationContainer = dataContent.find('.pagination'),		// 分页ul标签
								activePanelHeading = dataContent.find('.panel-heading'), // 面板头部
								panelTbody = dataContent.find('table tbody'),	//面包表格tbody
								// ProductTypeList = [],
								mesloadBox = new MesloadBox(panelModal1, {
									// 主数据载入窗口
									warningContent: '没有此类信息，请重新选择或输入'
								});

								panelModal1.find(".panel-heading").find(".head-main-btn-1").text("添加单位")
								dataContent.find(".modal-title").text("单位管理")

								headingMainBtn_1.show()
								statusOption.show()
								fuzzySearchGroup.show()

								panelModal1.find('thead').empty()
								panelModal1.find('tbody').empty()

							// 模态框表格增加内容
								function addModalTableData(url, data) {
									$.ajax({
										type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
										dataType:'json',
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
														theadContent: '序号/单位名称/单位符号/单位类型/使用状态/操作',
														theadWidth: '8%/18%/18%/20%/18%/20%'
													},
													tbody: {
														html: [
															'<td></td>',
															'<td></td>',
															'<td></td>',
															'<td></td>',
															'<td></td>',
															// '<td></td>',
															'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#detailModal"><i class="fa fa-tasks fa-fw"></i>详情</a></td>'

														],

														// 添加表格主体数据, 这是一个回调函数,这里不需要传参
														dataAddress: function (tbodyTarget, html, result) {
															let map = result.map, // 映射
																dataList = result.map.parameterUnitList, // 主要数据列表
																tempData = ''; // 表格td内的临时数据
															// ProductTypeList = dataList;
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
																			tempData = dataList[currentTr.index()].parameter_unit_name
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 2: {
																			tempData = dataList[currentTr.index()].parameter_unit
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 3: {
																			tempData = dataList[currentTr.index()].parameter_unit_type
																			currentTr.children().eq(i).html(tempData)
																		}
																			break;
																		case 4: {
																			let productTypeIds = []
																				tempStr = `
																					<select class="form-control table-input input-sm">
																						<option value="0">启用</option>
																						<option value="1">弃用</option>
																					</select>
																				`;
																			tempData = dataList[currentTr.index()].parameter_unit_status;
																			currentTr.children().eq(i).addClass('table-input-td').html(tempStr);
																			let	target = currentTr.children().eq(i).find('select');
																			target.val(tempData);

																			target.off('change').on('change', function () {
																			let planStatus = $(this).val();
																			if(planStatus == 0 ){
																				planStatus = 'recover'
																			}else {
																				planStatus = 'deprecated'
																			};
																			productTypeIds.push(dataList[currentTr.index()].parameter_unit_id);
																			swal({
																				title: '您确定要更改此状态吗？',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
																					url:modifyStandardParameterUnitStatusUrl ,
																					data: {
																						type:planStatus,
																						unitIds:productTypeIds
																					},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																							swallSuccess(activePaginationBtn)	//操作成功提示并刷新页面
																						}else if(result.status === 4){
																							swal({
																								title: '名称、符号有重复且正在使用',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								confirmButtonText: '确定',
																							})
																						}
																						else {
																							swallFail()	//操作失败
																						}
																					},
																				})
																			},
																				(dismiss) => {
																					target.val(dataList[currentTr.index()].parameter_unit_status);
																					})
																			})

																		}
																			break;
																		case 5:{
																			currentTr.children().eq(i).off('click').on('click', 'a', (event) => {
																				let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																					craftID = dataList[currentTr.index()].parameter_unit_id;
																				switch (dataContent) {
																					case '#detailModal': {	//详情
																						let dataContent = $('#detailModal'),
																						panelList = dataContent.find('.panel'),		
																						modalCloseBtn = dataContent.find('.modal-header').find('.close'),
		
																						panelThead = panelList.find('thead'),
																						panelTbody = panelList.find('tbody');
		
																						panelList.find('.panel-heading').find('.modal-title').text('单位详情') // 更换panel标题
		
																						dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
																							$('body').addClass('modal-open')
																						})
																						dataContent.modal({
																							backdrop: false, // 黑色遮罩不可点击
																							keyboard: false,  // esc按键不可弃用模态框
																							show: false
																						})
																						dataContent.modal('show') // 运行时显示
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
																							type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
																									mesHorizontalTableAddData(panelList.find('table'), null, {
																										thead: '单位名称/单位符号/单位类型/使用状态/创建时间/创建人员/',
		
																										// tableWitch: '25%/75%',
																										viewColGroup: 2,
																										importStaticData: (tbodyTd, length) => {
																											let map = result.map, // 映射
																												dataList = map.parameterUnitList, // 主要数据列表
																												tempData = null; // 表格td内的临时数据
																											for (let i = 0, len = length; i < len; i++)
																												switch (i) {
																													case 0: {
																														tempData = dataList[0].parameter_unit_name;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 1: {
																														tempData = dataList[0].parameter_unit;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[0].parameter_unit_type;
																														tbodyTd.eq(i).html(tempData)
																													}
																														break;
																													case 3: {
																														tempData = dataList[0].parameter_unit_status;
																														if (tempData === '0') {
																														tbodyTd.eq(i).html(`启用`)
																														}
																														 else if (tempData === '1') {
																														tbodyTd.eq(i).html(`弃用`)
																														}
																													}
																														break;
																													case 4: {
																														tempData = dataList[0].parameter_unit_creation_time;
																														tbodyTd.eq(i).html(moment(tempData).format('YYYY-MM-DD'))
																													}
																														break;
																													case 5: {
																														tempData = dataList[0].parameter_unit_creation_staff;
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
																									mesloadBox.warningShow();
																								}
																							}
																						})
																					}
		
																					// 导航栏点击时运行数据加载
																					addTableData(queryStandardParameterUnitsUrl, {
																						type: 'precise',
																						unitId: craftID,
																						headNum: 1
																					});
		
																					break;
																					}

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
														totalRow: result.map.count, // 总行数
														displayRow: result.map.parameterUnitList.length// 显示行数
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
								addModalTableData(queryStandardParameterUnitsUrl, {
									type:"vague",
									status:0,
									headNum: 1
								});

							// 2级头部主要按钮1点击事件,新增单位
								headingMainBtn_1.off('click').on('click', (event) => {

									let dataContent = submitModelModal,
										panelModal2 = dataContent.find('.panel'),
										modalCloseBtn = dataContent.find('.modal-header').find('.close'),
										modalSubmitBtn = dataContent.find('.modal-submit'),
										// 表单要提交的数据
										standarParameterUnit = {
											parameter_unit_name: '',
											parameter_unit: '',
											parameter_unit_type: "",
											parameter_unit_creation_staff: "",
											parameter_unit_creation_staff_id: "",
										};

										standarParameterUnit.parameter_unit_creation_staff = USERNAME
										standarParameterUnit.parameter_unit_creation_staff_id = USERID
									// 修改标题
									panelModal2.find('.panel-heading').find('.panel-title').text('新增单位') // 更换panel标题

									dataContent.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
										$('body').addClass('modal-open')
									})
									dataContent.modal({
										backdrop: false, // 黑色遮罩不可点击
										keyboard: false,  // esc按键不可弃用模态框
										show: false
									})
									dataContent.modal('show') // 运行时显示
									modalCloseBtn.off('click').on('click', (event) => {
										// 点击弃用按钮隐藏该模态框
										dataContent.modal('hide')

										// 初始化表格
										panelModal2.find('thead').empty()
										panelModal2.find('tbody').empty()
									})
									//生成表单
									mesHorizontalTableAddData(panelModal2.find('table'), null, {
										thead: '单位名称/单位符号/单位类型',
										tableWitch: '20%',
										viewColGroup: 1,
										importStaticData: (tbodyTd, length) => {
											let inputHtml;

											for (let i = 0, len = length; i < len; i++) {
												switch (i) {
													case 0: {
														inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`;
														tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)

														let target = tbodyTd.eq(i).find('input'),
														mesPopover = new MesPopover(target, { content: '中文、字母、数字、下划线组合，1-16位字符' });
	
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															mesPopover.hide()
															standarParameterUnit.parameter_unit_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
															if (!USERNAME_REG1.test(standarParameterUnit.parameter_unit_name)) {
																mesPopover.show()
															} else {
																mesPopover.hide()
															}
														})				
														break;
													}
													case 1: {
														inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`;
														tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															standarParameterUnit.parameter_unit = tbodyTd.eq(i).find('input').val()
														})


														break;
													}
													case 2: {
													 inputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`;
													 tbodyTd.eq(i).addClass('table-input-td')
														tbodyTd.eq(i).html(inputHtml)

														// 添加到提交数据
														tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
															standarParameterUnit.parameter_unit_type = tbodyTd.eq(i).find('input').val()
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
										if (standarParameterUnit.getParameter_unit_name !== '')
										{
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
													type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
													url: saveStandardParameterUnitUrl,
													data: standarParameterUnit,

													success: function (result, status, xhr) {
														if (result.status === 0) {
															let activePaginationBtn = panelModal1.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
															swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面

														}else if(result.status === 7){
															swal({
																title: '名称、符号有重复且正在使用',
																type: 'question',
																allowEscapeKey: false, // 用户按esc键不退出
																allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																showCancelButton: false, // 显示用户取消按钮
																confirmButtonText: '确定',
															})
														}else {
															let msg = result.msg
															if(msg!==null){
																swallFail2(msg)
															}else{
																swallError();	//格式不正确
															}
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

								fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
									let val = $(this).closest('.input-group').find('input').val(),
									status=statusOption.val()
									event.stopPropagation() // 禁止向上冒泡
									addModalTableData(queryStandardParameterUnitsUrl, {
										type: 'vague',
										keyword: val,
										status:status,
										headNum: 1
									});

								});

								statusOption.off('change').on('change',function(){
									let val = fuzzySearchGroup.closest('.input-group').find('input').val()
									let status = $(this).val();
									addModalTableData(queryStandardParameterUnitsUrl, {
										type:"vague",
										status: status,
										keyword: val,
										headNum: 1
									});
								})
						})


				}())
				break;


		}
	})
	leftNavLink.eq(0).trigger('click');



	/**
	 * @description :员工选择模态框（单选）
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

		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可弃用模态框
			show: false
		})
		selectStaffModal.modal('show') // 运行时显示
		selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
			$('body').addClass('modal-open')
		})

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
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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

		// 部门选择
		function departmentSelectAddOption(target, url, data) {
			let originalOption = ['全部部门'], // 初始化选项
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
				}
			}

			$.ajax({
				url: url,
				dataType: 'json',
				type: 'POST',
				data: data,
				success: (result) => {
					let warehouseList = result.map.dept;

					for (let i = 0, len = warehouseList.length; i < len; i++) {
						let optionHtml = `<option value="${warehouseList[i].role_dept_name}">${warehouseList[i].role_dept_name}</option>`;

						target.append(optionHtml);
					}

					target.on('change', (event) => {
						let selectOptionIndex = target[0].selectedIndex
						event.stopImmediatePropagation()
						if (selectOptionIndex < originalOptionLength) {
							originalFunction[selectOptionIndex]()
						}
						else {
							addTableData(url, {
								type: 'deptPaging',
								key: '',
								dept: warehouseList[selectOptionIndex - originalOptionLength].role_dept_id,
								headNum: 1
							})
						}
					});
				}
			})
		}
		// departmentSelectAddOption(selectDepartment, url, data)

		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
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
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					fuzzySearchGroupTarget.find('.btn').trigger('click')	//模拟点击搜索按钮
				}
			});
		}

		fuzzySearchFunc(fuzzySearchGroup, url, data)

	}

	/**
	 * @description 参数选择模态框（多选）
	 * @param {any} parameterIDonList 已经选择的集合
	 * @param {any} parameterIDList 要提交的集合只能为空
	 */
	function selectworkstageParameterAddData2(parameterIDonList,parameterIDList) {
		let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.panel-title'),
			selectDepartment = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 初始化设置
		modalTitle.html('选择参数') // 设置标题
		selectDepartment.hide()
		fuzzySearchGroup.show()

		// 初始化表格
		targetTable.find('thead').empty()
		targetTable.find('tbody').empty()
		// fuzzySearchGroup.hide()
		// 加载数据

		function addTableData(url, data) {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
								theadContent: '序号/参数名称/参数描述/操作',
								theadWidth: '10%/20%/20%/20%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td><label class="checkbox- inline"><input type="checkbox">选择</label></td>',
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										workshopList = map.resultListTwo, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = workshopList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i),// 循环到的当前行
										selectHtml = `<select class="form-control table-input input-sm"></select>`

										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = workshopList[currentTr.index()].standard_parameter_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = workshopList[currentTr.index()].standard_parameter_describle;
													currentTr.children().eq(i).html(tempData)

												}
													break;
												case 3: {
													let standard_parameter_id;	//  半成品参数id
													standard_parameter_id = workshopList[currentTr.index()].standard_parameter_id;

													if (traverseListPush2(parameterIDList, standard_parameter_id)) {
														currentTr.children().eq(i).find(':checkbox').prop('checked', true)
														currentTr.addClass("text-success");
													}

													//单选框选中取消事件
													currentTr.children().eq(i).off('click').on('click', ':checkbox', function () {
														if ($(this).is(':checked')) {  //表示选中
															currentTr.addClass("text-success");
															traverseListPush(parameterIDList, standard_parameter_id);	//将功能id放入功能id集合
														} else {                       //表示取消
															currentTr.removeClass("text-success");
															traverseListDelete(parameterIDList, standard_parameter_id);
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
								totalRow: result.map.counts, // 总行数
								displayRow: result.map.resultListTwo.length // 显示行数
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

		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val()
			// status=statusOption.val()
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryNormParameterUrl, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				});
			}
			else {
				addTableData(queryNormParameterUrl, {
					type: 'vague',
					// craftBasicsId: '',
					// keyword: '',
					status: 0,
					headNum: 1
				});
			}

		});
		addTableData(queryNormParameterUrl, {
			type: 'vague',
			status:0,
			headNum: 1
		});

	}

	function selectworkstageParameterAddData(parameterIDonList,parameterIDList,url,data) {
		let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			panelTbody = targetModalPanel.find('tbody'),	//面版表格tbody
			paginationContainer = targetModalPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.panel-title'),
			selectDepartment = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 初始化设置
		modalTitle.html('选择参数') // 设置标题
		selectDepartment.hide()
		fuzzySearchGroup.hide()

		// 初始化表格
		targetTable.find('thead').empty()
		targetTable.find('tbody').empty()
		// 加载数据


		function addTableData(url, data) {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
								theadContent: '序号/参数名称/参数描述/操作',
								theadWidth: '10%/20%/20%/20%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td><label class="checkbox- inline"><input type="checkbox">选择</label></td>',
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										workshopList = map.resultListTree, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = workshopList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i),// 循环到的当前行
										selectHtml = `<select class="form-control table-input input-sm"></select>`

										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = workshopList[currentTr.index()].standardParameterList[0].standard_parameter_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = workshopList[currentTr.index()].standardParameterList[0].standard_parameter_describle;
													currentTr.children().eq(i).html(tempData)

												}
													break;
												case 3: {
													let standard_parameter_id;	//  半成品参数id
													standard_parameter_id = workshopList[currentTr.index()].standardParameterList[0].standard_parameter_id;

													if (traverseListPush2(parameterIDList, standard_parameter_id)) {
														currentTr.children().eq(i).find(':checkbox').prop('checked', true)
														currentTr.addClass("text-success");
													}

													//单选框选中取消事件
													currentTr.children().eq(i).off('click').on('click', ':checkbox', function () {
														if ($(this).is(':checked')) {  //表示选中
															currentTr.addClass("text-success");
															traverseListPush(parameterIDList, standard_parameter_id);	//将功能id放入功能id集合
														} else {                       //表示取消
															currentTr.removeClass("text-success");
															traverseListDelete(parameterIDList, standard_parameter_id);
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
								totalRow: result.map.counts, // 总行数
								displayRow: result.map.resultListTree.length // 显示行数
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

		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val()
			// status=statusOption.val()
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryNormParameterUrl, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				});
			}
			else {
				addTableData(queryNormParameterUrl, {
					type: 'vague',
					// craftBasicsId: '',
					// keyword: '',
					status: 0,
					headNum: 1
				});
			}

		});
		if(semiProParamersTypeId!==undefined && semiProParamersTypeId!==null && semiProParamersTypeId!==""){
			addTableData(url,data);
		}else{
			panelTbody.empty().append(NO_DATA_NOTICE)
			paginationContainer.hide()	//隐藏分页按钮
			mesloadBox.warningShow();
		}


	}

	// 添加工步参数单选
	function selectWorkstepParamersAddData(resolve, url, data,workSrepParIDList) {
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
				warningContent: '没有此类信息，请首先添加一个工步参数'
			})

		// 需要的功能
		selectDepartment.hide()
		fuzzySearchGroup.hide()

		// 修改标题
		// modalTitle.html('')

		selectStaffModal.modal({
			backdrop: false, // 黑色遮罩不可点击
			keyboard: false,  // esc按键不可弃用模态框
			show: false
		})
		selectStaffModal.modal('show') // 运行时显示
		selectStaffModal.off('hidden.bs.modal').on('hidden.bs.modal', function () {
			$('body').addClass('modal-open')
		})

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
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
								theadContent: '序号/参数名称/参数描述',
								theadWidth: '30%/30%/30%'
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
										dataList = map.resultListTree, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
										currentTrId=dataList[currentTr.index()].standardParameterList[0].standard_parameter_id
										if (traverseListPush2(workSrepParIDList,currentTrId)){
											currentTr.addClass("success")
										}
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												workStepParId: dataList[currentTr.index()].standardParameterList[0].standard_parameter_id,
												workStepParName: dataList[currentTr.index()].standardParameterList[0].standard_parameter_name
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
													tempData = dataList[currentTr.index()].standardParameterList[0].standard_parameter_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].standardParameterList[0].standard_parameter_describle;
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
								totalRow: result.map.counts, // 总行数
								displayRow: result.map.resultListTree.length // 显示行数
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
		if(workstepParamersTypeId!==undefined && workstepParamersTypeId!==null && workstepParamersTypeId!==""){
			addTableData(url,data) // 启动运行
		}else{
			panelTbody.empty().append(NO_DATA_NOTICE)
			paginationContainer.hide()	//隐藏分页按钮
			mesloadBox.warningShow();
		}




		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val()
			// status=statusOption.val()
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryNormParameterUrl, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				});
			}
			else {
				addTableData(queryNormParameterUrl, {
					type: 'vague',
					// craftBasicsId: '',
					// keyword: '',
					status: 0,
					headNum: 1
				});
			}

		});

	}

	/**
 * @description 设备选择选择模态框（多选）
 * @param {any} ProductIDInLineList 已经选择的车间id集合
 * @param {any} ProductIDList 要提交的车间id集合，只能为空
 */
	function selectProductsAddData(ProductIDInLineList, ProductIDList) {
		let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),	 // 表格
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),	 // 弃用按钮
			modalTitle = targetModal.find('.modal-title'),	 // 标题
			ProductTypeOption = targetModalPanel.find('.pullDownMenu-1'), // 设备类型选项
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索组
			// workshopIDList = [],
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 初始化设置
		modalTitle.html('选择设备') // 设置标题

		// 设备下拉菜单添加选项
		createProductTypeSelect(ProductTypeOption);

		// 加载数据
		function addTableData(url, data) {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
										ProductpList = map.Product, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = ProductpList.length; i < len; i++) {
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
													tempData = ProductpList[currentTr.index()].Product_control_Product_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = ProductpList[currentTr.index()].Product_control_Product_number;
													currentTr.children().eq(i).html(tempData)

												}
													break;
												case 3: {

													let ProductID;	//车间id
													ProductID = ProductpList[currentTr.index()].Product_control_Product_id;

													if (traverseListPush2(ProductIDInLineList, ProductID)) {
														currentTr.children().eq(i).find(':checkbox').prop('checked', true).attr('disabled', true);
														currentTr.addClass("text-success");
													}

													//单选框选中取消事件
													currentTr.children().eq(i).off('click').on('click', ':checkbox', function () {

														if ($(this).is(':checked')) {  //表示选中
															currentTr.addClass("text-success");
															traverseListPush(ProductIDList, ProductID);	//将功能id放入功能id集合
														} else {                        //表示取消
															currentTr.removeClass("text-success");
															traverseListDelete(ProductIDList, ProductID);
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
								displayRow: result.map.Product.length // 显示行数
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
		addTableData(queryProductUrl, {
			type: 'all',
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryProductUrl, {
					type: 'key',
					keyWord: val,
					headNum: 1
				})
			}
			else {
				// 为空时重置搜索
				return;
			}

		});

		// 模糊搜索回车搜索
		fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault()
				$(this).closest('.input-group').find('button').trigger('click')
			}
		});

		// 下拉选事件
		ProductTypeOption.change(function () {
			let val = $(this).val();

			addTableData(queryProductUrl, {
				type: 'typeId',
				typeId: val,
				headNum: 1
			})
		})

	}

	/**
	 * @description :工艺基础选择模态框（单选）
	 *@param resolve: Promise回调函数
	 */
	function selectCraftAddData2(resolve) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
      staffListPanel = selectStaffModal.find('.panel'), // 面板
      panelTbody = staffListPanel.find('table tbody'),	//面包表格tbody
      paginationContainer = staffListPanel.find('.pagination'),
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
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/工艺名称/工艺编号/工艺备注',
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
										dataList = map.craftBasicsList, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												craftId: dataList[currentTr.index()].craft_basics_id,
												craftName: dataList[currentTr.index()].craft_name,
												craftNumber: dataList[currentTr.index()].craft_number
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
													tempData = dataList[currentTr.index()].craft_name;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].craft_number;
													currentTr.children().eq(i).html(tempData);

												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].craft_basics_describe;
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
								totalRow: result.map.count, // 总行数
								displayRow: result.map.craftBasicsList.length // 显示行数
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
		addTableData(queryCraftBasicsUrl, {
			type: 'vague',
			status:0,
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryCraftBasicsUrl, {
					type: 'vague',
					keyword: val,
					status: 0,
					headNum: 1
				})
			}
			else {
				addTableData(queryCraftBasicsUrl, {
					type: 'vague',
					status:0,
					headNum: 1
				}) // 启动运行
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

		/**
	 * @description :工艺段基础选择模态框（单选）
	 *@param resolve: Promise回调函数
	 */
	function selectCraftSegmentAddData2(resolve) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
      staffListPanel = selectStaffModal.find('.panel'), // 面板
      panelTbody = staffListPanel.find('table tbody'),	//面包表格tbody
      paginationContainer = staffListPanel.find('.pagination'),
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
		modalTitle.html('选择工艺段')
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
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/工艺段名称/工艺段编号/工艺段备注',
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
										dataList = map.craftSegmentDasicsList, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												craftId: dataList[currentTr.index()].craft_segment_basics_id,
												craftName: dataList[currentTr.index()].craft_segment_name,
												craftNumber: dataList[currentTr.index()].craft_segment_number
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
													tempData = dataList[currentTr.index()].craft_segment_name;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].craft_segment_number;
													currentTr.children().eq(i).html(tempData);

												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].craft_segment_basics_describe;
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
								totalRow: result.map.count, // 总行数
								displayRow: result.map.craftSegmentDasicsList.length // 显示行数
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
		addTableData(queryCraftSegmentBasicsUrl, {
			type: 'vague',
			status:0,
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryCraftSegmentBasicsUrl, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				})
			}
			else {
				addTableData(queryCraftSegmentBasicsUrl, {
					type: 'vague',
					status:0,
					headNum: 1
				})
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



		/**
	 * @description :工艺段管理选择模态框（单选）
	 *@param resolve: Promise回调函数
	 */
	function selectCraftSegmentAddData(resolve,workstageIDList) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			panelTbody = staffListPanel.find('table tbody'),	//面包表格tbody
      paginationContainer = staffListPanel.find('.pagination'),
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
		modalTitle.html('选择工艺段')
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
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/工艺段名称/工艺段编号/工艺段版本号/极性',
								theadWidth: '10%/20%/20%/20%/20%'
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
										dataList = map.craftSegment, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
										currentTrId=dataList[currentTr.index()].craft_segment_id

										if (traverseListPush2(workstageIDList,currentTrId)){
											currentTr.addClass("success")
										}

										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												craftId: dataList[currentTr.index()].craft_segment_id,
												craftName: dataList[currentTr.index()].craft_segment_name,
												craftNumber: dataList[currentTr.index()].craft_segment_number,
												craftSementVersions: dataList[currentTr.index()].craft_segment_versions,
												craftSementPolarity: dataList[currentTr.index()].craft_segment_polarity,
												craftTypeName: dataList[currentTr.index()].product_model_type_name,
												craftGenre: dataList[currentTr.index()].product_model_genre,
												qualityRate: dataList[currentTr.index()].craft_segment_quality_rate
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
													tempData = dataList[currentTr.index()].craft_segment_name;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].craft_segment_number;
													currentTr.children().eq(i).html(tempData);

												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].craft_segment_versions;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 4: {
													tempData = dataList[currentTr.index()].craft_segment_polarity;
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
								totalRow: result.map.line, // 总行数
								displayRow: result.map.craftSegment.length // 显示行数
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
		addTableData(queryCraftSegmentOutlineUrl, {
			// type: 'vague',
			status:0,
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryCraftSegmentOutlineUrl, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				});
			}
			else {
				addTableData(queryCraftSegmentOutlineUrl, {
					type: 'vague',
					status:0,
					headNum: 1
				}) // 启动运行
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

			/**
	 * @description :工序管理选择模态框（单选）
	 *@param resolve: Promise回调函数
	 */
	function selectWorkStageAddData(resolve, workstageIDList) {
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			panelTbody = staffListPanel.find('table tbody'),	//面包表格tbody
      paginationContainer = staffListPanel.find('.pagination'),
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
		modalTitle.html('选择工序')
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
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/工序名称/工序编号/工序版本号/极性',
								theadWidth: '10%/20%/20%/20%/20%'
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
										dataList = map.workstages, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i), // 循环到的当前行
										currentTrId=dataList[currentTr.index()].workstage_id

										if (traverseListPush2(workstageIDList,currentTrId)){
											currentTr.addClass("success")
										}

										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												craftId: dataList[currentTr.index()].workstage_id,
												craftName: dataList[currentTr.index()].workstage_name,
												craftNumber: dataList[currentTr.index()].workstage_number,
												craftSementVersions: dataList[currentTr.index()].workstage_versions,
												craftSementPolarity: dataList[currentTr.index()].workstage_polarity,
												craftTypeName: dataList[currentTr.index()].product_model_type_name,
												craftGenre: dataList[currentTr.index()].product_model_genre,
												qualityRate: dataList[currentTr.index()].workstage_quality_rate
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
													tempData = dataList[currentTr.index()].workstage_name;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].workstage_number;
													currentTr.children().eq(i).html(tempData);

												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].workstage_versions;
													currentTr.children().eq(i).html(tempData);
												}
													break;
												case 4: {
													tempData = dataList[currentTr.index()].workstage_polarity;
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
								totalRow: result.map.line, // 总行数
								displayRow: result.map.workstages.length // 显示行数
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
		addTableData(queryWorkstageOutlineUrl, {
			// type: 'vague',
			status:0,
			headNum: 1
		}) // 启动运行

		// 模糊搜索组加载数据
		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val();
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryWorkstageOutlineUrl, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				})
			}
			else {
				addTableData(queryWorkstageOutlineUrl, {
					// type: 'vague',
					status:0,
					headNum: 1
				}) // 启动运行
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

	/**
	* @description :查询工艺历史版本
	*@param resolve: Promise回调函数
	*@param url: 请求路径
	*@param data: 请求参数
  */
  function checkHistory2(url,data){
    let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
    staffListPanel = selectStaffModal.find('.panel'), // 面板
    targetTable = staffListPanel.find('table'),
    panelTbody = staffListPanel.find('table tbody'),	//面包表格tbody
    paginationContainer = staffListPanel.find('.pagination'),
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
    fuzzySearchGroup.hide()

    // 修改标题
    modalTitle.html('历史版本信息')

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
        type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
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
                theadContent: '序号/工艺段名称/版本号/使用状态/创建时间',
                theadWidth: '10%/20%/20%/20%/20%'
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
                    dataList = map.craftList, // 主要数据列表
                    tempData = null; // 表格td内的临时数据

                  for (let i = 0, len = dataList.length; i < len; i++) {
                    tbodyTarget.append('<tr></tr>'); // 添加行
                    let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
                    // currentTr.off('click').on('click', (event) => {
                    //   // selectStaffModal.modal('hide')
                    //   // resolve({
                    //   //   roleStaffId: dataList[currentTr.index()].role_staff_id,
                    //   //   roleStaffName: dataList[currentTr.index()].role_staff_name
                    //   // })
                    // })
                    for (let i = 0, len = html.length; i < len; i++) {
                      currentTr.append(html[i]); // 添加表格内的HTML
                      switch (i) {
                        case 0: {
                          currentTr.children().eq(i).html(currentTr.index() + 1)
                        }
                          break;
                        case 1: {
                          tempData = dataList[currentTr.index()].craft_name;
                          currentTr.children().eq(i).html(tempData)
                        }
                          break;
                        case 2: {
                          tempData = dataList[currentTr.index()].craft_versions;
                          currentTr.children().eq(i).html(tempData)
                        }
                          break;
                        case 3: {
                          tempData = dataList[currentTr.index()].craft_status;
                          if( tempData == 0){
                            currentTr.children().eq(i).html("启用")
                          }else{
                            currentTr.children().eq(i).html("弃用")
                          }
                        }
                          break;
                        case 4: {
                          try {
                            tempData = dataList[currentTr.index()].craft_creation_time;
                            currentTr.children().eq(i).html(moment(tempData).format('YYYY-MM-DD'))
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
                totalRow: result.map.line, // 总行数
                displayRow: result.map.craftList.length // 显示行数
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
    addTableData(url,data) // 启动运行

    //模糊搜索组加载数据
    fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
      let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "")
      event.stopPropagation() // 禁止向上冒泡
      if (val !== '') {
        addTableData(queryCraftOutlinetUrl, {
          // type: 'vague',
          keyword: val,
          status:0,
          headNum: 1
        });
      }
      else {
        addTableData(queryCraftOutlinetUrl, {
          // type: 'vague',
          status:0,
          headNum: 1
        });
      }

    });

    // 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				if (val !== '') {
					addTableData(url, {
            type: 'vague',
            keyword: val,
            headNum: 1
					}) // 启动运行
				}
				else {
					// 为空时搜索全部
					addTableData(url, {
					  type: 'vague',
            status:0,
            headNum: 1
					})
				}
				//清空搜索框并获取焦点
				$(this).closest('.input-group').find('input').focus().val('')
			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					fuzzySearchGroupTarget.find('.btn').trigger('click')	//模拟点击搜索按钮
				}
			});
		}

		// fuzzySearchFunc(fuzzySearchGroup, url, data)



	}
	//工艺段历史版本
  function checkHistory(url,data){
    let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
    staffListPanel = selectStaffModal.find('.panel'), // 面板
    targetTable = staffListPanel.find('table'),
    panelTbody = staffListPanel.find('table tbody'),	//面包表格tbody
    paginationContainer = staffListPanel.find('.pagination'),
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
    fuzzySearchGroup.hide()

    // 修改标题
    modalTitle.html('历史版本信息')

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
        type: "POST",         dataType: "json",         　　 xhrFields: {                 withCredentials: true             },             crossDomain: true,
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
                theadContent: '序号/版本号/产品类型/产品型号/极性',
                theadWidth: '10%/20%/20%/20%/20%'
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
                    dataList = map.craftSegments, // 主要数据列表
                    tempData = null; // 表格td内的临时数据

                  for (let i = 0, len = dataList.length; i < len; i++) {
                    tbodyTarget.append('<tr></tr>'); // 添加行
                    let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
                    // currentTr.off('click').on('click', (event) => {
                    //   // selectStaffModal.modal('hide')
                    //   // resolve({
                    //   //   roleStaffId: dataList[currentTr.index()].role_staff_id,
                    //   //   roleStaffName: dataList[currentTr.index()].role_staff_name
                    //   // })
                    // })
                    for (let i = 0, len = html.length; i < len; i++) {
                      currentTr.append(html[i]); // 添加表格内的HTML
                      switch (i) {
                        case 0: {
                          currentTr.children().eq(i).html(currentTr.index() + 1)
                        }
                          break;
                        case 1: {
                          tempData = dataList[currentTr.index()].craft_segment_versions;
                          currentTr.children().eq(i).html(tempData)
                        }
                          break;
                        case 2: {
                          tempData = dataList[currentTr.index()].product_model_type_name;
                          currentTr.children().eq(i).html(tempData)
                        }
                          break;
                        case 3: {
                          tempData = dataList[currentTr.index()].product_model_genre;
                          currentTr.children().eq(i).html(tempData)
                        }
                          break;
                        case 4: {
                          tempData = dataList[currentTr.index()].craft_segment_polarity;
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
                displayRow: result.map.craftSegments.length // 显示行数
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
    addTableData(url,data) // 启动运行

    //模糊搜索组加载数据
    fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
      let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "")
      event.stopPropagation() // 禁止向上冒泡
      if (val !== '') {
        addTableData(queryCraftOutlinetUrl, {
          // type: 'vague',
          keyword: val,
          status:0,
          headNum: 1
        });
      }
      else {
        addTableData(queryCraftOutlinetUrl, {
          // type: 'vague',
          status:0,
          headNum: 1
        });
      }

    });

    // 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				if (val !== '') {
					addTableData(url, {
            type: 'vague',
            keyword: val,
            headNum: 1
					}) // 启动运行
				}
				else {
					// 为空时搜索全部
					addTableData(url, {
					  type: 'vague',
            status:0,
            headNum: 1
					})
				}
				//清空搜索框并获取焦点
				$(this).closest('.input-group').find('input').focus().val('')
			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					fuzzySearchGroupTarget.find('.btn').trigger('click')	//模拟点击搜索按钮
				}
			});
		}

		// fuzzySearchFunc(fuzzySearchGroup, url, data)



	}
	
/**
	* @description :单位选择模态框(多选  第二层弹窗)
	*@param resolve: Promise回调函数
	*@param url: 请求路径
	*@param data: 请求参数
  */
	function selecUnit(parameterIDonList,unitIDList) {
		let targetModal = $(document.getElementById('submitModelModal2')), // 模态框
			targetModalPanel = targetModal.find('.panel'), // 面板
			targetTable = targetModalPanel.find('table'),
			modalCloseBtn = targetModal.find('.modal-header').find('.close'),
			modalTitle = targetModal.find('.panel-title'),
			selectDepartment = targetModalPanel.find('.pullDownMenu-1'), // 选择下拉菜单
			fuzzySearchGroup = targetModalPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			mesloadBox = new MesloadBox(targetModalPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

		// 初始化设置
		modalTitle.html('选择单位') // 设置标题
		selectDepartment.hide()

		// 初始化表格
		targetTable.find('thead').empty()
		targetTable.find('tbody').empty()
		// fuzzySearchGroup.hide()
		// 加载数据

		targetModal.modal({
      backdrop: false, // 黑色遮罩不可点击
      keyboard: false,  // esc按键不可弃用模态框
      show: false
    })
    targetModal.modal('show') // 运行时显示
    modalCloseBtn.off('click').on('click', (event) => {
      // 点击弃用按钮隐藏该模态框
      targetModal.modal('hide')

      // 初始化表格
      targetTable.find('thead').empty()
      targetTable.find('tbody').empty()
    })

		function addTableData(url, data) {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
								theadContent: '序号/单位名称/单位符号/单位类型/操作',
								theadWidth: '8%/20%/12%/20%/10%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td><label class="checkbox- inline"><input type="checkbox">选择</label></td>',
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										workshopList = map.parameterUnitList, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = workshopList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i),// 循环到的当前行
												currentTrId = workshopList[currentTr.index()].parameter_unit_id;							
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = workshopList[currentTr.index()].parameter_unit_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = workshopList[currentTr.index()].parameter_unit;
													currentTr.children().eq(i).html(tempData)

												}
													break;
												case 3: {
													tempData = workshopList[currentTr.index()].parameter_unit_type;
													currentTr.children().eq(i).html(tempData)

												}
													break;
												case 4: {
													if (traverseListPush2(unitIDList, currentTrId)) {
														currentTr.children().find(':checkbox').prop('checked', true)
														currentTr.addClass("success");
													}

													//单选框选中取消事件
													currentTr.children().eq(i).off('click').on('click', ':checkbox', function () {
														if ($(this).is(':checked')) {  //表示选中
															currentTr.addClass("success");
															traverseListPush(unitIDList, currentTrId);	//将功能id放入功能id集合
														} else {                       //表示取消
															currentTr.removeClass("success");
															traverseListDelete(unitIDList, currentTrId);
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
								displayRow: result.map.parameterUnitList.length // 显示行数
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

		fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
			let val = $(this).closest('.input-group').find('input').val()
			// status=statusOption.val()
			event.stopPropagation() // 禁止向上冒泡
			if (val !== '') {
				addTableData(queryStandardParameterUnitsUrl, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				});
			}
			else {
				addTableData(queryStandardParameterUnitsUrl, {
					type: 'vague',
					status: 0,
					headNum: 1
				});
			}

		});
		addTableData(queryStandardParameterUnitsUrl, {
			type: 'vague',
			status:0,
			headNum: 1
		});

	}
/**
	* @description :供应商选择模态框(单选  第二层弹窗)
	*@param resolve: Promise回调函数
	*@param url: 请求路径
	*@param data: 请求参数
  */
	function selectSupplier(resolve, url, data) {
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
		modalTitle.html('选择供应商')
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
		function addTableData(url,data) {
			$.ajax({
				type: "POST",  dataType: "json",   xhrFields: {  withCredentials: true  },  crossDomain: true,
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
								theadContent: '序号/名称/性质/电话/邮箱/地址',
								theadWidth: '8%/15%/10%/15%/15%/15%'
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
										dataList = map.supplier, // 主要数据列表
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
													tempData = dataList[currentTr.index()].supplier_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].supplier_property;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].supplier_phone;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 4: {
													tempData = dataList[currentTr.index()].supplier_email;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 5: {
													tempData = dataList[currentTr.index()].supplier_address;
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
								totalRow: result.map.supplier.length, // 总行数
								displayRow: result.map.supplier.length // 显示行数
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
		addTableData(url,data) // 启动运行
	}

	//后续修改的bug
	$('.treeview>a:first-child').click(function(){
		$('.treeview>a:first-child').removeClass('treeview-active')
		$(this).addClass('treeview-active')
	})


})

