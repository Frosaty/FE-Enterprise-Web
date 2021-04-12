

var conn = require("./db_config").conn

var modify_field = (fields) => {
    return  fields.replace(/-/g, 'users.');
}

var select = (callback, fields, conditions = "1 = 1") => {
    
    conn.connect().then(() => {
        fields = modify_field(fields)
        conditions = modify_field(conditions)
        
        fields += ", user_types.type, faculties.name as faculty, users.id"
        var query = `SELECT ${fields} FROM users ` +
        `LEFT JOIN user_types ON users.user_type_id = user_types.id ` + 
        `LEFT JOIN faculties ON users.faculty_id = faculties.id ` + 
        `WHERE ${conditions}`
        conn.request().query( query, (err, results) => {
            callback(results)
        })
    }).catch(function(err){
          console.log(err)
      });
      
}

var update = (sets, conditions) => {
    conn.connect().then(() => {
        
        var query = `UPDATE users SET ${sets} WHERE ${conditions}`
        conn.request().query( query, (err, result) => {
        })
    })
}
module.exports = {
    select: select,
    update: update
}