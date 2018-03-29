//测试代码
$("#loginButton").click(
	function(){
//		console.log(1111)
		let tempdata = `{"craft_control_workstep_id": "4934a49c905411e7966812eb78deb327","craft_control_workstep_name": "dfgdfgdfg","craft_control_workstep_num": "开机","product_type_name": "下收卷张力实际值","product_model_id": "1400","workstepParameterList":[{"craft_workstep_parameter_main_id" : "0ecc26768be54956a2d8350cb1fd994D","craft_control_workstep_id" : "0ecc26768be54956a2d8350cb1fd994D"} {"craft_workstep_parameter_main_id": "0ecc26768be54956a2d8350cb1fd55Sw","craft_control_workstep_id": "0ecc26768be54956a2d8350cb1fd923D"}]}`;
		$.ajax({
			url: base_path+"/saveNormParameter.do",
			type:"post",
			data:{
//				"stepIds":["1bcdc785d50f4a67974c46cf7fa14a6f"],
//				 "jsonObject":tempdata.toString(),
//				 "processDescribleStrs":'[{"order":1,"proceeding":"撒旦","explain":"阿萨大"},{"order":2,"proceeding":"阿萨大","explain":"阿萨大"}]',
				 "jsonObject":'{"standard_parameter_name":1,"standard_parameter_unit":"撒旦","standard_parameter_specifications":"阿萨大"}',
				"unitIds":["0f398d75beef4058a5hs353424242sfs",
				                "1a8b76cff5bd49fbaeef951d8e749771","8398db05a2854917ac6348c37a941672"],
//				"productTypeId":"f82f0672c9da4d0d82da92026ddffd52",
//				"userId":"",
//				"versionType":"public",
//				"status":"0",
//				"keyword":"qq"
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