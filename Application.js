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
            if($startWith(post.content[j].type,"image/")){
                var img = document.createElement("img");
                img.src = post.content[j].value;
                img.style.maxWidth="400px";
                img.style.maxHeight="300px";
                document.getElementById("middle").appendChild(img);
            }else if(post.content[j].type==="youtube"){
                //Creating div
                var container=$("<div></div>");
                container.css({"background-image":"url('http://img.youtube.com/vi/"+post.content[j].value+"/hqdefault.jpg')"});
                container.addClass("video_container");
                //Creating play button
                var play_arrow=$("<img src='ytarrow.png'>");
                play_arrow.appendTo(container);
                //play_arrow.css({"position":"absolute","left":"150px","top":"125px","width":"100px","height":"75px"});
                play_arrow.addClass("play_arrow");
                container.appendTo($("#middle"));               
                play_arrow.click(function() {
                    //Video iframe
                    var video_frame=$('<iframe id="video_frame" width="100%" height="100%" src="https://www.youtube.com/embed/'+this+'?autoplay=1" frameborder="0"></iframe>');
                    video_frame.appendTo($("#video_popup"));
                    //Showing popup background
                    $("#video_popup_background").fadeIn(200); 
                }.bind(post.content[j].value));
                
                /*document.getElementById("middle").innerHTML+='<a href="https://www.youtube-nocookie.com/embed/'+post.content[j].value+'?rel=0&amp;showinfo=0"> <img src="http://img.youtube.com/vi/"'+post.content[j].value+'"/hqdefault.jpg"></img></a>"';*/
                
                
                /*document.getElementById("middle").innerHTML+='<iframe width="420" height="315" src="https://www.youtube-nocookie.com/embed/'+post.content[j].value+'?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';*/
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
    
    //Video popup
    //Popup background
    var video_popup_background=$("<div id='video_popup_background'></div>"); 
    video_popup_background.appendTo($("#middle"));
    video_popup_background.hide();
    video_popup_background.click(function() {
        video_popup_background.fadeOut(500, function() {
            $("#video_frame").remove();
        }); 
        //video_popup_background.hide();
    });
    //Popup
    var videoPopup=$("<div id='video_popup'></div>");
    videoPopup.appendTo($("#video_popup_background"));   
}

function $main(){
    drawUI();
    GALLERY=new MonthlyGallery("http://hub.jmonkeyengine.org/t/","http://cors-gate-for-the-internette.frk.wf/");
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