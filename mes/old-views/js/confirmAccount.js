//页面加载完毕后执行以下代码
$(function(){
	//用户名输入框获得焦点
	$("#username").focus();
	
});

//表单验证
$(function() {
	var nameOk = false; //用户名框开关
	//var emailOk = false;  //邮箱框开关
	var answerOk = false;  //密保答案开关
	var ModifyPasswordCode = false;  //验证码框开关
    var userName; 	//用户名
	//var inputEmail; //邮箱
    var secretQuestion; //密保问题
	var secretAnswer; //密保答案
	var verificationCode; //验证码
	
	var username_reg = /^([\w]|[\u4e00-\u9fa5]){3,16}$/;//用户名正则表达,支持中文、字母、数字、下划线组合，3-16位字符
	var answer_reg = /^([\w\]|[\u4e00-\u9fa5]){1,25}$/;//密保答案正则表达，支持中文、字母、数字、下划线组合，25位以下字符
	
	// 校验用户名格式   //给username框添加焦点移除事件
	$("#username").blur(function() {
		userName = $("#username").val();
		//$("#code_notice").empty();//清除之前的提示
		if (username_reg.test(userName)){
			nameOk = true;
			$("#username_notice").empty();//清除之前的提示
		}else{
			nameOk = false;
		}
	});
	
	// 邮箱验证
/* 	$("#email").blur(function() {
						 inputEmail = $("#email").val();
						var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
					    if (!re.test($.trim(inputemail))) {
							$("#email_notice").empty();//清除之前的提示
							flag_email = false;
						} else {
							$("#email_notice").html("<span style='color:#f00;'></span>");
							flag_email = true;
						}

					}); */
	
	// 答案验证
	$("#answer").blur(function() {
		secretAnswer = $("#answer").val();
	     if (answer_reg.test($.trim(secretAnswer))) {
	    	 answerOk = true;
	    	$("#answer_notice").empty();//清除之前的提示
		} else {
			answerOk = false;
		}
	});
					
	// 校验码验证格式
	$("#verification").blur(function() {
		verificationCode = $("#verification").val().trim(); //获取验证码框内容
		if(verificationCode != ""){
			ModifyPasswordCode = true;
			$("#code_notice").empty();//清除之前的提示
		}else{
			ModifyPasswordCode = false;
		}
	});
	
	
	// 所有验证通过后，允许表单提交
	$("#formButton").click(function() {
		//获取当前选中的密保问题
		secretQuestion = $("#secretQuestion option:selected").text();
		
		if (nameOk && answerOk && ModifyPasswordCode) {
			//参数符合格式，发送Ajax请求
			$.ajax({url:base_path+"/confirmAccount.do",
				type:"post",
				data:{"userName":userName,"secretAnswer":secretAnswer,
						"confirmAccountVerifyCode":verificationCode,"secretQuestion":secretQuestion},
				dataType:"json",
				success:function(result){//result是服务器返回的JSON结果 
					if(result.status == 3){//3为验证码错误代码
						$("#code_notice").html("<span style='color:#f00;'>验证码错误</span>");
						$("#verification").val(""); //清空验证码输入框的内容
						$("#verification").focus(); //验证码输入框获得焦点事件
						$("#clickConfirmAccountVerificationCode").click(); //模拟验证码单击事件,刷新验证码
						return false;
					}else if(result.status == 2){
						//该用户不存在
						ModifyPasswordCode = false;
						$("#verification").val(""); //清空验证码输入框的内容
						$("#clickConfirmAccountVerificationCode").click(); //模拟验证码单击事件,刷新验证码
						$("#username_notice").html("<span style='color:#f00;'>该用户不存在,是否前往注册?<a href='../register.html' target='_self'> 前往注册</a></span>");

						return false;
					}else if(result.status == 5){
						//密保问题错误
						ModifyPasswordCode = false;
						$("#verification").val(""); //清空验证码输入框的内容
						$("#clickConfirmAccountVerificationCode").click(); //模拟验证码单击事件,刷新验证码
						$("#answer_notice").html("<span style='color:#f00;'>请正确输入密保答案</span>");
						$("#answer").focus();//密保答案输入框获得焦点
						$("#answer").val(""); //清空密保答案输入框的内容
						return false;
					}else if(result.status == 4){
						//其他特殊情况
						alert("哎呀,密码跑掉啦,请放松一下再试");
					}else if(result.status == 0){
						//验证成功
						$("#answer").val(""); //清空密保答案输入框的内容
						$("#verification").val(""); //清空验证码输入框的内容
						//跳转至重置密码页
						window.location.href=base_path+"/skipModifyPassword.do";
					}
				},error:function(){
					alert("对不起,目前系统繁忙,请稍后再试");//服务器系统错误
				}
			});
			return false;
		}
		//判断输入的用户名是否满足规范，不满足现实提示信息
		if(!nameOk){
			$("#username_notice").html("<span style='color:#f00;'>请正确输入用户名</span>");
		}
		//判断输入的密保答案是否满足规范，不满足现实提示信息
		if(!answerOk){
			$("#answer_notice").html("<span style='color:#f00;'>请正确输入密保答案</span>");
		}
		//判断输入的验证码是否为空，为空则提示
		if(!ModifyPasswordCode){
			$("#code_notice").html("<span style='color:#f00;'>验证码为空</span>");
		}
	});
	//回车提交事件
	$("input").keydown(function(){
	    if (event.keyCode == "13") {//keyCode=13是回车键
	    	$("#username").blur();//为了让验证码能够通过前端js验证，先把焦点移出
	    	$("#answer").blur();
	    	$("#verification").blur();
	    	$("#formButton").click();//调用提交按钮
	    }
	}); 
	
});





