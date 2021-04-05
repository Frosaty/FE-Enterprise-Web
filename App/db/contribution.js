var conn = require("./db_config").conn

var modify_field = (fields) => {
    return  fields.replace(/-/g, 'contributions.');
}

var select = (callback, fields, conditions = "1 = 1") => {
    
    conn.connect().then(() => {
        fields = modify_field(fields)
        conditions = modify_field(conditions)
        var query = `SELECT ${fields}, users.first_name, users.last_name, users.faculty_id, topics.name AS topic, faculties.name AS faculty, contributions.id FROM contributions ` +
        `LEFT JOIN users ON contributions.user_id = users.id ` + 
        `LEFT JOIN topics ON contributions.topic_id = topics.id ` + 
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