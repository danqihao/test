/**受保护资源项目路径**/

// var BASE_PATH = "http://localhost/mes";
var BASE_PATH = "http://www.imes-inc.ser:6789/mes";
// var BASE_PATH = "http://192.168.1.104:80/mes";
// var BASE_PATH = "http://192.168.1.94/mes";
//var BASE_PATH = "http://192.168.1.236/mes";
// $(document).ready(function () {

// 	var cook = $.cookie('userName'); //get from cookie if exists

// 	if (cook)
// 		alert(cook);
// 	$('#but').click(function () {
// 		var userName = $('#content').val();
// 		alert(userName);
// 		$.cookie.raw = true;
// 		$.cookie('userName', userName, { expires: 7, path: '/' }); //set the cookie
// 		alert("Cookie done");
// 	});
// });

/**所有权限列表**/
var functionsList;
var functionsList2
var functionsSet = null;

/**用户权限列表**/
var userFunctionsList;
var userFunctionsSet = null;



/**从cookie里获取用户ID**/
// var USERID = $.cookie("JSESSIONID")
var USERNAME = $.cookie("userName")
var USERID = $.cookie("ID")
var USERNAME2 = getCookie("userName")
var creator = decodeURIComponent(USERNAME) //创建人
// console.log(USERNAME) //中文转码
// console.log(decodeURIComponent('USERNAME')) //中文转码
// console.log(USERID)
$('#showUserName').html(decodeURIComponent(USERNAME))
// console.log(document.cookie)

/**没有数据提示 **/
var NO_DATA_NOTICE = `<tr><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>`;

/**没有职位提示 **/
var NO_DATA_NOTICE2 = `<tr><td colspan=15 class="text-center text-warning">请先选择一个职位</td></tr>`;

/**日期提示 **/
var NO_DATA_NOTICE3 = `<tr><td colspan=15 class="text-center text-warning">请先选择一个日期</td></tr>`;

/**提示框全局对象**/
// var mesPopover = new MesPopover($('body'), { content: '' });

/**正则表达,支持中文、字母、数字、下划线组合，1-16位字符**/
var USERNAME_REG1 = /^([\w]|[\u4e00-\u9fa5]){1,16}$/;

/**正则表达,支持中文、字母、数字、下划线组合，3-16位字符**/
var USERNAME_REG2 = /^([\w]|[\u4e00-\u9fa5]){3,16}$/;

/**正则表达式，支持大小写字母、数字组成的6-16位字符,不能纯数字或字母**/
var PASSWORD_REG = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

/**IP验证正则表达式，xxx.xxx.xxx.xxx **/
var IP_REG = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

/**正则表达,数字验证**/
var NUMBER_REG = /^[0-9]*$/;

/**正则表达,数字验证**/
var NUMBER_REG3 = /^[A-Za-z0-9]{6,16}$/;

/**正则表达,数字验证**/
var NUMBER_email = /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/


/**正则表达,电话号码验证**/
var NUMBER_Phone =/^\d{11}$/;

/**项目URL**/
//   公共URL
var queryCategoryUrl = BASE_PATH + '/' + "queryCategory.do", // 获取部门、物料、设备下拉数据
	queryStaffUrl = BASE_PATH + '/' + "queryStaff.do", // 查询员工
	queryPlanBatchsURl = BASE_PATH + '/' + 'queryPlanBatchs.do', // 查询生产计划批次
	queryDevicesStatusURl = BASE_PATH + '/' + 'queryDevicesStatus.do', // 获取设备状况
	queryIPCAllURl = BASE_PATH + '/' + 'queryIPCAll.do', // 获取设备状况
	queryWorkOrderOutlineURl = BASE_PATH + '/' + 'queryWorkOrderOutline.do', // 获取工单摘要
	queryMaterialsUrl = BASE_PATH + '/' + 'queryMaterials.do', // 获取物料

	// 产线URL
	queryProductLinesUrl = BASE_PATH + '/' + "queryProductLines.do", // 查询产线列表
	saveProductLinesUrl = BASE_PATH + '/' + "saveProductLines.do",// 新增产线
	modifyProductLinesUrl = BASE_PATH + '/' + "modifyProductLines.do", // 修改产线
	removeProductLinesUrl = BASE_PATH + '/' + "removeProductLines.do", // 删除产线
	addWorkshopsUrl = BASE_PATH + '/' + "addWorkshops.do"; // 产线增加车间（产线和车间关系操作）

