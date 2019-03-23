function Viewer3D(CanvasId) {
  var t = this;
  t.CanvasId = CanvasId;
  t.dfi = .01;
  t.theta = .5;
  t.phi = 1.2;
  t.centr = [];
  t.vert1 = [];
  t.Norm = [];
  t.Norm1z = [];
  t.Vsort = [];
  t.hue = [];
  t.axes = [];
  t.axes1 = [];
  t.ticks = [];
  t.numticks = [];
  t.axisscl = [];
  t.ticksize = [];
  t.axeslabels = [];
  t.Vsortface = [];
  t.bndbox = [];
  t.bndbox1 = [];
  t.axlbl = [];
  t.iscurve = false;
  t.geoms = [];
  t.xmin = 1e10;
  t.xmax = -1e10;
  t.ymin = 1e10;
  t.ymax = -1e10;
  t.zmin = 1e10;
  t.zmax = -1e10;

  t.showaxes = true;
  t.showedges = true;
  t._mouseisdown = false;
  t._inrender = false;
  
  t.Canvas = document.getElementById(CanvasId);

  t.context = t.Canvas.getContext("2d");
  t.context.fillStyle = "#FFFFFF";
  t.context.fillRect(0, 0, t.swidth, t.sheight);

  t.Canvas.onmousedown = function(e) {t.setMouseDown(e)};
  t.Canvas.ontouchstart = function(e) {t.setTouchDown(e)};
  t.Canvas.onmouseup = function(e) {t.setMouseUp(e)};
  t.Canvas.touchend = function(e) {t.setMouseUp(e)};
  t.Canvas.onmousemove = function(e) {t.doMouseMove(e)};
  t.Canvas.touchmove = function(e) {t.doMouseMove(e)};

  t.context.font = "10px sans-serif";
  t.context.textAlign = "center";
  t.context.textBaseline = "middle";
}

