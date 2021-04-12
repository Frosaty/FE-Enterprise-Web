var conn = require("./db_config").conn

var modify_field = (fields) => {
    return  fields.replace(/-/g, 'files.');
}

var select = (callback, condition = "1 = 1") => {
    
    conn.connect().then(() => {
        
        var query = `SELECT * FROM files ` +
        `WHERE ${condition}`

        conn.request().query( query, (err, results) => {
            callback(results)
        })
    }).catch(function(err){
          console.log(err)
      });
      
}

var insert = (fields, values) => {
    conn.connect().then(() => {
        fields = modify_field(fields)
        var query = `INSERT INTO files (${fields}) VALUES (${values})`
        conn.request().query( query, (err, result) => {})
        
    })
}

var delete_file = (id) => {
    conn.connect().then(() => {
        var query = `DELETE files WHERE id = ${id}`
        conn.request().query( query, (err, result) => {})
    })
}

module.exports = {
    select: select,
    insert: insert,
    delete_file: delete_file
}