// 车间URL
queryWorkshopsUrl = BASE_PATH + '/' + 'queryWorkShopInfos.do', // 查询生产车间
	saveWorkshopsUrl = BASE_PATH + '/' + 'saveWorkshops.do', // 增加生产车间
	modifyWorkshopUrl = BASE_PATH + '/' + 'modifyWorkshop.do', // 修改生产车间
	removeWorkshopsUrl = BASE_PATH + '/' + 'removeWorkshop.do', // 删除生产车间
	addDevicesUrl = BASE_PATH + '/' + "addDevices.do"; // 车间增加设备（车间和设备关系操作）

// 设备URL
queryDevicesUrl = BASE_PATH + '/' + 'queryDevices.do', // 查询设备信息，
	saveDevicesLedgerInfoUrl = BASE_PATH + '/' + 'saveDevicesLedgerInfo.do', // 增加设备信息
	modifyDevicesLedgerInfoUrl = BASE_PATH + '/' + 'modifyDevicesLedgerInfo.do', // 修改设备信息
	modifyDevicesNumberButtonUrl = BASE_PATH + '/' + 'modifyDevicesNumberButton.do', // 修改设备信息
	removeDevicesLedgerInfoUrl = BASE_PATH + '/' + 'removeDevicesLedgerInfo.do', // 删除设备信息
	exportExcelDevicesInfoUrl = BASE_PATH + '/' + 'exportExcelDevicesInfo.do', // 导出Excel

	// 设备类型URL
	queryDevicesTypesUrl = BASE_PATH + '/' + 'queryDevicesTypes.do', // 查询设备类型
	saveDevicesTypeInfoUrl = BASE_PATH + '/' + 'saveDevicesTypeInfo.do', // 增加设备类型
	modifyDevicesInfoUrl = BASE_PATH + '/' + 'modifyDevicesInfo.do', // 修改设备类型
	removeDevicesInfoUrl = BASE_PATH + '/' + 'removeDevicesInfo.do', // 删除设备类型

	// 设备状况URL
	gatherParametersUrl = BASE_PATH + '/' + 'gatherParameters.do', // 保存设备实时采集的参数
	getDeviceParametersUrl = BASE_PATH + '/' + 'getDeviceParameters.do', // 获取设备实时采集的参数
	getHistoryParametersUrl = BASE_PATH + '/' + 'getHistoryParameters.do', // 设备历史参数
	queryPerHistoryParametersUrl = BASE_PATH + '/' + 'queryPerHistoryParameters.do', // 导出历史参数Excel表格

	// 设备点检URL
	saveDevicesCheckUrl = BASE_PATH + '/' + 'saveDevicesCheck.do', // 增加点检表
	queryCheckPlanUrl = BASE_PATH + '/' + 'queryCheckPlan.do', // 查询点检表
	modifyCheckStatusUrl = BASE_PATH + '/' + 'modifyCheckStatus.do', // 修改点检状态

	// 设备点检异常URL
	saveDevicesExceptionUrl = BASE_PATH + '/' + 'saveDevicesException.do', // 增加点检异常记录
	modifyDevicesExceptionUrl = BASE_PATH + '/' + 'modifyDevicesException.do', // 修改点检异常记录

	// 设备点检项目URL
	saveDevicesEntrysUrl = BASE_PATH + '/' + 'saveDevicesEntrys.do', // 增加点检项目记录
	modifyDevicesEntryUrl = BASE_PATH + '/' + 'modifyDevicesEntry.do', // 修改点检项目记录

	// 设备保养
	queryUpkeepPlansUrl = BASE_PATH + '/' + 'queryUpkeepPlans.do', // 查询保养计划、项目、执行记录、变更记录
	saveUpkeepPlanUrl = BASE_PATH + '/' + 'saveUpkeepPlan.do', // 新建保养计划
	saveUpkeepProjectUrl = BASE_PATH + '/' + 'saveUpkeepProject.do', // 新建保养项目
	saveUpkeepEnterUrl = BASE_PATH + '/' + 'saveUpkeepEnter.do', // 新建保养计划记录
	saveUpkeepChangeUrl = BASE_PATH + '/' + 'saveUpkeepChange.do', // 新建保养计划变更
	modifyUpkeepEnterUrl = BASE_PATH + '/' + 'modifyUpkeepEnter.do', // 修改保养执行计划记录
	modifyUpkeepChangesUrl = BASE_PATH + '/' + 'modifyUpkeepChanges.do', // 修改保养计划变更记录
	modifyUpkeepProjectUrl = BASE_PATH + '/' + 'modifyUpkeepProject.do', // 修改保养项目
	modifyUpkeepStatustUrl = BASE_PATH + '/' + 'modifyUpkeepStatus.do', // 修改保养状态

	// 设备故障
	queryDevicesMalfunctionUrl = BASE_PATH + '/' + 'queryDevicesMalfunction.do', // 根据故障（设备名）关键字查询故障设备
	saveMalfunctionRecordInfoUrl = BASE_PATH + '/' + 'saveMalfunctionRecordInfo.do', // 新增故障设备记录
	modifyMalfunctionRecordInfoUrl = BASE_PATH + '/' + 'modifyMalfunctionRecordInfo.do', // 更新故障设备记录
	removeMalfunctionRecordInfoUrl = BASE_PATH + '/' + 'removeMalfunctionRecordInfo.do', //  删除故障设备记录




	//工艺段基础信息管理
	queryProductTypeUrl = BASE_PATH + '/' + 'queryProductType.do',  // 查询产品类型
	saveProductTypesUrl = BASE_PATH + '/' + 'saveProductType.do',  // 添加产品类型
	modifyProductTypeStatusUrl = BASE_PATH + '/' + 'modifyProductTypeStatus.do',  // 修改产品类型状态
	saveProductModelsUrl = BASE_PATH + '/' + 'saveProductModel.do',  // 添加产品模型
	queryProductModelUrl = BASE_PATH + '/' + 'queryProductModel.do',  // 查看产品模型
	modifyProductModelStatusUrl = BASE_PATH + '/' + 'modifyProductModelStatus.do',  // 修改产品模型状态
	queryProductTypeAboutModelUrl = BASE_PATH + '/' + 'queryProductTypeAboutModel.do',  // 查询产品类型所对应的产品型号
	// 工艺基础信息
	queryCraftBasicsUrl = BASE_PATH + '/' + 'queryCraftBasics.do',//查询工艺基础信息
	saveCraftBasicsUrl = BASE_PATH + '/' + 'saveCraftBasics.do',  //添加工艺基础信息
	modifyCraftBasicsStatusUrl = BASE_PATH + '/' + 'modifyCraftBasicsStatus.do', //修改工艺基础信息状态
	// 工艺段基础信息
	queryCraftSegmentBasicsUrl = BASE_PATH + '/' + 'queryCraftSegmentBasics.do',//查询工艺段基础信息
	saveCraftSegmentBasicsUrl = BASE_PATH + '/' + 'saveCraftSegmentBasics.do',  //添加工艺段基础信息
	modifyCraftSegmentBasicsStatusUrl = BASE_PATH + '/' + 'modifyCraftSegmentBasicsStatus.do', //修改工艺段基础信息状态
	// 工序基础信息
	queryWorkstageBasicsUrl = BASE_PATH + '/' + 'queryWorkstageBasics.do',//查询工序基础信息
	saveWorkstageBasicsUrl = BASE_PATH + '/' + 'saveWorkstageBasics.do',  //添加工序基础信息
	modifyWorkstageBasicsStatusUrl = BASE_PATH + '/' + 'modifyWorkstageBasicsStatus.do', //修改工序基础信息状态
	// 工序参数管理
	queryWorkstageParameterUrl = BASE_PATH + '/' + 'queryWorkstageParameter.do',//查询工序参数信息
	saveWorkstageParameterUrl = BASE_PATH + '/' + 'saveWorkstageParameter.do',  //添加工序参数信息
	modifyWorkstageParameterStatusUrl = BASE_PATH + '/' + 'modifyWorkstageParameterStatus.do', //修改工序参数信息状态
	// 工步基础消息
	queryStepBasicsUrl = BASE_PATH + '/' + 'queryStepBasics.do',//查询工步基础信息
	saveStepBasicsUrl = BASE_PATH + '/' + 'saveStepBasics.do',  //添加工步基础信息
	modifyStepBasicsStatusUrl = BASE_PATH + '/' + 'modifyStepBasicsStatus.do', //修改工步信息状态
	// 标准参数管理
	saveNormParameterUrl = BASE_PATH + '/' + 'saveNormParameter.do',//添加标准参数
	queryNormParameterUrl = BASE_PATH + '/' + 'queryNormParameter.do',//查询标准参数
	modifyNormParameterStatusUrl = BASE_PATH + '/' + 'modifyNormParameterStatus.do',//修改参数状态
	saveParameterTypeUrl = BASE_PATH + '/' + 'saveParameterType.do',//添加参数类别
	queryParameterTypeUrl = BASE_PATH + '/' + 'queryParameterType.do',//获取参数类别
	modifyParameterTypeStatusUrl = BASE_PATH + '/' + 'modifyParameterTypeStatus.do',//修改参数类别状态
	maintainTypeUseParameterUrl = BASE_PATH + '/' + 'maintainTypeUseParameter.do',//添加参数与参数类别的关系


	// 获取极性信息
	queryPolarityUrl = BASE_PATH + '/' + 'queryPolarity.do', // 获取极性信息


	// 半成品参数管理
	querySemiFinishedProductParameterUrl = BASE_PATH + '/' + 'querySemiFinishedProductParameter.do',//查询半成品参数信息
	saveSemiFinishedProductParameterUrl = BASE_PATH + '/' + 'saveSemiFinishedProductParameter.do',  //添加半成品参数信息
	modifySemiFinishedProductParameterStatusUrl = BASE_PATH + '/' + 'modifySemiFinishedProductParameterStatus.do', //修改半成品参数信息状态
	//半成品信息管理
	querySemiFinishedProductTypeUrl = BASE_PATH + '/' + 'querySemiFinishedProductType.do',  // 查询半成品类型
	saveSemiFinishedProductTypeUrl = BASE_PATH + '/' + 'saveSemiFinishedProductType.do',  // 添加半成品类型
	modifySemiFinishedProductTypeStatusUrl = BASE_PATH + '/' + 'modifySemiFinishedProductTypeStatus.do',  // 修改半成品类型状态
	saveSemiFinishedProductModelUrl = BASE_PATH + '/' + 'saveSemiFinishedProductModel.do',  // 添加半成品
	querySemiFinishedProductModelUrl = BASE_PATH + '/' + 'querySemiFinishedProductModel.do',  // 查询半成品
	modifySemiFinishedProductModelStatusUrl = BASE_PATH + '/' + 'modifySemiFinishedProductModelStatus.do',  // 修改半成品型号状态
	querySemiFinishedProductTypeAboutModelUrl = BASE_PATH + '/' + 'querySemiFinishedProductTypeAboutModel.do',  // 查询产品类型所对应的产品型号

	// 工步与工步参数维护功能
	maintainStepBasicsAboutParameterUrl = BASE_PATH + '/' + 'maintainStepBasicsAboutParameter.do',  // 添加工序-工序参数的对应关系
	queryStepBasicsAboutParameterUrl = BASE_PATH + '/' + 'queryStepBasicsAboutParameter.do',  // 根据工序id查询工序及所对应的工序参数、使用状态等信息
	modifyWorkstageAboutParameterUrl = BASE_PATH + '/' + 'modifyWorkstageAboutParameter.do',  // 修改工序-工序参数的对应关系

	// 半成品与半成品参数维护功能
	maintainSemiFinishedProductModelAboutParameterUrl = BASE_PATH + '/' + 'maintainSemiFinishedProductModelAboutParameter.do',  // 添加半成品--半成品参数的对应关系
	querySemiFinishedProductModelAboutParameterUrl = BASE_PATH + '/' + 'querySemiFinishedProductModelAboutParameter.do',  // 根据半成品id查询半成品及所对应的工序参数、使用状态等信息
	modifySemiFinishedProductModelAboutParameterUrl = BASE_PATH + '/' + 'modifySemiFinishedProductModelAboutParameter.do',  // 修改半成品-半成品参数的对应关系


	// 工艺管理(9)
	queryCraftBOMUrl = BASE_PATH + '/' + 'queryCraftBOM.do',  // 获取指定工艺版-本下所有的物料信息，如查询出来的物料有相同（id）则去重，但对应的物料数量累加
	exportCraftInstructorUrl = BASE_PATH + '/' + 'exportCraftInstructor.do',  // 导出工艺指导书，获取工艺下的所有数据详情，导出至Excel表格
	saveCraftUrl = BASE_PATH + '/' + 'saveCraft.do',  // 保存新增工艺数据
	queryCraftParticularsUrl = BASE_PATH + '/' + 'queryCraftParticulars.do',  // 根据工艺版本id（集合）查询出对应的工艺详情
	queryCraftOutlineUrl = BASE_PATH + '/' + 'queryCraftOutline.do',  //查询所有工艺信息（检索条件：产品类型、产线、工艺名称&工艺编号、使用状态、分页）
	modifyCraftVersionsStatusUrl = BASE_PATH + '/' + 'modifyCraftVersionsStatus.do',  //根据工艺版本id(集合)修改该工艺版本的使用状态
	queryCraftVersionsUrl = BASE_PATH + '/' + 'queryCraftVersions.do',  //
	queryCraftBOMParticularsUrl = BASE_PATH + '/' + 'queryCraftBOMParticulars.do',  //
	saveCraftBOMUrl = BASE_PATH + '/' + '	saveCraftBOM.do',  //
	modifyCraftBOMStatusUrl  = BASE_PATH + '/' + '	modifyCraftBOMStatus.do',  //

	//工艺段管理
	queryCraftSegmentOutlineUrl = BASE_PATH + '/' + 'queryCraftSegmentOutline.do',  //查询所有工艺信息（检索条件：产品类型、产线、工艺名称&工艺编号、使用状态、分页）
	queryCraftSegmentParticularsUrl = BASE_PATH + '/' + 'queryCraftSegmentParticulars.do',  // 根据工艺段版本id（集合）查询出对应的工艺详情
	modifyCraftSegmentVersionsStatusUrl = BASE_PATH + '/' + 'modifyCraftSegmentVersionsStatus.do',  //根据工艺段版本id(集合)修改该工艺版本的使用状态
	saveCraftSegmentUrl = BASE_PATH + '/' + 'saveCraftSegment.do',  // 保存新增工艺段数据
	queryCraftSegmentVersionsUrl = BASE_PATH + '/' + 'queryCraftSegmentVersions.do',  //

	//工序管理 单位管理(8个)
	queryWorkstageOutlineUrl = BASE_PATH + '/' + 'queryWorkstageOutline.do',  //查询所有工艺信息（检索条件：产品类型、产线、工艺名称&工艺编号、使用状态、分页）
	saveStandardParameterUnitUrl = BASE_PATH + '/' + 'saveStandardParameterUnit.do',  //新增单位
	queryStandardParameterUnitsUrl = BASE_PATH + '/' + 'queryStandardParameterUnits.do',  //查询单位
	modifyStandardParameterUnitStatusUrl = BASE_PATH + '/' + 'modifyStandardParameterUnitStatus.do',  //改变状态
	queryParameterUnitsUrl = BASE_PATH + '/' + 'queryParameterUnits.do',  //查看单位根据 id
	maintainStandardParameterAndUnitsUrl = BASE_PATH + '/' + 'maintainStandardParameterAndUnits.do',  //编辑单位
	queryCraftUseMaterialMenuUrl = BASE_PATH + '/' + 'queryCraftUseMaterialMenu.do',  //获取物料信息
	queryMaterialToSupplierUrl = BASE_PATH + '/' + 'queryMaterialToSupplier.do',  //获取供应商信息




	//系统管理-修改用户密码
	modifyUserPasswordUrl = BASE_PATH + '/' + 'modifyUserPassword.do', // 修改用户密码
	queryUserFunctionsUrl = BASE_PATH + '/' + 'queryUserFunctions.do', // 用户登录后查询对应的权限
	saveUserUrl = BASE_PATH + '/' + 'saveUser.do', // 增加用户
	removeUsersUrl = BASE_PATH + '/' + 'removeUsers.do', // 删除用户

	//系统管理-员工管理
	queryUserLoginRecordUrl = BASE_PATH + '/' + 'queryUserLoginRecord.do', //查询员工记录
	queryStaffUrl = BASE_PATH + '/' + 'queryStaff.do', //查询员工记录
	saveStaffUrl = BASE_PATH + '/' + 'saveStaff.do', // 添加员工记录
	modifyStaffUrl = BASE_PATH + '/' + 'modifyStaff.do', // 更改员工记录
	removeStaffUrl = BASE_PATH + '/' + 'removeStaff.do', // 删除员工记录

	//系统管理-职位管理
	queryPostUrl = BASE_PATH + '/' + 'queryPost.do', //查询职位或职位员工信息
	savePostUrl = BASE_PATH + '/' + 'savePost.do', //添加职位
	modifyPostUrl = BASE_PATH + '/' + 'modifyPost.do', //添加职位
	queryPostUrl = BASE_PATH + '/' + 'queryPost.do', //查询职位或职位员工信息
	removePostUrl = BASE_PATH + '/' + 'removePost.do', //删除职位


	addFunctionsUrl = BASE_PATH + '/' + 'addFunctions.do', //添加权限
	addPostUrl = BASE_PATH + '/' + 'addPost.do', //产线、车间、工艺段、工艺添分配职位

	//系统管理-权限
	queryFunctionUrl = BASE_PATH + '/' + 'queryFunction.do', //查询权限基础信息或职位的权限
	saveFunctionUrl = BASE_PATH + '/' + 'saveFunction.do', //添加权限
	removeFunctionUrl = BASE_PATH + '/' + 'removeFunction.do', //删除权限
	modifyFunctionUrl = BASE_PATH + '/' + 'modifyFunction.do', //修改权限

	//系统管理-分配
	addPostUrl = BASE_PATH + '/' + 'addPost.do',  //产线、车间、工艺段、工艺添分配职位
	queryDevicesTeamUrl = BASE_PATH + '/' + 'queryDevicesTeam.do',  //产线、车间、工艺段、工艺添查询设备
	addTeamDevicesUrl = BASE_PATH + '/' + 'addTeamDevices.do',   //产线、车间、工艺段、工艺添查询设备
	queryTeamStaffUrl = BASE_PATH + '/' + 'queryTeamStaff.do',   //产线、车间、工序搜索员工和相应的职位
	queryTeamPostUrl = BASE_PATH + '/' + 'queryTeamPost.do',   // 产线、车间、工序搜索职位
	addStaffUrl = BASE_PATH + '/' + 'addStaff.do',   //产线、车间、工艺段、工艺添分配职位
	removeTeamPostUrl = BASE_PATH + '/' + 'removeTeamPost.do',  //删除产线、车间、工序下的职位
	removeTeamDevicesUrl = BASE_PATH + '/' + 'removeTeamDevices.do',  //查询权限基础信息或职位的权限
	removeTeamStaffUrl = BASE_PATH + '/' + 'removeTeamStaff.do',  //删除产线、车间、工序下的员工
	addWorkShopWorkstagesUrl = BASE_PATH + '/' + 'addWorkShopWorkstages.do',  //删除产线、车间、工序下的员工

	//系统管理-班次
	queryClassesUrl = BASE_PATH + '/' + 'queryClasses.do',  //查询班次信息或班次员工
	saveClassesUrl = BASE_PATH + '/' + 'saveClasses.do',  //新增班次
	modifyClassesUrl = BASE_PATH + '/' + 'modifyClasses.do',  //修改班次
	removeClassesUrl = BASE_PATH + '/' + 'removeClasses.do',  //删除班次信息
	removeClassStaffUrl = BASE_PATH + '/' + 'removeClassStaff.do',  //删除班次员工表数据
	saveClassStaffUrl = BASE_PATH + '/' + 'saveClassStaff.do',  //新增班次员工表数据
	changeClassStaffUrl = BASE_PATH + '/' + 'changeClassStaff.do',  //更改班次员工表数据

	end = 'hello';
















