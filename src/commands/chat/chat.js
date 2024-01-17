const { SlashCommandBuilder, SlashCommandStringOption } = require('discord.js');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Sends a message to ChatGPT")
    .addStringOption(option => 
      option.setName("prompt")
            .setDescription("What do you want ChatGPT to do?")
            .setRequired(true)),

  async execute(interaction) {
      // trigger a deferred response, otherwise the 3-second timeout will kill this request
      await interaction.deferReply();

      console.debug(`Discord interaction options: ${JSON.stringify(interaction.options)}`);
      console.debug(`User submitted prompt: ${interaction.options.getString("prompt")}`);
    
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
      
      await interaction.followUp(response.choices[0].message);
    }
};


