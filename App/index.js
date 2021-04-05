const path = require('path');
const express = require('express');
const bodyParser= require('body-parser')
const multer = require('multer')
const zip = require('express-easy-zip');

const expressLayouts = require('..');

// const fs = require('fs');
    
// const { promisify } = require('bluebird');
// const libre = require('libreoffice-convert');
// const libreConvert = promisify(libre.convert);
// var toPdf = require("zapoj-office-to-pdf")

var mm = require("mammoth")
const app = express();

// ------------------ FUNCTIONS IMPORT -------------------

const functions = require('./functions/assist_functions')
const upload = functions.upload
const download = functions.download;
const delete_file = functions.delete_file;
const send_mail = functions.send_mail;

const student = require('./functions/student')
const staff = require('./functions/staff')

/// -------------------------------------------------- GENERAL SET UP -----------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', path.join(__dirname, 'layouts/layout'))
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

// -------------------------------------------------- USING STATIC FILE -----------------------------------------------
app.use(express.static('public'))
app.use('/.idea', express.static(path.join(__dirname, '.idea')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/fonts', express.static(path.join(__dirname, 'fonts')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/plugins', express.static(path.join(__dirname, 'plugins')))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/files', express.static(path.join(__dirname, 'files')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true}))
app.use(zip())


// -------------------------------------------------- ROUTING -----------------------------------------------

// ----------------------- VIEWS ROUTING -----------------------


app.get('/db', (req, res) => {
    staff.user.list(req, () => {})
})

app.post('/login', (req, res) => {
  console.log(req.body)
})



var content
app.get('/docfile', (req, res) => {
  
  // const document = fs.readFileSync('./vovinam1.docx')
  // // let pdf = libre.convert(document, '.pdf', undefined, (err, result) => {
  // //   console.log(err)
  // // })
  
  //     fs.writeFileSync("./test.pdf", pdfBuffer)
  mm.convertToHtml({path: "./files/Proposal_Template.docx"}).then(function(result){
    content = result.value
    
  })
  
    
  res.locals.content = content
  res.render('docfile');
  
  
});



// ------ VIEWS FOR GUEST ------

var guest_layout = {layout: "../layouts/guest_layout.ejs"}

// INDEX VIEW 
app.get('/', (req, res) => {
  res.locals.title = 'Home'
  res.render('index', guest_layout);
  
});


app.get('/guest/login_decision', (req, res) => {
  res.locals.title = 'Decision'
  res.render('guest/login_decision');
  
});

// LOGIN PAGE FOR GUEST LOGIN AS STUDENT
app.get('/guest/login', (req, res) => {
  res.locals.title = "Login"
  res.render('guest/login', guest_layout);
});

// LOGIN PAGE FOR GUEST LOGIN AS STAFF
app.get('/staff/login', (req, res) => {
  res.render('staff/login');
});

// GUEST VIEW LIST OF TOPICS
app.get('/guest/topic_manage', (req, res) => {
    staff.topic.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic'
    res.render('guest/topic_manage', guest_layout);
  });
})
  

// GUEST VIEW LIST OF FACULTIES
app.get('/guest/faculty_manage', (req, res) => {
  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.render('guest/faculty_manage', guest_layout);
  })
  
});

// GUEST VIEW LIST OF CONTRIBUTIONS
app.get('/guest/contribution_manage', (req, res) => {
  staff.contribution.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Contribution'
    res.render('guest/contribution_manage', guest_layout);
  });
});

// GUEST VIEW LIST OF FILES
app.get('/guest/file_manage', (req, res) => {
  res.locals.title = 'File'
  res.render('guest/file_manage', guest_layout);
});






// ------ VIEWS FOR STUDENT ------

var student_layout = {layout: "../layouts/student_layout.ejs"}

// INDEX VIEW 
app.get('/student', (req, res) => {
  res.locals.title = "Home"
  res.render('index', student_layout);
});

// STUDENT VIEW ALL CONTRIUBTIONS
app.get('/student/contribution_manage', (req, res) => {
  staff.contribution.list(req, (content) => {
    res.locals = content
    res.locals.title = 'All Contributions'
    res.render('student/contribution_manage', student_layout);
  });
});

// STUDENT VIEW SELF CONTRIUBTIONS
app.get('/student/self_contribution_manage', (req, res) => {
  staff.contribution.list(req, (content) => {
    res.locals = content
    res.locals.title = 'My Contributions'
    res.render('student/self_contribution_manage', student_layout);
  });
  
});

// STUDENT VIEW OTHER FILES
app.get('/student/file_manage', (req, res) => {
  res.locals.title = 'File'
  res.render('student/file_manage', student_layout);
});



// STUDENT VIEW SELF FILES
app.get('/student/self_file_manage', (req, res) => {
  staff.contribution.list(req, (content) => {
    res.locals = content
    res.locals.title = 'My File'
    res.render('student/self_file_manage', student_layout);
  });
  
});

// STUDENT VIEW LIST OF TOPICS
app.get('/student/topic_manage', (req, res) => {
  staff.topic.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic'
    res.render('student/topic_manage', student_layout);
  });
  
});

// STUDENT VIEW LIST OF FACULTIES
app.get('/student/faculty_manage', (req, res) => {
  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.render('student/faculty_manage', student_layout);
  })
  
});




