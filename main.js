const Discord = require('discord.js');
const secret_token = require('./secret_token.js');

const client = new Discord.Client();

let die = {
  sides: 6,
  roll: function (sides) {
  	
  	if(sides) this.sides = sides;

    var randomNumber = Math.floor(Math.random() * this.sides) + 1;
    
    return randomNumber;
  }
}

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    // List servers the bot is connected to
    console.log("Servers:");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });

});

let results = [];
let success = [];

/**
 * Calls die rolling for Chronicles of Darkness
 * @param  Object options Parameter object
 * @param Boolean options.chance_die Sets whether the roll being made is a chance die
 * @param Number options.again value to use for rolling again
 * @return {[type]}         [description]
 */
function cod(options) {
	if (!options) {
		console.log('Options is required!');
		return;
	}

	let result = die.roll(10);
	console.log(result);
	results.push(result);
	if(result >= 8)	success.push(result);
	console.log(results);
	console.log(success);

	if(result == options.again && !options.chance_die) {
		cod({});		
	}

}	

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }
    // if (receivedMessage.guild != 'pbp-helper-test') {
    //     return;
    // }

	let cmd = receivedMessage.content.slice(0, 5);

	console.log(cmd);

	if (cmd == '/cod ') {
		let chance_die = false;
		let again = 10;
		let re_die = /[0-9]+/;
		let re_again = /8|9-again/;
		let die_match = receivedMessage.content.match(re_die);
		console.log(die_match);

		// Reject die pools over 100, large die pools cause server slow down and 100 is plenty of buffer space
		if (die_match > 100) {
			receivedMessage.channel.send(receivedMessage.author.toString() + ', your roll was rejected because it was too large. Please roll again with a smaller dice pool.');
			return;
		}
		let die_count = die_match[0];

		if(die_count == 0) {
			die_count = 1;
			chance_die = true;
		}

		for (var i = die_count-1; i >= 0; i--) {
			cod({
				chance_die: chance_die,
				again: again,
			});
		}

		let response = receivedMessage.author.toString() + ', you rolled: '

		for (var i = results.length - 1; i >= 0; i--) {
				let result_print = ''
				if (results[i] >= 8) {
					if (chance_die) {
						if (results[i] != 10) {
							result_print = results[i];
						} else {
							result_print = '**' + results[i] + '**';
						}
					} else {
						result_print = '**' + results[i] + '**';
					}
				} else {
					result_print = results[i];
				}
				//add a comma between results
				if(i > 0) { 
					response += result_print + ', ';
				} else {
					response += result_print;
				}
		}
		console.log(response);
		receivedMessage.channel.send(response);

		let success_response = '';

		if (chance_die) {
			if(success[0] == 10) {
				success_response = "Success! You rolled a 10 on a chance die!";
			} else if(success[0] == 1) {
				success_response = "You got a Dramatic Failure!";
			} else {
				success_response = "You didn't roll a success. That's a Failure. Would you like to make it a Dramatic Failure for a Beat?";
			}

		} else {

			// success counting
			if(success.length == 0) {
				// failure
				success_response = "You rolled no successes. That's a Failure. Would you like to make it a Dramatic Failure for a Beat?";
			} else if (success.length >= 5) {
				//exceptional success
				success_response = "You rolled " + success.length + " successes. That's an Exceptional Success!";
			} else {
				//regular success
				success_response = "You rolled " + success.length + " successes.";
			}

		}

		console.log(success_response);
		receivedMessage.channel.send(success_response);

		results = [];
		success = [];
	}
});

let bot_secret_token = secret_token.bot_secret_token;
client.login(bot_secret_token);
