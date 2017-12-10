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


module.exports = (lines) => [
    lines.filter(isNice).length,
    lines.filter(isNice2).length
];