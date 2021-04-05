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
    var users = await db.user.select( 
    function(result){
        content = {
           users: result.recordset
        }
        callback(content)
    }, "-first_name, -last_name, -phone, -email", "-user_type_id <> 1")
}

// -------------------- REMOVE ---------------------- //
var remove = async function(req){
    api.user.delete(req.query.id, fun)
}

// -------------------- EDIT ---------------------- //
var edit = async function(req){

}

// ------------------- EXPORT ------------------------ //
module.exports = {
    add: add,
    show: show,
    list: list,
    remove: remove,
    edit: edit
}