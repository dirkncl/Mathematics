/********************************************************/
/*
  All about Experiments: Making existing ones different or getting better.
                      Dirk Levinus Nicolaas
*/
/********************************************************/
/*
LaTeXMathJax.js
===============
 Peter Jipsen

Version of 2014-02-25

This file contains JavaScript functions to convert (some simple) LaTeX
notation to HTML+CSS+MathJax.
If you use it on a webpage, please send the URL to jipsen@chapman.edu

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or (at
your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License (at http://www.gnu.org/copyleft/gpl.html)
for more details.

To use this script, add the following line to the <head> of your HTML file:
<script type="text/javascript" src="LaTeXMathML.js"></script>
Or use absolute path names if the file is not in the same folder
as your HTML page.
*/

(function () {
  table = function(mch,p1){
    var t = p1;
    t = t.replace(/^\[[^\[]+\]/g,'');
    t = t.replace(/\\begin\{tabular\}\{[^\}]*\}/g,'<table class="LaTeXtable">\n<tr><td>');
    t = t.replace(/&amp;/g,'</td><td>');
    t = t.replace(/\\\\\s/g,"</td></tr>\n<tr><td>");
    t = t.replace(/\\end\{tabular\}/g,'</td></tr>\n</table>');
    t = t.replace(/\\caption\{([^\}]+)\}/g,'<div class="LaTeXtable">$1</div>');
	  return t
  }
  verbatim = function(mch,p1){
    var t = '<pre class="verbatim">'+p1+'</pre>';
    t = t.replace(/\\/g,'\\<span></span>'); // prevent translation
	  return t
  }
  address = function(mch,p1){
    var t = '<div class="address">'+p1+'</div>';
    t = t.replace(/\\\\/g,',');
	  return t
  }
  bibliography = function(mch,p1){
    var t = '<div class="thebibliography">'+p1+'</div>';
    t = t.replace(/[\n\r]+[ \f\n\r\t\v\u2028\u2029]*[\n\r]+/g,'');
	  return t
  }
  SVGGraph = function(s,t){
    return "<center><embed class=\"ASCIIsvg tex2jax_ignore\" wmode=\"transparent\" script=\'"+t.replace(/<\/?(br|p|pre)\s?\/?>/gi,"\n")+"\'/></center>"
  }
  /*
  window.onload=function onloads(){
  var body=document.getElementsByTagName('body')[0];
  var pre=document.createElement('pre');
  pre.className="LaTeX";
  pre.id='ltx';
  //pre.setAttribute("innerText", body.innerText);
  //pre.innerText=body.innerText;
  body.appendChild(pre)
};
*/
  function loadfile(url) {
    var body=document.getElementsByTagName('body')[0];
        body.className='LaTeX';
	  var req;
    req = new XMLHttpRequest();
	  req.onreadystatechange = function(){
	    if (req.readyState==4 && (req.status==0||req.status==200)){
	  	  //document.getElementById('ltx').innerHTML = req.responseText;
	  	  body.innerText = req.responseText;
	    }
	  }
	  req.open("GET",url,false); //do synchronous request
	  req.send();
  }
  window.onload = function() {
    //document.body.setAttribute('class','LaTeX')
    //var nd = document.getElementById('ltx')
    //var nd = document.getElementsByTagName('body');
    //if (nd && nd.innerHTML.length<20) {
    //    var fn = document.URL;
    //    fn = fn.replace(/#.*/,""); // remove any anchor from URL
    //    loadfile(fn.substring(0,fn.length-4)+"tex");
   // }
	
	  var pres = document.getElementById('pre')||document.getElementsByTagName('body');
	  for (var i=0; i<pres.length; i++){
      //if (pres[i].className == "LaTeX") {
        st = pres[i].innerHTML;

      st = st.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g,verbatim);
      st = st.replace(/\\%/g, "<per>"); // save \% sign
      st = st.replace(/%[^\n]*(?=\n)/g,""); // remove LaTeX comments
      st = st.replace(/%[^\r]*(?=\r)/g,""); // IE
      st = st.replace(/<per>/g, "\\%"); // restore \% sign
      st = st.replace(/\\newtheorem.*\}/g,"");
      st = st.replace(/\\renewcommand.*\}/g,"");
      st = st.replace(/\\documentclass[^\}]*\}/g,"");
      st = st.replace(/\\usepackage[^\}]*\}/g,""); // ignore packages
      st = st.replace(/\\begin\s*\{\s*document\s*\}/g,"");
      st = st.replace(/\\maketitle/g,"");
      st = st.replace(/\\end\s*\{\s*document\s*\}/g,"");
      st = st.replace(/\\noindent/g,"");
      st = st.replace(/\\notag/g,"");
      st = st.replace(/\\title\[[^\]]+\]\{([^\}]+)\}/g,'<div class="title">$1</div>');
      st = st.replace(/\\title\{([^\}]+)\}/g,'<div class="title">$1</div>');
      st = st.replace(/\\author\{([^\}]+)\}/g,'<div class="author">$1</div>');
      st = st.replace(/\\email\{([^\}]+)\}/g,'<div class="email">$1</div>');
      st = st.replace(/\\address\{([^\}]+)\}/g,address);
      st = st.replace(/\\date\{([^\}]+)\}/g,'<div class="date">$1</div>');
      st = st.replace(/\\keywords\{([^\}]+)\}/g,'<div class="keywords">$1.</div>'); 
      st = st.replace(/\\subjclass\[(\w+)\]\{([^\}]+)\}/g,'<div class="subjclass">$1  <i>Mathematics Subject Classification</i>: $2</div>'); 
      st = st.replace(/\\subjclass\{([^\}]+)\}/g,'<div class="subjclass"><i>Mathematics Subject Classification</i>: $1</div>'); 
      st = st.replace(/\\begin\{abstract\}/g,'<div class="abstract">'); 
      st = st.replace(/\\end\{abstract\}/g,"</div>");
      
      st = st.replace(/\\chapter\{([^\}]+)\}/g,'<h1 class="chapter">$1</h1>');
      st = st.replace(/\\section\{([^\}]+)\}/g,'<h2 class="section">$1</h2>');
      st = st.replace(/\\subsection\{([^\}]+)\}/g,'<h3 class="subsection">$1</h3>');
      st = st.replace(/\\subsubsection\{([^\}]+)\}/g,'<h4 class="subsubsection">$1</h4>');

      st = st.replace(/\\begin\{displaymath\}/g,'\n$$');
      st = st.replace(/\\end\{displaymath\}/g,'$$\n');
      st = st.replace(/\\begin\{definition\}/g,'\n<div class="definition">');
      st = st.replace(/\\end\{definition\}/g,"</div>\n");
      st = st.replace(/\\begin\{lemma\}/g,'\n<div class="lemma">');
      st = st.replace(/\\end\{lemma\}/g,"</div>\n");
      st = st.replace(/\\begin\{theorem\}/g,'\n<div class="theorem">');
      st = st.replace(/\\end\{theorem\}/g,"</div>\n");
      st = st.replace(/\\begin\{corollary\}/g,'\n<div class="corollary">');
      st = st.replace(/\\end\{corollary\}/g,"</div>\n");
      st = st.replace(/\\begin\{proposition\}/g,'\n<div class="proposition">');
      st = st.replace(/\\end\{proposition\}/g,"</div>\n");
      st = st.replace(/\\begin\{proof\}/g,'\n<div class="proof">');
      st = st.replace(/\\end\{proof\}/g,'</div>\n');
      st = st.replace(/\\begin\{example\}/g,'\n<div class="example">');
      st = st.replace(/\\end\{example\}/g,"</div>\n");
      st = st.replace(/\\begin\{exercise\}/g,'\n<div class="exercise">');
      st = st.replace(/\\end\{exercise\}/g,"</div>\n");
      st = st.replace(/\\begin\{center\}/g,'\n<div class="center">');
      st = st.replace(/\\end\{center\}/g,"</div>\n");
      st = st.replace(/\\begin\{verbatim\}/g,'\n<pre class="verbatim">');
      st = st.replace(/\\end\{verbatim\}/g,"</pre>\n");
      st = st.replace(/\\begin\{itemize\}/g,'<ul class="itemize">'); 
      st = st.replace(/\\end\{itemize\}/g,"</ul>");
      st = st.replace(/\\begin\{enumerate\}/g,'<ol class="enumerate">');
      st = st.replace(/\\item\[(\w+)\]/g,"<li>$1");
      st = st.replace(/\\item/g,"<li>");
      st = st.replace(/\\end\{enumerate\}/g,"</ol>");
      st = st.replace(/\\begin\{thebibliography\}\{[^\}]*\}([\s\S]*?)\\end\{thebibliography\}/g,bibliography);
      st = st.replace(/\\begin\{tikzpicture\}([\s\S]*?)\\end\{tikzpicture\}/g,'');
      
      // use this template to create translations for other environments
      st = st.replace(/\\begin\{\}/g,'<div class="">');
      st = st.replace(/\\end\{\}/g,"</div>");
      
      // cannot have {} nested inside currently
      st = st.replace(/\\textbf\{([^\}]+)\}/g,'<b>$1</b>');
      st = st.replace(/\\textit\{([^\}]+)\}/g,'<span class="textit">$1</span>');
      st = st.replace(/\\textsc\{([^\}]+)\}/g,'<span class="textsc">$1</span>');
      st = st.replace(/\\textsf\{([^\}]+)\}/g,'<span class="textsf">$1</span>');
      st = st.replace(/\\textsl\{([^\}]+)\}/g,'<span class="textsl">$1</span>');
      st = st.replace(/\\texttt\{([^\}]+)\}/g,'<code class="texttt">$1</code>');
      st = st.replace(/\\emph\{([^\}]+)\}/g,'<em>$1</em>');
      st = st.replace(/\\verb\|([^\|]+)\|/g,'<pre class="verb">$1</pre>');
      
      st = st.replace(/\\begin\{table\}([\s\S]*?)\\end\{table\}/g,table);
       
      st = st.replace(/\\begin\{tabular\}\{[^\}]*\}/g,'<table class="LaTeXtable">\n<tr><td>');
      
      
      st = st.replace(/\\label\{([^\}]+)\}/g,'<a class="label" id="$1"></a>');
      st = st.replace(/\\ref\{(\w+)\}/g,'<a class="ref" href="#$1">$1</a>');
      st = st.replace(/\\url\{([^\}]+)\}/g,'<a href="$1">$1</a>');
      st = st.replace(/\\href\{([^\}]+)\}\{([^\}]+)\}/g,'<a href="$1">$2</a>');
      st = st.replace(/\\cite\{([^\}]+)\}/g,'[<a class="cite" href="#$1">$1</a>]');
      st = st.replace(/\\begin\{figure\}\[[^\]]+\]/g,'<table class="figure">');
      st = st.replace(/\\begin\{figure\}/g,'<table class="figure">');
      st = st.replace(/\\end\{figure\}/g,"</table>");
      st = st.replace(/\\includegraphics\{([^\}]+)\}/g,'<tr><td class="image"><img src="$1"></td></tr>');
      /////////////////////////////////////////////
      st = st.replace(/(?:\\begin{\\?SVGgraph}|\\SVGgraph|\(:graph\s)((.|\n)*?)(?:\\end{\\?SVGgraph}|\\end?SVGgraph|:\))/g,SVGGraph);
      /////////////////////////////////////////////
      var j = st.search(/\\caption\{[\s\S]+\}/); 
      while(j >= 0) { 
          st = st.replace(/\\caption\{/ ,'<tr><td class="caption">');
          var c = 1;
          for(var k=j; k<st.length;k++) { 
              if(st.charAt(k) == "{") { c++ };
              if(st.charAt(k) == "}") { c-- };
              if(c == 0) { 
                  st = st.substring(0,k)+"</td></tr>"+st.substring(k+1,st.length) ;
                  break;
              }
          };
          j = st.search(/\\caption\{[\s\S]+\}/);
      }
      
      st = st.replace(/\\LaTeX/g,"LaTeX");
      st = st.replace(/``/g,"\u201c");
      st = st.replace(/''/g,"\u201d");
      
      st = st.replace(/([^\\])\\(\s)/g,"$1\u00A0$2"); //handle backslashspace
      st = st.replace(/\\quad/g,"\u2001");
      st = st.replace(/\\qquad/g,"\u2001\u2001");
      st = st.replace(/\\indent/g,"\u2001\u2001");
      st = st.replace(/\\enspace/g,"\u2002");
      st = st.replace(/\\;/g,"\u2004");
      st = st.replace(/\\:/g,"\u2005");
      st = st.replace(/\\,/g,"\u2006");
      st = st.replace(/\\thinspace/g,"\u200A");
      st = st.replace(/([^\\])~/g,"$1\u00A0");
      st = st.replace(/\\~/g,"~");
      st = st.replace(/\\textbackslash /g,"\\<b></b>");
      st = st.replace(/\\n(?=\s)/g,"<br>");
      st = st.replace(/\\newline/g,"<br>");
      st = st.replace(/\\linebreak/g,"<br>");
      st = st.replace(/\\smallskip/g,'<p class="smallskip">&nbsp</p>');
      st = st.replace(/\\medskip/g,'<p class="medskip">&nbsp</p>');
      st = st.replace(/\\bigskip/g,'<p class="bigskip">&nbsp</p>');
      st = st.replace(/[\n\r]+[ \f\n\r\t\v\u2028\u2029]*[\n\r]+/g,'<p></p>');
      st = st.replace(/\\bibitem[^\{]*\{(\w*)\}/g,"<br>[<a name='$1'>$1</a>] ");
      st = st.replace(/\{\\scriptsize/g,"");
      
      //miscellaneous nonstandard translations
      st = st.replace(/\\centering/g,"");
      st = st.replace(/\\G/g,"");
      
      st = st.replace(/\\begin\{exercises\}/g,'<div class="exercises">');
      st = st.replace(/\\end\{exercises\}/g,"</div>");
      
      st = st.replace(/\\problem/g,'<span class="problem"></span>');
      
      st = st.replace(/\\begin\{sol\}/g,'<div class="solution">');
      st = st.replace(/\\end\{sol\}/g,"</div>");
      
      st = st.replace(/\\qed/g,"\u220E");
      st = st.replace(/\\endproof/g,"\u220E");
      st = st.replace(/\\proof/g,"<b>Proof: </b>");

      pres[i].outerHTML = st;
   // }
  }

	(function () { //config and run MathJax
	  var head = document.getElementsByTagName("head")[0], script;
	  script = document.createElement("script");
	  script.type = "text/x-mathjax-config";
	  script[(window.opera ? "innerHTML" : "text")] =
		"MathJax.Hub.Config({\n" +
    /* *********** */
    " 'HTML-CSS': {\n" +
    "    matchFontHeight: false\n" +
    "  },\n" +
    /* *********** */
    "  showProcessingMessages : false,\n" + 
    "  messageStyle : 'none',\n" + 
    "  showMathMenu: false ,\n" +
		"  tex2jax: { inlineMath: [['$','$'], ['\\\\(','\\\\)']],  preview : 'none', processEscapes: true },\n" +
		"  TeX: { extensions: ['color.js'], equationNumbers: { autoNumber: 'AMS' } }\n" +
		"});"
	  head.appendChild(script);
	  script = document.createElement("script");
	  script.type = "text/javascript";
	  //script.src  = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
	  script.src  = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
	  head.appendChild(script);
	})();
 }
})();
   
  

//////////////////////////////////////////////////////////////////////////////////////////////////
var translateOnLoad = true;    // set to false to do call translators from js 
var translateASCIIsvg = true;  // false to preserve agraph.., \begin{graph}..
//var avoidinnerHTML = false;   // set true if assigning to innerHTML gives error
// eliminating d.svg -- not needed in IE9+
//var dsvglocation = ""; // path to d.svg (blank if same as ASCIIMathML.js loc)

// this test no longer valid -- IE9 supports createElementNS()
// var isIE = document.createElementNS==null;
// feature tests:
var hasCreateWithNS = !(document.createElementNS==null);
var hasGetByID = !(document.getElementById==null);
var hasWindowSVG = (window['SVGElement'] || window['SVGSVGElement']);
var hasButtonSetOnClickAttr = !(myCreateElementXHTML("button").setAttribute == null)

if (!hasGetByID) 
  alert("This webpage requires a recent browser such as\
\nFirefox 4+, Internet Explorer 9+, Opera 9+, Chrome 4+, or Safari 4+")

// you can change these
var checkIfSVGavailable = true;
var notifyIfNoSVG = true;
var alertIfNoSVG = false;

// global defaults used if not specified by graph (you can change these)
var defaultwidth = 300; defaultheight = 200;   // in pixels
var defaultxmin = -5.5; defaultxmax = 5.5;     // in usercoords
var defaultborder = 1; border = defaultborder; // in pixel

var defaultstrokewidth = "1"; // default line width in pixel
var defaultstroke = "blue";   // default line color
var defaultstrokeopacity = 1; // transparent = 0, solid =1
var defaultstrokedasharray = null; // "10,10" gives 10px long dashes
var defaultfill = "none";        // default fill color

var defaultfillopacity = 1;      // transparent = 0, solid =1
var defaultfontstyle = "normal"; // default text shape normal|italic|inherit
var defaultfontfamily = "times"; // default font times|ariel|helvetica|...
var defaultfontsize = "16";      // default size (scaled automatically)
var defaultfontweight = "normal";// normal|bold|bolder|lighter|100|...|900
var defaultfontstroke = "none";  // default font outline color
var defaultfontfill = "none";    // default font color
var defaultmarker = "none";      // "dot" | "arrow" | "+" | "-" | "|"
var defaultendpoints = "";       // "c-d" where c is <|o|* and d is >|o|*

// global values used for all pictures (you can change these)
var showcoordinates = true;
var markerstrokewidth = "1";
var markerstroke = "black";
var markerfill = "yellow";
var markersize = 4;
var arrowfill = stroke;
var dotradius = 4;
var ticklength = 4;
var axesstroke = "black";
var gridstroke = "grey";
var backgroundstyle = "fill-opacity:0; fill:white";
var singlelettersitalic = true;

// internal variables (probably no need to change these)
var picturepos = null; // position of picture relative to top of HTML page
var xunitlength;       // in pixels, used to convert to user coordinates
var yunitlength;       // in pixels
var origin = [0,0];    // in pixels (default is bottom left corner)
var above = "above";   // shorthands (to avoid typing quotes)
var below = "below";
var left = "left";
var right = "right";
var aboveleft = "aboveleft";
var aboveright = "aboveright";
var belowleft = "belowleft";
var belowright = "belowright";
var xmin, xmax, ymin, ymax, xscl, yscl, 
    xgrid, ygrid, xtick, ytick, initialized;
var strokewidth, strokedasharray, stroke, fill, strokeopacity, fillopacity;
var fontstyle, fontfamily, fontsize, fontweight, fontstroke, fontfill;
var marker, endpoints, dynamic = {};
var picture, svgpicture, doc, width, height, a, b, c, d, i, n, p, t, x, y;
// var isIE = document.createElementNS==null;

var cpi = "\u03C0", ctheta = "\u03B8";      // character for pi, theta
var log = function(x) { return ln(x)/ln(10) };
var pi = Math.PI,
    e = Math.E, 
    ln = Math.log, 
    sqrt = Math.sqrt;
var floor = Math.floor, ceil = Math.ceil, abs = Math.abs;
var sin = Math.sin, cos = Math.cos, tan = Math.tan;
var arcsin = Math.asin, arccos = Math.acos, arctan = Math.atan;
var sec = function(x) { return 1/Math.cos(x) };
var csc = function(x) { return 1/Math.sin(x) };
var cot = function(x) { return 1/Math.tan(x) };
var arcsec = function(x) { return arccos(1/x) };
var arccsc = function(x) { return arcsin(1/x) };
var arccot = function(x) { return arctan(1/x) };
var sinh = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
var cosh = function(x) { return (Math.exp(x)+Math.exp(-x))/2 };
var tanh = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)) };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsinh = function(x) { return ln(x+Math.sqrt(x*x+1)) };
var arccosh = function(x) { return ln(x+Math.sqrt(x*x-1)) };
var arctanh = function(x) { return ln((1+x)/(1-x))/2 };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsech = function(x) { return arccosh(1/x) };
var arccsch = function(x) { return arcsinh(1/x) };
var arccoth = function(x) { return arctanh(1/x) };
var sign = function(x) { return (x==0?0:(x<0?-1:1)) };

function factorial(x,n) { // Factorial function
  if (n==null) n=1;
  if (Math.abs(x-Math.round(x*1000000)/1000000)<1e-15)
    x = Math.round(x*1000000)/1000000;
  if (x-Math.floor(x)!=0) return NaN;
  for (var i=x-n; i>0; i-=n) x*=i;
  return (x<0?NaN:(x==0?1:x));
}

function C(x,k) {  // Binomial coefficient function
  var res=1;
  for (var i=0; i<k; i++) res*=(x-i)/(k-i);
  return res;
}

function chop(x,n) { // Truncate decimal number to n places after decimal point
  if (n==null) n=0;
  return Math.floor(x*Math.pow(10,n))/Math.pow(10,n);
}

function ran(a,b,n) { // Generate random number in [a,b] with n digits after .
  if (n==null) n=0;
  return chop((b+Math.pow(10,-n)-a)*Math.random()+a,n);
}

function myCreateElementXHTML(t) {
  if (!hasCreateWithNS) return document.createElement(t);
  else return document.createElementNS("http://www.w3.org/1999/xhtml",t);
}

function myCreateElementSVG(t) {
  if (!hasCreateWithNS) return doc.createElement(t);
  else return doc.createElementNS("http://www.w3.org/2000/svg",t);
}

function getElementsByClass(container, tagName, clsName){
  var list = new Array(0);
  var collection = container.getElementsByTagName(tagName);
  for(var i = 0; i < collection.length; i++)
    if(collection[i].className.slice(0,clsName.length)==clsName)
      list[list.length] = collection[i];
  return list;
}

function findPos(obj) { // top-left corner of obj on HTML page in pixel
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    curleft = obj.offsetLeft
    curtop = obj.offsetTop
    while (obj = obj.offsetParent) {
      curleft += obj.offsetLeft
      curtop += obj.offsetTop
    }
  }
  return [curleft,curtop];
}

function isSVGavailable() {
  var nd = myCreateElementXHTML("center");
  nd.appendChild(document.createTextNode("To view the "));
  var an = myCreateElementXHTML("a");
  an.appendChild(document.createTextNode("ASCIIsvg"));
  an.setAttribute("href","http://www.chapman.edu/~jipsen/asciisvg.html");
  nd.appendChild(an);
  nd.appendChild(document.createTextNode(" images use Internet Explorer 6+"));
  an = myCreateElementXHTML("a");
  an.appendChild(document.createTextNode("Adobe SVGviewer 3.02"));
  an.setAttribute("href","http://www.adobe.com/svg");
  nd.appendChild(an);
  nd.appendChild(document.createTextNode(" or "));
  an = myCreateElementXHTML("a");
  an.appendChild(document.createTextNode("SVG enabled Mozilla/Firefox"));
  an.setAttribute("href",
    "http://www.chapman.edu/~jipsen/svg/svgenabledmozillafirefox.html");
  nd.appendChild(an);

  // new feature test code below
    if (hasWindowSVG) return null;
    else return nd;
}

function setText(st,id) { // add text to an existing node with given id
  var node = document.getElementById(id);
  if (node!=null)
    if (node.childNodes.length!=0) node.childNodes[0].nodeValue = st;
    else node.appendChild(document.createTextNode(st));
}

function getX(evt) { // return mouse x-coord in user coordinate system
  var svgroot = evt.target.parentNode;
  // eliminated "isIE" from below, using "!!window.pageXOffset" instead
  return (evt.clientX+(!!window.pageXOffset?0:window.pageXOffset)-svgroot.getAttribute("left")-svgroot.getAttribute("ox"))/(svgroot.getAttribute("xunitlength")-0);
}

function getY(evt) { // return mouse y-coord in user coordinate system
  var svgroot = evt.target.parentNode;
  // eliminated "isIE" from below, using "!!window.pageXOffset" instead
  return (svgroot.getAttribute("height")-svgroot.getAttribute("oy")-(evt.clientY+(!!window.pageXOffset?0:window.pageYOffset)-svgroot.getAttribute("top")))/(svgroot.getAttribute("yunitlength")-0);
}

function translateandeval(src) { //modify user input to JavaScript syntax
  var errstr;
  // replace plot(f(x),...) with plot("f(x)",...)  
  src = src.replace(/plot\(\x20*([^\"f\[][^\n\r;]+?)\,/g,"plot\(\"$1\",");
  src = src.replace(/plot\(\x20*([^\"f\[][^\n\r;]+)\)/g,"plot(\"$1\")");

  // replace (expr,expr) by [expr,expr] where expr has no (,) in it
  src = src.replace(/([=(,]\x20*)\(([-a-z0-9./+*]+?),([-a-z0-9./+*]+?)\)/g,"$1[$2,$3]");

  // insert * between digit and letter e.g. 2x --> 2*x
  src = src.replace(/([0-9])([a-zA-Z])/g,"$1*$2");
  src = src.replace(/\)([\(0-9a-zA-Z])/g,"\)*$1");

  try {
    with (Math) eval(src);          // here the svgpicture object is created
  } catch(err) {
    if (err!="wait") {
      if (typeof err=="object") 
        errstr = err.name+" "+err.message+" "+err.number+" "+err.description;
      else errstr = err;
      alert(errstr+"\n"+src)
    }
  }
}

function drawPictures() { // main routine; called after webpage has loaded
  var src, id, dsvg, nd, node, ht, index, cols, arr, i, node2;
  var pictures = document.getElementsByTagName("textarea");
  for (index = 0; index<pictures.length; index++)
    if (pictures[index].className=="ASCIIsvg"){
      pictures[index].style.display="none";  // hide the textarea
    }
  var ASbody = document.getElementsByTagName("body")[0];
  pictures = getElementsByClass(ASbody,"embed","ASCIIsvg");
  var len = pictures.length;

  // look at browser tests here again -- some of this can be fixed in other places
  if (checkIfSVGavailable) {
    nd = isSVGavailable();
    if (nd != null && notifyIfNoSVG && len>0)
      if (alertIfNoSVG)
        alert("For Internet Explorer, requires Version 9 or later");
      else {
        ASbody.insertBefore(nd,ASbody.childNodes[0]);
      }
  }
 if (nd == null) {
  for (index = 0; index < len; index++) {
   width = null; height = null; 
   xmin = null; xmax = null; ymin = null; ymax = null;
   xscl = null; xgrid = null; yscl = null; ygrid = null;
   initialized = false;
   picture = pictures[index];  // current picture object
   src = picture.getAttribute("script"); // get the ASCIIsvg code
   if (src==null) src = "";
   // insert "axes()" if not present  ******** experimental
   if (!/axes\b|initPicture/.test(src)) {
     var i = 0
     while (/((yscl|ymax|ymin|xscl|xmax|xmin|\bwidth|\bheight)\s*=\s*-?\d*(\d\.|\.\d|\d)\d*\s*;?)/.test(src.slice(i))) i++;
     src = (i==0?"axes(); "+src: src.slice(0,i)+src.slice(i).replace(/((scl|max|min|idth|eight)\s*=\s*-?\d*(\d\.|\.\d|\d)\d*\s*;?)/,"$1\naxes();"));
   }
   ht = picture.getAttribute("height");
   // changed test below from "isIE" -- trying to eliminate those
   if (picture.getAttribute("wmode")=="") {
     picture.setAttribute("wmode","transparent");
   }
   if (document.getElementById("picture"+(index+1)+"mml")==null) {
     picture.parentNode.style.position = "relative";
     node = myCreateElementXHTML("div");
     node.style.position = "absolute";
     node.style.top = "0px";
     node.style.left = "0px";
     node.setAttribute("id","picture"+(index+1)+"mml");
     picture.parentNode.insertBefore(node,picture.nextSibling);
   }
   if (ht==null) ht ="";
   if (ht=="" || src=="") 
    if (document.getElementById("picture"+(index+1)+"input")==null) {
      node = myCreateElementXHTML("textarea");
      arr = src.split("\n");
      cols = 0;
      for (i=0;i<arr.length;i++) cols = Math.max(cols,arr[i].length);
      node.setAttribute("rows",Math.min(10,arr.length)+1);
      node.setAttribute("cols",Math.max(Math.min(60,cols),20)+5);
      // instead of testing for IE, test for existence of "\r\n" pairs and deal with them
      if (src.indexOf("\r\n")>-1) src = src.replace(/([^\r])\n/g,"$1\r");
      node.appendChild(document.createTextNode(src));
      if (src.indexOf("showcode()")==-1) node.style.display = "none";
      node.setAttribute("id","picture"+(index+1)+"input");
      picture.parentNode.insertBefore(node,picture.nextSibling);
      picture.parentNode.insertBefore(myCreateElementXHTML("br"),node);
     
      node2 = myCreateElementXHTML("button");
      node2.setAttribute("id","picture"+(index+1)+"button");
      // instead of testing fro IE, use feature existence test here
      if (hasButtonSetOnClickAttr) node2.setAttribute("onclick","updatePicture(this)");
      else node2.onclick = function() {updatePicture(this)};
      node2.setAttribute("onclick","updatePicture(this)");
      node2.appendChild(document.createTextNode("Update"));
      if (src.indexOf("showcode()")==-1) node2.style.display = "none";
      picture.parentNode.insertBefore(node2,node);
      picture.parentNode.insertBefore(myCreateElementXHTML("br"),node);
     
    } 
    else src = document.getElementById("picture"+(index+1)+"input").value;
    id = picture.getAttribute("id");
    dsvg = picture.getAttribute("src");
    if (id == null || id == "") {
      id = "picture"+(index+1);
      picture.setAttribute("id",id);
    }
    translateandeval(src)
  }
 }
}

function setdefaults() { //called before each graph is evaluated
  strokewidth = defaultstrokewidth;
  stroke = defaultstroke;
  strokeopacity = defaultstrokeopacity;
  strokedasharray = defaultstrokedasharray;
  fill = defaultfill;
  fillopacity = defaultfillopacity;
  fontstyle = defaultfontstyle;
  fontfamily = defaultfontfamily;
  fontsize = defaultfontsize;
  fontweight = defaultfontweight;
  fontstroke = defaultfontstroke;
  fontfill = defaultfontfill;
  marker = defaultmarker;
  endpoints = defaultendpoints;
}

function switchTo(id) { // used by dynamic code to select appropriate graph
  picture = document.getElementById(id);
  width = picture.getAttribute("width")-0;
  height = picture.getAttribute("height")-0;
  setdefaults();
  // eliminated some d.svg-related code here
    svgpicture = picture;
    doc = document;
  xunitlength = svgpicture.getAttribute("xunitlength")-0;
  yunitlength = svgpicture.getAttribute("yunitlength")-0;
  xmin = svgpicture.getAttribute("xmin")-0;
  xmax = svgpicture.getAttribute("xmax")-0;
  ymin = svgpicture.getAttribute("ymin")-0;
  ymax = svgpicture.getAttribute("ymax")-0;
  origin = [svgpicture.getAttribute("ox")-0,svgpicture.getAttribute("oy")-0];
}

function updatePicture(obj) {
  var node, src, id;
  if (typeof obj=="object") id = obj.id.slice(0,-6);
  else id = (typeof obj=="string"?obj:"picture"+(obj+1));
  src = document.getElementById(id+"input").value;
  xmin = null; xmax = null; ymin = null; ymax = null;
  xscl = null; xgrid = null; yscl = null; ygrid = null;
  initialized = false;
  picture = document.getElementById(id);
  translateandeval(src)
}

function changepicturesize(evt,factor) {
  var obj = evt.target;
  var name = obj.parentNode.getAttribute("name");
  var pic = document.getElementById(name);
  var src = document.getElementById(name+"input").value;
  src = src.replace(/width\s*=\s*\d+/,"width="+(factor*(pic.getAttribute("width")-0)));
  src = src.replace(/height\s*=\s*\d+/,"height="+(factor*(pic.getAttribute("height")-0)));
  document.getElementById(name+"input").value = src;
  updatePicture(name);
}

var sinceFirstClick = 0; // ondblclick simulation from 
var dblClkTimer;         // http://www.enja.org/david/?cat=13 Thanks!
function timer() {
  if(sinceFirstClick<60) {
    sinceFirstClick++;
    setTimeout("timer()",10);
  } else {
    clearTimeout(dblClkTimer);
    dblClkTimer = "";
  }
}
function mClick(evt) {
  if(sinceFirstClick!=0) {
    if(sinceFirstClick <= 40) {
      if (evt.shiftKey) changepicturesize(evt,2);
      else if (evt.altKey) changepicturesize(evt,.5);
      else showHideCode(evt);             // do this on dblclick
      clearTimeout(dblClkTimer);
      dblClkTimer = "";
    } else {
      clearTimeout(dblClkTimer);
      sinceFirstClick = 0;
      dblClkTimer = setTimeout("timer()",10);
    }        
  } else {
    sinceFirstClick = 0;
    dblClkTimer = setTimeout("timer()",10);
  }
}

function showHideCode(evt) { // called by onclick event
//  if (evt.getDetail()==2) {//getDetail unfortunately not in Firefox
  var obj=evt.target;
  var name = obj.parentNode.getAttribute("name");
  var node = document.getElementById(name+"input");
  node.style.display = (node.style.display == "none"?"":"none");
  var node = document.getElementById(name+"button");
  node.style.display = (node.style.display == "none"?"":"none");
//  }
}

function showcode() {} // do nothing

function setBorder(x) { border = x } //deprecate

function initPicture(x_min,x_max,y_min,y_max) { // set up the graph
// usually called by axes() or noaxes(), but can be used directly
 if (!initialized) {
  setdefaults();
  initialized = true;
  if (x_min!=null) xmin = x_min;
  if (x_max!=null) xmax = x_max;
  if (y_min!=null) ymin = y_min;
  if (y_max!=null) ymax = y_max;
  if (xmin==null) xmin = defaultxmin;
  if (xmax==null) xmax = defaultxmax;
 if (typeof xmin != "number" || typeof xmax != "number" || xmin >= xmax) 
   alert("Picture requires at least two numbers: xmin < xmax");
 else if (y_max != null && (typeof y_min != "number" || 
          typeof y_max != "number" || y_min >= y_max))
   alert("initPicture(xmin,xmax,ymin,ymax) requires numbers ymin < ymax");
 else {
  if (width==null) {
    width = picture.getAttribute("width");
    if (width==null || width=="") width=defaultwidth;
  }
  picture.setAttribute("width",width);
  if (height==null) { 
    height = picture.getAttribute("height");
    if (height==null || height=="") height=defaultheight;
  }
  picture.setAttribute("height",height);
  xunitlength = (width-2*border)/(xmax-xmin);
  yunitlength = xunitlength;
  if (ymin==null) {
    origin = [-xmin*xunitlength+border,height/2];
    ymin = -(height-2*border)/(2*yunitlength);
    ymax = -ymin;
  } else {
    if (ymax!=null) yunitlength = (height-2*border)/(ymax-ymin);
    else ymax = (height-2*border)/yunitlength + ymin;
    origin = [-xmin*xunitlength+border,-ymin*yunitlength+border];
  }
  // everything up to here valid enough...
  // want to eliminate "isIE" test below -- last one
  // keeping here commented out just in case
  //if (isIE) {
  //  if (picture.FULLSCREEN==undefined) {
  //    setTimeout('drawPictures()',50);
  //    throw "wait";
  //  }
  //  svgpicture = picture.getSVGDocument().getElementById("root");
    // this code seems to be based on the d.svg which also shouldn't be necessary anymore
  //  if (svgpicture==null) {
  //    setTimeout('drawPictures()',50);
  //    throw "wait";
  //  }
  //  svgpicture = picture.getSVGDocument().getElementById("root");
  //  while (svgpicture.childNodes.length>0) 
  //    svgpicture.removeChild(svgpicture.lastChild); 
  //  svgpicture.setAttribute("width",width);
  //  svgpicture.setAttribute("height",height);
  //  svgpicture.setAttribute("name",picture.getAttribute("id"));
  //  doc = picture.getSVGDocument();
  //  var nd = document.getElementById(picture.getAttribute("id")+"mml");
  //  if (nd!=null) // clear out MathML layer
  //    while (nd.childNodes.length>0) nd.removeChild(nd.lastChild); 
  //} else {
    var qnode = document.createElementNS("http://www.w3.org/2000/svg","svg");
    qnode.setAttribute("id",picture.getAttribute("id"));
    qnode.setAttribute("name",picture.getAttribute("id"));
    qnode.setAttribute("style","display:inline");
    qnode.setAttribute("width",picture.getAttribute("width"));
    qnode.setAttribute("height",picture.getAttribute("height"));
    picturepos = findPos(picture);
    qnode.setAttribute("left",picturepos[0]);
    qnode.setAttribute("top",picturepos[1]);
    qnode.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
    if (picture.parentNode!=null) {
      picture.parentNode.replaceChild(qnode,picture);
    } else {
      svgpicture.parentNode.replaceChild(qnode,svgpicture);
    }
    svgpicture = qnode;
    doc = document;
  //}
  svgpicture.setAttribute("xunitlength",xunitlength);
  svgpicture.setAttribute("yunitlength",yunitlength);
  svgpicture.setAttribute("xmin",xmin);
  svgpicture.setAttribute("xmax",xmax);
  svgpicture.setAttribute("ymin",ymin);
  svgpicture.setAttribute("ymax",ymax);
  svgpicture.setAttribute("ox",origin[0]);
  svgpicture.setAttribute("oy",origin[1]);
  var node = myCreateElementSVG("rect");
  node.setAttribute("x","0");
  node.setAttribute("y","0");
  node.setAttribute("width",width);
  node.setAttribute("height",height);
  node.setAttribute("style",backgroundstyle);
  svgpicture.appendChild(node);
  svgpicture.setAttribute("onmousemove","displayCoord(evt)");
  svgpicture.setAttribute("onmouseout","removeCoord(evt)");
  /////////////////////////////////////////////////
  svgpicture.setAttribute("onclick","mClick(evt)");
  /////////////////////////////////////////////////
  node = myCreateElementSVG("text");
  node.appendChild(doc.createTextNode(" "));
  svgpicture.appendChild(node);
  border = defaultborder;
 }
 }
}

//////////////////////////user graphics commands start/////////////////////////

function line(p,q,id,endpts) { // segment connecting points p,q (coordinates in units)
  var node;
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("path");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
  }
  node.setAttribute("d","M"+(p[0]*xunitlength+origin[0])+","+
    (height-p[1]*yunitlength-origin[1])+" "+
    (q[0]*xunitlength+origin[0])+","+(height-q[1]*yunitlength-origin[1]));
  node.setAttribute("stroke-width", strokewidth);
  if (strokedasharray!=null) 
    node.setAttribute("stroke-dasharray", strokedasharray);
  node.setAttribute("stroke", stroke);
  node.setAttribute("fill", fill);
  node.setAttribute("stroke-opacity", strokeopacity);
  node.setAttribute("fill-opacity", fillopacity);
  if (marker=="dot" || marker=="arrowdot") {
    ASdot(p,markersize,markerstroke,markerfill);
    if (marker=="arrowdot") arrowhead(p,q);
    ASdot(q,markersize,markerstroke,markerfill);
  } else if (marker=="arrow") arrowhead(p,q);
  if (endpts==null && endpoints!="") endpts = endpoints;
  if (endpts!=null) {
    if (endpts.indexOf("<-") != -1) arrowhead(q,p);
    if (endpts.indexOf("o-") != -1) dot(p, "open");
    if (endpts.indexOf("*-") != -1) dot(p, "closed");
    if (endpts.indexOf("->") != -1) arrowhead(p,q);
    if (endpts.indexOf("-o") != -1) dot(q, "open");
    if (endpts.indexOf("-*") != -1) dot(q, "closed");
  }
}

function path(plist,id,c,endpts) {
  if (c==null) c="";
  var node, st, i;
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("path");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
  }
  if (typeof plist == "string") st = plist;
  else {
    st = "M";
    st += (plist[0][0]*xunitlength+origin[0])+","+
          (height-plist[0][1]*yunitlength-origin[1])+" "+c;
    for (i=1; i<plist.length; i++)
      st += (plist[i][0]*xunitlength+origin[0])+","+
            (height-plist[i][1]*yunitlength-origin[1])+" ";
  }
  node.setAttribute("d", st);
  node.setAttribute("stroke-width", strokewidth);
  if (strokedasharray!=null) 
    node.setAttribute("stroke-dasharray", strokedasharray);
  node.setAttribute("stroke", stroke);
  node.setAttribute("fill", fill);
  node.setAttribute("stroke-opacity", strokeopacity);
  node.setAttribute("fill-opacity", fillopacity);
  if (marker=="dot" || marker=="arrowdot")
    for (i=0; i<plist.length; i++)
      if (c!="C" && c!="T" || i!=1 && i!=2)
        ASdot(plist[i],markersize,markerstroke,markerfill);
  if (endpts==null && endpoints!="") endpts = endpoints;
  if (endpts!=null) {
    if (endpts.indexOf("<-") != -1) arrowhead(plist[1],plist[0]);
    if (endpts.indexOf("o-") != -1) dot(plist[0], "open");
    if (endpts.indexOf("*-") != -1) dot(plist[0], "closed");
    if (endpts.indexOf("->") != -1) arrowhead(plist[plist.length-2],plist[plist.length-1]);
    if (endpts.indexOf("-o") != -1) dot(plist[plist.length-1], "open");
    if (endpts.indexOf("-*") != -1) dot(plist[plist.length-1], "closed");
  }
}

function curve(plist,id,endpts) {
  path(plist,id,"T",endpts);
}

function vector(p,q,id) {
  line(p,q,id,"","->");
}

function circle(center,radius,id) { // coordinates in units
  var node;
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("circle");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
  }
  node.setAttribute("cx",center[0]*xunitlength+origin[0]);
  node.setAttribute("cy",height-center[1]*yunitlength-origin[1]);
  node.setAttribute("r",radius*xunitlength);
  node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke", stroke);
  node.setAttribute("fill", fill);
  node.setAttribute("stroke-opacity", strokeopacity);
  node.setAttribute("fill-opacity", fillopacity);
}

function loop(p,d,id) { 
// d is a direction vector e.g. [1,0] means loop starts in that direction
  if (d==null) d=[1,0];
  path([p,[p[0]+d[0],p[1]+d[1]],[p[0]-d[1],p[1]+d[0]],p],id,"C");
  if (marker=="arrow" || marker=="arrowdot") 
    arrowhead([p[0]+Math.cos(1.4)*d[0]-Math.sin(1.4)*d[1],
               p[1]+Math.sin(1.4)*d[0]+Math.cos(1.4)*d[1]],p);
}

function arc(start,end,radius,id) { // coordinates in units
  var node, v;
  if (id!=null) node = doc.getElementById(id);
  if (radius==null) {
    v=[end[0]-start[0],end[1]-start[1]];
    radius = Math.sqrt(v[0]*v[0]+v[1]*v[1]);
  }
  if (node==null) {
    node = myCreateElementSVG("path");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
  }
  node.setAttribute("d","M"+(start[0]*xunitlength+origin[0])+","+
    (height-start[1]*yunitlength-origin[1])+" A"+radius*xunitlength+","+
     radius*yunitlength+" 0 0,0 "+(end[0]*xunitlength+origin[0])+","+
    (height-end[1]*yunitlength-origin[1]));
  node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke", stroke);
  node.setAttribute("fill", fill);
  node.setAttribute("stroke-opacity", strokeopacity);
  node.setAttribute("fill-opacity", fillopacity);
  if (marker=="arrow" || marker=="arrowdot") {
    u = [(end[1]-start[1])/4,(start[0]-end[0])/4];
    v = [(end[0]-start[0])/2,(end[1]-start[1])/2];
    v = [start[0]+v[0]+u[0],start[1]+v[1]+u[1]];
  } else v=[start[0],start[1]];
  if (marker=="dot" || marker=="arrowdot") {
    ASdot(start,markersize,markerstroke,markerfill);
    if (marker=="arrowdot") arrowhead(v,end);
    ASdot(end,markersize,markerstroke,markerfill);
  } else if (marker=="arrow") arrowhead(v,end);
}

function sector(center,start,end,id) { // center,start,end should be isoceles
  var rx = start[0]-center[0], ry = start[1]-center[1];
  arc(start,end,Math.sqrt(rx*rx+ry*ry),id+"arc");
  path([end,center,start],id+"path");
}

function ellipse(center,rx,ry,id) { // coordinates in units
  var node;
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("ellipse");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
  }
  node.setAttribute("cx",center[0]*xunitlength+origin[0]);
  node.setAttribute("cy",height-center[1]*yunitlength-origin[1]);
  node.setAttribute("rx",rx*xunitlength);
  node.setAttribute("ry",ry*yunitlength);
  node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke", stroke);
  node.setAttribute("fill", fill);
  node.setAttribute("stroke-opacity", strokeopacity);
  node.setAttribute("fill-opacity", fillopacity);
}

function triangle(p,q,r,id) {
  path([p,q,r,p],id)
}

function rect(p,q,id,rx,ry) { // opposite corners in units, rounded by radii
  var node;
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("rect");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
  }
  node.setAttribute("x",p[0]*xunitlength+origin[0]);
  node.setAttribute("y",height-q[1]*yunitlength-origin[1]);
  node.setAttribute("width",(q[0]-p[0])*xunitlength);
  node.setAttribute("height",(q[1]-p[1])*yunitlength);
  if (rx!=null) node.setAttribute("rx",rx*xunitlength);
  if (ry!=null) node.setAttribute("ry",ry*yunitlength);
  node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke", stroke);
  node.setAttribute("fill", fill);
  node.setAttribute("stroke-opacity", strokeopacity);
  node.setAttribute("fill-opacity", fillopacity);
}

function text(p,st,pos,id,fontsty) {
  var dnode, node, dx = 0, dy = fontsize/3;

  var textanchor = "middle";  // regular text goes into SVG
  if (pos!=null) {
    if (/above/.test(pos)) dy = -fontsize/2;
    if (/below/.test(pos)) dy = fontsize-0;
    if (/right/.test(pos)) {textanchor = "start"; dx = fontsize/4;}
    if ( /left/.test(pos)) {textanchor = "end";  dx = -fontsize/4;}
  }
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("text");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
    node.appendChild(doc.createTextNode(st));
  }
  while (node.childNodes.length>1) node.removeChild(node.lastChild); 
//  node.appendChild(document.createTextNode("\xA0"+st+"\xA0"));
  node.lastChild.nodeValue = "\xA0"+st+"\xA0";
  node.setAttribute("x",p[0]*xunitlength+origin[0]+dx);
  node.setAttribute("y",height-p[1]*yunitlength-origin[1]+dy);
  node.setAttribute("font-style",(fontsty!=null?fontsty:
    (st.search(/^[a-zA-Z]$/)!=-1?"italic":fontstyle)));
  node.setAttribute("font-family",fontfamily);
  node.setAttribute("font-size",fontsize);
  node.setAttribute("font-weight",fontweight);
  node.setAttribute("text-anchor",textanchor);
  if (fontstroke!="none") node.setAttribute("stroke",fontstroke);
  if (fontfill!="none") node.setAttribute("fill",fontfill);
  return p;
}

// following method -- TEL 2/6/2013
function latex(p,st,id,fontsty) {
  if (!myCreateElementSVG("foreignObject")) return text(p,"foreignObject not supported","below right");
  else { // foreignObject supported, so...
  var node;
  var frag = myCreateElementXHTML("div");
  frag.setAttribute("style","float:left");
  frag.innerHTML = st;
  var uid = "_asciisvg_f_foreign_object_content_"
  frag.id = uid; 
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("foreignObject");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
    node.appendChild(frag);
  }
  if (typeof MathJax != "undefined") {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,node]);//!!
    MathJax.Hub.Queue(function() {
      node.setAttribute("width",document.getElementById(uid).offsetWidth);
      node.setAttribute("height",document.getElementById(uid).offsetHeight); 
    });
  } else {
    node.setAttribute("width",document.getElementById(uid).offsetWidth);
    node.setAttribute("height",document.getElementById(uid).offsetHeight);
  }
  node.setAttribute("x",p[0]*xunitlength+origin[0]);
  node.setAttribute("y",height-p[1]*yunitlength-origin[1]);
  node.setAttribute("font-style",(fontsty!=null?fontsty:fontstyle));
  node.setAttribute("font-family",fontfamily);
  node.setAttribute("font-size",fontsize);
  node.setAttribute("font-weight",fontweight);
  if (fontstroke!="none") node.setAttribute("stroke",fontstroke);
  if (fontfill!="none") node.setAttribute("fill",fontfill);

  return p;
  } // end case foreignObject supported
}

