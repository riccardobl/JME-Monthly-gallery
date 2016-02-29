$import(["Settings.js"], function () {
    $import([
        "styles/fonts.less",
        "styles/structure.less",
        "styles/thumbnails.less",
        "styles/post.less",
        "inc/tp/jssocials/jssocials.css",
        "inc/tp/jssocials/jssocials-theme-plain.css"

    ], undefined, 1);

    $import([
        "gateways/DirectGate.js",
        "gateways/CorsGateForTheInternette.js",
        "gateways/EmbeddedCORSGate.js",
        "gateways/EmbeddedImageScalerGate.js",
        "gateways/RSZioGate.js",

        "inc/function-queue.js",
        "core/Calendar.js",
        "core/ParserManager.js",
        "core/MonthlyGallery.js",

        "inc/tp/modernizr-custom.js",

        // JQuery & Plugins
        "inc/tp/jquery-1.11.3.min.js",
        "inc/jquery.multi-img-viewer.js",
        //"inc/tp/jquery.waypoints.min.js",
        //"inc/tp/inview.min.js",
        //"inc/tp/jquery.fullscreen.js",
        "inc/tp/jquery.tooltipster.min.js",
        "inc/tp/tooltipster.css",
        //"inc/jquery.autohide.js",

        //Share buttons
        "inc/tp/jssocials/jssocials.min.js",

        // Parsers
        "parsers/ImageParser.js" //,
        //"parsers/VideoParser.js", REMOVED
        //"parsers/YoutubeParser.js" REMOVED

    ], $main);
});

$IS_RELEASED = document.domain === "release.jme-monthly-gallery.frk.wf"||document.domain === "monthly.jmonkeyengine.org";


GALLERY = null;
GALLERY_ELEMENTS = [];
THUMBNAIL_GATEWAY = null;
IMAGE_GATEWAY = null;
DATE = 0;


function $main() {
    if($IS_RELEASED){
        $_debug.enable = false;
    }else{
        $("#dev").css({"display":"block"});
        $_debug.enable = true;
    }


    // Init template
    $('.tooltip').tooltipster();
    $("#current_date #left_arrow").click(function () {
        if ($(this).hasClass("disabled")) return;
        closePost();
        loading(true);
        setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE) + 1));
    });
    $("#current_date #right_arrow").click(function () {
        if ($(this).hasClass("disabled")) return;
        closePost();
        loading(true);
        setDate(Calendar.fromMonthOffset(Calendar.toMonthOffset(DATE) - 1));
    });
    $http("https://api.github.com/repos/riccardobl/JME-Monthly-gallery/contributors", function (status, content) {
        if (status) {
            var contributors = [];
            var parsed_content = JSON.parse(content);
            for (var i = 0; i < parsed_content.length; i++) {
                var username = parsed_content[i].login;
                if (username === "riccardobl") continue;
                var link = parsed_content[i].html_url;
                $http("https://api.github.com/users/" + username, (function (status, content) {
                    if (status) {
                        var parsed_content = JSON.parse(content);
                        var name = parsed_content.name;
                        if (name === null) {
                            name = parsed_content.login;
                        }
                        var link = this;
                        var dom_el = $("<a href='" + link + "' target='_blank'>" + name + "</a>");
                        $("#contributors").append(dom_el);
                    }
                }).bind(link));
            }
        }
    });


    // Init gallery    
    THUMBNAIL_GATEWAY = new DirectGate();
    IMAGE_GATEWAY = new DirectGate();
    GALLERY = new MonthlyGallery("http://hub.jmonkeyengine.org/t/", $IS_RELEASED ? new CorsGateForTheInternette() /*new EmbeddedCORSGate()*/ : new CorsGateForTheInternette());
    GALLERY.getParserManager().addParser(ImageParser);
    // GALLERY.getParserManager().addParser(VideoParser); REMOVED
    //GALLERY.getParserManager().addParser(YoutubeParser); REMOVED

    var vars = URI();
    setDate(vars.month && vars.year ? Calendar.fromMonthYear(vars.month, vars.year) : Calendar.fromMonthOffset(0));

}