Viewer3D.prototype.updateGeometry = function updateGeometry(geoms, bounds) {
  var t = this;
  t.swidth = document.getElementById(t.CanvasId).getAttribute("width");
  t.sheight = document.getElementById(t.CanvasId).getAttribute("height");
  var fontsize = Math.floor(Math.max(10, Math.min(14, t.sheight/30)));
  t.context.font = fontsize+"px sans-serif";
  t.geoms = geoms;
  t.bounds = bounds;

  //Parse the parameters  
  for (j in t.geoms) {
    if (t.geoms[j].hidden==true) {continue;}
    if (!t.geoms[j].hasOwnProperty("vert") || t.geoms[j].vert === null || t.geoms[j].vert.length==0) {
      continue;
    }
    t.geoms[j].iscurve = (t.geoms[j].face===null);
    t.geoms[j].vert1 = [];
    t.geoms[j].Norm = [];
    t.geoms[j].Norm1z = [];
    t.geoms[j].hue = [];
    
    for (i=0; i<t.geoms[j].vert.length; i++) {
      //t.vert[i] = t.splitfloat(t.vert[i]);
      t.geoms[j].vert1[i] = [];
    }
    t.geoms[j].xmin = t.geoms[j].vert[0][0];
    t.geoms[j].xmax = t.geoms[j].vert[0][0];
    t.geoms[j].ymin = t.geoms[j].vert[0][1];
    t.geoms[j].ymax = t.geoms[j].vert[0][1];
    t.geoms[j].zmin = t.geoms[j].vert[0][2];
    t.geoms[j].zmax = t.geoms[j].vert[0][2];
    for (i=0; i<t.geoms[j].vert.length; i++) {
      if (t.geoms[j].vert[i][0]<t.geoms[j].xmin) {t.geoms[j].xmin=t.geoms[j].vert[i][0];}
      if (t.geoms[j].vert[i][0]>t.geoms[j].xmax) {t.geoms[j].xmax=t.geoms[j].vert[i][0];}
      if (t.geoms[j].vert[i][1]<t.geoms[j].ymin) {t.geoms[j].ymin=t.geoms[j].vert[i][1];}
      if (t.geoms[j].vert[i][1]>t.geoms[j].ymax) {t.geoms[j].ymax=t.geoms[j].vert[i][1];}
      if (t.geoms[j].vert[i][2]<t.geoms[j].zmin) {t.geoms[j].zmin=t.geoms[j].vert[i][2];}
      if (t.geoms[j].vert[i][2]>t.geoms[j].zmax) {t.geoms[j].zmax=t.geoms[j].vert[i][2];}
    }
  }
  if (t.bounds.length==6) {
    t.xmin = t.bounds[0];
    t.xmax = t.bounds[1];
    t.ymin = t.bounds[2];
    t.ymax = t.bounds[3];
    t.zmin = t.bounds[4];
    t.zmax = t.bounds[5];
  } else {
    t.xmin = 1e10;
    t.xmax = -1e10;
    t.ymin = 1e10;
    t.ymax = -1e10;
    t.zmin = 1e10;
    t.zmax = -1e10;
    for (j in t.geoms) {
      if (t.geoms[j].hidden==true) {continue;}
      if (t.geoms[j].xmin<t.xmin) {t.xmin=t.geoms[j].xmin;}
      if (t.geoms[j].xmax>t.xmax) {t.xmax=t.geoms[j].xmax;}
      if (t.geoms[j].ymin<t.ymin) {t.ymin=t.geoms[j].ymin;}
      if (t.geoms[j].ymax>t.ymax) {t.ymax=t.geoms[j].ymax;}
      if (t.geoms[j].zmin<t.zmin) {t.zmin=t.geoms[j].zmin;}
      if (t.geoms[j].zmax>t.zmax) {t.zmax=t.geoms[j].zmax;}
    }
  }
   
  //initialize
  var daxis = [];
  
  t.centr[0] = (t.xmax+t.xmin)/2;
  t.centr[1] = (t.ymax+t.ymin)/2;
  t.centr[2] = (t.zmax+t.zmin)/2;
  
  t.w2 = t.swidth/2;
  t.h2 = t.sheight/2;

  t.scale = 1.0*Math.min(t.w2,t.h2) / (1.8*Math.min(t.xmax-t.centr[0],t.ymax-t.centr[1],t.zmax-t.centr[2]));
  
  //set up bounding box.  Corners:
  // 0:(t.xmin,t.ymin,t.zmin), 1:(t.xmax,t.ymin,t.zmin), 2:(t.xmin,t.ymax,t.zmin), 3:(t.xmax,t.ymax,t.zmin)
  // 4:(t.xmin,t.ymin,t.zmax), 5:(t.xmax,t.ymin,t.zmax), 6:(t.xmin,t.ymax,t.zmax), 7:(t.xmax,t.ymax,t.zmax)
  for (var i=0; i < 8; i++) {
    t.bndbox[i] = [];
    t.bndbox1[i] = [];
    if ((i & 1)==0) {t.bndbox[i][0]=t.xmin;} else {t.bndbox[i][0]=t.xmax;}
    if ((i & 2)==0) {t.bndbox[i][1]=t.ymin;} else {t.bndbox[i][1]=t.ymax;}
    if ((i & 4)==0) {t.bndbox[i][2]=t.zmin;} else {t.bndbox[i][2]=t.zmax;}
  }
  daxis[0] = (t.xmax-t.xmin);
  daxis[1] = (t.ymax-t.ymin);
  daxis[2] = (t.zmax-t.zmin);
    
  t.axlbl[0] = "x";
  t.axlbl[1] = "y";
  t.axlbl[2] = "z";
  
  
  var basescale = Math.min(daxis[0],daxis[1],daxis[2]);
  for (i=0; i<3;i++) {
    t.axisscl[i] = basescale/daxis[i];
  }
  t.cam = 10*basescale;
    
    
  var start = [];
  var pow10;
  var scl;
  var ticks = [];
  var powscl = [];
  for (i=0; i<3; i++) {
    pow10 = Math.floor(Math.log(daxis[i])/Math.LN10);
    scl = daxis[i]/Math.pow(10,pow10);
    if (pow10<1) {
      powscl[i] = Math.pow(10,-pow10 + 1);
    } 
    else {
      powscl[i] = 1;
    }
    if (scl==1) {
      ticks[i] = .2;
    } 
    else if (scl<2) {
      ticks[i] = .2;
    } 
    else if (scl<5) {
      ticks[i] = .5;
    } 
    else {
      ticks[i] = 1;
    }
    ticks[i] *= Math.pow(10,pow10);
    if (pow10>0) {
      ticks[i] = Math.round(ticks[i]);
    }
    if (t.bndbox[0][i]<0) {
      start[i] = Math.ceil(t.bndbox[0][i]/ticks[i]);
    } 
    else {
      start[i] = Math.floor(t.bndbox[0][i]/ticks[i]);
    }
    t.numticks[i] = Math.floor(daxis[i]/ticks[i]);
    if (ticks[i]*(start[i]+t.numticks[i]) < t.bndbox[7][i]) {
      t.numticks[i]++;
    }
    t.ticksize[i] = ticks[i]/10;
  }
  
  for (i=0;i<3;i++) {
    t.axes[i] = [];  //axes[0..2][0..numtick][0..3][0..2]
    t.axes1[i] = [];
    t.axeslabels[i] = [];
    for (var j=0;j<t.numticks[i];j++) {
      t.axes[i][j] = [];
      t.axes1[i][j] = [];
      for (var k=0; k<4;k++) {
        t.axes[i][j][k] = [];
        t.axes1[i][j][k] = [];
        if (powscl[i]==1) {
          t.axes[i][j][k][i] = ticks[i]*(j+start[i]);
        } else {
          t.axes[i][j][k][i] = Math.round(powscl[i]*ticks[i]*(j+start[i]))/powscl[i];
        }
      }
    
      t.axeslabels[i][j] = t.axes[i][j][0][i];
    }
  }
  
  for (j in t.geoms) {
      if (t.geoms[j].hidden==true) {continue;}
    if (!t.geoms[j].hasOwnProperty("vert") || t.geoms[j].vert === null || t.geoms[j].vert.length==0) {
      continue;
    }
    if (t.geoms[j].iscurve) {
      for (i=0; i<t.geoms[j].vert.length; i++) {
        t.geoms[j].hue[i] = t.geoms[j].vert[i][2] - t.geoms[j].zmin;
        t.geoms[j].hue[i] /= (t.geoms[j].zmax-t.geoms[j].zmin + .0001);
      }
    } 
    else {
      var mod;
      for (i=0; i< t.geoms[j].face.length; i++) {
        t.geoms[j].Norm[i] = [];
        t.geoms[j].Norm1z[i] = [];
        t.geoms[j].Norm[i][0] =
          (t.geoms[j].vert[t.geoms[j].face[i][1]][1] - t.geoms[j].vert[t.geoms[j].face[i][0]][1])*
          (t.geoms[j].vert[t.geoms[j].face[i][2]][2] - t.geoms[j].vert[t.geoms[j].face[i][1]][2]) -
          (t.geoms[j].vert[t.geoms[j].face[i][2]][1] - t.geoms[j].vert[t.geoms[j].face[i][1]][1])*
          (t.geoms[j].vert[t.geoms[j].face[i][1]][2] - t.geoms[j].vert[t.geoms[j].face[i][0]][2]);
        
        t.geoms[j].Norm[i][1] = 
         -(t.geoms[j].vert[t.geoms[j].face[i][1]][0] - t.geoms[j].vert[t.geoms[j].face[i][0]][0])*
          (t.geoms[j].vert[t.geoms[j].face[i][2]][2] - t.geoms[j].vert[t.geoms[j].face[i][1]][2]) +
          (t.geoms[j].vert[t.geoms[j].face[i][2]][0] - t.geoms[j].vert[t.geoms[j].face[i][1]][0])*
          (t.geoms[j].vert[t.geoms[j].face[i][1]][2] - t.geoms[j].vert[t.geoms[j].face[i][0]][2]);
        t.geoms[j].Norm[i][2] = 
          (t.geoms[j].vert[t.geoms[j].face[i][1]][0] - t.geoms[j].vert[t.geoms[j].face[i][0]][0])*
          (t.geoms[j].vert[t.geoms[j].face[i][2]][1] - t.geoms[j].vert[t.geoms[j].face[i][1]][1]) -
          (t.geoms[j].vert[t.geoms[j].face[i][2]][0] - t.geoms[j].vert[t.geoms[j].face[i][1]][0])*
          (t.geoms[j].vert[t.geoms[j].face[i][1]][1] - t.geoms[j].vert[t.geoms[j].face[i][0]][1]);
        
        mod = Math.sqrt(
                t.geoms[j].Norm[i][0]*t.geoms[j].Norm[i][0] + 
                t.geoms[j].Norm[i][1]*t.geoms[j].Norm[i][1] + 
                t.geoms[j].Norm[i][2]*t.geoms[j].Norm[i][2]
              );// / 255.5;
        
        t.geoms[j].Norm[i][0] /= mod;
        t.geoms[j].Norm[i][1] /= mod;
        t.geoms[j].Norm[i][2] /= mod;
        
        t.geoms[j].Norm[i][0] *= t.axisscl[0];
        t.geoms[j].Norm[i][1] *= t.axisscl[1];
        t.geoms[j].Norm[i][2] *= t.axisscl[2];
        
        t.geoms[j].hue[i] = (1*t.geoms[j].vert[t.geoms[j].face[i][0]][2] + 1*t.geoms[j].vert[t.geoms[j].face[i][1]][2] + 1*t.geoms[j].vert[t.geoms[j].face[i][2]][2] )/3 - t.geoms[j].zmin;
        
        t.geoms[j].hue[i] /= (t.geoms[j].zmax-t.geoms[j].zmin+.0001);
      }
    }
  }
    
  t.rotate();
  t.paint();
} //end init

