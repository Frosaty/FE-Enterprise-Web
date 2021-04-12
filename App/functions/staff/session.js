const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')
const alert = require('alert');


// -------------------- ADD ---------------------- //
var add = async function(req){

}


// -------------------- LOG IN ---------------------- //
var login = async function(req, callback) {
    await db.user.select( 
        function(result){
            var result = result.recordset
            callback(result)
        }, "-first_name, -last_name, -user_type_id, -faculty_id", `-email = '${req.body.email}' AND -password = '${req.body.password}'`)
}

var add_coordinate_contact = async function(req, callback){
    var users = await db.user.select( 
        function(result){
            var result = result.recordset[0].email
            callback(result)
        }, "-email", `-faculty_id = ${req.session.user.faculty_id} AND -user_type_id = 3`)
}


// ------------------- EXPORT ------------------------ //
module.exports = {
    login: login,
    add_coordinate_contact: add_coordinate_contact
}