function URI(data) {
    if (!data) {
        var hashes = window.location.hash.substring(1);
        var urlparts = new RegExp("([A-Z]+)([0-9]+)(?:!([0-9]+))?", 'gi').exec(hashes);
        if (!urlparts) return {};
        return {
            month: urlparts[1],
            year: urlparts[2],
            post_id: urlparts[3]
        }
    } else {
        var current_vars = URI();
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) current_vars[keys[i]] = data[keys[i]];
        window.location.hash = current_vars.month + current_vars.year + (current_vars.post_id ? "!" + current_vars.post_id : "");
    }
}

function error404(type) {
    var container = $("#thumbnails");
    container.empty();

    var current_month = Calendar.toMonthOffset(DATE) === 0;
    container.append("<div id='error'><img src='img/nomonkey.png' /><p>Thread not found.</p></div>");

}


function refreshThumbnailsView() {

    if (GALLERY_ELEMENTS.length === 0) {
        error404();
    } else {
        var container = $("#thumbnails");
        container.empty();

        var l = GALLERY_ELEMENTS.length;
        for (var i = 0; i < l; i++) {
            var post_obj = GALLERY_ELEMENTS[i];
            if (!post_obj) continue;

  
            var post = $("<div></div>");
            post.addClass("thumbnail_container");
            post.appendTo(container);
            
            
            if (Modernizr.cssfilters) {
                var bgimg = $("<img id='blur_img_" + post_obj.post_id + "' />");
                bgimg.addClass("bgimg");
                bgimg.appendTo(post);
            }

            var aligner = $("<span></span>");
            aligner.addClass("aligner");
            aligner.appendTo(post);

            var thumbnail = $("<img id='thumbnail_" + post_obj.post_id + "' src='img/loading.gif' />");
            thumbnail.addClass("thumbnail");
            thumbnail.addClass("loading");

            var imgs = [];
            for (var j = 0; j < post_obj.content.length; j++) {
                var element = post_obj.content[j];
                $debug("Add ",element.value," to the gallery.");
                imgs.push(element.value);
            }
            thumbnail.appendTo(post);

            thumbnail.multiImg(imgs, 2000, function (src){return THUMBNAIL_GATEWAY.rewriteUrl(src); },(function (new_src) {
                var post = this[0];
                var post_obj = this[1];
                post.find(".thumbnail").each(function () {
                    $(this).removeClass("loading");
                });
                post.find(".bgimg").each(function () {
                    var bgimg = $(this);
                    
                    
                    var new_img=$("<img/>");
                    new_img.attr("src",new_src);   

                    for (i = 0; i < bgimg[0].attributes.length; i++){
                        var a = bgimg[0].attributes[i];
                        if(a.name!=="src")new_img.attr(a.name, a.value);
                    }
                    new_img.data(bgimg.data());

                    bgimg.replaceWith(new_img);
                    
                    //bgimg.attr("src",new_src);
                    // See jquery.multi-img-viewer.js note.
                });
            }).bind([post, post_obj]));

            var infobox = $("<div class='infobox'></div>");
            infobox.appendTo(post);

            var author = $("<div class='author'></div>");
            author.html("<span>" + post_obj.author + "</span>");
            author.appendTo(infobox);

            var likes = $("<div class='likes'></div>");
            likes.html("<span>" + post_obj.likes + "</span><img src='img/banana.svg' />");
            likes.appendTo(infobox);

            post.click((function () {
                openPost(this);
            }).bind(post_obj));

        }
    }
}

function refreshPostView() {
    var vars = URI();
    var l = GALLERY_ELEMENTS.length;
    for (var i = 0; i < l; i++) {
        var post_obj = GALLERY_ELEMENTS[i];
        if (typeof vars.post_id !== 'undefined') {
            if (post_obj.post_id == vars.post_id) {
                openPost(post_obj);
                return true;
            }
        }
    }
    return false;
}