Viewer3D.prototype.splitfloat = function(s) {
  var a = s.split(',');
  for (var i=0;i<a.length;i++) {
    a[i] = parseFloat(a[i]);
  }
  return a;
}

Viewer3D.prototype.setMouseDown = function(e) {
  var t = this;
  t._eventtype = "mouse";
  t.Canvas.style.cursor="";
  t._mouseisdown = true;
  var offset = {top: t.Canvas.getBoundingClientRect().top + document.body.scrollTop,left: t.Canvas.getBoundingClientRect().left + document.body.scrollLeft}
  t.mx0 = e.pageX - offset.left;
  t.my0 = e.pageY - offset.top;
}
Viewer3D.prototype.setTouchDown = function(e) {;
  var t = this;
  t._eventtype = "touch";
  t._mouseisdown = true;
  var offset = {top: t.Canvas.getBoundingClientRect().top + document.body.scrollTop,left: t.Canvas.getBoundingClientRect().left + document.body.scrollLeft}
  var touch = e.originalEvent.changedTouches[0] || e.originalEvent.touches[0];
  t.mx0 = touch.pageX - offset.left;
  t.my0 = touch.pageY - offset.top;
}

Viewer3D.prototype.setMouseUp = function(e) {
  this.Canvas.style.cursor = "move";
  this._mouseisdown = false;
}
Viewer3D.prototype.doMouseMove = function(e) {
  var t = this;
  if (t._mouseisdown && !t._inrender) {
    var offset = {top: t.Canvas.getBoundingClientRect().top + document.body.scrollTop,left: t.Canvas.getBoundingClientRect().left + document.body.scrollLeft}
    if (t._eventtype == "mouse") {
      var mouseX = e.pageX - offset.left;
      var mouseY = e.pageY - offset.top;
    } else {
      var touch = e.originalEvent.changedTouches[0] || e.originalEvent.touches[0];
      var mouseX = touch.pageX - offset.left;
      var mouseY = touch.pageY - offset.top;
    }
    t.phi += -t.dfi*(mouseY - t.my0);
    t.theta += -t.dfi*(mouseX-t.mx0);
    t.mx0 = mouseX;
    t.my0 = mouseY;
    t._inrender = true;
    t.rotate();
    t.paint();
    t._inrender = false;
    e.preventDefault();
  }
}
Viewer3D.prototype.rotate = function() {
  var t = this;
  var ct = Math.cos(t.theta);
  var st = Math.sin(t.theta);
  var cf = Math.cos(t.phi);
  var sf = Math.sin(t.phi);
  var m00 = t.scale*ct*sf;
  var m01 = t.scale*st*sf;
  var m02 = t.scale*cf;
  var m10 = -1*t.scale*st;
  var m11 = t.scale*ct;
  var m12 = 0;
  var m20 = -1*t.scale*ct*cf;
  var m21 = -1*t.scale*st*cf;
  var m22 = t.scale*sf;
  var x; 
  var y;
  var z;
  
  //rotate and project the geometry
  for (j in t.geoms) {
    if (t.geoms[j].hidden==true) {continue;}
    if (!t.geoms[j].hasOwnProperty("vert") || t.geoms[j].vert === null || t.geoms[j].vert.length==0) {
      continue;
    }
    for (var i=0; i<t.geoms[j].vert.length; i++) {
      x = t.geoms[j].vert[i][0] - t.centr[0];
      y = t.geoms[j].vert[i][1] - t.centr[1];
      z = t.geoms[j].vert[i][2] - t.centr[2];
      x = x*t.axisscl[0];
      y = y*t.axisscl[1];
      z = z*t.axisscl[2];
          
      t.geoms[j].vert1[i][2] = (m00*x + m01*y + m02*z)/t.scale;
      t.geoms[j].vert1[i][0] = (m10*x + m11*y + m12*z)*(1/(1-t.geoms[j].vert1[i][2]/t.cam));
      t.geoms[j].vert1[i][1] = (m20*x + m21*y + m22*z)*(1/(1-t.geoms[j].vert1[i][2]/t.cam));
    }
  }

  //rotate bounding box
  var maxbbyv = -1*t.h2;
  var maxbbxv = -1*t.w2;
  var maxbby = 0; var maxbbx = 0;
  for (i=0; i<8; i++) {
    x = t.bndbox[i][0]-t.centr[0];
          y = t.bndbox[i][1]-t.centr[1];
    z = t.bndbox[i][2]-t.centr[2];
    x = x*t.axisscl[0];
    y = y*t.axisscl[1];
    z = z*t.axisscl[2];
    
    t.bndbox1[i][2] = (m00*x + m01*y + m02*z)/t.scale;
    t.bndbox1[i][0] = (m10*x + m11*y + m12*z)*(1/(1-t.bndbox1[i][2]/t.cam));
    t.bndbox1[i][1] = (m20*x + m21*y + m22*z)*(1/(1-t.bndbox1[i][2]/t.cam));
    if (t.bndbox1[i][0]>maxbbxv) { maxbbx = i; maxbbxv = t.bndbox1[i][0];}
    if (t.bndbox1[i][1]>maxbbyv) { maxbby = i; maxbbyv = t.bndbox1[i][1];}
  }
  //adjust side of bounding box t.axes are on
  if ((t.phi>0 && t.phi%3.1415>1.55)||(t.phi<0 && t.phi%3.1415>-1.55)) {
          maxbby = maxbby^7;
  }
      
  for (i=0; i<3;i++) {
      for (var j=0; j<t.numticks[i]; j++) {
    for (var k =0; k<3; k++) {
        if (k!=i) { //
      if (i==2) {
          t.axes[i][j][0][k] = t.bndbox[maxbbx][k];
          t.axes[i][j][1][k] = t.bndbox[maxbbx][k]+((t.bndbox[maxbbx][k]>t.centr[k])?-t.ticksize[k]:t.ticksize[k]);
          t.axes[i][j][2][k] = t.bndbox[maxbbx][k]+2*((t.bndbox[maxbbx][k]>t.centr[k])?t.ticksize[k]:-t.ticksize[k]);
          t.axes[i][j][3][k] = t.bndbox[maxbbx][k]+6*((t.bndbox[maxbbx][k]>t.centr[k])?t.ticksize[k]:-t.ticksize[k]);
      } else {
          t.axes[i][j][0][k] = t.bndbox[maxbby][k];
          t.axes[i][j][1][k] = t.bndbox[maxbby][k]+((t.bndbox[maxbby][k]>t.centr[k])?-t.ticksize[k]:t.ticksize[k]);
          t.axes[i][j][2][k] = t.bndbox[maxbby][k]+3*((t.bndbox[maxbby][k]>t.centr[k])?t.ticksize[k]:-t.ticksize[k]);
          t.axes[i][j][3][k] = t.bndbox[maxbby][k]+7*((t.bndbox[maxbby][k]>t.centr[k])?t.ticksize[k]:-t.ticksize[k]);
      }
        }
    }
      }
  }
  //rotate axes
  for (i=0; i<3;i++) {
      for (j=0; j<t.numticks[i]; j++) {
    for (k=0; k<4; k++) {
        x = t.axes[i][j][k][0]-t.centr[0];
        y = t.axes[i][j][k][1]-t.centr[1];
        z = t.axes[i][j][k][2]-t.centr[2];
        x = x*t.axisscl[0];
        y = y*t.axisscl[1];
        z = z*t.axisscl[2];
        t.axes1[i][j][k][2] = (m00*x + m01*y + m02*z)/t.scale;
        t.axes1[i][j][k][0] = (m10*x + m11*y + m12*z)*(1/(1-t.axes1[i][j][k][2]/t.cam));
        t.axes1[i][j][k][1] = (m20*x + m21*y + m22*z)*(1/(1-t.axes1[i][j][k][2]/t.cam));
    }
      }
  }
  var centerv;
  var cntm = 0;
  t.Vsort = [];
  for (j in t.geoms) {
    if (t.geoms[j].hidden==true) {continue;}
    j *= 1.0;
    if (!t.geoms[j].hasOwnProperty("vert") || t.geoms[j].vert === null || t.geoms[j].vert.length==0) {
      continue;
    }
    if (!t.geoms[j].iscurve) {
      for (i = 0; i < t.geoms[j].face.length; i++) {
        t.geoms[j].Norm1z[i] = ((5*m00+m10-m20)*t.geoms[j].Norm[i][0] + (5*m01+m11-m21)*t.geoms[j].Norm[i][1] + (5*m02+m12-m22)*t.geoms[j].Norm[i][2])/(t.scale*Math.sqrt(27));
        //do t.Vsort -- crappy insertion sort
        centerv = (t.geoms[j].vert1[t.geoms[j].face[i][0]][2] + t.geoms[j].vert1[t.geoms[j].face[i][1]][2] + t.geoms[j].vert1[t.geoms[j].face[i][2]][2] + t.geoms[j].vert1[t.geoms[j].face[i][3]][2])/4;
        t.Vsort.push({c: centerv, g:j, f:i});
        /*if (i>0) {
            for (k=i+cntm-1; k>=0;k--) {
          if (centerv>t.Vsort[k]) {
              t.Vsort[k+1] = centerv;
              t.Vsortface[k+1] = [j, i];
              break;
          } else {
              t.Vsort[k+1] = t.Vsort[k];
              t.Vsortface[k+1] = t.Vsortface[k];
              if (k==0) {t.Vsort[0] = centerv; t.Vsortface[0]=[j,i];}
          }
            }
        } else {
            t.Vsort[0] = centerv;
            t.Vsortface[0] = [j, i];
        }*/
      }
    } else {
      for (i = 0; i < t.geoms[j].vert.length-1; i++) {
        centerv = (t.geoms[j].vert1[i][2] + t.geoms[j].vert1[i+1][2])/2;
        t.Vsort.push({c: centerv, g:j, v:i});
      }
    }
  }
  t.Vsort.sort(function(a,b) {return a.c-b.c;});
} //end rotate()
    
