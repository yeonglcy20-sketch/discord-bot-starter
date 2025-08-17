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

// ✅ Step 2: 메시지 읽기용 인텐트 추가
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,         // 슬래시 명령 등
    GatewayIntentBits.GuildMessages,  // 메시지 이벤트 수신
    GatewayIntentBits.MessageContent, // 메시지 본문 읽기 (포털에서도 ON!)
    // GatewayIntentBits.GuildMembers, // (선택) 자동 역할 등 쓸 때만
  ],
});

// 슬래시 명령 로딩
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
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
        content: '이 명령은 아직 적용되지 않았어요. `/help` 확인 후 `npm run register`를 다시 실행해 주세요.',
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

// ⬇️ 여기까지가 Step 2. (Step 3의 메시지 기반 "/메추 한식 3" 처리 코드는 아직 미포함)

client.login(TOKEN);
