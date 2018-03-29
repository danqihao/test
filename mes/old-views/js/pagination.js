/**
 * @description:分页js
 * @author jieker
 * 
 * 调用方法
1.按照createPagingMenu()方法内部html结构编写分页静态结构，注意首个div设id属性

2.为分页按钮绑定单击事件
	$(".firstPage,.prePage,.nextPage,.lastPage,.jumpPage").click(clickPaging);  
3.编写事件处理函数
function clickPaging(){

	var $currentObject = $(this);  //获取当前jQuery对象
	var	$pageBox2 = $currentObject.parent().parent().parent(); //获取类 barcon2 jQuery对象
	var	$pageBox1 = $pageBox2.siblings(); //获取类 barcon1 jQuery对象
	
	var pageBoxId = $pageBox2.parent().attr("id");  //获取类 barcon 对应标签元素id
	var currentLines = Number($pageBox1.find(".currentLines").text());  //当前记录数并转成数字
	currentPage = Number($pageBox1.find(".currentPage").text());  //获取当前页转成数字
	
	//防止等待请求响应时按钮还可以点击，把所有按钮设为不可点击
	$("#"+pageBoxId+" input").attr('disabled',true);	
	   
	   if(parentId == "content1-barcon"){
		   pagination(currObj,currentLines,currentPage,pageSize);
		   .... //发送请求获取数据  
	   }else if(parentId == "content2-barcon"){
		   pagination(currObj,currentLines,currentPage,pageSize);
		   .... //发送请求获取数据  
	   }
}
 * */

//分页全局变量
//	var pageSize = 15; //页码1
//	 	pageSize2 = 10; //页码2
//	 	currentPage = 1; //当前页
//	 	headNum=null; //数据列表开始展示的下标

/**
 * 分页函数，功能：1计算分页查询下标,2根据数据返回结果显示分页数据和按钮
 * @Parma objOrId jQuery对象:表示计算下标
 *                分页盒子顶级标签元素id:表示显示分页数据和按钮
 * @Parma line 数据记录条数
 * @Parma currentPage 当前页
 * @Parma pageSize 页码
 * */
function pagination(objOrId,lines,currPage,pageSize){
	var sumPage=null; //总页数
	sumPage = Math.ceil(lines/pageSize); //向上取整,显示数据总共有多少页
	
	if(objOrId instanceof jQuery){  //如果传人的是jQuery对象，表示点击分页按钮，计算下标
		var paging = objOrId.val(); //获取按钮内容
		
		if("首页" == paging){
			headNum = 1;
			currPage = 1; //当前页面为1
		}else if("上一页" == paging){
			headNum = (currPage - 2) *pageSize + 1; 
			currPage -= 1; //当前页面-1
		}else if("下一页" == paging){
			headNum = currPage *pageSize +1; 
			currPage += 1; //当前页面+1 
		}else if("尾页" == paging){
			headNum = (sumPage -1) *pageSize +1;  
			currPage = sumPage; //当前页面=最后一页  
		}else if("跳转" == paging){
			var skipPage = objOrId.parent().siblings().find("option:selected").text();//获取下拉选已选中的text
			skipPage = parseInt(skipPage); //把字符串转成数字
			headNum = (skipPage -1) *pageSize +1;  
			currPage = skipPage; //当前页面=跳转的页面  
		}
		currentPage = currPage;  //计算后的当前页
//		return headNum;
	}else{  // 显示页面共有几条数据，分多少页，当前在第几页 ,显示跟隐藏那些页面按钮

		if(lines != null && lines != "" ){
			var $jumpWhere = $("#"+objOrId+" .jumpWhere"); //分页下拉选jQuery对象
			$jumpWhere.empty(); //清除之前的下拉选页数
			
			var tempStr = "<span>共<span class='currentLines' style='color:#00f;'>"
				+lines+"</span>条记录 &nbsp分<span style='color:#00f;'>"
				+sumPage+"</span>页 &nbsp&nbsp&nbsp&nbsp当前第<span class='currentPage' style='color:#00f;'><b>&nbsp"
				+currPage+"&nbsp</b></span>页</span>" ;
			$("#"+objOrId+" .barcon1").html(tempStr);
			
			for(var i=1; i <= sumPage; i++){ //生成下拉选
				var option = $("<option>").text(i);
				$jumpWhere.append(option);
			}
			
			if( sumPage == 1 && currPage == 1 ){
				$("#"+objOrId+" .barcon2").hide();  //总1页，在第一页，隐藏所有分页按钮
			}
			
			//所有按钮可点击，所有样式移除
			$("#"+objOrId+" input").attr('disabled',false).removeClass("opacity04");
			
			if(sumPage > 1 && currPage == 1){
				//总页数>1，当前在第一页,显示所有按钮
				$("#"+objOrId+" .barcon2").show();
	            //首页和上一页不可点击，添加样式，颜色设暗
				$("#"+objOrId+" .firstPage,#"+objOrId+" .prePage").attr('disabled',true).addClass("opacity04");
				$jumpWhere.val(currPage);//把下拉选内容设置为当前页
			}
			if(sumPage > 1 && currPage > 1 && currPage < sumPage ){
				$("#"+objOrId+" .barcon2").show(); //总页数>1，当前页数大于1，显示所有页面按钮
				$jumpWhere.val(currPage);//把下拉选内容设置为当前页
			}
			if(sumPage > 1 && currPage == sumPage){
				$("#"+objOrId+" .barcon2").show(); //总页数>1，当前在最后一页,显示所有页面按钮
	            //尾页，下一页不可点击，添加样式
				$("#"+objOrId+" .nextPage,#"+objOrId+" .lastPage").attr('disabled',true).addClass("opacity04");
				$jumpWhere.val(currPage);//把下拉选内容设置为当前页
			}
			currentPage = 1; //当前页设为1
		}else{
//			清空提示，隐藏分页
			$("#"+objOrId+" .barcon1").empty();
			$("#"+objOrId+" .barcon2").hide(); 
		}
	}
}


//显示页面共有几条数据，分多少页，当前在第几页 ,显示跟隐藏那些页面按钮

//function paginHitn(parentBarcon,lines,currentPage,pageSize){
//
//}
/**
* 创建分页按钮
* */
//function createPagingMenu(){
//	var h = "";
//	h += "<div id="" class='barcon'>";
//	  h += "<div class='barcon1'></div>";
//	  h += "<div class='barcon2'>";
//		h += "<ul>";
//			h += "<li><input type='button' value='首页' class='firstPage' /></li>";
//			h += "<li><input type='button' value='上一页' class='prePage' /></li>";
//			h += "<li><input type='button' value='下一页' class='nextPage' /></li>";
//			h += "<li><input type='button' value='尾页' class='lastPage' /></li>";
//			h += "<li><select class='jumpWhere' /></li>";
//			h += "<li><input type='button' value='跳转' class='jumpPage' /></li>";
//		h += "</ul>";
//	  h += "</div>";
//	h += "</div>";
//}
