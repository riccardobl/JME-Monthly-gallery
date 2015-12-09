MonthlyGallery=function(base_url,cors_proxy){
    this._PARSER_MANAGER=new ParserManager();
    this._BASE_URL=base_url;
    this._CORS_PROXY=cors_proxy;
    this.getParserManager=function(){
        return this._PARSER_MANAGER;
    }
    this.get=function(date,callback){ // callback(status(bool),output({})) 
        $debug("Get gallery for",date.month,date.year);
        if(date.year===2013)date.year=undefined;
        var url=this._BASE_URL+date.month+"-"+(date.year?date.year+"-":"")+"monthly-wip-screenshot-thread";
        $debug(url);
        $http((this._CORS_PROXY?this._CORS_PROXY:"")+url+".json",(function(status,content){
            if(status){
                var output=this._PARSER_MANAGER.parse(this._BASE_URL,content);
                callback(true,output);
            }else callback(false);
        }).bind(this));                
    }
}



