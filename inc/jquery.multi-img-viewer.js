(function ( $ ) { 
    $.fn.multiImg = function(images,delay,callback) {
        this.filter("img").each(function(){
            var img=$(this);
            img.data("$img_id",0);
            img.data("$imgs",images);
            img.data("$delay",delay);
            img.data("$firstLoop",true);
            img.data("$passed_time",0);
            img.data("$callback",callback);

            $.fn.multiImg._queue.push(img);
        });
        return this;
    }; 
    $.fn.multiImg._queue=[];
    $.fn.multiImg._queue_id=0;
    $.fn.multiImg._loop=function(){
        if($.fn.multiImg._queue.length==0)return;    
        var img=$.fn.multiImg._queue[$.fn.multiImg._queue_id++];                
        if($.fn.multiImg._queue_id>=$.fn.multiImg._queue.length)$.fn.multiImg._queue_id=0;
            
        var first_loop=img.data("$firstLoop");
        
        var ptime=img.data("$passed_time");
        if(!first_loop){
            if(ptime+200<img.data("$delay")){
                img.data("$passed_time",ptime+200);
                return;
            }
        }else{
            img.data("$firstLoop",false);
        }
        
        img.data("$passed_time",0);
        
        var img_id=img.data("$img_id");
        var old_img_id=img_id;
        var imgs=img.data("$imgs");
        img_id++;
        if(img_id>=imgs.length)img_id=0;
        
        if(!first_loop&&img_id==old_img_id)return;
        img.fadeOut(100,function(){
            var new_src=imgs[img_id];
            img.data("$img_id",img_id);
            img.attr("src",new_src);   
            var callback=img.data("$callback");
            if(callback)callback(new_src);
            img.fadeIn(1000);
            $debug("Set new src ",imgs[img_id],"[",img_id,"]");
        });
    };
    setInterval($.fn.multiImg._loop,200);
}( jQuery ));