// Add games here: the hub and discovery/practice achievements use this registry.
export const GAMES=[
 {id:'multiply',name:'Multiplication',icon:'×',role:'Power the engines',description:'Build equal groups to charge the Starway engines.',variants:[{id:'tables',name:'Times tables · 0–9'}]},
 {id:'add',name:'Addition',icon:'+',role:'Build the bridges',description:'Combine supplies and trade ones for tens to rebuild the bridges.',variants:[{id:'blitz',name:'Addition blitz · 1–9 + 1–9'},{id:'carry',name:'Addition blitz · carrying only'},{id:'two',name:'2-digit carrying'},{id:'three',name:'3-digit carrying'}]},
 {id:'subtract',name:'Subtraction',icon:'−',role:'Repair the signals',description:'Find what is left. Regroup tens and hundreds to repair the signals.',variants:[{id:'two',name:'2-digit borrowing'},{id:'three',name:'3-digit borrowing · includes zeros'}]},
];
export const gameFor=id=>GAMES.find(g=>g.id===id)||GAMES[0];
export const operation=f=>f.operation||'multiply';
export const result=f=>operation(f)==='add'?f.a+f.b:operation(f)==='subtract'?f.a-f.b:f.a*f.b;
export const symbol=f=>gameFor(operation(f)).icon;
export const factKey=f=>`${operation(f)}:${f.a},${f.b}`;
export const factLabel=f=>`${f.a} ${symbol(f)} ${f.b} = ${result(f)}`;
export function shuffled(cards,random=Math.random){const deck=[...cards];for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}
// Fixed, finite banks make completion records comparable. Each question needs regrouping.
const banks={
 add:{two:[[27,15],[38,24],[46,17],[59,23],[18,36],[65,18],[47,28],[26,49],[37,46],[58,16],[19,54],[29,32],[48,35],[67,16],[39,44],[55,27],[28,57],[36,48],[49,26],[17,68]],
 three:[[168,275],[286,357],[475,268],[587,196],[398,247],[365,218],[247,328],[126,449],[337,246],[458,216],[219,354],[329,232],[248,335],[367,216],[139,444],[255,327],[128,557],[236,448],[349,226],[417,268]]},
 subtract:{two:[[42,17],[53,26],[61,38],[74,29],[85,47],[93,56],[32,18],[54,27],[71,46],[82,35],[60,24],[90,53],[40,16],[50,28],[70,39],[81,64],[92,75],[63,48],[52,36],[31,19]],
 three:[[342,127],[453,226],[561,238],[674,329],[785,447],[893,556],[432,218],[654,327],[771,446],[882,535],[300,124],[500,253],[402,176],[603,228],[704,339],[801,464],[902,575],[630,248],[520,136],[410,219]]},
};
export function arithmeticBank(id,variant='two'){if(id==='add'&&['blitz','carry'].includes(variant))return Array.from({length:9},(_,i)=>i+1).flatMap(a=>Array.from({length:9},(_,i)=>({a,b:i+1,operation:id,variant}))).filter(f=>variant==='blitz'||f.a+f.b>=10);return (banks[id]?.[variant]||[]).map(([a,b])=>({a,b,operation:id,variant}));}
export function orderedPractice(cards,runs){const latest=new Map();for(const r of runs)for(const f of r.answers)latest.set(factKey({...f,operation:f.operation||r.operation}),f.ok);return shuffled(cards).sort((a,b)=>(latest.has(factKey(a))?(latest.get(factKey(a))?2:0):1)-(latest.has(factKey(b))?(latest.get(factKey(b))?2:0):1));}
export function arithmeticChoices(f,random=Math.random){const correct=result(f),pool=[...new Set([correct+10,correct-10,correct+1,correct-1,correct+100,correct-100,0,1,2])].filter(x=>x>=0&&x<=((f.a<10&&f.b<10)?18:999)&&x!==correct);return shuffled([correct,...shuffled(pool,random).slice(0,2)],random);}
export function regroupSteps(f){
 const names=['ones','tens','hundreds'],top=String(f.a).padStart(3,'0').split('').reverse().map(Number),bottom=String(f.b).padStart(3,'0').split('').reverse().map(Number),steps=[];let carry=0;
 const width=Math.max(String(f.a).length,String(f.b).length,String(result(f)).length);
 for(let i=0;i<width;i++){
  if(operation(f)==='add'){
   const sum=top[i]+bottom[i]+carry;let text=`${names[i]}: ${top[i]} + ${bottom[i]}${carry?' + 1 carried over':''} = ${sum}. `;
   text+=sum>=10?`Trade 10 ${names[i]} for 1 ${names[i+1]?.slice(0,-1)||'thousand'}. Write ${sum%10} in the ${names[i]} column and carry 1 to the next column.`:`Write ${sum} in the ${names[i]} column.`;
   carry=Math.floor(sum/10);steps.push({place:names[i],text,digits:[...top],digit:sum%10,carry});
  }else{
   if(top[i]<bottom[i]){let donor=i+1;while(top[donor]===0)donor++;const parts=[];for(let j=donor;j>i;j--){top[j]--;top[j-1]+=10;parts.push(`Trade 1 ${names[j].slice(0,-1)} for 10 ${names[j-1]}`);}steps.push({place:names[i],text:`${top[i]-10} ${names[i]} is not enough to take away ${bottom[i]}. ${parts.join('. ')}. Now the number is ${top[2]} hundreds, ${top[1]} tens, ${top[0]} ones.`,digits:[...top],trade:true});}
   steps.push({place:names[i],text:`${names[i]}: ${top[i]} − ${bottom[i]} = ${top[i]-bottom[i]}. Write ${top[i]-bottom[i]} in the ${names[i]} column.`,digits:[...top],digit:top[i]-bottom[i]});
  }
 }
 return steps;
}
export function teachingText(f){if(operation(f)==='multiply')return f.a===0||f.b===0?'Zero groups or zero in each group means 0.':`${Array(f.a).fill(f.b).join(' + ')} = ${result(f)}`;return regroupSteps(f).map(s=>s.text).join(' ');}
export const CHAPTERS=[
 ['Wake the beacon','A meteor shower scattered the Starway’s power cells. Your robot buddy Nova needs a navigator. Finish a mission to wake the first beacon.'],
 ['Reach the sky docks','The first beacon is glowing! The sky docks can hear Nova now. Finish another mission to reconnect their landing lights.'],
 ['Open the supply bridge','The landing lights are back. A supply ship is waiting at a broken bridge. Your next mission will help it cross.'],
 ['Find the lost scouts','The supplies arrived! Two scout bots are sending a faint signal. Finish a mission to guide them home.'],
 ['Power the observatory','The scouts are safe. They found the final relay near the observatory. One more mission will bring it online.'],
 ['Light the Starway','All the relays are ready. Complete a final mission to connect them and light the way home.'],
];
export function story(runs){const completed=runs.filter(r=>r.storyVersion===1&&r.endReason!=='expired'&&r.answers.some(a=>!a.retry)).length,chapter=Math.min(completed,CHAPTERS.length);return {completed,chapter,title:CHAPTERS[chapter]?.[0]||'The Starway is shining!',text:CHAPTERS[chapter]?.[1]||'You brought the ships home. Nova’s next job is to keep the route safe. Every new mission is another patrol together.'};}
