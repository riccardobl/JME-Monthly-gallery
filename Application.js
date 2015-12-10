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
                document.getElementById("middle").appendChild(img);
            }else if(post.content[j].type==="youtube"){
                document.getElementById("middle").innerHTML+='<iframe width="420" height="315" src="https://www.youtube-nocookie.com/embed/'+post.content[j].value+'?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';
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