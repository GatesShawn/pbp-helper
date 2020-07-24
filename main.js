/*	
//	Copyright 2020 Shawn Gates
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
// 	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 	See the License for the specific language governing permissions and
// 	limitations under the License.
// 
//	@author Shawn Gates
*/

// setup libs
const Discord = require('discord.js');
const fs = require('fs');
const secret_token = require('./secret_token.js');
const log = require('./log.js');
const init = require('./init.js');
const help = require('./help.js');
const commandList = require('./utils/psuedo-switch.js');
require('./utils/js-extensions.js');

// global constants
const client = new Discord.Client();

// global variables
let message = {};
let systemTypes = new Map();

_loadModules();

// list connected servers and channels when we connect to the Discord service
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

// listen for messages from the bot
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }
// if (receivedMessage.guild != 'pbp-helper-test') {
// 	return;
//}
	let cmd = receivedMessage.content.match(/\/[a-z]+/);

	console.log('Command Received: ' + cmd);
	
	message = receivedMessage;
	commandList.pseudoSwitch(cmd);

});

function _loadModules() {
	// check the module folder for modules and add them to the switch for loading
	let files = fs.readdirSync('./modules');
	console.log('Loading System Modules: ' + files);
	for (let i = files.length - 1; i >= 0; i--) {
		_registerModule(files[i]);
	}
}

function _registerModule(file) {
	let sysModule = require('./modules/' + file.split('.')[0] + '/' + file);
	commandList.add(sysModule.call, function() {
		sysModule.responseBuilder(message);
	});
	systemTypes = systemTypes.merge(sysModule.system);
}

/**
 * Function to set up the server as a PbP server
 */
function _init() {
	init.start(message, systemTypes);
}

function _reset() {
	console.log('Clearing out all of our created content');

	// remove channels
	message.guild.channels.deleteAll();
}

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }
    if (receivedMessage.guild != 'pbp-helper-test') {
        return;
    }

	let cmd = receivedMessage.content.slice(0, 4);

	console.log(cmd);

	if (cmd == '/cod') {
		let chance_die = false;
		let again = 10;
		let re_die = /[0-9]+/;
		let re_again = /8|9-again/;
		let die_match = receivedMessage.content.match(re_die);
		console.log(die_match);

		// Reject die pools over 100, large die pools cause server slow down and 100 is plenty of buffer space
		if (die_match > 100) {
			receivedMessage.channel.send(receivedMessage.author.toString() + ', your roll was rejected because it was too large. Please roll again with a smaller dice pool.');
			return;
		}
		let die_count = die_match[0];

		if(die_count == 0) {
			die_count = 1;
			chance_die = true;
		}

		for (var i = die_count-1; i >= 0; i--) {
			cod({
				chance_die: chance_die,
				again: again,
			});
		}

		let response = receivedMessage.author.toString() + ', you rolled: '

		for (var i = results.length - 1; i >= 0; i--) {
				let result_print = ''
				if (results[i] >= 8) {
					if (chance_die) {
						if (results[i] != 10) {
							result_print = results[i];
						} else {
							result_print = '**' + results[i] + '**';
						}
					} else {
						result_print = '**' + results[i] + '**';
					}
				} else {
					result_print = results[i];
				}
				//add a comma between results
				if(i > 0) { 
					response += result_print + ', ';
				} else {
					response += result_print;
				}
		}
		console.log(response);
		receivedMessage.channel.send(response);

		let success_response = '';

		if (chance_die) {
			if(success[0] == 10) {
				success_response = "Success! You rolled a 10 on a chance die!";
			} else if(success[0] == 1) {
				success_response = "You got a Dramatic Failure!";
			} else {
				success_response = "You didn't roll a success. That's a Failure. Would you like to make it a Dramatic Failure for a Beat?";
			}

		} else {

			// success counting
			if(success.length == 0) {
				// failure
				success_response = "You rolled no successes. That's a Failure. Would you like to make it a Dramatic Failure for a Beat?";
			} else if (success.length >= 5) {
				//exceptional success
				success_response = "You rolled " + success.length + " successes. That's an Exceptional Success!";
			} else {
				//regular success
				success_response = "You rolled " + success.length + " successes.";
			}

		}

		console.log(success_response);
		receivedMessage.channel.send(success_response);

		results = [];
		success = [];
	} else if (cmd == '/log') {
		console.log('Starting log command');
		//todo: add support for naming the log file
		log.log(receivedMessage);
	}
	// remove all roles
	message.guild.roles.forEach(function (value, key) {
		value.delete()
			.catch(console.error);
	});

	// create a new general channel
	message.guild.createChannel('general', { type: 'text'});
});

function _help() {
	help.help(message.channel, systemTypes);
}

// Expose commands to Discord

commandList.add('/init', function() {
	_init();
});

commandList.add('/help', function() {
	_help();
});

commandList.add('/reset', function() {
	_reset();
});

commandList.add('/reload_modules', function() {
	_loadModules();
});


// log in to the bot with the secret token
let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
