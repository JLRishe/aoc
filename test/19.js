const day = '19';
const dayPath = `../${day}`;

const assert = require('assert');
const { prepare } = require('aoc-runner');
const dayContents = require(dayPath);
const [/*p1, */p2] = prepare(dayContents);
const { applyReplacement } = dayContents;

describe(`day ${day}`, () => {
    const sampleInput = 
`e => H
e => O
H => HO
H => OH
O => HH

HOHOHO`;

    const sampleCompound = ['H', 'O', 'H', 'O', 'H', 'O'];
    
    it('should work on samples for p1', () => {
        throw new Error('not implemented');
    });
    
    it('should apply replacements', () => {
        assert.deepEqual(
            applyReplacement(sampleCompound, { pos: 2, replacement: { from: 'H', to: ['H', 'O'] } }),
            ['H', 'O', 'H', 'H', 'O']
        );
    });
    
    it('should work on samples for p2', () => {
        assert.equal(p2(sampleInput), 6);
    }).timeout(30000);
});