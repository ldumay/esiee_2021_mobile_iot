import { Button, Text } from 'react-native';
import FirebaseService from '../service/Firebase';

export default function ButtonPressed() {
	return (
		<div>
			<Text>Get Weather Status</Text>
			<Button onPress={FirebaseService.getWeatherStatus}>Test Bouton</Button>
		</div>
	);
}