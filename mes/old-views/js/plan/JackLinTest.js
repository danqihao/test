//测试代码，js
$("#loginButton").click(
	function(){
		var testList = ["020152b8da284f50b7de4a583a19bcc1:0694d08b978949938b74a7bed53a5351",
                        "0694d08b978949938b74a7bed53a5351:0694d08b978949938b74a7bed53a5351",
                        "084c43cf78024d0d9e23b6432e30ff8d:0694d08b978949938b74a7bed53a5351"]
		$.ajax({
			url: base_path+"/saveStep.do",
			type:"post",
			data:{
				  //测试数据
//   		   "type":"modify",
//				  "standardParameter":testList.toString(), //数组
				"craft_materiel_main_id":"29d10ec22635413e827e6fea6cb3fedb",
				"craft_control_workstep_id":"30d10ec22635413e827e6fea6cb3fedb"
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