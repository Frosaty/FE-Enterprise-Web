const sql = require("mssql/msnodesqlv8");

const conn = new sql.ConnectionPool({
  database: "alo",
  server: "localhost",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
});



module.exports.conn = conn