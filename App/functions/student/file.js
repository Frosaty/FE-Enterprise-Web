const f = require('./../assist_functions')
const api = require('./../../api')
const db = require('./../../db')
const { conn } = require('../../db/db_config')

//-------Description---------
// add: add new element
// show: show single element
// list: show multiple elements as list
// remove: delete single element
// edit: update single element

// -------------------- ADD ---------------------- //
var add = async function(req){
    
    // ----- Validate sending file ------
    var files = req.files
    var contribution_id = req.body.contribution_id
    var path = "/Topic_" + req.body.topic_id + "/Faculty_" + req.session.user.faculty_id + "/Student_" + req.session.user.id
    path.replace(/\s/g, '-')
    var submitted_date = new Date().toISOString()
    db.file.select((result) => {
        
        for(var i in files){
            var have = false
            var file_name = files[i].filename
            for(var j in result.recordset) {
                
                
                if(result.recordset[j].file_name == file_name)
                {
                    
                    have = true;
                    break;
                } 
            }

            if(!have){
                db.file.insert("contribution_id, file_name, path, submitted_date", `${contribution_id}, '${file_name}', '${path}', '${submitted_date}'`)
            }
        }
        
    }, `contribution_id = ${contribution_id}`)
    // // ------- Store file location --------



    // ------- Send email ---------
    var send_mail = (email) => {
        var receiver_email = email
        var email_subject = 'Upload files'

        // Set sending email content
        var student_id = req.session.user.id
        var student_name = req.session.user.first_name +  " " + req.session.user.last_name
        var word_file = 'file'
        if(files.length > 1)
            word_file += 's'
        var email_content = `Student ${student_name} ID: ${student_id} has uploaded ${files.length} ${word_file} to Topic: ${req.body.topic}. Marketing Coordinate please comments within 14 days!\nUpload ${word_file}:\n`
        
        files.forEach(file => {
            email_content += file.filename + '\n'
        })
        try {
            f.send_mail(receiver_email, email_subject, email_content)
        } catch (error) {
            
        }
    }
    

    await db.user.select( 
            function(result){
                var coordinates = result.recordset
                coordinates.forEach(coordinate => {
                    send_mail(coordinate.email)
                })
            }, "-email", `-faculty_id = ${req.session.user.faculty_id} AND -user_type_id = 3`)
    
    
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