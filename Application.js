$import(["Settings.js"],function(){
    $import([
        "style.less",

    ],undefined,1);
    
    $import([
        "templates/base.html"
    ],initializeTemplate,2);
            
    $import([
        "gateways/DirectGate.js",
        "gateways/CorsGateForTheInternette.js",

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
        "inc/jquery.autohide.js",

        // Parsers
        "parsers/ImageParser.js" //,
        //"parsers/VideoParser.js", REMOVED
        //"parsers/YoutubeParser.js" REMOVED

    ],$main);
});



GALLERY=null;
GALLERY_ELEMENTS=[];
IMAGES_GATEWAY=null;
DATE=0;

CAN_LOAD_TEMPLATE=false;

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



function initializeTemplate(){
    if(CAN_LOAD_TEMPLATE){
   //     $("#fullscreen_view").click(hideFullScreen);
        $("#current_date #left_arrow").click(function(){
            closePost();
            loading(true);
            setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)+1));
        });
        $("#current_date #right_arrow").click(function(){
            closePost();
            loading(true);
            setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE)-1));
        });
        


    }else CAN_LOAD_TEMPLATE=true;
}


function $main(){    
    initializeTemplate();
    
    IMAGES_GATEWAY=new DirectGate();        
    
    GALLERY=new MonthlyGallery("http://hub.jmonkeyengine.org/t/",new CorsGateForTheInternette());
    GALLERY.getParserManager().addParser(ImageParser);
   // GALLERY.getParserManager().addParser(VideoParser); REMOVED
    //GALLERY.getParserManager().addParser(YoutubeParser); REMOVED
    
  //  setInterval(queryJMEHub, 300000);    

    var vars=getURLVars();    
    if(vars.month&&vars.year){//urlparts&&urlparts.length>1) {
        setDate(Calendar.fromMonthYear(vars.month,vars.year));   
    }else setDate(Calendar.fromMonthOffset(0)); 
}

function getURLVars(){
    var urlparts=new RegExp("([A-Z]+)([0-9]+)(?:!([0-9]+))?",'gi').exec(window.location.hash.substring(1));
    if(!urlparts)return {};
    return {
        month:urlparts[1],
        year:urlparts[2],
        post_id: urlparts[3]
    }
}


function setURLVars(data){
    var current_vars=getURLVars();
    var keys=Object.keys(data);
    for(var i=0;i<keys.length;i++){
        current_vars[keys[i]]=data[keys[i]];
    }
    window.location.hash=current_vars.month+current_vars.year+(current_vars.post_id?"!"+current_vars.post_id:"");
}

function refreshView(){ 
    loading(true);
    $("#current_date_text").text(DATE.month+" "+DATE.year);
  
    var container=$("#thumbnail_container");
    container.empty();
    
    var jump_to_post=undefined;
    var vars=getURLVars();
    
    var l=GALLERY_ELEMENTS.length;
    for(var i=0;i<l;i++){
        var post=$("<div></div>");
        post.addClass("post");
        post.appendTo(container);

        var post_obj=GALLERY_ELEMENTS[i];  
        if(!post_obj)continue;
        
        if(typeof vars.post_id!=='undefined'){
            if(post_obj.post_id==vars.post_id){
                jump_to_post=post_obj;
            }
        }
        
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
    if(jump_to_post){
        openPost(jump_to_post);
    }

    loading(false);
}



function setDate(date){
    DATE=date;
    setURLVars({
        month:date.month+"",
        year: date.year+""
    });
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
    if(!do_not_edit_url){
        setURLVars({
            post_id:undefined
        });
    }
    var container=$("#posts_container");
    container.empty();
    container.fadeOut(200);
    $("#thumbnail_container").fadeIn(200);
}

function openPost(post_obj){
    setURLVars({
        post_id:post_obj.post_id+""
    });
    closePost(true);
    var container=$("#posts_container");
    $("#thumbnail_container").fadeOut(200,function(){
        var elements=post_obj.content;
        for(var i=0;i<elements.length;i++){
            var img=$("<img id='wip_img_"+post_obj.post_id+"_"+i+"' src='img/loading.gif' />");
            img.addClass("wip_img");
            img.attr("src",elements[i].value);
            img.appendTo(container);        
            img.click(function(){
                //Fix me
              if($(this).requestFullScreen) $(this).requestFullScreen();
                
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
