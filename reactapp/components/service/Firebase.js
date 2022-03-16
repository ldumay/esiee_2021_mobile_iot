import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, collection, collectionGroup, getDocs } from 'firebase/firestore/lite';
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
	 * Get a list of cities from your database 
	 */
	static async getWeatherStatus() {
		let stationCol = collection(firestore, '/WeatherStation');
		let stationSnapshot = await getDocs(stationCol);
		let stationList = stationSnapshot.docs.map(station => station.data());
		console.log(stationList);
		stationList.forEach((station) => {
			console.log(station);
		});

	}
}
export default FirebaseService;
