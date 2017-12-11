var path = require('./path');
var _ = require('lodash');

var r2 = 
    (p, sub, dist) =>
        p.isEmpty
            ? sub
            : r2(p.sub, path(p.start, sub, dist), p.dist - p.sub.dist);

/**
 * Creates a new path consisting of the reverse of sub and terminating at start
 */
var r = (start, sub, dist) => r2(sub, path(start, path.empty, 0), dist);

var pathPair = 
    (start, sub, dist) => ({ 
        p1: path(start, sub, dist),
        p2: r(start, sub, dist),
        dist: dist + sub.dist
    });

function pathSeek(funcChoose) {
    var choosePath = 
        (p1, p2) => funcChoose(p1.dist, p2.dist) === p1.dist ? p1 : p2;
    
    var select = (arr, choose) => arr.reduce(choose);

    function betterPath(node, target) {
        var d1 = node.distanceTo(target.p1.start),
            d2 = node.distanceTo(target.p2.start),
            choice = funcChoose(d1, d2);
        
        return choice === d1 
            ? pathPair(node, target.p1, d1)
            : pathPair(node, target.p2, d2);
    }

    function findPath(nodes) {
        if (!nodes.length) {
            throw new Error('Empty node list');
        }
        if (nodes.length === 1) {
            return pathPair(nodes[0], path.empty, 0);
        }
    
        var paths = nodes.map(n => betterPath(n, findPath(_.reject(nodes, n))));
    
        return select(paths, choosePath);
    }

    return {
        findPath: nodes => findPath(nodes).p1
    };
}

var minPathSeek = pathSeek((l, r) => l <= r ? l : r),
    maxPathSeek = pathSeek((l, r) => l >= r ? l : r);

module.exports = {
    minPath: minPathSeek.findPath,
    maxPath: maxPathSeek.findPath
};
    