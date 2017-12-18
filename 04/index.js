const { __, curry, compose, prop } = require('ramda');
const { genInfinite, genFilter, genMap, genHead } = require('func-generators');
const md5 = require('blueimp-md5');

// String -> Generator { i: Number, hash: String }
const hashes = key => genMap(i => ({ i, hash: md5(key + i) }), genInfinite);

// String -> String -> Boolean
const startsWith = (value, prefix) => value.indexOf(prefix) === 0;

// String -> String -> Number
const findPrefixMatch = curry((prefix, key) => compose(
    prop('i'),
    genHead,
    genFilter(h => startsWith(h.hash, prefix))
)(hashes(key)));

// String -> Number
const p1 = findPrefixMatch('00000');

// String -> Number
const p2 = findPrefixMatch('000000');

module.exports = {
    solution: {
        ps: [p1, p2]
    }
};