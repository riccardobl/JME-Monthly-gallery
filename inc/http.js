function $http(url,callback,post,is_async){ // callback(success(bool),content(string))
    if(typeof is_async==='undefined')is_async=callback?true:false;    
    var ajax=$_http.createXmlHttp();
    if(!ajax) return false;
    
	ajax.onreadystatechange = function () {
        if(ajax.readyState!=4)return;
		if (ajax.status != 200 && ajax.status != 304) {
            if(callback)callback(false,ajax.responseText);
		}else{
            if(callback)callback(true,ajax.responseText);
        }
	}

    if (post){
        ajax.open("POST",url,is_async);  
        ajax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        ajax.send(post);
    } else{
        ajax.open("GET",url,is_async);  
        ajax.send();
    }
    
    if(!is_async)return ajax.responseText;
    return true;
}

$_http={
    _FACTORY: [
        function(){return new XMLHttpRequest()},
        function(){return new ActiveXObject("Msxml2.XMLHTTP")},
        function(){return new ActiveXObject("Msxml3.XMLHTTP")},
        function(){return new ActiveXObject("Microsoft.XMLHTTP")}
    ],    
    createXmlHttp:function(){
        var xmlhttp = false;
        for (var i=0;i<$_http._FACTORY.length;i++) {
            try {xmlhttp = $_http._FACTORY[i]();}catch(e){continue;}
            break;
        }
        return xmlhttp;
    }
}
