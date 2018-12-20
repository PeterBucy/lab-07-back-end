//init for lab 7

'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');

//Load env vars;
require('dotenv').config();
const PORT = process.env.PORT || 3000; //takes from a .env file and then the terminal env

//app
const app = express();
app.use(cors());

// Constructor Functions
function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;  
}

function Weather(weather) {
  this.forecast = weather.summary;
  this.time = new Date(weather.time * 1000).toDateString();
}

// Router
app.get('/location', getLocation)

app.get('/weather', getWeather)

//Handlers
function getWeather (request, response) {
  const weatherData = searchForWeather(request.query.data)
  response.send(weatherData);
}

function getLocation (req, res) {
  const locationData = searchToLatLong(req.query.data); // 'Lynnwood, WA'
  if(!locationData) {
    error(res);
  }
  res.send(locationData);
}

function searchForWeather (query) {
  let weatherData = require('./data/darksky.json');
  let dailyArray = [];
  weatherData.daily.data.forEach(forecast => dailyArray.push(new Weather(forecast)));
  return dailyArray;
}
function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

//Error Handler
function error (res) {
  res.send(500).send('Sorry! Not found!!!');
}

// Give error messages if incorrect

app.get('/*', function(req, res) {
  res.status(404).send('Success!');
})

app.listen(PORT, () => {
  console.log(`app is up on port : ${PORT}`)
})
