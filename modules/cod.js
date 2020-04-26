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

const Die = require('../utils/die.js');
const utils = require('../utils/utils.js');
require('../utils/js-extensions.js');

let cod_die = 10;
let cod_tn = 8;
let cod_ES = 5;
let GM = 'Storyteller'

let results = [];
let results_explosion = [];
let success = [];
let results_reroll = [];

let init_current = 0;

/**
 * Calls die rolling for Chronicles of Darkness
 * @param  Object options Parameter object
 * @param Boolean options.chance_die Sets whether the roll being made is a chance die
 * @param Number options.again Value to use for rolling again
 * @param Number options.explosion Flag if the current roll is a re-roll from an exploding die
 * @param Number options.rote Flag thats shows whether a roll shoudld be rote
 * @return {[type]}         [description]
 */
function roll(options) {
	if (!options) {
		console.log('Options is required!');
		return;
	}

	let result = Die.die.roll(cod_die);
	console.log('Roll Result: ' + result);
	if(!options.explosion) {
		results.push(result);
	} else {
		results_explosion.push(result);
	}
	if(result >= cod_tn) {success.push(result);}

	if(result < cod_tn && options.rote && !options.chance_die) {
		console.log('Rerolling failures once with Rote.');
		roll({
			again: options.again,
		});	
	}

	if(result >= options.again && !options.chance_die) {
		console.log('Roll was ' + result + ', which meets or beats the "again" threshold of ' + options.again);
		roll({
			explosion: true,
			again: options.again,
			rote: options.rote
		});		
	}

}

/**
 * [responseBuilder description]
 * @param  {Object} receivedMessage [description]
 * @return {[type]}                 [description]
 */
function responseBuilder(receivedMessage) {
	let rote = false;
	let chance_die = false;
	let again = 10;
	let re_die = /[0-9]+(\s|$)/;
	let re_again = /8-again|9-again|no-again/;
	let re_rote = /rote/;
	let re_init = /\sinit(\s|$)/;
	let re_init_clear = /\sinit\sclear(\s|$)/;

	let author = receivedMessage.author.toString();

	let init_clear = receivedMessage.content.match(re_init_clear);

	if(init_clear !== null) {
		manageInit(receivedMessage, true);
		return;
	}

	let die_match = receivedMessage.content.match(re_die);

	// if an init call capture the results and re-direct
	let init = receivedMessage.content.match(re_init);

	if (init !== null) {

		let result = Die.die.roll(10);
		console.log('Result: ' + result);
		if (die_match === null) {
			die_match = [0];
		}
		console.log('Init Bonus: ' + parseInt(die_match[0]));
		result += parseInt(die_match[0]);
		console.log('Init response: ' + result);

		manageInit(receivedMessage, false, result);

		return;
	}

	
	if (die_match === null) {
		receivedMessage.channel.send(author + ", you didn't specify a number of dice to roll. Please try again.");
		return;
	}
	console.log('Number of dice to be rolled: ' + die_match);
	let again_match = receivedMessage.content.match(re_again);
	if (again_match === null) {again_match = '';}
	console.log("again_match: " + again_match);
	let rote_match = receivedMessage.content.match(re_rote);
	if (rote_match === null) {rote_match = '';}
	console.log("rote_match: " + rote_match);
	rote = rote_match[0] ? true : false;
	console.log("rote: " + rote);
	
	switch (again_match[0]) {
		case '9-again':
			again = 9;
			break;
		case '8-again':
			again = 8;
			break;
		case 'no-again':
			again = 11;
			break;
		default:
	}
	console.log('Again type: ' + again);

	// Reject die pools over 100, large die pools cause server slow down and 100 is plenty of buffer space
	if (die_match > 100) {
		receivedMessage.channel.send(author + ', your roll was rejected because it was too large. Please roll again with a smaller dice pool.')
			.catch(console.error);
		return;
	}
	let die_count = die_match[0];

	if(die_count == 0) {
		die_count = 1;
		chance_die = true;
	}

	for (var i = die_count-1; i >= 0; i--) {
		roll({
			chance_die: chance_die,
			again: again,
			rote:rote,
		});
	}

	let response = author + ', you rolled: '

	for (let i = results.length-1; i >= 0; i--) {
		let result_print = '';
		if (results[i] >= cod_tn) {
			if (chance_die) {
				if (results[i] != 10) {
					result_print = results[i];
				} else {
					result_print = '**' + results[i] + '**';
				}
			} else {
				result_print = '**' + results[i] + '**';
			}
		} else {
			result_print = results[i];
		}
		//add a comma between results
		if(i > 0) { 
			response += result_print + ', ';
		} else if(i === 0 && results_explosion.length != 0) {
			response += result_print + ', ';
		} else {
			response += result_print;
		}
	}
	for (let i = results_explosion.length-1; i >= 0; i--) {
		let result_print = '';
		if (results_explosion[i] >= cod_tn) {
			if (chance_die) {
				if (results_explosion[i] != 10) {
					result_print = results_explosion[i];
				} else {
					result_print = '**' + results_explosion[i] + '**';
				}
			} else {
				result_print = '**' + results_explosion[i] + '**';
			}
		} else {
			result_print = results_explosion[i];
		}
		//add a comma between results
		if(i > 0) { 
			response += result_print + ', ';
		} else {
			response += result_print;
		}
	}
	console.log('Success response to server: ' + response);
	receivedMessage.channel.send(response)
		.catch(console.error);

	let success_response = '';

	if (chance_die) {
		if(success[0] == 10) {
			success_response = "Success! You rolled a 10 on a chance die!";
		} else if(success[0] == 1) {
			success_response = "You got a Dramatic Failure!";
		} else {
			success_response = "You didn't roll a success. That's a Failure. Would you like to make it a Dramatic Failure for a Beat?";
		}
	} else {
		// success counting
		if(success.length == 0) {
			// failure
			success_response = "You rolled no successes. That's a Failure. Would you like to make it a Dramatic Failure for a Beat?";
		} else if (success.length >= cod_ES) {
			//exceptional success
			success_response = "You rolled " + success.length + " successes. That's an Exceptional Success!";
		} else {
			//regular success
			success_response = "You rolled " + success.length + " successes.";
		}
	}
	console.log('Results response to server: ' + success_response);
	receivedMessage.channel.send(success_response)
		.catch(console.error);

	results = [];
	success = [];
	results_explosion = [];
}

