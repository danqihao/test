//罗伟荣测试代码
$("#loginButton").click(
	function(){
//		var testList = ["020152b8da284f50b7de4a583a19bcc1:0694d08b978949938b74a7bed53a5351",
//                        "0694d08b978949938b74a7bed53a5351:0694d08b978949938b74a7bed53a5351",
//                        "084c43cf78024d0d9e23b6432e30ff8d:0694d08b978949938b74a7bed53a5351"]
		$.ajax({
			url: base_path+"/queryCraftSegmentOutline.do",
			type:"post",
			data:
			{
				"productTypeId":"0",
				"polarity":"",
				"keyword":null,
				"status":"0",
				"headNum":"1"
//				"devicesName":"负极辊压机11112",
//				"devicesNumber":"FJGY-063",
//				"devicesTypeId":"b7ad58834965404e895df9161f0297ea",
////				"computerIP":"192.168.1.115:8800",
//				"devicesPurchaseDate":"2017-11-11",
//				"devicesId":"8e77c79124c2483cba54dd3520737954"
//根据工序版本id（集合）修改该工序版本状态
//				"type" : "recover",
//				"workstageVersionsIds":["8e77c79124c2483cba54dd3520737954","8e77c79124c2483cba54dd3520737954","8e77c79124c2483cba54dd3520737954"] //数组
				
								
//查询所有工序信息
//				"status" : "1"
				},
//			'["0.8189049451197546","0.08412590610788728","0.6638404437947412","0.3377451588840499","0.0159298122763204","0.02132820833835425","0.22099791313545414","0.46363197702661096","0.48640412225696117","0.233243436471112"]',
//			contentType: 'application/json',
			dataType:"json",
			async: false, //设置为同步请求
			success:function(result){ //result是服务器返回的JSON结果
				console.info(result);
			},error:function(jqXHR,textStatus,errorThrown){
				alert("ERROR");//服务器系统错误
			}
		});
	});





