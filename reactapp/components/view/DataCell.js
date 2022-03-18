import { Text } from 'react-native';

export default function DataCell(props) {
	return (
		<div>
			<Text>{props.dataType}: {props.data}</Text>
		</div>
	);
}