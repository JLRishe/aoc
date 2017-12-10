const { compose, map, sum } = require('ramda');
var _ = require('lodash');

var literalToValue = 
    literal => literal
        .replace(/^"|"$/g, '')
        .replace(/\\"|\\x[\da-f][\da-f]|\\\\/g, function (match) {
            if (match === '\\\\') {
                return '\\';
            }
            if (match === '\\"') {
                return '"';
            }
            return String.fromCharCode(parseInt(match.substring(2), 16));
        });
        
var sizeDifference = literal => literal.length - literalToValue(literal).length;

var valueToLiteral = 
    value => '"' + value.replace(/["\\]/g, match => '\\' + match) + '"';

var reverseSizeDifference = value => valueToLiteral(value).length - value.length;

const p1 = compose(sum, map(sizeDifference));
const p2 = compose(sum, map(reverseSizeDifference));

module.exports = {
    ps: [p1, p2]
};