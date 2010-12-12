var INTERVAL_TIME = 45;
var NUM_TRAILS = 7;
var NUM_POINTS = 4;

var curPointListIndex = 0;
var pointLists = [];
var canvas;
var context;

var numSteps = 0;
var intervalID;

var canvasWidth;
var canvasHeight;

//import polygon.js;

//document.write('<script type="text/javascript" src="js/polygon.js"></script>');

var poly = new Polygon(NUM_TRAILS, NUM_POINTS);
console.log(poly.getName());

$(document).ready(init);
//init:

function getRand(highest)
{
	return Math.floor(Math.random() * highest);
}

function makePointList()
{
	var pointList = [];
	
	for(var i = 0; i < NUM_POINTS; i++)
	{
		pointList.push(makePoint(getRand(canvasWidth), getRand(canvasHeight), 10, getRand(360)));
	}
	
	return pointList;
}

function makePoint(x, y, speed, angle)
{
	xSpeed = Math.cos(angle) * speed;
	ySpeed = Math.sin(angle) * speed;
	
	return {x:x, y:y, xSpeed:xSpeed, ySpeed:ySpeed, totalSpeed:speed};
}

function updatePoint(point, prePoint, isFirst)
{
	point.x = prePoint.x + prePoint.xSpeed;
	point.y = prePoint.y + prePoint.ySpeed;
	
	point.xSpeed = prePoint.xSpeed;
	point.ySpeed = prePoint.ySpeed;
	
	point.speed = prePoint.totalSpeed;
	
	
	if(isFirst)
	{
		var wallHit = false;
		if(point.x < 0)
		{
			wallHit = true;
			point.xSpeed *= -1;
			
			point.x = 0;
		}
		else if(point.x > canvasWidth)
		{
			wallHit = true;
			point.xSpeed *= -1;
			
			point.x = canvasWidth;
		}
	
		if(point.y < 0)
		{
			wallHit = true;
			point.ySpeed *= -1;
			
			point.y = 0;
		}
		else if(point.y > canvasHeight)
		{
			wallHit = true;
			point.ySpeed *= -1;
			
			point.y = canvasHeight;
		}
	
		if(wallHit)
		{
			var newSpeed =getRand(17) + 3;
		
			point.xSpeed = newSpeed * point.xSpeed / point.totalSpeed;
			point.ySpeed = newSpeed * point.ySpeed / point.totalSpeed;
			point.totalSpeed = newSpeed;
		}
	}
}

function updatePointList(curPointList, prevPointList, isFirst)
{
	if(curPointList.length == 0)
	{
		copyPointList(prevPointList, curPointList);
	}
	
	for(var i = 0; i < NUM_POINTS; i++)
	{
		updatePoint(curPointList[i], prevPointList[i], isFirst);
	}
}

function copyPointList(source, dest)
{
	var len = source.length;
	for(var i = 0; i < len; i++)
	{
		dest.push(copyPoint(source[i]));
	}
}

function copyPoint(target)
{
	var point = makePoint(0, 0, 0, 0);
	point.x = target.x;
	point.y = target.y;
	point.xSpeed = target.xSpeed;
	point.ySpeed = target.ySpeed;
	point.totalSpeed = target.totalSpeed;
	
	return point;
}

function renderPointList(pointList, color)
{
	if(pointList.length > 0)
	{
	//	console.log('rendering point list');
		for(var i = 0; i < NUM_POINTS; i++)
		{
		//	context.fillStyle = '#FF0000';
			//context.fillRect(pointList[i].x, pointList[i].y, 7, 8);
		
			renderLine(pointList[i], pointList[(i + 1) % NUM_POINTS], color);
		}
	}
}

function renderLine(point1, point2, color)
{
	//console.log('rendering line');
//	console.log(color);
	context.moveTo(point1.x, point1.y);
	context.lineTo(point2.x, point2.y);
	context.strokeStyle = color;
	context.stroke();
}

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
	
	for(var i = 0; i < NUM_TRAILS; i++)
	{
		if(i > 0)
		{
			pointLists.push([]);
		}
		else
		{
			pointLists.push(makePointList());
		}
	}
	
	step();
}

function step()
{
	//numSteps++;
	
//	console.log('step');
	//context.fillStyle = "rgb(200, 0, 0)";
	//context.fillRect (10, 10, 55, 50);
	
	
	//context.clearRect(0, 0, 500, 500);
	//context.fillStyle = '#FF0000';
	//context.fillRect(0, 0, 500, 500);
	canvas.width = canvasWidth;
	for(var i = 0; i < NUM_TRAILS; i++)
	{
		/*
		console.log(i);
		if(i == 2)
		{

			var color = '#FF0000';
		}
		else
		{
			var color = '#FFFFFF';
		}
		*/
		renderPointList(pointLists[i], '#FFFFFF');
	}
	
	//console.log('updatePointList(' + ((curPointListIndex + 1) % NUM_TRAILS) + ',' + curPointListIndex);

	updatePointList(pointLists[(curPointListIndex + 1) % NUM_TRAILS], pointLists[curPointListIndex], curPointListIndex == 0);
	
//	console.log(curPointListIndex);
	curPointListIndex = (curPointListIndex + 1) % NUM_TRAILS;
//	console.log(curPointListIndex);
	
	if(numSteps > 10)
	{
		clearInterval(intervalID);
		//context.clearRect(0, 0, 500, 500);
		//renderPointList(pointLists[0]);
	}
}

