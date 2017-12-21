const { compose, curry, map, split, tail, groupBy, prop, unnest, uniq, last, length } = require('ramda');
const { probe, arrayMap } = require('aoc-helpers');

const splitCompound = compose(
    tail,
    split('|'),
    s => s.replace(/[A-Z][a-z]?|e/g, m => '|' + m)
);

const parseReplacement = compose(
    ([from, to]) => ({ from, to: splitCompound(to) }),
    split(' => '),
);

const parseReplacements = compose(
    map(map(prop('to'))),
    groupBy(prop('from')),
    map(parseReplacement)
);

const parseInput = lines => ({ 
    replacements: parseReplacements(lines.slice(0, lines.length - 2)),
    compound: splitCompound(last(lines))
});

const applyReplacements = curry((replacements, el, i, arr) => map(
    rep => [...arr.slice(0, i), ... rep, ...arr.slice(i + 1)],
    replacements[el] || []
));

const applyAllReplacements = curry((replacements, compound) => compose(
    uniq,
    unnest,
    arrayMap(applyReplacements(replacements))
)(compound));

const p1 = compose(
    length,
    ({ replacements, compound }) => applyAllReplacements(replacements, compound),
    parseInput
);

module.exports = {
    solution: {
        ps: [p1],
        type: 'lines'
    }
};