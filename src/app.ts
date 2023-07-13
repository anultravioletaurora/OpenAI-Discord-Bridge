import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const commands = [
  {
    name: 'chat',
    description: 'Sends a message to ChatGPT',
    options: [{
      name: 'prompt',
      description: 'What do you want ChatGPT to do?',
      type: 1,
      required: true,
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

    console.debug("Handling Chat request");
    
    // trigger a deferred response, otherwise the 3-second timeout will kill this request
    await interaction.deferReply();

    console.debug("Requesting Chat completion from OpenAI");
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a sassy and sarcastic assistant, but you don't need to tell me how sassy and sarcastic you are - just be it"},
        {role: "system", content: "You are a gamer and reference dank memes often that you found on your favorite subreddit"},
        {role: "system", content: "Limit responses to 2000 characters"},
        {role: "user", content: interaction.options.getString("prompt")}
      ],
    });

    console.debug("Returning Chat completion to Discord");

    try {
      await interaction.followUp(response.data.choices[0].message);
      console.debug("Sent ChatGPT response to Discord successfully")
    } catch (err) {
      console.error("Unable to send ChatGPT response to Discord API. Error:", err)
    }
  }
});

client.login(process.env.BOT_TOKEN);
