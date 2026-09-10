import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {webcrypto} from 'node:crypto';
import {makeDeck,explanation} from '../dist/engine.js';import * as progress from '../dist/progress.js';import {Session} from '../dist/session.js';
import * as gameplay from '../dist/gameplay.js';
const source=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import .*\n/gm,'');
function harness(storage){let now=1000000;class ClockDate extends Date{static now(){return now;}}const el=()=>({innerHTML:'',dataset:{},classList:{toggle(){}},setAttribute(){},querySelectorAll:()=>[],querySelector:()=>null,focus(){}});const app=el(),controls={'#app':app,'#player-nav':el(),'#main-nav':el()};const context=vm.createContext({...progress,...gameplay,Date:ClockDate,setInterval:()=>1,clearInterval(){},Session,makeDeck,explanation,drawAvatar(){},crypto:webcrypto,structuredClone,window:{localStorage:storage,scrollTo(){},addEventListener(){}},document:{body:{dataset:{}},querySelector:x=>controls[x]||null,querySelectorAll:()=>[],addEventListener(){}}});vm.runInContext(source,context);return {run:s=>vm.runInContext(s,context),html:()=>app.innerHTML,advance:ms=>now+=ms};}
test('create, customize, finish, reload and switch between independent players',()=>{let raw;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v};const h=harness(storage);
 assert.match(h.html(),/Who’s playing/);h.run('act("new");editor.name="Nova";editor.avatar.accessory="cap";savePlayer();');assert.match(h.html(),/WELCOME BACK, NOVA/);
 h.run('act("clear");act("table:5");act("start");act("wrong");');assert.match(h.html(),/LET’S BUILD IT TOGETHER/);h.run('act("undo");');assert.doesNotMatch(h.html(),/LET’S BUILD IT TOGETHER/);
 h.run('act("wrong");act("next");while(page==="play"){act("right");act("next");}');assert.match(h.html(),/Achievement unlocked/);
 let data=JSON.parse(raw);assert.equal(data.players[0].runs.length,1);assert.equal(data.players[0].runs[0].answers.length,11);assert.equal(data.players[0].runs[0].answers.filter(x=>x.retry).length,1);
 h.run('act("reports");');assert.match(h.html(),/90%/);assert.match(h.html(),/Mission history/);
 const again=harness(storage);assert.match(again.html(),/WELCOME BACK, NOVA/);assert.equal(again.run('player().avatar.accessory'),'cap');
 again.run('act("players");act("new");editor.name="Orbit";savePlayer();');assert.equal(again.run('player().runs.length'),0);again.run('act("start");act("right");act("leave");act("discard");');assert.equal(again.run('player().runs.length'),0);
 again.run('act("choose:"+save.data.players[0].id);');assert.equal(again.run('player().runs.length'),1);
});
test('nickname markup is escaped and duplicate nicknames cannot overwrite profiles',()=>{let raw;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v},h=harness(storage);h.run('act("new");editor.name="<img onerror=x>";savePlayer();');assert.doesNotMatch(h.html(),/<img onerror=x>/);h.run('act("new");editor.name="<img onerror=x>";savePlayer();');assert.match(h.html(),/already has a save slot/);assert.equal(JSON.parse(raw).players.length,1);});
test('studio saves expanded choices, resets draft changes and leaves history intact',()=>{let raw;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v},h=harness(storage);
 h.run('act("new");editor.name="Comet";act("hair:5");act("pattern:jersey");savePlayer();act("start");while(page==="play"){act("right");act("next");}');
 h.run('act("edit:"+player().id);act("hair:3");act("reset-avatar");');assert.equal(h.run('editor.avatar.hair'),5);assert.equal(h.run('editor.avatar.style'),'jersey');
 h.run('act("shuffle-avatar");');assert.ok(h.run('editor.avatar.hair>=0&&editor.avatar.hair<6'));h.run('act("reset-avatar");savePlayer();');
 const again=harness(storage);assert.equal(again.run('player().avatar.hair'),5);assert.equal(again.run('player().runs.length'),1);
});
test('bot poses follow feedback and correction shows exact equal groups',()=>{const h=harness(memoryStorage());h.run('act("new");editor.name="Comet";savePlayer();act("start");session=new Session([{a:5,b:5}]);render();');assert.match(h.html(),/bot-sprite idle/);
 h.run('act("wrong");');assert.match(h.html(),/bot-sprite teach/);assert.equal((h.html().match(/class="power-pack"/g)||[]).length,5);assert.equal((h.html().match(/<i><\/i>/g)||[]).length,25);assert.match(h.html(),/5 \+ 5 \+ 5 \+ 5 \+ 5 = 25/);
 h.run('act("undo");act("right");');assert.match(h.html(),/bot-sprite cheer/);
});
test('solo typing validates, scores once, teaches mistakes and blocks parent controls',()=>{const h=harness(memoryStorage());h.run('act("new");editor.name="Asher";savePlayer();mode="solo";act("start");session=new Session([{a:5,b:5}]);render();');assert.match(h.html(),/answer-form/);assert.doesNotMatch(h.html(),/data-action="right"/);
 h.run('act("right");act("wrong");submitAnswer("");');assert.equal(h.run('session.feedback'),null);h.run('submitAnswer("20");submitAnswer("25");');assert.equal(h.run('session.feedback'),false);assert.equal(h.run('session.submitted'),20);assert.match(h.html(),/5 \+ 5 \+ 5 \+ 5 \+ 5 = 25/);
 h.run('act("next");submitAnswer("25");act("next");');assert.equal(h.run('player().runs[0].answers.length'),2);assert.equal(h.run('player().runs[0].answers[1].ok'),true);assert.equal(h.run('player().runs[0].mode'),'solo');
});
test('mixed solo alternates stable three-option questions with typing',()=>{const h=harness(memoryStorage());h.run('act("new");editor.name="Asher";savePlayer();mode="solo";format="mixed";act("start");session=new Session([{a:0,b:0},{a:9,b:9}]);render();');assert.match(h.html(),/answer-form/);h.run('submitAnswer("0");act("next");');assert.match(h.html(),/choice-answers/);assert.equal((h.html().match(/class="answer-choice"/g)||[]).length,3);const before=h.run('JSON.stringify(choices.get(1))');h.run('render();');assert.equal(h.run('JSON.stringify(choices.get(1))'),before);h.run('act("answer:81");act("next");');assert.equal(h.run('player().runs[0].answers.filter(a=>a.ok).length'),2);
});
test('timed parent challenge uses all selected facts, refills and saves pending marks once',()=>{const h=harness(memoryStorage());h.run('act("new");editor.name="Asher";savePlayer();timed=true;roundSize=10;act("start");');assert.equal(h.run('session.queue.length'),100);h.run('session=new Session([{a:2,b:5}]);act("right");act("next");');assert.equal(h.run('page'),'play');assert.equal(h.run('session.queue.length'),101);h.run('act("right");act("leave");');h.advance(300000);h.run('tickClock();tickClock();');assert.equal(h.run('page'),'finish');assert.equal(h.run('player().runs.length'),1);assert.equal(h.run('player().runs[0].answers.length'),2);assert.equal(h.run('timer'),null);assert.match(h.html(),/FIVE-MINUTE CHALLENGE COMPLETE/);
});
test('timed solo rejects answers at deadline, does not score unanswered cards, and stops discarded timers',()=>{const h=harness(memoryStorage());h.run('act("new");editor.name="Asher";savePlayer();mode="solo";timed=true;act("start");');h.advance(299999);h.run('submitAnswer(String(session.card.a*session.card.b));act("next");');h.advance(1);h.run('submitAnswer(String(session.card.a*session.card.b));');assert.equal(h.run('player().runs[0].answers.length'),1);assert.equal(h.run('player().runs[0].timed'),true);h.run('act("missions");act("start");act("leave");act("discard");');h.advance(300000);h.run('tickClock();');assert.equal(h.run('timer'),null);assert.equal(h.run('player().runs.length'),1);
});

function memoryStorage(){let value=null;return {getItem:()=>value,setItem:(key,next)=>value=next};}


