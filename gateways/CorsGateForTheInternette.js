CorsGateForTheInternette=function(){
    this.traverse = function(url,callback){
        $http(this.rewriteUrl(url),callback);
    };
    
    this.rewriteUrl = function(url){
        return "//cors-gate-for-the-internette.frk.wf/"+url;
    };
}