import { StyleSheet, Text, View } from 'react-native';
import Title from './Title';
import ButtonUpdate from './ButtonUpdate';

export default function MainApp() {
	return (
		<View style={styles.container}>
			<Title />
			<ButtonUpdate />
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