Calendar={
    _MONTHS:[
        "january", 
        "february", 
        "march", 
        "april", 
        "may", 
        "june",
        "july", 
        "august", 
        "september", 
        "october", 
        "november", 
        "december"
    ],
    get:function(offset){
        if(typeof offset==='undefined')offset=0;
        var d=new Date();
        d.setMonth(d.getMonth()-offset);
        var output={
            month: Calendar._MONTHS[d.getMonth()],
            year: d.getFullYear()
        }
        return output;
    }
}