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

// includes
const fs = require('fs');
const Die = require('../../utils/die.js');
const Table = require('./tables.js');
const Util = require('../../utils/utils.js');
const messageBuilder = require('../../utils/message-builder.js');

// load external data
let strings;
// load and parse the string file
try {
    strings = JSON.parse(fs.readFileSync(__dirname + '/resources.json', 'utf8'));
} catch (err) {
    console.log(err);
}

// let config;
// // load and parse the config file
// try {
//     config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
// } catch (err) {
//     console.log(err);
// }

/**
 *
 */
class Character {
    constructor(rolls) {
        this.race = Table.Races[rolls.raceNum].name;
        this.subrace = Table.Races[rolls.raceNum].subraces[Util.checkRange(Table.Races[rolls.raceNum].subraces, rolls.subraceNum)];
        this.culture = Table.Races[rolls.raceNum].cultures[Util.checkRange(Table.Races[rolls.raceNum].cultures, rolls.cultureNum)];
        this.familyLife = Table.FamilyLife[rolls.familyNum];
        this.status = Table.Status[rolls.statusNum];
        this.religion = Table.Religion[rolls.religionNum];
        this.occupation = Table.Occupation[rolls.occupationNum];
        this.event = Table.Event[rolls.eventNum];
        this.associate = Table.Associate[rolls.associateNum];
        this.class = Table.Class[rolls.classNum].name;
        this.background = Table.Class[rolls.classNum].backgrounds[Util.checkRange(Table.Class[rolls.classNum].backgrounds, rolls.backgroundNum)];
        // this.height = race.baseHeight + (Die.die.roll(heightMod) * 2);
        // this.weight = race.baseWeight + * Die.die.roll(weightMod);
    }

    // baseHeight:0,
    // heightMod:0,
    // baseWeight:0,
    // weightMod:0,
}

/**
 * [responseBuilder description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function responseBuilder(message) {

    let rolls = {

        // Table roles
        raceNum: Die.die.roll(20),
        subraceNum: Die.die.roll(20),
        familyNum: Die.die.roll(20),
        cultureNum: Die.die.roll(20),
        statusNum: Die.die.roll(20),
        religionNum: Die.die.roll(20),
        occupationNum: Die.die.roll(20),
        eventNum: Die.die.roll(20),
        associateNum: Die.die.roll(20),
        classNum: Die.die.roll(13),
        backgroundNum: Die.die.roll(20),
    }

    let char = new Character(rolls);
    console.log(char);

    let response = message.author + strings.intro;
    // add race
    response += strings.race_1 + char.race + strings.race_2;
    // add sub race
    response += strings.subrace_1 + char.subrace + strings.subrace_2;

    message.channel.send('', new messageBuilder.message('AVOIAS', response))
        .catch(console.error);

    message.channel.stopTyping(true);
}

let system = new Map();
system.set('AVOIAS','AVOIAS');


exports.call = '/gen';
exports.system = system;
exports.responseBuilder = responseBuilder;