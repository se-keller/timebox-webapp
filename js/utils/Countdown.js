function Countdown (minutes, execute) {
    var countdown
    var finishedCallback

    this.start = function() {
        var startMillis = new Date().getTime()
        var callbackCalled = false
        countdown = setInterval(function(){
            var nowMillis = new Date().getTime()
            var minute = Math.floor((minutes*60*1000 - (nowMillis-startMillis))/1000/60)
            var second = Math.floor(((minutes*60*1000 - (nowMillis-startMillis))/1000)%60)

            if(minute >=0 && second >=0)
                execute(minute, second)
            else {
                if(!callbackCalled)
                    finishedCallback()
                callbackCalled = true
                this.stop()
            }
        }, 1000 )
    }

    this.stop = function() {
        clearInterval(countdown)
    }

    this.setFinishedListener = function(finishedListener) {
        finishedCallback = finishedListener
    }

}