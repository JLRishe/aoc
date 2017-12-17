var util = require('../shared/util');
var _ = require('lodash');

function parseSue(line) {
    var parts1 = /^Sue (\d+): (.+)$/.exec(line),
        parts2 = parts1[2]
            .split(', ')
            .map(part => /([a-z]+): (\d+)/.exec(part))
            .map(part => [part[1], Number(part[2])]);

    return {
        num: Number(parts1[1]),
        items: _.zipObject(parts2)
    };
}

var isMatch = 
    (sue, items, itemMatcher) =>
        Object.keys(sue.items).every(k => itemMatcher(sue.items[k], items[k], k));

function newMatcher(sueValue, foundValue, item) {
    switch (item) {
        case 'cats':
        case 'trees': 
            return sueValue > foundValue;
        case 'pomeranians':
        case 'goldfish':
            return sueValue < foundValue;
        default:
            return sueValue === foundValue;
    }
}

module.exports = (lines) => {
    var sues = lines.map(parseSue);
    
    var itemsDetected = {
        children: 3,
        cats: 7,
        samoyeds: 2,
        pomeranians: 3,
        akitas: 0,
        vizslas: 0,
        goldfish: 5,
        trees: 3,
        cars: 2,
        perfumes: 1
    };

    // first answer    
    var sue1 = sues.find(s => isMatch(s, itemsDetected, (sueValue, itemValue) => sueValue === itemValue));
    
    // second answer
    var sue2 = sues.find(s => isMatch(s, itemsDetected, newMatcher));
    
    return [sue1, sue2];
};