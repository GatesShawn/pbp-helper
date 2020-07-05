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

const Die = require('../../utils/die.js');
const fs = require('fs');
const messageBuilder = require('../../utils/message-builder.js');
const help = require('../../utils/help-system.js');

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

	results.push({result:result, type:options.type});
	console.log('Results Array: ' + results);
}

function responseBuilder(receivedMessage) {

	//check for help command and rout to that instead	
	if(help.check(receivedMessage.content)) {
		helpBuilder(receivedMessage);
		return;
	}

	let author = receivedMessage.author.toString();
	let re_die = /[0-9]+/g;
	let re_batch = /batch/g;

	let die_match = receivedMessage.content.match(re_die);
	if (die_match===null) {
		receivedMessage.channel.send('', new messageBuilder.message(author + strings.no_dice));
		receivedMessage.channel.stopTyping(true);
		return;
	}
	let batch_match = receivedMessage.content.match(re_batch);

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
				receivedMessage.channel.stopTyping(true);
				return;
		}
	}
	let response = '';

	// an intrinsic lets some re-roll ones, allow rolling or add a keyword to re-roll for them
	if (results.length > 2) {
		if(!batch_match) {
			results.sort(function compareNumbers(a, b) {
		 		return b.result - a.result;
			});
			response = author + strings.roll +  strings.value.max + '**' + results[0].result  + '**'  + "(d" + results[0].type + ") "+ strings.value.mid  + '**' + results[1].result  + '**'  + "(d" + results[1].type + ") " + strings.value.min  + '**' + results[2].result + '**'  + "(d" + results[2].type + ")";
		} else {

			// handle batch rolling for the GM
			response = author + strings.roll;
			for (var i = results.length - 1; i >= 0; i--) {
				response += '**' + results[i].result  + '**' + "(d" + results[i].type + ")";
				if (results[i] !== 1) {
					response += ', ';
				}
			}
			
		}
	} else {
		response = author + strings.roll  + '**' + results[0].result + '**' + "(d" + results[0].type + ")";
	}
	console.log('Success response to server: ' + response);
	receivedMessage.channel.send('', new messageBuilder.message(response));

	receivedMessage.channel.stopTyping(true);
	results = [];
}

/**
 * @param {Message} message
 * @return 
 */
function helpBuilder(message) {
	let response = strings.help;
	// add automatic listing of supported game systems
	message.channel.send('', new messageBuilder.message(response))
		.catch(console.error);
	message.channel.stopTyping(true);
}

exports.call = call;
exports.system = systems;
exports.responseBuilder = responseBuilder;

// sentinels init is a nomination system, maybe a tracker that just ticks off who has gone and then resets once all do
// 
// Starting a sentinels game add the boost/hinder/etc chart and pin it
// |EFFECT DIE RESULT | MOD SIZE | OUTCOME                                      |
// |0 or Less         | Nothing  | Action utterly, spectacularly fails          |
// |1-3               | +/- 1    | Action fails, or succeeds with a major twist |
// |4-7               | +/- 2    | Action succeeds, but with a minor twist      |
// |8-11              | +/- 3    | Action completely succeeds                   |
// |12+               | +/- 4    | Action succeeds beyond expectations          |