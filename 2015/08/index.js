const { compose, map, sum } = require('ramda');
const { applySpec, filter } = require('ramda');
var _ = require('lodash');

// String -> String
const literalToValue = l => JSON.parse(l.replace(/\\x([a-f0-9]{2})/g, '\\u00$1'));
        
// String -> Number
const sizeDifference = literal => literal.length - literalToValue(literal).length;

// String -> String
const valueToLiteral = v => JSON.stringify(v);

// String -> Number
const reverseSizeDifference = value => valueToLiteral(value).length - value.length;

const totalSizeDifferences = f => xs => sum(map(f, xs));

// [String] -> Number
const p1 = totalSizeDifferences(sizeDifference);

// [String] -> Number
const p2 = totalSizeDifferences(reverseSizeDifference);

module.exports = {
    solution: {
        type: 'lines',
        ps: [p1, p2]
    }
};