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

/**
 * Reads through the sent message and splits up the components
 * @param  {Object} message Message object from Discord
 * @return {Object} command Object containing the parsed command
 * @return {String} command.cmd Command denote with a slash
 * @return {String} command.author Author string of the message
 * @return {String} command.gameName Quoted name of the new game (only applicable for /init calls)
 * @return {Object} command.channel Channel object from Discord
 * @return {String} command.help Help string, null if help wasn't called
 * @return {Array} command.dice Any numbers passed are treated as dice
 * @return {Array} command.options Anything else is treated as an option
 */
function parse(message) {
	if (typeof message.content !== 'string') {
		console.log('Error: parse requires a Message object with a content string.');
		return;
	}

	console.log('Parsing the message');

	let author = message.author.toString();
	let channel = message.channel;

	// Extract game name
	let re_gameName = new RegExp(/[\"|\'].*[\"|\']/);
	let gameName = message.content.match(re_gameName);
	if (gameName === null) gameName = [''];
	let newName = message.content.replace(gameName[0], '');

	let commandList = newName.split(' ');

	console.log(commandList);

	// Extract command
	let cmd = commandList[0];
	if (cmd.charAt(0) !== '/') {
		console.log('Not a command for PbP-Helper');
		return;
	}
	commandList.shift();

	// Extract Help command; null if it isn't called
	let help = commandList.find(element => element === 'help');

	let list = commandList.values();
	let dice = [];
	let options = [];

	for (const value of list) {
		if (isNaN(value)) {
	  		options.push(value);
		} else {
	  		dice.push(parseInt(value));
		}
	}

	let command = {
		cmd: cmd,
		author: author,
		gameName: gameName,
		channel: channel,
		dice: dice,
		options: options,
		help: help
	}
	
	return command; 
}

exports.parse = parse;