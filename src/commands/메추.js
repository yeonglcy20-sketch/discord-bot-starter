// src/commands/메추.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  // ⚠️ 슬래시 명령 이름은 영문 소문자/숫자/-/_만 가능
  data: new SlashCommandBuilder()
    .setName('mechu')
    .setDescription('한글 명령은 메시지로 /메추 를 사용하세요'),
  async execute(interaction) {
    await interaction.reply({
      content:
        '이 명령은 안내용입니다 😊\n' +
        '한글 명령은 **메시지로** 입력하세요:\n' +
        '• `/메추` → 전체에서 1개 랜덤\n' +
        '• `/메추 한식` → 한식 랜덤 1개\n' +
        '• `/메추 한식 3` → 한식 랜덤 3개\n' +
        '• `/메추 디저트 2` → 디저트 랜덤 2개',
      ephemeral: true,
    });
  },
};
