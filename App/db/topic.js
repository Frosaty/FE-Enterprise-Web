var conn = require("./db_config").conn



var select = (callback, conditions = "1 = 1") => {
    
    conn.connect().then(() => {
        var query = `SELECT  * FROM topics WHERE ${conditions}` 
        
        conn.request().query( query, (err, results) => {
            callback(results)
        })
    }).catch(function(err){
          console.log(err)
      });
      
}

var update = (sets, conditions) => {
    conn.connect().then(() => {
        
        var query = `UPDATE topics SET ${sets} WHERE ${conditions}`
        conn.request().query( query, (err, result) => {
        })
    })
}

module.exports = {
    select: select,
    update: update
}