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

//var assets=["assets/src/slideUp.js","assets/src/mathjs.js","assets/3DMathGraph.js",
var assets=["assets/src/mathjs.js","assets/3DMathGraph.js",
"assets/style.css"];for(var i=0;i<assets.length;i++){loadAssets(assets[i])}  


var path='';
function pathChange(){
  var Path =document.getElementById("path");
  return path = Path.value;
}
function writeFileSync(filename, text) {
  var SaveHolder = document.getElementById('saveHolder');
  var savediv = document.createElement('div');
  var savea = document.createElement('a');
  savea.target = '_blank';
  savea.href='?'+path+filename;
  savea.innerHTML=filename;
  savea.style.textDecoration='none';
  savediv.appendChild(savea);
  SaveHolder.parentNode.insertBefore(savediv,SaveHolder.nextSibling);
  
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  
  element.click();
  document.body.removeChild(element);
};

function savegraph() {
  function rand(min, max, minDig, maxDig) {
    var num, digits;
    do {
      num = Math.floor(Math.random() * (max - min)) + min;
      digits = Math.abs(num).toString().length;
    } while (digits > maxDig || digits < minDig);
    return num;
  }
  var filename='math'+rand(0, 1000, 1, 4)+'.json';  
  var json = JSON.stringify(serializeGraph());
  writeFileSync(filename, json)
}
function getJSON(url, cb){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send();
  request.onload = function() {
    if (request.status >= 200||request.status >= 0 && request.status < 400) {
      cb(JSON.parse(request.responseText));
    } 
    else {}
  };
};
var ls=[];
ls.push(window.location.search);
var fileIn="";
fileIn = decodeURIComponent(ls).replace(/\+/g, " ").replace('?','');
if(fileIn.indexOf('&')!=-1) {
  fileIn=fileIn.split('&');
  fileIn[1]="";
  fileIn=fileIn[0];
};
if(fileIn.indexOf('=')!=-1||fileIn.substring(fileIn.lastIndexOf('.')+1).toLowerCase()!="json") {
  fileIn=""
};

if(fileIn.substring(fileIn.lastIndexOf('?')))getJSON(fileIn, function(data) {loadfromJSON(data)})


function ShowHide(ElToProcess) {
   //var El = document.getElementById(ElToProcess)||document.getElementsByTagName(ElToProcess)[0];
   var El = document.getElementById(ElToProcess);
  if (El.style.display !== "none") {
    El.style.display = "none";
  }
  else {
     El.style.display = "block";
  }
}

function refresh(thisFileStartUp){
  thisFileStartUp=thisFileStartUp||"index.html";
  var meta=document.createElement("meta");
  meta.setAttribute("http-equiv","refresh");
  meta.setAttribute("content","0;URL="+thisFileStartUp);
  document.head.appendChild(meta);
}

  
