VideoParser={
    parse:function(post_vars,in_content,out_array){
        var pattern=new RegExp("<video[^>]+><source\\s*src=\"([^\"]+)",'gi');
        var matched;
        while((matched=pattern.exec(in_content))!=null){    
            if(matched.length>=1){
                var video=matched[1];

                // Get extension
                var ext=video.split(/[.]/);
                video=video[video.length-1];
                video=video.split(/[?#]/)[0];
                
                // Get vars
                var vrs=video.split(/[#]/);
                if(vrs.length>1){
                    vrs=vrs[1];
                    vrs=vrs.split(/[,]/);                    
                }else vrs=[];               
                                
                out_array.push({
                    type:"video/"+ext,
                    value:video,
                    vars:vrs
                });
            }
        }
    }
}