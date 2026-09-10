export class GameAudio{
 constructor(storage,{contextFactory=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),fetcher=url=>fetch(url)}={}){
  this.storage=storage;this.contextFactory=contextFactory;this.fetcher=fetcher;this.prefs={music:false,effects:true};this.buffers=new Map();this.sources=new Set();this.active=false;this.scene=null;this.generation=0;this.lastTick=null;
  try{const p=JSON.parse(storage.getItem('star-quest.audio.v1'));if(p)for(const key of ['music','effects'])if(typeof p[key]==='boolean')this.prefs[key]=p[key];}catch{}
 }
 async unlock(){try{this.context??=this.contextFactory();await this.context.resume();return true;}catch{return false;}}
 async buffer(name){if(!this.buffers.has(name))this.buffers.set(name,this.fetcher('./audio/'+name+'.wav').then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.arrayBuffer();}).then(b=>this.context.decodeAudioData(b)).catch(()=>{this.buffers.delete(name);return null;}));return this.buffers.get(name);}
 async play(name,music=false){const generation=this.generation;if(!this.context||(!music&&!this.prefs.effects)||(music&&(!this.prefs.music||!this.active)))return;const buffer=await this.buffer(name);if(!buffer||generation!==this.generation||(!music&&!this.prefs.effects)||(music&&(!this.prefs.music||!this.active||this.musicSource)))return;
  try{const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;source.loop=music;gain.gain.value=music?.32:.55;source.connect(gain);gain.connect(this.context.destination);source.onended=()=>{this.sources.delete(source);source.disconnect();gain.disconnect();};this.sources.add(source);if(music)this.musicSource=source;source.start();}catch{}
 }
 stop(){this.generation++;this.active=false;this.lastTick=null;for(const source of this.sources)try{source.stop();}catch{}this.sources.clear();this.musicSource=null;}
 async start(){this.stop();this.scene='game';this.active=true;const generation=this.generation;if(await this.unlock()){if(generation!==this.generation||!this.active)return;this.play('start');this.play('starlight-loop',true);}}
 finish(expired){this.stop();this.menu();this.play(expired?'finish':'clear');}
 async menu(){if(this.scene==='menu'&&this.active)return;this.stop();this.scene='menu';this.active=true;const generation=this.generation;if(await this.unlock())if(generation===this.generation)this.play('starway-menu',true);}
 tick(seconds){if(this.active&&seconds>=1&&seconds<=10&&seconds!==this.lastTick){this.lastTick=seconds;this.play('tick');}}
 set(key,value){if(!['music','effects'].includes(key))return;this.prefs[key]=!!value;try{this.storage.setItem('star-quest.audio.v1',JSON.stringify(this.prefs));}catch{}
  if(key==='music'&&!value&&this.musicSource){try{this.musicSource.stop();}catch{}this.sources.delete(this.musicSource);this.musicSource=null;}
  if(key==='effects'&&!value)for(const source of this.sources)if(source!==this.musicSource)try{source.stop();}catch{}
  if(value)this.unlock().then(ok=>{if(ok){if(key==='music'){if(!this.active){this.active=true;this.scene='menu';}this.play(this.scene==='game'?'starlight-loop':'starway-menu',true);}else this.play('correct');}});
 }
 suspend(){try{this.context?.suspend();}catch{}}
 resume(){this.context?.resume().catch(()=>{});}
}

