import {regroupSteps,operation,factKey,arithmeticBank} from './math-games.js';
export const SKILLS=[
 {id:'add-small',name:'Single-digit addition',operation:'add',variant:'blitz',example:{a:4,b:3,operation:'add'}},
 {id:'make-ten',name:'Making a ten',operation:'add',variant:'carry',example:{a:8,b:7,operation:'add'}},
 {id:'carry-ones',name:'Carrying from ones',operation:'add',variant:'two',example:{a:27,b:15,operation:'add'}},
 {id:'carry-tens',name:'Carrying from tens',operation:'add',variant:'three',example:{a:168,b:275,operation:'add'}},
 {id:'borrow-ones',name:'Borrowing into ones',operation:'subtract',variant:'two',example:{a:42,b:17,operation:'subtract'}},
 {id:'borrow-tens',name:'Borrowing into tens',operation:'subtract',variant:'three',example:{a:342,b:176,operation:'subtract'}},
 {id:'borrow-zero',name:'Borrowing through zero',operation:'subtract',variant:'three',example:{a:300,b:124,operation:'subtract'}},
];
export function factSkills(f){const op=operation(f);if(op==='multiply')return [];const steps=regroupSteps(f),ids=[];if(op==='add'){if(f.a<10&&f.b<10)ids.push('add-small');if(f.a<10&&f.b<10&&f.a+f.b>=10)ids.push('make-ten');if(steps.some(s=>s.place==='ones'&&s.carry))ids.push('carry-ones');if(steps.some(s=>s.place==='tens'&&s.carry))ids.push('carry-tens');}else{if(steps.some(s=>s.place==='ones'&&s.trade))ids.push('borrow-ones');if(steps.some(s=>s.place==='tens'&&s.trade))ids.push('borrow-tens');if(steps.some(s=>s.trade&&s.text.includes('Trade 1 hundred')&&s.text.includes('Trade 1 ten')))ids.push('borrow-zero','borrow-tens');}return [...new Set(ids)];}
export function skillReport(runs){return SKILLS.map(skill=>{const answers=runs.flatMap(r=>r.answers.map(f=>({...f,operation:f.operation||r.operation})).filter(f=>!f.retry&&factSkills(f).includes(skill.id))),recent=answers.slice(-12),previous=answers.slice(-24,-12),distinct=new Set(recent.map(factKey)).size,accuracy=recent.length?Math.round(recent.filter(a=>a.ok).length/recent.length*100):null,enough=recent.length>=8&&distinct>=4,prior=previous.length>=5?Math.round(previous.filter(a=>a.ok).length/previous.length*100):null;return {...skill,attempts:answers.length,recent:recent.length,distinct,accuracy,status:!enough?'Still exploring':accuracy>=85?'Looking strong':prior!==null&&accuracy>=prior+15?'Improving':'Needs practice',example:recent.find(a=>!a.ok)||skill.example};});}
export function skillBank(id){const skill=SKILLS.find(s=>s.id===id);return skill?arithmeticBank(skill.operation,skill.variant).filter(f=>factSkills(f).includes(id)):[];}
