var _ = require('lodash');

var map = { '(': 1, ')': -1 };

module.exports = (input) => {
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
};