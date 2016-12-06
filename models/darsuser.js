/**
 * Created by qizhang on 11/6/16.
 */
// Load required packages
var mongoose = require('mongoose');

// Define darsuser schema
// All other fields that the user did not specify should be set to reasonable values.
var DARSUserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    // email: {type: String, required: true, unique: true},
    netid: {type: String, required: true, unique: true},
    graduationDate: {type: Date, required: true},

    // course id, semester, grade
    classTaken: [{courseID: String, semester: String, grade: String}],
    classRegistered:[{courseID: String, semester: String, grade: String}],
    classInProgress: [{courseID: String, semester: String, grade: String}]

});

// Export the Mongoose model
module.exports = mongoose.model('DARSUser', DARSUserSchema);