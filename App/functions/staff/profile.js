const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')

//-------Description---------
// add: add new element
// show: show single element
// list: show multiple elements as list
// remove: delete single element
// edit: update single element

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
        }, "-first_name, -last_name, -phone, -email, -dob, -user_type_id, -faculty_id, -gender, -address, -password", `-id = ${req.session.user.id}`)
}

// -------------------- LIST ---------------------- //
var list = async function(req){

}

// -------------------- REMOVE ---------------------- //
var remove = async function(req){

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