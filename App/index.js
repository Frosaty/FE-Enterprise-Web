const path = require('path');
const express = require('express');
const bodyParser= require('body-parser')
const multer = require('multer')
const zip = require('express-easy-zip');
const api = require('./api')
const expressLayouts = require('..');
const alert = require('alert');
const session = require('express-session');
const db = require('./db')
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

app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: null }}));

// localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
// -------------------------------------------------- ROUTING -----------------------------------------------

// ----------------------- VIEWS ROUTING -----------------------


var get_role = (req) => {
  var role = "guest"
  if(!req.session.user)
      return role
  
  switch(req.session.user.type){
    case "Admin":
      role = "admin"
      break;
    case "Student":
      role = "student"
      break;
    case "Marketing Coordinator":
      role = "coordinate"
      break;
    case "Marketing Manager":
      role = "manager"
      break;
    default:
      break;
  }
  return role
}



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
app.get('/', (req, res, next) => {
    var role = get_role(req)
    if(role != "guest")
      res.redirect(`/${role}`)
    else{
      res.locals.title = 'Home'
        res.render('index', guest_layout);
    } 
});




// LOGIN PAGE FOR GUEST LOGIN AS STUDENT
app.get('/guest/login', (req, res, next) => {
  if(get_role(req) != "guest")
    next()
  res.locals.title = "Login"
  res.locals.alert = functions.alert()
  res.render('guest/login', guest_layout);
});

app.post('/guest/login', (req, res) => {
  
  staff.session.login(req, (result) => {
    if(result.length != 0 && result[0].user_type_id == 2){
          req.session.user = result[0]
          res.redirect('/student')
    }
    else{
        res.locals.title = "Login"
        res.locals.alert = functions.alert("Invalid email or password!")
        res.render('guest/login', guest_layout);
    }
  })
})

// LOGIN PAGE FOR GUEST LOGIN AS STAFF
app.get('/staff/login', (req, res, next) => {
  if(get_role(req) != "guest")
    next()
  
  res.locals.alert = functions.alert()
  res.render('staff/login');
});

// LOGIN/LOG OUT FUNCTIONS
app.post('/staff/login', (req, res) => {
  
  staff.session.login(req, (result) => {
    
      var link = ""
        if(result.length != 0 && result[0].user_type_id != 2){
              req.session.user = result[0]
              switch(result[0].user_type_id){
                case 1:
                  link = "/admin"
                  break;
                case 3:
                  link = "/coordinate"
                  break;
                case 4:
                  link = "/manager"
                  break;
                default:
                  break;
              }
              res.redirect(link)
        }
        else{
          res.locals.alert = functions.alert("Invalid email or password!")
          res.render('staff/login');
        }
  })
})



// GUEST VIEW LIST OF TOPICS

app.get('/guest/topic_manage', (req, res, next) => {
  if(get_role(req) != "guest")
    next()
    staff.topic.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic'
    res.render('guest/topic_manage', guest_layout);
  });
})


// GUEST VIEW LIST OF FACULTIES
app.get('/guest/faculty_manage', (req, res, next) => {
  if(get_role(req) != "guest")
      next()
  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.render('guest/faculty_manage', guest_layout);
  })
  
});

// GUEST VIEW LIST OF CONTRIBUTIONS
app.get('/guest/contribution_manage', (req, res, next) => {
  if(get_role(req) != "guest")
    next()
  student.contribution.list_select(req, (content1) => {
    staff.faculty.list(req, (content2) => {
        staff.topic.list(req, (content3) => {
            content = Object.assign({}, content1, content2, content3)
            res.locals = content
            res.locals.title = 'Contribution'
            res.locals.search = req.query
            res.render('guest/contribution_manage', guest_layout);
        })
    })
})

});

// GUEST VIEW LIST OF FILES
app.get('/guest/file_manage', (req, res, next) => {
  if(get_role(req) != "guest")
    next()
    staff.contribution.show(req, (content1) => {
        staff.file.list(req, (content2) => {
            content = Object.assign({}, content1, content2)
            res.locals = content
            res.locals.title = 'File'
            res.render('guest/file_manage', guest_layout);
        })
    })
});





