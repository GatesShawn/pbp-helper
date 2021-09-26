/*
//  Copyright 2021 Shawn Gates
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
//  @author Shawn Gates
*/

"use strict";

const fs = require('fs');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

// load and parse the string file
let strings;
try {
	strings = JSON.parse(fs.readFileSync(__dirname + '/resources/resources.json', 'utf8'));
} catch (err) {
	console.log(err);
}

//need to decide how modules will add their own slash commands
const commands = [
	new SlashCommandBuilder().setName('help').setDescription(strings.commands.help),
	new SlashCommandBuilder().setName('init').setDescription(strings.commands.init),
	new SlashCommandBuilder().setName('reload').setDescription(strings.commands.reload),
	new SlashCommandBuilder().setName('reset').setDescription(strings.commands.reset),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();