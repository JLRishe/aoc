const day = '22';
const dayPath = `../${day}`;

const assert = require('assert');
const { prepare } = require('aoc-runner');
const dayContents = require(dayPath);
const [p1, p2] = prepare(dayContents);

describe(`day ${day}`, () => {
    xit('should work on samples for p1', () => {
        throw new Error('not implemented');
    });
    
    xit('should work on samples for p2', () => {
        throw new Error('not implemented');
    });
});