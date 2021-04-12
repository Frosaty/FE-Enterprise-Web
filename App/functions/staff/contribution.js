const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')
const staff = require('.')

//-------Description---------
// show: show single element
// list: show multiple elements as list
// remove: delete single element



// -------------------- SHOW ---------------------- //
var show = async function(req, callback){
    var id = 0
    if(req.query.id != undefined && req.query.id != 0)
        id = req.query.id
    await db.contribution.select(
        function(result){
            content = {
                contributions: result.recordset
            }
            callback(content)
        },"-title, -mark, -submitted_date, -is_active", `contributions.id = ${id}`)
}

// -------------------- LIST ---------------------- //
var list = async function(req, callback){

    var name = ""
    var title = ""
    var topic = "> 0"
    var faculty = "> 0"
    
    
    if(req.query.name != undefined)
        name = req.query.name
    if(req.query.topic != undefined && req.query.topic != 0)
        topic = " = " + req.query.topic
    if(req.query.faculty != undefined && req.query.faculty != 0)
        faculty = " = " + req.query.faculty
    if(req.query.title != undefined)
        title = req.query.title

    if(req.session.user != undefined){
        if(req.session.user.user_type_id == 3)
        faculty = " = " + req.session.user.faculty_id
    }
    

    var contributions = await db.contribution.select(
    function(result){
        content = {
            contributions: result.recordset
        }
        callback(content)
    },"-title, -mark, -submitted_date, -is_active", `CONCAT(users.first_name, ' ', users.last_name)  LIKE '%${name}%' AND -topic_id ${topic} AND users.faculty_id ${faculty} AND -title LIKE '%${title}%'`)
    
}


// -------------------- REMOVE ---------------------- //
var edit_title = async function(req){
    await db.contribution.update(`title = '${req.body.title}'`, `id = ${req.body.id}`)
}

var edit_active = async function(req){
    await db.contribution.update(`is_active = ${req.query.active}`, `id = ${req.query.id}`)
}

var edit_mark = async function(req){
    await db.contribution.update(`mark = ${req.body.mark}`, `id = ${req.body.id}`)
}


// ------------------- EXPORT ------------------------ //
module.exports = {
    show: show,
    list: list,
    edit_title: edit_title,
    edit_active: edit_active,
    edit_mark: edit_mark
}