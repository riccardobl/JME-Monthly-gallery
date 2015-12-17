$import(["Settings.js"],function(){
    $import([
        "style.less",
        "//cdnjs.cloudflare.com/ajax/libs/magic/1.1.0/magic.min.css"

    ],undefined,1);
    
    $import([
        "templates/base.html"
    ],initializeTemplate,2);
            
    $import([
        "inc/function-queue.js",
        "core/Calendar.js",
        "core/ParserManager.js",
        "core/MonthlyGallery.js",

        // JQuery & Plugins
        "//code.jquery.com/jquery-1.11.3.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/shortcuts/inview.min.js",
        "inc/jquery.multi-img-viewer.js",
        
        
        // Import parsers
        "parsers/ImageParser.js" //,
        //"parsers/VideoParser.js", REMOVED
        //"parsers/YoutubeParser.js" REMOVED

    ],$main);
});



GALLERY=null;
GALLERY_ELEMENTS=[];
DATE=0;

CAN_LOAD_TEMPLATE=false;

            /*
                post.author                 (ex. Batman)
                post.created_at             (ex. 2015-12-01T14:30:54.501Z)
                post.updated_at             (ex. 2015-12-01T14:30:54.501Z)
                post.url                    (ex. http://jmonkeyengine/t/XYZ/XYZ)
                post.content[]      
                    post.content[i].type    (ex. image/png)       
                    post.content[i].value   (ex. http://imagehosting/img.png)
                    post.content[i].vars    (ex. exclude,anothervar=possiblevalue,yesItsCsv)                   
            */



function initializeTemplate(){
    if(CAN_LOAD_TEMPLATE){
        $("#fullscreen_view").click(hideFullScreen);
        $("#current_date #left_arrow").click(function(){
            loading(true);
            setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)+1));
        });
        $("#current_date #right_arrow").click(function(){
            loading(true);
            setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)-1));

        });
        


    }else CAN_LOAD_TEMPLATE=true;
}


function $main(){    
    initializeTemplate();
    
    GALLERY=new MonthlyGallery("http://hub.jmonkeyengine.org/t/","http://cors-gate-for-the-internette.frk.wf/");
    GALLERY.getParserManager().addParser(ImageParser);
   // GALLERY.getParserManager().addParser(VideoParser);
    //GALLERY.getParserManager().addParser(YoutubeParser);
    
    setInterval(queryJMEHub, 600000);    

    var urlparts=new RegExp("([A-Z]+)([0-9]+)(?:!([0-9]+))?",'gi').exec(window.location.hash.substring(1));
    if(urlparts&&urlparts.length>1) {
        setDate(Calendar.fromMonthYear(urlparts[1],urlparts[2]));
        
        var topic_id=urlparts[3];
        if(typeof topic_id!=='undefined'){
            $debug("Jump to topic",topic_id);
            // DoJump
        }

    }else setDate(Calendar.fromMonthOffset(0));
    
 
}



/*
function setLazy(ex,callback,unload){
    var lazy=new RegExp("^([A-Z]+)!(.*)$",'gi').exec(ex.attr("lazy"));
    var old= ex.attr(lazy[1]);
    ex.attr("lazy-old-"+lazy[1],old);
    
    var show=function(){ 
        if(ex.attr("lazy-visible"))return;
        ex.hide();
        ex.attr(lazy[1],lazy[2]);
        ex.fadeIn(200);
        ex.attr("lazy-visible",true);
        if(callback) callback(true);    
    };
    
    var hide=function(){
        if(!ex.attr("lazy-visible"))return;
        ex.attr(lazy[1],old);     
        ex.attr("lazy-visible",false);
        if(callback)callback(false);
    }
    
    new Waypoint.Inview({
      element: ex,
      entered: function(direction) {
          $fnQueue.sleep(110).enqueue(show);
      },
      exited: function(direction) {
          if(unload)hide();
      }
    });
}*/

/*
function elementToImage(element){
    if(!element){
        var image=$("<img src='img/blackmonkey.png' >");
        image.appendTo(container);        
    }else if($startWith(element.type,"image/")){        
        var image=$("<img src='img/loading.gif' lazy='src!"+element.value+"'>");  
        image.addClass("loading");

        image.error(function(){
            this.remove();
        });
        setLazy(image,function(){
            image.removeClass("loading");
            image.addClass("loaded");
        });
       // image.addClass("post");
       // image.appendTo(container); 
 c
        return image;
    }
    /*
    else if($startWith(element.type,"youtube")){
     //   var video_preview=$("<div></div>");
    //    video_preview.addClass("video_preview");
      //  video_preview.appendTo(container);               
       // video_preview.click(function() {
       //     var video=$('<iframe src="https://www.youtube.com/embed/'+element.value+'?autoplay=1" frameborder="0"></iframe>');
           // toFullScreen(video);                     
      //  });
        var preview_image=$("<img src='img/blackmonkey.png' lazy='src!http://img.youtube.com/vi/"+element.value+"/hqdefault.jpg' />");
       // preview_image.appendTo(video_preview);
        preview_image.click(function() {
            var video=$('<iframe src="https://www.youtube.com/embed/'+element.value+'?autoplay=1" frameborder="0"></iframe>');
            toFullScreen(video);                    
        });
        return preview_image;

      //  var play_arrow=$("<div></div>");
       // play_arrow.html('<i class="fa fa-play"></i>');
       // play_arrow.appendTo(video_preview);
       // play_arrow.addClass("play_arrow");

    }*/
//}*/

function refreshView(){ 
    loading(true);
    $("#current_date_text").text(DATE.month+" "+DATE.year);
  
    var container=$("#container");
    container.empty();
    
//    var imgs=[];
    
    for(var i=0;i<GALLERY_ELEMENTS.length;i++){
        var post_obj=GALLERY_ELEMENTS[i];  
        var post=$("<div></div>");
        post.addClass("post");
        post.appendTo(container);

        
        var thumbnail=$("<img src='img/loading.gif' />");
        var imgs=[];
        for(var j=0;j<post_obj.content.length;j++){
            var element=post_obj.content[j];
            imgs.push(element.value);
        }
        thumbnail.multiImg(imgs,400);    
        thumbnail.appendTo(post);
        
        //var element=post_obj.content[0]; 
        
        
        
        //var img=elementToImage(element);
        
//        imgs.push(img);      

        //var post=$("<div></div>");
//        post.addClass("post");
//        img.appendTo(post);
//        post.appendTo($("#container"));
        //img.addClass("post");
        //img.appendTo(posts);
    }

//    for(var i=0;i<imgs.length;i++){
//        var img=imgs[i];
//        var post=$("<div></div>");
//        post.addClass("post");
//        img.appendTo(post);
//        post.appendTo($("#container"));
//    }
    loading(false);
}


function setDate(date){
    DATE=date;
    window.location.hash=date.month+""+date.year;
    queryJMEHub();
}

function queryJMEHub(){
    $debug("Query jme hub...")
    GALLERY.get(DATE,function( output){
        GALLERY_ELEMENTS=output;
        if(GALLERY_ELEMENTS)GALLERY_ELEMENTS=GALLERY.shuffle(GALLERY_ELEMENTS);
        refreshView();
    });
}

function hideFullScreen(){
    var fullscreen_view=$("#fullscreen_view");
    fullscreen_view.fadeOut(200,function(){
        $("#fullscreen_view_frame").empty();
    }); 
}

function toFullScreen(element){
    var fullscreen_view=$("#fullscreen_view");
    element.appendTo($("#fullscreen_view_frame"));
    fullscreen_view.fadeIn(200); 
}
