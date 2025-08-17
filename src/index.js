// src/index.js
require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const TOKEN = (process.env.DISCORD_TOKEN || '').trim();
if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN이 비어있어요 (.env/환경변수 확인)');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// 클라이언트: 메시지 기반 명령을 위해 메시지 인텐트 포함
// (디스코드 개발자 포털 → Bot → Message Content Intent = ON 필요)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,         // 슬래시 명령
    GatewayIntentBits.GuildMessages,  // 메시지 이벤트
    GatewayIntentBits.MessageContent, // 메시지 본문 접근
  ],
});

// ─────────────────────────────────────────────────────────────
// 슬래시 명령 로딩 (src/commands/*.js)
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsPath, file));
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`Loaded command: /${command.data.name}`);
      } else {
        console.warn(`⚠️ ${file} : "data" 또는 "execute"가 없습니다. 스킵합니다.`);
      }
    } catch (e) {
      console.error(`❌ 슬래시 명령 로드 실패: ${file}`, e);
    }
  }
} else {
  console.warn('⚠️ commands 폴더가 없어 슬래시 명령을 로드하지 않았습니다.');
}

// ─────────────────────────────────────────────────────────────
client.once(Events.ClientReady, (c) => {
  console.log(`✅ 로그인 성공: ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`No command matching ${interaction.commandName} found.`);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '이 명령은 아직 적용되지 않았어요. `/help` 확인 후 `npm run register`를 실행해 주세요.',
        ephemeral: true,
      });
    }
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    const msg = '명령 실행 중 오류가 발생했어요.';
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: msg, ephemeral: true });
    } else {
      await interaction.reply({ content: msg, ephemeral: true });
    }
  }
});

// ─────────────────────────────────────────────────────────────
// 메시지 기반 "/메추 [카테고리] [개수]" 리스너 동적 로드
const tcDir = path.join(__dirname, 'text-commands');
let registerMechu = null;
try {
  // 한글 파일명 우선 시도
  registerMechu = require('./text-commands/메추');
  console.log('Loaded text command handler: text-commands/메추.js');
} catch {
  try {
    // 영문 대체 파일명 시도
    registerMechu = require('./text-commands/mechu');
    console.log('Loaded text command handler: text-commands/mechu.js');
  } catch {
    try {
      // 폴더 스캔하여 mechu/메추 포함된 .js 탐색 (정규화 이슈 대비)
      if (fs.existsSync(tcDir)) {
        const cand = fs.readdirSync(tcDir).find(f => /\.js$/i.test(f) && /mechu|메추/i.test(f));
        if (cand) {
          registerMechu = require(path.join(tcDir, cand));
          console.log(`Loaded text command handler: text-commands/${cand}`);
        }
      }
    } catch (e) {
      console.warn('⚠️ text-commands 스캔 중 경고:', e?.message || e);
    }
  }
}

if (registerMechu) {
  try {
    registerMechu(client); // 내부에서 중복 등록 방지 처리
  } catch (e) {
    console.error('❌ 메추 핸들러 등록 실패:', e);
  }
} else {
  console.warn('⚠️ text-commands 폴더에서 메추 핸들러를 찾지 못했습니다. (메시지 기반 /메추 비활성화)');
}

// ─────────────────────────────────────────────────────────────
client.login(TOKEN);
