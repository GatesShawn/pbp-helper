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

/**
 * [gmCheck description]
 * @param  {[type]} command [description]
 * @param  {[type]} gm      [description]
 * @return {[type]}         [description]
 */
function gmCheck(command, gm) {
	let isGM = false;
	let gmRole = command.guild.roles.find(val => val.name === gm );

	if (gmRole) {
		isGM = gmRole.members.find(val => val.user === command.author);
	}
	return isGM;

}

/**
 * Returns which range with an a object  of ranges
 * @param  {Object} ranges [description]
 * @param  {Number} value [description]
 * @return {String}        [description]
 */
function checkRange(ranges, value) {

    // range should be an object with ranges
    if (typeof ranges !== 'object') {
        console.log("checkRange requires an object parameter.");
        return;
    }
    // value should be a number
    if (typeof value !== 'number') {
        console.log("checkRange requires a number parameter.");
        return;
    }

    let rangeStart_ex = '[0-9]+\-';
    let rangeEnd_ex = '\-[0-9]+';

    for (const property in ranges) {

        if (property.match(rangeStart_ex)[0].slice(0, -1) <= value && value <= property.match(rangeEnd_ex)[0].slice(1)) {

            //return range identifier
            return property;
        }
    }
}

exports.gmCheck = gmCheck;
exports.checkRange = checkRange;