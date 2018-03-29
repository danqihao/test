//测试代码
$("#loginButton").click(
	function(){
		$.ajax({
			url: base_path+"/queryCraftBOMParticulars.do",
			type:"post",
			data:{
//				craftVersionsId:'3ae4bc19966b4164a093a3b35c5cf82c',
//				status:'0',
//				keyword:'中'
				craftBOMId:'328ab05d082f4e3e8885f61cb952362f'
				//craftBOMId:'567ebf2096ab4374882d9f55b7373b4a'
//				craftId:'3ae4bc19966b4164a093a3b35c5cf82c',
//				craftBomName:'美国佬',
//					craftBomVersion:'v3-5',
//					craftBomNote:'',
//					materialIdAndSupplierId:'[{"craft_control_bom_id":"5b1785843630431faa1cd5112d335830","supplier_id":"2c292a62c86844238fdc1741f12c133f","supplier_name":"长城"},{"craft_control_bom_id":"5307e56de8d54b0d8f26d6bfb7198bf3","supplier_id":"84833678283d4db29bd0cd42ffbaf270","supplier_name":"北国"}]'
			//	materialId:'5b1785843630431faa1cd5112d335830'
//				'craftId': '3ae4bc19966b4164a093a3b35c5cf82c',  //获取工艺id
//				'craftBomName':'中国BOM', //获取bom名称
//			   'craftBomVersion':'v1.1', //获取bom版本
//				'craftBomNote':""
				//'realationParameterId':'1cf68031eff44c8d8cb2e037a1ee89bd'
				//'normParameterId':'77c3ffcfdfa44f99a0a13ee443176108',
				//'type':"precise",
				//'parameterTypeId':'',
				//'keyword':'',
				//'status':'',
				//'headNum':''
//				'headNum': '1', 
//				'projectName': '', 
//				'projectType': '', 
//				'projectTypeId': '7b712d15ae404f7080a3acc3e0f50341'
				//'projectTypeId':'',
				//'headNum':'11'
			//	'projectTypeName':''
				//'projectTypeId':''
				//'quality_project_type_name':'测'
				//'checkMethodId':'00a0e20f8ba94c4fb03ce5996ea60223'
				//'projectId':'0a90dcef1603496eba1aeec370eb9744',
				//'projectName':'真的吗'
				//'qualityProjectName':'你大爷',
			//	'qualityProjectTypeId':'00c93c5f561e4f63a6f6437e51735eec'
				//'projectTypeName':'123',
			//	'projectTypeDetail':'真的额'
				//'projectId':'74ade911f5e049568c38dc4dc17a921e'
//				'projectId':'74ade911f5e049568c38dc4dc17a921e',
//					'projectName':'你有病',
//					'projectTypeId':'0089df17960f431baab42dfcca24d811',
//						'projectTypeName':'FQC'
//					'headNum':'0'
                           // 'quality_project_name':'你好',
                           // 'quality_project_type_id':'86ca25284aba4c3b9fa4166b2d212943'
				            // 'applianceId':"a4c00eb17de34aa6bc5213db33368898",
                           // 'applianceName':'小',
//                            'applianceNumber':'A',
//                            'applianceDetail':'这是一把鞭子'
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






