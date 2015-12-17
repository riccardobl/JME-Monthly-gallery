(function ( $ ) {     
    $.fn.autohide = function(elements_to_hide,callback) {
        var bind_to=this;        
        new Waypoint.Inview({
             element: bind_to,
             enter: (function(direction) {
                 for(var i=0;i<this.length;i++){
                     var el=this[i];
                     if(!el)continue;
                     var old_v=el.attr("old-display");
                     if(old_v)el.css("display",old_v);
                     if(callback)callback(el,false);
                 }

             }).bind(elements_to_hide),
             exited: (function(direction) {
                 for(var i=0;i<this.length;i++){
                    var el=this[i];
                    if(!el)continue;
                    var old_v=el.css("display");
                    if(old_v){
                        if(old_v==='none')continue;
                        el.attr("old-display",old_v);
                    }
                    el.css("display","none");
                  if(callback)callback(el,true);
                 }

             }).bind(elements_to_hide)
        });
        return this;
    }; 
  
}( jQuery ));
