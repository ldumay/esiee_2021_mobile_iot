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

	frame_obj = { // AT Request to be sent
		type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
		destination64: "FFFFFFFFFFFFFFFF",
		command: "D0",
		commandParameter: [0x00],
	};
	xbeeAPI.builder.write(frame_obj); //--> send AT Request
	// frame_obj = { // AT Request to be sent
	//   type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
	//   destination64: "0013A20041582EEE",
	//   command: "D0",
	//   commandParameter: [0x05],
	// };
	// xbeeAPI.builder.write(frame_obj); //--> send AT Request
});


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
			console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);
			break;
		case C.FRAME_TYPE.NODE_IDENTIFICATION:
			console.log("NODE_IDENTIFICATION");
			storage.registerWeatherStation(frame.remote64);
			break;
		case C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX:
			console.log("ZIGBEE_IO_DATA_SAMPLE_RX")
			// console.log(frame.analogSamples.AD0)
			// console.log(frame.digitalSamples)
			let destination = "AB51";

			let led_state = 0x00;
			if (frame.digitalSamples["DIO1"] == 1) {
				led_state = 0x05;
			}

			frame_obj = { // AT Request to be sent
				type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
				destination16: destination,
				command: "D0",
				commandParameter: [led_state],
			};
			xbeeAPI.builder.write(frame_obj); //--> send AT Request

			 storage.registerWeatherStationSample(frame.remote64,frame.digitalSamples)

			break;
		case C.FRAME_TYPE.AT_COMMAND_RESPONSE:
			console.log("COMMAND_RESPONSE");
			console.debug(frame.commandData);
			break;
		case C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE:
			console.log("REMOTE_COMMAND_RESPONSE")
			console.debug(frame);
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