function refreshView() {
    loading(true);
    $("#current_date_text").text(DATE.month + " " + DATE.year);
    if (!refreshPostView()) refreshThumbnailsView();
    loading(false);
}

function setDate(date) {
    DATE = date;
    URI({
        month: date.month + "",
        year: date.year + ""
    });
    if (Calendar.toMonthOffset(date) === 0) {
        $("#current_date #right_arrow").addClass("disabled");
    } else {
        $("#current_date #right_arrow").removeClass("disabled");
    }
    queryJMEHub();
}

function queryJMEHub() {
    $debug("Query jme hub...")
    GALLERY.get(DATE, function (output) {
        GALLERY_ELEMENTS = output;
        if (GALLERY_ELEMENTS) GALLERY_ELEMENTS = GALLERY.shuffle(GALLERY_ELEMENTS);
        refreshView();
    });
}

function closePost(do_not_edit_url) {
    var container = $("#post");
    container.empty();
    container.fadeOut(200);
    $("#thumbnails").fadeIn(200);

    if (!do_not_edit_url) {
        URI({
            post_id: undefined
        });
        scrollTop();
        refreshView();
    }

}


function scrollTop() {
    $("body").scrollTop(0);
}


function openPost(post_obj) {
    scrollTop();
    URI({
        post_id: post_obj.post_id + ""
    });
    closePost(true);

    $("#thumbnails").fadeOut(200, function () {
        var container = $("#post");

        var left_column = $("<div></div>");
        left_column.addClass("container left");
        left_column.appendTo(container);

        var right_column = $("<div></div>");
        right_column.addClass("container right");
        right_column.appendTo(container);

        var post_clearer = $("<div></div>");
        post_clearer.css({
            "clear": "both"
        });
        post_clearer.appendTo(container);

        var return_button = $("<a class='button' id='return_to_gallery'><i class='fa fa-arrow-left'></i> Go back to Gallery</a>");
        return_button.click(function () {
            closePost();
        });
        return_button.appendTo(left_column);

        var go_topost_button = $("<a class='button' id='go_to_post' target='_blank' href='" + post_obj.url + "'>Show original post <i class='fa fa-arrow-right'></i></a>");
        go_topost_button.appendTo(right_column);


        var description_table = $("<table id='description_table'></table>");
        description_table.append("<tr><th>Author:</th><td>" + post_obj.author + "</td></tr>");
        description_table.append("<tr><th>Date:</th><td>" + post_obj.created_at.split("T")[0] + "</td></tr>");
        description_table.append("<tr><th>Likes</th><td>" + post_obj.likes + " </td></tr>");
        description_table.appendTo(left_column);

        
        var share=$("<div id='share'></div>");

        share.jsSocials({
            showCount: "inside",
            showLabel: false,
            shares: ["email", "twitter", "facebook", "googleplus", "pinterest", "whatsapp"]
        });

        
        right_column.append(share);
        
       

        var content_table = $("<table id='content_table'></table>");
        content_table.appendTo(container);
        var row=undefined;
        
        var elements = post_obj.content;
        for (var i = 0; i < elements.length; i++) {
            if(i%2===0){
                row=$("<tr></tr>");
                row.appendTo(content_table);
            }
                //img.appendTo(left_column);
            // else img.appendTo(right_column);
            
            var img = $("<img id='wip_img_" + post_obj.post_id + "_" + i + "' src='img/loading.gif' />");
            img.addClass("posts_preview");
            img.attr("src", IMAGE_GATEWAY.rewriteUrl(elements[i].value));
            var cell=$("<td></td>");
            
            var href=$("<a target='_blank' href='"+elements[i].value+"'></a>");
            href.append(img);
            cell.append(href);

            row.append(cell);

        }

        container.fadeIn(200);
    });
    /*$(document).keyup(function(e) {
     if (e.keyCode == 27) {
            closePost();
        }
    });*/
}