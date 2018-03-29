$(function () {
	let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
		RightContent = $('#mainRightContent'), // 右侧内容栏
		RightContentSwiper = RightContent.find('.swiper-wrapper'), // 右侧内容栏下的swiper
		leftNavLink = leftNav.find('a').filter('[href^="#"]') // 左侧变栏对应的swiper



	leftNavLink.on('click', function (event) {
		let targetHref = event.currentTarget.getAttribute('href'),
		classAttr = event.currentTarget.getAttribute('class');
         if(targetHref=='#documentHelp' || targetHref=='#aboutUs'){
			 $('body').addClass('scroll');
		 }else{
			$('body').removeClass('scroll');
		 }
		switch (targetHref) {
			case '#staffManage':	//员工管理内容区域
				(function () {
					let activeSwiper = $('#staffManage'), // 右侧外部swiper
						activeSubSwiper = $('#staffManageInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签F
						headmainbtn1 = activePanelHeading.find('.head-main-btn-1'), // 新增员工按钮
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, { warningContent: '没有此类信息，请重新选择或输入' })
						// $('#right_wrapper').addClass('right-wrapper');
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
									paginationContainer.show()	//显示分页按钮
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/姓名/工号/职位/性别/是否分配用户/操作',
											theadWidth: '5%/15%/15%/15%/15%/10%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"></td>',
												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#staffSelectModal2"><i class="fa fa-tasks fa-fw"></i>详情</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#editStaffModal"><i class="fa fa-tasks fa-fw"></i>编辑</a><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
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
													//  console.log(html)
													for (let j = 0, len = html.length; j < len; j++) {
														currentTr.append(html[j]); // 添加表格内的HTML
														switch (j) {
															case 0:
																currentTr.children().eq(j).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].role_staff_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].role_staff_number;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 3: {
																if (dataList[currentTr.index()].post !== null) {
																	tempData = dataList[currentTr.index()].post.role_post_name;
																	currentTr.children().eq(j).html(tempData)
																}
															}
																break;
															case 4: {
																tempData = dataList[currentTr.index()].role_staff_sex;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 5: {
																let tempData = dataList[currentTr.index()].user,
																	userId,
																	selectTempStr = `
																	<select class="form-control table-input input-sm">
																		<option value="0">是</option>
																		<option value="1">否</option>
																	</select>
																`;

																currentTr.children().eq(j).html(selectTempStr)

																let target = currentTr.children().eq(j).find('select');

																if (tempData === null) {
																	target.val('1')
																} else {
																	target.val('0')
																	userId = tempData.role_user_id
																}

																//是否分配用户下拉选事件
																target.off('change').on('change', function (event) {
																	let val = $(this).val();
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
																		if (val === '0') {
																			let submitData = {
																				staffId: '',
																				userName: '',
																				password: '',
																			};

																			submitData.staffId = dataList[currentTr.index()].role_staff_id;
																			submitData.userName = dataList[currentTr.index()].role_staff_name;	//用户名默认等于员工姓名
																			submitData.password = 'abc123'; //默认密码

																			$.ajax({	//分配用户
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				data: { 'staffId': submitData.staffId, 'userName': submitData.userName, 'password': submitData.password },
																				url: saveUserUrl,
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						swal({
																							title: '操作成功',
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
																						swallFail();	//操作失败
																					}
																				}
																			})
																		} else {
																			$.ajax({ //删除员工对应的用户
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				data: { 'userId': userId },
																				url: removeUsersUrl,
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						swal({
																							title: '操作成功',
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
																						swallFail();	//操作失败
																					}
																				}
																			})
																		}
																	})

																})
															}
																break;

															case 6:
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn // 按钮自带的data数据
																	switch (dataContent) {
																		case '#staffSelectModal2': {
																			let dataContent = $('#staffSelectModal2'),
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group')
																			mesHorizontalTableAddData(panelModal1.find('table'), null, {
																				thead: '工号/入职日期/姓名/性别/出生年月/籍贯/手机/邮箱/住址/备注',
																				tableWitch: '30%/30%',
																				viewColGroup: 1,
																				importStaticData: (tbodyTd, length) => {
																					for (let i = 0, len = length; i < len; i++) {
																						let tempData;
																						switch (i) {
																							case 0: {
																								tempData = dataList[currentTr.index()].role_staff_number;
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 1: {
																								if (dataList[currentTr.index()].role_staff_employ_time) {
																									tempData = moment(dataList[currentTr.index()].role_staff_employ_time).format('YYYY-MM-DD');
																								} else {
																									tempData = dataList[currentTr.index()].role_staff_employ_time
																								}
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 2: {
																								tempData = dataList[currentTr.index()].role_staff_name;
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 3: {
																								tempData = dataList[currentTr.index()].role_staff_sex;
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 4: {
																								if (dataList[currentTr.index()].role_staff_birth) {
																									tempData = moment(dataList[currentTr.index()].role_staff_birth).format('YYYY-MM-DD');
																								} else {
																									tempData = dataList[currentTr.index()].role_staff_birth
																								}
																								tbodyTd.eq(i).html(tempData)
																								break;

																							}
																							case 5: {
																								tempData = dataList[currentTr.index()].role_staff_native_place;
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 6: {
																								tempData = dataList[currentTr.index()].role_staff_TEL;
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 7: {
																								tempData = dataList[currentTr.index()].role_staff_email;
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 8: {
																								tempData = dataList[currentTr.index()].role_staff_address;
																								tbodyTd.eq(i).html(tempData)
																								break;
																							}
																							case 9: {
																								tempData = dataList[currentTr.index()].role_remark;
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
																		case '#editStaffModal': {
																			let dataContent = $('#editStaffModal'),
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				// 表单要提交的数据
																				staffNumber = '',	//员工Id
																				employTime = '',	//入职日期
																				staffName = '',	//姓名
																				staffSex = '',	//性别
																				staffBirth = '',	//出生年月
																				staffTEL = '',	//手机
																				email = '',	//邮箱
																				staffNative = '',//籍贯
																				address = '',//住址
																				remark = "",//备注
																				isUser = '', //是否分配用户
																				staffId = dataList[currentTr.index()].role_staff_id,
																				judgment1,
																				judgment2,
																				judgment3,
																				judgment4,
																				judgment5,
																				judgment6,
																				judgment7,
																				judgment8,
																				judgment9,
																				judgment10
																			// panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题
																			// fuzzySearchGroupBtn.removeClass('hide')

																			mesHorizontalTableAddData(panelModal1.find('table'), null, {
																				thead: '工号/入职日期/姓名/性别/出生年月/籍贯/手机/邮箱/住址/备注',
																				tableWitch: '20%/30%',
																				viewColGroup: 2,
																				importStaticData: (tbodyTd, length) => {
																					let tempData,
																						inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																						inputHtml2 = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`,
																						selectHtml = `<select class="form-control table-input input-sm"></select>`,
																						province = ['河北省', '广东省', '山东省', '辽宁省', '吉林省', '甘肃省', '青海省', '河南省', '江苏省', '湖北省', '湖南省', '江西省', '浙江省', '云南省', '福建省', '台湾省', '海南省', '山西省', '四川省', '陕西省', '贵州省', '安徽省', '黑龙江省', '北京市', '天津市', '上海市', '重庆市', '广西壮族自治区', '内蒙古自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '香港', '澳门']

																					for (let i = 0, len = length; i < len; i++) {
																						switch (i) {
																							case 0: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml2)
																								tempData = dataList[currentTr.index()].role_staff_number
																								tbodyTd.eq(i).find('input').val(tempData)
																								let target = tbodyTd.eq(i).find('input'),
																								mesPopover = new MesPopover(target, { content: '请输入6-16位字母和数字' });
																								//staffNumber= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
																									mesPopover.show()
																								})
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									staffNumber = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									mesPopover.hide()

																									judgment1 = staffNumber !== dataList[currentTr.index()].role_staff_number
																								})
																								break;
																							}
																							case 1: {
																								let tmepInputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" onclick="WdatePicker({maxDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd'})"/>`;
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(tmepInputHtml)

																								if (dataList[currentTr.index()].role_staff_employ_time) {
																									tempData = moment(dataList[currentTr.index()].role_staff_employ_time).format('YYYY-MM-DD');
																								} else {
																									tempData = dataList[currentTr.index()].role_staff_employ_time
																								}
																								tbodyTd.eq(i).find('input').val(tempData)
																								 //employTime = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									employTime = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									judgment2 = employTime !== dataList[currentTr.index()].role_staff_employ_time

																								})
																								break;
																							}
																							case 2: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml2)
																								tempData = dataList[currentTr.index()].role_staff_name
																								tbodyTd.eq(i).find('input').val(tempData)

																								let target = tbodyTd.eq(i).find('input')
																								// staffName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								// 添加到提交数据
																								target.off('blur').on('blur', (event) => {
																									staffName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									judgment3 = staffName !== dataList[currentTr.index()].role_staff_name

																								})
																								break;
																							}
																							case 3: {
																								let radioHtml = '<form class="form-control table-input input-sm"><label><input name="Fruit" type="radio" value="男"/>男 </label>&nbsp;&nbsp;<label><input name="Fruit" type="radio" value="女"/>女 </label></form>'
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(radioHtml)
																								tempData = dataList[currentTr.index()].role_staff_sex
																								if(tempData !== ''){
																									tbodyTd.eq(i).find('input[value=' + tempData + ']').attr("checked", true);
																								}

																								//  staffSex = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('click').on('click', (event) => {
																									staffSex = tbodyTd.eq(i).find('input:radio:checked').val()
																									judgment4 = staffSex !== dataList[currentTr.index()].role_staff_sex

																								})
																								break;
																							}
																							case 4: {
																								let tmepInputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" onclick="WdatePicker()"/>`;
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(tmepInputHtml)
																								if (dataList[currentTr.index()].role_staff_birth) {
																									tempData = moment(dataList[currentTr.index()].role_staff_birth).format('YYYY-MM-DD');
																								} else {
																									tempData = dataList[currentTr.index()].role_staff_birth
																								}
																								tbodyTd.eq(i).find('input').val(tempData)
																								//  staffBirth= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									staffBirth = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																									judgment5 = staffBirth !== dataList[currentTr.index()].role_staff_birth

																								})
																								break;
																							}
																							case 5: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(selectHtml)
																								for(var z = 0; z < province.length; z++){
																									var optionHtml = `<option value="${province[z]}">${province[z]}</option>`;
																									tbodyTd.eq(i).find('select').append(optionHtml)
																								}
																								tempData = dataList[currentTr.index()].role_staff_native_place
																								tbodyTd.eq(i).find('select').val(tempData)
																								//  staffNative = tbodyTd.eq(i).find('select').val()

																								// 添加到提交数据
																								tbodyTd.eq(i).find('select').on('change', (event) => {
																									staffNative = tbodyTd.eq(i).find('select').val()
																									judgment6 = staffNative !== dataList[currentTr.index()].role_staff_native_place
																								})
																								break;
																							}
																							case 6: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml2)
																								tempData = dataList[currentTr.index()].role_staff_TEL
																								tbodyTd.eq(i).find('input').val(tempData)
																								let target = tbodyTd.eq(i).find('input'),
																									mesPopover = new MesPopover(target, { content: '请输入正确的手机号码' });
																								//  staffTEL = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
																									mesPopover.show()
																								})
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									staffTEL = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									mesPopover.hide()
																									judgment7 = staffTEL !== dataList[currentTr.index()].role_staff_TEL

																								})
																								break;
																							}
																							case 7: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].role_staff_email
																								tbodyTd.eq(i).find('input').val(tempData)
																								//  email = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

																							let	target = tbodyTd.eq(i).find('input'),
																								mesPopover = new MesPopover(target, { content: '请输入正确的邮箱' });
																								tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
																									mesPopover.show()
																									modalSubmitBtn.attr('disabled',false)
																								})
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {

																									if(!NUMBER_email.test(email) && email !== ''){
																										mesPopover.show()
																										modalSubmitBtn.attr('disabled',true)
																									}else{
																										email = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																										mesPopover.hide()
																										judgment8 = email !== dataList[currentTr.index()].role_staff_email
																									}
																								})
																								break;
																							}
																							case 8: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].role_staff_address
																								tbodyTd.eq(i).find('input').val(tempData)
																								// address= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									address = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									judgment9 = address !== dataList[currentTr.index()].role_staff_address
																								})

																								break;
																							}
																							case 9: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].role_remark
																								tbodyTd.eq(i).find('input').val(tempData)
																								//   remark= tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									remark = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									judgment10 = remark !== dataList[currentTr.index()].role_remark
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
																				var judgment = judgment1 || judgment2 || judgment3 || judgment4 || judgment5 || judgment6 || judgment7 || judgment8 || judgment9 || judgment10
																				// var modalSubmityan = employTime!==""&&staffBirth!==""

																				console.log(NUMBER_REG3.test(staffNumber))
                                                                                console.log(staffNumber)
																				console.log(NUMBER_REG3.test(staffNumber))

																				 if(staffNumber&&!NUMBER_REG3.test(staffNumber)){
																					swal({
																						title: '工号格式不正确',
																						text: '返回重新添加数据',
																						type: 'warning',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: false, // 显示用户取消按钮
																						confirmButtonText: '确定',
																					})
																				 }
																			//   else if(!modalSubmityan){
																			// 		swal({
																			// 			title: '必填项请填写数据',
																			// 			text: '返回重新添加数据',
																			// 			type: 'warning',
																			// 			allowEscapeKey: false, // 用户按esc键不退出
																			// 			allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																			// 			showCancelButton: false, // 显示用户取消按钮
																			// 			confirmButtonText: '确定',
																			// 		})
																			// 	}

																			  else if(staffTEL&&!isPoneAvailable(staffTEL)){
																				   swal({
																					   title: '请输入正确的电话号码',
																					   text: '返回重新添加数据',
																					   type: 'warning',
																					   allowEscapeKey: false, // 用户按esc键不退出
																					   allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																					   showCancelButton: false, // 显示用户取消按钮
																					   confirmButtonText: '确定',
																				   })
																				}

																				// console.log(staffNumber)
																				// var modalSubmityan = NUMBER_REG3.test(staffNumber) && employTime !== '' && USERNAME_REG1.test(staffName) && staffBirth !== '' && NUMBER_Phone.test(staffTEL);
																				// console.log(staffNa)
																				// console.log(modalSubmityan)
																				else if (!judgment) {
																					swal({
																						title: '请确定是否修改了数据',
																						text: '请检查数据是否完整或格式是否正确后再点击提交',
																						type: 'warning',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: false, // 显示用户取消按钮
																						confirmButtonText: '确定',
																					})
																				 }

																				else {
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
																							url: modifyStaffUrl,
																							data: {
																								"staffId": staffId,
																								"staffNumber": staffNumber,
																								"staffNative": staffNative,
																								"employTime": employTime,
																								"staffName": staffName,
																								"staffSex": staffSex,
																								"staffBirth": staffBirth,
																								"staffTEL": staffTEL,
																								"email": email,
																								"address":address,
																								'remark': remark,

																							},

																							success: function (result, status, xhr) {
																								if (result.status === 0) {
																									let activePaginationBtn = activePanel.find('.pagination').find('.active')
																									swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																								}
																								else if (result.status === 1) {
																									swallFail2(result.msg); //操作失败
																								   }
																								   else {
																									swallFail();	//操作失败
																								}
																							}
																						})
																					});
																				 }

																			})

																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				staffId = dataList[currentTr.index()].role_staff_id,
																				status = 1;
																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: modifyStaffUrl,
																					 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: {
																						'staffId': staffId,
																						'status': status
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

					// 导航栏点击时运行数据加载
					addTableData(queryStaffUrl, {
						type:'info',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");

						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryStaffUrl, {
								type:'info',
								staffName: val,
								headNum: 1
							});
						}
						else {
							// 为空时重置搜索
							addTableData(queryStaffUrl, {
								type:'info',
								headNum: 1
							});
							return;
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}
					});

					// 新增员工按钮点击事件
					headmainbtn1.off('click').on('click', function (event) {
						let dataContent = $('#editStaffModal'),
							panelModal1 = dataContent.find('.panel'),
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							modalSubmitBtn = dataContent.find('.modal-submit'),
							fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),

							// 表单要提交的数据
							staffNumber = '',	//员工Id
							employTime = '',	//入职日期
							staffName = '',	//姓名
							staffSex = '',	//性别
							staffBirth = '',	//出生年月
							staffTEL = '',	//手机
							email = '',	//邮箱
							staffNative = '',//籍贯
							address = '',//住址
							remark = "",//备注
							isUser = '' //是否分配用户


						// panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题
						// fuzzySearchGroupBtn.removeClass('hide')

						mesHorizontalTableAddData(panelModal1.find('table'), null, {
							thead: '工号/入职日期/姓名/性别/出生年月/籍贯/手机/邮箱/住址/备注',
							tableWitch: '20%/30%',
							viewColGroup: 2,
							importStaticData: (tbodyTd, length) => {
								let tempData,
									inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
									inputHtml2 = `<input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" />`,
									selectHtml = `<select class="form-control table-input input-sm"></select>`,
									province = [ '河北省', '广东省', '山东省', '辽宁省', '吉林省', '甘肃省', '青海省', '河南省', '江苏省', '湖北省', '湖南省', '江西省', '浙江省', '云南省', '福建省', '台湾省', '海南省', '山西省', '四川省', '陕西省', '贵州省', '安徽省', '黑龙江省', '北京市', '天津市', '上海市', '重庆市', '广西壮族自治区', '内蒙古自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '香港', '澳门']
								for (let i = 0, len = length; i < len; i++) {
									switch (i) {
										case 0: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml2)
											let target = tbodyTd.eq(i).find('input'),
												mesPopover = new MesPopover(target, { content: '请输入6-16位字母和数字' });

											tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
												mesPopover.show()
												modalSubmitBtn.attr('disabled',false)
											})

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												staffNumber = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

												mesPopover.hide()
											})
											break;
										}
										case 1: {

											let tmepInputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" onclick="WdatePicker({maxDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd'})"/>`;
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(tmepInputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												employTime = tbodyTd.eq(i).find('input').val()

											})
											break;
										}
										case 2: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml2)
											let target = tbodyTd.eq(i).find('input')

											// 添加到提交数据
											target.off('blur').on('blur', (event) => {
												staffName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 3: {
											let radioHtml = '<form class="form-control table-input input-sm"><label><input name="Fruit" type="radio" value="男"/>男 </label>&nbsp;&nbsp;<label><input name="Fruit" type="radio" value="女"/>女 </label></form>'
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(radioHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('click').on('click', (event) => {
												staffSex = tbodyTd.eq(i).find('input:radio:checked').val().replace(/\s/g, "")
											})
											break;
										}
										case 4: {
											let tmepInputHtml = `<input type="text" class="table-input" placeholder="请输入(必填)" onclick="WdatePicker()"/>`;
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(tmepInputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												staffBirth = tbodyTd.eq(i).find('input').val()

											})
											break;
										}
										case 5: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(selectHtml)
											for(var z = 0; z < province.length; z++){
												var optionHtml = `<option value="${province[z]}">${province[z]}</option>`;
												tbodyTd.eq(i).find('select').append(optionHtml)
											}
											// 添加到提交数据
											tbodyTd.eq(i).find('select').on('change', (event) => {
												staffNative = tbodyTd.eq(i).find('select').val()
											})
											break;
										}
										case 6: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml2)

											let target = tbodyTd.eq(i).find('input'),
												mesPopover = new MesPopover(target, { content: '请输入正确的手机号码' });
											tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
												mesPopover.show()
												modalSubmitBtn.attr('disabled',false)
											})
											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												staffTEL = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

													mesPopover.hide()


											})
											break;
										}
										case 7: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											let	target = tbodyTd.eq(i).find('input'),
												mesPopover = new MesPopover(target, { content: '请输入正确的邮箱' })
											tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
												mesPopover.show()
												modalSubmitBtn.attr('disabled',false)
											})
											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												email = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												if(!NUMBER_email.test(email) && email !== ''){
													mesPopover.show()
													modalSubmitBtn.attr('disabled',true)
												}else{
													mesPopover.hide()
												}
											})
											break;
										}
										case 8: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												address = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 9: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												remark = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
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
							var modalSubmityan = NUMBER_REG3.test(staffNumber) && employTime !== '' && USERNAME_REG1.test(staffName) && staffBirth !== '' && NUMBER_Phone.test(staffTEL);
							if(!NUMBER_REG3.test(staffNumber)){
                                swal({
									title: '工号格式不正确',
									type: 'warning',
									timer: '2000',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: false, // 显示用户取消按钮
									showConfirmButton: true, // 显示用户确认按钮

								})
							}

							else if(employTime==""){
                                swal({
									title: '入职日期不能为空',
									type: 'warning',
									timer: '2000',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: false, // 显示用户取消按钮
									showConfirmButton: true, // 显示用户确认按钮

								})
							}
							else if(!staffName){
                                swal({
									title: '姓名不能为空',
									type: 'warning',
									timer: '2000',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: false, // 显示用户取消按钮
									showConfirmButton: true, // 显示用户确认按钮

								})
							}
							else if(!staffBirth){
                                swal({
									title: '出生日期不能为空',
									type: 'warning',
									timer: '2000',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: false, // 显示用户取消按钮
									showConfirmButton: true, // 显示用户确认按钮

								})
							}
							else if(!NUMBER_Phone.test(staffTEL)){
                                swal({
									title: '请输入正确的手机号码',
									type: 'warning',
									timer: '2000',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: false, // 显示用户取消按钮
									showConfirmButton: true, // 显示用户确认按钮

								})
							}

							else if (modalSubmityan) {
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
										url: saveStaffUrl,
										data: {
											"staffNumber": staffNumber,
											"staffNative": staffNative,
											"employTime": employTime,
											"staffName": staffName,
											"staffSex": staffSex,
											"staffBirth": staffBirth,
											"staffTEL": staffTEL,
											"email": email,
											'remark': remark,
											"address": address
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
			case '#positionManage':	//职位管理内容区域
				(function () {
					let activeSwiper = $('#positionManage'), // 右侧外部swiper
						activeSubSwiper = $('#positionManageInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						headmainbtn1 = activePanelHeading.find('.head-main-btn-1'), // 新增职位按钮
						headmainbtn3 = activePanelHeading.find('.head-main-btn-3'), // 树形表格按钮
						roleStaffId ='',
						NameList = [],
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})
						// $('#right_wrapper').addClass('right-wrapper');
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
									paginationContainer.show()	//显示分页按钮
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/职位名称/上级/职位说明/权限配置/操作',
											theadWidth: '5%/15%/15%/15%/15%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td" ><a class="table-link" href="javascript:void(0);" data-toggle-modal-target="#jurisdictionDetailModal"><i class="fa fa-tasks fa-fw"></i>权限配置</a></td>',
												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#positionModal"><i class="fa fa-tasks fa-fw"></i>修改</a><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],
											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.post, // 主要数据列表
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
																tempData = dataList[currentTr.index()].role_post_name;
																currentTr.children().eq(j).html(tempData)
																NameList.push(dataList[currentTr.index()].role_post_name)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].role_post_leader_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 3: {
																tempData = dataList[currentTr.index()].role_post_detail;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 4: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	$.ajax({
																		 type: "POST",  dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																		url: queryFunctionUrl,
																		data: {'type':'function'},
																		success: function (result, status, xhr) {
																			if (result.status === 0) {
																				functionsList = result.map.functions
																				functionsSet = new Set(functionsList)
																			} else {
																				swallFail();	//操作失败
																			}
																		}
																	})
																	let activeSwiperModel = $('#jurisdictionDetailModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		treeDemo = activeSwiperModel.find('#treeDemo'),
																		panelTbody = panel.find('table tbody'),	//面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		postId = dataList[currentTr.index()].role_post_id,
																		hearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),	//职位增加权限
																		hearModelBtn2 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-2'),	//表格结构
																		hearModelBtn3 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-3'),	//树形结构
																		modalSubmitBtn = activeSwiperModel.find('.modal-submit'), // 确认提交按钮
																		addFunctionIds = [], removeFunctionIds = [];

																	// 获取已选择的权限列表
																	$.ajax({
																		 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																		url: queryFunctionUrl,
																		data: { type: 'postFunction', 'postId':postId},

																		success: function (result, status, xhr) {
																			if (result.status === 0) {
																				functionsList2 = result.map.functions
																				function zTree(functionsList2){
																					var zNodes =[];
																					var treeObj = $.fn.zTree.getZTreeObj("tree");

																					var setting = {
																						check: {
																								enable: true,
																						},
																						data: {
																							simpleData: {
																									enable: true
																							}
																						},
																						view: {						//显示
																							showIcon: false,
																							dblClickExpand: false,
																							showLine: false
																						},
																						callback: {				//回调函数
																							onCheck: onCheck
																						}
																					};

																					$.fn.zTree.init($("#treeDemo"), setting, zNodes);
																					var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
																					// 遍历树状图
																					for (let i = 0, len = functionsList.length; i < len; i++){
																						let tempData = {id: '',pId: '',	name: '',	open:''};

																						tempData.id = parseInt(functionsList[i].id);
																						tempData.pId = parseInt(functionsList[i].pId);
																						tempData.name = functionsList[i].name;
																						tempData.open = false;
																						tempData.functionId = functionsList[i].role_function_id;

																						zNodes.push(tempData);
																						// 选中已有权限
																						for (let j = 0, len = functionsList2.length; j < len; j++){
																							if(functionsList[i].role_function_id == functionsList2[j].role_function_id){
																								tempData.functionId2 = functionsList2[j].role_post_function_id;
																								treeObj.checkNode(zNodes[i], true, true);
																							}
																						}

																					}
																					// 点击取消或选中添加或删除权限
																					function onCheck(event, treeId, treeNode) {
																						var nodes = treeObj.getChangeCheckedNodes();
																						addFunctionIds = [], removeFunctionIds = [];
																						for (let i = 0, len = nodes.length; i < len; i++){
																							if(nodes[i].checked){
																								addFunctionIds.push(nodes[i].functionId)
																							}else{
																								removeFunctionIds.push(nodes[i].functionId2)
																							}
																						}
																					};


																					$(document).ready(function(){
																						$.fn.zTree.init(treeDemo, setting, zNodes);
																					});

																					// 点击提交按钮添加或删除职位上的权限
																					modalSubmitBtn.off('click').on('click', (event) => {
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
																								// 点击提交按钮添职位上的权限
																							if(addFunctionIds.length){
																								$.ajax({
																									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																									url: addFunctionsUrl,
																									data: {'postId':postId,'functionIds':addFunctionIds.toString()},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											swal({
																												title: '增加成功',
																												type: 'success',
																												timer: '1000',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: false, // 显示用户取消按钮
																												showConfirmButton: false, // 显示用户确认按钮
																											})
																											activeSwiperModel.modal('hide')
																										}else{
																											swal({
																												title: '增加失败',
																												text: '请重新选择增加',
																												type: 'question',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: true, // 显示用户取消按钮
																												confirmButtonText: '确定',
																												cancelButtonText: '取消',
																											})
																										}
																									}
																								})
																							}
																								// 点击提交按钮删除职位上的权限
																							if(removeFunctionIds.length){
																								$.ajax({
																									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																									url: removeFunctionUrl,
																									data: {'type':'post','postId':postId,'postFunctionIds':removeFunctionIds.toString()},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											swal({
																												title: '删除成功',
																												type: 'success',
																												timer: '1000',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: false, // 显示用户取消按钮
																												showConfirmButton: false, // 显示用户确认按钮
																											})
																											activeSwiperModel.modal('hide')
																										}else{
																											swal({
																												title: '删除失败',
																												text: '请重新选择删除',
																												type: 'question',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: true, // 显示用户取消按钮
																												confirmButtonText: '确定',
																												cancelButtonText: '取消',
																											})
																										}
																									}
																								})
																							}

																						})
																					})
																				}
																				zTree(functionsList2)
																			} else{
																				// 如果职位上没权限返回2就执行这段
																				functionsList2 = []
																				function zTree(functionsList2){
																					var zNodes =[];
																					var treeObj = $.fn.zTree.getZTreeObj("tree");

																					var setting = {
																						check: {
																								enable: true,
																						},
																						data: {
																							simpleData: {
																									enable: true
																							}
																						},
																						view: {						//显示
																							showIcon: false,
																							dblClickExpand: false,
																							showLine: false
																						},
																						callback: {				//回调函数
																							onCheck: onCheck
																						}
																					};

																					$.fn.zTree.init($("#treeDemo"), setting, zNodes);
																					var treeObj = $.fn.zTree.getZTreeObj("treeDemo");

																					for (let i = 0, len = functionsList.length; i < len; i++){
																						let tempData = {id: '',pId: '',	name: '',	open:''};

																						tempData.id = parseInt(functionsList[i].id);
																						tempData.pId = parseInt(functionsList[i].pId);
																						tempData.name = functionsList[i].name;
																						tempData.open = false;
																						tempData.functionId = functionsList[i].role_function_id;

																						zNodes.push(tempData);

																						for (let j = 0, len = functionsList2.length; j < len; j++){
																							if(functionsList[i].role_function_id == functionsList2[j].role_function_id){
																								tempData.functionId2 = functionsList2[j].role_post_function_id;
																								treeObj.checkNode(zNodes[i], true, true);
																							}
																						}

																					}


																					function onCheck(event, treeId, treeNode) {
																						var nodes = treeObj.getChangeCheckedNodes();
																						addFunctionIds = [], removeFunctionIds = [];
																						for (let i = 0, len = nodes.length; i < len; i++){
																							if(nodes[i].checked){
																								addFunctionIds.push(nodes[i].functionId)
																							}else{
																								removeFunctionIds.push(nodes[i].functionId2)
																							}
																						}
																					};


																					$(document).ready(function(){
																							$.fn.zTree.init(treeDemo, setting, zNodes);
																					});

																					modalSubmitBtn.off('click').on('click', (event) => {
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
																							if(addFunctionIds.length){
																								$.ajax({
																									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																									url: addFunctionsUrl,
																									data: {'postId':postId,'functionIds':addFunctionIds.toString()},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											swal({
																												title: '增加成功',
																												type: 'success',
																												timer: '1000',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: false, // 显示用户取消按钮
																												showConfirmButton: false, // 显示用户确认按钮
																											})
																											activeSwiperModel.modal('hide')
																										}else{
																											swal({
																												title: '添加失败',
																												text: '请重新选择增加',
																												type: 'question',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: true, // 显示用户取消按钮
																												confirmButtonText: '确定',
																												cancelButtonText: '取消',
																											})
																										}
																									}
																								})
																							}
																							if(removeFunctionIds.length){
																								$.ajax({
																									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																									url: removeFunctionUrl,
																									data: {'type':'post','postId':postId,'postFunctionIds':removeFunctionIds.toString()},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											swal({
																												title: '删除成功',
																												type: 'success',
																												timer: '1000',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: false, // 显示用户取消按钮
																												showConfirmButton: false, // 显示用户确认按钮
																											})
																											activeSwiperModel.modal('hide')
																										}else{
																											swal({
																												title: '删除失败',
																												text: '请重新选择删除',
																												type: 'question',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: true, // 显示用户取消按钮
																												confirmButtonText: '确定',
																												cancelButtonText: '取消',
																											})
																										}
																									}
																								})
																							}
																						})
																					})
																				}
																				zTree(functionsList2)
																			}
																		}
																	})
																})
															}
																break;
															case 5:
																if(dataList[currentTr.index()].role_post_leader_name == null){
																	currentTr.find('.text-danger').addClass('hide')
																}
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		staffId = ''
																	switch (dataContent) {
																		case '#positionModal': {
																			let dataContent = $('#positionModal'),
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				judgment1='',
																				judgment2='',
																				judgment3='',
																				// 表单要提交的数据
																				postName= '',	//职位名称
																				leaderId= '',	//上级职位id
																				grade =  '',
																				detail='',
																				postId =  dataList[currentTr.index()].role_post_id

																				// panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题
																				// fuzzySearchGroupBtn.removeClass('hide')

																				mesHorizontalTableAddData(panelModal1.find('table'), null, {
																					thead: '上级/职位名称/职位说明',
																					tableWitch: '40%/60%',
																					viewColGroup: 1,
																					importStaticData: (tbodyTd, length) => {
																						let tempData,
																							inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																							selectHtml = `<select class="form-control table-input input-sm"></select>`

																						for (let i = 0, len = length; i < len; i++) {
																							switch (i) {
																								case 0: {
																									if(dataList[currentTr.index()].role_post_leader_name == null){
																									}else{
																										tbodyTd.eq(i).addClass('table-input-td')
																										tbodyTd.eq(i).html(inputHtml)
																										tempData = dataList[currentTr.index()].role_post_leader_name
																										tbodyTd.eq(i).find('input').val(tempData)
																										// 添加到提交数据
																										tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
																											let promise = new Promise(function (resolve, reject) {
																												selectStaffAddData(resolve, queryPostUrl, { headNum: 1 },dataList[currentTr.index()].role_post_grade)
																											});
																											promise.then(function (resolveData) {
																												tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																												leaderId = resolveData.roleStaffId
																											})
																											judgment1 = leaderId !== dataList[currentTr.index()].role_post_leader_name
																										})
																									}
																									break;
																								}
																								case 1: {
																									tbodyTd.eq(i).addClass('table-input-td')
																									tbodyTd.eq(i).html(inputHtml)
																									tempData = dataList[currentTr.index()].role_post_name
																									tbodyTd.eq(i).find('input').val(tempData)
																									tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																										postName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																										judgment2 = postName !== dataList[currentTr.index()].role_post_name
																									})
																									break;
																								}
																								case 2: {
																									tbodyTd.eq(i).addClass('table-input-td')
																									tbodyTd.eq(i).html(inputHtml)
																									tempData = dataList[currentTr.index()].role_post_detail
																									tbodyTd.eq(i).find('input').val(tempData)
																									tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																										detail = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																										if(detail == ''){
																											detail = ' '
																										}
																										judgment3 = detail !== dataList[currentTr.index()].role_post_detail
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
																					if (!judgment2 &&  !judgment1 &&  !judgment3) {
																						swal({
																							title: '请确定是否修改了数据',
																							text: '请检查数据是否完整或格式是否正确后再点击提交',
																							type: 'warning',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: false, // 显示用户取消按钮
																							confirmButtonText: '确定',
																						})
																					}
																					else{
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
																								url: modifyPostUrl,
																								data: {
																									'postId':postId,
																									"postName": postName,
																									'detail':detail,
																									"leaderId": leaderId,
																									'grade':grade
																								},
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																									}
																									else if (result.status === 1) {
																										swallFail2(result.msg); //操作失败
																									   }
																									else {
																										swallFail();	//操作失败

																									}
																								}
																							})
																						});
																					}
																				})

																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				postId = dataList[currentTr.index()].role_post_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removePostUrl,
																					 type: "POST",  dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: {
																						'postId': postId
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
											displayRow: result.map.post.length // 显示行数
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

					//导航栏点击时运行数据加载
					addTableData(queryPostUrl,{
						type:'info',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.input-group-btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryPostUrl, {
								type:'info',
								postName:val,
								headNum: 1
							});
						}
						else {
							addTableData(queryPostUrl,{
								type:'info',
								headNum: 1
							});
							// 为空时重置搜索
							return;
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}
					});

					headmainbtn1.off('click').on('click',function (event) {
						let dataContent = $('#positionModal'),			//模态框
							panelModal1 = dataContent.find('.panel'),	//panel
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),	//关闭按钮
							modalSubmitBtn = dataContent.find('.modal-submit'),		//提交按钮
							fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),	//模糊搜索按钮组


							// 表单要提交的数据
							postName= '',	//职位名称
							leaderId= '',	//上级职位id
							grade = '',
							detail=''

						// panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题
						// fuzzySearchGroupBtn.removeClass('hide')

						mesHorizontalTableAddData(panelModal1.find('table'), null, {
							thead: '上级/职位名称/职位说明',
							tableWitch: '40%/60%',
							viewColGroup: 1,
							importStaticData: (tbodyTd, length) => {
								let tempData,
									inputHtml = `<input type="text" class="table-input" placeholder="请输入（必填）" autocomplete="on" />`,
									selectHtml = `<select class="form-control table-input input-sm"></select>`

								for (let i = 0, len = length; i < len; i++) {
									switch (i) {
										case 0: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('focus').on('focus', (event) => {
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData(resolve, queryPostUrl, { headNum: 1 })
												});
												promise.then(function (resolveData) {
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
													leaderId = resolveData.roleStaffId
													grade = parseInt(resolveData.roleStaffgrade)+1
												})
											})
											break;
										}
										case 1: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												postName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												for(var h = 0 ; h < NameList.length; h++){
													if(postName == NameList[h]){
														swal({
															title: '职位名称已经存在',
															text: '请重新输入职位名称',
															type: 'question',
															allowEscapeKey: false, // 用户按esc键不退出
															allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
															showCancelButton: true, // 显示用户取消按钮
															confirmButtonText: '确定',
															cancelButtonText: '取消',
														})
													}
												}
											})
											break;
										}
										case 2: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												detail = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												if(detail == ''){
													detail = ' '
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
							if (postName !== '' && leaderId !== '') {
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
										url: savePostUrl,
										data: {
											"postName": postName,
											"leaderId": leaderId,
											'detail':detail,
											'grade':grade
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {
												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											}
											else if (result.status === 1) {
												swallFail2(result.msg); //操作失败
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
			case '#classesManage': //班次管理内容区域
				(function () {
					let activeSwiper = $('#classesManage'), // 右侧外部swiper
					activeSubSwiper = $('#classesManageInerSwiper'), // 右侧内部swiper
					activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
					activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
					panelTbody = activePanel.find('table tbody'),	//面版表格tbody
					paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
					fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
					headmainbtn1 = activePanelHeading.find('.head-main-btn-1'), // 新增职位按钮

					mesloadBox = new MesloadBox(activePanel, {
						// 主数据载入窗口
						warningContent: '没有此类信息，请重新选择或输入'
					})
					// $('#right_wrapper').addClass('right-wrapper');
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
									paginationContainer.show()	//显示分页按钮
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/班次名称/班次说明/班次人员/操作',
											theadWidth: '10%/15%/20%/15%/15%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td" ><a class="table-link" href="javascript:void(0);" data-toggle-modal-target="#classesManageModal"><i class="fa fa-tasks fa-fw"></i>查看</a></td>',
												'<td class="table-input-td"><a class="table-link" href="javascript:;" data-toggle-modal-target="#jurisdictionModal"><i class="fa fa-tasks fa-fw"></i>修改</a><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
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
													for (let j = 0, len = html.length; j < len; j++) {
														currentTr.append(html[j]); // 添加表格内的HTML
														switch (j) {
															case 0:
																currentTr.children().eq(j).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].role_class_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].role_class_detail;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 3: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let activeSwiperModel = $('#classesManageModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		panelTbody = panel.find('table tbody'),	// 面版表格tbody
																		panelThead = panel.find('table thead'),	// 面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'), // 增加按钮
																		HearModelBtn2 = activeSwiperModel.find('.panel-footer').find('.head-main-btn-2'), // 删除按钮
																		HearModelBtn3 = activeSwiperModel.find('.panel-footer').find('.head-main-btn-3'), // 更换班次
																		SelectBtn1 =  activeSwiperModel.find('.devices-type-option1'), // 产线下拉框
																		SelectBtn2 =  activeSwiperModel.find('.devices-type-option2'), // 车间下拉框
																		SelectBtn3 =  activeSwiperModel.find('.devices-type-option3'), // 工序下拉框
																		classId = dataList[currentTr.index()].role_class_id,
																		IdList = [],
																		IdList2 = [];
																	function addTableData2(url, data) {
																		HearModelBtn2.attr('disabled',true)
																		HearModelBtn3.attr('disabled',true)
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
																					panelTbody.empty()
																					paginationContainer.show()	//显示分页按钮
																					mesVerticalTableAddData(panel, {
																						thead: {
																							theadContent: '<input type="checkbox">/序号/人员名称/换班时间/操作',
																							theadWidth: '3%/10%/20%/20%/10%'
																						},
																						tbody: {
																							html: [
																								'<td></td>',
																								'<td></td>',
																								'<td></td>',
																								'<td></td>',
																								'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>',
																							],
																							// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																							dataAddress: function (tbodyTarget, html, result) {
																								tbodyTarget.empty() // 清空表格主体
																								let map = result.map, // 映射
																									dataList = map.classStaffs, // 主要数据列表
																									tempData = null, // 表格td内的临时数据
																									InputBtn =  panelThead.find('input'); // 全选
																								for (let i = 0, len = dataList.length; i < len; i++) {
																									tbodyTarget.append('<tr></tr>'); // 添加行
																									let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
																									// 全选按钮事件
																									InputBtn.off('click').on('click', (event) => {
																										for(let i = 0, len = dataList.length; i < len; i++){
																											if(InputBtn.prop('checked')){
																													tbodyTarget.children('tr').eq(i).find('input').prop('checked',true)
																											}else{
																												IdList = [];
																												IdList2 = [];
																												tbodyTarget.children('tr').eq(i).find('input').prop('checked',false )
																											}
																											if(tbodyTarget.children('tr').eq(i).find('input').prop('checked')){
																												IdList.push(dataList[i].staff.role_staff_id)
																												IdList2.push(dataList[i].role_staff_class_id)
																											}else{
																												traverseListDelete(IdList,dataList[i].staff.role_staff_id)
																												traverseListDelete(IdList2,dataList[i].role_staff_class_id)
																											}
																											if(IdList2.length){
																												HearModelBtn2.attr('disabled',false)
																												HearModelBtn3.attr('disabled',false)
																											}else{
																												HearModelBtn2.attr('disabled',true)
																												HearModelBtn3.attr('disabled',true)
																											}
																										}
																									})
																									 // 单选点击事件
																									currentTr.off('click').on('click', (event) => {
																										if(currentTr.find('input').prop('checked')){
																											IdList.push(dataList[currentTr.index()].staff.role_staff_id)
																											IdList2.push(dataList[currentTr.index()].role_staff_class_id)
																										}else{
																											traverseListDelete(IdList,dataList[currentTr.index()].staff.role_staff_id)
																											traverseListDelete(IdList2,dataList[currentTr.index()].role_staff_class_id)
																										}
																										if(IdList2.length){
																											HearModelBtn2.attr('disabled',false)
																											HearModelBtn3.attr('disabled',false)
																										}else{
																											HearModelBtn2.attr('disabled',true)
																											HearModelBtn3.attr('disabled',true)
																										}
																									})
																									currentTr.css('cursor','pointer')
																									for (let j = 0, len = html.length; j < len; j++) {
																										currentTr.append(html[j]); // 添加表格内的HTML
																										switch (j) {
																											case 0:
																												currentTr.addClass('table-input-td')
																												tempData = '<input type="checkbox">'
																												currentTr.children().eq(j).html(tempData)
																												break;
																											case 1:
																												currentTr.children().eq(j).html(currentTr.index() + 1)
																												break;
																											case 2: {
																												if( dataList[currentTr.index()].staff !== null){
																													tempData = dataList[currentTr.index()].staff.role_staff_name;
																													currentTr.children().eq(j).html(tempData)
																												}
																											}
																												break;
																											case 3: {
																												tempData = moment(dataList[currentTr.index()].staff_class_time).format('YYYY-MM-DD');
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 4: {
																												currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																													var staffId =  dataList[currentTr.index()].role_staff_class_id
																													swal({
																														title: '您确定要删除此条数据吗？',
																														text: '删除后将无法查询',
																														type: 'question',
																														showCancelButton: true,
																														confirmButtonText: '确定',
																														cancelButtonText: '取消'
																													}).then(function () {
																														$.ajax({
																															url: removeClassStaffUrl,
																															 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																															data: {
																																'classId':classId,
																																'staffIds':staffId
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
																																			addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId,headNum:1})
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
																							totalRow: result.map.classStaffs.length, // 总行数
																							displayRow: result.map.classStaffs.length // 显示行数
																						},
																						ajax: {
																							url: url,
																							data:data
																						}
																					})
																				}else if(result.status === 2){
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																				}else {
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																					mesloadBox.warningShow();
																				}
																			}
																		})
																	}
																	addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId,headNum:1})

																	//增加按钮事件
																	HearModelBtn1.off('click').on('click', (event) => {
																		let promise = new Promise(function (resolve, reject) {
																			selectStaffAddData9(resolve, queryClassesUrl,{'type':'noClass',headNum:1})
																		});
																		promise.then(function (resolveData) {
																			var staffIds = []
																			staffIds.push(resolveData.roleStaffId)
																			$.ajax({
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				url: saveClassStaffUrl,
																				data: {'classId':classId,'staffIds':staffIds.toString()},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId,headNum:1})
																					}else{
																						swal({
																							title: '请确认操作无误',
																							text: '请重新选择增加',
																							type: 'question',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: true, // 显示用户取消按钮
																							confirmButtonText: '确定',
																							cancelButtonText: '取消',
																						})
																					}
																				}
																			})
																		})
																	})
																	//删除按钮事件
																	HearModelBtn2.off('click').on('click', (event) => {
																		var staffId = []
																		staffId = unique(IdList2)
																		if(!staffId.toString()){
																			swal({
																				title: '请确认是否选择了数据',
																				text: '退回重新选择数据',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			})
																		}else{
																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeClassStaffUrl,
																					 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: {
																						'classId':classId,
																						'staffIds': staffId.toString()
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
																									addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId,headNum:1})
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
																		}
																	})
																	//更换班次事件
																	HearModelBtn3.off('click').on('click', (event) => {
																		var staffId = [],
																				staffClassId = []
																		staffId = unique(IdList)
																		staffClassId = unique(IdList2)
																		let promise = new Promise(function (resolve, reject) {
																			selectStaffAddData10(resolve, queryClassesUrl,{'type':'info',headNum:1})
																		});
																		promise.then(function (resolveData) {
																			if(classId == resolveData.roleStaffId){
																				swal({
																					title: '请选择正确的班次',
																					text: '返回重新更换班次',
																					type: 'question',
																					showCancelButton: true,
																					confirmButtonText: '确定',
																					cancelButtonText: '取消'
																				})
																			}else{
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: changeClassStaffUrl,
																					data: {'classId':resolveData.roleStaffId,'staffIds':staffId.toString(),'staffClassIds':staffClassId.toString()},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId,headNum:1})
																						}else{
																							swal({
																								title: '更改班次失败',
																								text: '请重新更该班次',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							})
																						}
																					}
																				})
																			}
																		})
																	})
																	//产线下拉框点击事件
																	function productLines(){
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryProductLinesUrl,
																			data: {
																				type:'info',
																				headNum: 1
																			},
																			beforeSend: function (xml) {
																				// ajax发送前
																				mesloadBox.loadingShow()
																			},
																			success: function (result, status, xhr) {
																				// ajax成功
																				mesloadBox.hide()
																				if (result.status === 0) {
																					SelectBtn1.empty()
																					SelectBtn1.append('<option value="">产线</option>')
																					for (let i = 0, len = result.map.productLines.length; i < len; i++) {
																						let optionHtml = `<option value="${result.map.productLines[i].product_line_id}">${result.map.productLines[i].product_line_name}</option>`;
																						SelectBtn1.append(optionHtml);
																					}
																					SelectBtn1.on('change', (event) => {
																						productlineId = SelectBtn1.val()
																						if(productlineId){
																							workshop()
																							workstage()
																							addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId ,'productlineId':productlineId ,headNum:1})
																						}else{
																							addTableData2(queryClassesUrl, {'type':'classStaff',headNum:1})
																						}
																					})
																				}else{
																					mesloadBox.warningShow();
																				}
																			}
																		})
																	}
																	//车间下拉框点击事件
																	function workshop(){
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryWorkshopsUrl,
																			data: {
																				type: 'info',
																				headNum: 1
																			},
																			beforeSend: function (xml) {
																				// ajax发送前
																				mesloadBox.loadingShow()
																			},
																			success: function (result, status, xhr) {
																				// ajax成功
																				mesloadBox.hide()
																				if (result.status === 0) {
																					SelectBtn2.empty()
																					SelectBtn2.append('<option value="">车间</option>')
																					for (let i = 0, len = result.map.workshopInfos.length; i < len; i++) {
																						let optionHtml = `<option value="${result.map.workshopInfos[i].role_workshop_id}">${result.map.workshopInfos[i].role_workshop_name}</option>`;
																						SelectBtn2.append(optionHtml);
																					}
																					SelectBtn2.on('change', (event) => {
																						workshopId = SelectBtn2.val()
																						if(workshopId){
																							productLines()
																							workstage()
																							addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId ,'workshopId':workshopId ,headNum:1})
																						}else{
																							addTableData2(queryClassesUrl, {'type':'classStaff',headNum:1})
																						}
																					})
																				}else{
																					mesloadBox.warningShow();
																				}
																			}
																		})
																	}
																	//工序下拉框点击事件
																	function workstage(){
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryWorkstageBasicsUrl,
																			data: {
																				type: 'vague',
																				status:0,
																				headNum: 1
																			},
																			beforeSend: function (xml) {
																				// ajax发送前
																				mesloadBox.loadingShow()
																			},
																			success: function (result, status, xhr) {
																				// ajax成功
																				mesloadBox.hide()
																				if (result.status === 0) {
																					SelectBtn3.empty()
																					SelectBtn3.append('<option value="">工序</option>')
																					for (let i = 0, len = result.map.workstageBasicsList.length; i < len; i++) {

																						let optionHtml = `<option value="${result.map.workstageBasicsList[i].workstage_basics_id}">${result.map.workstageBasicsList[i].workstage_name}</option>`;
																						SelectBtn3.append(optionHtml);
																					}
																					SelectBtn3.on('change', (event) => {
																						workstageId = SelectBtn3.val()
																						if(workstageId){
																							productLines()
																							workshop()
																							addTableData2(queryClassesUrl, {'type':'classStaff','classId':classId ,'workstageId':workstageId ,headNum:1})
																						}else{
																							addTableData2(queryClassesUrl, {'type':'classStaff',headNum:1})
																						}
																					})
																				}else{
																					mesloadBox.warningShow();
																				}
																			}
																		})
																	}
																	productLines()
																	workshop()
																	workstage()
																})
															}
																break;
															case 4:
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		staffId = ''
																	switch (dataContent) {
																		case '#jurisdictionModal': {
																			let dataContent = $('#jurisdictionModal'),
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),
																				judgment1 = '',
																				judgment2 = '',
																				// 表单要提交的数据
																				className = '',	//职位名称
																				classDetail = '',	//上级职位id
																				classId = dataList[currentTr.index()].role_class_id

																			panelModal1.find('.panel-heading').find('.panel-title').text('班次修改') // 更换panel标题
																			// fuzzySearchGroupBtn.removeClass('hide')

																			mesHorizontalTableAddData(panelModal1.find('table'), null, {
																				thead: '班次名称/班次说明',
																				tableWitch: '40%/60%',
																				viewColGroup: 1,
																				importStaticData: (tbodyTd, length) => {
																					let tempData,
																						inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																						selectHtml = `<select class="form-control table-input input-sm"></select>`

																					for (let i = 0, len = length; i < len; i++) {
																						switch (i) {
																							case 0: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].role_class_name
																								tbodyTd.eq(i).find('input').val(tempData)
																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									className = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									judgment1 = className != dataList[currentTr.index()].role_class_name
																									console.log(judgment1)
																									if(!judgment1){
																										className=''
																									}
																								})
																								break;
																							}
																							case 1: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].role_class_detail
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									classDetail = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									judgment2 = classDetail != dataList[currentTr.index()].role_class_detail
																									console.log(judgment2)

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

																				if (!judgment2 && !judgment1) {
																					swal({
																						title: '请确定是否修改了数据',
																						text: '请检查数据是否完整或格式是否正确后再点击提交',
																						type: 'warning',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: false, // 显示用户取消按钮
																						confirmButtonText: '确定',
																					})
																				}
																					else{
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
																								url: modifyClassesUrl,
																								data: {
																									"classId":classId,
																									"className": className,
																									"classDetail": classDetail
																								},
																								success: function (result, status, xhr) {
																									if (result.status === 0) {

																										let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																										swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																									}
																									else if (result.status === 1) {
																										swallFail2(result.msg); //操作失败
																									   }
																									else {
																										swallFail();	//操作失败
																									}
																								}
																							})
																						});
																					}
																				})

																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																			classId = dataList[currentTr.index()].role_class_id

																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeClassesUrl,
																					 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: {
																						'classId': classId
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
											displayRow: result.map.classes.length // 显示行数
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

					//导航栏点击时运行数据加载
					addTableData(queryClassesUrl,{
						type:'info',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.input-group-btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryClassesUrl, {
								type:'info',
								className:val,
								headNum: 1
							});
						}
						else {
							addTableData(queryClassesUrl,{
								type:'info',
								headNum: 1
							});
							// 为空时重置搜索
							return;
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}
					});
					headmainbtn1.off('click').on('click',function (event) {
						let dataContent = $('#jurisdictionModal'),			//模态框
						panelModal1 = dataContent.find('.panel'),	//panel
						modalCloseBtn = dataContent.find('.modal-header').find('.close'),	//关闭按钮
						modalSubmitBtn = dataContent.find('.modal-submit'),		//提交按钮
						fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),	//模糊搜索按钮组


						// 表单要提交的数据
						className= '',	//班次名称
						classDetail= ''	//班次说明

					// panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题
					// fuzzySearchGroupBtn.removeClass('hide')

					mesHorizontalTableAddData(panelModal1.find('table'), null, {
						thead: '班次名称/班次说明',
						tableWitch: '40%/60%',
						viewColGroup: 1,
						importStaticData: (tbodyTd, length) => {
							let tempData,
								inputHtml = `<input type="text" class="table-input" placeholder="请输入（必填）" autocomplete="on" />`,
								inputHtml1 = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
								selectHtml = `<select class="form-control table-input input-sm"></select>`

							for (let i = 0, len = length; i < len; i++) {
								switch (i) {
									case 0: {
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml)
										// 添加到提交数据
										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											className = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
										})
										break;
									}
									case 1: {
										tbodyTd.eq(i).addClass('table-input-td')
										tbodyTd.eq(i).html(inputHtml1)
										// 添加到提交数据
										tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
											classDetail = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")

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
							if (className !== '' ) {
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
										url: saveClassesUrl,
										data: {
											"className": className,
											"classDetail": classDetail
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {
												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											} else if (result.status === 1) {
												swallFail2(result.msg);	//操作失败
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
			case '#jurisdictionManage':	//权限管理内容区域
				(function () {
					let activeSwiper = $('#jurisdictionManage'), // 右侧外部swiper
						activeSubSwiper = $('#jurisdictionManageInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						headmainbtn2 = activePanelHeading.find('.head-main-btn-2'), // 表格结构按钮
						headmainbtn3 = activePanelHeading.find('.head-main-btn-3') // 树形表格按钮
						// $('#right_wrapper').addClass('right-wrapper');
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})
					$.ajax({
						 type: "POST",  dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
						url: queryFunctionUrl,
						data: {'type':'function'},
						success: function (result, status, xhr) {
							if (result.status === 0) {
								functionsList = result.map.functions
								functionsSet = new Set(functionsList)
							} else {
								swallFail();	//操作失败
							}
						}
					})
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
									paginationContainer.show()	//显示分页按钮
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/权限名称',
											theadWidth: '3%/30%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>'
											],

											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.functions, // 主要数据列表
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
																tempData = dataList[currentTr.index()].name;
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
											totalRow: result.map.line, // 总行数
											displayRow: result.map.functions.length // 显示行数
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
					addTableData(queryFunctionUrl, {
						'type':'function',
						headNum:1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.input-group-btn').off('click').on('click', function (event) {
						console.log(fuzzySearchGroup.find('.btn'))
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryFunctionUrl, {
								'type':'function',
								functionName: val,
								headNum: 1
							});
						}
						else {
							addTableData(queryFunctionUrl, {
								'type':'function',
								headNum: 1
							});
							// 为空时重置搜索
							return;
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}
					});


					headmainbtn2.off('click').on('click',function (event) {

					})
					headmainbtn3.off('click').on('click',function (event) {
						let dataContent = $('#jurisdictionTreeModal'),			//模态框
						panelModal1 = dataContent.find('.panel'),	//panel
						modalCloseBtn = dataContent.find('.modal-header').find('.close'),	//关闭按钮
						modalSubmitBtn = dataContent.find('.modal-submit'),		//提交按钮
						fuzzySearchGroup = dataContent.find('.fuzzy-search-group')	//模糊搜索按钮组

						var zNodes = [];
						var setting = {		//树状图配置
							data: {					//数据
								simpleData: {
									enable: true
								}
							},
							view: {						//显示
								showIcon: false,
								dblClickExpand: false,
								showLine: false
							},
							callback: {				//回调函数
								beforeExpand: beforeExpand,
								onExpand: onExpand,
								onClick: onClick
							}
						};

						var curExpandNode = null;
						// 用于捕获父节点展开之前的事件回调函数
						function beforeExpand(treeId, treeNode) {
							var pNode = curExpandNode ? curExpandNode.getParentNode() : null;
							var treeNodeP = treeNode.parentTId ? treeNode.getParentNode() : null;
							var zTree = $.fn.zTree.getZTreeObj("jurisdictionTree");
							for (var i = 0, l = !treeNodeP ? 0 : treeNodeP.children.length; i < l; i++) {
								if (treeNode !== treeNodeP.children[i]) {
									zTree.expandNode(treeNodeP.children[i], false);
								}
							}
							while (pNode) {
								if (pNode === treeNode) {
									break;
								}
								pNode = pNode.getParentNode();
							}
							if (!pNode) {
								singlePath(treeNode);
							}

						}
						function singlePath(newNode) {
							if (newNode === curExpandNode) return;

							var zTree = $.fn.zTree.getZTreeObj("jurisdictionTree"),
								rootNodes, tmpRoot, tmpTId, i, j, n;

							if (!curExpandNode) {
								tmpRoot = newNode;
								while (tmpRoot) {
									tmpTId = tmpRoot.tId;
									tmpRoot = tmpRoot.getParentNode();
								}
								rootNodes = zTree.getNodes();
								for (i = 0, j = rootNodes.length; i < j; i++) {
									n = rootNodes[i];
									if (n.tId != tmpTId) {
										zTree.expandNode(n, false);
									}
								}
							} else if (curExpandNode && curExpandNode.open) {
								if (newNode.parentTId === curExpandNode.parentTId) {
									zTree.expandNode(curExpandNode, false);
								} else {
									var newParents = [];
									while (newNode) {
										newNode = newNode.getParentNode();
										if (newNode === curExpandNode) {
											newParents = null;
											break;
										} else if (newNode) {
											newParents.push(newNode);
										}
									}
									if (newParents != null) {
										var oldNode = curExpandNode;
										var oldParents = [];
										while (oldNode) {
											oldNode = oldNode.getParentNode();
											if (oldNode) {
												oldParents.push(oldNode);
											}
										}
										if (newParents.length > 0) {
											zTree.expandNode(oldParents[Math.abs(oldParents.length - newParents.length) - 1], false);
										} else {
											zTree.expandNode(oldParents[oldParents.length - 1], false);
										}
									}
								}
							}
							curExpandNode = newNode;
						}
						// 用于捕获节点被展开的事件回调函数
						function onExpand(event, treeId, treeNode) {
							curExpandNode = treeNode;
						}

						function onClick(e, treeId, treeNode) {
							var zTree = $.fn.zTree.getZTreeObj("jurisdictionTree");
							zTree.expandNode(treeNode, null, null, null, true);
						}


						for (let i = 0, len = functionsList.length; i < len; i++){
							let tempData = {id: '',pId: '',	name: '',	open:''};

							tempData.id = parseInt(functionsList[i].id);
							tempData.pId = parseInt(functionsList[i].pId);
							tempData.name = functionsList[i].name;
							tempData.open = false;

							zNodes.push(tempData);

						}
						$.fn.zTree.init($("#jurisdictionTree"), setting, zNodes);


					})
				}())
				break;
			case '#organizationalStructure':	//组织结构内容区域
				(function () {
					let activeSwiper = $('#organizationalStructure'), // 右侧外部swiper
						activeSubSwiper = $('#organizationalStructureInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						panelTbody = activeSubSwiper.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						treeDemo = $('#organizationaltree'),
					mesloadBox = new MesloadBox(activePanel, { warningContent: '没有此类信息，请重新选择或输入' });
					// $('#right_wrapper').addClass('right-wrapper');
					(function () {
						$.ajax({		//获取所有产线
							 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: queryProductLinesUrl,
							data: { 'type': 'info' },
							success: function (result, status, xhr) {
								if (result.status === 0) {
									let productLines = result.map.productLines;
									createlevel1(productLines)
								} else {
									swallFail();	//操作失败
								}
							}
						})
						//创建一级菜单
						function createlevel1(productLines) {
							treeDemo.empty()
							for (let i = 0, len = productLines.length; i < len; i++) {
								let tempStr = `
										<ul class="level1">
											<a class="btn-width-200 menu1" href="javascript:;" idval="${productLines[i].product_line_id}"><i class="fa fa-plus-square-o" style="color:#000000;"></i>${productLines[i].product_line_name}</a>
										</ul>
										`;
								treeDemo.append(tempStr)

							}
						}
						$('.btn-danger').popover('toggle')
						//创建二级菜单
						function createlevel2(workshops, currentObj) {
							currentObj.siblings().remove(); //清空数据
							let tempStr = '';

							if (workshops.length < 1) {
								currentObj.after(
									`<li>
											<ul class="level2">
												<a class="btn-width-200" href="javascript:;">(无)</a>
											</ul>
										</li>`
								)
							} else {
								tempStr += '<li>';

								for (let i = 0, len = workshops.length; i < len; i++) {
									tempStr += '<ul class="level2">';
									tempStr += '<a class="btn-width-200 menu2" href="javascript:;" idval ="' + workshops[i].role_workshop_id + '"><i class="fa fa-plus-square-o" style="color:#000000;"></i>' + workshops[i].role_workshop_name + '</a>';
									tempStr += '</ul>';
								}
								tempStr += '</li>';
								currentObj.after(tempStr)
							}
							currentObj.siblings().hide().slideDown()
						}
						panelTbody.empty().append(NO_DATA_NOTICE)
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
										paginationContainer.show()	//显示分页按钮
										mesVerticalTableAddData(activePanel, {
											thead: {
												theadContent: '序号/人员/职位',
												theadWidth: '8%/15%/15%'
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
														dataList = map.postStaff, // 主要数据列表
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
																	tempData = dataList[currentTr.index()].staff.role_staff_name;
																	currentTr.children().eq(j).html(tempData)
																}
																		break;
																case 2: {
																	tempData = dataList[currentTr.index()].post.role_post_name;
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
												displayRow: result.map.postStaff.length // 显示行数
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
									}
								}
							})
						}
						function type(type,id){ // 点击树状图发送对应ajax请求
							if(type == 'productLines'){
								addTableData(queryTeamStaffUrl, {productLineId:id,headNum:1})
							}else{
								addTableData(queryTeamStaffUrl, {workshopId:id,headNum:1})
							}

						}
						//创建三级菜单
						function createlevel3(process, currentObj) {
							currentObj.siblings().remove(); //清空数据
							let tempStr = '';

							if (process.length < 1) {
								currentObj.after(
									`<li>
											<ul class="level2">
												<a class="btn-width-200" href="javascript:;">(无)</a>
											</ul>
										</li>`
								)
							} else {
								tempStr += '<li>';

								for (let i = 0, len = process.length; i < len; i++) {
									tempStr += '<ul class="level3">';
									tempStr += '<a class="btn-width-200 menu3" href="javascript:;" idval ="' + process[i].workstage_basics_id + '">' + process[i].workstage_name + '</a>';
									tempStr += '</ul>';
								}
								tempStr += '</li>';
								currentObj.after(tempStr)
							}

							currentObj.siblings().hide().slideDown()
						}
						//为一级菜单绑定单击事件
						treeDemo.on('click', '.menu1', function (event) {
							event.stopPropagation()
							let productId = $(this).attr('idval'),
								currentObj = $(this);
							currentObj.find('i').removeClass('fa fa-plus-square-o').addClass('fa fa-minus-square-o')
							currentObj.closest('.level1').siblings().find('a i').removeClass('fa fa-minus-square-o').addClass('fa fa-plus-square-o')
							currentObj.closest('.level1').siblings().children('li').stop(true, true).slideUp()
							// 点击树状图发送对应ajax请求
							type('productLines',productId)
							$.ajax({	//获取产线下对应的车间
								 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
								url: queryWorkshopsUrl,
								data: { 'type': 'workshop', 'productLineId': productId, },
								success: function (result, status, xhr) {
									let workshops = [];
									if (result.status === 0) {
										workshops = result.map.workshops;
									}
									createlevel2(workshops, currentObj)
								}
							})
						})
						//为二级菜单绑定单击事件
						treeDemo.on('click', '.menu2', function (event) {
							event.stopPropagation()
							let workshopId = $(this).attr('idval'),
								currentObj = $(this);

							currentObj.find('i').removeClass('fa fa-plus-square-o').addClass('fa fa-minus-square-o')
							currentObj.closest('.level2').siblings().find('a i').removeClass('fa fa-minus-square-o').addClass('fa fa-plus-square-o')
							currentObj.closest('.level2').siblings().children('li').stop(true, true).slideUp()
							// 点击树状图发送对应ajax请求
							type('workshops',workshopId)
							$.ajax({//获取车间下对应的工序
								 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true, dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
								url: queryWorkshopsUrl,
								data: { 'type': 'workstage', 'workshopId': workshopId, },
								success: function (result, status, xhr) {
									let process = [];
									if (result.status === 0) {
										process = result.map.workstages;
									}
									createlevel3(process, currentObj)
								}
							})
						})

					}())


				}())
				break;
			case '#productionLineManage':	//产线管理内容区域
				(function () {
					let activeSwiper = $('#productionLineManage'), // 右侧外部swiper
						activeSubSwiper = $('#productionLineManageInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						headmainbtn1 = activePanelHeading.find('.head-main-btn-1'), // 新增产线按钮
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

						// $('#right_wrapper').addClass('right-wrapper');
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
									paginationContainer.show()	//显示分页按钮
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/产线名/职位配置/人员配置/设备配置/操作',
											theadWidth: '5%/15%/10%/10%/10%/20%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#positionSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>职位配置</a></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#staffSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>人员配置</a></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#devicesSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>设备配置</a></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#productionLineDetailModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>增加车间</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#submitModelModal"><i class="fa fa-tasks fa-fw"></i>修改</a><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
											],
											// 添加表格主体数据, 这是一个回调函数,这里不需要传参
											dataAddress: function (tbodyTarget, html, result) {
												tbodyTarget.empty() // 清空表格主体
												let map = result.map, // 映射
													dataList = map.productLines, // 主要数据列表
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
																tempData = dataList[currentTr.index()].product_line_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 2: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let activeSwiperModel = $('#positionSelectModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		panelTbody = panel.find('table tbody'),	//面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		productId = dataList[currentTr.index()].product_line_id,
																		HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																		IdList = [];
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
																					panelTbody.empty()
																					paginationContainer.show()	//显示分页按钮
																					mesVerticalTableAddData(panel, {
																						thead: {
																							theadContent: '序号/职位名称/职位说明/操作',
																							theadWidth: '8%/30%/30%/20%'
																						},
																						tbody: {
																							html: [
																								'<td></td>',
																								'<td></td>',
																								'<td></td>',
																								'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
																							],
																							// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																							dataAddress: function (tbodyTarget, html, result) {
																								tbodyTarget.empty() // 清空表格主体
																								let map = result.map, // 映射
																									dataList = map.postStaff, // 主要数据列表
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
																												tempData = dataList[currentTr.index()].post.role_post_name;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[currentTr.index()].post.role_post_detail;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 3: {
																												currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																													let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																														postId = dataList[currentTr.index()].post.role_post_id
																														swal({
																															title: '您确定要移除此条数据吗？',
																															text: '删除后将无法查询',
																															type: 'question',
																															showCancelButton: true,
																															confirmButtonText: '确定',
																															cancelButtonText: '取消'
																														}).then(function () {
																															$.ajax({
																																url: removeTeamPostUrl,
																																 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																data: {
																																	'postId': postId,
																																	'productLineId':productId
																																},
																																success: function (result) {
																																	if (result.status === 0) {
																																		addTableData2(queryTeamPostUrl, {'productLineId':productId,headNum:1})
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
																																			title: '移除失败',
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
																							displayRow: result.map.postStaff.length // 显示行数
																						},
																						ajax: {
																							url: url,
																							data:data
																						}
																					})
																				}else if(result.status === 2){
																					IdList= []
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																				}else {
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																					mesloadBox.warningShow();
																				}
																			}
																		})
																		//获取全部已选择的人员
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryTeamPostUrl,
																			data: {'productLineId':productId},
																			success: function (result, status, xhr) {
																				if (result.status === 0) {
																					for(var i = 0; i < result.map.lines; i++){
																						IdList.push(result.map.postStaff[i].post.role_post_id)
																					}
																				}
																			}
																		})
																	}
																	addTableData2(queryTeamPostUrl, {'productLineId':productId,headNum:1})
																	//增加按钮事件
																	HearModelBtn1.off('click').on('click', (event) => {
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryTeamPostUrl,
																			data:{'productLineId':productId,headNum: 1},
																			success: function (result, status, xhr) {
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData4(resolve, queryPostUrl, {type:'info',headNum: 1},IdList)
																				}),
																				panelTbodyIndex = panelTbody.children('tr').length+1,
																				roleStaffId='',
																				postIds = []
																				promise.then(function (resolveData) {
																					if (result.status === 0){
																						for(var i = 0; i < result.map.postStaff.length; i++){
																							roleStaffId += result.map.postStaff[i].post.role_post_id == resolveData.roleStaffId
																						}
																					}
																					var key = roleStaffId.indexOf('true') == -1
																					if(!key){
																						swal({
																							title: '禁止重复选择',
																							type: 'warning',
																							timer: '1000',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: false, // 显示用户取消按钮
																							showConfirmButton: false, // 显示用户确认按钮
																						})
																					}else{
																						postIds.push(resolveData.roleStaffId)
																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: addPostUrl,
																							data: {'type':'productLine','productId':productId,'postIds':postIds.toString()},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {
																									addTableData2(queryTeamPostUrl, {'productLineId':productId,headNum:1})
																								}else{
																									swal({
																										title: '数据类型错误',
																										text: '请重新选择权限',
																										type: 'question',
																										allowEscapeKey: false, // 用户按esc键不退出
																										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																										showCancelButton: true, // 显示用户取消按钮
																										confirmButtonText: '确定',
																										cancelButtonText: '取消',
																									})
																								}
																							}
																						})
																		 			}
																				})

																		 	}
																		})
																	})
																})
															}
																break;
															case 3: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let activeSwiperModel = $('#staffSelectModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		panelTbody = panel.find('table tbody'),	//面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		productId = dataList[currentTr.index()].product_line_id,
																		HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																		judge = '',
																		IdList = [];
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
																						panelTbody.empty()
																						paginationContainer.show()	//显示分页按钮
																						mesVerticalTableAddData(panel, {
																							thead: {
																								theadContent: '序号/人员/职位/操作',
																								theadWidth: '8%/20%/20%/10%'
																							},
																							tbody: {
																								html: [
																									'<td></td>',
																									'<td></td>',
																									'<td></td>',
																									'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>移除</a></td>'
																								],
																								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																								dataAddress: function (tbodyTarget, html, result) {
																									tbodyTarget.empty() // 清空表格主体
																									let map = result.map, // 映射
																										dataList = map.postStaff, // 主要数据列表
																										tempData = null; // 表格td内的临时数据
																										judge = dataList;
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
																													tempData =dataList[currentTr.index()].staff.role_staff_name
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 2: {
																													tempData = dataList[currentTr.index()].post.role_post_name;
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 3: {
																													currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																														let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																														staffId = dataList[currentTr.index()].staff.role_staff_id
																														swal({
																															title: '您确定要删除此条数据吗？',
																															text: '删除后将无法查询',
																															type: 'question',
																															showCancelButton: true,
																															confirmButtonText: '确定',
																															cancelButtonText: '取消'
																														}).then(function () {
																															$.ajax({
																																url: removeTeamStaffUrl,
																																 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																data: {
																																	"staffId": staffId,
																																	'productLineId': productId
																																},
																																success: function (result) {
																																	if (result.status === 0) {
																																		addTableData2(queryTeamStaffUrl, {'productLineId':productId,headNum:1})
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
																								displayRow: result.map.postStaff.length // 显示行数
																							},
																							ajax: {
																								url: url,
																								data:data
																							}
																						})
																					}else if(result.status === 2){
																						judge = '';
																						IdList= [];
																						panelTbody.empty().append(NO_DATA_NOTICE2)
																						paginationContainer.hide()	//隐藏分页按钮
																					}else {
																						panelTbody.empty().append(NO_DATA_NOTICE)
																						paginationContainer.hide()	//隐藏分页按钮
																						mesloadBox.warningShow();
																					}
																				}
																			})
																			//获取全部已选择的人员
																			$.ajax({
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				url: queryTeamStaffUrl,
																				data: {'productLineId':productId},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						for(var i = 0; i < result.map.lines; i++){
																							IdList.push(result.map.postStaff[i].staff.role_staff_id)
																						}
																					}
																				}
																			})
																		}
																		addTableData2(queryTeamStaffUrl, {'productLineId':productId,headNum:1})

																		HearModelBtn1.off('click').on('click',function (event) {
																			let promise = new Promise(function (resolve, reject) {
																				selectStaffAddData5(resolve, queryStaffUrl , IdList, queryTeamPostUrl, {'productLineId':productId,headNum:1})
																			}),
																			roleStaffId=''
																			promise.then(function (resolveData) {
																					var staffIds = resolveData.roleStaffId,
																					postId = resolveData.postId
																					$.ajax({
																						type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																						url: addStaffUrl,
																						data: {'type':'productLine','productId':productId,'postId':postId,'staffIds':staffIds},
																						success: function (result, status, xhr) {
																							if (result.status === 0) {
																								addTableData2(queryTeamStaffUrl, {'productLineId':productId,headNum:1})
																							}else{
																								swal({
																									title: '添加数据失败',
																									text: '请重新添加',
																									type: 'question',
																									allowEscapeKey: false, // 用户按esc键不退出
																									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																									showCancelButton: true, // 显示用户取消按钮
																									confirmButtonText: '确定',
																									cancelButtonText: '取消',
																								})
																							}
																						}
																					})
																			})
																		})
																})
															}
																break;
															case 4: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let activeSwiperModel = $('#devicesSelectModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		panelTbody = panel.find('table tbody'),	//面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		productLineId = dataList[currentTr.index()].product_line_id,
																		HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																		IdList = [];
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
																					panelTbody.empty()
																					paginationContainer.show()	//显示分页按钮
																					mesVerticalTableAddData(panel, {
																						thead: {
																							theadContent: '序号/设备名称/编号/操作',
																							theadWidth: '8%/30%/30%/20%'
																						},
																						tbody: {
																							html: [
																								'<td></td>',
																								'<td></td>',
																								'<td></td>',
																								'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
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
																												tempData = dataList[currentTr.index()].devices.devices_control_devices_name;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[currentTr.index()].devices.devices_control_devices_number;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 3: {
																												currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																													let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																														devicesId = dataList[currentTr.index()].devices.devices_control_devices_id
																														swal({
																															title: '您确定要移除此条数据吗？',
																															text: '删除后将无法查询',
																															type: 'question',
																															showCancelButton: true,
																															confirmButtonText: '确定',
																															cancelButtonText: '取消'
																														}).then(function () {
																															$.ajax({
																																url: removeTeamDevicesUrl,
																																 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																data: {
																																	'devicesId':devicesId,
																																	'productLineId': productLineId
																																},
																																success: function (result) {
																																	if (result.status === 0) {
																																		addTableData2(queryDevicesTeamUrl, {'productLineId':productLineId,headNum:1})
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
																																			title: '移除失败',
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
																							data:data
																						}
																					})
																				}else if(result.status === 2){
																					IdList= []
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																				}else {
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																					mesloadBox.warningShow();
																				}
																			}
																		})
																		//获取全部已选择的人员
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryDevicesTeamUrl,
																			data: {'productLineId':productLineId},
																			success: function (result, status, xhr) {
																				if (result.status === 0) {
																					for(var i = 0; i < result.map.lines; i++){
																						IdList.push(result.map.devices[i].devices.devices_control_devices_id)
																					}
																				}
																			}
																		})
																	}
																	addTableData2(queryDevicesTeamUrl, {'productLineId':productLineId,headNum:1})
																	//增加按钮事件
																	HearModelBtn1.off('click').on('click', (event) => {
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryDevicesTeamUrl,
																			data:{'productLineId':productLineId,headNum:1},
																			success: function (result, status, xhr) {
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData3(resolve, queryDevicesUrl, {'type':'all',headNum: 1 }, IdList)
																				}),
																				panelTbodyIndex = panelTbody.children('tr').length+1,
																				roleStaffId='',
																				devicesIds = []
																				promise.then(function (resolveData) {
																					if (result.status === 0){
																						for(var i = 0; i < result.map.devices.length; i++){
																							roleStaffId += result.map.devices[i].devices.devices_control_devices_id == resolveData.roleStaffId
																						}
																					}
																					var key = roleStaffId.indexOf('true') == -1
																					if(!key){
																						swal({
																							title: '禁止选择重复权限',
																							type: 'warning',
																							timer: '1000',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: false, // 显示用户取消按钮
																							showConfirmButton: false, // 显示用户确认按钮
																						})
																					}else{
																						devicesIds.push(resolveData.roleStaffId)
																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: addTeamDevicesUrl,
																							data: {'productId':productLineId,'devicesIds':devicesIds.toString()},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {
																									addTableData2(queryDevicesTeamUrl, {'productLineId':productLineId,headNum:1})
																								}else{
																									swal({
																										title: '增加失败',
																										text: '请重新增加',
																										type: 'question',
																										allowEscapeKey: false, // 用户按esc键不退出
																										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																										showCancelButton: true, // 显示用户取消按钮
																										confirmButtonText: '确定',
																										cancelButtonText: '取消',
																									})
																								}
																							}
																						})
																		 			}
																				})

																		 	}
																		})
																	})
																})
															}
																break;
															case 5:
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		judgment1 ='',judgment2='';
																	switch (dataContent) {
																		case '#productionLineDetailModal': {
																			let activeSwiperModel = $('#productionLineDetailModal'), // 右侧外部swiper
																				panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																				panelTbody = panel.find('table tbody'),	//面版表格tbody
																				paginationContainer = panel.find('.pagination'),		// 分页ul标签
																				productId = dataList[currentTr.index()].product_line_id,
																				HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																				IdList = [];
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
																							panelTbody.empty()
																							paginationContainer.show()	//显示分页按钮
																							mesVerticalTableAddData(panel, {
																								thead: {
																									theadContent: '序号/车间名称/车间地址/操作',
																									theadWidth: '8%/30%/30%/20%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
																									],
																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.workshops, // 主要数据列表
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
																														tempData = dataList[currentTr.index()].role_workshop_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[currentTr.index()];
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																															let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																															workshopId = dataList[currentTr.index()].role_workshop_id
																																swal({
																																	title: '您确定要移除此条数据吗？',
																																	text: '删除后将无法查询',
																																	type: 'question',
																																	showCancelButton: true,
																																	confirmButtonText: '确定',
																																	cancelButtonText: '取消'
																																}).then(function () {
																																	$.ajax({
																																		url: removeWorkshopsUrl,
																																		 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																		data: {
																																			'type':'remove',
																																			'workshopId': workshopId,
																																			'productLineId':productId
																																		},
																																		success: function (result) {
																																			if (result.status === 0) {
																																				addTableData2(queryWorkshopsUrl, {'type':'workshop','productLineId':productId,headNum:1})
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
																																					title: '移除失败',
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
																									displayRow: result.map.workshops.length // 显示行数
																								},
																								ajax: {
																									url: url,
																									data:data
																								}
																							})
																						}else if(result.status === 2){
																							IdList= []
																							panelTbody.empty().append(NO_DATA_NOTICE)
																							paginationContainer.hide()	//隐藏分页按钮
																						}else {
																							panelTbody.empty().append(NO_DATA_NOTICE)
																							paginationContainer.hide()	//隐藏分页按钮
																							mesloadBox.warningShow();
																						}
																					}
																				})
																				//获取全部已选择的人员
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: queryWorkshopsUrl,
																					data: {'type':'workshop','productLineId':productId},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							for(var i = 0; i < result.map.lines; i++){
																								IdList.push(result.map.workshops[i].role_workshop_id)
																							}
																						}
																					}
																				})
																			}
																			addTableData2(queryWorkshopsUrl, {'type':'workshop','productLineId':productId,headNum:1})
																			//增加按钮事件
																			HearModelBtn1.off('click').on('click', (event) => {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: queryWorkshopsUrl,
																					data:{'type':'workshop','productLineId':productId,headNum:1},
																					success: function (result, status, xhr) {
																						let promise = new Promise(function (resolve, reject) {
																							selectStaffAddData7(resolve, queryWorkshopsUrl, {'type':'info','productLineId':productId,headNum:1}, IdList)
																						}),
																						panelTbodyIndex = panelTbody.children('tr').length+1,
																						roleStaffId='',
																						workshops = [];
																						promise.then(function (resolveData) {
																							if (result.status === 0){
																								for(var i = 0; i < result.map.workshops.length; i++){
																									roleStaffId += result.map.workshops[i].role_workshop_id == resolveData.roleStaffId
																								}
																							}
																							var key = roleStaffId.indexOf('true') == -1
																							if(!key){
																								swal({
																									title: '禁止选择重复权限',
																									type: 'warning',
																									timer: '1000',
																									allowEscapeKey: false, // 用户按esc键不退出
																									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																									showCancelButton: false, // 显示用户取消按钮
																									showConfirmButton: false, // 显示用户确认按钮
																								})
																							}else{
																								workshops.push(resolveData.roleStaffId)
																								$.ajax({
																									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																									url: addWorkshopsUrl,
																									data: {'productLineId':productId,'workshops':workshops.toString()},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											addTableData2(queryWorkshopsUrl, {'type':'workshop','productLineId':productId,headNum:1})
																										}else{
																											swal({
																												title: '增加失败',
																												text: '请确认无误后重新增加',
																												type: 'question',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: true, // 显示用户取消按钮
																												confirmButtonText: '确定',
																												cancelButtonText: '取消',
																											})
																										}
																									}
																								})
																								}
																						})

																						}
																				})
																			})
																			break;
																		}
																		case '#submitModelModal': {
																			let dataContent = $('#submitModelModal'),
																				panelModal1 = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),

																				// 表单要提交的数据
																					productLineId=dataList[currentTr.index()].product_line_id,
																					productLineName= '',	//产线名称
																					productLineDescribe= ''	//产线说明

																			// panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题
																			// fuzzySearchGroupBtn.removeClass('hide')

																			mesHorizontalTableAddData(panelModal1.find('table'), null, {
																				thead: '产线名称/产线说明',
																				tableWitch: '20%/30%',
																				viewColGroup: 1,
																				importStaticData: (tbodyTd, length) => {
																					let tempData,
																						inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
																						selectHtml = `<select class="form-control table-input input-sm"></select>`

																					for (let i = 0, len = length; i < len; i++) {
																						switch (i) {
																							case 0: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].product_line_name
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									productLineName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									judgment1 = productLineName !== dataList[currentTr.index()].product_line_name
																								})
																								console.log(productLineName)
																								break;
																							}
																							case 1: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tempData = dataList[currentTr.index()].product_line_describe
																								tbodyTd.eq(i).find('input').val(tempData)
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									productLineDescribe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									judgment2 = productLineDescribe !== dataList[currentTr.index()].product_line_describe
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
																				if (!judgment1 && !judgment2){
																					swal({
																						title: '请确定是否修改了数据',
																						text: '请检查数据是否完整或格式是否正确后再点击提交',
																						type: 'warning',
																						allowEscapeKey: false, // 用户按esc键不退出
																						allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																						showCancelButton: false, // 显示用户取消按钮
																						confirmButtonText: '确定',
																					})
																				}
																				else {
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
																							url: modifyProductLinesUrl,
																							data: {
																								'productLineId':productLineId,
																								"productLineName": productLineName,
																								"productLineDescribe": productLineDescribe
																							},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {

																									let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																									swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																								}
																								else if (result.status === 1) {
																									swallFail2(result.msg)
																								}
																								else {
																									swallFail();	//操作失败
																								}
																							}
																						})
																					});
																				}

																			})

																			break;
																		}
																		case 'delete': {
																			let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																				currentTrNntryID = dataList[currentTr.index()].product_line_id

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
																					data: {
																						"type": "delete",
																						productLineId: currentTrNntryID
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
											displayRow: result.map.productLines.length // 显示行数
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

					//导航栏点击时运行数据加载
					addTableData(queryProductLinesUrl, {
						type:'info',
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryProductLinesUrl, {
								productLineName: val,
								headNum: 1
							});
						}
						else {
							addTableData(queryProductLinesUrl, {
								type:'info',
								headNum: 1
							});
							// 为空时重置搜索
							return;
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}
					});

					headmainbtn1.off('click').on('click',function (event) {
						let dataContent = $('#productionLineModal'),
							panelModal1 = dataContent.find('.panel'),
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							modalSubmitBtn = dataContent.find('.modal-submit'),
							fuzzySearchGroup = dataContent.find('.fuzzy-search-group'),

							// 表单要提交的数据
								productLineName= '',	//产线名称
								productLineDescribe= ''	//产线说明

						// panelModal1.find('.panel-heading').find('.panel-title').text('编辑设备') // 更换panel标题
						// fuzzySearchGroupBtn.removeClass('hide')

						mesHorizontalTableAddData(panelModal1.find('table'), null, {
							thead: '产线名称/产线说明',
							tableWitch: '20%/30%',
							viewColGroup: 1,
							importStaticData: (tbodyTd, length) => {
								let tempData,
									inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`,
									selectHtml = `<select class="form-control table-input input-sm"></select>`

								for (let i = 0, len = length; i < len; i++) {
									switch (i) {
										case 0: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												productLineName = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 1: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												productLineDescribe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
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
							if (productLineName !== '') {
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
										url: saveProductLinesUrl,
										data: {
											"productLineName": productLineName,
											"productLineDescribe": productLineDescribe
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {
												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											} else if (result.status === 1) {
												swallFail2(result.msg)
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
			case '#workshopManage':	//车间管理内容区域
				(function () {
					let activeSwiper = $('#workshopManage'), // 右侧外部swiper
						activeSubSwiper = $('#workshopManageManageInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						headmainbtn1 = activePanelHeading.find('.head-main-btn-1'), // 新增员工按钮
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						tempstatu=false
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

						// $('#right_wrapper').addClass('right-wrapper');
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
									paginationContainer.show()	//显示分页按钮
									mesVerticalTableAddData(activePanel, {
										thead: {
											theadContent: '序号/车间名/职位配置/人员配置/设备配置/操作',
											theadWidth: '5%/15%/10%/10%/10%/20%'
										},
										tbody: {
											html: [
												'<td></td>',
												'<td></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#positionSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>职位配置</a></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#staffSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>人员配置</a></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#devicesSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>设备配置</a></td>',
												'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#productionLineDetailModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>添加工序</a><a class="table-link" href="javascript:;" data-toggle-modal-target="#submitModelModal"><i class="fa fa-tasks fa-fw"></i>修改</a><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>删除</a></td>'
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
													for (let j = 0, len = html.length; j < len; j++) {
														currentTr.append(html[j]); // 添加表格内的HTML
														switch (j) {
															case 0:
																currentTr.children().eq(j).html(currentTr.index() + 1)
																break;
															case 1: {
																tempData = dataList[currentTr.index()].role_workshop_name;
																currentTr.children().eq(j).html(tempData)
															}
																break;
															case 2: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let activeSwiperModel = $('#positionSelectModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		panelTbody = panel.find('table tbody'),	//面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		workshopId = dataList[currentTr.index()].role_workshop_id,
																		HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																		IdList = [];
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
																					panelTbody.empty()
																					paginationContainer.show()	//显示分页按钮
																					mesVerticalTableAddData(panel, {
																						thead: {
																							theadContent: '序号/职位名称/职位说明/操作',
																							theadWidth: '8%/30%/30%/20%'
																						},
																						tbody: {
																							html: [
																								'<td></td>',
																								'<td></td>',
																								'<td></td>',
																								'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
																							],
																							// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																							dataAddress: function (tbodyTarget, html, result) {
																								tbodyTarget.empty() // 清空表格主体
																								let map = result.map, // 映射
																									dataList = map.postStaff, // 主要数据列表
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
																												tempData = dataList[currentTr.index()].post.role_post_name;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[currentTr.index()].post.role_post_detail;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 3: {
																												currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																													let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																														postId = dataList[currentTr.index()].post.role_post_id
																														swal({
																															title: '您确定要移除此条数据吗？',
																															text: '删除后将无法查询',
																															type: 'question',
																															showCancelButton: true,
																															confirmButtonText: '确定',
																															cancelButtonText: '取消'
																														}).then(function () {
																															$.ajax({
																																url: removeTeamPostUrl,
																																 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																data: {
																																	'postId': postId,
																																	'workshopId':workshopId
																																},
																																success: function (result) {
																																	if (result.status === 0) {
																																		addTableData2(queryTeamPostUrl, {'workshopId':workshopId,headNum:1})
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
																																			title: '移除失败',
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
																							displayRow: result.map.postStaff.length // 显示行数
																						},
																						ajax: {
																							url: url,
																							data:data
																						}
																					})
																				}else if(result.status === 2){
																					IdList= []
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																				}else {
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																					mesloadBox.warningShow();
																				}
																			}
																		})
																		//获取全部已选择的人员
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryTeamPostUrl,
																			data: {'workshopId':workshopId},
																			success: function (result, status, xhr) {
																				if (result.status === 0) {
																					for(var i = 0; i < result.map.lines; i++){
																						IdList.push(result.map.postStaff[i].post.role_post_id)
																					}
																				}
																			}
																		})
																	}
																	addTableData2(queryTeamPostUrl, {'workshopId':workshopId,headNum:1})
																	//增加按钮事件
																	HearModelBtn1.off('click').on('click', (event) => {
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryTeamPostUrl,
																			data:{'workshopId':workshopId,headNum: 1},
																			success: function (result, status, xhr) {
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData4(resolve, queryPostUrl, {type:'info',headNum: 1},IdList)
																				}),
																				panelTbodyIndex = panelTbody.children('tr').length+1,
																				roleStaffId='',
																				postIds = []
																				promise.then(function (resolveData) {
																					if (result.status === 0){
																						for(var i = 0; i < result.map.postStaff.length; i++){
																							roleStaffId += result.map.postStaff[i].post.role_post_id == resolveData.roleStaffId
																						}
																					}
																					var key = roleStaffId.indexOf('true') == -1
																					if(!key){
																						swal({
																							title: '禁止重复选择',
																							type: 'warning',
																							timer: '1000',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: false, // 显示用户取消按钮
																							showConfirmButton: false, // 显示用户确认按钮
																						})
																					}else{
																						postIds.push(resolveData.roleStaffId)
																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: addPostUrl,
																							data: {'type':'workshop','workshopId':workshopId,'postIds':postIds.toString()},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {
																									addTableData2(queryTeamPostUrl, {'workshopId':workshopId,headNum:1})
																								}else{
																									swal({
																										title: '数据类型错误',
																										text: '请重新选择权限',
																										type: 'question',
																										allowEscapeKey: false, // 用户按esc键不退出
																										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																										showCancelButton: true, // 显示用户取消按钮
																										confirmButtonText: '确定',
																										cancelButtonText: '取消',
																									})
																								}
																							}
																						})
																		 			}
																				})

																		 	}
																		})
																	})
																})
															}
																break;
															case 3: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let activeSwiperModel = $('#staffSelectModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		panelTbody = panel.find('table tbody'),	//面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		workshopId = dataList[currentTr.index()].role_workshop_id,
																		HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																		judge = '',
																		IdList = [];
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
																						panelTbody.empty()
																						paginationContainer.show()	//显示分页按钮
																						mesVerticalTableAddData(panel, {
																							thead: {
																								theadContent: '序号/人员/职位/操作',
																								theadWidth: '8%/20%/20%/10%'
																							},
																							tbody: {
																								html: [
																									'<td></td>',
																									'<td></td>',
																									'<td></td>',
																									'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>移除</a></td>'
																								],
																								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																								dataAddress: function (tbodyTarget, html, result) {
																									tbodyTarget.empty() // 清空表格主体
																									let map = result.map, // 映射
																										dataList = map.postStaff, // 主要数据列表
																										tempData = null; // 表格td内的临时数据
																										judge = dataList;
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
																													tempData =dataList[currentTr.index()].staff.role_staff_name
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 2: {
																													tempData = dataList[currentTr.index()].post.role_post_name;
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 3: {
																													currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																														let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																														staffId = dataList[currentTr.index()].staff.role_staff_id
																														swal({
																															title: '您确定要删除此条数据吗？',
																															text: '删除后将无法查询',
																															type: 'question',
																															showCancelButton: true,
																															confirmButtonText: '确定',
																															cancelButtonText: '取消'
																														}).then(function () {
																															$.ajax({
																																url: removeTeamStaffUrl,
																																 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																data: {
																																	"staffId": staffId,
																																	'workshopId': workshopId
																																},
																																success: function (result) {
																																	if (result.status === 0) {
																																		addTableData2(queryTeamStaffUrl, {'workshopId':workshopId,headNum:1})
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
																								displayRow: result.map.postStaff.length // 显示行数
																							},
																							ajax: {
																								url: url,
																								data:data
																							}
																						})
																					}else if(result.status === 2){
																						judge = '';
																						IdList= [];
																						panelTbody.empty().append(NO_DATA_NOTICE2)
																						paginationContainer.hide()	//隐藏分页按钮
																					}else {
																						panelTbody.empty().append(NO_DATA_NOTICE)
																						paginationContainer.hide()	//隐藏分页按钮
																						mesloadBox.warningShow();
																					}
																				}
																			})
																			//获取全部已选择的人员
																			$.ajax({
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				url: queryTeamStaffUrl,
																				data: {'workshopId':workshopId},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						for(var i = 0; i < result.map.lines; i++){
																							IdList.push(result.map.postStaff[i].staff.role_staff_id)
																						}
																					}
																				}
																			})
																		}
																		addTableData2(queryTeamStaffUrl, {'workshopId':workshopId,headNum:1})

																		HearModelBtn1.off('click').on('click',function (event) {
																			let promise = new Promise(function (resolve, reject) {
																				selectStaffAddData5(resolve, queryStaffUrl, IdList, queryTeamPostUrl, {'workshopId':workshopId,headNum:1})
																			}),
																			roleStaffId=''
																			promise.then(function (resolveData) {
																				var staffIds = resolveData.roleStaffId,
																				postId = resolveData.postId
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: addStaffUrl,
																					data: {'type':'workshop','workshopId':workshopId,'postId':postId,'staffIds':staffIds},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							addTableData2(queryTeamStaffUrl, {'workshopId':workshopId,headNum:1})
																						}else{
																							swal({
																								title: '添加数据失败',
																								text: '请重新添加',
																								type: 'question',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: true, // 显示用户取消按钮
																								confirmButtonText: '确定',
																								cancelButtonText: '取消',
																							})
																						}
																					}
																				})
																			})
																		})
																})
															}
																break;
															case 4: {
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let activeSwiperModel = $('#devicesSelectModal'), // 右侧外部swiper
																		panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																		panelTbody = panel.find('table tbody'),	//面版表格tbody
																		paginationContainer = panel.find('.pagination'),		// 分页ul标签
																		workshopId = dataList[currentTr.index()].role_workshop_id,
																		HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																		IdList=[];
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
																					panelTbody.empty()
																					paginationContainer.show()	//显示分页按钮
																					mesVerticalTableAddData(panel, {
																						thead: {
																							theadContent: '序号/设备名称/编号/操作',
																							theadWidth: '8%/30%/30%/20%'
																						},
																						tbody: {
																							html: [
																								'<td></td>',
																								'<td></td>',
																								'<td></td>',
																								'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
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
																												tempData = dataList[currentTr.index()].devices.devices_control_devices_name;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 2: {
																												tempData = dataList[currentTr.index()].devices.devices_control_devices_number;
																												currentTr.children().eq(j).html(tempData)
																											}
																												break;
																											case 3: {
																												currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																													let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																														devicesId = dataList[currentTr.index()].devices.devices_control_devices_id
																														swal({
																															title: '您确定要移除此条数据吗？',
																															text: '删除后将无法查询',
																															type: 'question',
																															showCancelButton: true,
																															confirmButtonText: '确定',
																															cancelButtonText: '取消'
																														}).then(function () {
																															$.ajax({
																																url: removeTeamDevicesUrl,
																																 type: "POST",  dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																data: {
																																	'devicesId':devicesId,
																																	'workshopId': workshopId
																																},
																																success: function (result) {
																																	if (result.status === 0) {
																																		addTableData2(queryDevicesTeamUrl, {'workshopId':workshopId,headNum:1})
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
																																			title: '移除失败',
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
																							data:data
																						}
																					})
																				}else if(result.status === 2){
																					IdList= []
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																				}else {
																					panelTbody.empty().append(NO_DATA_NOTICE)
																					paginationContainer.hide()	//隐藏分页按钮
																					mesloadBox.warningShow();
																				}
																			}
																		})
																		//获取全部已选择的人员
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryDevicesTeamUrl,
																			data: {'workshopId':workshopId},
																			success: function (result, status, xhr) {
																				if (result.status === 0) {
																					for(var i = 0; i < result.map.lines; i++){
																						IdList.push(result.map.devices[i].devices.devices_control_devices_id)
																					}
																				}
																			}
																		})
																	}
																	addTableData2(queryDevicesTeamUrl, {'workshopId':workshopId,headNum:1})
																	//增加按钮事件
																	HearModelBtn1.off('click').on('click', (event) => {
																		$.ajax({
																			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																			url: queryDevicesTeamUrl,
																			data:{'workshopId':workshopId,headNum:1},
																			success: function (result, status, xhr) {
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData3(resolve, queryDevicesUrl, {'type':'all',headNum: 1 }, IdList)
																				}),
																				panelTbodyIndex = panelTbody.children('tr').length+1,
																				roleStaffId='',
																				devicesIds = []
																				promise.then(function (resolveData) {
																					if (result.status === 0){
																						for(var i = 0; i < result.map.devices.length; i++){
																							roleStaffId += result.map.devices[i].devices.devices_control_devices_id == resolveData.roleStaffId
																						}
																					}
																					var key = roleStaffId.indexOf('true') == -1
																					if(!key){
																						swal({
																							title: '禁止重复选择',
																							type: 'warning',
																							timer: '1000',
																							allowEscapeKey: false, // 用户按esc键不退出
																							allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																							showCancelButton: false, // 显示用户取消按钮
																							showConfirmButton: false, // 显示用户确认按钮
																						})
																					}else{
																						devicesIds.push(resolveData.roleStaffId)
																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: addTeamDevicesUrl,
																							data: {'workshopId':workshopId,'devicesIds':devicesIds.toString()},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {
																									addTableData2(queryDevicesTeamUrl, {'workshopId':workshopId,headNum:1})
																								}else{
																									swal({
																										title: '添加失败',
																										text: '请重新选择权限',
																										type: 'question',
																										allowEscapeKey: false, // 用户按esc键不退出
																										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																										showCancelButton: true, // 显示用户取消按钮
																										confirmButtonText: '确定',
																										cancelButtonText: '取消',
																									})
																								}
																							}
																						})
																		 			}
																				})

																		 	}
																		})
																	})
																})
															}
																break;
															case 5:
																currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																	let dataContent = event.currentTarget.dataset.toggleModalTarget || event.currentTarget.dataset.toggleBtn, // 按钮自带的data数据
																		staffId = ''

																	switch (dataContent) {
																		case '#productionLineDetailModal': {
																			let activeSwiperModel = $('#productionLineDetailModal'), // 右侧外部swiper
																				panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																				Modaltitle = activeSwiperModel.find('.modal-title'),
																				panelTbody = panel.find('table tbody'),	//面版表格tbody
																				paginationContainer = panel.find('.pagination'),		// 分页ul标签
																				workshopId = dataList[currentTr.index()].role_workshop_id,
																				HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																				IdList = [];
																				Modaltitle.html('添加工序')
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
																							panelTbody.empty()
																							paginationContainer.show()	//显示分页按钮
																							mesVerticalTableAddData(panel, {
																								thead: {
																									theadContent: '序号/工序名称/工序编号/操作',
																									theadWidth: '8%/30%/30%/20%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
																									],
																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.workstages, // 主要数据列表
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
																														tempData = dataList[currentTr.index()].workstage_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[currentTr.index()].workstage_number;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																															let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																															workstageIds = dataList[currentTr.index()].role_workshop_workstage_id
																																swal({
																																	title: '您确定要移除此条数据吗？',
																																	text: '删除后将无法查询',
																																	type: 'question',
																																	showCancelButton: true,
																																	confirmButtonText: '确定',
																																	cancelButtonText: '取消'
																																}).then(function () {
																																	$.ajax({
																																		url: removeWorkShopWorkstagesUrl,
																																		 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																		data: {
																																			'workstageIds':workstageIds
																																		},
																																		success: function (result) {
																																			if (result.status === 0) {
																																				addTableData2(queryWorkshopsUrl, {'type':'workstage','workshopId':workshopId,headNum:1})
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
																																					title: '移除失败',
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
																									displayRow: result.map.workstages.length // 显示行数
																								},
																								ajax: {
																									url: url,
																									data:data
																								}
																							})
																						}else if(result.status === 2){
																							IdList= []
																							panelTbody.empty().append(NO_DATA_NOTICE)
																							paginationContainer.hide()	//隐藏分页按钮
																						}else {
																							panelTbody.empty().append(NO_DATA_NOTICE)
																							paginationContainer.hide()	//隐藏分页按钮
																							mesloadBox.warningShow();
																						}
																					}
																				})
																				//获取全部已选择的人员
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: queryWorkshopsUrl,
																					data: {'type':'workstage','workshopId':workshopId},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							for(var i = 0; i < result.map.lines; i++){
																								IdList.push(result.map.workstages[i].workstage_basics_id)
																							}
																						}
																					}
																				})
																			}
																			addTableData2(queryWorkshopsUrl, {'type':'workstage','workshopId':workshopId,headNum:1})
																			//增加按钮事件
																			HearModelBtn1.off('click').on('click', (event) => {
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: queryWorkshopsUrl,
																					data:{'type':'workstage','workshopId':workshopId,headNum:1},
																					success: function (result, status, xhr) {
																						let promise = new Promise(function (resolve, reject) {
																							selectStaffAddData8(resolve, queryWorkstageBasicsUrl, {type: 'vague',	status:0, headNum: 1}, IdList)
																						}),
																						panelTbodyIndex = panelTbody.children('tr').length+1,
																						roleStaffId='',
																						workstageIds = [];
																						promise.then(function (resolveData) {
																							if (result.status === 0){
																								for(var i = 0; i < result.map.workstages.length; i++){
																									roleStaffId += result.map.workstages[i].workstage_basics_id == resolveData.roleStaffId
																								}
																							}
																							var key = roleStaffId.indexOf('true') == -1
																							if(!key){
																								swal({
																									title: '禁止选择重复权限',
																									type: 'warning',
																									timer: '1000',
																									allowEscapeKey: false, // 用户按esc键不退出
																									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																									showCancelButton: false, // 显示用户取消按钮
																									showConfirmButton: false, // 显示用户确认按钮
																								})
																							}else{
																								workstageIds.push(resolveData.roleStaffId)
																								$.ajax({
																									type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																									url: addWorkShopWorkstagesUrl,
																									data: {'workshopId':workshopId,'workstageIds':workstageIds.toString()},
																									success: function (result, status, xhr) {
																										if (result.status === 0) {
																											addTableData2(queryWorkshopsUrl, {'type':'workstage','workshopId':workshopId,headNum:1})
																										}else{
																											swal({
																												title: '增加失败',
																												text: '请确认无误后重新增加',
																												type: 'question',
																												allowEscapeKey: false, // 用户按esc键不退出
																												allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																												showCancelButton: true, // 显示用户取消按钮
																												confirmButtonText: '确定',
																												cancelButtonText: '取消',
																											})
																										}
																									}
																								})
																							}
																						})

																						}
																				})
																			})
																			break;
																		}
																		case '#submitModelModal': {

																			let dataContent = $('#submitModelModal'),
																				panel = dataContent.find('.panel'),
																				modalCloseBtn = dataContent.find('.modal-header').find('.close'),
																				modalSubmitBtn = dataContent.find('.modal-submit'),
																				// 表单要提交的数据
																				// submithData = null;
																				submithData = {
																					role_workshop_id: '',
																					role_workshop_name: '',
																					role_workshop_site: '',
																					role_workshop_principal: '',
																					role_workshop_maxtemperature: '',
																					role_workshop_mintemperature: '',
																					role_workshop_maxhumidity: '',
																					role_workshop_minhumidity: '',
																					role_workshop_describe: ''
																				};

																			 submithData.role_workshop_id = dataList[currentTr.index()].role_workshop_id;
																			// submithData.role_workshop_name = dataList[currentTr.index()].role_workshop_name;
																			// submithData.role_workshop_site = dataList[currentTr.index()].role_workshop_site;
																			// submithData.role_workshop_principal = dataList[currentTr.index()].role_workshop_principal;
																			// submithData.role_workshop_maxtemperature = dataList[currentTr.index()].role_workshop_maxtemperature;
																			// submithData.role_workshop_mintemperature = dataList[currentTr.index()].role_workshop_mintemperature;
																			// submithData.role_workshop_maxhumidity = dataList[currentTr.index()].role_workshop_maxhumidity;
																			// submithData.role_workshop_minhumidity = dataList[currentTr.index()].role_workshop_minhumidity;
																			// submithData.role_workshop_describe = dataList[currentTr.index()].role_workshop_describe;

																			// console.dir(submithData)
																			// modalSubmitBtn.attr('disabled', true)
																			panel.find('.panel-heading').find('.panel-title').text('修改车间') // 更换panel标题
																			mesHorizontalTableAddData(panel.find('table'), null, {
																				thead: '车间名称/负责人/温度上限(℃)/温度下限(℃)/湿度上限(%)/湿度下限(%)/车间地址/车间描述',
																				tableWitch: '20%/30%',
																				viewColGroup: 2,
																				importStaticData: (tbodyTd, length) => {
																					let inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;
																					let inputHtml2 = `<input type="number" type="text" class="table-input" placeholder="请输入" autocomplete="on"/>`;

																					for (let i = 0, len = length; i < len; i++)

																						switch (i) {
																							case 0: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_name)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									tempname = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")!=dataList[currentTr.index()].role_workshop_name
																									if(tempname){
																										submithData.role_workshop_name=tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																									}else{
																										submithData.role_workshop_name=''
																									}

																										//失去焦点时获取输入框的值
																								})

																								break;
																							}
																							case 1: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_principal)

																								tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
																									// 添加员工选择模态框
																									let promise = new Promise(function (resolve, reject) {
																										selectStaffAddData11(resolve, queryStaffUrl, { headNum: 1 })
																									});
																									promise.then(function (resolveData) {
																										tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
																										submithData.role_workshop_principal = resolveData.roleStaffName
																									})


																									$(this).prop('readonly', true) // 输入框只读
																									$(this).off('blur').on('blur', () => {
																										$(this).removeProp('readonly') // 输入移除框只读
																									})
																								})
																								// 添加到提交数据
																								// tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																								// 	submithData.role_workshop_principal = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								// 	console.log(submithData.role_workshop_principal)
																								// })

																							}
																								break;
																							case 2: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml2)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_maxtemperature)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.role_workshop_maxtemperature = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								})

																							}
																								break;
																							case 3: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml2)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_mintemperature)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.role_workshop_mintemperature = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								})

																							}
																								break;
																							case 4: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml2)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_maxhumidity)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.role_workshop_maxhumidity = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								})

																							}
																								break;
																							case 5: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml2)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_minhumidity)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.role_workshop_minhumidity = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								})

																							}
																								break;
																							case 6: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_site)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.role_workshop_site = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
																								})

																							}
																								break;
																							case 7: {
																								tbodyTd.eq(i).addClass('table-input-td')
																								tbodyTd.eq(i).html(inputHtml)
																								tbodyTd.eq(i).find('input').val(dataList[currentTr.index()].role_workshop_describe)

																								// 添加到提交数据
																								tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
																									submithData.role_workshop_describe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
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
																				if(!tempstatu){

																				}
																				if (
																					submithData.role_workshop_id !== ''
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
																							url: modifyWorkshopUrl,
																							data: {
																								"workshopId": submithData.role_workshop_id,
																								"workshopName": submithData.role_workshop_name,
																								"site": submithData.role_workshop_site,
																								"principal": submithData.role_workshop_principal,
																								"maxtemperature": submithData.role_workshop_maxtemperature,
																								"mintemperature": submithData.role_workshop_mintemperature,
																								"maxhumidity": submithData.role_workshop_maxhumidity,
																								"minhumidity": submithData.role_workshop_minhumidity,
																								"describe": submithData.role_workshop_describe
																							},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {

																									let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																									swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
																								}
																								else {
																									swallFail2(result.msg);	//操作失败
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
																				currentTrNntryID = dataList[currentTr.index()].role_workshop_id;
																			swal({
																				title: '您确定要删除此条数据吗？',
																				text: '删除后将无法查询',
																				type: 'question',
																				showCancelButton: true,
																				confirmButtonText: '确定',
																				cancelButtonText: '取消'
																			}).then(function () {
																				$.ajax({
																					url: removeWorkshopsUrl,
																					 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					data: { "type": "delete" ,"workshopId": currentTrNntryID },
																					success: function (result) {
																						if (result.status === 0) {
																							let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
																							swallSuccess(activePaginationBtn);	//操作成功提示并刷新页面
																						}
																						else {
																							swallFail();	// 提交失败，请重新提交提示
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
											displayRow: result.map.workshopInfos.length // 显示行数
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
					addTableData(queryWorkshopsUrl, {
						type: 'info',
						headNum: 1
					});
					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryWorkshopsUrl, {
								type: 'info',
								workshopName: val,
								headNum: 1
							});
						}
						else {
							addTableData(queryWorkshopsUrl, {
								type: 'info',
								headNum: 1
							});
							// 为空时重置搜索
							return;
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}
					});

					//新增车间按钮单击事件
					headmainbtn1.off('click').on('click', (event) => {

						let dataContent = $('#workshopModal'),
							panel = dataContent.find('.panel'),
							modalCloseBtn = dataContent.find('.modal-header').find('.close'),
							modalSubmitBtn = dataContent.find('.modal-submit'),
							// 表单要提交的数据
							submithData = {
								role_workshop_name: '',
								role_workshop_site: '',
								role_workshop_principal: '',
								role_workshop_maxtemperature: '',
								role_workshop_mintemperature: '',
								role_workshop_maxhumidity: '',
								role_workshop_minhumidity: '',
								role_workshop_describe: ''
							};

						panel.find('.panel-heading').find('.panel-title').text('新增车间') // 更换panel标题
						mesHorizontalTableAddData(panel.find('table'), null, {
							thead: '车间名称/负责人/温度上限(℃)/温度下限(℃)/湿度上限(%)/湿度下限(%)/车间地址/车间描述',
							tableWitch: '20%/30%',
							viewColGroup: 2,
							importStaticData: (tbodyTd, length) => {
								let inputHtml1 = `<input type="text" class="table-input" placeholder="请输入（必填）" autocomplete="on" />`,
								    inputHtml2 = `<input type="number" class="table-input" placeholder="请输入（必填）" autocomplete="on"  />`,
								    inputHtml = `<input type="text" class="table-input" placeholder="请输入" autocomplete="on" />`;

								for (let i = 0, len = length; i < len; i++)

									switch (i) {
										case 0: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml1)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.role_workshop_name = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})
											break;
										}
										case 1: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml1)
											tbodyTd.eq(i).find('input').off('focus').on('focus', function () {
												// 添加员工选择模态框
												let promise = new Promise(function (resolve, reject) {
													selectStaffAddData11(resolve, queryStaffUrl, { headNum: 1 })
												});
												promise.then(function (resolveData) {
													tbodyTd.eq(i).find('input').val(resolveData.roleStaffName)
													submithData.role_workshop_principal = resolveData.roleStaffName
												})


												$(this).prop('readonly', true) // 输入框只读
												$(this).off('blur').on('blur', () => {
													$(this).removeProp('readonly') // 输入移除框只读
												})
											})

											// tbodyTd.eq(i).find('input').off('blur').on('blur', function () {
											// 		submithData.role_workshop_principal =tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											// })

										}
											break;
										case 2: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml2)
											let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '请输入数字' });

												target.off('focus').on('focus', (event) => {
													mesPopover.show()
												})
											// tbodyTd.eq(i).find('input').keyup(function(){ //只能输入数字
											// 	var c=$(this);
											// 	if(/[^\d]/.test(c.val())){//替换非数字字符
											// 	  var temp_amount=c.val().replace(/[^\d]/g,'');
											// 	  $(this).val(temp_amount);
											// 	 }
											//  })
											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												mesPopover.hide();
												submithData.role_workshop_maxtemperature = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})

										}
											break;
										case 3: {
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml2)
												let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '请输入数字' });

												target.off('focus').on('focus', (event) => {
													mesPopover.show()
												})

												// tbodyTd.eq(i).find('input').keyup(function(){ //只能输入数字
												// 	var c=$(this);
												// 	if(/[^\d]/.test(c.val())){//替换非数字字符
												// 	  var temp_amount=c.val().replace(/[^\d]/g,'');
												// 	  $(this).val(temp_amount);
												// 	 }
												//  })

												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													submithData.role_workshop_mintemperature = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})

											}
											break;
										case 4: {
												tbodyTd.eq(i).addClass('table-input-td')
												tbodyTd.eq(i).html(inputHtml2)
												let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '请输入数字' });

												target.off('focus').on('focus', (event) => {
													mesPopover.show()
												})

												// tbodyTd.eq(i).find('input').keyup(function(){ //只能输入数字
												// 	var c=$(this);
												// 	if(/[^\d]/.test(c.val())){//替换非数字字符
												// 	  var temp_amount=c.val().replace(/[^\d]/g,'');
												// 	  $(this).val(temp_amount);
												// 	 }
												//  })
												// 添加到提交数据
												tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
													mesPopover.hide()
													submithData.role_workshop_maxhumidity = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
												})

											}
											break;
										case 5: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml2)
											let target = tbodyTd.eq(i).find('input'),
													mesPopover = new MesPopover(target, { content: '请输入数字' });

												target.off('focus').on('focus', (event) => {
													mesPopover.show()
												})

											// tbodyTd.eq(i).find('input').keyup(function(){ //只能输入数字
											// 	var c=$(this);
											// 	if(/[^\d]/.test(c.val())){//替换非数字字符
											// 	  var temp_amount=c.val().replace(/[^\d]/g,'');
											// 	  $(this).val(temp_amount);
											// 	 }
											//  })
											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												mesPopover.hide()
												submithData.role_workshop_minhumidity = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})

										}
											break;
										case 6: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.role_workshop_site = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})

										}
											break;
										case 7: {
											tbodyTd.eq(i).addClass('table-input-td')
											tbodyTd.eq(i).html(inputHtml)

											// 添加到提交数据
											tbodyTd.eq(i).find('input').off('blur').on('blur', (event) => {
												submithData.role_workshop_describe = tbodyTd.eq(i).find('input').val().replace(/\s/g, "")
											})

										}
											break;

										default:
											break;
									}

							}
						})
                        function swallError1() {

							swal({
								title: '温度和湿度不能有字符串!',
								text: '请检查必填字段数据是否完整或格式是否正确',
								type: 'warning',
								allowEscapeKey: false, // 用户按esc键不退出
								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
								showCancelButton: false, // 显示用户取消按钮
								confirmButtonText: '确定',
							})

						}
						// 提交数据按钮单击事件
						modalSubmitBtn.off('click').on('click', (event) => {
							// console.log(submithData)
                          if(submithData.role_workshop_name !== '' &&
							 submithData.role_workshop_principal !== '')
							{
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
										url: saveWorkshopsUrl,
										data: {
											"workshopName": submithData.role_workshop_name,
											"site": submithData.role_workshop_site,
											"principal": submithData.role_workshop_principal,
											"maxtemperature": submithData.role_workshop_maxtemperature,
											"mintemperature": submithData.role_workshop_mintemperature,
											"maxhumidity": submithData.role_workshop_maxhumidity,
											"minhumidity": submithData.role_workshop_minhumidity,
											"describe": submithData.role_workshop_describe
										},
										success: function (result, status, xhr) {

											if (result.status === 0) {

												let activePaginationBtn = activePanel.find('.panel-footer').find('.pagination').find('.pagesBtn ').filter('.active')
												swallSuccess(activePaginationBtn, modalCloseBtn)	//操作成功提示并刷新页面
											}
											else if (result.status === 1) {
												swallFail2(result.msg); //操作失败
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
			case '#processManage':	//工序管理内容区域
				(function () {
					let activeSwiper = $('#processManage'), // 右侧外部swiper
						activeSubSwiper = $('#processManageInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						panelTbody = activePanel.find('table tbody'),	//面版表格tbody
						paginationContainer = activePanel.find('.pagination'),		// 分页ul标签
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组

						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})

						// $('#right_wrapper').addClass('right-wrapper');
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
										paginationContainer.show()	//显示分页按钮
										mesVerticalTableAddData(activePanel, {
											thead: {
												theadContent: '序号/工序名/工序编号/职位配置/人员配置/设备配置/操作',
												theadWidth: '5%/15%/10%/10%/10%/10%/15%'
											},
											tbody: {
												html: [
													'<td></td>',
													'<td></td>',
													'<td></td>',
													'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#positionSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>职位配置</a></td>',
													'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#staffSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>人员配置</a></td>',
													'<td class="table-input-td"><a class="table-link" data-toggle-modal-target="#devicesSelectModal" href="javascript:void(0);"><i class="fa fa-tasks fa-fw"></i>设备配置</a></td>',
													'<td></td>'
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
														for (let j = 0, len = html.length; j < len; j++) {
															currentTr.append(html[j]); // 添加表格内的HTML
															switch (j) {
																case 0:
																	currentTr.children().eq(j).html(currentTr.index() + 1)
																	break;
																case 1: {
																	tempData = dataList[currentTr.index()].workstage_name;
																	currentTr.children().eq(j).html(tempData)
																	break;
																}
																case 2:{
																	tempData = dataList[currentTr.index()].workstage_number;
																	currentTr.children().eq(j).html(tempData)
																	break;
																}

																case 3: {
																	currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																		let activeSwiperModel = $('#positionSelectModal'), // 右侧外部swiper
																			panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																			panelTbody = panel.find('table tbody'),	//面版表格tbody
																			paginationContainer = panel.find('.pagination'),		// 分页ul标签
																			workstageId = dataList[currentTr.index()].workstage_basics_id,
																			HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																			IdList = [];
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
																						panelTbody.empty()
																						paginationContainer.show()	//显示分页按钮
																						mesVerticalTableAddData(panel, {
																							thead: {
																								theadContent: '序号/职位名称/职位说明/操作',
																								theadWidth: '8%/30%/30%/20%'
																							},
																							tbody: {
																								html: [
																									'<td></td>',
																									'<td></td>',
																									'<td></td>',
																									'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
																								],
																								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																								dataAddress: function (tbodyTarget, html, result) {
																									tbodyTarget.empty() // 清空表格主体
																									let map = result.map, // 映射
																										dataList = map.postStaff, // 主要数据列表
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
																													tempData = dataList[currentTr.index()].post.role_post_name;
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 2: {
																													tempData = dataList[currentTr.index()].post.role_post_detail;
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 3: {
																													currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																														let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																															postId = dataList[currentTr.index()].post.role_post_id

																															// console.log(detail)
																															swal({
																																title: '您确定要移除此条数据吗？',
																																text: '删除后将无法查询',
																																type: 'question',
																																showCancelButton: true,
																																confirmButtonText: '确定',
																																cancelButtonText: '取消'
																															}).then(function () {
																																$.ajax({
																																	url: removeTeamPostUrl,
																																	 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																	data: {
																																		'postId': postId,
																																		'workstageId':workstageId,

																																	},
																																	success: function (result) {
																																		if (result.status === 0) {
																																			addTableData2(queryTeamPostUrl, {'workstageId':workstageId,headNum:1})
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
																																				title: '移除失败',
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
																								displayRow: result.map.postStaff.length // 显示行数
																							},
																							ajax: {
																								url: url,
																								data:data
																							}
																						})
																					}else if(result.status === 2){
																						IdList= []
																						panelTbody.empty().append(NO_DATA_NOTICE)
																						paginationContainer.hide()	//隐藏分页按钮
																					}else {
																						panelTbody.empty().append(NO_DATA_NOTICE)
																						paginationContainer.hide()	//隐藏分页按钮
																						mesloadBox.warningShow();
																					}
																				}
																			})
																			//获取全部已选择的人员
																			$.ajax({
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				url: queryTeamPostUrl,
																				data: {'workstageId':workstageId},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						for(var i = 0; i < result.map.lines; i++){
																							IdList.push(result.map.postStaff[i].post.role_post_id)
																						}
																					}
																				}
																			})
																		}
																		addTableData2(queryTeamPostUrl, {'workstageId':workstageId,headNum:1})
																		//增加按钮事件
																		HearModelBtn1.off('click').on('click', (event) => {
																			$.ajax({
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				url: queryTeamPostUrl,
																				data:{'workstageId':workstageId,headNum: 1},
																				success: function (result, status, xhr) {
																					let promise = new Promise(function (resolve, reject) {
																						selectStaffAddData4(resolve, queryPostUrl, {type:'info',headNum: 1},IdList)
																					}),
																					panelTbodyIndex = panelTbody.children('tr').length+1,
																					roleStaffId='',
																					postIds = []
																					promise.then(function (resolveData) {
																						if (result.status === 0){
																							for(var i = 0; i < result.map.postStaff.length; i++){
																								roleStaffId += result.map.postStaff[i].post.role_post_id == resolveData.roleStaffId
																							}
																						}
																						var key = roleStaffId.indexOf('true') == -1
																						if(!key){
																							swal({
																								title: '禁止重复选择',
																								type: 'warning',
																								timer: '1000',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								showConfirmButton: false, // 显示用户确认按钮
																							})
																						}else{
																							postIds.push(resolveData.roleStaffId)
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: addPostUrl,
																								data: {'type':'workstage','workstageId':workstageId,'postIds':postIds.toString()},
																								success: function (result, status, xhr) {
																									if (result.status === 0) {
																										addTableData2(queryTeamPostUrl, {'workstageId':workstageId,headNum:1})
																									}
																									else{
																										swal({
																											title: '数据类型错误',
																											text: '请重新选择权限',
																											type: 'question',
																											allowEscapeKey: false, // 用户按esc键不退出
																											allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																											showCancelButton: true, // 显示用户取消按钮
																											confirmButtonText: '确定',
																											cancelButtonText: '取消',
																										})
																									}
																								}
																							})
																						 }
																					})

																				 }
																			})
																		})
																	})
																}
																	break;
																case 4: {
																	currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																		let activeSwiperModel = $('#staffSelectModal'), // 右侧外部swiper
																			panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																			panelTbody = panel.find('table tbody'),	//面版表格tbody
																			paginationContainer = panel.find('.pagination'),		// 分页ul标签
																			workstageId = dataList[currentTr.index()].workstage_basics_id,
																			HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																			judge = '',
																			IdList = [];
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
																							panelTbody.empty()
																							paginationContainer.show()	//显示分页按钮
																							mesVerticalTableAddData(panel, {
																								thead: {
																									theadContent: '序号/人员/职位/操作',
																									theadWidth: '8%/20%/20%/10%'
																								},
																								tbody: {
																									html: [
																										'<td></td>',
																										'<td></td>',
																										'<td></td>',
																										'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete"><i class="fa fa-trash-o fa-fw"></i>移除</a></td>'
																									],
																									// 添加表格主体数据, 这是一个回调函数,这里不需要传参
																									dataAddress: function (tbodyTarget, html, result) {
																										tbodyTarget.empty() // 清空表格主体
																										let map = result.map, // 映射
																											dataList = map.postStaff, // 主要数据列表
																											tempData = null; // 表格td内的临时数据
																											judge = dataList;
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
																														tempData =dataList[currentTr.index()].staff.role_staff_name
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 2: {
																														tempData = dataList[currentTr.index()].post.role_post_name;
																														currentTr.children().eq(j).html(tempData)
																													}
																														break;
																													case 3: {
																														currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																															let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																															staffId = dataList[currentTr.index()].staff.role_staff_id
																															swal({
																																title: '您确定要删除此条数据吗？',
																																text: '删除后将无法查询',
																																type: 'question',
																																showCancelButton: true,
																																confirmButtonText: '确定',
																																cancelButtonText: '取消'
																															}).then(function () {
																																$.ajax({
																																	url: removeTeamStaffUrl,
																																	 type: "POST",  dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																	data: {
																																		"staffId": staffId,
																																		'workstageId': workstageId
																																	},
																																	success: function (result) {
																																		if (result.status === 0) {
																																			addTableData2(queryTeamStaffUrl, {'workstageId':workstageId,headNum:1})
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
																									displayRow: result.map.postStaff.length // 显示行数
																								},
																								ajax: {
																									url: url,
																									data:data
																								}
																							})
																						}else if(result.status === 2){
																							judge = '';
																							IdList= [];
																							panelTbody.empty().append(NO_DATA_NOTICE2)
																							paginationContainer.hide()	//隐藏分页按钮
																						}
																						else {
																							panelTbody.empty().append(NO_DATA_NOTICE)
																							paginationContainer.hide()	//隐藏分页按钮
																							mesloadBox.warningShow();
																						}
																					}
																				})
																				//获取全部已选择的人员
																				$.ajax({
																					type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																					url: queryTeamStaffUrl,
																					data: {'workstageId':workstageId},
																					success: function (result, status, xhr) {
																						if (result.status === 0) {
																							for(var i = 0; i < result.map.lines; i++){
																								IdList.push(result.map.postStaff[i].staff.role_staff_id)
																							}
																						}
																					}
																				})
																			}
																			addTableData2(queryTeamStaffUrl, {'workstageId':workstageId,headNum:1})

																			HearModelBtn1.off('click').on('click',function (event) {
																				let promise = new Promise(function (resolve, reject) {
																					selectStaffAddData5(resolve, queryStaffUrl, IdList, queryTeamPostUrl, {'workstageId':workstageId,headNum:1})
																				}),
																				roleStaffId=''
																				promise.then(function (resolveData) {
																					var staffIds = resolveData.roleStaffId,
																						postId = resolveData.postId
																						$.ajax({
																							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																							url: addStaffUrl,
																							data: {'type':'workstage','workstageId':workstageId,'postId':postId,'staffIds':staffIds},
																							success: function (result, status, xhr) {
																								if (result.status === 0) {
																									addTableData2(queryTeamStaffUrl, {'workstageId':workstageId,headNum:1})
																								}else{
																									swal({
																										title: '添加数据失败',
																										text: '请重新添加',
																										type: 'question',
																										allowEscapeKey: false, // 用户按esc键不退出
																										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																										showCancelButton: true, // 显示用户取消按钮
																										confirmButtonText: '确定',
																										cancelButtonText: '取消',
																									})
																								}
																							}
																						})
																				})
																			})
																	})
																}
																	break;
																case 5: {
																	currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																		let activeSwiperModel = $('#devicesSelectModal'), // 右侧外部swiper
																			panel =activeSwiperModel.find('.panel'),  // 右侧内部swiper
																			panelTbody = panel.find('table tbody'),	//面版表格tbody
																			paginationContainer = panel.find('.pagination'),		// 分页ul标签
																			workstageId = dataList[currentTr.index()].workstage_basics_id,
																			HearModelBtn1 = activeSwiperModel.find('.panel-heading').find('.head-main-btn-1'),
																			IdList=[];
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
																						panelTbody.empty()
																						paginationContainer.show()	//显示分页按钮
																						mesVerticalTableAddData(panel, {
																							thead: {
																								theadContent: '序号/设备名称/编号/操作',
																								theadWidth: '8%/30%/30%/20%'
																							},
																							tbody: {
																								html: [
																									'<td></td>',
																									'<td></td>',
																									'<td></td>',
																									'<td class="table-input-td"><a class="table-link text-danger" href="javascript:;" data-toggle-btn="delete">移除</a></td>'
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
																													tempData = dataList[currentTr.index()].devices.devices_control_devices_name;
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 2: {
																													tempData = dataList[currentTr.index()].devices.devices_control_devices_number;
																													currentTr.children().eq(j).html(tempData)
																												}
																													break;
																												case 3: {
																													currentTr.children().eq(j).off('click').on('click', 'a', (event) => {
																														let currentDeleteTr = event.currentTarget.closest('tr'), // 当前行
																															devicesId = dataList[currentTr.index()].devices.devices_control_devices_id
																															swal({
																																title: '您确定要移除此条数据吗？',
																																text: '删除后将无法查询',
																																type: 'question',
																																showCancelButton: true,
																																confirmButtonText: '确定',
																																cancelButtonText: '取消'
																															}).then(function () {
																																$.ajax({
																																	url: removeTeamDevicesUrl,
																																	 type: "POST",  dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																																	data: {
																																		'devicesId':devicesId,
																																		'workstageId': workstageId
																																	},
																																	success: function (result) {
																																		if (result.status === 0) {
																																			addTableData2(queryDevicesTeamUrl, {'workstageId':workstageId,headNum:1})
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
																																				title: '移除失败',
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
																								data:data
																							}
																						})
																					}else if(result.status === 2){
																						IdList= []
																						panelTbody.empty().append(NO_DATA_NOTICE)
																						paginationContainer.hide()	//隐藏分页按钮
																					}else {
																						panelTbody.empty().append(NO_DATA_NOTICE)
																						paginationContainer.hide()	//隐藏分页按钮
																						mesloadBox.warningShow();
																					}
																				}
																			})

																			//获取全部已选择的人员
																			$.ajax({
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				url: queryDevicesTeamUrl,
																				data: {'workstageId':workstageId},
																				success: function (result, status, xhr) {
																					if (result.status === 0) {
																						for(var i = 0; i < result.map.lines; i++){
																							IdList.push(result.map.devices[i].devices.devices_control_devices_id)
																						}
																					}
																				}
																			})
																		}
																		addTableData2(queryDevicesTeamUrl, {'workstageId':workstageId,headNum:1})
																		//增加按钮事件
																		HearModelBtn1.off('click').on('click', (event) => {
																			$.ajax({
																				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																				url: queryDevicesTeamUrl,
																				data:{'workstageId':workstageId,headNum:1},
																				success: function (result, status, xhr) {
																					let promise = new Promise(function (resolve, reject) {
																						selectStaffAddData3(resolve, queryDevicesUrl, {'type':'all',headNum: 1 }, IdList)
																					}),
																					panelTbodyIndex = panelTbody.children('tr').length+1,
																					roleStaffId='',
																					devicesIds = []
																					promise.then(function (resolveData) {
																						if (result.status === 0){
																							for(var i = 0; i < result.map.devices.length; i++){
																								roleStaffId += result.map.devices[i].devices.devices_control_devices_id == resolveData.roleStaffId
																							}
																						}
																						var key = roleStaffId.indexOf('true') == -1
																						if(!key){
																							swal({
																								title: '禁止重复选择',
																								type: 'warning',
																								timer: '1000',
																								allowEscapeKey: false, // 用户按esc键不退出
																								allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																								showCancelButton: false, // 显示用户取消按钮
																								showConfirmButton: false, // 显示用户确认按钮
																							})
																						}else{
																							devicesIds.push(resolveData.roleStaffId)
																							$.ajax({
																								type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
																								url: addTeamDevicesUrl,
																								data: {'workstageId':workstageId,'devicesIds':devicesIds.toString()},
																								success: function (result, status, xhr) {
																									if (result.status === 0) {
																										addTableData2(queryDevicesTeamUrl, {'workstageId':workstageId,headNum:1})
																									}else{
																										swal({
																											title: '添加失败',
																											text: '请重新选择权限',
																											type: 'question',
																											allowEscapeKey: false, // 用户按esc键不退出
																											allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
																											showCancelButton: true, // 显示用户取消按钮
																											confirmButtonText: '确定',
																											cancelButtonText: '取消',
																										})
																									}
																								}
																							})
																						}
																					})

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

					//导航栏点击时运行数据加载
					addTableData(queryWorkstageBasicsUrl, {
						type: 'vague',
						status:0,
						headNum: 1
					});

					// 模糊搜索组加载数据
					fuzzySearchGroup.find('.btn').off('click').on('click', function (event) {
						let val = $(this).closest('.input-group').find('input').val().replace(/\s/g, "");
						event.stopPropagation() // 禁止向上冒泡
						if (val !== '') {
							addTableData(queryWorkstageBasicsUrl, {
								type: 'vague',
								keyword: val,
								status:0,
								headNum: 1
							});
						}
						else {
							addTableData(queryWorkstageBasicsUrl, {
								type: 'vague',
								status:0,
								headNum: 1
							});
							// 为空时重置搜索
							return;
						}
						//清空搜索框并获取焦点
						$(this).closest('.input-group').find('input').focus().val('')
					});

					// 模糊搜索回车搜索
					fuzzySearchGroup.find('input').off('keydown').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
							// $(this).closest('.input-group').find('input').val('')
						}
					});


				}())
				break;
			case '#personageMange':	//用户信息修改
				(function () {
					let activeSwiper = $('#personageMange'), // 右侧外部swiper
						activeSubSwiper = $('#personageMangeInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						panelSubmit = activeSubSwiper.find('.panel-footer .panel-submit'), //提交按钮
						oldPasswordInput = $('#oldPassword'),
						newPasswordInput = $('#newPassword'),
						checkPasswordINput = $('#checkPassword'),
						oldPassword = '',
						newPassword = '',
						checkPassword = '',

						currentloadBox = new MesPopover(checkPasswordINput, { content: '两次密码输入不一致,请重新输入' }),
						oldPasswordInputloadBox = new MesPopover(oldPasswordInput, { themesName: 'primary', content: '请正确输入您当前使用的密码' }),
						newPasswordInputloadBox = new MesPopover(newPasswordInput, { themesName: 'primary', content: '大小写字母、数字组成的6-16位字符,不能纯数字或纯字母' }),
						checkPasswordINputloadBox = new MesPopover(checkPasswordINput, { themesName: 'primary', content: '请重复输入密码' })

						// $('#right_wrapper').addClass('right-wrapper');
					panelSubmit.attr('disabled', true)

					//旧密码输入框获取焦点事件
					oldPasswordInput.focus(function () {
						oldPasswordInputloadBox.show()
						newPasswordInputloadBox.hide()
						checkPasswordINputloadBox.hide()
					})

					//新密码输入框获取焦点事件
					newPasswordInput.focus(function () {
						newPasswordInputloadBox.show()
						checkPasswordINputloadBox.hide()
						oldPasswordInputloadBox.hide()
					})

					//确认密码输入框获取焦点事件
					checkPasswordINput.focus(function () {
						checkPasswordINputloadBox.show()
						oldPasswordInputloadBox.hide()
						newPasswordInputloadBox.hide()
					})

					//旧密码输入框失去焦点事件
					oldPasswordInput.blur(function () {
						oldPasswordInputloadBox.hide()
						oldPassword = $(this).val().replace(/\s/g, "")
						if (oldPassword !== '' && oldPassword !== null &&
							newPassword !== '' && newPassword !== null &&
							checkPassword !== '' && checkPassword !== null) {
							panelSubmit.attr('disabled', false)
						}
					})
					//新密码输入框失去焦点事件
					newPasswordInput.blur(function () {
						newPasswordInputloadBox.hide()
						newPassword = $(this).val().replace(/\s/g, "")

						if (oldPassword !== '' && oldPassword !== null &&
							newPassword !== '' && newPassword !== null &&
							checkPassword !== '' && checkPassword !== null) {

							if (!PASSWORD_REG.test(newPassword)) {
								oldPasswordInputloadBox.show()
							}

							if (newPassword !== checkPassword) {
								currentloadBox.show()
								panelSubmit.attr('disabled', true)
							} else {
								currentloadBox.hide()
								panelSubmit.attr('disabled', false)
							}
						}

					})

					//确认密码输入框失去焦点事件
					checkPasswordINput.blur(function () {

						checkPasswordINputloadBox.hide()
						checkPassword = $(this).val().replace(/\s/g, "");
                        //  console.log(oldPassword)

						if (oldPassword !== '' && oldPassword !== null &&
							newPassword !== '' && newPassword !== null &&
							checkPassword !== '' && checkPassword !== null) {
							// panelSubmit.attr('disabled', false)

							if (newPassword !== checkPassword) {
								console.log(11)
								currentloadBox.show()
								panelSubmit.attr('disabled', true)
							} else {
								currentloadBox.hide()
								panelSubmit.attr('disabled', false)
							}
						}

					})

					//提交按钮事件
					panelSubmit.off('click').on('click', function (event) {
						$.ajax({
							 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: modifyUserPasswordUrl,
							data: { 'userId':USERID, 'oldPassword': oldPassword, 'newPassword': newPassword, 'checkPassword': checkPassword },
							success: function (result, status, xhr) {
								if (result.status === 0) {
									swal({
										title: '操作成功',
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
												leftNavLink.eq(9).trigger('click'); // 刷新当前页
											}
										})
								} else {
									swallFail();	//操作失败
								}
							}
						})


						// fetch(modifyUserPasswordUrl, {
						// 	method: 'post',
						// 	body: formData
						// });

						// $.ajax({
						// 	 type: "POST",  dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
						// 	url: modifyUserPasswordUrl,
						// 	data: formData,
						// 	processData: false,  //必须false才会避开jQuery对 formdata 的默认处理
						// 	contentType: false,  //必须false才会自动加上正确的Content-Type
						// 	success: function (result, status, xhr) {
						// 		if (result.status === 0) {

						// 		} else {
						// 			swallFail();	//操作失败
						// 		}
						// 	}
						// })
					})



				}())
				break;
			case '#userLoginRecord':	//登录记录
				(function () {
					let activeSwiper = $('#userLoginRecord'), // 右侧外部swiper
						activeSubSwiper = $('#userLoginRecordInerSwiper'), // 右侧内部swiper
						activePanel = activeSubSwiper.find('.panel'), // 内部swiper的面板
						activePanelHeading = activePanel.find('.panel-heading'), // 面板头部
						fuzzySearchGroup = activePanelHeading.find('.fuzzy-search-group'), // 模糊搜索组
						mesloadBox = new MesloadBox(activePanel, {
							// 主数据载入窗口
							warningContent: '没有此类信息，请重新选择或输入'
						})
						// $('#right_wrapper').addClass('right-wrapper');
						console.log($('.swiper-wrapper'))
					function addTableData(url, data) {
						$.ajax({
							type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
							url: url,
							data: data,
							dataType: "json",
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
											theadContent: '序号/登录时间/登录IP',
											theadWidth: '5%/45%/45%'
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
													dataList = map.records, // 主要数据列表
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
																tempData = dataList[currentTr.index()].role_user_loginRecord_time;
																currentTr.children().eq(j).html(moment(tempData).format('YYYY-MM-DD HH:mm:ss'))
															}
																break;
															case 2: {
																tempData = dataList[currentTr.index()].role_user_loginRecord_IP;
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
											totalRow: result.map.recordsLine, // 总行数
											displayRow: result.map.records.length // 显示行数
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
					addTableData(queryUserLoginRecordUrl, {
						userId: USERID,
						headNum: 1
					});



				}())
				break;
			case '#documentHelp':	//帮助手册
				(function () {
					console.log('documentHelp')
					let downloadDocumentHelp = $('#downloadDocumentHelp'); // 帮助文档下载按钮
					// $('#right_wrapper').removeClass('right-wrapper');
					downloadDocumentHelp.click(function () { //为下载按钮绑定单击事件

						console.log('start')
						var form = $("<form>");//定义一个form表单
						form.attr("style", "display:none");
						form.attr("target", "");
						form.attr("method", "post");
						form.attr("action", BASE_PATH + "/downloadManual.do");
						var input1 = $("<input>");
						input1.attr("type", "hidden");
						input1.attr("name", "exportData");
						input1.attr("value", (new Date()).getMilliseconds());
						$("body").append(form);//将表单放置在web中
						form.append(input1);
						form.submit();//表单提交
						console.log('end')
					});

				}())
				break;
			case '#aboutUs':	//关于我们
			// $('#right_wrapper').addClass('right-wrapper');
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
	function selectStaffAddData11(resolve, url, data) {
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
	function selectStaffAddData(resolve, url, data,postGrade) {   // 职位管理新增职位选上级时
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
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
		fuzzySearchGroup.hide()

		// 修改标题
		modalTitle.html('上级')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/职位名称',
								theadWidth: '20%/30%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>'
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.post, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												roleStaffId: dataList[currentTr.index()].role_post_id,
												roleStaffName: dataList[currentTr.index()].role_post_name,
												roleStaffgrade: dataList[currentTr.index()].role_post_grade
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
													tempData = dataList[currentTr.index()].role_post_name;
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
								displayRow: result.map.post.length // 显示行数
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
		console.log(postGrade)
		addTableData(queryPostUrl,{
			type:'up',
			postGrade:postGrade,
			headNum: 1
		});
	}

	function selectStaffAddData2(resolve, url, data, list) {  // 职位管理查看添加权限
		let selectStaffModal = $(document.getElementById('publicSelectModalBox2')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索菜单
			modalTitle = selectStaffModal.find('.modal-title'),
			modalSubmitBtn = selectStaffModal.find('.modal-footer').find('.modal-submit'),
			roleStaffIdList = [],
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

			fuzzySearchGroup.show()
		// 修改标题
		modalTitle.html('权限管理')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/权限名称/状态',
								theadWidth: '10%/30%/8%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td><input type="checkbox"></td>'
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.functions, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										for(let h = 0, len = roleStaffIdList.length; h < len; h++){ //重复给颜色
											if(dataList[currentTr.index()].role_function_id == roleStaffIdList[h]){
												currentTr.addClass('bg-success')
											}
										}
										currentTr.off('click').on('click', (event) => {
											if(!currentTr.hasClass('bg-success2')){ //重复给颜色
												currentTr.toggleClass('bg-success')
											}
											if(currentTr.hasClass('bg-success')){ //有颜色的获取id
												roleStaffIdList.push(dataList[currentTr.index()].role_function_id)
												currentTr.find('input').prop('checked',true)
											}else{
												currentTr.find('input').prop('checked',false)
												traverseListDelete(roleStaffIdList,dataList[currentTr.index()].role_function_id)
											}
										})
										for(let h = 0, len = list.length; h < len; h++){ //重复给颜色
											if(dataList[currentTr.index()].role_function_id == list[h]){
												currentTr.addClass('bg-success2')
											}
										}
										if(!currentTr.hasClass('bg-success2')){
											currentTr.css('cursor','pointer')
										}
										$('.bg-success').find('input').prop('checked',true)
										$('.bg-success2').find('input').prop('checked',true) //重复给选中
										$('.bg-success2').find('input').prop('disabled',true)//重复给禁用
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = dataList[currentTr.index()].name;
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
								displayRow: result.map.functions.length // 显示行数
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
		addTableData(url,data);
		modalSubmitBtn.off('click').on('click',function (event) {
			swal({
				title: '您确定要添加这些数据吗？',
				text: '请确认数据无误',
				type: 'question',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(function () {
				selectStaffModal.modal('hide')
				resolve({
					roleStaffId: roleStaffIdList.toString()
				})
			})
		})
		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				addTableData(url, {
					functionName: val,
					headNum: 1
				})
			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
				}
			});
		}
		fuzzySearchFunc(fuzzySearchGroup, url, data)
	}
	function selectStaffAddData3(resolve, url, data, list) {      // 产线、车间、工序增加设备
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索组
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})
			fuzzySearchGroup.show()

		// 修改标题
		modalTitle.html('设备管理')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/设备名称/编号/状态',
								theadWidth: '20%/30%/30%/8%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td><input type="checkbox"></td>'
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
												roleStaffId: dataList[currentTr.index()].devices_control_devices_id,
												roleStaffName: dataList[currentTr.index()].devices_control_devices_name
											})
										})
										for(let h = 0, len = list.length; h < len; h++){ //重复给颜色
											if(dataList[currentTr.index()].devices_control_devices_id == list[h]){
												currentTr.addClass('bg-success')
											}
										}
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = dataList[currentTr.index()].devices_control_devices_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].devices_control_devices_number;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												default:
													break;
											}
										}
										$('.bg-success').find('input').prop('checked',true) //重复给选中
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
		addTableData(url,data);

		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				addTableData(url, {
					type: 'key',
					keyWord: val,

					headNum: 1
				})

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
				}
			});
		}
		fuzzySearchFunc(fuzzySearchGroup, url, data)
	}
	function selectStaffAddData4(resolve, url, data, list) {         // 产线、车间、工序增加职位
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索组
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

			fuzzySearchGroup.show()
		// 修改标题
		modalTitle.html('职位')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/职位名称/上级/职位说明/状态',
								theadWidth: '8%/20%/20%/20%/8%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td><input type="checkbox"></td>'
								],

								// 添加表格主体数据, 这是一个回调函数,这里不需要传参
								dataAddress: function (tbodyTarget, html, result) {
									tbodyTarget.empty() // 清空表格主体
									let map = result.map, // 映射
										dataList = map.post, // 主要数据列表
										tempData = null; // 表格td内的临时数据

									for (let i = 0, len = dataList.length; i < len; i++) {
										tbodyTarget.append('<tr></tr>'); // 添加行
										let currentTr = tbodyTarget.children('tr').eq(i); // 循环到的当前行
										for(let h = 0, len = list.length; h < len; h++){ //重复给颜色
											if(dataList[currentTr.index()].role_post_id == list[h]){
												currentTr.addClass('bg-success')
											}
										}
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												roleStaffId: dataList[currentTr.index()].role_post_id,
												roleStaffName: dataList[currentTr.index()].role_post_name
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
													tempData = dataList[currentTr.index()].role_post_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()].role_post_leader_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 3: {
													tempData = dataList[currentTr.index()].role_post_detail;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 4: {
												}
													break;
												default:
													break;
											}
										}
										$('.bg-success').find('input').prop('checked',true) //重复给选中
									}
								}
							},

							pagination: {
								totalRow: result.map.lines, // 总行数
								displayRow: result.map.post.length // 显示行数
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
		addTableData(url,data);

		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				addTableData(url, {
					type:'info',
					postName:val,
					headNum: 1
				})

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
				}
			});
		}
		fuzzySearchFunc(fuzzySearchGroup, url, data)
	}
	function selectStaffAddData5(resolve, url, list, url2, data2) {     // 产线、车间增加人员时选择职位
		let selectStaffModal = $(document.getElementById('publicSelectModalBox3')), // 模态框
		staffListPanel = selectStaffModal.find('.panel'), // 面板
		targetTable = staffListPanel.find('table'),
		panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
		paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
		modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
		modalTitle = selectStaffModal.find('.modal-title'),
		fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索组
		SelectBtn1 = staffListPanel.find('.devices-type-option1'), // 下拉框
		modalSubmitBtn = selectStaffModal.find('.modal-footer').find('.modal-submit'),
		roleStaffIdList = [],
		postId = '',
		mesloadBox = new MesloadBox(staffListPanel, {
			// 主数据载入窗口
			warningContent: '没有此类信息，请重新选择或输入'
		})
		panelTbody.html(NO_DATA_NOTICE2)
		paginationContainer.hide()	//隐藏分页按钮
		fuzzySearchGroup.show()
		// 修改标题
		modalTitle.html('职位')
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
							paginationContainer.show()	//显示分页按钮
							mesVerticalTableAddData(staffListPanel, {
								thead: {
									theadContent: '序号/员工名称/职位名称/选择',
									theadWidth: '10%/20%/20%/8%'
								},
								tbody: {
									html: [
										'<td></td>',
										'<td></td>',
										'<td></td>',
										'<td><input type="checkbox"></td>'
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

											for(let h = 0, len = roleStaffIdList.length; h < len; h++){ //重复给颜色
												if(dataList[currentTr.index()].role_staff_id == roleStaffIdList[h]){
													currentTr.addClass('bg-success')
												}
											}
											currentTr.off('click').on('click', (event) => {
												if(!currentTr.hasClass('bg-success2')){ //重复给颜色
													currentTr.toggleClass('bg-success')
												}
												if(currentTr.hasClass('bg-success')){ //有颜色的获取id
													roleStaffIdList.push(dataList[currentTr.index()].role_staff_id)
													currentTr.find('input').prop('checked',true)
												}else{
													if(!currentTr.hasClass('bg-success2')){
														currentTr.find('input').prop('checked',false)
													}
													traverseListDelete(roleStaffIdList,dataList[currentTr.index()].role_staff_id)
												}
											})
											for(let h = 0, len = list.length; h < len; h++){ //重复给颜色
												if(dataList[currentTr.index()].role_staff_id == list[h]){
													currentTr.addClass('bg-success2')
												}
											}
											if(!currentTr.hasClass('bg-success2')){
												currentTr.css('cursor','pointer')
											}
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
														tempData = dataList[currentTr.index()].post;
														currentTr.children().eq(i).html(tempData)
													}
														break;
													default:
														break;
												}
											}
											$('.bg-success').find('input').prop('checked',true)
											$('.bg-success2').find('input').prop('checked',true) //重复给选中
											$('.bg-success2').find('input').prop('disabled',true)//重复给禁用
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


			$.ajax({
				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
				url: url2,
				data: data2,
				beforeSend: function (xml) {
					// ajax发送前
					mesloadBox.loadingShow()
				},
				success: function (result, status, xhr) {
					// ajax成功
					mesloadBox.hide()
					if (result.status === 0) {
						SelectBtn1.empty()
						SelectBtn1.append('<option value="">请选择职位</option>')
						for (let i = 0, len = result.map.postStaff.length; i < len; i++) {
							let optionHtml = `<option value="${result.map.postStaff[i].post.role_post_id}">${result.map.postStaff[i].post.role_post_name}</option>`;
							SelectBtn1.append(optionHtml);
						}
						SelectBtn1.on('change', (event) => {
							postId = SelectBtn1.val()
							if(postId == ''){
								panelTbody.html(NO_DATA_NOTICE2)
								paginationContainer.hide()	//显示分页按钮
							}else{
								addTableData(url,{'type':'other', 'postId':postId, headNum: 1});
							}
						})
					}else{
						SelectBtn1.html('<option value="">请选择职位</option>')
						mesloadBox.warningShow();
					}
				}
			})
			modalSubmitBtn.off('click').on('click',function (event) {
				if(roleStaffIdList.length && postId !== ''){
					swal({
						title: '确定添加这几条数据吗？',
						text: '请确认好数据无误再添加',
						type: 'question',
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(function() {
						swallSuccess2(selectStaffModal)
						selectStaffModal.modal('hide')
						resolve({
							roleStaffId: roleStaffIdList.toString(),
							postId : postId
						})
					})
				}else{
					swal({
						title: '请同时选择职位和员工？',
						text: '没有职位返回职位配置添加',
						type: 'question',
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
				}
			})

			// 模糊搜索组加载数据
			function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {

					fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
						if(postId == ''){
						}else{
							let val = $(this).closest('.input-group').find('input').val();
							event.stopPropagation() // 禁止向上冒泡
							addTableData(url, {
								'type':'other',
								staffName: val,
								postId: postId,
								headNum: 1
							})
						}
					});

					// 模糊搜索回车搜索
					fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
						if (event.keyCode === 13) {
							event.preventDefault()
							$(this).closest('.input-group').find('button').trigger('click')
						}
					});
			}
			fuzzySearchFunc(fuzzySearchGroup, url, {'type':'other', 'postId':postId, headNum: 1})
	}
	function selectStaffAddData7(resolve, url, data, list) {            // 产线增加车间（产线和车间关系操作）
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索组
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})

			fuzzySearchGroup.show()
		// 修改标题
		modalTitle.html('车间管理')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/车间名称/车间地址/状态',
								theadWidth: '20%/30%/30%/8%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td><input type="checkbox"></td>'
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
												roleStaffId: dataList[currentTr.index()].role_workshop_id,
												roleStaffName: dataList[currentTr.index()].role_workshop_name
											})
										})
										for(let h = 0, len = list.length; h < len; h++){ //重复给颜色
											if(dataList[currentTr.index()].role_workshop_id == list[h]){
												currentTr.addClass('bg-success')
											}
										}
										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
													break;
												case 1: {
													tempData = dataList[currentTr.index()].role_workshop_name;
													currentTr.children().eq(i).html(tempData)
												}
													break;
												case 2: {
													tempData = dataList[currentTr.index()];
													currentTr.children().eq(i).html(tempData)
												}
													break;
												default:
													break;
											}
										}
										$('.bg-success').find('input').prop('checked',true) //重复给选中
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
						panelTbody.empty().append(NO_DATA_NOTICE)
						paginationContainer.hide()	//隐藏分页按钮
						mesloadBox.warningShow();
					}
				}
			})
		}
		addTableData(url,data);
		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				addTableData(url, {
					type: 'info',
					workshopName: val,
					headNum: 1
				})

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
				}
			});
		}
		fuzzySearchFunc(fuzzySearchGroup, url, data)
	}
	function selectStaffAddData8(resolve, url, data, list) {            // 车间添加工序
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索组
			modalTitle = selectStaffModal.find('.modal-header').find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})
			fuzzySearchGroup.show()
		// 修改标题
		modalTitle.html('工序管理')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/工序名称/工序编号/状态',
								theadWidth: '20%/30%/30%/8%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>',
									'<td></td>',
									'<td><input type="checkbox"></td>'
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
										currentTr.off('click').on('click', (event) => {
											selectStaffModal.modal('hide')
											resolve({
												roleStaffId: dataList[currentTr.index()].workstage_basics_id,
												roleStaffName: dataList[currentTr.index()].workstage_name
											})
										})
										for(let h = 0, len = list.length; h < len; h++){ //重复给颜色
											if(dataList[currentTr.index()].workstage_basics_id == list[h]){
												currentTr.addClass('bg-success')
											}
										}


										// 										type:vague
// keyword:1
// status:0
// headNum:1

										for (let i = 0, len = html.length; i < len; i++) {
											currentTr.append(html[i]); // 添加表格内的HTML
											switch (i) {
												case 0: {
													currentTr.children().eq(i).html(currentTr.index() + 1)
												}
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
												default:
													break;
											}
										}
										$('.bg-success').find('input').prop('checked',true) //重复给选中
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
		addTableData(url,data);
		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				addTableData(url, {
					type: 'vague',
					keyword: val,
					status:0,
					headNum: 1
				})

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
				}
			});
		}
		fuzzySearchFunc(fuzzySearchGroup, url, data)
	}
	function selectStaffAddData9(resolve, url, data) {            // 班次添加人员
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			panelFoot = staffListPanel.find('.panel-footer'),
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索组
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})
			fuzzySearchGroup.show()

		// 修改标题
		modalTitle.html('班次员工管理')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/员工名称',
								theadWidth: '20%/30%'
							},
							tbody: {
								html: [
									'<td></td>',
									'<td></td>'
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
		addTableData(url,data);
		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				addTableData(url, {
					type: 'noClass',
					staffName: val,
					headNum: 1
				})

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
				}
			});
		}
		fuzzySearchFunc(fuzzySearchGroup, url, data)
	}
	function selectStaffAddData10(resolve, url, data) {            // 班次更换班次
		let selectStaffModal = $(document.getElementById('publicSelectModalBox')), // 模态框
			staffListPanel = selectStaffModal.find('.panel'), // 面板
			targetTable = staffListPanel.find('table'),
			panelTbody = staffListPanel.find('table tbody'),	//面版表格tbody
			paginationContainer = staffListPanel.find('.pagination'),		// 分页ul标签
			modalCloseBtn = selectStaffModal.find('.modal-header').find('.close'),
			fuzzySearchGroup = staffListPanel.find('.fuzzy-search-group'), // 模糊搜索组
			modalTitle = selectStaffModal.find('.modal-title'),
			mesloadBox = new MesloadBox(staffListPanel, {
				// 主数据载入窗口
				warningContent: '没有此类信息，请重新选择或输入'
			})
			fuzzySearchGroup.show()

		// 修改标题
		modalTitle.html('班次管理')

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
						paginationContainer.show()	//显示分页按钮
						mesVerticalTableAddData(staffListPanel, {
							thead: {
								theadContent: '序号/班次名称',
								theadWidth: '20%/30%%'
							},
							tbody: {
								html: [
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
											selectStaffModal.modal('hide')
											resolve({
												roleStaffId: dataList[currentTr.index()].role_class_id,
												roleStaffName: dataList[currentTr.index()].role_class_name
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
													tempData = dataList[currentTr.index()].role_class_name;
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
								displayRow: result.map.classes.length // 显示行数
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
		addTableData(url,data);
		// 模糊搜索组加载数据
		function fuzzySearchFunc(fuzzySearchGroupTarget, url, data) {
			fuzzySearchGroupTarget.find('.btn').off('click').on('click', function (event) {
				let val = $(this).closest('.input-group').find('input').val();
				event.stopPropagation() // 禁止向上冒泡
				addTableData(queryClassesUrl, {
					type:'info',
					className:val,
					headNum: 1
				});

			});

			// 模糊搜索回车搜索
			fuzzySearchGroupTarget.find('input').off('click').on('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault()
					$(this).closest('.input-group').find('button').trigger('click')
				}
			});
		}
		fuzzySearchFunc(fuzzySearchGroup, url, data)
	}

	function isPoneAvailable($poneInput) {   //手机号码是否正确
		var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
		if (!myreg.test($poneInput)) {
			return false;
		} else {
			return true;
		}
	}








})

