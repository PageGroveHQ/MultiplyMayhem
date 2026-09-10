import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GAMES,arithmeticBank,result,regroupSteps,arithmeticChoices,factKey,story,orderedPractice} from '../dist/math-games.js';
import {BADGES,summarize,earnedBadges} from '../dist/progress.js';
import {Session} from '../dist/session.js';
import {analyzeRun,trialKey,isFinishedTrial} from '../dist/analysis.js';
test('all 80 arithmetic questions are unique, grade-level, and correctly explained by place value',()=>{
 for(const op of ['add','subtract'])for(const variant of ['two','three']){
  const bank=arithmeticBank(op,variant);assert.equal(bank.length,20);assert.equal(new Set(bank.map(factKey)).size,20);
  for(const f of bank){assert.ok(result(f)>=0&&result(f)<1000);const steps=regroupSteps(f);assert.ok(steps.some(s=>s.trade||s.carry),'Every question must regroup');const digits=steps.filter(s=>s.digit!==undefined);assert.equal(digits.reduce((n,s,i)=>n+s.digit*10**i,0),result(f));for(const step of steps)assert.doesNotMatch(step.text,/undefined|NaN/);const choices=arithmeticChoices(f);assert.equal(new Set(choices).size,3);assert.equal(choices.filter(n=>n===result(f)).length,1);assert.ok(choices.every(n=>n>=0&&n<1000));}
 }
 const zero=regroupSteps({a:300,b:124,operation:'subtract'});assert.deepEqual(zero[0].digits,[10,9,2]);assert.match(zero[0].text,/Trade 1 hundred for 10 tens. Trade 1 ten for 10 ones/);
 assert.equal(regroupSteps({a:168,b:275,operation:'add'}).filter(s=>s.carry).length,2);
});
test('arithmetic retries preserve operation, and statistics never pollute multiplication',()=>{
 const f=arithmeticBank('add')[0],session=new Session([f]);session.mark(false,1);session.next();assert.equal(session.card.operation,'add');session.mark(true,result(f));session.next();const run={operation:'add',variant:'two',totalFacts:1,answers:session.answers};const stats=summarize([run]);assert.equal(stats.attempts,2);assert.equal(stats.correct,1);assert.equal(stats.comebacks,1);assert.equal(stats.latest.size,0);assert.equal(stats.tables[0].seen.size,0);assert.equal(analyzeRun(run).attempted,1);assert.equal(analyzeRun(run).misses.length,1);
 assert.equal(orderedPractice(arithmeticBank('add'),[{answers:[{...f,ok:false}]}])[0].a,f.a);
});
test('every registered game and variant has achievements; timers and story have their own milestones',()=>{
 for(const g of GAMES){assert.ok(BADGES.some(b=>b.id==='discover-'+g.id));assert.ok(BADGES.some(b=>b.id==='practice-'+g.id));for(const v of g.variants)assert.ok(BADGES.some(b=>b.id==='variant-'+g.id+'-'+v.id));}
 const run={storyVersion:1,operation:'subtract',variant:'three',answers:arithmeticBank('subtract','three').map(f=>({...f,ok:true})),endReason:'completed',timed:true,timeLimitMs:60000};assert.ok(earnedBadges([run]).includes('variant-subtract-three'));assert.ok(earnedBadges([run]).includes('timer-1'));assert.equal(story([{...run,endReason:'expired'}]).chapter,0);assert.equal(story(Array(8).fill(run)).chapter,6);
});
test('records isolate operation, level, question set and all timer durations',()=>{
 const r={operation:'add',variant:'two',mode:'solo',format:'choice',tables:[],totalFacts:20,timeLimitMs:60000,timed:true,trialVersion:2,endReason:'completed',elapsedMs:59000,answers:arithmeticBank('add').map(f=>({...f,ok:true}))};assert.ok(isFinishedTrial(r));assert.equal(isFinishedTrial({...r,elapsedMs:61000}),false);for(const extra of [{operation:'subtract'},{variant:'three'},{timeLimitMs:180000},{timeLimitMs:300000},{questionSet:'different'}])assert.notEqual(trialKey(r),trialKey({...r,...extra}));
});

