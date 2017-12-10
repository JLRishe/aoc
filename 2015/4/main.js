var util = require('../shared/util');
var md5 = require('blueimp-md5').md5;

var startsWith = (value, prefix) => value.indexOf(prefix) === 0;
var isMatch = (input, prefix) => startsWith(md5(input), prefix);
var findPrefixMatch = (key, prefix) => util.countLoops(i => !isMatch(key + i, prefix));

var key = 'iwrupvqb';

module.exports = () => [
    findPrefixMatch(key, '00000'),
    findPrefixMatch(key, '000000')
];