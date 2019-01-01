var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

const truths = fs.readFileSync('resources/truth.txt').toString().split("\n");
const dares = fs.readFileSync('resources/dare.txt').toString().split("\n");
const truthOrDareRole = '529417184485834753';
const inGameRole = '529439752143765536';

var cooldown = false;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0].toLowerCase();
       
        args = args.splice(1);
        switch(cmd) {
            // !truth
            case 'role':
            	var serverID = evt.d.guild_id;
            	var user = bot.servers[serverID].members[userID];

            	if(user.roles.includes(truthOrDareRole)) {
            		bot.removeFromRole({serverID: serverID, userID: userID, roleID: truthOrDareRole});
            		bot.sendMessage({
            			to: channelID,
            			message: "Role removed"
            		})
            	} else {
            		bot.addToRole({serverID: serverID, userID: userID, roleID: truthOrDareRole});
            		bot.sendMessage({
            			to: channelID,
            			message: "Role added"
            		})
            	}

            break;
            	
            case 'truth':
            if (cooldown == true) {
            	bot.sendMessage({
                    to: channelID,
                    message: "Please wait a few seconds"
                });
            } else {
            	var item=truths[Math.floor(Math.random()*truths.length)]
                bot.sendMessage({
                    to: channelID,
                    message: item
                });
                cooldown = true;
                setTimeout(() => {
                	cooldown = false;
                }, 5000)
            }
            	
            break;
            // !dare
	    	case 'dare':
	    		var item=dares[Math.floor(Math.random()*dares.length)]
				bot.sendMessage({
				    to: channelID,
				    message: item
				});
		    break;	

		    case 'begingame':

		    	users = Object.values(bot.servers[evt.d.guild_id].members)
   				.filter(m => m.roles.includes(truthOrDareRole))
   				.filter(m => m.status == 'online')
   				.map(m => m.id);
   				players = [];
   				console.log(users);
		    	users.forEach(function(value) {
					console.log(value);
			    	bot.sendMessage({
			    		to: channelID,
			    		message: "<@"+value +">"
			    	})
			    	// Add 'ingame' role, remove when ended
			    	players.push(value);
		    });
		    break;

		    // !crash
            case 'crash':
                eof
            break;

         }
     }
});
