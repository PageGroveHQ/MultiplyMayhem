import {test} from 'node:test';import assert from 'node:assert/strict';import{makeDeck,explanation}from'../dist/engine.js';
test('full suite contains every ordered pair from 0×0 through 9×9 once',()=>{const d=makeDeck([0,1,2,3,4,5,6,7,8,9]);assert.equal(d.length,100);assert.equal(new Set(d.map(x=>`${x.a},${x.b}`)).size,100);for(let a=0;a<=9;a++)for(let b=0;b<=9;b++)assert.ok(d.some(x=>x.a===a&&x.b===b));});
test('single table covers all ten partners',()=>{const d=makeDeck([6]);assert.equal(d.length,10);assert.ok(d.every(x=>x.a===6));assert.deepEqual(d.map(x=>x.b).sort(),[0,1,2,3,4,5,6,7,8,9]);});
test('odd and even table decks retain all partners',()=>{for(const tables of [[1,3,5,7,9],[0,2,4,6,8]]){const d=makeDeck(tables);assert.equal(d.length,50);assert.ok(d.every(x=>tables.includes(x.a)));}});
test('corrections teach repeated addition and zero',()=>{assert.equal(explanation(5,5),'5 + 5 + 5 + 5 + 5 = 25');assert.match(explanation(0,9),/answer is 0/);assert.match(explanation(9,0),/zero/);});

