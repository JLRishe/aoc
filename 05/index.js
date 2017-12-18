const { compose, filter, length } = require('ramda');
var util = require('../shared/util');
var _ = require('lodash');
var testString = util.testString;

var hasEnoughVowels = str => str.length - str.replace(/[aeiou]/g, '').length >= 3;
var hasRun = str => testString(str, ch => ch(0) === ch(1), 2);
var hasBadStrings = str => /ab|cd|pq|xy/.test(str);

var isNice = str => hasEnoughVowels(str) && hasRun(str) && !hasBadStrings(str);


var hasRepeatedPair = str => 
    testString(
        str, 
        (ch, rem) => _.includes(rem.substring(2), rem.substring(0, 2))
    );
var hasSeparatedDuplicate = str => testString(str, ch => ch(0) === ch(2));

var isNice2 = str => hasRepeatedPair(str) && hasSeparatedDuplicate(str);

const countMatches = pred => compose(length, filter(pred));

const p1 = countMatches(isNice);
const p2 = countMatches(isNice2);

module.exports = {
    solution: {
        type: 'lines',
        ps: [p1, p2]
    }
};