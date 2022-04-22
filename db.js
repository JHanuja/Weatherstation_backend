const Pool = require("pg").Pool;

const pool = new Pool(
    {user:"postgres",
     password: "test",
     database: "weather_data",
     host: "localhost",
     port: 5432
    }
);

module.exports = pool;