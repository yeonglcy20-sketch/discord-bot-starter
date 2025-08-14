
# Discord Bot Starter (빵떡이 스타일 Slash 명령어)

Node.js(>=18) + discord.js v14 기반의 슬래시 명령어 봇 템플릿입니다.  
`/ping`, `/say`, `/help` 기본 명령을 포함하고, **`src/commands` 폴더에 파일만 추가하면 자동으로 확장**됩니다.

## 1) 준비물
- Node.js 18 이상
- 디스코드 개발자 포털에서 애플리케이션 생성 후 **Bot 생성** 및 **토큰** 발급
- 봇 초대: OAuth2 → **URL Generator** → Scopes: `bot`, `applications.commands`,  
  Bot Permissions(최소): `Send Messages`, `Read Message History`

## 2) 설치
```bash
npm i
```

## 3) 환경변수 설정
`.env.example`을 복사해 `.env`로 만들고 값 채우기:
```
DISCORD_TOKEN=봇토큰
CLIENT_ID=애플리케이션ID
GUILD_ID=테스트서버ID(선택)
```

- 개발 중엔 `GUILD_ID`를 넣어 **길드 명령어**로 등록(몇 초 내 반영)  
- 배포 시 `GUILD_ID`를 비우면 **글로벌 명령어**로 등록(반영에 수 분~1시간)

## 4) 명령어 등록
```bash
npm run register
```

## 5) 실행
```bash
npm start
```

## 6) 새 명령어 추가
1. `src/commands/_template.js` 파일을 복사해 파일명을 바꾸세요. (예: `weather.js`)
2. 내부의 `.setName('example')`를 원하는 이름으로 바꾸고, `execute`에 동작을 작성하세요.
3. 아래를 실행해 커맨드를 등록한 뒤:
   ```bash
   npm run register
   ```
4. 봇을 재시작:
   ```bash
   npm start
   ```

## 7) 기본 제공 명령어
- `/ping` — 봇 지연시간 체크
- `/say text:<내용>` — 따라 말하기
- `/help` — 현재 로드된 명령어 목록을 DM이 아닌 **에페메랄(ephemeral)** 메시지로 표시

---

필요에 따라 데이터베이스, 권한 체크, 버튼/모달 등 상호작용을 확장할 수 있습니다.
