// 表单验证
$(function(){
	var nameOk = false; //用户名框开关
	var pwdOk = false;  //密码框开关
	var imgOk = false;  //验证码框开关
	var inputName; //获取用户名
	var inputPassword; //获取密码
	var inputCode; //获取验证码

	//更新版权的年
	$('#copyright').text(`版权所有:Copyright © ${moment().format('YYYY')} 天蓝智能科技（深圳）有限公司 All rights reserved.`)

	//页面加载完成之后获取验证码
	$('#clickLoginVerificationCode').attr('src', BASE_PATH + '/verifyCode.do?type=login')

	//点检验证码图片切换验证码
	$('#clickLoginVerificationCode').click(function () {
		let tempstr = BASE_PATH + '/verifyCode.do?type=login&x=' + Math.random()
		$(this).attr('src', tempstr)
	})
	// console.log(document.cookie)

	//判断是否记住密码
	if(getCookie("RP") != null && getCookie("userName") != null){
		document.getElementById("checkbox1").checked = true; //选中记住密码框
		inputName = getCookie("userName");
		inputPassword = getCookie("RP");
		$("#username").val(inputName); //用户名输入框注入数据
		$("#password").val("aaaaaa"); //密码输入框注入数据
		var nameOk = true;
		var pwdOk = true;
		$("#verification").focus();// 验证码输入框获得焦点
	}else{
		$("#username").focus();	//用户名输入框获取焦点事件
	}

	// 校验用户名格式
	$("#username").blur(//给username框添加焦点移除事件
		function() {
			$("#code_notice").empty();//清除底部的提示
			inputName = $("#username").val();
			if (USERNAME_REG2.test(inputName)){
				nameOk = true;
			}else{
				nameOk = false;
			}
		});

	// 校验密码格式
	$("#password").blur(//给passwor框添加焦点移除事件
		function() {
			$("#code_notice").empty();//清除底部的提示
			inputPassword = $("#password").val();

			if (PASSWORD_REG.test(inputPassword)){
				pwdOk = true;
			}else{
				pwdOk = false;
			}
		}).	focus(function () {
			$(this).val(""); //密码输入框清空
		});


	// 校验码验证格式
	$("#verification").blur(//给验证码框添加焦点移除事件
		function() {
			$("#code_notice").empty();//清除验证码错误的提示
			inputCode = $("#verification").val().trim();//获取验证码框内容
			if(inputCode != ""){
				imgOk = true;
			}else{
				imgOk = false;
			}
		});

	//验证码框回车提交事件
	$("#verification").keydown(function(event){
		var curKey = event.which;
	    if (curKey == "13") {//keyCode=13是回车键
	    	$("#verification").blur();//为了让验证码能够通过前端js验证，先把焦点移出
	    	$("#loginButton").click();//模拟提交按钮
	    }
	});

	// 所有格式正确
	$("#loginButton").click(
		function(){
			var remember = $("#checkbox1").is(':checked'); //是否记住密码
	
			//当所有条件满足时,发送Ajax请求
			if(nameOk && pwdOk && imgOk && nameOk!=null && pwdOk!=null && imgOk!=null){
				
				$.ajax({
					url: BASE_PATH+"/toLogin.do",
					type:"post",
					data:{"userName":inputName,"password":inputPassword,"loginVerifyCode":inputCode,"remember":remember},
					dataType: "json",
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					async: false, //设置为同步请求
					success:function(result){//result是服务器返回的JSON结果
						if(result.status==0){//成功
							window.location.href = 'seting.html';				//Nginx服务器使用
							// window.location.href = BASE_PATH+'/seting.html';	//打包使用
							loadingFunction()		//获取用户权限列表,登录成功之后调用
							//获取跳转url
							//							var skip_url = getCookie("skip_url");
							//							if(skip_url != null ){
							//								//有跳转路径
							//								window.location.href= BASE_PATH+'/seting.html';
							//								delCookie("skip_url");
							//							}else{
							//								//没有跳转路径，默认进入主页
							//								window.location.href= BASE_PATH+'/seting.html';
							//							}
							return false;
						}else if(result.status==3){//验证码验证失败
							$("#code_notice").html("<span style='color:red;'>验证码有误,请重新输入</span>");
							$("#clickLoginVerificationCode").click(); //模拟单击事件
							$("#verification").val("").focus();// 清空验证码框内容并获得焦点
							return false;
						}else if(result.status==1){//用户信息验证失败
							imgOk = false;
							pwdOk = false;
							$("#code_notice").html("<span style='color:red;'>您输入的用户名或密码有误,请重新输入</span>");
							$("#clickLoginVerificationCode").click(); //模拟验证码单击事件
							$("#verification").val("");//清除验证码框内容
							$("#password").val("");//清除密码框内容
						}
					},error:function(jqXHR,textStatus,errorThrown){
						alert("对不起,目前系统繁忙,请稍后再试");//服务器系统错误

						//jqXHR参数属性及含义
						console.log('jqXHR.readyState:'+jqXHR.readyState)	//当前状态,0-未初始化，1-正在载入，2-已经载入，3-数据进行交互，4-完成
						console.log('jqXHR.status:'+jqXHR.status)	//返回的HTTP状态码，比如常见的404,500等错误代码。
						console.log('jqXHR.statusText:'+jqXHR.statusText)	//对应状态码的错误信息，比如404错误信息是not found,500是Internal Server Error。
						console.log('jqXHR.responseText:'+jqXHR.responseText)	//服务器响应返回的文本信息
						//textStatus参数属性及含义
						console.log('textStatus:'+textStatus)	//返回的是字符串类型，表示返回的状态，根据服务器不同的错误可能返回下面这些信息：
														//"timeout"（超时）, "error"（错误）, "abort"(中止), "parsererror"（解析错误），还有可能返回空值。
						//errorThrown参数属性及含义
						console.log('errorThrown:'+errorThrown)	//字符串类型，表示服务器抛出返回的错误信息，如果产生的是HTTP错误，那么返回的信息就是HTTP状态码对应的错误信息，
													//比如404的Not Found,500错误的Internal Server Error

						 }
						});
			}else if(nameOk && pwdOk && !imgOk){
				$("#verification").focus();// 焦点移到第一个输入框
				$("#code_notice").html("<span style='color:red;'>验证码不能为空！</span>"); //提示正确用户输入信息
			}else{
				$("#username").focus();// 焦点移到第一个输入框
				$("#code_notice").html("<span style='color:red;'>请输入正确的登录信息</span>"); //提示正确用户输入信息
			}
		});

	//获取用户权限列表,登录成功之后调用
	function loadingFunction() {
		$.ajax({
			type: 'POST',
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			async: false,
			url: queryUserFunctionsUrl,
			data: { userId: USERID },
			success: function (result, status, xhr) {
				if (result.status === 0) {
					functionsList = result.map.functions
				} else {
					swallFail();	//操作失败
				}
			}
		})
	}

	// loadingFunction()

});







