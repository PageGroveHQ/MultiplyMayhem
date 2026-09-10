export function analyzeRun(run){
 const facts=new Map();for(const answer of run.answers)if(!answer.retry)facts.set(`${answer.a},${answer.b}`,answer);
 const answers=[...facts.values()],correct=answers.filter(x=>x.ok).length,misses=answers.filter(x=>!x.ok),total=run.totalFacts||(run.timed?new Set(run.tables).size*10:answers.length);
 const elapsed=Number.isFinite(run.elapsedMs)?run.elapsedMs:null;
 const tables=[...new Set(run.tables)].sort((a,b)=>a-b).map(a=>{const attempts=answers.filter(x=>x.a===a);return {a,attempts:attempts.length,correct:attempts.filter(x=>x.ok).length};});
 return {attempted:answers.length,correct,misses,total,remaining:Math.max(0,total-answers.length),accuracy:answers.length?Math.round(correct/answers.length*100):null,elapsed,tables};
}
export function trialKey(run){return JSON.stringify([run.mode||'parent',run.mode==='solo'?run.format:null,[...new Set(run.tables)].sort((a,b)=>a-b),!!run.smart]);}
export function isFinishedTrial(run){return run.timed&&run.trialVersion===2&&run.endReason==='completed'&&Number.isFinite(run.elapsedMs)&&run.elapsedMs>=0&&run.elapsedMs<=300000&&analyzeRun(run).remaining===0;}
export function bestTrial(runs,run){return runs.filter(r=>r.id!==run.id&&isFinishedTrial(r)&&trialKey(r)===trialKey(run)).sort((a,b)=>a.elapsedMs-b.elapsedMs)[0]||null;}
export function isRecord(runs,run){const best=bestTrial(runs,run);return isFinishedTrial(run)&&(!best||run.elapsedMs<best.elapsedMs);}
export function durationLabel(ms){const tenths=Math.floor(Math.max(0,ms)/100);return `${Math.floor(tenths/600)}:${String(Math.floor(tenths/10)%60).padStart(2,'0')}.${tenths%10}`;}


