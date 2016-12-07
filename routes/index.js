/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router, passport) {
    // DARS related route
    app.use('/api', require('./darsuser.js')(router));
    app.use('/api', require('./darsusers.js')(router));
    app.use('/api', require('./route.js')(router, passport));
};