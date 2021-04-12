const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')
//-------Description---------
// add: add new element
// show: show single element
// list: show multiple elements as list

// -------------------- ADD ---------------------- //
var add = async function(req, callback){
    var topic_id = req.query.topic_id
    var user_id = req.session.user.id
    await db.contribution.insert("topic_id, user_id, submitted_date, is_active, title", `${topic_id}, ${user_id}, '${new Date().toISOString()}', 0, 'Empty'`, callback)
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
    }, "-title, -mark, -submitted_date, -is_active, -topic_id", `contributions.user_id = ${user_id}`)
}

var show = async function(req, callback){
    
}

// ------------------- EXPORT ------------------------ //
module.exports = {
    add: add,
    show: show,
    list: list
}