var get_name = (req) => {
  return req.session.user.first_name + " " +  req.session.user.last_name
}
// ------ VIEWS FOR STUDENT ------

var student_layout = {layout: "../layouts/student_layout.ejs"}

// INDEX VIEW 
app.get('/student', (req, res, next) => {
  if(get_role(req) != "student")
    next()

  res.locals.title = "Home"
  res.locals.username = get_name(req)
  res.render('index', student_layout);
});

app.get('/student/change_password', (req, res, next) => {
  if(get_role(req) != "student")
    next()

  res.locals.title = "Change Password"
  res.locals.username = get_name(req)
  res.locals.alert = functions.alert(req.query.message)
  res.render('student/change_password', student_layout);
});
// STUDENT VIEW ALL CONTRIUBTIONS
app.get('/student/contribution_manage', (req, res, next) => {
  if(get_role(req) != "student")
    next()

  student.contribution.list_select(req, (content1) => {
    staff.faculty.list(req, (content2) => {
        staff.topic.list(req, (content3) => {
            var content = Object.assign({}, content1, content2, content3)
            res.locals = content
            res.locals.search = req.query
            res.locals.title = 'All Contributions'
            res.locals.username = get_name(req)
            res.render('student/contribution_manage', student_layout);
        })
    })
})
  
});

// STUDENT VIEW SELF CONTRIUBTIONS
app.get('/student/self_contribution_manage', (req, res, next) => {
    if(get_role(req) != "student")
      next()

    student.contribution.list(req, (content) => {
    res.locals = content
    res.locals.title = 'My Contributions'
    res.locals.username = get_name(req)
    res.render('student/self_contribution_manage', student_layout);
  });
  
});

// STUDENT VIEW OTHER FILES
app.get('/student/file_manage', (req, res, next) => {
  if(get_role(req) != "student")
    next()
  staff.contribution.show(req, (content1) => {
    staff.file.list(req, (content2) => {
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'File'
        res.locals.username = get_name(req)
        res.render('student/file_manage', student_layout);
    })
  })

});

// STUDENT CREATE NEW CONTRIBUTION
app.get('/add_contribution', (req, res, next) => {
  if(get_role(req) != "student")
    next()
  student.contribution.add(req, __dirname + "/files" ,(result) => {

      res.locals.title = 'My File'
      res.locals.username = get_name(req)
      res.redirect('student/self_file_manage?id=' + result);
   
  });
  
});

// STUDENT VIEW SELF FILES
app.get('/student/self_file_manage', (req, res, next) => {
  
  if(get_role(req) != "student")
    next()

  staff.contribution.show(req, (content1) => {
    staff.file.list(req, (content2) => {
      staff.comment.list(req, (content3) => {
        content = Object.assign({}, content1, content2, content3)
        res.locals = content
        res.locals.title = 'My File'
        res.locals.username = get_name(req)
        res.render('student/self_file_manage', student_layout);
      })
     
    })
    
  });
  
});

// STUDENT VIEW LIST OF TOPICS
app.get('/student/topic_manage', (req, res, next) => {

  if(get_role(req) != "student")
    next()

    staff.topic.list(req, (content1) => {
       student.contribution.list(req, (content2) => {
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'Topic'
        res.locals.username = get_name(req)
        res.render('student/topic_manage', student_layout);
      })
    
  });
  
});

// STUDENT VIEW LIST OF FACULTIES
app.get('/student/faculty_manage', (req, res, next) => {
  if(get_role(req) != "student")
    next()

  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.locals.username = get_name(req)
    res.render('student/faculty_manage', student_layout);
  })
  
});




// ------ VIEWS FOR STAFF (FOR MULTIPLE ROLES: (ADMIN, MANAGER, COORDINATE)) ------

// ------ VIEWS FOR ADMIN ------