Viewer3D.prototype.paint = function() {
  var t = this;
  
  t.context.fillStyle = "#FFFFFF";
  t.context.fillRect(0, 0, t.swidth, t.sheight);
            
  var bbmin = 0;
  for (var i=0; i<8;i++) {
    if (t.bndbox1[i][2]<t.bndbox1[bbmin][2]) { bbmin = i;}
  }  
        t.context.strokeStyle = "#0000FF";
        t.context.lineWidth = 1;

        t.context.beginPath();

  for (i=0;i<7; i++) {
    for (var j=i+1; j<8; j++) {
      if ((i^j)==1 || (i^j)==2 || (i^j)==4) {
        t.context.moveTo(t.w2+t.bndbox1[i][0],t.h2-t.bndbox1[i][1]);
        t.context.lineTo(t.w2+t.bndbox1[j][0],t.h2-t.bndbox1[j][1]);
      }
    }
  }
  t.context.stroke();
  
        t.context.fillStyle = "#000000";
        if (t.axes1[0].length>0) {
    for (i=0; i<3; i++) {
      t.context.fillText(t.axlbl[i], 
        t.w2+t.axes1[i][Math.floor(t.numticks[i]/2)][3][0],
        t.h2-t.axes1[i][Math.floor(t.numticks[i]/2)][3][1]);
      //need to add axis labels
      if (t.showaxes) {
        for (j=0; j<t.numticks[i]; j++) {
          t.context.beginPath();
          t.context.moveTo(t.w2+t.axes1[i][j][0][0],t.h2-t.axes1[i][j][0][1]);
          t.context.lineTo(t.w2+t.axes1[i][j][1][0],t.h2-t.axes1[i][j][1][1]);
          t.context.stroke();
          if (i==2) {
            t.context.textAlign = "left";
          } 
          t.context.fillText(t.axeslabels[i][j],
            t.w2+t.axes1[i][j][2][0],
            t.h2-t.axes1[i][j][2][1]);
        }
      } 
     }
        }
         t.context.textAlign = "center";
         
         var sf;
         var bright;
         var rgb;

        if (t.Vsort.length > 0) {
     t.context.strokeStyle = "#000000";
     for (i in t.Vsort) {
      sf = t.Vsort[i];
      if (t.geoms[sf.g].iscurve) {
        rgb = t.hsbtorgb(t.geoms[sf.g].hue[sf.v],1.0,0.7);
        t.context.strokeStyle = 'rgb('+rgb.join(',')+')';
        t.context.lineWidth = 3;
        t.context.beginPath();
        t.context.moveTo(t.w2 + t.geoms[sf.g].vert1[sf.v][0],t.h2 - t.geoms[sf.g].vert1[sf.v][1]);
        t.context.lineTo(t.w2 + t.geoms[sf.g].vert1[sf.v+1][0],t.h2 - t.geoms[sf.g].vert1[sf.v+1][1]);
        t.context.stroke();
        t.context.lineWidth = 1;
      } else {
        t.context.strokeStyle = "black";
        bright = .3*Math.abs(t.geoms[sf.g].Norm1z[sf.f])+.7;
        //t.context.beginFill(255*t.hue[i],1);
        t.context.beginPath();
        t.context.moveTo(t.w2 + t.geoms[sf.g].vert1[t.geoms[sf.g].face[sf.f][0]][0],t.h2 - t.geoms[sf.g].vert1[t.geoms[sf.g].face[sf.f][0]][1]);
        rgb = t.hsbtorgb(t.geoms[sf.g].hue[sf.f],1.0,bright);
        t.context.fillStyle = 'rgb('+rgb.join(',')+')';
        for (j=1; j<t.geoms[sf.g].face[sf.f].length; j++) {
          t.context.lineTo(t.w2 + t.geoms[sf.g].vert1[t.geoms[sf.g].face[sf.f][j]][0],t.h2 - t.geoms[sf.g].vert1[t.geoms[sf.g].face[sf.f][j]][1]);
        }
        t.context.closePath();
        t.context.fill();
        t.context.stroke();
      }
        }
  }
            
  //redraw front of t.bndbox
  t.context.strokeStyle = "#0000FF";
  bbmin = bbmin^7;
  t.context.beginPath();
  for (i=0; i<3; i++) {
    t.context.moveTo(t.w2+t.bndbox1[bbmin][0],t.h2-t.bndbox1[bbmin][1]);
    t.context.lineTo(t.w2+t.bndbox1[bbmin^(1<<i)][0],t.h2-t.bndbox1[bbmin^(1<<i)][1]);
  }
  t.context.stroke();
            
} //end paint()
    
