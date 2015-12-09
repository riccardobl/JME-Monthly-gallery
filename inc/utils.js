function $startWith(str,prefix){
   return  str.slice(0, prefix.length) == prefix;
}

function $endWith(str,suffix){
   return  str.indexOf(suffix, str.length-suffix.length)!==-1;
}

function $arrContains(array,element){
    for(var i=0;i<array.length;i++){
        if(array[i]===element)return true;
    }
    return false;
}