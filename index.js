const express = require("express");
const app = express();

const pool = require("./db");

app.use(express.json());


//post request

app.listen(5000, () => console.log("Listening on port 5000"));


app.post("/wsdata",async(req,res) => {
    try {
        let tmp = req.query.temperature;
        let hum = req.query.humidity;
        
        console.log(`${tmp}`);
        const newWsData = await pool.query(`INSERT INTO dht (temperature,humidity) VALUES ('${tmp}','${hum}')`);
        res.statusCode(200);
        res.send("OK");

        console.log("success");
    } catch (err) {
        console.error(err.message);
    }
})








