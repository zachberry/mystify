var INTERVAL_TIME = 20;
var NUM_TRAILS = 15;
var NUM_POINTS = 4;
var NUM_POLYGONS = 2;
var SATURATION = 100;
var BRIGHTNESS = 50;

var curPointListIndex = 0;
var pointLists = [];
var canvas;
var context;

var numSteps = 0;
var intervalID;

var polygonsList = [];

var canvasWidth;
var canvasHeight;

//import polygon.js;

//document.write('<script type="text/javascript" src="js/polygon.js"></script>');



$(document).ready(init);
//init:

function resize()
{
	canvas.width = canvasWidth = $(window).width() - 5;
	canvas.height = canvasHeight = $(window).height() - 25; //@TODO
	
}

function init()
{
	$(window).resize(resize);
	
	intervalID = setInterval(step, INTERVAL_TIME);
	
	canvas = document.getElementById('canvas');
	//console.log(canvas);
	context = canvas.getContext('2d');
	
	
	resize();
	
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	//console.log(canvasWidth);
	
	for(var i = 0; i < NUM_POLYGONS; i++)
	{
		polygonsList.push(new Polygon(canvasWidth, canvasHeight, NUM_TRAILS, NUM_POINTS, SATURATION, BRIGHTNESS));
	}
	
	step();
}

function step()
{
	var d = new Date();
	var t2;
	var t1 = d.getTime();
	//numSteps++;
	
//	console.log('step');
	//context.fillStyle = "rgb(200, 0, 0)";
	//context.fillRect (10, 10, 55, 50);
	
	
	context.clearRect(0, 0, canvasWidth, canvasWidth);
	//context.fillStyle = '#FF0000';
	//context.fillRect(0, 0, 500, 500);
	canvas.width = canvasWidth;
	
	//polygon1.render(context);
	//polygon2.render(context);
	for(var i = 0; i < NUM_POLYGONS; i++)
	{
		//console.log(polygonsList[i]);
		polygonsList[i].render(context);
	}
	
	//var img = context.getImageData(200, 200, 200, 200);
	//document.getElementById('canvas2').getContext('2d').putImageData(img, 0, 0);
	
	if(numSteps > 10)
	{
		clearInterval(intervalID);
		//context.clearRect(0, 0, 500, 500);
		//renderPointList(pointLists[0]);
	}
	
	d = new Date();
	t2 = d.getTime();
//	console.log(t2 - t1);
}

