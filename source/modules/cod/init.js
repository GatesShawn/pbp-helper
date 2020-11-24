/*  
//  Copyright 2020 Shawn Gates
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
const Discord = require('discord.js');
const fs = require('fs');
const Die = require('../../utils/die.js');
const utils = require('../../utils/utils.js');
const messageBuilder = require('../../utils/message-builder.js');

let GM = 'Storyteller';
let system = 'Chronicles of Darkness';
let initList = new Map();
let init_current = Discord.snowflake;
let isStoryteller = false;
let message;
let result = 0;
let currentPin;
let author;
let strings;

// load and parse the string file
try{
    strings = JSON.parse(fs.readFileSync(__dirname + '/resources.json', 'utf8'));
} catch (err) {
    console.log(err);
}

/**
 * [manageInit description]
 * @param  {[type]} receivedMessage [description]
 * @param  {[type]} clear           [description]
 * @param  {[type]} result          [description]
 * @return {[type]}                 [description]
 */
function manageInit(receivedMessage, bonus) {
    message = receivedMessage;
    author = message.author;
    isStoryteller = utils.gmCheck(receivedMessage, GM);
    if (typeof bonus === 'Number') {
        result += bonus;
    }

    // if the command includes clear, call the clear() function and exit
    let clearCheck = receivedMessage.options.find(element => element === 'clear');
    if(clearCheck !== undefined) {
        clear();
        return;
    }

    // fetch the current pin list
    message.channel.fetchPinnedMessages(true)
        .then(messages => currentInitCheck(messages))
        .catch(console.error);
}

/**
 * Looks at the current pins to see if one of them is a list of inits already
 * @param  {[type]} messages [description]
 * @return {[type]}          [description]
 */
function currentInitCheck(messages) {
    console.log('Current Init ID: ' + init_current);
    // i don't know why i need to do this or why it works
    let reMap = new Map();
    messages.forEach(msg => reMap.set(msg.id, msg.id)); 
    currentPin = reMap.get(init_current);

    console.log('Current ID checK: ' + currentPin);
    currentPin = messages.get(currentPin);
        
    // if a current pin has the id of the 
    if (currentPin != undefined) {
        console.log("does this get called?");
        if (!authorCheck()) {
            let  initArray = currentPin.embeds.description.split('\n');
                
            // can just pass the array into the map constructor?
            for (var i = initArray.length - 1; i >= 0; i--) {
                console.log('Init Array i: ' + initArray[i]);
                initList.set(initArray[i].split(':')[0], initArray[i]);
            }

            console.log('Sanitized list: ' + initList);

            initList.forEach((value, key) => {
                console.log('Inits: '+ key + " -- " + value);
            });

            setInit(true);
        }

    } else {
        setInit(false);
    }
}

/**
 * [setInit description]
 * @param {boolean} repeat whether this call to setInit has been done by the same Author or not
 */
function setInit(repeat) {

    result = getResult();

    if (isStoryteller) {
        console.log('Handling the Storyteller multi case');
        if(repeat){
            initList.set(author + '(NPC 1)', initList.get(author).splice(author.indexOf(':')-2, '(NPC 1)'));
            //TDOD: add a check for duplicate storyteller inits, should enumarate automatically
            // update them as needed, iterating the number
        } else {
            initList.set(author + '(NPC 1)', '(NPC 1)');
        }
    } else {
        // handle the player case
        // Allow Multiple for familiars/retainers/etc.? maybe with a passed flag
        message.channel.send('', new messageBuilder.message(system, author + strings.init.result_1 + result + strings.init.result_2));
        initList.set(author, author + ': ' + result);
    }

    //console.log('Cleaning up header line if needed: ' + initList.delete(">>> Current Initiatives"));

    message.channel.send('', new messageBuilder.message(system, buildTable()))
        .then(message => pin(message))
        .catch(console.error);

    cleanup();
}

/**
 * [authorCheck description]
 * @return {[type]} [description]
 */
function authorCheck() {
    let re_author = new RegExp(author, 'g');
    console.log("Current Pin: " + currentPin.embeds[0].description);
    let author_match = currentPin.embeds[0].description.match(re_author);

    console.log('author_match: '+ author_match);

    if(author_match) {
        if(!isStoryteller) {
            message.channel.send('', new messageBuilder.message(system, author + ", I'm sorry, you have already rolled for initiative."))
                .catch(console.error);
        }
        return true;
    } else {
        return false;
    }
}

/**
 * [buildTable description]
 * @return {[type]} [description]
 */
function buildTable() {

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
    return initTable;
}


/**
 * [getResult description]
 * @return {[type]} [description]
 */
function getResult() {

    result += Die.die.roll(10);
    console.log('Init Result: ' + result);

    return result;
}


/**
 * [clear description]
 * @return {[type]} [description]
 */
function clear() {
    if(isStoryteller) {
        receivedMessage.channel.send('', new messageBuilder.message(system, author + ', Initiative order cleared.'))
            .catch(console.error);
    } else {
        receivedMessage.channel.send('', new messageBuilder.message(system, author + ', sorry, only the ' + GM + ' can do that.'))
            .catch(console.error);
    }
}

/**
 * [pin description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function pin(message) {
    if(currentPin) {
        currentPin.delete();
    }
    init_current = message.id;
    console.log('Pinned message ID: ' + init_current);
    message.pin();
    // delete initList;
}

function cleanup() {
    message.channel.stopTyping();
    result = 0;
}

exports.manageInit = manageInit;

// debug only: Clears the pinned list for when it has filled with half successful test posts
    // messages.forEach(ms => ms.delete());
