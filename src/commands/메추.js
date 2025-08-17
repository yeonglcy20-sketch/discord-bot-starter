// src/commands/메추.js
const { SlashCommandBuilder } = require('discord.js');

const menusByCat = {
  '한식': ['🥘 김치찌개','🥘 된장찌개','🍲 부대찌개','🍲 감자탕','🍲 순두부찌개','🍲 해장국','🍜 냉면','🍜 칼국수','🍚 비빔밥','🍖 불고기','🥓 삼겹살','🍗 닭갈비','🥟 김치전','🥞 해물파전','🌯 김밥','🔥 매운떡볶이','🍢 어묵탕','🍜 라볶이'],
  '일식': ['🍣 초밥','🐟 사시미','🍛 일본식 카레','🍜 라멘','🍜 우동','🥩 돈카츠','🍚 가츠동','🍤 텐동','🍲 나베','🍙 오니기리','🐙 타코야키'],
  '중식': ['🍜 짜장면','🔥 짬뽕','🍖 탕수육','🥘 마파두부','🥩 라조기','🍤 깐쇼새우','🍚 볶음밥','🌶️ 마라탕','🍲 훠궈','🥟 딤섬'],
  '양식': ['🍕 피자','🍝 토마토 파스타','🥛 크림 파스타','🧄 알리오올리오','🥩 스테이크','🍔 치즈버거','🥗 시저샐러드','🍚 리조또','🥪 파니니'],
  '디저트': ['🍧 빙수','🍦 아이스크림','🧇 와플','🍩 도넛','🍰 치즈케이크','🍫 초콜릿 케이크','🍪 쿠키','🧁 컵케이크'],
};
const ALL = Object.values(menusByCat).flat();

function pick(arr, k=1){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,Math.min(Math.max(1,k),5));}

module.exports = {
  // 슬래시 이름은 영문 소문자만 가능
  data: new SlashCommandBuilder()
    .setName('mechu')
    .setDescription('메뉴를 랜덤으로 추천해요')
    .addStringOption(o =>
      o.setName('type').setDescription('카테고리 (미선택 시 전체)')
       .addChoices(
         { name:'전체', value:'all' },
         ...Object.keys(menusByCat).map(k => ({ name:k, value:k }))
       )
    )
    .addIntegerOption(o =>
      o.setName('count').setDescription('추천 개수 (1~5)').setMinValue(1).setMaxValue(5)
    ),
  async execute(interaction) {
    const type = interaction.options.getString('type') || 'all';
    const count = interaction.options.getInteger('count') ?? 1;
    const pool = type==='all' ? ALL : (menusByCat[type] || ALL);
    const picks = pick(pool, count);
    await interaction.reply(
      `오늘 메뉴 추천${count>1?` (${type==='all'?'전체':type}, ${count}개)`:` (${type==='all'?'전체':type})`}: ` +
      picks.map(x=>`**${x}**`).join(', ')
    );
  },
};
