/**
 * @constructor
 */
function Polygon(canvasWidth, canvasHeight, numTrails, numPoints, saturation, brightness, colorTweenInterval, colorHueIncrement)
{
	this._canvasWidth = canvasWidth;
	this._canvasHeight = canvasHeight;
	this._curHue = this.getRand(360);
	this.setColorOptions(saturation, brightness, colorTweenInterval, colorHueIncrement);
	this._numTrails = numTrails;
	this._numPoints = numPoints;
	this._curPointListIndex = 0;
	this._pointList = this.makePointList();
	this._trailsList = [];
	this._context = null;
	
	var dest;
	for(var i = 0; i < this._numTrails; i++)
	{
		dest = [];
		this.copyPointList(this._pointList, dest);
		this._trailsList.push(dest);
	}
}

Polygon.prototype.setColorOptions = function(saturation, brightness, colorTweenInterval, colorHueIncrement)
{
	this._saturation = saturation;
	this._brightness = brightness;
	this._colorTweenInterval = colorTweenInterval;
	this._curColorTweenInterval = 0;
	this._colorHueIncrement = colorHueIncrement;
	this.seedHue();
}

Polygon.prototype.seedHue = function()
{
	this._targetHue = this.getRand(360);
	this._hueDirection = this.getRand(1) == 0 ? -1 : 1;
}

Polygon.prototype.update = function()
{
	this._curColorTweenInterval = (this._curColorTweenInterval + 1) % this._colorTweenInterval;
	if(this._curColorTweenInterval == 0)
	{
		if(this._curHue == this._targetHue)
		{
			this.seedHue();
		}
		else
		{
			this._curHue += this._hueDirection * this._colorHueIncrement;
		}
	
		if(this._curHue > 360)
		{
			this._curHue -= 360;
		}
		if(this._curHue < 0)
		{
			this._curHue += 360;
		}
	}
	
	if(this._trailsList.length > 0)
	{
		this.overwritePointList(this._pointList, this._trailsList[this._curPointListIndex]);
		this._curPointListIndex = (this._curPointListIndex + 1) % this._numTrails;
	}
	this.updatePointList();
}

Polygon.prototype.render = function(context)
{
	this._context = context;
	
	var colorStr = this.getColorString();
	this.renderPointList(this._pointList, colorStr, 1);
	for(var i = 0; i < this._numTrails; i++)
	{
		this.renderPointList(this._trailsList[i], colorStr, 1);
	}
}

Polygon.prototype.getColorString = function()
{
	return 'hsl(' + this._curHue + ', ' + this._saturation + '%, ' + this._brightness + '%)';
}

Polygon.prototype.getRand = function(highest)
{
	return Math.floor(Math.random() * highest);
}

Polygon.prototype.makePointList = function()
{
	var pointList = [];
	for(var i = 0; i < this._numPoints; i++)
	{
		pointList.push(this.makePoint(this.getRand(this._canvasWidth), this.getRand(this._canvasHeight), 10, this.getRand(360)));
	}
	
	return pointList;
}

Polygon.prototype.makePoint = function(x, y, speed, angle)
{
	var xSpeed = Math.cos(angle) * speed;
	var ySpeed = Math.sin(angle) * speed;
	
	return {x:x, y:y, xSpeed:xSpeed, ySpeed:ySpeed, totalSpeed:speed};
}

Polygon.prototype.updatePoint = function(point, prePoint)
{
	point.x = prePoint.x + prePoint.xSpeed;
	point.y = prePoint.y + prePoint.ySpeed;
	
	point.xSpeed = prePoint.xSpeed;
	point.ySpeed = prePoint.ySpeed;
	
	point.speed = prePoint.totalSpeed;
	
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
		var newSpeed = this.getRand(13) + 3;
	
		point.xSpeed = newSpeed * point.xSpeed / point.totalSpeed;
		point.ySpeed = newSpeed * point.ySpeed / point.totalSpeed;
		point.totalSpeed = newSpeed;
	}
}

Polygon.prototype.updatePointList = function()
{
	for(var i = 0; i < this._numPoints; i++)
	{
		this.updatePoint(this._pointList[i], this._pointList[i]);
	}
}

Polygon.prototype.copyPointList = function(source, dest)
{
	var len = source.length;
	for(var i = 0; i < len; i++)
	{
		dest.push(this.copyPoint(source[i]));
	}
}

Polygon.prototype.overwritePointList = function(source, dest)
{
	var len = source.length;
	for(var i = 0; i < len; i++)
	{
		this.overwritePoint(source[i], dest[i]);
	}
}

Polygon.prototype.overwritePoint = function(source,dest)
{
	dest.x = source.x;
	dest.y = source.y;
}

Polygon.prototype.copyPoint = function(target)
{
	var point = this.makePoint(0, 0, 0, 0);
	point.x = target.x;
	point.y = target.y;
	point.xSpeed = target.xSpeed;
	point.ySpeed = target.ySpeed;
	point.totalSpeed = target.totalSpeed;
	
	return point;
}

Polygon.prototype.renderPointList = function(pointList, color, lineWidth)
{
	if(pointList.length > 0)
	{
		this._context.beginPath();
		
		for(var i = 0; i < this._numPoints; i++)
		{
			this.renderLine(pointList[i], pointList[(i + 1) % this._numPoints]);
		}
		
		this._context.strokeStyle = color;
		this._context.lineWidth = lineWidth;
		this._context.lineCap = 'round';
		
		this._context.closePath();
		this._context.stroke();
	}
}

Polygon.prototype.renderLine = function(point1, point2)
{
	this._context.moveTo(point1.x, point1.y);
	this._context.lineTo(point2.x, point2.y);
}