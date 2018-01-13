const day = '25';

const assert = require('assert');
const { ps, next, valueAt, parseLine } = require(`../${day}`);
const [p1, p2] = ps;

describe(`day ${day}`, () => {
    it('should calculate next value', () => {
        assert.deepEqual(next({ x: 2, y: 3, current: 8057251 }), { x: 3, y: 2, current: 16929656 });
        assert.deepEqual(next({ x: 4, y: 1, current: 30943339 }), { x: 1, y: 5, current: 77061 });
    });
    
    it('should find value at certain place', () => {
        assert.equal(valueAt({ x: 2, y: 4 }), 32451966);
        assert.equal(valueAt({ x: 1, y: 6 }), 33071741);
    });
    
    it('should parse the line', () => {
        assert.deepEqual(parseLine('To continue, please consult the code grid in the manual.  Enter the code at row 555, column 444.'), { x: 444, y: 555 });
    });
    
    it('should work on samples for p1', () => {
        assert.equal(p1('To continue, please consult the code grid in the manual.  Enter the code at row 5, column 4.'), 6899651);
    });
});