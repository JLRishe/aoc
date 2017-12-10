const { __, compose, map, filter, curry, prop, drop, equals } = require('ramda');
const { applyPattern, probe, repeatUntil } = require('../shared');

const next = ({ x, y, current }) => ({
    x:       y === 1 ?     1 : x + 1,
    y:       y === 1 ? x + 1 : y - 1,
    current: current * 252533 % 33554393
});

const atCoords = curry(({ x: targX, y: targY }, { x, y }) => x === targX && y === targY);

const valueAt = coords => compose(prop('current'), repeatUntil(next, atCoords(coords)))({ x: 1, y: 1, current: 20151125 });

const parseLine = compose(
    ([, y, x]) => ({ x, y }),
    map(Number),
    applyPattern(/(\d+), column (\d+)/)
);

const p1 = compose(valueAt, parseLine);

const p2 = () => 0;

module.exports = {
    ps: [p1, p2]
    , next
    , valueAt
    , parseLine
};