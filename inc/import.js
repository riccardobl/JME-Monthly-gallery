function $import(file,callback,import_queue){
    if(typeof import_queue==='undefined')import_queue=0;
    
    var queue=$_import.QUEUES[import_queue];
    if(!queue){
        queue=new $_import.Queue();
        $_import.QUEUES[import_queue]=queue;
    }
    
    if(Array.isArray(file)){
        for(var i=0;i<file.length;i++){
            var v={f:file[i],c:i==file.length-1?callback:undefined};
            queue.INCLUDED_SCRIPTS.push(v);  
            $debug("Importer:  Add ",v.f,"to loading queue",import_queue);
        }
    }else{
        var v={f:file,c:callback};
        queue.INCLUDED_SCRIPTS.push(v);   
    }
    if (document.readyState === "complete"){
        $verboseDebug("Importer:  Window already loaded. Import immediately");
        if(!queue.LOADING)$_import.load_next_script(queue);
    }
}

$_import={  
    QUEUES:[],
    _IMPORTERS:{},
    init:function(){
        if (document.readyState === "complete"){
            $forEach($_import.QUEUES,function(q){
                if(q.LOADING)return;
                $_import.load_next_script(q);
            });
        }else {
            window.onload=(function(){
                $forEach($_import.QUEUES,(function(q){
                    if(q.LOADING)return;
                    $_import.load_next_script(q);
                    if(typeof this==='function')this();
                }).bind(this));
            }).bind(window.onload);   
        }
    },
    registerImporter:function(name,func){
        $_import._IMPORTERS[name]=func;  
    },
    _load_dependency:function(file,callback){
        var v={f:file,c:callback};
        $_import._load_script(v);
    },
    load_next_script:function(q){   
        if(q.LOADED_SCRIPTS===q.INCLUDED_SCRIPTS.length){q.LOADING=false;return;} 
        q.LOADING=true;
        var v=q.INCLUDED_SCRIPTS[q.LOADED_SCRIPTS];  
        $debug("Importer:  Import",v.f,q.LOADED_SCRIPTS);
        q.LOADED_SCRIPTS++;
        $_import._load_script(v,function(){$_import.load_next_script(q);});       
    },
    _load_script:function(v,done){
        var loadcb=function(status,code){   
            if(!status){
                $debug("Importer: Cannot import",v.f);
                return;
            }
            $_import._appendCode(code,v.f,function(){
                if(done)done();     
                if(typeof v.c!=="undefined"){
                    $verboseDebug("Importer: ",v.f,"has a callback");
                    v.c();                 
                }
            });
        };
        var loadAndStore=function(status, code){
            loadcb(status,code);
            if(status&&typeof(Storage) !== "undefined"){
                localStorage.setItem(v.f,JSON.stringify({version:$VERSION,'code':code}));
                $verboseDebug("Importer: Storing ",v.f," on cache for future usage.");

            }
        };
        if(typeof(Storage) !== "undefined") {
            try{
                $verboseDebug("Importer: Local storage is available!");
                var cached_script=localStorage.getItem(v.f);
                if(cached_script){
                   // $verboseDebug("Importer: Load from json",cached_script);
                    cached_script=JSON.parse(cached_script);
                    if(typeof $VERSION==="undefined"||cached_script.version===$VERSION){
                        loadcb(true,cached_script.code);
                        $verboseDebug("Importer:  Load ",v.f," from cache! Version: ",$VERSION);
                        return;
                    }else{
                        $verboseDebug("Importer:  Version has changed, the cache for ",v.f," has been dropped! Version: ",$VERSION);

                    }
                }
            }catch(ex){
                $verboseDebug("Importer: Error",ex);
            }
        }else{
            $verboseDebug("Importer: Local storage is not available.");
        }
        $http(v.f,loadAndStore);
    },
    _appendCode:function(code,path,callback){
        $verboseDebug("Importer:  Append",code);
        for(var ext in $_import._IMPORTERS){
            if(path.indexOf(ext, path.length-ext.length)!==-1){
                $_import._IMPORTERS[ext](code,path,callback);
                break;
            }
        }        
    },
    Queue:function(){
        this.INCLUDED_SCRIPTS=[];
        this.LOADED_SCRIPTS=0;
        this.LOADING=false;  
    }
}

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

$_import._IMPORTERS[".html"]=function(code,path,done){
    document.body.innerHTML+=code;
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