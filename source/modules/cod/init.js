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

    let clearCheck = receivedMessage.options.find(element => element === 'clear');
    if(clearCheck !== undefined) {
        clear();
        return;
    }

    message.channel.fetchPinnedMessages(true)
        .then(messages => currentInitCheck(messages))
        .catch(console.error);
}

/**
 * [currentInitCheck description]
 * @param  {[type]} messages [description]
 * @return {[type]}          [description]
 */
function currentInitCheck(messages) {
    console.log('Current Init ID: ' + init_current);

    currentPin = messages.find(val => val.id === init_current);
    console.log('Current ID checK: ' + currentPin);
        
    if (currentPin && !authorCheck()) {
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

        setInit();

    } else {
        setInit();
    }
}

/**
 * [setInit description]
 */
function setInit() {

    result = getResult();

    if (isStoryteller) {
        initList.set(author + '(NPC 1)', initList.get(author).splice(author.indexOf(':')-2, '(NPC 1)'));
        //TDOD: add a check for duplicate storyteller inits, should enumarate automatically
        // update them as needed, iterating the number
    } else {
        // handle the player case
        // Allow Multiple for familiars/retainers/etc.? maybe with a passed flag
        message.channel.send('', new messageBuilder.message(system, author + strings.init.result_1 + result + strings.init.result_2));
        initList.set(author, author + ': ' + result);
    }
    //  currentPin.delete();
    //     } else {
    //         receivedMessage.channel.send(author + ", you got a " + result + " on initiative.");
    //         // start a new table
    //         initList.set(author, author + ': ' + result);
    //     }

    //     if (clear) {
    //         if(isStoryteller) {
    //             receivedMessage.channel.send(receivedMessage.author.toString() + ', Initiative order cleared.')
    //                 .catch(console.error);
    //         } else {
    //             receivedMessage.channel.send(receivedMessage.author.toString() + ', sorry, only the ' + GM + ' can do that.')
    //                 .catch(console.error);
    //         }
    //         return;
    //     }

    //     console.log('Cleaning up header line if needed: ' + initList.delete(">>> Current Initiatives"));

    //     receivedMessage.channel.send(buildTable())
    //         .then(message => pin(message))
    //         .catch(console.error);
    //         
    cleanup();
}

/**
 * [authorCheck description]
 * @return {[type]} [description]
 */
function authorCheck() {
    let re_author = new RegExp(author, 'g');
    let author_match = currentPin.content.match(re_author);

    console.log('author_match: '+ author_match);

    if(author_match && !isStoryteller) {
        message.channel.send('', new messageBuilder.message(system, author + ", I'm sorry, you have already rolled for initiative."))
            .catch(console.error);

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

}

/**
 * [pin description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function pin(message) {
    init_current = message.id;
    console.log('Pinned message ID: ' + init_current);
    message.pin();
    // delete initList;
}

function cleanup() {
    result = 0;
}

exports.manageInit = manageInit;

// debug only: Clears the pinned list for when it has filled with half successful test posts
    // messages.forEach(ms => ms.delete());
