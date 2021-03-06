/*
	Quick loader for the ScriptSlot Pro.
	*Sample code of the Send Script Message interface.
*/

function saveSlots() {
	var f = File.saveDialog("Save Quick Loader File...");
	if (f.open('w')) {
		var slots = ["slot0","slot1","slot2","slot3","slot4","slot5","slot6","slot7","slot8","slot9","slot10"
					,"slot11","slot12","slot13","slot14","slot15","slot16"];
		for (var i=0;i<16;i++) {
			f.writeln(app.preferences.getStringPreference("scriptSlot/" + slots[i]));
			}
		f.close();
		}
	else alert("Save Error...");
	}


function loadSlots() {
	var f = File.openDialog("Select Quick Loader File.");
	if (f.open("r")) {
        try {
		var os = ($.os.indexOf("Macintosh")>-1);
		var dlm = "/";
		if (!os) dlm = "\\";
		var pth = "", scNm = "";
		var slots = ["slot0","slot1","slot2","slot3","slot4","slot5","slot6","slot7","slot8","slot9","slot10"
					,"slot11","slot12","slot13","slot14","slot15","slot16"];
		for (var i=0;i<16;i++) {
			pth = f.readln();
			scNm = pth.split(dlm).pop();
			app.preferences.setStringPreference("scriptSlot/" + slots[i], pth);
			app.sendScriptMessage("ScriptSlot", slots[i], scNm); //All arguments must be Strings.
		}
	} catch(e){}
	}
	}
	

var w = new Window("dialog",undefined);
var bt1 = w.add("button",undefined,"Save");
var bt2 = w.add("button",undefined,"Load");
bt1.onClick = function(){saveSlots();w.close();}
bt2.onClick = function(){loadSlots();w.close();}
w.show();

