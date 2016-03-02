ImageResizerIOGate=function(width,corsproxy){
    this.WIDTH=width;
    this.traverse = function(url,callback){
        $http(this.rewriteUrl(url),callback);
    };
    
    this.rewriteUrl = function(url){
        if(!/^https?\:?\/\//.test(url))url="http:"+url;
        var reply=JSON.parse($http(corsproxy.rewriteUrl("http://api.imageresizer.io/v0.1/images?url="+url)));
        if(reply.success){
            url="http://img.imageresizer.io/"+reply.response.id+"?width="+this.WIDTH;
        }
        return url;
    };
    
     this.asyncRewriteUrl = function(url,callback){
        if(!/^https?\:?\/\//.test(url))url="http:"+url;
        $http(corsproxy.rewriteUrl("http://api.imageresizer.io/v0.1/images?url="+url),function(status,data){
            if(status){
                var reply=JSON.parse();
                if(reply.success){
                    url="http://img.imageresizer.io/"+reply.response.id+"?width="+this.WIDTH;
                }
            }
            callback(url);            
        });
    };
}