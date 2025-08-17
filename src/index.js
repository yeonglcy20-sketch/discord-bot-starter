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

// 슬래시 명령 전용 (메시지 인텐트 없음)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // 슬래시 명령 처리에 충분
  ],
});

// ── 슬래시 명령 로딩 (src/commands/*.js)
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

// ── 로그인/이벤트
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

// ── 시작
client.login(TOKEN);
