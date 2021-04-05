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
var add = async function(req, onError){
    
    // ----- Validate sending file ------
    var files = req.files
    if (!files.length) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    // ------- Store file location --------



    // ------- Send email ---------
    var receiver_email = 'hunghcgcs18026@fpt.edu.vn'
    var email_subject = 'Upload files'

    // Set sending email content
    var student_id = 1
    var student_name = 'Nguyen Van A'
    var word_file = 'file'
    if(files.length > 1)
        word_file += 's'
    var email_content = `Student ${student_name} ID: ${student_id} has uploaded ${files.length} ${word_file}. Marketing Coordinate please comments within 14 days!\nUpload ${word_file}:\n`
    
    files.forEach(file => {
        email_content += file.filename + '\n'
    })

    f.send_mail(receiver_email, email_subject, email_content)

    try{
    
    }catch(ex){
        onError(ex)
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