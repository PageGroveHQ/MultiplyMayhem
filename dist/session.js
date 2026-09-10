export class Session{
 constructor(cards){this.queue=cards.map(c=>({...c,retry:false}));this.position=0;this.answers=[];this.feedback=null;this.snapshots=[];}
 get card(){return this.queue[this.position];}
 get complete(){return this.position>=this.queue.length;}
 get stars(){return this.answers.filter(x=>x.ok).length+(this.feedback===true?1:0);}
 mark(ok){if(this.complete||this.feedback!==null)return;this.feedback=ok;}
 next(){if(this.feedback===null||this.complete)return;this.snapshots.push({queue:[...this.queue],position:this.position,answers:[...this.answers]});const card=this.card;this.answers.push({...card,ok:this.feedback});if(!this.feedback&&!card.retry)this.queue.splice(Math.min(this.position+4,this.queue.length),0,{a:card.a,b:card.b,retry:true});this.position++;this.feedback=null;}
 undo(){if(this.feedback!==null){this.feedback=null;return;}const prev=this.snapshots.pop();if(prev){this.queue=prev.queue;this.position=prev.position;this.answers=prev.answers;}}
}

