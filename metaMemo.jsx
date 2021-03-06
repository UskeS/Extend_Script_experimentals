//Meta Memo Ver.0.1.2_beta
//基本的にはIndesign用ですが少しだけ手を入れるとAI／PSでも動くでしょう。
//メモを入力してメタデータとして保持します。沢山追加してもかまいませんが、現状のクソっぽいインターフェースでは天地一杯まででやめておきましょう。
//CS5及びCCで動作確認を行っていますからCS6も大丈夫だと思われます。残念な事にCS4ではUI操作でクラッシュします。
//技術的問題が生じた場合及びご要望はTenまでお知らせ下さい。しかしながら、betaリリースであると言う事をお忘れなく。
//メタデータ仕様については今後改変の予定はありません。ですから今後のアップデートで以前のものが読めなくなるという事はありません。
//対応アプリケーション　IndesignCS５〜CC、IllustratorCS5〜CC

idmeta ={
	ns : "http://ns.chuwa.sytes.net/idcomment/1.0/",
	prefix : "ID_meta:",
	f : new Object(),
	win : function(){
		this.f = app.activeDocument;
		if (!this.f.saved){
			alert("保存されていないデータにはメタデータは書き込めません。");
			return;
			}
		if ($.global.app.name=="Adobe Illustrator"){
			if (this.f.path==""){
			alert("保存されていないデータにはメタデータは書き込めません。");
				return;
				}
			}
		var n = this.getLen();
		var w = new Window('dialog', 'meta memo', undefined);
		if (n==0){
			var pn = w.add('panel',undefined,'add memo');
			var gp = pn.add('group',undefined,'',{orientation:'row'});
			var tx = gp.add('edittext',[5,10,350,60],'',{multiline:true});
			var b = gp.add('button',undefined,'add memo');
			var cl = w.add('button', undefined, 'close', {name:'cancel'});
			b.onClick = function (){
				idmeta.write("memo1", tx.text);
				}
			}
		else {
			for (var i=1;i<n+1;i++){
				eval("var p"+ i +"= w.add('panel',undefined,'memo" + i + "');");
				eval("var gp"+ i +"=p"+ i +".add('group',undefined,'',{orientation:'row'});");
				eval("var t"+ i +"=gp"+ i +".add('edittext',[5,10,350,60],'',{multiline:true});");
				eval("t"+ i +".text=this.read('memo"+i+"');");
				eval("var bt"+ i +"= gp"+ i +".add('button',undefined,'update');");
				eval("bt"+i+".onClick=function (){"
					+"idmeta.write('memo" + i + "',t" + i + ".text);}");
				}
			var pn = w.add('panel',undefined,'add new memo');
			var gp = pn.add('group',undefined,'',{orientation:'row'});
			var tx = gp.add('edittext',[5,10,350,60],'',{multiline:true});
			var b = gp.add('button',undefined,'add new memo');
			b.onClick = function (){
				idmeta.write("memo"+i++, tx.text);
				}
			var cl = w.add('button', undefined, 'close', {name:'cancel'});
			}
		w.show();
		},
	read : function(prop){
		if(xmpLib==undefined) var xmpLib = new ExternalObject('lib:AdobeXMPScript');
		var xmpFile = new XMPFile(this.f.fullName.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
		var xmpPackets = xmpFile.getXMP();
		var xmp = new XMPMeta(xmpPackets.serialize());
		return xmp.getProperty(this.ns, prop).toString();
		},
	write : function(prop, val){ //f:fileObject, val1:String, val2:String
		if(xmpLib==undefined) var xmpLib = new ExternalObject('lib:AdobeXMPScript');
		var xmpFile = new XMPFile(this.f.fullName.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
		var xmp = xmpFile.getXMP();
		var mt = new XMPMeta(xmp.serialize());
		XMPMeta.registerNamespace(this.ns, this.prefix);
		mt.setProperty(this.ns, prop, val);
		if (xmpFile.canPutXMP(xmp)) xmpFile.putXMP(mt);
		xmpFile.closeFile(XMPConst.CLOSE_UPDATE_SAFELY);
		},
	getLen : function(){
		try{
			if(xmpLib==undefined) var xmpLib = new ExternalObject('lib:AdobeXMPScript');
			var xmpFile = new XMPFile(this.f.fullName.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
			var xmpPackets = xmpFile.getXMP();
			var xmp = new XMPMeta(xmpPackets.serialize());
			var len = xmp.dumpObject().match(/memo\d/g);
			if (len==null) return 0;
			else return len.length;
		}catch(e){
			return 0;
			}
		}
	}


if(app.documents.length>0) idmeta.win();