function mtext(p,st,pos,fontsty) { // method for updating text on an svg
// "this" is the text object or the svgpicture object
  var textanchor = "middle";
  var dx = 0; var dy = fontsize/3;
  if (pos!=null) {
    if (pos.slice(0,5)=="above") dy = -fontsize/2;
    if (pos.slice(0,5)=="below") dy = fontsize-0;
    if (pos.slice(0,5)=="right" || pos.slice(5,10)=="right") {
      textanchor = "start";
      dx = fontsize/2;
    }
    if (pos.slice(0,4)=="left" || pos.slice(5,9)=="left") {
      textanchor = "end";
      dx = -fontsize/2;
    }
  }
  var node = this;
  if (this.nodeName=="svg") {
    node = myCreateElementSVG("text");
    this.appendChild(node);
    node.appendChild(doc.createTextNode(st));
  }
  node.lastChild.nodeValue = st;
  node.setAttribute("x",p[0]+dx);
  node.setAttribute("y",p[1]+dy);
  node.setAttribute("font-style",(fontsty!=null?fontsty:fontstyle));
  node.setAttribute("font-family",fontfamily);
  node.setAttribute("font-size",fontsize);
  node.setAttribute("font-weight",fontweight);
  node.setAttribute("text-anchor",textanchor);
  if (fontstroke!="none") node.setAttribute("stroke",fontstroke);
  if (fontfill!="none") node.setAttribute("fill",fontfill);
}

function image(imgurl,p,w,h,id) { // not working yet
  var node;
  if (id!=null) node = doc.getElementById(id);
  if (node==null) {
    node = myCreateElementSVG("image");
    node.setAttribute("id", id);
    svgpicture.appendChild(node);
  }
  node.setAttribute("x",p[0]*xunitlength+origin[0]);
  node.setAttribute("y",height-p[1]*yunitlength-origin[1]);
  node.setAttribute("width",w);
  node.setAttribute("height",h);
  node.setAttribute("xlink:href", imgurl);
}

function ASdot(center,radius,s,f) { // coordinates in units, radius in pixel
  if (s==null) s = stroke; if (f==null) f = fill;
  var node = myCreateElementSVG("circle");
  node.setAttribute("cx",center[0]*xunitlength+origin[0]);
  node.setAttribute("cy",height-center[1]*yunitlength-origin[1]);
  node.setAttribute("r",radius);
  node.setAttribute("stroke-width", strokewidth);
  node.setAttribute("stroke", s);
  node.setAttribute("fill", f);
  svgpicture.appendChild(node);
}

function dot(center, typ, label, pos, id) {
  var node;
  var cx = center[0]*xunitlength+origin[0];
  var cy = height-center[1]*yunitlength-origin[1];
  if (id!=null) node = doc.getElementById(id);
  if (typ=="+" || typ=="-" || typ=="|") {
    if (node==null) {
      node = myCreateElementSVG("path");
      node.setAttribute("id", id);
      svgpicture.appendChild(node);
    }
    if (typ=="+") {
      node.setAttribute("d",
        " M "+(cx-ticklength)+" "+cy+" L "+(cx+ticklength)+" "+cy+
        " M "+cx+" "+(cy-ticklength)+" L "+cx+" "+(cy+ticklength));
      node.setAttribute("stroke-width", .5);
      node.setAttribute("stroke", axesstroke);
    } else {
      if (typ=="-") node.setAttribute("d",
        " M "+(cx-ticklength)+" "+cy+" L "+(cx+ticklength)+" "+cy);
      else node.setAttribute("d",
        " M "+cx+" "+(cy-ticklength)+" L "+cx+" "+(cy+ticklength));
      node.setAttribute("stroke-width", strokewidth);
      node.setAttribute("stroke", stroke);
    }
  } else {
    if (node==null) {
      node = myCreateElementSVG("circle");
      node.setAttribute("id", id);
      svgpicture.appendChild(node);
    }
    node.setAttribute("cx",cx);
    node.setAttribute("cy",cy);
    node.setAttribute("r",dotradius);
    node.setAttribute("stroke-width", strokewidth);
    node.setAttribute("stroke", stroke);
    node.setAttribute("fill", (typ=="open"?"white":
                              (typ=="closed"?stroke:markerfill)));
  }
  if (label!=null) 
    text(center,label,(pos==null?"below":pos),(id==null?id:id+"label"))
}

point = dot; //alternative name

function arrowhead(p,q) { // draw arrowhead at q (in units) add size param
  var up;
  var v = [p[0]*xunitlength+origin[0],height-p[1]*yunitlength-origin[1]];
  var w = [q[0]*xunitlength+origin[0],height-q[1]*yunitlength-origin[1]];
  var u = [w[0]-v[0],w[1]-v[1]];
  var d = Math.sqrt(u[0]*u[0]+u[1]*u[1]);
  if (d > 0.00000001) {
    u = [u[0]/d, u[1]/d];
    up = [-u[1],u[0]];
    var node = myCreateElementSVG("path");
    node.setAttribute("d","M "+(w[0]-15*u[0]-4*up[0])+" "+
      (w[1]-15*u[1]-4*up[1])+" L "+(w[0]-3*u[0])+" "+(w[1]-3*u[1])+" L "+
      (w[0]-15*u[0]+4*up[0])+" "+(w[1]-15*u[1]+4*up[1])+" z");
    node.setAttribute("stroke-width", markerstrokewidth);
    node.setAttribute("stroke", stroke); /*was markerstroke*/
    node.setAttribute("fill", stroke); /*was arrowfill*/
    node.setAttribute("stroke-opacity", strokeopacity);
    node.setAttribute("fill-opacity", fillopacity);
    svgpicture.appendChild(node);    
  }
}

function chopZ(st) {
  var k = st.indexOf(".");
  if (k==-1) return st;
  for (var i=st.length-1; i>k && st.charAt(i)=="0"; i--);
  if (i==k) i--;
  return st.slice(0,i+1);
}

function grid(dx,dy) { // for backward compatibility
  axes(dx,dy,null,dx,dy)
}

function noaxes() {
  if (!initialized) initPicture();
}

function axes(dx,dy,labels,gdx,gdy) {
//xscl=x is equivalent to xtick=x; xgrid=x; labels=true;
  var x, y, ldx, ldy, lx, ly, lxp, lyp, pnode, st;
  if (!initialized) initPicture();
  if (typeof dx=="string") { labels = dx; dx = null; }
  if (typeof dy=="string") { gdx = dy; dy = null; }
  if (xscl!=null) {dx = xscl; gdx = xscl; labels = dx}
  if (yscl!=null) {dy = yscl; gdy = yscl}
  if (xtick!=null) {dx = xtick}
  if (ytick!=null) {dy = ytick}
  dx = (dx==null?xunitlength:dx*xunitlength);
  dy = (dy==null?dx:dy*yunitlength);
  fontsize = Math.min(dx/2,dy/2,16); //alert(fontsize)
  ticklength = fontsize/4;
  if (xgrid!=null) gdx = xgrid;
  if (ygrid!=null) gdy = ygrid;
  if (gdx!=null) {
    gdx = (typeof gdx=="string"?dx:gdx*xunitlength);
    gdy = (gdy==null?dy:gdy*yunitlength);
    pnode = myCreateElementSVG("path");
    st="";
    for (x = origin[0]; x<width; x = x+gdx)
      st += " M"+x+",0"+" "+x+","+height;
    for (x = origin[0]-gdx; x>0; x = x-gdx)
      st += " M"+x+",0"+" "+x+","+height;
    for (y = height-origin[1]; y<height; y = y+gdy)
      st += " M0,"+y+" "+width+","+y;
    for (y = height-origin[1]-gdy; y>0; y = y-gdy)
      st += " M0,"+y+" "+width+","+y;
    pnode.setAttribute("d",st);
    pnode.setAttribute("stroke-width", .5);
    pnode.setAttribute("stroke", gridstroke);
    pnode.setAttribute("fill", fill);
    svgpicture.appendChild(pnode);
  }
  pnode = myCreateElementSVG("path");
  st="M0,"+(height-origin[1])+" "+width+","+
    (height-origin[1])+" M"+origin[0]+",0 "+origin[0]+","+height;
  for (x = origin[0]+dx; x<width; x = x+dx)
    st += " M"+x+","+(height-origin[1]+ticklength)+" "+x+","+
           (height-origin[1]-ticklength);
  for (x = origin[0]-dx; x>0; x = x-dx)
    st += " M"+x+","+(height-origin[1]+ticklength)+" "+x+","+
           (height-origin[1]-ticklength);
  for (y = height-origin[1]+dy; y<height; y = y+dy)
    st += " M"+(origin[0]+ticklength)+","+y+" "+(origin[0]-ticklength)+","+y;
  for (y = height-origin[1]-dy; y>0; y = y-dy)
    st += " M"+(origin[0]+ticklength)+","+y+" "+(origin[0]-ticklength)+","+y;
  if (labels!=null) with (Math) {
    ldx = dx/xunitlength;
    ldy = dy/yunitlength;
    lx = (xmin>0 || xmax<0?xmin:0);
    ly = (ymin>0 || ymax<0?ymin:0);
    lxp = (ly==0?"below":"above");
    lyp = (lx==0?"left":"right");
    var ddx = floor(1.1-log(ldx)/log(10))+1;
    var ddy = floor(1.1-log(ldy)/log(10))+1;
    for (x = ldx; x<=xmax; x = x+ldx)
      text([x,ly],chopZ(x.toFixed(ddx)),lxp);
    for (x = -ldx; xmin<=x; x = x-ldx)
      text([x,ly],chopZ(x.toFixed(ddx)),lxp);
    for (y = ldy; y<=ymax; y = y+ldy)
      text([lx,y],chopZ(y.toFixed(ddy)),lyp);
    for (y = -ldy; ymin<=y; y = y-ldy)
      text([lx,y],chopZ(y.toFixed(ddy)),lyp);
  }
  fontsize = defaultfontsize;
  pnode.setAttribute("d",st);
  pnode.setAttribute("stroke-width", .5);
  pnode.setAttribute("stroke", axesstroke);
  pnode.setAttribute("fill", fill);
  pnode.setAttribute("stroke-opacity", strokeopacity);
  pnode.setAttribute("fill-opacity", fillopacity);
  svgpicture.appendChild(pnode);
}

function mathjs(st) {
  //translate a math formula to js function notation
  // a^b --> pow(a,b)
  // na --> n*a
  // (...)d --> (...)*d
  // n! --> factorial(n)
  // sin^-1 --> arcsin etc.
  //while ^ in string, find term on left and right
  //slice and concat new formula string
  st = st.replace(/\s/g,"");
  if (st.indexOf("^-1")!=-1) {
    st = st.replace(/sin\^-1/g,"arcsin");
    st = st.replace(/cos\^-1/g,"arccos");
    st = st.replace(/tan\^-1/g,"arctan");
    st = st.replace(/sec\^-1/g,"arcsec");
    st = st.replace(/csc\^-1/g,"arccsc");
    st = st.replace(/cot\^-1/g,"arccot");
    st = st.replace(/sinh\^-1/g,"arcsinh");
    st = st.replace(/cosh\^-1/g,"arccosh");
    st = st.replace(/tanh\^-1/g,"arctanh");
    st = st.replace(/sech\^-1/g,"arcsech");
    st = st.replace(/csch\^-1/g,"arccsch");
    st = st.replace(/coth\^-1/g,"arccoth");
  }
  st = st.replace(/^e$/g,"(Math.E)");
  st = st.replace(/^e([^a-zA-Z])/g,"(Math.E)$1");
  st = st.replace(/([^a-zA-Z])e/g,"$1(Math.E)");
//  st = st.replace(/([^a-zA-Z])e([^a-zA-Z])/g,"$1(Math.E)$2");
  st = st.replace(/([0-9])([\(a-zA-Z])/g,"$1*$2");
  st = st.replace(/\)([\(0-9a-zA-Z])/g,"\)*$1");
  var i,j,k, ch, nested;
  while ((i=st.indexOf("^"))!=-1) {
    //find left argument
    if (i==0) return "Error: missing argument";
    j = i-1;
    ch = st.charAt(j);
    if (ch>="0" && ch<="9") {// look for (decimal) number
      j--;
      while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      if (ch==".") {
        j--;
        while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      }
    } 
    else if (ch==")") {// look for matching opening bracket and function name
      nested = 1;
      j--;
      while (j>=0 && nested>0) {
        ch = st.charAt(j);
        if (ch=="(") nested--;
        else if (ch==")") nested++;
        j--;
      }
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } 
    else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      j--;
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } 
    else { 
      return "Error: incorrect syntax in "+st+" at position "+j;
    }
    //find right argument
    if (i==st.length-1) 
      return "Error: missing argument";
    k = i+1;
    ch = st.charAt(k);
    if (ch>="0" && ch<="9" || ch=="-") {// look for signed (decimal) number
      k++;
      while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
      if (ch==".") {
        k++;
        while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
      }
    } 
    else if (ch=="(") {// look for matching closing bracket and function name
      nested = 1;
      k++;
      while (k<st.length && nested>0) {
        ch = st.charAt(k);
        if (ch=="(") nested++;
        else if (ch==")") nested--;
        k++;
      }
    } 
    else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      k++;
      while (k<st.length && (ch=st.charAt(k))>="a" && ch<="z" || ch>="A" && ch<="Z") k++;
    } 
    else { 
      return "Error: incorrect syntax in "+st+" at position "+k;
    }
    st = st.slice(0,j+1)+"Math.pow("+st.slice(j+1,i)+","+st.slice(i+1,k)+")"+
           st.slice(k);
  }
  while ((i=st.indexOf("!"))!=-1) {
    //find left argument
    if (i==0) return "Error: missing argument";
    j = i-1;
    ch = st.charAt(j);
    if (ch>="0" && ch<="9") {// look for (decimal) number
      j--;
      while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      if (ch==".") {
        j--;
        while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
      }
    } else if (ch==")") {// look for matching opening bracket and function name
      nested = 1;
      j--;
      while (j>=0 && nested>0) {
        ch = st.charAt(j);
        if (ch=="(") nested--;
        else if (ch==")") nested++;
        j--;
      }
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
      j--;
      while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
        j--;
    } else { 
      return "Error: incorrect syntax in "+st+" at position "+j;
    }
    st = st.slice(0,j+1)+"factorial("+st.slice(j+1,i)+")"+st.slice(i+1);
  }
  return st;
}

function plot(fun,x_min,x_max,points,id,endpts) {
  var pth = [];
  var f = function(x) { return x }, g = fun;
  var name = null;
  if (typeof fun=="string") 
    eval("g = function(x){ with(Math) return "+mathjs(fun)+" }");
  else if (typeof fun=="object") {
    eval("f = function(t){ with(Math) return "+mathjs(fun[0])+" }");
    eval("g = function(t){ with(Math) return "+mathjs(fun[1])+" }");
  }
  if (typeof x_min=="string") { name = x_min; x_min = xmin }
  else name = id;
  var min = (x_min==null?xmin:x_min);
  var max = (x_max==null?xmax:x_max);
  var inc = max-min-0.000001*(max-min);
  inc = (points==null?inc/200:inc/points);
  var gt;
//alert(typeof g(min))
  for (var t = min; t <= max; t += inc) {
    gt = g(t);
    if (!(isNaN(gt)||Math.abs(gt)=="Infinity")) pth[pth.length] = [f(t), gt];
  }
  path(pth,name,null,endpts);
  return p;
}

// make polar plot

// make Riemann sums

function slopefield(fun,dx,dy) {
  var g = fun;
  if (typeof fun=="string") 
    eval("g = function(x,y){ with(Math) return "+mathjs(fun)+" }");
  var gxy,x,y,u,v,dz;
  if (dx==null) dx=1;
  if (dy==null) dy=1;
  dz = Math.sqrt(dx*dx+dy*dy)/6;
  var x_min = Math.ceil(xmin/dx);
  var y_min = Math.ceil(ymin/dy);
  for (x = x_min; x <= xmax; x += dx)
    for (y = y_min; y <= ymax; y += dy) {
      gxy = g(x,y);
      if (!isNaN(gxy)) {
        if (Math.abs(gxy)=="Infinity") {u = 0; v = dz;}
        else {u = dz/Math.sqrt(1+gxy*gxy); v = gxy*u;}
        line([x-u,y-v],[x+u,y+v]);
      }
    }
}

///////////////////////user graphics commands end here/////////////////////////

function show_props(obj) {
  var result = "";
  for (var i=0; i< obj.childNodes.length; i++)
    result += obj.childNodes.item(i) + "\n";
  return result;
}

function displayCoord(evt) {
  if (showcoordinates) {
//alert(show_props(evt.target.parentNode))
    var svgroot = evt.target.parentNode;
    var nl = svgroot.childNodes;
    for (var i=0; i<nl.length && nl.item(i).nodeName!="text"; i++);
    var cnode = nl.item(i);
    cnode.mtext = mtext;
    cnode.mtext([svgroot.getAttribute("width")-0,svgroot.getAttribute("height")-0],"("+getX(evt).toFixed(2)+", "+getY(evt).toFixed(2)+")", "aboveleft", "");
  }
}

function removeCoord(evt) {
    var svgroot = evt.target.parentNode;
    var nl = svgroot.childNodes;
    for (var i=0; i<nl.length && nl.item(i).nodeName!="text"; i++);
    var cnode = nl.item(i);
    cnode.mtext = mtext;
    cnode.mtext([svgroot.getAttribute("width")-0,svgroot.getAttribute("height")-0],"", "aboveleft", "");
}

// this is a highly simplified version --

// also deleted calculator code here

// GO1.1 Generic onload by Brothercake
// http://www.brothercake.com/
//onload function (replaces the onload="translate()" in the <body> tag)
function generic(){
  if (translateOnLoad) {
// deleted some unnecessary stuff in this method
      if (translateASCIIsvg) {
        if (typeof MathJax == "undefined") {
//          processNodes(document.getElementsByTagName("body")[0]);
          drawPictures();
        }
        else 
          MathJax.Hub.Queue(function(){
//          processNodes(document.getElementsByTagName("body")[0]);
            drawPictures();
          });
      }
  }
};
//setup onload function
// can browser tests here be updated and combined with tests in other places?
// tests here specific to addEventListener support
// probably best to test other API support as needed in other places
if(typeof window.addEventListener != 'undefined')
{
  //.. gecko, safari, konqueror and standard
  window.addEventListener('load', generic, false);
}
else if(typeof document.addEventListener != 'undefined')
{
  //.. opera 7
  document.addEventListener('load', generic, false);
}
else if(typeof window.attachEvent != 'undefined')
{
  //.. win/ie (up to 8)
  window.attachEvent('onload', generic);
}
//** remove this condition to degrade older browsers
// at this point, should probably remove the rest of this... or not...
else
{
  //.. mac/ie5 and anything else that gets this far
  //if there's an existing onload function
  if(typeof window.onload == 'function')
  {
    //store it
    var existing = onload;
    //add new onload handler
    window.onload = function()
    {
      //call existing onload function
      existing();
      //call generic onload function
      generic();
    };
  }
  else
  {
    //setup onload function
    window.onload = generic;
  }
};


