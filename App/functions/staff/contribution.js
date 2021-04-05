const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')

//-------Description---------
// show: show single element
// list: show multiple elements as list
// remove: delete single element



// -------------------- SHOW ---------------------- //
var show = async function(req){

}

// -------------------- LIST ---------------------- //
var list = async function(req, callback){
    var contributions = await db.contribution.select(
    function(result){
        content = {
            contributions: result.recordset
        }
        callback(content)
    },"-title, -mark, -submitted_date, -is_active")
    
}


// -------------------- REMOVE ---------------------- //
var remove = async function(req){

}



// ------------------- EXPORT ------------------------ //
module.exports = {
    show: show,
    list: list,
    remove: remove,
}