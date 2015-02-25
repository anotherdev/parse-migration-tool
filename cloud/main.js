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
        install.destroy();
    }).then(function() {
        status.success(count + " Urban Airship entries removed");
    }, function(error) {
        status.error(error);
    });
});