function manageInit(receivedMessage, clear, result) {
	let author = receivedMessage.author.toString();
	let isStoryteller = utils.gmCheck(receivedMessage, GM);
	let initList = new Map();

	receivedMessage.channel.fetchPinnedMessages(true)
  		.then(messages => currentInitCheck(messages))
  		.catch(console.error);

  	function currentInitCheck(messages) {

// debug only: Clears the pinned list for when it has filled with half successful test posts
 // messages.forEach(ms => ms.delete());

  		console.log('Current Init ID: ' + init_current);

  		let currentPin = messages.find(val => val.id === init_current);
  		console.log('Current ID checK: ' + currentPin);
  		if (currentPin) {

  			let  initArray = currentPin.content.split('\n');


  			// can just pass the array into the map constructor?

  			for (var i = initArray.length - 1; i >= 0; i--) {

  				console.log('Init Array i: ' + initArray[i]);

  				initList.set(initArray[i].split(':')[0], initArray[i]);
  			}

  			console.log('Sanitized list: ' + initList);

			initList.forEach((value, key) => {
				console.log('Inits: '+ key + " -- " + value);
			});

  			let re_author = new RegExp(receivedMessage.author.toString(), 'g');
  			let author_match = currentPin.content.match(re_author);

  			console.log('author_match: '+ author_match);
  			if(author_match) {
  				console.log("isStoryteller?: " + isStoryteller);

  				receivedMessage.channel.send(receivedMessage.author.toString() + ", I'm sorry, you have already rolled for initiative.")
					.catch(console.error);

  				if (isStoryteller) {
  					//initList.set(author + '(NPC 1)', initList.get(author).splice(author.indexOf(':')-2, '(NPC 1)'));
  					//TDOD: add a check for duplicate storyteller inits, should enumarate automatically
  					// update them as needed, iterating the number
  				

  				} else {
  					//handle the player case
  					//TODO: if player and already inited, replace? or reject? Multiple for familars/retainers/ etc
  				}
  			} else {
  				// new addition
  				receivedMessage.channel.send(author + ", you got a " + result + " on initiative.");
  				initList.set(author, author + ': ' + result);
  			}
  			currentPin.delete();
  		} else {
  			receivedMessage.channel.send(author + ", you got a " + result + " on initiative.");
  			// start a new table
  			initList.set(author, author + ': ' + result);
  		}

  		if (clear) {
  			if(isStoryteller) {
  				receivedMessage.channel.send(receivedMessage.author.toString() + ', Initiative order cleared.')
					.catch(console.error);
			} else {
				receivedMessage.channel.send(receivedMessage.author.toString() + ', sorry, only the ' + GM + ' can do that.')
					.catch(console.error);
			}
			return;
  		}

	  	

	  	console.log('Cleaning up header line if needed: ' + initList.delete(">>> Current Initiatives"));

	  	let initTable = [">>> Current Initiatives"];

	  	initList.forEach(value => initTable.push(value));

	  	if (initTable.length > 0) {
		  	initTable.sort(function (a, b) {
		  		let aValue = parseInt(a.split(': ')[1]);
		  		let bValue = parseInt(b.split(': ')[1]);

		  		if(aValue < bValue) {
		  			return 1;
		  		} else if (aValue > bValue) {
		  			return -1;
		  		} else {
		  			return 0;
		  		}
		  	});
	  	}

	  	initTable = initTable.join('\n');

		console.log("final init table: " + initTable);

		receivedMessage.channel.send(initTable)
			.then(message => pin(message))
			.catch(console.error);
  	}

	function pin(message) {
		init_current = message.id;
		console.log('Pinned message ID: ' + init_current);
		message.pin();
		delete initList;
	}
}

exports.call = '/cod';
exports.responseBuilder = responseBuilder;