// 模拟用户权限列表集合
var devices_functionList = [
	'accessDevicesPage',	//进入设备管控页面

	'devicesStatus',	//设备状况
	'devicesLedger',	//设备台账
	'checkPlan',	//设备点检
	'upkeepPlan',	//维护保养
	'devicesFault',	//故障记录

	'devicesHistoryStatus',	//历史参数
	'devicesTypeManage',	//设备类型管理
	'saveDevices',	//新增
	'editDevices',	//编辑
	'deleteDevices',	//删除
	'checkPlanRecord',	//点检记录
	'saveCheckPlan',	//新建点检
	'saveCheckPlanRecord',	//保养记录
	'saveUpkeepPlan',	//新建保养
	'checkPlanProjectManage',	//保养指导书管理
	'saveDevicesFault',	//新增记录
	'moreDevicesFault',	//查看更多
	'editDevicesFault',	//修改
	'deleteDevicesFault',	//删除

	// 'saveDevicesType',	//新增类型
	'checkPlanDetail',	//详情
	'checkPlanAudit',	//审核
	'checkPlanExcute',	//执行
	'upkeepPlanDetail',	//详情
	'upkeepPlanAudit',	//审核
	'upkeepPlanExcute',	//执行
	'saveCheckPlanProject',	//新建
	'editCheckPlanProject',	//修改
];

