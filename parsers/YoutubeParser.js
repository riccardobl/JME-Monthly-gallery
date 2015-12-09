YoutubeParser={
    parse:function(in_content,out_array){    
        var pattern=new RegExp("data-youtube-id=\"([^\"]+)",'gi');
        var matched;
        while((matched=pattern.exec(in_content))!=null){    
            if(matched.length>=1){
                var yt_id=matched[1];

                // No vars support
                
                out_array.push({
                    type:"youtube",
                    value:yt_id,
                    vars:[]
                });
            }
        }
    }
}