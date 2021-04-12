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

    try{

    }catch{
        on_error(err)
    }
}

// -------------------- SHOW ---------------------- //
var show = async function(req){

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