(function ( $ ) { 
    
    $.fn.multiImg = function(images,delay,callback) {
        this.filter("img").each(function(){
            var img=$(this);
            img.data("$img_id",0);
            img.data("$imgs",images);
            img.data("$delay",delay);
            img.data("$firstLoop",true);
        //    img.data("$firstDelay",10);

           // img.data("$passed_time",0);
             img.data("$lastUpdate",0);
            img.data("$callback",callback);
            img.on("DOMNodeRemoved",function(){
               for(var i=0;i<$.fn.multiImg._queue.length;i++){
                   if($.fn.multiImg._queue[i]===img){
                                         debug("Remove ",i);

                        break;
                   }
               } 
            });
            $.fn.multiImg._queue.push(img);
        });
        return this;
    }; 
    $.fn.multiImg._queue=[];
    $.fn.multiImg._queue_id=0;
    $.fn.multiImg._loop=function(){
 
        var finding=true;
        var img;
        
        while(finding){
            if($.fn.multiImg._queue.length==0)return;    
            img=$.fn.multiImg._queue[$.fn.multiImg._queue_id];         
            if(img&&document.contains(img[0])){
                finding=false;
            }else{
                 $.fn.multiImg._queue.splice($.fn.multiImg._queue_id,1);
                img=undefined;
            }
            if(!img[0].complete){
                $debug("Skip ",img.src," because it's still loading...");
                img=undefined;
            }
            $.fn.multiImg._queue_id++;
            if($.fn.multiImg._queue_id>=$.fn.multiImg._queue.length)$.fn.multiImg._queue_id=0;
        }
        
        if(!img)return;
        var timestamp=new Date().getTime();
        var first_loop=img.data("$firstLoop");        
        if(!first_loop){
            if(timestamp-img.data("$lastUpdate")<img.data("$delay")) return;
        }else{
            //if( img.data("$firstDelay")!=0){
            //    img.data("$firstDelay", img.data("$firstDelay")-1);
            //    return;
            //}
            img.data("$firstLoop",false);
        }
        
        img.data("$lastUpdate",timestamp);
        
        var img_id=img.data("$img_id");
        var old_img_id=img_id;
        var imgs=img.data("$imgs");
        img_id++;
        if(img_id>=imgs.length)img_id=0;
        
        if(!first_loop&&img_id==old_img_id)return;
        img.fadeOut(60,function(){
            var new_src=imgs[img_id];
            img.data("$img_id",img_id);
            img.attr("src",new_src);   
            var callback=img.data("$callback");
            if(callback)callback(new_src);
            img.fadeIn(400);
           // $debug("Set new src ",imgs[img_id],"[",img_id,"]");
        });
    };
    setInterval($.fn.multiImg._loop,50);
}( jQuery ));