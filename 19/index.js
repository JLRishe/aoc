const { __, compose, curry, map, filter, aperture, equals, split, tail, groupBy, prop, unnest, uniq, last, length, contains, find, reduce, concat, any, startsWith, merge, reduceRight, endsWith, head, memoizeWith } = require('ramda');
const { probe, arrayMap, enumerate } = require('aoc-helpers');
const { genTransform, genFilter, genHead } = require('func-generators');

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
    map(parseReplacement)
);

const parseInput = lines => ({ 
    replacements: parseReplacements(lines.slice(0, lines.length - 2)),
    compound: splitCompound(last(lines))
});

const applyReplacements = curry((compound, replacement) => compose(
    map(([i]) => [...compound.slice(0, i), ...replacement.to, ...compound.slice(i + 1)]),
    filter(([,seg]) => equals([replacement.from], seg)),
    enumerate,
    aperture(1)
)(compound));

const applyAllReplacements = curry((replacements, compound) => compose(
    uniq,
    unnest,
    map(applyReplacements(compound)),
)(replacements));

const p1 = compose(
    length,
    ({ replacements, compound }) => applyAllReplacements(replacements, compound),
    parseInput
);

const applyReplacement = curry((compound, { pos, replacement }) => 
    [...compound.slice(0, pos), replacement.from, ...compound.slice(pos + replacement.to.length)]
);

const tryApplyReplacement = (st, r) => st.cmp.indexOf(r.to.join('')) !== -1
    ? { c: st.c + 1, cmp: st.cmp.replace(r.to.join(''), r.from) }
    : st;

const replacer = ({ replacements, compound }) => genTransform(
    reduce(tryApplyReplacement, __, replacements),
    { c: 0, cmp: compound.join('') }
);

const p2 = compose(
    prop('c'),
    genHead,
    genFilter(s => s.cmp === 'e'),
    replacer,
    parseInput
);

module.exports = {
    solution: {
        ps: [p1, p2],
        type: 'lines'
    }
    , applyReplacement
};