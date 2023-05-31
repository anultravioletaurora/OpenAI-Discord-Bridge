# discord-gpt
A bot that connects Discord to ChatGPT because it's 2023. You and your fellow Discordians can bask in it's generative goodness

### Relies on:
- https://github.com/discordjs/discord.js
- https://github.com/openai/openai-node

### Features:
- Invoke via slash-commands
- Is slightly sarcastic and sassy to spice things up

### Soon-to-be-features
- Starts a chat if the server goes quiet by prompting itself to start a conversation from a specified list of topics or pick up the conversation from the last (n) messages 
  - Tells a joke
  - Asks a question
  - Drops some wisdom / knowledge
- Configurable levels of humor and sassiness

### Run via Docker
`docker run ghcr.io/jackcauliflower/discord-gpt:latest -e BOT_TOKEN="yourdiscordbottoken" -e CLIENT_ID="yourdiscordappclientid" -e OPENAI_API_KEY="youropenaiapikey"`
This will pull the latest "stable" version from the Github container registry. These containers are automatically generated when new releases come out
