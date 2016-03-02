CorsGateForTheInternette=function(){
    this.rewriteUrl = function(url){
        return "//cors-gate-for-the-internette.frk.wf/"+url;
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