<?php
    if(!isset($_REQUEST["target"]))die("CORS Proxy");


    $_ALLOWED_TARGETS=array(
        "/^https?:\/\/hub.jmonkeyengine.org($|\/.*)$/i",
        "/^https?://api.imageresizer.io/v0.1/images($|\/.*)$/i"
    );
    

    $target=$_REQUEST["target"];
    $target=preg_replace("/^(https?)(?:\:\/\/|!)(.+)$/i","$1://$2",$target);
    
    
    $allowed=false;
    
    foreach($_ALLOWED_TARGETS as $regex){
        if(preg_match($regex,$target)){
            $allowed=true;
            break;
        }
    }
    
    if($allowed) {
        $content=file_get_contents($target);
        if(preg_match( "#HTTP/[0-9\.]+\s+([0-9]+)#",$http_response_header[0], $out )){
            http_response_code(intval($out[1]));
        }
        echo $content;
    }else {
        http_response_code(403);
        echo "403";
    }
?>
