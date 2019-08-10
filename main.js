/*	
//	Copyright 2019 Shawn Gates
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
*/

// setup libs
const Discord = require('discord.js');
const fs = require('fs');
const secret_token = require('./secret_token.js');

// global constants
const client = new Discord.Client();

// global variables
let message = {};
let callbacks = {};

/**
 * Adds items to the psuedoSwitch functions callback list
 * @param {String}   _case Value to use for the 'switch case'
 * @param {Function} fn    Function to call when _case match is made
 */
function add(_case, fn) {
   callbacks[_case] = callbacks[_case] || [];
   callbacks[_case].push(fn);
}

/**
 * Function that works like a switch case but allows for 'cases' to be added dynamiclly
 * @param  {String} value String to check against the callback list
 */
function pseudoSwitch(value) {
   if (callbacks[value]) {
      callbacks[value].forEach(function(fn) {
          fn();
      });
   }
}

// check the module folder for modules and add them to the switch for loading
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
    //     return;
    // }

	let cmd = receivedMessage.content.match(/\/[a-z]+\s/)[0];

	console.log('Command Recieveied: ' + cmd);

	message = receivedMessage;
	pseudoSwitch(cmd);

});


// log in to the bot with the secret token
let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