var admin_layout = {layout: "../layouts/admin_layout.ejs"}

app.get('/admin/comment_manage', (req, res, next) => {
  if(get_role(req) != "admin")
    next()

    staff.contribution.show(req, (content1) => {
      staff.comment.list(req, (content2) => {
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'Comment'
        res.locals.username = get_name(req)
        res.render('admin/comment_manage', admin_layout);
    })
  })
});

app.get('/admin/profile_manage', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
  staff.profile.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Profile'
    res.locals.username = get_name(req)
    res.render('admin/profile_manage', admin_layout);
  })
  
});

app.get('/staff/change_password', (req, res, next) => {
  var role = get_role(req)
  if( role != "admin" && role != "manager" && role != "coordinate")
    next()
  res.locals.title = 'Change password'
  res.locals.alert = functions.alert(req.query.message)
  res.render('staff/change_password');
});

app.get('/admin/contribution_manage', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
  staff.contribution.list(req, (content1) => {
      staff.faculty.list(req, (content2) => {
          staff.topic.list(req, (content3) => {
              content = Object.assign({}, content1, content2, content3)
              res.locals = content
              res.locals.title = 'Contribution'
              res.locals.search = req.query
              res.locals.username = get_name(req)
              res.render('admin/contribution_manage', admin_layout);
          })
      })
  })
});

app.get('/admin/user_manage', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
    staff.user.list(req, (content1) => {
      staff.faculty.list(req, (content2) => {
        content = Object.assign({}, content1, content2)
        
        res.locals = content
        res.locals.title = 'User'
       
        res.locals.search = req.query
        res.locals.username = get_name(req)
        res.render('admin/user_manage', admin_layout);
        
      })
    
    })
  
});

app.get('/admin/user_detail', (req, res, next) => {
  if(get_role(req) != "admin")
      next()
    staff.user.show(req, (content) => {
    res.locals = content
    res.locals.title = 'User'
    res.locals.username = get_name(req)
    res.render('admin/user_detail', admin_layout);
  })
    
});



app.get('/admin/faculty_manage', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.locals.username = get_name(req)
    res.render('admin/faculty_manage', admin_layout);
  })
});

app.get('/admin/faculty_detail', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
    staff.faculty.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty Detail'
    res.locals.username = get_name(req)
    res.render('admin/faculty_detail', admin_layout);
  })
  
});


app.get('/admin/file_manage', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
  staff.contribution.show(req, (content1) => {
    staff.file.list(req, (content2) => {
        
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'File'
        res.locals.username = get_name(req)
        res.render('admin/file_manage', admin_layout);
        
    })
})
  
});

app.get('/admin', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
  res.locals.title = 'Home'
  res.locals.username = get_name(req)
  res.render('admin', admin_layout);
});

app.get('/admin/topic_manage', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
  staff.topic.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic'
    res.locals.username = get_name(req)
   res.render('admin/topic_manage', admin_layout);
  })
});

app.get('/admin/topic_detail', (req, res, next) => {
  if(get_role(req) != "admin")
    next()
    staff.topic.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic Detail'
    res.locals.username = get_name(req)
    res.render('admin/topic_detail', admin_layout);
  })
  
});



// ------ VIEWS FOR MANAGER ------

var manager_layout = {layout: "../layouts/manager_layout.ejs"}

app.get('/manager/comment_manage', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
    staff.contribution.show(req, (content1) => {
        staff.comment.list(req, (content2) => {
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'Comment'
        res.locals.username = get_name(req)
        
        res.render('manager/comment_manage', manager_layout);
      })
    })
    
  
});

app.get('/manager/profile_manage', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
  staff.profile.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Profile'
    res.locals.username = get_name(req)
    res.render('manager/profile_manage', manager_layout);
  })
  
});



