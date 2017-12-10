const { __, compose, map, prop, sum } = require('ramda');
var _ = require('lodash');

var stepMap = { '(': 1, ')': -1 };

const lineToDeltas = map(prop(__, stepMap));

const p1 = compose(sum, lineToDeltas);

module.exports = {
    ps: [p1]
};/*(input) => {
    var deltas = _.map(input, step => map[step]);

    // first answer        
    var finished = _.sum(deltas);
    
    // second answer
    var basementStep = deltas.reduce((last, next, i) => 
        typeof last === 'string'
            ? last 
            : last < 0 
                ? i.toString() 
                : last + next
    );
    
    return [finished, basementStep];
};*/