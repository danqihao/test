/**
 * 工单管理 与生产执行管理  Url
 */
//生产执行管理
queryWorkOrderProcessParticularsUrl = BASE_PATH + '/' + 'queryWorkOrderProcessParticulars.do' // 根据工单id查询工单的过程详情
saveWorkOrderMaterialUseRecordUrl = BASE_PATH + '/' + 'saveWorkOrderMaterialUseRecord.do' // 添加 / 修改  工单的物料使用记录
removeWorkOrderMaterialUseRecordUrl = BASE_PATH + '/' + 'removeWorkOrderMaterialUseRecord.do' // 删除工单的物料使用记录
queryWorkOrderMaterialUseRecordUrl = BASE_PATH + '/' + 'queryWorkOrderMaterialUseRecord.do' // 查询工单的物料使用记录
saveWorkOrderStepParameteRecordUrl = BASE_PATH + '/' + 'saveWorkOrderStepParameteRecord.do' // 添加 / 修改  工单的工步参数记录

removeWorkOrderStepParameteRecordUrl = BASE_PATH + '/' + 'removeWorkOrderStepParameteRecord.do' // 删除工单的工步参数记录
queryWorkOrderStepParameteRecordUrl = BASE_PATH + '/' + 'queryWorkOrderStepParameteRecord.do' // 查询工单的工步参数记录
saveWorkOrderDevicesOperationRecordUrl = BASE_PATH + '/' + 'saveWorkOrderDevicesOperationRecord.do' // 添加 / 修改  工单上的设备操作记录
removeWorkOrderDevicesOperationRecordUrl = BASE_PATH + '/' + 'removeWorkOrderDevicesOperationRecord.do' // 删除工单上的设备操作记录
queryWorkOrderDevicesOperationRecordUrl = BASE_PATH + '/' + 'queryWorkOrderDevicesOperationRecord.do' // 查询工单上的设备操作记录

saveWorkOrderParameteRecordUrl = BASE_PATH + '/' + 'saveWorkOrderParameteRecord.do' // 添加 / 修改  工单上的参数记录
removeWorkOrderParameteRecordUrl = BASE_PATH + '/' + 'removeWorkOrderParameteRecord.do' // 删除工单上的参数记录
queryWorkOrderParameteRecordUrl = BASE_PATH + '/' + 'queryWorkOrderParameteRecord.do' // 查询工单上的参数记录


//生产过程管理
queryWorkOrderProcessStatisticsUrl = BASE_PATH + '/' + 'queryWorkOrderProcessStatistics.do' // 查询工单生产过程统计0
saveMaterialRequisitionUrl = BASE_PATH + '/' + 'saveMaterialRequisition.do' // 创建领料单
queryMaterialRequisitionOutlineUrl = BASE_PATH + '/' + 'queryMaterialRequisitionOutline.do' // 根据不同条件查询领料单摘要
queryMaterialRequisitionParticularsUrl = BASE_PATH + '/' + 'queryMaterialRequisitionParticulars.do' // 查询领料单详情0
modifyMaterialRequisitionUrl = BASE_PATH + '/' + 'modifyMaterialRequisition.do' // 修改领料单

removeMaterialRequisitionUrl = BASE_PATH + '/' + 'removeMaterialRequisition.do' // 删除领料单
queryMaterialRequisitionStatisticsUrl = BASE_PATH + '/' + 'queryMaterialRequisitionStatistics.do' // 领料统计
queryMaterialRequisitionBindingMaterialNumberUrl = BASE_PATH + '/' + 'queryMaterialRequisitionBindingMaterialNumber.do' // 查询领料单内绑定的物料编号
removeMaterialRequisitionBindingMaterialNumberUrl = BASE_PATH + '/' + 'removeMaterialRequisitionBindingMaterialNumber.do' // 删除领料单内绑定的物料编号
saveMaterialRequisitionBindingMaterialNumberUrl = BASE_PATH + '/' + 'saveMaterialRequisitionBindingMaterialNumber.do' // 保存领料单内绑定的物料编号单

queryGetMaterialTotalUrl = BASE_PATH + '/' + 'queryGetMaterialTotal.do' // 查询工单下的所有已领取物料及所有受调批物料信息
saveMaterialsReturnedUrl = BASE_PATH + '/' + 'saveMaterialsReturned.do' // 创建退料单
queryMaterialsReturnedOutlineUrl = BASE_PATH + '/' + 'queryMaterialsReturnedOutline.do' // 根据不同条件查询退料单摘要
queryMaterialsReturnedParticularsUrl = BASE_PATH + '/' + 'queryMaterialsReturnedParticulars.do' // 查询退料单详情
modifyMaterialsReturnedUrl = BASE_PATH + '/' + 'modifyMaterialsReturned.do' // 修改退料单

removeMaterialsReturnedUrl = BASE_PATH + '/' + 'removeMaterialsReturned.do' // 删除退料单
queryMaterialsReturnedStatisticsUrl = BASE_PATH + '/' + 'queryMaterialsReturnedStatistics.do' // 退料统计
queryMaterialsReturnedBindingMaterialNumberUrl = BASE_PATH + '/' + 'queryMaterialsReturnedBindingMaterialNumber.do' // 查询退料单内绑定的物料编号
saveMaterialsSupplementUrl = BASE_PATH + '/' + 'saveMaterialsSupplement.do' // 新增补料
queryMaterialsSupplementOutlineUrl = BASE_PATH + '/' + 'queryMaterialsSupplementOutline.do' // 根据不同条件查询补料摘要

