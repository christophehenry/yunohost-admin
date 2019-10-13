(function() {
    // Get application context
    var app = Sammy.apps['#main'];
    var store = app.store;

    // *********
    // Diagnosis
    // *********

    // Server monitoring
    app.get('#/diagnosis', function (c) {

        // Why this method ?
        c.api('/diagnosis/show?full', function(data) {
        for (var i = 0 ; i < data.reports.length ; i++)
        {
            // Convert timestamp to datetime
            data.reports[i].time = new Date(data.reports[i].timestamp*1000);
            data.reports[i].warnings = 0;
            data.reports[i].errors = 0;
            data.reports[i].ignored = 0;
            for (var j = 0 ; j < data.reports[i].items.length ; j++)
            {
                var type_ = data.reports[i].items[j].status;
                type_ = type_.toLowerCase();
                var ignored = data.reports[i].items[j].ignored;
                var icon = "";
                var issue = false;

                if (type_ == "success") {
                    icon = "check-circle";
                }
                else if (ignored == true) {
                    icon = type_;
                    if (type_ == "error") {
                        icon = "times"
                    }
                    type_ = "ignored";
                    data.reports[i].ignored++;
                }
                else if (type_ == "warning") {
                    icon = "warning";
                    issue = true;
                    data.reports[i].warnings++;
                }
                else if (type_ == "error") {
                    type_ = "danger";
                    icon = "times";
                    issue = true;
                    data.reports[i].errors++;
                }
                data.reports[i].items[j].status = type_;
                data.reports[i].items[j].icon = icon;
                data.reports[i].items[j].issue = issue;
            };
            data.reports[i].noIssues = data.reports[i].warnings + data.reports[i].errors ? false : true;
        };
        c.view('diagnosis/diagnosis_show', data, function() {
            $(".rerun-diagnosis").click(function() {
                var category = $(this).attr("category");
                c.api('/diagnosis/run?force', function(data) {
                    // This is a copy-pasta of some of the
                    // redirect/refresh code of sammy.js
                    // because for some reason calling the function did not work >.>
                    var to = "#/diagnosis";
                    c.trigger('redirect', {to: to});
                    c.app.last_location = c.path;
                    c.app.setLocation(to);
                    c.app.trigger('location-changed');
                }, 'POST', {"categories": [category]});
            });
        });
        }, 'GET');

    });

})();
