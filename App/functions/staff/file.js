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
     await db.file.select( 
        function(result){
            content = {
                files: result.recordset
            }
            callback(content)
    },`contribution_id = ${req.query.id}`)
}

// -------------------- REMOVE ---------------------- //
var remove = async function(id, path){
    await db.file.delete_file(id)
    await f.delete_file(path)
}


// ------------------- EXPORT ------------------------ //
module.exports = {
    show: show,
    list: list,
    remove: remove,
}