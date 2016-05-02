/*
h = hour in floating point 2.25 = 2:15
cx,cy = center coordinates
hLength = length of hour hand
mLength = lenght of min hand
// Hour hand
hAngle = 2.0*Pi*h/12.0; // 0..12 mapped to 0..2*Pi
hX = cX + hLength * sin(hAngle);
hY = cY - hLength * cos(hAngle);

// Min hand
mAngle = 2.0*Pi*h; // 0..1 mapped to 0..2*Pi, etc.
mX = cX + mLength * sin(mAngle);
mY = cY - mLength * cos(mAngle);

distance of two points
sqr(pow(x1-x2) + pow(y1-y2))
*/
function PointTimeConverter(centerX, centerY) {

	this.toMinutes = function(x, y) {
		var cX = centerX
		var cY = centerY
		var d = Math.sqrt(Math.pow(cX-x, 2) + Math.pow(cY-y, 2))
		console.log('distance = ' + d)
		var leftRight = Math.asin((x -cX)/d)
		console.log('angleX = ' + leftRight)
		
		var angleY = Math.acos((-(y -cX))/d)
		console.log('angley = ' + angleY)

		var angle =0.
		if(leftRight > 0.)
			angle = angleY
		else
			angle = Math.PI + Math.PI-angleY

		var h = angle/(2.0 * Math.PI)
		var minutes = Math.round(60*h)
		console.log('h = ' + minutes)
		return minutes
		

	}
}