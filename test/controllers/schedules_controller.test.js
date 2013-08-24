var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function ScheduleStub () {
    return {
        uid: '',
        offerings: ''
    };
}

describe('ScheduleController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /schedules/new
     * Should render schedules/new.ejs
     */
    it('should render "new" template on GET /schedules/new', function (done) {
        request(app)
        .get('/schedules/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/schedules\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /schedules
     * Should render schedules/index.ejs
     */
    it('should render "index" template on GET /schedules', function (done) {
        request(app)
        .get('/schedules')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/schedules\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /schedules/:id/edit
     * Should access Schedule#find and render schedules/edit.ejs
     */
    it('should access Schedule#find and render "edit" template on GET /schedules/:id/edit', function (done) {
        var Schedule = app.models.Schedule;

        // Mock Schedule#find
        Schedule.find = sinon.spy(function (id, callback) {
            callback(null, new Schedule);
        });

        request(app)
        .get('/schedules/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Schedule.find.calledWith('42').should.be.true;
            app.didRender(/schedules\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /schedules/:id
     * Should render schedules/index.ejs
     */
    it('should access Schedule#find and render "show" template on GET /schedules/:id', function (done) {
        var Schedule = app.models.Schedule;

        // Mock Schedule#find
        Schedule.find = sinon.spy(function (id, callback) {
            callback(null, new Schedule);
        });

        request(app)
        .get('/schedules/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Schedule.find.calledWith('42').should.be.true;
            app.didRender(/schedules\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /schedules
     * Should access Schedule#create when Schedule is valid
     */
    it('should access Schedule#create on POST /schedules with a valid Schedule', function (done) {
        var Schedule = app.models.Schedule
        , schedule = new ScheduleStub;

        // Mock Schedule#create
        Schedule.create = sinon.spy(function (data, callback) {
            callback(null, schedule);
        });

        request(app)
        .post('/schedules')
        .send({ "Schedule": schedule })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Schedule.create.calledWith(schedule).should.be.true;

            done();
        });
    });

    /*
     * POST /schedules
     * Should fail when Schedule is invalid
     */
    it('should fail on POST /schedules when Schedule#create returns an error', function (done) {
        var Schedule = app.models.Schedule
        , schedule = new ScheduleStub;

        // Mock Schedule#create
        Schedule.create = sinon.spy(function (data, callback) {
            callback(new Error, schedule);
        });

        request(app)
        .post('/schedules')
        .send({ "Schedule": schedule })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Schedule.create.calledWith(schedule).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /schedules/:id
     * Should redirect back to /schedules when Schedule is valid
     */
    it('should redirect on PUT /schedules/:id with a valid Schedule', function (done) {
        var Schedule = app.models.Schedule
        , schedule = new ScheduleStub;

        Schedule.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/schedules/1')
        .send({ "Schedule": schedule })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/schedules/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /schedules/:id
     * Should not redirect when Schedule is invalid
     */
    it('should fail / not redirect on PUT /schedules/:id with an invalid Schedule', function (done) {
        var Schedule = app.models.Schedule
        , schedule = new ScheduleStub;

        Schedule.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/schedules/1')
        .send({ "Schedule": schedule })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /schedules/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Schedule on DELETE /schedules/:id');

    /*
     * DELETE /schedules/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Schedule on DELETE /schedules/:id if it fails');
});
