/**
 * Created by qizhang on 11/24/16.
 */
var secrets = require('../config/secrets');
var DARSUser = require('../models/darsuser');
var mongoose = require('mongoose');

module.exports = function (router) {

    var DARSUserRoute = router.route('/darsusers/:user_id');


    // GET
    DARSUserRoute.get(function (req, res) {

        var id = req.params.user_id;

        // Find the task using its ID
        DARSUser.findOne({'_id': id}, function (err, user) {
            if (err) // Server error
                return res.status(500).send({message: 'Server Error: cannot get user', data: []});
            if (user === null) // Didn't find any users with this id
                return res.status(404).send({message: 'Cannot find the user', data: []});
            // Got the user:
            return res.status(200).send({message: 'DARSUser successfully returned', data: user});
        });

    });


    // PUT
    DARSUserRoute.put(function (req, res) {

        var id = req.params.user_id;

        DARSUser.findOne(
            {'_id': id},
            function (err, user) {
                if (err)
                    return res.status(500).send({message: 'Server error', data: []});
                // DARSUser does not exist
                if (user === null) {
                    return res.status(404).send({message: 'Cannot find user', data: []});
                }


                else {

                    if (!req.body.name || !req.body.netid || !req.body.graduationDate) {
                        return res.status(500).send({message: 'Missing fields: name OR netid OR graduationDate', data: []});
                    }

                    else {
                        user.name = req.body.name;
                        user.netid = req.body.netid;
                        user.graduationDate = req.body.graduationDate;
                        user.password = req.body.password;
                        // Taken
                        if (!req.body.classTaken)
                            user.classTaken = [];
                        else
                            user.classTaken = req.body.classTaken;
                        // in progress
                        if (!req.body.classInProgress)
                            user.classInProgress = [];
                        else
                            user.classInProgress = req.body.classInProgress;

                        // registered
                        if (!req.body.classRegistered)
                            user.classRegistered = [];
                        else
                            user.classRegistered = req.body.classRegistered;

                    }
                    // TODO: continue here
                    DARSUser.findByIdAndUpdate(id,
                        {
                            "netid": user.netid,
                            "name": user.name,
                            "graduationDate": user.graduationDate,
                            "password": user.password,
                            "classTaken": user.classTaken,
                            "classInProgress": user.classInProgress,
                            "classRegistered": user.classRegistered,
                            "_id": req.params.user_id
                        },
                        {new: true}
                        ,
                        function (err, user) {
                            if (err)
                                return res.status(500).send({message: 'Server error', data: []});
                            else {
                                return res.status(200).send({message: ' DARSUser successfully updated', data: user});
                            }

                        });
                }
            }
        );

    });

    // DELETE
    DARSUserRoute.delete(function (req, res) {

        var id = req.params.user_id;

        DARSUser.remove({"_id": id}, function (err, user) {
            if (err)
                return res.status(500).send({message: 'Server Error', data: []});
            if (user.result.n === 0)
                return res.status(404).send({message: 'Cannot find user', data: []});

            return res.status(200).json({message: 'DARSUser successfully deleted ', data: []});
        });

    });


    return router;
};