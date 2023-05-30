import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const commands = [
  {
    name: 'chat',
    description: 'Sends a message to GPT',
    options: [{
      name: 'prompt',
      type: 3,
      required: true,
    }],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.patch(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
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
    
    console.log(interaction);
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: "Hello world"},
        {role: "user", content: interaction.options.getString("prompt")}
      ],
    });
    
    console.log(response);
    
    await interaction.reply(response.data.choices[0].message);
  }
});

client.login(process.env.BOT_TOKEN);
