import {makeDeck,explanation} from './engine.js';
const app=document.querySelector('#app');
let selected=[0,1,2,3,4,5,6,7,8,9], roundSize=10, deck=[], index=0, correct=0, missed=[], phase='setup', feedback=null;
const cheers=['Stellar work!','You figured it out!','That brain is powering up!','Another discovery!','You nailed it!'];
function button(label,action,cls=''){return `<button class="${cls}" data-action="${action}">${label}</button>`;}
function render(){
 if(phase==='setup'){
 app.innerHTML=`<section class="setup"><div class="intro"><div class="eyebrow">READY, PLAYER ONE?</div><h1>Small numbers.<br><em>Big adventure.</em></h1><p>Fuel your spaceship with multiplication.<br>Every discovery brings you closer to the stars.</p><img class="mascot" src="./robot.png" alt="A friendly space robot and its star companion"><div class="companion"><span>✦</span><div><strong>Meet your mission buddy.</strong><br>Learning is our superpower.</div></div></div><div class="mission-panel"><div class="panel-heading"><span class="step">01</span><div><h2>Choose your mission</h2><p>Which times tables shall we explore?</p></div></div><div class="presets">${button('All tables','all',selected.length===10?'selected':'')}${button('Odds','odd',same([1,3,5,7,9])?'selected':'')}${button('Evens','even',same([0,2,4,6,8])?'selected':'')}</div><div class="tables">${Array.from({length:10},(_,i)=>`<button data-table="${i}" aria-pressed="${selected.includes(i)}" class="table ${selected.includes(i)?'selected':''}">${i}<small>times table</small></button>`).join('')}</div><p class="hint">Pick one table or mix a few. Each table includes ×0 through ×9.</p><div class="round"><label for="length">Mission length</label><select id="length"><option value="10" ${roundSize===10?'selected':''}>10 cards · quick adventure</option><option value="20" ${roundSize===20?'selected':''}>20 cards · keep exploring</option><option value="all" ${roundSize==='all'?'selected':''}>Every selected fact</option></select></div><button class="primary start" data-action="start" ${selected.length?'':'disabled'}>Let's play <span>→</span></button><div class="parent-tip"><strong>Grown-up is the game controller</strong><p>Hold the screen for your child. Swipe right for correct, left to practice — or use the buttons. No typing. No timer.</p></div></div></section>`;
 }else if(phase==='play'){
 const {a,b}=deck[index];
 app.innerHTML=`<section class="play"><div class="play-toolbar">${button('← Missions','home','quiet')}<span>MISSION IN PROGRESS</span><strong class="stars">✦ ${correct}</strong></div><div class="progress-label"><span>Card ${index+1} of ${deck.length}</span><span>${selected.length===10?'All tables':selected.join(', ')+' times tables'}</span></div><progress value="${index}" max="${deck.length}"></progress><div class="flashcard ${feedback===true?'success':feedback===false?'learning':''}" id="card"><div class="eyebrow">${feedback===null?'YOUR NEXT DISCOVERY':feedback?'STAR COLLECTED':'LET’S BUILD IT TOGETHER'}</div><div class="equation">${a} <span>×</span> ${b}${feedback!==null?`<span>=</span> ${a*b}`:''}</div>${feedback===null?'<p class="card-prompt">What do you think?</p><div class="orbit">✦</div>':feedback?`<h2>${cheers[index%cheers.length]}</h2><p>You earned a star. Keep exploring!</p>`:`<h2>Good try. Let’s take a closer look.</h2><p>${a} groups of ${b} ${a&&b?'looks like this:':''}</p><div class="groups">${a&&b?Array.from({length:a},()=>`<div class="group" aria-label="${b} dots">${'<i></i>'.repeat(b)}</div>`).join(''):''}</div><p class="addition">${explanation(a,b)}</p><p class="gentle">Say it together: ${a} times ${b} equals ${a*b}.</p>`}</div>${feedback===null?`<div class="answer-controls">${button('← Let’s practice','wrong','practice')}${button('Got it! →','right','primary')}</div><p class="hint center">Swipe left to learn · Swipe right to celebrate<br>Keyboard: ← practice · → correct</p>`:`<div class="continue">${button(index+1===deck.length?'Finish mission ✦':'Next discovery →','next','primary')}</div>`}</section>`;
 bindSwipe();
 }else{
 app.innerHTML=`<section class="finish"><div class="trophy">✦</div><div class="eyebrow">MISSION COMPLETE</div><h1>Look how far<br><em>you’ve come!</em></h1><p>You explored ${deck.length} multiplication facts.</p><div class="results"><div><strong>${correct}</strong><span>stars collected</span></div><div><strong>${missed.length}</strong><span>facts to grow with</span></div></div><p>Every practice makes your brain stronger.</p>${missed.length?button('Practice those discoveries →','retry','primary'):button('Play again →','start','primary')}${button('Choose a new mission','home','quiet')}</section>`;
 }
 app.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>act(b.dataset.action));
 app.querySelectorAll('[data-table]').forEach(b=>b.onclick=()=>{const n=+b.dataset.table;selected=selected.includes(n)?selected.filter(x=>x!==n):[...selected,n].sort((a,b)=>a-b);render();});
 const length=app.querySelector('#length');if(length)length.onchange=()=>{roundSize=length.value==='all'?'all':+length.value;};
}
function same(arr){return selected.join()===arr.join();}
function start(cards){deck=cards;index=0;correct=0;missed=[];feedback=null;phase='play';render();}
function act(action){
 if(action==='all'||action==='odd'||action==='even'){selected=Array.from({length:10},(_,i)=>i).filter(i=>action==='all'||i%2===(action==='odd'?1:0));render();}
 if(action==='start'&&selected.length){const cards=makeDeck(selected);start(cards.slice(0,roundSize==='all'?cards.length:roundSize));}
 if(action==='home'){phase='setup';render();}
 if(action==='retry')start([...missed]);
 if(phase==='play'&&feedback===null&&(action==='right'||action==='wrong')){feedback=action==='right';if(feedback)correct++;else missed.push(deck[index]);render();}
 else if(action==='next'&&phase==='play'&&feedback!==null){index++;feedback=null;if(index===deck.length)phase='finish';render();}
}
function bindSwipe(){const card=app.querySelector('#card');let point=null;card.onpointerdown=e=>{if(feedback!==null)return;point={x:e.clientX,y:e.clientY};card.setPointerCapture(e.pointerId);};card.onpointerup=e=>{if(!point)return;const dx=e.clientX-point.x,dy=e.clientY-point.y;point=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.3)act(dx>0?'right':'wrong');};card.onpointercancel=()=>point=null;}
document.addEventListener('keydown',e=>{if(e.repeat||/SELECT|INPUT|BUTTON/.test(e.target.tagName))return;if(phase==='play'&&feedback===null&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();act(e.key==='ArrowRight'?'right':'wrong');}});
render();

