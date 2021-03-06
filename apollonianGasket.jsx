//Draw Apolonian Gasket...
//more information in... http://en.wikipedia.org/wiki/Descartes%27_theorem


pp();

function pp(){
	if (app.documents.length==0) return;
	var tr,angl;
	var ud = false;
	//Create UI
	var w = new Window('dialog', "Apollonian Gasket");
		var slide = w.add('panel',undefined, 'ratio');
		slide.orientation = "column";
		var sg = slide.add('group');
		var slider = sg.add("slider", undefined, 0.5, 0, 1);
		slider.size = [180,20];
		var vt = sg.add('statictext', undefined, "1");
		vt.characters = 4;
	
		var rd = ["0","30","45","60","90"];
		var dd = w.add('dropdownlist', undefined,rd);
		dd.selection = 1;
		dd.alignment = "center";
		dd.size = [180,20];
	
		var chkGroup = w.add("group");
		chkGroup.alignment = "center";
		var previewChk = chkGroup.add("checkbox", undefined, "preview");
	
		var btnGroup = w.add("group", undefined );
		btnGroup.alignment = "center";
		var okBtn = btnGroup.add("button", undefined, "OK");
		var cancelBtn = btnGroup.add("button", undefined, "Cancel");
		
		doDraw = function(sz){ //sz : minimum radius size
			if (ud) {
				app.undo();
				ud = false;
				}
			tr = Number(slider.value);
			var ang = [];
			ang["0"] = 0;
			ang["30"] = Math.PI/6;
			ang["45"] = Math.PI/4;
			ang["60"] = Math.PI/3;
			ang["90"] = Math.PI/2;
			main(tr, ang[dd.selection], sz);
			ud = true;
			redraw();
			}
		slider.onChanging = function(){
			if(previewChk.value) doDraw (0.02);
			}
		dd.onChange = function(){
			if(previewChk.value) doDraw (0.02);
			}
	    previewChk.onClick = function(){
			if(previewChk.value) doDraw (0.02);
			else if (!previewChk.value) {
				app.undo();
				ud = false;
				app.redraw();
				}
            }
		okBtn.onClick = function(){
			doDraw (0.001);
			w.close();
			}
		cancelBtn.onClick = function(){
			if (ud) app.undo();
			w.close();
			}
    w.show();
	}




//tangent circles
function tng(a, b, c, flg) { //a,b,c are circle objects
	var k1 = 1 / a.r;
	var z1 = new C(a.x, a.y);
	var kz1 = Cmul(new C(k1, 0), z1);
	var k2 = 1 / b.r;
	var z2 = new C(b.x, b.y);
	var kz2 = Cmul(new C(k2, 0), z2);
	var k3 = 1 / c.r;
	var z3 = new C(c.x, c.y);
	var kz3 = Cmul(new C(k3, 0), z3);
	//Descartes theorem
	var k4p = k1 + k2 + k3 + 2 * Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
	var k4m = k1 + k2 + k3 - 2 * Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
	var kz4p = Cadd(Cadd(Cadd(kz1, kz2), kz3), Cmul(new C(2, 0),
				Csqrt(Cadd(Cadd(Cmul(kz1, kz2), Cmul(kz2, kz3)), Cmul(kz3, kz1)))));
	var kz4m = Csub(Cadd(Cadd(kz1, kz2), kz3), Cmul(new C(2, 0),
				Csqrt(Cadd(Cadd(Cmul(kz1, kz2), Cmul(kz2, kz3)), Cmul(kz3, kz1)))));
	var k4, kz4, k4b, kz4b;
	var cs = new Array();
	if (k4p>k4m){ //select large one
		k4 = k4p;
		kz4 = kz4p;
		k4b = k4m;
		kz4b = kz4m;
		} else {
			k4 = k4m;
			kz4 = kz4m;
			k4b = k4p;
			kz4b = kz4p;
			}
	var cc = new circle(kz4.r/k4, kz4.i/k4, Math.abs(1/k4));
	var dx = a.x - cc.x
	var dy = a.y - cc.y
	var dr = a.r + cc.r
	if (Math.abs(dx*dx+dy*dy-dr*dr)>0.0001) {
		cc = new circle(kz4b.r/k4, kz4b.i/k4, Math.abs(1/k4));
		}
	cs.push(cc);
	if (flg) {
		cc = new circle(kz4b.r/k4b, kz4b.i/k4b, Math.abs(1/k4b));
		cs.push(cc);
		}
	return cs;
	}




