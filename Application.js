$import(["Settings.js"],function(){
    $import([
        "styles/fonts.less",
        "styles/structure.less",
        "styles/thumbnails.less",
        "styles/post.less"
    ],undefined,1);
            
    $import([
        "gateways/DirectGate.js",
        "gateways/CorsGateForTheInternette.js",
        "gateways/EmbeddedCORSGate.js",

        "inc/function-queue.js",
        "core/Calendar.js",
        "core/ParserManager.js",
        "core/MonthlyGallery.js",

        "inc/tp/modernizr-custom.js",
        
        // JQuery & Plugins
        "//code.jquery.com/jquery-1.11.3.min.js",
        "inc/jquery.multi-img-viewer.js",
        "//cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/shortcuts/inview.min.js",
        "//gist.githubusercontent.com/johan/2128691/raw/b81d1b59fd98091a1a2c8814f77660a10a9b0e16/jquery.fullscreen.js",
        "//raw.githubusercontent.com/iamceege/tooltipster/28fa8412cc1ae89de13c0d4d9fa30e1874e9d397/js/jquery.tooltipster.min.js",
        "//raw.githubusercontent.com/iamceege/tooltipster/28fa8412cc1ae89de13c0d4d9fa30e1874e9d397/css/tooltipster.css",
        "inc/jquery.autohide.js",

        // Parsers
        "parsers/ImageParser.js" //,
        //"parsers/VideoParser.js", REMOVED
        //"parsers/YoutubeParser.js" REMOVED

    ],$main);
});

$IS_RELEASED=document.domain==="release.jme-monthly-gallery.frk.wf";


GALLERY=null;
GALLERY_ELEMENTS=[];
IMAGES_GATEWAY=null;
DATE=0;


function $main(){     
    $_debug.enable=!$IS_RELEASED;
    

    // Init template
    $('.tooltip').tooltipster();
    $("#current_date #left_arrow").click(function(){
        if($(this).hasClass("disabled"))return;
        closePost();
        loading(true);
        setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)+1)); 
    });
    $("#current_date #right_arrow").click(function(){
        if($(this).hasClass("disabled"))return;
        closePost();
        loading(true);
        setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)-1));
    });        
    $http("https://api.github.com/repos/riccardobl/JME-Monthly-gallery/contributors",function(status,content){
        if(status){
            var contributors=[];
            var parsed_content=JSON.parse(content);
            for(var i=0;i<parsed_content.length;i++){
                var username=parsed_content[i].login;
                if(username==="riccardobl")continue;
                var link=parsed_content[i].html_url;
                $http("https://api.github.com/users/"+username,(function(status,content){
                    if(status){
                        var parsed_content=JSON.parse(content);
                        var name=parsed_content.name;
                        if(name===null){
                            name=parsed_content.login;
                        }
                        var link=this;
                        var dom_el=$("<a href='"+link+"' target='_blank'>"+name+"</a>");
                        $("#contributors").append(dom_el);
                    }
                }).bind(link));
            }
        }
    });
    
    
    // Init gallery    
    IMAGES_GATEWAY=new DirectGate();      
    GALLERY=new MonthlyGallery("http://hub.jmonkeyengine.org/t/",$IS_RELEASED?new EmbeddedCORSGate():new CorsGateForTheInternette());
    GALLERY.getParserManager().addParser(ImageParser);
   // GALLERY.getParserManager().addParser(VideoParser); REMOVED
    //GALLERY.getParserManager().addParser(YoutubeParser); REMOVED
    
    var vars=URI();    
    setDate(vars.month&&vars.year?Calendar.fromMonthYear(vars.month,vars.year):Calendar.fromMonthOffset(0));   

}

function URI(data){
    if(!data){    
        var hashes=window.location.hash.substring(1);
        var urlparts=new RegExp("([A-Z]+)([0-9]+)(?:!([0-9]+))?",'gi').exec(hashes);
        if(!urlparts)return {};
        return {
            month:urlparts[1],
            year:urlparts[2],
            post_id: urlparts[3]
        }
    }else{
        var current_vars=URI();
        var keys=Object.keys(data);
        for(var i=0;i<keys.length;i++)current_vars[keys[i]]=data[keys[i]];
        window.location.hash=current_vars.month+current_vars.year+(current_vars.post_id?"!"+current_vars.post_id:"");
    }
}


