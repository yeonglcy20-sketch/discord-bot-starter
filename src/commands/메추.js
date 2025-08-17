const { Events } = require('discord.js');

// 카테고리별 메뉴
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
    '🥩 돈카츠','🍚 가츠동','🍤 텐동','🍲 나베','🍙 오니기리','🐙 타코야키','🥟 교자','🥢 오코노미야키'
  ],
  '중식': [
    '🍜 짜장면','🔥 짬뽕','🍖 탕수육','🥘 마파두부','🥩 라조기','🍤 깐쇼새우',
    '🥩 유산슬','🍚 볶음밥','🍜 우육면','🌶️ 마라탕','🌶️ 마라샹궈','🍲 훠궈','🥟 딤섬'
  ],
  '양식': [
    '🍕 피자','🍝 토마토 파스타','🥛 크림 파스타','🧄 알리오올리오','🥩 스테이크',
    '🍔 띠드버거','🌭 핫도그','🥗 시저샐러드','🍚 리조또','🥘 비프스튜','🥪 파니니'
  ],
  '동남아': [
    '🍜 퍼(쌀국수)','🥗 분짜','🥖 반미','🍜 카오쏘이','🍝 팟타이',
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

function sampleWithoutReplace(arr, k) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, Math.max(0, Math.min(k, a.length)));
}

// 카테고리 입력 보정 (동의어/줄임말)
function normalizeCat(raw) {
  if (!raw) return null;
  const s = raw.replace(/\s+/g, '').toLowerCase();
  if (['한식','k','kr','korea','k-food'].includes(s)) return '한식';
  if (['일식','jp','japan','j-food','일'].includes(s)) return '일식';
  if (['중식','cn','china','c-food','중'].includes(s)) return '중식';
  if (['양식','w','western','양'].includes(s)) return '양식';
  if (['분식','야식','분식야식','night'].includes(s)) return '분식/야식';
  if (['동남아','seasia','asean','동'].includes(s)) return '동남아';
  if (['인도','중동','인도중동','indo','me','middleeast'].includes(s)) return '인도/중동';
  if (['간단식','간단','simple','light'].includes(s)) return '간단식';
  if (['디저트','dessert','sweet'].includes(s)) return '디저트';
  if (['채식','비건','vegan','veg'].includes(s)) return '채식';
  return null;
}

client.on(Events.MessageCreate, async (msg) => {
  try {
    if (msg.author.bot) return;
    if (!msg.guild) return; // DM은 무시 (원하면 허용 가능)

    // 형식: /메추 [카테고리] [개수]
    const m = msg.content.trim();
    if (!m.startsWith('/메추')) return;

    const parts = m.split(/\s+/).slice(1); // [/메추, ...]에서 인자만
    const rawCat = parts[0];
    const rawCnt = parts[1];

    const cat = normalizeCat(rawCat) || (rawCat ? rawCat : null);
    const count = Math.min(5, Math.max(1, parseInt(rawCnt, 10) || 1));

    let pool, label;
    if (!cat) {
      pool = ALL;
      label = '전체';
    } else if (menusByCat[cat]) {
      pool = menusByCat[cat];
      label = cat;
    } else {
      // 지원 카테고리 안내
      const cats = Object.keys(menusByCat).join(', ');
      return msg.reply(`사용법: \`/메추 [카테고리] [개수]\`\n예) \`/메추 한식\`, \`/메추 한식 3\`\n가능한 카테고리: ${cats}`);
    }

    const picks = sampleWithoutReplace(pool, count);
    await msg.reply(`오늘 메뉴 추천${count > 1 ? ` (${label}, ${count}개)` : ` (${label})`}: ${picks.map(p => `**${p}**`).join(', ')}`);
  } catch (e) {
    console.error('메추 처리 오류:', e);
  }
});
