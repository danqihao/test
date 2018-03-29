//测试代码
$("#loginButtonA").click(
	function(){
		
		
		$.ajax({
			url: base_path+"/saveFQCReport.do",
			type:"post",
			data:{
				//测试根据工艺段版本id（集合）查询出对应的工艺段详情
				//"craftSegmentVersionsIds":["5e1440c0dda14f58b95aa86f7d8e221d"],
				
				
				//测试新增工艺数据
				/*"craftSegmentIds":[
               
                "0ecc26768be54956a2d8350cb1fd972a"
                ],
                "craftBasicsId":"a9d10ec22635413e827e6fea6cb3fedb", //工艺基础信息id
                "modelId":"d9d10ec22635413e827e6fea6cb3fedb",//产品id
                "modelTypeId":"b9d10ec22635413e827e6fea6cb3fedb",//产品类型id
                "lineId":"u9d10ec22635413e827e6fea6cb3fedb",//产线id
                "craftName":"爱国",//工艺名称
                "craftNumber":"FL-GB10",//工艺编号
                "craftVersions":"天蓝BB34-B2-8",//工艺版本号   （不能重复）
                "modelTypeName":"爱国",//产品类型名称
                "modelGenre":"爱国",//产品型号
                "qualityRate":"80.50",//优率
                "craftOpen":"是",//是/否公开版
                "lineName":"爱国",//产线名称
                "creationStaff":"爱国",//创建人员
                "describe":"爱国",//备注描述
	            "processDescribleStrs":"[{'explain':'说明1','order':'1',},{'proceeding':'事项2','explain':'说明2','order':'2',},{'proceeding':'事项3','explain':'说明3','order':'3',}]"

				*/
				
				//测试新增工艺段数据
				/* "segmentName" : "11",		//工艺段名称
				 "segmentNumber" : "22",	//工艺段编号
				 "segmentVersions" : "liaoliaoliaolFFF",	//工艺段版本号
				 "typeName" : "44",			//产品类型名称
				 "modelGenre" : "wqwq",		//产品型号
				 "qualityRate" : "66",		//优率
			  	 "segmentPolarity" : "77",	//极性
				 "creationStaff" : "88",	//创建人员
				 "basicsId" : "0ecc26768be54956a2d8350cb1fd992A",		//工艺段基础信息id
				 "modelId" : "0ecc26768be54956a2d8350cb1fd992B",		//产品id
				 "modelTypeId" : "0ecc26768be54956a2d8350cb1fd993C",	//产品类型id
				 "segmentDescribe" : "13",		//备注
				 
				 "workstageIds":[
				                 "0f398d75beef4058a5hs353424242sfs"
				                
				                 ],
				    
	            "processDescribleStrs":"[{'proceeding':'事项1','explain':'说明1','order':'1',},{'proceeding':'事项2','explain':'说明2','order':'2',},{'proceeding':'事项3','explain':'说明3','order':'3',}]"

				*/
				
				
				//查询工艺历史版本或查询用户输入的版本号是否重复 "1a8b76cff5bd49fbaeef951d8e749771"
		
				/*"type" : "history", //history 查看历史记录  isExist 版本号是否重复
				"headNum":1
				 "craftBasicsId" : "a9d10ec22635413e827e6fea6cb3fedb",
				// "versionsNumber" : "天蓝BB06"
*/				
				
				//根据工序版本id（集合）查询出对应的工序详情
				
				
				/*"workstageVersionsIds":[
				    				    "0f398d75beef4058a5hs353424242sfs",
				    				     "0f398d75beef4058a5hs353424242sfa"
				    				]*/
				
				
				
				  /*  "semiFinishParameterUse": [
				        {
				            "semi_finish_parameter_id": "1c500ceafd5743bbb78e0614bd844381",
				            "semi_finish_parameter_name": "testCC1",
				            "semi_finish_parameter_unit": "单位1"
				        },
				        {
				            "semi_finish_parameter_id": "1c500ceafd5743bbb78e0614bd844382",
				            "semi_finish_parameter_name": "testCC2",
				            "semi_finish_parameter_unit": "单位2"
				        },
				        {
				            "semi_finish_parameter_id": "1c500ceafd5743bbb78e0614bd844383",
				            "semi_finish_parameter_name": "testCC3",
				            "semi_finish_parameter_unit": "单位3"
				        }
				    ],
				    "stageAndStepRelationList": [
				        {
				            "craft_control_workstep_id": "000001",
				            "workstage_workstep_order": "1"
				        },
				        {
				            "craft_control_workstep_id": "000002",
				            "workstage_workstep_order": "2"
				        },
				        {
				            "craft_control_workstep_id": "000003",
				            "workstage_workstep_order": "3"
				        }
				    ],
				    "useParametersList": [
				        {
				            "workstage_use_parameter_constant_value": "20",
				            "workstage_use_parameter_name": "testAA1",
				            "workstage_use_parameter_value_type": "恒定值"
				        },
				        {
				            "workstage_use_parameter_constant_value": "20",
				            "workstage_use_parameter_name": "testAA2",
				            "workstage_use_parameter_value_type": "恒定值"
				        },
				        {
				            "workstage_use_parameter_constant_value": "20",
				            "workstage_use_parameter_name": "testAA3",
				            "workstage_use_parameter_value_type": "恒定值"
				        }
				    ]
				
				
				*/
				
				
				
				//测试新增fqc报告信息同时添加 fqc报告项目结果、不良品
				
				
				    "product_model_id": "067882cf74c14a539f551c12b335d60a",
				    "quality_fqc_check_auditor": "审核人",
				    "quality_fqc_check_auditor_date2": "2017-12-19 14:34:16",
				    "quality_fqc_check_auditor_id": "bbbbbbbbbbbbbbbbbbbbbbbb12340002",
				    "quality_fqc_check_date2": "2017-12-19 14:34:16",
				    "quality_fqc_check_people": "隔壁老王",
				    "quality_fqc_check_peopleid": "testtesttestbbbbbbbbbbbb12340002",
				    "quality_fqc_comprehensive_result": "0",
				    "quality_fqc_customer_name": "客户名称test1",
				    "quality_fqc_record_code": "质量记录代号",
				    "quality_fqc_remarks": "备注",
				    "quality_fqc_report_name": "报告名称",
				    "quality_fqc_report_number": "test8801bbbbbbbbbbbbbbbbbbbbbbbb",
				    "quality_fqc_report_status": "1",
				    "quality_fqc_report_type": "报告类型",
				    "quality_fqc_template_id": "bbbbbbbbbbbbbbbbbbbbbbbbtest0002",
				    "warehouse_product_batch": "电池批号",
				    "warehouse_product_capacity_grade": "容量档次",
				    "warehouse_product_inspection_number": "10",
				    "warehouse_product_model": "型号",
				    "warehouse_product_sample_number": "5",
				
				
			    "quality_fqc_unqualified_content": "test不良品内容",
			    "quality_fqc_unqualified_number": "100",
				
				"fqcProjectResultListJsonStr" :     	"[{'quality_fqc_project_max':'200','quality_fqc_project_min':'120','quality_project_id':'qptest0001bbbbbbbbbbbbbbbbbbbbbb'},{'quality_fqc_project_max':'201','quality_fqc_project_min':'121','quality_project_id':'qptest0001bbbbbbbbbbbbbbbbbbbbbb'},{'quality_fqc_project_max':'202','quality_fqc_project_min':'122','quality_project_id':'qptest0001bbbbbbbbbbbbbbbbbbbbbb'}]"
			},
			dataType:"json",
			async: false, //设置为同步请求
			success:function(result){ //result是服务器返回的JSON结果
				console.info(result);
				alert("success");
			},error:function(jqXHR,textStatus,errorThrown){
				alert("ERROR");//服务器系统错误
			}
		});
});






