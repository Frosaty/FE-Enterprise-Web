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




// ------------------- EXPORT ------------------------ //
module.exports = {
    login: login
}