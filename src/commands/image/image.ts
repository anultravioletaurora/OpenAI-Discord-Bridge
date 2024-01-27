import OpenAI from 'openai';
import { AttachmentBuilder, CommandInteraction, EmbedBuilder, Interaction, MessageComponentInteraction, MessagePayload, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Generates an image using DALL-E")
    .addStringOption((option) => {
      return option
              .setName("prompt")
              .setDescription("What the image should contain")
              .setRequired(true)
    })
    .addStringOption((option) => {
		return option.setName('quality')
			.setDescription('The quality of the image being generated')
			.setRequired(true)
			.addChoices(
				{ name: 'Standard', value: 'standard' },
				{ name: 'HD (takes longer, looks better)', value: 'hd' },
			)
    })

    .setDMPermission(true),
            
            
  async execute(interaction: CommandInteraction) {
    // trigger a deferred response, otherwise the 3-second timeout will kill this request
    await interaction.deferReply();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    
    console.debug(`Discord interaction options: ${JSON.stringify(interaction.options)}`);
    console.debug(`User submitted prompt: ${interaction.options.get("prompt")!.value!.toString()}`);

    const response = await openai.images.generate({
        // @ts-ignore
        prompt: interaction.options.getString("prompt"),

        // @ts-ignore
        model: "dall-e-3",

        // @ts-ignore
        quality: interaction.options.getString("quality"),
        response_format: "b64_json",
        n: 1,
    })

    console.debug(`Received generated image response`)
    
    // Convert Base64 bytes into a Blob
    let imageBlob: Blob = await fetch(`data:image/jpg;base64,${response.data[0].b64_json}`)
      .then((res) => {
        return res.blob()
      })

    let attachmentBuilder = new AttachmentBuilder(
      Buffer.from(await imageBlob.arrayBuffer()),{
        name: "generated-image.jpg"
      }
    )

    const generatedImageEmbed = new EmbedBuilder()
      .setAuthor({ name: `Prompted by ${interaction.member!.user.username}`})

      // @ts-ignore
      .setDescription(`Original prompt: ${interaction.options.getString("prompt")}`)
      .setImage("attachment://generated-image.jpg")

    await interaction.followUp({ embeds: [generatedImageEmbed.toJSON()], files: [Buffer.from(await imageBlob.arrayBuffer())]});
  }
};