function Timebox(canvas) {
	var countdown
	var ctx = canvas.getContext("2d")
	var diameter = 0
	var radius = 0
	var isDragging = false

	window.addEventListener("resize", function() {
		console.log("resize")
		resize()
	})
	
	resize()
	
    addDragListeners()
	

	this.start = function(minutes) {
		
		draw(minutes,0)
		countdown = new Countdown(minutes, function(minute, second){
	    	draw(minute,second)
		})
		countdown.setFinishedListener(playPing)
		countdown.start()	
	}

	function resize() {
		var rect = canvas.getBoundingClientRect()
		diameter = Math.min(window.innerHeight, window.innerWidth)
		canvas.width  = diameter;
		canvas.height = diameter;

		radius = diameter / 2;
		ctx.translate(radius, radius);
		radius = radius * 0.90
		drawLogo()
	}

	function drawLogo() {
		var logo = new Image();
  		logo.onload = function(){
    		ctx.drawImage(logo, radius*0.64, radius*0.8, radius*0.4, radius*0.2);
  		}	
		logo.src = 'resources/images/it-agileLogo.png';
	}

	function playPing() {
		var audio = new Audio("resources/audio/ping.mp3")
		audio.play()
	}
	
	function addDragListeners() {
		canvas.addEventListener("mousedown", mouseDownListener,false);
		canvas.addEventListener("mousemove", mousePositionListener,true);
		canvas.addEventListener("mouseup", draggingEnd, false);
		
		canvas.addEventListener("touchstart", touchDown, false);
	    canvas.addEventListener("touchmove", touchMove, true);
	    canvas.addEventListener("touchend", draggingEnd, false);
	}

	function draw(minute, second) {
		canvas.style.backgroundColor = 'white'
		drawFace()
    	drawTime(minute, second)
    	drawCenter()
	}

	function mouseDownListener(evt) {
		draggingStart(evt)
		mousePositionListener(evt)
	}

	function touchDown(evt) {
		draggingStart(evt)
		touchMove(evt)
	}

	function fullScreen() {
		if(canvas.webkitRequestFullScreen) 
           	canvas.webkitRequestFullScreen()
        else 
            canvas.mozRequestFullScreen()
	}

	function draggingStart(evt) {
		evt.preventDefault()
		countdown.stop();
		isDragging = true;
	}

	function draggingEnd(evt) {
		evt.preventDefault()
		countdown.start();
		isDragging = false;
	}

	function mousePositionListener(evt) {
		evt.preventDefault()
		changeTimeByDragging(evt.clientX, evt.clientY)
	}
	
	function touchMove(evt) {
		evt.preventDefault()
		changeTimeByDragging(evt.targetTouches[0].clientX, evt.targetTouches[0].clientY)	  	
	}

	function changeTimeByDragging(clientX, clientY) {

		if(isDragging) {
			var bRect = canvas.getBoundingClientRect()
			var mouseX = (clientX - bRect.left)*(canvas.width/bRect.width)
			var mouseY = (clientY - bRect.top)*(canvas.height/bRect.height)

			var centerX = canvas.width/2
			var centerY = canvas.height/2
			console.log("mouseX "+ mouseX)
			console.log("mouseY "+ mouseY)
			console.log("centerX "+ centerX)
			console.log("centerY "+ centerY)
			if(mouseX > centerX-radius*0.1 && mouseX < centerX+radius*0.1 && mouseY > centerY-radius*0.1 && mouseY < centerY+radius*0.1) {
				fullScreen()
			} else {
				var minutes = new PointTimeConverter(Math.min(centerX, centerY), Math.min(centerX, centerY)).toMinutes(mouseX, mouseY)
				draw(minutes,0)
				
				countdown = new Countdown(minutes, function(minute, second){
			    	draw(minute,second)
			  	})
			  	countdown.setFinishedListener(playPing)
		  }
	  	}
	}

    function drawCenter() {
		drawCenterCircle('white', radius*0.2)
    	drawCenterCircle('#333', radius*0.1)
	}

	function drawFace() {
	  	drawCenterCircle('white', radius)
	  	ctx.strokeStyle = "#333"
	  	ctx.lineWidth = radius*0.05
	  	ctx.stroke()
	  	drawNumbers()
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
		drawRemainingTimeArea(minute, clockwise)
		drawHand(0, radius*0.84, radius*0.02, 'red');
		drawHand(minute, radius*0.84, radius*0.01,'red');
		drawDragButton(minute)
	}

	function drawRemainingTimeArea(minute, clockwise) {
		ctx.beginPath();
		 ctx.arc(0, 0, radius*0.85, 1.5*Math.PI, 1.5*Math.PI+minute, clockwise);
		 ctx.lineWidth = radius*0.01;
		 ctx.fillStyle = 'red';
		 ctx.lineTo(0, 0);
		 ctx.fill();
	}

	function drawDragButton(minute) {
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

}


