RSZioGate=function(){
    this.traverse = function(url,callback){
        $http(this.rewriteUrl(url),callback);
    };
    
    this.rewriteUrl = function(url){
        var pattern="http://{hostname}.rsz.io{path}{query}{A}width=370";
        var u=url.match(/^(?:https?\:)?\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
        if(!u){
            $debug("RSZ.io Gate:",url,"not matched. ??");
            return url;
        }
        $debug("RSZ.io Gate: Hostname: ",u[2],"Port ",u[3]," path: ",u[4]," query: ",u[5]);
        if(u[3]&&(u[3]!==""&&u[3]!=="80"&&u[3]!=="443")){
            $debug("RSZ.io Gate: Port",u[3],"not supported");
            return url;
        }
        if($endWith(u[4],".gif")){
            $debug("RSZ.io Gate: gif not supported");
            return url;
        }
        var new_url=pattern.replace("{hostname}",u[2]).replace("{path}",u[4]?u[4]:"").replace("{query}",u[5]?u[5]:"").replace("{A}",!u[5]||u[5]===""?"?":"&");
        $debug("RSZ.io Gate: New url ",new_url);
        return new_url;
    };
}