load('application');

before(loadSchedule, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New schedule';
    this.schedule = new Schedule;
    render();
});

action(function create() {
    Schedule.create(req.body.Schedule, function (err, schedule) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: schedule && schedule.errors || err});
                } else {
                    send({code: 200, data: schedule.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Schedule can not be created');
                    render('new', {
                        schedule: schedule,
                        title: 'New schedule'
                    });
                } else {
                    flash('info', 'Schedule created');
                    redirect(path_to.schedules);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Schedules index';
    Schedule.all(function (err, schedules) {
        switch (params.format) {
            case "json":
                send({code: 200, data: schedules});
                break;
            default:
                render({
                    schedules: schedules
                });
        }
    });
});

action(function show(c) {

    this.title = 'Schedule show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.schedule});
            break;
        default:
            c.layout('schedules_show');
            render();
    }
});

action(function edit() {
    this.title = 'Schedule edit';
    switch(params.format) {
        case "json":
            send(this.schedule);
            break;
        default:
            render();
    }
});

action(function update() {
    var schedule = this.schedule;
    this.title = 'Edit schedule details';
    this.schedule.updateAttributes(body.Schedule, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: schedule && schedule.errors || err});
                } else {
                    send({code: 200, data: schedule});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Schedule updated');
                    redirect(path_to.schedule(schedule));
                } else {
                    flash('error', 'Schedule can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.schedule.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy schedule');
                } else {
                    flash('info', 'Schedule successfully removed');
                }
                send("'" + path_to.schedules + "'");
            });
        });
    });
});

function loadSchedule() {
    Schedule.find(params.id, function (err, schedule) {
        if (err || !schedule) {
            if (!err && !schedule && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.schedules);
        } else {
            this.schedule = schedule;
            next();
        }
    }.bind(this));
}
