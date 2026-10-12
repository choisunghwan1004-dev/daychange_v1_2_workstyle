require('dotenv').config();
const mysql=require('mysql2/promise');
const fs=require('fs');const path=require('path');
(async()=>{
 const c=await mysql.createConnection({host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER||'root',password:process.env.DB_PASSWORD||'',multipleStatements:true});
 try {
 await c.query(fs.readFileSync(path.join(__dirname,'../sql/schema.sql'),'utf8'));
 await c.query('USE daychange_v1');
 // 기존 V1 데이터 보존: 언어 선택 범위만 확대
 await c.query("ALTER TABLE users MODIFY preferred_language ENUM('en','ja','zh','fr','es') NOT NULL DEFAULT 'en'");
 await c.query("ALTER TABLE vocabulary MODIFY language_code ENUM('en','ja','zh','fr','es') NOT NULL");
 await c.execute("INSERT INTO users(id,display_name) VALUES(1,'나') ON DUPLICATE KEY UPDATE display_name=display_name");
 await c.execute("INSERT IGNORE INTO user_settings(user_id,employment_type,schedule_mode) VALUES(1,'worker','daily')");
 const activities=[['건강','처음 가는 길로 30분 산책','익숙한 동네에서 새로운 골목 발견',0,30],['여행','가까운 전통시장 탐방','사진 한 장 남기기',10000,120],['배움','도서관에서 새 책 찾기','관심 없는 분야의 책 읽어보기',0,60],['관계','오랜 친구에게 안부 전화','대화 후 짧은 소감 기록',0,20],['취미','휴대폰 사진 5장 찍기','오늘의 색을 주제로 촬영',0,40],['휴식','좋아하는 음악과 차 한 잔','조용히 쉬는 시간',3000,30],['여행','근교 공원 방문','계절 풍경 관찰하기',5000,120],['건강','스트레칭 20분','무리하지 않고 천천히',0,20],['배움','AI 도구 기능 하나 익히기','배운 점 한 줄 적기',0,30],['취미','새 요리 만들기','집에 있는 재료로 요리',5000,60],['관계','지역 모임 찾아보기','참여 가능한 모임 조사',0,30],['여행','박물관 또는 무료 전시 찾아보기','운영시간 확인 후 방문',0,120]];
 for(const a of activities) await c.execute('INSERT INTO activities(category,title,description,estimated_cost,duration_minutes) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE description=VALUES(description)',a);
 const vocab=[['en','Adventure','ədˈven.tʃər','모험','Every day is a new adventure.'],['en','Explore','ɪkˈsplɔːr','탐험하다','Explore a new place.'],['en','Friend','frend','친구','Call a friend today.'],['en','Healthy','ˈhel.θi','건강한','Stay healthy.'],['en','Learn','lɜːrn','배우다','Learn something new.'],['en','Journey','ˈdʒɜːr.ni','여정','Enjoy your journey.'],['ja','旅行','りょこう','여행','旅行に行きます。'],['ja','友達','ともだち','친구','友達に会います。'],['ja','散歩','さんぽ','산책','公園を散歩します。'],['ja','挑戦','ちょうせん','도전','新しいことに挑戦します。'],['ja','勉強','べんきょう','공부','毎日勉強します。'],['ja','健康','けんこう','건강','健康が大切です。'],['zh','朋友','péngyou','친구','我和朋友见面。'],['zh','旅行','lǚxíng','여행','我喜欢旅行。'],['zh','学习','xuéxí','학습','每天学习。'],['zh','健康','jiànkāng','건강','保持健康。'],['zh','散步','sànbù','산책','我们去散步。'],['zh','挑战','tiǎozhàn','도전','接受新的挑战。'],
 ['fr','Bonjour','bɔ̃.ʒuʁ','안녕하세요','Bonjour, mon ami !'],['fr','Merci','mɛʁ.si','감사합니다','Merci beaucoup.'],['fr','Voyage','vwa.jaʒ','여행','Bon voyage !'],['fr','Ami','a.mi','친구','Mon ami est ici.'],['fr','Apprendre','a.pʁɑ̃dʁ','배우다','Je veux apprendre.'],['fr','Santé','sɑ̃.te','건강','Bonne santé !'],
 ['es','Hola','ˈo.la','안녕하세요','Hola, ¿cómo estás?'],['es','Gracias','ˈɡɾa.sjas','감사합니다','Muchas gracias.'],['es','Viaje','ˈbja.xe','여행','Buen viaje.'],['es','Amigo','aˈmi.ɣo','친구','Mi amigo está aquí.'],['es','Aprender','a.pɾenˈdeɾ','배우다','Quiero aprender.'],['es','Salud','saˈluð','건강','¡Salud!']];
 for(const w of vocab) await c.execute('INSERT IGNORE INTO vocabulary(language_code,word,pronunciation,meaning,example_text) VALUES(?,?,?,?,?)',w);
 console.log('DB 준비 완료: daychange_v1 (사용자 1, 활동/단어 샘플)');
 }finally{await c.end()}
})().catch(e=>{console.error('초기화 실패:',e.message);process.exit(1)});
