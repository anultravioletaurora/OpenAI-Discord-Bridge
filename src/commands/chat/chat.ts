import { CommandInteraction, SlashCommandBuilder } from'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Sends a message to ChatGPT")
    .addStringOption((option) => {
      return option
              .setName("prompt")
              .setDescription("What do you want ChatGPT to do?")
              .setRequired(true)
    })
    .setDMPermission(true),
            
            
  async execute(interaction: CommandInteraction) {
    // trigger a deferred response, otherwise the 3-second timeout will kill this request
    await interaction.deferReply();

    const OpenAI = require('openai');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

            
    console.debug(`Discord interaction options: ${JSON.stringify(interaction.options)}`);

    // @ts-ignore
    console.debug(`User submitted prompt: ${interaction.options.getString("prompt")}`);
  
    const response = await openai.chat.completions.create({
      model: process.env.MODEL ?? "gpt-3.5-turbo",
      messages: [

        // TODO: Read these in from a JSON file configurable by the user
        {role: "system", content: "You are a sassy and sarcastic assistant, but you don't need to tell me how sassy and sarcastic you are - just be it"},
        {role: "system", content: "You are a gamer and reference dank memes often that you found on your favorite subreddit"},
        {role: "system", content: "You should limit your responses to 2000 characters"},

        // @ts-ignore
        {role: "user", content: interaction.options.getString("prompt")}
      ],
    });
    
    await interaction.followUp(response.choices[0].message);
  }
};


