$fnQueue={
    _QUEUE:[] ,
    sleep:function(ms){
        var actual_ticks=ms/10;
        for(var j=0;j<actual_ticks;j++) $fnQueue._QUEUE.push(null);       
        return $fnQueue;
    },
    enqueue:function(f){
        $fnQueue._QUEUE.push(f);
        return $fnQueue;
    }
    
}

$fnQueue._process=function(){
    if($fnQueue._QUEUE.length>0){
        var x=$fnQueue._QUEUE.shift();
        if(x)x();
    }
}

window.setInterval($fnQueue._process,10);
