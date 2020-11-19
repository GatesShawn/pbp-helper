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
require('./js-extensions.js');

function gmCheck(command, gm) {
	let isGM = false;
    
    console.log('GM Role String: '+ gm);
    console.log('Guild: '+ command.guild);
    console.log('Author: '+ command.author);
    console.log('Roles: '+ command.guild.roles);

	let gmRole = command.guild.roles.find(val => val.name === gm);

    console.log('Found GM Role: ' + gmRole.name);
    gmRole.members.forEach(member => console.log('Role Members: '+ member));

    console.log('Modified author: ' + command.author.toString().slice(2,-1));
    

	if (gmRole) {
	// 	// isGM = gmRole.members.get(command.author.toString().splice(3, '!'));
 //        isGM = gmRole.members.find(val => val.user === command.author.toString().splice(3, '!'));
        let reMap = new Map();
        gmRole.members.forEach(member => reMap.set(member.user.id, member.user.id)); // i dont know why i need to do this or why it works
        reMap.forEach(member => console.log('Members: '+ member));

        isGM = reMap.get(command.author.slice(2,-1));
        // isGM = reMap.get(command.author.toString().splice(2, '!'));
        console.log('Current GM checK: ' + isGM);
        isGM = gmRole.members.get(isGM);
	}

    console.log('isGM?: ' + isGM);
	return isGM;

}

exports.gmCheck = gmCheck;