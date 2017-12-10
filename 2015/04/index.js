const { __, curry } = require('ramda');
var util = require('../shared/util');
const md5 = require('blueimp-md5');

var startsWith = (value, prefix) => value.indexOf(prefix) === 0;
var isMatch = (input, prefix) => startsWith(md5(input), prefix);
var findPrefixMatch = curry((key, prefix) => util.countLoops(i => !isMatch(key + i, prefix)));

const p1 = findPrefixMatch(__, '00000');

const p2 = findPrefixMatch(__, '000000');

module.exports = {
    ps: [p1, p2]
};