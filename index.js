const express = require("express");
const app = express();

const pool = require("./db");

app.use(express.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);




//post request

app.listen(5000, () => console.log("Listening on port 5000"));


app.post("/wsdata",async(req,res) => {
    try {
        let tmp = req.body.temperature;
        let hum = req.body.humidity;
        let airp = req.body.airPressure;
        let soilh = req.body.soilHumidity;
        let gasv = req.body.gasValue;
        let lightv = req.body.lightValue;

        console.log(req.body);
        
        console.log(`${tmp}`);
        const newWsData = await pool.query(`INSERT INTO dht (temperature,humidity,soilhumidity,airpressure,airquality,brightness) VALUES ('${tmp}','${hum}','${soilh}','${airp}','${gasv}','${lightv}')`);
        res.send("OK");

        console.log("success");
    } catch (err) {
        console.error(err.message);
    }
});


/*
<=now zu < now
sunrise -1 weg

*/

app.get("/dht", async(req,res)=>{

    try{
        const singleValues = await pool.query(`SELECT daytime, temperature, humidity,airquality,airpressure, soilhumidity
        FROM dht
        ORDER BY daytime DESC
        LIMIT 1`);

        let temperature = singleValues.rows.length > 0 ? singleValues.rows[0].temperature : 'undefined'; 
        let daytime = singleValues.rows.length > 0 ? singleValues.rows[0].daytime : 'undefined';
        let humidity = singleValues.rows.length > 0 ? singleValues.rows[0].humidity : 'undefined';
        let airquality = singleValues.rows.length > 0 ? singleValues.rows[0].airquality : 'undefined';
        let airpressure = singleValues.rows.length > 0 ? singleValues.rows[0].airpressure : 'undefined';
        let soilhumidity = singleValues.rows.length > 0 ? singleValues.rows[0].soilhumidity : 'undefined';

        const temperatureValues = await pool.query(`Select Date(daytime) As date, Max(temperature) As maxtemp ,Avg(temperature) As avgtemp, Min(temperature) as mintemp,  Avg(humidity) As avghum, Avg(soilhumidity) As avgsoilhum 
                                                    From (Select * From dht Where Date(daytime) > ((Select daytime From dht Order By daytime DESC Limit 1) ::DATE - 8)) As Week Group By Date(daytime);

        `);

        let mintemp = [];
        let maxtemp = [];
        let avgtemp = [];
        let avghum = [];
        let avgsoilhum = [];

        for (i= 0; i < temperatureValues.rowCount; i ++){
            mintemp[i] = {
                date : temperatureValues.rows[i].date,
                value : temperatureValues.rows[i].mintemp   
            };
            maxtemp[i] = {
                date : temperatureValues.rows[i].date,
                value : temperatureValues.rows[i].maxtemp   
            };
            avgtemp[i] = {
                date : temperatureValues.rows[i].date,
                value : temperatureValues.rows[i].avgtemp   
            }
            avghum[i] = {
                date : temperatureValues.rows[i].date,
                value : temperatureValues.rows[i].avghum   
            }
            avgsoilhum[i] = {
                date : temperatureValues.rows[i].date,
                value : temperatureValues.rows[i].avgsoilhum   
            }
        }
        console.log(temperatureValues.rows[0].maxtemp);

        const sun = await pool.query(   `Select Min(daytime) As sunrise,Max(daytime) As sunset From (Select * 
            From dht Where Date(daytime) > ((Select daytime From dht Order By daytime DESC Limit 1) ::DATE - interval '1 day')) As Yestary Group By brightness Having brightness > 0;
                                    `);

        let sunrise = sun.rows.length > 0 ? sun.rows[0].sunrise : 'undefined';
        let sunset = sun.rows.length > 0 ? sun.rows[0].sunset : 'undefined'; 
        
        const air = await pool.query(`Select daytime As time, airpressure As airp, airquality as airq From (Select * 
            From dht Where Date(daytime) > ((Select daytime From dht Order By daytime DESC Limit 1) ::DATE - interval '7 hours')) As LastSevenHours;`);

        let airpressurehistory = [];
        let airqualityhistory = [];

        for (i= 0; i < air.rowCount; i ++){
            let time = air.rows[i].time;
            let airp = air.rows[i].airp;
            let airq = air.rows[i].airq;

            let airpjs = {
                time: time,
                value: airp
            }

            let airqjs = {
                time: time,
                value: airq
            }

            airpressurehistory[i] = airpjs;
            airqualityhistory[i] = airqjs;
        }

        res.json({
            daytime : daytime,
            temperature : temperature,
            humidity: humidity,
            airquality: airquality,
            airpressure: airpressure,
            soilhumidity: soilhumidity,
            maxtemp: maxtemp,
            mintemp: mintemp,
            avgtemp: avgtemp,
            avghum: avghum,
            avgsoilhum: avgsoilhum,
            sunrise: sunrise,
            sunset: sunset,
            airpressurehistory: airpressurehistory,
            airqualityhistory:airqualityhistory
        });

    }catch(err){
        console.error(err.message);
    }


});








