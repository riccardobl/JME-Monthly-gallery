$import([
    // Import parsers
    "parsers/ImageParser.js"

],$main);


function $main(){
    var month_offset=window.location.hash.substring(1);
    $debug("Offset",month_offset);
    
    var gallery=new MonthlyGallery("http://hub.jmonkeyengine.org/t/","https://crossorigin.me/");
    gallery.getParserManager().addParser(ImageParser);

    gallery.get(Calendar.get(month_offset),function(status, output){
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
                
                
                if($startWith(post.content[j].type,"image")){
                    var img = document.createElement("img");
                    img.src = post.content[j].value;
                    img.style.maxWidth="400px";
                    document.body.appendChild(img);
                }
  
            }
        }
    });
}