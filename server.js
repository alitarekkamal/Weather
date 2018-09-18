const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path')
const app = express();
const html = require('html');
const publicDir = require('path').join(__dirname, '/sass');

const apiKey = '286fd9ec7bc5ead8ef86823115f5f3b9';

var requestTime = function(req, res, date) { /////
    let D = new Date();
    let days = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    req.requestDate = D.getDate();
    req.requestMonth = months[D.getMonth()];
    req.requestDay = days[D.getDay()];
    date();
};

app.use(express.static('sass'));
app.use(express.static(publicDir));
app.use(requestTime); ////

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(__dirname + '/Images'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
    res.render('index', info = {});
});

app.post('/', function(req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    request(url, function(err, response, body) {
        if (err) {
            res.render('index');
        } else {
            let weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index');
            } else {
                let weather = JSON.parse(body);

                res.render('index', info = {
                    pressure: weather.main.pressure,
                    temp: weather.main.temp,
                    city: weather.name,
                    humi: weather.main.humidity,
                    Wspeed: weather.wind.speed,
                    country: weather.sys.country,
                    date: req.requestDate,
                    month: req.requestMonth,
                    day: req.requestDay
                });
                //console.log(`its a ${temp} degree in ${city} - ${country} and wind speed is ${Wspeed} and ${humi} of humidity`);

            }
        }
    });
});

app.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});