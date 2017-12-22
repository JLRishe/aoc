const { compose, curry, map, filter, aperture, equals, split, tail, groupBy, prop, unnest, uniq, last, length, contains, find, reduce, concat, any, startsWith, merge, reduceRight, endsWith, head, memoizeWith } = require('ramda');
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

const bulkApplyReplacements = curry((replacements, compounds) => compose(
    c => (probe(c.length),c),
    uniq,
    unnest,
    map(applyAllReplacements(replacements))
)(compounds));

// ReduceState is { replacements: [Replacement], current: [Element], parent: ReduceState, steps: Number }

const findMatch = (compound, replacements) => find(r => equals(compound, r.to), replacements);

const windows = memoizeWith(
    (l, c) => l + c.join(''),
    compose(enumerate, aperture)
);

const isMatch = memoizeWith(
    ({ to }, [, seg]) => to.join('') + '+' + seg.join(''),
    ({ to }, [, seg]) => equals(to, seg)
);

const findPossibleReplacements = curry((compound, replacement) => compose(
    map(([pos]) => ({ pos, replacement })),
    filter(x => isMatch(replacement, x)),
    c => windows(replacement.to.length, c)
)(compound))

const findApplicableReplacements = (replacements, compound) => compose(
    unnest,
    map(findPossibleReplacements(compound))
)(replacements);

const applyReplacement = curry((compound, { pos, replacement }) => 
    [...compound.slice(0, pos), replacement.from, ...compound.slice(pos + replacement.to.length)]
);

let ct = 0;

const search = curry((replacements, steps, compound) => {
    if (++ct % 1000 === 0) {
        console.log(ct);
    }
    if (equals(['e'], compound)) {
        return steps;
    }
    if (contains('e', compound)) {
        return -1;
    }
    
    const rs = findApplicableReplacements(replacements, compound);
    
    const applyAndSearch = compose(search(replacements, steps + 1), applyReplacement(compound));
    const goodOne = find(r => applyAndSearch(r) >= 0, rs);
    
    return goodOne
        ? applyAndSearch(goodOne)
        : -1;
});

const update = (state, { steps, element }) => {
    const newState = merge(state, { steps: steps + state.steps, current: concat(state.current, element) });
    const match = findMatch(newState.current, newState.replacements);
    if (match) {
        return update(newState.parent, { steps: newState.steps + 1, element: match.from });
    }
    return newState;
}

const processElement = (state, nextEl) => {
    const { replacements, current, parent, steps, depth } = state;
    const withNext = concat([nextEl], current);
    console.log('current', current, 'withNext', withNext, 'depth', depth);
    const match = findMatch(withNext, replacements);
    if (match) {
        console.log(match.to, '=>', match.from);
        const updatedParent = merge(parent, { steps: parent.steps + steps + 1 });
        return processElement(updatedParent, match.from);
    }
    if (any(r => endsWith(withNext, r.to), replacements)) {
        return merge(state, { current: withNext });
    }
    return { replacements, current:[nextEl], parent: state, steps: 0, depth: depth + 1 };
};

const parseElements = (replacements, compound) => reduceRight(
    (el, s) => { console.log('Process', el); return processElement(s, el); },
    { replacements, current: [], parent: { replacements, current: [], parent: null, steps: 0 }, steps: 0, depth: 0 },
    compound
);

/*const p2 = lines => {
    const { replacements, compound } = parseInput(lines);
    const result = search(replacements, 0, compound);
    
    return result;
};*/

const p2 = lines => {
    const { replacements, compound } = parseInput(lines);
    let c = 0;
    let cmp = compound.join('');
    
    while (cmp !== 'e') {
        for (var i = 0; i < replacements.length; i += 1) {
            let r = replacements[i];
            if (cmp.indexOf(r.to.join('')) !== -1) {
                cmp = cmp.replace(r.to.join(''), r.from);
                c += 1;
            }
        }
    }
    
    return c;
}

module.exports = {
    solution: {
        ps: [/*p1, */p2],
        type: 'lines'
    }
    , applyReplacement
    , findApplicableReplacements
};