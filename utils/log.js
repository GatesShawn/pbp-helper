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

const fs = require('fs');
const asyncMutex = require('./utils/mutex.js');

const mutex = new asyncMutex.Mutex();

let stream = null;
let fileName = '';
let line_src = '';

function log(message) {

	// hasPermission only seems to exist on Guild Members
	// if(!message.author.hasPermission('MANAGE_MESSAGES')) return;
	
	fileName = message.channel.guild + '_' + message.channel.name + ".txt";
	stream = fs.createWriteStream(fileName, {flags:'a'});

	let msg = message.channel.fetchMessages({ limit: 100, before: message.id })
	.then(messages => write(message, messages));
	
	//TODO: Make sure this fetches ALL the logs (each call is 100 max...)(havent found how to tell there is more to fetch and how to not re-fetch the same ones)

}

function replaceName(member, msg, line) {

	let regex_string = '<@!*'  + member.id + '>';
	let regex = new RegExp(regex_string);

	line = line.replace(regex, member.displayName);

	stream.write(line);
    console.log(line);
}

function write(message, msgs) {

	// arrange the messages by date so oldest is printed first
	msgs = msgs.sort((a, b) => a.createdAt - b.createdAt);

	for (let eachMsg of msgs) {
		
		line_src = eachMsg[1].author.username + ': ' + eachMsg[1].content + '\n';	

		let users = eachMsg[1].mentions.users;
		
		for (let user of users) {
			message.guild.fetchMember(user[1]).then(member => mutex
				.acquire()
				.then(function(release) {
					console.log(member.displayName);
					console.log(line_src);
        			replaceName(member, eachMsg[1], line_src);
    				release();
    			}));
		}
	}

	message.channel.send(message.author + ' here is your log: ', {
  		files: [{
    		attachment: './' + fileName,
    		name: fileName
  		}]
	})
	.then(clean)
 	.catch(console.error);
}

function clean() {

	stream.end();
	removeFile();
}


function removeFile() {
	fs.unlink(fileName, function (err) {
  		if (err) throw err;
	})
}

exports.log = log;
