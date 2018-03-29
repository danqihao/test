/**
 * @description:通用js
 * @author jieker
 */

//页面加载完毕后执行以下代码
$(function(){
	
	//在页面右上角显示登录的用户名欢迎语
	$("#HelloUserName").html("<b>您好:&nbsp&nbsp</b><span style='color:#0ff;'>" +getCookie("userName")+"</span>");
	
	//给退出按钮绑定点击事件
	$("#exitButton").click(userExit);
	
//	window.onbeforeunload = function() { 
//		 return "确定离开页面吗？"; 
//	} 
	
    
});


/**
 * 背景操作
 */
$(function(){
    //获取存在cookie里的背景颜色
    $("body").css("background-color", $.cookie("bgcolor"));

    //更换背景色
    $("#change-bg").click(function(event){
    	 event.stopPropagation(); //阻止事件冒泡
    	$("#color-select").show();
    });
   //  点击页面任何地方隐藏背景选择框
    $("body").click(function(){
    	$("#color-select").hide();
    });
    //将选中的背景存cookie
    $(".color").click(function () {
        $("body").css("background-color", $(this).css("background-color"));
        $.cookie("bgcolor", $(this).css("background-color"),{expires:365});
     });
});


/**
 * /用户退出函数
 */
function userExit(){
	var OK = false;
	if(confirm("确定要退出系统")){
		OK = true;
	}
	if(OK){
		$.ajax({
			url:base_path+"/exitLogin.do",
	        type: "post",
	        data: {},
	        dataType: "json",
	        success:function(result){
	            if(result.status==0){//退出成功
	            	//删除本地保存的Cookie
	            	delCookie("userName");//删除key为userName的属性
	            	delCookie("UI");	//删除用户ID
	            	delCookie("UT"); //删除令牌
	            	delCookie("RP");	//删除用户保存的密码
	            	//重定向到退出后的页面
//	            	window.location.href=base_path+"/logout.do";
	            	window.location.href=base_path2+"/logout.html";
//	            	return false;
	            }else if(result.status==1){
	            	//重定向到退出后的页面
//	            	window.location.href=base_path+"/logout.do";
	            	window.location.href=base_path2+"/logout.html";
	            }
	        },
	        error:function (){
            	//删除本地保存的Cookie
            	delCookie("userName");//删除key为userName的属性
            	delCookie("UI");	//删除用户ID
            	delCookie("UT"); //删除令牌
            	delCookie("RP");	//删除用户保存的密码
            	//重定向到退出后的页面
//            	window.location.href=base_path+"/logout.do";
            	window.location.href=base_path2+"/logout.html";
	        }
	    });
	}
}


/**
 * 重写时间格式方法： yyyy年mm月dd日
 */
Date.prototype.toLocaleString = function() {
    return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日";
}


/**
 * 重写时间格式方法2：yyyy-mm-dd  hh：ii：ss
 */
Date.prototype.toLocaleString1 = function() {
	var y = this.getFullYear();
	var m = this.getMonth() + 1;
	var d = this.getDate();
	var h = this.getHours();
	var i = this.getMinutes();
	var s = this.getSeconds();
	
    return y + "-" + (m<10?"0" + m:m) + "-" + (d<10?"0" + d:d) + "\t\t"+(h<10?"0" + h:h) + ":" + (i<10?"0" + i:i) + ":" + (s<10?"0" + s:s);
}

/**
 * 替换表格数据null为"";
 */
function replaceNull(){  
    $("table tr").each(function(){  
        var td=$(this).find("td");  
        $(td).each(function(){  
            if($(this).html()=="null"||null){  
                $(this).html("");  
            }  
        });  
    });  
 } 

/**
 * 遍历集合，如果集合中不存在parameter，则添加到集合，否则不添加
 * @param list
 * @param parameter
 */
function traverseListPush(list, parameter){  
	var isInList = false;

	for (var i = 0; i < list.length; i++) { 
		if(list [i] == parameter){
			isInList = true;
			break;
		}
	} 
	if (!isInList) {
		list.push(parameter);  
	}
	
 }

/**
 * 遍历集合，判断集合中是否存在parameter
 * @param list
 * @param parameter
 */
function traverseListPush2(list, parameter){  
	
	for (var i = 0; i < list.length; i++) { 
		if(list [i] == parameter){
			return true;
		}
	}
	
 }

/**
 * 遍历集合，如果集合中存在parameter，则删除
 * @param list
 * @param parameter
 */
function traverseListDelete(list, parameter){  
	
	for (var i = 0; i < list.length; i++) { 
		if(list [i] == parameter){
			list.splice(i,1)
		}
	}  
	
 }


