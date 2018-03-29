//页面加载完毕后执行以下代码
$(function(){
	//用户名输入框获得焦点
	$("#password").focus();
	
});
//注册表单验证
$(function() {
	var newPasswordOK = false; //密码开关
	var affirmNewPasswordOK = false; //确认密码开关
	var newPassword = ""; //密码
	var affirmNewPassword = ""; //确认新密码
	
	var password_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; //密码正则表达式，支持大小写字母、数字组成的6-16位字符,不能纯数字或字母

	
	//密码框绑定焦点移除以及获取焦点事件	
	$("#password").focus(function(){
		//获取焦点事件
		//显示小提示
		$("#password_notice").html("<span style='color:rgba(255,255,255,0.7);'>大小写字母、数字组成的6-16位字符</span>");
		//当用户点击密码框时，清楚确认密码框的提示
		$("#confirm_password_notice").empty();
		}).blur(function(){ // 失去焦点事件
			//获取密码框内容
			newPassword = $("#password").val();
			 if (!password_reg.test(newPassword)) {
				 //输入密码不满足正则表达规范
				$("#password_notice").empty();//清除小提示
				newPasswordOK = false;
				if(newPassword != ""){
					//用户有输入密码内容，但不满足规范
					$("#password_notice").html("<span style='color:red;'>密码格式不满足规范 , 请从新输入新密码</span>");
				}
			} else {
				$("#password_notice").html("OK").css({color : "green"});
				newPasswordOK = true;
			}

		});
	
	// 密码确认验证
	$("#confirm_password").focus(function() {// 获取焦点事件
		//显示小提示
		$("#confirm_password_notice").html("<span style='color:rgba(255,255,255,0.7);'>请重复输入密码</span>");
		
		}).blur(function(){//失去焦点
			//获取确认密码框内容
			affirmNewPassword = $("#confirm_password").val();
			//清除小提示
			$("#confirm_password_notice").empty();
			
			if(newPassword != affirmNewPassword){
				affirmNewPasswordOK = false;
				if(newPassword != "" && newPasswordOK){
					//两次密码不一致
					$("#confirm_password_notice").html("两次输入密码不一致，请重新输入").css({color : "red"});
				}
			}else if(newPassword != "" && newPasswordOK){
				if(newPassword == affirmNewPassword){
					//两次输入一致
					$("#confirm_password_notice").html("密码正确").css({color : "green"});
					affirmNewPasswordOK = true;
				}
			}
		});

	// 所有验证通过后，允许表单提交
	$("#formButton").click(function(){
		if(newPassword == ""){
			$("#password_notice").html("<span style='color:#f00;'>请输入新密码</span>");
		} else if (affirmNewPassword == "") {
			$("#confirm_password_notice").html("<span style='color:#f00;'>请输入确认密码</span>");
		} else if (newPasswordOK && affirmNewPasswordOK) {
			var userName = getCookie("userName"); //获取用户名
			var ConfirmAccountToken = getCookie("confirmAccountToken"); //获取Token
			
			if (confirm("确定要把密码修改为此密码吗")) {
				//密码两次输入相同,发送AJAX请求
				$.ajax({url:base_path+"/modifyPassword.do",
					type:"post",
					data:{"userName":userName,"ConfirmAccountToken":ConfirmAccountToken,
							"newPassword":newPassword ,"affirmNewPassword":affirmNewPassword },
					dataType:"json",
					success:function(result){
						switch(result.status){
						    case 2:{ //未账户认证,跳转至账户认证页
//						    	window.location.href="../confirmAccount.html";
						    	window.location.href=base_path2+"/confirmAccount.html";
						    }break;
						    
						    case 1:{ //非法密码个数
						    	$("#password_notice").html("<span style='color:#f00;'>请输入新密码</span>");
						    	$("#confirm_password_notice").html("<span style='color:#f00;'>请输入确认密码</span>");
						    	alert("非法密码格式,请正确输入");
						    } break;

						    case 3:{ //密码两次输入不一致
						    	$("#confirm_password_notice").html("两次输入密码不一致，请重新输入").css({color : "red"});
						    	alert("两次输入密码不一致，请重新输入");
						    } break;
						    
						    case 4:{ //密码修改失败
						    	alert("【密码修改失败】 请稍后再试");
						    } break;
						    
						    case 0:{ //密码修改成功
						    	//删除本地存储Cookie
						    	delCookie("userName");
						    	delCookie("confirmAccountToken");
						    	delCookie("RP");
//						    	alert("【密码修改成功】");
//						    	window.location.href=base_path+"/login.do";
						    	window.location.href=base_path2+"/success_modPwd.html";
						    } break;
						}
					},error:function(){
						alert("对不起,目前系统繁忙,请稍后再试");
					}
				});
			}else {
				return;
			}

		}

	});//
	//回车提交事件
	$("#confirm_password").keydown(function(){
	    if (event.keyCode == "13") {//keyCode=13是回车键
	    	$("#confirm_password").blur(); //为了让验证码能够通过前端js验证，先把焦点移出
	    	$("#formButton").click();//调用提交按钮
	    }
	}); 
	
});