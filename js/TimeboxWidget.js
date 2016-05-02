var ctx
var radius
var countdown
var canvas
var isMouseDown = false;

document.addEventListener("DOMContentLoaded", function(event) { 
	
	drawClock(15);
	start();
});

function drawClock(minutes) {
	canvas = document.getElementById("timebox");
	var diameter = Math.min(window.innerHeight, window.innerWidth)
	canvas.width  = diameter;
	canvas.height = diameter;
	

	canvas.addEventListener("mousedown", mouseDownListener, false);
	canvas.addEventListener("mouseup", mouseUpListener, false);
	canvas.addEventListener("mousemove", mousePositionListener, false);

	//canvas.addEventListener("touchstart", mouseDownListener, false);
    //canvas.addEventListener("touchmove", mousePositionListener, false);
    //canvas.addEventListener("touchend", mouseUpListener, false);


	ctx = canvas.getContext("2d");
	radius = diameter / 2;
	ctx.translate(radius, radius);
	radius = radius * 0.90
  	countdown = new Countdown(minutes, function(minute, second){
    	execute(minute, second)
  	})
}

function mouseDownListener(evt) {
	evt.preventDefault()
	countdown.stop();
	isMouseDown = true;
	console.log('stop')
	mousePositionListener(evt)
}

function mouseUpListener(evt) {
	evt.preventDefault()
	countdown.start();
	isMouseDown = false;
	console.log('start')
}

function mousePositionListener(evt) {
	evt.preventDefault()
	if(isMouseDown) {
		var bRect = canvas.getBoundingClientRect()
		mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width)
		mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height)
		var centerX = canvas.width/2
		var centerY = canvas.height/2
		var minutes = new PointTimeConverter(Math.min(centerX, centerY), Math.min(centerX, centerY)).toMinutes(mouseX, mouseY)
		console.log('mouse: '+mouseX + ':' + mouseY)
		console.log('event: '+evt.clientX + ':' + evt.clientY)
		execute(minutes, 0)
		
		countdown = new Countdown(minutes, function(minute, second){
	    	execute(minute, second)
	  	})
  	}
  	
}

function start() {
	countdown.start()
}

function execute(minute, second) {
        drawFace();
        drawNumbers();
        drawTime(minute, second);
        

        drawCenterCircle('white', radius*0.2)

        drawCenterCircle('#333', radius*0.1)
      }

function drawFace() {
  drawCenterCircle('white', radius)
  
  ctx.strokeStyle = "#333";
  ctx.lineWidth = radius*0.05;
  ctx.stroke();
}

function drawCenterCircle(color, width) {
	ctx.beginPath();
    ctx.arc(0, 0, width, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawNumbers() {
 	drawMinuteStrokesEvery(1)
 	drawCenterCircle('white', radius*0.95)

 	drawMinuteStrokesEvery(5)
	drawCenterCircle('white', radius*0.9)
}

function drawMinuteStrokesEvery(seconds) {
	ctx.beginPath();
	for(var num = 0; num < 60; num+=seconds){
	    var ang = num * Math.PI / 30;
	    ctx.lineCap = "round";
	    ctx.lineWidth = radius*0.04;
	    ctx.moveTo(0,0);
	    ctx.rotate(ang);
	    ctx.lineTo(0, -radius);
	    ctx.strokeStyle = '#333';
	    ctx.stroke();
	    ctx.rotate(-ang);
	}
}

function drawTime(minute, second, clockwise){
    if(clockwise){
        minute = 59-minute
        second = 59-second
     } 
      
	 minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
	  
	 ctx.beginPath();
	 ctx.arc(0, 0, radius*0.85, 1.5*Math.PI, 1.5*Math.PI+minute, clockwise);
	 ctx.lineWidth = radius*0.01;
	 ctx.fillStyle = 'red';
	 ctx.lineTo(0, 0);
	 ctx.fill();


	drawHand(0, radius*0.84, radius*0.02, 'red');
	drawHand(minute, radius*0.84, radius*0.01,'red');
	

	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.rotate(minute);
	ctx.arc(0, -radius*0.83, radius*0.06, 0, 2*Math.PI);
	ctx.fillStyle = "rgba(255, 255, 255, 0.80)";
	ctx.fill();
	ctx.rotate(-minute);


	ctx.beginPath();
	ctx.rotate(minute);
	ctx.arc(0, -radius*0.83, radius*0.06, 0, 2*Math.PI);
	ctx.strokeStyle = 'darkgrey'
	ctx.lineWidth = radius*0.01;
	ctx.stroke()
	ctx.rotate(-minute);
}

function drawHand(pos, length, width, color) {
    ctx.beginPath();
    ctx.lineWidth = width;
    
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.rotate(-pos);
}