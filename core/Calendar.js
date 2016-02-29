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
    fromMonthYear:function(month_name,year_number){
        return {
            month:month_name.toLowerCase(),
            year: year_number
        }
    },
    fromMonthOffset:function(offset){
        if(typeof offset==='undefined')offset=0;
        var d=new Date();
        
        var yo=Math.floor(offset/12);
        var mo=offset-(yo*12);
        
        var y=d.getFullYear()-yo;
        var m=d.getMonth()-mo;
        if(m<0){
            m=12+m;
            y--;
        }
        var output={
            month: Calendar._MONTHS[m],
            year: y
        }
        
        $debug("Calendar: Offset",offset,"means: ",mo,"months and ",yo,"years ==== ",JSON.stringify(output));
        return output;
    },
    toMonthOffset:function(calendar_date){
        var d=new Date();
        var y=calendar_date.year;
        var m=Calendar._MONTHS.indexOf(calendar_date.month);
        return ((d.getFullYear() - y) * 12) + d.getMonth() - m;
    }
}