function refreshThumbnailsView(){    
    var container=$("#thumbnails");
    container.empty();
    
    var l=GALLERY_ELEMENTS.length;    
    for(var i=0;i<l;i++){
        var post=$("<div></div>");
        post.addClass("thumbnail_container");
        post.appendTo(container);

        var post_obj=GALLERY_ELEMENTS[i];  
        if(!post_obj)continue;
              
        if(Modernizr.cssfilters){
            var bgimg=$("<img id='blur_img_"+post_obj.post_id+"' />");
            bgimg.addClass("bgimg");
            bgimg.appendTo(post);
        }

        var aligner=$("<span></span>");
        aligner.addClass("aligner");
        aligner.appendTo(post);
        
        var thumbnail=$("<img id='thumbnail_"+post_obj.post_id+"' src='img/loading.gif' />");
        thumbnail.addClass("thumbnail");       
        thumbnail.addClass("loading");
        
        var imgs=[];
        for(var j=0;j<post_obj.content.length;j++){
            var element=post_obj.content[j];
            element.value=IMAGES_GATEWAY.rewriteUrl(element.value);
            imgs.push(element.value);
        }
        thumbnail.appendTo(post);

        thumbnail.multiImg(imgs,400,(function(new_src){
            var post=this[0];
            var post_obj=this[1];
            post.find(".thumbnail").each(function(){
                $(this).removeClass("loading");
            }); 
            post.find(".bgimg").each(function(){
                var bgimg=$(this);
                bgimg.attr("src",new_src);

            });           
        }).bind([post,post_obj]));            
            
        var infobox=$("<div class='infobox'></div>");
        infobox.appendTo(post);

        var author=$("<div class='author'></div>");
        author.html("<span>"+post_obj.author+"</span>");
        author.appendTo(infobox);
        
        var likes=$("<div class='likes'></div>");
        likes.html("<span>"+post_obj.likes+"</span><img src='img/banana.svg' />");
        likes.appendTo(infobox);
        
        post.click((function(){
            openPost(this);
        }).bind(post_obj));

    }
}

function refreshPostView(){    
    var vars=URI();
    var l=GALLERY_ELEMENTS.length;    
    for(var i=0;i<l;i++){
        var post_obj=GALLERY_ELEMENTS[i];  
        if(typeof vars.post_id!=='undefined'){
            if(post_obj.post_id==vars.post_id){
                openPost(post_obj);
                return true;
            }
        }
    }    
    return false;
}

function refreshView(){ 
    loading(true);
    $("#current_date_text").text(DATE.month+" "+DATE.year);
    if(!refreshPostView()) refreshThumbnailsView(); 
    loading(false);
}

function setDate(date){
    DATE=date;
    URI({
        month:date.month+"",
        year: date.year+""
    });
    if(Calendar.toMonthOffset(date)===0){
        $("#current_date #right_arrow").addClass("disabled");
    }else{
        $("#current_date #right_arrow").removeClass("disabled");                                              
    }
    queryJMEHub();
}

function queryJMEHub(){
    $debug("Query jme hub...")
    GALLERY.get(DATE,function( output){
        GALLERY_ELEMENTS=output;
        if(GALLERY_ELEMENTS)GALLERY_ELEMENTS=GALLERY.shuffle(GALLERY_ELEMENTS);
        refreshView();
    });
}

function closePost(do_not_edit_url){
    var container=$("#post");
    container.empty();
    container.fadeOut(200);
    $("#thumbnails").fadeIn(200);
    
    if(!do_not_edit_url){
        URI({
            post_id:undefined
        });
        scrollTop();
        refreshView();
    }

}


function scrollTop(){
    $("body").scrollTop(0);
}


function openPost(post_obj){
    scrollTop();
    URI({post_id:post_obj.post_id+""});
    closePost(true);
    var container=$("#post");
    var image_container=$("<div></div>");
    image_container.addClass("content_container left");
    var description_container=$("<div></div>");
    description_container.addClass("content_container right");
    var post_clearer=$("<div></div>");
    post_clearer.css({"clear":"both"});
    image_container.appendTo(container);
    description_container.appendTo(container);
    post_clearer.appendTo(container);
    $("#thumbnails").fadeOut(200,function(){
        var elements=post_obj.content;
        //Titles title
        var author_title=$("<div class='title_text'>Author:</div>)");
        var date_title=$("<div class='title_text'>Posted on:</div>)");
        var message_title=$("<div class='title_text'>Original message:</div>)");
        //Author text
        var author_text=$("<div class='text'>"+post_obj.author+"</div>)");
        var date_text=$("<div class='text'>"+post_obj.created_at+"</div>)");
        var message_text=$("<div class='text'>"+post_obj.message.substring(0,100).trim()+"...</div>)");
        var original_post_link=$("<a href='"+post_obj.url+"'>continue reading</a>");
        message_text.find("img").remove();
        //Appending elements
        author_title.appendTo(description_container);
        author_text.appendTo(description_container);
        date_title.appendTo(description_container);
        date_text.appendTo(description_container);
        message_title.appendTo(description_container);
        message_text.appendTo(description_container);
        original_post_link.appendTo(description_container);
        for(var i=0;i<elements.length;i++){
            var img=$("<img id='wip_img_"+post_obj.post_id+"_"+i+"' src='img/loading.gif' />");
            img.addClass("posts_preview");
            img.attr("src",elements[i].value);
            img.appendTo(image_container);        
            img.click(function(){
                //Fix me
              if($(this).requestFullScreen){
                  var fullscreen_div=$("<div></div>");
                  fullscreen_div.css({height:"100%",width:"100%"});
                  var fullscreen_img=$(this).clone();
                  fullscreen_img.appendTo(fullscreen_div);
                  fullscreen_img.css({"max-width":"100%","max-height":"100%"});
                  $("body").append(fullscreen_div);
                  fullscreen_div.requestFullScreen();   
                  //Fixme : remove when esc fullscreen
              }              
            });
        }
        container.fadeIn(200);
    });
    $(document).keyup(function(e) {
     if (e.keyCode == 27) {
            closePost();
        }
    });
}
