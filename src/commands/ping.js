// src/commands/ping.js
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('핑퐁! 봇 상태 확인'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '핑 측정 중…', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`퐁! 게이트웨이: ${Math.round(interaction.client.ws.ping)}ms, 라운드트립: ${latency}ms`);
  },
};
