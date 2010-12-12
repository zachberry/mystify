var INTERVAL_TIME = 45;
var NUM_TRAILS = 15;
var NUM_POINTS = 4;
var NUM_POLYGONS = 2;
var SATURATION = 100;
var BRIGHTNESS = 50;
var COLOR_TWEEN_INTERVAL = 3;

var canvas;
var context;

var curPointListIndex = 0;
var pointLists = [];


var numSteps = 0;
var intervalID = -1;

var polygonsList = [];

var canvasWidth;
var canvasHeight;

//import polygon.js;

//document.write('<script type="text/javascript" src="js/polygon.js"></script>');


function toggleAbout()
{
	$('#about').toggle();
}

$(document).ready(init);
//init:
function doit()
{
	//console.log('test');
//	NUM_TRAILS = 25;
	//NUM_POINTS = 8;
	//NUM_POLYGONS = 3;
	INTERVAL_TIME = 80;
	init();
	
}

function hideFooter()
{
	var f = $('#footer');
	f.height(0);
	f.hide();
	resize();
}

function resize()
{
	canvas.width = canvasWidth = $(window).width();
	canvas.height = canvasHeight = $(window).height() - $('#footer').height(); //@TODO
	//$('#footer').width(10);
	
	var s = $('#screen');
	var w = $('#about');
	w.css("left", (s.outerWidth() - w.outerWidth()) / 2);
	w.css("top", (s.outerHeight() - w.outerHeight()) / 2 );
}

function init()
{
	curPointListIndex = 0;
	pointLists = [];
	numSteps = 0;
	polygonsList = [];
	
	$(window).resize(resize);
	
	if(intervalID != -1)
	{
		clearInterval(intervalID);
	}
	
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
		polygonsList.push(new Polygon(canvasWidth, canvasHeight, NUM_TRAILS, NUM_POINTS, SATURATION, BRIGHTNESS, COLOR_TWEEN_INTERVAL));
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
	//alert('dabout to renders');
	
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

