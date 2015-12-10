MonthlyGallery=function(base_url,cors_proxy){
    this._CURRENT_PAGE=1;
    this._PARSER_MANAGER=new ParserManager();
    this._BASE_URL=base_url;
    this._CORS_PROXY=cors_proxy;
    this._CALLBACK;
    this._OUTPUT=[];
    this.getParserManager=function(){
        return this._PARSER_MANAGER;
    }
    this.get=function(date,callback){ // callback(status(bool),output({})) 
        $debug("Get gallery for",date.month,date.year);
        if(date.year===2013)date.year=undefined;
        var url=this._BASE_URL+date.month+"-"+(date.year?date.year+"-":"")+"monthly-wip-screenshot-thread";
        this._OUTPUT=[];
        this._getNextPage(url);
        this._CALLBACK=(function(){
            this._CURRENT_PAGE=1;
            callback(this._OUTPUT);
        }).bind(this);      
    }
    this._getNextPage=function(base_url){
        var url=base_url+".json?page="+(this._CURRENT_PAGE++);
        $debug(url);
        $http((this._CORS_PROXY?this._CORS_PROXY:"")+url,(function(status,content){
            if(status){
                 var output=this._PARSER_MANAGER.parse(this._BASE_URL,content);
                 this._OUTPUT=this._OUTPUT.concat(output);
                 this._getNextPage(base_url);
            }else this._CALLBACK();
        }).bind(this));       
    }
}



