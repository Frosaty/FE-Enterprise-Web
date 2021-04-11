var conn = require("./db_config").conn

var modify_field = (fields) => {
    return  fields.replace(/-/g, 'users.');
}

var select = (req, callback) => {
    
    conn.connect().then(() => {
        var query = `SELECT comments.id, comments.contribution_id, comments.user_id, comments.content, comments.comment_date, user_types.type,  users.first_name, users.last_name, contributions.title FROM comments ` +
        `LEFT JOIN users ON comments.user_id = users.id ` + 
        `LEFT JOIN contributions ON comments.contribution_id = contributions.id ` +
        `LEFT JOIN user_types ON users.user_type_id = user_types.id ` + 
        `WHERE comments.contribution_id = ${req.query.id}`
    
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