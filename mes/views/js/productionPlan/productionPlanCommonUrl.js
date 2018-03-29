// ## 生产计划管理

// ### 新建生产计划
// 查询生产计划类型
const queryPlanTypeUrl = BASE_PATH + '/' + 'queryPlanType.do'
// 查询生产优先级
const queryPlanPriorityUrl = BASE_PATH + '/' + 'queryPlanPriority.do'
// 根据字符串生成二维码
const createQRCodeUrl = BASE_PATH + '/' + 'createQRCode.do'
// 根据订单编号查询该订单是否新产
const queryPlanIsNewestUrl = BASE_PATH + '/' + 'queryPlanIsNewest.do'
// 生成生产计划批号（订单编号+产线代号+批次自增号）
const createPlanBatchNumberUrl = BASE_PATH + '/' + 'createPlanBatchNumber.do'
// 根据工艺版本id查询工序
const queryWorkStageInfoUrl = BASE_PATH + '/' + 'queryWorkStageInfo.do'
// 保存生产计划
const savePlanUrl = BASE_PATH + '/' + 'savePlan.do'
// 根据生产计划id查询生产计划详情
const queryPlanParticularsUrl = BASE_PATH + '/' + 'queryPlanParticulars.do'
// 根据不同条件查询生产计划使用的BOM详情
const queryPlanResourceAllocationUrl = BASE_PATH + '/' + 'queryPlanResourceAllocation.do'

// ### 资源分配
// 打开资源分配页面加载的数据（齐套分析）
const planResourceAllocationUrl = BASE_PATH + '/' + 'planResourceAllocation.do'
// 根据物料id集合查询仓库中的实际库存、预计库存（此接口作为上一接口的业务层接口使用）
// const queryPlanResourceAllocationUrl = BASE_PATH + '/' + 'queryPlanResourceAllocation.do'
// 保存 / 修改 资源分配的数据
const savePlanResourceAllocationUrl = BASE_PATH + '/' + 'savePlanResourceAllocation.do'

// ### 生成工单
// 根据生产计划id查询出该生产计划所引用的工序
const queryPlanQuotesWorkstageUrl = BASE_PATH + '/' + 'queryPlanQuotesWorkstage.do'
// 根据检索条件查询对应的工单摘要
const queryWorkOrderOutlineUrl = BASE_PATH + '/' + 'queryWorkOrderOutline.do'
// 删除工单
const removeWorkOrderUrl = BASE_PATH + '/' + 'removeWorkOrder.do'
// 查看工单详情
const queryWorkOrderParticularsUrl = BASE_PATH + '/' + 'queryWorkOrderParticulars.do'
// 拆分工单
const splitWorkOrderUrl = BASE_PATH + '/' + 'splitWorkOrder.do'
// 新建/修改 工单
const saveWorkOrderUrl = BASE_PATH + '/' + 'saveWorkOrder.do'
// 生成工单号（生产批号+工序代号+工单自增号）
const createWorkOrderNumberUrl = BASE_PATH + '/' + 'createWorkOrderNumber.do'

// ### 草稿箱
// 根据检索条件查询生产计划摘要
const queryDraftPlanOutlineUrl = BASE_PATH + '/' + 'queryDraftPlanOutline.do'
// 根据不同的操作类型修改草稿箱中生产计划的状态
const modifyDraftPlanStatusUrl = BASE_PATH + '/' + 'modifyDraftPlanStatus.do'
// 根据生产计划id删除草稿箱中的生产计划数据
const removeDraftPlanUrl = BASE_PATH + '/' + 'removeDraftPlan.do'

// ### 我发起的
// 关闭生产计划
const removePlanUrl = BASE_PATH + '/' + 'removePlan.do'

// ### 过程详情/进度详情/审核详情
// 根据生产计划id查询生产过程详情
const queryPlanProcessParticularsUrl = BASE_PATH + '/' + 'queryPlanProcessParticulars.do'
// 根据生产计划id查询进度详情
const queryPlanEvolveParticularsUrl = BASE_PATH + '/' + 'queryPlanEvolveParticulars.do'
// 根据生产计划id查询审核详情
const queryPlanCheckParticularsUrl = BASE_PATH + '/' + 'queryPlanCheckParticulars.do'

// ### 我审核的
// 生产计划审核者转交
const planCheckPowerTransferUrl = BASE_PATH + '/' + 'planCheckPowerTransfer.do'

// ### 计划调度
// 生产计划整合
const planMergeUrl = BASE_PATH + '/' + 'planMerge.do'
// 生产计划拆分
const planSplitUrl = BASE_PATH + '/' + 'planSplit.do'

// ## 公共接口

// 修改对应的生产计划的审核状态
const modifyPlanCheckStatusUrl = BASE_PATH + '/' + 'modifyPlanCheckStatus.do'
// 修改对应的生产计划的生产状态
const modifyPlanProductionStatusUrl = BASE_PATH + '/' + 'modifyPlanProductionStatus.do'
// 修改对应的工单的生产状态
const modifyWorkOrderProductionStatusUrl = BASE_PATH + '/' + 'modifyWorkOrderProductionStatus.do'
// 查询消息通知信息
const queryMessageNotificationUrl = BASE_PATH + '/' + 'queryMessageNotification.do'
// 删除消息通知
const removeMessageNotificationUrl = BASE_PATH + '/' + 'removeMessageNotification.do'

// ## 生产执行管理

// 根据工单id查询工单的过程详情
let queryWorkOrderProcessParticularsUrl = BASE_PATH + '/' + 'queryWorkOrderProcessParticulars.do'

// ## 其它

// 查询用户
let queryUsersInfoUrl = BASE_PATH + '/' + 'queryUsersInfo.do'
