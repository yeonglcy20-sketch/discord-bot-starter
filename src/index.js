// src/index.js
require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// ⬇️ 분리된 메시지 명령 리스너 등록 함수
const registerMechu = require('./text-commands/메추');

const TOKEN = (process.env.DISCORD_TOKEN || '').trim();
if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN이 비어있어요 (.env/환경변수 확인)');
  process.exit(1);
}

// ✅ 메시지 읽기용 인텐트 포함 (포털에서 Message Content Intent도 ON 필요)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,         // 슬래시 명령
    GatewayIntentBits.GuildMessages,  // 메시지 이벤트
    GatewayIntentBits.MessageContent, // 메시지 본문 접근
  ],
});

// ── 슬래시 명령 로딩 (commands 폴더)
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`Loaded command: /${command.data.name}`);
    } else {
      console.warn(`⚠️ ${file}: "data" 또는 "execute" 누락, 스킵`);
    }
  }
} else {
  console.warn('⚠️ commands 폴더가 없어 슬래시 명령을 로드하지 않았습니다.');
}

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

// ── 메시지 기반 "/메추 [카테고리] [개수]" 리스너 등록
registerMechu(client);

// ── 로그인
client.login(TOKEN);
