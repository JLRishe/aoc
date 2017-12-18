const { __, compose, map, reduce, reduceWhile, curry, repeat, length, sum, applySpec, join, prop, concat, equals, takeWhile, head, identity, memoizeWith } = require('ramda');
var util = require('../shared/util');
const { add1, applyPattern } = require('../shared');

// String -> String -> Number
const findRun = (ch, str) => compose(
    length,
    head,
    applyPattern(new RegExp(`^${ch}*`))
)(str);

// String -> [{count: Number, char: String}]
function getRuns(str) {
    var runs = [],
        ch;
    
    while (str.length) {
        ch = str[0];
        const runLength = findRun(ch, str);
        runs.push({ count: runLength, char: ch});
        str = str.substring(runLength);
    }
    
    return runs;
}

// { count: Number, char: String }
const combineRun = compose(
    join(''),
    applySpec([prop('count'), prop('char')])
);

// String -> String
const lookAndSay = compose(
    join(''),
    map(combineRun),
    getRuns
);

// Number -> String -> Number
const runLookAndSay = times => compose(
    length,
    reduce(lookAndSay, __, repeat(0, times))
);

const p1 = runLookAndSay(40);
const p2 = runLookAndSay(50);

module.exports = {
    solution: {
        type: 'input',
        ps: [p1, p2]
    }
};