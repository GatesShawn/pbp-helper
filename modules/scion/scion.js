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
// 
//	@author Shawn Gates
*/

const Die = require('../../utils/die.js');
const messageBuilder = require('../../utils/message-builder.js');
const fs = require('fs');

let scion_die = 10; 
let scion_tn = 7;
let GM = 'Storyguide';
let strings;

// load and parse the string file
try{
	strings = JSON.parse(fs.readFileSync(__dirname + '/resources.json', 'utf8'));
} catch (err) {
	console.log(err);
}

// might be able to make this one Map (key: [value, success or not])
let results = [];
let success = [];

let gm = 'Storyguide';
let call = '/scion';
let systems = new Map([
			[ 'StoryPath', gm ]
		]);

/**
 * Calls die rolling for StoryPath
 * @param  Object options Parameter object
 * @param Boolean options.chance_die Sets whether the roll being made is a chance die
 * @param Number options.again value to use for rolling again
 * @return {[type]}         [description]
 */
function roll(options) {
	if (!options) {
		console.log('Options is required!');
		return;
	}

	let result = Die.die.roll(scion_die);
	results.push(result);
	if(result >= scion_tn) success.push(result);
	
	if(result >= options.again && !options.chance_die) {
		console.log('Roll was ' + result + ', which meets or beats the "again" threshold of ' + options.again);
		roll({
			explosion: true,
			again: options.again,
			rote: options.rote
		});		
	}
}

function responseBuilder(receivedMessage) {
	let author = receivedMessage.author.toString();
	let again = 10;
	let re_die = /[0-9]+/;
	let re_again = /8-again|9-again|7-again|no-again/;
	let die_match = receivedMessage.content.match(re_die);
	if (die_match===null) {
		receivedMessage.channel.send('', new messageBuilder.message(author + strings.no_dice))
			.catch(console.error);
		receivedMessage.channel.stopTyping(true);
		return;
	}
	
	// Reject die pools over 100, large die pools cause server slow down and 100 is plenty of buffer space
	if (die_match > 100) {
		receivedMessage.channel.send('', new messageBuilder.message(author + strings.too_large))
			.catch(console.error);
		receivedMessage.channel.stopTyping(true);
		return;
	}
	
	console.log('Number of dice to be rolled: ' + die_match);
	let die_count = die_match[0];

	let again_match = receivedMessage.content.match(re_again);
	if (again_match === null) {again_match = '';}
	console.log(again_match);

	switch (again_match[0]) {
		case '9-again':
			again = 9;
			break;
		case '8-again':
			again = 8;
			break;
		case '7-again':
			again 	= 7;
			break;
		case 'no-again':
			again = 11;
			break;
		default:
	}
	console.log('Again value: ' + again);

	for (var i = die_count-1; i >= 0; i--) {
		roll({
			again: again,
		});
	}

	let response = author + strings.roll;

	for (let i = results.length - 1; i >= 0; i--) {
		let result_print = ''
		if (results[i] >= scion_tn) {
			result_print = '**' + results[i] + '**';
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

	response += strings.response_1 + success.length + strings.response_2;

	console.log('Results response to server: ' + response);
	receivedMessage.channel.send('', new messageBuilder.message(response))
		.catch(console.error);

	receivedMessage.channel.stopTyping(true);

	results = [];
	success = [];
}

exports.call = call;
exports.system = systems;
exports.responseBuilder = responseBuilder;