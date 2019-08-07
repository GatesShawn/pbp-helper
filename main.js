const Discord = require('discord.js');
const die = require('./utils/die.js');
const cod = require('./modules/cod.js');
const secret_token = require('./secret_token.js');

const client = new Discord.Client();

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

	let cmd = receivedMessage.content.slice(0, 4);

	console.log('Command Recieveied: ' + cmd);

	if (cmd == '/cod') {
		cod.responseBuilder(receivedMessage);
	}
});

let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
