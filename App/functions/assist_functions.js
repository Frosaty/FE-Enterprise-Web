const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer')
const fs = require('fs')
const nodemailer = require("nodemailer")
const app = express()
const mkdirp = require('mkdirp')


app.use(bodyParser.urlencoded({extended: true}))


// -------------------------------------------------- FILE SYSTEM FUNCTIONS -----------------------------------------------
// -----------------------UPLOAD-------------------------

var upload = function(location){
    var set_storage = function(location) { 
        var storage = multer.diskStorage({
            destination: function (req, file, cb){ 
                var dir = location + "/Topic_" + req.body.topic_id + "/Faculty_" + req.session.user.faculty_id + "/Student_" + req.session.user.id
                
                mkdirp(dir, err => {
                    cb(err,  dir)
                })
                
            },
        
            filename: function (req, file, cb){cb(null, file.originalname )
        }
        })
        return storage
    };

    var result = multer({storage: set_storage(location)}) 
    return result
}

// -----------------------DOWNLOAD-------------------------
var download =  async function (req,res,path) {
    
    var file_name = req.query.name
    var download_name = file_name
    if(req.query.title != undefined && req.query.title != "" ){
        download_name = req.query.title
    } 

    await res.zip({
        files: [{
            path: path,
            name: file_name
        }],
        filename: `${download_name}.zip`
    });
  }

  // -----------------------DELETE-------------------------
var delete_file = async function (location){
    fs.unlink(location, function(err){
        console.error(err)
      })
}

// -----------------------SEND MAIL-------------------------
var service = 'gmail'
var sender_email = 'noreply8421@gmail.com'
var sender_email_pass = 'zgmfx19a'

var send_mail = async function(receiver_email, email_subject, email_content){
    var transporter = nodemailer.createTransport({
        service: service,
        auth: {
            user: sender_email,
            pass: sender_email_pass
        }
    });

    var mailOptions = {
        from: sender_email,
        to: receiver_email, // mail của các Coordinators
        subject: email_subject, // Subject của mail
        text: email_content // nội dung email
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


var on_error = function(err){ 
    console.log("Error")
}
// -------------------------------------------------- EXPORT FUNCTIONS -----------------------------------------------

var alert = function (message = null) {
    var visible = "none"
    if(message != undefined){
        visible = "block"
    }
    return {
        visible: visible,
        message: message
    }
}

module.exports = {
    upload: upload,
    download: download,
    delete_file: delete_file,
    send_mail: send_mail,
    on_error: on_error,
    alert: alert
}