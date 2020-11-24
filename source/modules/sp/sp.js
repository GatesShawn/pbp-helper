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
const messageBuilder = require('../../utils/message-builder.js');
const fs = require('fs');

let storypath_die = 10; 
let storypath_tn = 8; // this changes more than I hoped. Skill Tricks in TC can change this as well (maybe other things too) TC will need a way to change it per roll
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
let call = '/sp';
let systems = new Map([
			[ 'StoryPath', gm ]
		]);

/**
 * Calls die rolling for StoryPath
 * @param  Object options Parameter object
 * @param Boolean options.chance_die Sets whether the roll being made is a chance die
 * @param Number options.double value to use for double successes
 * @return {[type]}         [description]
 */
function roll(options) {
	if (!options) {
		console.log('Options is required!');
		return;
	}

	let result = Die.die.roll(10);
	results.push(result);
	if(result >= storypath_tn) success.push(result);
	
	// 10s are two successes in they came from (they re-roll in Scion?!)
	if(result >= options.double) {
		success.push(result);
	}
}

function responseBuilder(receivedMessage) {
	let author = receivedMessage.author.toString();
	let double = 10;
	let re_die = /[0-9]+/;
	let re_double = /double (8|9)/;
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

	//change back to -again...
	let double_match = receivedMessage.content.match(re_double);
	if (double_match === null) {double_match = '';}
	console.log('Double Match results: ' + double_match);

	switch (double_match[0]) {
		case 'double 9':
			double = 9;
			break;
		case 'double 8':
			double = 8;
			break;
		case 'double 7':
			double = 7;
		break;
		default:
	}
	console.log('Double value: ' + double);

	for (var i = die_count-1; i >= 0; i--) {
		roll({
			double: double,
		});
	}

	let response = author + strings.roll;

	// add failure line in 'gets consolation'
	// and handle botches, consolation = two momentum (is this different for different games?)
	// dr:e, scion : botch gives 2 extra momentum, for total of 3
	// dr:e, scion has voluntary botches on failur, for 2 momentum
	// scions; faild specialty gives +1 momentum

	for (let i = results.length - 1; i >= 0; i--) {
		let result_print = ''
		if (results[i] >= storypath_tn) {
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

// initiative system
// TC (maybe all?)
// 1. Roll init
// 2. gives ticks
// 3. Storyguide or players choose who goes on a given tick, that uses their focus
// 4. New round, same tickets, but focuses can be different, Dr:e, scion:  doesn't say to re-choose, its set

exports.call = call;
exports.system = systems;
exports.responseBuilder = responseBuilder;