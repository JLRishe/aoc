const { __, compose, map, prop, sum, lt, applySpec, add } = require('ramda');
var _ = require('lodash');
const { repeatUntil, add1 } = require('../shared');

var stepMap = { '(': 1, ')': -1 };

const lineToDeltas = map(prop(__, stepMap));

const p1 = compose(sum, lineToDeltas);

const negFloor = compose(lt(__, 0), prop('floor'));

const p2 = (line) => {
    const deltas = lineToDeltas(line);
    
    const stoppedAt = repeatUntil(
        ({ floor, i }) => ({ floor: add(floor, prop(i, deltas)), i: add1(i) }),
        negFloor,
        { floor: 0, i: 0 }
    );
    
    return stoppedAt.i;
};

module.exports = {
    ps: [p1, p2]
};
