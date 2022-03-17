import { Button, Text } from 'react-native';
import FirebaseService from '../service/Firebase';

export default function ButtonPressed() {

	let temperature = "", photovoltaic = "", rain = "", moisture = "", wind = "";

	async function updateStatus() {
		let statusList = await FirebaseService.getWeatherStatus();
		console.log('statusList', statusList);
		statusList.forEach((status) => {
			switch (status[0]) {
				case 'TemperatureSample':
					temperature = status[1][0].value;
					break;
				case 'PhotovoltaicSample':
					photovoltaic = status[1][0].value;
					break;
				case 'RainSensorSample':
					rain = status[1][0].value;
					break;
				case 'MoistureSample':
					moisture = status[1][0].value;
					break;
				case 'WindGaugeSample':
					wind = status[1][0].value;
					break;
				default:
			}
		});
	}

	return (
		<div>
			<Text>Get Weather Status</Text>
			<Button onPress={updateStatus}>Test Bouton</Button>
			<Text>Temperature: {temperature}</Text>
		</div>
	);
}