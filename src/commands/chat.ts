import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);  

module.exports = {

    data: new SlashCommandBuilder()
                .setName("chat")
                .setDescription("Sends a message to ChatGPT")
                .addStringOption(new SlashCommandStringOption()
                                        .setName("prompt")
                                        .setDescription("What do you want ChatGPT to do?")
                                        .setRequired(true))
                .setDMPermission(false)
                .setDefaultMemberPermissions(2),
    async execute(interaction) {
            // trigger a deferred response, otherwise the 3-second timeout will kill this request
            await interaction.deferReply()
            
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "system", content: "You are a sassy and sarcastic assistant"},
                    {role: "user", content: interaction.options.getString("prompt")}
                ],
            });
                
            await interaction.followUp(response.data.choices[0].message);

    }

}