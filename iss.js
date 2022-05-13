const request = require('request');
//const requestPromise = require('request-promise');

const nextISSTimesForMyLocation = function(callback) {
  
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, data);
      });
    });
  });
};

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {

  request(`https://api.ipbase.com/json/?apikey=p4UdCFP7CFN2ZDTqGyf4L3nlAySWSsMrHP8VkC8n`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
  
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Geolocation. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    const {latitude, longitude} = JSON.parse(body);
    callback(error, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
  
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS data. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body).response;
    callback(null, data);
  });
};

module.exports = { nextISSTimesForMyLocation };