//hsbtorgb from http://www.flashguru.co.uk/downloads/ColorConversion.as
Viewer3D.prototype.hsbtorgb = function(hue,saturation,brightness) {
  var red, green, blue;
  hue *= 360;
  if(brightness==0)
  {
    return [0,0,0];
  }
  hue/=60;
  var i = Math.floor(hue);
  var f = hue-i;
  var p = brightness*(1-saturation);
  var q = brightness*(1-(saturation*f));
  var t = brightness*(1-(saturation*(1-f)));
  switch(i)
  {
    case 0:
      red=brightness; green=t; blue=p;
      break;
    case 1:
      red=q; green=brightness; blue=p;
      break;
    case 2:
      red=p; green=brightness; blue=t;
      break;
    case 3:
      red=p; green=q; blue=brightness;
      break;
    case 4:
      red=t; green=p; blue=brightness;
      break;
    case 5:
      red=brightness; green=p; blue=q;
      break;
  }
  red=Math.round(red*255)
  green=Math.round(green*255)
  blue=Math.round(blue*255)
  return [red,green,blue];
}



/* ** */
var geoms = [];
var bounds = [];
var plot3d;
var sliders = {
  varstr: "",
  registry: [],
  dirs: [],
  };
  

document.onreadystatechange = function(){
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  var dim = Math.min(wh-5, ww-325);
  document.getElementById("plot3d").setAttribute("width",dim);
  document.getElementById("plot3d").setAttribute("height",dim);
  plot3d = new Viewer3D("plot3d");
};

function updategraph(gn) {
  updatebounds(true); 
  updatesliderregistry();
  generategeom(gn);
}

function evalbasic(str) {
  with (Math) var res = eval(mathjs(str));
  return res;
}

function updatesliderregistry() {
  var slidervars = [];
  var variable;
  var reg;
  sliders.registry = [];
  for (k in gtypes) {
    if (gtypes[k]=="slider") {
      variable = document.getElementById("var"+k).value;
      if (slidervars.indexOf(variable)!=-1) {continue;}
      if (variable != "") {
        reg = [];
        slidervars.push(variable);
        for (j in gtypes) {
          if (gtypes[j]=="z" || gtypes[j]=="zrt") {
            if (document.getElementById("z"+j).value.match(variable)) {
              reg.push(j);
            }
          } else if (gtypes[j]=="spacecurve" || gtypes[j]=="paramsurf") {
            if (
                document.getElementById("x"+j).value.match(variable) || 
                document.getElementById("y"+j).value.match(variable) || 
                document.getElementById("z"+j).value.match(variable)
              ) {
              reg.push(j);
            }
          }
        }
        sliders.registry[k] = reg;
      }
    }
  }
  if (slidervars.length>0) {
    sliders.varstr = "|"+slidervars.join("|");
  } else {
    sliders.varstr  = "";
  }
}

