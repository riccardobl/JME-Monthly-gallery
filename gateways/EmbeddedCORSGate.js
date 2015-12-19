EmbeddedCORSGate=function(){
    this.traverse = function(url,callback){
        $http(this.rewriteUrl(url),callback);
    };
    
    this.rewriteUrl = function(url){
        return "/embedded_corsproxy?target="+url;
    };
}