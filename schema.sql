Drop table dht;

CREATE DATABASE weather_data;


CREATE TABLE dht(
    dht_id SERIAL PRIMARY KEY, 
    daytime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    temperature FLOAT NOT NULL, 
    humidity FLOAT NOT NULL,
    soilhumidity FLOAT NOT NULL,
    airpressure FLOAT NOT NULL,
    airquality FLOAT NOT NULL,
    brightness FLOAT NOT NULL
);

Insert into dht (temperature,humidity,soilhumidity,airpressure,airquality,brightness) Values (10.0,10.0,10.0,10.0,10.0,0);

//Gestern anfangen jetzt heute
Select Date(daytime), Max(temperature) As maxtemp ,Avg(temperature) As avgtemp, Min(temperature) as mintemp,  Avg(humidity) As avghum, Avg(soilhumidity) As soilhum From (Select * From dht Where  Date(daytime) <= now()::DATE AND Date(daytime) > (now()::DATE -8)) as Week Group By Date(daytime);

Insert into dht (temperature,humidity,soilhumidity,airpressure,airquality,brightness) Values (15.0,15.0,15.0,15.0,15.0,0.0);

Insert into dht (temperature,humidity,soilhumidity,airpressure,airquality,brightness) Values (15.0,15.0,15.0,15.0,15.0,1.0);

Select Min(daytime) As sunrise,Max(daytime) As sunset From (Select * From dht Where  Date(daytime) = now()::DATE) as Yesterday Group By brightness Having brightness > 0;

Select Date(daytime), airpressure As airp From dht WHERE  daytime >= now()- interval '7 hours';

Select Date(daytime), airquality As airq From dht WHERE  daytime >= now()- interval '7 hours';

Select Date(daytime), Avg(humidity) As avghum From (Select * From dht Where  Date(daytime) < now()::DATE AND Date(daytime) > (now()::DATE -8)) as Week Group By Date(daytime);

Select Date(daytime), Avg(soilhumidity) As soilhum From (Select * From dht Where  Date(daytime) < now()::DATE AND Date(daytime) > (now()::DATE -8)) as Week Group By Date(daytime);



SELECT daytime, temperature, humidity,airpressure, soilhumidity, airquality
        FROM dht
        ORDER BY daytime DESC
        LIMIT 1;