function generategeom(gn) {
  var isok = true;
  geoms[gn] = {hidden:false};
  var f;
  var verts = [];
  var faces = [];
  var umin = evalbasic(document.getElementById("umin"+gn).value);
  var umax = evalbasic(document.getElementById("umax"+gn).value);
  var disc = evalbasic(document.getElementById("discr"+gn).value);
  var du = (umax - umin)/(disc-1);
  var count = 0;
  var sliderreq = "";
  for (j in sliders.registry) {
    sliderreq += "var "+document.getElementById("var"+j).value+" = "+document.getElementById("slider"+j).value+";";
  }

  if (gtypes[gn] != "spacecurve") {
    var vmin = evalbasic(document.getElementById("vmin"+gn).value);
    var vmax = evalbasic(document.getElementById("vmax"+gn).value);
    var dv = (vmax - vmin)/(disc-1);
  }
  if (gtypes[gn] == "z") {
    var func = document.getElementById("z"+gn).value;
    func = mathjs(func, "x|y"+sliders.varstr);
    try {
      eval("f = function(x,y){ "+sliderreq+" with(Math) return "+func+" }");
      var i,j,u,v,x,y,z;
      for (i=0;i<disc;i++) {
        for (j=0; j<disc; j++) {
          u = umin + du*i;
          v = vmin + dv*j;
          z = f(u,v);
          verts.push([u,v,z]);
        }
      }
      var faces = [];
      for (i=0;i<disc-1;i++) {
        for (j=0; j<disc-1; j++) {
          faces.push([i*disc+j, (i+1)*disc+j, (i+1)*disc+j+1, i*disc+j+1]);
        }
      }
    } catch (e) {
      isok = false;        
    }
    if (isok) {
      geoms[gn].vert = verts;
      geoms[gn].face = faces;
    } 
  } else if (gtypes[gn] == "zrt") {
    var func = document.getElementById("z"+gn).value;
    func = mathjs(func, "r|theta"+sliders.varstr);
    try {
      eval("f = function(r,theta){ "+sliderreq+" with(Math) return "+func+" }");
      var i,j,u,v,x,y,z;
      for (i=0;i<disc;i++) {
        for (j=0; j<disc; j++) {
          u = umin + du*i;
          v = vmin + dv*j;
          z = f(u,v);
          verts.push([u*Math.cos(v),u*Math.sin(v),z]);
        }
      }
      var faces = [];
      for (i=0;i<disc-1;i++) {
        for (j=0; j<disc-1; j++) {
          faces.push([i*disc+j, (i+1)*disc+j, (i+1)*disc+j+1, i*disc+j+1]);
        }
      }
    } catch (e) {
      isok = false;        
    }
    if (isok) {
      geoms[gn].vert = verts;
      geoms[gn].face = faces;
    } 
  } else if (gtypes[gn] == "paramsurf") {
    var funcx = mathjs(document.getElementById("x"+gn).value, 'u|v'+sliders.varstr);
    var funcy = mathjs(document.getElementById("y"+gn).value, 'u|v'+sliders.varstr);
    var funcz = mathjs(document.getElementById("z"+gn).value, 'u|v'+sliders.varstr);
    var isok = true;
    try {
      eval("fx = function(u,v){ "+sliderreq+"  with(Math) return "+funcx+" }");
      eval("fy = function(u,v){ "+sliderreq+"  with(Math) return "+funcy+" }");
      eval("fz = function(u,v){ "+sliderreq+"  with(Math) return "+funcz+" }");
      var i,j,u,v,x,y,z;
      for (i=0;i<disc;i++) {
        for (j=0; j<disc; j++) {
          u = umin + du*i;
          v = vmin + dv*j;
          x = fx(u,v);
          y = fy(u,v)
          z = fz(u,v);
          verts.push([x,y,z]);
        }
      }
      var faces = [];
      for (i=0;i<disc-1;i++) {
        for (j=0; j<disc-1; j++) {
          faces.push([i*disc+j, (i+1)*disc+j, (i+1)*disc+j+1, i*disc+j+1]);
        }
      }
    } catch (e) {
      isok = false;        
    }
    if (isok) {
      geoms[gn].vert = verts;
      geoms[gn].face = faces;
    } 
  } 
  else if (gtypes[gn] == "spacecurve") {
    var funcx = mathjs(document.getElementById("x"+gn).value, 't'+sliders.varstr);
    var funcy = mathjs(document.getElementById("y"+gn).value, 't'+sliders.varstr);
    var funcz = mathjs(document.getElementById("z"+gn).value, 't'+sliders.varstr);
    var isok = true;
    try {
      eval("fx = function(t){ "+sliderreq+"  with(Math) return "+funcx+" }");
      eval("fy = function(t){ "+sliderreq+"  with(Math) return "+funcy+" }");
      eval("fz = function(t){ "+sliderreq+"  with(Math) return "+funcz+" }");
      var i,j,u,v,x,y,z;
      for (i=0;i<disc;i++) {
        for (j=0; j<disc; j++) {
          u = umin + du*i;
          v = vmin + dv*j;
          x = fx(u,v);
          y = fy(u,v)
          z = fz(u,v);
          verts.push([x,y,z]);
        }
      }
    } catch (e) {
      isok = false;        
    }
    if (isok) {
      geoms[gn].vert = verts;
      geoms[gn].face = null;
    } 
  }
  if (!isok) {
    geoms[gn].vert = null;
    geoms[gn].face = null;
  }
  try {
    plot3d.updateGeometry(geoms, bounds);
  } catch(e) {}
}

/* ** */
var gcnt = 0;
var gtypes = [];
var activegraph = null;
var timers = [];

