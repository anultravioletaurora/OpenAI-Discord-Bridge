import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import fs from 'fs'

const pathToPersonalityJson = '../../../config/personality.json'

// TODO: Comment | What does this mean?
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

  // TODO: Comment | When is this executed? Why is it significant?
  async execute(interaction: CommandInteraction) {

    // trigger a deferred response, otherwise the 3-second timeout will kill this request
    await interaction.deferReply();

    // TODO: Comment
    const OpenAI = require('openai');

    // TODO: Comment
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // TODO: Comment
    console.debug(`Discord interaction options: ${JSON.stringify(interaction.options)}`);

    // TODO: Comment
    // @ts-ignore  // THIS IS TERRIBLE THAT THIS MUST BE DONE -JOSEPH
    console.debug(`User submitted prompt: ${interaction.options.getString("prompt")}`);

    // this will be populated with the personality prompts as well as the users prompt,
    // it will then be passed in where appropriate below. 
    let prompts = [];
    // attempt to open personality json file / create empty default if isnt there
    try {
      // access
      const personalityJson = require(pathToPersonalityJson);
      // scrape contained prompts
      for (let i = 0; i < personalityJson.prompts.length; i++) {
        const x = { role: "system", content: personalityJson.prompts[i] }
        prompts.push(x);
      }
    } catch (error) {
      // this is a template for a default personality json config file
      const defaultPersonality = {
        prompts: [""],
      }
      // convert object to json
      const defaultPersonalityJson = JSON.stringify(defaultPersonality);
      // create a new personality.json in /config/ -> error handling
      fs.writeFile(pathToPersonalityJson, defaultPersonalityJson, (err) => {
        if (err) {
          console.log("Failed to create personality JSON!", err);
        } else {
          console.log("Successfully created a new default personality JSON. Check the /config/ dir");
        }
      });
    }

    // @ts-ignore
    prompts.push({ role: "user", content: interaction.options.getString("prompt") });

    // TODO: Comment
    const response = await openai.chat.completions.create({
      model: process.env.MODEL ?? "gpt-3.5-turbo",
      messages: prompts,
    });

    // TODO: Comment
    await interaction.followUp(response.choices[0].message);
  }
};


