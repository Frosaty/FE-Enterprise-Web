var conn = require("./db_config").conn



var select = (callback, condition = "1 = 1") => {
    
    conn.connect().then(() => {
        var query = `SELECT  * FROM faculties WHERE ${condition}` 
        
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