// 模拟用户权限列表集合
var devices_use = [
	'accessDevicesPage',	//进入设备管控页面

	'devicesStatus',	//设备状况
	'devicesLedger',	//设备台账
	'checkPlan',	//设备点检
	'upkeepPlan',	//维护保养
	'devicesFault',	//故障记录

	'devicesHistoryStatus',	//历史参数
	// 'devicesTypeManage',	//设备类型管理
	// 'saveDevices',	//新增
	// 'editDevices',	//编辑
	// 'deleteDevices',	//删除
	'checkPlanRecord',	//点检记录
	// 'saveCheckPlan',	//新建点检
	'saveCheckPlanRecord',	//保养记录
	// 'saveUpkeepPlan',	//新建保养
	// 'checkPlanProjectManage',	//保养指导书管理
	'saveDevicesFault',	//新增记录
	'moreDevicesFault',	//查看更多
	'editDevicesFault',	//修改
	'deleteDevicesFault',	//删除

	'saveDevicesType',	//新增类型
	'checkPlanDetail',	//详情
	// 'checkPlanAudit',	//审核
	'checkPlanExcute',	//执行
	'upkeepPlanDetail',	//详情
	// 'upkeepPlanAudit',	//审核
	'upkeepPlanExcute',	//执行
	'saveCheckPlanProject',	//新建
	'editCheckPlanProject',	//修改
];


// functionsSet = new Set(devices_functionList)
// userFunctionsSet = new Set(devices_use)


function getCookie(name) {
	// console.log(document.cookie)
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var cookieStr = cookie.split("=");
		if (cookieStr && cookieStr[0].trim() == name) {
			return decodeURIComponent(cookieStr[1]);
		}
	}

}