app.get('/manager/contribution_manage', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
  staff.contribution.list(req, (content1) => {
      staff.faculty.list(req, (content2) => {
          staff.topic.list(req, (content3) => {
              content = Object.assign({}, content1, content2, content3)
              res.locals = content
              res.locals.title = 'Contribution'
              res.locals.search = req.query
              res.locals.username = get_name(req)
              res.render('manager/contribution_manage', manager_layout);
          })
      })
  })
});

app.get('/manager/student_manage', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
    staff.student.list(req, (content1) => {
      staff.faculty.list(req, (content2) => {
        content = Object.assign({}, content1, content2)
        
        res.locals = content
        res.locals.title = 'Student'
       
        res.locals.search = req.query
        res.locals.username = get_name(req)
        res.render('manager/student_manage', manager_layout);
        
      })
    
    })
  
});

app.get('/manager/student_detail', (req, res, next) => {
  if(get_role(req) != "manager")
      next()
    staff.user.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Student'
    res.locals.username = get_name(req)
    res.render('manager/student_detail', manager_layout);
  })
    
});



app.get('/manager/faculty_manage', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.locals.username = get_name(req)
    res.render('manager/faculty_manage', manager_layout);
  })
});

app.get('/manager/faculty_detail', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
    staff.faculty.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty Detail'
    res.locals.username = get_name(req)
    res.render('manager/faculty_detail', manager_layout);
  })
  
});


app.get('/manager/file_manage', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
  staff.contribution.show(req, (content1) => {
    staff.file.list(req, (content2) => {
        
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'File'
        res.locals.username = get_name(req)
        res.render('manager/file_manage', manager_layout);
        
    })
})
  
});

app.get('/manager', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
  res.locals.title = 'Home'
  res.locals.username = get_name(req)
  res.render('manager', manager_layout);
});

app.get('/manager/topic_manage', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
  staff.topic.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic'
    res.locals.username = get_name(req)
   res.render('manager/topic_manage', manager_layout);
  })
});

app.get('/manager/topic_detail', (req, res, next) => {
  if(get_role(req) != "manager")
    next()
    staff.topic.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic Detail'
    res.locals.username = get_name(req)
    res.render('manager/topic_detail', manager_layout);
  })
  
});

// ------ VIEWS FOR COORDINATE ------

var coordinate_layout = {layout: "../layouts/coordinate_layout.ejs"}

app.get('/coordinate/comment_manage', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
    staff.contribution.show(req, (content1) => {
      staff.comment.list(req, (content2) => {
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'Comment'
        res.locals.username = get_name(req)
        res.locals.contribution_id = req.query.id
        res.render('coordinate/comment_manage', coordinate_layout);
      })
    })
    
  
});

app.get('/coordinate/profile_manage', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
  staff.profile.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Profile'
    res.locals.username = get_name(req)
    res.render('coordinate/profile_manage', coordinate_layout);
  })
  
});



app.get('/coordinate/contribution_manage', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
  staff.contribution.list(req, (content1) => {
      staff.faculty.list(req, (content2) => {
          staff.topic.list(req, (content3) => {
              content = Object.assign({}, content1, content2, content3)
              res.locals = content
              res.locals.title = 'Contribution'
              res.locals.search = req.query
              res.locals.username = get_name(req)
              res.render('coordinate/contribution_manage', coordinate_layout);
          })
      })
  })
});

app.get('/coordinate/student_manage', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
    staff.student.list(req, (content1) => {
      
        res.locals = content
        res.locals.title = 'Student'
        res.locals.faculty = req.session.user.faculty_id
        res.locals.search = req.query
        res.locals.username = get_name(req)
        res.render('coordinate/student_manage', coordinate_layout);  
    
    })
  
});

app.get('/coordinate/student_detail', (req, res, next) => {
  if(get_role(req) != "coordinate")
      next()
    staff.user.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Student'
    res.locals.username = get_name(req)
    res.render('coordinate/student_detail', coordinate_layout);
  })
    
});



app.get('/coordinate/faculty_manage', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
  staff.faculty.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty'
    res.locals.username = get_name(req)
    res.render('coordinate/faculty_manage', coordinate_layout);
  })
});

