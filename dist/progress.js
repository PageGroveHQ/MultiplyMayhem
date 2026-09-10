import {GAMES,story} from './math-games.js';
import {isFinishedTrial,bestTrial,analyzeRun} from './analysis.js';
export const STORAGE_KEY='star-quest.players.v1';
export const DEFAULT_AVATAR={hair:0,hairColor:'#54351f',skin:'#e9ad79',eyes:'#497eb8',shirt:'#795bce',style:'plain',accessory:'none',backdrop:'#243c60'};
export const WORLDS=[
 {id:'cosmos',name:'Cosmic Circuit',subtitle:'Charge up the next discovery',character:'Your bot buddy',image:'circuit-world.png'},
 {id:'skylands',name:'Skyland Scouts',subtitle:'A new adventure above the clouds',character:'Your bot buddy',image:'sky-world.png'},
];
export function emptySave(){return {version:1,activeId:null,players:[]};}
export function parseSave(raw){
 if(!raw)return emptySave();const data=JSON.parse(raw);
 if(data.version!==1||!Array.isArray(data.players)||data.players.some(p=>!p||typeof p.id!=='string'||typeof p.name!=='string'||!Array.isArray(p.runs)||p.runs.some(r=>!Array.isArray(r.answers))))throw Error('Save format not recognized');
 return data;
}
export class LocalSave{
 constructor(storage){this.storage=storage;this.error='';this.blocked=false;try{this.data=parseSave(storage.getItem(STORAGE_KEY));}catch{this.data=emptySave();this.blocked=true;this.error='Your browser save could not be read. Existing data has been left untouched. You can play this session, but new progress will not be saved.';}}
 update(change){let next;try{next=this.blocked?structuredClone(this.data):parseSave(this.storage.getItem(STORAGE_KEY));}catch{next=structuredClone(this.data);this.blocked=true;this.error='Your browser save could not be read. Existing data has been left untouched. New progress is available in this session only.';}change(next);this.data=next;if(this.blocked)return false;
  try{this.storage.setItem(STORAGE_KEY,JSON.stringify(next));this.error='';return true;}
  catch{this.blocked=true;this.error='This browser could not save your progress. Keep this tab open to keep playing; changes in this session may be lost when you leave.';return false;}
 }
}
export function summarize(runs){
 const tables=Array.from({length:10},(_,a)=>({a,attempts:0,correct:0,seen:new Set(),needs:new Set()}));let attempts=0,correct=0,firstAttempts=0,firstCorrect=0,comebacks=0;const latest=new Map();
 for(const run of runs)for(const answer of run.answers){const {a,b,ok,retry}=answer;if(!Number.isInteger(a)||!Number.isInteger(b))continue;attempts++;if(ok)correct++;if(retry&&ok)comebacks++;if(!retry){firstAttempts++;if(ok)firstCorrect++;}if((answer.operation||run.operation||'multiply')!=='multiply'||a<0||a>9||b<0||b>9)continue;if(!retry){tables[a].attempts++;if(ok)tables[a].correct++;}tables[a].seen.add(b);latest.set(`${a},${b}`,answer);}
 for(const x of latest.values())if(!x.ok)tables[x.a].needs.add(x.b);
 return {runs:runs.length,attempts,correct,firstAttempts,firstCorrect,comebacks,tables,latest};
}
export const BADGES=[
 {id:'first',icon:'✦',title:'Adventure begins',description:'Complete your first mission.',goal:1,value:s=>s.runs},
 {id:'practice',icon:'◆',title:'Brain builder',description:'Explore 50 cards, including retries.',goal:50,value:s=>s.attempts},
 {id:'comeback',icon:'↗',title:'Try-again hero',description:'Get a practice-again card correct.',goal:1,value:s=>s.comebacks},
 {id:'regular',icon:'★',title:'Quest keeper',description:'Complete 5 missions.',goal:5,value:s=>s.runs},
 {id:'tables',icon:'▦',title:'Table explorer',description:'Try a fact from each of the 10 tables.',goal:10,value:s=>s.tables.filter(t=>t.seen.size).length},
 {id:'worlds',icon:'◇',title:'World traveler',description:'Finish a mission with each of the two backdrops.',goal:2,value:(s,runs)=>new Set(runs.map(r=>r.world)).size},
 {id:'hundred',icon:'✧',title:'Galaxy of discoveries',description:'Explore all 100 different facts.',goal:100,value:s=>s.latest.size},
 {id:'stars',icon:'✺',title:'Star collector',description:'Collect 100 correct-answer stars.',goal:100,value:s=>s.correct},
 {id:'solo-typing',icon:'⌨',title:'Solo pilot',description:'Finish a solo typing mission with at least one answer.',goal:1,value:(s,r)=>r.filter(x=>x.mode==='solo'&&x.format==='typing'&&x.answers.length).length},
 {id:'solo-choice',icon:'③',title:'Signal finder',description:'Finish a multiple-choice mission with at least one answer.',goal:1,value:(s,r)=>r.filter(x=>x.mode==='solo'&&x.format==='choice'&&x.answers.length).length},
 {id:'solo-mixed',icon:'⇄',title:'Switch expert',description:'Finish a mixed solo mission with at least two answers.',goal:1,value:(s,r)=>r.filter(x=>x.mode==='solo'&&x.format==='mixed'&&x.answers.length>=2).length},
 {id:'crew',icon:'⊕',title:'Flight crew',description:'Complete a mission together in Parent-led mode.',goal:1,value:(s,r)=>r.filter(x=>x.mode!=='solo'&&x.answers.length).length},
 {id:'trial-first',icon:'◷',title:'Launch window',description:'Finish a capped time trial with at least one answer.',goal:1,value:(s,r)=>r.filter(x=>x.timed&&x.trialVersion===2&&x.answers.length).length},
 {id:'trial-clear',icon:'⚑',title:'Ahead of the clock',description:'Answer every selected fact before the time limit.',goal:1,value:(s,r)=>r.filter(isFinishedTrial).length},
 {id:'trial-perfect',icon:'✵',title:'Precision pilot',description:'Finish a time trial with every answer correct.',goal:1,value:(s,r)=>r.filter(x=>isFinishedTrial(x)&&analyzeRun(x).accuracy===100).length},
 {id:'trial-hundred',icon:'▦',title:'Full galaxy flight',description:'Complete all 100 facts in one time trial.',goal:1,value:(s,r)=>r.filter(x=>(x.operation||'multiply')==='multiply'&&isFinishedTrial(x)&&analyzeRun(x).total===100).length},
 {id:'trial-record',icon:'↗',title:'Personal best',description:'Beat your previous completion time for the same trial settings.',goal:1,value:(s,r)=>r.filter((x,i)=>{const best=bestTrial(r.slice(0,i),x);return isFinishedTrial(x)&&best&&x.elapsedMs<best.elapsedMs;}).length},
];
// Registry-driven achievements: every new game and variant receives badges.
BADGES.push(...GAMES.flatMap(g=>[
 {id:'discover-'+g.id,icon:g.icon,title:g.name+' navigator',description:'Finish a '+g.name.toLowerCase()+' mission with at least one answer.',goal:1,value:(s,r)=>r.filter(x=>(x.operation||'multiply')===g.id&&x.answers.length).length},
 {id:'practice-'+g.id,icon:g.icon,title:g.name+' builder',description:'Answer 50 '+g.name.toLowerCase()+' questions correctly, including retries.',goal:50,value:(s,r)=>r.filter(x=>(x.operation||'multiply')===g.id).reduce((n,x)=>n+x.answers.filter(a=>a.ok).length,0)},
 ...g.variants.map(v=>({id:'variant-'+g.id+'-'+v.id,icon:g.icon,title:v.name+' explorer',description:'Explore 10 first-try questions in '+v.name.toLowerCase()+'.',goal:10,value:(s,r)=>r.filter(x=>(x.operation||'multiply')===g.id&&(x.variant||'tables')===v.id).reduce((n,x)=>n+x.answers.filter(a=>!a.retry).length,0)}))
]),...[1,3,5].map(minutes=>({id:'timer-'+minutes,icon:'◷',title:minutes+'-minute navigator',description:'Finish a '+minutes+'-minute challenge with at least one answer.',goal:1,value:(s,r)=>r.filter(x=>x.timed&&(x.timeLimitMs||300000)===minutes*60000&&x.answers.length).length})),{id:'starway',icon:'✧',title:'Starway guardian',description:'Complete all six story missions.',goal:6,value:(s,r)=>story(r).chapter});
export function earnedBadges(runs){const s=summarize(runs);return BADGES.filter(b=>b.value(s,runs)>=b.goal).map(b=>b.id);}
export function recordRun(player,run){if(player.runs.some(r=>r.id===run.id))return [];const before=new Set(earnedBadges(player.runs));player.runs.push(run);return earnedBadges(player.runs).filter(id=>!before.has(id));}
export function practiceDeck(player,tables,limit){const s=summarize(player.runs);return tables.flatMap(a=>Array.from({length:10},(_,b)=>({a,b}))).map(f=>({fact:f,rank:!s.latest.has(`${f.a},${f.b}`)?1:s.latest.get(`${f.a},${f.b}`).ok?2:0,tie:Math.random()})).sort((x,y)=>x.rank-y.rank||x.tie-y.tie).slice(0,limit).map(x=>x.fact);}

