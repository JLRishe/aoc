var _ = require('lodash');

function combinations(items) {
    if (!items.length) {
        return [[]];
    }
    var head = items[0],
        sub = combinations(items.slice(1));
    
    return sub.map(p => [].concat(head, p)).concat(sub);
}

module.exports = lines => {
    var okps = combinations(lines.map(Number)).filter(p => _.sum(p) === 150),
        minCount = _.min(okps, p => p.length).length;
      
    return [
        okps.length,
        okps.filter(p => p.length === minCount).length
    ];
};