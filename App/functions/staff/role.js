const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')

// -------------------- ADD ---------------------- //
var add = async function(req){

}

// -------------------- SHOW ---------------------- //
var show = async function(req){

}

// -------------------- LIST ---------------------- //
var list = async function(req, callback){
    var topics = await db.role.select( 
    function(result){
        content.roles = result.recordset
        callback(content)
    })
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