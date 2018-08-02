const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path')
const app = express();
const html = require('html');
const publicDir = require('path').join(__dirname, '/sass');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const apiKey = '286fd9ec7bc5ead8ef86823115f5f3b9';

app.use(express.static('sass'));
app.use(express.static(publicDir));

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(__dirname + '/Images'));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
    res.sendfile('./index.html');
});

global.document = new JSDOM(html).window.document;

app.post('/', function(req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    request(url, function(err, response, body) {
        if (err) {
            res.sendfile('./index.html');
        } else {
            let weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.sendfile('./index.html');
            } else {
                let weather = JSON.parse(body);

                temp = weather.main.temp;
                city = weather.name;
                humi = weather.main.humidity;
                Wspeed = weather.wind.speed;
                country = weather.sys.country;

                //document.getElementsByClassName('temp').innerHTML = (temp);
                //global.document.getElementById("temp").textContent = 'temp';
                res.sendfile('./index.html');

                console.log(`its a ${temp} degree in ${city} - ${country} and wind speed is ${Wspeed} and ${humi} of humidity`);

            }
        }
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});