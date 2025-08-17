const { SlashCommandBuilder } = require('discord.js');

const menusByCat = {
  '한식': [
    '🥘 김치찌개','🥘 된장찌개','🍲 부대찌개','🍲 감자탕','🍲 순두부찌개','🍲 해장국',
    '🍜 냉면','🍜 칼국수','🍜 잔치국수','🍜 콩국수','🍚 비빔밥','🍚 돌솥비빔밥',
    '🍖 불고기','🥓 삼겹살','🍖 갈비탕','🍗 닭갈비','🍗 닭한마리','🍗 삼계탕',
    '🥟 만두전골','🥩 육회비빔밥','🥓 제육볶음','🥢 오징어볶음','🦑 낙지볶음',
    '🥘 순대국','🥘 곱창전골','🥘 뼈해장국','🥟 김치전','🥞 해물파전','🌯 김밥',
    '🌶️ 닭발','🍖 족발','🥩 보쌈','🔥 매운떡볶이','🍢 어묵탕','🍜 라볶이'
  ],
  '일식': [
    '🍣 초밥','🐟 사시미','🍛 일본식 카레','🍜 라멘','🍜 우동','🥢 야키소바',
    '🥩 돈카츠','🍚 가츠동','🍤 텐동','🍲 나베','🍙 오니기리','🐙 타코야키',
    '🥟 교자','🥢 오코노미야키'
  ],
  '중식': [
    '🍜 짜장면','🔥 짬뽕','🍖 탕수육','🥘 마파두부','🥩 라조기','🍤 깐쇼새우',
    '🥩 유산슬','🍚 볶음밥','🍜 우육면','🌶️ 마라탕','🌶️ 마라샹궈','🍲 훠궈',
    '🥟 딤섬'
  ],
  '양식': [
    '🍕 피자','🍝 토마토 파스타','🥛 크림 파스타','🧄 알리오올리오','🥩 스테이크',
    '🍔 띠드버거','🌭 핫도그','🥗 시저샐러드','🍚 리조또','🥘 비프스튜','🥪 파니니'
  ],
  '동남아': [
    '🍜 베트남 쌀국수(퍼)','🥗 분짜','🥖 반미','🍜 카오쏘이','🍝 팟타이',
    '🍚 카오팟(볶음밥)','🦐 똠얌꿍','🍛 락사'
  ],
  '인도/중동': [
    '🍛 버터치킨 커리','🥘 팔락 파니르','🥘 달(렌틸) 커리','🫓 난','🥟 사모사',
    '🥙 케밥','🌯 샤와르마','🥗 팔라펠','🥣 후무스'
  ],
  '분식/야식': [
    '🍗 치킨','🍟 감자튀김','🌮 타코','🌯 부리또','🍜 컵라면',
    '🍢 오뎅바','🍕 야식 피자','🥪 편의점 샌드위치'
  ],
  '간단식': [
    '🥪 샌드위치','🥯 베이글','🍞 토스트','🍙 주먹밥','🥗 샐러드볼','🍱 도시락'
  ],
  '디저트': [
    '🍧 빙수','🍦 아이스크림','🧇 와플','🥞 크레이프','🍩 도넛',
    '🍰 치즈케이크','🍰 티라미수','🍮 푸딩','🍫 초콜릿 케이크','🍪 쿠키','🧁 컵케이크'
  ],
  '채식': [
    '🥗 두부샐러드','🥙 비건 랩','🍔 비건 버거','🍝 토마토 채식 파스타','🍲 야채 스튜'
  ]
};

const ALL = Object.values(menusByCat).flat();

// 중복 없이 k개 샘플링 (k는 1~5로 제한)
function sampleWithoutReplace(arr, k = 1) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  const n = Math.max(1, Math.min(k, 5, a.length));
  return a.slice(0, n);
}

module.exports = {
  // ⚠️ 슬래시 이름은 영문만 가능 → '메추'
  data: new SlashCommandBuilder()
    .setName('메추')
    .setDescription('메뉴를 랜덤으로 추천해줘요')
    .addStringOption(o =>
      o.setName('type')
       .setDescription('카테고리 선택 (미선택 시 전체 랜덤)')
       .addChoices(
         { name: '전체', value: 'all' },
         { name: '한식', value: '한식' },
         { name: '일식', value: '일식' },
         { name: '중식', value: '중식' },
         { name: '양식', value: '양식' },
         { name: '분식/야식', value: '분식/야식' },
         { name: '동남아', value: '동남아' },
         { name: '인도/중동', value: '인도/중동' },
         { name: '간단식', value: '간단식' },
         { name: '디저트', value: '디저트' },
         { name: '채식', value: '채식' }
       )
    )
    .addIntegerOption(o =>
      o.setName('count')
       .setDescription('추천 개수 (1~5, 기본 1)')
       .setMinValue(1)
       .setMaxValue(5)
    ),

  async execute(interaction) {
    const type = interaction.options.getString('type') || 'all';
    const count = interaction.options.getInteger('count') ?? 1;

    const pool = (type === 'all') ? ALL : (menusByCat[type] || ALL);
    const picks = sampleWithoutReplace(pool, count);

    await interaction.reply(
      `오늘 메뉴 추천${picks.length > 1 ? ` (${type === 'all' ? '전체' : type}, ${picks.length}개)` : ` (${type === 'all' ? '전체' : type})`}: ` +
      picks.map(p => `**${p}**`).join(', ')
    );
  },
};
