/*
* Author: Ayon Ghosh
* Date: 6 March 2015
*/
var app = app || {};

app.utils = {
    //Cross browser Ajax wrapper
    doAjax: function (config) {
        var xhr;
        if (typeof XMLHttpRequest !== 'undefined') {
            xhr = new XMLHttpRequest();
        }else {
            var versions = [
                "MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp"
            ];
            for(var i = 0; i < versions.length; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch (e){
                    console.log("FATAL: Ajax might not be supported on your browser");
                }
            }
        }
        xhr.onreadystatechange = function () {
            if(xhr.readyState < 4) {
                return;
            }
            if(xhr.status !== 200) {
                return;
            }
            // all is well
            if(xhr.readyState === 4) {
                config.success(xhr);
            }
        }
        
        xhr.open(config.method.toUpperCase(), config.url, true);
        xhr.send(config.data || '');
        
        return xhr;
    },
    // Simple function to shallow copy/overwrite properties of b into a
    extend: function (a, b) {
        // shallow copy properties of b into a
        if (!a) {
            a = {};
        }
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    },
    // Cross browser function to attach an event handler to a DOM element
    attachEventListener: function (el, event, handler) {
        if (el.addEventListener) {
            el.addEventListener(event, handler);
        }else if (el.attachEvent) {
            el.attachEvent('on' + event, handler);
        }
    }
};


	

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};

  app.utils.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();



