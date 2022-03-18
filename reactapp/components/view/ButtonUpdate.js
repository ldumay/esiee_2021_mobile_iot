import { useState } from 'react';
import { Button, Text } from 'react-native';
import FirebaseService from '../service/Firebase';
import DataCell from './DataCell';

export default function ButtonUpdate() {


	const [temperature, setTemperature] = useState();
	const [photovoltaic, setPhotovoltaic] = useState();
	const [rain, setRain] = useState();
	const [moisture, setMoisture] = useState();
	const [wind, setWind] = useState();

	async function updateStatus() {
		let statusList = await FirebaseService.getWeatherStatus();
		console.log('statusList', statusList);
		statusList.forEach((status) => {
			switch (status[0]) {
				case 'TemperatureSample':
					setTemperature(status[1][0].value);
					console.log(temperature);
					break;
				case 'PhotovoltaicSample':
					setPhotovoltaic(status[1][0].value);
					console.log(photovoltaic);
					break;
				case 'RainSensorSample':
					setRain(status[1][0].value);
					console.log(rain);
					break;
				case 'MoistureSample':
					setMoisture(status[1][0].value);
					console.log(moisture);
					break;
				case 'WindGaugeSample':
					setWind(status[1][0].value);
					console.log(wind);
					break;
				default:
			}
		});
	}

	return (
		<div>
			<Text>Get Weather Status</Text>
			<Button onPress={updateStatus}>Test Bouton</Button>
			<DataCell dataType={"Temperature"} data={temperature} />
			<DataCell dataType={"Luminosité"} data={photovoltaic} />
			<DataCell dataType={"Pluie"} data={rain} />
			<DataCell dataType={"Humidité"} data={moisture} />
			<DataCell dataType={"Vent"} data={wind} />
		</div>
	);
}