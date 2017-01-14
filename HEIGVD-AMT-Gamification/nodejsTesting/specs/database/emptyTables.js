var env = require('../../env.json');
const DATABASE_URL = process.env.DATABASE_URL || env.default.DATABASE_URL;
const DATABASE_USER = process.env.DATABASE_USER || env.default.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || env.default.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME || env.default.DATABASE_NAME;

// Get the client
var mysql = require('mysql2');

// Empty the MySQL database tables
function emptyTables() {

    // create the connection to database
    var connection = mysql.createConnection(
        {
            host: DATABASE_URL,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME
        }
    );

    // Tables to Empty
    var tablesToEmpty = [
        "application",
        "award",
        "badge",
        "event",
        "point_scale",
        "rule",
        "user"
    ]

    // Info
    console.log("Database cleaning...");

    // Empty tables
    for (var i = 0; i < tablesToEmpty.length; ++i) {
        connection.query("DELETE FROM " + tablesToEmpty[i], function (err, results, fields) { });
    }

    console.log("done");
}

module.exports = {
    emptyTables: emptyTables
};