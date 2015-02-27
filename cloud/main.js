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
