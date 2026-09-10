import {DEFAULT_AVATAR} from './progress.js';
const images=new Map();
const renders=new WeakMap();
function load(src){if(!images.has(src))images.set(src,new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;}));return images.get(src);}
function rgb(hex){return /^#[a-f0-9]{6}$/i.test(hex)?hex.slice(1).match(/../g).map(x=>parseInt(x,16)):[90,90,90];}
export async function drawAvatar(canvas,options){
 const token={};renders.set(canvas,token);
 const a={...DEFAULT_AVATAR,...options},ctx=canvas.getContext('2d');canvas.width=192;canvas.height=192;ctx.imageSmoothingEnabled=false;
 try{const sprite=await load('./avatar-heads.png');if(renders.get(canvas)!==token)return;const width=sprite.width/3;ctx.drawImage(sprite,Math.max(0,Math.min(2,a.hair))*width,0,width,sprite.height,0,0,192,192);
  const data=ctx.getImageData(0,0,192,192),d=data.data,colors={skin:rgb(a.skin),hair:rgb(a.hairColor),eyes:rgb(a.eyes),shirt:rgb(a.shirt)};
  // Remove only the edge-connected backdrop, preserving the whites of the eyes.
  const pending=[],seen=new Uint8Array(192*192);
  for(let n=0;n<192;n++)pending.push(n,191*192+n,n*192,n*192+191);
  while(pending.length){const p=pending.pop();if(seen[p])continue;seen[p]=1;const i=p*4;if(Math.min(d[i],d[i+1],d[i+2])<220)continue;d[i+3]=0;const x=p%192,y=Math.floor(p/192);if(x)pending.push(p-1);if(x<191)pending.push(p+1);if(y)pending.push(p-192);if(y<191)pending.push(p+192);}
  for(let i=0;i<d.length;i+=4){const [r,g,b]=[d[i],d[i+1],d[i+2]],max=Math.max(r,g,b),min=Math.min(r,g,b);let key;
   if(!d[i+3]||max-min<24||max<80)continue;
   if(b>r*1.15&&b>g*1.08)key='hair';else if(g>r*1.12&&g>b*1.1)key='eyes';else if(r>b*1.2&&r>g*1.08&&g>b*1.15)key='skin';else if(r>g*1.25&&b>g*1.18)key='shirt';
   if(key){let shade=.45+.55*(max/255);const y=Math.floor(i/4/192),x=i/4%192;if(key==='shirt'&&a.style==='stripes'&&Math.floor(y/8)%2===0)shade*=.6;if(key==='shirt'&&a.style==='checkers'&&(Math.floor(y/9)+Math.floor(x/9))%2===0)shade*=.65;colors[key].forEach((v,k)=>d[i+k]=Math.round(v*shade));}}
  ctx.putImageData(data,0,0);
  if(a.accessory!=='none'){const accessories=await load('./accessories.png');if(renders.get(canvas)!==token)return;const cell=accessories.width/3;const specs={glasses:[0,37,80,117,52,.04,.31,.91,.41],headphones:[1,15,-5,165,147,.04,.1,.92,.72],cap:[2,26,-1,144,83,.08,.18,.82,.58]},p=specs[a.accessory];if(p)ctx.drawImage(accessories,(p[0]+p[5])*cell,p[6]*accessories.height,p[7]*cell,p[8]*accessories.height,p[1],p[2],p[3],p[4]);}
 }catch{ctx.fillStyle='#bdadff';ctx.font='bold 72px system-ui';ctx.textAlign='center';ctx.fillText('✦',96,120);canvas.title='Avatar artwork is unavailable. Your choices are still saved.';}
}

