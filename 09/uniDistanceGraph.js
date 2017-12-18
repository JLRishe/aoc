var graphSegment = (destNode, weight) => ({
    dest: destNode,
    weight: weight
});

function graphNode(name) {
    var segments = [];
    
    function addSegment(dest, weight) {
        segments.push(graphSegment(dest, weight));
    }
    
    function weightTo(dest) {
        var segs = segments.filter(s => s.dest === dest);
        
        if (segs.length === 0) {
            throw new Error('No link found:', name, 'to', dest.name());
        }
        if (segs.length > 1) {
            throw new Error('Multiple links found');
        }
        return segs[0].weight;
    }        
    
    return {
        joinTo: addSegment,
        distanceTo: weightTo,
        name: () => name
    };
}

function bidirectionalWeightedGraph(nodeDefs) {
    var nodes = {};
    
    function getNode(name) {
        var node = nodes[name];
        if (!node) {
            node = graphNode(name);
            nodes[name] = node;
        }
        return node;
    }
    
    function join(source, dest, dist) {
        var s = getNode(source),
            d = getNode(dest);
            
        s.joinTo(d, dist);
        d.joinTo(s, dist);
    }
    
    nodeDefs.forEach(node => join(node.from, node.to, node.dist));
    
    return {
        nodes: () => Object.keys(nodes).map(k => nodes[k])
    };
}

module.exports = bidirectionalWeightedGraph;