const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//addresse = MAC du routeur
// Function create collection
module.exports.registerWeatherStation = async function (address) {

  const docRef = db.collection('WeatherStation').doc(address);

  const weatherd_station = {
    address: address,
    date: Date.now(),
  }

  await docRef.get().then((snapshotDoc)=> {
    if (!snapshotDoc.exists)
      docRef.set(weatherd_station);
    else
      docRef.update(weatherd_station);
  })
}

// Function resister test sample into sample of WeatherStation
module.exports.registerWeatherStationSample = async function (address, sample) {

  const docRef = db.collection('WeatherStation').doc(address)
    .collection('ButtonLed').doc(Date.now().toString());

  const data = {
    value: sample,
    date: Date.now(),
  }
  await docRef.set(data);

}

// Function resister solar sensor sample into sample of WeatherStation
module.exports.registerPhotovoltaicSample = async function (address, sample) {

  const docRef = db.collection('WeatherStation').doc(address)
    .collection('PhotovoltaicSample').doc(Date.now().toString());

  const data = {
    value: sample,
    date: Date.now(),
  }
  await docRef.set(data);
}

// Function resister température sensor sample into sample of WeatherStation
module.exports.registerTemperatureSample = async function (address, sample) {

  const docRef = db.collection('WeatherStation').doc(address)
    .collection('TemperatureSample').doc(Date.now().toString());

  const data = {
    value: sample,
    date: Date.now(),
  }
  await docRef.set(data);
}

// Function resister moisture sensor sample into sample of WeatherStation
module.exports.registerMoistureSample = async function (address, sample) {

  const docRef = db.collection('WeatherStation').doc(address)
    .collection('MoistureSample').doc(Date.now().toString());

  const data = {
    value: sample,
    date: Date.now(),
  }
  await docRef.set(data);
}

// Function resister wind sensor sample into sample of WeatherStation
module.exports.registerWindGaugeSample = async function (address, sample) {

  const docRef = db.collection('WeatherStation').doc(address)
    .collection('WindGaugeSample').doc(Date.now().toString());

  const data = {
    value: sample,
    date: Date.now(),
  }
  await docRef.set(data);
}

// Function resister rain sensor sample into sample of WeatherStation
module.exports.registerRainSensorSample = async function (address, sample) {

  const docRef = db.collection('WeatherStation').doc(address)
    .collection('RainSensorSample').doc(Date.now().toString());

  const data = {
    value: sample,
    date: Date.now(),
  }
  await docRef.set(data);
}

module.exports.weatherStationSensors = function () {

  const docRef = db.collection('WeatherStation');

  return docRef.get()

}

