describe("Countdown", function() {
  var timerCallback
  beforeEach(function() {
    timerCallback = jasmine.createSpy("timerCallback");
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it("executes once per second", function() {
    new Countdown(1, function(minute, second) {
      timerCallback()
    }).start()
    jasmine.clock().tick(1001);
    expect(timerCallback.calls.count()).toEqual(1);
  });

  it("stops after countdown", function() {
    new Countdown(1, function(minute, second) {
      timerCallback()
    }).start()
    jasmine.clock().tick(60*1000+1);
    expect(timerCallback.calls.count()).toEqual(60);
  });

  it("stops after stopping", function() {
    var countdown = new Countdown(1, function(minute, second) {
      timerCallback()
    })
    countdown.start()
    jasmine.clock().tick(1001);
    countdown.stop()
    jasmine.clock().tick(2001);
    expect(timerCallback.calls.count()).toEqual(1);
  });

})