////////////////////////////////////////////
(function(){
var jg_ok, jg_ie, jg_fast, jg_dom, jg_moz;
function _chkDHTM(wnd, x, i){
	x = wnd.document.body || null;
	jg_ie = x && typeof x.insertAdjacentHTML != "undefined" && wnd.document.createElement;
	jg_dom = (x && !jg_ie &&
		typeof x.appendChild != "undefined" &&
		typeof wnd.document.createRange != "undefined" &&
		typeof (i = wnd.document.createRange()).setStartBefore != "undefined" &&
		typeof i.createContextualFragment != "undefined");
	jg_fast = jg_ie && wnd.document.all && !wnd.opera;
	jg_moz = jg_dom && typeof x.style.MozOpacity != "undefined";
	jg_ok = !!(jg_ie || jg_dom);

};

function _fixIEOpacity(node){
	if ( !jg_fast ) { return ; }
	if ( !node ) { node = document.body ; }
	var children = node.childNodes ;
	for ( var i = 0 ; i < children.length ; i++ ) {
		var child = children[i] ;
		if ( child.style && child.style.jg_fast_opacity ) {
			var opacity = parseInt ( 100 * parseFloat ( child.style.jg_fast_opacity ) ) ;
			if ( opacity != 100 ) { 
				child.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + opacity + ");" ;
			} 
		}
		_fixIEOpacity ( child ) ;
	}
};

function _pntCnvDom(){
	var x = this.wnd.document.createRange();
	x.setStartBefore(this.cnv);
	x = x.createContextualFragment(jg_fast? this._htmRpc() : this.htm);
	if(this.cnv) this.cnv.appendChild(x);
	this.htm = "";
	if ( this._fixIEOpacity ) { _fixIEOpacity(this.cnv); }						
};

function _pntCnvIe(){
	if(this.cnv) this.cnv.insertAdjacentHTML("BeforeEnd", jg_fast? this._htmRpc() : this.htm);
	this.htm = "";
	if ( this._fixIEOpacity ) { _fixIEOpacity(this.cnv); }						
};

function _pntDoc(){
	this.wnd.document.write(jg_fast? this._htmRpc() : this.htm);
	this.htm = '';
	if ( this._fixIEOpacity ) { _fixIEOpacity(this.wnd.document.body); }				
};

function _pntN(){};

function _mkDiv(x, y, w, h){
	this.htm += '<div style="position:absolute;'+
		'left:' + x + 'px;'+
		'top:' + y + 'px;'+
		'width:' + w + 'px;'+
		'height:' + h + 'px;'+
		'clip:rect(0,'+w+'px,'+h+'px,0);'+
		this.opacityString +
		'background-color:' + this.color +
		(!jg_moz? ';overflow:hidden' : '')+
		';"><\/div>';
};

function _mkDivIe(x, y, w, h){
	this.htm += '%%'+this.color+';'+x+';'+y+';'+w+';'+h+';'+this.opacity+';';			
};

function _mkDivPrt(x, y, w, h){
  this.htm += '<div style="position:absolute;'+
		'border-left:' + w + 'px solid ' + this.color + ';'+
		'left:' + x + 'px;'+
		'top:' + y + 'px;'+
		'width:0px;'+
		'height:' + h + 'px;'+
		'clip:rect(0,'+w+'px,'+h+'px,0);'+
		this.opacityString +							
		'background-color:' + this.color +
		(!jg_moz? ';overflow:hidden' : '')+
		';"><\/div>';
};

var _regex =  /%%([^;]+);([^;]+);([^;]+);([^;]+);([^;]+);([^;]+);/g;
function _htmRpc(){
	return this.htm.replace(
		_regex,
		'<div style="overflow:hidden;position:absolute;background-color:'+
		'$1;left:$2px;top:$3px;width:$4px;height:$5px;jg_fast_opacity:$6"></div>\n');
};

function _htmPrtRpc(){
	return this.htm.replace(
		_regex,
		'<div style="overflow:hidden;position:absolute;background-color:'+
		'$1;left:$2px;top:$3px;width:$4px;height:$5px;border-left:$4px solid $1;jg_fast_opacity:$6"></div>\n');
};

function _mkLin(x1, y1, x2, y2){
  if(x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1;

	if(dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while(dx > 0)
		{--dx;
			++x;
			if(p > 0)
			{
				this._mkDiv(ox, y, x-ox, 1);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		this._mkDiv(ox, y, x2-ox+1, 1);
	}

	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if(y2 <= y1)
		{
			while(dy > 0)
			{--dy;
				if(p > 0)
				{
					this._mkDiv(x++, y, 1, oy-y+1);
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this._mkDiv(x2, y2, 1, oy-y2+1);
		}
		else
		{
			while(dy > 0)
			{--dy;
				y += yIncr;
				if(p > 0)
				{
					this._mkDiv(x++, oy, 1, y-oy);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			this._mkDiv(x2, oy, 1, y2-oy+1);
		}
	}
};

function _mkLin2D(x1, y1, x2, y2){
  if(x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1;

	var s = this.stroke;
	if(dx >= dy)
	{
		if(dx > 0 && s-3 > 0)
		{
			var _s = (s*dx*Math.sqrt(1+dy*dy/(dx*dx))-dx-(s>>1)*dy) / dx;
			_s = (!(s-4)? Math.ceil(_s) : Math.round(_s)) + 1;
		}
		else var _s = s;
		var ad = Math.ceil(s/2);

		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while(dx > 0)
		{--dx;
			++x;
			if(p > 0)
			{
				this._mkDiv(ox, y, x-ox+ad, _s);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		this._mkDiv(ox, y, x2-ox+ad+1, _s);
	}

	else
	{
		if(s-3 > 0)
		{
			var _s = (s*dy*Math.sqrt(1+dx*dx/(dy*dy))-(s>>1)*dx-dy) / dy;
			_s = (!(s-4)? Math.ceil(_s) : Math.round(_s)) + 1;
		}
		else var _s = s;
		var ad = Math.round(s/2);

		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if(y2 <= y1)
		{
			++ad;
			while(dy > 0)
			{--dy;
				if(p > 0)
				{
					this._mkDiv(x++, y, _s, oy-y+ad);
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this._mkDiv(x2, y2, _s, oy-y2+ad);
		}
		else
		{
			while(dy > 0)
			{--dy;
				y += yIncr;
				if(p > 0)
				{
					this._mkDiv(x++, oy, _s, y-oy+ad);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			this._mkDiv(x2, oy, _s, y2-oy+ad+1);
		}
	}
};

function _mkLinDott(x1, y1, x2, y2){
  if(x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1,
	drw = true;
	if(dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx;
		while(dx > 0)
		{--dx;
			if(drw) this._mkDiv(x, y, 1, 1);
			drw = !drw;
			if(p > 0)
			{
				y += yIncr;
				p += pru;
			}
			else p += pr;
			++x;
		}
	}
	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy;
		while(dy > 0)
		{--dy;
			if(drw) this._mkDiv(x, y, 1, 1);
			drw = !drw;
			y += yIncr;
			if(p > 0)
			{
				++x;
				p += pru;
			}
			else p += pr;
		}
	}
	if(drw) this._mkDiv(x, y, 1, 1);
};

function _mkOv(left, top, width, height){
  var a = (++width)>>1, b = (++height)>>1,
	wod = width&1, hod = height&1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	ox = 0, oy = b,
	aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
	st = (aa2>>1)*(1-(b<<1)) + bb2,
	tt = (bb2>>1) - aa2*((b<<1)-1),
	w, h;
	while(y > 0)
	{
		if(st < 0)
		{
			st += bb2*((x<<1)+3);
			tt += bb4*(++x);
		}
		else if(tt < 0)
		{
			st += bb2*((x<<1)+3) - aa4*(y-1);
			tt += bb4*(++x) - aa2*(((y--)<<1)-3);
			w = x-ox;
			h = oy-y;
			if((w&2) && (h&2))
			{
				this._mkOvQds(cx, cy, x-2, y+2, 1, 1, wod, hod);
				this._mkOvQds(cx, cy, x-1, y+1, 1, 1, wod, hod);
			}
			else this._mkOvQds(cx, cy, x-1, oy, w, h, wod, hod);
			ox = x;
			oy = y;
		}
		else
		{
			tt -= aa2*((y<<1)-3);
			st -= aa4*(--y);
		}
	}
	w = a-ox+1;
	h = (oy<<1)+hod;
	y = cy-oy;
	this._mkDiv(cx-a, y, w, h);
	this._mkDiv(cx+ox+wod-1, y, w, h);
};

function _mkOv2D(left, top, width, height){
  var s = this.stroke;
	width += s+1;
	height += s+1;
	var a = width>>1, b = height>>1,
	wod = width&1, hod = height&1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
	st = (aa2>>1)*(1-(b<<1)) + bb2,
	tt = (bb2>>1) - aa2*((b<<1)-1);

	if(s-4 < 0 && (!(s-2) || width-51 > 0 && height-51 > 0))
	{
		var ox = 0, oy = b,
		w, h,
		pxw;
		while(y > 0)
		{
			if(st < 0)
			{
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0)
			{
				st += bb2*((x<<1)+3) - aa4*(y-1);
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				w = x-ox;
				h = oy-y;

				if(w-1)
				{
					pxw = w+1+(s&1);
					h = s;
				}
				else if(h-1)
				{
					pxw = s;
					h += 1+(s&1);
				}
				else pxw = h = s;
				this._mkOvQds(cx, cy, x-1, oy, pxw, h, wod, hod);
				ox = x;
				oy = y;
			}
			else
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
			}
		}
		this._mkDiv(cx-a, cy-oy, s, (oy<<1)+hod);
		this._mkDiv(cx+a+wod-s, cy-oy, s, (oy<<1)+hod);
	}

	else
	{
		var _a = (width-(s<<1))>>1,
		_b = (height-(s<<1))>>1,
		_x = 0, _y = _b,
		_aa2 = (_a*_a)<<1, _aa4 = _aa2<<1, _bb2 = (_b*_b)<<1, _bb4 = _bb2<<1,
		_st = (_aa2>>1)*(1-(_b<<1)) + _bb2,
		_tt = (_bb2>>1) - _aa2*((_b<<1)-1),

		pxl = new Array(),
		pxt = new Array(),
		_pxb = new Array();
		pxl[0] = 0;
		pxt[0] = b;
		_pxb[0] = _b-1;
		while(y > 0)
		{
			if(st < 0)
			{
				pxl[pxl.length] = x;
				pxt[pxt.length] = y;
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0)
			{
				pxl[pxl.length] = x;
				st += bb2*((x<<1)+3) - aa4*(y-1);
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				pxt[pxt.length] = y;
			}
			else
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
			}

			if(_y > 0)
			{
				if(_st < 0)
				{
					_st += _bb2*((_x<<1)+3);
					_tt += _bb4*(++_x);
					_pxb[_pxb.length] = _y-1;
				}
				else if(_tt < 0)
				{
					_st += _bb2*((_x<<1)+3) - _aa4*(_y-1);
					_tt += _bb4*(++_x) - _aa2*(((_y--)<<1)-3);
					_pxb[_pxb.length] = _y-1;
				}
				else
				{
					_tt -= _aa2*((_y<<1)-3);
					_st -= _aa4*(--_y);
					_pxb[_pxb.length-1]--;
				}
			}
		}

		var ox = -wod, oy = b,
		_oy = _pxb[0],
		l = pxl.length,
		w, h;
		for(var i = 0; i < l; i++)
		{
			if(typeof _pxb[i] != "undefined")
			{
				if(_pxb[i] < _oy || pxt[i] < oy)
				{
					x = pxl[i];
					this._mkOvQds(cx, cy, x, oy, x-ox, oy-_oy, wod, hod);
					ox = x;
					oy = pxt[i];
					_oy = _pxb[i];
				}
			}
			else
			{
				x = pxl[i];
				this._mkDiv(cx-x, cy-oy, 1, (oy<<1)+hod);
				this._mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
				ox = x;
				oy = pxt[i];
			}
		}
		this._mkDiv(cx-a, cy-oy, 1, (oy<<1)+hod);
		this._mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
	}
};

function _mkOvDott(left, top, width, height){
  var a = (++width)>>1, b = (++height)>>1,
	wod = width&1, hod = height&1, hodu = hod^1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
	st = (aa2>>1)*(1-(b<<1)) + bb2,
	tt = (bb2>>1) - aa2*((b<<1)-1),
	drw = true;
	while(y > 0)
	{
		if(st < 0)
		{
			st += bb2*((x<<1)+3);
			tt += bb4*(++x);
		}
		else if(tt < 0)
		{
			st += bb2*((x<<1)+3) - aa4*(y-1);
			tt += bb4*(++x) - aa2*(((y--)<<1)-3);
		}
		else
		{
			tt -= aa2*((y<<1)-3);
			st -= aa4*(--y);
		}
		if(drw && y >= hodu) this._mkOvQds(cx, cy, x, y, 1, 1, wod, hod);
		drw = !drw;
	}
};

function _mkRect(x, y, w, h){
  var s = this.stroke;
	this._mkDiv(x, y, w, s);
	this._mkDiv(x+w, y, s, h);
	this._mkDiv(x, y+h, w+s, s);
	this._mkDiv(x, y+s, s, h-s);
};

function _mkRectDott(x, y, w, h){
  this.drawLine(x, y, x+w, y);
	this.drawLine(x+w, y, x+w, y+h);
	this.drawLine(x, y+h, x+w, y+h);
	this.drawLine(x, y, x, y+h);
};

function jsgFont(){
	this.PLAIN = 'font-weight:normal;';
	this.BOLD = 'font-weight:bold;';
	this.ITALIC = 'font-style:italic;';
	this.ITALIC_BOLD = this.ITALIC + this.BOLD;
	this.BOLD_ITALIC = this.ITALIC_BOLD;
};
var Font = new jsgFont();

function jsgStroke(){
	this.DOTTED = -1;
};
var Stroke = new jsgStroke();

function jsGraphics(cnv, wnd){
  this.setColor = function(x)
	{
		this.color = x.toLowerCase();
	};

	this._fixIEOpacity = false ;

	this.fixIEOpacity = function ( x ) {
		if ( typeof x != "boolean" ) { x = false ; }
		this._fixIEOpacity = x ;
	};

	this.setOpacity = function(x)	{
		if ( typeof x != "number" || x < 0 || x > 1 ) { x = 1 ; }
		x = parseFloat ( x ) ;
		this.opacityString = '';
		this.opacityString += 'opacity:' + x + ';' ;
		if ( this.wnd && !this.wnd.opera ) {
			this.opacityString += '-khtml-opacity:' + x + ';' ;
		}
		this.opacity = x ;
	};

	this.setStroke = function(x)
	{
		this.stroke = x;
		if(!(x+1))
		{
			this.drawLine = _mkLinDott;
			this._mkOv = _mkOvDott;
			this.drawRect = _mkRectDott;
		}
		else if(x-1 > 0)
		{
			this.drawLine = _mkLin2D;
			this._mkOv = _mkOv2D;
			this.drawRect = _mkRect;
		}
		else
		{
			this.drawLine = _mkLin;
			this._mkOv = _mkOv;
			this.drawRect = _mkRect;
		}
	};

	this.setPrintable = function(arg)
	{
		this.printable = arg;
		if(jg_fast)
		{
			this._mkDiv = _mkDivIe;
			this._htmRpc = arg? _htmPrtRpc : _htmRpc;
		}
		else this._mkDiv = arg? _mkDivPrt : _mkDiv;
	};

	this.setFont = function(fam, sz, sty)
	{
		this.ftFam = fam;
		this.ftSz = sz;
		this.ftSty = sty || Font.PLAIN;
	};

	this.drawPolyline = this.drawPolyLine = function(x, y)
	{
		for (var i=x.length - 1; i;)
		{--i;
			this.drawLine(x[i], y[i], x[i+1], y[i+1]);
		}
	};

	this.fillRect = function(x, y, w, h)
	{
		this._mkDiv(x, y, w, h);
	};

	this.drawPolygon = function(x, y)
	{
		this.drawPolyline(x, y);
		this.drawLine(x[x.length-1], y[x.length-1], x[0], y[0]);
	};

	this.drawEllipse = this.drawOval = function(x, y, w, h)
	{
		this._mkOv(x, y, w, h);
	};

	this.fillEllipse = this.fillOval = function(left, top, w, h)
	{
		var a = w>>1, b = h>>1,
		wod = w&1, hod = h&1,
		cx = left+a, cy = top+b,
		x = 0, y = b, oy = b,
		aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
		st = (aa2>>1)*(1-(b<<1)) + bb2,
		tt = (bb2>>1) - aa2*((b<<1)-1),
		xl, dw, dh;
		if(w) while(y > 0)
		{
			if(st < 0)
			{
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0)
			{
				st += bb2*((x<<1)+3) - aa4*(y-1);
				xl = cx-x;
				dw = (x<<1)+wod;
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				dh = oy-y;
				this._mkDiv(xl, cy-oy, dw, dh);
				this._mkDiv(xl, cy+y+hod, dw, dh);
				oy = y;
			}
			else
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
			}
		}
		this._mkDiv(cx-a, cy-oy, w, (oy<<1)+hod);
	};

	this.fillArc = function(iL, iT, iW, iH, fAngA, fAngZ)
	{
		var a = iW>>1, b = iH>>1,
		iOdds = (iW&1) | ((iH&1) << 16),
		cx = iL+a, cy = iT+b,
		x = 0, y = b, ox = x, oy = y,
		aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
		st = (aa2>>1)*(1-(b<<1)) + bb2,
		tt = (bb2>>1) - aa2*((b<<1)-1),
		xEndA, yEndA, xEndZ, yEndZ,
		iSects = (1 << (Math.floor((fAngA %= 360.0)/180.0) << 3))
				| (2 << (Math.floor((fAngZ %= 360.0)/180.0) << 3))
				| ((fAngA >= fAngZ) << 16),
		aBndA = new Array(b+1), aBndZ = new Array(b+1);
		
		fAngA *= Math.PI/180.0;
		fAngZ *= Math.PI/180.0;
		xEndA = cx+Math.round(a*Math.cos(fAngA));
		yEndA = cy+Math.round(-b*Math.sin(fAngA));
		_mkLinVirt(aBndA, cx, cy, xEndA, yEndA);
		xEndZ = cx+Math.round(a*Math.cos(fAngZ));
		yEndZ = cy+Math.round(-b*Math.sin(fAngZ));
		_mkLinVirt(aBndZ, cx, cy, xEndZ, yEndZ);

		while(y > 0)	{
			if(st < 0)
			{
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0)
			{
				st += bb2*((x<<1)+3) - aa4*(y-1);
				ox = x;
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				this._mkArcDiv(ox, y, oy, cx, cy, iOdds, aBndA, aBndZ, iSects);
				oy = y;
			}
			else 
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
				if(y && (aBndA[y] != aBndA[y-1] || aBndZ[y] != aBndZ[y-1]))
				{
					this._mkArcDiv(x, y, oy, cx, cy, iOdds, aBndA, aBndZ, iSects);
					ox = x;
					oy = y;
				}
			}
		}
		this._mkArcDiv(x, 0, oy, cx, cy, iOdds, aBndA, aBndZ, iSects);
		if(iOdds >> 16)
		{
			if(iSects >> 16)
			{
				var xl = (yEndA <= cy || yEndZ > cy)? (cx - x) : cx;
				this._mkDiv(xl, cy, x + cx - xl + (iOdds & 0xffff), 1);
			}
			else if((iSects & 0x01) && yEndZ > cy)
				this._mkDiv(cx - x, cy, x, 1);
		}
	};
  
	this.fillPolygon = function(array_x, array_y)	{
		var i;
		var y;
		var miny, maxy;
		var x1, y1;
		var x2, y2;
		var ind1, ind2;
		var ints;

		var n = array_x.length;
		if(!n) return;

		miny = array_y[0];
		maxy = array_y[0];
		for(i = 1; i < n; i++)
		{
			if(array_y[i] < miny)
				miny = array_y[i];

			if(array_y[i] > maxy)
				maxy = array_y[i];
		}
		for(y = miny; y <= maxy; y++)
		{
			var polyInts = new Array();
			ints = 0;
			for(i = 0; i < n; i++)
			{
				if(!i)
				{
					ind1 = n-1;
					ind2 = 0;
				}
				else
				{
					ind1 = i-1;
					ind2 = i;
				}
				y1 = array_y[ind1];
				y2 = array_y[ind2];
				if(y1 < y2)
				{
					x1 = array_x[ind1];
					x2 = array_x[ind2];
				}
				else if(y1 > y2)
				{
					y2 = array_y[ind1];
					y1 = array_y[ind2];
					x2 = array_x[ind1];
					x1 = array_x[ind2];
				}
				else continue;

				 //  Modified 11. 2. 2004 Walter Zorn
				if((y >= y1) && (y < y2))
					polyInts[ints++] = Math.round((y-y1) * (x2-x1) / (y2-y1) + x1);

				else if((y == maxy) && (y > y1) && (y <= y2))
					polyInts[ints++] = Math.round((y-y1) * (x2-x1) / (y2-y1) + x1);
			}
			polyInts.sort(_CompInt);
			for(i = 0; i < ints; i+=2)
				this._mkDiv(polyInts[i], y, polyInts[i+1]-polyInts[i]+1, 1);
		}
	};

	this.drawString = function(txt, x, y)
	{
		this.htm += '<div style="position:absolute;white-space:nowrap;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			'font-family:' +  this.ftFam + ';'+
			'font-size:' + this.ftSz + ';'+
			this.opacityString +							
			'color:' + this.color + ';' + this.ftSty + '">'+
			txt +
			'<\/div>';
	};

	this.drawStringRect = function(txt, x, y, width, halign)
	{
		this.htm += '<div style="position:absolute;overflow:hidden;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			'width:'+width +'px;'+
			'text-align:'+halign+';'+
			'font-family:' +  this.ftFam + ';'+
			'font-size:' + this.ftSz + ';'+
			this.opacityString +							
			'color:' + this.color + ';' + this.ftSty + '">'+
			txt +
			'<\/div>';
	};

	this.drawImage = function(imgSrc, x, y, w, h, a)
	{
		this.htm += '<div style="position:absolute;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			(w? ('width:' +  w + 'px;') : '') +
			(h? ('height:' + h + 'px;'):'')+'">'+
			'<img src="' + imgSrc +'"'+ (w ? (' width="' + w + '"'):'')+ (h ? (' height="' + h + '"'):'') + (a? (' '+a) : '') + '>'+
			'<\/div>';
	};

	this.clear = function()
	{
		this.htm = "";
		if(this.cnv) this.cnv.innerHTML = "";
	};

	this._mkOvQds = function(cx, cy, x, y, w, h, wod, hod)
	{
		var xl = cx - x, xr = cx + x + wod - w, yt = cy - y, yb = cy + y + hod - h;
		if(xr > xl+w)
		{
			this._mkDiv(xr, yt, w, h);
			this._mkDiv(xr, yb, w, h);
		}
		else
			w = xr - xl + w;
		this._mkDiv(xl, yt, w, h);
		this._mkDiv(xl, yb, w, h);
	};
	
	this._mkArcDiv = function(x, y, oy, cx, cy, iOdds, aBndA, aBndZ, iSects)
	{
		var xrDef = cx + x + (iOdds & 0xffff), y2, h = oy - y, xl, xr, w;

		if(!h) h = 1;
		x = cx - x;

		if(iSects & 0xff0000)
		{
			y2 = cy - y - h;
			if(iSects & 0x00ff)
			{
				if(iSects & 0x02)
				{
					xl = Math.max(x, aBndZ[y]);
					w = xrDef - xl;
					if(w > 0) this._mkDiv(xl, y2, w, h);
				}
				if(iSects & 0x01)
				{
					xr = Math.min(xrDef, aBndA[y]);
					w = xr - x;
					if(w > 0) this._mkDiv(x, y2, w, h);
				}
			}
			else
				this._mkDiv(x, y2, xrDef - x, h);
			y2 = cy + y + (iOdds >> 16);
			if(iSects & 0xff00)
			{
				if(iSects & 0x0100)
				{
					xl = Math.max(x, aBndA[y]);
					w = xrDef - xl;
					if(w > 0) this._mkDiv(xl, y2, w, h);
				}
				if(iSects & 0x0200)
				{
					xr = Math.min(xrDef, aBndZ[y]);
					w = xr - x;
					if(w > 0) this._mkDiv(x, y2, w, h);
				}
			}
			else
				this._mkDiv(x, y2, xrDef - x, h);
		}
		else
		{
			if(iSects & 0x00ff)
			{
				if(iSects & 0x02)
					xl = Math.max(x, aBndZ[y]);
				else
					xl = x;
				if(iSects & 0x01)
					xr = Math.min(xrDef, aBndA[y]);
				else
					xr = xrDef;
				y2 = cy - y - h;
				w = xr - xl;
				if(w > 0) this._mkDiv(xl, y2, w, h);
			}
			if(iSects & 0xff00)
			{
				if(iSects & 0x0100)
					xl = Math.max(x, aBndA[y]);
				else
					xl = x;
				if(iSects & 0x0200)
					xr = Math.min(xrDef, aBndZ[y]);
				else
					xr = xrDef;
				y2 = cy + y + (iOdds >> 16);
				w = xr - xl;
				if(w > 0) this._mkDiv(xl, y2, w, h);
			}
		}
	};

	this.setStroke(1);
	this.setFont("verdana,geneva,helvetica,sans-serif", "12px", Font.PLAIN);
	this.color = "#000000";
	this.opacity=1;									
	this.setOpacity(1);								
	this.htm = "";
	this.wnd = wnd || window;

	if(!jg_ok) _chkDHTM(this.wnd);
	if(jg_ok)
	{
		if(cnv)
		{
			if(typeof(cnv) == "string")
				this.cont = document.all? (this.wnd.document.all[cnv] || null)
					: document.getElementById? (this.wnd.document.getElementById(cnv) || null)
					: null;
			else if(cnv == window.document)
				this.cont = document.getElementsByTagName("body")[0];
			else this.cont = cnv;
			this.cnv = this.wnd.document.createElement("div");
			this.cnv.style.fontSize=0;
			this.cont.appendChild(this.cnv);
			this.paint = jg_dom? _pntCnvDom : _pntCnvIe;
		}
		else
			this.paint = _pntDoc;
	}
	else
		this.paint = _pntN;

	this.setPrintable(false);
};

function _mkLinVirt(aLin, x1, y1, x2, y2) {
	var dx = Math.abs(x2-x1), dy = Math.abs(y2-y1),
	x = x1, y = y1,
	xIncr = (x1 > x2)? -1 : 1,
	yIncr = (y1 > y2)? -1 : 1,
	p,
	i = 0;
	if(dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1);
		p = pr-dx;
		while(dx > 0)
		{--dx;
			if(p > 0)
			{
				aLin[i++] = x;
				y += yIncr;
				p += pru;
			}
			else p += pr;
			x += xIncr;
		}
	}
	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1);
		p = pr-dy;
		while(dy > 0)
		{--dy;
			y += yIncr;
			aLin[i++] = x;
			if(p > 0)
			{
				x += xIncr;
				p += pru;
			}
			else p += pr;
		}
	}
	for(var len = aLin.length, i = len-i; i;)
		aLin[len-(i--)] = x;
};

function _CompInt(x, y){
  return(x - y);
};


///////////////////////////////////////////// 
 TeXGraph = { } ;	
TeXGraph.initOnLoad = true ;
TeXGraph.init = function ( ) {
	TeXGraph.DataDiv.addStandardDataDivs ( ) ;
	TeXGraph.addStandardPlugins ( ) ;
	TeXGraph.processPlugins ( ) ;
};

TeXGraph.process = function ( node ) {

	if ( ! node ) { node = document.body ; }
	TeXGraph.initialized = false ;
  TeXGraph.processPlugins ( node ) ;
};
TeXGraph.loader = function ( f ) {
	if ( typeof window.addEventListener != 'undefined' ) {
		window.addEventListener ( 'load' , f , false ) ;
	}
	else if ( typeof document.addEventListener != 'undefined' ) {
		document.addEventListener ( 'load' , f , false);
	}
	else if ( typeof window.attachEvent != 'undefined' ) {
		window.attachEvent ( 'onload' , f ) ;
	}
	else {
		if ( typeof window.onload == 'function' ) {
			var existing = onload ;
			window.onload = function ( ) {
				existing ( ) ;
				f ( ) ;
			};
		}
		else {
			window.onload = f ;
		}
	}
};

if ( TeXGraph.initOnLoad ) {

	TeXGraph.loader ( TeXGraph.init ) ;
}

    TeXGraph.Warning = function ( message , caller ) {

	    this.message = message ;
	    this.caller  = caller ;
      
	    alert ( "Warning: " + message + "\ncalled from " + caller ) ;
      
	    return this ;
    }; 

    TeXGraph.Error = function ( message , caller ) {
    
    	this.message = message ;
    	this.caller  = caller ;
    
    	throw new Error ( "Error: " + message + " called from " + caller ) ;
    
    	return this ;
    }; 

      TeXGraph.Math = { } ;
      
      TeXGraph.Math.zero = parseFloat ( 0 ) ;
      
      TeXGraph.Math.pi = Math.PI ;
      TeXGraph.Math.e = Math.E ;
      TeXGraph.Math.ln = Math.log ;
      TeXGraph.Math.sqrt = Math.sqrt ;
      
      TeXGraph.Math.log = function ( x ) { return TeXGraph.Math.ln(x) / TeXGraph.Math.ln(10) ; };
      
      TeXGraph.Math.exp = Math.exp ;
      TeXGraph.Math.pow = Math.pow ;
      
      TeXGraph.Math.floor = Math.floor ;
      TeXGraph.Math.ceil = Math.ceil ;
      TeXGraph.Math.abs = Math.abs;
      TeXGraph.Math.max = Math.max;
      TeXGraph.Math.min = Math.min;
      
      TeXGraph.Math.sin = Math.sin ;
      TeXGraph.Math.cos = Math.cos ;
      TeXGraph.Math.tan = Math.tan ;
      TeXGraph.Math.sec = function ( x ) { return 1 / TeXGraph.Math.cos(x) ; };
      TeXGraph.Math.csc = function ( x ) { return 1 / TeXGraph.Math.sin(x) ; };
      TeXGraph.Math.cot = function ( x ) { return 1 / TeXGraph.Math.tan(x) ; };
      TeXGraph.Math.arcsin = Math.asin ;
      TeXGraph.Math.arccos = Math.acos ;
      TeXGraph.Math.arctan = Math.atan ;
      TeXGraph.Math.arcsec = function ( x ) { return 1 / TeXGraph.Math.arccos(x) ; };
      TeXGraph.Math.arccsc = function ( x ) { return 1 / TeXGraph.Math.arcsin(x) ; };
      TeXGraph.Math.arccot = function ( x ) { return 1 / TeXGraph.Math.arctan(x) ; };
      TeXGraph.Math.sinh = function ( x ) { return ( TeXGraph.Math.exp(x) - TeXGraph.Math.exp(-x) ) / 2 ; };
      TeXGraph.Math.cosh = function ( x ) { return ( TeXGraph.Math.exp(x) + TeXGraph.Math.exp(-x) ) / 2 ; };
      TeXGraph.Math.tanh = function ( x ) { return TeXGraph.Math.sinh(x) / TeXGraph.Math.cosh(x) ; };
      TeXGraph.Math.sech = function ( x ) { return 1 / TeXGraph.Math.cosh(x) ; };
      TeXGraph.Math.csch = function ( x ) { return 1 / TeXGraph.Math.sinh(x) ; };
      TeXGraph.Math.coth = function ( x ) { return 1 / TeXGraph.Math.tanh(x) ; };
      TeXGraph.Math.arcsinh = function ( x ) { return TeXGraph.Math.ln( x + TeXGraph.Math.sqrt(x*x+1) ) ; };
      TeXGraph.Math.arccosh = function ( x ) { return TeXGraph.Math.ln( x + TeXGraph.Math.sqrt(x*x-1) ) ; };
      TeXGraph.Math.arctanh = function ( x ) { return TeXGraph.Math.ln((1+x)/(1-x)) / 2 ; };
      TeXGraph.Math.arcsech = function ( x ) { return  TeXGraph.Math.arccosh(1/x) ; };
      TeXGraph.Math.arccsch = function ( x ) { return  TeXGraph.Math.arcsinh(1/x) ; };
      TeXGraph.Math.arccoth = function ( x ) { return  TeXGraph.Math.arctanh(1/x) ; };
      TeXGraph.Math.sign = function ( x ) { return ( x==0 ? 0 : ( x < 0 ? -1 : 1 ) ) ; };
      TeXGraph.Math.factorial = function ( x , n ) {
      	if ( n == null ) { n = 1 ; }
      	if ( Math.abs( x-Math.round(x*1000000)/1000000 ) < 1e-15 ) {
      		x = Math.round ( x*1000000 ) / 1000000 ;
      	}
      	if ( x - Math.floor(x) != 0 ) { return NaN ; }
      	for ( var i = x - n ; i > 0 ; i -= n ) { x *= i ; }
      	return ( x < 0 ? NaN : ( x==0 ? 1 : x ) ) ;
      };
      
      TeXGraph.Math.C = function ( x , k ) {
      	var res = 1 ;
      	for ( var i = 0 ; i < k ; i++ ) { res *= (x-i)/(k-i) ; }
      	return res ;
      };
      
      TeXGraph.Math.chop = function ( x , n ) {
      	if ( n == null ) { n = 0 ; }
      	return Math.floor ( x * Math.pow(10,n) ) / Math.pow(10,n) ;
      };
      
      TeXGraph.Math.ran = function ( a , b , n ) {
      	if ( n == null ) n = 0 ;
      	return TeXGraph.Math.chop ( ( b + Math.pow(10,-n) - a ) * Math.random() + a , n ) ;
      };
      
      TeXGraph.Math.Normal = function ( x , mu , sigma ) {
      
      	return Math.exp ( -0.5 * Math.pow ( (x-mu)/sigma , 2 ) ) / ( sigma * Math.sqrt(2*Math.PI) ) ;
      };
      TeXGraph.Math.ascii2JS = function ( st ) {
      	st = st.replace ( /\s/g , "" ) ;
      	var numOpenP  = TeXGraph.Util.countCharInString ( '(' , st ) ;	
      	var numCloseP = TeXGraph.Util.countCharInString ( ')' , st ) ;	
      	var numOpenC  = TeXGraph.Util.countCharInString ( '{' , st ) ;	
      	var numCloseC = TeXGraph.Util.countCharInString ( '}' , st ) ;	
      	var numOpenB  = TeXGraph.Util.countCharInString ( '[' , st ) ;	
      	var numCloseB = TeXGraph.Util.countCharInString ( ']' , st ) ;	
      
      	if ( numOpenP < numCloseP ) {
      		return new TeXGraph.Error ( "Syntax Error: Missing ( in " + st , "TeXGraph.Util.mathToJS" ) ; 
      	}
      	if ( numOpenP > numCloseP ) {
      		return new TeXGraph.Error ( "Syntax Error: Missing ) in " + st , "TeXGraph.Util.mathToJS" ) ; 
      	}
      	if ( numOpenC < numCloseC ) {
      		return new TeXGraph.Error ( "Syntax Error: Missing { in " + st , "TeXGraph.Util.mathToJS" ) ; 
      	}
      	if ( numOpenC > numCloseC ) {
      		return new TeXGraph.Error ( "Syntax Error: Missing } in " + st , "TeXGraph.Util.mathToJS" ) ; 
      	}
      	if ( numOpenB < numCloseB ) {
      		return new TeXGraph.Error ( "Syntax Error: Missing [ in " + st , "TeXGraph.Util.mathToJS" ) ; 
      	}
      	if ( numOpenB > numCloseB ) {
      		return new TeXGraph.Error ( "Syntax Error: Missing ] in " + st , "TeXGraph.Util.mathToJS" ) ; 
      	}
      	st = st.replace ( /\{/g , "(" ) ;
      	st = st.replace ( /\[/g , "(" ) ;
      	st = st.replace ( /\}/g , ")" ) ;
      	st = st.replace ( /\]/g , ")" ) ;
      	if ( st.indexOf("^-1") != -1 ) {
      		st = st.replace ( /sin\^-1/g , "TeXGraph.Math.arcsin" ) ;
      		st = st.replace ( /cos\^-1/g , "TeXGraph.Math.arccos" ) ;
      		st = st.replace ( /tan\^-1/g , "TeXGraph.Math.arctan" ) ;
      		st = st.replace ( /sec\^-1/g , "TeXGraph.Math.arcsec" ) ;
      		st = st.replace ( /csc\^-1/g , "TeXGraph.Math.arccsc" ) ;
      		st = st.replace ( /cot\^-1/g , "TeXGraph.Math.arccot" ) ;
      		st = st.replace ( /sinh\^-1/g , "TeXGraph.Math.arcsinh" ) ;
      		st = st.replace ( /cosh\^-1/g , "TeXGraph.Math.arccosh" ) ;
      		st = st.replace ( /tanh\^-1/g , "TeXGraph.Math.arctanh" ) ;
      		st = st.replace ( /sech\^-1/g , "TeXGraph.Math.arcsech" ) ;
      		st = st.replace ( /csch\^-1/g , "TeXGraph.Math.arccsch" ) ;
      		st = st.replace ( /coth\^-1/g , "TeXGraph.Math.arccoth" ) ;
      	}
      	st = st.replace ( /arcsinh/g , "TeXGraph.Math.arcsinh" ) ;
      	st = st.replace ( /arccosh/g , "TeXGraph.Math.arccosh" ) ;
      	st = st.replace ( /arctanh/g , "TeXGraph.Math.arctanh" ) ;
      	st = st.replace ( /arccsch/g , "TeXGraph.Math.arccsch" ) ;
      	st = st.replace ( /arcsech/g , "TeXGraph.Math.arcsech" ) ;
      	st = st.replace ( /arccoth/g , "TeXGraph.Math.arccoth" ) ;
      	st = st.replace ( /arcsin/g , "TeXGraph.Math.arcsin" ) ;
      	st = st.replace ( /arccos/g , "TeXGraph.Math.arccos" ) ;
      	st = st.replace ( /arctan/g , "TeXGraph.Math.arctan" ) ;
      	st = st.replace ( /arccsc/g , "TeXGraph.Math.arccsc" ) ;
      	st = st.replace ( /arcsec/g , "TeXGraph.Math.arcsec" ) ;
      	st = st.replace ( /arccot/g , "TeXGraph.Math.arccot" ) ;
      	st = st.replace ( /sinh/g , "TeXGraph.Math.sinh" ) ;
      	st = st.replace ( /cosh/g , "TeXGraph.Math.cosh" ) ;
      	st = st.replace ( /tanh/g , "TeXGraph.Math.tanh" ) ;
      	st = st.replace ( /csch/g , "TeXGraph.Math.csch" ) ;
      	st = st.replace ( /sech/g , "TeXGraph.Math.sech" ) ;
      	st = st.replace ( /coth/g , "TeXGraph.Math.coth" ) ;
      	st = st.replace ( /sin/g , "TeXGraph.Math.sin" ) ;
      	st = st.replace ( /cos/g , "TeXGraph.Math.cos" ) ;
      	st = st.replace ( /tan/g , "TeXGraph.Math.tan" ) ;
      	st = st.replace ( /csc/g , "TeXGraph.Math.csc" ) ;
      	st = st.replace ( /sec/g , "TeXGraph.Math.sec" ) ;
      	st = st.replace ( /cot/g , "TeXGraph.Math.cot" ) ;
      	st = st.replace ( /ln/g , "TeXGraph.Math.ln" ) ;
      	st = st.replace ( /log/g , "TeXGraph.Math.log" ) ;
      	st = st.replace ( /exp/g , "TeXGraph.Math.exp" ) ;
      	st = st.replace ( /pow/g , "TeXGraph.Math.pow" ) ;
      	st = st.replace ( /sqrt/g , "TeXGraph.Math.sqrt" ) ;
      	st = st.replace ( /abs/g , "TeXGraph.Math.abs" ) ;
      	st = st.replace ( /floor/g , "TeXGraph.Math.floor" ) ;
      	st = st.replace ( /ceil/g , "TeXGraph.Math.ceil" ) ;
      	st = st.replace ( /sign/g , "TeXGraph.Math.sign" ) ;
      	st = st.replace ( /factorial/g , "TeXGraph.Math.factorial" ) ;
      	st = st.replace ( /C\(/g , "TeXGraph.Math.C(" ) ;
      	st = st.replace ( /chop/g , "TeXGraph.Math.chop" ) ;
      	st = st.replace ( /ran/g , "TeXGraph.Math.ran" ) ;
      	st = st.replace ( /Normal/g , "TeXGraph.Math.Normal" ) ;
      	st = st.replace ( /^pi$/g , "(Math.PI)" ) ;
      	st = st.replace ( /^pi([^a-zA-Z])/g , "(Math.PI)$1" ) ;
      	st = st.replace ( /([^a-zA-Z])pi/g , "$1(Math.PI)" ) ;
      	st = st.replace ( /^e$/g , "(Math.E)" ) ;
      	st = st.replace ( /^e([^a-zA-Z])/g , "(Math.E)$1" ) ;
      	st = st.replace ( /([^a-zA-Z])e/g , "$1(Math.E)" ) ;
      	st = st.replace ( /([0-9])([\(a-zA-Z])/g , "$1*$2" ) ;
      	st = st.replace ( /\)([\(0-9a-zA-Z])/g , "\)*$1" ) ;
      	var i = 0 , j = 0 , k = 0 ;
      	while ( st.indexOf('++') != -1 || st.indexOf('--') != -1 || st.indexOf('+-') != -1 || st.indexOf('-+') != -1 ) {
      		while ( ( i = st.indexOf ( '++' ) ) != -1 ) {
      			st = st.substring ( 0 , i ) + "+" + st.substring ( i + 2 ) ;
      		}
      		while ( ( i = st.indexOf ( '--' ) ) != -1 ) {
      			st = st.substring ( 0 , i ) + "+" + st.substring ( i + 2 ) ;
      		}
      		while ( ( i = st.indexOf ( '+-' ) ) != -1 ) {
      			st = st.substring ( 0 , i ) + "-" + st.substring ( i + 2 ) ;
      		}
      		while ( ( i = st.indexOf ( '-+' ) ) != -1 ) {
      			st = st.substring ( 0 , i ) + "-" + st.substring ( i + 2 ) ;
      		}
      	}
      
      	var nestedp = 0 , nestedc = 0 , nestedb = 0 ;
      	var ch ;
      
      	while ( ( i = st.indexOf ( '^' ) ) != -1 ) {
      		if ( i == 0 ) {
      			return new TeXGraph.Error ( "Syntax Error: ^ missing left argument in " + st , "TeXGraph.Util.mathToJS" ) ; 
      		}
      		j = i - 1 ;
      		ch = st.charAt ( j ) ;
      		if ( TeXGraph.Util.isDigit ( ch ) ) {
      			j-- ;
      			if ( j >= 0 ) {
      				ch = st.charAt ( j ) ;
      			}
      			while ( TeXGraph.Util.isDigit ( ch ) ) {
      				if ( j >= 0 ) {
      					j-- ;
      					ch = st.charAt ( j ) ;
      				}
      				else {
      					break ;
      				}
      			}
      			if (ch == '.') {
      				j-- ;
      				if (j >= 0 ) {
      					ch = st.charAt ( j ) ;
      				}
      				while ( TeXGraph.Util.isDigit ( ch ) ) {
      					if ( j >= 0 ) {
      						j-- ;
      						ch = st.charAt ( j ) ;
      					}
      					else {
      						break ;
      					}
      				}
      
      			}
      		}
      		else if ( ch == ')' || ch == '}' || ch == ']' ) {
      			if ( ch == ')' ) nestedp = 1 ;
      			if ( ch == '}' ) nestedc = 1 ;
      			if ( ch == ']' ) nestedb = 1 ;
      			j-- ;
      			while ( j >= 0 ) {
      				ch = st.charAt ( j ) ;
      				if ( ch == '(' ) nestedp-- ;
      				if ( ch == '{' ) nestedc-- ;
      				if ( ch == '[' ) nestedb-- ;
      				if ( ch == ')' ) nestedp++ ;
      				if ( ch == '}' ) nestedc++ ;
      				if ( ch == ']' ) nestedb++ ;
      				j-- ;
      				if ( nestedp == 0 && nestedc == 0 && nestedb == 0 ) {
      					break ;
      				}
      			}
      			if ( j >= 0 ) ch = st.charAt ( j ) ;
      			while ( TeXGraph.Util.isAlpha ( ch ) ) {
      				if ( j >= 0 ) {
      					j-- ;
      					ch = st.charAt ( j ) ;
      				}
      				else {
      					break ;
      				}
      			}
      		}
      		else if ( TeXGraph.Util.isAlpha ( ch ) ) {
      			j-- ;
      			if ( j >= 0 ) ch = st.charAt ( j ) ;
      			while ( TeXGraph.Util.isAlpha ( ch ) ) {
      				if( j >= 0 ) {
      					j-- ;
      					ch = st.charAt ( j ) ;
      				}
      				else {
      					break ;
      				}
      			}
      
      		}
      		else {
      			return new TeXGraph.Error ( "Error: ^ incorrect syntax in " + st + " at position " + j , "TeXGraph.Util.mathToJS" ) ;
      		}
      		if ( i == st.length - 1 ) {
      			return new TeXGraph.Error ( "Error: ^ missing right argument in " + st , "TeXGraph.Util.mathToJS" ) ;
      		}
      		k = i + 1 ;
      		ch = st.charAt ( k ) ;
      		while ( ch == '-' || ch == '+' ) {
      			k++ ;
      			if ( k >= 0 && k < st.length ) {
      				ch = st.charAt ( k ) ;
      			}
      		}
      		if ( TeXGraph.Util.isDigit ( ch ) ) {
      			k++ ;
      			if ( k >= 0 && k < st.length ) {
      				ch = st.charAt ( k ) ;
      			}
      			while ( TeXGraph.Util.isDigit ( ch ) ) {
      				if ( k >= 0 && k < st.length ) {
      					k++ ;
      					ch = st.charAt ( k ) ;
      				}
      				else {
      					break ;
      				}
      			}
      			if ( ch == '.' ) {
      				k++ ;
      				if ( k >= 0 && k < st.length ) {
      					ch = st.charAt ( k ) ;
      				}
      				while ( TeXGraph.Util.isDigit ( ch ) ) {
      					if (k >= 0 && k < st.length ) {
      						k++ ;
      						ch = st.charAt ( k ) ;
      					}
      					else {
      						break ;
      					}
      				}
      
      			}
      		}
      		else if ( ch == '(' || ch == '{' || ch == '[' ) {
      			if ( ch == '(' ) nestedp = 1 ;
      			if ( ch == '{' ) nestedc = 1 ;
      			if ( ch == '[' ) nestedb = 1 ;
      			k++ ;
      			while ( k < st.length ) {
      				ch = st.charAt ( k ) ;
      				if ( ch == '(' ) nestedp++ ;
      				if ( ch == '{' ) nestedc++ ;
      				if ( ch == '[' ) nestedb++ ;
      				if ( ch == ')' ) nestedp-- ;
      				if ( ch == '}' ) nestedc-- ;
      				if ( ch == ']' ) nestedb-- ;
      
      				k++ ;
      
      				if ( nestedp == 0 && nestedc == 0 && nestedb ==0 ) {
      					break ;
      				}
      			}
      		}
      		else if ( TeXGraph.Util.isAlpha ( ch ) ) {
      			k++ ;
      			if ( k >= 0 && k < st.length ) {
      				ch = st.charAt ( k ) ;
      			}
      			while ( TeXGraph.Util.isAlpha ( ch ) ) {
      				if ( k >= 0 && k < st.length ) {
      					k++ ;
      					ch = st.charAt ( k ) ;
      				}
      				else {
      					break ;
      				}
      			}
      		}
      		else { 
      			return new TeXGraph.Error ( "Error: ^ incorrect syntax in " + st + " at position " + k , "TeXGraph.Util.mathToJS" ) ;
      		}
      		st = st.substring ( 0 , j + 1 ) + "TeXGraph.Math.pow(" + st.substring ( j + 1 , i ) + ", " + st.substring ( i + 1 , k ) + ")" + st.substring ( k ) ;
        }
      	while ( ( i = st.indexOf ( "!" ) ) != -1 ) {
      		if ( i == 0 ) {
      			return new TeXGraph.Error ( "Error: ! missing argument in " + st , "TeXGraph.Util.mathToJS" ) ;
      		}
      		j = i - 1 ;
     			ch = st.charAt ( j ) ;
      		if ( TeXGraph.Util.isDigit ( ch ) ) {
      			j-- ;
      			if ( j >= 0 ) ch = st.charAt ( j ) ;
      			while ( TeXGraph.Util.isDigit ( ch ) ) {
      				if ( j >= 0 ) {
      					j-- ;
      					ch = st.charAt ( j ) ;
      				}
      				else {
      					break ;
      				}
      			}
      			if ( ch == '.' ) {
      				j-- ;
      				if ( j >= 0 ) {
      					ch = st.charAt ( j ) ;
      				}
      				while ( TeXGraph.Util.isDigit ( ch ) ) {
      					if ( j >= 0 ) {
      						j-- ;
      						ch = st.charAt ( j ) ;
      					}
      					else {
      						break ;
      					}
      				}
      
      			}
      		}
      		else if ( ch == ')' || ch == '}' || ch == ']' ) {
      			if ( ch == ')' ) nestedp = 1 ;
      			if ( ch == '}' ) nestedc = 1 ;
      			if ( ch == ']' ) nestedb = 1 ;
      			j-- ;
      			while ( j >= 0 ) {
      				ch = st.charAt ( j ) ;
      				if ( ch == '(' ) nestedp-- ;
      				if ( ch == '{' ) nestedc-- ;
      				if ( ch == '[' ) nestedb-- ;
      				if ( ch == ')' ) nestedp++ ;
      				if ( ch == '}' ) nestedc++ ;
      				if ( ch == ']' ) nestedb++ ;
      				j-- ;
      				if ( nestedp == 0 && nestedc == 0 && nestedb == 0 ) {
      					break ;
      				}
      			}
      			if ( j >= 0 ) {
      				ch = st.charAt ( j ) ;
      			}
      			while ( TeXGraph.Util.isAlpha ( ch ) ) {
      				if ( j >= 0 ) {
      					j-- ;
      					ch = st.charAt ( j ) ;
      				}
      				else {
      					break ;
      				}
      			}
      
      		}
      		else if ( TeXGraph.Util.isAlpha ( ch ) ) {
      			j-- ;
      			if ( j >= 0 ) {
      				ch = st.charAt ( j ) ;
      			}
      			while ( TeXGraph.Util.isAlpha ( ch ) ) {
      				if ( j >= 0 ) {
      					j-- ;
      					ch = st.charAt ( j ) ;
      				}
      				else {
      					break ;
      				}
      			}
      		}
      		else { 
      			return new TeXGraph.Error ( "Error: ! incorrect syntax in " + st + " at position " + j , "TeXGraph.Util.mathToJS" ) ; 
      		}
      		st = st.substring ( 0 , j + 1 ) + "TeXGraph.Math.factorial(" + st.substring ( j + 1 , i ) + ")" + st.substring ( i + 1 ) ;
      	}
      	var pipeCount = 0 ;
      	for (var m = 0 ; m < st.length; m++ ) {
      		ch = st.charAt ( m ) ;
 	       	if ( ch == '|' ) {
      	 		pipeCount++ ;
      		}
      	}
      	if ( pipeCount % 2 != 0 ) {
      		return new TeXGraph.Error ( "Error: Missing | in " + st , "TeXGraph.Util.mathToJS" ) ; 
      	}
      	while( ( i = st.indexOf ( "|" ) ) != -1 ) {
      		j = i + 1 ;
      		ch = st.charAt ( j ) ;
      		while ( ch != '|' ) {
      			j++ ;
      			if ( j >= 0 && j < st.length ) {
      				ch = st.charAt ( j ) ;
      			}
      		}
      
      		st = st.substring ( 0 , i ) + "TeXGraph.Math.abs(" + st.substring ( i + 1 , j ) + ")" + st.substring ( j + 1 ) ;
      
      	}
      
      	return st;
      };
      
      TeXGraph.Util = { } ;
      
      TeXGraph.Util.getIFrameDoc = function ( iframe ) {
      
      	var doc = null ;
      	if ( iframe.contentWindow ) {
      		doc = iframe.contentWindow.document ;
      	}
      	else if ( iframe.contentDocument ) {
      		doc = iframe.contentDocument ;
      	}
      	else if ( iframe.document ) {
      		doc = iframe.document ;
      	}
      
      	return doc ;
      };
      
      TeXGraph.Util.getElementsByClass = function ( container , tagName , clsName ) {
      	var list = new Array ( 0 ) ;
      	var collection = container.getElementsByTagName ( tagName ) ;
      	for ( var i = 0 ; i < collection.length ; i++ ) {
      		if ( collection[i].className.slice(0,clsName.length) == clsName ) {
      			list[list.length] = collection[i] ;
      		}
      	}
      	return list ;
      };
      
      TeXGraph.Util.fixEvent = function ( event ) {
      	if ( ! event ) {
      		event = window.event ;
      	}
      
      	if ( event.preventDefault ) {
      		event.preventDefault() ;
      	}
      	else {
      		event.returnValue = false ;
      	}
      
      	return event ;
      };
      
      TeXGraph.Util.insertAfterNode = function ( nodeToInsert , after ) {
      
      	var kids = after.parentNode.childNodes ;
      	var index = -1 ;
      	for ( var i = 0 ; i < kids.length ; i++ ) {
      		if ( kids[i] == after ) {
      			index = i ;
      			break ;
      		}
      	}
      	if ( index != -1 && index+1 < kids.length ) {
      		after.parentNode.insertBefore ( nodeToInsert , kids[index+1] ) ;
      	}
      	else {
      		after.parentNode.appendChild ( nodeToInsert ) ;
      	}
      };

      TeXGraph.Util.swap = function ( first , second ) {
      	var tmp = first ;
      	first = second ;
      	second = tmp ;
      	return {one:first,two:second} ;
      };
      
      TeXGraph.Util.colorString2HexString = function ( color ) {
      	if ( ! color ) { color = "" ; }
      	color = color.toLowerCase ( ) ;
      	switch ( color ) {
      		case "white" :
      			color = "#ffffff" ;
      			break ;
      
      		case "black" :
      			color = "#000000" ;
      			break ;
      
      		case "red" :
      			color.red = "#ff0000" ;
      			break ;
      
      		case "blue" :
      			color = "#0000ff" ;
      			break ;
      
      		case "yellow" :
      			color = "#ffff00" ;
      			break ;
      
      		case "orange" :
      			color = "#ff8040" ;
      			break ;
      
      		case "green" :
      			color = "#00ff00" ;
      			break ;
      
      		case "violet" :
      		case "purple" :
      			color = "#8d38c9" ;
      			break ;
      
      		case "gray" :
      		case "grey" :
      			color = "#736f63" ;
      			break ;
      
      		case "turquoise" :
      			color = "#00ffff" ;
      			break ;
      
      		case "lightblue" :
      			color = "#0000ff" ;
      			break ;
      
      		case "darkblue" :
      			color = "#0000a0" ;
      			break ;
      
      		case "lightpurple" :
      			color = "#ff0080" ;
      			break ;
      
      		case "darkpurple" :
      			color = "#800080" ;
      			break ;
      
      		case "pastelgreen" :
      			color = "#00ff00" ;
      			break ;
      
      		case "pink" :
      			color = "#ff00ff" ;
      			break ;
      
      		case "lightgray" :
      		case "lightgrey" :
      			color = "#c0c0c0" ;
      			break ;
      
      		case "darkgray" :
      		case "darkgrey" :
      			color = "#808080" ;
      			break ;
      
      		case "brown" :
      			color = "#804000" ;
      			break ;
      
      		case "burgundy" :
      			color = "#800000" ;
      			break ;
      
      		case "forestgreen" :
      			color = "#808000" ;
      			break ;
      
      		case "grassgreen" :
      			color = "#408080" ;
      			break ;
      
      		default :
      			break ;
      	}
      
      	return color ;
      };
      
      TeXGraph.Util.countCharInString = function ( ch , str ) {
      		var counter = 0 ;
      		for ( var i = 0 ; i < str.length ; i++ ) {
      			if ( str.charAt ( i ) == ch ) {
      				counter++ ;
      			}	
      		}
      		return counter;
      };
      TeXGraph.Util.isDigit = function ( ch ) {
      	if ( ch >= '0' && ch <= '9' ) {
      		return true ;
      	}
      	else {
      		return false ;
      	}
      };
      
      TeXGraph.Util.isAlpha = function ( ch ) {
      	if ( ( ch >= 'a' && ch <= 'z' ) || ( ch >= 'A' && ch <= 'Z' ) ) {
      		return true ;
      	}
      	else {
      		return false ;
      	}
      };

      TeXGraph.Font = { } ;
      TeXGraph.Font.Style = { } ;
      TeXGraph.Font.Style.PLAIN  = 0 ;
      TeXGraph.Font.Style.BOLD   = 1 ;
      TeXGraph.Font.Style.ITALIC = 2 ;
      TeXGraph.Font.Style.currentStyle = TeXGraph.Font.Style.PLAIN ;
      TeXGraph.Font.Style.getStyle  = function ( ) {
      	return TeXGraph.Font.Style.currentStyle ;
      };
      TeXGraph.Font.Style.setStyle  = function ( i ) {
      	TeXGraph.Font.Style.currentStyle = i ;
      };
      
      TeXGraph.Font.Stroke = { } ;
      TeXGraph.Font.Stroke.PLAIN = 1 ;
      TeXGraph.Font.Stroke.BOLD  = 2 ;
      TeXGraph.Font.Type = { } ;
      TeXGraph.Font.Type.DEFAULT     = 0 ;
      TeXGraph.Font.Type.CALLIGRAPHY = 1 ;
      TeXGraph.Font.Type.BLACKBOARDBOLD = 2 ;
      TeXGraph.Font.Type.FRAKTUR = 3 ;
      TeXGraph.Font.Type.currentType = TeXGraph.Font.Type.DEFAULT ;
      TeXGraph.Font.Type.getType  = function ( ) {
      	return TeXGraph.Font.Type.currentType ;
      };
      TeXGraph.Font.Type.setType  = function ( i ) {
      	TeXGraph.Font.Type.currentType = i ;
      };

      TeXGraph.DataDiv = function ( name , type ) {
      	this.name = name ;
      	this.type = type ;
      	TeXGraph.DataDivs.push ( this ) ;
      
      	return this ;
      };
      TeXGraph.DataDiv.UNARY = 1 ;
      TeXGraph.DataDivs = new Array ( ) ;
      TeXGraph.DataDivContents = new Array ( ) ;
      TeXGraph.DataDiv.addStandardDataDivs = function ( ) {
      	new TeXGraph.DataDiv ( "graph" ) ;
      };
      TeXGraph.Plugin = function ( func ) {
      	if ( ! func || typeof func != "function" ) {
      		return new TeXGraph.Warning ( "second argument must be a function" , "TeXGraph.Plugin" ) ;
      	}
      	this.func = func ;
      	TeXGraph.Plugins.push ( this ) ;
      	return this ;
      };
      TeXGraph.Plugins = new Array ( ) ;
      TeXGraph.getDataDivContentById = function ( id ) {
      	return TeXGraph.DataDivContents [ parseInt ( id.replace(/Grapher/,"") ) ] ;
      
      };
      TeXGraph.processPlugins = function ( node ) {
      	var plugins = TeXGraph.Plugins ;
      	for ( var i = 0 ; i < plugins.length ; i++ ) {
      		plugins[i].func ( node ) ;
      	}
      };
      TeXGraph.escapeScript = function ( str ) {
      
      	str = str.replace ( /<\/?(br|p|pre)\s?\/?>/gi , "\n" ) ;
      	str = str.replace ( /(\n|\r|\f|\v)/g , "&#10;" ) ;
      	str = str.replace ( /\t/g , "&#09;" ) ;
      	str = str.replace ( / /g , "&#32;" ) ;
      	str = str.replace ( /'/g , "&#39;" ) ;
      	str = str.replace ( /"/g , "&#34;" ) ;
      	return str ;
      };
      
      
      TeXGraph.unescapeScript = function ( str ) {
      
      	str = str.replace ( /&#32;/g , " " ) ;
      	str = str.replace ( /&#09;/g , "\t" ) ;
      	str = str.replace ( /&#10;/g , "\n" ) ;
      	str = str.replace ( /&#39;/g , "'" ) ;
      	str = str.replace ( /&#34;/g , "\"" ) ;
      	str = str.replace ( /&gt;/g , ">" ) ;
      	str = str.replace ( /&lt;/g , "<" ) ;
      	str = str.replace ( /&amp;/g , "&" ) ;
      	return str ;
      };
      TeXGraph.removeComments = function ( str ) {
      	var ind = str.indexOf ( "/*" ) ;
      	while ( ind != -1 ) {
      
      		var endInd = str.indexOf ( "*/" , ind+2 ) ;
      		if ( endInd != -1 ) {
      			str = str.slice(0,ind) + str.slice(endInd+2) ;
      		}
      		else {
      			str = str.slice(0,ind) ;
      		}
      		ind = str.indexOf ( "/*" , ind ) ;
      	}
      
      	return str ;
      };
      
      TeXGraph.addStandardPlugins = function ( ) {
      	new TeXGraph.Plugin ( TeXGraph.createDataDivs ) ;
      	new TeXGraph.Plugin ( TeXGraph.Graph.processGraphs ) ;
      
      };
      TeXGraph.doNothing = function ( node ) {
      };
      
      TeXGraph.createDataDivs = function ( node ) {
      
      	if ( ! node ) { node = document.body ; }
      
      	var str = "" ;
      	try {
      		str = node.innerHTML ;
      	}
      	catch ( error ) {
      	}
      
      	for ( var i = 0 ; i < TeXGraph.DataDivs.length ; i++ ) {
      		var data = TeXGraph.DataDivs[i].name ;
          /**********************************************/
      		str = str.replace ( new RegExp ( "\\\\?begin{TeXGraph}((.|\\n|\\r|\\f|\\v)*?)\\\\?end{TeXGraph}" , "gi" ) , function ( s , t ) {
          /**********************************************/
      			TeXGraph.DataDivContents.push ( TeXGraph.escapeScript ( t ) ) ;
      			return "<div id=\"Grapher" + (TeXGraph.DataDivContents.length-1) + "\" class=\"TeXGraph" + data.charAt(0).toUpperCase()+data.slice(1) + "\" style=\"position:relative;display:inline;border:0;vertical-align:middle;z-index:auto;\"></div>" ;
      		} );
      	}
      	node.innerHTML = str ;
      };
      
      TeXGraph.Code = { } ;
      TeXGraph.Code.processCode = TeXGraph.doNothing ;
      TeXGraph.Code.processCCode = TeXGraph.doNothing ;
      
      TeXGraph.SVGPath = function ( str ) {
      
      	if ( ! str ) { str = "" ; }
      	if ( str != "" ) { str = str.toUpperCase ( ) ; }
      	this.path = str ;
      
      	return this ;
      };
      
      TeXGraph.SVGPath.ROTATE = "rotate" ;
      TeXGraph.SVGPath.SCALE = "scale" ;
      TeXGraph.SVGPath.TRANSLATE = "translate" ;
      TeXGraph.SVGPath.SCEWX = "scewx" ;
      TeXGraph.SVGPath.RADIANS = "radians" ;
      TeXGraph.SVGPath.DEGREES = "degrees" ;
      TeXGraph.SVGPath.Transformations = new Array ( ) ;
      TeXGraph.SVGPath.prototype.moveTo = function ( x , y ) {
      	this.path += "M" + x + "," + y ;
      };
      TeXGraph.SVGPath.prototype.lineTo = function ( x , y ) {
      	this.path += "L" + x + "," + y ;
      };
      TeXGraph.SVGPath.prototype.arcTo = function ( x , y ) {
      	this.path += "A" + x + "," + y ;
      };
      TeXGraph.SVGPath.prototype.close = function ( ) {
      	this.path += "Z" ;
      };
      TeXGraph.SVGPath.prototype.getPath = function ( ) {
      	return this.path ;
      };
      TeXGraph.SVGPath.prototype.isSimplified = function ( ) {
      	var aIndex = this.path.indexOf ( "A" ) ;
      	if ( aIndex == -1 ) { return true ; }
      	return false ;
      };
      TeXGraph.SVGPath.prototype.simplify = function ( step ) {
      	this.path = this.path.toUpperCase ( ) ;
      	this.processTransforms ( ) ;
      	if ( this.isSimplified() ) { return ; }
      	if ( this.path.match(/Z/) ) { this.fixClosedPaths ( ) ; }
      	var str = this.path ;
      	var aIndex = 0 ;
      	var lastIndex = 0 ;
      	while ( (aIndex=str.indexOf("A",lastIndex)) != -1 ) {
      		var tmpStr = str.slice ( lastIndex , aIndex ) ;
      		var mIndex = tmpStr.lastIndexOf ( "M" ) ; 
      		var lIndex = tmpStr.lastIndexOf ( "L" ) ;
      		if ( mIndex == -1 && lIndex == -1 ) {
      			return new TeXGraph.Error ( "Expected M or L command in " + str , "TeXGraph.SVGPath.prototype.simplify" ) ;
      		} 
      		var mlIndex = TeXGraph.Math.max ( mIndex , lIndex ) ;
      		var pointStr = tmpStr.slice ( mlIndex + 1 , aIndex ) ;
      		var point = pointStr.split ( "," ) ;
      		var x = point[0] ;	
      		var y = point[1] ;
      		var point2Str = str.charAt ( aIndex + 1 ) ;
      		var i = aIndex + 2 ;
      		var ch = str.charAt ( i ) ;
      		while ( ! TeXGraph.Util.isAlpha(ch) && ch != null && ch != "" ) {
      			point2Str += "" + ch ;
      			i++ ;
      			ch = str.charAt ( i ) ;
      		}
      		var point2 = point2Str.split ( "," ) ;
      		var x2 = point2[0] ;
      		var y2 = point2[1] ;
      
      		var tmp = this.arcToLines ( x , y , x2 , y2 , step ) ;
      		var nextIndex = aIndex + point2Str.length ;	
      		if ( nextIndex > str.length ) {
      			str = str.substring ( 0 , aIndex ) + tmp ;
      		}
      		else {
      			str = str.substring ( 0 , aIndex ) + tmp + str.substring ( nextIndex + 1 ) ;
      		}
      		lastIndex = 0 ;
      	}
      
      	this.path = str ;
      };
      TeXGraph.SVGPath.prototype.arcToLines = function ( x1 , y1 , x2 , y2 , step ) {
      
      	if ( ! step ) { step = 0.5 ; }
      	if ( typeof step != "number" ) { return new TeXGraph.Error ( "step is NOT a number." , "TeXGraph.SVGPath.prototype.arcToLines" ) ; }
      
      	step = parseFloat ( step ) ;
      	x1 = parseFloat ( x1 ) ;
      	y1 = parseFloat ( y1 ) ;
      	x2 = parseFloat ( x2 ) ;
      	y2 = parseFloat ( y2 ) ;
      
      	var dx = x2 - x1 ;
      	var dy = y2 - y1 ;
      	var tmp = "" ;
      	var stopLoop = false ;
      	var ox = x2 ;
      	var oy = y1 ;
      
      	var a = TeXGraph.Math.abs ( dx ) ;
      	var b = TeXGraph.Math.abs ( dy ) ;
      	var x = a;
      	var y = 0;
      	var xstep = TeXGraph.Math.abs ( step ) ;
      	if ( dx < 0 && dy > 0 ) {
      		ox = x2 ;
      		oy = y1 ;
      		for ( x = a - xstep ; x >= 0 ; x -= xstep ) {
      			y = b * TeXGraph.Math.sqrt ( 1 - TeXGraph.Math.pow(x/a,2) ) ;
      			tmp += "L" + TeXGraph.Math.chop(x+ox,4) + "," + TeXGraph.Math.chop(y+oy,4) ;
      		}	
      	}
      	else if ( dx < 0 && dy < 0 ) {
      		ox = x1 ;
      		oy = y2 ;
      		for ( x = 0 - xstep ; x >= -a ; x -= xstep ) {
      			y = b * TeXGraph.Math.sqrt ( 1 - TeXGraph.Math.pow(x/a,2) ) ;
      			tmp += "L" + TeXGraph.Math.chop(x+ox,4) + "," + TeXGraph.Math.chop(y+oy,4) ;
      		}	
      	}
      	else if ( dx > 0 && dy < 0 ) {
      		ox = x2 ;
      		oy = y1 ;
      		for ( x = -a + xstep ; x <= 0 ; x += xstep ) {
      			y = -b * TeXGraph.Math.sqrt ( 1 - TeXGraph.Math.pow(x/a,2) ) ;
      			tmp += "L" + TeXGraph.Math.chop(x+ox,4) + "," + TeXGraph.Math.chop(y+oy,4) ;
      		}
      	}
      	else if ( dx > 0 && dy > 0 ) {
      		ox = x1 ;
      		oy = y2 ;
      		for ( x = 0 + xstep ; x <= a ; x += xstep ) {
      			y = -b * TeXGraph.Math.sqrt ( 1 - TeXGraph.Math.pow(x/a,2) ) ;
      			tmp += "L" + TeXGraph.Math.chop(x+ox,4) + "," + TeXGraph.Math.chop(y+oy,4) ;
      		}
      	}
      	else if ( dx == 0 || dy == 0 ) {
      			tmp += "L" + TeXGraph.Math.chop(x1,4) + "," + TeXGraph.Math.chop(y1,4) ;
      			tmp += "L" + TeXGraph.Math.chop(x2,4) + "," + TeXGraph.Math.chop(y2,4) ;
      	}
      	tmp += "L" + TeXGraph.Math.chop(x2,4) + "," + TeXGraph.Math.chop(y2,4) ;
      	return tmp.replace ( /\s/g , "" ) ;
      };

      TeXGraph.SVGPath.prototype.fixClosedPaths = function ( ) {
      	var pathStr = this.path.toUpperCase ( ) ;
      	var ch = "" ;
      	var lastIndex = 0 ;
      	var zIndex = 0 ;
      	while ( (zIndex=pathStr.indexOf("Z",lastIndex)) != -1 ) {
      		var tmpStr = pathStr.substring ( lastIndex , zIndex ) ;
      		var lIndex = tmpStr.lastIndexOf ( "L" ) ;
      		var aIndex = tmpStr.lastIndexOf ( "A" ) ;
      		if ( lIndex == -1 && aIndex == -1 ) { return new TeXGraph.Error ( "Expected L or A command." , "TeXGraph.Canvas.prototype._drawSVGPath" ) ; }
      		var lastCommand = (aIndex > lIndex) ? "A" : "L" ;
      		var laIndex = TeXGraph.Math.max ( lIndex , aIndex ) ;
      		var pointStr = tmpStr.charAt ( laIndex + 1 ) ;
      		var i = laIndex + 2 ;
      		var ch = tmpStr.charAt ( i ) ;
      		while ( ! TeXGraph.Util.isAlpha(ch) && ch != null && ch != "" ) {
      			pointStr += "" + ch ;
      			i++ ;
      			ch = tmpStr.charAt ( i ) ;
      		}
      		var point = pointStr.split ( "," ) ;
      		var x = parseFloat ( point[0] ) ;
      		var y = parseFloat ( point[1] ) ;
      
      		var mIndex = tmpStr.lastIndexOf ( "M" ) ;
      		if ( mIndex == -1 ) { return new TeXGraph.Error ( "Expected M command." , "TeXGraph.Canvas.prototype._drawSVGPath" ) ; }
      		// get point after mIndex
      		var point2Str = tmpStr.charAt ( mIndex + 1 ) ;
      		var i = mIndex + 2 ;
      		var ch = tmpStr.charAt ( i ) ;
      		while ( ! TeXGraph.Util.isAlpha(ch) && ch != null && ch != "" ) {
      			point2Str += "" + ch ;
      			i++ ;
      			ch = tmpStr.charAt ( i ) ;
      		}
      		var point2 = point2Str.split ( "," ) ;
      		var x2 = parseFloat ( point2[0] ) ;
      		var y2 = parseFloat ( point2[1] ) ;
      
      		if ( x == x2 && y ==y2 ) { return ; }
      		var tmp = "" + lastCommand + x2 + "," + y2 ;
      		pathStr = pathStr.substring ( 0 , zIndex ) + tmp + pathStr.substring ( zIndex ) ;
      		lastIndex = zIndex + 1 + tmp.length ;
      	} 
      
      	this.path = pathStr ;
      
      };
      
      TeXGraph.SVGPath.prototype.processTransform = function ( op , num1 , num2 ) {
      
      	var tmp = "" ;
      	var str = this.path ;
      	str = str.replace ( /\s/g , "" ) ;
      	var i = 0 ;
      	var ch = str.charAt ( i ) ;
      	while ( ch != null && ch != "" ) {
      
      		if ( TeXGraph.Util.isAlpha (ch) ) {
      			tmp += "" + ch ;
      		}
      		else if ( TeXGraph.Util.isDigit (ch) || ch == '.' || ch == '-' ) {
      			var x = "" + ch ;
      			i++ ;
      			ch = str.charAt ( i ) ;
      			while ( TeXGraph.Util.isDigit (ch) || ch =='.' ) {
      				x += "" + ch ;
      				i++ ;
      				ch = str.charAt ( i ) ;
      			}
      			if ( ch != "," ) { return new TeXGraph.Error ( "expected , got " + ch , "TeXGraph.SVGPath.prototype.processTransform" ) ; }
      			var y = "" ;
      			i++ ;
      			ch = str.charAt ( i ) ;
      			var test = TeXGraph.Util.isDigit(ch) || ch == '.' || ch == '-' ;
      			if ( ! test ) { return new TeXGraph.Error ( "expected digit or . or - in y-coord, got " + ch , "TeXGraph.SVGPath.prototype.processTransform" ) ; }
      			while ( TeXGraph.Util.isDigit(ch) || ch =='.' || ch == '-' ) {
      				y += "" + ch ;
      				i++ ;
      				ch = str.charAt ( i ) ;
      			}
      			i-- ;
      
      			if ( op == TeXGraph.SVGPath.ROTATE ) {
      				tmp += "" + (eval (TeXGraph.Math.chop(TeXGraph.Math.cos(num1),2) + "*" + x + " - " + TeXGraph.Math.chop(TeXGraph.Math.sin(num1),2) + "*" + y)).toFixed(4) ;
      				tmp += "," ;
      				tmp += "" + (eval (TeXGraph.Math.chop(TeXGraph.Math.sin(num1),2) + "*" + x + " + " + TeXGraph.Math.chop(TeXGraph.Math.cos(num1),2) + "*" + y)).toFixed(4) ;
      			}
      			else if ( op == TeXGraph.SVGPath.SCALE ) {
      				tmp += "" + TeXGraph.Math.chop(eval(num1 + "*" + x),4) ;
      				tmp += "," ;
      				tmp += "" + TeXGraph.Math.chop(eval(num2 + "*" + y),4) ;
      			}
      			else if ( op == TeXGraph.SVGPath.TRANSLATE ) {
      				tmp += "" + TeXGraph.Math.chop(eval(x + "+" + num1),4) ;
      				tmp += "," ;
      				tmp += "" + TeXGraph.Math.chop(eval(y + "+" + num2),4) ;
      			}
      			else if ( op == TeXGraph.SVGPath.SCEWX ) {
      				tmp += "" + (eval (TeXGraph.Math.chop(TeXGraph.Math.cos(num1),2) + "*" + x + " + " + TeXGraph.Math.chop(TeXGraph.Math.sin(num1),2) + "*" + y)).toFixed(4) ;
      				tmp += "," ;
      				tmp += "" + TeXGraph.Math.chop(eval(y),4) ;
      			}
      		}
      
      		i++ ;
      		ch = str.charAt ( i ) ;
      	}
      
      	this.path = tmp ;
      };
      
      TeXGraph.SVGPath.prototype.rotate = function ( theta , angleMeasure , point ) {
      	if ( ! theta || typeof theta != "number" ) { theta = 0 ; }
      	if ( theta == 0 ) { return ; }
      	if ( ! angleMeasure || typeof angleMeasure != "string" ) { angleMeasure = TeXGraph.SVGPath.RADIANS ; }
      	if ( angleMeasure == TeXGraph.SVGPath.DEGREES ) { theta = theta * TeXGraph.Math.pi / 180 ; }
      	if ( ! point ) { point = [0,0] ; }
      	this.translate ( -point[0] , -point[1] ) ;
      	this.processTransform ( TeXGraph.SVGPath.ROTATE , theta ) ;
      	this.translate ( point[0] , point[1] ) ;
      };
      
      TeXGraph.SVGPath.prototype.scale = function ( x , y ) {
      	if ( ! x || typeof x != "number" ) { x = 1 ; }
      	if ( ! y || typeof y != "number" ) { y = 1 ; }
      	if ( x == 1 && y == 1 ) { return ; }
      	this.processTransform ( TeXGraph.SVGPath.SCALE , x , y ) ;
      };
      
      TeXGraph.SVGPath.prototype.translate = function ( x , y ) {
      	if ( ! x || typeof x != "number" ) { x = 0 ; }
      	if ( ! y || typeof y != "number" ) { y = 0 ; }
      	if ( x == 0 && y == 0 ) { return ; }
      	this.processTransform ( TeXGraph.SVGPath.TRANSLATE , x , y ) ;
      };
      TeXGraph.SVGPath.prototype.scewx = function ( theta , angleMeasure ) {
      	if ( ! theta || typeof theta != "number" ) { theta = 0 ; }
      	if ( theta == 0 ) { return ; }
      	if ( ! angleMeasure || typeof angleMeasure != "string" ) { angleMeasure = TeXGraph.SVGPath.RADIANS ; }
      	if ( angleMeasure == TeXGraph.SVGPath.DEGREES ) { theta *= TeXGraph.Math.pi / 180 ; }
      	this.processTransform ( TeXGraph.SVGPath.SCEWX , theta ) ;
      };
      
      TeXGraph.SVGPath.prototype.processTransforms = function ( ) {
      	var transforms = TeXGraph.SVGPath.Transformations ;
      	for ( var i = 0 ; i < transforms.length ; i++ ) {
      		var t = transforms[i] ;
      		switch ( t.op ) {
      			case TeXGraph.SVGPath.ROTATE :
      				this.rotate ( t.angle , t.measure , t.point ) ;
      				break ;
      			case TeXGraph.SVGPath.SCALE :
      				this.scale ( t.fx , t.fy ) ;
      				break ;
      			case TeXGraph.SVGPath.TRANSLATE :
      				this.translate ( t.dx , t.dy ) ;
      				break ;
      			case TeXGraph.SVGPath.SCEWX :
      				this.scewx ( t.theta , t.measure ) ;
      				break ;
      			default :
      				break ;
      		}
      	}
      };
      
      TeXGraph.SVGPath.addTransform = function ( obj ) {
      
      	if ( ! obj || ! obj.op ) {
      		return new TeXGraph.Error ( "Expecting an object with attribute op." , "TeXGraph.SVGPath.addTransform" ) ;
      	}
      	TeXGraph.SVGPath.Transformations.push ( obj ) ;
      };
      
      TeXGraph.SVGPath.clearTransforms = function ( ) {
      	TeXGraph.SVGPath.Transformations = [] ;
      };
      
      
      TeXGraph.Window = function ( width , height ) {
      
      	if ( ! width || width <= 0 ) {
      		width = 100 ;
      	}
      	if ( ! height || height <= 0 ) {
      		height = 100 ;
      	}
      
      	this.width = width ;
      	this.height = height ;
      	this.id = "TeXGraph-Window-" + TeXGraph.Window.id ;
      	this.iframeId = "TeXGraph-IFrame-" + TeXGraph.Window.id ;
      	this.controlPanelId = "TeXGraph-ControlPanel-" + TeXGraph.Window.id ;
      
      	this.header = null ;
      	this.footer = null ;
      	
      	this.node = document.createElement ( "div" ) ;
      	if ( TeXGraph.Util.isIE ) {
      		this.node.setAttribute ( "style" , "position:absolute;display:inline;" ) ;
      		this.node.id = this.id ;
      		this.node.width = this.width ;
      		this.node.height = this.height ;
      	}
      	else {
      		this.node.setAttribute ( "style" , "position:absolute;display:inline;" ) ;
      		this.node.setAttribute ( "id" , this.id ) ;
      		this.node.setAttribute ( "width" , this.width ) ;
      		this.node.setAttribute ( "height" , this.height ) ;
      	}
      
      	this.iframe = document.createElement ( "iframe" ) ;
      	this.iframe.setAttribute ( "id" , this.iframeId ) ;
      	this.iframe.setAttribute ( "name" , this.iframeId ) ;
      	this.iframe.setAttribute ( "scrolling" , "no" ) ;
      	if ( TeXGraph.Util.isIE ) {
      		this.iframe.setAttribute ( "style" , "position:relative;display:inline;z-index:auto;" ) ;
      		this.iframe.width = 1.5*this.width ;
      		this.iframe.height = 1.5*this.height ;
      		this.iframe.border = "0" ;
      		this.iframe.marginWidth = "0" ;					
      		this.iframe.marginHeight = "0" ;				
      		this.iframe.frameBorder = "0" ;					
      		this.iframe.style.verticalAlign = "middle" ;
      	}
      	else {
      		var style = "position:relative;display:inline;border:0;vertical-align:middle;z-index:auto;" ;
      		style += "margin:0 0 0 0;" ;
      		this.iframe.setAttribute ( "style" , style ) ;
      		this.iframe.setAttribute ( "width" , 1.5*this.width ) ;
      		this.iframe.setAttribute ( "height" , 1.5*this.height ) ;
      	}
      	TeXGraph.Window.id++ ;
      
      	return this ;
      };
      
      TeXGraph.Window.id = 0 ;
      TeXGraph.Window.bgColor = "white" ;
      TeXGraph.Window.bgColor = null ;
      TeXGraph.Window.prototype.insertWindow = function ( node , nodeToReplace ) {
      	var tmpNode = null ;
      	if ( ! node ) { node = document.body ; }
      	var color = null ;
      	if ( TeXGraph.Util.isIE ) {
      		color = (node.style.backgroundColor) ? node.style.backgroundColor : node.getAttribute("bgcolor") ;
      	}
      
      	if ( ! nodeToReplace ) {
      		node.appendChild ( this.iframe ) ;
      	}
      	else {
      		tmpNode = node.replaceChild ( this.iframe , nodeToReplace ) ;
      	}
      
      	var doc = TeXGraph.Util.getIFrameDoc ( this.iframe ) ;
      	doc.open ( ) ;
      	if ( ! TeXGraph.Util.isIE ) {
      		doc.write ( "<html><head><style>a { text-decoration:none; }</style></head><body></body></html>" ) ;
      		if ( this.header != null ) {
      			doc.body.insertBefore ( this.header , null ) ;
      		}
      		doc.body.insertBefore ( this.node , null ) ;
      		if ( this.footer != null ) {
      			doc.body.insertBefore ( this.footer , null ) ;
      		}
      	}
      	else {
      		var div = document.createElement ( "div" ) ;
      		if ( this.header != null ) {
      			div.body.insertBefore ( this.header , null ) ;
      		}
      		div.insertBefore ( this.node , null ) ;
      		if ( this.footer != null ) {
      			div.body.insertBefore ( this.footer , null ) ;
      		}
      		doc.write ( "<html><head><style>a { text-decoration:none; }</style></head><body>" + div.innerHTML + "</body></html>" ) ;
      	}
      
      	doc.close ( ) ;
      
      };
      
      TeXGraph.Window.prototype.toObjectLiteralString = function ( ) {
      	return "{ width:" + this.width + ", height: " + this.height + ", id: \"" + this.id + "\" , controlPanelId: \"" + this.controlPanelId + "\" }" ;
      };
      
      TeXGraph.Window.update = function ( ) {
      };    

      TeXGraph.Canvas = function ( aWindow , xmin , xmax , xscale , ymin , ymax , yscale , bgcolor ) {
      	if ( ! aWindow || ! aWindow.insertWindow ) {
      		new TeXGraph.Error ( "Need an TeXGraph.Window object as first argument." , "TeXGraph.Canvas" ) ;
      	}
      	this.window = aWindow ;
      	this.canvas = new jsGraphics ( this.window.node ) ;
      	this.xmin = xmin == null ? -10 : xmin ;
      	this.xmax = xmax == null ? 10 : xmax ;
      	this.xscale = xscale == null ? 1 : xscale ;
      	this.xstep = (this.xmax-this.xmin)/this.window.width ;
      	this.ymin = ymin == null ? -10 : ymin ;
      	this.ymax = ymax == null ? 10 : ymax ;
      	this.yscale = yscale == null ? 1 : yscale ;
      	this.ystep = (this.ymax-this.ymin)/this.window.height ;
      	this.bgcolor = bgcolor ;
      	if ( this.xmax < this.xmin ) {
      		var swap = TeXGraph.Util.swap ( this.xmin , this.xmax ) ;
      		this.xmax = swap.one ;
      		this.xmin = swap.two ;
      	}
      	if ( this.ymax < this.ymin ) {
      		var swap = TeXGraph.Util.swap ( this.ymin , this.ymax ) ;
      		this.ymax = swap.one ;
      		this.ymin = swap.two ;
      	}
      
      	var x = Math.max ( Math.abs(this.xmin) , Math.abs(this.xmax) ) ;
      	var y = Math.max ( Math.abs(this.ymin) , Math.abs(this.ymax) ) ;
      	this.rmax = Math.max ( x , y ) ;
      	this.rmin = 0 ;
      	this.rscale = Math.max ( Math.abs(this.xscale) , Math.abs(this.yscale) ) ;
      	this.rstep = Math.max ( Math.abs(this.xstep) , Math.abs(this.ystep) ) ;
      	this.thetastep = 0.01 ;
      	this.thetascale = Math.PI / 6 ;
      	this.thetamin = 0 ;
      	this.thetamax = 2 * Math.PI ;
      	this.setUpEventHandlers ( ) ;
      	TeXGraph.Canvas.Canvases.push ( this ) ;
      	return this ;
      };
      
      TeXGraph.Canvas.DisplayCoordinates = true ;
      TeXGraph.Canvas.Canvases = new Array ( ) ;
      TeXGraph.Canvas.SVGPathRecorder = new Array ( ) ;
      TeXGraph.Canvas.currentColor = "" ;
      TeXGraph.Canvas.defaultStroke = TeXGraph.Font.Stroke.PLAIN ;
      TeXGraph.Canvas.currentStroke = TeXGraph.Canvas.defaultStroke ;
      TeXGraph.Canvas.prototype.toObjectLiteralString = function ( ) {
      	return "{ xmin: " + this.xmin + ", xmax: " + this.xmax + ", ymin: " + this.ymin + ", ymax: " + this.ymax + ", xscale: " + this.xscale + ", yscale: " + this.yscale + "}" ; 
      };
      
      TeXGraph.Canvas.prototype.fillBackground = function ( ) {
      	this.setColor ( this.bgcolor ) ;
      	this.fillRect ( this.xmin , this.ymin , this.xmax-this.xmin , this.ymax-this.ymin ) ;
      };
      
      TeXGraph.Canvas.prototype.setUpEventHandlers = function ( ) {
      	var d = this.window.node ;
      	if ( d.captureEvents ) { d.captureEvents(Event.CLICK) ; }
      	if ( TeXGraph.Util.isIE ) {
      	}
      	else {
      	}
      };
      
      TeXGraph.Canvas.prototype.toWindowCoordinates = function ( point ) {
      	var u = parseInt ( this.window.width * (point.x-this.xmin)/(this.xmax-this.xmin) ) ;
      	var v = parseInt ( this.window.height * (this.ymax-point.y)/(this.ymax-this.ymin) ) ;
      	return {x:u,y:v} ;
      };
      TeXGraph.Canvas.prototype.paint = function ( ) {
      	this.canvas.paint ( ) ;
      };
      TeXGraph.Canvas.prototype.clear = function ( ) {
      	this.canvas.clear ( ) ;
      };
      TeXGraph.Canvas.prototype.setPrintable = function ( bool ) {
      	if ( typeof bool != "boolean" ) {
      		new TeXGraph.Error ( "Needs a boolean argument." , "TeXGraph.Canvas.prototype.setPrintable" ) ;
      	}
      	this.canvas.setPrintable ( bool ) ;
      };
      TeXGraph.Canvas.prototype.setStroke = function ( stroke ) {
      	if ( typeof stroke == "string" && stroke.match(/dotted/i) ) {
      		stroke = Stroke.DOTTED ;
      	}
      	this.canvas.setStroke ( parseInt(stroke) ) ;
      	TeXGraph.Canvas.currentStroke = parseInt(stroke) ;
      };
      TeXGraph.Canvas.prototype.getStroke = function ( ) {
      
      	return TeXGraph.Canvas.currentStroke ;
      };
      TeXGraph.Canvas.prototype.setColor = function ( color ) {
      	this.canvas.setColor ( color ) ;
      	TeXGraph.Canvas.currentColor = color ;
      };
      TeXGraph.Canvas.prototype.getColor = function ( ) {
      	return TeXGraph.Canvas.currentColor ;
      };
      TeXGraph.Canvas.prototype.setOpacity = function ( opacity ) {
      	if ( typeof opacity != "number" ) {
      		opacity = 1 ;
      	}
      	this.canvas.setOpacity ( opacity ) ;
      };
      
      TeXGraph.Canvas.prototype._drawLine = function ( x1 , y1 , x2 , y2 ) {
      	if ( typeof x1 != "number" ) {
      		new TeXGraph.Error ( "Argument 1 must be a number, not " + typeof x1 + "." , "TeXGraph.Canvas.prototype._drawLine" ) ;
      	}
      	if ( typeof y1 != "number" ) {
      		new TeXGraph.Error ( "Argument 2 must be a number, not " + typeof y1 + "." , "TeXGraph.Canvas.prototype._drawLine" ) ;
      	}
      	if ( typeof x2 != "number" ) {
      		new TeXGraph.Error ( "Argument 3 must be a number, not " + typeof x2 + "." , "TeXGraph.Canvas.prototype._drawLine" ) ;
      	}
      	if ( typeof y2 != "number" ) {
      		new TeXGraph.Error ( "Argument 4 must be a number, not " + typeof y2 + "." , "TeXGraph.Canvas.prototype._drawLine" ) ;
      	}
      	var point1 = this.toWindowCoordinates ( {x:x1,y:y1} ) ; 
      	var point2 = this.toWindowCoordinates ( {x:x2,y:y2} ) ; 
      	this.canvas.drawLine ( point1.x , point1.y , point2.x , point2.y ) ;
      };
      
      TeXGraph.Canvas.prototype._drawPolyLine = function ( X , Y ) {
      	var xPoints = new Array ( ) ;
      	var yPoints = new Array ( ) ;
      
      	if ( X.length != Y.length ) {
      		new TeXGraph.Error ( "Arrays are not same length." , "TeXGraph.Canvas.prototype._drawPolyLine" ) ;
      	}
      
      	for ( var i = 0 ; i < X.length ; i++ ) {
      		var point = this.toWindowCoordinates ( {x:X[i],y:Y[i]} ) ;
      		xPoints.push ( point.x ) ;
      		yPoints.push ( point.y ) ;
      	}
      	this.canvas.drawPolyLine ( xPoints , yPoints ) ;
      };
      
      TeXGraph.Canvas.prototype._drawPolygon = function ( X , Y ) {
      	var xPoints = new Array ( ) ;
      	var yPoints = new Array ( ) ;
      
      	if ( X.length != Y.length ) {
      		new TeXGraph.Error ( "Arrays are not same length." , "TeXGraph.Canvas.prototype._drawPolygon" ) ;
      	}
      
      	for ( var i = 0 ; i < X.length ; i++ ) {
      		var point = this.toWindowCoordinates ( {x:X[i],y:Y[i]} ) ;
      		xPoints.push ( point.x ) ;
      		yPoints.push ( point.y ) ;
      	}
      	this.canvas.drawPolygon ( xPoints , yPoints ) ;
      };
      
      TeXGraph.Canvas.prototype._fillPolygon = function ( X , Y ) {
      	var xPoints = new Array ( ) ;
      	var yPoints = new Array ( ) ;
      
      	if ( X.length != Y.length ) {
      		new TeXGraph.Error ( "Arrays are not same length." , "TeXGraph.Canvas.prototype._fillPolygon" ) ;
      	}
      
      	for ( var i = 0 ; i < X.length ; i++ ) {
      		var point = this.toWindowCoordinates ( {x:X[i],y:Y[i]} ) ;
      		xPoints.push ( point.x ) ;
      		yPoints.push ( point.y ) ;
      	}
      	this.canvas.fillPolygon ( xPoints , yPoints ) ;
      };
      
      TeXGraph.Canvas.prototype.drawSVGPath = function ( path , fill ) {
      
      	if ( ! fill ) {
      		fill = false ;
      	}
      	if ( path == "" ) {
      		return ;
      	}
      	if ( typeof fill != "boolean" ) {
      		new TeXGraph.Error ( "Needs a boolean or null value for 2nd argument." , "TeXGraph.Canvas.prototype.drawSVGPath" ) ;
      	}
      	var p = new TeXGraph.SVGPath ( path ) ;
      	p.simplify ( TeXGraph.Math.min ( this.xstep , this.ystep ) ) ;
      	path = p.path ;
      	path = path.replace ( /^M/ , "" ) ;
      	path = path.replace ( /[A-LN-Y]/g , "L" ) ;
      	path = path.replace ( /\s+/g , "" ) ;
      	var paths = path.split ( "M" ) ;
      	for ( var i = 0 ; i < paths.length ; i++ ) {
      		var X = new Array ( ) ;
      		var Y = new Array ( ) ;
      		var p = paths[i] ;
      		var type = "polyline" ;
      		if ( p.match ( /Z$/ ) ) {
      			type = "polygon" ;
      		}
      		p = p.replace ( /Z$/ , "" ) ;
      		var points = p.split ( "L" ) ;
      		for ( var j = 0 ; j < points.length ; j++ ) {
      			var  point = points[j] ;
      			var xy = point.split ( "," ) ;
      			var x = parseFloat ( xy[0] ) ;
      			var y = parseFloat ( xy[1] ) ;
      			X.push ( x ) ;
      			Y.push ( y ) ;
      		}
      		if ( type == "polyline" ) {
      			this._drawPolyLine ( X , Y ) ;
      		}
      		else if ( type == "polygon" && fill == true ) {
      			this._fillPolygon ( X , Y ) ;
      		}
      		else if ( type == "polygon" ) {
      			this._drawPolygon ( X , Y ) ;
      		}
      
      	}
      };
      
      TeXGraph.Canvas.prototype.drawLine = function ( x1 , y1 , x2 , y2 ) {
      	this.drawPolyLine ( [x1,x2] , [y1,y2] ) ;
      };
      
      TeXGraph.Canvas.prototype.drawPolyLine = function ( X , Y ) {
      	if ( X.length != Y.length ) {
      		return new TeXGraph.Error ( "arrays must be same length" , "TeXGraph.Canvas.prototype.drawPolyLine" ) ;
      	}
      	var path = new TeXGraph.SVGPath ( ) ;
      	path.moveTo ( X[0] , Y[0] ) ;
      	for ( var i = 1 ; i < X.length ; i++ ) {
      		path.lineTo ( X[i] , Y[i] ) ;
      	}
      	this.drawSVGPath ( path.getPath() , false ) ;
      };
      
      TeXGraph.Canvas.prototype.drawPolyline = TeXGraph.Canvas.prototype.drawPolyLine ;
      
      TeXGraph.Canvas.prototype.drawPolygon = function ( X , Y ) {
      	if ( X.length != Y.length ) {
      		return new TeXGraph.Error ( "arrays must be same length" , "TeXGraph.Canvas.prototype.drawPolygon" ) ;
      	}
      	var path = new TeXGraph.SVGPath ( ) ;
      	path.moveTo ( X[0] , Y[0] ) ;
      	for ( var i = 1 ; i < X.length ; i++ ) {
      		path.lineTo ( X[i] , Y[i] ) ;
      	}
      	path.close ( ) ;
      	this.drawSVGPath ( path.getPath() , false ) ;
      };
      
      TeXGraph.Canvas.prototype.fillPolygon = function ( X , Y ) {
      	if ( X.length != Y.length ) {
      		return new TeXGraph.Error ( "arrays must be same length" , "TeXGraph.Canvas.prototype.drawPolygon" ) ;
      	}
      	var path = new TeXGraph.SVGPath ( ) ;
      	path.moveTo ( X[0] , Y[0] ) ;
      	for ( var i = 1 ; i < X.length ; i++ ) {
      		path.lineTo ( X[i] , Y[i] ) ;
      	}
      	path.close ( ) ;
      	this.drawSVGPath ( path.getPath() , true ) ;
      };
      
      TeXGraph.Canvas.prototype.drawRect = function ( x , y , width , height ) {
      	if ( typeof x != "number" && typeof y != "number" && typeof width != "number" && typeof height != "number" ) {
      		return new TeXGraph.Error ( "args missing or NOT a number" , "TeXGraph.Canvas.prototype.drawRect" ) ;
      	}
      	var path = new TeXGraph.SVGPath ( ) ;
      	path.moveTo ( x , y ) ;
      	path.lineTo ( x + width , y ) ;
      	path.lineTo ( x + width , y + height  ) ;
      	path.lineTo ( x , y + height  ) ;
      	path.close ( ) ;
      	this.drawSVGPath ( path.getPath() , false ) ;
      };
      TeXGraph.Canvas.prototype.fillRect = function ( x , y , width , height ) {
      	if ( typeof x != "number" && typeof y != "number" && typeof width != "number" && typeof height != "number" ) {
      		return new TeXGraph.Error ( "args missing or NOT a number" , "TeXGraph.Canvas.prototype.drawRect" ) ;
      	}
      	var path = new TeXGraph.SVGPath ( ) ;
      	path.moveTo ( x , y ) ;
      	path.lineTo ( x + width , y ) ;
      	path.lineTo ( x + width , y + height  ) ;
      	path.lineTo ( x , y + height  ) ;
      	path.close ( ) ;
      	this.drawSVGPath ( path.getPath() , true ) ;
      };
      TeXGraph.Canvas.prototype.drawEllipse = function ( center , a , b ) {
      	var h = center[0] ;
      	var k = center[1] ;
      	var path = new TeXGraph.SVGPath ( ) ;
      	path.moveTo ( h + a , k + 0 ) ;
      	path.arcTo ( h + 0 , k + b ) ;
      	path.arcTo ( h - a , k + 0 ) ;
      	path.arcTo ( h + 0 , k + b ) ;
      	path.close ( ) ;
      	this.drawSVGPath ( path.getPath() , false ) ;
      };
      TeXGraph.Canvas.prototype.fillEllipse = function ( center , a , b ) {
      	var h = center[0] ;
      	var k = center[1] ;
      	var path = new TeXGraph.SVGPath ( ) ;
      	path.moveTo ( h , k ) ;
      	path.moveTo ( h + a , k + 0 ) ;
      	path.arcTo ( h + 0 , k + b ) ;
      	path.arcTo ( h - a , k + 0 ) ;
      	path.arcTo ( h + 0 , k + b ) ;
      	path.close ( ) ;
      	this.drawSVGPath ( path.getPath() , true ) ;
      };
      
      TeXGraph.Canvas.prototype.drawArc = function ( center , a , b , startAngle , endAngle , fill ) {
      
      	if ( ! fill || typeof fill != "boolean" ) { fill = false ; }
      
      	if ( ! endAngle > startAngle ) {
      		return new TeXGraph.Error ( "endAngle must be larger than startAngle" , "TeXGraph.Canvas.drawArc" ) ;
      	}
      
      	var path = new TeXGraph.SVGPath ( ) ;
      	var x0 , y0 ;
      	var x , y ;
      	var h = center[0] ;
      	var k = center[1] ;
      	var m = TeXGraph.Math ;
      
      	if ( startAngle >= 0 && startAngle < 90 ) {
      		x0 = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
      		y0 = k + m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	else if ( startAngle >= 90 ) {
      		x0 = h + 0 ;
      		y0 = k + b ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	if ( startAngle > 90 && startAngle < 180 ) {
      		x0 = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
      		y0 = k + m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	else if ( startAngle >= 180 ) {
      		x0 = h - a ;
      		y0 = k + 0 ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	if ( startAngle > 180 && startAngle < 270 ) {
      		x0 = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
      		y0 = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	else if ( startAngle >= 270 ) {
      		x0 = h + 0 ;
      		y0 = k - b ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	if ( startAngle > 270 && startAngle < 360 ) {
      		x0 = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
      		y0 = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	else if ( startAngle >= 360 ) {
      		x0 = h + a ;
      		y0 = k + 0 ;
      		path.moveTo ( x0 , y0 ) ;
      	}
      	if ( endAngle > 0 && endAngle < 90 ) {
      		x = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
      		y = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
      		path.arcTo ( x , y ) ;
      	}
      	else if ( endAngle >= 90 ) {
      		x = h + 0 ;
      		y = k + b ;
      		path.arcTo ( x , y ) ;
      	}
      	if ( endAngle > 90 && endAngle < 180 ) {
      		x = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
      		y = k + m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
      		path.arcTo ( x , y ) ;
      	}
      	else if ( endAngle >= 180 ) {
      		x = h - a ;
      		y = k + 0 ;
      		path.arcTo ( x , y ) ;
      	}
      	if ( endAngle > 180 && endAngle < 270 ) {
      		// x < 0 , y < 0 
      		x = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
      		y = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
      		path.arcTo ( x , y ) ;
      	}
      	else if ( endAngle >= 270 ) {
      		x = h + 0 ;
      		y = k - b ;
      		path.arcTo ( x , y ) ;
      	}
      	if ( endAngle > 270 && endAngle < 360 ) {
      		// x > 0 , y < 0 
      		x = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
      		y = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
      		path.arcTo ( x , y ) ;
      	}
      	else if ( endAngle >= 360 ) {
      		x = h + a ;
      		y = k + 0 ;
      		path.arcTo ( x , y ) ;
      	}
      	path.close ( ) ;
      	this.drawSVGPath ( path.getPath() , false ) ;
      
      };
      
      TeXGraph.Canvas.prototype.fillArc = function ( center , a , b , startAngle , endAngle ) {
      	this.drawArc ( center , a , b , startAngle , endAngle , true ) ;
      };
      
      
      TeXGraph.Canvas.prototype.setFont = function ( family , size , style ) {
      	this.canvas.setFont ( family , size , style ) ;
      };
      TeXGraph.Canvas.prototype.drawString = function ( str , x , y ) {
      	var point = this.toWindowCoordinates ( {x:x,y:y} ) ;
      	this.canvas.drawString ( str , point.x , point.y ) ;
      };
      TeXGraph.Canvas.prototype.drawStringRect = function ( str , x , y , width , align ) {
      	var point1 = this.toWindowCoordinates ( {x:x,y:y} ) ;
      	var point2 = this.toWindowCoordinates ( {x:x+width,y:y} ) ;
      	this.canvas.drawStringRect ( str , point1.x , point1.y , Math.abs(point2.x-point1.x) , align ) ;
      };
      
      TeXGraph.Canvas.prototype.drawImage = function ( src , x , y , width , height , handler ) {
      	var point = this.toWindowCoordinates ( {x:x,y:y} ) ;
      	this.canvas.drawImage ( src , parseInt(point.x) , parseInt(point.y) , parseInt(width) , parseInt(height) , handler ) ;
      };
      
      TeXGraph.Canvas.prototype.drawPoint = function ( point , type , fill ) {
      
      	if ( ! point ) { point = [0,0] ; }
      	if ( ! type || (typeof type == "string" && ! type.match(/\+|-|o|\|/)) ) { type = "o" ; }
      	if ( ! fill ) { fill = false ; }
      
      	var x = parseFloat ( point[0] ) ;
      	var y = parseFloat ( point[1] ) ;
      	var radius = TeXGraph.Math.min ( 4*this.xstep , 4*this.ystep ) ;
      
      	if ( type.match(/\+|-|\|/) ) {
      		if ( type.match(/\+/) ) {
      			this.drawLine ( x - radius , y , x + radius , y ) ;
      			this.drawLine ( x , y - radius , x , y + radius ) ;
      		}
      		else if ( type.match(/-/) ) {
      			this.drawLine ( x - radius , y , x + radius , y ) ;
      		}
      		else if ( type.match(/\|/) ) {
      			this.drawLine ( x , y - radius , x , y + radius ) ;
      		}
      	}
      	else {
      		if ( fill == true ) {
      			this.fillCircle ( [x,y] , radius ) ;
      		}
      		else if ( ! fill || fill == false || fill == "false" || fill == "no" ) {
      			this.drawCircle ( [x,y] , radius ) ;
      		}
      	}
      };
      
      TeXGraph.Canvas.prototype.drawArrowHead = function ( point1 , point2 ) {
      
      	var u = [ point2[0] - point1[0] , point2[1] - point1[1] ] ;
      	var d = TeXGraph.Math.sqrt ( TeXGraph.Math.pow(u[0],2) + TeXGraph.Math.pow(u[1],2) ) ;
      	if ( d > 0.00000001 ) {
      		u = [ u[0]/d , u[1]/d ] ;
      
      		var orthU = [ -u[1] , u[0] ] ;
      
      		var X = [] ;
      		var Y = [] ;
      
      		X.push ( point2[0] - 1*u[0] - 0.5*orthU[0] ) ;
      		Y.push ( point2[1] - 1*u[1] - 0.5*orthU[1] ) ;
      
      		X.push ( point2[0] ) ;
      		Y.push ( point2[1] ) ;
      
      		X.push ( point2[0] - 1*u[0] + 0.5*orthU[0] ) ;
      		Y.push ( point2[1] - 1*u[1] + 0.5*orthU[1] ) ;
      
      		this.fillPolygon ( X , Y ) ;
      	}
      };
      
      TeXGraph.Canvas.prototype.drawFunction = function ( indVar , f , min , max , endpoints ) {
      
      	if ( ! indVar || typeof indVar != "string" || !indVar.match(/x|y|r|theta|t/i) ) { indVar = "x" } ;
      	indVar = indVar.toLowerCase ( ) ;
      	indVar = indVar.replace ( /\s*/g , "" ) ;
      
      	if ( ! endpoints ) { endpoints == null ; }
      
      	if ( indVar == "t" ) {
      		if ( f.length != 2 ) {
      			return new TeXGraph.Error ( "parametric plot requires array of 2 functions" , "TeXGraph.Canvas.prototype.drawFunction" ) ;
      		}
      		if ( typeof f[0] == "string" ) {
      			f[0] = TeXGraph.Math.ascii2JS ( f[0] ) ;
      		}
      		if ( typeof f[1] == "string" ) {
      			f[1] = TeXGraph.Math.ascii2JS ( f[1] ) ;
      		}
      	}
      	else if ( typeof f == "string" ) {
      		f = TeXGraph.Math.ascii2JS ( f ) ;
      	}
      
      	var X = new Array ( ) ;
      	var Y = new Array ( ) ;
      	var step = 0 ;
      	switch ( indVar ) {
      
      		case "x" :
      			if ( typeof min != "number" ) { min = this.xmin ; }
      			if ( typeof max != "number" ) { max = this.xmax ; }
      			min = parseFloat ( min ) ;
      			max = parseFloat ( max ) ;
      			step = this.xstep ;
      
      			for ( var x = min ; x < max ; x += step ) {
      				var y ;
      				if ( typeof f == "string" ) {
      					y = eval ( f ) ;
      				}
      				else {
      					y = f ( x ) ;
      				}
      				if ( y >= this.ymin && y <= this.ymax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		case "y" :
      			if ( typeof min != "number" ) { min = this.ymin ; }
      			if ( typeof max != "number" ) { max = this.ymax ; }
      			min = parseFloat ( min ) ;
      			max = parseFloat ( max ) ;
      			step = this.ystep ;
      
      			for ( var y = min ; y < max ; y += step ) {
      				var x ;
      				if ( typeof f == "string" ) {
      					x = eval ( f ) ;
      				}
      				else {
      					x = f ( y ) ;
      				}
      				if ( x >= this.xmin && x <= this.xmax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		case "theta" :
      			if ( typeof min != "number" ) { min = this.thetamin ; }
      			if ( typeof max != "number" ) { max = this.thetamax ; }
      			min = parseFloat ( min ) ;
      			max = parseFloat ( max ) ;
      			step = this.thetastep ;
      			for ( var theta = min ; theta < max ; theta += step ) {
      				var r ;
      				if ( typeof f == "string" ) {
      					r = eval ( f ) ;
      				}
      				else {
      					r = f ( theta ) ;
      				}
      				if ( Math.abs(r) >= this.rmin && Math.abs(r) <= this.rmax ) {
      					X.push ( r * TeXGraph.Math.cos(theta) ) ;
      					Y.push ( r * TeXGraph.Math.sin(theta) ) ;
      				}
      			}
      
      			break ;
      
      		case "r" :
      			if ( typeof min != "number" ) { min = this.rmin ; }
      			if ( typeof max != "number" ) { max = this.rmax ; }
      			min = parseFloat ( min ) ;
      			max = parseFloat ( max ) ;
      			step = this.rstep ;
      
      			//max += step ;
      			for ( var r = min ; r < max ; r += step ) {
      				var theta ;
      				if ( typeof f == "string" ) {
      					theta = eval ( f ) ;
      				}
      				else {
      					theta = f ( r ) ;
      				}
      				if ( theta >= this.thetamin && theta <= this.thetamax ) {
      					X.push ( r * TeXGraph.Math.cos(theta) ) ;
      					Y.push ( r * TeXGraph.Math.sin(theta) ) ;
      				}
      			}
      
      			break ;
      
      		case "t" :
      			if ( typeof min != "number" ) { min = TeXGraph.Math.min(this.xmin,this.ymin) ; }
      			if ( typeof max != "number" ) { max = TeXGraph.Math.max(this.xmax,this.ymax) ; }
      			min = parseFloat ( min ) ;
      			max = parseFloat ( max ) ;
      			step = TeXGraph.Math.min(this.xstep,this.ystep) ;
      
      			for ( var t = min ; t < max ; t += step ) {
      				var x , y ;
      				if ( typeof f[0] == "string" ) {
      					x = eval ( f[0] ) ;
      				}
      				else {
      					x = f[0] ( t ) ;					
      				}
      
      				if ( typeof f[1] == "string" ) {
      					y = eval ( f[1] ) ;
      				}
      				else {
      					y = f[1] ( t ) ;					
      				}
      
      				if ( x >= this.xmin && x <= this.xmax && y >= this.ymin && y <= this.ymax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		default :
      			return new TeXGraph.Warning ( "unrecognized ind. var." , "TeXGraph.Canvas.drawFunction" ) ;
      			break ;
      
      	}
      
      	if ( endpoints != null ) {
      		if ( endpoints.indexOf("<-") != -1 ) { 
      			this.drawArrowHead ( [X[1],Y[1]] , [X[0],Y[0]] ) ;
      		}
      		if ( endpoints.indexOf("->") != -1 ) { 
      			this.drawArrowHead ( [X[X.length-2],Y[Y.length-2]] , [X[X.length-1],Y[Y.length-1]] ) ;
      		}
      		if ( endpoints.indexOf("o-") != -1 ) {
      			this.drawPoint ( [X[0],Y[0]] , "o" , false );
      			X.shift ( ) ; Y.shift ( ) ;
      		}
      		if ( endpoints.indexOf("-o") != -1 ) {
      			this.drawPoint ( [X[X.length-1],Y[Y.length-1]] , "o" , false );
      			X.pop( ) ; Y.pop( ) ;
      		}
      		if ( endpoints.indexOf("*-") != -1 ) {
      			this.drawPoint ( [X[0],Y[0]] , "o" , true );
      		}
      		if ( endpoints.indexOf("-*") != -1 ) {
      			this.drawPoint ( [X[X.length-1],Y[Y.length-1]] , "o" , true );
      		}
      	}
      
      	this.drawPolyLine ( X , Y ) ;
      };
      
      
      TeXGraph.Canvas.prototype.fillBetweenFunctions = function ( indVar , f , min , max ) {
      	if ( ! indVar ) { indVar = [ "x" , "x" ] ; }
      	indVar[0] = indVar[0].replace ( /\s*/g , "" ) ;
      	indVar[1] = indVar[1].replace ( /\s*/g , "" ) ;
      
      	if ( indVar[0] == "t" ) {
      		if ( f[0].length != 2 ) {
      			return new TeXGraph.Error ( "parametric plot requires array of 2 functions" , "TeXGraph.Canvas.prototype.fillBetweenFunctions" ) ;
      		}
      		if ( typeof f[0][0] == "string" ) {
      			f[0][0] = TeXGraph.Math.ascii2JS ( f[0][0] ) ;
      		}
      		if ( typeof f[0][1] == "string" ) {
      			f[0][1] = TeXGraph.Math.ascii2JS ( f[0][1] ) ;
      		}
      
      	}
      	else if ( typeof f[0] == "string" ) {
      		f[0] = TeXGraph.Math.ascii2JS ( f[0] ) ;
      	}
      
      	if ( indVar[1] == "t" ) {
      		if ( f[1].length != 2 ) {
      			return new TeXGraph.Error ( "parametric plot requires array of 2 functions" , "TeXGraph.Canvas.prototype.fillBetweenFunctions" ) ;
      		}
      		if ( typeof f[1][0] == "string" ) {
      			f[1][0] = TeXGraph.Math.ascii2JS ( f[1][0] ) ;
      		}
      		if ( typeof f[1][1] == "string" ) {
      			f[1][1] = TeXGraph.Math.ascii2JS ( f[1][1] ) ;
      		}
      
      	}
      	else if ( typeof f[1] == "string" ) {
      		f[1] = TeXGraph.Math.ascii2JS ( f[1] ) ;
      	}
      	var X = new Array ( ) ;
      	var Y = new Array ( ) ;
      	var step = 0 ;
      
      	indVar[0] = indVar[0].replace ( /\s*/g , "" ) ;
      	switch ( indVar[0] ) {
      
      		case "x" :
      			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
      			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
      			min[0] = parseFloat ( min[0] ) ;
      			max[0] = parseFloat ( max[0] ) ;
      			step = this.xstep ;
      
      			for ( var x = min[0] ; x < max[0] ; x += step ) {
      				var y ;
      				if ( typeof f[0] == "string" ) {
      					y = eval ( f[0] ) ;
      					y = eval ( y ) ;
      				}
      				else {
      					y = f[0] ( x ) ;
      				}
      				if ( y >= this.ymin && y <= this.ymax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		case "y" :
      			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
      			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
      			min[0] = parseFloat ( min[0] ) ;
      			max[0] = parseFloat ( max[0] ) ;
      			step = this.ystep ;
      
      			for ( var y = min[0] ; y < max[0] ; y += step ) {
      				var x ;
      				if ( typeof f[0] == "string" ) {
      					x = eval ( f[0] ) ;
      					x = eval ( x ) ;
      				}
      				else {
      					x = f[0] ( y ) ;
      				}
      				if ( x >= this.xmin && x <= this.xmax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		case "theta" :
      			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
      			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
      			min[0] = parseFloat ( min[0] ) ;
      			max[0] = parseFloat ( max[0] ) ;
      			step = this.thetastep ;
      
      			for ( var theta = min[0] ; theta < max[0] ; theta += step ) {
      				var r ;
      				if ( typeof f[0] == "string" ) {
      					r = eval ( f[0] ) ;
      					r = eval ( r ) ;
      				}
      				else {
      					r = f[0] ( theta ) ;
      				}
      				if ( Math.abs(r) >= this.rmin && Math.abs(r) <= this.rmax ) {
      					X.push ( r * TeXGraph.Math.cos(theta) ) ;
      					Y.push ( r * TeXGraph.Math.sin(theta) ) ;
      				}
      			}
      
      			break ;
      
      		case "r" :
      			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
      			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
      			min[0] = parseFloat ( min[0] ) ;
      			max[0] = parseFloat ( max[0] ) ;
      			step = this.rstep ;
      
      			for ( var r = min[0] ; r < max[0] ; r += step ) {
      				var theta ;
      				if ( typeof f[0] == "string" ) {
      					theta = eval ( f[0] ) ;
      					theta = eval ( theta ) ;
      				}
      				else {
      					theta = f[0] ( r ) ;
      				}
      				if ( theta >= this.thetamin && theta <= this.thetamax ) {
      					X.push ( r * TeXGraph.Math.cos(theta) ) ;
      					Y.push ( r * TeXGraph.Math.sin(theta) ) ;
      				}
      			}
      
      			break ;
      
      		case "t" :
      			if ( typeof min[0] != "number" ) { min[0] = TeXGraph.Math.min(this.xmin,this.ymin) ; }
      			if ( typeof max[0] != "number" ) { max[0] = TeXGraph.Math.max(this.xmax,this.ymax) ; }
      			min[0] = parseFloat ( min[0] ) ;
      			max[0] = parseFloat ( max[0] ) ;
      			step = TeXGraph.Math.min(this.xstep,this.ystep) ;
      
      			for ( var t = min[0] ; t < max[0] ; t += step ) {
      				var x , y ;
      				if ( typeof f[0][0] == "string" ) {
      					x = eval ( f[0][0] ) ;
      				}
      				else {
      					x = f[0][0] ( t ) ;					
      				}
      
      				if ( typeof f[0][1] == "string" ) {
      					y = eval ( f[0][1] ) ;
      				}
      				else {
      					y = f[0][1] ( t ) ;					
      				}
      
      				if ( x >= this.xmin && x <= this.xmax && y >= this.ymin && y <= this.ymax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		default :
      			return new TeXGraph.Warning ( "unrecognized 1st ind. var." , "TeXGraph.Canvas.fillBetweenFunctions" ) ;
      			break ;
      
      	}
      
      	indVar[1] = indVar[1].replace ( /\s*/g , "" ) ;
      	switch ( indVar[1] ) {
      
      		case "x" :
      			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
      			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
      			min[1] = parseFloat ( min[1] ) ;
      			max[1] = parseFloat ( max[1] ) ;
      			step = this.xstep ;
      
      			for ( var x = max[1] ; x > min[1] ; x -= step ) {
      				var y ;
      				if ( typeof f[1] == "string" ) {
      					y = eval ( f[1] ) ;
      					y = eval ( y ) ;
      				}
      				else {
      					y = f[1] ( x ) ;					
      				}
      				if ( y >= this.ymin && y <= this.ymax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		case "y" :
      			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
      			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
      			min[1] = parseFloat ( min[1] ) ;
      			max[1] = parseFloat ( max[1] ) ;
      			step = this.ystep ;
      
      			for ( var y = max[1] ; y > min[1] ; y -= step ) {
      				var x ;
      				if ( typeof f[1] == "string" ) {
      					x = eval ( f[1] ) ;
      					x = eval ( x ) ;
      				}
      				else {
      					x = f[1] ( y ) ;
      				}
      				if ( x >= this.xmin && x <= this.xmax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		case "theta" :
      			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
      			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
      			min[1] = parseFloat ( min[1] ) ;
      			max[1] = parseFloat ( max[1] ) ;
      			step = this.thetastep ;
      
      			for ( var theta = max[1] ; theta > min[1] ; theta -= step ) {
      				var r ;
      				if ( typeof f[1] == "string" ) {
      					r = eval ( f[0] ) ;
      					r = eval ( r ) ;
      				}
      				else {
      					r = f[1] ( theta ) ;					
      				}
      				if ( Math.abs(r) >= this.rmin && Math.abs(r) <= this.rmax ) {
      					X.push ( r * TeXGraph.Math.cos(theta) ) ;
      					Y.push ( r * TeXGraph.Math.sin(theta) ) ;
      				}
      			}
      
      			break ;
      
      		case "r" :
      			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
      			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
      			min[1] = parseFloat ( min[1] ) ;
      			max[1] = parseFloat ( max[1] ) ;
      			step = this.rstep ;
      
      			for ( var r = max[1] ; r > min[1] ; r -= step ) {
      				var theta ;
      				if ( typeof f[1] == "string" ) {
      					theta = eval ( f[1] ) ;
      					theta = eval ( theta ) ;
      				}
      				else {
      					theta = f[1] ( r ) ;					
      				}
      				if ( theta >= this.thetamin && theta <= this.thetamax ) {
      					X.push ( r * TeXGraph.Math.cos(theta) ) ;
      					Y.push ( r * TeXGraph.Math.sin(theta) ) ;
      				}
      			}
      
      			break ;
      
      		case "t" :
      			if ( typeof min[1] != "number" ) { min[1] = TeXGraph.Math.min(this.xmin,this.ymin) ; }
      			if ( typeof max[1] != "number" ) { max[1] = TeXGraph.Math.max(this.xmax,this.ymax) ; }
      			min[1] = parseFloat ( min[1] ) ;
      			max[1] = parseFloat ( max[1] ) ;
      			step = TeXGraph.Math.min(this.xstep,this.ystep) ;
      
      			for ( var t = min[1] ; t < max[1] ; t += step ) {
      				var x , y ;
      				if ( typeof f[1][0] == "string" ) {
      					x = eval ( f[1][0] ) ;
      				}
      				else {
      					x = f[1][0] ( t ) ;
      				}
      
      				if ( typeof f[1][1] == "string" ) {
      					y = eval ( f[1][1] ) ;
      				}
      				else {
      					y = f[1][1] ( t ) ;	
      				}
      
      				if ( x >= this.xmin && x <= this.xmax && y >= this.ymin && y <= this.ymax ) {
      					X.push ( x ) ;
      					Y.push ( y ) ;
      				}
      			}
      
      			break ;
      
      		default :
      			return new TeXGraph.Warning ( "unrecognized 2nd ind. var." , "TeXGraph.Canvas.fillBetweenFunctions" ) ;
      			break ;
      
      	}
      
      	this.fillPolygon ( X , Y ) ;
      };
      
      
      
      
      TeXGraph.Canvas.prototype.drawFunctionOfX = function ( f , xmin , xmax , ymin , ymax ) {
      
      	if ( typeof xmin != "number" ) { xmin = this.xmin ; }
      	if ( typeof xmax != "number" ) { xmax = this.xmax ; }
      	if ( typeof ymin != "number" ) { ymin = this.ymin ; }
      	if ( typeof ymax != "number" ) { ymax = this.ymax ; }
      
      	xmin = parseFloat ( xmin ) ;
      	xmax = parseFloat ( xmax ) ;
      	ymin = parseFloat ( ymin ) ;
      	ymax = parseFloat ( ymax ) ;
      
      	var X = new Array ( ) ;
      	var Y = new Array ( ) ;
      	for ( var x = xmin+this.xstep ; x <= xmax ; x += this.xstep ) {
      
      		var y ;
      		if ( typeof f == "string" ) {
      			y = eval ( TeXGraph.Math.ascii2JS ( f ) ) ;
      		}
      		else {
      			y = f ( x ) ;					
      		}
      		if ( y >= ymin && y <= ymax ) {
      			X.push ( x ) ;
      			Y.push ( y ) ;
      		}
      	}
      	this.drawPolyLine ( X , Y ) ;
      };
      
      TeXGraph.Canvas.prototype.fillBetweenFunctionsOfX = function ( topF , bottomF , xmin , xmax , ymin , ymax ) {
      
      	if ( typeof xmin != "number" ) { xmin = this.xmin ; }
      	if ( typeof xmax != "number" ) { xmax = this.xmax ; }
      	if ( typeof ymin != "number" ) { ymin = this.ymin ; }
      	if ( typeof ymax != "number" ) { ymax = this.ymax ; }
      
      	xmin = parseFloat ( xmin ) ;
      	xmax = parseFloat ( xmax ) ;
      	ymin = parseFloat ( ymin ) ;
      	ymax = parseFloat ( ymax ) ;
      
      	var X = new Array ( ) ;
      	var Y = new Array ( ) ;
      	for ( var x = xmin+this.xstep ; x <= xmax ; x += this.xstep ) {
      
      		var y ;
      		if ( typeof topF == "string" ) {
      			y = eval ( TeXGraph.Math.ascii2JS ( topF ) ) ;
      		}
      		else {
      			y = topF ( x ) ;
      		}
      		if ( y >= ymin && y <= ymax ) {
      			X.push ( x ) ;
      			Y.push ( y ) ;
      		}
      	}
      
      	for ( var x = xmax ; x >= xmin ; x -= this.xstep ) {
      
      		var y ;
      		if ( typeof bottomF == "string" ) {
      			y = eval ( TeXGraph.Math.ascii2JS ( bottomF ) ) ;
      		}
      		else {
      			y = bottomF ( x ) ;
      		}
      		if ( y >= ymin && y <= ymax ) {
      			X.push ( x ) ;
      			Y.push ( y ) ;
      		}
      	}
      
      	this.fillPolygon ( X , Y ) ;
      };
      
      TeXGraph.Canvas.prototype.drawArcOfCircle = function ( center , radius , startAngle , endAngle ) {
      	var h = center[0] ;
      	var k = center[1] ;
      	startAngle = startAngle * Math.PI / 180 ;
      	endAngle = endAngle * Math.PI / 180 ;
      	var X = new Array ( ) ;
      	var Y = new Array ( ) ;
      	for ( var theta = startAngle ; theta <= endAngle ; theta += this.thetastep ) {
      		var x = radius * Math.cos ( theta ) + h ;
      		var y = radius * Math.sin ( theta ) + k ;
      		if ( y >= this.ymin && y <= this.ymax && x >= this.xmin && x <= this.xmax ) {
      			X.push ( x ) ;
      			Y.push ( y ) ;
      		}
      	}
      	this.drawPolyLine ( X , Y ) ;
      };
      
      TeXGraph.Canvas.prototype.drawCircle = function ( center , radius , startAngle , endAngle ) {
      	if ( startAngle != null && endAngle != null ) {
      	}
      	else {
      		var h = center[0] ;
      		var k = center[1] ;
      		var r = radius ;
      		var path = new TeXGraph.SVGPath ( ) ;
      		path.moveTo ( h + r , k + 0 ) ; 
      		path.arcTo ( h + 0 , k + r ) ; 
      		path.arcTo ( h - r , k - 0 ) ; 
      		path.arcTo ( h - 0 , k - r ) ;
      		path.close ( ) ;
      		this.drawSVGPath ( path.getPath() , false ) ;
      	}
      };
      
      TeXGraph.Canvas.prototype.fillCircle = function ( center , radius , startAngle , endAngle ) {
      	if ( startAngle != null && endAngle != null ) {
      	}
      	else {
      		var h = center[0] ;
      		var k = center[1] ;
      		var r = radius ;
      		var path = new TeXGraph.SVGPath ( ) ;
      		var path = new TeXGraph.SVGPath ( ) ;
      		path.moveTo ( h + r , k + 0 ) ; 
      		path.arcTo ( h + 0 , k + r ) ; 
      		path.arcTo ( h - r , k - 0 ) ; 
      		path.arcTo ( h - 0 , k - r ) ;
      		path.close ( ) ;
      		this.drawSVGPath ( path.getPath() , true ) ;
      	}
      };
      
      TeXGraph.Canvas.prototype.drawVerticalLine = function ( point ) {
      	var x = point[0] ;
      	this.drawLine ( x , this.ymin , x , this.ymax ) ;
      };
      
      TeXGraph.Canvas.prototype.drawHorizontalLine = function ( point ) {
      	var y = point[1] ;
      	this.drawLine ( this.xmin , y , this.xmax , y ) ;
      };
      
      TeXGraph.Canvas.prototype.drawAxes = function ( ) {
      	if ( this.ymin <= 0 && this.ymax >= 0 ) {
      		this.drawHorizontalLine ( [0,0] ) ;
      	}
      	if ( this.xmin <= 0 && this.xmax >= 0 ) {
      		this.drawVerticalLine ( [0,0] ) ;
      	}
      };

      TeXGraph.Canvas.prototype.drawGrid = function ( type ) {
      	if ( ! type ) { type = "rect" ; }
      	type = type.toLowerCase ( ) ;
      	if ( type == "rect" || type == "rectangle" ) {
      		for ( var x = 0 ; x >= this.xmin ; x -= this.xscale ) {
      			this.drawVerticalLine ( [x,0] ) ;
      		}
      		for ( var x = this.xscale ; x <= this.xmax ; x += this.xscale ) {
      			this.drawVerticalLine ( [x,0] ) ;
      		}
      		for ( var y = 0 ; y >= this.ymin ; y -= this.yscale ) {
      			this.drawHorizontalLine ( [0,y] ) ;
      		}
      		for ( var y = this.yscale ; y <= this.ymax ; y += this.yscale ) {
      			this.drawHorizontalLine ( [0,y] ) ;
      		}
      	}
      	else if ( type == "polar" ) {
      		for ( var r = this.rscale ; r <= this.rmax ; r += this.rscale ) {
      			this.drawCircle ( [0,0] , r ) ;
      		}
      		for ( var theta = 0 ; theta < 2 * TeXGraph.Math.pi ; theta += this.thetascale ) {
      			theta = TeXGraph.Math.chop ( theta , 4 ) ;
      			this.drawLine ( 0 , 0 , this.rmax * TeXGraph.Math.cos(theta) , this.rmax * TeXGraph.Math.sin(theta) ) ;
      		}
      	}
      };
      
      TeXGraph.Canvas.prototype.drawBorder = function ( ) {
      	this.drawRect ( this.xmin , this.ymin , (this.xmax-this.xmin) , (this.ymax-this.ymin) ) ;
      };
      
      TeXGraph.Canvas.prototype.drawAxesLabels = function ( xLabel , yLabel ) {
      	if ( xLabel == null ) {
      		xLabel = "x" ;
      	}
      	if ( yLabel == null ) {
      		yLabel = "y" ;
      	}
      	this.drawString ( xLabel , this.xmax + this.xstep , 0 ) ;
      	this.drawString ( yLabel , 0 , this.ymax + this.ystep ) ;
      };
      
      TeXGraph.Canvas.prototype.drawTickMarks = function ( label ) {
      	if ( ! label ) {
      		label = false ;
      	}
      	if ( typeof label != "boolean" ) {
      		new TeXGraph.Error ( "Needs a boolean or null argument." , "TeXGraph.Canvas.prototype.drawTickMarks" ) ;
      	}
      	for ( var x = 0 ; x >= this.xmin ; x -= this.xscale ) {
      		this.drawPoint ( [x,0] , "|" ) ;
      		if ( label && x != 0 ) {
      			this.drawString ( x  , x - 0.5 * this.xscale , 0 - 0.25 * this.yscale ) ;
      		}
      	}
      	for ( var x = this.xscale ; x <= this.xmax ; x += this.xscale ) {
      		this.drawPoint ( [x,0] , "|" ) ;
      		if ( label && x != 0 ) {
      			this.drawString ( x  , x - 0.3 * this.xscale , 0 - 0.25 * this.yscale ) ;
      		}
      	}
      	for ( var y = 0 ; y >= this.ymin ; y -= this.yscale ) {
      		this.drawPoint ( [0,y] , "-" ) ;
      		if ( label && y != 0 ) {
      			this.drawString ( y  , -this.xscale , y + 0.25 * this.yscale ) ;
      		}
      	}
      	for ( var y = this.yscale ; y <= this.ymax ; y += this.yscale ) {
      		this.drawPoint ( [0,y] , "-" ) ;
      		if ( label && y != 0 ) {
      			this.drawString ( y  , -this.xscale , y + 0.25 * this.yscale ) ;
      		}
      	}
      };
      
      TeXGraph.Canvas.prototype.drawHistogram = function ( list , numClasses , fill , relFreq ) {
      
      	if ( list.type != TeXGraph.DataList.Quantitative ) { return ; }
      	if ( ! relFreq ) { relFreq = false ; }
      	if ( ! fill ) { fill = false ; }
      	if ( numClasses < 2 ) { numClasses = 2 ; }
      	var classWidth = TeXGraph.Math.ceil ( ( list.max - list.min ) / numClasses ) ;	
      	if ( list.max - list.min < 1 ) {
      		classWidth = ( list.max - list.min ) / numClasses ;
      	}
      
      	var lowerLimits = new Array ( ) ;
      	var upperLimits = new Array ( ) ;
      	for ( var x = list.min ; x < list.max ; x += classWidth ) {
      		lowerLimits.push ( x ) ;
      		upperLimits.push ( x + classWidth - 1 ) ;
      	}
      
      	var step = ( lowerLimits[1] - upperLimits[0] ) / 2 ;
      	for ( var i = 0 ; i < lowerLimits.length ; i++ ) {
      
      		var lower = lowerLimits[i] ;
      		var upper = upperLimits[i] ;
      		var mid = lower + ( upper - lower ) / 2 ;
      		var height ;
      		if ( fill ) {
      			if ( relFreq ) {
      				height = list.freq ( lower - step , upper + step ) / list.sampleSize ;
      			}
      			else {
      				height = list.freq ( lower - step , upper + step ) ;
      			}
      			this.fillRect ( lower - step , 0 , classWidth , height ) ;
      		}
      		else {
      			if ( relFreq ) {
      				height = list.freq ( lower - step , upper + step ) / list.sampleSize ;
      			}
      			else {
      				height = list.freq ( lower - step , upper + step ) ;
      			}
      			this.drawRect ( lower - step , 0 , classWidth , height ) ;
      		}
      
      		if ( relFreq ) {
      			this.drawString ( TeXGraph.Math.chop(height,2) , mid - 4*step , height + 20 * this.ystep ) ;
      		}
      		else {
      			this.drawString ( height , mid - 2*step , height + 20 * this.ystep ) ;
      		}
      		this.drawString ( lower - step , lower - 3*step , -10 * this.ystep ) ;
      	}
      	var upper = upperLimits[upperLimits.length-1] ;
      	this.drawString ( upper + step , upper - 3*step , -10 * this.ystep ) ;
      
      	if ( relFreq ) {
      		for ( var y = 0 ; y <= this.ymax ; y += this.yscale ) {
      			this.drawString ( TeXGraph.Math.chop(y+0.005,2)  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
      		}
      		for ( var y = -this.yscale ; y >= this.ymin ; y -= this.yscale ) {
      			this.drawString ( TeXGraph.Math.chop(y+0.005,2)  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
      		}
      	}
      	else {
      		for ( var y = 0 ; y <= this.ymax ; y += this.yscale ) {
      			this.drawString ( y  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
      		}
      		for ( var y = -this.yscale ; y >= this.ymin ; y -= this.yscale ) {
      			this.drawString ( y  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
      		}
      	}
      	for ( var x = 0 ; x <= this.xmax ; x += this.xscale ) {
      		this.drawString ( x  , x - 5 * this.xstep , -30 * this.ystep ) ;
      	}
      	for ( var x = - this.xscale ; x >= this.xmin ; x -= this.xscale ) {
      		this.drawString ( x  , x - 8 * this.xstep , -30 * this.ystep ) ;
      	}
      };
      TeXGraph.Canvas.prototype.drawSymbol = function ( name , anchor , xFactor , yFactor , rotate , scewX ) {
      	if ( ! anchor ) anchor = [0,0] ;
      	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;	
      	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;
      	if ( ! rotate || typeof rotate != "number" ) rotate = 0 ;
      	if ( ! scewX || typeof scewX != "number" ) scewX = 0 ;
      	TeXGraph.SVGPath.clearTransforms ( ) ;
      	TeXGraph.SVGPath.addTransform ( {op:TeXGraph.SVGPath.SCEWX,theta:scewX,measure:TeXGraph.SVGPath.DEGREES} ) ;	// scew before translating
      	TeXGraph.SVGPath.addTransform ( {op:TeXGraph.SVGPath.SCALE,fx:xFactor,fy:yFactor} ) ;				// scale before translating
      	TeXGraph.SVGPath.addTransform ( {op:TeXGraph.SVGPath.TRANSLATE,dx:anchor[0],dy:anchor[1]} ) ;
      	TeXGraph.SVGPath.addTransform ( {op:TeXGraph.SVGPath.ROTATE,angle:rotate,measure:TeXGraph.SVGPath.DEGREES,point:[anchor[0],anchor[1]]} ) ;
      
      	var symbol = TeXGraph.Symbol.getSymbol ( name ) ;
      	var commands = symbol.drawCommands ;
      	commands = commands.replace ( /\s/g , "" ) ;
      	if ( ! commands.match(/svg/) ) {
      		return new TeXGraph.Error ( "Expecting an svg command." , "TeXGraph.Canvas.prototype.drawSymbol" ) ;
      	}
      	var fill = false ;
      
      	var str = "" + commands ;
      	var svgIndex = 0 ;
      	var lastIndex = 0 ;
      	while ( (svgIndex=str.indexOf("svg("),lastIndex) != -1 ) {
      		if ( ! str.match(/svg\(/) ) { break ; }
      		var tmp = "this.drawSVGPath(\"" ;
      		var endIndex = str.indexOf ( ");" , svgIndex ) ;
      		if ( endIndex == -1 ) {
      			return new TeXGraph.Error ( "Missing closing );" , "TeXGraph.Canvas.prototype.drawSymbol" ) ;
      		}
      		tmp += str.substring ( svgIndex + 4 , endIndex ) ;
      
      		tmp += "\", fill );" ;
      		str = str.substring ( 0 , svgIndex ) + tmp + str.substring ( endIndex + 2 ) ;
      		lastIndex = svgIndex + tmp.length ;
      	}
      	eval ( str ) ;
      	TeXGraph.SVGPath.clearTransforms ( ) ;
      
      };
      
      TeXGraph.Canvas.prototype.drawSymbolString = function ( str , anchor , xFactor , yFactor , rotate , scewX ) {
      
      	if ( ! str || str == "" ) {
      		return new TeXGraph.Warning ( "str is null or empty" , "TeXGraph.Canvas.prototype.drawSymbolString()" ) ;
      	}
      
      	if ( ! anchor ) anchor = [0,0] ;
      	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;	
      	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;	
      	if ( ! rotate || typeof rotate != "number" ) rotate = 0 ;
      	if ( ! scewX || typeof scewX != "number" ) scewX = 0 ;
      
      	while ( str.length > 0 ) {
      		var name = TeXGraph.Symbol.getMaximalSymbolName ( str ) ;
      		if ( ! name ) { name = "" ; }
      		this.drawSymbol ( name , anchor , xFactor , yFactor , rotate , scewX ) ;
      		var symbol = TeXGraph.Symbol.getSymbol ( name ) ;
      		if ( name == "" ) { str = str.slice(1) ; }
      		else { str = str.slice(name.length) ; }
      		anchor[0] += symbol.getWidth ( xFactor ) + TeXGraph.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
      	}
      };
      
      TeXGraph.Canvas.prototype.drawSymbolChars = function ( str , anchor , xFactor , yFactor , rotate , scewX ) {
      
      	if ( ! str || str == "" ) {
      		return new TeXGraph.Warning ( "str is null or empty" , "TeXGraph.Canvas.prototype.drawSymbolChars()" ) ;
      	}
      
      	if ( ! anchor ) anchor = [0,0] ;
      	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;	
      	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;	
      	if ( ! rotate || typeof rotate != "number" ) rotate = 0 ;
      	if ( ! scewX || typeof scewX != "number" ) scewX = 0 ;
      
      	for ( var i = 0 ; i < str.length ; i++ ) {
      		var ch = str.charAt(i) ;
      		if ( ch.match(/\s/) ) {
      			anchor = [ anchor[0] + TeXGraph.Symbol.getSpaceWidth(xFactor) , anchor[1] ] ;
      		}
      		else {
      			this.drawSymbol ( ch , anchor , xFactor , yFactor , rotate , scewX ) ;
      			var symbol = TeXGraph.Symbol.getSymbol ( name ) ;
      			anchor[0] += symbol.getWidth ( xFactor ) + TeXGraph.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
      		}
      	}
      };
      
      TeXGraph.Canvas.prototype.drawAllSymbols = function ( anchor , xFactor , yFactor ) {
      	if ( ! anchor ) anchor = [-10,7] ;
      	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
      	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;
      	var names = TeXGraph.Symbol.SymbolNames ;
      	var tmp = anchor [ 0 ] ;
      	for ( var i = 0 ; i < names.length ; i++ ) {
      		this.drawString ( names[i] , anchor[0] + 5 , anchor[1] ) ;
      		this.drawSymbolString ( names[i] , anchor , xFactor , yFactor ) ;
      		anchor[0] = tmp ;
      		anchor[1] -= ( 6 + 0.5) * yFactor ;
      	}
      };
      
      TeXGraph.Canvas.getCanvasByWindowId = function ( id ) {
      
      	var canvases = TeXGraph.Canvas.Canvases ;
      	for ( var i = 0 ; i < canvases.length ; i++ ) {
      		var canvas = canvases[i] ;
      		if ( canvas.window.id == id ) {
      			return canvas ;
      		}
      	}
      	return new TeXGraph.Error ( "No canvas found for window id " + id + "." , "TeXGraph.Canvas.getCanvasByWindowId" ) ;
      };
      
      TeXGraph.Canvas.getMouseCoordOnCanvas = function ( event , windowId ) {
      	event = TeXGraph.Util.fixEvent ( event ) ;
      	var canvas = TeXGraph.Canvas.getCanvasByWindowId ( windowId ) ;
      	var w = canvas.window ;
      
      	var point = TeXGraph.Util.getMouseCoordByEventAndHtmlElementId ( event , windowId ) ;
      	var windowX = point.x ;
      	var windowY = point.y ;
      
      	var x = (canvas.xmax-canvas.xmin) * (windowX-0)/w.width + canvas.xmin ;
      	var y = (canvas.ymax-canvas.ymin) * (0-windowY)/w.height - canvas.ymin ;
      	return {x:x,y:y} ;
      };
      
      TeXGraph.Canvas.displayCoordOnCanvas = function ( event , windowId ) {
      
      	if ( ! TeXGraph.Canvas.DisplayCoordinates ) { return ; }
      	event = TeXGraph.Util.fixEvent ( event ) ;
      	var canvas = TeXGraph.Canvas.getCanvasByWindowId ( windowId ) ;
      	var w = canvas.window ;
      	var point = TeXGraph.Canvas.getMouseCoordOnCanvas ( event , windowId ) ;
      	var input = "(x="+point.x.toFixed(2)+",y="+point.y.toFixed(2)+")" ;
      	var color = canvas.canvas.color ;
      	canvas.setColor ( canvas.bgcolor ) ;
      	var xFactor = 0.5 ;
      	var yFactor = 0.5 ;
      	canvas.fillRect ( canvas.xmin , canvas.ymin-1-(TeXGraph.Symbol.maxAscent+TeXGraph.Symbol.maxDescent)*yFactor , canvas.xmax-canvas.xmin , TeXGraph.Symbol.maxAscent*yFactor + 1 ) ;
      	canvas.setColor ( color ) ;
      	canvas.drawSymbolString ( input , [canvas.xmin , canvas.ymin-1-TeXGraph.Symbol.maxAscent*yFactor] , xFactor , yFactor ) ;
      	canvas.paint ( ) ;
      };
      
      TeXGraph.Canvas.recordSVGPath = function ( event , windowId ) {
      	event = TeXGraph.Util.fixEvent ( event ) ;
      	var canvas = TeXGraph.Canvas.getCanvasByWindowId ( windowId ) ;
      	var w = canvas.window ;
      	var point = TeXGraph.Canvas.getMouseCoordOnCanvas ( event , windowId ) ;
      	var x = point.x.toFixed(2) ;
      	var y = point.y.toFixed(2) ;
      
      	var index = TeXGraph.Canvas.SVGPathRecorder.length ;
      	TeXGraph.Canvas.SVGPathRecorder[index] = "" ;
      	if ( event.type == "mousedown" ) {
      		TeXGraph.Canvas.SVGPathRecorder[index] += "M" + x + "," + y + " " ;
      	}
      	if ( event.type == "mouseover" && event.shiftKey ) {
      		TeXGraph.Canvas.SVGPathRecorder[index] += "L" + x + "," + y + " " ;
      	}
      	if ( event.type == "mouseup" ) {
      		TeXGraph.Canvas.SVGPathRecorder[index] += "L" + x + "," + y + " " ;
      		var tmp = "" ;
      		for ( var i = 0 ; i < TeXGraph.Canvas.SVGPathRecorder.length ; i++ ) {
      			tmp += TeXGraph.Canvas.SVGPathRecorder[i] ;
      		}
      		canvas.drawSVGPath ( tmp ) ;
      		canvas.paint ( ) ;
      	}
      };
      
      TeXGraph.Canvas.showSVGPathRecorder = function ( event , windowId ) {
      	event = TeXGraph.Util.fixEvent ( event ) ;
      	var tmp = "" ;
      	for ( var i = 0 ; i < TeXGraph.Canvas.SVGPathRecorder.length ; i++ ) {
      		tmp += TeXGraph.Canvas.SVGPathRecorder[i] ;
      	}
      	alert ( tmp ) ;
      };
 
       TeXGraph.Vector = function ( xx , yy , zz ) {
      	this.x = xx ;
      	this.y = yy ;
      	this.z = zz ;
      };

      TeXGraph.Vector.prototype.Add = function ( vv ) {
      	this.x += vv.x ;
      	this.y += vv.y ;
      	this.z += vv.z ;
      
      };
      TeXGraph.Vector.prototype.Zoom = function ( ff ) {
      	this.x *= ff ;
      	this.y *= ff ;
      	this.z *= ff ;
      
      };
      TeXGraph.Vector.prototype.Normalize = function ( ) {
      	var ll = 0 ;
      	ll += this.x * this.x ;
      	ll += this.y * this.y ;
      	ll += this.z * this.z ;
      	if ( ll > 0.0 ) {
      
      		ll = TeXGraph.Math.sqrt ( ll ) ;
      		this.x /= ll ;
      		this.y /= ll ;
      		this.z /= ll ;
      	}
      	else {
      		this.x = 1.0 ;
      	}
      
      };

      TeXGraph.Scene3D = function ( aParentObj , azIndex , aWidth , aHeight ) {
      	this.Parent = aParentObj ;
      	this.BoundingBox = null ;
      	this.Poly = new Array ( ) ;
      	this.PolyRank = new Array ( ) ;
      	this.Shape = new Array ( ) ;
      	this.zIndex = azIndex ;
      	this.Center = new TeXGraph.Vector ( 0.0 , 0.0 , 0.0 ) ;
      	this.Zoom = new TeXGraph.Vector ( 1.0 , 1.0 , 1.0 ) ;
      	this.OrderWeight = new TeXGraph.Vector ( 1.0 , 1.0 , 1.0 ) ;
      	this.ZoomAll = 1.0 ;
      	this.ShiftX = 0.0 ;
      	this.ShiftY = 0.0 ;
      	this.XM = aWidth / 2 ;
      	this.YM = aHeight / 2 ;
      	this.Dist = 1000.0 ;
      	this.Viewer = new TeXGraph.Vector ( 1000.0 , 0.0 , 0.0 ) ;
      	this.Th = 0.0 ;
      	this.Fi = 0.0 ;
      	this.DiffuseLight = 0.5 ;
      	this.Light = new TeXGraph.Vector ( 1.0 , 0.0 , 0.0 ) ;
      	this.ThLight = 0.0 ;
      	this.FiLight =0.0 ;
      	this.sin_Th = 0.0 ;
      	this.cos_Th = 1.0 ;
      	this.sin_Fi = 0.0 ;
      	this.cos_Fi = 1.0 ;
      	this.cos_Fi_sin_Th = 0.0 ;
      	this.sin_Fi_sin_Th = 0.0 ;
      	this.cos_Fi_cos_Th = 1.0 ;
      	this.sin_Fi_cos_Th = 0.0 ;
      	this.LightTh = 0.0 ;
      	this.LightFi = 0.0 ;
      	this.Callback = new Array ( ) ;
      	this.LHS = false ;
      	this.Init ( ) ;
      	return ( this ) ;
      };
      TeXGraph.Scene3D.prototype.Init = function ( ) {};
      TeXGraph.Scene3D.prototype.ChangeViewer = function ( ddTh , ddFi ) {
      	var pi_d_180 = Math.PI / 180 ;
      	this.Th += ddTh ;			// this replaces the conditional above
      	this.Fi += ddFi ;
      	while ( this.Fi < 0.0 ) this.Fi += 360.0 ;
      	while ( this.Fi>=360.0 ) this.Fi -= 360.0 ;
      	this.sin_Th = Math.sin ( this.Th * pi_d_180 ) ;
      	this.cos_Th = Math.cos ( this.Th * pi_d_180 ) ;
      	this.sin_Fi = Math.sin ( this.Fi * pi_d_180 ) ;
      	this.cos_Fi = Math.cos ( this.Fi * pi_d_180 ) ;
      	this.cos_Fi_sin_Th = this.cos_Fi * this.sin_Th ;
      	this.sin_Fi_sin_Th = this.sin_Fi * this.sin_Th ;
      	this.cos_Fi_cos_Th = this.cos_Fi * this.cos_Th ;
      	this.sin_Fi_cos_Th = this.sin_Fi * this.cos_Th ;
      	this.Viewer.x = this.Center.x + this.cos_Fi_cos_Th * this.Dist ;
      	this.Viewer.y = this.Center.y - this.sin_Fi_cos_Th * this.Dist ;
      	this.Viewer.z = this.Center.z - this.sin_Th * this.Dist ;
      
      };
      
      TeXGraph.Scene3D.prototype.ChangeLight = function ( ddTh , ddFi ) {
      	var pi_d_180 = Math.PI / 180 ;
      	if ( ( this.ThLight + ddTh >= -89.0 ) && ( this.ThLight + ddTh <= 89.0 ) ) {
      		this.ThLight += ddTh ;
      	}
      	this.FiLight += ddFi ;
      	if ( this.ThLight < -89.0 ) this.ThLight = -89.0 ;
      	if ( this.ThLight > 89.0 ) this.ThLight = 89.0 ;
      	while ( this.FiLight <0.0 ) this.FiLight += 360.0 ;
      	while ( this.FiLight >= 360.0 ) this.FiLight -= 360.0 ;
      	this.Light.x = Math.cos ( this.FiLight * pi_d_180 ) * Math.cos ( this.ThLight * pi_d_180 ) ;
      	this.Light.y =- Math.sin ( this.FiLight * pi_d_180 ) * Math.cos ( this.ThLight * pi_d_180 ) ;
      	this.Light.z =- Math.sin ( this.ThLight * pi_d_180 ) ;
      };
      
      TeXGraph.Scene3D.prototype.AddPoly = function ( oo ) {
      	var ii = this.Poly.length ;
      	this.Poly[ii] = oo ;
      	this.PolyRank[ii] = new Array ( ii , 0 ) ;
      };
      
      TeXGraph.Scene3D.prototype.AutoCenter = function ( ) {
      	var ii, jj, vv, xxmin, xxmax, yymin, yymax, zzmin, zzmax ;
      	var ll = this.Poly.length ;
      	this.Center.Zoom ( 0.0 ) ;
      	for ( ii=0 ; ii < ll ; ii++ ) {
      		this.Center.Add ( this.Poly[ii].Center ) ;
      	}
      	if ( ll > 0 ) this.Center.Zoom ( 1.0 / ll ) ;
      	xxmin = this.Center.x ;
      	xxmax = this.Center.x ;
      	yymin = this.Center.y ;
      	yymax = this.Center.y ;
      	zzmin = this.Center.z ;
      	zzmax = this.Center.z ;
      	for ( ii = 0 ; ii < ll ; ii++ ) {
      		for ( jj = 0 ; jj < this.Poly[ii].Point.length ; jj++ ) {
      			vv = this.Poly[ii].Point[jj] ;
      			if ( xxmin > vv.x ) xxmin = vv.x ;
      			if ( xxmax < vv.x ) xxmax = vv.x ;
      			if ( yymin > vv.y ) yymin = vv.y ;
      			if ( yymax < vv.y ) yymax = vv.y ;
      			if ( zzmin > vv.z ) zzmin = vv.z ;
      			if ( zzmax < vv.z ) zzmax = vv.z ;
      		}
      	}
      
      
      	xxmax -= xxmin ;
      	yymax -= yymin ;
      	zzmax -= zzmin ;
      
      	vv = xxmax*xxmax + yymax*yymax + zzmax*zzmax ;
      
      	if ( vv > 0.0 ) ll = Math.sqrt ( vv ) ;
      	else ll = 19.0 ;
      
      	if ( this.XM < this.YM ) this.ZoomAll = 1.6 * this.XM / ll ;
      	else this.ZoomAll = 1.6 * this.YM / ll ;
      
      	this.Dist = 2 * ll ;
      	this.ChangeViewer ( 0 , 0 ) ;
      
      };
      
      TeXGraph.Scene3D.prototype.ScreenPos = function ( vv ) {
      	if ( ! vv ) vv = new TeXGraph.Vector ( 0 , 0 , 0 ) ;
      
      	nn = new TeXGraph.Vector ( 0 , 0 , 0 ) ;
      
      	nn.x = this.sin_Fi * ( vv.x - this.Center.x ) + this.cos_Fi * ( vv.y - this.Center.y ) ;
      	nn.y = -this.cos_Fi_sin_Th * ( vv.x - this.Center.x ) + this.sin_Fi_sin_Th * ( vv.y - this.Center.y ) - this.cos_Th * ( vv.z - this.Center.z ) ;
      	nn.z = this.cos_Fi_cos_Th * ( vv.x - this.Center.x ) - this.sin_Fi_cos_Th * ( vv.y - this.Center.y ) - this.sin_Th * ( vv.z - this.Center.z ) ;
      
      	if ( this.Dist > 0.0 ) {
      		nn.x *= this.Dist / ( this.Dist - nn.z ) ;
      		nn.y *= this.Dist / ( this.Dist - nn.z ) ;
      	}
      	nn.Zoom ( this.ZoomAll ) ;
      	nn.x += this.XM + this.ShiftX ;
      	nn.y += this.YM + this.ShiftY ;
      
      	return (nn) ;
      
      };
      
      TeXGraph.Scene3D.prototype.Sort = function ( ) {
      
      	var ii, ll=this.Poly.length, xx, yy, zz;
      
      	if ( this.Dist == 0.0 ) {
      
      		for ( ii = 0 ; ii < ll ; ii++ ) {
      
      			this.PolyRank[ii][0] = ii ;
      			this.PolyRank[ii][1] = this.cos_Fi_cos_Th * this.Poly[ii].Center.x * this.OrderWeight.x
      						-this.sin_Fi_cos_Th * this.Poly[ii].Center.y * this.OrderWeight.y
      						-this.sin_Th * this.Poly[ii].Center.z * this.OrderWeight.z ;
      		}
      	}
      	else {
      
      		for ( ii = 0 ; ii < ll ; ii++ ) {
      
      			this.PolyRank[ii][0] = ii ;
      			xx = this.Poly[ii].Center.x * this.OrderWeight.x - this.Viewer.x ;
      			yy = this.Poly[ii].Center.y * this.OrderWeight.y - this.Viewer.y ;
      			zz = this.Poly[ii].Center.z * this.OrderWeight.z - this.Viewer.z ;
      			this.PolyRank[ii][1] = -xx*xx - yy*yy - zz*zz ;
      		}
      	}
      
      	this.PolyRank.sort ( TeXGraph.Scene3D.RankSort ) ;
      
      
      };
      TeXGraph.Scene3D.RankSort = function ( ll , rr ) {
      	if ( ll[1] > rr[1] ) return ( 1 ) ;
      	return ( -1 ) ;
      };
      
      TeXGraph.Scene3D.prototype.Draw = function ( ) {
      
      	var ii ;
      	var ll = this.Poly.length ;
      	this.Light.Normalize ( ) ;
      
      	for ( ii = 0 ; ii < ll ; ii++ ) {
      		this.Poly[ this.PolyRank[ii][0] ].Draw ( ) ;
      	}
      	if ( this.BoundingBox ) this.BoundingBox.Draw ( ) ;
      
      };
      
      TeXGraph.Scene3D.prototype.Delete = function ( ) {
      	var ii, nn, ss ;
      	this.Parent.clear ( ) ;
      
      	this.BoundingBox = null ;
      	this.Poly.length = 0 ;
      	this.PolyRank.length = 0 ;
      	this.Shape.length = 0 ;
      	this.Callback.length = 0 ;  
      
      };
      
      TeXGraph.Scene3D.prototype.ZoomUpdate = function ( ) {
      
      	var ii ;
      	var ll = this.Poly.length ;
      
      	for ( ii = 0 ; ii < ll ; ii++ ) {
      		this.Poly[ii].ZoomUpdate ( ) ;
      	}
      
      };
      
      TeXGraph.Scene3D.prototype.GetColor = function ( cc0 , cc1 , nn , pp ) {
      
      	var rr, gg, bb, hh = "0123456789abcdef" ;
      	var zz, vv ;
      
      	if ( this.Dist == 0.0 ) {
      		zz = -this.cos_Fi_cos_Th * nn.x + this.sin_Fi_cos_Th * nn.y + this.sin_Th * nn.z ;
      	}
      	else {
      		zz = ( pp.x - this.Viewer.x ) * nn.x + ( pp.y - this.Viewer.y ) * nn.y + ( pp.z - this.Viewer.z ) * nn.z ;
      	}
      
      	if ( this.DiffuseLight == 1.0 ) {
      		if ( zz > 0 ) return ( cc0 ) ;
      		else return ( cc1 ) ;
      	}
      
      	vv = nn.x * this.Light.x + nn.y * this.Light.y + nn.z * this.Light.z ;
      
      	if ( zz > 0 ) {
      		vv *= -1 ;
      		rr = parseInt ( cc0.substr(1,2) , 16 ) ;
      		gg = parseInt ( cc0.substr(3,2) , 16 ) ;
      		bb = parseInt ( cc0.substr(5,2) , 16 ) ;
      	}
      	else {
      		rr = parseInt ( cc1.substr(1,2) , 16 ) ;
      		gg = parseInt ( cc1.substr(3,2) , 16 ) ;
      		bb = parseInt ( cc1.substr(5,2) , 16 ) ;
      	}
      
      	if ( vv <= 0 ) {
      		rr = Math.floor ( rr * this.DiffuseLight ) ; 
      		gg = Math.floor ( gg * this.DiffuseLight ) ;
      		bb = Math.floor ( bb * this.DiffuseLight ) ;
      	}
      	else {
      		rr = Math.floor ( rr * ( vv * ( 1 - this.DiffuseLight ) + this.DiffuseLight ) ) ; 
      		gg = Math.floor ( gg * ( vv * ( 1 - this.DiffuseLight ) + this.DiffuseLight ) ) ; 
      		bb = Math.floor ( bb * ( vv * ( 1 - this.DiffuseLight ) + this.DiffuseLight ) ) ; 
      	}
      
      	var ss = "#" ;
      	ss += hh.charAt ( Math.floor ( rr / 16 ) ) + hh.charAt ( rr % 16 ) ;
      	ss += hh.charAt ( Math.floor ( gg / 16 ) ) + hh.charAt ( gg % 16 ) ;
      	ss += hh.charAt ( Math.floor ( bb / 16 ) ) + hh.charAt ( bb % 16 ) ;
      
      	return ( ss ) ;
      
      };
      
      
      
      TeXGraph.Poly3D = function ( aParentScene , aFrontColor , aBackColor , aStrokeColor , aStrokeWeight , aOpacity ) {
      	this.Parent = aParentScene ;
      	this.ClassName = "TeXGraph.Poly3D" ;
      	this.PhPoint = new Array ( ) ;
      	this.Point = new Array ( ) ;
      	this.Center = new TeXGraph.Vector ( 0.0 , 0.0 , 0.0 ) ;
      	this.Normal = new TeXGraph.Vector ( 1.0 , 0.0 , 0.0 ) ;
      	this.FrontColor = aFrontColor ;
      	this.BackColor = aBackColor ;
      	this.StrokeColor = aStrokeColor ;
      	this.StrokeWeight = aStrokeWeight ;
      	this.Visibility = "visible" ;
      	this.Id = "" ;
      	this.Callback = new Array ( ) ;
      	this.Opacity = (! aOpacity) ? 1 : aOpacity ;
      	this.Parent.AddPoly ( this ) ;  
      
      };
      TeXGraph.Poly3D.LHS = false ;
      TeXGraph.Poly3D.prototype.AddPoint = function ( xx , yy , zz ) {
      	vv = this.Parent.Zoom ;
      	if ( this.Parent.LHS ) {
      		var tmp = xx ;
      		xx = yy ;
      		yy = tmp ;
      	}
      	this.PhPoint[ this.PhPoint.length ] = new TeXGraph.Vector ( xx , yy , zz ) ;
      	this.Point[ this.Point.length ] = new TeXGraph.Vector ( xx * vv.x , yy * vv.y , zz * vv.z ) ;
      };
      
      TeXGraph.Poly3D.prototype.SetPoint = function ( ii , xx , yy , zz ) {
      
      	vv = this.Parent.Zoom ;
      
      	this.PhPoint[ii].x = xx ;
      	this.PhPoint[ii].y = yy ;	
      	this.PhPoint[ii].z = zz ;
      
      	this.Point[ii].x = xx * vv.x ;
      	this.Point[ii].y = yy * vv.y ;
      	this.Point[ii].z = zz * vv.z ;
      };
      
      TeXGraph.Poly3D.prototype.Zoom = function ( ff ) {
      	for ( var ii = 0 ; ii < this.PhPoint.length ; ii++ ) {
      		this.PhPoint[ii].Zoom ( ff ) ;
      	}
      	for (var ii = 0 ; ii < this.Point.length ; ii++ ) {
      		this.Point[ii].Zoom ( ff ) ;
      	}
      	this.Update ( ) ;
      };
      
      TeXGraph.Poly3D.prototype.Shift = function ( xx , yy , zz ) {
      	vv = this.Parent.Zoom ;
      	for ( var ii = 0 ; ii < this.PhPoint.length ; ii++ ) {
      		this.PhPoint[ii].x += xx ;
      		this.PhPoint[ii].y += yy ;
      		this.PhPoint[ii].z += zz ;
      	}
      
      	for (var ii=0 ; ii < this.Point.length ; ii++ ) {
      
      		this.Point[ii].x += xx * vv.x ;
      		this.Point[ii].y += yy * vv.y ;
      		this.Point[ii].z += zz * vv.z ;
      	}
      
      	this.Center.x += xx * vv.x ;
      	this.Center.y += yy * vv.y ;
      	this.Center.z += zz * vv.z ;
      };
      
      TeXGraph.Poly3D.prototype.Update = function ( ) {
      
      	var ii ;
      	var ll = this.Point.length ;
      
      	this.Center.Zoom ( 0.0 ) ;
      
      	for ( ii = 0 ; ii < ll ; ii++ ) {
      		this.Center.Add ( this.Point[ii] ) ;
      	}
      
      	this.Center.Zoom ( 1.0 / ll ) ;
      
      	if ( ll > 2 ) {
      
      		var xx0 = this.Point[0].x - this.Center.x ;
      		var yy0 = this.Point[0].y - this.Center.y ;
      		var zz0 = this.Point[0].z - this.Center.z ;
      
      		var xx1 = this.Point[1].x - this.Center.x ;
      		var yy1 = this.Point[1].y - this.Center.y ;
      		var zz1 = this.Point[1].z - this.Center.z ;
      
      		this.Normal.x = yy0 * zz1 - zz0 * yy1 ;
      		this.Normal.y = zz0 * xx1 - xx0 * zz1 ;
      		this.Normal.z = xx0 * yy1 - yy0 * xx1 ;
      
      		this.Normal.Normalize ( ) ;
      	}
      };
      
      TeXGraph.Poly3D.prototype.Draw = function ( aShape ) {
      
      	var ii, ss, ll = this.Point.length ;
      	var scene = this.Parent ;
      	var canvas = scene.Parent ;
      	var jscanvas = canvas.canvas ;
      
      	canvas.setOpacity ( this.Opacity ) ;
      
      	var X = new Array ( ) ;
      	var Y = new Array ( ) ;
      	for ( ii = 0 ; ii < ll ; ii++ ) {
      		vv = this.Parent.ScreenPos ( this.Point[ii] ) ;
      		X.push ( parseInt ( vv.x ) ) ;
      		Y.push ( parseInt ( vv.y ) ) ;
      	}
      	if ( ( ll >= 3 ) && ( this.FrontColor != "" ) ) {
      		var tmpColor ;
      		if ( this.Parent.LHS ) {
      			tmpColor = this.Parent.GetColor ( this.BackColor , this.FrontColor , this.Normal , this.Center ) ;
      		}
      		else {
      			tmpColor = this.Parent.GetColor ( this.FrontColor , this.BackColor , this.Normal , this.Center ) ;
      		}
      		canvas.setColor ( tmpColor ) ;
      		jscanvas.fillPolygon ( X , Y ) ;
      	}
      	if ( this.StrokeColor != "" ) {
      		canvas.setStroke ( this.StrokeWeight ) ;
      		canvas.setColor ( this.StrokeColor ) ;
      		jscanvas.drawPolygon ( X , Y ) ;
      	}
      };
      
      TeXGraph.Poly3D.prototype.ZoomUpdate = function ( ) {
      	var ii, ll = this.Point.length, vv = this.Parent.Zoom ;
      	for ( ii = 0 ; ii < ll ; ii++ ) {
      		this.Point[ii].x = this.PhPoint[ii].x * vv.x ;
      		this.Point[ii].y = this.PhPoint[ii].y * vv.y ;
      		this.Point[ii].z = this.PhPoint[ii].z * vv.z ;
      	}
      	this.Update();
      };
      
      TeXGraph.Poly3D.prototype.SetOpacity = function ( op ) {
      
      	this.Opacity = op ;
      };
      
      TeXGraph.Canvas3D = function ( canvas , xmin , xmax , xscale , ymin , ymax , yscale , zmin , zmax , zscale ) {
      	this.scene3d = new TeXGraph.Scene3D ( canvas , 1 , canvas.window.width , canvas.window.height ) ;
      	this.canvas = canvas ;
      	this.xmin = ! xmin ? -10 : xmin ;
      	this.xmax = ! xmax ? 10 : xmax ;
      	this.xscale = ! xscale ? 1 : xscale ;
      	this.ymin = ! ymin ? -10 : ymin ;
      	this.ymax = ! ymax ? 10 : ymax ;
      	this.yscale = ! yscale ? 1 : yscale ;
      	this.zmin = ! zmin ? -10 : zmin ;
      	this.zmax = ! zmax ? 10 : zmax ;
      	this.zscale = ! zscale ? 1 : zscale ;
      	var m = TeXGraph.Math ;
      	this.rmin = 0 ;
      	this.rmax = m.sqrt ( m.pow(m.min(m.abs(this.xmin),m.abs(this.xmax)),2) + m.pow(m.min(m.abs(this.ymin),m.abs(this.ymax)),2) ) ;
      	this.thetamin = 0 ;
      	this.thetamax = 2 * m.pi ;
      	this.rhomin = 0 ;
      	this.rhomax = m.sqrt ( m.pow(m.max(m.abs(this.xmin),m.abs(this.xmax)),2) + m.pow(m.max(m.abs(this.ymin),m.abs(this.ymax)),2) + m.pow(m.max(m.abs(this.zmin),m.abs(this.zmax)),2) ) ;
      	this.phimin = 0 ;
      	this.phimax = m.pi ;
      	this.xpartition = 2 * parseInt ( 10 / this.xscale ) ;
      	this.ypartition = 2 * parseInt ( 10 / this.yscale ) ;
      	this.zpartition = 2 * parseInt ( 10 / this.zscale ) ;
      	this.rpartition = 10 ;
      	this.thetapartition = 10 ;
      	this.rhopartition = 10 ;
      	this.phipartition = 10 ;
      	this.spartition = 10 ;
      	this.tpartition = 10 ;
      	this.frontColor = "" ;
      	this.backColor = "" ;
      	this.strokeColor = "#808080" ;
      	this.strokeWeight = 1 ;
      	this.opacity = 1 ;
      	this.viewerzoomed = 0 ;
      	this.picturezoomed = 0 ;
      	this.canvasIndex = TeXGraph.Canvas3D.Canvases.length ;
      	TeXGraph.Canvas3D.Canvases.push ( this ) ;
      };
      
      TeXGraph.Canvas3D.Canvases = new Array ( ) ;
      
      TeXGraph.Canvas3D.prototype.setCoordSys = function ( cs ) {
      	if ( cs.match(/LHS/i) ) {
      		this.scene3d.LHS = true ;
      	}
      	else if ( cs.match(/RHS/i) ) {
      		this.scene3d.LHS = false ;
      	}
      	else {
      		this.scene3d.LHS = false ;
      	}
      };
      
      TeXGraph.Canvas3D.prototype.setPartitions = function ( one , two , three ) {
      
      	if ( ! one || typeof one != "number" ) { one = 1 ; }
      	if ( ! two || typeof two != "number" ) { two = 1 ; }
      	if ( ! three || typeof three != "number" ) { three = 1 ; }
      	this.xpartition = parseInt ( one ) ;
      	this.ypartition = parseInt ( two ) ;
      	this.zpartition = parseInt ( three ) ;
      
      	this.rpartition = parseInt ( one ) ;
      	this.thetapartition = parseInt ( two ) ;
      
      	this.rhopartition = parseInt ( one ) ;
      	this.phipartition = parseInt ( three ) ;
      
      	this.spartition = parseInt ( TeXGraph.Math.max ( one , TeXGraph.Math.max ( two , three ) ) ) ;
      	this.tpartition = this.spartition ;
      };
      
      TeXGraph.Canvas3D.prototype.setOpacity = function ( opacity ) {
      	this.opacity = opacity ;
      };
      
      TeXGraph.Canvas3D.prototype.setStrokeWeight = function ( weight ) {
      	if ( typeof weight != "number" ) { weight = 1 ; }
      	this.strokeWeight = parseInt ( weight ) ;
      };
      
      TeXGraph.Canvas3D.prototype.setStrokeColor = function ( strokeColor ) {
      	this.strokeColor = ( ! strokeColor ) ? "" : strokeColor ;
      };
      
      TeXGraph.Canvas3D.prototype.setSurfaceColor = function ( frontColor , backColor ) {
      	if ( ! frontColor ) { frontColor = "" ; }
      	if ( ! backColor ) { backColor = "" ; }
      	frontColor = TeXGraph.Util.colorString2HexString ( frontColor ) ;
      	backColor = TeXGraph.Util.colorString2HexString ( backColor ) ;
      
      	this.frontColor = frontColor ;
      	this.backColor = backColor ;
      };
      
      TeXGraph.Canvas3D.prototype.autoCenter = function ( ) { 
      	this.scene3d.AutoCenter ( ) ;
      };
      
      TeXGraph.Canvas3D.prototype.changeViewer = function ( theta , phi ) { 
      	this.scene3d.ChangeViewer ( theta , phi ) ;
      };
      
      TeXGraph.Canvas3D.prototype.changeLight = function ( theta , phi ) { 
      	this.scene3d.ChangeLight ( theta , phi ) ;
      };
      
      TeXGraph.Canvas3D.prototype.orderWeight = function ( x , y , z ) { 
      	if ( x != null ) { this.scene3d.OrderWeight.x = x ; }
      	if ( y != null ) { this.scene3d.OrderWeight.y = y ; }
      	if ( z != null ) { this.scene3d.OrderWeight.z = z ; }
      };
      
      TeXGraph.Canvas3D.prototype.draw = function ( ) { 
      	this.scene3d.Sort ( ) ;
      	this.scene3d.Draw ( ) ;
      };
      
      TeXGraph.Canvas3D.prototype.clear = function ( ) { 
      	this.canvas.clear ( ) ;
      };
      
      TeXGraph.Canvas3D.prototype.paint = function ( ) { 
      	this.canvas.paint ( ) ;
      };
      
      TeXGraph.Canvas3D.prototype.fillBackground = function ( ) { 
      	this.canvas.fillBackground ( ) ;
      };
      
      TeXGraph.Canvas3D.prototype.drawString = function ( str , x , y , z ) {
      
      	var pos = this.scene3d.ScreenPos ( new TeXGraph.Vector ( x , y , z ) ) ;
      	var jscanvas = this.canvas.canvas ;
      	jscanvas.drawString ( str , parseInt(pos.x) , parseInt(pos.y) ) ;
      };
      
      TeXGraph.Canvas3D.prototype.replaceIFrame = function ( ) { 
      	this.canvas.window.insertWindow ( this.canvas.window.iframe.parentNode , this.canvas.window.iframe ) ;
      };
      
      TeXGraph.Canvas3D.prototype.boxContainsPoint = function ( x , y , z ) { 
      	if ( x < this.xmin ) { return false ; }
      	if ( x > this.xmax ) { return false ; }
      	if ( y < this.ymin ) { return false ; }
      	if ( y > this.ymax ) { return false ; }
      	if ( z < this.zmin ) { return false ; }
      	if ( z > this.zmax ) { return false ; }
      
      	return true ;
      };

      TeXGraph.Canvas3D.prototype.drawVectorValuedFunction = function ( xt , yt , zt , tmin , tmax ) { 
      	xt = TeXGraph.Math.ascii2JS ( xt ) ;
      	yt = TeXGraph.Math.ascii2JS ( yt ) ;
      	zt = TeXGraph.Math.ascii2JS ( zt ) ;
      	tpartition = this.tpartition ;
      	var x0 , y0 , z0 , x , y , z ;
      	var t = tmin ;
      	var tstep = ( tmax - tmin ) / tpartition ;
      	while ( t < tmax ) {
      		x0 = eval ( xt ) ;
      		y0 = eval ( yt ) ;
      		z0 = eval ( zt ) ;
      		t += tstep ;
      		x = eval ( xt ) ;
      		y = eval ( yt ) ;
      		z = eval ( zt ) ;
      		this.drawLine ( new TeXGraph.Vector ( x0 , y0 , z0 ) , new TeXGraph.Vector ( x , y , z ) ) ;
      	}
      };
      
      TeXGraph.Canvas3D.prototype.drawLine = function ( one , two ) { 
      	var poly = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      	poly.AddPoint ( one.x , one.y , one.z ) ;
      	poly.AddPoint ( two.x , two.y , two.z ) ;
      	poly.Update ( ) ;
      };
      TeXGraph.Canvas3D.prototype.drawAxes = function ( ) { 
      	this.drawLine ( new TeXGraph.Vector(this.xmin,0,0) , new TeXGraph.Vector(this.xmax,0,0) ) ;
      	this.drawLine ( new TeXGraph.Vector(0,this.ymin,0) , new TeXGraph.Vector(0,this.ymax,0) ) ;
      	this.drawLine ( new TeXGraph.Vector(0,0,this.zmin) , new TeXGraph.Vector(0,0,this.zmax) ) ;
      };
      
      TeXGraph.Canvas3D.prototype.drawAxesLabels = function ( xLabel , yLabel , zLabel ) { 
      	if ( ! xLabel || xLabel == "" ) { xLabel = "x" ; }
      	if ( ! yLabel || yLabel == "" ) { yLabel = "y" ; }
      	if ( ! zLabel || zLabel == "" ) { zLabel = "z" ; }
      
      	this.drawString ( xLabel , this.xmax , 0 , 0 ) ;
      	this.drawString ( yLabel , 0 , this.ymax , 0 ) ;
      	this.drawString ( zLabel , 0 , 0 , this.zmax ) ;
      };
      
      TeXGraph.Canvas3D.prototype.drawBox = function ( ) { 
      	this.drawLine ( new TeXGraph.Vector(this.xmin,this.ymin,this.zmin) , new TeXGraph.Vector(this.xmin,this.ymin,this.zmax) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmin,this.ymin,this.zmin) , new TeXGraph.Vector(this.xmin,this.ymax,this.zmin) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmin,this.ymin,this.zmin) , new TeXGraph.Vector(this.xmax,this.ymin,this.zmin) ) ;
      
      	this.drawLine ( new TeXGraph.Vector(this.xmax,this.ymax,this.zmin) , new TeXGraph.Vector(this.xmax,this.ymax,this.zmax) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmax,this.ymax,this.zmin) , new TeXGraph.Vector(this.xmax,this.ymin,this.zmin) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmax,this.ymax,this.zmin) , new TeXGraph.Vector(this.xmin,this.ymax,this.zmin) ) ;
      
      	this.drawLine ( new TeXGraph.Vector(this.xmin,this.ymax,this.zmax) , new TeXGraph.Vector(this.xmin,this.ymax,this.zmin) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmin,this.ymax,this.zmax) , new TeXGraph.Vector(this.xmax,this.ymax,this.zmax) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmin,this.ymax,this.zmax) , new TeXGraph.Vector(this.xmin,this.ymin,this.zmax) ) ;
      
      	this.drawLine ( new TeXGraph.Vector(this.xmax,this.ymin,this.zmax) , new TeXGraph.Vector(this.xmin,this.ymin,this.zmax) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmax,this.ymin,this.zmax) , new TeXGraph.Vector(this.xmax,this.ymax,this.zmax) ) ;
      	this.drawLine ( new TeXGraph.Vector(this.xmax,this.ymin,this.zmax) , new TeXGraph.Vector(this.xmax,this.ymin,this.zmin) ) ;
      };
      
      TeXGraph.Canvas3D.prototype.drawRectSurface = function ( depVar , f , domain ) { 
      
      	f = TeXGraph.Math.ascii2JS ( f ) ;
      
      	if ( ! domain || domain == "" ) { domain = "true" ; }
      	domain = TeXGraph.Math.ascii2JS ( domain ) ;
     
      	var min = new TeXGraph.Vector ( this.xmin , this.ymin , this.zmin ) ;
      	var max = new TeXGraph.Vector ( this.xmax , this.ymax , this.zmax ) ;
      
      	var xmin, xmax, ymin, ymax, zmin, zmax, x0, x1, y0, y1, z, x, y;
      	xmin = min.x ;
      	ymin = min.y ;
      	zmin = min.z ;
      	xmax = max.x ;
      	ymax = max.y ;
      	zmax = max.z ;
      	var n_x = this.xpartition ;
      	var n_y = this.ypartition ;
      	var n_z = this.zpartition ;
      	if ( depVar == "z" ) {
      		var zPoly = new Array ( ) ;
      		x = xmin ;
      		y = ymin ;
      		zmin = eval ( f ) ;
      		zmax = zmin ;
      		for ( var i = 0 ; i < n_x ; i++ ) {
      			zPoly[i] = new Array ( ) ;
      			x0 = xmin + i * ( xmax - xmin ) / n_x ;
      			x1 = xmin + ( i + 1 ) * ( xmax - xmin ) / n_x ;
      			for ( var j = 0 ; j < n_y ; j++ ) {
      				y0 = ymin + j * ( ymax - ymin ) / n_y ;
      				y1 = ymin + ( j + 1 ) * ( ymax - ymin ) / n_y ;
      				zPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				x = x0 ;
      				y = y1 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					zPoly[i][j].AddPoint ( x0 , y1 , z ) ;
      				}
      				x = x1 ;
      				y = y1 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					zPoly[i][j].AddPoint ( x1 , y1 , z ) ;
      				}
      				x = x1 ;
      				y = y0 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					zPoly[i][j].AddPoint ( x1 , y0 , z ) ;
      				}
      				x = x0 ;
      				y = y0 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					zPoly[i][j].AddPoint ( x0 , y0 , z ) ;
      				}
      				zPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      	else if ( depVar == "y" ) {
      
      		var yPoly = new Array ( ) ;
      		x = xmin ;
      		z = zmin ;
      		ymin = eval ( f ) ;
      		ymax = ymin ;
      		for ( var i = 0 ; i < n_x ; i++ ) {
      			yPoly[i] = new Array ( ) ;
      			x0 = xmin + i * ( xmax - xmin ) / n_x ;
      			x1 = xmin + ( i + 1 ) * ( xmax - xmin ) / n_x ;
      			for ( var j = 0 ; j < n_z ; j++ ) {
      				z0 = zmin + j * ( zmax - zmin ) / n_z ;
      				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
      				yPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				x = x0 ;
      				z = z1 ;
      				y = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
      					yPoly[i][j].AddPoint ( x0 , y , z1 ) ;
      				}
      				x = x1 ;
      				z = z1 ;
      				y = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
      					yPoly[i][j].AddPoint ( x1 , y , z1 ) ; 
      				}
      				x = x1 ;
      				z = z0 ;
      				y = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
      					yPoly[i][j].AddPoint ( x1 , y , z0 ) ;
      				}
      				x = x0 ;
      				z = z0 ;
      				y = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
      					yPoly[i][j].AddPoint ( x0 , y , z0 ) ;
      				}
      				yPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      	else if ( depVar == "x" ) {
      
      		var xPoly = new Array ( ) ;
      		y = ymin ;
      		z = zmin ;
      		xmin = eval ( f ) ;
      		xmax = xmin ;
      		for ( var i = 0 ; i < n_y ; i++ ) {
      			xPoly[i] = new Array ( ) ;
      			y0 = ymin + i * ( ymax - ymin ) / n_y ;
      			y1 = ymin + ( i + 1 ) * ( ymax - ymin ) / n_y ;
      			for ( var j = 0 ; j < n_z ; j++ ) {
      				z0 = zmin + j * ( zmax - zmin ) / n_z ;
      				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
      				xPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				y = y0 ;
      				z = z1 ;
      				x = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
      					xPoly[i][j].AddPoint ( x , y0 , z1 ) ; 
      				}
      				y = y1 ;
      				z = z1 ;
      				x = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
      					xPoly[i][j].AddPoint ( x , y1 , z1 ) ; 
      				}
      				y = y1 ;
      				z = z0 ;
      				x = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
      					xPoly[i][j].AddPoint ( x , y1 , z0 ) ;
      				}
      				y = y0 ;
      				z = z0 ;
      				x = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
      					xPoly[i][j].AddPoint ( x , y0 , z0 ) ;
      				}
      				xPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      };
      
      TeXGraph.Canvas3D.prototype.drawCylSurface = function ( depVar , f , domain ) { 
      	f = TeXGraph.Math.ascii2JS ( f ) ;
      	if ( ! domain || domain == "" ) { domain = "true" ; }
      	domain = TeXGraph.Math.ascii2JS ( domain ) ;
      	var min = new TeXGraph.Vector ( this.xmin , this.ymin , this.zmin ) ;
      	var max = new TeXGraph.Vector ( this.xmax , this.ymax , this.zmax ) ;
      	var xmin, xmax, ymin, ymax, zmin, zmax, x0, x1, y0, y1, z, x, y;
      	var rmin, rmax, thetamin, thetamax, r0, r1, theta0, theta1, r, theta ;
      	xmin = min.x ;
      	ymin = min.y ;
      	zmin = min.z ;
      	xmax = max.x ;
      	ymax = max.y ;
      	zmax = max.z ;
      	rmin = this.rmin ;
      	rmax = this.rmax ;
      	thetamin = this.thetamin ;
      	thetamax = this.thetamax ;
      	var n_x = this.xpartition ;
      	var n_y = this.ypartition ;
      	var n_z = this.zpartition ;
      	var n_r = this.rpartition ;
      	var n_theta = this.thetapartition ;
      	if ( depVar == "z" ) {
      		var zPoly = new Array ( ) ;
      		r = rmin ;
      		theta = thetamin ;
      		zmin = eval ( f ) ;
      		zmax = zmin ;
      		for ( var i = 0 ; i < n_r ; i++ ) {
      			zPoly[i] = new Array ( ) ;
      			r0 = rmin + i * ( rmax - rmin ) / n_r ;
      			r1 = rmin + ( i + 1 ) * ( rmax - rmin ) / n_r ;
      			for ( var j = 0 ; j < n_theta ; j++ ) {
      				theta0 = thetamin + j * ( thetamax - thetamin ) / n_y ;
      				theta1 = thetamin + ( j + 1 ) * ( thetamax - thetamin ) / n_theta ;
      				zPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				r = r0 ;
      				theta = theta1 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					x0 = r0 * TeXGraph.Math.cos ( theta1 ) ;
      					y1 = r0 * TeXGraph.Math.sin ( theta1 ) ;
      					zPoly[i][j].AddPoint ( x0 , y1 , z ) ;
      				}
      				r = r1 ;
      				theta = theta1 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					x1 = r1 * TeXGraph.Math.cos ( theta1 ) ;
      					y1 = r1 * TeXGraph.Math.sin ( theta1 ) ;
      					zPoly[i][j].AddPoint ( x1 , y1 , z ) ;
      				}
      				r = r1 ;
      				theta = theta0 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					x1 = r1 * TeXGraph.Math.cos ( theta0 ) ;
      					y0 = r1 * TeXGraph.Math.sin ( theta0 ) ;
      					zPoly[i][j].AddPoint ( x1 , y0 , z ) ;
      				}
      				r = r0 ;
      				theta = theta0 ;
      				z = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      					x0 = r0 * TeXGraph.Math.cos ( theta0 ) ;
      					y0 = r0 * TeXGraph.Math.sin ( theta0 ) ;
      					zPoly[i][j].AddPoint ( x0 , y0 , z ) ;
      				}
      				zPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      	else if ( depVar == "r" ) {
      
      		var rPoly = new Array ( ) ;
      		theta = thetamin ;
      		z = zmin ;
      		rmin = eval ( f ) ;
      		rmax = rmin ;
      		for ( var i = 0 ; i < n_theta ; i++ ) {
      			rPoly[i] = new Array ( ) ;
      			theta0 = xmin + i * ( thetamax - thetamin ) / n_theta ;
      			theta1 = xmin + ( i + 1 ) * ( thetamax - thetamin ) / n_theta ;
      			for ( var j = 0 ; j < n_z ; j++ ) {
      				z0 = zmin + j * ( zmax - zmin ) / n_z ;
      				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
      				rPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				theta = theta0 ;
      				z = z1 ;
      				r = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
      					x0 = r * TeXGraph.Math.cos ( theta0 ) ;
      					y = r * TeXGraph.Math.sin ( theta0 ) ;
      					rPoly[i][j].AddPoint ( x0 , y , z1 ) ;
      				}
      				theta = theta1 ;
      				z = z1 ;
      				r = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
      					x1 = r * TeXGraph.Math.cos ( theta1 ) ;
      					y = r * TeXGraph.Math.sin ( theta1 ) ;
      					rPoly[i][j].AddPoint ( x1 , y , z1 ) ; 
      				}
      				theta = theta1 ;
      				z = z0 ;
      				r = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
      					x1 = r * TeXGraph.Math.cos ( theta1 ) ;
      					y = r * TeXGraph.Math.sin ( theta1 ) ;
      					rPoly[i][j].AddPoint ( x1 , y , z0 ) ;
      				}
      				theta = theta0 ;
      				z = z0 ;
      				r = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
      					x0 = r * TeXGraph.Math.cos ( theta0 ) ;
      					y = r * TeXGraph.Math.sin ( theta0 ) ;
      					rPoly[i][j].AddPoint ( x0 , y , z0 ) ;
      				}
      				rPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      	else if ( depVar == "theta" ) {
      
      		var thetaPoly = new Array ( ) ;
      		r = rmin ;
      		z = zmin ;
      		thetamin = eval ( f ) ;
      		thetamax = thetamin ;
      		for ( var i = 0 ; i < n_r ; i++ ) {
      			thetaPoly[i] = new Array ( ) ;
      			r0 = rmin + i * ( rmax - rmin ) / n_r ;
      			r1 = rmin + ( i + 1 ) * ( rmax - rmin ) / n_r ;
      			for ( var j = 0 ; j < n_z ; j++ ) {
      				z0 = zmin + j * ( zmax - zmin ) / n_z ;
      				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
      				thetaPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				r = r0 ;
      				z = z1 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = r0 * TeXGraph.Math.cos ( theta ) ;
      					y0 = r0 * TeXGraph.Math.sin ( theta ) ;
      					thetaPoly[i][j].AddPoint ( x , y0 , z1 ) ; 
      				}
      				r = r1 ;
      				z = z1 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = r1 * TeXGraph.Math.cos ( theta ) ;
      					y1 = r1 * TeXGraph.Math.sin ( theta ) ;
      					thetaPoly[i][j].AddPoint ( x , y1 , z1 ) ; 
      				}
      				r = r1 ;
      				z = z0 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = r1 * TeXGraph.Math.cos ( theta ) ;
      					y1 = r1 * TeXGraph.Math.sin ( theta ) ;
      					thetaPoly[i][j].AddPoint ( x , y1 , z0 ) ;
      				}
      				r = r0 ;
      				z = z0 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = r0 * TeXGraph.Math.cos ( theta ) ;
      					y0 = r0 * TeXGraph.Math.sin ( theta ) ;
      					thetaPoly[i][j].AddPoint ( x , y0 , z0 ) ;
      				}
      				thetaPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      };
      
      TeXGraph.Canvas3D.prototype.drawSphSurface = function ( depVar , f , domain ) { 
      	f = TeXGraph.Math.ascii2JS ( f ) ;
      	if ( ! domain || domain == "" ) { domain = "true" ; }
      	domain = TeXGraph.Math.ascii2JS ( domain ) ;
      	var min = new TeXGraph.Vector ( this.xmin , this.ymin , this.zmin ) ;
      	var max = new TeXGraph.Vector ( this.xmax , this.ymax , this.zmax ) ;
      
      	var xmin, xmax, ymin, ymax, zmin, zmax, x0, x1, y0, y1, z, x, y;
      
      	var rmin, rmax, thetamin, thetamax, r0, r1, theta0, theta1, r, theta ;
      	var rhomin, rhomax, phimin, phimax, rho0, rho1, phi0, phi1, rho, phi ;
      
      	xmin = min.x ;
      	ymin = min.y ;
      	zmin = min.z ;
      
      	xmax = max.x ;
      	ymax = max.y ;
      	zmax = max.z ;
     
      	rhomin = this.rhomin ;
      	rhomax = this.rhomax ;
      	thetamin = this.thetamin ;
      	thetamax = this.thetamax ;
      	phimin = this.phimin ;
      	phimax = this.phimax ;
      
      
      	var n_x = this.xpartition ;
      	var n_y = this.ypartition ;
      	var n_z = this.zpartition ;
      
      	var n_r = this.rpartition ;
      	var n_theta = this.thetapartition ;
      
      	var n_rho = this.rhopartition ;
      	var n_phi = this.phipartition ;
      
      	if ( depVar == "rho" ) {
      
      		var rhoPoly = new Array ( ) ;
      		phi = phimin ;
      		theta = thetamin ;
      		rhomin = eval ( f ) ;
      		rhomax = zmin ;
      		for ( var i = 0 ; i < n_phi ; i++ ) {
      			rhoPoly[i] = new Array ( ) ;
      			phi0 = phimin + i * ( phimax - phimin ) / n_phi ;
      			phi1 = phimin + ( i + 1 ) * ( phimax - phimin ) / n_phi ;
      			for ( var j = 0 ; j < n_theta ; j++ ) {
      				theta0 = thetamin + j * ( thetamax - thetamin ) / n_y ;
      				theta1 = thetamin + ( j + 1 ) * ( thetamax - thetamin ) / n_theta ;
      				rhoPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				phi = phi0 ;
      				theta = theta1 ;
      				rho = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					rhoPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				phi = phi1 ;
      				theta = theta1 ;
      				rho = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					rhoPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				phi = phi1 ;
      				theta = theta0 ;
      				rho = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					rhoPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				phi = phi0 ;
      				theta = theta0 ;
      				rho = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					rhoPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				rhoPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      	else if ( depVar == "phi" ) {
      
      		var phiPoly = new Array ( ) ;
      		theta = thetamin ;
      		rho = rhomin ;
      		phimin = eval ( f ) ;
      		phimax = phimin ;
      		for ( var i = 0 ; i < n_theta ; i++ ) {
      			phiPoly[i] = new Array ( ) ;
      			theta0 = xmin + i * ( thetamax - thetamin ) / n_theta ;
      			theta1 = xmin + ( i + 1 ) * ( thetamax - thetamin ) / n_theta ;
      			for ( var j = 0 ; j < n_rho ; j++ ) {
      				rho0 = rhomin + j * ( rhomax - rhomin ) / n_rho ;
      				rho1 = rhomin + ( j + 1 ) * ( rhomax - rhomin ) / n_rho ;
      				phiPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				theta = theta0 ;
      				rho = rho1 ;
      				phi = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					phiPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				theta = theta1 ;
      				rho = rho1 ;
      				phi = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					phiPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				theta = theta1 ;
      				rho = rho0 ;
      				phi = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					phiPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				theta = theta0 ;
      				rho = rho0 ;
      				phi = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					phiPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				phiPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      	else if ( depVar == "theta" ) {
      
      		var thetaPoly = new Array ( ) ;
      		rho = rhomin ;
      		phi = phimin ;
      		thetamin = eval ( f ) ;
      		thetamax = thetamin ;
      		for ( var i = 0 ; i < n_rho ; i++ ) {
      			thetaPoly[i] = new Array ( ) ;
      			rho0 = rhomin + i * ( rhomax - rhomin ) / n_rho ;
      			rho1 = rhomin + ( i + 1 ) * ( rhomax - rhomin ) / n_rho ;
      			for ( var j = 0 ; j < n_phi ; j++ ) {
      				phi0 = phimin + j * ( phimax - phimin ) / n_phi ;
      				phi1 = phimin + ( j + 1 ) * ( phimax - phimin ) / n_phi ;
      				thetaPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      				rho = rho0 ;
      				phi = phi1 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					thetaPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				rho = rho1 ;
      				phi = phi1 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					thetaPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				rho = rho1 ;
      				phi = phi0 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					thetaPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				rho = rho0 ;
      				phi = phi0 ;
      				theta = eval ( f ) ;
      				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
      					x = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.cos ( theta ) ;
      					y = rho * TeXGraph.Math.sin ( phi ) * TeXGraph.Math.sin ( theta ) ;
      					z = rho * TeXGraph.Math.cos ( phi ) ;
      					thetaPoly[i][j].AddPoint ( x , y , z ) ;
      				}
      				thetaPoly[i][j].Update ( ) ;
      			}
      		}
      	}
      };
      
      TeXGraph.Canvas3D.prototype.drawParamSurface = function ( zxy , xst , yst , smin , smax , tmin , tmax ) { 
      	zxy = TeXGraph.Math.ascii2JS ( zxy ) ;
      	xst = TeXGraph.Math.ascii2JS ( xst ) ;
      	yst = TeXGraph.Math.ascii2JS ( yst ) ;
      
      	var x, y, z, xmin = this.xmin, ymin = this.ymin, zmin = this.zmin, xmax=this.xmax, ymax=this.ymax, zmax=this.zmax ;
      	var x0 , y0 , z0 , x1 , y1 , z1 ;
      	var s , t , s0 , s1 , t0 , t1 ;
      
      	var spartition = this.spartition ;
      	var tpartition = this.tpartition ;
      
      	var zPoly = new Array ( ) ;
      	x = xmin ;
      	y = ymin ;
      	zmin = eval ( zxy ) ;
      	zmax = zmin ;
      
      	var domain = "true" ;
      
      	for ( var i = 0 ; i < spartition ; i++ ) {
      		zPoly[i] = new Array ( ) ;
      		for ( var j = 0 ; j < tpartition ; j++ ) {
      			s0 = smin + i * ( smax - smin ) / spartition ;
      			s1 = smin + ( i + 1 ) * ( smax - smin ) / spartition ;
      			t0 = tmin + j * ( tmax - tmin ) / tpartition ;
      			t1 = tmin + ( j + 1 ) * ( tmax - tmin ) / tpartition ;
      			zPoly[i][j] = new TeXGraph.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
      			s = s0 ;
      			t = t1 ;
      			x = eval ( xst ) ;
      			y = eval ( yst ) ;
      			z = eval ( zxy ) ;
      			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      				zPoly[i][j].AddPoint ( x , y , z ) ;
      			}
      			s = s1 ;
      			t = t1 ;
      			x = eval ( xst ) ;
      			y = eval ( yst ) ;
      			z = eval ( zxy ) ;
      			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      				zPoly[i][j].AddPoint ( x , y , z ) ;
      			}
      			s = s1 ;
      			t = t0 ;
      			x = eval ( xst ) ;
      			y = eval ( yst ) ;
      			z = eval ( zxy ) ;
      			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      				zPoly[i][j].AddPoint ( x , y , z ) ;
      			}
      			s = s0 ;
      			t = t0 ;
      			x = eval ( xst ) ;
      			y = eval ( yst ) ;
      			z = eval ( zxy ) ;
      			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
      				zPoly[i][j].AddPoint ( x , y , z ) ;
      			}
      			zPoly[i][j].Update ( ) ;
      		}
      	}
      };
      
      TeXGraph.Graph = { } ;	
      TeXGraph.Graph.processGraphs = function ( node ) {
      	if ( ! node ) { node = document.body ; }
      	var graphs = TeXGraph.Util.getElementsByClass ( node , "div" , "TeXGraphGraph" ) ;
      	var pi = TeXGraph.Math.pi ;
      	var e = TeXGraph.Math.e ;
      	while ( graphs.length > 0 ) {
      		TeXGraph.Window.update ( ) ;
      		var dim = 2 ;
      		var width = 100 ;
      		var height = 100 ;
      		var updatedWidth = 100 ;
      		var updatedHeight = 100 ;
      		var xmin = -10 ;
      		var xmax = 10 ;
      		var xscale = 1 ;
      		var ymin = -10 ;
      		var ymax = 10 ;
      		var yscale = 1 ;
      		var zmin = -10 ;
      		var zmax = 10 ;
      		var zscale = 1 ;
      
      		var bgcolor = "" ;
      		var color = "black" ;
      		var stroke = 1 ;
      		var opacity = 1 ;
      
      		var showControls = false ;
      		var viewer = [ -20 , -15 ] ;
      		var axesLabels3D = null ;
      		var graph = graphs[0] ;
      		var script = TeXGraph.getDataDivContentById ( graph.getAttribute("id") ) ;
      		script = TeXGraph.unescapeScript ( script ) ;
      		script = TeXGraph.removeComments ( script ) ;
      
      		var originalScript = script ;
      
      		script = TeXGraph.unescapeScript ( script ) ;
      		script = TeXGraph.removeComments ( script ) ;
      		script = script.replace ( /\|/g , "VertDash" ) ;
      		var userDim = ["dim","width","height","xmin","xmax","xscale","ymin","ymax","yscale","zmin","zmax","zscale","bgcolor"] ;
      		var userCommands = ["stroke","color","grid","border","axeslabels","axes","tickmarks","ticklabels","plot","mtext","opacity"] ;
      
      		script = script.replace ( /[\n|\r|\f|\v|\t]*/g , "" ) ;
      
      		script = script.replace ( /xscl/ig , "xscale" ) ;
      		script = script.replace ( /yscl/ig , "yscale" ) ;
      		script = script.replace ( /zscl/ig , "zscale" ) ;
      		for ( var i = 0 ; i < userDim.length ; i++ ) {
      			var udim = userDim[i] ;
      			index = script.indexOf ( udim ) ;
      			if ( index != -1 ) {
      				sColonIndex = script.indexOf ( ";" , index ) ;
      				if ( sColonIndex == -1 ) {
      					return new TeXGraph.Warning ( "missing ; after declaration of " + udim , "TeXGraph.Graph.processGraphs" ) ;
      				}
      				var tmp ;
      				tmp  = script.slice ( index , sColonIndex ) ;
      				if ( tmp.match(/=/) ) {
      					tmp  = tmp.replace ( new RegExp(udim+"\s*=\s*") , "" ) ;
      					if ( udim.match(/dim|width|height/i) ) {
      						eval ( udim + " = parseInt(" + tmp + ");" ) ;
      					}
      					else if ( udim.match(/xmin|xmax|xscale|ymin|ymax|yscale|zmin|zmax|zscale/i) ) {
      						eval ( udim + " = parseFloat(" + tmp + ");" ) ;
      					}
      					else if ( udim.match(/bgcolor/i) ) {
      						tmp = tmp.replace ( /\s*bgcolor\s*=\s*/ , "" ) ;
      						bgcolor = tmp ;
      					}
      					script = script.slice ( 0 , index ) + "" + script.slice ( sColonIndex + 1 ) ;
      				}
      			}
      		}
      
      		if ( width <= 0 || height <= 0 ) {
      			return new TeXGraph.Warning ( "width and height must be positive" , "TeXGraph.Graph.processGraphs()" ) ;
      		}
      		if ( xmax <= xmin || ymax <= ymin || zmax <= zmin ) {
      			return new TeXGraph.Warning ( "xmax/ymax/zmax must be larger than xmin/ymin/zmin" , "TeXGraph.Graph.processGraphs()" ) ;
      		}
      		if ( xscale <= 0 || yscale <= 0 || zscale <= 0 ) {
      			return new TeXGraph.Warning ( "xscale/xscl and yscale/yscl and zscale/zscl must be positive" , "TeXGraph.Graph.processGraphs()" ) ;
      		}
      
      		var w = new TeXGraph.Window ( width , height ) ;
      		var c = null ;
      		var c3d = null ;
      		if ( dim == 2 ) {
      			c = new TeXGraph.Canvas ( w , xmin , xmax , xscale , ymin , ymax , yscale , bgcolor ) ;
      			c.setStroke ( stroke ) ;
      			c.setOpacity ( opacity ) ;
      			c.setColor ( "gray" ) ;
      		}
      		else if ( dim == 3 ) {
      
      			c = new TeXGraph.Canvas ( w , null , null , null , null , null , null , bgcolor ) ;
      			c3d = new TeXGraph.Canvas3D ( c , xmin , xmax , xscale , ymin , ymax , yscale , zmin , zmax , zscale ) ; 
      			c3d.setStrokeWeight ( stroke ) ;
      			c3d.setOpacity ( opacity ) ;
      			c3d.setStrokeColor ( "gray" ) ;
      			c3d.setSurfaceColor ( "red" , "blue" ) ;
      			c3d.setPartitions ( 10 , 10 , 10 ) ;
      		}
      		else {
      			return new TeXGraph.Warning ( "dim must be 2 or 3" , "TeXGraph.Graph.processGraphs()" ) ;
      		}
      
      		if ( bgcolor != "" ) { c.fillBackground ( ) ; }
      		
      		updatedHeight = height ;
      		updatedWidth = width ;
      		var commands = script.split ( ";" ) ;
      		for ( var i = 0 ; i < commands.length ; i++ ) {
      			var command = commands[i] ;
      			command = command.replace ( /^\s*/ , "" ) ;
      
      			if ( command.match(/^var\s*data.*\s*=/i) ) {
      				eval ( command + ";" ) ;
      			}
      			else if ( command.match(/^(fill)?histogram\s*\(/i) && dim == 2 ) {
      				var fill = false ;
      				if ( command.match ( /fill/i ) ) { fill = true ; }
      
      				command = command.replace ( /\s*(fill)?histogram\s*\(/i , "" ) ;
      				command = command.replace ( /\s*\)\s*$/ , "" ) ;
      
      				command = command.split ( "," ) ;
      				var list = new TeXGraph.DataList ( TeXGraph.DataList.Quantitative , eval(command[0]) ) ;
      				var rel = ( command[2] && command[2].match(/rel/i) ) ? true : false ;
      				c.drawHistogram ( list , parseInt(command[1]) , fill , rel ) ;
      			}
      			else if ( command.match(/^stroke\s*=/i) ) {
      				var tmp = command.replace ( /^stroke\s*=\s*/i , "" ) ;
      				if ( tmp.match(/dotted/i) ) {
      					if ( dim == 2 ) {
      						c.setStroke ( "dotted" ) ;
      						stroke = c.getStroke ( ) ;
      					}
      					else if ( dim == 3 ) {
      						c3d.setStrokeWeight ( "dotted" ) ;
      					}
      				}
      				else {
      					stroke = parseInt ( tmp ) ;
      					if ( dim == 2 ) {
      						c.setStroke ( stroke ) ;
      					}
      					else if ( dim == 3 ) {
      						c3d.setStrokeWeight ( stroke ) ;
      					}
      				}
      			}
      			else if ( command.match(/^color\s*=/i) ) {
      				var tmp = command.replace ( /^color\s*=\s*/i , "" ) ;
      				color = tmp ;
      				if ( dim == 2 ) {
      					c.setColor ( color ) ;
      				}
      				else if ( dim == 3 ) {
      					c3d.setStrokeColor ( color ) ;
      				}
      			}
      			else if ( command.match(/^surfacecolor\s*\(/i) && dim == 3 ) {
      				var tmp = command.replace ( /^surfacecolor\s*\(\s*/i , "" ) ;
      				tmp = tmp.replace ( /\s*\)\s*$/ , "" ) ;
      				tmp = tmp.replace ( /\s*/g , "" ) ;
      				color = tmp.split(",") ;
      				c3d.setSurfaceColor ( color[0] , color[1] ) ;
      			}
      			else if ( command.match(/^opacity\s*=/i) ) {
      				var tmp = command.replace ( /^opacity\s*=\s*/i , "" ) ;
      				opacity = parseFloat ( tmp ) ;
      				if ( dim == 2 ) {
      					c.setOpacity ( opacity ) ;
      				}
      				else if ( dim == 3 ) {
      					c3d.setOpacity ( opacity ) ;
      				}
      			}
      			else if ( command.match(/^(x|y|r|theta)(min|max)\s*=/i) && dim == 2 ) {			// reset xmin,xmax,ymin,ymax
      				eval ( "c." + command ) ;
      			}
      			else if ( command.match(/^(x|y|z|r|theta|rho|phi)(min|max)\s*=/i) && dim == 3 ) {	// reset min/max for 3D coords
      				eval ( "c3d." + command ) ;
      			}
      			else if ( command.match(/^grid\s*=/i) && dim == 2 ) {
      				var tmp = command.replace ( /^grid\s*=\s*/i , "" ) ;
      				if ( tmp.match(/rect|yes/) ) {
      					c.drawGrid ( ) ;
      				}
      				else if ( tmp.match(/polar/i) ) {
      					c.drawGrid ( "polar" ) ;
      				}
      				else if ( tmp.match(/no/i) ) {
      				}
      				else {
      					return new TeXGraph.Warning ( "unrecognized value passed for grid" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      			}
      			else if ( command.match(/^border\s*=/i) && dim == 2 ) {
      				var tmp = command.replace ( /^border\s*=\s*/i , "" ) ;
      				if ( tmp.match(/yes|true/i) ) {
      					c.drawBorder ( ) ;
      				}
      				else if ( tmp.match(/no|false/i) ) {
      				}
      				else {
      					return new TeXGraph.Warning ( "unrecognized value passed for border" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      			}
      			else if ( command.match(/^axeslabels\s*=/i) ) {
      				var tmp = command.replace ( /^axeslabels\s*=\s*/i , "" ) ;
      				var labels = tmp.split(",") ;
      				if ( dim == 2 ) {
      					c.drawAxesLabels ( labels[0] , labels[1] ) ;
      				}
      				else if ( dim == 3 ) {
      					axesLabels3D = labels ;
      				}
      			}
      			else if ( command.match(/^axes\s*=/i) ) {
      				var tmp = command.replace ( /^axes\s*=\s*/i , "" ) ;
      				if ( tmp.match(/yes|true/i) ) {
      					if ( dim == 2 ) {
      						c.drawAxes ( ) ;
      					}
      					else {
      						c3d.drawAxes ( ) ;
      					}
      				}
      				else if ( tmp.match(/no|false/i) ) {
      					/* empty body */
      				}
      				else {
      					return new TeXGraph.Warning ( "unrecognized value passed for axes" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      			}
      			else if ( command.match(/^tickmarks\s*=/i) && dim == 2 ) {
      				var tmp = command.replace ( /^tickmarks\s*=\s*/i , "" ) ;
      				if ( tmp.match(/yes|true/i) ) {
      					c.drawTickMarks ( false ) ;
      				}
      				else if ( tmp.match(/no|false/i) ) {
      					/* empty body */
      				}
      				else {
      					return new TeXGraph.Warning ( "unrecognized value passed for tickmarks" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      			}
      			else if ( command.match(/^ticklabels\s*=/i) && dim == 2 ) {
      				var tmp = command.replace ( /^ticklabels\s*=\s*/i , "" ) ;
      				if ( tmp.match(/yes|true/i) ) {
      					c.drawTickMarks ( true ) ;
      				}
      				else if ( tmp.match(/no|false/i) ) {
      				}
      				else {
      					return new TeXGraph.Warning ( "unrecognized value passed for ticklabels" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      			}
      			else if ( command.match(/^LHS\s*=/i) && dim == 3 ) {
      				var tmp = command.replace ( /^LHS\s*=\s*/i , "" ) ;
      				if ( tmp.match(/yes|true/i) ) {
      					c3d.setCoordSys ( "LHS" ) ;
      				}
      				else if ( tmp.match(/no|false/i) ) {
      					c3d.setCoordSys ( "RHS" ) ;
      				}
      				else {
      					return new TeXGraph.Warning ( "unrecognized value passed for LHS/lhs" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      			}
      			else if ( command.match(/^controls\s*=/i) && dim == 3 ) {
      				var tmp = command.replace ( /^controls\s*=\s*/i , "" ) ;
      				if ( tmp.match(/yes|true/i) ) {
      					showControls = true ;
      				}
      				else if ( tmp.match(/no|false/i) ) {
      					showControls = false ;
      				}
      				else {
      					return new TeXGraph.Warning ( "unrecognized value passed for controls" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      			}
      			else if ( command.match(/^dot\s*\(/i) && dim == 2 ) {
      				command = command.replace ( /\s*dot\s*\(/i , "" ) ;
      				command = command.replace ( /\s*\)\s*$/ , "" ) ;
      
      				var brack1Ind = command.indexOf ( "[" ) ;
      				var brack2Ind = command.indexOf ( "]" , brack1Ind + 1 ) ;
      				if ( brack1Ind == -1 || brack2Ind == -1 ) {
      					return new TeXGraph.Warning ( "dot expects [number,number] as first argument" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      				var cent = command.slice ( brack1Ind + 1 , brack2Ind ) ;
      				cent = cent.split ( "," ) ;
      				var x = parseFloat ( cent[0] ) ;
      				var y = parseFloat ( cent[1] ) ;
      
      				var type = "o" ;
      				var commaInd = -1 ;
      				command = command.slice ( brack2Ind + 1 ) ;
      				if ( command.match(/,/) ) {
      					command = command.replace ( /^\s*,\s*/ , "" ) ;
      					commaInd = command.indexOf ( "," ) ;
      					if ( commaInd != -1 ) {
      						type = command.slice ( 0 , commaInd ) ;
      					}
      					else {
      						type = command.slice ( 0 ) ;
      					}
      					type = type.replace ( /\s*/g , "" ) ;
      					if ( type == "VertDash" ) { type = "|" ; }
      				}
      				var fill = false ;
      				if ( commaInd != -1 ) {
      					command = command.slice ( commaInd ) ;
      					if ( command.match(/,/) ) {
      						command = command.replace ( /^\s*,\s*/ , "" ) ;
      						command = command.replace ( /\s*\)\s*$/ , "" ) ;
      						fill = command.replace ( /\s*/g , "" ) ;
      						if ( fill == "no" ) { fill = false ; }
      						else if ( fill == "false" ) { fill = false ; }
      						else if ( fill == "yes" ) { fill = true ; }
      						else if ( fill == "true" ) { fill = true ; }
      					}
      				}
      				fill = eval ( fill ) ;
      				c.drawPoint ( [x,y] , type , fill ) ;
      			}
      			else if ( command.match(/^plot\s*\(/i) && dim == 2 ) {
      				var plot = TeXGraph.Graph.parsePlot ( command ) ;
      				c.drawFunction ( plot.indVar , plot.f , plot.min , plot.max , plot.endpoints ) ;
      			}
      			else if ( command.match(/^fillplot\s*\(/i) && dim == 2 ) {
      				command = command.replace ( /^\s*fillplot\s*\(/ , "" ) ;
      				command = command.replace ( /\s*\)\s*$/ , "" ) ;
      				var plot1Index = command.indexOf ( "plot" ) ;
      				var plot2Index = command.indexOf ( "plot" , plot1Index + 4 ) ;
      				if ( plot1Index == -1 || plot2Index == -1 ) {
      					return new TeXGraph.Warning ( "fillplot requires 2 plot commands" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      
      				var plot1 = TeXGraph.Graph.parsePlot ( command.slice(0,plot2Index) ) ;
      				var plot2 = TeXGraph.Graph.parsePlot ( command.slice(plot2Index) ) ;
      
      				c.fillBetweenFunctions ( [plot1.indVar,plot2.indVar] , [plot1.f,plot2.f] , [plot1.min,plot2.min] , [plot1.max,plot2.max] ) ;
      			}
      			else if ( command.match(/^text\s*\(/i) && dim == 2 ) {
      				var tmp = command.replace ( /^text\s*\(/i , "" ) ;
      				tmp = tmp.replace ( /\)/ , "" ) ;
      				var args = tmp.split ( "," ) ;
      				var anchor = [xmin,ymin] ;
      				if ( args[1] && args[2] ) {
      					anchor = [ parseFloat(eval(args[1].replace(/\[/,""))) , parseFloat(eval(args[2].replace(/\]/,""))) ] ;
      				}
      				c.drawString ( args[0] , anchor[0] , anchor[1] ) ;
      			}
      			else if ( command.match(/^footer\s*\(/i) && dim == 2 ) {
      				var tmp = command.replace ( /^footer\s*\(/i , "" ) ;
      				tmp = tmp.replace ( /\)\s*$/ , "" ) ;
      
      				tmp = tmp.replace ( /\$/g , "`" ) ;
      				var ind = tmp.indexOf ( "`" ) ;
      				var ind2 = tmp.indexOf ( "`" , ind + 1 ) ;
      				if ( ind == -1 || ind2 == -1 ) {
      					return new TeXGraph.Warning ( "footer expects its argument to be enclosed within ` ` or $ $" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      				var str = tmp.slice ( ind , ind2 + 1 ) ;
      
      				tmp = tmp.slice ( ind2 + 2 ) ;
      				tmp = tmp.replace ( /^\s*,\s*/ , "" ) ;
      				var args = tmp.split ( "," ) ;
      				var xFactor = parseFloat ( (!args[0]) ? 0.5 : args[0] ) ;
      				var yFactor = parseFloat ( (!args[1]) ? 0.5 : args[1] ) ;
      				var anchor = [ xmin , ymin - (TeXGraph.Symbol.maxAscent+TeXGraph.Symbol.maxDescent)*yFactor ] ;
      				var dim = TeXGraph.MathML.writeMathML ( str , c , [anchor[0],anchor[1]-10*(ymax-ymin)] , xFactor , yFactor , 0 , 0 ) ;
      				var wPoint1 = c.toWindowCoordinates ( {x:c.xmin,y:0-(dim.ascent+dim.descent)} ) ;
      				var wPoint2 = c.toWindowCoordinates ( {x:TeXGraph.Math.max(c.xmin+dim.width,c.xmax),y:0} ) ;
      				updatedHeight += TeXGraph.Math.abs ( wPoint2.y - wPoint1.y ) ;
      				updatedWidth = ( wPoint2.x - wPoint1.x ) ;
      				var currentColor = color ;
      				var dx = 0 ;
      				dx = ( (xmax-xmin) - dim.width ) / 2 ;
      				if ( dx >= 0 ) {
      					dx -= 2*TeXGraph.Symbol.getSpaceWidth ( xFactor ) ;
      				}
      				c.setColor ( currentColor ) ;
      				TeXGraph.MathML.writeMathML ( str , c , [xmin+dx,anchor[1]] , xFactor , yFactor , 0 , 0 ) ;
      			}
      			else if ( command.match(/^mtext\s*\(/i) && dim == 2 ) {
      				var tmp = command.replace ( /^mtext\s*\(/i , "" ) ;
      				tmp = tmp.replace ( /\)\s*$/ , "" ) ;
      
      				tmp = tmp.replace ( /\$/g , "`" ) ;
      				var ind = tmp.indexOf ( "`" ) ;
      				var ind2 = tmp.indexOf ( "`" , ind + 1 ) ;
      				if ( ind == -1 || ind2 == -1 ) {
      					return new TeXGraph.Warning ( "mtext expects its first argument to be enclosed within ` ` or $ $" , "TeXGraph.Graph.processGraphs" ) ;
      				}
      				var str = tmp.slice ( ind , ind2 + 1 ) ;
      				tmp = tmp.slice ( ind2 + 2 ) ;
      				tmp = tmp.replace ( /^\s*,\s*/ , "" ) ;
      				var args = tmp.split ( "," ) ;
      				var anchor = [xmin,ymin] ;
      				if ( args[0] && args[1] ) {
      					anchor = [ parseFloat(eval(args[0].replace(/\[/,""))) , parseFloat(eval(args[1].replace(/\]/,""))) ] ;
      				}
      				var xFactor = (!args[2]) ? 1 : parseFloat ( args[2] ) ;
      				var yFactor = (!args[3]) ? 1 : parseFloat ( args[3] ) ;
      				var rotate = (!args[4]) ? 0 : parseFloat ( args[4] ) ;
      			}
      			else if ( command.match(/^partition\s*\(/i) && dim == 3 ) {
      				command = command.replace ( /\s*partition\s*\(/i , "" )	;
      				command = command.replace ( /\s*\)\s*$/ , "" ) ;
      
      				command = command.split ( "," ) ;
      				if ( command.length != 3 ) {
      					return new TeXGraph.Warning ( "partition requires 3 integer arguments" , "TeXGraph.Graph.processGraphs()" ) ;
      				}
      				c3d.setPartitions ( parseInt(command[0]) , parseInt(command[1]) , parseInt(command[2]) ) ;
      			}
      			else if ( command.match(/^viewer\s*\(/i) && dim == 3 ) {
      				command = command.replace ( /\s*viewer\s*\(/i , "" ) ;
      				command = command.replace ( /\s*\)\s*$/ , "" ) ;
      
      				command = command.split ( "," ) ;
      				if ( command.length != 2 ) {
      					return new TeXGraph.Warning ( "view requires 2 float arguments" , "TeXGraph.Graph.processGraphs()" ) ;
      				}
      				viewer = [ parseFloat(command[0]) , parseFloat(command[1]) ] ;	
      			}
      			else if ( command.match(/^plot3d\s*\(/i) && dim == 3 ) {
      
      				var plot = TeXGraph.Graph.parsePlot3D ( command ) ;
      
      				if ( plot.type.match(/rect/i) ) {
      					c3d.drawRectSurface ( plot.depVar , plot.func , plot.domain.replace(/\s*/g,"") ) ;
      				}
      				else if ( plot.type.match(/cyl/i) ) {
      					c3d.drawCylSurface ( plot.depVar , plot.func , plot.domain.replace(/\s*/g,"") ) ;
      				}
      				else if ( plot.type.match(/sph/i) ) {
      					c3d.drawSphSurface ( plot.depVar , plot.func , plot.domain.replace(/\s*/g,"") ) ;
      				}
      				else if ( plot.type.match(/param/i) ) {
      					c3d.drawParamSurface ( plot.zxy , plot.xst , plot.yst , eval(plot.smin) , eval(plot.smax) , eval(plot.tmin) , eval(plot.tmax) ) ;
      				}
      				else if ( plot.type.match(/vvf/i) ) {
      					c3d.drawVectorValuedFunction ( plot.xt , plot.yt , plot.zt , eval(plot.tmin) , eval(plot.tmax) ) ;
      				}
      
      			}
      		}
      		var iframe = w.iframe ;
      		var node = w.node ;
      		if ( TeXGraph.Util.isIE ) {
      			iframe.width = updatedWidth + 20 ;
      			iframe.height = ( updatedHeight == height ) ? updatedHeight + 15 : updatedHeight ;
      		}
      		else {
      			iframe.setAttribute ( "width" , updatedWidth + 20 ) ;
      			iframe.setAttribute ( "height" , ( updatedHeight == height ) ? updatedHeight + 15 : updatedHeight ) ;
      		}
      
      		if ( dim == 3 ) {
      			c3d.autoCenter ( ) ;
      			c3d.changeViewer ( viewer[0] , viewer[1] ) ;
      			c3d.changeLight ( -30 , 30 ) ;
      			c3d.orderWeight ( null , null , 0.01 ) ;
      			c3d.draw ( ) ;
      			if ( axesLabels3D ) {
      				c3d.drawAxesLabels ( axesLabels3D[0] , axesLabels3D[1] , axesLabels3D[2] ) ;
      			}
      		}
      
      		if ( TeXGraph.Util.isIE ) { c.canvas.fixIEOpacity ( true ) ; }
      		c.paint ( ) ;
      		w.insertWindow ( graph.parentNode , graph ) ;
      		if ( dim == 3 && showControls ) {
      
      			var ind = c3d.canvasIndex ;
      			var can = "TeXGraph.Canvas3D.Canvases" ;
      			var formStr = "" ;
      			originalScript = originalScript.replace ( /(\n|\r|\f|\v)*/g , "" ) ;
      			originalScript = originalScript.replace ( /(\t)*/g , "" ) ;
      
      			if ( TeXGraph.Util.isIE ) {
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='&lt;=' title='move viewer position left' \>" ;
      				//formStr += "<br />" ;
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(-10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='^' title='move viewer position up' \>" ;
      				//formStr += "<br />" ;
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='v' title='move viewer position down' \>" ;
      				//formStr += "<br />" ;
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,-5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='=&gt;' title='move viewer position right' \>" ;
      
      			}
      			else {
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='&lt;=' title='move viewer position left' \>" ;
      				formStr += "<br />" ;
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(-10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='^' title='move viewer position up' \>" ;
      				formStr += "<br />" ;
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='v' title='move viewer position down' \>" ;
      				formStr += "<br />" ;
      				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,-5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='=&gt;' title='move viewer position right' \>" ;
      
      			}
      
      			var d = document.createElement ( "div" ) ;
      			d.innerHTML = formStr ;
      			if ( TeXGraph.Util.isIE ) {
      				w.iframe.parentNode.insertBefore ( d , w.iframe ) ;
      				w.node.setAttribute ( "style" , "position:relative;display:inline;" ) ;
      				d.setAttribute ( "style" , "position:relative;display:inline;" ) ;
      			}
      			else {
      				TeXGraph.Util.insertAfterNode ( d , w.iframe ) ;
      				d.setAttribute ( "style" , "position:relative;display:inline-block;" ) ;
      			}
      		}
      		graphs = TeXGraph.Util.getElementsByClass ( document.body , "div" , "TeXGraphGraph" ) ;
      
      	}
      };
      TeXGraph.Graph.processFirstSetOfDelimiters = function ( str ) {
      
      	if ( ! str ) {
      		return new TeXGraph.Warning ( "missing delimiters or string to process" , "TeXGraph.Graph.processFirstSetOfDelimiters" ) ;
      	}
      	str = str.replace ( /\$/g , "`" ) ;
      	var ind = str.indexOf ( "`" ) ;
      	var ind2 = str.indexOf ( "`" , ind + 1 ) ;
      	if ( ind == -1 || ind2 == -1 ) {
      		return new TeXGraph.Warning ( "plot expects its first argument to be enclosed within ` ` or $ $" , "TeXGraph.Graph.processFirstSetOfDelimiters" ) ;
      	}
      	var math = str.slice ( ind + 1 , ind2 ) ;
      	str = str.slice ( 0 , ind ) + "\"" + str.slice ( ind + 1 , ind2 ) + "\"" + str.slice ( ind2 + 1 ) ;
      	return {math:math,str:str} ;
      };
      
      TeXGraph.Graph.parsePlot = function ( command ) {
      
      	var obj = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      	command = obj.str ;
      	var mathMarkup = obj.math ;
      	if ( ! command.match(/`/) ) {
      		var depVar = command.match(/(x|y|r|theta)\s*=/)[1];
      		var indVar ;
      		if ( depVar == "x" ) { indVar = "y" ; }
      		else if ( depVar == "y" ) { indVar = "x" ; }
      		else if ( depVar == "r" ) { indVar = "theta" ; }
      		else if ( depVar == "theta" ) { indVar = "r" ; }
      		command = command.replace ( new RegExp( depVar + "\\s*=\\s*" ) , "" ) ;
      		var ind = command.indexOf ( "\"" ) ;
      		var ind2 = command.indexOf ( "\"" , ind + 1 ) ;
      		var f = command.slice(ind,ind2).replace ( new RegExp( depVar + "\\s*=\\s*" ) , "" ) ;
      		var qInd1 = command.indexOf ( "\"" ) ;	
      		var qInd2 = command.indexOf ( "\"" , qInd1 + 1 ) ;
      		//var tmp2 = command.slice ( qInd2 + 2 ) ;
      		var tmp2 = command.slice ( qInd2 + 1 ) ;
      		tmp2 = tmp2.replace ( /^\s*,\s*/ , "" ) ;
      		tmp2 = tmp2.replace ( /\s*\)\s*$/ , "" ) ;
      		tmp2 = tmp2.replace ( /\s*/g , "" ) ;
      		tmp2 = tmp2.split ( "," ) ;
      		var min , max ;
      		if ( tmp2[0] == null || tmp2[1] == null ) {
      			min = null ;
      			max = null ;
      		}
      		else {
      			min = parseFloat ( eval ( TeXGraph.Math.ascii2JS(tmp2[0]) ) ) ;
      			max = parseFloat ( eval ( TeXGraph.Math.ascii2JS(tmp2[1]) ) ) ;
      		}
      
      		var endpoints = null ;
      		if ( tmp2[2] != null ) {
      			endpoints = tmp2[2] ;
      		}
      
      		return { indVar:indVar , f:f.replace(/"/g,"") , min:min , max:max , endpoints:endpoints } ;
      	}
      	else {
      		var depVar = ["x","y"] ;
      		var indVar = "t" ;
      		var f = [] ;
      
      		command = command.replace ( new RegExp( depVar[0] + "\\s*=\\s*" ) , "" ) ;
      		var ind = command.indexOf ( "\"" ) ;
      		var ind2 = command.indexOf ( "\"" , ind + 1 ) ;
      		f[0] = command.slice(ind,ind2).replace ( new RegExp( depVar[0] + "\\s*=\\s*" ) , "" ) ;
      
      		var obj2 = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      		command = obj2.str ;
      		var mathMarkup2 = obj2.math ;
      
      		command = command.replace ( new RegExp( depVar[1] + "\\s*=\\s*" ) , "" ) ;
      		var ind = command.indexOf ( "\"" ) ;
      		var ind2 = command.indexOf ( "\"" , ind + 1 ) ;
      		var ind3 = command.indexOf ( "\"" , ind2 + 1 ) ;
      		var ind4 = command.indexOf ( "\"" , ind3 + 1 ) ;
      		f[1] = command.slice(ind3,ind4+1).replace ( new RegExp( depVar[1] + "\\s*=\\s*" ) , "" ) ;
      		var qInd1 = ind3 ;
      		var qInd2 = ind4 ;
      		var tmp2 = command.slice ( qInd2 + 1 ) ;
      		tmp2 = tmp2.replace ( /^\s*,\s*/ , "" ) ;
      		tmp2 = tmp2.replace ( /\s*\)\s*$/ , "" ) ;
      		tmp2 = tmp2.replace ( /\s*/g , "" ) ;
      		tmp2 = tmp2.split ( "," ) ;
      		var min , max ;
      		if ( tmp2[0] == null || tmp2[1] == null ) {
      			min = null ;
      			max = null ;
      		}
      		else {
      			min = parseFloat ( eval ( TeXGraph.Math.ascii2JS(tmp2[0]) ) ) ;
      			max = parseFloat ( eval ( TeXGraph.Math.ascii2JS(tmp2[1]) ) ) ;	
      		}
      
      		var endpoints = null ;
      		if ( tmp2[2] != null ) {
      			endpoints = tmp2[2] ;
      		}
      		return { indVar:indVar , f:[f[0].replace(/"/g,""),f[1].replace(/"/g,"")] , min:min , max:max , endpoints:endpoints } ;
      	}
      
      };
      
      TeXGraph.Graph.parsePlot3D = function ( command ) {
      
      	var arr = command.split ( "," ) ;
      	if ( ! arr[0].match(/rect|cyl|sph|param|vvf/i) ) {
      
      		return new TeXGraph.Warning ( "plot3D expects first argument to be rect, cyl, sph, param, or vvf" , "TeXGraph.Graph.parsePlot3D" ) ;
      	}
      
      	var type = arr[0] ;
      	var depVar = "" ;
      	var func = "" ;
      	var domain = "" ;
      
      	var obj = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      	command = obj.str ;
      	var mathMarkup = obj.math ;
      	if ( type.match(/rect|cyl|sph/i) ) {
      		var tmp = mathMarkup.split ( "=" ) ;
      		depVar = tmp[0] ;
      		func = tmp[1] ;
      		if ( arr.length == 3 ) {
      			obj = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      			command = obj.str ;
      			mathMarkup = obj.math ;
      			domain = mathMarkup ;
      		}
      		return { type:type , depVar:depVar , func:func , domain:domain } ;
      	}
      
      	var zfunc = "" ;
      	var xfunc = "" ;
      	var yfunc = "" ;
      	if ( type.match(/param/i) ) {
      		var tmp = mathMarkup.split ( "=" ) ;
      		zfunc = tmp[1] ;
      		obj = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      		command = obj.str ;
      		mathMarkup = obj.math ;
      
      		tmp = mathMarkup.split ( "=" ) ;
      		xfunc = tmp[1] ;
      		obj = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      		command = obj.str ;
      		mathMarkup = obj.math ;
      
      		tmp = mathMarkup.split ( "=" ) ;
      		yfunc = tmp[1] ;
      
      		return { type:type , zxy:zfunc , xst:xfunc , yst:yfunc , smin:parseFloat(arr[4]) , smax:parseFloat(arr[5]) , tmin:parseFloat(arr[6]) , tmax:parseFloat(arr[7]) } ;
      	}
      
      	var xfunc = "" ;
      	var yfunc = "" ;
      	var zfunc = "" ;
      	if ( type.match(/vvf/i) ) {
      		var tmp = mathMarkup.split ( "=" ) ;
      		xfunc = tmp[1] ;
      		obj = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      		command = obj.str ;
      		mathMarkup = obj.math ;
      
      		tmp = mathMarkup.split ( "=" ) ;
      		yfunc = tmp[1] ;
      		obj = TeXGraph.Graph.processFirstSetOfDelimiters ( command ) ;
      		command = obj.str ;
      		mathMarkup = obj.math ;
      
      		tmp = mathMarkup.split ( "=" ) ;
      		zfunc = tmp[1] ;
      
      		return { 
            type:type , 
            xt:xfunc , 
            yt:yfunc , 
            zt:zfunc , 
            tmin:parseFloat(arr[4]) , 
            tmax:parseFloat(arr[5]) 
          } ;
      	}
      };
}());      
