/********************
  Text Base
*********************/
function loadAssets(url){
  var filext = url.substring(url.lastIndexOf('.')+1).toLowerCase()
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('text/plain; charset=utf-8');
  xhr.open('GET', url, false);
  //xhr.onreadystatechange = function (){
  xhr.onload = function (){
    switch (filext){
      case "js":
        var js = xhr.response || xhr.responseText;
        if (xhr.readyState === 4) {
          switch(xhr.status) {
              case 200:
              case 0:
                eval.apply( window, [js] );
                console.log("javascript loaded: ", url);
                break;
              default:
                console.log("ERROR: javascript not loaded: ", url);
          }
        };break;
      case "css":
        if (xhr.status === 200||xhr.status === 0) {
          var css = xhr.responseText;
          var style = document.createElement('style');
          style.textContent = css;
          document.head.appendChild(style)
          console.log("stylsheet loaded: ", url);
        };break
    }
  };
  xhr.send();
};
function writeFile(filename, text) {
  var anchor = document.createElement('a');
  anchor.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  anchor.setAttribute('download', filename);

  anchor.style.display = 'none';
  document.body.appendChild(anchor);

  anchor.click();
  document.body.removeChild(anchor);
};
    function loadMD(url,cb){
      var filext = url.substring(url.lastIndexOf('.')+1).toLowerCase()
      if(filext != "md") return;
      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType('text/plain; charset=utf-8');
      xhr.open('GET', url, false);
      xhr.onload = function (){
        if (xhr.status === 200||xhr.status === 0) {
          cb(xhr.responseText)
          
        }
      };
      xhr.send();
    };

    var ls=window.location.search;
    var fileIn="";
    fileIn = decodeURIComponent(ls).replace(/\+/g, " ").replace('?','');
    
    if(fileIn.indexOf('&')!=-1) {
      fileIn=fileIn.split('&');
      fileIn[1]="";
      fileIn=fileIn[0];
    };
    if(fileIn.indexOf('=')!=-1||fileIn.substring(fileIn.lastIndexOf('.')+1).toLowerCase()!="md") {
      fileIn=""
    };    

var assets=["./dist/css/TextareaDecorator.css","./lib/highlight.js/solarized-light.css","./dist/css/editor.css","./dist/js/markdown-it.min.js","./dist/js/markdown-it-sub.min.js","./dist/js/markdown-it-sup.min.js","./dist/js/draggabilly.pkgd.min.js","./dist/js/TextareaDecorator.js",
"./lib/highlight.js/highlight.pack.js","./src/js/utils.js","./src/js/parser.js","./src/js/editor.js","./src/js/markdown-it-s2-tex.js",];for(var i=0;i<assets.length;i++){loadAssets(assets[i])}  


	