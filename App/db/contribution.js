var conn = require("./db_config").conn

var modify_field = (fields) => {
    return  fields.replace(/-/g, 'contributions.');
}

var select = (callback, fields, conditions = "1 = 1") => {
    
    conn.connect().then(() => {
        fields = modify_field(fields)
        conditions = modify_field(conditions)
        var query = `SELECT ${fields}, contributions.user_id, contributions.topic_id, users.first_name, users.last_name, users.faculty_id, topics.name AS topic, topics.end_date, faculties.name AS faculty, contributions.id FROM contributions ` +
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

var insert = (fields, values, callback) => {
    conn.connect().then(() => {
        fields = modify_field(fields)
        var query = `INSERT INTO contributions (${fields}) VALUES (${values}); SELECT @@identity as id`
        conn.request().query( query, (err, result) => {
            callback(result.recordset[0].id)
        })
    })
}

var update = (sets, conditions) => {
    conn.connect().then(() => {
        
        var query = `UPDATE contributions SET ${sets} WHERE ${conditions}`
        
        conn.request().query( query, (err, result) => {
        })
    })
}
module.exports = {
    select: select,
    insert: insert,
    update: update
}