#targetengine "session"

var checkBackgroundEvt = app.addEventListener("afterSelectionChanged",
	function(ev){
		try {
		var slct = app.selection[0];
		if (slct.hasOwnProperty("graphics") && slct.graphics[0].imageTypeName.indexOf("PDF")>-1)
			if (!slct.graphics[0].pdfAttributes.transparentBackground) {
				sendNotify("Alert!","Not Transparent!!");
				}
			}
		catch(e){}
		}
	).name = "pdftransparent";

function sendNotify(title, discription){
	try{
		var ntfyr = 'display notification "' + discription + '" with title "' + title + '"';
		app.doScript(ntfyr, ScriptLanguage.APPLESCRIPT_LANGUAGE);
		}
	catch (e){}
	}

//Stop listener
//app.eventListeners.itemByName("pdftransparent").remove();
