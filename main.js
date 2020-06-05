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
*/

// setup libs
const Discord = require('discord.js');
const fs = require('fs');
const secret_token = require('./secret_token.js');
const commandList = require('./utils/psuedo-switch.js');
require('./utils/js-extensions.js');

// global constants
const client = new Discord.Client();

// global variables
let message = {};
let systemTypes = new Map();

// load and parse the string file
var strings = JSON.parse(fs.readFileSync('./resources/resources.json', 'utf8'));

// check the module folder for modules and add them to the switch for loading
fs.readdir('./modules', function callback(err, files) {
	if(err) console.log (err);
	console.log('Loading System Modules: ' + files);
	for (let i = files.length - 1; i >= 0; i--) {
		let sysModule = require('./modules/' + files[i]);
		commandList.add(sysModule.call, function() {
			sysModule.responseBuilder(message);
		});
		systemTypes = systemTypes.merge(sysModule.system);
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
if (receivedMessage.guild != 'pbp-helper-test') {
	return;
}

	let cmd = receivedMessage.content.match(/\/[a-z]+/);

	console.log('Command Received: ' + cmd);

	message = receivedMessage;
	commandList.pseudoSwitch(cmd);

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

	//TODO: Doesnt handle if the init function is called with the game name missing the quotes

	message.channel.send(strings.init);
	
	console.log('Game system:' + system);
	console.log('Name of the new game:' + gameName);

	let gmType = systemTypes.get(system);

	console.log('GM Type: ' + gmType);

	// Create roles on server
	let roleString = strings.roleString;
	
	if(!message.guild.roles.find(val => val.name === strings.roles.bots)) {
		// Create a Bots role for itself
		console.log('Creating a Bots role');
		message.guild.createRole({
		  name: strings.roles.bots,
		  color: 'GREY',
		  permissions: Discord.Permissions.ADMINISTRATOR
		})
		  .then(role => addRole(role))
		  .catch(console.error);

		 roleString += strings.roles.bots + ', ';
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

  	if(!message.guild.roles.find(val => val.name === strings.roles.players)) {
	  	// Create a Players Role
		console.log('Creating a Players role');
		message.guild.createRole({
		  name: 'Players',
		  color: 'BLUE',
		})
		  .then(role => addRole(role))
		  .catch(console.error);
		roleString += strings.roles.players + ', ';
	}

	if(!message.guild.roles.find(val => val.name === strings.roles.observers)) {
	  	// Create a Observers Role
		console.log('Creating an Observers role');
		message.guild.createRole({
		  name: 'Observers',
		  color: 'GREEN',
		})
		  .then(role => addRole(role))
		  .catch(console.error);
		roleString += strings.roles.observers + ', ';
	}

	message.channel.send(roleString); 

	gameName = gameName ? gameName : strings.gameString;

	message.channel.send(strings.setupChannels);
	
	if(!message.guild.channels.find(val => val.name === gameName)) {
		console.log(strings.channelString + gameName);

		let category = null;

		// Create channel category for game on server
		message.channel.send(strings.categoryString + gameName); 

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
	let channelString = strings.setupChannels;

	message.guild.createChannel(strings.channels.ooc, { type: 'text', topic: strings.channel_topics.ooc, parent: category })
	  .then(channelString += strings.channels.ooc + ', ')
	  .catch(console.error);

	  // make posting here GM only??
	  //change name to PCs??
	message.guild.createChannel(strings.channels.character_sheets, { type: 'text', topic: strings.channel_topics.character_sheets, parent: category })
	  .then(channelString += strings.channels.character_sheets + ', ')
	  .catch(console.error);

	message.channel.send(channelString);

	// TODO: Add Channels: NPC, Rules Discussion, bot feedback, non-player chat (general?)
	// TODO: (ability to specify different styles: closed game, LARP like? chat versus PbP?)
	// TDOD:  Larp style channels: Server rules, character submissions,
}

function addRole(role) {
	console.log(`Created new role with name ${role.name} and color ${role.color}`);
	message.guild.member(client.user).addRole(role);
}

function _reset() {

	console.log('Clearing out all of our created content');
	
	// remove all roles
	message.guild.roles.forEach(function (value, key) {
		value.delete()
			.catch(console.error);
	});
}

commandList.add('/init', function() {
	_init();
});

commandList.add('/reset', function() {
	_reset();
});


// log in to the bot with the secret token
let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
