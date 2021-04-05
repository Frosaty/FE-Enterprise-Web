var conn = require("./db_config").conn



var select = (callback) => {
    
    conn.connect().then(() => {
        var query = `SELECT  * FROM users_type ` 
        
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