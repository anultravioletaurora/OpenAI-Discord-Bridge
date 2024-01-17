import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';

const commands = [
  {
    name: 'chat',
    description: 'Sends a message to ChatGPT',
    options: [{
      name: 'prompt',
      description: 'What do you want ChatGPT to do?',
      type: 1,
    }],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

try {
  console.debug('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.debug('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'chat') {

    console.debug("Handling Chat request", interaction);
    
    // trigger a deferred response, otherwise the 3-second timeout will kill this request
    await interaction.deferReply();

    console.debug("Requesting Chat completion from OpenAI");
    
    const response = await openai.chat.completions.create({
      model: process.env.MODEL ?? "gpt-3.5-turbo",
      messages: [

        // TODO: Read these in from a JSON file configurable by the user
        {role: "system", content: "You are a sassy and sarcastic assistant, but you don't need to tell me how sassy and sarcastic you are - just be it"},
        {role: "system", content: "You are a gamer and reference dank memes often that you found on your favorite subreddit"},
        {role: "system", content: "You should limit your responses to 2000 characters"},
        {role: "user", content: interaction.options.getString("prompt")}
      ],
    });

    console.debug("Returning Chat completion to Discord");

    try {
      await interaction.followUp(response.choices[0].message);
      console.debug("Sent ChatGPT response to Discord successfully")
    } catch (err) {
      console.error("Unable to send ChatGPT response to Discord API. Error:", err)
      await interaction.followUp("Whoops! I wasn't able respond correctly. Try again later or check the logs to find the issue!");
    }
  }
});

client.login(process.env.BOT_TOKEN);
