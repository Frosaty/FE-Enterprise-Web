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

module.exports = {
    select: select
}