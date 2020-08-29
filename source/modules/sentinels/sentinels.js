/**
//    Copyright 2020 Shawn Gates
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//
//    @author Shawn Gates
*/

"use strict";

const Die = require('../../utils/die.js');
const fs = require('fs');
const messageBuilder = require('../../utils/message-builder.js');
const help = require('../../utils/help-system.js');

let system = 'Sentinels of the Multiverse';
let gm = 'GameModerator';
let call = '/sen';
let systems = new Map([
            [ 'Sentinels', gm ],
            [system,  gm ],
            ['SotM', gm ]
            ]);

let results = [];
let strings;

// load and parse the string file
try {
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

/**
 * [responseBuilder description]
 * @param  {[type]} receivedMessage [description]
 * @return {[type]}                 [description]
 */
function responseBuilder(receivedMessage) {

    receivedMessage.channel.startTyping();

    //check for help command and rout to that instead
    if(receivedMessage.help) {
        helpBuilder(receivedMessage);
        return;
    }

    let author = receivedMessage.author
    // let re_die = /[0-9]+/g;
    // let re_batch = /b|batch/g;

    let die_match = receivedMessage.dice;

    if (die_match.length === 0) {
        receivedMessage.channel.send('', new messageBuilder.message(system, author + strings.no_dice));
        receivedMessage.channel.stopTyping(true);
        return;
    }

    let batch_match = receivedMessage.options.find(element => element === 'batch' || element === 'b' );
    if (batch_match === undefined) {
        batch_match = false;
    }

    // check for the acceptable types of dice
    for (let i = die_match.length - 1; i >= 0; i--) {
        console.log('Dice: ' + die_match[i]);
        switch(die_match[i]) {
            case 4:
            case 6:
            case 8:
            case 10:
            case 12:
                console.log('Dice after Switch: ' + die_match[i]);
                roll({type: die_match[i]});
                break;
            default:
                receivedMessage.channel.send('', new messageBuilder.message(system, author + strings.wrong_dice));
                receivedMessage.channel.stopTyping(true);
        return;
        }
    }
    let response = author + strings.roll;
    if(batch_match) {
        console.log('Batch mode');
        for (var i = results.length - 1; i >= 0; i--) {
            response += ' **' + results[i].result + '**' + "(d" + results[i].type + ") ";
        }
    } else {
        if (results.length > 2) {
            results.sort(function compareNumbers(a, b) {
                 return b.result - a.result;
            });
            response += strings.value.max + '**' + results[0].result  + '**'  + "(d" + results[0].type + ") "+ strings.value.mid  + '**' + results[1].result  + '**'  + "(d" + results[1].type + ") " + strings.value.min  + '**' + results[2].result + '**'  + "(d" + results[2].type + ")";
        } else {
            response += '**' + results[0].result + '**' + "(d" + results[0].type + ")";
        }
    }
    console.log('Success response to server: ' + response);
    receivedMessage.channel.send('', new messageBuilder.message(system, response));

    receivedMessage.channel.stopTyping(true);
    results = [];
}

/**
 * Callback for help calls
 * @param {Message} message
 */
function helpBuilder(message) {
    let response = strings.help;
    // add automatic listing of supported game systems
    message.channel.send('', new messageBuilder.message(system, response))
        .catch(console.error);
        message.channel.stopTyping(true);
}

exports.call = call;
exports.system = systems;
exports.responseBuilder = responseBuilder;

// sentinels init is a nomination system, maybe a tracker that just ticks off who has gone and then resets once all do