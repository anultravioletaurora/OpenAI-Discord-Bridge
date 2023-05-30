import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';

const commands = [
  {
    name: 'chat',
    description: 'Sends a message to GPT',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

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
    await interaction.reply('Hello there!');
  }
});

client.login(process.env.BOT_TOKEN);
