const Discord = require('discord.js');
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

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }

	let cmd = receivedMessage.content.slice(0, 5);

	if(cmd == '/cod ') {
		
		let die_count = receivedMessage.content.slice(5, 6);
		let results = [];
		let success = [];

		for (var i = die_count-1; i >= 0; i--) {
			//TODO: Count success and return
			let result = die.roll(10);
			console.log(result);
			results.push(result);
			if(result >= 8)	success.push(result);
			console.log(results);
			if(result == 10) {
				let result = die.roll(10);
				console.log(result);
				results.push(result);
				if(result >= 8)	success.push(result);
				console.log(results);
			}
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
	}


});


// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = "NTgxMzE2MjM3NDA1OTc4NjI0.XOdfYQ.2ZozcxkWx28xn5IE4F9Ev6nRQH8";

client.login(bot_secret_token);
