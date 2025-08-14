// src/commands/help.js
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('사용 가능한 명령어 목록을 보여줘요.'),
  async execute(interaction) {
    const lines = [...interaction.client.commands.values()]
      .map(c => `• /${c.data.name} — ${c.data.description}`)
      .join('\n');
    await interaction.reply({ content: `사용 가능한 명령어:\n${lines}`, ephemeral: true });
  },
};
