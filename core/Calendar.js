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
        d.setMonth(d.getMonth()-offset);
        var output={
            month: Calendar._MONTHS[d.getMonth()],
            year: d.getFullYear()
        }
        return output;
    },
    toMonthOffset:function(calendar_date){
        var today=new Date();
        var d1=new Date(calendar_date.year,Calendar._MONTHS.indexOf(calendar_date.month),1);
        var d2=new Date(today.getFullYear(),today.getMonth(),1);
        var offset=d2.getMonth() - d1.getMonth() + (12 * (d2.getFullYear() - d1.getFullYear()));
        $debug(d2,"-",d1,"=",offset);
        return offset;
    }
}