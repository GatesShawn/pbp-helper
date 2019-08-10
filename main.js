const Discord = require('discord.js');
const fs = require('fs');
const secret_token = require('./secret_token.js');

const client = new Discord.Client();

let message = {};
let callbacks = {};

function add(_case, fn) {
   callbacks[_case] = callbacks[_case] || [];
   callbacks[_case].push(fn);
}

function pseudoSwitch(value) {
   if (callbacks[value]) {
      callbacks[value].forEach(function(fn) {
          fn();
      });
   }
}

fs.readdir('./modules', function callback(err, files) {
	if(err) console.log (err);
	console.log('Loading System Modules: ' + files);
	for (let i = files.length - 1; i >= 0; i--) {	
		let sysModule = require('./modules/' + files[i]);
		add(sysModule.call, function() {
		   sysModule.responseBuilder(message);
		});
	}
});

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });

});	

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }
    // if (receivedMessage.guild != 'pbp-helper-test') {
    //     return;
    // }

	let cmd = receivedMessage.content.match(/\/[a-z]+\s/)[0];

	console.log('Command Recieveied: ' + cmd);

	message = receivedMessage;
	pseudoSwitch(cmd);

});

let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