app.get('/coordinate/faculty_detail', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
    staff.faculty.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Faculty Detail'
    res.locals.username = get_name(req)
    res.render('coordinate/faculty_detail', coordinate_layout);
  })
  
});


app.get('/coordinate/file_manage', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
  staff.contribution.show(req, (content1) => {
    staff.file.list(req, (content2) => {
        
        content = Object.assign({}, content1, content2)
        res.locals = content
        res.locals.title = 'File'
        res.locals.username = get_name(req)
        res.render('coordinate/file_manage', coordinate_layout);
        
    })
})
  
});

app.get('/coordinate', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
  res.locals.title = 'Home'
  res.locals.username = get_name(req)
  res.render('coordinate', coordinate_layout);
});

app.get('/coordinate/topic_manage', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
  staff.topic.list(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic'
    res.locals.username = get_name(req)
   res.render('coordinate/topic_manage', coordinate_layout);
  })
});

app.get('/coordinate/topic_detail', (req, res, next) => {
  if(get_role(req) != "coordinate")
    next()
    staff.topic.show(req, (content) => {
    res.locals = content
    res.locals.title = 'Topic Detail'
    res.locals.username = get_name(req)
    res.render('coordinate/topic_detail', coordinate_layout);
  })
  
});




// ----------------------- FUNCTIONS ROUTING -----------------------

// ----- DOWNLOAD FILE -----
app.get('/download_file', async function(req, res, next) {
  if(get_role(req) == "guest" || get_role(req) == "student")
    next()
    var path = __dirname + `/files/${req.query.path}/${req.query.name}` 
    await download(req, res, path)
});



// ----- DELETE FILE -----
app.get('/delete_file', async function(req, res, next) {
  if(get_role(req) == "guest")
    next()
    var path =  __dirname + "/files" + req.query.path 
    var id = req.query.id
    staff.file.remove(id, path)
    res.redirect('back')
})

app.post('/delete_file', async function(req, res) {
  
  var path =  __dirname + "/files" + req.body.path 
  var id = req.body.id
  staff.file.remove(id, path)
  res.redirect('back')
})

// ----- UPLOAD FILE -----
app.post('/upload_file', (upload('./files')).array('files', 12), function(req, res) {
  
  student.file.add(req)
  res.redirect('back')
})

// ------ UPDATE CONTRIBUTION TITLE
app.post('/update_title', (req, res) => {
  
  
  staff.contribution.edit_title(req)
  res.redirect('back')
  
})

app.post('/update_mark', (req, res) => {
  
  
  staff.contribution.edit_mark(req)
  res.redirect('back')
  
})

app.get('/update_active', (req, res, next) => {
  var role = get_role(req) 
  if(role != 'admin' && role != 'manager' && role != 'coordinate')
    next()
  var role = get_role(req) 
  
  staff.contribution.edit_active(req)
  res.redirect('back')
  
})
// --------- DELETE DATA -----------
app.get('/delete_user', async function (req, res, next) {
  if(get_role(req) == 'guest' || get_role(req) == 'student')
    next()
  staff.user.remove(req)
})

app.get('/delete_topic', async function (req, res, next) {
  if(get_role(req) != 'admin' || get_role(req) != 'manager')
    next()
  staff.topic.remove(req)
})

app.get('/delete_faculty', async function (req, res, next) {
  if(get_role(req) != 'admin' || get_role(req) != 'manager')
    next()
  staff.faculty.remove(req)
})




// ----- LOGOUT -----
app.get('/logout', function(req, res, next) {
  if(get_role(req) == 'guest')
    next()
  req.session.destroy((error) => {
     console.log(error)
  })
  res.redirect('/')
});
// ----- UPLOAD TOPICS -----
app.post('/add_topics', (req, res) => {
  
  var title = req.body.title;
  var start_date = req.body.start_date;
  var end_date = req.body.end_date;
  
  const response = api.topic.create(title, start_date, end_date)
  response.then(function(result) {
      
  })
  res.redirect('back')
});
// ----- UPLOAD Faculty -----
app.post('/add_faculty', (req, res) => {
  
  var faculty_name = req.body.faculty_name;
  var description = req.body.description;
  
  const response = api.faculty.create(faculty_name, description)
  response.then(function(result) {
  })
  res.redirect('back')
});

