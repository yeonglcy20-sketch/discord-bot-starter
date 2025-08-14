// src/deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const TOKEN = (process.env.DISCORD_TOKEN || '').trim();
const CLIENT_ID = (process.env.CLIENT_ID || '').trim();
const GUILD_ID = (process.env.GUILD_ID || '').trim(); // 비어있으면 전역 등록

if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN이 비어있어요 (.env 확인)');
  process.exit(1);
}
if (!CLIENT_ID) {
  console.error('❌ CLIENT_ID가 비어있어요 (.env 확인)');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ ${file} : "data" 또는 "execute"가 없습니다. 스킵합니다.`);
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log(`⌛ 등록 준비: ${commands.length}개 명령어`);
    if (GUILD_ID) {
      console.log(`🛠  길드 등록 모드 (GUILD_ID=${GUILD_ID})`);
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands },
      );
      console.log('✅ 길드(개발 서버) 명령어 등록 완료! (거의 즉시 반영)');
    } else {
      console.log('🌐 전역 등록 모드 (GUILD_ID 비어있음)');
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands },
      );
      console.log('✅ 전역 명령어 등록 완료! (반영까지 다소 시간 소요)');
    }
  } catch (error) {
    console.error('❌ 등록 중 오류:', error);
    process.exit(1);
  }
})();
