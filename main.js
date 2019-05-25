const Discord = require('discord.js');
const secret_token = require('./secret_token.js');

const client = new Discord.Client();

let die = {
  sides: 6,
  roll: function (sides) {
  	
  	if(sides) this.sides = sides;

    var randomNumber = Math.floor(Math.random() * this.sides) + 1;
    
    return randomNumber;
  }
}

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

let results = [];
let success = [];

function cod(options) {
	if (!options) {
		console.log('Options is required!');
		return;
	}

	let result = die.roll(10);
	console.log(result);
	results.push(result);
	if(result >= 8)	success.push(result);
	console.log(results);
	console.log(success);

	if(result == 10) {
		cod({});		
	}

}	

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }

	let cmd = receivedMessage.content.slice(0, 5);
	console.log(cmd);

	if (cmd == '/cod ') {
		
		let die_count = receivedMessage.content.slice(5, 6);

		for (var i = die_count-1; i >= 0; i--) {
			cod({});
		}

		let response = receivedMessage.author.toString() + ', you rolled: '

		for (var i = results.length - 1; i >= 0; i--) {
				let result_print = ''
				if (results[i] >= 8) {
					result_print = '**' + results[i] + '**';
				} else {
					result_print = results[i];
				}
				if(i > 0) { 
					response += result_print + ', ';
				} else {
					response += result_print;
				}
		}
		console.log(response);
		receivedMessage.channel.send(response);

		results = [];
	}
});

let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
