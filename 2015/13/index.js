const ramda = require('ramda');
const { __, compose, prop, ifElse, map, applySpec, identity, always, indexBy, keys, mathMod, merge, reduce, sum } = ramda;
const { last, sortBy, without, isEmpty, groupBy } = ramda;
var _ = require('lodash');
const { probe, applyPattern } = require('../shared');

// String -> String -> Number
const calcChange = (amountStr, type) => Number(amountStr) * (type === 'gain' ? 1 : -1);

// String -> { person: String, neighbor: String, change: Number }
const parseHappiness = compose(
    ([, person, change, amount, neighbor]) => ({ person, neighbor, change: calcChange(amount, change) }),
    applyPattern(/^([a-zA-Z]+) would (gain|lose) (\d+) happiness units by sitting next to ([a-zA-Z]+)\.$/)
);

// [String] -> { String: { String: Number } }
const personMap = compose(
    map(map(prop('change'))),
    map(indexBy(prop('neighbor'))),
    groupBy(prop('person')),
    map(parseHappiness)
);

// [String] -> Number -> Number
const nameAt = (seats, pos, offset) => seats[mathMod(pos + offset, seats.length)];

// [String] -> { String: Number } -> Number
const seatValue = (seats, person, i) => compose(
    sum,
    map(offset => person[nameAt(seats, i, offset)])
)([-1, 1]);

// [String] -> PersonMap -> Number
const arrangementValue = (seats, people) => seats.reduce(
    (total, name, i) => seatValue(seats, people[name], i) + total,
    0
);

// [String] -> PersonMap -> { seats: [String], value: Number }
const arrangement = (seats, people) => ({ seats, value: arrangementValue(seats, people) });

// { soFar: [String], people: PersonMap, names: [String] } -> [Arrangement]
const maxArrangements = ({ soFar, people, names }) =>
    map(p => findMaxArrangementStep({ people, soFar: [...soFar, p], names: without([p], names) }), names);

// { soFar: [String], people: PersonMap, names: [String] } -> Arrangement
const findMaxArrangementStep = ifElse(
    compose(isEmpty, prop('names')),
    ({ soFar, people }) => arrangement(soFar, people),
    compose(
        last,
        sortBy(prop('value')),
        maxArrangements
    )
);

// PersonMap -> Arrangement
const findMaxArrangement = compose(
    findMaxArrangementStep,
    applySpec({ people: identity, soFar: always([]), names: keys })
);

// [String] -> Arrangement
const p1 = compose(
    findMaxArrangement,
    personMap
);

// PersonMap -> PersonMap
const insertSelf = people => compose(
    merge(__, { Me: map(always(0), people) }),
    map(merge(__, { Me: 0 }))
)(people);

// [String] -> Arrangement
const p2 = compose(
    findMaxArrangement,
    insertSelf,
    personMap
);
                    
module.exports = {
    solution: {
        type: 'lines',
        ps: [p1, p2]
    }
};