function main(tr, angl, sz) {//tr:number  angl:int sz:number/minsize
	 var dc = app.activeDocument;
	//draw primally circle
	var b = new circle(0, 0, -1);
	b.draw();

	//generate 2nd and 3rd circles  ...54..pi/6
	var pa = angl;
	var px = tr  * Math.cos(pa);
	var py = tr  * Math.sin(pa);
	var pr = 1 - tr;
	var qr = (1 - pr) * (1 - Math.cos(pa + Math.PI / 2))
				/ (1 + pr - (1 - pr) * Math.cos(pa + Math.PI / 2));
	var qx = 0;
	var qy = qr - 1;
	var p = new circle(px, py, pr);
	var q = new circle(qx, qy, qr);
	p.draw();
	q.draw();

	var crcl = new Array();
	var cs = tng(b, p, q, true);
	crcl.push([b, p, cs[0]]);
	crcl.push([b, cs[0], q]);
	crcl.push([cs[0], p, q]);
	crcl.push([b, p, cs[1]]);
	crcl.push([b, cs[1], q]);
	crcl.push([cs[1], p, q]);
	cs[0].draw();
	cs[1].draw();
	
	var nc;

	for (var c=0;c<crcl.length;c++){
		nc = tng(crcl[c][0], crcl[c][1], crcl[c][2])[0];
		if (nc.r>sz){
			crcl.push([nc, crcl[c][1], crcl[c][2]]);
			crcl.push([crcl[c][0], nc, crcl[c][2]]);
			crcl.push([crcl[c][0], crcl[c][1], nc]);
			nc.draw();
			}
		}
	} 


function circle(x, y, rad) {
	this.scl =100;
	this.x = x;
	this.y = y;
	this.r = rad;
	this.clr = new CMYKColor;
	this.clr.cyan = 0;
	this.clr.magenta = 0;
	this.clr.yellow = 0;
	this.clr.black = 100;
  this.draw = function() {
		if(isNaN(this.r)||isNaN(this.x)||isNaN(this.y)) return;
		var cir = app.activeDocument.pathItems.ellipse (
			(this.x + this.r) * this.scl - app.activeDocument.activeView.centerPoint[0],
			(this.y - this.r) * this.scl - app.activeDocument.activeView.centerPoint[1],
			this.r * 2 * this.scl,
			this.r * 2 * this.scl);
		cir.filled = false;
		cir.stroked = true;
		cir.strokeColor = this.clr;
		cir.strokeWidth = 0.25;
		return cir;
		}
	}


// complex numbers
function C(r,i){
	this.r = r; //real
	this.i = i; //imaginally
	}

//compute complex value
function Cconj(c){//conjunction
	return new C(c.r, -c.i);
	}

function Cadd(c,d){ //add
	return new C(c.r+d.r, c.i+d.i);
	}

function Csub(c,d){ //sub
	return new C(c.r-d.r, c.i-d.i);
	}

function Cmul(c,d){ //multi
	return new C(c.r*d.r-c.i*d.i, c.r*d.i+c.i*d.r);
	}

function Csqrt(c){ //square root
	return new C(
		Math.sqrt(Math.sqrt(c.r*c.r+c.i*c.i))*Math.cos(Math.atan2(c.i,c.r)/2),
		Math.sqrt(Math.sqrt(c.r*c.r+c.i*c.i))*Math.sin(Math.atan2(c.i,c.r)/2)
		);
	}
