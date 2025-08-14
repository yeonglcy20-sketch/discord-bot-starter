// src/commands/_template.js
// 이 파일을 복사해서 파일명/명령어명을 바꾸고, deploy 스크립트를 다시 실행하면 됩니다.
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('example') // <-- 명령어 이름 (영문 소문자, 공백 X)
    .setDescription('설명을 적어주세요.'),
  async execute(interaction) {
    await interaction.reply('여기에 동작을 작성하세요!');
  },
};
