ImageParser={
    parse:function(in_content,out_array){
        var pattern=new RegExp("<img\\ss*src\\s*=\\s*\\\\?\"([^\\\\\"]+)",'gi');
        var matched;
        if(matched!=null)$debug(matched[1]);        
        while((matched=pattern.exec(in_content))!=null){    
            if(matched.length>=1){
                var img=matched[1];
                
                // Skip emoji 
                if(img.match(/jmonkeyengine[^/]+\/(?:(?:uploads\/default)|(?:images))\/_?emoji\//)){
                    $debug(img, "is emoji. Skip.");
                    continue;
                }
                
                // Get extension
                var ext=img.split(/[.]/);
                ext=ext[ext.length-1];
                ext=ext.split(/[?#]/)[0];
                
                // Get vars
                var vrs=img.split(/[#]/);
                if(vrs.length>1){
                    vrs=vrs[1];
                    vrs=vrs.split(/[,]/);                    
                }else vrs=[];               
                                
                out_array.push({
                    type:"image/"+ext,
                    value:img,
                    vars:vrs
                });
            }
        }
    }
}