app.post('/add_comment', (req, res) => {
  
  var contribution_id = req.body.contribution_id;
  var content = req.body.content;
  var user_id = req.session.user.id
  const response = api.comment.create(contribution_id, user_id ,content)
  response.then(function(result) {
      
  }).catch((error) => {
    console.log(error)
  })

  
  res.redirect('back')
});
// ----- UPLOAD user -----
app.post('/add_user', (req, res) => {
  
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var role = req.body.role;
  var faculty = req.body.faculty;
  var email = req.body.email;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var address = req.body.address;
  var password = req.body.password;
  var phone = req.body.phone;
  
  const response = api.user.create(first_name, last_name, role, dob, gender, email, password, phone, address, faculty)
  response.then(function(result) {
      
  })
  res.redirect('back')
});
// ----- UPDATE Topic -----
app.post('/update_topic', function(req, res) {
  
  var topic_id = req.body.topic_id //id truyền từ cái input hidden qua
  var title = req.body.title;
  var start_date = req.body.start_date//new Date(req.body.start_date).toISOString();
  var end_date = req.body.end_date//new Date(req.body.end_date).toISOString();
  
  db.topic.update(`name = '${title}', start_date = '${start_date}', end_date = '${end_date}'`,`id = ${topic_id}`)
  
  res.redirect('back')
});

// ----- UPDATE Topic -----
app.post('/update_faculty', function(req, res) {
  
  var faculty_id = req.body.faculty_id
  var name = req.body.name;
  var description = req.body.description
  
  
  db.faculty.update(`name = '${name}', description = '${description}'`,`id = ${faculty_id}`)
  
  res.redirect('back')
});

// ----- UPDATE user -----
app.post('/update_user', (req, res) => {
  
  var user_id = req.body.user_id; //id truyền từ cái input hidden qua
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var dob = req.body.dob;
  var phone = req.body.phone;
  var gender = req.body.gender;
  var address = req.body.address;
  
  db.user.update(`first_name = '${first_name}', last_name = '${last_name}', dob = '${dob}', gender = ${gender}, email= '${email}', phone= '${phone}', address= '${address}'`, `id= ${user_id}`)
  res.redirect('back')
});

// ----- CHANGE PASS -----
app.post('/update_pass', (req, res) => {

  var user_id = req.body.user_id
  var password = req.body.password
  db.user.update(`password= '${password}'`, `id= ${user_id}`)
  res.redirect('back')
})

app.post('/update_self_pass', (req, res) => {
  
  var role = get_role(req)
  if(role == "admin" || role == "manager" || role == "coordinate")
    role="staff"
    
  var url= `/${role}/change_password`;

  var old_password = req.body.old_password
  var new_password = req.body.new_password
  var re_password = req.body.re_password

  var message = undefined
  if(new_password != re_password){
    message = "New password and re-password does not match!"
    res.redirect(`${url}?message=${message}`)
  }
     
  else{
    db.user.select((result) => {
      if(result.recordset[0].password != old_password){
        message = "Invalid old password!"
        res.redirect(`${url}?message=${message}`)
      }
      else{
        
        db.user.update(`password= '${new_password}'`, `id= ${req.session.user.id}`)
        message = "Your password has been changed"
        res.redirect(`${url}?message=${message}`)
      }
    }
      ,'-password', `-id = ${req.session.user.id}`)
  }
})
// -------------------------------------------------- SET UP SERVER -----------------------------------------------

// ------ VIEW 404 -------
app.get('*', (req, res) => {
  res.render('404')
});

var server = app.listen(80, '127.0.0.1', function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Listening on http://%s:%s/', host, port);
});
