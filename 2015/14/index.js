const { compose, map, curry, merge, head, last, keys, sortBy, identity, values, length, groupBy, prop, reduce, times, applySpec } = require('ramda');
const { probe, applyPattern, add1 } = require('../shared');

const reindeerPattern = /^([a-zA-z]+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/;

// String -> Reindeer
const parseReindeer = compose(
    ([, name, speed, flyTime, restTime]) => ({ name, speed: Number(speed), flyTime: Number(flyTime), restTime: Number(restTime) }),
    applyPattern(reindeerPattern)
);

// distance of a reinder after <seconds> seconds
// Number -> Reindeer -> Number
const dist = curry((seconds, reindeer) => {
    const phaseLength = reindeer.flyTime + reindeer.restTime;
    
    return Math.floor(seconds / phaseLength) * reindeer.flyTime * reindeer.speed +
           Math.min(seconds % phaseLength, reindeer.flyTime) * reindeer.speed
});

const raceTime = 2503;

// {Number: *} -> Number
const maxKey = compose(last, sortBy(identity), map(Number), keys);

// Number -> [Reindeer] -> [{ winners: [Reindeer], dist: Number }]
const race = curry((seconds, reindeers) => {
    const groups = groupBy(dist(seconds), reindeers);
    const topDist = maxKey(groups);
    
    return { winners: groups[topDist], dist: topDist };
});

// [String] -> Number
const p1 = compose(
    prop('dist'),
    race(raceTime),
    map(parseReindeer)
);

// Returns an array of all winners (with repeats) of each second
// If reindeer A was in the lead during 10 different seconds, it will be in the results 10 times.
// [Reindeer] -> [Reindeer]
const listPointWinners = reindeers => reduce(
    (winners, seconds) => [...winners, ...(race(seconds, reindeers).winners)],
    [],
    times(add1, raceTime)
);

// [Reindeer] -> [{ reindeer: Reindeer, points: Number }]
const pointsRace = compose(
    map(applySpec({ reindeer: head, points: length })),
    values,
    groupBy(prop('name')),
    listPointWinners
);

// [Ord] -> Ord
const listMax = compose(last, sortBy(identity));

// [String] -> Number
const p2 = compose(
    listMax,
    map(prop('points')),
    pointsRace,
    map(parseReindeer)
);

module.exports = {
    solution: {
        type: 'lines',
        ps: [p1, p2]
    }
};