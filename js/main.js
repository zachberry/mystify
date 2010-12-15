var INTERVAL_TIME = 42;
var NUM_TRAILS = 14;
var NUM_POINTS = 4;
var NUM_POLYGONS = 2;
var SATURATION = 100;
var BRIGHTNESS = 50;
var COLOR_TWEEN_INTERVAL = 3;
var COLOR_HUE_INCREMENT = 1;

var canvas;
var context;

var curPointListIndex = 0;
var pointLists = [];

var numSteps = 0;
var intervalID = -1;
var renderStep;

var polygonsList = [];

var canvasWidth;
var canvasHeight;

$(document).ready(init);

function toggleAbout()
{
	resizeWindows();
	$('#about').toggle();
}

function toggleSettings()
{
	createSliders();
	$('#settings').toggle();
}

function createSliders()
{
	if($('#slider-redraw').html() == '')
	{
		$('#slider-redraw').slider({
			value: 300 - INTERVAL_TIME,
			min: 0,
			max: 300,
			step: 10,
			slide: function(event, ui)
			{
				INTERVAL_TIME = 300 - ui.value;
				initInterval();
				updateSettingsLabels();
			}
		});
	
		$('#slider-shapes').slider({
			value: NUM_POLYGONS,
			min: 1,
			max: 20,
			step: 1,
			slide: function(event, ui)
			{
				NUM_POLYGONS = ui.value;
				start();
				updateSettingsLabels();
			}
		});
	
		$('#slider-trails').slider({
			value: NUM_TRAILS,
			min: 0,
			max: 100,
			step: 1,
			slide: function(event, ui)
			{
				NUM_TRAILS = ui.value;
				start();
				updateSettingsLabels();
			}
		});
	
		$('#slider-lines').slider({
			value: NUM_POINTS,
			min: 3,
			max: 50,
			step: 1,
			slide: function(event, ui)
			{
				NUM_POINTS = ui.value;
				start();
				updateSettingsLabels();
			}
		});
	
		$('#slider-sat').slider({
			value: SATURATION,
			min: 0,
			max: 100,
			step: 10,
			slide: function(event, ui)
			{
				SATURATION = ui.value;
				updateColor();
				updateSettingsLabels();
			}
		});
	
		$('#slider-bright').slider({
			value: BRIGHTNESS,
			min: 0,
			max: 100,
			step: 10,
			slide: function(event, ui)
			{
				BRIGHTNESS = ui.value;
				updateColor();
				updateSettingsLabels();
			}
		});
	
		$('#slider-color').slider({
			value: 51 - COLOR_TWEEN_INTERVAL,
			min: 1,
			max: 50,
			step: 1,
			slide: function(event, ui)
			{
				COLOR_TWEEN_INTERVAL = 51 - ui.value;
				updateColor();
				updateSettingsLabels();
			}
		});
	
		$('#slider-hue').slider({
			value: COLOR_HUE_INCREMENT,
			min: 1,
			max: 180,
			step: 1,
			slide: function(event, ui)
			{
				COLOR_HUE_INCREMENT = ui.value;
				updateColor();
				updateSettingsLabels();
			}
		});
	
		updateSettingsLabels();
	}
}

function doit()
{
	clearInterval(intervalID);
}

function toggleFooter()
{
	var f = $('#footer');
	
	
	if(!f.is(':visible'))
	{
		f.slideDown();
		localStorage.setItem("header-visible", 'true');
	}
	else
	{
		f.slideUp();
		localStorage.setItem("header-visible", 'false');
	}
}

function resize()
{
	canvas.width = canvasWidth = $(window).width();
	canvas.height = canvasHeight = $(window).height(); // - $('#footer').height();
	
	resizeWindows();
}

function resizeWindows()
{
	var s = $('#screen');
	var w1 = $('#about');
	var w2 = $('#settings');
	
	w1.css("left", (s.outerWidth() - w1.outerWidth()) / 2);
	w1.css("top", (s.outerHeight() - w1.outerHeight()) / 2 );
	
	w2.css("left", (s.outerWidth() - w2.outerWidth()) / 2);
	w2.css("top", (s.outerHeight() - w2.outerHeight()) / 2 );
}

function init()
{
	//$('#about').draggable();
	//$('#settings').draggable();
	$('#canvas').click(function() {
		toggleFooter();
	});
	
	if(window.localStorage.getItem("header-visible") === 'true')
	{
		$('#footer').show();
	}
	
	start();
}

function start()
{
	
	curPointListIndex = 0;
	pointLists = [];
	numSteps = 0;
	polygonsList = [];
	
	$(window).resize(resize);
	
	renderStep = false;
	initInterval();
	
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	
	resize();
	
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	
	for(var i = 0; i < NUM_POLYGONS; i++)
	{
		polygonsList.push(new Polygon(canvasWidth, canvasHeight, NUM_TRAILS, NUM_POINTS, SATURATION, BRIGHTNESS, COLOR_TWEEN_INTERVAL, COLOR_HUE_INCREMENT));
	}

	step();
}

function initInterval()
{
	if(intervalID != -1)
	{
		clearInterval(intervalID);
	}
	
	intervalID = setInterval(step, INTERVAL_TIME / 2);
}

function updateColor()
{
	for(var i = 0; i < NUM_POLYGONS; i++)
	{
		polygonsList[i].setColorOptions(SATURATION, BRIGHTNESS, COLOR_TWEEN_INTERVAL, COLOR_HUE_INCREMENT);
	}
}

function updateSettingsLabels()
{
	$('#slider-redraw-val').html(INTERVAL_TIME + ' ms');
	$('#slider-shapes-val').html(NUM_POLYGONS);
	$('#slider-trails-val').html(NUM_TRAILS);
	$('#slider-lines-val').html(NUM_POINTS);
	$('#slider-sat-val').html(SATURATION + '%');
	$('#slider-bright-val').html(BRIGHTNESS + '%');
	$('#slider-color-val').html('every ' + COLOR_TWEEN_INTERVAL + ' frame' + (COLOR_TWEEN_INTERVAL == 1 ? '' : 's'));
	$('#slider-hue-val').html(COLOR_HUE_INCREMENT + ' degrees');
}

function step()
{
	if(renderStep)
	{
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		canvas.width = canvasWidth;
		
		for(var i = 0; i < NUM_POLYGONS; i++)
		{
			polygonsList[i].render(context);
		}
	}
	else
	{
		for(var i = 0; i < NUM_POLYGONS; i++)
		{
			polygonsList[i].update();
		}
	}
	
	renderStep = !renderStep;
}