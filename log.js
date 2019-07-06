const fs = require('fs');

let stream = null;
let fileName = '';

function log(message) {

	// hasPermission only seems to exist on Guild Members
	// if(!message.author.hasPermission('MANAGE_MESSAGES')) return;
	
	fileName = message.channel.guild + '_' + message.channel.name + ".txt";
	stream = fs.createWriteStream(fileName, {flags:'a'});

	let msg = message.channel.fetchMessages({ limit: 100, before: message.id }).then(messages => write(message, messages));
	
	//TODO: MAke sure this fetches ALL the logs (each call is 100 max...)(havent found how to tell there is more to fetch and how to not re-fetch the same ones)

}

function write(message, msgs) {

	// arrange the messages by date so oldest is printed first
	msgs = msgs.sort((a, b) => a.createdAt - b.createdAt);

	for (let eachMsg of msgs) {
		
		//TODO: subistitute snowflakes for names in each line

		let line = eachMsg[1].author.username + ': ' + eachMsg[1].content + '\n';	
		
		stream.write(line);

	}

	stream.end();

	message.channel.send(message.author + ' here is your log: ', {
  		files: [{
    		attachment: './' + fileName,
    		name: fileName
  		}]
	})
	.then(removeFile)
 	.catch(console.error);
}


function removeFile() {
	fs.unlink(fileName, function (err) {
  		if (err) throw err;
	})
}

exports.log = log;
