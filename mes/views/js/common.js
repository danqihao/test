/**
 * @description:通用js
 * @author jieker
 */

$(function () {


	//在页面右上角显示登录的用户名欢迎语
	$("#showUserName").text(getCookie("USERNAME"));

	//给退出系统按钮绑定点击事件
	$("#exitSystem").click(function () {
		swal({
			title: '您确定要退出系统吗？',
			text: '退出后将返回首页',
			type: 'question',
			showCancelButton: true,
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		}).then(function () {
			$.ajax({
				url: BASE_PATH + "/exitLogin.do",
				type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
				// data: {},
				dataType: "json",
				success: function (result) {
					if (result.status == 0) {//退出成功
						//删除本地保存的Cookie
						delCookie("userName");//删除key为userName的属性
						delCookie("UI");	//删除用户ID
						delCookie("UT"); //删除令牌
						delCookie("RP");	//删除用户保存的密码

					}
					//重定向到退出后的页面
					window.location.href = 'logout.html';		//Nginx服务器使用
						// window.location.href = BASE_PATH+'/logout.html';	//打包使用
				},
				error: function () {
					//删除本地保存的Cookie
					delCookie("userName");//删除key为userName的属性
					delCookie("UI");	//删除用户ID
					delCookie("UT"); //删除令牌
					delCookie("RP");	//删除用户保存的密码
					window.location.href = 'logout.html';		//Nginx服务器使用
						// window.location.href = BASE_PATH+'/logout.html';	//打包使用
				}
			});


		});
	});

	// ajax全局设置,用于拦截所有请求并判断是否有权限访问此请求
	$.ajaxSetup({

		complete: function (XMLHttpRequest, status) {
			var res = XMLHttpRequest.responseText;
			var obj = JSON.parse(res);

		// 	(function () {
		//    //过滤出用户没有的权限
		// 		let difference = new Set([...functionsSet].filter(x => !userFunctionsSet.has(x)));
		// 		for (let x of difference) {
		// 			$("." + x + "").remove()	//无权限,删除相关节点
		// 		}
		// 	}())

			if (obj.status === 6) {
				swal({
					title: '您的权限不足!',
					type: 'warning',
					allowEscapeKey: false, // 用户按esc键不退出
					allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
					showCancelButton: false, // 显示用户取消按钮
					confirmButtonText: '确定',
				})
			} else if (obj.status === 9) {
				swal({
					title: '检测到您处于未登录状态',
					text: '即将前去登录页面',
					timer: 3000,
					allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
					onOpen: () => {
						swal.showLoading()
					}
				}).then(
					() => {
					}, (result) => {
						if (result === 'timer') {
							window.location.href = obj.data
						}
					})

			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			swal({
				title: '服务器繁忙',
				text: '请检查网络是否畅通或尝试刷新页面',
				timer: '600',
				type: 'question',
				allowEscapeKey: false, // 用户按esc键不退出
				allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
				showCancelButton: false, // 显示用户取消按钮MesloadBox
			})
		}

	});

});

/**
* @description 用于新增和修改提交发送ajax
* @param  {String} 请求url
* @param  {obj} 请求data
* @param  {modal} 需要关闭的模态框
* @param {function} resolve:Promise回调函数
*/
function submitFun(url, data, modal, resolve) {

	swal({
		title: '您确定要提交本次操作吗?',
		text: '请确保填写信息无误后点击确定按钮',
		type: 'question',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: true, // 显示用户取消按钮
		confirmButtonText: '确定',
		cancelButtonText: '取消',
	}).then(function () {
		$.ajax({
			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
			url: url,
			data: data,
			success: function (result, status, xhr) {
				if (result.status == 0) {
					resolve({
						resolveData: true
					})
					swallSuccess2(modal)  //操作成功
				}
				else if (result.status === 1) {
					if (result.msg !== null) {
						swallFail2(result.msg); //操作失败
					} else {
						swallFail();	//操作失败
					}

				   }
				else {
					swallFail();	//操作失败
				}
			}
		})

	})

}

/**
 * @description 删除数据调用函数
 * @param  {String} 请求url
 * @param  {obj} 请求data
 * @param {function} resolve:Promise回调函数
 */
function removeFun(url, data, resolve) {

	swal({
		title: '您确定要删除此条数据吗？',
		text: '删除后将无法查询',
		type: 'question',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消'
	}).then(function () {
		$.ajax({
			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
			url: url,
			data: data,
			success: function (result, status, xhr) {
				if (result.status == 0) {
					resolve({
						resolveData: true
					})
					swallSuccess2()  //操作成功
				}
				else {
					swallFail();	//操作失败
				}
			}
		})

	})
}

/**
 * 操作成功提示并刷新当前页面
 *@param activePaginationBtn，分页器当前激活按钮,用于刷新页面,如果不需要则传null
 *@param modalCloseBtn，需要关闭的模态框关闭按钮
 */
function swallSuccess(activePaginationBtn, modalCloseBtn) {
	swal({
		title: '操作成功',
		type: 'success',
		timer: '1200',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: false, // 显示用户取消按钮
		showConfirmButton: false, // 显示用户确认按钮
	}).then(
		() => {
		},
		(dismiss) => {
			if (dismiss === 'timer') {
				if (activePaginationBtn !== null && activePaginationBtn !== '' && typeof (activePaginationBtn) !== "undefined") {
					activePaginationBtn.trigger('click') // 模拟点击当前页
				}
				if (modalCloseBtn !== null && modalCloseBtn !== '' && typeof (modalCloseBtn) !== "undefined") {
					$(modalCloseBtn).trigger('click')	//关闭模态框
				}
			}
		})

}

/**
 * 操作成功提示并刷新当前页面
 *@param modal，需要关闭的模态框
 */
function swallSuccess2(modal) {
		swal({
			title: '操作成功',
			type: 'success',
			timer: '1200',
			allowEscapeKey: false, // 用户按esc键不退出
			allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
			showCancelButton: false, // 显示用户取消按钮
			showConfirmButton: false, // 显示用户确认按钮
		}).then(
			() => {
			},
			(dismiss) => {
				if (dismiss === 'timer') {
					if (modal !== null && modal !== '') {
						$(modal).modal('hide')

					}
				}
			})

}

/**
 * 操作失败，请尝试重新操作
 */
function swallFail() {
	swal({
		title: '操作失败，请尝试重新操作',
		type: 'question',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: false, // 显示用户取消按钮
		confirmButtonText: '确定',
	})
}

/**
 * 操作失败，并提示后台返回的失败信息
 */
function swallFail2(title) {
	swal({
		title:title,
		type: 'question',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: false, // 显示用户取消按钮
		confirmButtonText: '确定',
	})
}

/**
 *操作失败，请选择或输入规范的参数
 */
function typeDifference() {
	swal({
		title: '操作失败，请选择或输入规范的参数',
		type: 'question',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: false, // 显示用户取消按钮
		confirmButtonText: '确定',
	})
}

/**
 * 重复使用，请尝试重新操作
 */
function repeatFail() {
	swal({
		title: '名称、编号有重复且正在使用',
		type: 'question',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: false, // 显示用户取消按钮
		confirmButtonText: '确定',
	})
}

/**
 * 提交格式不正确
 */
function swallError() {

	swal({
		title: '数据不完整或格式不正确',
		text: '请检查必填字段数据是否完整或格式是否正确',
		type: 'warning',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: false, // 显示用户取消按钮
		confirmButtonText: '确定',
	})

}


/**
 * 替换表格数据null为"";
 */
;(function replaceNull(){
    $("table").each(function(){
        var td=$(this).find("td");
        $(td).each(function(){
            if($(this).html()=="null"||null){
                $(this).html("");
            }
        });
    });
}())

/**
 * 遍历数组，如果集合中不存在parameter，则添加到集合，否则不添加
 * @param {Arry} list,遍历数组项
 * @param parameter,匹配项
 */
function traverseListPush(list, parameter){
	let isInList = false;

	for (let i = 0,len = list.length; i < len ; i++) {
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
 * @param list {Array},遍历数组项
 * @param parameter,匹配项
 */
function traverseListPush2(list, parameter){
	for (let i = 0, len = list.length; i < len; i++) {
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
	for (let i = 0,len = list.length; i < len ; i++) {
		if(list [i] == parameter){
			list.splice(i,1)
		}
	}

}

/**
 * 数组分页
 * @param currenPage :当前页
 * @param pageSize	:显示页码
 * @param array	:需要分页的数组
 */
function pagination(currenPage, pageSize, array) {
	let index = (currenPage - 1) * pageSize;	//取值下标
	return (index + pageSize >= array.length) ? array.slice(index, array.length) : array.slice(index, index + pageSize);

}

/**
* @description 按下标删除数组内的数据
* @param arry {Array} 传输的数据
* @param index {number} 要删除的下标
*/
function arryUnit(arry, index) {
	// console.dir(arry)
	// console.log(index)
	swal({
		title: '您确定要要移除此项吗?',
		type: 'question',
		allowEscapeKey: false, // 用户按esc键不退出
		allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
		showCancelButton: true, // 显示用户取消按钮
		confirmButtonText: '确定',
		cancelButtonText: '取消',
	}).then(() => {
		arry.splice(index, 1)
		return arry

	})
}

/**
* @description  获取所有权限列表
*/
function getAllFunctions() {
	$.ajax({
		type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
		url: queryFunctionUrl,
		data: { 'type': 'function' },
		success: function (result, status, xhr) {
			if (result.status === 0) {
				let tempArr = [];
				functionsList = result.map.functions
				for (let i = 0, len = functionsList.length; i < len; i++) {
					tempArr.push(functionsList[i].role_function_mark)
				}
				functionsSet = new Set(tempArr)	//把数组转成set提高遍历效率
				// console.log(tempArr)
			} else {
				swallFail();	//操作失败
			}
		}
	})

}

/**
* @description 测试获取用户权限列表
*/
function getUserFunctions() {
	$.ajax({
		type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
		url: queryUserFunctionsUrl,
		data: { userId: 'fa295ab5114f4cef8922c641f97b537a' },
		success: function (result, status, xhr) {
			let tempArr = [];
			if (result.status === 0) {
				userFunctionsList = result.map.functions
				for (let i = 0, len = functionsList.length; i < len; i++) {
					tempArr.push(functionsList[i].role_function_mark)
				}
				userFunctionsSet = new Set(tempArr)
			} else {
				swallFail();	//操作失败
			}
		}
	})
}


/** ---------------------------------------------------模拟设备端发送数据---------------------------------------------*/


//模拟设备端发送数据函数
function startTimer2() {
	let timer2 = setInterval(function () {
		// let tempdata = "[{'device_Id':'5c39458e905411e7966812eb78deb327','device_time':'1513239372000','device_status':'开机','device_unit':'牛','device_param':'下收卷张力实际值','device_param_value':'1400',}]";
		let tempdata = `[{'device_Id':'771f54c4905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数一','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'771f54c4905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数二','device_param_value':'${Math.ceil(Math.random() * 1000)}'}{'device_Id':'771f54c4905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数三','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'771f54c4905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数四','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'771f54c4905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数1','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'771f54c4905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数2','device_param_value':'${Math.ceil(Math.random() * 1000)}'}]`
		$.ajax({
			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
			// url: BASE_PATH + '/gatherParameters.do',
			url: BASE_PATH +'/gatherParametersToSetMap.do',
			data: {
				jointStr: tempdata
			},
			success: function (result, status, xhr) {
				if (result.status === 0) {

				}

			}
		})
	}, 2000)
}
// startTimer2()	//运行此函数即可模拟

//模拟设备端发送数据函数
function startTimer3() {
	let timer2 = setInterval(function () {
		// let tempdata = "[{'device_Id':'5c39458e905411e7966812eb78deb327','device_time':'1513239372000','device_status':'开机','device_unit':'牛','device_param':'下收卷张力实际值','device_param_value':'1400',}]";
		let tempdata = `[{'device_Id':'5c3940f2905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数一','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'5c3940f2905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数二','device_param_value':'${Math.ceil(Math.random() * 1000)}'}{'device_Id':'5c3940f2905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数三','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'5c3940f2905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数四','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'5c393f26905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数1','device_param_value':'${Math.ceil(Math.random() * 1000)}'},{'device_Id':'5c393f26905411e7966812eb78deb327','device_time':'${new Date().getTime()}','device_status':'开机','device_unit':'单位','device_param':'测试参数2','device_param_value':'${Math.ceil(Math.random() * 1000)}'}]`
		$.ajax({
			type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
			url: BASE_PATH + '/gatherParametersToSetMap.do',
			data: {
				jointStr: tempdata
			},
			success: function (result, status, xhr) {
				if (result.status === 0) {

				}

			}
		})
	}, 2000)
}
// startTimer3()	//运行此函数即可模拟


/** ---------------------------------------------------自定义cookie工具方法---------------------------------------------*/

/**
 * 获取cookie里的用户名
 * @param {String} 用户名
 * */
function getCookie(objName) {
	// var cookies = document.cookie.split(";");
	// for(var i=0;i<cookies.length;i++) {
	// var cookie = cookies[i];
	// var cookieStr = cookie.split("=");
	// if(cookieStr && cookieStr[0].trim()==name) {
	// 	return  decodeURIComponent(cookieStr[1]);
	// }
	// }
	var arrStr = document.cookie.split("; ");

	for (var i = 0; i < arrStr.length; i++) {

		var temp = arrStr[i].split("=");

		if (temp[0] == objName) return unescape(temp[1]);

	}
}

	String.prototype.trim = function() {
		return this.replace(/^(\s*)|(\s*)$/g,"");
	}


	function addCookie(objName,objValue,objHours){      //添加cookie

	    var str = objName + "=" + escape(objValue);

	    if(objHours > 0){                               //为时不设定过期时间，浏览器关闭时cookie自动消失

	        var date = new Date();

	        var ms = objHours*3600*1000;

	        date.setTime(date.getTime() + ms);

	        str += "; expires=" + date.toGMTString();

	   }

	   document.cookie = str;

	}



	function SetCookie(name,value)//两个参数，一个是cookie的名子，一个是值
	{

	    var Days = 30; //此 cookie 将被保存 30 天

	    var exp = new Date();    //new Date("December 31, 9998");

	    exp.setTime(exp.getTime() + Days*24*60*60*1000);

	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();

	}

	function delCookie(name)//删除cookie
	{
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=getCookie(name);
	    if(cval!=null) {
	    	document.cookie= name + "="+cval+";expires="+exp.toGMTString()+"; path=/";
	    }
	}





