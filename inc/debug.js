function $debug(){
    if($_debug.enable){
        var args = Array.prototype.slice.call(arguments);
        var string=args.join(" ");
        $_debug.print(string);
    }
}

function $debugTime(){
    return (new Date()-$_debug.start_time);
}

function $verboseDebug(){
    if($_debug.enable&&$_debug.verbose){
        var args = Array.prototype.slice.call(arguments);
        var string=args.join(" ");
        $_debug.print(string);
    }
}

$_debug={
    start_time:new Date(),
    enable:true,
    verbose:true,
    alert:false,
    print_time:true,
    print:function(string){    
        if($_debug.print_time){
            string="["+$debugTime()+"ms] "+string;
        }
        if(console&&console.log){
            console.log(string);    
        }
        if($_debug.alert){
            alert(string);   
        }
    }
}