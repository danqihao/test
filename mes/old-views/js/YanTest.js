//严文俊测试代码
$("#loginButton").click(
	function(){
		$.ajax({
			url: base_path+"/modifySemiFinishedProductModelStatus.do",
			type:"post",
			data:{
	//新增产品类型
//					"typeName":"W",
//					"typeNumber":"Y",
//					"typeDescribe":"R",
//				    "creationStaff":"JD",
//				    "creationStaffId":"25407c33976d47dea27a4f20bc24e30a",
	//				"creationStaff":"U"
	
	//根据条件查询产品类型信息
	//				"type":"precise",
	//				"type":"vague",
	//				"productTypeId":"",
	//				"keyWord":"",
	//				"status":"",
	//				"headNum":""
	
	//（批量）根据产品类型id（集合）修改该产品类型状态
	//				"type":"deprecated",
	//				"type":"recover",
	//				"productTypeIds":["8","9","10"]
	
	//新增产品模型
//						 "typeId":"25407c33976d47dea27a4f20bc24e30d",
//						 "modelName":"YAS5",
//						 "modelGenre":"YAS5",
//						 "modelNumber":"YAS5",
//						 "creationStaff":"YU",
//						 "creationStaffId":"25407c33976d47dea27a4f20bc24e30a",
//						 "modelUnit":"V",
//						 "ratedVoltage":"YAS",
//						 "ratedVoltageUnit":"YAS",
//						 "openVoltage":"YAS",
//						 "openVoltageUnit":"YAS",
//						 "resistance":"YAS",
//						 "resistanceUnit":"YAS",
//						 "modelLong":"1",
//						 "modelWide":"1",
//						 "modelHigh":"1",
//						 "modeDiameter":"1",
//						 "impedance":"YAS",
//						 "impedanceUnit":"YAS",
//						 "modelShape":"YAS",
//						 "modelSize":"YAS",
//						 "modelSizeUnit":"YAS",
//						 "modelWeight":"YAS",
//						 "modelWeightUnit":"YAS",
//						 "capacity":"YAS",
//						 "capacityUnit":"YAS",
//						 "peculiarity":"YAS",
//						 "chargeDischarge":"YAS",
//						 "chargeDischargeUnit":"YAS",
//						 "selfDicharge":"YAS",
//						 "selfDichargeUnit":"YAS"
							 
//						 "temperature":"YAS",
//						 "temperatureUnit":"YAS",
//						 "safety":"YAS",
//						 "protection":"YAS",
//						 "storageLife":"YAS",
//						 "trait":"YAS",
//						 "serviceableRange":"YAS",
//						 "announcement":"YAS",
//						 "describe":"YAS",

					 
	//根据条件查询产品模型信息
	//				"type":"precise",
	//				"type":"vague",
	//				"productModelId":"",
	//				"keyWord":"",
	//				"status":"",
	//				"headNum":""
	
	//（批量）根据产品模型id（集合）修改该产品模型使用状态
	//				"type":"deprecated",
	//				"type":"recover",
	//				"productModelIds":["8","9","10"]
	
	//查询产品类型所对应的产品型号
	//				"productTypeId":"",
	//				"status":""
	
	//新增半成品类型
//					"semiName":"JK12RU",
//					"semiNumber":"JK12RU",
//			    	"creationStaff":"JK12RU",
//  			    "creationStaffId":"25407c33976d47dea27a4f20bc24e30a"
//  			    "describe":"",
	
	//根据条件查询半成品类型信息
	//				"type":"precise",
	//				"type":"vague",
	//				"semiFinishedProductTypeId":"",
	//				"keyWord":"",
	//				"status":"",
	//				"headNum":""
	
	//（批量）根据半成品类型id（集合）修改该半成品类型状态
	//				"type":"deprecated",
	//				"type":"recover",
	//				"semiFinishedProductTypeIds":"",["8","9","10"]
	
	// 新增半成品模型
//					"typeId":"25407c33976d47dea27a4f20bc24e30a",
//					"semiName":"TYU",
//					"semiGenre":"TYU",
//					"semiNumber":"TYU",
//					"creationStaff":"JK12RU",
//  			    "creationStaffId":"25407c33976d47dea27a4f20bc24e30a",
//					"semiUnit":"TYU"
//					"describe":"",
	
	//根据条件查询半成品信息
	//				"type":"precise",
	//				"type":"vague",
	//				"semiFinishedProductModelId":"",
	//				"keyWord":"",
	//				"status":"",
	//				"headNum":""
	
	//（批量）根据半成品模型id（集合）修改该半成品模型使用状态
//					"type":"deprecated",
//					"type":"recover",
//					"semiFinishedProductModelIds":[
//					                               "069a5bfac763408a9d9d7d84582bbd24"
//					                               "0b6db6eecfd44d30966eb9e2b6efc9d6",
//					                               "960943fca3de4333947c45d3ace54564"
//					                               ]
	
	//根据条件查询半成品类型所对应的半成品型号、单位
	//				"semiFinishedProductTypeId":"",
	//				"status":"",
	//				"headNum":""
	
	//根据条件 添加(修改)半成品型号-半成品参数（标准参数）的对应关系
	//				"type":"modify",
	//				"type":"",
	//				"semiFinishedProductModelId":"",
	//				"semiFinishedProductParameterIds":["8","9","10"]
	
	//查询半成品型号及所对应的半成品参数、使用状态等信息。
	//				"SemiFinishedProductModelId":"",
	//				"headNum":""
				
				},
			dataType:"json",
			async: false, //设置为同步请求
			success:function(result){ //result是服务器返回的JSON结果
				console.info(result);
			},error:function(jqXHR,textStatus,errorThrown){
				alert("ERROR");//服务器系统错误
			}
		});
});






