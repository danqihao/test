function getCookie(name) {
   var cookies = document.cookie.split(";");
   for(var i=0;i<cookies.length;i++) {
    var cookie = cookies[i];
    var cookieStr = cookie.split("=");
    if(cookieStr && cookieStr[0].trim()==name) {
     return  decodeURIComponent(cookieStr[1]);
    }
   }
 }


String.prototype.trim = function() {
	return this.replace(/^(\s*)|(\s*)$/g,"");
}








//获得coolie 的值
//function cookie(name){    
//
//   var cookieArray=document.cookie.split("; "); //得到分割的cookie名值对    
//
//   for (var i=0;i<cookieArray.length;i++){    
//
//      var arr=cookieArray[i].split("=");       //将名和值分开    
//
//      if(arr[0]==name)return unescape(arr[1]); //如果是指定的cookie，则返回它的值    
//
//   } 
//
//   return ""; 
//
//} 

 

/*function delCookie(name)//删除cookie

{

   document.cookie = name+"=;expires="+(new Date(0)).toGMTString();

}*/


/*
//cookie操作函数 
function getCookie(name) { 
var start = document.cookie.indexOf(name+"="); 
var len = start+name.length+1; 
if ((!start) && (name != document.cookie.substring(0,name.length))) return null; 
if (start == -1) return null; 
var end = document.cookie.indexOf(";",len); 
if (end == -1) end = document.cookie.length; 
return decodeURI(document.cookie.substring(len,end)); 
} 


function SetCookie(name,value,expires,path,domain,secure) { 
expires = expires * 60*60*24*1000; 
var today = new Date(); 
var expires_date = new Date( today.getTime() + (expires) ); 
var cookieString = name + "=" +escape(value) + 
( (expires) ? ";expires=" + expires_date.toGMTString() : "") + 
( (path) ? ";path=" + path : "") + 
( (domain) ? ";domain=" + domain : "") + 
( (secure) ? ";secure" : ""); 
document.cookie = cookieString; 
}
*/




//function getCookie(objName){//获取指定名称的cookie的值
//
//    var arrStr = document.cookie.split("; ");
//
//    for(var i = 0;i < arrStr.length;i ++){
//
//        var temp = arrStr[i].split("=");
//
//        if(temp[0] == objName) return unescape(temp[1]);
//
//   } 
//
//}

 

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

/*function getCookie(name)//取cookies函数        

{

    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));

     if(arr != null) return unescape(arr[2]); return null;

 

}*/

function delCookie(name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) {
    	document.cookie= name + "="+cval+";expires="+exp.toGMTString()+"; path=/";
    }
}


