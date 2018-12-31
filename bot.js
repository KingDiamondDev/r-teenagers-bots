var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

const truths = fs.readFileSync('resources/truth.txt').toString().split("\n");
const dares = fs.readFileSync('resources/dare.txt').toString().split("\n");
const truthOrDareRole = '529417184485834753';
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

            	/*
            	if (user.roles.includes(truthOrDareRole)) {
            		bot.sendMessage({
            			to: channelID,
            			message: "YES"
            		})
            	} else {
            		bot.sendMessage({
            			to: channelID,
            			message: "NO"
            		})
            	} 
            */
            break;
            	
            case 'truth':
            	var item=truths[Math.floor(Math.random()*truths.length)]
                bot.sendMessage({
                    to: channelID,
                    message: item
                });
            break;
            // !dare
	    	case 'dare':
	    		var item=dares[Math.floor(Math.random()*dares.length)]
				bot.sendMessage({
				    to: channelID,
				    message: item
				});
		    break;	
         }
     }
});
