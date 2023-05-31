import { REST, Routes, Client, Collection, GatewayIntentBits, ApplicationCommand } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import fs from 'node:fs';
import path from 'node:path';

// I'm gonna move this but it's here so I can get this code working again
export default class CommandClient extends Client {

    commands: Collection<String, ApplicationCommand>;
}

// Needed for registering all slash commands

// Setup for OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Setup for Discord API
const client = new CommandClient({ intents: [GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID));

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // @ts-ignore
  const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.BOT_TOKEN);
