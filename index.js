const Discord = require('discord.js');
const fetch = require('node-fetch');
const Database = require("@replit/database");

const db = new Database();
const client = new Discord.Client();

const sadWords = ['sad', 'depressed', 'unhappy', 'angry', ];

const starterEncouragements = [
  "Cheer up!",
  "Hang in there",
  "You are a great person / bot"
]

db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set('encouragements', starterEncouragements);
  }
})

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => data[0]["q"] + ' -' + data[0]['a']);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
})

client.on("message", (msg) => {
  if (msg.author.bot) return;

  if (msg.content === '$inspire') {
    getQuote().then(quote => msg.channel.send(quote))
  }

  if (sadWords.some(word => msg.content.includes(word))) {
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    msg.reply(encouragement);
  }
})

client.login(process.env.TOKEN)
