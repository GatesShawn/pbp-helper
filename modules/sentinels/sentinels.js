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

const Die = require('../../utils/die.js');
const fs = require('fs');
const messageBuilder = require('../../utils/message-builder.js');

let gm = 'GameModerator';
let call = '/sen';
let systems = new Map([
			[ 'Sentinels', gm ],
			['Sentinels of the Multiverse',  gm ],
			['SotM', gm ]
		]);

let results = [];
let strings;

// load and parse the string file
try{
	strings = JSON.parse(fs.readFileSync(__dirname + '/resources.json', 'utf8'));
} catch (err) {
	console.log(err);
}
/**
 * Calls die rolling for Sentinels
 * @param  Object options Parameter object
 * @param Boolean options.chance_die Sets whether the roll being made is a chance die
 * @param Number options.again value to use for rolling again
 * @return {[type]}         [description]
 */
function roll(options) {
	console.log(options);

	if (!options.type) {
		console.log('Options is required!');
		return;
	}

	let result = Die.die.roll(options.type);

	results.push(result);
	console.log('Results Array: ' + results);
}

function responseBuilder(receivedMessage) {
	let author = receivedMessage.author.toString();
	let re_die = /[0-9]+/g;

	let die_match = receivedMessage.content.match(re_die);
	if (die_match===null) {
		receivedMessage.channel.send('', new messageBuilder.message(author + strings.no_dice));
		receivedMessage.channel.stopTyping();
		return;
	}
	console.log(die_match);

	// check for the acceptable types of dice
	for (var i = die_match.length - 1; i >= 0; i--) {
		console.log('Dice: ' + die_match[i]);
		switch(die_match[i]) {
			case '4':
			case '6':
			case '8':
			case '10':
			case '12':
				console.log('Dice after Switch: ' + die_match[i]);
				roll({type: die_match[i]});
				break;
			default:
				receivedMessage.channel.send('', new messageBuilder.message(author + strings.wrong_dice));
				receivedMessage.channel.stopTyping();
				return;
		}
	}
	let response = '';
	if (results.length > 2) {
		results.sort(function compareNumbers(a, b) {
	 		return b - a;
		});

		response = author + strings.roll +  strings.value.max + '**' + results[0]  + '**' + strings.value.mid  + '**' + results[1]  + '**' + strings.value.min  + '**' + results[2] + '**';
	} else {
		response = author + strings.roll  + '**' + results[0] + '**';
	}
	console.log('Success response to server: ' + response);
	receivedMessage.channel.send('', new messageBuilder.message(response));

	receivedMessage.channel.stopTyping();
	results = [];
}

exports.call = call;
exports.system = systems;
exports.responseBuilder = responseBuilder;

// sentinals init is a nimination system, maybe a tracker that just ticks off who has gone and then resets once all do