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
    var topics = await db.faculty.select( 
        function(result){
            content ={
                faculties: result.recordset
            }
            callback(content)
        },`id = ${req.query.id}`)
}


// -------------------- LIST ---------------------- //
var list = async function(req, callback){
    var faculties = await db.faculty.select( 
        function(result){
            content = {
                faculties: result.recordset
            }
            callback(content)
        })
}

// -------------------- REMOVE ---------------------- //
var remove = async function(req){
    api.faculty.delete(req.query.id)
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