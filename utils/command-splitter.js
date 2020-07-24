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

/**
 * @param  {Message} message The Discord message to parse
 * @return {[type]}
 */
function parse(message) {
	// check that message is a valid message object
	if(message instanceof Discord.Message != true) {
		console.log('Parse requires a Discord Message object')
		return;
	}
	// I think it would be slightly more perfomrant to only pass the content to this function in the first place
	let command = message.content;
	
	console.log('Parsing the message');
	let re_name = new RegExp(/\".*\"/i);
	let name = command.match(re_name);

	command = command.replace(re_name, '')

	let commandList = command.split(' ');

	// if(name != null) {
	// 	commandList.push(name[0]);
	// }
	// console.log(commandList);

	return {
		command: 
	};
}

exports.parse = parse;