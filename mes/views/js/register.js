// 注册表单验证
$(function() {
//	输入框验证标识
	var flag_name = false; //用户名开关
	var flag_password = false; //密码开关
	var flag_password2 = false; //确认密码开关
//	var flag_email = false; //邮箱开关
	var flag_answer = false; //密保答案开关
	var flag_userRegisterVerificationCode = false; //验证码开关
	var flag_check = false; //同意协议开关

	var userName; //用户名
	var password = "";	//密码
	var affirmPassword; //确认密码
	var secretQuestion; //密保问题
	var secretAnswer = ""; //密保答案
	var userRegisterVerificationCode; //验证码

	var username_reg = /^([\w]|[\u4e00-\u9fa5]){3,16}$/;//用户名正则表达,支持中文、字母、数字、下划线组合，3-16位字符
	var password_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; //密码正则表达式，支持大小写字母、数字组成的6-16位字符,不能纯数字或字母
	var answer_reg = /^([\w\]|[\u4e00-\u9fa5]){1,25}$/;//密保答案正则表达，支持中文、字母、数字、下划线组合，25位以下字符

	// 用户名验证
	$("#username").focus(function() {// 获取焦点
		$("#username_notice").html("<span style='color:rgba(255,255,255,0.7);'>支持中文、字母、数字、下划线组合，3-16位字符</span>");
		$("#bottom_notice").empty(); //清除“请正确输入以上注册信息”提示
		}).blur(function() {// 失去焦点
			userName = $("#username").val();   //获取输入的用户名

			if (!username_reg.test(userName)) {  //验证是否符合正则表达式
				//不符合正则表达
				if(userName == ""){
					//用户什么都没输入,不用提示错误信息
					$("#username_notice").empty();
				}else{
					$("#username_notice").html("<span style='color:#f00;'>请正确输入用户名格式</span>");
				}
				flag_name = false;
			} else {
				//满足正则规范,发送Ajax请求，判断该用户名是否被占用
				$.ajax({url:base_path+"/examineUserName.do",
					type:"post",
					data:{"userName":userName },
					dataType:"json",
					success:function(result){
						switch(result.status){
						 	case 0:{
						 		//用户名可用
						 		$("#username_notice").html("<span style='color: green;'>恭喜:此用户名可用</span>");
						 		flag_name = true;
						    } break;

						    case 1:{
						    	//用户名被占用
						    	$("#username_notice").html("<span style='color:#f00;'>Sorry:此用户名已被占用</span>");
						    	flag_name = false;
						    }break;
						}
					},error:function(){
						alert("对不起,目前系统繁忙,请稍后再试");
					}
				});
			}
		});

	// 密码验证
	$("#password").focus(function() {// 获取焦点
		$("#password_notice").html("<span style='color:rgba(255,255,255,0.7);'>大小写字母、数字组成的6-16位字符</span>");
		$("#bottom_notice").empty(); //清楚“请正确输入以上注册信息”提示
	}).blur(function() {// 失去焦点
		password = $("#password").val();  //获取输入的密码
		if (!password_reg.test(password)) {
			//输入密码不满足正则表达规范
			$("#password_notice").empty();//清除小提示
			if(password != ""){
				//用户有输入密码内容，但不满足规范
				$("#password_notice").html("<span style='color:red;'>密码格式不满足规范 , 请从新输入密码</span>");
			}
			flag_password = false;
		} else {
			$("#password_notice").html("<span  style='color: green;'>OK</span>");
			flag_password = true;
		}
	});

	// 确认密码验证
	$("#confirm_password").focus(function() {// 获取焦点
		$("#confirm_password_notice").html("<span style='color:rgba(255,255,255,0.7);'>请重复输入密码</span>");
		$("#bottom_notice").empty(); //清楚“请正确输入以上注册信息”提示
	}).blur( // 失去焦点
		function() {
			affirmPassword = $("#confirm_password").val();//获取输入的确认密码
			$("#confirm_password_notice").empty();//清除小提示
			if (password != affirmPassword) {
				//两次输入不一致
				if(password != ""){
					//判断有没输入密码，如有输入，则提示错误信息
					$("#confirm_password_notice").html("<span style='color:red;'>密码两次输入不一致，请重新输入</span>");
				}
				flag_password2 = false;
			} else {
				if(password != ""){
					//用户有输入密码
					$("#confirm_password_notice").html("<span  style='color: green;'>OK</span>");
					flag_password2 = true;
				}
			}
	});

/*	// 邮箱验证
	$("#email")
			// 获取焦点
			.focus(function() {
						$("#email_notice").html("<span style='color:rgba(255,255,255,0.7);'>请填写可用的合法性邮箱</span>");
					})
			// 失去焦点
			.blur(function() {
						var inputemail = $("#email").val();//获取输入的邮箱
						var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;//正则，邮箱验证

						 if (!re.test($.trim(inputemail))) {
							$("#email_notice").empty();
							flag_email = false;
						} else {
							var inputPassword = $("#password").val();
							var url = "validateEmail";
							var args = {"email" : $.trim(inputemail),};
							// 向后台发送请求，查询邮箱是否被注册
//							$.post(url,args,function(data) {
//												if ($.trim(data) == "error") {
//													$("#email_notice").html("<span style='color:#f00;'>此邮箱已经被注册，请重新输入</span>");
//													flag_email = false;
//												} else if ($.trim(data) == "success") {
//													$("#email_notice").html("<span style='color:#0f0;'>OK</span>");
//													flag_email = true;
//												}
//											})
							$("#email_notice").html("<span style='color: green;'>OK</span>");
					        flag_email = true;
						}

					});*/


	// 答案验证
	$("#answer").focus(function() {// 获取焦点
		$("#answer_notice").html("<span style='color:rgba(255,255,255,0.7);'>请牢记密保问题,方便以后的使用【中文、字母、数字、下划线组合，25位以下字符】</span>");
		$("#bottom_notice").empty(); //清楚“请正确输入以上注册信息”提示
	}).blur(function() {// 失去焦点
			$("#answer_notice").empty();
			secretAnswer = $("#answer").val();//获取输入的答案

		    if (!answer_reg.test(secretAnswer)) {
		    	if(secretAnswer != ""){
		    		$("#answer_notice").html("<span style='color:red;'>密保答案格式有误,请重新输入</span>");
		    	}
				flag_answer = false;
			} else {
				$("#answer_notice").html("<span  style='color: green;'>OK</span>");
				flag_answer = true;
			}
		});

	// 检查验码验证格式
	$("#verification").focus(function() {// 获取焦点
		$("#bottom_notice").empty(); //清楚“请正确输入以上注册信息”提示
		$("#code_notice").html("<span style='color:rgba(255,255,255,0.7);'>请输入右侧图片4位验证码</span>");
	}).blur(//给验证码框添加焦点移除事件
		function() {
			$("#code_notice").empty();
			userRegisterVerificationCode = $("#verification").val().trim();//获取验证码框内容
			if(userRegisterVerificationCode != ""){
				var code_reg = /^[A-Za-z0-9]{4}$/ ; //大小写字母、数字组成,4个字符
				if(code_reg.test(userRegisterVerificationCode) ){
					//满足正则规范
					flag_userRegisterVerificationCode = true;
				}else{
					$("#code_notice").html("<span style='color:red;'>验证码格式有误,请重新输入</span>");
					flag_userRegisterVerificationCode = false;
				}
			}else{
				flag_userRegisterVerificationCode = false;
			}
		});

	// 验证是否勾选协议
	$("#checkbox1").click(function() {
		if (this.checked) {
			flag_check = true;
		} else {
			flag_check = false;
		}
	});

	// 提交按钮事件
	$("#formButton").click(function() {
		secretQuestion = $("#secretQuestion option:selected").text(); //获取当前选中的密保问题
		//所有验证通过，允许表单提交
		if (flag_name && flag_password && flag_password2 && flag_answer && flag_userRegisterVerificationCode && flag_check) {
			//发送Ajax请求
			$.ajax({url:base_path+"/userRegister.do",
				type:"post",
				data:{"userName":userName, "password":password, "affirmPassword":affirmPassword,
					  "secretQuestion":secretQuestion, "secretAnswer":secretAnswer,
					  "userRegisterVerifyCode":userRegisterVerificationCode },
				dataType:"json",
				success:function(result){
					switch(result.status){
					    case 3:{ //验证码不正确
					    	refreshVerificationCode(); //刷新验证码
							$("#verification").focus(); //验证码输入框获得焦点事件
							$("#code_notice").html("<span style='color:red;'>验证码错误,请重新输入</span>");
					    }break;

					    case 2:{
					    	//用户名不合法，重新输入
					    	refreshVerificationCode(); //刷新验证码
					    	$("#username").focus(); //用户名输入框获得焦点事件
					    	$("#username_notice").html("<span style='color:red;'>非法用户名,请重新输入</span>");
					    } break;

					    case 1:{
					    	//密码不一致
					    	refreshVerificationCode(); //刷新验证码
					    	$("#confirm_password").focus(); //确认密码输入框获得焦点事件
					    	$("#confirm_password_notice").html("<span style='color:red;'>密码两次输入不一致，请重新输入</span>");
					    } break;

					    case 5:{
					    	//密保答案有误
					    	refreshVerificationCode(); //刷新验证码
					    	$("#answer").focus(); //密保答案输入框获得焦点事件
					    	$("#answer_notice").html("<span style='color:red;'>密保答案格式有误,请重新输入</span>");
					    } break;

					    case 0:{
					    	//成功注册
//					    	window.location.href=base_path2+"/successRegister.html"; //跳转至注册成功页面
					    	location.href = "success_register.html";
					    } break;

					    default:{
					    	//不满足以上任何情况
					    	alert("哎呀,目前注册人数过多,请放松下再试");
					    }
					}
				},error:function(){
					alert("对不起,目前系统繁忙,请稍后再试");
				}
			});
		}else if(!flag_name || !flag_password || !flag_password2 || !flag_answer || !flag_userRegisterVerificationCode){
			$("#bottom_notice").html("<span style='color:#f00;'>请正确输入以上注册信息</span>");
		}else if(!flag_check){
			$("#bottom_notice").html("<span style='color:#f00;'>您未同意本网站注册协议</span>");
		}
	});
});
//点检验证码图片切换验证码
$('#verificationCode').attr('src', BASE_PATH + '/verifyCode.do?type=login')
$('#verificationCode').click(function () {
	let tempstr = BASE_PATH + '/verifyCode.do?type=login&x=' + Math.random()
	$(this).attr('src', tempstr)
})

//清空验证码框的内容，并刷新验证码
function refreshVerificationCode(){
	$("#clickUserRegisterVerificationCode").click(); //模拟验证码单击事件,刷新验证码
	$("#verification").val(""); //清空验证码输入框的内容
}
