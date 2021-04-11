const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')

// -------------------- ADD ---------------------- //
var add = async function(req){

}

// -------------------- SHOW ---------------------- //
var show = async function(req, callback){
    var users = await db.user.select( 
        function(result){
            content = {
                users: result.recordset
             }
            callback(content)
        }, "-first_name, -last_name, -phone, -email, -dob, -user_type_id, -faculty_id, -gender, -address, -password", `-id = ${req.query.id}`)
}


// -------------------- LIST ---------------------- //
var list = async function(req, callback){
    
    var name = ""
    var role = "> 0"
    var faculty = "> 0"
    var email = ""
    
    if(req.query.name != undefined)
        name = req.query.name
    if(req.query.role != undefined && req.query.role != 0)
        role = " = " + req.query.role
    if(req.query.faculty != undefined && req.query.faculty != 0)
        faculty = " = " + req.query.faculty
    if(req.query.email != undefined)
        email = req.query.email

    var users = await db.user.select( 
    function(result){
        content = {
           users: result.recordset
        }
        callback(content)
    }, "-first_name, -last_name, -phone, -email", `-user_type_id <> 1 AND CONCAT(-first_name, ' ', -last_name)  LIKE '%${name}%' AND -user_type_id ${role} AND -faculty_id ${faculty} AND -email LIKE '%${email}%'`)
}

// -------------------- REMOVE ---------------------- //
var remove = async function(req){
    api.user.delete(req.query.id, fun)
}

// -------------------- EDIT ---------------------- //



// ------------------- EXPORT ------------------------ //
module.exports = {
    add: add,
    show: show,
    list: list,
    remove: remove
    

}