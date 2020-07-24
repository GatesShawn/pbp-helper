// cod-test

// const Discord = require('discord.js');

let test_string = '/cod';

let options = [
'',
' ',
' 8',
' 8 ',
' 8 rote',
' 8 rote ', 
' rote 8',
' rote 8 ',
' 8 no-again',
' 8 no-again ',
' 8 9-again',
' 8 9-again ',
' no-again 8',
' no-again 8 ',
' 9-again 8',
' 9-again 8 ',
' 8 8-again',
' 8 8-again ',
' 8-again 8',
' 8-again 8 ',
' 8 rote no-again',
' 8 rote no-again ',
' 8 rote 9-again',
' 8 rote 9-again ',
' rote no-again 8',
' rote no-again 8 ',
' rote 9-again 8',
' rote 9-again 8 ',
' rote 8 8-again',
' rote 8 8-again ',
' 8-again 8 rote',
' 8-again 8 rote ',
' no-again 8 rote',
' no-again 8 rote ',
' 9-again 8 rote',
' 9-again 8 rote ',
' 8 8-again rote',
' 8 8-again rote ',
' 8-again 8 rote',
' 8-again 8 rote ',
]

// require('./modules/cod-test.js').run(client);

function run(client) {

	for (let i = options.length - 1; i >= 0; i--) {
		test_string += options[i];

		test_target = client.guilds.get("581322881125056513").channels.get("688881427378339873");

		test_target.send(test_string);

		test_string = '/cod';


	}
}

exports.run = run;