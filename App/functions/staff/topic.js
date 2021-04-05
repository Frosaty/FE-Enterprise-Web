const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')

// -------------------- ADD ---------------------- //
var add = async function(req){

}

// -------------------- SHOW ---------------------- //
var show = async function(req, callback){
    var topics = await db.topic.select( 
        function(result){
            content ={
                topics: result.recordset
            }
            callback(content)
        },`id = ${req.query.id}`)
}

// -------------------- LIST ---------------------- //
var list = async function(req, callback){
    var topics = await db.topic.select( 
    function(result){
        content ={
            topics: result.recordset
        }
        callback(content)
    })
}

// -------------------- REMOVE ---------------------- //
var remove = async function(req){
    api.topic.delete(req.query.id)
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