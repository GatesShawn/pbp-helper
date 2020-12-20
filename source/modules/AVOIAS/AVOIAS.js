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
        this.height = determineHeight(Table.Races[rolls.raceNum].baseHeight, Table.Races[rolls.raceNum].heightMod);
        this.weight = determineWeight(Table.Races[rolls.raceNum].baseWeight, Table.Races[rolls.raceNum].weightMod);
    }


}

let heightResult = 0; // this needs to reset after use

/**
 * [determineHeight description]
 * @param  {[type]} baseHeight [description]
 * @param  {[type]} heightMod  [description]
 * @return {[type]}            [description]
 */
function determineHeight(baseHeight, heightMod) {
    let height = baseHeight;

    // need to handle forged and genasi having different values for subraces

    while (heightMod[0]) {
        heightResult += Die.die.roll(heightMod[1]);
        heightMod[0]--;
    }

    height += heightResult;

    return (height/12).toFixed(0) + '\'' + height % 12 + '\"';
}

/**
 * [determineHeight description]
 * @param  {[type]} baseHeight [description]
 * @param  {[type]} heightMod  [description]
 * @return {[type]}            [description]
 */
function determineWeight(baseWeight, weightMod) {
    let weight = baseWeight;
    let weightTemp = 0;
    // need to handle Halfling not rolling for weight mod
    // need to handle forged and genasi having different values for subraces

    while (weightMod[0]) {
        weightTemp += Die.die.roll(weightMod[1]);
        weightMod[0]--;
    }

    weight += heightResult * (weightTemp);
    heightResult = 0;
    return weight + ' lbs.';
}

/**
 * [rollAbilityScores description]
 * @param {Object} race The race of the character
 * @param {Object} race The subrace of the character
 * @return {[type]} [description]
 */
function rollAbilityScores(race, subrace) {

    let scores = {
        "Strength": Die.die.roll(10) + 3,
        "Dexterity": Die.die.roll(10) + 3,
        "Constitution": Die.die.roll(10) + 3,
        "Intelligence": Die.die.roll(10) + 3,
        "Wisdom": Die.die.roll(10) + 3,
        "Charisma": Die.die.roll(10) + 3
    }

    switch (race) {
        case 'Deva':
            if (scores.Wisdom < 10) {scores.Wisdom = 10};
            if (scores.Intelligence < 8) {scores.Intelligence = 8};
            if (scores.Charisma < 8) {scores.Charisma = 8};
            break;
        case 'Dragonborn':
            if (scores.Strength < 10) {scores.Strength = 10};
            if (scores.Constitution < 8) {scores.Constitution = 8};
            if (scores.Charisma < 8) {scores.Charisma = 8};
            break;
        case 'Dwarf':
            if (scores.Constitution < 12) {scores.Constitution = 12};
            if (scores.Wisdom < 8) {scores.Wisdom = 8};
            break;
        case  'Elf':
            if (scores.Dexterity < 10) {scores.Dexterity = 10};
            if (scores.Intelligence < 10) {scores.Intelligence = 10};
            break;
        case 'Forged':
            if (scores.Constitution < 10) {scores.Constitution = 10};
            if (scores.Intelligence < 8) {scores.Intelligence = 8};
            if (scores.Strength < 8) {scores.Strength = 8};
            break;
        case  'Genasi':
            if (scores.Constitution < 8) {scores.Constitution = 8};
            switch(subrace) {
                case 'Air':
                    if (scores.Dexterity < 12) {scores.Dexterity = 12};
                    break;
                case 'Earth':
                    if (scores.Strength < 12) {scores.Strength = 12};
                    break;
                case 'Fire':
                    if (scores.Charisma < 12) {scores.Charisma = 12};
                    break;
                case 'Water':
                    if (scores.Wisdom < 12) {scores.Wisdom = 12};
                    break;
            }
            break;
        case 'Goliath':
            if (scores.Strength < 12) {scores.Strength = 12};
            if (scores.Constitution < 8) {scores.Constitution = 8};
            break;
        case 'Halfling':
            if (scores.Dexterity < 12) {scores.Dexterity = 12};
            if (scores.Charisma < 8) {scores.Charisma = 8};
            break;
        case 'Kith':
            if (scores.Wisdom < 10) {scores.Wisdom = 10};
            if (scores.Charisma < 10) {scores.Charisma = 10};
            break;
        case 'Shade':
            if (scores.Intelligence < 10) {scores.Intelligence = 10};
            if (scores.Wisdom < 8) {scores.Wisdom = 8};
            if (scores.Intelligence < 8) {scores.Intelligence = 8};
            break;
        case  'Tabaxi':
            if (scores.Strength < 8) {scores.Strength = 8};
            if (scores.Dexterity < 8) {scores.Dexterity = 8};
            if (scores.Constitution < 8) {scores.Constitution = 8};
            if (scores.Wisdom < 8) {scores.Wisdom = 8};
            break;
        case  'Tiefling':
            if (scores.Charisma < 10) {scores.Charisma = 10};
            if (scores.Intelligence < 8) {scores.Intelligence = 8};
            if (scores.Constitution < 8) {scores.Constitution = 8};
            break;
        default:
            break;
    }

    return scores
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

    let abilities = rollAbilityScores(char.race, char.subrace);

    let response = message.author + strings.intro;

    // response is built in pieces to account for future modularity. i.e. not everyone will want random class

    // add race
    response += strings.race_1 + char.race + strings.race_2;
    // add sub race
    response += strings.subrace_1 + char.subrace + strings.subrace_2;

    //
    response += strings.startingAbilityScores_1;

    for (let score in abilities) {
        response += score + ': ' + abilities[score] + ', ';
    }

    response += strings.startingAbilityScores_2;

    // add sub race
    response += strings.familyLife_1 + char.familyLife + strings.familyLife_2;
    // add sub race
    response += strings.culture_1 + char.culture + strings.culture_2;
    // add sub race
    response += strings.status_1 + char.status + strings.status_2;
    // add sub race
    response += strings.religion_1 + char.religion + strings.religion_2;
        // add sub race
    response += strings.occupation_1 + char.occupation + strings.occupation_2;
        // add sub race
    response += strings.event_1 + char.event + strings.event_2;
        // add sub race
    response += strings.associate_1 + char.associate + strings.associate_2;
        // add sub race
    response += strings.class_1 + char.class + strings.class_2;
        // add sub race
    response += strings.background_1 + char.background + strings.background_2;

    response += strings.height_1 + char.height + strings.height_2;

    response += strings.weight_1 + char.weight + strings.weight_2;

    message.channel.send('', new messageBuilder.message('AVOIAS', response))
        .catch(console.error);

    message.channel.stopTyping(true);
}

let system = new Map();
system.set('AVOIAS','AVOIAS');


exports.call = '/gen';
exports.system = system;
exports.responseBuilder = responseBuilder;