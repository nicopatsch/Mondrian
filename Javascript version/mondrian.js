//--- PARAMETERS --- //

//FIXED
var canvasHeight = 600;
var canvasWidth = 800;
var params = {width: canvasWidth, height: canvasHeight};
var two;

var mondrianBlack = 'rgb(29, 29, 26)';
var mondrianWhite = 'rgb(246, 246, 239)';
var mondrianBlue = 'rgb(56, 73, 118)';
var mondrianRed = 'rgb(193, 40, 40)';
var mondrianYellow = 'rgb(250, 209, 72)';


//CUSTOMIZED
var autoUpdate;
var linewidth;
var maxIndex;

var probabilityBlack = +15.0;
var probabilityWhite = +40.0;
var probabilityBlue = +15.0;
var probabilityRed = +15.0;
var probabilityYellow = +15.0;



function RandomColor(index) {
	var r = Math.random();

    if(r <= probabilityWhite/100) {
    	return mondrianWhite;
    }
    else if(r <= probabilityWhite/100 + +probabilityBlack/100) {
    	return mondrianBlack;
    }
    else if(r <= probabilityWhite/100 + +probabilityBlack/100 + +probabilityYellow/100) {
    	return mondrianYellow;
    }
    else if(r <= probabilityWhite/100 + +probabilityBlack/100 + +probabilityYellow/100 + +probabilityBlue/100) {
    	return mondrianBlue;
    }
    else return mondrianRed;
}
function UpdateAll() {
	
	GetParams();
	if(autoUpdate) Run();
}

function UpdateLine() {
	GetParams();
	two.scene.linewidth = linewidth;
	two.update();
}

function UpdateProbabilities(currentlyUpdatedColor) {
	GetParams();
	var divisor;
	var sommeTotale = +probabilityBlue + +probabilityYellow + +probabilityBlack + +probabilityWhite + +probabilityRed;

	if(sommeTotale >= 101 || sommeTotale <= 99) {
		switch(currentlyUpdatedColor) {
			case 'Red':
				divisor = (100-probabilityRed) / (sommeTotale - probabilityRed);
				probabilityBlue *= divisor;
				probabilityBlack *= divisor;
				probabilityYellow *= divisor;
				probabilityWhite *= divisor;
		}

		switch(currentlyUpdatedColor) {
			case 'Blue':
				divisor = (100-probabilityBlue) / (sommeTotale - probabilityBlue);
				probabilityRed *= divisor;
				probabilityBlack *= divisor;
				probabilityYellow *= divisor;
				probabilityWhite *= divisor;
		}

		switch(currentlyUpdatedColor) {
			case 'Yellow':
				divisor = (100-probabilityYellow) / (sommeTotale - probabilityYellow);
				probabilityBlue *= divisor;
				probabilityBlack *= divisor;
				probabilityRed *= divisor;
				probabilityWhite *= divisor;
		}

		switch(currentlyUpdatedColor) {
			case 'Black':
				divisor = (100-probabilityBlack) / (sommeTotale - probabilityBlack);
				probabilityBlue *= divisor;
				probabilityRed *= divisor;
				probabilityYellow *= divisor;
				probabilityWhite *= divisor;
		}

		switch(currentlyUpdatedColor) {
			case 'White':
				divisor = (100-probabilityWhite) / (sommeTotale - probabilityWhite);
				probabilityBlue *= divisor;
				probabilityBlack *= divisor;
				probabilityYellow *= divisor;
				probabilityRed *= divisor;
		}


		jQuery('#whiteProbabilitySlider').val(probabilityWhite);
		jQuery('#redProbabilitySlider').val(probabilityRed);
		jQuery('#blueProbabilitySlider').val(probabilityBlue);
		jQuery('#yellowProbabilitySlider').val(probabilityYellow);
		jQuery('#blackProbabilitySlider').val(probabilityBlack);

	}

	

}


function GetParams() {
	probabilityWhite = jQuery('#whiteProbabilitySlider').val();
	probabilityRed = jQuery('#redProbabilitySlider').val();
	probabilityBlue = jQuery('#blueProbabilitySlider').val();
	probabilityYellow = jQuery('#yellowProbabilitySlider').val();
	probabilityBlack = jQuery('#blackProbabilitySlider').val();

	maxIndex = jQuery("#maxIndexSlider").val();
	autoUpdate = jQuery("#autoUpdateCheckbox").prop('checked');
	linewidth = jQuery("#lineWidthSlider").val() / 100;

	canvasHeight = jQuery('#drawing').height();
	canvasWidth = jQuery('#drawing').width();

	console.log(canvasWidth, canvasHeight);
}



function Run() {

	GetParams();

	two = new Two(params);
	var elem = document.getElementById("drawing-content");
	while (elem.firstChild) elem.removeChild(elem.firstChild);
	two.appendTo(elem);
	
	two.clear();
	
	SplitRectangle(false, canvasWidth, canvasHeight, 0, 0, 0);
	
	var outterRect = two.makeRectangle(canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight);
	outterRect.opacity = 1.0;
	outterRect.fill = 'rgba(0,0,0,0)';
	outterRect.linewidth = 2*linewidth;
	outterRect.stroke = mondrianBlack;

	two.update();

}


function CreateRectangle(coord) {
	var rectangle1 = two.makeRectangle(coord.x, coord.y, coord.width, coord.height);
	rectangle1.fill = RandomColor(0);
	rectangle1.stroke = mondrianBlack;
	rectangle1.linewidth = linewidth;
	two.update();
}

function SplitRectangle(isVertical, width, height, posx, posy, index) {
	if(index < maxIndex) {
		if(isVertical) {
			var pos = width * Math.random();

			var width1 = pos;
            var width2 = width - pos;
            var height1 = height;
            var height2 = height;
            var posx1 = posx;
            var posx2 = posx + pos;
            var posy1 = posy;
            var posy2 = posy;
		} else {

			var pos = height * Math.random();

			var height1 = pos;
            var height2 = height - pos;
            var width1 = width;
            var width2 = width;
            var posx1 = posx;
            var posx2 = posx;
            var posy1 = posy;
            var posy2 = posy + pos;
		}
		CreateRectangle({x : width1/2 + posx1, y : height1/2 + posy1, width : width1, height : height1});
	
		SplitRectangle(!isVertical, width1, height1, posx1, posy1, index+1);
        SplitRectangle(!isVertical, width2, height2, posx2, posy2, index+1);
	}

}

// jQuery('#lineWidthSlider').on('input', function() { 
// 	console.log('input changed');
// 	UpdateLine();
// });

jQuery(document).ready(function() {
	GetParams();

	Run();
	
});
