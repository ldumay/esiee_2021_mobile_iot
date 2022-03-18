import { StyleSheet, Text, View } from 'react-native';
import FirebaseService from '../service/Firebase';
import ButtonPressed from './ButtonPressed';

export default function MainApp() {
	return (
		<View style={styles.container}>
			<Text>Test for my first App !</Text>
			<ButtonPressed />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});