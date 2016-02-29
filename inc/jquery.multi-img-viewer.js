(function ( $ ) { 
    
    $.fn.multiImg = function(images,delay,onsrc,callback) {
        this.filter("img").each(function(){
            var img=$(this);
            img.data("$img_id",0);
            img.data("$imgs",images);
            img.data("$delay",delay);
            img.data("$firstLoop",true);
            img.load(function(){
                $(this).data("$loaded",true);
            });
            img.error(function(){ // Reload if error
                $(this).data("$loaded",false);
                var src= $(this).attr("src");
                $(this).removeAttr("src").attr("src", src);
                $debug("Error while loading [",$(this).attr("id"),"]",$(this).attr("src"),". Reload!");
            });
        //    img.data("$firstDelay",10);

           // img.data("$passed_time",0);
             img.data("$lastUpdate",0);
            img.data("$callback",callback);
            img.data("$onsrc",onsrc);

            img.on("DOMNodeRemoved",function(){
               for(var i=0;i<$.fn.multiImg._queue.length;i++){
                   if($.fn.multiImg._queue[i]===img){
        //                                 $debug("Remove ",i);

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
        
        var start_loop_value=undefined;
        while(finding){
            if($.fn.multiImg._queue.length===0||$.fn.multiImg._queue_id===start_loop_value/*stop if we did a full cycle*/){
                return;    
            }
            if(start_loop_value!==undefined)start_loop_value=$.fn.multiImg._queue_id;
            img=$.fn.multiImg._queue[$.fn.multiImg._queue_id]; 
            
            
            if(img&&document.contains(img[0])){
                finding=false;
            }else{
                 $.fn.multiImg._queue.splice($.fn.multiImg._queue_id,1);
                img=undefined;
            }
            if(img&&(!img[0].complete||!img.data("$loaded"))){ 
                img=undefined;
                finding=false;
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
            img.data("$firstLoop",false);
        }
        
        img.data("$lastUpdate",timestamp);
        img.data("$loaded",false);
        var img_id=img.data("$img_id");
        var old_img_id=img_id;
        var imgs=img.data("$imgs");
        img_id++;
        if(img_id>=imgs.length)img_id=0;
        
        if(!first_loop&&img_id==old_img_id)return;
        img.fadeOut(60,function(){
            // Workaround:
            //   Recreate img when the src is changed
            //   this is required by some browser ( Firefox ) otherwise the imgs
            //   could end up corrupted...
            var new_src=imgs[img_id];
            img.data("$img_id",img_id);        
            new_src=img.data("$onsrc")(new_src);
            
            var new_img=$("<img/>");
            new_img.attr("src",new_src);   
            
            new_img.multiImg( img.data("$imgs"),img.data("$delay"),img.data("$onsrc"),img.data("$callback"));
            for (i = 0; i < img[0].attributes.length; i++){
                var a = img[0].attributes[i];
                if(a.name!=="src")new_img.attr(a.name, a.value);
            }
            new_img.data(img.data());
            
            img.replaceWith(new_img);
            var callback=new_img.data("$callback");
            if(callback)callback(new_src);
            new_img.fadeIn(400);
        });
    };
    setInterval($.fn.multiImg._loop,50);
}( jQuery ));