// src/commands/say.js
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('입력한 내용을 따라 말해요.')
    .addStringOption(opt =>
      opt.setName('text')
        .setDescription('할 말')
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    await interaction.reply(text);
  },
};
