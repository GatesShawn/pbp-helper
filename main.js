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
    // if (receivedMessage.guild === 'pbp-helper-test') {
    //    return;
    //  }

	let cmd = receivedMessage.content.match(/\/[a-z]+/);

	console.log('Command Recieveied: ' + cmd);

	message = receivedMessage;
	pseudoSwitch(cmd);

});

/**
 * Function to set up the server as a PbP server
 */
function _init() {
	console.log('Starting init function');

	let system = message.content.match(/\s([a-z0-9]*)(\s|$)/i);
	if(system) system = system[1];

	let gameName = message.content.match(/\s\"([a-z0-9]*)\"(\s|$)/i);

	if(gameName) gameName = gameName[1];

	message.channel.send('Setting up the server for play by post play');
	
	console.log('Game system:' + system);
	console.log('Name of the new game:' + gameName);

	let gmType = 'GM';
	
	switch (system) {
		case 'StoryPath':
			gmType = 'StoryGuide';
			break;
		case 'CofD':
		case 'CoD':
		case 'WoD':
		case 'nWoD':
		case 'oWoD':
		case 'V5':
			gmType = 'Storyteller';
			break;
		default:
			gmType = 'GM';
	}

	// Create roles on server
	let roleString = 'Creating Roles: ';
	
	if(!message.guild.roles.find(val => val.name === 'Bots')) {
		// Create a Bots role for itself
		console.log('Creating a Bots role');
		message.guild.createRole({
		  name: 'Bots',
		  color: 'GREY',
		  permissions: Discord.Permissions.ADMINISTRATOR
		})
		  .then(role => addRole(role))
		  .catch(console.error);

		 roleString += 'Bots, ';
	}

	if(!message.guild.roles.find(val => val.name === gmType)) {
		// Create a GM Role
		console.log('Creating a GM role');
		message.guild.createRole({
		  name: gmType,
		  color: 'RED',
		  permissions: Discord.Permissions.ADMINISTRATOR
		})
		  .then(role => addRole(role))
		  .catch(console.error);
		roleString += gmType + ', ';
	}

  	if(!message.guild.roles.find(val => val.name === 'Players')) {
	  	// Create a Players Role
		console.log('Creating a Players role');
		message.guild.createRole({
		  name: 'Players',
		  color: 'BLUE',
		})
		  .then(role => addRole(role))
		  .catch(console.error);
		roleString += 'Players, ';
	}

	if(!message.guild.roles.find(val => val.name === 'Observers')) {
	  	// Create a Observers Role
		console.log('Creating an Observers role');
		message.guild.createRole({
		  name: 'Observers',
		  color: 'GREEN',
		})
		  .then(role => addRole(role))
		  .catch(console.error);
		roleString += 'Observers, ';
	}

	message.channel.send(roleString); 

	gameName = gameName ? gameName : 'New PbP Game'

	message.channel.send('Creating channels:' );
	
	if(!message.guild.channels.find(val => val.name === gameName)) {
		console.log('Creating channels for game: ' + gameName);

		let category = null;

		// Create channel categrory for game on server
		message.channel.send('Creating channel category named: ' + gameName); 

		message.guild.createChannel(gameName, { type: 'category' })
		  .then(parent => setParent(parent))
		  .catch(console.error);
	}
}

function setParent(channelCategory) {
	category = channelCategory;
	makeChannels();
}

function makeChannels() {
	// Create channels on server
	let channelString = 'Creating channels: ';

	message.guild.createChannel('ooc', { type: 'text', topic: 'General out of character chat', parent: category })
	  .then(channelString += 'ooc, ')
	  .catch(console.error);


	message.guild.createChannel('character_sheets', { type: 'text', topic: 'Contains a sheet for each character in the game', parent: category })
	  .then(channelString += 'character_sheets, ')
	  .catch(console.error);

	message.channel.send(channelString);
}

function addRole(role) {
	console.log(`Created new role with name ${role.name} and color ${role.color}`);
	message.guild.member(client.user).addRole(role);
}

add('/init', function() {
	_init();
});

// log in to the bot with the secret token
let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
