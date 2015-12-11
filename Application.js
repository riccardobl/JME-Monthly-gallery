$import(["Settings.js"],function(){
    $import([
        "style.less"
    ],undefined,1);

    $import([
        "core/Calendar.js",
        "core/ParserManager.js",
        "core/MonthlyGallery.js",

        // Import parsers
        "//code.jquery.com/jquery-1.11.3.min.js",

        "parsers/ImageParser.js",
        "parsers/VideoParser.js",
        "parsers/YoutubeParser.js"

    ],$main);
});



GALLERY=null;
GALLERY_ELEMENTS=[];
MONTH_OFFSET=0;


function queryGallery(){
    GALLERY.get(Calendar.fromMonthOffset(MONTH_OFFSET),function( output){
        GALLERY_ELEMENTS=output;
        refreshPage();
    });
}

function refreshPage(){ 
    loading(true);
    
    var choosen_date=Calendar.fromMonthOffset(MONTH_OFFSET);
    var title=choosen_date.month+" "+choosen_date.year+" ~ Community WiP Gallery";
    $("#title").text(title);
    document.title = "JMonkeyEngine: "+title;
    
    for(var i=0;i<GALLERY_ELEMENTS.length;i++){
        var post=GALLERY_ELEMENTS[i];          
        for(var j=0;j<post.content.length;j++){            
            if($arrContains(post.content[j],"exclude")){
                $debug("Excluded");
                continue;
            }
            //Creating div
            if($startWith(post.content[j].type,"image/")){
                var preview_container=$("<div></div>");
                var preview_image=$("<img src='"+post.content[j].value+"'>");
                preview_image.css({"max-width":"100%"});
                preview_image.addClass("preview_image");
                preview_image.appendTo(preview_container);
                //preview_container.css({"background-image":"url('"+post.content[j].value+"')"});
                preview_container.addClass("preview_container");  
                preview_container.appendTo($("#middle"));
                preview_container.click(function() {
                    //Video iframe
                    var fullview_frame=$('<img id="fullview_frame" src="'+this+'" width="100%" height="100%">');
                    fullview_frame.appendTo($("#fullsize_popup"));
                    //Showing popup background
                    $("#fullsize_popup_background").fadeIn(200); 
                }.bind(post.content[j].value));
            }else if(post.content[j].type==="youtube"){
                var preview_container=$("<div></div>");
                preview_container.css({"background-image":"url('http://img.youtube.com/vi/"+post.content[j].value+"/hqdefault.jpg')"});
                preview_container.addClass("preview_container");
                preview_container.addClass("preview_image");
                //Creating play button
                var play_arrow=$("<img src='ytarrow.png'>");
                play_arrow.appendTo(preview_container);
                //play_arrow.css({"position":"absolute","left":"150px","top":"125px","width":"100px","height":"75px"});
                play_arrow.addClass("play_arrow");
                preview_container.appendTo($("#middle"));               
                play_arrow.click(function() {
                    //Video iframe
                    var fullview_frame=$('<iframe id="fullview_frame" width="100%" height="100%" src="https://www.youtube.com/embed/'+this+'?autoplay=1" frameborder="0"></iframe>');
                    fullview_frame.appendTo($("#fullsize_popup"));
                    //Showing popup background
                    $("#fullsize_popup_background").fadeIn(200); 
                }.bind(post.content[j].value));
            }  
        }
    }
    loading(false);
}

function drawUI(){
    var top=$("<div id='top'></div>");
    top.appendTo($('body'));
    var bottom=$("<div id='bottom'></div>");
    bottom.appendTo($('body'));
    var middle=$("<div id='middle'></div>");
    middle.appendTo($('body'));
    
    var title=$("<div id='title'></div>");
    title.appendTo(top);
    
    //Full view popup
    //Popup background
    var fullsize_popup_background=$("<div id='fullsize_popup_background'></div>"); 
    fullsize_popup_background.appendTo($("#middle"));
    fullsize_popup_background.hide();
    fullsize_popup_background.click(function() {
        fullsize_popup_background.fadeOut(500, function() {
            $("#fullview_frame").remove();
        }); 
        //fullsize_popup_background.hide();
    });
    //Popup
    var fullsize_popup=$("<div id='fullsize_popup'></div>");
    fullsize_popup.appendTo($("#fullsize_popup_background"));   
}

function $main(){
    drawUI();
    GALLERY=new MonthlyGallery("http://hub.jmonkeyengine.org/t/","https://crossorigin.me/");
    GALLERY.getParserManager().addParser(ImageParser);
    GALLERY.getParserManager().addParser(VideoParser);
    GALLERY.getParserManager().addParser(YoutubeParser);
    
    MONTH_OFFSET=window.location.hash.substring(1);
    queryGallery();
   /// loading(false);
   // refreshPage();
    //$debug("Offset",month_offset);
           
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

    
}