queryMaterialsSupplementParticularsUrl = BASE_PATH + '/' + 'queryMaterialsSupplementParticulars.do' // 查询补料单详情
queryMaterialsSupplementStatisticsUrl = BASE_PATH + '/' + 'queryMaterialsSupplementStatistics.do' // 补料统计
saveMaterialsDispatchUrl = BASE_PATH + '/' + 'saveMaterialsDispatch.do' // 创建物料调批
queryMaterialsDispatchOutlineUrl = BASE_PATH + '/' + 'queryMaterialsDispatchOutline.do' // 根据不同条件查询物料调批摘要
queryMaterialsDispatchParticularsUrl = BASE_PATH + '/' + 'queryMaterialsDispatchParticulars.do' // 查询物料调批详情

queryMaterialsDispatchStatisticsUrl = BASE_PATH + '/' + 'queryMaterialsDispatchStatistics.do' // 物料调批统计
queryMaterialsDispatchBindingMaterialNumberUrl = BASE_PATH + '/' + 'queryMaterialsDispatchBindingMaterialNumber.do' // 查询物料调批内绑定的物料编号
saveProductElementBatchUrl = BASE_PATH + '/' + 'saveProductElementBatch.do' // 新增产出物批次
queryProductElementBatchOutlineUrl = BASE_PATH + '/' + 'queryProductElementBatchOutline.do' // 根据不同条件查询产出物批次摘要
queryProductElementBatchParticularsUrl = BASE_PATH + '/' + 'queryProductElementBatchParticulars.do' // 查询产出物批次详情

removeProductElementBatchUrl = BASE_PATH + '/' + 'removeProductElementBatch.do' // 删除产出物批次
queryProductElementBatchStatisticsUrl = BASE_PATH + '/' + 'queryProductElementBatchStatistics.do' // 产出物批次统计
queryProductElementBatchBindingNumberUrl = BASE_PATH + '/' + 'queryProductElementBatchBindingNumber.do' // 查询产出物批次内绑定的产出物编号
saveBatchCareOfUrl = BASE_PATH + '/' + 'saveBatchCareOf.do' // 新建批次转出
queryBatchCareOfOutlineUrl = BASE_PATH + '/' + 'queryBatchCareOfOutline.do' // 根据不同条件查询批次转出摘要

queryBatchCareOfParticularsUrl = BASE_PATH + '/' + 'queryBatchCareOfParticulars.do' // 查看批次转出详情
removeBatchCareOfUrl = BASE_PATH + '/' + 'removeBatchCareOf.do' // 删除批次转出
queryBatchCareOfStatisticsUrl = BASE_PATH + '/' + 'queryBatchCareOfStatistics.do' // 批次转出统计
queryBatchCareOfBindingNumberUrl = BASE_PATH + '/' + 'queryBatchCareOfBindingNumber.do' // 查询批次转出内绑定的产出物编号
saveScrapBatchUrl = BASE_PATH + '/' + 'saveScrapBatch.do' // 新增报废登记

queryScrapBatchOutlineUrl = BASE_PATH + '/' + 'queryScrapBatchOutline.do' // 根据不同条件查询报废登记摘要
queryScrapBatchParticularsUrl = BASE_PATH + '/' + 'queryScrapBatchParticulars.do' // 查询报废登记详情
removeScrapBatchUrl = BASE_PATH + '/' + 'removeScrapBatch.do' // 删除报废登记
queryScrapBatchBindingNumberUrl = BASE_PATH + '/' + 'queryScrapBatchBindingNumber.do' // 查询报废登记内绑定的产出物编号
saveRejectsBatchUrl = BASE_PATH + '/' + 'saveRejectsBatch.do' // 新增不良品登记

queryRejectsBatchOutlineUrl = BASE_PATH + '/' + 'queryRejectsBatchOutline.do' // 根据不同条件查询不良品登记摘要
queryRejectsBatchParticularsUrl = BASE_PATH + '/' + 'queryRejectsBatchParticulars.do' // 查询不良品登记详情
removeRejectsBatchUrl = BASE_PATH + '/' + 'removeRejectsBatch.do' // 删除不良品登记
queryRejectsBatchBindingNumberUrl = BASE_PATH + '/' + 'queryRejectsBatchBindingNumber.do' // 查询不良品登记内绑定的产出物编号
queryWorkOrderOutlineUrl = BASE_PATH + '/' + 'queryWorkOrderOutline.do' // 根据检索条件查询对应的工单摘要
queryWarehousesUrl = BASE_PATH + '/' + "queryWarehouses.do"// 获取仓库下拉数据
queryPlanResourceAllocationUrl = BASE_PATH + '/' + "queryPlanResourceAllocation.do"// 根据不同条件查询生产计划使用的BOM详情
generateProcessManageBatchNumberUrl = BASE_PATH + '/' + "generateProcessManageBatchNumber.do"//生成批号
queryWorkOrderParticularsUrl = BASE_PATH + '/' + "queryWorkOrderParticulars.do"//工单详情
queryWorkingAreaUrl = BASE_PATH + '/' + "queryWorkingArea.do"//暂存区
queryMessageNotificationUrl = BASE_PATH + '/' + "queryMessageNotification.do"//查看消息通知
queryClassesUrl = BASE_PATH + '/' + "queryClasses.do"//班次管理
queryWorkstageParticularsUrl = BASE_PATH + '/' + "queryWorkstageParticulars.do"//工序管理详情
queryStepParticularsUrl = BASE_PATH + '/' + "queryStepParticulars.do"//
queryWorkOrderOperatorTypeUrl = BASE_PATH + '/' + "queryWorkOrderOperatorType.do"//
modifyWorkOrderProductionStatusUrl = BASE_PATH + '/' + "modifyWorkOrderProductionStatus.do"//
