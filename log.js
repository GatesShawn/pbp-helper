const fs = require('fs');

function log(message) {

	// hasPermission only seems to exist on Guild Members
	// if(!message.author.hasPermission('MANAGE_MESSAGES')) return;

	let msg = message.channel.fetchMessages({ limit: 100 }).then(messages => write(message, messages));

	//TODO: MAke sure this fetches ALL the logs (each call is 100 max...)(havent found how to tell there is more to fetch and how to not re-fetch the same ones)
}

function write(message, msgs) {

	for (let eachMsg of msgs) {

		msgArray = eachMsg.toString().match(/[0-9]*,(.*)/);
		let msg = msgArray[1] + '\n';
		
		//change snowflake to user name
		let members = message.channel.members;

		for ( let member of members) {
			console.log('snowflake: ' + member[0] + ', member: ' + member[1]);
		}
		
		fs.appendFile('log.txt', msg , function (err) {
			if (err) throw err;
		});
	}

	message.channel.send(message.author.toString() + ' here is your log: ', {
  		files: [{
    		attachment: './log.txt',
    		name: 'log.txt'
  		}]
	})
	// .then(removeFile)
 	.catch(console.error);
}


function removeFile() {
	fs.unlink('log.txt', function (err) {
  		if (err) throw err;
	})
}

exports.log = log;
