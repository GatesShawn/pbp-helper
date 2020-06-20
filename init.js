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

const fs = require('fs');
const messageBuilder = require('./utils/message-builder.js');

let initResponse = '';
let roleString = '';
let category = '';
let system;
let gameName;

// load and parse the string file
let strings = JSON.parse(fs.readFileSync('./resources/resources.json', 'utf8'));

function start(message, systemTypes) {
	console.log('Starting init function');

	//check for help command and rout to that instead
	// will false positive if 'help' is in the name of the game
	let help = message.content.match(/\s(help)(\s|$)/i);
	if(help) {
		initHelp(message);
		return;
	}

	// Start constructing the response
	initResponse += strings.init.setup + '\n';

	// Find what Game System to init
	// TDOO: this doesnt work with multiple word games, i.e. World of Darkness
	system = message.content.match(/\s([a-z0-9]*)(\s|$)/i);
	if(system) system = system[1];
	console.log('Game system:' + system);

	//TODO: Doesnt handle if the init function is called with the game name missing the quotes
	gameName = message.content.match(/\s\"|\'([a-z0-9]*)\"|\'(\s|$)/i);
	if(gameName) gameName = gameName[1];
	console.log('Name of the new game:' + gameName);

	let gmType = systemTypes.get(system);
	console.log('GM Type: ' + gmType);

	createRoles(message);

	gameName = gameName ? gameName : strings.gameString;

	makeCategories(message);

	message.channel.send('', new messageBuilder.message(initResponse))
		.catch(console.error);

	message.channel.stopTyping(true);
}
	
function createRoles(message) {
	// Create roles on server
	roleString = strings.roleString;

	let rolesArray = strings.roles;

	for (const i = rolesArray.length - 1; i >= 0; i--) {
			createRole(rolesArray[i][1]);
		}	
}

function createRole(role) {

	let admin;

	if (role === 'bots') {admin=Discord.Permissions.ADMINISTRATOR}; 

	if(!message.guild.roles.find(val => val.name === role)) {
		console.log('Creating a '+ role +' role');
		message.guild.createRole({
		  name: role,
		  color: roleColors[role],
		  permissions: admin
		})
		  .catch(console.error);

		 roleString += role + ', ';
	}
}

function makeCategories(message) {

	initResponse += strings.setupChannels + '\n';

	// Make category
	if(!message.guild.channels.find(val => val.name === gameName)) {
		console.log(strings.channelString + gameName);

		// Create channel category for game on server
		initResponse += strings.categoryString + gameName + '\n';

		message.guild.createChannel(gameName, { type: 'category' })
		  .then(makeChannels)
		  .catch(console.error);
	}
}

function makeChannels(category) {
	// Create channels in the given category
	let channelString = strings.setupChannels;

	// TODO: (ability to specify different styles: closed game, LARP like? chat versus PbP?)
	// TDOD:  Larp style channels: Server rules, character submissions
	category.guild.createChannel(strings.channels.ooc, { type: 'text', topic: strings.channelTopics.ooc, parent: category })
		.then(channelString += strings.channels.ooc + ', ')
		.catch(console.error);

	// make posting here GM only??
	// change name to PCs??
	category.guild.createChannel(strings.channels.character_sheets, { type: 'text', topic: strings.channelTopics.character_sheets, parent: category })
	  .then(channelString += strings.channels.character_sheets + ', ')
	  .catch(console.error);
	
	// TODO: Add Channels: NPC, Rules Discussion, bot feedback, non-player chat (general?)

	initResponse += channelString + '\n';
}

// function setParent(channelCategory) {
// 	category = channelCategory;
// 	makeChannels();
// }

// function addRole(role) {
	
// 	message.guild.member(client.user).addRole(role);
// }

/**
 * @param {Message} message
 * @return 
 */
function initHelp(message) {
	let response = strings.init.help;
	// add automatic listing of supported game systems
	message.channel.send('', new messageBuilder.message(response))
		.catch(console.error);
	message.channel.stopTyping(true);
}

exports.start = start;