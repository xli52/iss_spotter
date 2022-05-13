const request = require('request-promise-native');

const nextISSTimesForMyLocation = function() {
  fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      const passTime = JSON.parse(body).response;
      for (const time of passTime) {
        const datetime = new Date(0);
        datetime.setUTCSeconds(time.risetime);
        console.log(`Next pass at ${datetime} for ${time.duration} seconds!`);
      }
    })
    .catch((error) => {
      console.log("It didn't work: ", error.message);
    });
};

const fetchMyIP = function() {
  // use request to fetch IP address from JSON API
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function() {
  return request(`https://api.ipbase.com/json/?apikey=p4UdCFP7CFN2ZDTqGyf4L3nlAySWSsMrHP8VkC8n`);
};

const fetchISSFlyOverTimes = function(body) {
  const {latitude, longitude} = JSON.parse(body);
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

module.exports = { nextISSTimesForMyLocation };