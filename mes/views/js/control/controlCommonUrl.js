//工艺段基础信息管理
const  queryProductTypeUrl = BASE_PATH + '/' + 'queryProductType.do'  // 查询产品类型
const  saveProductTypesUrl = BASE_PATH + '/' + 'saveProductType.do'  // 添加产品类型
const  modifyProductTypeStatusUrl = BASE_PATH + '/' + 'modifyProductTypeStatus.do'  // 修改产品类型状态
const  saveProductModelsUrl = BASE_PATH + '/' + 'saveProductModel.do'  // 添加产品模型
const  queryProductModelUrl = BASE_PATH + '/' + 'queryProductModel.do'  // 查看产品模型
const  modifyProductModelStatusUrl = BASE_PATH + '/' + 'modifyProductModelStatus.do'  // 修改产品模型状态
const  queryProductTypeAboutModelUrl = BASE_PATH + '/' + 'queryProductTypeAboutModel.do'  // 查询产品类型所对应的产品型号
// 工艺基础信息
const  queryCraftBasicsUrl = BASE_PATH + '/' + 'queryCraftBasics.do'//查询工艺基础信息
const  saveCraftBasicsUrl = BASE_PATH + '/' + 'saveCraftBasics.do'  //添加工艺基础信息
const  modifyCraftBasicsStatusUrl = BASE_PATH + '/' + 'modifyCraftBasicsStatus.do' //修改工艺基础信息状态
// 工艺段基础信息
const  queryCraftSegmentBasicsUrl = BASE_PATH + '/' + 'queryCraftSegmentBasics.do'//查询工艺段基础信息
const  saveCraftSegmentBasicsUrl = BASE_PATH + '/' + 'saveCraftSegmentBasics.do'  //添加工艺段基础信息
const  modifyCraftSegmentBasicsStatusUrl = BASE_PATH + '/' + 'modifyCraftSegmentBasicsStatus.do' //修改工艺段基础信息状态
// 工序基础信息
const  queryWorkstageBasicsUrl = BASE_PATH + '/' + 'queryWorkstageBasics.do'//查询工序基础信息
const  saveWorkstageBasicsUrl = BASE_PATH + '/' + 'saveWorkstageBasics.do'  //添加工序基础信息
const  modifyWorkstageBasicsStatusUrl = BASE_PATH + '/' + 'modifyWorkstageBasicsStatus.do' //修改工序基础信息状态
// 工序参数管理
const  queryWorkstageParameterUrl = BASE_PATH + '/' + 'queryWorkstageParameter.do'//查询工序参数信息
const  saveWorkstageParameterUrl = BASE_PATH + '/' + 'saveWorkstageParameter.do'  //添加工序参数信息
const  modifyWorkstageParameterStatusUrl = BASE_PATH + '/' + 'modifyWorkstageParameterStatus.do' //修改工序参数信息状态
// 工步基础消息
const  queryStepBasicsUrl = BASE_PATH + '/' + 'queryStepBasics.do'//查询工步基础信息
const  saveStepBasicsUrl = BASE_PATH + '/' + 'saveStepBasics.do'  //添加工步基础信息
const  modifyStepBasicsStatusUrl = BASE_PATH + '/' + 'modifyStepBasicsStatus.do' //修改工步信息状态
// 标准参数管理
const  saveNormParameterUrl = BASE_PATH + '/' + 'saveNormParameter.do'//添加标准参数
const  queryNormParameterUrl = BASE_PATH + '/' + 'queryNormParameter.do'//查询标准参数
const  modifyNormParameterStatusUrl = BASE_PATH + '/' + 'modifyNormParameterStatus.do'//修改参数状态
const  saveParameterTypeUrl = BASE_PATH + '/' + 'saveParameterType.do'//添加参数类别
const  queryParameterTypeUrl = BASE_PATH + '/' + 'queryParameterType.do'//获取参数类别
const  modifyParameterTypeStatusUrl = BASE_PATH + '/' + 'modifyParameterTypeStatus.do'//修改参数类别状态
const  maintainTypeUseParameterUrl = BASE_PATH + '/' + 'maintainTypeUseParameter.do'//添加参数与参数类别的关系

// 半成品基础信息
const querySemiFinishedProductTypeUrl = BASE_PATH + '/' + 'querySemiFinishedProductType.do'// 查询半成品类型
const querySemiFinishedProductTypeAboutModelUrl = BASE_PATH + '/' + 'querySemiFinishedProductTypeAboutModel.do'// 查询半成品品型号
// 工步管理
const queryStepOutlineUrl = BASE_PATH + '/' + 'queryStepOutline.do' // 查询所有工步信息
const queryStepParticularsUrl = BASE_PATH + '/' + 'queryStepParticulars.do' // 查询所有工步详情
const queryStepVersionsUrl = BASE_PATH + '/' + 'queryStepVersions.do' // 查询所有工步版本信息
const modifyStepVersionsStatusUrl = BASE_PATH + '/' + 'modifyStepVersionsStatus.do' // 根据工步版本id（集合）修改该工步版本状态
const querySemiFinishedProductModelAboutParameterUrl = BASE_PATH + '/' + 'querySemiFinishedProductModelAboutParameter.do' // 查询半成品型号及所对应的半成品参数
const saveStepUrl = BASE_PATH + '/' + 'saveStep.do' // 保存新增工步数据
// 工序管理
const queryWorkstageOutlineUrl = BASE_PATH + '/' + 'queryWorkstageOutline.do' // 查询所有工序信息
const queryWorkstageParticularsUrl = BASE_PATH + '/' + 'queryWorkstageParticulars.do' // 查询所对应的工序详情
const modifyWorkstageVersionsStatusUrl = BASE_PATH + '/' + 'modifyWorkstageVersionsStatus.do' // 根据工序版本id（集合）修改该工序版本状态
const queryWorkstageVersionsUrl = BASE_PATH + '/' + 'queryWorkstageVersions.do' // 查询工序历史版本或查询用户输入的版本号是否重复
const saveWorkstageUrl = BASE_PATH + '/' + 'saveWorkstage.do' // 新增工序
const downloadFileUrl = BASE_PATH + '/' + 'downloadFile.do' // 查看图片