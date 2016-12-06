/**
 * Created by qizhang on 11/24/16.
 */
var secrets = require('../config/secrets');
var DARSUser = require('../models/darsuser');
var mongoose = require('mongoose');

module.exports = function (router) {

    var usersRoute = router.route('/darsusers');

    // GET
    usersRoute.get(function (req, res) {
        // initialize query parameters
        var sort = eval("(" + req.query.sort + ")");
        var where = eval("(" + req.query.where + ")");
        var select = eval("(" + req.query.select + ")");
        var skip = eval("(" + req.query.skip + ")");
        var limit = eval("(" + req.query.limit + ")");
        var count = eval("(" + req.query.count + ")");
        // return all users by default
        if (limit === null)
            limit = 0;

        // return count
        if (count == "true" || count == true) {
            DARSUser.count(where, function (err, userCount) {
                if (err)
                    return res.status(500).send({message: 'Error: fail to retrieve user count', data: 0});
                // No error:
                return res.status(200).send({message: 'DARSUser count successfully returned', data: userCount});
            }).skip(skip).limit(limit).sort(sort);
        }

        // return users
        else {
            DARSUser.find(where, function (err, users) {
                if (err)
                    return res.status(500).send({message: 'Error: fail to retrieve users', data: []});
                return res.status(200).send({message: 'Users successfully returned', 'data': users});
            }).skip(skip).select(select).limit(limit).sort(sort).exec();
        }

    });

    // POST
    usersRoute.post(function (req, res) {

        var user = new DARSUser();

        user.netid = req.body.netid;
        user.name = req.body.name;
        user.graduationDate = req.body.graduationDate;
        user.classTaken = req.body.classTaken;
        user.classInProgress = req.body.classInProgress;
        user.classRegistered = req.body.classRegistered;

        // --------- Check all required fields exist
        if (user.name === null || user.name === "" || user.name === undefined) {
            return res.status(400).send({message: 'Missing field: Name', data: []});
        }

        if (user.netid === null || user.netid === "" || user.netid === undefined) {
            return res.status(400).send({message: 'Missing field: Netid', data: []});
        }

        if (user.graduationDate === null || user.graduationDate === "" || user.graduationDate === undefined) {
            return res.status(400).send({message: 'Missing field: graduation Date', data: []});
        }
        // ---------- End check

        else {
            // check duplicate emails
            user.save(function (err) {
                if (err)
                    return res.status(500).send({message: 'Server Internal Error: DARSUser not added', data: []});

                return res.status(201).json({message: 'DARSUser successfully added', data: user});
            });
        }


    });

    // OPTIONS
    usersRoute.options(function (req, res) {
        res.writeHead(200);
        res.end();
    });
    return router;
};