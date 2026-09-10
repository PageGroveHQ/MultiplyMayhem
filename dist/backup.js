import {parseSave,DEFAULT_AVATAR} from './progress.js';
import {GAMES} from './math-games.js';
const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
export function exportBackup(data){return JSON.stringify({app:'star-quest',exportedAt:new Date().toISOString(),save:data},null,2);}
export function readBackup(text){
 if(typeof text!=='string'||text.length>5*1024*1024)throw Error('Choose a Star Quest backup smaller than 5 MB.');
 let input;try{input=JSON.parse(text);}catch{throw Error('This file is not valid JSON. Choose a Star Quest backup.');}
 if(input.app!=='star-quest')throw Error('This is not a Star Quest backup.');
 const data=parseSave(JSON.stringify(input.save));if(data.players.length>100)throw Error('This backup has too many players.');let total=0;
 for(const p of data.players){if(!p.id||p.id.length>100||!p.name.trim()||p.name.length>100||p.runs.length>10000)throw Error('A player in this backup is invalid.');for(const r of p.runs){if(typeof r.id!=='string'||r.id.length>100||r.answers.length>1000||!Array.isArray(r.tables)||r.tables.some(n=>!integer(n,0,9))||(r.operation&&!GAMES.some(g=>g.id===r.operation)))throw Error('A mission in this backup is invalid.');if((r.totalFacts!==undefined&&!integer(r.totalFacts,1,1000))||(r.timeLimitMs!==undefined&&![0,60000,180000,300000].includes(r.timeLimitMs))||(r.elapsedMs!==undefined&&(!Number.isFinite(r.elapsedMs)||r.elapsedMs<0))||(r.roundSize!==undefined&&!['all',10,20].includes(r.roundSize)))throw Error('Mission settings in this backup are invalid.');total+=r.answers.length;if(total>100000)throw Error('This backup has too many answers.');for(const f of r.answers){const op=f.operation||r.operation||'multiply';if(!GAMES.some(g=>g.id===op)||!integer(f.a,0,op==='multiply'?9:999)||!integer(f.b,0,op==='multiply'?9:999)||typeof f.ok!=='boolean'||(op==='subtract'&&f.a<f.b)||(op==='add'&&f.a+f.b>999))throw Error('An answer in this backup is invalid.');}}
  const a=p.avatar||{};p.avatar={...DEFAULT_AVATAR,...Object.fromEntries(Object.entries(a).filter(([key,value])=>Object.hasOwn(DEFAULT_AVATAR,key)&&(key==='hair'?integer(value,0,5):typeof value==='string'&&value.length<40)))};
 }
 if(new Set(data.players.map(p=>p.id)).size!==data.players.length)throw Error('This backup has duplicate player IDs.');return data;
}
export function mergeBackup(current,incoming){const next=structuredClone(current);let players=0,runs=0;
 for(const p of incoming.players){const existing=next.players.find(x=>x.id===p.id);if(existing){const ids=new Set(existing.runs.map(r=>r.id));for(const r of p.runs)if(!ids.has(r.id)){existing.runs.push(structuredClone(r));ids.add(r.id);runs++;}existing.runs.sort((a,b)=>String(a.endedAt||'').localeCompare(String(b.endedAt||'')));}else{const copy=structuredClone(p);const names=new Set(next.players.map(x=>x.name.toLowerCase()));let name=copy.name.slice(0,20),suffix=1;while(names.has(name.toLowerCase())){const tail=' ('+suffix+++')';name=copy.name.slice(0,20-tail.length)+tail;}copy.name=name;copy.runs=[...new Map(copy.runs.map(r=>[r.id,r])).values()];next.players.push(copy);players++;runs+=copy.runs.length;}}
 if(!next.activeId)next.activeId=next.players[0]?.id||null;return {data:next,players,runs};
}
