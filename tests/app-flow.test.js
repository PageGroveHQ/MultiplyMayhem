import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {webcrypto} from 'node:crypto';
import {makeDeck,explanation} from '../dist/engine.js';import * as progress from '../dist/progress.js';import {Session} from '../dist/session.js';
const source=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import .*\n/gm,'');
function harness(storage){const el=()=>({innerHTML:'',dataset:{},classList:{toggle(){}},setAttribute(){},querySelectorAll:()=>[],querySelector:()=>null,focus(){}});const app=el(),controls={'#app':app,'#player-nav':el(),'#main-nav':el()};const context=vm.createContext({...progress,Session,makeDeck,explanation,drawAvatar(){},crypto:webcrypto,structuredClone,window:{localStorage:storage,scrollTo(){},addEventListener(){}},document:{body:{dataset:{}},querySelector:x=>controls[x]||null,querySelectorAll:()=>[],addEventListener(){}}});vm.runInContext(source,context);return {run:s=>vm.runInContext(s,context),html:()=>app.innerHTML};}
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
 h.run('act("new");editor.name="Comet";act("hair:5");act("pattern:jersey");act("gear:glasses");savePlayer();act("start");while(page==="play"){act("right");act("next");}');
 h.run('act("edit:"+player().id);act("hair:3");act("reset-avatar");');assert.equal(h.run('editor.avatar.hair'),5);assert.equal(h.run('editor.avatar.style'),'jersey');
 h.run('act("shuffle-avatar");');assert.ok(h.run('editor.avatar.hair>=0&&editor.avatar.hair<6'));h.run('act("reset-avatar");savePlayer();');
 const again=harness(storage);assert.equal(again.run('player().avatar.hair'),5);assert.equal(again.run('player().runs.length'),1);assert.equal(again.run('player().avatar.accessory'),'glasses');
});
test('bot poses follow feedback and correction shows exact equal groups',()=>{const h=harness({getItem:()=>null,setItem(){}});h.run('act("new");editor.name="Comet";savePlayer();act("start");session=new Session([{a:5,b:5}]);render();');assert.match(h.html(),/bot-sprite idle/);
 h.run('act("wrong");');assert.match(h.html(),/bot-sprite teach/);assert.equal((h.html().match(/class="power-pack"/g)||[]).length,5);assert.equal((h.html().match(/<i><\/i>/g)||[]).length,25);assert.match(h.html(),/5 \+ 5 \+ 5 \+ 5 \+ 5 = 25/);
 h.run('act("undo");act("right");');assert.match(h.html(),/bot-sprite cheer/);
});

