export const CHALLENGE_MS=5*60*1000;
export function answerStyle(format,position){return format==='mixed'?(position%2?'choice':'typing'):format;}
export function parseAnswer(raw,max=81){const text=String(raw).trim();return /^\d{1,3}$/.test(text)&&Number(text)<=max?Number(text):null;}
export function answerChoices(a,b,random=Math.random){
 const correct=a*b,candidates=[correct-a,correct+a,correct-b,correct+b,correct-1,correct+1,...Array.from({length:82},(_,i)=>i)];
 const unique=[...new Set(candidates)].filter(x=>x>=0&&x<=81&&x!==correct);
 const nearby=unique.slice(0,Math.min(6,unique.length));
 for(let i=nearby.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[nearby[i],nearby[j]]=[nearby[j],nearby[i]];}
 const options=[correct,...nearby.slice(0,2)];
 for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}return options;
}
export function remainingSeconds(deadline,now=Date.now()){return Math.max(0,Math.ceil((deadline-now)/1000));}
export function clockLabel(seconds){return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
export function runLabel(run){return `${run.mode==='solo'?'Solo · '+({typing:'Typing',choice:'Multiple choice',mixed:'Mixed',columns:'Column math',blocks:'Place-value blocks'}[run.format]||'Typing'):'Parent-led'}${run.timed?' · '+((run.timeLimitMs||CHALLENGE_MS)/60000)+'-minute challenge':''}`;}
