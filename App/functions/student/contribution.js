const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')
const mkdirp = require('mkdirp')
//-------Description---------
// add: add new element
// show: show single element
// list: show multiple elements as list

// -------------------- ADD ---------------------- //
var add = async function(req, dir_name, callback){
    var topic_id = req.query.topic_id
    var user_id = req.session.user.id
    await db.contribution.insert("topic_id, user_id, submitted_date, is_active, title", `${topic_id}, ${user_id}, '${new Date().toISOString()}', 0, 'Empty'`, callback)
    var dir = dir_name + "/Topic_" + topic_id + "/Faculty_" + req.session.user.faculty_id + "/Student_" + user_id
                
    mkdirp(dir, err => {
        console.log(err)
    })
}

// -------------------- SHOW ---------------------- //
var show = async function(req){

}

var list = async function(req, callback){
    var user_id = req.session.user.id 
    db.contribution.select(function(result){
        var content = {
            contributions: result.recordset
        }
        callback(content)
    }, "-title, -mark, -submitted_date, -is_active", `contributions.user_id = ${user_id}`)
}

var list_select = async function(req, callback){

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
    },"-title, -mark, -submitted_date, -is_active", `CONCAT(users.first_name, ' ', users.last_name)  LIKE '%${name}%' AND -topic_id ${topic} AND users.faculty_id ${faculty} AND -title LIKE '%${title}%' AND -is_active = 1`)
    
}
// ------------------- EXPORT ------------------------ //
module.exports = {
    add: add,
    show: show,
    list: list,
    list_select: list_select
}