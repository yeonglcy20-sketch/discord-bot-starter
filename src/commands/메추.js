const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('메추') // /메추 로 사용
    .setDescription('메뉴를 랜덤으로 추천해줘요'),

  async execute(interaction) {
    const menus = [
      '🍣 초밥',
      '🍜 라면',
      '🍕 피자',
      '🍗 치킨',
      '🥩 스테이크',
      '🥗 샐러드',
      '🍛 카레',
      '🥪 샌드위치',
      '🍔 햄버거',
      '🐙 타코야끼',
      '🥟 만두',
      '🍲 전골',
      '🍤 새우튀김',
      '🍞 빵',
      '🌮 타코',
      '🍱 도시락',
      '🥬 비빔밥',
      '🥚 오므라이스',
      '🍧 빙수',
      '🥠 포춘쿠키',
      '🍜 우동',
      '🍖 갈비',
      '🥞 팬케이크',
      '🍝 파스타',
      '🍢 오뎅탕',
      '🍍 파인애플 볶음밥',
      '🥔 감자튀김',
      '🍫 초콜릿 케이크',
      '🥯 베이글',
      '🥙 케밥'
    ];

    const pick = menus[Math.floor(Math.random() * menus.length)];

    await interaction.reply(`오늘 메뉴 추천: **${pick}**`);
  },
};