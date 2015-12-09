$import([
    // Import parsers
    "parsers/ImageParser.js",
    "parsers/VideoParser.js",
    "parsers/YoutubeParser.js"

],$main);


function $main(){
    var month_offset=window.location.hash.substring(1);
    $debug("Offset",month_offset);
    
    var gallery=new MonthlyGallery("http://hub.jmonkeyengine.org/t/","https://crossorigin.me/");
    gallery.getParserManager().addParser(ImageParser);
    gallery.getParserManager().addParser(VideoParser);
    gallery.getParserManager().addParser(YoutubeParser);

    gallery.get(Calendar.fromMonthOffset(month_offset),function(status, output){
        if(!status){
            $debug("Error!");
            return;
        }
        for(var i=0;i<output.length;i++){
            var post=output[i];  
            
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
            
            for(var j=0;j<post.content.length;j++){
                
                if($arrContains(post.content[j],"exclude")){
                    $debug("Excluded");
                    continue;
                }
                
                
                if($startWith(post.content[j].type,"image/")){
                    var img = document.createElement("img");
                    img.src = post.content[j].value;
                    img.style.maxWidth="400px";
                    document.body.appendChild(img);
                }else if(post.content[j].type==="youtube"){
                    document.body.innerHTML+="<iframe width=\"420\" height=\"315\" src=\"http://www.youtube.com/embed/"+post.content[j].value+"\"></iframe> ";
                }
  
            }
        }
        loadig(false);
    });
}