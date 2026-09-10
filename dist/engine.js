export const MAX_FACTOR = 9;
export function makeDeck(tables, random = Math.random) {
 const deck = tables.flatMap(a => Array.from({length: MAX_FACTOR + 1}, (_, b) => ({a,b})));
 for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];} return deck;
}
export function explanation(a,b){return a===0 ? `Zero groups of ${b} means there is nothing to add. The answer is 0.` : b===0 ? `${a} groups of zero still makes zero!` : `${Array(a).fill(b).join(' + ')} = ${a*b}`;}

