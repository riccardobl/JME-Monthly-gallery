EmbeddedCORSGate=function(){
    this.rewriteUrl = function(url){
        return "/embedded_corsproxy?target="+url;
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