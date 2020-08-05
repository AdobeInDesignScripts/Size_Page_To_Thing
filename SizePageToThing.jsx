//SizePageToThing.jsx
//An InDesign ExtendScript by Silicon Publishing, Inc.
//
//Resizes the current page to the selected page item or page items.
/*
    Notes:
    
    * This script assumes that layout adjustment or liquid layout are both off.

*/

main();
function main(){
	if(app.documents.length > 0){
		if(app.selection.length > 0){
			var objectList = new Array();
			for(var counter = 0; counter < app.selection.length; counter++){
				switch(app.selection[counter].constructor.name){
					case "Group":
					case "Rectangle":
					case "Oval":
					case "TextFrame":
					case "Polygon":
					case "GraphicLine":
						objectList.push(app.selection[counter]);
						break;
				}
			}
			if(objectList.length > 0){
				sizePageToThing(objectList);
			}
		}
	}
}
//Where "thing" is an array containing one or more page items.
function sizePageToThing(thing){
	var cornerArray = getBoundsOfThing(thing);
	var page = thing[0].parentPage;
    //If the thing is on the pasteboard, parentPage will be undefined, so we need to handle that case.
    if(page == undefined){
        var activeWindow = app.activeWindow;
        page = activeWindow.activePage;
    }
	//Reframe the page to the bounds of the thing.
	page.reframe(CoordinateSpaces.PASTEBOARD_COORDINATES, cornerArray);
}
//Where "thing" is an array containing one or more page items.
function getBoundsOfThing(thing){
	var testTopLeft, testBottomRight;
	//Get the initial bounds of the object. If there's only one object in the array, this is all we'll need.
	var topLeft = thing[0].resolve(AnchorPoint.TOP_LEFT_ANCHOR, CoordinateSpaces.PASTEBOARD_COORDINATES)[0];
	var bottomRight = thing[0].resolve(AnchorPoint.BOTTOM_RIGHT_ANCHOR, CoordinateSpaces.PASTEBOARD_COORDINATES)[0];
	if(thing.length > 1){
		for(var counter = 1; counter < thing.length; counter++){
			testTopLeft = thing[counter].resolve(AnchorPoint.TOP_LEFT_ANCHOR, CoordinateSpaces.PASTEBOARD_COORDINATES)[0];
			testBottomRight = thing[counter].resolve(AnchorPoint.BOTTOM_RIGHT_ANCHOR, CoordinateSpaces.PASTEBOARD_COORDINATES)[0];
			if(testTopLeft[0] < topLeft[0]){
				topLeft[0] = testTopLeft[0];
			}
			if(testTopLeft[1] < topLeft[1]){
				topLeft[1] = testTopLeft[1];
			}
			if(testBottomRight[0] > bottomRight[0]){
				bottomRight[0] = testBottomRight[0];
			}
			if(testBottomRight[1] > bottomRight[1]){
				bottomRight[1] = testBottomRight[1];
			}
		}
	}
	return new Array(topLeft, bottomRight);
}