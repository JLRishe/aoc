const { compose, map, invoker, join, applySpec, prop, always, split } = require('ramda');
const graph = require('./uniDistanceGraph');
const { minPath, maxPath } = require('./findPaths');

var path = require('./path');

function parseNode(line) {
    const [towns, dist] = split(' = ', line);
    const [from, to] = split(' to ', towns);
    
    return { from, to, dist: Number(dist) };
}

var pathString = p =>
    p.start.name() + 
    (p.sub.isEmpty ? '' : '->\n' + pathString(p.sub));

var resultString = compose(
    join(''),
    applySpec([pathString, always('\nDistance: '), prop('dist')])
);

const findPath = strategy => compose(
    resultString,
    strategy,
    invoker(0, 'nodes'),
    graph,
    map(parseNode)
);

const p1 = findPath(minPath);
const p2 = findPath(maxPath);

module.exports = {
    solution: {
        type: 'lines',
        ps: [p1, p2]
    }
};