function addgraph(el) {
  var gtype = el.value;
  
  gtypes[gcnt] = gtype;
  
  var html = '';
  html += '<div class="funcholder" id="funcholder'+gcnt+'" onclick="activategraph(this)" onmouseover="can add variable from slider">';
  html += '<div class="functoggle" id="functoggle'+gcnt+'" onclick="togglegraph('+gcnt+',this)">&nbsp;</div>';
  html += '<div class="delfunc" onclick="delfunc('+gcnt+')">X</div>';
  html += '<div class="funcinputs">';
  
  if (gtype=="z") {
    html += '<span class="funclabel">f(x,y) =</span>';
    html += '<input id="z'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: x^2 + y^2 ..." title="example x^2 + y^2"/>';
  } 
  
  else if (gtype=="zrt") {
    html += '<span class="funclabel">f(r,&theta;) =</span>';
    html += '<input id="z'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: r or theta or r/theta ..." title="example r^2-theta"/>';
  } 
  
  else if (gtype=="spacecurve") {
    html += '<span class="funclabel">x(t) =</span>';
    html += '<input id="x'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: t^2 ..." title="example t"/> <br/>';
    html += '<span class="funclabel">y(t) =</span>';
    html += '<input id="y'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: t^2 ..." title="example t or t^2 or a*t (activated slider for var a)"/> <br/>';
    html += '<span class="funclabel">z(t) =</span>';
    html += '<input id="z'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: t ..." title="example t or t^2 or a*t (activated slider for var a)/>';
  } 
  
  else if (gtype=="paramsurf") {
    html += '<span class="funclabel">x(u,v) =</span>';
    html += '<input id="x'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: u or u^2 or u/v ..." title="example u+v"/> <br/>';
    html += '<span class="funclabel">y(u,v) =</span>';
    html += '<input id="y'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: u or u^2 or u-v ..." title="example u-v"/> <br/>';
    html += '<span class="funclabel">z(u,v) =</span>';
    html += '<input id="z'+gcnt+'" type="text" class="funcinput" size="10" onkeyup="updategraph('+gcnt+')" placeholder="example: u or u^2 or u*v ..." title="example u*v"/>';
  } 
  
  else if (gtype=="slider") {
    html += '<input id="var'+gcnt+'" type="text" class="boundinput" value="a" size="1" onkeyup="updateslidervar('+gcnt+')" title="change this variable to match your equation"/> = ';
    html += '<span id="sliderval'+gcnt+'">1</span><br/>';
    html += '<span class="cssicon play-alt" onclick="play(this,'+gcnt+')"><a> </a></span> <input class="varslider" type="range" min="-5" max="5" value="1" step=".1" id="slider'+gcnt+'" oninput="updateslider('+gcnt+')" onclick="stopbubble(event)"/>';
  }
  html += '</div>';
  html += '<div class="funccontrol" id="funccontrol'+gcnt+'">';
  if (gtype=="z") {
    html += '<input id="umin'+gcnt+'" type="text" class="boundinput" value="-5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += ' &le; <i>x</i> &le; ';
    html += '<input id="umax'+gcnt+'" type="text" class="boundinput" value="5" size="3" onkeyup="updategraph('+gcnt+')"/> <br/>';
    html += '<input id="vmin'+gcnt+'" type="text" class="boundinput" value="-5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += ' &le; <i>y</i> &le; ';
    html += '<input id="vmax'+gcnt+'" type="text" class="boundinput" value="5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += '<br/> Discritization: ';
    html += '<input id="discr'+gcnt+'" type="text" class="boundinput" value="20" size="3" onkeyup="updategraph('+gcnt+')"/>';
  } else if (gtype=="zrt") {
    html += '<input id="umin'+gcnt+'" type="text" class="boundinput" value="0" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += ' &le; <i>r</i> &le; ';
    html += '<input id="umax'+gcnt+'" type="text" class="boundinput" value="5" size="3" onkeyup="updategraph('+gcnt+')"/> <br/>';
    html += '<input id="vmin'+gcnt+'" type="text" class="boundinput" value="0" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += ' &le; <i>&theta;</i> &le; ';
    html += '<input id="vmax'+gcnt+'" type="text" class="boundinput" value="2pi" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += '<br/> Discritization: ';
    html += '<input id="discr'+gcnt+'" type="text" class="boundinput" value="20" size="3" onkeyup="updategraph('+gcnt+')"/>';
  } else if (gtype=="spacecurve") {
    html += '<input id="umin'+gcnt+'" type="text" class="boundinput" value="-5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += ' &le; <i>t</i> &le; ';
    html += '<input id="umax'+gcnt+'" type="text" class="boundinput" value="5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += '<br/> Discritization: ';
    html += '<input id="discr'+gcnt+'" type="text" class="boundinput" value="50" size="3" onkeyup="updategraph('+gcnt+')"/>';
  } else if (gtype=="paramsurf") {
    html += '<input id="umin'+gcnt+'" type="text" class="boundinput" value="-5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += ' &le; <i>u</i> &le; ';
    html += '<input id="umax'+gcnt+'" type="text" class="boundinput" value="5" size="3" onkeyup="updategraph('+gcnt+')"/> <br/>';
    html += '<input id="vmin'+gcnt+'" type="text" class="boundinput" value="-5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += ' &le; <i>v</i> &le; ';
    html += '<input id="vmax'+gcnt+'" type="text" class="boundinput" value="5" size="3" onkeyup="updategraph('+gcnt+')"/>';
    html += '<br/> Discritization: ';
    html += '<input id="discr'+gcnt+'" type="text" class="boundinput" value="20" size="3" onkeyup="updategraph('+gcnt+')"/>';
  } 
  else if (gtype=="slider") {
    html += '<input id="umin'+gcnt+'" type="text" class="boundinput" value="-5" size="3" onkeyup="updatesliderbounds('+gcnt+')"/>';
    html += ' &le; <span id="slidervardisp'+gcnt+'">a</span> &le; ';
    html += '<input id="umax'+gcnt+'" type="text" class="boundinput" value="5" size="3" onkeyup="updatesliderbounds('+gcnt+')"/> <br/>';
    html += 'Step: <input id="discr'+gcnt+'" type="text" class="boundinput" value="0.1" size="3" onchange="updatesliderbounds('+gcnt+')" />';
    //html += 'Step: <input id="discr'+gcnt+'" type="text" class="boundinput" value="0.1" size="3" onchange="updatesliderbounds('+gcnt+')" ondrag="javascript:this.value++"/>';
  }
  html += '</div>';
  
  document.getElementById("graphitems").innerHTML += html;
  activategraph(document.getElementById("funcholder"+gcnt));
  if (gtype != "slider") {
    document.getElementById("funcholder"+gcnt).querySelectorAll(".funcinput")[0].focus();
  } 
  else {
    updatesliderregistry();
    updateslider(gcnt);
  }
  gcnt++;

  el.selectedIndex = 0;
}

function activategraph(el) {
  var fh = document.getElementsByClassName("funcholder");
  for(var i=0;i<fh.length;i++){
    fh[i].classList.remove("active");
  }
  el.classList.add("active");
}

function delfunc(gn) {
  //document.getElementById("funcholder"+gn).slideUp("fast", function() {document.getElementById("funcholder"+gn).remove();});
  document.getElementById("funcholder"+gn).remove();
  if (gtypes[gn]=="slider") {
    updatesliderregistry();
  }
  gtypes[gn] = null;
  geoms[gn].vert = null;
  geoms[gn].face = null;
  try {
    plot3d.updateGeometry(geoms, bounds);
  } 
  catch(e) { }
}

function togglegraph(gn,el) {
  if (el.classList.contains("inactive")) {
    el.classList.remove("inactive");
    geoms[gn].hidden = false;
  } else {
    el.classList.add("inactive");
    geoms[gn].hidden = true;
  }
  try {
    plot3d.updateGeometry(geoms, bounds);
  } catch(e) { }
}


function hasgeom(g) {
  for (i in g) {
    if (g[i].vert !== null) {
      return true;
    }
  }
  return false;
}

function updateslidervar(gn) {
  document.getElementById("slidervardisp"+gn).innerHTML = document.getElementById("var"+gn).value;
  updatesliderregistry();
}

function updateslider(gn) {
  document.getElementById("sliderval"+gn).innerHTML = document.getElementById("slider"+gn).value;  
  for (j in sliders.registry[gn]) {
    generategeom(sliders.registry[gn][j]);
  }
}

function updatesliderbounds(gn) {
  var min = evalbasic(document.getElementById("umin"+gn).value);
  var max = evalbasic(document.getElementById("umax"+gn).value);
  var step = evalbasic(document.getElementById("discr"+gn).value);
  document.getElementById("slider"+gn).setAttribute("min", min);
  document.getElementById("slider"+gn).setAttribute("max", max);
  document.getElementById("slider"+gn).setAttribute("step", step);
}
function stopbubble(e) {
  e.stopPropagation();
}

