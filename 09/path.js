var path = 
    (node, subPath, dist) => ({ 
        start: node, 
        sub: subPath, 
        dist: dist + (subPath ? subPath.dist : 0),
        isEmpty: !node
    });

path.empty = path(null, null, 0);

module.exports = path;