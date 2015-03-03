Parse.Cloud.useMasterKey();

Parse.Cloud.job("removeUnusedUrbanAirship", function(request, status) {
    var UA_INSTALLED = "uaInstalled";
    var UA_OPT_IN = "uaOptIn";
    var query = new Parse.Query(Parse.Installation);
    query.equalTo(UA_INSTALLED, false)
        .equalTo(UA_OPT_IN, false);
    var count = 0;

    query.each(function(install) {
        count++;
        status.message(count.toString());
        install.destroy();
    }).then(function() {
        status.success(count + " Urban Airship entries removed");
    }, function(error) {
        status.error("Removed: " + count + " before " + error.message);
    });
});

Parse.Cloud.define("countUnusedUrbanAirship", function(request, response) {
    var UA_INSTALLED = "uaInstalled";
    var UA_OPT_IN = "uaOptIn";
    var query = new Parse.Query(Parse.Installation);
    query.equalTo(UA_INSTALLED, false)
        .equalTo(UA_OPT_IN, false);

    query.count({
        success: function(count) {
            console.log("Unused UA: " + count);
            response.success();
        },
        error: function() {
            response.error("Error " + error.code + " : " + error.message + " when getting count.");
        }
    });
});

Parse.Cloud.job("addAllChannel", function(request, status) {
    var ALL_CHANNEL = "ALL";
    var CHANNELS = "channels";
    var query = new Parse.Query(Parse.Installation);
    query.notContainedIn(CHANNELS, [ALL_CHANNEL]);
    var count = 0;

    query.each(function(install) {
        count++;
        var channels = install.get(CHANNELS);
        // http://stackoverflow.com/a/26633883/802421
        if (channels && channels.constructor === Array) {
            channels.push(ALL_CHANNEL);
        } else {
            install.set(CHANNELS, new Array(ALL_CHANNEL));
        }
        install.save();
        status.message(count.toString());
    }).then(function() {
        status.success(count + " ParseInstallations without \"ALL\" channel");
    }, function(error) {
        status.error(count + " ParseInstallations without \"ALL\" channel handled" + " before " + error.message);
    });
});

Parse.Cloud.define("countInstallWithoutAllChannel", function(request, response) {
    var ALL_CHANNEL = "ALL";
    var query = new Parse.Query(Parse.Installation);
    query.notContainedIn("channels", [ALL_CHANNEL]);

    query.count({
        success: function(count) {
            console.log(count + " ParseInstallations without \"ALL\" channel");
            response.success(count + " ParseInstallations without \"ALL\" channel");
        },
        error: function() {
            response.error(error.message);
        }
    });
});