function adjustbounds(el) {
  var bndtype = el.value;
  if (bndtype=="auto") {
    document.getElementById("boundsets").style.display = "none";
  } else {
    document.getElementById("boundsets").style.display = "";
  }
  updatebounds();
}

function updatebounds(skipupdate) {
  var bndtype = document.getElementById("boundtype").value;//auto or fixed
  if (bndtype=="fixed") {
    var xmin = parseInt(document.getElementById("xmin").value);
    var xmax = parseInt(document.getElementById("xmax").value);
    var ymin = parseInt(document.getElementById("ymin").value);
    var ymax = parseInt(document.getElementById("ymax").value);
    var zmin = parseInt(document.getElementById("zmin").value);
    var zmax = parseInt(document.getElementById("zmax").value);
    if (!isNaN(xmin) && !isNaN(xmax) && !isNaN(ymin) && !isNaN(ymax) && !isNaN(zmin) && !isNaN(zmax)) {
      bounds = [xmin,xmax,ymin,ymax,zmin,zmax];
    } else {
      bounds = [];
    }
  } else {
    bounds = [];
  }
  if (skipupdate!==null) {
    try {
      plot3d.updateGeometry(geoms, bounds);
    } 
    catch(e) { }
  }
}


function play(el, gn) {
  if (timers[gn]==null) {
    sliders.dirs[gn] = 1;
    timers[gn] = setInterval(function() {
        var s = document.getElementById("slider"+gn);
        if (sliders.dirs[gn]>0 && s.value+s.step<=s.max) {
          s.stepUp();
        }
        else if (sliders.dirs[gn]< 0 && s.value-s.step>=s.min) {
          s.stepDown();
        }
        else {
          sliders.dirs[gn] *= -1;
        }
        updateslider(gn);
      }, 50);
    el.className = "cssicon pause-alt";
  }
  else {
    clearInterval(timers[gn]);
    timers[gn] = null;
    el.className = "cssicon play-alt";
  }
}


function serializeGraph() {
  var obj = {};
  if (document.getElementById("boundtype").value=="auto") {
    obj.bounds = {type:"auto"};
  }
  else {
    obj.bounds = {type:"fixed",
      "xmin": document.getElementById("xmin").value,
      "xmax": document.getElementById("xmax").value,
      "ymin": document.getElementById("ymin").value,
      "ymax": document.getElementById("ymax").value,
      "zmin": document.getElementById("zmin").value,
      "zmax": document.getElementById("zmax").value};
  }
  obj.view = {theta: plot3d.theta, phi: plot3d.phi};
  obj.graphs = [];
  for (i in gtypes) {
    if (gtypes[i]==null) {continue;}
    var ng = {};
    ng.gtype = gtypes[i];
    if (ng.gtype=="z" || ng.gtype=="zrt" || ng.gtype=="rtp" || ng.gtype=="spacecurve" || ng.gtype=="paramsurf") {
      ng.z = document.getElementById("z"+i).value;
    }
    if (ng.gtype=="spacecurve" || ng.gtype=="paramsurf") {
      ng.x = document.getElementById("x"+i).value;
      ng.y = document.getElementById("y"+i).value;
    }
    if (ng.gtype=="slider") {
      ng.var = document.getElementById("var"+i).value;
      ng.val = document.getElementById("slider"+i).value;
    }
    if (ng.gtype=="z" || ng.gtype=="zrt" || ng.gtype=="rtp" || ng.gtype=="spacecurve" || ng.gtype=="paramsurf" || ng.gtype=="slider") {
      ng.umin = document.getElementById("umin"+i).value;
      ng.umax = document.getElementById("umax"+i).value;
      ng.discr = document.getElementById("discr"+i).value;
    }
    if (ng.gtype=="z" || ng.gtype=="zrt" || ng.gtype=="rtp" || ng.gtype=="paramsurf") {
      ng.vmin = document.getElementById("vmin"+i).value;
      ng.vmax = document.getElementById("vmax"+i).value;
    }
    obj.graphs.push(ng);
  }
  return obj;
}

function loadfromJSON(arr) {
  plot3d.theta = arr.view.theta;
  plot3d.phi = arr.view.phi;
  
  document.getElementById("boundtype").value = arr.bounds.type;
  if (arr.bounds.type=="fixed") {
    document.getElementById("xmin").value = arr.bounds.xmin;
    document.getElementById("xmax").value = arr.bounds.xmax;
    document.getElementById("ymin").value = arr.bounds.ymin;
    document.getElementById("ymax").value = arr.bounds.ymax;
    document.getElementById("zmin").value = arr.bounds.zmin;
    document.getElementById("zmax").value = arr.bounds.zmax;    
  }
  adjustbounds({value: arr.bounds.type});
  var ng,i;
  var toupdate = [];
  for (var k=0;k<arr.graphs.length;k++) {
    ng = arr.graphs[k];
    i = gcnt;
    addgraph({value: ng.gtype});
    if (ng.gtype=="z" || ng.gtype=="zrt" || ng.gtype=="rtp" || ng.gtype=="spacecurve" || ng.gtype=="paramsurf") {
      document.getElementById("z"+i).value = ng.z;
    }
    if (ng.gtype=="spacecurve" || ng.gtype=="paramsurf") {
      document.getElementById("x"+i).value = ng.x;
      document.getElementById("y"+i).value = ng.y;
    }
    if (ng.gtype=="slider") {
      document.getElementById("var"+i).value = ng.var;
      document.getElementById("slider"+i).value = ng.val;
    }
    if (ng.gtype=="z" || ng.gtype=="zrt" || ng.gtype=="rtp" || ng.gtype=="spacecurve" || ng.gtype=="paramsurf" || ng.gtype=="slider") {
      document.getElementById("umin"+i).value = ng.umin;
      document.getElementById("umax"+i).value = ng.umax;
      document.getElementById("discr"+i).value = ng.discr;
    }
    if (ng.gtype=="z" || ng.gtype=="zrt" || ng.gtype=="rtp" || ng.gtype=="paramsurf") {
      document.getElementById("vmin"+i).value = ng.vmin;
      document.getElementById("vmax"+i).value = ng.vmax;
    }
    if (ng.gtype=="slider") {
      updatesliderbounds(i)
      updateslidervar(i);
      updateslider(i);
    }
    else {
      toupdate.push(i);
    }
  }
  for (k in toupdate) {
    updategraph(k);
  }
};

function saveboxmouseup(e) {
  var container = document.getElementById("savebox");
    if (!(container === e.target) && container.contains(e.target).length === 0){
      document.getElementById("saveout").style.display = "none";
      document.removeEventListener("click", saveboxmouseup);
    }
};
