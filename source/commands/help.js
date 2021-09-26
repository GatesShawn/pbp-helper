/*	
//	Copyright 2021 Shawn Gates
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

"use strict";

const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
// const messageBuilder = require('./utils/message-builder.js');

let strings = {};

// load and parse the string file
try {
	strings = JSON.parse(fs.readFileSync(__dirname + '/../resources/resources.json', 'utf8'));
} catch (err) {
	console.log(err);
}

function help(channel, systems) {
	if (!channel) {
		console.log('You must provide a Discord Channel Object');
		return
	}

	let helpMessage = strings.help;

	if(systems) {
		let systemList = '';

		for (const system of systems) {
			systemList += ' - ' + system[0] + '\n';
		}

		helpMessage += systemList;
	}

	channel.send('', new messageBuilder.message(strings.bot_name, helpMessage))
		.catch(console.error);
	channel.stopTyping(true);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(strings.commands.help),
	async execute(interaction) {
		// help();
		await interaction.reply(strings.help);
	},
};