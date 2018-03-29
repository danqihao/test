$(function(){
	//显示欢迎XXX，欢迎语
	var newUserName = getCookie("newUserName");
	$("#HelloUserName").html( "'"+newUserName+"' 恭喜您已经成功注册!" );
	//delCookie("newUserName");

});

