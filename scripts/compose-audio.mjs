// Original Star Quest composition. No samples or external melodies.
import fs from 'node:fs';
const rate=22050,root=new URL('../dist/audio/',import.meta.url);fs.mkdirSync(root,{recursive:true});
const freq=n=>440*2**((n-69)/12);
function track(seconds){return new Float64Array(Math.ceil(seconds*rate));}
function note(out,at,length,n,level=.12,wave='pulse'){
 const start=Math.floor(at*rate),count=Math.floor(length*rate),f=freq(n);
 for(let i=0;i<count&&start+i<out.length;i++){const t=i/rate,p=(t*f)%1,e=Math.min(1,t/.008)*Math.min(1,(length-t)/.045),v=wave==='triangle'?1-4*Math.abs(p-.5):wave==='sine'?Math.sin(t*f*2*Math.PI):(p<.3?1:-.4286);out[start+i]+=v*level*e;}
}
function save(name,out){let peak=0;for(const v of out)peak=Math.max(peak,Math.abs(v));const gain=peak>.78?.78/peak:1,b=Buffer.alloc(44+out.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(out.length*2,40);for(let i=0;i<out.length;i++)b.writeInt16LE(Math.round(out[i]*gain*32767),44+i*2);fs.writeFileSync(new URL(name+'.wav',root),b);console.log(name,`${(out.length/rate).toFixed(2)}s`,{peak:peak*gain});}
// 16 bars, 120 BPM: a gentle space-flight motif, bass, arpeggio and soft percussion.
const music=track(32),chords=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],melodies=[[76,72,69,72,79,76,72,71],[72,69,65,69,76,72,69,67],[79,76,72,76,81,79,76,74],[74,71,67,71,79,74,71,69]];
for(let bar=0;bar<16;bar++){const chord=chords[bar%4],melody=melodies[bar%4];for(let step=0;step<8;step++){const at=bar*2+step*.25;note(music,at,.19,chord[step%3]+12,.045,'triangle');if(step%2===0)note(music,at,.35,chord[0]-12,.13,'triangle');if(bar<8||step%2===0)note(music,at,.21,melody[(step+(bar>=8?2:0))%8],.07);if(step%2===0)note(music,at,.06,step%4===0?36:48,.075,'sine');}}
// Exact bar boundary with short click-free fade; loops without a trailing silence.
for(let i=0;i<music.length;i++)music[i]*=Math.min(1,i/220,(music.length-1-i)/220);save('starlight-loop',music);
for(const [name,notes,length] of [['start',[60,64,67,72],.75],['correct',[76,81],.3],['learn',[67,72],.38],['finish',[72,67,64,60],1],['clear',[60,64,67,72,79],1.1]]){const out=track(length);notes.forEach((n,i)=>note(out,i*.12,.22,n,.2,'triangle'));save(name,out);}
const tick=track(.09);note(tick,0,.075,84,.12,'sine');save('tick',tick);

// Menu: an original slower, floating 8-bar motif (90 BPM), separate from flight music.
const menu=track(64/3),menuChords=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]];
for(let bar=0;bar<8;bar++){const chord=menuChords[bar%4];for(let beat=0;beat<4;beat++){const at=(bar*4+beat)*2/3;note(menu,at,.58,chord[beat%3]+12,.065,'triangle');if(beat%2===0){note(menu,at,1.15,chord[0]-12,.095,'sine');note(menu,at,.8,chord[(beat+bar)%3]+24,.035,'triangle');}}}
for(let i=0;i<menu.length;i++)menu[i]*=Math.min(1,i/220,(menu.length-1-i)/220);save('starway-menu',menu);

