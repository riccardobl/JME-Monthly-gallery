function $debug(){
    if($_debug.enable){
        var args = Array.prototype.slice.call(arguments);
        var string=args.join(" ");
        if(typeof console!=='undefined'){
            console.log(string);    
        }
    }
}

$_debug={
    enable:true
}