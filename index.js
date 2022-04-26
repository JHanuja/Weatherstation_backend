const express = require("express");
const app = express();

const pool = require("./db");

app.use(express.json());


//post request

app.listen(5000, () => console.log("Listening on port 5000"));


app.post("/wsdata",async(req,res) => {
    try {
        let tmp = req.body.temperature;
        let hum = req.body.humidity;

        console.log(req.body);
        
        console.log(`${tmp}`);
        const newWsData = await pool.query(`INSERT INTO dht (temperature,humidity) VALUES ('${tmp}','${hum}')`);
        res.send("OK");

        console.log("success");
    } catch (err) {
        console.error(err.message);
    }
});


app.get("/dht", async(req,res)=>{

    try{
        const record = await pool.query(`SELECT daytime, temperature, humidity
        FROM dht
        ORDER BY daytime DESC
        LIMIT 1`);

        res.json(record.rows[0]);

    }catch(err){
        console.err(err.message);
    }


});








