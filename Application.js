$import(["Settings.js"],function(){
    $import([
        "style.less"
    ],undefined,1);
    
    $import([
        "templates/base.html"
    ],initializeTemplate,2);
            
    $import([
        "core/Calendar.js",
        "core/ParserManager.js",
        "core/MonthlyGallery.js",

        "//code.jquery.com/jquery-1.11.3.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js",
        
        // Import parsers
        "parsers/ImageParser.js",
        "parsers/VideoParser.js",
        "parsers/YoutubeParser.js"

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
            setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)-1));
        });
        $("#current_date #right_arrow").click(function(){
            loading(true);
            setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)+1));

        });
    }else CAN_LOAD_TEMPLATE=true;
}


function $main(){
    initializeTemplate();
    
    GALLERY=new MonthlyGallery("http://hub.jmonkeyengine.org/t/","http://cors-gate-for-the-internette.frk.wf/");
    GALLERY.getParserManager().addParser(ImageParser);
    GALLERY.getParserManager().addParser(VideoParser);
    GALLERY.getParserManager().addParser(YoutubeParser);
    
    setInterval(queryJMEHub, 600000);    

    var urlparts=new RegExp("([A-Z]+)([0-9]+)(?:\!([0-9]+))?",'gi').exec(window.location.hash.substring(1));
    if(urlparts&&urlparts.length>1) setDate(Calendar.fromMonthYear(urlparts[1],urlparts[2]));
    else setDate(Calendar.fromMonthOffset(0));
    
    var topic_id=urlparts[3];
    if(typeof topic_id!=='undefined'){
        $debug("Jump to topic",topic_id);
        // DoJump
    }

}

function drawPost(post_obj){
    var container=$("#middle");
    
    var post_container=$("<div></div>");
    post_container.addClass("post_container");
    post_container.appendTo(container);
    
    var post=$("<div></div>");
    post.addClass("post");
    post.appendTo(post_container);

    var elements_container=$("<div></div>");
    elements_container.addClass("elements");
    elements_container.appendTo(post);

    drawElements(elements_container,post_obj.content);
}

function drawElements(container,elements){
    for(var j=0;j<elements.length;j++){    
        if($arrContains(elements[j].vars,"exclude")){
            $debug("Excluded");
            continue;
        }
        
        var element_container=$("<div></div>");
        element_container.addClass("element");
        element_container.appendTo(container);

                
        var valigner=$("<span></span>");
        valigner.addClass("valigner");
        valigner.appendTo(element_container);

        drawElement(element_container,elements[j]);

    }
}

function drawElement(container,element){
    if($startWith(element.type,"image/")){        
        var image=$("<img src='' data-original='"+element.value+"'>");
        image.appendTo(container); 
        image.click(function(){toFullScreen(image.clone()); });
        image.lazyload({
            effect : "fadeIn"
        });
    }else if($startWith(element.type,"youtube")){
        var video_preview=$("<div></div>");
        video_preview.addClass("video_preview");
        video_preview.appendTo(container);               
        video_preview.click(function() {
            var video=$('<iframe src="https://www.youtube.com/embed/'+element.value+'?autoplay=1" frameborder="0"></iframe>');
            toFullScreen(video);                    
        });
        var preview_image=$("<img src='' data-original='http://img.youtube.com/vi/"+element.value+"/hqdefault.jpg' />");
        preview_image.appendTo(video_preview);
        preview_image.lazyload();
        //Creating play button
        //var play_arrow=$("<img src='ytarrow.png'>");
        //play_arrow.appendTo(video_preview);
        //play_arrow.addClass("play_arrow");

    }
}

function refreshView(){ 
    loading(true);
    $("#current_date_text").text(DATE.month+" "+DATE.year);

    $("#middle").empty();
    
    for(var i=0;i<GALLERY_ELEMENTS.length;i++){
        var post=GALLERY_ELEMENTS[i];   
        drawPost(post);
    }
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