// ------ VIEWS FOR STAFF (FOR MULTIPLE ROLES: (ADMIN, MANAGER, COORDINATE)) ------

// ------ VIEWS FOR ADMIN ------

var admin_layout = {layout: "../layouts/admin_layout.ejs"}

app.get('/admin/comment_manage', (req, res) => {
  res.locals.title = 'Comment'
  res.render('admin/comment_manage', admin_layout);
});

app.get('/admin/profile_manage', (req, res) => {
  staff.profile.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Profile'
    res.render('admin/profile_manage', admin_layout);
  })
  
});

app.get('/staff/change_password', (req, res) => {
  res.locals.title = 'Change password'
  res.render('staff/change_password');
});

app.get('/admin/contribution_manage', (req, res) => {
  staff.contribution.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Contribution'
    res.render('admin/contribution_manage', admin_layout);
  })
  
});

app.get('/admin/user_manage', (req, res) => {
    staff.user.list(req, (content) => {
    res.locals = content
    res.locals.title = 'User'
    res.render('admin/user_manage', admin_layout);
  })
  
});

app.get('/admin/user_detail', (req, res) => {
    staff.user.show(req, (content) => {
    res.locals = content
    res.locals.title = 'User'
    res.render('admin/user_detail', admin_layout);
  })
    
});



app.get('/admin/faculty_manage', (req, res) => {
  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.render('admin/faculty_manage', admin_layout);
  })
});

app.get('/admin/faculty_detail', (req, res) => {
    staff.faculty.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty Detail'
    res.render('admin/faculty_detail', admin_layout);
  })
  
});


app.get('/admin/file_manage', (req, res) => {
  res.locals.title = 'File'
  res.render('admin/file_manage', admin_layout);
});

app.get('/admin', (req, res) => {
  res.locals.title = 'Home'
  res.render('admin', admin_layout);
});

app.get('/admin/topic_manage', (req, res) => {
  staff.topic.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic'
   res.render('admin/topic_manage', admin_layout);
  })
});

app.get('/admin/topic_detail', (req, res) => {
    staff.topic.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic Detail'
    res.render('admin/topic_detail', admin_layout);
  })
  
});

// app.get('/view_faculty', (req, res) => {
//   staff.faculty.list(req, res)
//   res.render('index')
// });

// ------ VIEWS FOR MANAGER ------

var manager_layout = {layout: "../layouts/manager_layout.ejs"}

app.get('/manager/contribution_faculty_manage', (req, res) => {
  res.locals.title = 'Contribution Faculty'
  res.render('manager/contribution_faculty_manage', admin_layout);
});

app.get('/manager/contribution_topic_manage', (req, res) => {
  res.locals.title = 'Contribution Topic'
  res.render('manager/contribution_topic_manage', admin_layout);
});


app.get('/manager/faculty_manage', (req, res) => {
  res.locals.title = 'Faculty'
  res.render('manager/faculty_manage', manager_layout);
});


app.get('/manager/file_manage', (req, res) => {
  res.locals.title = 'File'
  res.render('manager/file_manage', manager_layout);
});

app.get('/manager', (req, res) => {
  res.locals.title = 'Home'
  res.render('manager', manager_layout);
});

app.get('/manager/topic_manage', (req, res) => {
  res.locals.title = 'Topic'
  res.render('manager/topic_manage', manager_layout);
});




// ------ VIEWS FOR COORDINATE ------

var coordinate_layout = {layout: "../layouts/coordinate_layout.ejs"}

app.get('/coordinate/contribution_manage', (req, res) => {
  res.locals.title = 'Contribution'
  res.render('coordinate/contribution_manage', coordinate_layout);
});

app.get('/coordinate/file_manage', (req, res) => {
  res.locals.title = 'File'
  res.render('coordinate/file_manage', coordinate_layout);
});

app.get('/coordinate', (req, res) => {
  res.locals.title = 'Home'
  res.render('coordinate', coordinate_layout);
});

app.get('/coordinate/topic_manage', (req, res) => {
  res.locals.title = 'Topic'
  res.render('coordinate/topic_manage', coordinate_layout);
});

// ------ VIEW 404 -------
app.get('*', (req, res) => {
  res.render('404')
});


// ----------------------- FUNCTIONS ROUTING -----------------------

// ----- DOWNLOAD FILE -----
app.get('/download_file', async function(req, res) {
    await download(req, res, __dirname + "/files/1644_GCS18026_HuynhCamHung_Assignment2.pdf")
});

// ----- DELETE FILE -----
app.get('/delete_file', async function(req, res) {
    var location =  __dirname + "/files/1644_GCS18026_HuynhCamHung_Assignment1.docx"
    await delete_file(location)
    res.redirect('back')
})

// ----- UPLOAD FILE -----
app.post('/upload_file', (upload('./files')).array('files', 12), function(req, res, next) {
  student.file.add(req, res)
  res.redirect('back')
})


// --------- DELETE DATA -----------
app.post('/delete_user', async function (req, res) {
  staff.user.remove(req)
})

app.post('/delete_topic', async function (req, res) {
  staff.topic.remove(req)
})

app.post('/delete_faculty', async function (req, res) {
  staff.faculty.remove(req)
})
// -------------------------------------------------- SET UP SERVER -----------------------------------------------

var server = app.listen(80, '127.0.0.1', function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Listening on http://%s:%s/', host, port);
});
