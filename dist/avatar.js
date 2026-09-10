import {DEFAULT_AVATAR} from './progress.js';
const images=new Map(),renders=new WeakMap();
function load(src){if(!images.has(src))images.set(src,new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>{images.delete(src);reject(Error('Portrait art unavailable'));};i.src=src;}));return images.get(src);}
function rgb(hex){return /^#[a-f0-9]{6}$/i.test(hex)?hex.slice(1).match(/../g).map(x=>parseInt(x,16)):[90,90,90];}
// All portraits start with genuine alpha. Recolor material pixels only;
// never infer transparency from white/near-white, which produces matte fringes.
export function recolorPortrait(data,width,options){const a={...DEFAULT_AVATAR,...options},d=data,colors={skin:rgb(a.skin),hair:rgb(a.hairColor),eyes:rgb(a.eyes),shirt:rgb(a.shirt)};
 for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const [r,g,b]=[d[i],d[i+1],d[i+2]],max=Math.max(r,g,b),min=Math.min(r,g,b);if(max-min<26||max<65)continue;let material;
  if(b>r*1.15&&b>g*1.08)material='hair';else if(g>r*1.12&&g>b*1.1)material='eyes';else if(r>b*1.2&&r>g*1.08&&g>b*1.15)material='skin';else if(r>g*1.25&&b>g*1.18)material='shirt';
  if(!material)continue;let shade=.22+.78*max/255;const y=Math.floor(i/4/width),x=i/4%width;
  if(material==='shirt'&&a.style==='stripes'&&Math.floor(y/(width/22))%2===0)shade*=.6;
  if(material==='shirt'&&a.style==='checkers'&&(Math.floor(y/(width/18))+Math.floor(x/(width/18)))%2===0)shade*=.65;
  if(material==='shirt'&&a.style==='jersey'&&Math.abs(x-width/2)<width*.035)shade*=.45;
  colors[material].forEach((v,k)=>d[i+k]=Math.round(v*shade));
 }return d;
}
export async function drawAvatar(canvas,options){const token={};renders.set(canvas,token);const a={...DEFAULT_AVATAR,...options},ctx=canvas.getContext('2d'),size=256;canvas.width=size;canvas.height=size;ctx.imageSmoothingEnabled=false;if(canvas.style)canvas.style.backgroundColor=/^#[a-f0-9]{6}$/i.test(a.backdrop)?a.backdrop:DEFAULT_AVATAR.backdrop;
 try{const hair=Math.max(0,Math.min(5,Math.floor(Number(a.hair)||0))),sprite=await load(hair<3?'./player-heads.png':'./player-heads-extra.png');if(renders.get(canvas)!==token)return;const cell=sprite.width/3;ctx.drawImage(sprite,(hair%3)*cell,0,cell,sprite.height,0,0,size,size);const image=ctx.getImageData(0,0,size,size);recolorPortrait(image.data,size,a);ctx.putImageData(image,0,0);
  if(a.accessory!=='none'){const accessories=await load('./accessories.png');if(renders.get(canvas)!==token)return;const c=accessories.width/3;
   const poses={glasses:[0,.23,.415,.54,.25,.04,.31,.91,.41],headphones:[1,.13,.06,.74,.70,.04,.1,.92,.72],cap:[2,.16,.04,.68,.41,.08,.18,.82,.58]},p=poses[a.accessory];if(p)ctx.drawImage(accessories,(p[0]+p[5])*c,p[6]*accessories.height,p[7]*c,p[8]*accessories.height,p[1]*size,p[2]*size,p[3]*size,p[4]*size);
  }
 }catch{if(renders.get(canvas)!==token)return;ctx.clearRect(0,0,size,size);ctx.fillStyle='#c0defb';ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillText('Portrait loading unavailable',128,120);canvas.title='Could not load your portrait. Your customization and saved progress are safe. Refresh to try again.';}
}

