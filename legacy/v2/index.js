require('module-alias/register')

const Commando = require('discord.js-commando');
const path = require('path')
const config = require('@root/config.json')
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const MongoDBProvider = require('commando-provider-mongo').MongoDBProvider;
const client = new Commando.CommandoClient({
  owner: '127254878190829568',
  commandPrefix: config.prefix,
});
const mongo = require('@root/mongo.js')
const mongoose = require("mongoose");

client.setProvider(
  MongoClient.connect(config.mongoPath)
    .then((client) => {
      return new MongoDBProvider(client, 'TempoBot')
    })
    .catch((err) => {
      console.error(err)
    })
)
/*
  //Connect to mongoose database
  mongoose.connect(config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    //If it connects log the following
    client.logger.log("Connected to the Mongodb database.", "log");
  }).catch((err) => {
    //If it doesn't connect log the following
    client.logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
  });
*/
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['relay', 'Relay Commands'],
    ['moderation', 'Moderation Commands'],
    ['misc', 'Miscellaneous Commands'],
    ['util', 'Custom Utility Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity('Ok\' Zundu');
});

client.on('error', console.error);

client.login(config.token)