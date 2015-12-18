DirectGate = function(){
    this.traverse = function(url,callback){
        $http(url,callback);
    };
    
    this.rewriteUrl = function(url){
        return url;
    };
}