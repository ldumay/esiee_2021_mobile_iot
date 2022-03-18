var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var storage = require("./storage") //-Liaison cloud
require('dotenv').config()

//- - [ Config Env ] - -
//--port
const SERIAL_PORT = process.env.SERIAL_PORT;
//--mode
var xbeeAPI = new xbee_api.XBeeAPI({
	api_mode: 2
});
//-serial port
let serialport = new SerialPort(SERIAL_PORT, {
	baudRate: 9600,
}, function (err) {
	if (err) {
		return console.log('Error: ', err.message)
	}
});

//- - [ Binding ] - - 
serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

//- - [ Action ] - -
serialport.on("open", function () {
	var frame_obj = { // AT Request to be sent
		type: C.FRAME_TYPE.AT_COMMAND,
		command: "NI",
		commandParameter: [],
	};

	xbeeAPI.builder.write(frame_obj); //--> send AT Request 

	frame_obj = { // AT Request to be sent
		type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
		destination64: "FFFFFFFFFFFFFFFF",
		command: "NI",
		commandParameter: [],
	};
	xbeeAPI.builder.write(frame_obj); //--> send AT Request

	// frame_obj = { // AT Request to be sent
	// 	type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
	// 	destination64: "FFFFFFFFFFFFFFFF",
	// 	command: "D0",
	// 	commandParameter: [0x00],
	// };
	// xbeeAPI.builder.write(frame_obj); //--> send AT Request
	// frame_obj = { // AT Request to be sent
	//   type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
	//   destination64: "0013A20041582EEE",
	//   command: "D0",
	//   commandParameter: [0x05],
	// };
	// xbeeAPI.builder.write(frame_obj); //--> send AT Request
});


function splitDataReceved(String_data){
	// console.log(String_data);
	let string_data_length = (String_data.match(/&/g) || []).length;
	let clean_string = String_data.replace(/(\r\n|\n|\r)/gm, "");

	// console.log(string_data_length);

	let my_return_array = [];

	if (string_data_length > 0){
		my_split_array = clean_string.split('&');
		// console.log(my_split_array);
		
		my_split_array.forEach(element => {
		let my_element = element.split("=");
		my_return_array[my_element[0]] = my_element[1];
		});

		console.log(my_return_array);
		return my_return_array;
	}
	else{
		let my_element = clean_string.split("=");
		my_return_array[my_element[0]] = my_element[1];
	}
	console.log(my_return_array);
	return my_return_array;
}

// - - [ Coordinator ] - -

// All frames parsed by the XBee will be emitted here

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))

xbeeAPI.parser.on("data", function (frame) {

	//on new device is joined, register it

	//on packet received, dispatch event
	let dataReceived = String.fromCharCode.apply(null, frame.data);

	switch (frame.type) {
		case C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET:
			console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
			let arduino_data = String.fromCharCode.apply(null, frame.data);
			console.log(">> ZIGBEE_RECEIVE_PACKET >", arduino_data);
			// console.log(arduino_data);
		
			let my_return_array = splitDataReceved(arduino_data);
			// console.log(my_return_array);
			// console.log(my_return_array.hasOwnProperty("temperature"));
			// console.log(my_return_array.hasOwnProperty("humidity"));
			// console.log(my_return_array.hasOwnProperty("position"));

			if (my_return_array.hasOwnProperty("position")){
				let wind_power_sensor_value = my_return_array["position"];

				if ( wind_power_sensor_value >= 15){
					// console.log('ouragan ne pas sortir');
					storage.registerWindGaugeSample(frame.remote64,'Stay at home O.o')
				}
				else if ( wind_power_sensor_value > 10 && wind_power_sensor_value <= 15){
					// console.log('vent_puissant');
					storage.registerWindGaugeSample(frame.remote64,'Wind_strong')
				}
				else if ( wind_power_sensor_value > 5 && wind_power_sensor_value <= 10){
					// console.log('vent_moyen');
					storage.registerWindGaugeSample(frame.remote64,'Wind_medium')
				}
				else {
					// console.log('vent_faible');
					storage.registerWindGaugeSample(frame.remote64,'Wind_weak')
				}
			}

			//temperature sensor
			if (my_return_array.hasOwnProperty("temperature")){
				let temperature_sensor_value = my_return_array["temperature"];
				storage.registerTemperatureSample(frame.remote64,(temperature_sensor_value + "°C"));
			}

			//moisture_sensor
			if (my_return_array.hasOwnProperty("humidity")){
				let moisture_sensor_value = my_return_array["humidity"];
				storage.registerMoistureSample(frame.remote64,(moisture_sensor_value + "%"));
			}

			break;
		case C.FRAME_TYPE.NODE_IDENTIFICATION:
			console.log("NODE_IDENTIFICATION");
			storage.registerWeatherStation(frame.remote64);
			break;
		case C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX:
			console.log("ZIGBEE_IO_DATA_SAMPLE_RX")
			// console.log(frame)
			// console.log(frame.analogSamples.AD0)
			// let destination = "AB51";
			// let led_state = 0x00;
			// if (frame.digitalSamples["DIO1"] == 1) {
			// 	led_state = 0x05;
			// }

			// frame_obj = { // AT Request to be sent
			// 	type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
			// 	destination16: destination,
			// 	command: "D0",
			// 	commandParameter: [led_state],
			// };
			// xbeeAPI.builder.write(frame_obj); //--> send AT Request

			// storage.registerWeatherStationSample(frame.remote64,frame.digitalSamples)
			console.log(frame)
			// console.log(frame.analogSamples)
			
			if (frame.analogSamples["AD1"] >= 450){
			 storage.registerPhotovoltaicSample(frame.remote64,'sombre')
			}
			else if (frame.analogSamples["AD1"] >= 150){
				storage.registerPhotovoltaicSample(frame.remote64,'clair')
			}
			else{
				storage.registerPhotovoltaicSample(frame.remote64,'Fait_beau')
			}
			
			if (frame.analogSamples["AD2"] >= 400){
				storage.registerRainSensorSample(frame.remote64,'raining')
			}
			else{
				storage.registerRainSensorSample(frame.remote64,'no_rain')
			}
			


			break;
		case C.FRAME_TYPE.AT_COMMAND_RESPONSE:
			console.log("COMMAND_RESPONSE");
			// console.debug(frame.commandData);
			console.log(frame)
			break;
		case C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE:
			console.log("REMOTE_COMMAND_RESPONSE")
			let dataReceived = String.fromCharCode.apply(null, frame.commandData);
			console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);
			// console.debug(frame.commandData);
			break;
		case C.FRAME_TYPE.MODEM_STATUS:
			console.log("MODEM STATUS");
			console.log(C.MODEM_STATUS[frame.modemStatus]);
			break;
		default:
			console.log("default");
			console.debug(C.FRAME_TYPE[frame.type]);
			console.debug(frame);
			console.debug(dataReceived);
			break;
	}

});
