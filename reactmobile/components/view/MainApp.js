import { StyleSheet, Text, View } from 'react-native';
import Title from './Title';

export default function MainApp() {
	return (
		<View style={styles.container}>
			<Title />
			<Text>Test de fonctionnement d'une app mobile</Text>
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