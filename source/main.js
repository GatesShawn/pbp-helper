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

// setup libs
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const commandList = require('./utils/psuedo-switch.js');
const splitter = require('./utils/command-splitter.js');
require('./utils/js-extensions.js');

// global constants
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

// global variables
let message = {};
let systemAliases = new Map();
let systems = new Map();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

_loadModules();

// list connected servers and channels when we connect to the Discord service
client.once('ready', () => {

    console.log("Connected as " + client.user.tag);
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.cache.forEach((channel) => {
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

    let cmd = splitter.parse(receivedMessage);

    console.log('Command Received: ' + cmd.cmd);

    message = cmd;
    commandList.pseudoSwitch(cmd.cmd);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    console.log('Command Received: ' + command);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

/**
 * [_loadModules description]
 * @return {[type]} [description]
 */
function _loadModules() {

    // check the module folder for modules and add them to the switch for loading
    let files = fs.readdirSync(__dirname + '/modules').filter(file => file.endsWith('.js'));
    console.log('Loading System Modules: ' + files);
    for (let i = files.length - 1; i >= 0; i--) {
        _registerModule(files[i]);
    }
}

/**
 * [_registerModule description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function _registerModule(file) {
    let sysModule = require(__dirname + '/modules/' + file.split('.')[0] + '/' + file);
    commandList.add(sysModule.call, function() {
        sysModule.responseBuilder(message);
    });
    systemAliases = systemAliases.merge(new Map(sysModule.systems));
    systems.set(sysModule.system, '');
}

// log in to the bot with the secret token
client.login(token);
