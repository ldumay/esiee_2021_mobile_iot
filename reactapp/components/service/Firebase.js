import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, collection, collectionGroup, getDocs, query, limit, orderBy } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
	apiKey: "AIzaSyDDmYzNLfchamm46ipa_4j2cqFRJY51Ewc",
	authDomain: "mobile-iot-d14c4.firebaseapp.com",
	projectId: "mobile-iot-d14c4",
	storageBucket: "mobile-iot-d14c4.appspot.com",
	messagingSenderId: "671321611722",
	appId: "1:671321611722:web:e35145f66eb04ca5578333"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

class FirebaseService {

	/**
	 * Get a list of status from last station 
	 * @return {Array}
	 */
	static async getWeatherStatus() {
		let stationPath = 'WeatherStation'
		let stationCol = collection(firestore, stationPath);
		let stationSnapshot = await getDocs(stationCol);
		let stationList = stationSnapshot.docs.map(station => station.data());
		let dataList = Array();
		for (let station of stationList) {
			let stationDataCol = [
				collection(firestore, stationPath, station.address, 'TemperatureSample'),
				collection(firestore, stationPath, station.address, 'PhotovoltaicSample'),
				collection(firestore, stationPath, station.address, 'RainSensorSample'),
				collection(firestore, stationPath, station.address, 'MoistureSample'),
				collection(firestore, stationPath, station.address, 'WindGaugeSample')
			];
			for (let dataCollection of stationDataCol) {
				let q = query(dataCollection, orderBy('date', 'desc'), limit(1));
				await getDocs(q).then((dataSnapshot) => {
					if (dataSnapshot.docs.length > 0) {
						let collectionName = dataCollection.path.slice(stationPath.length + station.address.length - dataCollection.path.length + 2);
						let recordedDataList = dataSnapshot.docs.map(value => value.data());
						return new Array(collectionName, recordedDataList);
					}
				}).then((dataArray) => {
					if (dataArray !== undefined) {
						dataList.push(dataArray);
						console.log('add new data');
					}
				});
			};
		};
		return dataList;
	}
}
export default FirebaseService;
