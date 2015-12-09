function $import(file,callback){
    if(Array.isArray(file)){
        for(var i=0;i<file.length;i++){
            var v={f:file[i],c:i==file.length-1?callback:undefined};
            $_import._INCLUDED_SCRIPTS.push(v);  
            $debug("Add ",v.f,"to loading queue");
        }
    }else{
        var v={f:file,c:callback};
        $_import._INCLUDED_SCRIPTS.push(v);   
    }
    if (document.readyState === "complete"){
        $debug("Window already loaded. Import immediately");
        if(!$_import._LOADING)$_import._load_next_script();
    }
}


$_import={
    _INCLUDED_SCRIPTS:[],
    _LOADED_SCRIPTS:0,
    _LOADING:false,
    _IMPORTERS:{},
    registerImporter:function(name,func){
      $_import._IMPORTERS[name]=func;  
    },
    init:function(){
        if (document.readyState === "complete")$_import._load_next_script();
        else {
            window.onload=(function(){
                $_import._load_next_script();
                if(typeof this==='function')this();
            }).bind(window.onload);   
        }
    },
    _appendCode:function(code,path,callback){
        for(var ext in $_import._IMPORTERS){
            if(path.indexOf(ext, path.length-ext.length)!==-1){
                $_import._IMPORTERS[ext](code,path,callback);
                break;
            }
        }
        
    },
    _load_dependency:function(file,callback){
        var v={f:file,c:callback};
        $_import._load_script(v);
    },
    _load_script:function(v,done){
         $http(v.f,function(status,code){            
            $_import._appendCode(code,v.f,function(){
                if(typeof v.c!=="undefined")v.c();                 
                if(done)done();     
            });
        });
    }, 
    _load_next_script:function(){   
        if($_import._LOADED_SCRIPTS==$_import._INCLUDED_SCRIPTS.length){
            $_import._LOADING=false;
            return;        
        }
        $_import._LOADING=true;

        var v=$_import._INCLUDED_SCRIPTS[$_import._LOADED_SCRIPTS++];      
        $_import._load_script(v,$_import._load_next_script);
       
    }
};
$_import.init();



// Importers
$_import._IMPORTERS[".js"]=function(code,path,done){
    var script = document.createElement("script");
    script.innerHTML = code;
    document.head.appendChild(script);
    done();
}

$_import._IMPORTERS[".css"]=function(code,path,done){
    var style = document.createElement("style");
    style.innerHTML = code;
    document.head.appendChild(style);
    done();
}

$_import._IMPORTERS[".less"]=function(code,path,done){
    var load_with_less=function(){
        less.render(code, {}).then(
            function(output) {
                var style = document.createElement("style");
                style.innerHTML = output.css;
                document.head.appendChild(style);
                done();
            },
            function(error) {
                $debug(error);
            }
        );
    }
    
    if(!$_import._LESS_DEPENDENCIES_LOADED){
       $_import._load_dependency("inc/tp/less.min.js",function(){
           $_import._LESS_DEPENDENCIES_LOADED=true;
           load_with_less();
       });
    }else load_with_less();
    
}