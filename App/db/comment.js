var conn = require("./db_config").conn

var modify_field = (fields) => {
    return  fields.replace(/-/g, 'users.');
}

var select = (fields, conditions = "1 = 1", callback) => {
    
    conn.connect().then(() => {
        fields = modify_field(fields)
        conditions = modify_field(conditions)
        var query = `SELECT ${fields}, user_types.type, faculties.name, users.id FROM users ` +
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

module.exports = {
    select: select
}