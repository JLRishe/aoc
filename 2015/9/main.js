var util = require('../shared/util');

var graph = require('./uniDistanceGraph');
var findPaths = require('./findPaths');

var path = require('./path');

function parseNode(line) {
    var townsDist = line.split(' = '),
        towns = townsDist[0].split(' to ');
    
    return {
        from: towns[0],
        to: towns[1],
        dist: parseInt(townsDist[1])
    };
}

var pathString = p =>
    p.start.name() + 
    (p.sub.isEmpty ? '' : '->\n' + pathString(p.sub));

var resultString = path => pathString(path) + '\nDistance: ' + path.dist;

module.exports = lines => {
    var g = graph(lines.map(parseNode)),
        nodes = g.nodes();
        
    return [
        resultString(findPaths.minPath(nodes)),
        resultString(findPaths.maxPath(nodes))
    ];
};