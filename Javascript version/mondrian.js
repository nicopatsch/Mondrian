//--- PARAMETERS --- //

var canvasHeight = 800;
var canvasWidth = 1000;
var linewidth = 4;
var maxIndex = 2;
var params = {width: canvasWidth, height: canvasHeight};
var two;
var conteur = 0;

function RandomColor(index) {
	var r = Math.random();

    // if(r <= 0.5) return 'rgb(246, 246, 239)'; //blanc
    // else if(r <= 0.65) return 'rgb(29, 29, 26)'; //rouge
    // else if(r <= 0.80) return 'rgb(250, 209, 72)'; //Jaune
    // else if(r <= 0.95) return 'rgb(56, 73, 118)'; //Bleu
    // else return 'rgb(193, 40, 40)'; //noir
    if(index == 0) return "red";
    else if(index == 1) return "green";
    else if(index == 2) return "blue";
}

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function Run() {

	
	two = new Two(params);
	var elem = document.getElementById("draw-shapes");
	while (elem.firstChild) elem.removeChild(elem.firstChild);
	two.appendTo(elem);
	
	two.clear();

	var outterRect = two.makeRectangle(canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight);
	outterRect.opacity = 1.0;
	outterRect.linewidth = 2*linewidth;
	outterRect.stroke = 'black';

	
	SplitRectangle(false, canvasWidth, canvasHeight, 0, 0, 0);
	two.update();

}


function SplitRectangle(isVertical, width, height, posx, posy, index) {
	conteur++;
	console.log(conteur);
	if(index < maxIndex) {
		if(isVertical) {
			//var pos = width * Math.random();
			var pos = width /2;

			width1 = pos;
            width2 = width - pos;
            height1 = height;
            height2 = height;
            posx1 = posx;
            posx2 = posx + pos;
            posy1 = posy;
            posy2 = posy;
		} else {

			//var pos = height * Math.random();
			var pos = height / 2;

			height1 = pos;
            height2 = height - pos;
            width1 = width;
            width2 = width;
            posx1 = posx;
            posx2 = posx;
            posy1 = posy;
            posy2 = posy + pos;
		}
	
		console.log(posx1, posy1, posx2, posy2);
		console.log(width1, height1, width2, height2);
		var rectangle1 = two.makeRectangle(width1/2 + posx1, height1/2 + posy1, width1, height1);
		rectangle1.fill = RandomColor(index);
		rectangle1.stroke = "black";
		rectangle1.opacity = 0.1;
		rectangle1.linewidth = linewidth;
		two.update();

		// var rectangle2 = two.makeRectangle(width2/2 + posx2, height2/2 + posy2, width2, height2);
		// rectangle2.fill = RandomColor(index);
		// rectangle2.stroke = "black";
		// rectangle2.opacity = 0.1;
		// rectangle2.linewidth = linewidth;
		// two.update();
		
		SplitRectangle(!isVertical, width1, height1, posx1, posy1, index+1);
        SplitRectangle(!isVertical, width2, height2, posx2, posy2, index+1);
	}

}



jQuery(document).ready(function() {
	Run();


	// var rec = two.makeRectangle(100, 150, 200, 300);
	// rec.fill = 'green';
	// rec.opacity = 0.5;
	// two.update();

});