UnionGate = function(gates){
    // WIP
    this.rewriteUrl = function(url){
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