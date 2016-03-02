ImgurInstrumentGate = function(target_size){
    this.TARGET_SIZE=target_size;
    this.rewriteUrl = function(url){
        var matcher= url.match(/^(https?:\/\/i.imgur.com\/)([^.]+)(\..+)$/);
        if(matcher&&matcher.length==4&&matcher[3]!==".gif"){
            return matcher[1]+matcher[2]+this.TARGET_SIZE+matcher[3];
        }
        return url;
    };
        
    this.traverse = function(url,callback){
        if(callback){
             this.asyncRewriteUrl(url,function(newurl){
                  $http(newurl,callback);
             });
        }else{
            $http(this.rewriteUrl(url));
        }
    };
    
    this.asyncRewriteUrl = function(url,callback){
        callback(this.rewriteUrl(url));
    };
}