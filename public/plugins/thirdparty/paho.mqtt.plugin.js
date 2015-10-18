// # A Freeboard Plugin that uses the Eclipse Paho javascript client to read MQTT messages

(function()
{
	// ### Datasource Definition
	//
	// -------------------
	freeboard.loadDatasourcePlugin({
		"type_name"   : "paho_mqtt",
		"display_name": "Paho MQTT",
        "description" : "Receive data from an MQTT server.",
		"external_scripts" : [
			"http://localhost:3000/js/mqttws31.js", "http://localhost:3000/js/socket.js"
//			"http://unmand.io:3000/js/mqttws31.js", "http://unmand.io:3000/js/socket.js"
		],
		"settings"    : [
			{
				"name"         : "server",
				"display_name" : "MQTT Server",
				"type"         : "text",
				"description"  : "Hostname for your MQTT Server",
                "required" : true
			},
			{
				"name"        : "port",
				"display_name": "Port",
				"type"        : "number", 
				"description" : "The port to connect to the MQTT Server on",
				"required"    : true
			},
			{
				"name"        : "use_ssl",
				"display_name": "Use SSL",
				"type"        : "boolean",
				"description" : "Use SSL/TLS to connect to the MQTT Server",
				"default_value": true
			},
            {
            	"name"        : "client_id",
            	"display_name": "Client Id",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "username",
            	"display_name": "Username",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "password",
            	"display_name": "Password",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "topic",
            	"display_name": "Topic",
            	"type"        : "text",
            	"description" : "The topic to subscribe to",
            	"required"    : true
            },
            {
            	"name"        : "json_data",
            	"display_name": "JSON messages?",
            	"type"        : "boolean",
            	"description" : "If the messages on your topic are in JSON format they will be parsed so the individual fields can be used in freeboard widgets",
            	"default_value": false
            }
		],
		// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
		// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
		// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
		// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			newInstanceCallback(new mqttDatasourcePlugin(settings, updateCallback));
		}
	});

	var mqttDatasourcePlugin = function(settings, updateCallback)
	{
 		var self = this;
		var data = {};

		var currentSettings = settings;

		function onConnect() {
			console.log("Connected");
			client.subscribe(currentSettings.topic);
		};
		
		function onConnectionLost(responseObject) {
			if (responseObject.errorCode !== 0)
				console.log("onConnectionLost:"+responseObject.errorMessage);
		};

		var obj;
		var count = 0;
		
		function onMessageArrived(message) {
			data.topic = message.destinationName;
 
			if (endsWith(message.destinationName, "imagestream")) {
//				count++;
//				console.log("Image COUNT: " + count);
//				var payload = message.payloadBytes;
//				console.log("Image payload length:" + payload.length);
//				var coordinates = [ 20, 5 ];
//				data.image = drawImage(payload, coordinates);
				
				count++;
				console.log("COUNT: " + count);
				var payload = message.payloadBytes;
//				console.log("onMessageArrived payload length:" + payload.length);
				var coordinates = [ 8, 3 ];
				drawImage(payload, coordinates);
				
			} else {
				obj = JSON.parse(message.payloadString);
				
				if (obj.altitude) {
					data.altitude = obj.altitude; 
				} else if (obj.x){
					document.getElementById("x").innerHTML = obj.x;
					document.getElementById("y").innerHTML = obj.y;
					document.getElementById("z").innerHTML = obj.z;
				} else if (obj.battery){
					data.battery = obj.battery;
				} else if (obj.xvel){
					document.getElementById("vx").innerHTML = obj.xvel;
					document.getElementById("vy").innerHTML = obj.yvel;
					document.getElementById("vz").innerHTML = obj.zvel;
				} 
			}
			
//			if (endsWith(message.destinationName, "altitude")) {
//				obj = JSON.parse(message.payloadString);
//				//console.log(message.payloadString);
//				if (!data.altitude) {
//					data.altitude = 0;
//				}  
//				data.altitude = obj.altitude; 
//				
//			} else if (endsWith(message.destinationName, "attitude")) {
//				obj = JSON.parse(message.payloadString);
// 	
//				document.getElementById("x").innerHTML = obj.x;
//				document.getElementById("y").innerHTML = obj.y;
//				document.getElementById("z").innerHTML = obj.z;
//				
//			} else if (endsWith(message.destinationName, "battery")) { 
//				obj = JSON.parse(message.payloadString);
////				console.log(message.payloadString);
//				if (!data.battery) {
//					data.battery = 0;
//				}  
//				data.battery = obj.battery; 
//			} else if (endsWith(message.destinationName, "velocity")) {
//				obj = JSON.parse(message.payloadString);
// 
//				document.getElementById("vx").innerHTML = obj.xvel;
//				document.getElementById("vy").innerHTML = obj.yvel;
//				document.getElementById("vz").innerHTML = obj.zvel;
//				
//			} 
			
			updateCallback(data);
		};

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{
			client.disconnect();
			data = {};
			currentSettings = newSettings;
			client.connect({onSuccess:onConnect,
							userName: currentSettings.username,
							password: currentSettings.password,
							useSSL: currentSettings.use_ssl});
		}

		// **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function()
		{
			// Don't need to do anything here, can't pull an update from MQTT.
		}

		// **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function()
		{
			if (client.isConnected()) {
				client.disconnect();
			}
			client = {};
		}

		var client = new Paho.MQTT.Client(currentSettings.server,
										currentSettings.port, 
										currentSettings.client_id);
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
		client.connect({onSuccess:onConnect, 
						
						userName: currentSettings.username,
						password: currentSettings.password,
						useSSL: currentSettings.use_ssl});
	}
}());