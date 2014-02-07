var es = require('../geteventstore.js'); 

module.exports = {

	setUp: function(callback) {
		callback();
	},
	tearDown: function(callback) {
		callback();
	},
	reading_the_account_stream_returns_all_events: function(test) {
		new es.StreamFeedReader('http://127.0.0.1:2113/streams/')
			.read('account-35')
				.fail(function() {
					test.ok(false, 'reading the stream failed.');
					test.done();
				})
				.done(function(res) {
					var streamContainsEvents = function() {
						test.ok(res.length > 0, 'expected some events in the stream.');	
					};
					var eventsInStreamAreOrdered = function() {
						var ordered = true;
						for (var i = 1; i < res.length; i++) {
						    if (res[i - 1].eventNumber > res[i].eventNumber) {					    	
						    	ordered = false;
						    }
						}
						test.ok(ordered, 'event numbers out of order.');
					};

					streamContainsEvents();
					eventsInStreamAreOrdered();								

					test.done();
				});

	}

}