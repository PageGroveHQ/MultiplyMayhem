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
 for(const run of runs)for(const answer of run.answers){const {a,b,ok,retry}=answer;if(!Number.isInteger(a)||a<0||a>9||!Number.isInteger(b)||b<0||b>9)continue;attempts++;if(ok)correct++;if(retry&&ok)comebacks++;if(!retry){firstAttempts++;if(ok)firstCorrect++;tables[a].attempts++;if(ok)tables[a].correct++;}tables[a].seen.add(b);latest.set(`${a},${b}`,answer);}
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
];
export function earnedBadges(runs){const s=summarize(runs);return BADGES.filter(b=>b.value(s,runs)>=b.goal).map(b=>b.id);}
export function recordRun(player,run){if(player.runs.some(r=>r.id===run.id))return [];const before=new Set(earnedBadges(player.runs));player.runs.push(run);return earnedBadges(player.runs).filter(id=>!before.has(id));}
export function practiceDeck(player,tables,limit){const s=summarize(player.runs);return tables.flatMap(a=>Array.from({length:10},(_,b)=>({a,b}))).map(f=>({fact:f,rank:!s.latest.has(`${f.a},${f.b}`)?1:s.latest.get(`${f.a},${f.b}`).ok?2:0,tie:Math.random()})).sort((x,y)=>x.rank-y.rank||x.tie-y.tie).slice(0,limit).map(x=>x.fact);}

