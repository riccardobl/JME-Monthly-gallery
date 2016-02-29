ParserName={
    parse:function(post_vars,in_content,out_array){
        // Find elements
            // foreach element found
                out_array.push({
                    type:/*string that describe element type ex. mimetype*/,
                    value:/*url of the element*/,
                    vars:/*variables. Usually declared at the end of the url as an hash  ex. xyz.com#myvar1,myvar2=10 */
                });
    }
}


